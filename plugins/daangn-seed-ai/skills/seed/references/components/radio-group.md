---
name: radio-group
upstream_sha: 1f1d21d
---

# RadioGroup

**정의** — 여러 보기 중 "정확히 하나"를 선택하는 단일 선택 컨트롤. 그룹 컨테이너(`Root`)가 `value`/`defaultValue`/`onValueChange`와 `role="radiogroup"`를 관리하고, 각 선택지는 namespace 하위 슬롯으로 구성한다. 네이티브 `<input type="radio">`를 숨긴 채 SVG 기반 시각 인디케이터(`Radiomark`)를 레이어로 합성해 `tone`·`size` 토큰만으로 모든 상태(선택/해제/포커스/비활성)를 자동 처리하는 namespace 컴포넌트.

**import**
```ts
import { RadioGroup } from "@seed-design/react";
// namespace:
//   <RadioGroup.Root>
//     <RadioGroup.Item value="...">
//       <RadioGroup.ItemControl>
//         <RadioGroup.ItemIndicator checked={<svg .../>} />
//       </RadioGroup.ItemControl>
//       <RadioGroup.ItemLabel>...</RadioGroup.ItemLabel>
//       <RadioGroup.ItemHiddenInput />
//     </RadioGroup.Item>
//     ...
//   </RadioGroup.Root>
```

> **standalone `Radio` 는 React API 에 없다.** 개별 선택지는 반드시 `RadioGroup.Item` 으로 렌더한다. 배경과 Rootage 토큰은 [`./radio.md`](./radio.md) 참고. 다중 선택(여러 항목을 독립 on/off)은 [`./checkbox-group.md`](./checkbox-group.md).

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 3개 이상 옵션 중 하나를 명시적으로 선택(설문, 배송 방식, 성별) | **RadioGroup** (이 컴포넌트) |
| 여러 항목을 독립적으로 on/off (약관 동의 3개, 필터 다중 체크) | ❌ RadioGroup 아님. [`./checkbox-group.md`](./checkbox-group.md) |
| 2개 옵션 즉시 on/off 토글(알림 on/off, 다크 모드) | ❌ RadioGroup 아님. `Switch` |
| 2–5개 보기를 버튼처럼 가로로 나열 (세그먼트, 필터 토글 그룹) | `ControlChip` / `SegmentedControl` |
| 선택지가 정말 많고(>7) 폼 공간이 좁음 | `Select` / `BottomSheet + List` |
| 전체를 Fieldset 라벨·description·errorMessage와 묶고 싶음 | `RadioGroupField`(고수준) — 내부에서 `RadioGroup` 사용 |
| 단일 선택 + 카드형 UI(이미지·설명이 함께 있는 리스트) | `RadioSelectBox` |

관련 결정 매트릭스: [`decision-matrices/which-input.md`](../decision-matrices/which-input.md)

---

## Anatomy

여섯 개 export로 구성된 namespace. `Root`가 값 상태와 `role="radiogroup"`를 관리하고, 각 선택지는 `Item`을 `<label>`로 렌더하며 그 안에 `ItemControl`+`ItemIndicator`+`ItemLabel`+`ItemHiddenInput`을 배치한다. `Radio` 단독 export는 없다.

