---
name: top-navigation
upstream_sha: 1f1d21d
status: rootage-only
---

# TopNavigation

> **⚠️ React 컴포넌트 미제공 · Rootage 토큰 스펙 전용** — upstream `@seed-design/react` 는 `TopNavigation` 을 export 하지 않는다. 이 문서는 Rootage `top-navigation.yaml` 토큰 스펙과 "직접 구현 시 가이드" 용.

**역할** — 앱 화면 최상단에 위치하는 내비게이션 바. 뒤로가기/닫기/메뉴 아이콘, 화면 제목(title), 부제목(subtitle)을 포함하며 테마(iOS/Android), 배경 투명도, 하단 구분선 유무를 조합해 다양한 화면 상황에 대응한다.

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| React Navigation 스택 헤더 커스터마이징 | `navigationOptions.headerStyle` + Rootage CSS 변수 |
| react-router 단일 SPA 상단 헤더 | `<header>` 자체 구현 + Rootage 토큰 적용 |
| 독립 페이지 타이틀 바 (title + 아이콘 버튼) | 직접 구현 (아래 가이드 참고) |
| 단순 텍스트 제목만 필요한 경우 | `<h1>` + 타이포그래피 토큰 |
| 메뉴 트레이, 드로어, 바텀시트 헤더 | 별도 컴포넌트 — TopNavigation 범위 밖 |

---

## Anatomy

TopNavigation 은 4개의 slot 으로 구성된다.

| Slot | 필수 | 역할 |
|------|------|------|
| `root` | ✅ | 전체 컨테이너. 높이·패딩·배경·하단 테두리 제어 |
| `icon` | 조건부 | 좌우 아이콘 버튼(뒤로가기, 닫기, 오버플로 메뉴 등). 크기·색상 제어 |
| `title` | ✅ | 화면 제목 텍스트. 폰트·색상 제어 |
| `subtitle` | 조건부 | title 아래 부제목 텍스트. `titleLayout=withSubtitle` 일 때만 표시 |

---

## Variants

TopNavigation 은 아래 4개 축의 조합으로 정의된다.

| 축 | 값 | 기본값 |
|---|---|------|
| `theme` | `cupertino` (44px) / `android` (56px) | 플랫폼 의존 |
| `tone` | `layer` / `transparent` | `layer` |
| `divider` | `true` / `false` | `false` |
| `titleLayout` | `titleOnly` / `withSubtitle` | `titleOnly` |

유효 조합: 4개 축이 독립적으로 결합되므로 이론상 2 × 2 × 2 × 2 = 16 가지 조합이 모두 유효하다.

---

## 토큰 표

아래 4개 sub-table 은 Rootage `top-navigation.yaml` (SHA `1f1d21d`) 의 `definitions` 블록을 슬롯별로 재편한 것이다.

### (a) root slot

| property | theme=cupertino | theme=android | tone=layer | tone=transparent | divider=true | divider=false |
|---|---|---|---|---|---|---|
| `minHeight` | `44px` | `56px` | — | — | — | — |
| `paddingX` | `$dimension.x4` | `$dimension.x4` | — | — | — | — |
| `color` (bg) | — | — | `$color.bg.layer-default` | `#00000000` | — | — |
| `strokeColor` | — | — | — | — | `$color.stroke.neutral-subtle` | — |
| `strokeWidth` | — | — | — | — | `1px` | — |

> `color` 는 root slot 에서 배경색 역할을 한다. CSS 에서 `background-color` 에 매핑.
> `strokeColor` / `strokeWidth` 는 하단 구분선. CSS `border-bottom` 에 매핑.
> `—` 는 해당 variant 에서 값이 정의되지 않음을 의미한다.

### (b) icon slot

| property | theme=cupertino | theme=android | tone=layer | tone=transparent |
|---|---|---|---|---|
| `size` | `24px` | `24px` | — | — |
| `targetSize` | `44px` | `44px` | — | — |
| `color` | — | — | `$color.fg.neutral` | `$color.palette.static-white` |

> `targetSize` 는 터치 영역(touch target). 실제 렌더 크기는 `size`, 클릭 영역은 `targetSize`.

### (c) title slot

| property | tone=layer | tone=transparent | titleLayout=titleOnly | titleLayout=withSubtitle |
|---|---|---|---|---|
| `color` | `$color.fg.neutral` | `$color.palette.static-white` | — | — |
| `fontSize` | — | — | `$font-size.t6-static` | `$font-size.t5-static` |
| `fontWeight` | — | — | `$font-weight.bold` | `$font-weight.bold` |
| `lineHeight` | — | — | `$line-height.t6-static` | `$line-height.t5-static` |

