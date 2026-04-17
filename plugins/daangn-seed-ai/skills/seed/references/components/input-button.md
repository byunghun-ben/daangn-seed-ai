---
name: input-button
upstream_sha: 1f1d21d
---

# InputButton (FieldButton)

**정의 한 줄** — 사용자가 직접 타이핑하지 않고 **탭해서 값을 고르는 필드**. 날짜 선택, 지역 선택, 카테고리 선택처럼 별도의 picker(바텀시트, 다이얼로그)를 열어 값을 확정하는 *picker trigger* 역할이다.

**import**
```ts
import { FieldButton } from "@seed-design/react";
```

> **주의** — Rootage 스펙의 ID 는 `input-button` 이지만 React 구현체 namespace 이름은 **`FieldButton`** 이다. 이 문서는 Rootage 기준 파일명을 유지하되, 모든 코드 예제와 슬롯 매핑은 `FieldButton.*` 형태로 기술한다. (upstream `packages/rootage/components/input-button.yaml` ↔ `packages/react/src/components/FieldButton/`)

관련 결정 매트릭스: [`decision-matrices/which-input.md`](../decision-matrices/which-input.md)

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 지역 선택 ("서울 강남구 역삼동") | **InputButton** (picker trigger) |
| 날짜/시간 선택 | **InputButton** + DatePicker 바텀시트 |
| 카테고리/태그 선택 | **InputButton** + 선택 바텀시트 |
| 사용자가 **자유롭게 입력**해야 하는 값 (이름, 이메일, 가격) | [`TextField`](./text-field.md) |
| 옵션 2–5개 중 하나 | `SelectBox`, `RadioGroup` |
| 단순 on/off | `Switch` |

### TextField vs InputButton — 경계

**TextField 는 "자유 입력"**, **InputButton 은 "탭해서 선택"** 이다. 사용자가 키보드로 문자를 치는 흐름이면 TextField 를 써야 한다. 반대로 값의 후보가 유한하고, 선택은 별도 화면(바텀시트/다이얼로그)에서 이뤄진다면 InputButton 이 맞다. 시각적으로 둘 다 stroke 와 padding 이 비슷해 보이지만, InputButton 은 내부에 `<input>` 이 없고 `<button>` 이다. 자세한 자유 입력 합성은 [`./text-field.md`](./text-field.md) 를 참조.

---

## Anatomy

InputButton(`FieldButton`) 의 Rootage 스펙(`input-button.yaml`)은 **8개 slot** 으로 정의되지만, 실제 React 구현에서는 **세 개의 wrapper 계층** (`Root` → `Control` → `Button`) 으로 쪼개진다. 각각이 서로 다른 recipe context 를 제공하며, 순서를 생략할 수 없다.

- **`FieldButton.Root`** — `<Primitive.div>`. `field` recipe provider. Field 단위 레이아웃(Header/Control/Footer 수직 배치)과 상태(`values`/`disabled`/`invalid`) 컨텍스트 공급.
- **`FieldButton.Control`** — `<Primitive.div>`. `inputButton` recipe provider. **stroke/padding/height/bg 등 input-button 시각 스타일의 실제 진입점**. Value/Placeholder/PrefixText/SuffixText 가 `useClassNames()` 로 스타일을 가져가는 대상이 바로 이 Control 이다. Control wrapper 가 없으면 하위 slot 들의 recipe context 가 비어 있어 스타일이 깨진다.
- **`FieldButton.Button`** — `<Primitive.button>`. `inputButton` recipe 의 `"button"` slot consumer. 실제 클릭 트리거. `onClick`/`aria-label`/`aria-haspopup` 같은 인터랙션 props 는 반드시 **Button** 에 부착해야 한다 (Root/Control 은 `<div>` 라 click 을 받지 못함).

> **중요** — Button 은 Control **내부**에 배치되지만, `PrefixIcon`/`PrefixText`/`Value`/`Placeholder`/`SuffixText`/`SuffixIcon`/`ClearButton` 은 **Button 의 children 이 아니라 Control 의 children 으로 Button 과 형제** 로 나란히 배치한다. upstream `docs/registry/ui/field-button.tsx` 구조와 동일.

