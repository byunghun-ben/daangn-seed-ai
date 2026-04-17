---
name: checkbox
upstream_sha: 1f1d21d
---

# Checkbox

**정의** — 다중 선택(복수 항목을 독립적으로 on/off)을 표현하는 제어 컴포넌트. 네이티브 `<input type="checkbox">`를 숨기고 SVG 기반 시각 체크마크(`Checkmark`)를 레이어로 합성하는 namespace 컴포넌트로, `weight`·`variant`·`tone`·`size`만 결정하면 모든 상태(선택/해제/비활성/중간값/포커스)를 자동 처리한다.

**import**
```ts
import { Checkbox } from "@seed-design/react";
// namespace 사용: <Checkbox.Root>, <Checkbox.Control>, <Checkbox.Indicator>, <Checkbox.Label>, <Checkbox.HiddenInput>
// 여러 Checkbox를 그룹으로 묶을 때는 Checkbox.Group — [./checkbox-group.md](./checkbox-group.md) 참조
```

> **Group은 별도 문서** — `Checkbox.Group`(+Fieldset 래퍼)과 group-scoped 상태(`value[]` / `onValueChange`)는 [`./checkbox-group.md`](./checkbox-group.md)에서 별도로 다룬다. 이 문서는 단일 Checkbox 본체만 다룬다.

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 다중 선택(복수 항목을 독립적으로 on/off — 약관 동의, 필터 체크, 작업 완료 표시) | **Checkbox** (이 컴포넌트) |
| 세 개 이상 항목을 "하나만" 고르는 단일 선택 | ❌ Checkbox 아님. `Radio` ([`./radio.md`](./radio.md)) |
| 2개 옵션을 즉시 on/off 하는 토글 상태 (알림 on/off, 다크 모드) | ❌ Checkbox 아님. `Switch` |
| 여러 Checkbox를 한 묶음으로 묶어 동일 label·required·error 표시 | `Checkbox.Group` ([`./checkbox-group.md`](./checkbox-group.md)) |
| 필수 선택 항목이어서 시각적 강조가 필요 (약관 동의, 결제 동의) | `variant="square"` (default) |
| 리스트 안에서 "선택" 기능으로만 쓰이고 항목 수가 3개 이하 | `variant="ghost"` |
| 인지해야 하는 내용이 없고 단순히 아이콘처럼 보이게 | ❌ Checkbox 아님. `IconButton` / 상태 뱃지 |
| "전체 선택" 마스터 체크박스(자식들이 일부만 선택된 상태 표시) | Checkbox + `indeterminate` prop |

관련 결정 매트릭스: [`decision-matrices/which-input.md`](../decision-matrices/which-input.md)

---

## Anatomy

다섯 슬롯이 한 `Root`(라벨로 렌더링) 아래 함께 쓰인다. `HiddenInput`이 접근성·폼 제출을 책임지고, `Control`+`Indicator`가 시각 체크마크를, `Label`이 텍스트를 담당한다.

| Slot | 필수 | 역할 |
|------|------|------|
| `Checkbox.Root` | ✅ | `<label>` 엘리먼트로 렌더. `weight`·`variant`·`tone`·`size`를 recipe로 해석하고 `checked`·`defaultChecked`·`onCheckedChange`·`indeterminate`·`disabled`·`invalid`·`required` 상태를 하위 슬롯에 전달. `ref`는 `HTMLLabelElement` |
| `Checkbox.Control` | ✅ | Checkmark root(`<div>`). `variant`(square/ghost)·`tone`(neutral/brand)·`size`(medium/large)를 여기서 덮어쓸 수 있음. 체크 박스 시각 영역이 그려지는 곳 |
| `Checkbox.Indicator` | ✅ | 실제 SVG(체크 표시 / 마이너스). `checked`는 **필수 prop**, `unchecked`·`indeterminate`는 선택. `indeterminate` 상태에서 `indeterminate` SVG가 없으면 개발 경고 출력 |
| `Checkbox.Label` | ⚪ | 라벨 텍스트(`<span>`). 숨기고 싶으면 `VisuallyHidden`으로 감싸거나 Root에 `aria-label` 지정 |
| `Checkbox.HiddenInput` | ✅ (폼 제출·a11y 용) | visually-hidden 상태의 네이티브 `<input type="checkbox">`. 폼 제출·스크린 리더·키보드 토글을 네이티브로 위임. 외부 `ref`가 이 input을 가리킴 |