| Slot | 실제 export 이름 | 필수 | 역할 |
|------|------------------|------|------|
| `RadioGroup.Root` | `RadioGroupRoot` | ✅ | `<div role="radiogroup">` 컨테이너. `value`/`defaultValue`/`onValueChange`·`name`·`form`·`disabled`·`invalid`를 소유. `RadioGroupVariantProps` 없음(표시용 recipe 토큰은 `root.gapY`만) |
| `RadioGroup.Item` | `RadioGroupItem` | ✅ | 개별 선택지. `<label>` 엘리먼트로 렌더되고 `value: string`이 필수. `RadioVariantProps`(`weight`·`size`) + `RadiomarkVariantProps`(`tone`·`size`)를 여기서 지정. `ref`는 `HTMLLabelElement` |
| `RadioGroup.ItemControl` | `RadioGroupItemControl` | ✅ | Radiomark root `<div>`. `tone`/`size`를 여기서 덮어쓸 수 있음. 시각 인디케이터(원형 박스)가 그려지는 영역 |
| `RadioGroup.ItemIndicator` | `RadioGroupItemIndicator` | ✅ | 실제 SVG. `checked` prop(선택 상태 SVG)과 선택적 `unchecked` prop을 받는다. `checked`를 생략해도 내부에 **기본 `<circle cx="12" cy="12" r="12" fill="currentColor" />`** 가 렌더되므로 뚫린 채로 두지 말 것(명시 권장) |
| `RadioGroup.ItemLabel` | `RadioGroupItemLabel` | ⚪ | `<span>` 라벨 텍스트. 생략 가능하나 `aria-label` 또는 `aria-labelledby`가 `Item`에 필요. 내부에서 state props(`data-checked`, `data-disabled` 등) 자동 주입 |
| `RadioGroup.ItemHiddenInput` | `RadioGroupItemHiddenInput` | ✅ (폼·a11y 용) | visually-hidden 상태의 네이티브 `<input type="radio">`. `name`·`form`·`value`·`checked`·`onChange`를 Root가 관리. 외부 `Item` ref 와 별개로 input 자체에 ref 를 주고 싶으면 이 슬롯에 직접 ref 를 건다 |

**Item 구성 순서**

```tsx
<RadioGroup.Item value="apple">
  <RadioGroup.ItemControl>
    <RadioGroup.ItemIndicator checked={/* svg */} />
  </RadioGroup.ItemControl>
  <RadioGroup.ItemLabel>사과</RadioGroup.ItemLabel>
  <RadioGroup.ItemHiddenInput />
</RadioGroup.Item>
```

**중요**
- `Item`은 내부적으로 `<label>`이라 **`Control`·`Label`·`HiddenInput`을 한꺼번에 감싸면 라벨 클릭 = 해당 radio 선택**이 네이티브로 된다. 직접 `htmlFor`/`id`를 매기지 말 것.
- `ItemIndicator.checked` 는 **선택적**이다(`<svg>` 기본값이 내부에 하드코딩). 하지만 Seed 예제와 shadcn-style 래퍼는 명시적으로 circle SVG를 넘긴다 — 테마/아이콘 팩 교체를 대비해 항상 명시하는 것을 권장.
- `ItemHiddenInput` 은 Root 가 주입하는 `name`/`form`/`checked`/`onChange` 를 덮어쓰지 말 것. name 은 `RadioGroup.Root` 에 지정한다.
- **`Checkbox.Indicator`와 달리 `unchecked` prop은 거의 쓰지 않는다** — Seed Radio 는 해제 상태에 아이콘이 없고 윤곽선만 보이는 게 기본.

---

## Variants

Root 자체에는 시각 variant 가 없다(gapY 만 관리). 모든 시각 토큰은 `Item`과 `ItemControl`에 전달되는 `RadioVariantProps`(`weight`·`size`) + `RadiomarkVariantProps`(`tone`·`size`)가 결정한다.

### Item 축 variant 표

| 축 | 값 | 기본값 | 적용 슬롯 | 시각 변화 |
|----|----|--------|-----------|-----------|
| `weight` | `"regular"` | ✅ | `label` | `$font-weight.regular` |
| `weight` | `"bold"` | | `label` | `$font-weight.bold` |
| `tone` | `"brand"` | ✅ | `ItemControl` + `ItemIndicator` | 선택 시 `$color.bg.brand-solid` / 아이콘 `$color.palette.static-white` |
| `tone` | `"neutral"` | | `ItemControl` + `ItemIndicator` | 선택 시 `$color.bg.neutral-inverted` / 아이콘 `$color.fg.neutral-inverted` |
| `size` | `"medium"` | ✅ | 라벨 + mark | mark 20px(`$dimension.x5`) / icon 8px(`$dimension.x2`) / 라벨 `$font-size.t4` / minHeight `$dimension.x8` |
| `size` | `"large"` | | 라벨 + mark | mark 24px(`$dimension.x6`) / icon 10px(`$dimension.x2_5`) / 라벨 `$font-size.t5` / minHeight `$dimension.x9` |