```
┌─ FieldButton.Root (div — field recipe, layout + values/state context) ───────┐
│ ┌─ FieldButton.Header (선택) ─ Label / IndicatorText / RequiredIndicator ──┐ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌─ FieldButton.Control (div — inputButton recipe provider, stroke/pad/bg) ─┐ │
│ │ ┌─ FieldButton.Button (button — interactive trigger) ─┐                  │ │
│ │ └──────────────────────────────────────────────────────┘                  │ │
│ │ [PrefixIcon] [PrefixText] [Value | Placeholder] [ClearButton] [SuffixText] [SuffixIcon] │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌─ FieldButton.Footer (선택) ─ Description / ErrorMessage ─────────────────┐ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ FieldButton.HiddenInput × N (values 배열 index)                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

| Slot | 필수 | 역할 | 엘리먼트 |
|------|------|------|----------|
| `root` (field layout) | ✅ | Field 레이아웃 wrapper — Header/Control/Footer 수직 배치, values/disabled 컨텍스트 | `<div>` |
| `control` (style host) | ✅ | **input-button recipe provider** — stroke, padding, height, bg 스타일 진입점. Value/Placeholder/PrefixText/SuffixText 의 스타일은 Control 의 `useClassNames()` 로 해석된다 | `<div>` |
| `button` (trigger) | ✅ | 실제 클릭 트리거 — onClick/aria-label 을 받음 | `<button>` |
| `value` | ✅ | 선택된 값 텍스트 — 존재 시 placeholder 대신 표시 | `<div aria-hidden>` |
| `placeholder` | ⚪ | 미선택 상태 안내 문구 | `<div aria-hidden>` |
| `prefixText` | ⚪ | 값 앞 보조 텍스트 (예: "출발지") | `<span aria-hidden>` |
| `prefixIcon` | ⚪ | 값 앞 아이콘 (예: 핀 아이콘) | `<svg>` |
| `suffixText` | ⚪ | 값 뒤 보조 텍스트 (예: 단위) | `<span aria-hidden>` |
| `suffixIcon` | ⚪ | 값 뒤 아이콘 (예: chevron-down) | `<svg>` |
| `clearButton` | ⚪ | 선택 해제 버튼 (X) — Button 과 별개의 native `<button>` | `<button>` |

### YAML ↔ React 매핑표

`input-button.yaml` 의 `root` slot 은 React 구현에서 **세 개의 wrapper** 로 쪼개진다 — `FieldButton.Root`(field 레이아웃 + values 컨텍스트), `FieldButton.Control`(input-button 시각 스타일 context), `FieldButton.Button`(인터랙션 트리거). upstream `packages/react/src/components/FieldButton/FieldButton.tsx` 의 `withFieldProvider(field)` ↔ `withProvider(inputButton)` ↔ `withContext(inputButton, "button")` 3계층을 그대로 반영.

| YAML slot (`input-button.yaml`) | React (`FieldButton.*`) | recipe | 역할 구분 |
|---|---|---|---|
| `root` | `FieldButton.Root` | `field` | **layout + state** — `<div>`, Header/Control/Footer 배치, values/disabled context |
| `root` | `FieldButton.Control` | `inputButton` | **style host** — `<div>`, stroke/padding/height/bg recipe context provider |
| `root` | `FieldButton.Button` | `inputButton` (slot: button) | **interactive trigger** — `<button>`, onClick/aria-label |
| `value` | `FieldButton.Value` | `inputButton` (slot: value) | 선택된 값 텍스트 |
| `placeholder` | `FieldButton.Placeholder` | `inputButton` (slot: placeholder) | 미선택 placeholder |
| `prefixText` | `FieldButton.PrefixText` | `inputButton` (slot: prefixText) | 값 앞 텍스트 |
| `prefixIcon` | `FieldButton.PrefixIcon` | `inputButton` (slot: prefixIcon) | 값 앞 아이콘 |
| `suffixText` | `FieldButton.SuffixText` | `inputButton` (slot: suffixText) | 값 뒤 텍스트 |
| `suffixIcon` | `FieldButton.SuffixIcon` | `inputButton` (slot: suffixIcon) | 값 뒤 아이콘 |
| `clearButton` | `FieldButton.ClearButton` | `inputButton` (slot: clearButton) | 값 해제 X 버튼 |

### Field 조합 시 추가 slot

`FieldButton` namespace 는 총 18개를 export 한다. 위 10개(Root + Control + Button + 7 slot)가 **기본 InputButton** 에 해당하고, 나머지 8개는 label/description/error-message 등 *Field wrapper 전체* 를 함께 렌더링할 때 사용하는 slot 으로, Rootage 단독 스펙 기준 `input-button.yaml` 에는 정의되어 있지 않다. 레이블·에러 메시지 등 상위 Field 구조가 필요한 경우에만 추가한다.

| `FieldButton.*` (Field 조합 전용) | 역할 |
|---|---|
| `FieldButton.Header` | 레이블 영역 컨테이너 |
| `FieldButton.Label` | 필드 제목 |
| `FieldButton.IndicatorText` | 필수/선택 텍스트 표시 |
| `FieldButton.RequiredIndicator` | 필수 아이콘(*) |
| `FieldButton.Footer` | 설명/에러 영역 컨테이너 |
| `FieldButton.Description` | 도움말 텍스트 |
| `FieldButton.ErrorMessage` | 에러 메시지 |
| `FieldButton.HiddenInput` | 폼 제출용 hidden input (values 배열 index 지정) |

Field wrapper 전체 합성 패턴은 [`./text-field.md`](./text-field.md) 의 Field 구조와 동일하다.

---

## Variants

InputButton 은 **variant 축이 없다**. size 나 color variant 대신, 상태(state)에 따라 stroke 와 배경이 바뀐다. 필요하다면 상위 컨테이너에서 폭(width)만 조절한다.

---

## States

| State | 트리거 | 시각 변화 | data attribute |
|-------|--------|-----------|----------------|
| `enabled` | 기본 | stroke 1px, 투명 배경 | — |
| `hover` | 포인터 오버 | (테마마다 다름, Root 에 `data-hover`) | `data-hover` |
| `pressed` | 탭/press | 배경 약간 어두움 | `data-active` |
| `focus` | 포커스 | focus ring | `data-focus` / `data-focus-visible` |
| `invalid` | `invalid` prop | stroke 2px, critical 색 | `data-invalid` |
| `disabled` | `disabled` prop | 배경 disabled, 텍스트 흐려짐, pointer-events 차단 | `data-disabled` |
| `readonly` | `readOnly` prop | 배경 disabled, 텍스트는 유지 | `data-readonly` |

> upstream `useFieldButton` 이 Root/Button 양쪽에 이 data-attribute 를 `stateProps` 로 부여한다. Button 의 `disabled`/`readonly` 는 native `disabled` 속성으로 내려가, 추가로 hidden input 의 submit 동작도 제어한다(disabled = 미제출, readonly = 제출).

---

## Token 매핑

`input-button.yaml` 의 `definitions.base` 를 그대로 따르며, React 구현은 `@seed-design/css/recipes/input-button` recipe 를 통해 자동 주입한다.

### root (layout wrapper) — enabled

| 속성 | 값 |
|---|---|
| height | `$dimension.x13` |
| cornerRadius | `$radius.r3` |
| paddingX | `$dimension.x4` |
| gap | `$dimension.x2_5` |
| strokeWidth | `1px` |
| strokeColor | `$color.stroke.neutral-weak` |
| color (bg) | `$color.bg.transparent` |
| colorDuration | `$duration.color-transition` |
| strokeDuration | `0.1s` (invalid ↔ enabled fade) |

### 상태별 오버라이드

| State | root | value | placeholder |
|---|---|---|---|
| `pressed` | `color = bg.transparent-pressed` | — | — |
| `invalid` | `strokeWidth = 2px`, `strokeColor = stroke.critical-solid` | — | — |
| `disabled` | `color = bg.disabled` | `color = fg.disabled` | `color = fg.disabled` |
| `readonly` | `color = bg.disabled` | `color = fg.neutral` (유지) | `color = fg.placeholder` |

### 텍스트/아이콘 slot

| Slot | fontSize / size | color |
|---|---|---|
| `value` | `$font-size.t5` / `$line-height.t5` | `$color.fg.neutral` |
| `placeholder` | `$font-size.t5` | `$color.fg.placeholder` |
| `prefixText` / `suffixText` | `$font-size.t5` | `$color.fg.neutral-muted` |
| `prefixIcon` / `suffixIcon` | `$dimension.x5` (20px) | `$color.fg.neutral-muted` |
| `clearButton` | `22px` | `$color.fg.neutral-subtle` |

`stroke` 는 투명도 기반 fade 트랜지션(`strokeDuration = 0.1s`)으로 invalid ↔ enabled 가 자연스럽게 전환된다.

---

## Props (핵심만)

### `FieldButton.Root` — 상태/값 컨테이너

```ts
// upstream: packages/react-headless/field-button/src/useFieldButton.ts
interface FieldButtonRootProps {
  // 값 — 배열 기반 (multi-value 지원 가능, 단일 값도 [v] 로 넘긴다)
  values?: string[];
  onValuesChange?: (values: string[]) => void;

