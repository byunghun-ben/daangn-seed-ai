# scripts/validate — reconcile end-to-end 검증

이 하네스는 `/daangn-seed-ai:reconcile`과 `/daangn-seed-ai:reconcile-apply` 두 스킬이 실제 화면을 얼마나 "당근화"하는지 **시각적으로 증명**하기 위한 도구.

스크린샷 before/after + reconcile report를 한 페이지에 나란히 놓는다. 블로그·README·데모 소재.

## 구조

```
scripts/validate/
├── README.md           ← 이 파일
├── run.mjs             ← 파이프라인 실행기
├── cases/              ← 각 시나리오 — 저작권 안전한 "스타일 클론"
│   └── ai-slop-saas/
│       ├── brief.md    ← 케이스 의도 + 의도적으로 포함된 안티패턴 목록
│       └── source/
│           └── index.html    ← 단일 HTML (CSS 인라인)
└── runs/               ← 실행 결과 (gitignored)
    └── 2026-04-17T...-ai-slop-saas/
        ├── work/                ← source 복사본 — apply가 이곳을 수정
        │   ├── index.html       ← 최종 상태
        │   └── .reconcile/      ← plan.json, report.md, apply-log.json 등
        ├── before.png           ← source 원본 스크린샷
        ├── after.png            ← reconcile-apply 후 스크린샷
        ├── plan.json            ← reconcile 결과 (편의 복사)
        ├── report.md            ← 사람 판독용 리포트
        ├── apply-summary.md     ← apply 최종 리포트
        ├── reconcile.log.txt    ← claude -p 원시 로그
        ├── apply.log.txt
        └── comparison.html      ← before/after 나란히 + report 인라인
```

## 사용

```bash
# 의존성 — Playwright CLI는 npx로 자동 수행 (브라우저는 첫 실행 시 다운로드)
# Claude Code CLI(claude)가 PATH에 있어야 함

node scripts/validate/run.mjs                        # 전체 케이스
node scripts/validate/run.mjs ai-slop-saas           # 단일 케이스

# 단계별 실행 (디버깅)
node scripts/validate/run.mjs ai-slop-saas --before-only   # before.png만
node scripts/validate/run.mjs ai-slop-saas --no-apply      # reconcile까지만
node scripts/validate/run.mjs ai-slop-saas --skip-claude   # 파이프라인 스모크 (스크린샷만)
```

결과물 중 **`runs/<ts>-<case>/comparison.html`을 브라우저로 열면 before/after + report를 한 화면에서 본다.**

## 현재 케이스

### `ai-slop-saas` — generic SaaS 랜딩 AI-slop

가상의 "Nimbus AI" SaaS 랜딩 페이지. Claude에게 디자인 시스템 없이 "SaaS 랜딩 만들어줘" 라고 했을 때 전형적으로 나오는 보라·핑크 그라디언트, 중앙정렬 flex 연쇄, 이모지 장식, 과도한 radius, 버튼 그림자 등을 **의도적으로** 포함.

reconcile 스킬이 이 화면을 당근 오렌지 + flat + neutral-dominant + 정돈된 그리드로 바꿔낼 수 있는지를 본다.

### 로드맵

- `toss-style-transfer` — 강한 블루 브랜드 + 강한 모션 톤을 당근화 (저작권 안전한 가상 "송금" 앱)
- `bngp-style-listing` — 번개장터 유사 톤의 상품 리스트 → 당근 수렴도
- 직접 추가: `cases/<name>/source/index.html` + `brief.md`를 만들면 자동으로 picked up

## 각 케이스 작성 가이드

1. **저작권 안전 원칙**: 실제 서비스 로고·상품명·상표 금지. "fictional marketplace", "fictional delivery app" 등의 페르소나로.
2. **단일 HTML**: CSS는 `<style>`에 인라인. 외부 CDN·이미지 의존 금지 (스크린샷 재현성).
3. **의도적 안티패턴**: `brief.md`에 포함된 안티패턴 목록을 명시. `plugins/.../seed/references/anti-patterns.md`와 매핑.
4. **재현 가능한 상태**: 랜덤/시간 기반 값 금지. 같은 소스 → 같은 스크린샷.

## 파이프라인 내부 동작

1. `cases/<name>/source/` → `runs/<ts>-<name>/work/` 복사 (격리)
2. Playwright로 `work/index.html` 전체 페이지 스크린샷 → `before.png` (viewport 1280×1400)
3. `claude -p "/daangn-seed-ai:reconcile ..."` 실행 (cwd=work)
   - validation harness 용 힌트 주입: framework=plain-html, 도메인 예외 없음, needsDecision 자동 Refactor
   - 결과: `work/.reconcile/plan.json` + `report.md`
4. `claude -p "/daangn-seed-ai:reconcile-apply ..."` 실행 (cwd=work)
   - 힌트: git 비활성, 단일 HTML이므로 React import 대신 semantic BEM 클래스 + CSS 변수 적용
   - 결과: `work/index.html` 수정됨
5. Playwright 후속 스크린샷 → `after.png`
6. `comparison.html` 생성 — before/after 양옆 + `report.md` 내장

## 한계

- Claude 호출이 들어있어서 실행 시간이 길다 (케이스당 5~15분 범위 예상)
- 결과물은 결정론적이지 않다 — 같은 source에 대해 apply 결과가 달라질 수 있음. 여러 번 돌려보고 대표 케이스를 스크린샷으로 보관 권장.
- `--skip-claude`는 파이프라인 자체가 돌아가는지만 확인. 실제 검증 효과는 없음.
- Playwright 브라우저 바이너리는 첫 실행 시 자동 설치. `npx playwright install chromium` 수동 실행 권장.

## 결과물을 어떻게 쓰나

- **README**: 가장 보기 좋은 before/after 쌍을 `docs/images/`로 복사해서 README 상단에 노출
- **블로그**: `comparison.html`을 그대로 캡처하거나, 각 PNG를 개별 삽입
- **회의·데모**: 라이브로 `node scripts/validate/run.mjs ai-slop-saas` 실행 — 눈앞에서 변환

## 알려진 이슈

- macOS에서 Playwright CLI 첫 실행 시 시간이 오래 걸릴 수 있음 (Chromium 다운로드)
- Claude CLI가 네트워크 에러로 실패하면 `reconcile.log.txt`를 보고 재시도
- `work/` 디렉토리 안에 `.reconcile/`이 생기지만 runs/는 gitignored이므로 안전