### (d) subtitle slot

| property | tone=layer | tone=transparent | titleLayout=withSubtitle |
|---|---|---|---|
| `color` | `$color.fg.neutral-muted` | `$color.palette.static-white` | — |
| `fontSize` | — | — | `$font-size.t2-static` |
| `fontWeight` | — | — | `$font-weight.regular` |
| `lineHeight` | — | — | `$line-height.t2-static` |

> subtitle slot 은 `titleLayout=titleOnly` 에서는 렌더되지 않는다.

---

## CSS 변수 매핑 (런타임 참고)

| Rootage 토큰 | CSS 변수 |
|-------------|---------|
| `$dimension.x4` | `var(--seed-dimension-x4)` |
| `$color.bg.layer-default` | `var(--seed-v3-color-bg-layer-default)` |
| `$color.stroke.neutral-subtle` | `var(--seed-v3-color-stroke-neutral-subtle)` |
| `$color.fg.neutral` | `var(--seed-v3-color-fg-neutral)` |
| `$color.fg.neutral-muted` | `var(--seed-v3-color-fg-neutral-muted)` |
| `$color.palette.static-white` | `var(--seed-v3-color-palette-static-white)` |
| `$font-size.t6-static` | `var(--seed-font-size-t6-static)` |
| `$font-size.t5-static` | `var(--seed-font-size-t5-static)` |
| `$font-size.t2-static` | `var(--seed-font-size-t2-static)` |
| `$font-weight.bold` | `var(--seed-font-weight-bold)` |
| `$font-weight.regular` | `var(--seed-font-weight-regular)` |
| `$line-height.t6-static` | `var(--seed-line-height-t6-static)` |
| `$line-height.t5-static` | `var(--seed-line-height-t5-static)` |
| `$line-height.t2-static` | `var(--seed-line-height-t2-static)` |

---

## 직접 구현 시 가이드

`@seed-design/react` 에 `TopNavigation` 이 없으므로 아래 pseudo-TSX 를 출발점으로 사용한다. Rootage 토큰을 CSS 변수로 직접 주입하는 방식이며, 디자인 토큰과 1:1 대응이 보장된다.

```tsx
// TopNavigation.tsx — Rootage 토큰 → CSS 변수 직접 주입
import type { CSSProperties, ReactNode } from "react";

type Theme = "cupertino" | "android";
type Tone = "layer" | "transparent";
type TitleLayout = "titleOnly" | "withSubtitle";

interface TopNavigationProps {
  theme?: Theme;
  tone?: Tone;
  divider?: boolean;
  titleLayout?: TitleLayout;
  title: string;
  subtitle?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

function getTokens(theme: Theme, tone: Tone, divider: boolean, titleLayout: TitleLayout) {
  const root: CSSProperties = {
    // theme 축
    minHeight: theme === "cupertino" ? "44px" : "56px",
    paddingLeft: "var(--seed-dimension-x4)",
    paddingRight: "var(--seed-dimension-x4)",
    // tone 축 — background
    backgroundColor:
      tone === "layer"
        ? "var(--seed-v3-color-bg-layer-default)"
        : "transparent",
    // divider 축
    borderBottom:
      divider
        ? "1px solid var(--seed-v3-color-stroke-neutral-subtle)"
        : "none",
    // layout
    display: "flex",
    alignItems: "center",
    position: "relative",
    boxSizing: "border-box",
  };

  const iconColor =
    tone === "layer"
      ? "var(--seed-v3-color-fg-neutral)"
      : "var(--seed-v3-color-palette-static-white)";

  const titleColor =
    tone === "layer"
      ? "var(--seed-v3-color-fg-neutral)"
      : "var(--seed-v3-color-palette-static-white)";

  const subtitleColor =
    tone === "layer"
      ? "var(--seed-v3-color-fg-neutral-muted)"
      : "var(--seed-v3-color-palette-static-white)";

  const titleStyle: CSSProperties =
    titleLayout === "titleOnly"
      ? {
          fontSize: "var(--seed-font-size-t6-static)",
          fontWeight: "var(--seed-font-weight-bold)" as CSSProperties["fontWeight"],
          lineHeight: "var(--seed-line-height-t6-static)",
          color: titleColor,
        }
      : {
          fontSize: "var(--seed-font-size-t5-static)",
          fontWeight: "var(--seed-font-weight-bold)" as CSSProperties["fontWeight"],
          lineHeight: "var(--seed-line-height-t5-static)",
          color: titleColor,
        };

  const subtitleStyle: CSSProperties = {
    fontSize: "var(--seed-font-size-t2-static)",
    fontWeight: "var(--seed-font-weight-regular)" as CSSProperties["fontWeight"],
    lineHeight: "var(--seed-line-height-t2-static)",
    color: subtitleColor,
  };

  return { root, iconColor, titleStyle, subtitleStyle };
}

export function TopNavigation({
  theme = "cupertino",
  tone = "layer",
  divider = false,
  titleLayout = "titleOnly",
  title,
  subtitle,
  leftIcon,
  rightIcon,
}: TopNavigationProps) {
  const tokens = getTokens(theme, tone, divider, titleLayout);

  return (
    <header style={tokens.root}>
      {/* left icon — targetSize 44px touch area */}
      {leftIcon && (
        <span
          style={{
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: tokens.iconColor,
          }}
        >
          {/* icon 자체 크기: 24px */}
          <span style={{ width: "24px", height: "24px", display: "flex" }}>
            {leftIcon}
          </span>
        </span>
      )}

      {/* title + subtitle center block */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={tokens.titleStyle}>{title}</span>
        {titleLayout === "withSubtitle" && subtitle && (
          <span style={tokens.subtitleStyle}>{subtitle}</span>
        )}
      </div>

      {/* right icon */}
      {rightIcon && (
        <span
          style={{
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: tokens.iconColor,
          }}
        >
          <span style={{ width: "24px", height: "24px", display: "flex" }}>
            {rightIcon}
          </span>
        </span>
      )}
    </header>
  );
}
```