  // 상태
  disabled?: boolean;
  readOnly?: boolean;   // camelCase (HTML prop 과 동일)
  invalid?: boolean;

  // 폼
  name?: string;        // 없으면 내부 useId() 사용
}
```

> **배열 API 인 이유** — FieldButton 은 내부적으로 `FieldButton.HiddenInput` 으로 폼에 값을 제출하며, 다중 선택(multi-picker)도 지원하도록 설계되었다. 단일 값을 쓸 때는 `values={[value]}` / `onValuesChange={([v]) => setValue(v ?? "")}` 패턴을 사용한다. upstream examples(`basic-usage.tsx`, `clear-button.tsx`)와 동일.

### `FieldButton.Button` — 인터랙션 트리거

```ts
// upstream: FieldButtonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>
interface FieldButtonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // 표준 button 속성이 그대로 — 여기에 onClick/aria-label/aria-haspopup 을 단다
  onClick?: (e: React.MouseEvent) => void;
}
```

> **onClick 은 Root 가 아니라 Button 에** — Root 는 `<div>` 라 기본 버튼 동작이 없다. `onClick`, `aria-label`, `aria-haspopup="dialog"` 같은 인터랙션 props 는 반드시 `FieldButton.Button` 에 부착해야 한다.

Value/Placeholder/PrefixText/SuffixText 는 `aria-hidden` 으로 렌더되며, Button 의 accessible name(주로 `aria-label`)만 스크린리더에 전달된다.

---

## 합성 규칙 (composition)

- **`Root` → `Control` → `Button` 계층은 생략 불가** — Control 이 `inputButton` recipe provider 이므로, Root 바로 밑에 Button 을 배치하면 stroke/padding/bg 가 적용되지 않고 Value/Placeholder/PrefixText/SuffixText 의 `useClassNames()` 도 빈 값이 된다 (upstream `FieldButton.tsx` 의 `withFieldProvider(field)` → `withProvider(inputButton)` 구조 참조).
- **Value/Placeholder/PrefixIcon/PrefixText/SuffixText/SuffixIcon/ClearButton 은 Control 의 직접 children** — Button 의 children 이 아니다. upstream `docs/registry/ui/field-button.tsx` 는 Button 을 self-closing 으로 렌더하고, 나머지 slot 을 Button 의 형제로 배치한다.
- **`onClick` 은 `FieldButton.Button` 에 부착** — Root/Control 은 div 라서 click 을 받지 못한다. upstream examples 가 `buttonProps={{ onClick, "aria-label" }}` 로 Button 에 내려보내는 이유.
- **탭 시 picker 를 반드시 열 것** — FieldButton 은 자체적으로 값을 변경하지 않는다. Button 의 onClick 으로 BottomSheet/Dialog 를 띄워 picker 를 호스팅한다.
- **`value` 와 `placeholder` 는 동시 렌더하지 말 것** — 값이 있으면 placeholder 는 숨긴다. 일반적으로 `{value ? <Value>{value}</Value> : <Placeholder>...</Placeholder>}` 삼항으로 처리.
- **`clearButton` 은 `values` 가 비어있지 않을 때만** — 선택된 값이 없는데 X 버튼이 나오면 혼란. upstream `useFieldButton` 은 disabled/readonly 시 clearButton 을 `hidden` 처리한다.
- **clear 는 `onValuesChange([])` 로** — ClearButton 은 내부적으로 `setValues([])` 를 호출한다. 외부에서 controlled 로 다룰 때는 동일하게 빈 배열을 넘긴다.
- **자유 입력이 필요하면 [`./text-field.md`](./text-field.md) 로 전환** — InputButton 에 직접 keyboard 입력을 붙이지 말 것 (anti-pattern).
- **아이콘은 [`./icon.md`](./icon.md) 의 svg 규격** — `prefixIcon`/`suffixIcon` size 는 `$dimension.x5` (20px).

---

## 접근성 (constraints, not suggestions)

- `FieldButton.Button` 이 `<button type="button">` 으로 렌더되며, 키보드 Enter/Space 로 활성화.
- 상위 Field.Label 이 없으면 Button 에 `aria-label` 필수 (예: `aria-label="지역 선택"`).
- picker 를 여는 버튼이면 `aria-haspopup="dialog"` (또는 `"listbox"`) 를 함께.
- `invalid` 시 Root/Button 양쪽에 `data-invalid` + `aria-invalid="true"` 가 자동 부여.
- `disabled` / `readOnly` 는 Button 의 native `disabled` 속성과 `aria-disabled` 양쪽에 반영.
- `PrefixText`/`SuffixText`/`Value`/`Placeholder` 는 `aria-hidden` — 스크린리더는 **Button 의 accessible name만** 읽는다. 따라서 현재 값을 스크린리더에 알리려면 `aria-label` 을 동적으로 구성한다(예: `aria-label={value ? \`도시 변경. 현재: ${value}\` : "도시 선택"}`).

