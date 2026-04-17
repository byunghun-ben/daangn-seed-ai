# Text (Typography)

> **Note** — upstream seed-design의 rootage spec에선 이 컴포넌트를 `Typography`라 부르지만, React package(`@seed-design/react`)에선 `Text` 컴포넌트로 구현된다. 본 문서는 API 측 이름(`Text`)을 쓴다. 파일명 `typography.md`는 rootage YAML 이름과 맞추기 위한 규칙.

**정의** — 당근 Seed 디자인 시스템의 텍스트 스타일을 일관되게 적용하는 타이포그래피 컴포넌트. `textStyle` prop 하나로 폰트 사이즈·라인 하이트·폰트 웨이트를 한 번에 토큰화하고, polymorphic `as` prop으로 HTML 의미 태그를 선택한다. 본문·제목·주석 등 **모든 텍스트는 이 컴포넌트로 감싸는 것이 원칙**이다.

**import**
```ts
import { Text } from "@seed-design/react";
// flat component: <Text textStyle="articleBody">본문</Text>
```

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 화면 타이틀 · 섹션 제목 | `<Text textStyle="screenTitle" as="h1">` |
| 게시물·콘텐츠 본문 | `<Text textStyle="articleBody" as="p">` |
| 주석 · 캡션 · 메타 정보 | `<Text textStyle="articleNote">` |
| 세밀한 스케일 제어 (t1~t10) | `<Text textStyle="t3Bold">` (rem scale) |
| 폰트 스케일링을 무시하고 고정 px | `<Text textStyle="t3StaticBold">` (static scale) |
| Button · Chip 등 컴포넌트 내부 라벨 | ❌ Text 아님. 각 컴포넌트의 `label` slot 사용 |
| 아이콘에 딸린 짧은 레이블 | ❌ Text 단독보다 `<Icon>` + 부모 컨테이너 layout 권장 |
| 링크 텍스트 | ❌ Text 단독 아님. `<a>` 또는 전용 Link 컴포넌트로 감싸고 내부에 Text 배치 |
| 폼 입력 값 표시 | ❌ `TextField` · `Textarea` 등 입력 컴포넌트 사용 |

관련 결정 매트릭스: [`decision-matrices/composition.md`](../decision-matrices/composition.md)

---

## Anatomy

Text는 **단일 slot (`root`)** 컴포넌트다. 내부 구조 없이 하나의 HTML 요소만 렌더하므로, Avatar·TextField 같은 복합 컴포넌트와 달리 namespace(`Text.Root`)가 없다. **Flat callable** 형태로만 쓴다.

| Slot | 필수 | 역할 |
|------|------|------|
| `root` | ✅ | `as` prop이 결정하는 단일 엘리먼트 (`span`·`p`·`h1`~`h6`·`strong`·`dt`·`dd`·`legend`). `textStyle`로 폰트 스타일, `color`/`align` 등으로 외양을 제어 |

> **단순함이 의도** — Typography는 토큰 적용 레이어이지 컨테이너가 아니다. 여러 줄 레이아웃·리스트·카드 같은 구조적 요소는 외부 `<Box>` / `<ul>` / 전용 컴포넌트로 구성하고, Text는 그 안에서 **개별 텍스트 노드**로만 쓴다.

---

## tokens/typography.md와의 관계

`tokens/typography.md`와 본 문서는 같은 타이포 시스템의 **두 층위**를 설명한다. 역할이 완전히 다르므로 혼동하지 않는다.

| 문서 | 대상 | 관심사 |
|------|------|-------|
| [`tokens/typography.md`](../tokens/typography.md) | **스케일 정의** (t1~t10) | 각 스텝이 몇 px 폰트 사이즈 / 몇 px 라인 하이트 / 몇 weight인지, rem·static 변종이 무엇인지 — **디자인 토큰 레벨** |
| `components/typography.md` (본 문서) | **React 컴포넌트 API** (`Text`) | 그 스케일을 **어떻게 적용**하는가 — `textStyle` prop, polymorphic `as`, `maxLines` 등 실행 레이어 |

**매핑 예시**
- 토큰: `font-size.t5 = 16px`, `line-height.t6 = 24px`, `font-weight.regular = 400`
- 컴포넌트: `<Text textStyle="articleBody">` → 위 세 토큰을 한 번에 적용