```tsx
// 사용 예 — iOS 기본
<TopNavigation
  theme="cupertino"
  tone="layer"
  divider
  titleLayout="titleOnly"
  title="당근마켓"
  leftIcon={<BackIcon />}
/>

// 사용 예 — Android + subtitle
<TopNavigation
  theme="android"
  tone="layer"
  divider
  titleLayout="withSubtitle"
  title="내 동네 설정"
  subtitle="서울특별시 강남구"
  leftIcon={<BackIcon />}
  rightIcon={<MoreIcon />}
/>

// 사용 예 — 투명 배경 (이미지 위 오버레이)
<TopNavigation
  theme="cupertino"
  tone="transparent"
  divider={false}
  titleLayout="titleOnly"
  title="사진"
  leftIcon={<CloseIcon />}
/>
```

---

## States

TopNavigation 은 Rootage 스펙상 `enabled` 상태만 정의되어 있다. pressed/disabled 상태 토큰은 icon slot 에 위임된다 (icon 이 별도 인터랙티브 요소이므로 `ActionChip`, `IconButton` 계열 컴포넌트로 구현 권장).

---

## 접근성

- `<header>` 또는 `role="banner"` 를 사용한다. `<div>` 단독 사용 금지.
- 아이콘 버튼에는 반드시 `aria-label` 을 부여한다 (`aria-label="뒤로가기"`, `aria-label="닫기"`).
- 제목 텍스트는 `aria-level` 없이 순수 텍스트로 렌더링해도 무방하다 (페이지 구조상 `<h1>` 로 감싸는 것도 가능).
- `tone=transparent` 일 때 배경이 이미지이면 WCAG AA 대비 비율(4.5:1)을 반드시 확인한다.

---

## Anti-patterns

```tsx
// 하드코딩 색상 — 다크모드·테마 대응 불가
❌ <header style={{ backgroundColor: "#ffffff" }}>

// theme variant 를 CSS override 로 처리 — Rootage 축 우회
❌ <TopNavigation theme="cupertino" style={{ minHeight: "50px" }} />

// native status bar 와 혼동 — TopNavigation 은 status bar 영역을 포함하지 않음
❌ // TopNavigation height 안에 status bar padding 을 내포해서 계산하는 것 금지.
//   SafeAreaView / react-native-safe-area-context 로 별도 처리할 것.

// tone=transparent 를 CSS opacity 로 구현 — title/icon 색도 함께 투명해짐
❌ <header style={{ opacity: 0.5 }}>

// divider 를 border 대신 box-shadow 로 구현 — 스크롤 sticky 환경에서 토큰 벗어남
❌ <header style={{ boxShadow: "0 1px 0 #e0e0e0" }}>

// @seed-design/react 에 TopNavigation export 없음 — 아래 import 불가
❌ import { TopNavigation } from "@seed-design/react";

// 올바른 방법: Rootage CSS 변수 직접 주입
✅ <header style={{ backgroundColor: "var(--seed-v3-color-bg-layer-default)" }}>
```

---

## 관련 문서

- `decision-matrices/composition.md` — 내부 프리미티브 조합 규칙
- `./action-button.md` — 아이콘 버튼 자리에 사용 가능한 액션 버튼
- `./text-button.md` — rootage-only 패턴 참고