**중요**
- `Root`는 내부적으로 `<label>`이라 **Control·Label과 HiddenInput을 한꺼번에 감싸면 라벨 클릭 = 체크박스 토글**이 자동으로 된다. 직접 `htmlFor`/`id`를 매기지 말 것.
- `Indicator`는 `checked` prop이 필수(TypeScript 타입 레벨 강제). 체크 상태 SVG를 반드시 제공해야 한다.
- `variant="ghost"`에서는 해제 상태에도 아이콘이 보이므로 `unchecked` prop에도 동일 SVG를 전달한다(`variant="square"`에서는 `unchecked={null}`로 둔다).
- `Checkbox.Group`을 같은 namespace에서 export하지만 이 문서에서는 다루지 않는다 → [`./checkbox-group.md`](./checkbox-group.md).

---

## Variants

Checkbox는 Checkbox recipe(라벨 text weight/size)와 Checkmark recipe(박스 모양·색) 두 레이어를 동시에 제어한다.

### `weight` — 라벨 굵기

| 값 | 의미 | 사용 맥락 |
|-----|------|-----------|
| `"regular"` | 기본 본문 굵기 (`$font-weight.regular`) | 일반 체크리스트, 필터, 설정 |
| `"bold"` | 강조 굵기 (`$font-weight.bold`) | 약관 동의, 필수 체크, 강조 필요 |

기본값: `"regular"`.

### `variant` — Checkmark 박스 모양 (Checkmark recipe)

| 값 | 의미 | 사용 맥락 |
|-----|------|----------|
| `"square"` | 윤곽선 박스 + 체크 시 채워짐 | **필수 선택 항목**이거나 사용자가 해당 내용을 반드시 인지해야 하는 경우 (default) |
| `"ghost"` | 윤곽선 없는 투명 박스. 해제 상태에도 아이콘이 보임 | 필수 선택이 아니고 **항목 수가 3개 이하**인 리스트 내 선택 기능 |

기본값: `"square"`.

### `tone` — Checkmark 색조

| 값 | 선택 시 배경/아이콘 | 사용 맥락 |
|-----|--------------------|-----------|
| `"brand"` | `$color.bg.brand-solid` / `$color.palette.static-white` | 브랜드 강조 CTA·약관 동의 (default) |
| `"neutral"` | `$color.bg.neutral-inverted` / `$color.fg.neutral-inverted` | 중립적 선택·필터·리스트 선택 |

기본값: `"brand"`.

### `size` — 박스 + 라벨 크기 동시 변경

| 값 | Checkmark box | 라벨 fontSize | root minHeight | 사용 맥락 |
|-----|--------------|---------------|---------------|-----------|
| `"medium"` | `$dimension.x5` (20px) · icon 12px(square)/14px(ghost) | `$font-size.t4` | `$dimension.x8` | 일반 폼·리스트 (default) |
| `"large"` | `$dimension.x6` (24px) · icon 14px(square)/18px(ghost) | `$font-size.t5` | `$dimension.x9` | 터치 타깃이 큰 설정 화면·모바일 리스트 |

기본값: `"medium"`.

### deprecated `weight="default"` / `weight="stronger"` 안내

초기 버전은 `weight`에 `"default"`·`"stronger"`를 사용했으나 `@seed-design/react@1.3.0`에서 제거 예정이다. 이미 사용 중이라면 `"default" → "regular"`, `"stronger" → "bold"`로 일괄 치환해야 한다. 개발 모드에서는 콘솔 경고가 출력되며 런타임은 내부적으로 자동 매핑하지만, 새 코드에서는 **절대 사용하지 말 것**.

---

## States

Root에서 결정되는 상태는 하위 모든 슬롯에 `data-*` 속성으로 전달되어 Checkmark recipe의 enabled / pressed / disabled / selected(checked) 정의를 활성화한다.