토큰은 "몇 px인가"를 정의하고, 컴포넌트는 "어떤 textStyle 이름으로 그 값들을 묶어 쓰는가"를 정의한다. 새로운 스케일 단계를 추가하려면 **먼저 tokens/typography.md를 갱신한 뒤** YAML `textStyle` variant에 새 값을 추가하고, 본 문서의 표를 업데이트한다.

→ [`tokens/typography.md`](../tokens/typography.md)

---

## Variants

`textStyle`은 Typography의 유일한 variant이자 **가장 중요한 prop**이다. 총 **51개 값**이 있고, 다음 3그룹으로 분류된다.

### 1. Semantic aliases (3개) — 권장 entrypoint

의미 기반 이름으로, 화면 구성 시 가장 먼저 고려한다. 스케일 숫자가 바뀌어도 디자인 의도가 유지되도록 **가장 안정적인 계약**이다.

| 값 | 토큰 구성 | 사용 맥락 |
|-----|----------|----------|
| `screenTitle` | `font-size.t10` · `line-height.t10` · `bold` | 화면의 주요 제목 (페이지 타이틀). 보통 `as="h1"` 조합 |
| `articleBody` | `font-size.t5` · `line-height.t6` · `regular` | 게시물·콘텐츠 중심 섹션의 **본문 텍스트**. 가장 흔한 본문용 |
| `articleNote` | `font-size.t4` · `line-height.t5` · `regular` | 주석·참고 사항·상세 리스트 등 **부가 정보**. 일반 본문에는 쓰지 말 것 |

> 이 3개는 `tokens/typography.md`의 semantic 레이어에 대응한다. 디자인 리뷰에서 "본문", "주석", "화면 타이틀" 같은 시나리오 단어가 나오면 먼저 여기서 찾는다.

### 2. Scale: rem / dynamic (24개) — 폰트 스케일에 반응

사용자 OS의 폰트 크기 설정(접근성)에 따라 비례 스케일링되는 `rem` 단위 기반. 시맨틱 alias로 표현이 안 되는 미세 조정에만 쓴다.

| 스케일 | Regular | Medium | Bold |
|--------|---------|--------|------|
| t1 | `t1Regular` | `t1Medium` | `t1Bold` |
| t2 | `t2Regular` | `t2Medium` | `t2Bold` |
| t3 | `t3Regular` | `t3Medium` | `t3Bold` |
| t4 | `t4Regular` | `t4Medium` | `t4Bold` |
| t5 | `t5Regular` | `t5Medium` | `t5Bold` |
| t6 | `t6Regular` | `t6Medium` | `t6Bold` |
| t7 | `t7Regular` | `t7Medium` | `t7Bold` |
| t8 | — | — | `t8Bold` |
| t9 | — | — | `t9Bold` |
| t10 | — | — | `t10Bold` |

**합계: 21개 (t1~t7 × 3) + 3개 (t8/t9/t10 Bold-only) = 24개.**

> **t8·t9·t10은 Bold 전용**이다. 해당 스케일에는 Regular/Medium 정의가 YAML에 존재하지 않으므로, `t8Regular` 같은 값을 쓰면 런타임 에러. 대형 타이포는 시각적 무게가 이미 크기에서 나와 굳이 경량을 쓰지 않는 디자인 철학.

### 3. Scale: static / px (24개) — 폰트 스케일에 반응하지 않음

`t{N}-static` 토큰(px 고정)을 사용해 사용자 OS 폰트 스케일 설정을 **무시**한다. 탭바·툴팁·브랜딩 등 레이아웃 정확도가 접근성 스케일링보다 우선인 드문 경우에만 쓴다.

| 스케일 | Regular | Medium | Bold |
|--------|---------|--------|------|
| t1 | `t1StaticRegular` | `t1StaticMedium` | `t1StaticBold` |
| t2 | `t2StaticRegular` | `t2StaticMedium` | `t2StaticBold` |
| t3 | `t3StaticRegular` | `t3StaticMedium` | `t3StaticBold` |
| t4 | `t4StaticRegular` | `t4StaticMedium` | `t4StaticBold` |
| t5 | `t5StaticRegular` | `t5StaticMedium` | `t5StaticBold` |
| t6 | `t6StaticRegular` | `t6StaticMedium` | `t6StaticBold` |
| t7 | `t7StaticRegular` | `t7StaticMedium` | `t7StaticBold` |
| t8 | — | — | `t8StaticBold` |
| t9 | — | — | `t9StaticBold` |
| t10 | — | — | `t10StaticBold` |

