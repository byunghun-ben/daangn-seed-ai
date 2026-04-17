# Diff Rules — current vs Seed 비교

인벤토리의 각 관찰치를 Seed 기준과 매칭해서 "같음 / 유사 / 충돌 / 없음"을 판정. 이게 분류(classification)의 입력이 된다.

## 판정 상태

| 상태 | 의미 | 전형적 분류 |
|------|------|------------|
| `match` | Seed 토큰/컴포넌트와 정확히 일치 | Keep |
| `near` | 의미는 같으나 표현이 다름 (예: `#ff6f0f` = `bg.brand-solid`) | Refactor |
| `conflict` | Seed 철학과 반대 (예: 버튼 shadow, div role=button) | Drop 또는 Refactor |
| `absent` | Seed에 대응물 없음 — 프로젝트 고유 | Keep (domain) 또는 Drop |
| `missing-seed` | Seed에 있지만 프로젝트는 없음 | Import |

## 1. Color diff

### 단계 1 — semantic 직접 매칭

`var(--seed-color-fg-neutral)` 같은 semantic 토큰 → `match`. 끝.

### 단계 2 — 팔레트 SHA 매칭

HEX/rgb 값을 Seed `color.json`의 palette + semantic 값과 동일성 비교. 정확히 같으면:
- palette 직접 사용 (`--seed-color-palette-gray-900`) → `near` (semantic으로 바꾸라는 Refactor)
- semantic 값과 일치하는 원시 HEX (`#212124` == `fg.neutral`) → `near`

### 단계 3 — 의미 추론

Tailwind `bg-primary` · `--brand` · `--accent` 같은 의미 이름이 있고 값이 당근 오렌지 계열이면 `near` (매핑 후보: `bg.brand-solid`).

의미 이름인데 값이 당근 오렌지가 아니면 → `conflict` 후보지만 **domain exception 가능성 높음** → `needsDecision`.

### 단계 4 — AI-slop 색 탐지

다음 특징이 있으면 `conflict`.
- 파스텔 톤 3개 이상 연속 (채도 낮고 명도 높은 색 배열)
- 그라디언트 내 색 (Seed는 거의 안 씀 — Fab의 몇 가지만 예외)
- 채도 0~5% 사이 회색 10종 이상 — 제각각 회색 (Seed는 neutral 1계열만)

### 매칭 결과

```json
{
  "kind": "color",
  "current": "#ff6f0f",
  "diff": "near",
  "target": "var(--seed-color-bg-brand-solid)",
  "rationale": "값이 Seed palette의 carrot-500과 동일"
}
```

## 2. Spacing diff

### 단계 1 — 온-그리드 체크

값이 4px 배수인가? 아니면 `conflict` (off-grid).

### 단계 2 — Seed 토큰 매핑

4px 배수라면 Seed `dimension.json` 값과 비교.

| 값 | Seed | diff |
|----|------|------|
| 4px | x1 | near |
| 8px | x2 | near |
| 12px | x3 | near |
| 16px | x4 | near |
| 24px | x6 | near |
| 32px | x8 | near |
| 48px | x12 | near |
| 기타 | 없음 | absent |

토큰으로 이미 쓰고 있으면(`padding: var(--seed-dimension-x4)`) `match`.

### 단계 3 — 문맥 권장값

`composition.md` 표준 패턴에 비추어 "의미적으로 맞는 값인가" 확인.
- 섹션 간격 `x6(24px)`, 필드 간격 `x3~x4`, 헤더 내부 `x2` 등
- 현재 값이 그리드 상이지만 의미적으로 어긋나면(예: 섹션 간격이 `x1=4px`) `near` + `suggestion` 제공

## 3. Typography diff

### 매칭

font-size 값 → Seed `font-size.json`(`t1`~`t10`) 비교. 정확히 일치 → `match` 후보.

### 페어링

