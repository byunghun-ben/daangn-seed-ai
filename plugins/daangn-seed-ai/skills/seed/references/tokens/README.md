# Tokens

Seed의 토큰은 3티어로 구성된다. Claude가 토큰을 사용할 때는 **semantic 우선 → scale → palette**가 기본 원칙이다.

## 티어 구조

| 티어 | 예시 | 사용 규칙 |
|------|------|----------|
| **Primitive (palette)** | `$color.palette.gray-500`, `$color.palette.carrot-500` | **직접 사용 금지**. 디자인 시스템 확장·정의 시에만. 앱 코드에서 primitive를 박으면 테마 전환·리브랜딩이 불가능해진다. |
| **Scale** | `$dimension.x2` (8px), `$font-size.t7` (20px/1.25rem), `$radius.r3` (12px) | 레이아웃·타이포 등 역할이 "크기 자체"인 곳에서 사용. 수학적 비율이 중요한 경우. |
| **Semantic** | `$color.bg.brand-solid`, `$color.fg.neutral-muted` | **기본 선택지**. 역할(brand/critical/neutral/positive/warning/informative)과 강도(solid/weak/contrast)가 드러남. 테마·다크모드·리브랜딩에 자동 대응. |

## 사용 우선순위

1. **컴포넌트 내부 사용** → semantic 토큰 (`color.bg.*`, `color.fg.*`, `color.stroke.*`)
2. **간격/크기** → scale (`dimension.*`, `radius.*`, `font-size.*`, `line-height.*`)
3. **특수한 브랜드 컬러** → palette (주의: 테마 대응 불가, 최후 수단)

## 파일 구조

| 파일 | 내용 |
|------|------|
| `color.json` | primitive + semantic 색 토큰 원본 (rootage 스냅샷) |
| `color.md` | **semantic 컬러 intent 맵** — 언제 bg.brandSolid vs bg.brandWeak를 쓰는지 |
| `dimension.json` | 간격 scale 원본 |
| `spacing.md` | **4px 리듬 가이드** — 컴포넌트 패딩·갭·마진 결정 |
| `font-size.json`, `line-height.json`, `font-weight.json` | 타이포 원본 |
| `typography.md` | **타이포 페어링** — t1-t10 용도 + 한국어 대응 |
| `radius.json` | 반경 원본 |
| `radius.md` | **반경 intent** — 버튼은 r3, 카드는 r4 등 |
| `shadow.json`, `duration.json`, `timing-function.json`, `gradient.json` | 저빈도 토큰 원본 |

## 토큰 이름 → CSS 변수

Rootage 토큰 이름은 CSS 변수로 1:1 대응한다.

```
$color.bg.brand-solid   → var(--seed-color-bg-brand-solid)
$font-size.t7           → var(--seed-font-size-t7)
$radius.r3              → var(--seed-radius-r3)
$dimension.x4           → var(--seed-dimension-x4)
```

JS/TS에서는 `@seed-design/css/vars`로 import 한다.

```ts
import { color, fontSize, radius, dimension } from "@seed-design/css/vars";

color.bg.brandSolid   // "var(--seed-color-bg-brand-solid)"
fontSize.t7           // "var(--seed-font-size-t7)"
radius.r3             // "var(--seed-radius-r3)"
```

## 다크 모드

컬러 토큰만 theme-light/theme-dark 모드를 가진다. scale/radius/typography는 모드 독립. semantic 토큰을 쓰면 다크모드 대응은 자동.