### `weight` — 라벨 굵기 (radio recipe)

| 값 | 의미 | 사용 맥락 |
|----|------|-----------|
| `"regular"` | 기본 본문 굵기 | 일반 설문, 설정 |
| `"bold"` | 강조 굵기 | 헤드라인 옵션, 결제 수단 |

### `tone` — Radiomark 색조

| 값 | 선택 시 배경/아이콘 | 사용 맥락 |
|----|---------------------|-----------|
| `"brand"` | `$color.bg.brand-solid` / `$color.palette.static-white` | 브랜드 강조 선택(결제·약관 + 상품 옵션) |
| `"neutral"` | `$color.bg.neutral-inverted` / `$color.fg.neutral-inverted` | 중립 리스트 · 필터 · 문답 선택 |

### `size`

| 값 | mark | 라벨 | minHeight | 사용 맥락 |
|----|------|------|-----------|-----------|
| `"medium"` | 20px (icon 8px) | `$font-size.t4` | `$dimension.x8` | 일반 폼·리스트 |
| `"large"` | 24px (icon 10px) | `$font-size.t5` | `$dimension.x9` | 모바일 터치 타겟·설정 화면 |

---

## States

Root 상태(`value`/`disabled`/`invalid`)와 각 Item 상태(`checked`/`focused`/`hovered`/`active`/`disabled`)가 `data-*` 속성으로 모든 슬롯에 전달되어 `radiomark` recipe의 enabled / pressed / disabled / selected 정의를 활성화한다.

| State | 트리거 | 시각 변화 | 토큰 |
|-------|--------|-----------|------|
| `enabled` (unchecked) | 기본 | 윤곽선 원(`strokeWidth: 1px`, `strokeColor: $color.stroke.neutral-weak`) | — |
| `enabled, selected` | Item이 선택됨 (`value === itemValue`) | 내부 원이 tone 색으로 채워지고 아이콘 서클이 중앙에 그려짐 | `strokeWidth: 0px` → `root.color` tone 색 |
| `pressed` | pointerdown / 스페이스바 | `root.color: $color.bg.transparent-pressed` | |
| `pressed, selected` | 선택된 radio 재활성화 | brand: `$color.bg.brand-solid-pressed` / neutral: `$color.bg.neutral-inverted-pressed` | |
| `hover` | pointermove | `data-hover` 부착(스타일은 recipe 재량) | |
| `focus` / `focus-visible` | Tab·화살표 키 포커스 | `HiddenInput`에 네이티브 포커스 링 위임 | |
| `disabled` | Root `disabled` 또는 Item `disabled` | 라벨 `$color.fg.disabled`, mark `$color.palette.gray-300`, 포인터 이벤트 차단 | |
| `disabled, selected` | 비활성 상태에서도 선택값 표시 | 투명 배경 + 1px gray-300 윤곽선 + gray-300 아이콘 | |
| `invalid` | Root `invalid=true` | `aria-invalid="true"` 자동 부착(시각은 `RadioGroupField` 의 errorMessage로) | |

**컨트롤드 vs 언컨트롤드**
- **컨트롤드**: `value` + `onValueChange` 를 Root 에 모두 제공 → 부모가 상태 소유.
- **언컨트롤드**: `defaultValue` 만 제공 → 내부 state. 폼 제출 시 `ItemHiddenInput` 이 선택된 값을 `name=...` 으로 전송한다.
- `isControlled` 는 `value !== undefined` 로 판정하므로 **`value={undefined}` 를 조건부로 넘기지 말 것** — 컨트롤드/언컨트롤드가 섞이며 React 경고.
- 키보드 화살표(↑/↓/←/→)로 선택이 이동하지만, Space 는 현재 포커스된 radio 를 활성화(네이티브 radio 거동 + 커스텀 `data-active` 처리).

---

## Token 매핑

