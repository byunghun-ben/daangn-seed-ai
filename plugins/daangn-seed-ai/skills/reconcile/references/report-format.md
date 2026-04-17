# report.md Format

사람이 읽는 의사결정 문서. plan.json과 동기화되지만 사람이 훨씬 빨리 파악할 수 있게 구성.

## 목적

- 리뷰어가 5분 안에 "전체 규모"와 "결정 필요 항목"을 파악
- 애매한 판정에 사용자가 결정을 줄 수 있도록 제시
- `reconcile-apply`를 돌릴지 말지 판단 근거 제공

## 템플릿

```markdown
# Seed Reconcile Report

Generated: 2026-04-17 12:34 KST
Project: apps/web (detected: Next.js + Tailwind, Seed partial)

## 한눈에

| 분류 | 건수 | 예상 변경 파일 |
|------|------|---------------|
| Keep | 142 | — |
| Refactor | 58 | 23 |
| Drop | 12 | 9 |
| Import | 3 | package.json + 2 |
| **Needs decision** | **7** | — |

예상 규모: 변경 파일 약 32개, 자동 적용 가능 41건, 수동 검토 17건.

## 결정이 필요한 항목 (7)

| # | 항목 | 현재 | 제안 | 왜 결정 필요 |
|---|------|------|------|-------------|
| 1 | 브랜드 컬러 | `#5b8def` (blueish) | `bg.brand-solid` (당근 오렌지)로 교체 또는 도메인 유지 | 당근 오렌지가 아님 — 도메인 브랜드 확인 필요 |
| 2 | 커스텀 `<Modal>` | `src/ui/Modal.tsx` | `Dialog`(중앙 모달) 또는 `BottomSheet`(모바일 슬라이드) | API·UX 요구에 따라 선택 |
| 3 | `<select>` 15곳 | native select | 옵션 3개 이하는 `RadioGroup`, 이상은 `SelectBox` | 실제 옵션 수를 파일별로 확인 필요 |
| ... | ... | ... | ... | ... |

→ 각 항목을 확정한 뒤 `/daangn-seed-ai:reconcile`을 한 번 더 돌리거나, apply 단계에서 결정을 전달해주세요.

## Keep (142)

이미 Seed 철학과 맞는 부분. 변경 없음.

- **토큰 올바른 사용**: `var(--seed-color-*)` 98건, `var(--seed-dimension-*)` 30건, `var(--seed-font-size-*)` 14건
- **Seed 컴포넌트 사용**: ActionButton 22, TextField 8, Dialog 3
- **도메인 예외**: 0 (아래 Needs decision에서 확정되면 이동)

## Refactor (58)

### Token replace (42)

색·간격·타이포·반경 중 하드코딩 또는 primitive 사용을 semantic 토큰으로 치환.

| 현재 | → | 대상 | 건수 | 신뢰도 |
|------|---|------|------|--------|
| `#ff6f0f` | → | `var(--seed-color-bg-brand-solid)` | 23 | 0.95 |
| `padding: 15px` | → | `var(--seed-dimension-x4)` (16px) | 8 | 0.90 (off-grid, 16px로 정규화) |
| `font-size: 14px` + `line-height: 1.5` | → | `font-size-t4` + `line-height-t4` | 6 | 0.92 |
| ... | | | | |

예시 (1/42):
- `src/components/Header.tsx:42` — `background: '#ff6f0f'` → `background: var(--seed-color-bg-brand-solid)`

### Component swap (11)

| 현재 | → | 대상 | 건수 |
|------|---|------|------|
| `<button>` | → | `ActionButton` | 7 |
| `<input type="text">` | → | `TextField` | 4 |

### Variant / accessibility fix (5)

| 문제 | 해결 | 건수 |
|------|------|------|
| `brandSolid` 2개 나란히 | 2번째 → `neutralWeak` | 2 |
| iconOnly 버튼에 aria-label 없음 | 추가 | 3 |

## Drop (12)

제거 또는 단순화 대상.

| 패턴 | 이유 | 건수 |
|------|------|------|
| 버튼에 box-shadow | Seed는 flat 지향 (anti-pattern #13) | 5 |
| `<div role="button">` | 네이티브 오용 (anti-pattern #2) — Drop 후 ActionButton 적용 | 4 |
| 중앙정렬 flex 연쇄 | AI-slop 레이아웃 (anti-pattern #13) | 3 |

## Import (3)

Seed에서 들여와야 할 것.

| 항목 | 이유 |
|------|------|
| `@seed-design/react-load` 패키지 | 현재 없음, 토큰·컴포넌트 사용에 필수 |
| `@seed-design/css/base.css` import | 토큰 변수 주입용 |
| `Snackbar` 도입 | 현재 `alert()` 3곳 사용 중 — 일시 피드백용 Snackbar로 대체 |

## 적용 순서 (권장 staging)

다음 순서로 리스크가 커진다. apply는 각 단계별 gate를 거쳐 넘어간다.

1. **Install Seed** (import 3건) — 패키지 + base.css — lint-pass gate
2. **Token replace - low risk** (refactor 42건) — 색·간격·타이포 토큰 치환 — lint-pass
3. **Accessibility fixes** (refactor 3건) — aria-label 보충 — lint-pass
4. **Variant fixes** (refactor 2건) — 버튼 variant 정리 — tests-pass
5. **Component swap** (refactor 11건) — `<button>` → ActionButton 등 — tests-pass + manual
6. **Drop** (12건) — AI-slop 패턴 제거 — manual

Needs-decision 7건은 staging에 포함하지 않았음 — 확정 후 plan 재생성.

## 스캔 한계 (경고)

- Vue SFC의 `<style scoped>` 내부 12개 값 추출 실패 (`src/components/Legacy*.vue`)
- 동적 props spread(`<Button {...rest}>`) 4곳 — 정적 분석 불가, 수동 검토 권장

## 다음 단계

1. 위 "결정 필요" 7건에 답변해서 `.reconcile/domain-exceptions.md`에 적거나, 이 리포트에 직접 표시 후 reconcile을 다시 실행
2. 확정되면 `/daangn-seed-ai:reconcile-apply`로 staging 적용
3. 대규모 변경이면 단계별로 실행 — apply는 stage 단위로도 실행 가능
```

## 스타일 가이드

- **건수는 반드시 숫자로** — "많음" 같은 표현 금지
- **파일 경로는 구체적으로** — 대표 1~2개 경로 + 카운트
- **"왜"가 빠지지 않게** — rationale이 각 행에 한 줄씩
- **Needs decision 섹션은 최상단 결정 표 근처에** — 사용자가 리포트를 닫아도 무엇을 해야 할지 안다
- **안정적인 정렬** — items는 category → kind → file 순으로 정렬해서 재실행 시 diff 최소화

## plan.json과의 관계

report는 plan.json의 재료를 사람 친화적으로 포맷할 뿐. 없는 정보를 추가로 만들지 않는다.

- report에 표시되는 모든 숫자는 `summary` 또는 `items` 집계에서 도출
- "예시" 줄에 보이는 파일 경로는 items[].occurrences[0]
- 스토리 없이 "123건" 같은 숫자만 있는 행은 피한다 — 최소한 대표 예시 1개 동반
