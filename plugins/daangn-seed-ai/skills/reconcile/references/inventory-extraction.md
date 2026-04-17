# Inventory Extraction — 디자인 값 추출 방법

스캔 타겟에서 "디자인 결정"에 해당하는 값·패턴을 모두 뽑아 올린다. 결과는 내부적으로 다음 카테고리로 저장.

```
color · spacing · typography · radius · shadow ·
component-usage · layout-idiom · anti-pattern-hit
```

## 공통 원칙

- **Grep 우선, AST는 필요할 때만** — 디자인 값은 대부분 문자열·리터럴로 존재해서 정규식으로 충분
- **파일당 occurrences 최대 3건** 저장, 나머지는 카운트만. 전체 원본은 `.reconcile/inventory-raw.json`
- **라인 번호 반드시 기록** — 사용자가 즉시 검증 가능해야 함
- **중복 키 집계** — 같은 `#ff6f0f`가 47곳 나오면 한 항목에 `count: 47`

## 1. Color 추출

### HEX

```regex
#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b
```

### rgb / rgba / hsl / hsla

```regex
\b(rgb|rgba|hsl|hsla)\s*\(\s*[^)]+\)
```

### CSS 변수 (semantic 여부 판정)

```regex
var\(--[a-zA-Z0-9-]+\)
```

→ `--seed-color-*`로 시작하면 semantic 사용. 아니면 원본 프로젝트 변수로 기록 후 이름 분석:
- `--primary`, `--accent`, `--bg-*`, `--text-*` 같은 의미 이름 → `project-semantic`
- `--gray-500`, `--blue-400` → `project-primitive`
- `--color-1`, `--c-a` → `project-opaque` (의미 불명)

### Tailwind 클래스

```regex
\b(bg|text|border|ring|outline|decoration|divide|shadow|from|via|to|accent|caret|placeholder|fill|stroke)-(\[[^\]]+\]|[a-z]+-?[0-9]*)
```

분류:
- `bg-white` · `text-gray-500` 같은 기본 팔레트 → `tailwind-primitive`
- `bg-[#ff6f0f]` 같은 arbitrary value → `tailwind-arbitrary` (하드코딩 취급)
- `bg-primary` · `text-muted` 같은 커스텀 → `tailwind-semantic`
- `tailwind.config`의 `theme.extend.colors`에서 정의 여부 교차 확인

### 인라인 스타일

```regex
style=\{\{[^}]*\}\}
styled\.\w+`[^`]+`
css`[^`]+`
```

위 블록을 찾은 뒤 내부에서 color/bg/border를 다시 추출.

## 2. Spacing 추출

4px 그리드 위반 탐지가 핵심.

### 픽셀 값

```regex
\b(padding|margin|gap|top|right|bottom|left|width|height|inset)[^:]*:\s*(-?\d+)px
```

**판정 로직**:
- Seed 토큰으로 매핑되는 값 (`2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 80, 96, 128`) → 후보 매핑
- 위 외의 숫자 (`15, 17, 23, 9px` 등) → `off-grid` 플래그 — Drop 후보

### rem

`rem` 값을 16배해서 픽셀 기준으로 동일 판정.

### Tailwind spacing

```regex
\b(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y|top|right|bottom|left|inset|w|h|size)-(\[[^\]]+\]|[0-9]+(\.5)?)
```

- `p-4` → `0.25rem * 4 = 16px` → Seed `dimension.x4` 후보
- `p-[17px]` → arbitrary, off-grid → Drop 후보

Seed dimension 토큰 맵은 `skills/seed/references/tokens/dimension.json` 참조.

## 3. Typography 추출

### font-size

```regex
font-size:\s*(\d+)(px|rem|em)
\btext-(xs|sm|base|lg|xl|[2-9]xl)\b
\btext-\[\d+(px|rem)\]
```

Seed 스케일 (`t1`~`t10`)과 비교. `font-size.json` 확인.

### font-weight

```regex
font-weight:\s*(\d+|bold|normal|lighter|bolder)
\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b
```

### line-height + font-size 페어링