Rootage `radio-group.yaml` + `radio.yaml` + `radiomark.yaml` 에서 추출된 주요 토큰. recipe variant(`weight`·`tone`·`size`)로만 제어하고, 하드 CSS 덮어쓰기 금지.

```
radio-group recipe (컨테이너 간격):
  root.gapY: $dimension.x1

radio recipe (라벨·root 스페이싱):
  root.gap:        $dimension.x2
  label.color:     $color.fg.neutral       # enabled
                   $color.fg.disabled      # disabled
  weight=regular:  label.fontWeight = $font-weight.regular
  weight=bold:     label.fontWeight = $font-weight.bold
  size=medium:     root.minHeight = $dimension.x8, label.fontSize = $font-size.t4
  size=large:      root.minHeight = $dimension.x9, label.fontSize = $font-size.t5

radiomark recipe (원형 mark·아이콘):
  root.cornerRadius:        $radius.full
  root.colorDuration:       $duration.color-transition
  root.colorTimingFunction: $timing-function.easing
  root.strokeWidth:         1px
  root.strokeColor:         $color.stroke.neutral-weak
  icon.cornerRadius:        $radius.full
  enabled,pressed:          root.color = $color.bg.transparent-pressed
  enabled,selected:         root.strokeWidth = 0px, strokeColor = "#00000000"
  tone=brand,enabled+selected:
    root.color = $color.bg.brand-solid
    icon.color = $color.palette.static-white
  tone=brand,enabled+selected+pressed:
    root.color = $color.bg.brand-solid-pressed
  tone=neutral,enabled+selected:
    root.color = $color.bg.neutral-inverted
    icon.color = $color.fg.neutral-inverted
  tone=neutral,enabled+selected+pressed:
    root.color = $color.bg.neutral-inverted-pressed
  disabled:               root.color = $color.palette.gray-300
  disabled,selected:      root.color = $color.bg.transparent, strokeWidth 1px + gray-300
                          icon.color = $color.palette.gray-300
  size=medium:            root.size = $dimension.x5, icon.size = $dimension.x2 (disabled: x2_5)
  size=large:             root.size = $dimension.x6, icon.size = $dimension.x2_5 (disabled: x3)
```

**토큰 사용 원칙**
- `tone` 미지정 시 `"brand"` → 필터·리스트처럼 중립 맥락이면 명시적으로 `tone="neutral"`.
- radio mark 색을 직접 CSS 로 덮어쓰지 말 것. 반드시 `tone` variant 로 제어.
- `$color.palette.static-white` 는 다크 모드에서도 흰색 유지 토큰(brand 선택 아이콘 전용).

---

## Props

```ts
import type * as React from "react";
import type {
  RadioVariantProps,       // "weight" | "size"
  RadiomarkVariantProps,   // "tone" | "size"
  RadioGroupVariantProps,  // (현재 visual variant 없음; root.gapY 만)
} from "@seed-design/css/recipes/...";

// 1) Root — 그룹 값 소유 + role="radiogroup"
interface RadioGroupRootProps
  extends RadioGroupVariantProps,
          React.HTMLAttributes<HTMLDivElement> {
  // 상태
  value?: string;                           // controlled
  defaultValue?: string;                    // uncontrolled initial
  onValueChange?: (value: string) => void;

  disabled?: boolean;
  invalid?: boolean;                         // aria-invalid
  name?: string;                             // HiddenInput의 name으로 전파
  form?: string;                             // HTML form attr 전파

  asChild?: boolean;                         // Primitive.div Slot
}

// 2) Item — 개별 선택지 label 엘리먼트
interface RadioGroupItemProps
  extends RadioVariantProps,
          RadiomarkVariantProps,
          /* RadioGroupPrimitive.ItemProps: */ {
  value: string;                             // 필수
  disabled?: boolean;
  /* + React.LabelHTMLAttributes<HTMLLabelElement> */
} {
  weight?: "regular" | "bold";               // default "regular"
  tone?: "brand" | "neutral";                // default "brand"
  size?: "medium" | "large";                 // default "medium"
}

// 3) ItemControl — Radiomark 박스 영역. tone/size를 여기서 override 가능
interface RadioGroupItemControlProps
  extends RadiomarkVariantProps,
          React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

// 4) ItemIndicator — 실제 SVG. checked는 선택적(기본 circle SVG 내장)
interface RadioGroupItemIndicatorProps extends React.SVGAttributes<SVGSVGElement> {
  unchecked?: React.ReactNode;               // 거의 사용 안 함 (Radio는 해제 시 윤곽만)
  checked?: React.ReactNode;                 // 선택 시 SVG. 생략 시 viewBox=0 0 24 24의 중앙 원이 기본
}

// 5) ItemLabel — 라벨 텍스트
interface RadioGroupItemLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

// 6) ItemHiddenInput — visually-hidden <input type="radio">
interface RadioGroupItemHiddenInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // name / form / value는 Root에서 주입됨 — 직접 덮어쓰지 말 것
}
```