---

## Anti-patterns

```tsx
// 1. FieldButton.Control 없이 Root 에 Button 을 직접 배치 — input-button recipe context 가 없어 stroke/padding/bg 스타일이 깨진다
<FieldButton.Root values={[v]} onValuesChange={...}>
  <FieldButton.Button onClick={openPicker} aria-label="지역 선택">
    <FieldButton.Placeholder>지역</FieldButton.Placeholder>
  </FieldButton.Button>
</FieldButton.Root>
// → Control wrapper 필수 (Value/Placeholder/PrefixText/SuffixText 의 useClassNames() 진입점):
// <FieldButton.Root values={[v]} onValuesChange={...}>
//   <FieldButton.Control>
//     <FieldButton.Button onClick={openPicker} aria-label="지역 선택" />
//     <FieldButton.Placeholder>지역</FieldButton.Placeholder>
//   </FieldButton.Control>
// </FieldButton.Root>

// 2. FieldButton.Root 에 onClick 직접 부착 — Root 는 div 라서 trigger 가 아니다
<FieldButton.Root onClick={openPicker}>
  <FieldButton.Control>
    <FieldButton.Placeholder>지역</FieldButton.Placeholder>
  </FieldButton.Control>
</FieldButton.Root>
// → onClick 은 FieldButton.Button 에:
// <FieldButton.Root values={[v]} onValuesChange={...}>
//   <FieldButton.Control>
//     <FieldButton.Button onClick={openPicker} aria-label="지역 선택" />
//     <FieldButton.Placeholder>지역</FieldButton.Placeholder>
//   </FieldButton.Control>
// </FieldButton.Root>

// 3. Button 내부에 Value/Placeholder/PrefixIcon 을 children 으로 배치 — 잘못된 계층
<FieldButton.Control>
  <FieldButton.Button onClick={openPicker} aria-label="지역 선택">
    <FieldButton.PrefixIcon svg={<PinIcon />} />
    <FieldButton.Placeholder>지역</FieldButton.Placeholder>
  </FieldButton.Button>
</FieldButton.Control>
// → Value/Placeholder/PrefixIcon 은 Button 의 형제로, Control 의 직접 children:
// <FieldButton.Control>
//   <FieldButton.Button onClick={openPicker} aria-label="지역 선택" />
//   <FieldButton.PrefixIcon svg={<PinIcon />} />
//   <FieldButton.Placeholder>지역</FieldButton.Placeholder>
// </FieldButton.Control>

// 4. 자유 입력이 필요한데 InputButton 사용 — picker 가 없는 흐름
<FieldButton.Root>
  <FieldButton.Control>
    <FieldButton.Button aria-label="이메일" />
    <FieldButton.Placeholder>이메일</FieldButton.Placeholder>
  </FieldButton.Control>
</FieldButton.Root>
// → TextField 사용: ./text-field.md 참조

// 5. value 와 placeholder 동시 렌더
<FieldButton.Control>
  <FieldButton.Button aria-label="지역" />
  <FieldButton.Value>서울 강남구</FieldButton.Value>
  <FieldButton.Placeholder>지역을 선택하세요</FieldButton.Placeholder>
</FieldButton.Control>
// → value 가 있으면 placeholder 는 조건부 렌더

// 6. 단일 값을 values/onValuesChange 없이 스타일만 쓰기 — clear, hidden input 이 깨짐
<FieldButton.Root>
  <FieldButton.Control>
    <FieldButton.Button aria-label="..." />
  </FieldButton.Control>
</FieldButton.Root>
// → values={[current]} onValuesChange={([v]) => setCurrent(v ?? "")} 로 묶을 것

// 7. aria-label 없이 iconOnly 성격으로 사용
<FieldButton.Root values={[v]} onValuesChange={...}>
  <FieldButton.Control>
    <FieldButton.Button />
    <FieldButton.PrefixIcon svg={<PinIcon />} />
  </FieldButton.Control>
</FieldButton.Root>
// → Button 에 aria-label="출발지 선택" 필수
```