Seed는 font-size와 line-height가 토큰 쌍으로 묶여 있다. 쌍이 깨진 경우(예: `t4` size + 임의 `line-height: 1.5`) `pairing-broken` 플래그.

## 4. Radius 추출

```regex
border-radius:\s*(\d+)(px|rem|%)
\brounded(-[a-z0-9]+)?\b
\brounded-\[[^\]]+\]
```

Seed radius: `r0, r1, r2, r3, r4, r5, full`. 10px/20px 같은 값은 `r3`(12px) 또는 `r4`(16px)로 매핑 후보.

## 5. Shadow 추출

```regex
box-shadow:\s*[^;]+
\bshadow(-[a-z0-9]+)?\b
```

Seed는 shadow를 최소한만 쓴다 — 그림자 발견은 대부분 `needsDecision`.

## 6. Component Usage 추출

네이티브 요소 + 도메인 컴포넌트 + Seed 컴포넌트를 모두 센다.

### 네이티브 (AI-slop 후보)

```regex
<(button|input|select|textarea|form|dialog)[\s>]
role=["'](button|dialog|alert|status)["']
```

→ Drop/Refactor 후보. `anti-patterns.md`의 2번 항목과 매핑.

### 사용자 정의 버튼·입력

프로젝트 내 `components/` 아래 `Button`, `Input`, `Modal` 같은 이름의 컴포넌트 정의 찾기. 이들이 Seed 대체재일 가능성 높음.

### Seed 컴포넌트

```regex
from ["']@seed-design/react-[^"']+["']
from ["']@karrotmarket/react-[^"']+["']
<(ActionButton|TextField|Callout|Snackbar|Dialog|BottomSheet|SelectBox|RadioGroup|Checkbox|List|Avatar|Badge|Chip|Fab)[\s/>]
```

→ 이미 Seed 사용 중인 증거. Keep 베이스라인.

## 7. Layout Idiom 추출

AI-slop 특유의 레이아웃 패턴을 탐지.

| 패턴 | 정규식 / 조건 |
|------|---------------|
| 중앙 정렬 flex 남발 | `justify-center.*items-center` 또는 `justify-content:\s*center.*align-items:\s*center` 빈도가 전체 flex의 40% 초과 |
| div role=button | `role=["']button["']` |
| 그라디언트 남발 | `linear-gradient\(` 출현 빈도 + `bg-gradient-` Tailwind 빈도 |
| 과도한 radius | `border-radius` 값 중 20px 이상이 전체의 30% 초과 |
| 버튼 shadow | `button.*shadow` 근접 매칭 |

## 8. Anti-pattern Hit 추출

`skills/seed/references/anti-patterns.md`의 13개 항목을 grep 규칙으로 옮겨서 돌린다. 각 항목의 "❌" 블록이 그대로 탐지 패턴.

각 hit에 대해:
- `antiPatternId`: anti-patterns.md 섹션 번호 (1~14)
- `title`: 해당 섹션 제목
- `suggestion`: 해당 섹션의 "✅" 블록

## 9. 집계·정규화

추출 원본을 `.reconcile/inventory-raw.json`에 덤프한 뒤, 정규화해서 `plan.json`으로 넘길 항목을 만든다.

정규화 규칙:
- 같은 값(예: `#ff6f0f`) 47곳 → 1개 item, `occurrences`에 앞 3건 + `more: 44`
- 같은 anti-pattern id 여러 번 hit → 1개 item, hits 집계
- Keep 후보(`var(--seed-color-*)`, Seed 컴포넌트 사용)는 집계하되 item 생성은 생략 가능 — summary 섹션에만 반영

## 10. 한계 · fallback

- JSX 속성이 동적(`<Foo {...spread}>`)이면 AST로도 정확히 못 잡음 → 제외하고 warning에 기록
- CSS-in-JS에서 템플릿 리터럴 보간(`${props => props.color}`)은 스킵
- Runtime-computed 값(`var(--x, ${fallback})`)은 있는 그대로 기록

위 한계는 `.reconcile/inventory-raw.json`의 `limitations` 배열에 누적.
