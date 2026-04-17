---
description: "이미 진행 중인 앱 코드베이스를 당근 Seed 디자인 시스템과 3-way 비교(현재 × Seed × 도메인 요구)해서 Keep/Refactor/Drop/Import 4분류 리포트와 plan.json을 생성하는 읽기 전용 스킬. '기존 앱에 Seed 도입', '디자인 시스템 마이그레이션', 'Seed reconcile', 'AI-slop 제거해서 당근 스타일로 맞추기' 같은 요청에 로드. 파일을 수정하지 않음 — 적용은 reconcile-apply 스킬이 담당."
---

# reconcile

이미 만들고 있는 앱에 당근 Seed 디자인 시스템을 **부분 도입·전면 도입**할 때, 무엇을 가져오고(Import) 무엇을 보완하고(Refactor) 무엇을 버리고(Drop) 무엇을 그대로 둘지(Keep)를 결정하기 위한 읽기 전용 분석 스킬. git 3-way merge의 감각을 디자인 시스템에 옮긴 것.

**출력물만 만든다 — 소스 파일은 건드리지 않는다.** 실제 리팩터는 짝 스킬 `reconcile-apply`가 담당.

## 언제 로드하나

- 기존 앱에 Seed를 도입하려고 할 때 "어디서부터 건드릴지" 막연한 상태
- `seed` 스킬로 새 화면을 만들다 보니 레거시 화면과 이질감이 커진 시점
- 디자인 리뷰에서 "AI 생성물 티가 난다"는 피드백이 나왔을 때
- Seed의 일부만(토큰만, 또는 ActionButton만) 도입한 상태에서 전면 확장 전 점검

## 언제 로드하지 않나

- 새 프로젝트를 처음부터 Seed로 만들 때 → `seed` 스킬
- 당근과 무관한 브랜드로 가야 할 때 → `impeccable` 또는 `design-consultation`
- 리팩터를 실제로 실행하려 할 때 → `reconcile-apply` (이 스킬은 분석만)

## 철학 — 3-way merge

```
current  ────┐
              ├──► reconciled plan.json
seed   ──────┤
              ├──► report.md (사람이 읽는 결정 문서)
domain ──────┘
```

- **current**: 실제 코드의 색·간격·컴포넌트·레이아웃 관용구. 스킬 실행 시 cwd를 스캔해서 채운다.
- **seed**: 같은 플러그인의 `seed` 스킬 references가 기준.
- **domain**: 프로젝트 고유의 정당한 일탈(예: 브랜드 컬러가 당근 오렌지가 아님, 특정 컴포넌트가 도메인에 필수). 사용자 확인으로 수집.

세 입력을 놓고 각 관찰치를 Keep/Refactor/Drop/Import 하나로 분류한다. 애매하면 `Refactor`의 `needsDecision: true`로 표시하고 사람 판단을 기다린다.

## 실행 위치 기반 감지

스킬은 별도 경로 입력을 받지 않는다. `pwd`를 그대로 사용한다.

실행 직후 순서대로 확인한다(상세: `references/scan-strategy.md`).

1. `package.json` / `pnpm-workspace.yaml` / `turbo.json` — 프레임워크·모노레포 감지
2. 스타일 시스템 감지 — Tailwind / CSS Modules / styled-components / vanilla-extract / plain CSS 중 어느 것 쓰는지
3. Seed 의존성 감지 — `@seed-design/*`, `@karrotmarket/*`가 `package.json`에 있으면 "부분 도입" 모드
4. 스캔 타겟 결정 — 존재하는 것 중 첫 번째: `src/`, `app/`, `components/`, 루트
5. 제외 경로 — `node_modules`, `dist`, `build`, `.next`, `.turbo`, `coverage`, `.git`

어느 단계에서든 판정 불가하면 즉시 사용자에게 묻는다 — **추측하지 않는다.**

## 워크플로우

