#!/usr/bin/env node
// test.mjs — daangn-ai skill dry-run harness.
//
// Launches a FRESH `claude -p` subprocess per scenario so the skill is
// consumed without the parent session's context pollution. Captures the
// generated HTML file and runs a grep-based anti-pattern lint against it.
//
// Usage:
//   node skills/daangn-ai/scripts/test.mjs                    # all scenarios
//   node skills/daangn-ai/scripts/test.mjs signup             # single
//   node skills/daangn-ai/scripts/test.mjs --lint-only <path> # lint existing file
//
// Output goes to temp/daangn-runs/<timestamp>/ (gitignored).

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, basename } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SKILL_ROOT = resolve(__dirname, "..");
const HARNESS_ROOT = resolve(SKILL_ROOT, "../..");

// ---------- Scenarios ----------
// Each scenario drives one fresh claude session. The prompt must push
// daangn-ai to be loaded (we mention the skill name explicitly) AND
// specify an absolute output path so lint can find the result.
const SCENARIOS = {
  signup: {
    summary: "폼 중심: TextField × 3 + Checkbox + Callout + 2-button footer",
    // HTML-mode scenario: expectations match token/class patterns, not React names.
    expected: ["--seed-color-bg-brand-solid", "neutral-weak", "aria-invalid", "type=\"email\""],
    forbidden: ["Dialog", "BottomSheet"],
    prompt: (outPath) => `daangn-ai 스킬을 사용해서 당근 스타일 회원가입 페이지를 만들어줘.

요구사항:
- 단일 HTML 파일로 완결 (외부 CDN 의존 없이 self-contained <style>)
- 모바일 뷰포트 (max-width 420px 중앙 정렬)
- 상단 페이지 제목 + 부제
- 상단 안내 Callout (이메일 인증 안내 같은 톤)
- Field 3개: 닉네임(필수), 이메일(필수, invalid 상태 예시 포함), 비밀번호(필수)
- Checkbox: 약관동의
- 하단 액션 바: 취소(neutralWeak) + 가입하기(brandSolid, 주 액션 오른쪽)
- 한국어 라벨·메시지

반드시 daangn-ai의 references/anti-patterns.md를 읽고 저촉되지 않도록 작성.
출력 파일 경로(절대경로): ${outPath}

다른 질문 없이 바로 Write 도구로 파일을 생성해줘.`,
  },

  listDialog: {
    summary: "리스트 + 파괴적 Dialog (criticalSolid, 주 액션 우측)",
    expected: ["critical-solid", "neutral-weak", "--seed-color-bg-overlay", "role=\"dialog\""],
    forbidden: ["Snackbar", "BottomSheet"],
    prompt: (outPath) => `daangn-ai 스킬을 사용해서 당근 중고거래 "내 판매 목록" 페이지 HTML을 만들어줘.

요구사항:
- 단일 HTML 파일, 모바일 뷰포트
- 상단 페이지 제목 "내 판매 목록"
- 상품 카드 3개: 이미지 자리(placeholder 블록) + 제목 + 가격 + 거리
- 각 카드 우측 하단에 "삭제" 액션 (ActionButton, size=small, variant=criticalSolid)
- 삭제 클릭 시 중앙 모달 Dialog 표시 (예시로 첫 번째 카드는 Dialog가 열려있는 상태로 렌더)
  - Dialog.Title: "게시글을 삭제할까요?"
  - Dialog.Description: "삭제한 게시글은 복구할 수 없어요."
  - Dialog.Footer: 취소(neutralWeak) + 삭제(criticalSolid, 오른쪽)
  - backdrop 포함

반드시 decision-matrices/which-overlay.md의 규칙을 따를 것 (Dialog 사용, Snackbar 금지).
anti-patterns.md 체크리스트 준수.
출력 파일 경로(절대경로): ${outPath}

바로 Write로 파일 생성해줘.`,
  },

  feedback: {
    summary: "Snackbar (성공 vs 실패+재시도), Dialog 금지 검증",
    expected: ["snackbar", "positive", "critical", "--seed-color-bg-neutral-inverted"],
    forbidden: ["Dialog", "BottomSheet", "role=\"dialog\""],
    prompt: (outPath) => `daangn-ai 스킬을 사용해서 "저장 피드백" 데모 HTML을 만들어줘.

요구사항:
- 단일 HTML 파일, 모바일 뷰포트
- 페이지 중앙에 "상품 저장하기" ActionButton (brandSolid, size=large)
- 페이지 하단에 두 개의 Snackbar를 렌더 (둘 다 동시에 보이도록 세로 배치 — 비교용 데모)
  1) variant=positive: "저장되었습니다" (초록 prefix icon 자리)
  2) variant=critical: "저장 실패" + 액션 버튼 "재시도" (빨간 prefix icon 자리)
- Snackbar 배경은 dark (bg.neutral-inverted), 텍스트는 흰색

중요: 이 시나리오는 "일시적 피드백"이므로 **Dialog가 아닌 Snackbar**를 써야 함.
decision-matrices/which-overlay.md 참고.
anti-patterns.md 준수.
출력 파일 경로(절대경로): ${outPath}

바로 Write로 파일 생성해줘.`,
  },
};

