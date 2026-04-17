#!/usr/bin/env node
// scripts/validate/run.mjs — reconcile / reconcile-apply end-to-end harness.
//
// What it does per case:
//   1. Copy cases/<name>/source/ → runs/<ts-name>/work/
//   2. Screenshot work/index.html → before.png
//   3. claude -p "/daangn-seed-ai:reconcile ..." (cwd=work)
//        → produces .reconcile/plan.json + report.md
//   4. claude -p "/daangn-seed-ai:reconcile-apply --yes ..." (cwd=work)
//        → modifies work/index.html in place
//   5. Screenshot work/index.html → after.png
//   6. Write comparison.html side-by-side
//
// Usage:
//   node scripts/validate/run.mjs                  # all cases
//   node scripts/validate/run.mjs ai-slop-saas     # single case
//   node scripts/validate/run.mjs <case> --before-only
//   node scripts/validate/run.mjs <case> --no-apply
//   node scripts/validate/run.mjs <case> --skip-claude  # pipeline smoke test
//
// Artifacts land in scripts/validate/runs/<timestamp>-<case>/ (gitignored).

import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve, basename } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "../..");
const CASES_DIR = join(__dirname, "cases");
const RUNS_DIR = join(__dirname, "runs");

// ---------- CLI ----------
const rawArgs = process.argv.slice(2);
const flags = new Set(rawArgs.filter((a) => a.startsWith("--")));
const positional = rawArgs.filter((a) => !a.startsWith("--"));

const BEFORE_ONLY = flags.has("--before-only");
const NO_APPLY = flags.has("--no-apply");
const SKIP_CLAUDE = flags.has("--skip-claude");
const KEEP_RUN = flags.has("--keep"); // reserved

// ---------- Helpers ----------
function ensureDir(p) {
  mkdirSync(p, { recursive: true });
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

function listCases() {
  if (!existsSync(CASES_DIR)) return [];
  return readdirSync(CASES_DIR).filter((name) => {
    const srcPath = join(CASES_DIR, name, "source", "index.html");
    return existsSync(srcPath);
  });
}

function which(cmd) {
  const r = spawnSync("which", [cmd], { encoding: "utf8" });
  return r.status === 0 ? r.stdout.trim() : null;
}

function runPlaywrightScreenshot({ htmlPath, outPath, viewport = "1280,1400" }) {
  const url = pathToFileURL(htmlPath).toString();
  const args = [
    "--no-install",
    "playwright",
    "screenshot",
    "--full-page",
    "--viewport-size",
    viewport,
    "--wait-for-timeout",
    "400",
    url,
    outPath,
  ];
  const r = spawnSync("npx", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 60_000,
  });
  if (r.status !== 0) {
    throw new Error(`playwright screenshot failed (${r.status}): ${r.stderr || r.stdout}`);
  }
  return outPath;
}

function runClaude({ prompt, cwd, logPath }) {
  const args = [
    "-p",
    prompt,
    "--permission-mode",
    "bypassPermissions",
    "--output-format",
    "text",
  ];
  const started = Date.now();
  const r = spawnSync("claude", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 10 * 60 * 1000,
  });
  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  const stdout = r.stdout ?? "";
  const stderr = r.stderr ?? "";
  if (logPath) {
    writeFileSync(logPath, `# exit=${r.status} elapsed=${elapsed}s\n\n## stdout\n${stdout}\n\n## stderr\n${stderr}\n`);
  }
  return { status: r.status, stdout, stderr, elapsed };
}

