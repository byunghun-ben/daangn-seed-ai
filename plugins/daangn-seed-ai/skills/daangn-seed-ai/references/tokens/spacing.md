# Spacing — 4px Rhythm

Seed의 간격 토큰은 `$dimension.x{n}` 형식. **모든 값은 4px의 배수**(절반 단계 `x0_5`, `x1_5` 등은 2px 단위). 제멋대로 간격(9px, 15px 등)은 AI-slop의 대표 증상이다.

## 스케일

| 토큰 | px | 주 용도 |
|------|-----|---------|
| `x0_5` | 2  | 아이콘-텍스트 간격(극소), 내부 마이크로 간격 |
| `x1`   | 4  | 아이콘-텍스트 간격, Badge 내부 |
| `x1_5` | 6  | Chip 내부 gap |
| `x2`   | 8  | 버튼 내부 gap, 인라인 요소 간격 |
| `x2_5` | 10 | 중간 gap |
| `x3`   | 12 | 버튼 패딩, List item gap |
| `x3_5` | 14 | 입력 필드 세로 패딩 |
| `x4`   | 16 | **기본 카드 패딩, 섹션 내부 gap** |
| `x4_5` | 18 | — |
| `x5`   | 20 | 섹션 여백 |
| `x6`   | 24 | 큰 섹션 gap |
| `x7`   | 28 | — |
| `x8`   | 32 | 페이지 상하 여백 |
| `x9`   | 36 | — |
| `x10`  | 40 | 큰 여백 |
| `x12`  | 48 | 화면 단락 분리 |
| `x13`  | 52 | — |
| `x14`  | 56 | — |
| `x16`  | 64 | 최상위 섹션 분리 |

## 레벨별 기본값

| 레벨 | 권장 간격 토큰 |
|------|---------------|
| 아이콘 ↔ 텍스트 (버튼 내부) | `x1` (4px) ~ `x2` (8px) |
| 폼 필드 내부 (좌우) | `x3` (12px) ~ `x4` (16px) |
| 폼 필드 사이 (세로) | `x3` (12px) ~ `x4` (16px) |
| 카드 내부 패딩 | `x4` (16px) |
| 카드-카드 gap | `x2` (8px) ~ `x3` (12px) |
| 리스트 item 세로 패딩 | `x3` (12px) ~ `x4` (16px) |
| 섹션-섹션 gap | `x6` (24px) ~ `x8` (32px) |
| 페이지 좌우 여백 (모바일) | `x4` (16px) |
| 페이지 좌우 여백 (데스크탑) | `x6` (24px) |
| 모달 내부 패딩 | `x5` (20px) ~ `x6` (24px) |

## 수직 리듬

전체 화면의 수직 리듬을 `x4` (16px) 또는 `x6` (24px) 배수로 맞추면 일관성이 확보된다. 헤더 → 히어로 → 리스트 → 푸터 사이 간격을 자의적으로 두지 말고 공통 토큰 사용.

## Anti-patterns

```
❌ padding: 15px;                  # 4px 그리드 밖
❌ padding: 16px 12px 20px 8px;    # 제멋대로 4값
❌ gap: 9px;                       # 4px 그리드 밖
❌ margin-top: 17px;               # 4px 그리드 밖

✅ padding: var(--seed-dimension-x4);
✅ padding: var(--seed-dimension-x4) var(--seed-dimension-x3);
✅ gap: var(--seed-dimension-x2);
```

## CSS 변수 빠른 참조

```
--seed-dimension-x0_5  : 2px
--seed-dimension-x1    : 4px
--seed-dimension-x2    : 8px
--seed-dimension-x3    : 12px
--seed-dimension-x4    : 16px
--seed-dimension-x5    : 20px
--seed-dimension-x6    : 24px
--seed-dimension-x8    : 32px
--seed-dimension-x10   : 40px
--seed-dimension-x12   : 48px
--seed-dimension-x16   : 64px
```