// ---------- Lint rules ----------
// Grep-based heuristics. Not AST — false positives possible. Flags high-signal
// issues. Strips comments and :root declarations before value-hunting so tokens
// counted as hardcoded only when used at the call site.
function lint(html, scenario) {
  const findings = [];

  // Strip CSS/HTML comments and inline SVG (SVG fills can't use CSS vars easily
  // and are a common false-positive source for hex checks).
  const noCssComments = html.replace(/\/\*[\s\S]*?\*\//g, "");
  const noComments = noCssComments.replace(/<!--[\s\S]*?-->/g, "");
  const noSvg = noComments.replace(/<svg\b[\s\S]*?<\/svg>/g, "");

  // Separate <style> content (where hex/px checks apply but only OUTSIDE :root)
  // from the rest of the HTML (where element-level checks apply).
  const styleBlocks = [...noSvg.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
    .map((m) => m[1])
    .join("\n");
  const htmlBody = noSvg.replace(/<style[^>]*>[\s\S]*?<\/style>/g, "");

  // Within style blocks, strip :root declarations (token vocabulary is allowed raw).
  const styleNoRoot = styleBlocks.replace(/:root[^{]*\{[^}]*\}/g, "");

  // 1) Raw hex colors outside :root (inside <style>) or anywhere in body
  const styleHex = styleNoRoot.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  const bodyHex = htmlBody.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  const allHex = [...styleHex, ...bodyHex];
  if (allHex.length) {
    findings.push({
      rule: "no-hardcoded-hex",
      severity: "error",
      detail: `${allHex.length} hex color(s) outside :root: ${allHex.slice(0, 3).join(", ")}`,
    });
  }

  // 2) Raw px inside <style> outside :root (allow 0-1px for borders/hairlines)
  const pxMatches = styleNoRoot.match(/(?<![\w-])(\d+(?:\.\d+)?)px\b/g) || [];
  const suspiciousPx = pxMatches.filter((m) => parseFloat(m) > 1);
  if (suspiciousPx.length) {
    findings.push({
      rule: "no-hardcoded-px",
      severity: "warn",
      detail: `${suspiciousPx.length} px value(s) outside :root: ${[...new Set(suspiciousPx)].slice(0, 5).join(", ")}`,
    });
  }

  // 3) Native <button> in body without an ActionButton-style variant class
  const buttonTags = htmlBody.match(/<button\b[^>]*>/g) || [];
  const nonVariantButtons = buttonTags.filter(
    (t) => !/class="[^"]*(?:action-button|btn|button--)/.test(t),
  );
  if (nonVariantButtons.length) {
    findings.push({
      rule: "buttons-need-variant",
      severity: "warn",
      detail: `${nonVariantButtons.length} button(s) without ActionButton-style variant class`,
    });
  }

  // 4) iconOnly / icon-only without aria-label
  const iconOnlyMatches =
    htmlBody.match(/<[^>]*(?:icon-only|layout="iconOnly")[^>]*>/gi) || [];
  const missingLabel = iconOnlyMatches.filter((t) => !/aria-label=/.test(t));
  if (missingLabel.length) {
    findings.push({
      rule: "icon-only-needs-aria-label",
      severity: "error",
      detail: `${missingLabel.length} iconOnly button(s) missing aria-label`,
    });
  }

  // 5) Multiple brand-solid BUTTON INSTANCES inside <form>/<footer>.
  // Scope: only element usage in body (not style rules).
  const formBlocks = [...htmlBody.matchAll(/<(form|footer)[^>]*>([\s\S]*?)<\/\1>/g)];
  for (const [, tag, inner] of formBlocks) {
    const solidButtons = (inner.match(/<button\b[^>]*brand-solid/g) || []).length;
    if (solidButtons > 1) {
      findings.push({
        rule: "one-solid-per-form",
        severity: "error",
        detail: `<${tag}> has ${solidButtons} brand-solid buttons — at most 1`,
      });
    }
  }

  // 6) <input type="text|email|password"> not wrapped in field class
  const bareInputs = (htmlBody.match(/<input\b[^>]*type="(text|email|password)"[^>]*>/g) || []).filter(
    (tag) => {
      const idx = htmlBody.indexOf(tag);
      const before = htmlBody.slice(Math.max(0, idx - 300), idx);
      return !/class="[^"]*field/i.test(before);
    },
  );
  if (bareInputs.length) {
    findings.push({
      rule: "inputs-need-field-wrapper",
      severity: "warn",
      detail: `${bareInputs.length} text/email/password <input> not inside a .field wrapper`,
    });
  }

  // 7) Scenario-specific: expected tokens present
  if (scenario) {
    for (const tok of scenario.expected ?? []) {
      if (!html.includes(tok)) {
        findings.push({
          rule: "scenario-missing-expected",
          severity: "warn",
          detail: `Expected to find "${tok}" in output`,
        });
      }
    }
    for (const tok of scenario.forbidden ?? []) {
      if (html.includes(tok)) {
        findings.push({
          rule: "scenario-forbidden-used",
          severity: "error",
          detail: `Scenario forbids "${tok}" but it appears in output`,
        });
      }
    }
  }

  return findings;
}