function writeComparisonHtml({ caseName, beforePng, afterPng, reportMd, outPath }) {
  const reportBody = reportMd
    ? readFileSync(reportMd, "utf8").replace(/</g, "&lt;")
    : "<em>report.md not found</em>";
  const hasAfter = afterPng && existsSync(afterPng);
  const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<title>Reconcile validation — ${caseName}</title>
<style>
  :root {
    --bg: #0f0f10;
    --surface: #1a1a1d;
    --text: #e5e7eb;
    --muted: #9ca3af;
    --accent: #ff6f0f;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 15px;
    line-height: 1.5;
  }
  header {
    padding: 24px 32px;
    border-bottom: 1px solid #27272a;
    display: flex;
    align-items: baseline;
    gap: 16px;
  }
  h1 { margin: 0; font-size: 22px; }
  header .sub { color: var(--muted); font-size: 14px; }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    padding: 24px 32px;
  }
  .panel {
    background: var(--surface);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #27272a;
  }
  .panel-head {
    padding: 12px 16px;
    font-weight: 600;
    border-bottom: 1px solid #27272a;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .panel-head .tag {
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
  }
  .tag.before { background: rgba(244, 114, 182, 0.15); color: #f472b6; }
  .tag.after { background: rgba(255, 111, 15, 0.15); color: var(--accent); }
  .panel img {
    display: block;
    width: 100%;
    height: auto;
    background: white;
  }
  .missing {
    padding: 48px 24px;
    color: var(--muted);
    text-align: center;
    font-size: 14px;
  }
  .report {
    padding: 0 32px 48px;
  }
  .report details {
    background: var(--surface);
    border: 1px solid #27272a;
    border-radius: 12px;
    padding: 16px;
  }
  .report pre {
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 13px;
    color: var(--text);
    margin: 8px 0 0;
  }
  footer {
    padding: 24px 32px;
    color: var(--muted);
    font-size: 12px;
    border-top: 1px solid #27272a;
  }
</style>
</head>
<body>
  <header>
    <h1>Reconcile validation</h1>
    <span class="sub">case: ${caseName}</span>
  </header>
  <section class="grid">
    <div class="panel">
      <div class="panel-head">
        <span>Before — 원본 (AI-slop)</span>
        <span class="tag before">before</span>
      </div>
      ${beforePng && existsSync(beforePng)
        ? `<img src="${basename(beforePng)}" alt="before" />`
        : `<div class="missing">before.png not found</div>`}
    </div>
    <div class="panel">
      <div class="panel-head">
        <span>After — reconcile + apply</span>
        <span class="tag after">after</span>
      </div>
      ${hasAfter
        ? `<img src="${basename(afterPng)}" alt="after" />`
        : `<div class="missing">after.png not yet — apply 단계 미실행</div>`}
    </div>
  </section>
  <section class="report">
    <details ${hasAfter ? "" : "open"}>
      <summary>report.md (reconcile 분석 결과)</summary>
      <pre>${reportBody}</pre>
    </details>
  </section>
  <footer>Generated ${new Date().toISOString()} · scripts/validate/run.mjs</footer>
</body>
</html>
`;
  writeFileSync(outPath, html);
  return outPath;
}

// ---------- Prompts ----------
function reconcilePrompt(workDir, caseName) {
  return `/daangn-seed-ai:reconcile 스킬을 실행해줘.

컨텍스트 (validation harness):
- 이 디렉토리는 "${caseName}" 케이스의 단일 HTML/CSS 베이스라인입니다.
- 프레임워크는 "plain-html" 입니다. package.json / 번들러 없음. 사용자 확인 없이 이 값으로 진행하세요.
- 스캔 타겟은 이 디렉토리 루트의 index.html 하나입니다. CSS는 <style> 안에 인라인.
- 도메인 예외 없음 — 브랜드 컬러는 당근 오렌지(bg.brand-solid)로 통일해도 됩니다.
- needsDecision 항목은 기본 Refactor로 처리해도 괜찮습니다 (가능한 자동 판정).

출력:
- .reconcile/plan.json (스키마 준수)
- .reconcile/report.md
- .reconcile/detected.json

사용자 확인 질문 없이 한 번에 완료해줘. 작업 디렉토리(cwd)는 이미 이 디렉토리야.`;
}

function applyPrompt(workDir, caseName) {
  return `/daangn-seed-ai:reconcile-apply 스킬을 실행해줘.

컨텍스트 (validation harness):
- 같은 디렉토리의 .reconcile/plan.json을 소비해서 index.html을 실제로 수정합니다.
- 자동 커밋 비활성 (--no-commit 동작). git 사용 안 함.
- 사용자 확인 생략 (--yes 동작).
- needsDecision 항목은 스킵 (기본 동작).
- Stage 별 gate (lint/test) 는 이 컨텍스트에서 실행할 명령이 없으므로 생략하고 계속 진행.

작업:
- plan.json의 items 중 confidence ≥ 0.7 인 refactor/drop/import 를 index.html에 적용.
- 단일 HTML이므로 Seed 컴포넌트 React import 대신 semantic class + CSS 변수 사용으로 변환 (Icon/ActionButton/TextField 등에 대응하는 BEM 클래스).
- CSS :root에 필요한 Seed 토큰 변수 선언을 추가 (brand-solid, bg.layer-*, fg.neutral 등 필요한 것만).
- 최종적으로 index.html 하나만 수정. 다른 파일은 만들지 말 것.
- .reconcile/apply-log.json, .reconcile/apply-summary.md 기록.

결과물: 수정된 index.html + apply 로그 2개.

사용자 확인 질문 없이 한 번에 완료해줘.`;
}

// ---------- Per-case pipeline ----------
function runCase(caseName) {
  const srcDir = join(CASES_DIR, caseName, "source");
  if (!existsSync(join(srcDir, "index.html"))) {
    console.error(`✗ case "${caseName}": source/index.html not found`);
    return { name: caseName, pass: false, reason: "no-source" };
  }

  const ts = timestamp();
  const runDir = join(RUNS_DIR, `${ts}-${caseName}`);
  const workDir = join(runDir, "work");
  ensureDir(workDir);
  cpSync(srcDir, workDir, { recursive: true });
  console.log(`\n=== ${caseName} ===`);
  console.log(`  run: ${runDir}`);

  const results = { steps: {} };

  // Step 1: before screenshot
  const beforePng = join(runDir, "before.png");
  try {
    runPlaywrightScreenshot({ htmlPath: join(workDir, "index.html"), outPath: beforePng });
    console.log(`  ✓ before.png (${formatBytes(statSync(beforePng).size)})`);
    results.steps.before = "ok";
  } catch (e) {
    console.error(`  ✗ before screenshot failed: ${e.message}`);
    results.steps.before = "fail";
    return { name: caseName, pass: false, runDir, reason: "screenshot" };
  }

  if (BEFORE_ONLY) {
    writeComparisonHtml({
      caseName,
      beforePng,
      afterPng: null,
      reportMd: null,
      outPath: join(runDir, "comparison.html"),
    });
    console.log(`  ✓ comparison.html (before only)`);
    return { name: caseName, pass: true, runDir, mode: "before-only" };
  }

  // Step 2: reconcile
  if (!SKIP_CLAUDE) {
    console.log(`  → claude -p /daangn-seed-ai:reconcile`);
    const rec = runClaude({
      prompt: reconcilePrompt(workDir, caseName),
      cwd: workDir,
      logPath: join(runDir, "reconcile.log.txt"),
    });
    console.log(`    ${rec.elapsed}s, exit ${rec.status}`);
    if (rec.status !== 0) {
      console.error(`  ✗ reconcile claude exited non-zero`);
      results.steps.reconcile = "fail";
      writeComparisonHtml({
        caseName, beforePng, afterPng: null, reportMd: null,
        outPath: join(runDir, "comparison.html"),
      });
      return { name: caseName, pass: false, runDir, reason: "reconcile-exit" };
    }
    // surface artifacts at runDir top level for convenience
    copyIfExists(join(workDir, ".reconcile", "plan.json"), join(runDir, "plan.json"));
    copyIfExists(join(workDir, ".reconcile", "report.md"), join(runDir, "report.md"));
    copyIfExists(join(workDir, ".reconcile", "detected.json"), join(runDir, "detected.json"));
    results.steps.reconcile = "ok";
  } else {
    console.log(`  ⇢ skipped reconcile (--skip-claude)`);
  }

  if (NO_APPLY || SKIP_CLAUDE) {
    writeComparisonHtml({
      caseName,
      beforePng,
      afterPng: null,
      reportMd: join(runDir, "report.md"),
      outPath: join(runDir, "comparison.html"),
    });
    console.log(`  ✓ comparison.html (no-apply)`);
    return { name: caseName, pass: true, runDir, mode: "no-apply" };
  }

  // Step 3: apply
  console.log(`  → claude -p /daangn-seed-ai:reconcile-apply`);
  const app = runClaude({
    prompt: applyPrompt(workDir, caseName),
    cwd: workDir,
    logPath: join(runDir, "apply.log.txt"),
  });
  console.log(`    ${app.elapsed}s, exit ${app.status}`);
  if (app.status !== 0) {
    console.error(`  ✗ apply claude exited non-zero`);
    results.steps.apply = "fail";
  } else {
    copyIfExists(join(workDir, ".reconcile", "apply-log.json"), join(runDir, "apply-log.json"));
    copyIfExists(join(workDir, ".reconcile", "apply-summary.md"), join(runDir, "apply-summary.md"));
    results.steps.apply = "ok";
  }

  // Step 4: after screenshot
  const afterPng = join(runDir, "after.png");
  try {
    runPlaywrightScreenshot({ htmlPath: join(workDir, "index.html"), outPath: afterPng });
    console.log(`  ✓ after.png (${formatBytes(statSync(afterPng).size)})`);
    results.steps.after = "ok";
  } catch (e) {
    console.error(`  ✗ after screenshot failed: ${e.message}`);
    results.steps.after = "fail";
  }

  writeComparisonHtml({
    caseName,
    beforePng,
    afterPng,
    reportMd: join(runDir, "report.md"),
    outPath: join(runDir, "comparison.html"),
  });
  console.log(`  ✓ comparison.html`);
  return { name: caseName, pass: results.steps.apply === "ok" && results.steps.after === "ok", runDir };
}

function copyIfExists(src, dst) {
  if (existsSync(src)) cpSync(src, dst);
}

function formatBytes(n) {
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)}KB`;
  return `${(n / (1024 * 1024)).toFixed(2)}MB`;
}

