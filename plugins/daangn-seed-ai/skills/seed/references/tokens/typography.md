# Typography

Seed의 타이포 스케일은 t1(가장 작음) → t10(가장 큼)의 10단계. 각 단계는 `font-size` + `line-height` + `font-weight`의 조합으로 의미가 완성된다.

## 스케일 — Rem(dynamic) vs Px(static)

| 토큰 | rem (dynamic) | px (static) | 주 용도 |
|------|-------|------|---------|
| `t1` | 0.6875rem | 11px | 배지·캡션 (극소) |
| `t2` | 0.75rem   | 12px | 캡션, 보조 메타 |
| `t3` | 0.8125rem | 13px | 작은 보조 텍스트 |
| `t4` | 0.875rem  | 14px | 보조 본문, 라벨 |
| `t5` | 1rem      | 16px | **기본 본문 (body)** |
| `t6` | 1.125rem  | 18px | 강조 본문, 작은 제목 |
| `t7` | 1.25rem   | 20px | 섹션 제목 |
| `t8` | 1.375rem  | 22px | 페이지 제목 |
| `t9` | 1.5rem    | 24px | 큰 제목 |
| `t10`| 1.625rem  | 26px | 최상위 제목 |

### rem vs px 선택

- **rem (기본)** — 사용자의 시스템 폰트 스케일링(iOS 접근성)을 따라 자동 축소/확대. 제품 UI 전반에서 이것을 사용.
- **px (static)** — 스케일링을 무시해야 하는 경우 (레이아웃이 깨지면 안 되는 고정 영역, 이미지에 박힌 텍스트 등). 남용 금지.

## 페어링 규칙 — font-size × line-height

같은 인덱스끼리 짝을 맞춘다. `font-size.t5`에는 `line-height.t5` (1.375rem / 22px).

| 토큰 | font-size | line-height | 비율 |
|------|-----------|-------------|------|
| t1 | 11px | 15px | 1.36 |
| t2 | 12px | 16px | 1.33 |
| t3 | 13px | 18px | 1.38 |
| t4 | 14px | 19px | 1.36 |
| t5 | 16px | 22px | 1.375 |
| t6 | 18px | 24px | 1.33 |
| t7 | 20px | 27px | 1.35 |
| t8 | 22px | 30px | 1.36 |
| t9 | 24px | 32px | 1.33 |
| t10| 26px | 35px | 1.35 |

### 왜 line-height가 한국어에 중요한가

한국어는 라틴 문자 대비 x-height가 높고 세로 공간을 더 먹는다. Seed의 line-height는 한국어 기준으로 조정되어 있어 그대로 쓰면 된다. 개별적으로 `line-height: 1.5` 같은 하드코딩을 하면 한국어에서 좁아 보이거나, 영어에서 과하게 벌어진다.

## Font Weight

```
regular    → 400   (일반 본문)
medium     → 500   (약한 강조)
bold       → 700   (강조, 버튼 라벨)
```

## 조합 레시피 — 의미별 타이포

| 의미 | font-size | line-height | font-weight | 용도 |
|------|-----------|-------------|-------------|------|
| Display | t10 | t10 | bold | 랜딩·온보딩 대표 제목 |
| Title 1 | t9 | t9 | bold | 페이지 타이틀 |
| Title 2 | t8 | t8 | bold | 섹션 대제목 |
| Title 3 | t7 | t7 | bold | 카드 제목, 모달 제목 |
| Subtitle | t6 | t6 | bold | 서브 헤딩 |
| Body | t5 | t5 | regular | **기본 본문** |
| Body Strong | t5 | t5 | bold | 강조 본문 |
| Body Small | t4 | t4 | regular | 보조 본문, 라벨 |
| Caption | t3 | t3 | regular | 작은 설명, 메타 |
| Caption Small | t2 | t2 | regular | 최소 크기 캡션 |
| Label | t1 | t1 | bold | 배지, 극소 라벨 |

## Anti-patterns

```
❌ font-size: 14px;                              # 하드코딩
❌ font-size: 1rem; line-height: 1.5;            # 페어링 규칙 위반
❌ font-size: t5; line-height: t3;               # 인덱스 불일치
❌ font-size: t8; font-weight: regular;          # 제목에 regular (대비 부족)

✅ font-size: var(--seed-font-size-t5);
   line-height: var(--seed-line-height-t5);
   font-weight: 400;
```

## CSS 변수 빠른 참조

```css
/* 본문 */
font-size: var(--seed-font-size-t5);
line-height: var(--seed-line-height-t5);
font-weight: 400;

/* 섹션 제목 */
font-size: var(--seed-font-size-t7);
line-height: var(--seed-line-height-t7);
font-weight: 700;
```