| State | 트리거 | 시각 변화 | Indicator 렌더 |
|-------|--------|-----------|----------------|
| `enabled` (unchecked) | 기본 | 윤곽선만(`square`) 또는 투명 박스 안 회색 아이콘(`ghost`) | `unchecked` SVG (없으면 null) |
| `enabled, selected` | `checked=true` · HiddenInput 토글 | 배경 채워짐(`square`) 또는 아이콘 색조 변경(`ghost`) | `checked` SVG |
| `indeterminate` | `indeterminate=true` prop | 선택 시각 + 마이너스 아이콘 | `indeterminate` SVG(없으면 경고) |
| `pressed` | pointerdown · 스페이스바 | 배경 `*-pressed` 토큰으로 어둡게 | — |
| `hover` | pointermove | data-hover 부착(스타일은 recipe 재량) | — |
| `focus` / `focus-visible` | 탭·스페이스바 포커스 | HiddenInput에 브라우저 포커스 링 위임 | — |
| `disabled` | `disabled=true` | 박스·라벨·아이콘 모두 `$color.fg.disabled` / `$color.bg.disabled` | 유지 |
| `invalid` | `invalid=true` | `aria-invalid="true"` 부착(시각은 외부 Fieldset에서) | 유지 |

**컨트롤드 vs 언컨트롤드**
- **컨트롤드**: `checked` + `onCheckedChange`를 모두 제공 → 부모가 상태 소유.
- **언컨트롤드**: `defaultChecked`만 제공 → 내부 state. 폼 제출 시 HiddenInput이 값을 전송한다.
- `indeterminate`는 "체크/미체크"와는 직교한 세 번째 상태. `indeterminate=true && checked=false` 조합도 정상이고 시각적으로 `indeterminate`가 우선 렌더된다(`Checkbox.tsx`의 렌더 순서 참조).

---

## Token 매핑

Rootage `checkbox.yaml`과 `checkmark.yaml`에서 추출된 주요 토큰. 개별 token으로 덮어쓰지 말고 recipe variant(`variant`·`tone`·`size`·`weight`)로만 제어한다.

```
checkbox recipe (라벨·root 스페이싱):
  root.gap:          $dimension.x2
  label.color:       $color.fg.neutral         # enabled
                     $color.fg.disabled        # disabled
  weight=regular:  label.fontWeight = $font-weight.regular
  weight=bold:     label.fontWeight = $font-weight.bold
  size=medium:     root.minHeight = $dimension.x8, label.fontSize = $font-size.t4
  size=large:      root.minHeight = $dimension.x9, label.fontSize = $font-size.t5

checkmark recipe (박스·아이콘):
  root.cornerRadius:        $radius.r1
  root.colorDuration:       $duration.color-transition
  root.colorTimingFunction: $timing-function.easing
  variant=square:
    enabled:           strokeWidth 1px, strokeColor $color.stroke.neutral-weak
    enabled,selected:  strokeWidth 0px (fill로 대체)
    pressed:           root.color $color.bg.transparent-pressed
    disabled:          root.color $color.bg.disabled, icon.color $color.fg.disabled
  variant=square,tone=brand,enabled+selected:
    root.color $color.bg.brand-solid, icon.color $color.palette.static-white
  variant=square,tone=neutral,enabled+selected:
    root.color $color.bg.neutral-inverted, icon.color $color.fg.neutral-inverted
  variant=ghost:
    enabled:          icon.color $color.fg.placeholder
    pressed:          root.color $color.bg.transparent-pressed
  variant=ghost,tone=brand,enabled+selected:
    icon.color $color.fg.brand
  variant=ghost,tone=neutral,enabled+selected:
    icon.color $color.fg.neutral
  size=medium: box 20px, icon 12px(square)/14px(ghost)
  size=large:  box 24px, icon 14px(square)/18px(ghost)
```

**토큰 사용 원칙**
- `tone` 미지정 시 기본 `"brand"` → 필터·리스트처럼 중립 맥락이면 명시적으로 `tone="neutral"`.
- 체크박스 박스·아이콘 색을 직접 CSS로 덮어쓰지 말 것. 반드시 variant·tone으로 제어.
- `$color.palette.static-white`는 dark 모드에서도 흰색 유지 토큰(square/brand 선택 아이콘 전용).

---

## Props