**default 동작 요약**
- `weight` 미지정 → `"regular"`.
- `tone` 미지정 → `"brand"`.
- `size` 미지정 → `"medium"`.
- `defaultValue` 미지정 → 모든 Item unchecked (초기 선택 없음).
- `disabled` 미지정 → `false`.

---

## 합성 규칙 (composition)

- **모든 Item 은 하나의 Root 아래** — `useRadioGroupContext` 가 공급하는 value/onChange 가 없으면 Item 단독은 동작하지 않는다. 분리 금지.
- **각 Item 은 `value: string` 필수** — 중복된 `value` 두 개를 주면 Root 가 어떤 Item 을 선택할지 결정할 수 없어 UX 가 깨진다.
- **Item 내부에는 Control + Indicator + (Label) + HiddenInput 순서**. HiddenInput 은 마지막(시각 순서와 무관하지만 관행).
- **HiddenInput 은 Item 당 정확히 1 개** — 여러 개 두면 name 이 중복되고 폼 제출 시 마지막 값만 살아남는다.
- **폼 필드 name 은 `RadioGroup.Root` 에** — Root 의 `name` 이 모든 Item 의 HiddenInput 으로 전파. Item 이나 HiddenInput 에 직접 name 을 주지 말 것.
- **`ItemControl` 에 `tone`/`size` 를 주면 Item 값 override** — 대부분은 Item 에만 지정. 같은 그룹에서 한 선택지만 다른 색을 쓰고 싶을 때만 Control 레벨 override.
- **전체 라벨/description/error 가 필요하면 `RadioGroup` 대신 `RadioGroupField` 사용** — 이 문서는 raw `RadioGroup` 만 다룬다. field 결합은 별도 문서.
- **아이콘 SVG 는 단색 팩(`@karrotmarket/react-monochrome-icon`) 또는 inline SVG** — 컬러 아이콘을 넣으면 disabled·pressed 상태에서 색 변환이 안 먹는다.

---

## 접근성 (constraints, not suggestions)

- **Root 는 자동으로 `role="radiogroup"`** 이고 `aria-disabled` / `aria-invalid` 를 disabled/invalid prop 으로 부착한다. 직접 role 을 넣지 말 것.
- **그룹 이름표 필수** — `RadioGroup.Root` 에 반드시 `aria-label` 또는 `aria-labelledby` 를 지정하거나, 외부 `<fieldset>`+`<legend>` 로 감싸거나(`RadioGroupField` 를 쓰면 자동), `label` 텍스트를 연결해야 한다. 그룹 이름표가 없으면 스크린 리더가 "radio group" 으로만 읽고 무엇을 고르는지 알 수 없다.
- **각 Item 의 HiddenInput 은 필수** — 시각적으로는 가려져 있지만 `role="radio"` · `aria-checked` 가 브라우저 네이티브로 부여된다. 빼면 키보드·스크린 리더로 선택 불가.
- **라벨 없는 Item** → `Item` 에 `aria-label` 또는 `aria-labelledby` 필수. `ItemLabel` 을 숨기려면 `VisuallyHidden` 래퍼 사용.
- **키보드** — Tab 으로 그룹에 진입, 화살표 키(↑/↓/←/→)로 radio 간 이동, Space 로 현재 포커스된 radio 선택. 네이티브 input 거동에 위임되므로 별도 핸들러 불필요.
- **invalid 상태** → Root 에 `invalid=true` 를 주면 `aria-invalid="true"` 가 부착된다. 에러 메시지는 `RadioGroupField.ErrorMessage` 또는 외부 `<span id="err">`에 두고 Root 에 `aria-describedby="err"`.
- **required 그룹** → 현재 headless API 에는 `required` 가 없다(주석 참고). 폼 검증은 RHF 등 외부에서 처리.
- **색만으로 상태 전달 금지** — disabled 상태가 색 대비만으로 구별되지 않게 반드시 `disabled` prop 으로 `data-disabled` 부착(포인터 이벤트도 차단됨).