---

## 예제 (minimum usage)

### 1) 기본 — 도시 선택 trigger

```tsx
import { FieldButton } from "@seed-design/react";
import { useState } from "react";

function CityPicker() {
  const [city, setCity] = useState("");

  return (
    <FieldButton.Root
      values={[city]}
      onValuesChange={([v]) => setCity(v ?? "")}
    >
      <FieldButton.Control>
        <FieldButton.Button
          onClick={() => {
            // Open your picker dialog/sheet here
            setCity("서울");
          }}
          aria-label={city ? `도시 변경. 현재: ${city}` : "도시 선택"}
          aria-haspopup="dialog"
        />
        {city ? (
          <FieldButton.Value>{city}</FieldButton.Value>
        ) : (
          <FieldButton.Placeholder>도시를 선택해주세요</FieldButton.Placeholder>
        )}
      </FieldButton.Control>
    </FieldButton.Root>
  );
}
```

### 2) prefix/suffix 아이콘 조합 — 출발지 필드

```tsx
import { FieldButton } from "@seed-design/react";
import { IconPinLine, IconChevronDownLine } from "@karrotmarket/react-monochrome-icon";
import { useState } from "react";

function DepartureField({ onOpen }: { onOpen: () => void }) {
  const [departure, setDeparture] = useState("");

  return (
    <FieldButton.Root
      values={[departure]}
      onValuesChange={([v]) => setDeparture(v ?? "")}
    >
      <FieldButton.Control>
        <FieldButton.Button onClick={onOpen} aria-label="출발지 선택" aria-haspopup="dialog" />
        <FieldButton.PrefixIcon svg={<IconPinLine />} />
        <FieldButton.PrefixText>출발</FieldButton.PrefixText>
        {departure ? (
          <FieldButton.Value>{departure}</FieldButton.Value>
        ) : (
          <FieldButton.Placeholder>어디서 출발하나요?</FieldButton.Placeholder>
        )}
        <FieldButton.SuffixIcon svg={<IconChevronDownLine />} />
      </FieldButton.Control>
    </FieldButton.Root>
  );
}
```