1. **Detect** — cwd에서 프레임워크·스타일 시스템·Seed 의존성 감지. 결과를 `.reconcile/detected.json`에 기록. (`references/scan-strategy.md`)
2. **Inventory** — 색상값·간격·타이포·컴포넌트 사용 패턴·레이아웃 관용구를 추출. (`references/inventory-extraction.md`)
3. **Diff vs Seed** — 인벤토리의 각 항목을 `seed` 스킬 references의 토큰/anatomy와 비교. (`references/diff-rules.md`)
4. **Classify** — 각 diff 항목을 Keep/Refactor/Drop/Import 중 하나로 분류. (`references/classification.md`)
5. **Ask for domain exceptions** — 분류 결과 중 "정당한 일탈" 후보가 있으면 사용자에게 확인 (예: "브랜드 컬러 `#5b8def`가 보입니다 — 당근 오렌지로 교체할까요, 도메인 컬러로 유지할까요?")
6. **Emit** — `.reconcile/plan.json` + `.reconcile/report.md` 생성. (`references/plan-schema.md`, `references/report-format.md`)

중간 산출물은 `.reconcile/` 디렉토리 하나에 모은다. gitignore 여부는 사용자가 결정.

## 출력 계약

### `.reconcile/plan.json`

`reconcile-apply`가 소비할 기계 판독용. 스키마는 `references/plan-schema.md` 참조. 핵심:

```json
{
  "version": 1,
  "generatedAt": "2026-04-17T...",
  "detected": { "framework": "next", "styleSystem": "tailwind", "seedAdoption": "partial" },
  "items": [
    {
      "id": "color-hardcoded-ff6f0f",
      "category": "refactor",
      "kind": "token",
      "current": "#ff6f0f",
      "target": "var(--seed-color-bg-brand-solid)",
      "occurrences": [{ "file": "src/Header.tsx", "line": 42 }],
      "confidence": 0.95,
      "needsDecision": false,
      "risk": "low"
    }
  ]
}
```

### `.reconcile/report.md`

사람이 읽는 결정 문서. `references/report-format.md`의 템플릿을 따른다. 핵심 섹션:

- **Executive summary** — Keep/Refactor/Drop/Import 건수, 예상 작업 규모
- **Conflict table** — 사용자 결정이 필요한 항목 목록 (`needsDecision: true`)
- **By category** — 4분류별 상세 리스트, 근거, 대안
- **Suggested staging** — 적용 순서 권장 (토큰 → 레이아웃 → 컴포넌트, 리스크 낮은 것부터)
- **Next step** — `/daangn-seed-ai:reconcile-apply`로 넘어가는 방법

## 안전 규칙

- **쓰기 금지**: `.reconcile/` 하위 외의 어떤 파일도 수정하지 않는다. Edit/Write 도구 사용 시 경로를 반드시 검증.
- **추측 금지**: 스타일 시스템이 혼재되거나 프레임워크 감지가 실패하면 중단하고 사용자에게 묻는다.
- **규모 상한**: 인벤토리가 관찰치 2000개를 넘어가면 대표 샘플만 남기고 전체는 `.reconcile/inventory-raw.json`에 따로 덤프. plan.json의 occurrences는 파일당 최대 3건 + "and N more".
- **도메인 예외 존중**: 분류가 Drop/Refactor여도 사용자가 "domain"으로 지정하면 Keep으로 강등하고 `domainException: "사유"`를 기록.

## 참조 파일 인덱스

- `references/scan-strategy.md` — 프레임워크·스타일 시스템 감지 로직
- `references/inventory-extraction.md` — 코드에서 디자인 값 뽑는 방법 (정규식·AST)
- `references/diff-rules.md` — current vs seed 비교 규칙
- `references/classification.md` — 4분류 결정 트리
- `references/plan-schema.md` — plan.json 스키마·예제
- `references/report-format.md` — report.md 템플릿

## 기존 `seed` 스킬과의 관계

`reconcile`은 Seed 기준을 스스로 들고 있지 않는다. 같은 플러그인 내 `seed` 스킬의 `references/tokens/`, `references/components/`, `references/anti-patterns.md`를 **단일 진실 소스로 참조**한다. Seed가 업데이트되면 자동으로 기준이 따라간다.

구체적으로 비교 시 다음 파일을 읽는다:

- `skills/seed/references/tokens/color.md` · `color.json` — 색 매핑
- `skills/seed/references/tokens/dimension.json` · `spacing.md` — 간격 매핑
- `skills/seed/references/tokens/typography.md` · `font-size.json` — 타이포 매핑
- `skills/seed/references/tokens/radius.md` · `radius.json` — 반경 매핑
- `skills/seed/references/components/*.md` — 컴포넌트 anatomy·variant 기준
- `skills/seed/references/anti-patterns.md` — Drop 후보 탐지 기준
