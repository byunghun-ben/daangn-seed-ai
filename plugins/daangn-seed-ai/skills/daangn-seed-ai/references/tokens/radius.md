# Radius

## 스케일

| 토큰 | px | 주 용도 |
|------|-----|---------|
| `r0_5` | 2  | 마이크로 강조, input 내부 뱃지 |
| `r1`   | 4  | 작은 칩, 배지 |
| `r1_5` | 6  | — |
| `r2`   | 8  | 작은 버튼, Input |
| `r2_5` | 10 | — |
| `r3`   | 12 | **기본 버튼, 카드 (표준 radius)** |
| `r3_5` | 14 | — |
| `r4`   | 16 | 큰 카드, 모달 |
| `r5`   | 20 | 중앙형 오버레이 |
| `r6`   | 24 | BottomSheet 상단 |
| `full` | 9999 | Pill 버튼, Avatar, Chip (완전 원형) |

## 컴포넌트별 기본 radius

| 컴포넌트 | radius |
|----------|--------|
| ActionButton (기본) | `r3` (12px) |
| FieldButton / Input | `r2` (8px) ~ `r3` (12px) |
| Chip, Tag (알약형) | `full` |
| Avatar | `full` |
| Badge | `full` (숫자형) / `r0_5` (사각형 라벨) |
| Card, List item | `r3` (12px) ~ `r4` (16px) |
| Dialog, Modal | `r4` (16px) ~ `r5` (20px) |
| BottomSheet | 상단 `r6` (24px), 하단 0 |
| Snackbar, Toast | `r3` (12px) |
| Image thumbnail | `r2` (8px) |

## 원칙

1. **일관성 우선** — 한 화면에 3종 이상의 서로 다른 radius 혼재 금지. 기본 `r3` + 원형 `full`로 대부분 커버된다.
2. **크기와 radius 비례** — 작은 요소(< 32px 높이)는 `r2`, 표준(32-48px)은 `r3`, 큰 카드/모달은 `r4` 이상.
3. **내부 요소는 더 작게** — 카드(`r4`) 안의 이미지는 `r2`~`r3`으로 줄여서 시각적으로 "안에 있음"이 드러나게.

## Anti-patterns

```
❌ border-radius: 5px;          # 스케일 밖
❌ border-radius: 10px 10px 0 0;   # BottomSheet가 아닌데 상단만 둥글게
❌ 한 화면에 r2, r3, r5, full 혼재

✅ border-radius: var(--seed-radius-r3);
✅ border-radius: var(--seed-radius-full);
```
