#!/usr/bin/env node
// sync-from-seed.mjs
// Compare the daangn-seed-ai snapshot against upstream seed-design and report differences.
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
const SKILL_ROOT = resolve(__dirname, "..", "plugins/daangn-seed-ai/skills/seed");
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

// Local-only component docs that intentionally have no upstream rootage yaml.
// These document slot utilities, guidance, or compositions (multiple upstream
// primitives merged into one user-facing doc).
const LOCAL_ONLY_COMPONENTS = new Set([
  "icon",       // slot container (Icon/PrefixIcon/SuffixIcon) + BYO guidance
  "text-field", // composition of upstream `text-input` + `field` + `field-label`
]);

// ROOTAGE_ONLY_COMPONENTS: upstream-only independent components (not internal primitives).
const ROOTAGE_ONLY_COMPONENTS = new Set(["text-button"]);

// INTERNAL_PRIMITIVES: 부모 컴포넌트가 자동 조립하므로 개별 doc 없음. composition.md 에서 통합 문서화.
// These primitives exist in upstream rootage yaml but are internal implementation details
// assembled automatically by their parent components. They are documented collectively
// in references/decision-matrices/composition.md rather than as individual component docs.
const INTERNAL_PRIMITIVES = new Set([
  "checkmark",
  "radiomark",
  "switchmark",
  "select-box-checkmark",
  "segmented-control-indicator",
  "bottom-sheet-close-button",
  "bottom-sheet-handle",
  "action-sheet-close-button",
  "extended-action-sheet-close-button",
  "menu-sheet-close-button",
  "slider-thumb",
  "slider-tick",
  "field-label",
]);

// status enum (canonical kebab tags, machine-friendly):
//   ported | not-ported | removed-upstream | local-only | internal-primitive | rootage-only
// details live in the parallel `kind` / `note` fields. Prior plans used legacy
// composite strings like "local-only (slot utility / guidance)" — those were
// dropped in R2 after confirming no external JSON consumers exist in this repo
// (checked via `grep sync-from-seed` across the tree, plus package.json scripts
// and .github/workflows — only README mentions and internal docs reference it).
// If an external consumer is added later, prefer widening the enum or adding a
// new structured field over resurrecting composite strings.
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
    if (LOCAL_ONLY_COMPONENTS.has(name)) {
      report[name] = { status: "local-only", kind: "local-only", note: "slot utility / guidance" };
      continue;
    }
    if (ROOTAGE_ONLY_COMPONENTS.has(name)) {
      report[name] = { status: "rootage-only", kind: "rootage-only", note: "Rootage spec only, no React export" };
      continue;
    }
    if (!upstreamNames.has(name)) {
      report[name] = { status: "removed-upstream", kind: "removed-upstream" };
    } else {
      report[name] = { status: "ported", kind: "ported" };
    }
  }
  for (const name of upstreamNames) {
    if (!localNames.has(name)) {
      if (INTERNAL_PRIMITIVES.has(name)) {
        report[name] = { status: "internal-primitive", kind: "internal-primitive", note: "Documented collectively in decision-matrices/composition.md" };
      } else if (ROOTAGE_ONLY_COMPONENTS.has(name)) {
        report[name] = { status: "rootage-only", kind: "rootage-only" };
      } else {
        report[name] = { status: "not-ported", kind: "not-ported" };
      }
    }
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
else for (const [n, info] of compEntries) {
  const display = info.note ? `${info.status} — ${info.note}` : info.status;
  log(`  ${n.padEnd(25)} ${display}`);
}

log("\nReview the diff manually. Do NOT auto-apply — AI-first translation needs judgment.");
log("When reflecting changes, update plugins/daangn-seed-ai/skills/seed/references/_snapshot.json with the new SHA + date.");