**합계: 21개 (t1~t7 × 3) + 3개 (t8/t9/t10 Bold-only) = 24개.**

> rem scale과 대칭적으로 **t8·t9·t10은 Static도 Bold 전용**. 기본은 rem scale(반응형)이며, static은 접근성을 희생하는 선택지이므로 신중히 사용한다.

**총계 검증**: 3 (semantic) + 24 (rem) + 24 (static) = **51개** — YAML과 1:1 일치.

---

## States

Text는 인터랙티브 컴포넌트가 아니므로 `pressed` · `hover` · `disabled` 같은 상태가 없다. `color` prop으로 `fg.disabled` 토큰을 넘겨 시각적으로 비활성 표현은 할 수 있지만, 그건 컴포넌트 상태가 아니라 **단순 색상 변경**일 뿐이다. 실제 비활성은 상위 `<button disabled>` 등에서 관리한다.

| "상태" | 구현 방법 |
|--------|----------|
| 일반 텍스트 | `<Text textStyle="articleBody">` |
| 비활성 느낌 | `<Text textStyle="articleBody" color="fg.disabled">` |
| 강조 | `<Text textStyle="t5Bold">` 또는 `<Text as="strong" ...>` |
| 잘린 텍스트 (ellipsis) | `<Text maxLines={1}>` |

---

## Props

```ts
import type * as React from "react";
import type * as CSS from "csstype";

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * 51개 textStyle 중 하나 — 가장 중요한 prop.
   * Semantic(3): "screenTitle" | "articleBody" | "articleNote"
   * Rem scale(24): "t{1-7}{Regular|Medium|Bold}" | "t{8-10}Bold"
   * Static scale(24): "t{1-7}Static{Regular|Medium|Bold}" | "t{8-10}StaticBold"
   * 상단 Variants 테이블 참조.
   */
  textStyle?: TextStyleToken; // 위 51개 중 하나

  /**
   * 렌더할 HTML 엘리먼트 (polymorphic).
   * @default "span"
   */
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "strong" | "dt" | "dd" | "legend";

  /**
   * 최대 표시 줄 수.
   *   1  → single-line ellipsis (한 줄 말줄임표)
   *   2+ → multi-line line-clamp (N줄 후 말줄임표)
   *   undefined → 제한 없음
   */
  maxLines?: number;

  /** fg 토큰 또는 palette 토큰. 예: "fg.neutral", "fg.brand", "palette.carrot500" */
  color?: string;
  /** textStyle의 일부만 부분 오버라이드 (토큰명 또는 CSS 값) */
  fontSize?: string;
  lineHeight?: string;
  fontWeight?: "regular" | "medium" | "bold" | (string & {});

  align?: "left" | "center" | "right";
  userSelect?: "auto" | "none" | "text";
  whiteSpace?: "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line" | "break-spaces";
  textDecorationLine?: CSS.Property.TextDecorationLine;

  children?: React.ReactNode;
}
```

**default 요약**
- `as` 미지정 → `"span"` (inline 요소). 블록 레벨 본문은 `as="p"` 명시.
- `textStyle` 미지정 → **upstream recipe 기본값 `t5Regular` 가 적용된다** (`packages/css/recipes/text.mjs` 의 `defaultVariant.textStyle = "t5Regular"`). 부모 스타일을 그대로 상속하고 싶으면 `<Text>` 를 쓰지 않거나 `style={{ font: "inherit" }}` 로 명시적으로 풀어야 한다.
- `maxLines` 미지정 → 제한 없이 자연스럽게 줄바꿈.
- `color` 미지정 → 부모로부터 상속 (`fg.neutral` 계열).