```ts
import type * as React from "react";
import type {
  CheckboxVariantProps,   // "weight" | "size"
  CheckmarkVariantProps,  // "variant" | "tone" | "size"
} from "@seed-design/css/recipes/...";

// 1) Root — 라벨 엘리먼트 + 상태 소유
interface CheckboxRootProps
  extends Omit<CheckboxVariantProps, "weight">,
          CheckmarkVariantProps,
          React.HTMLAttributes<HTMLLabelElement> {
  // 상태
  checked?: boolean;                 // controlled
  defaultChecked?: boolean;          // uncontrolled initial
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;           // 중간값. checked와 독립
  disabled?: boolean;
  invalid?: boolean;                 // aria-invalid
  required?: boolean;                // HTML required + aria-required

  // 시각 (recipe)
  weight?: "regular" | "bold" | /* @deprecated */ "default" | "stronger";
  variant?: "square" | "ghost";      // default "square"
  tone?: "brand" | "neutral";        // default "brand"
  size?: "medium" | "large";         // default "medium"

  asChild?: boolean;                 // Radix Slot
}

// 2) Control — Checkmark 박스 영역. variant/tone/size를 여기서 다시 제공하면 Root 값을 덮어씀
interface CheckboxControlProps
  extends CheckmarkVariantProps,
          React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

// 3) Indicator — 실제 SVG. checked는 필수
interface CheckboxIndicatorProps extends React.SVGAttributes<SVGSVGElement> {
  unchecked?: React.ReactNode;       // 기본 미렌더. variant="ghost"는 권장
  checked: React.ReactNode;          // 필수
  indeterminate?: React.ReactNode;   // indeterminate=true일 때 필수(없으면 dev 경고)
}

// 4) Label — 라벨 텍스트. 내부에서 state props 자동 주입(data-checked 등)
interface CheckboxLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

// 5) HiddenInput — visually-hidden <input type="checkbox">. 폼/접근성용
interface CheckboxHiddenInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // name / value / form 등 일반 폼 props 그대로
  // 외부 ref는 이 input을 가리킴
}
```

**default 동작 요약**
- `variant` 미지정 → `"square"`.
- `tone` 미지정 → `"brand"`.
- `size` 미지정 → `"medium"`.
- `weight` 미지정 → `"regular"`.
- `defaultChecked` 미지정 → `false`.
- `indeterminate` 미지정 → `false`.

---

## 합성 규칙 (composition)

- **5개 슬롯은 반드시 한 Root 아래**에 있어야 한다. `Control`/`Indicator`/`HiddenInput` 단독 사용 금지 — `useCheckboxContext`가 공급하는 상태가 없으면 렌더 깨짐.
- **Indicator는 Control의 직계 자식으로** — Control이 Checkmark recipe의 root 슬롯이라서 Indicator는 그 안에서 icon 슬롯 스타일을 받는다.
- **Control에 variant/tone/size를 추가로 주면 Root 값을 override** — 대부분은 Root에만 지정. 여러 Checkbox를 Control만 공유해서 쓸 때만 Control에 variant를 지정한다.
- **HiddenInput은 항상 1개** — Root 안에 여러 HiddenInput을 넣지 말 것. 폼 제출 시 충돌.
- **폼 필드명은 HiddenInput의 `name` · `value`로** — Root가 아니라 HiddenInput에 폼 props를 전달한다.
- **외부 ref(`React.forwardRef`)는 HiddenInput을 가리키도록** — RHF의 `register`도 input 포커싱·validity API를 쓰므로 input ref가 필요.
- **Checkbox.Group 안에서 쓸 때는 `value` prop을 HiddenInput에 매핑** — group-level `value[]`/`onValueChange`는 [`./checkbox-group.md`](./checkbox-group.md) 참조.
- **아이콘 SVG는 단색(`@karrotmarket/react-monochrome-icon`)에서만 가져온다** — 컬러 아이콘을 넣으면 disabled·pressed 상태에서 색이 안 먹는다.

---

## 접근성 (constraints, not suggestions)

- **HiddenInput은 필수** — 이걸 빼면 스크린 리더가 체크박스로 인식하지 못한다. 시각적으로는 가려져 있지만 `role="checkbox"`·`aria-checked`가 브라우저 네이티브로 부여된다.
- **라벨 없는 Checkbox** → Root에 `aria-label` 또는 `aria-labelledby` 필수. `Checkbox.Label`을 생략하려면 `VisuallyHidden`으로 감싼다.
- **invalid 상태** → Root에 `invalid=true`를 주면 HiddenInput에 `aria-invalid="true"`가 자동 부착된다. 에러 메시지는 별도 `<span id="err">`에 두고 `aria-describedby="err"`로 연결.
- **required** → `required=true` 프롭으로 HTML required + `aria-required="true"` 자동 부착.
- **키보드** — 스페이스바 = 토글(네이티브 input 거동). 별도 handler 불필요.
- **indeterminate** — `aria-checked="mixed"`가 HiddenInput에 자동 부착되는 것이 아니므로, "전체 선택" 마스터 체크박스처럼 쓸 때 사용자 상태 안내 텍스트를 별도로 제공.
- **색만으로 상태 전달 금지** — brand tone의 disabled 상태가 색 대비만으로 구별되지 않게, 반드시 `disabled=true`로 두어 data-disabled가 붙도록 한다(포인터 이벤트도 차단됨).