font-size와 line-height가 Seed 토큰 쌍인지 확인:
- `size: t4` + `line-height: t4` → `match`
- `size: t4` + `line-height: 1.5` (primitive) → `near` (pairing-broken)

### font-weight

Seed는 weak/regular/medium/bold 중심. `900`, `100` 같은 극단값은 `conflict`.

## 4. Radius diff

```
0px       → r0
2px       → r1
4px       → r2
8px       → r3 후보
12px      → r3
16px      → r4
20px      → r4 후보 (큰 쪽)
24px      → r5
50% · 9999 → full
기타       → near / absent
```

한 화면에 3종 이상 radius가 섞여 있으면 composition-level `conflict` 추가.

## 5. Shadow diff

Seed shadow는 `shadow.json` 몇 개만 정의. 그 외 모든 shadow는 `conflict`. 단:
- 카드/Dialog/BottomSheet 문맥 → `near` (Seed의 bottomSheet/dialog shadow로 매핑 가능)
- 버튼에 shadow → 항상 `conflict`

## 6. Component diff

### 네이티브 → Seed 매핑 후보

| current | target | diff |
|---------|--------|------|
| `<button>` | `ActionButton` | near |
| `<input type="text">` | `TextField` | near |
| `<select>` | `SelectBox` 또는 `RadioGroup` (옵션 수 기반) | near |
| `<dialog>` · `role="dialog"` | `Dialog` | near |
| `<div role="button">` | `ActionButton` | conflict (anti-pattern 2) |
| 커스텀 `<Button>` | `ActionButton` | near (도메인 컴포넌트 치환) |
| 커스텀 `<Modal>` | `Dialog` 또는 `BottomSheet` | near (결정 필요) |

### 커스텀 컴포넌트 → Seed 매핑 판정

프로젝트 내 컴포넌트 정의를 간략히 읽어서 "같은 역할"인지 판정. 판정 근거가 약하면 `needsDecision`.

### Variant 충돌

이미 Seed를 쓰는데 variant가 anti-pattern (예: `brandSolid` 2개 나란히) → `conflict` + `anti-pattern #4` 참조.

## 7. Layout diff

| 관찰 | 판정 |
|------|------|
| `<div style="display:flex">` | `near` → Stack/Flex 치환 후보 |
| 과도한 중앙 정렬 | `conflict` (anti-pattern #13) |
| 인라인 스타일로 gap | `near` → 토큰화 Refactor |

## 8. Anti-pattern Hit

anti-patterns.md의 항목 hit은 기본적으로 `conflict`. 단:
- 도메인 정당성이 있으면(`Chip` 로직이 실제로는 작고 특이한 필터) `needsDecision`

## 9. 충돌 해결 우선순위 (conflict만 해당)

같은 파일/라인에 여러 diff가 겹치면 우선순위:

1. **Semantic correctness** (접근성·라벨) — 가장 먼저 (aria-label 누락, Dialog.Title 누락)
2. **Design token** — 그 다음 (색·간격·타이포)
3. **Component choice** — 그 다음 (네이티브 → Seed)
4. **Layout idiom** — 마지막 (중앙정렬, radius 혼재)

Apply 단계의 staging 순서와 반대임에 유의 — diff 우선순위는 "중요도", staging은 "리스크".

## 10. Diff 결과 포맷

각 diff 결과는 내부적으로 아래 형태:

```json
{
  "id": "text-hardcoded-14px-Header",
  "kind": "typography",
  "field": "font-size",
  "current": "14px",
  "diff": "near",
  "target": "var(--seed-font-size-t4)",
  "pairedChange": {
    "field": "line-height",
    "target": "var(--seed-line-height-t4)"
  },
  "rationale": "t4가 본문 기본값 + 한국어 line-height 조정 반영",
  "occurrences": [...],
  "antiPatternId": 7
}
```

`pairedChange`는 "같이 바뀌어야 정상인 값" — line-height가 font-size와 쌍으로 움직이는 등.