**부분 오버라이드 규칙** (`fontSize`/`lineHeight`/`fontWeight`)
- `textStyle`이 정의한 3요소(사이즈·라인하이트·웨이트) 중 **일부만 덮어쓴다**.
- 예: `<Text textStyle="articleBody" fontWeight="bold">` → 사이즈·라인하이트는 articleBody(t5/t6) 유지, 웨이트만 bold로.
- 이 기능은 **예외적 케이스에만** 쓴다. 정상적으로는 적절한 textStyle 값을 먼저 찾는다 (예: `t5Bold` 사용).

---

## 합성 규칙 (composition)

- **Text는 flat component** — `Text.Root`/`Text.Something` 같은 namespace 없음. `<Text>...</Text>` 한 번으로 끝.
- **중첩 Text는 허용되지만 지양** — `<Text as="p"><Text as="strong">key</Text> value</Text>` 형태가 가능하긴 하나, 내부에 `<strong>` 같은 원시 HTML을 그대로 쓰거나 `fontWeight` 오버라이드가 더 깔끔하다.
- **Button·Chip 등 라벨 slot에 Text 중복 금지** — 상위 컴포넌트가 이미 토큰을 적용한다. 이중 적용 시 토큰 충돌.
- **레이아웃(`margin`·`padding`·`display:flex`)은 Text에 직접 주지 말 것** — Text는 inline 토큰 레이어. 외곽 `<Box>`에 레이아웃을 위임한다.
- **`as="p"` 쓴 Text 안에 블록 요소 넣지 않기** — HTML 규칙상 `<p>` 안에 `<div>`·`<p>` 중첩 불가. 파서 에러 유발.
- **`maxLines`는 blockish 맥락에서만 동작** — `as="span"` + 부모가 inline이면 line-clamp가 제대로 안 먹는다. 필요 시 `as="p"` 또는 `as="h1"` 등 블록 요소로.

---

## 접근성 (constraints, not suggestions)

- **의미 태그를 반드시 지정** — 화면 제목은 `as="h1"`~`as="h6"`, 본문 블록은 `as="p"`. 기본값 `"span"`을 그대로 두면 스크린 리더가 구조를 인식하지 못한다.
- **제목 계층은 건너뛰지 말 것** — `h1` 다음에 바로 `h3`를 쓰지 않는다. 시각적 크기만 맞추려면 `textStyle`로 조정하고 `as`는 계층 순서대로.
- **`color`만으로 상태 전달 금지** — 예: 에러 메시지를 `color="fg.critical"`로만 표시하면 색각 이상 사용자는 인지 못 한다. 아이콘·접두 텍스트 병행.
- **`maxLines`로 자른 텍스트는 전체 내용을 읽을 수단 제공** — 리스트 아이템이면 상세 화면으로의 경로, 툴팁·Dialog 등으로 전체 접근성 확보. 잘린 텍스트만으로 의미가 완결돼야 하는 경우는 주의.
- **`userSelect="none"`은 장식/제어 UI에만** — 본문 텍스트 복사 방지는 접근성·사용성 저해. 꼭 필요한 오버레이·UI 라벨에 한정.
- **`textStyle="screenTitle"`로 시각적 제목처럼 보여도 `as`가 `span`이면 스크린 리더엔 제목 아님** — 시각과 시맨틱을 분리하지 말 것.

---

## Anti-patterns