### 3) invalid 상태 + clearButton — 날짜 선택

```tsx
import { FieldButton } from "@seed-design/react";
import { useState } from "react";

function DateField({ onOpenDatePicker }: { onOpenDatePicker: () => void }) {
  const [date, setDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const invalid = submitted && !date;

  return (
    <FieldButton.Root
      invalid={invalid}
      values={[date]}
      onValuesChange={([v]) => setDate(v ?? "")}
    >
      <FieldButton.Control>
        <FieldButton.Button
          onClick={onOpenDatePicker}
          aria-label={date ? `예약 날짜 변경. 현재: ${date}` : "예약 날짜 선택"}
          aria-haspopup="dialog"
        />
        {date ? (
          <FieldButton.Value>{date}</FieldButton.Value>
        ) : (
          <FieldButton.Placeholder>날짜를 선택하세요</FieldButton.Placeholder>
        )}
        {date && <FieldButton.ClearButton aria-label="날짜 지우기" />}
      </FieldButton.Control>
    </FieldButton.Root>
  );
}
```

---

## 참고

- Rootage 스펙: `packages/rootage/components/input-button.yaml` (upstream sha `1f1d21d`)
- React 구현: `packages/react/src/components/FieldButton/` + `packages/react-headless/field-button/` — namespace 이름이 `FieldButton` 인 이유는 Field 와 Button 합성 의미를 강조하기 위함.
- upstream examples: `docs/examples/react/field-button/` — `basic-usage.tsx`, `form-bottom-sheet.tsx`, `clear-button.tsx` 가 values/onValuesChange/buttonProps 패턴을 보여준다.
- 자유 입력 필드: [`./text-field.md`](./text-field.md)
- 아이콘 규격: [`./icon.md`](./icon.md) · 아이콘 패키지: `@karrotmarket/react-monochrome-icon`