---

## Anti-patterns

```tsx
❌ <input type="checkbox" checked={value} onChange={e => setValue(e.target.checked)} />
   {/* 네이티브 input 직접 사용 — Seed 토큰·variant·다크모드·pressed 상태 전혀 없음. AI-slop. */}

❌ <Checkbox.Root>
     <Checkbox.Control>
       <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
     </Checkbox.Control>
     <Checkbox.Label>약관 동의</Checkbox.Label>
     {/* HiddenInput 누락 — 스크린 리더가 체크박스로 인식 못 함, 폼 제출도 안 됨 */}
   </Checkbox.Root>

❌ <Checkbox.Root variant="ghost">
     <Checkbox.Control>
       <Checkbox.Indicator
         checked={<IconCheckmarkFatFill />}
         /* unchecked 생략 — ghost는 해제 상태에도 아이콘이 보여야 하는데 비어 보임 */
       />
     </Checkbox.Control>
     <Checkbox.Label>알림 받기</Checkbox.Label>
     <Checkbox.HiddenInput />
   </Checkbox.Root>

❌ <Checkbox.Root indeterminate={mixed}>
     <Checkbox.Control>
       <Checkbox.Indicator
         checked={<IconCheckmarkFatFill />}
         /* indeterminate 누락 — 개발 모드 콘솔 경고 + 빈 영역 */
       />
     </Checkbox.Control>
     <Checkbox.Label>전체 선택</Checkbox.Label>
     <Checkbox.HiddenInput />
   </Checkbox.Root>

❌ <Checkbox.Root weight="stronger">...</Checkbox.Root>
   {/* deprecated — weight="bold" 로 교체. 1.3.0에서 제거 예정 */}

❌ <Checkbox.Root>
     <Checkbox.Control style={{ backgroundColor: '#FF6F0F' }}>
       <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
     </Checkbox.Control>
     {/* 박스 배경을 직접 hex — tone="brand"로 제어해야 다크/disabled 대응 */}
   </Checkbox.Root>

❌ <form onSubmit={...}>
     <Checkbox.Root checked={agree} onCheckedChange={setAgree}>
       <Checkbox.Control>
         <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
       </Checkbox.Control>
       <Checkbox.Label>약관 동의</Checkbox.Label>
       <Checkbox.HiddenInput />
       {/* name 누락 — 폼 제출 데이터에 안 담김 */}
     </Checkbox.Root>
   </form>

✅ <Checkbox.Root
     weight="bold"
     checked={agree}
     onCheckedChange={setAgree}
     required
   >
     <Checkbox.Control>
       <Checkbox.Indicator
         checked={<IconCheckmarkFatFill />}
         indeterminate={<IconMinusFatFill />}
       />
     </Checkbox.Control>
     <Checkbox.Label>(필수) 서비스 이용약관에 동의합니다</Checkbox.Label>
     <Checkbox.HiddenInput name="agreeTerms" value="1" />
   </Checkbox.Root>
```

---

## 예제 (minimum usage)

### 1. 최소 사용 — 언컨트롤드 + 폼 제출

```tsx
import { Checkbox } from "@seed-design/react";
import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill";

<form onSubmit={handleSubmit}>
  <Checkbox.Root defaultChecked={false}>
    <Checkbox.Control>
      <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
    </Checkbox.Control>
    <Checkbox.Label>마케팅 정보 수신 동의</Checkbox.Label>
    <Checkbox.HiddenInput name="marketing" value="1" />
  </Checkbox.Root>
  <button type="submit">제출</button>
</form>
```

`defaultChecked`만 주면 내부 state. 체크 시 HiddenInput이 `marketing=1`로 폼에 포함된다.

### 2. 컨트롤드 + `weight="bold"` (필수 약관 강조)

