# Classification — Keep / Refactor / Drop / Import

diff 결과를 받아 4분류 중 하나를 부여. 이 분류가 plan.json의 `category`가 되고 apply 단계의 행동을 결정.

## 분류 정의

| 분류 | 뜻 | apply 동작 |
|------|-----|-----------|
| `keep` | 이미 Seed 철학과 맞거나 정당한 도메인 차이 | 아무것도 안 함 |
| `refactor` | 의도는 맞지만 토큰/컴포넌트 치환 필요 | 치환 변환 수행 |
| `drop` | Seed와 충돌 · AI-slop 패턴 | 제거 또는 단순화 |
| `import` | Seed에 있고 프로젝트가 빠뜨린 것 | 새 코드/의존성 추가 |

## 결정 트리

```
diff 결과 받음
│
├─ match?
│   └─ keep (별도 기록 불필요, summary 카운트만)
│
├─ near?
│   ├─ domain exception 확정됨?
│   │   └─ keep + domainException 사유
│   ├─ 안전한 1:1 치환?
│   │   └─ refactor (confidence 높음)
│   └─ 판정 애매 (커스텀 컴포넌트 성격 불명 등)
│       └─ refactor + needsDecision: true
│
├─ conflict?
│   ├─ anti-pattern hit?
│   │   ├─ semantic correctness (접근성)?
│   │   │   └─ refactor (즉시 수정 대상, 높은 우선순위)
│   │   └─ 디자인 취향?
│   │       └─ drop
│   ├─ off-grid / 팔레트 외 색 / AI-slop 레이아웃?
│   │   └─ drop
│   └─ 도메인 정당성 주장 가능?
│       └─ refactor + needsDecision: true
│
├─ absent?
│   ├─ 프로젝트에서만 필요한 도메인 값?
│   │   └─ keep + domainException
│   └─ 그냥 이상한 값?
│       └─ drop
│
└─ missing-seed?
    ├─ 현재 없지만 화면 구성상 필요한 컴포넌트?
    │   └─ import (예: Snackbar가 없어서 alert 쓰는 중)
    └─ 필요성 불명?
        └─ skip (report에 "Consider"로만 언급)
```

## 분류별 상세 규칙

### Keep

**언제 Keep인가**:
- Seed 토큰/컴포넌트를 이미 바르게 사용 중
- 도메인 상 정당한 일탈 (사용자가 `domainException`으로 확정)
- Seed에 대응물이 없지만 프로젝트 논리상 필요

**Keep 기록**:
- 도메인 예외만 plan.json에 개별 item으로 남김
- 바른 사용은 report.md의 요약 섹션에 카운트·샘플만 (`"이미 올바른 토큰 사용: 142건"`)

### Refactor

**기본적으로 1:1 치환**. current → target을 명시.

**서브카테고리**:
- `token-replace` — 하드코딩 값 → Seed 토큰 (`#ff6f0f` → `var(--seed-color-bg-brand-solid)`)
- `component-swap` — 네이티브/커스텀 → Seed 컴포넌트 (`<button>` → `<ActionButton>`)
- `variant-fix` — 잘못된 variant → 맞는 것 (2개 `brandSolid` → `neutralWeak` + `brandSolid`)
- `accessibility-fix` — 누락된 aria/label 보충
- `paired-change` — 쌍으로 바뀌어야 하는 값 (font-size + line-height)

각 refactor는 `confidence` 필드를 가진다:
- `0.9+` — 기계적 치환 가능, 자동 apply 후보
- `0.7~0.9` — 대부분 맞지만 변환 후 검토 권장
- `0.5~0.7` — 사용자 확인 필수, `needsDecision: true`
- `0.5 미만` — 분류를 drop으로 강등하고 원인 기록

### Drop

**제거 대상**. apply가 해당 속성/요소를 지우거나 단순화.

**서브카테고리**:
- `hardcoded-value` — 토큰 없는 하드코딩 (교체 대상이 애매하면 Drop)
- `anti-pattern` — anti-patterns.md hit
- `redundant-decoration` — 장식적 shadow, 의미 없는 gradient
- `native-element` — `<div role="button">` 같은 네이티브 오용 (Refactor 가능하면 Refactor 우선)

**Drop은 파괴적**이므로 기본 `needsDecision: true` — 단, anti-pattern 확실한 것(버튼 shadow 등)은 `false` 가능.

### Import

**Seed에서 새로 들여올 것**.

**서브카테고리**:
- `dependency` — `@seed-design/*` 패키지 추가
- `component` — 특정 컴포넌트 도입 (예: Snackbar)
- `token-file` — CSS 토큰 파일 import 추가
- `style-reset` — Seed의 base.css 포함

**탐지 원천**:
- 현재 화면에서 anti-pattern로 대체되고 있는 것 (`alert()` → Snackbar)
- decision-matrix에서 권장되는데 없는 것

## domain exception 처리

**절대 기계가 단독 판정하지 않는다.** 다음이 보이면 사용자에게 구체 질문:

- 브랜드 컬러로 의심되는 비-당근-오렌지 계열 색
- 앱 도메인 고유 아이콘 세트
- Seed에 없는 특수 컴포넌트 (예: 지도 오버레이, 캘린더 등)
- 레거시 코드지만 비즈니스상 이유로 유지 필요해 보이는 것

질문 형식은 `report-format.md`의 "Conflict table" 규격을 따라 한번에 모아 묻는다 — 항목마다 개별 질문하지 않는다.

## 우선순위·영향도

각 item에 `risk`를 매긴다. apply 단계에서 리스크 낮은 순서로 staging.

| risk | 예 |
|------|-----|
| `low` | 토큰 치환, variant 수정, aria-label 추가 |
| `medium` | 커스텀 컴포넌트 → Seed 스왑, 레이아웃 관용구 교체 |
| `high` | 컴포넌트 제거·재배치, 페이지 구조 변경, 의존성 추가 |

추가로 `impact`:
- `localized` — 파일 1~2개
- `feature-wide` — 특정 기능 모듈 전체
- `app-wide` — 토큰 도입 같은 앱 전역

`needsDecision: true`인 모든 항목은 report의 Conflict table에 필수 등재.

## 혼합 사례 가이드

### "기존에 Button 컴포넌트가 있는데 Seed ActionButton을 도입"

- 기존 `<Button>` 정의 파일 → `refactor` (내부 구현을 ActionButton 래퍼로 교체)
- 각 호출부 → `keep` (API 호환되면 손 안 댐) 또는 `refactor` (API 불일치 시 props 매핑)

### "하드코딩 `#ff6f0f`가 50곳, semantic `--brand` 도 있음"

- 50곳 하드코딩 → `refactor` (→ `var(--seed-color-bg-brand-solid)`)
- `--brand` 정의 자체 → `refactor` (Seed 값으로 매핑) 또는 `drop` (중복이면)

### "모노레포에서 app-A만 Seed 쓰고 app-B는 아직"

- app-A 인벤토리 → 대부분 Keep + 청소성 Refactor
- app-B 인벤토리 → Import 비중 큼 + 다량 Refactor
- 패키지별 `plan.json`을 따로 만들 것 (`plan-schema.md`의 패키지 분리 규칙)