// ---------- Preflight ----------
function preflight() {
  if (!which("npx")) {
    console.error("npx not found. Install Node.js first.");
    process.exit(3);
  }
  if (!SKIP_CLAUDE && !BEFORE_ONLY && !which("claude")) {
    console.error("claude CLI not found. Install Claude Code or pass --skip-claude.");
    process.exit(3);
  }
}

// ---------- Entry ----------
preflight();
ensureDir(RUNS_DIR);

const available = listCases();
if (available.length === 0) {
  console.error("no cases found under scripts/validate/cases/");
  process.exit(2);
}

const requested = positional.length ? positional : available;
for (const name of requested) {
  if (!available.includes(name)) {
    console.error(`unknown case: ${name}. available: ${available.join(", ")}`);
    process.exit(2);
  }
}

console.log(`Cases: ${requested.join(", ")}`);
const summary = [];
for (const name of requested) {
  summary.push(runCase(name));
}

console.log(`\n=== Summary ===`);
let anyFail = false;
for (const s of summary) {
  const icon = s.pass ? "✓" : "✗";
  const extra = s.reason ? ` — ${s.reason}` : s.mode ? ` (${s.mode})` : "";
  console.log(`  [${icon}] ${s.name}${extra}`);
  console.log(`     ${s.runDir ?? "(no run dir)"}`);
  if (!s.pass) anyFail = true;
}
process.exit(anyFail ? 1 : 0);