```tsx
import { Checkbox } from "@seed-design/react";
import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill";

const [agreed, setAgreed] = React.useState(false);

<Checkbox.Root
  weight="bold"
  checked={agreed}
  onCheckedChange={setAgreed}
  required
>
  <Checkbox.Control>
    <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
  </Checkbox.Control>
  <Checkbox.Label>(필수) 서비스 이용약관에 동의합니다</Checkbox.Label>
  <Checkbox.HiddenInput name="agreeTerms" value="1" />
</Checkbox.Root>
```

`weight="bold"`로 필수 약관 label을 시각적으로 강조. `required`는 HTML required + aria-required 자동.

### 3. `weight="regular"` + `variant="ghost"` (3개 이하 필터)

```tsx
import { Checkbox } from "@seed-design/react";
import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill";

<Checkbox.Root weight="regular" variant="ghost" tone="neutral">
  <Checkbox.Control>
    <Checkbox.Indicator
      unchecked={<IconCheckmarkFatFill />}
      checked={<IconCheckmarkFatFill />}
    />
  </Checkbox.Control>
  <Checkbox.Label>무료 나눔만 보기</Checkbox.Label>
  <Checkbox.HiddenInput name="filter" value="free" />
</Checkbox.Root>
```

`variant="ghost"`는 해제 상태에도 아이콘이 보여야 자연스러우므로 `unchecked`에도 같은 SVG를 전달.

### 4. `indeterminate` — "전체 선택" 마스터 체크박스

```tsx
import { Checkbox } from "@seed-design/react";
import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill";
import IconMinusFatFill from "@karrotmarket/react-monochrome-icon/IconMinusFatFill";

const items = ["약관1", "약관2", "약관3"];
const [selected, setSelected] = React.useState<string[]>([]);

const allChecked = selected.length === items.length;
const isIndeterminate = selected.length > 0 && !allChecked;

<Checkbox.Root
  checked={allChecked}
  indeterminate={isIndeterminate}
  onCheckedChange={(next) => setSelected(next ? items : [])}
>
  <Checkbox.Control>
    <Checkbox.Indicator
      checked={<IconCheckmarkFatFill />}
      indeterminate={<IconMinusFatFill />}
    />
  </Checkbox.Control>
  <Checkbox.Label>전체 선택</Checkbox.Label>
  <Checkbox.HiddenInput />
</Checkbox.Root>
```

하위 항목이 일부만 선택되면 `isIndeterminate`가 true → 마이너스(`IconMinusFatFill`) 아이콘이 렌더된다. `indeterminate` SVG를 빼면 개발 모드에서 콘솔 경고.

### 5. `size="large"` + `disabled`

```tsx
import { Checkbox } from "@seed-design/react";
import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill";

<Checkbox.Root size="large" disabled defaultChecked>
  <Checkbox.Control>
    <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
  </Checkbox.Control>
  <Checkbox.Label>본인 인증 완료 (수정 불가)</Checkbox.Label>
  <Checkbox.HiddenInput />
</Checkbox.Root>
```

`size="large"`는 모바일·터치 타겟이 큰 설정 화면용. `disabled`는 label·박스·아이콘 모두 `$color.fg.disabled`로 흐려지고 포인터 이벤트 차단.

### 6. 외부 ref — React Hook Form 연동

```tsx
import { useForm } from "react-hook-form";
import { Checkbox } from "@seed-design/react";
import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill";

const { register, handleSubmit } = useForm();

<Checkbox.Root>
  <Checkbox.Control>
    <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
  </Checkbox.Control>
  <Checkbox.Label>푸시 알림 수신</Checkbox.Label>
  <Checkbox.HiddenInput {...register("push")} />
</Checkbox.Root>
```

`register`가 내부적으로 ref/name/onChange를 HiddenInput에 주입 — Root가 아니라 HiddenInput에 `{...register(...)}`를 퍼뜨린다.

---

## 관련 문서

- [`./checkbox-group.md`](./checkbox-group.md) — 여러 Checkbox를 묶어 공통 label·error·required를 주는 `Checkbox.Group`(Fieldset 래퍼)
- [`./radio.md`](./radio.md) — 다중 선택이 아니라 단일 선택이면 Radio
- [`decision-matrices/which-input.md`](../decision-matrices/which-input.md) — Checkbox vs Radio vs Switch vs ControlChip 선택 기준