---

## Anti-patterns

```tsx
❌ <RadioGroup.Item value="apple">
     <RadioGroup.ItemControl>
       <RadioGroup.ItemIndicator />
     </RadioGroup.ItemControl>
     <RadioGroup.ItemLabel>사과</RadioGroup.ItemLabel>
     <RadioGroup.ItemHiddenInput />
   </RadioGroup.Item>
   {/* Root 없이 Item 단독 — useRadioGroupContext 누락으로 런타임 에러 / 상태 동작 안 함 */}

❌ <RadioGroup.Root defaultValue="apple">
     <RadioGroup.Item value="apple"><RadioGroup.ItemLabel>사과</RadioGroup.ItemLabel></RadioGroup.Item>
     <RadioGroup.Item value="apple"><RadioGroup.ItemLabel>사과2</RadioGroup.ItemLabel></RadioGroup.Item>
     {/* 중복 value — Root가 어느 쪽을 선택할지 결정 못 함, 키보드 이동 깨짐 */}
   </RadioGroup.Root>

❌ <RadioGroup.Root>
     <RadioGroup.Item value="a">
       <RadioGroup.ItemControl>
         <RadioGroup.ItemIndicator checked={<svg>...</svg>} />
       </RadioGroup.ItemControl>
       <RadioGroup.ItemLabel>A</RadioGroup.ItemLabel>
       {/* ItemHiddenInput 누락 — 스크린 리더가 radio로 인식 못 함, 폼 제출 실패 */}
     </RadioGroup.Item>
   </RadioGroup.Root>

❌ <RadioGroup.Root>
     <RadioGroup.Item value="a" name="fruit">
       {/* Item 레벨에 name — Root의 name이 이미 주입되는데 override하면 혼란 */}
     </RadioGroup.Item>
   </RadioGroup.Root>

❌ <RadioGroup.Root
     value={value}
     /* onValueChange 누락 — controlled인데 setter가 없어 UI 갱신 불가 */
   >
     ...
   </RadioGroup.Root>

❌ <RadioGroup.Root>
     {/* aria-label/aria-labelledby/legend 모두 없음 — 스크린 리더가 그룹 이름을 읽지 못함 */}
     <RadioGroup.Item value="a">...</RadioGroup.Item>
     <RadioGroup.Item value="b">...</RadioGroup.Item>
   </RadioGroup.Root>

❌ <input type="radio" name="fruit" checked={value === "a"} onChange={() => setValue("a")} />
   <input type="radio" name="fruit" checked={value === "b"} onChange={() => setValue("b")} />
   {/* 네이티브 input 직접 — Seed 토큰·tone·size·다크모드 전혀 없음. AI-slop. */}

✅ <RadioGroup.Root
     name="fruit"
     value={value}
     onValueChange={setValue}
     aria-label="좋아하는 과일"
   >
     <RadioGroup.Item value="apple" tone="neutral">
       <RadioGroup.ItemControl>
         <RadioGroup.ItemIndicator
           checked={<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="currentColor" /></svg>}
         />
       </RadioGroup.ItemControl>
       <RadioGroup.ItemLabel>사과</RadioGroup.ItemLabel>
       <RadioGroup.ItemHiddenInput />
     </RadioGroup.Item>
     {/* ...other items */}
   </RadioGroup.Root>
```

---

## 예제 (minimum usage)