// ---------- Runner ----------
function ensureClaudeAvailable() {
  const check = spawnSync("which", ["claude"], { encoding: "utf8" });
  if (check.status !== 0 || !check.stdout.trim()) {
    console.error("claude CLI not found on PATH. Install Claude Code first.");
    process.exit(3);
  }
  return check.stdout.trim();
}

function runClaude(promptText, outPath) {
  const args = [
    "-p",
    promptText,
    "--permission-mode",
    "bypassPermissions",
    "--output-format",
    "text",
  ];
  console.log(`  → claude -p ... (writing to ${basename(outPath)})`);
  const started = Date.now();
  const result = spawnSync("claude", args, {
    cwd: HARNESS_ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 5 * 60 * 1000,
  });
  if (result.error) throw result.error;
  console.log(`    ${((Date.now() - started) / 1000).toFixed(1)}s, exit ${result.status}`);
  return {
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function verdict(findings) {
  const errors = findings.filter((f) => f.severity === "error");
  const warns = findings.filter((f) => f.severity === "warn");
  return {
    pass: errors.length === 0,
    errors,
    warns,
  };
}

function printFindings(scenarioName, findings) {
  const v = verdict(findings);
  const icon = v.pass ? "✓" : "✗";
  console.log(`\n[${icon}] ${scenarioName}: ${v.errors.length} error, ${v.warns.length} warn`);
  for (const f of findings) {
    const mark = f.severity === "error" ? "  ✗" : "  ⚠";
    console.log(`${mark} [${f.rule}] ${f.detail}`);
  }
  return v.pass;
}

// ---------- Entry ----------
const args = process.argv.slice(2);

if (args[0] === "--lint-only") {
  const target = args[1];
  if (!target || !existsSync(target)) {
    console.error("Usage: test.mjs --lint-only <html-path>");
    process.exit(2);
  }
  const html = readFileSync(target, "utf8");
  const findings = lint(html);
  const pass = printFindings(basename(target), findings);
  process.exit(pass ? 0 : 1);
}

ensureClaudeAvailable();
const requested = args.length ? args : Object.keys(SCENARIOS);
const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const runDir = join(HARNESS_ROOT, "temp", "daangn-runs", ts);
mkdirSync(runDir, { recursive: true });
console.log(`Run dir: ${runDir}`);

const summary = [];
for (const name of requested) {
  const scenario = SCENARIOS[name];
  if (!scenario) {
    console.error(`unknown scenario: ${name}. available: ${Object.keys(SCENARIOS).join(", ")}`);
    process.exit(2);
  }

  console.log(`\n=== ${name} — ${scenario.summary} ===`);
  const outPath = join(runDir, `${name}.html`);
  const promptText = scenario.prompt(outPath);
  writeFileSync(join(runDir, `${name}.prompt.txt`), promptText);

  let runResult;
  try {
    runResult = runClaude(promptText, outPath);
  } catch (e) {
    console.error(`  claude spawn failed: ${e.message}`);
    summary.push({ name, pass: false, reason: "spawn-failed" });
    continue;
  }

  writeFileSync(join(runDir, `${name}.stdout.txt`), runResult.stdout);
  if (runResult.stderr) writeFileSync(join(runDir, `${name}.stderr.txt`), runResult.stderr);

  if (!existsSync(outPath)) {
    console.log(`  ✗ output file not created at ${outPath}`);
    summary.push({ name, pass: false, reason: "no-output" });
    continue;
  }

  const html = readFileSync(outPath, "utf8");
  const findings = lint(html, scenario);
  const pass = printFindings(name, findings);
  summary.push({ name, pass, findings: findings.length });
}

console.log(`\n=== Summary ===`);
let allPass = true;
for (const s of summary) {
  const icon = s.pass ? "✓" : "✗";
  const extra = s.reason ?? `${s.findings ?? 0} finding(s)`;
  console.log(`  [${icon}] ${s.name.padEnd(14)} ${extra}`);
  if (!s.pass) allPass = false;
}
console.log(`\nArtifacts: ${runDir}`);
process.exit(allPass ? 0 : 1);
