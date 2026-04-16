#!/usr/bin/env node
// sync-from-seed.mjs
// Compare the daangn-ai snapshot against upstream seed-design and report differences.
// This script does NOT auto-apply changes — it emits a diff report for human review,
// because human-first → AI-first translation requires judgment.
//
// Usage:
//   node scripts/sync-from-seed.mjs [--upstream <path|url>] [--json]
//
// By default clones upstream to /tmp/seed-design-sync (shallow) and compares
// token JSONs + component yaml spec names.

import { spawnSync } from "node:child_process";
import { readFileSync, existsSync, readdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SKILL_ROOT = resolve(__dirname, "..");
const SNAPSHOT = JSON.parse(readFileSync(join(SKILL_ROOT, "references/_snapshot.json"), "utf8"));

const args = process.argv.slice(2);
const jsonOut = args.includes("--json");
const upstreamArg = args[args.indexOf("--upstream") + 1] !== "--upstream"
  ? args[args.indexOf("--upstream") + 1]
  : null;

const TMP = "/tmp/seed-design-sync";
const UPSTREAM = upstreamArg ?? TMP;

function log(...a) { if (!jsonOut) console.error(...a); }

function cloneUpstream() {
  if (upstreamArg && existsSync(upstreamArg)) return upstreamArg;
  if (existsSync(TMP)) rmSync(TMP, { recursive: true, force: true });
  log(`Cloning ${SNAPSHOT.upstream} → ${TMP} (shallow)`);
  const result = spawnSync("git", ["clone", "--depth", "1", SNAPSHOT.upstream, TMP], {
    stdio: jsonOut ? "ignore" : "inherit",
  });
  if (result.status !== 0) {
    console.error("clone failed");
    process.exit(2);
  }
  return TMP;
}

function currentUpstreamSha(path) {
  const r = spawnSync("git", ["-C", path, "rev-parse", "HEAD"], { encoding: "utf8" });
  return r.status === 0 ? r.stdout.trim() : null;
}

function diffTokens(upstreamRoot) {
  const report = {};
  const localDir = join(SKILL_ROOT, "references/tokens");
  const upstreamDir = join(upstreamRoot, "docs/public/rootage");
  if (!existsSync(upstreamDir)) {
    return { error: `upstream rootage missing: ${upstreamDir}` };
  }

  const jsons = readdirSync(localDir).filter((f) => f.endsWith(".json") && f !== "_snapshot.json");
  for (const file of jsons) {
    const local = readFileSync(join(localDir, file), "utf8");
    const upstreamPath = join(upstreamDir, file);
    if (!existsSync(upstreamPath)) {
      report[file] = { status: "removed-upstream" };
      continue;
    }
    const up = readFileSync(upstreamPath, "utf8");
    if (local === up) continue;
    report[file] = { status: "changed", bytes: { local: local.length, upstream: up.length } };
  }

  const upstreamJsons = readdirSync(upstreamDir).filter((f) => f.endsWith(".json"));
  for (const file of upstreamJsons) {
    if (!jsons.includes(file)) {
      report[file] = { status: "new-upstream" };
    }
  }

  return report;
}

function diffComponents(upstreamRoot) {
  const report = {};
  const localDir = join(SKILL_ROOT, "references/components");
  const upstreamDir = join(upstreamRoot, "packages/rootage/components");
  if (!existsSync(upstreamDir)) {
    return { error: `upstream components missing: ${upstreamDir}` };
  }

  const localNames = new Set(
    readdirSync(localDir)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
      .map((f) => f.replace(/\.md$/, "")),
  );
  const upstreamNames = new Set(
    readdirSync(upstreamDir)
      .filter((f) => f.endsWith(".yaml"))
      .map((f) => f.replace(/\.yaml$/, "")),
  );

  for (const name of localNames) {
    if (!upstreamNames.has(name)) report[name] = { status: "removed-upstream" };
  }
  for (const name of upstreamNames) {
    if (!localNames.has(name)) report[name] = { status: "not-ported" };
  }

  return report;
}

const upstreamRoot = cloneUpstream();
const currentSha = currentUpstreamSha(upstreamRoot);

const report = {
  snapshotSha: SNAPSHOT.commit,
  upstreamSha: currentSha,
  shaChanged: currentSha && currentSha !== SNAPSHOT.commit,
  tokens: diffTokens(upstreamRoot),
  components: diffComponents(upstreamRoot),
};

if (jsonOut) {
  process.stdout.write(JSON.stringify(report, null, 2));
  process.exit(0);
}

log("");
log(`Snapshot SHA:  ${report.snapshotSha}`);
log(`Upstream SHA:  ${report.upstreamSha ?? "(unknown)"}`);
log(`Changed:       ${report.shaChanged ? "YES" : "no"}`);

log("\n== Tokens ==");
const tokenEntries = Object.entries(report.tokens);
if (tokenEntries.length === 0) log("  (no diff)");
else for (const [f, info] of tokenEntries) log(`  ${f.padEnd(25)} ${info.status}`);

log("\n== Components ==");
const compEntries = Object.entries(report.components);
if (compEntries.length === 0) log("  (all ported components in sync)");
else for (const [n, info] of compEntries) log(`  ${n.padEnd(25)} ${info.status}`);

log("\nReview the diff manually. Do NOT auto-apply — AI-first translation needs judgment.");
log("When reflecting changes, update references/_snapshot.json with the new SHA + date.");