### 1. 기본 — 언컨트롤드 + 폼 제출 (`defaultValue`)

```tsx
import { RadioGroup } from "@seed-design/react";

<form onSubmit={handleSubmit}>
  <fieldset>
    <legend>좋아하는 과일</legend>
    <RadioGroup.Root name="fruit" defaultValue="apple">
      {["apple", "banana", "orange"].map((v) => (
        <RadioGroup.Item key={v} value={v}>
          <RadioGroup.ItemControl>
            <RadioGroup.ItemIndicator
              checked={
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill="currentColor" />
                </svg>
              }
            />
          </RadioGroup.ItemControl>
          <RadioGroup.ItemLabel>{v}</RadioGroup.ItemLabel>
          <RadioGroup.ItemHiddenInput />
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  </fieldset>
  <button type="submit">제출</button>
</form>
```

`defaultValue` 만 주면 내부 state. 제출 시 `fruit=apple` 같이 선택된 값이 폼에 포함된다. `<fieldset>`+`<legend>`로 그룹 이름표 제공.

### 2. 컨트롤드 + `onValueChange` (부모가 상태 소유)

```tsx
import { RadioGroup } from "@seed-design/react";
import { useState } from "react";

const [fruit, setFruit] = useState<string>("apple");

<RadioGroup.Root
  value={fruit}
  onValueChange={setFruit}
  aria-label="좋아하는 과일"
>
  {["apple", "banana", "orange"].map((v) => (
    <RadioGroup.Item key={v} value={v}>
      <RadioGroup.ItemControl>
        <RadioGroup.ItemIndicator
          checked={
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="currentColor" />
            </svg>
          }
        />
      </RadioGroup.ItemControl>
      <RadioGroup.ItemLabel>{v}</RadioGroup.ItemLabel>
      <RadioGroup.ItemHiddenInput />
    </RadioGroup.Item>
  ))}
</RadioGroup.Root>
```

`value` + `onValueChange` 를 모두 제공하면 컨트롤드. 한쪽만 주면 경고가 나거나 값이 freeze 된다.

### 3. `tone="brand"` vs `tone="neutral"` 비교 (결제 수단 vs 필터)

```tsx
import { RadioGroup } from "@seed-design/react";

// brand — 결제 수단 선택 (브랜드 강조)
<RadioGroup.Root name="payment" defaultValue="card" aria-label="결제 수단">
  <RadioGroup.Item value="card" tone="brand" size="large" weight="bold">
    <RadioGroup.ItemControl>
      <RadioGroup.ItemIndicator
        checked={
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="currentColor" />
          </svg>
        }
      />
    </RadioGroup.ItemControl>
    <RadioGroup.ItemLabel>신용카드</RadioGroup.ItemLabel>
    <RadioGroup.ItemHiddenInput />
  </RadioGroup.Item>
  <RadioGroup.Item value="bank" tone="brand" size="large" weight="bold">
    <RadioGroup.ItemControl>
      <RadioGroup.ItemIndicator
        checked={
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="currentColor" />
          </svg>
        }
      />
    </RadioGroup.ItemControl>
    <RadioGroup.ItemLabel>계좌이체</RadioGroup.ItemLabel>
    <RadioGroup.ItemHiddenInput />
  </RadioGroup.Item>
</RadioGroup.Root>

// neutral — 리스트 필터 (중립 강조 없음)
<RadioGroup.Root name="sort" defaultValue="recent" aria-label="정렬 기준">
  <RadioGroup.Item value="recent" tone="neutral">
    <RadioGroup.ItemControl>
      <RadioGroup.ItemIndicator
        checked={
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="currentColor" />
          </svg>
        }
      />
    </RadioGroup.ItemControl>
    <RadioGroup.ItemLabel>최신순</RadioGroup.ItemLabel>
    <RadioGroup.ItemHiddenInput />
  </RadioGroup.Item>
  <RadioGroup.Item value="popular" tone="neutral">
    <RadioGroup.ItemControl>
      <RadioGroup.ItemIndicator
        checked={
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="currentColor" />
          </svg>
        }
      />
    </RadioGroup.ItemControl>
    <RadioGroup.ItemLabel>인기순</RadioGroup.ItemLabel>
    <RadioGroup.ItemHiddenInput />
  </RadioGroup.Item>
</RadioGroup.Root>
```