```tsx
❌ <Text fontSize="18px">본문 내용</Text>
   {/* textStyle 없이 fontSize만 지정 — 의미(semantic) 손실.
       디자인 토큰 연결이 끊기고, 다크모드·폰트 스케일 대응 깨짐. */}

❌ <div style={{ fontSize: 16, lineHeight: '24px', fontWeight: 400 }}>본문</div>
   {/* Text 대신 plain div + 수동 스타일 — 테마 변경 시 일괄 업데이트 불가.
       디자인 시스템 밖으로 새는 "AI-slop" 패턴. */}

❌ <Text textStyle="articleBody" maxLines={2}>
     중요한 안내 사항이 길게 이어집니다...
   </Text>
   {/* maxLines로 중요한 본문을 자르기만 하고 "더 보기" 수단이 없음 —
       접근성·사용성 동시 저해. 상세 보기 경로 반드시 병행. */}

❌ <Text textStyle="t8Regular">대형 제목</Text>
   {/* t8은 Bold 전용 — 런타임에 스타일이 적용되지 않는다. t8Bold로. */}

❌ <Text textStyle="screenTitle">페이지 제목</Text>
   {/* as 미지정 → default "span" 으로 렌더.
       시각적으로는 제목이지만 스크린 리더에겐 제목 아님. as="h1" 명시. */}

❌ <Text as="p" textStyle="articleBody">
     <div>중첩 블록</div>
   </Text>
   {/* <p> 안에 <div> 중첩 — HTML 파서 에러. 외곽을 <Box>로 바꾸거나,
       내부를 inline 요소로. */}

❌ <Text textStyle="t5StaticRegular">접근성 설정 무시 본문</Text>
   {/* 사용자 폰트 확대 설정을 무시 — 기본적으로 rem scale(articleBody 등) 사용.
       static은 특수 레이아웃 요구사항에만. */}

✅ <Text as="h1" textStyle="screenTitle">당근마켓</Text>

✅ <Text as="p" textStyle="articleBody">
     게시물의 본문 텍스트입니다.
   </Text>

✅ <Text as="p" textStyle="articleNote" color="fg.neutral-subtle">
     2분 전 · 서초구
   </Text>
```

---

## 예제 (minimum usage)

### 1. Semantic alias — 가장 먼저 시도할 패턴

```tsx
import { Text } from "@seed-design/react";

<Text as="p" textStyle="articleBody">
  당근마켓은 동네 기반의 중고거래 플랫폼입니다.
</Text>

<Text as="p" textStyle="articleNote" color="fg.neutral-subtle">
  작성일 2분 전 · 서초구 방배동
</Text>
```

`articleBody` / `articleNote`는 스케일 숫자(`t5Regular` 등)를 직접 노출하지 않아 디자인 시스템 업그레이드에 가장 강건하다.

### 2. Rem scale 세밀 조정 — semantic으로 표현 안 될 때

```tsx
<Text as="h2" textStyle="t3Bold">
  이번 주 인기 상품
</Text>

<Text as="span" textStyle="t2Medium">
  인라인 강조 라벨
</Text>
```

`t3Bold`는 `font-size.t3` · `line-height.t3` · `bold`를 한 번에 묶는다. t1~t7은 Regular/Medium/Bold 전부 있고, t8~t10은 Bold만.

### 3. Polymorphic `as` + semantic alias — 시각과 시맨틱 일치

```tsx
<Text as="h2" textStyle="screenTitle">
  오늘의 당근
</Text>

<dl>
  <Text as="dt" textStyle="t4Bold">거래 지역</Text>
  <Text as="dd" textStyle="t4Regular">서초구 방배동</Text>
</dl>
```

`as`는 `span`·`p`·`h1`~`h6`·`strong`·`dt`·`dd`·`legend`만 허용. 리스트 안 항목이면 `<dt>`/`<dd>` 조합이 시맨틱 정답.

### 4. maxLines — 한 줄 ellipsis vs 다중 라인 line-clamp

```tsx
// maxLines={1} → CSS text-overflow: ellipsis 단일 라인
<Text as="p" textStyle="t4Regular" maxLines={1}>
  매우 길어서 한 줄로 잘려야 하는 제품 제목입니다...
</Text>

// maxLines={2+} → -webkit-line-clamp 다중 라인
<Text as="p" textStyle="articleBody" maxLines={3}>
  게시물 리스트에서 3줄까지만 보여주고 나머지는 숨기는 본문 미리보기.
  4번째 줄부터는 렌더링되지 않고 마지막 줄 끝에 ellipsis가 붙는다.
</Text>
```

부모 너비가 고정돼 있어야 실제로 잘린다. 전체 내용 접근 경로(상세 화면·툴팁)를 반드시 제공한다.

### 5. 부분 오버라이드 · Static scale — 예외적 상황

```tsx
// textStyle은 유지하고 color/align만 오버라이드
<Text as="p" textStyle="articleBody" color="fg.critical" align="center">
  비밀번호가 일치하지 않습니다.
</Text>

// 레이아웃 폭이 고정돼야 하는 가격·카운트 (static scale)
<Text as="span" textStyle="t3StaticBold">₩12,000</Text>
```

`color`만으로 에러 전달 금지 — 아이콘 병행. Static scale은 접근성 스케일링을 희생하므로 신중히.