`tone="brand"` 는 결제·약관·예약 같은 "핵심 의사결정"에, `tone="neutral"` 은 필터·정렬·문답처럼 "고르긴 해야 하지만 강조 불필요"한 곳에 쓴다.

### 4. 접근성 제약 — `<fieldset>`/`<legend>` 로 그룹 이름표 제공

```tsx
import { RadioGroup } from "@seed-design/react";

<fieldset>
  <legend>배송 방식을 선택하세요 (필수)</legend>
  <RadioGroup.Root name="delivery" defaultValue="standard">
    {[
      { v: "standard", label: "일반배송 (3,000원)" },
      { v: "express", label: "당일배송 (5,000원)" },
      { v: "pickup", label: "매장 픽업 (무료)" },
    ].map(({ v, label }) => (
      <RadioGroup.Item key={v} value={v} tone="brand" size="large">
        <RadioGroup.ItemControl>
          <RadioGroup.ItemIndicator
            checked={
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="currentColor" />
              </svg>
            }
          />
        </RadioGroup.ItemControl>
        <RadioGroup.ItemLabel>{label}</RadioGroup.ItemLabel>
        <RadioGroup.ItemHiddenInput />
      </RadioGroup.Item>
    ))}
  </RadioGroup.Root>
</fieldset>
```

Root 는 자체적으로 `role="radiogroup"` 을 부여하지만, **그룹이 무엇에 대한 질문인지 알리는 이름표** 는 외부에서 `<fieldset>`/`<legend>` 로 주거나 `aria-label` 로 직접 지정해야 한다. 실무에서는 라벨·description·errorMessage 를 함께 주고 싶을 때 `RadioGroupField` 를 쓰면 이 래핑이 자동.

### 5. `disabled` Item + Root-level `disabled`

```tsx
import { RadioGroup } from "@seed-design/react";

<RadioGroup.Root name="plan" defaultValue="free" aria-label="요금제">
  <RadioGroup.Item value="free" tone="brand" size="large">
    <RadioGroup.ItemControl>
      <RadioGroup.ItemIndicator
        checked={
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="currentColor" />
          </svg>
        }
      />
    </RadioGroup.ItemControl>
    <RadioGroup.ItemLabel>무료</RadioGroup.ItemLabel>
    <RadioGroup.ItemHiddenInput />
  </RadioGroup.Item>
  <RadioGroup.Item value="premium" tone="brand" size="large" disabled>
    {/* 해당 Item만 비활성 — 상위는 정상, 이 radio만 포인터/키보드 선택 불가 */}
    <RadioGroup.ItemControl>
      <RadioGroup.ItemIndicator
        checked={
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="currentColor" />
          </svg>
        }
      />
    </RadioGroup.ItemControl>
    <RadioGroup.ItemLabel>프리미엄 (출시 예정)</RadioGroup.ItemLabel>
    <RadioGroup.ItemHiddenInput />
  </RadioGroup.Item>
</RadioGroup.Root>
```

Item 개별 `disabled` 와 Root 전체 `disabled` 는 OR 로 합쳐진다(`itemDisabled || disabled`). 전체 그룹이 비활성이면 Root 에만 `disabled` 를 건다.

---

## 관련 문서

- [`./radio.md`](./radio.md) — Rootage `radio.yaml` 스펙과 "standalone Radio 없음" 설명
- [`./checkbox-group.md`](./checkbox-group.md) — Radio 가 "하나만" 고르는 것이라면, Checkbox.Group 은 여러 개를 독립 on/off 하는 대응 컴포넌트
- [`decision-matrices/which-input.md`](../decision-matrices/which-input.md) — RadioGroup vs Checkbox vs Switch vs ControlChip 선택 기준
- Rootage 스펙: `packages/rootage/components/radio-group.yaml` · `radio.yaml` · `radiomark.yaml`
