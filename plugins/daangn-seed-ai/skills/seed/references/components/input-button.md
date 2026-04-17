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

**TextField 는 "자유 입력"**, **InputButton 은 "탭해서 선택"** 이다. 사용자가 키보드로 문자를 치는 흐름이면 TextField 를 써야 한다. 반대로 값의 후보가 유한하고, 선택은 별도 화면(바텀시트/다이얼로그)에서 이뤄진다면 InputButton 이 맞다. 시각적으로 둘 다 stroke 와 padding 이 비슷해 보이지만, InputButton 은 내부에 `<input>` 이 없고 버튼(`role="button"`) 이다. 자세한 자유 입력 합성은 [`./text-field.md`](./text-field.md) 를 참조.

---

## Anatomy

InputButton(`FieldButton`) 의 기본 구성은 8개 slot 이며, 모두 `input-button.yaml` 에 정의되어 있다.

```
┌─────────────────────────────────────────────────┐
│ [prefixIcon] prefixText  [value | placeholder]  │  ← root
│                          suffixText [suffixIcon │
│                                    clearButton] │
└─────────────────────────────────────────────────┘
```

| Slot | 필수 | 역할 |
|------|------|------|
| `root` | ✅ | 외곽 컨테이너 (stroke, padding, height) |
| `value` | ✅ | 선택된 값 텍스트 — 존재 시 placeholder 대신 표시 |
| `placeholder` | ⚪ | 미선택 상태 안내 문구 |
| `prefixText` | ⚪ | 값 앞 보조 텍스트 (예: "출발지") |
| `prefixIcon` | ⚪ | 값 앞 아이콘 (예: 핀 아이콘) |
| `suffixText` | ⚪ | 값 뒤 보조 텍스트 (예: 단위) |
| `suffixIcon` | ⚪ | 값 뒤 아이콘 (예: chevron-down) |
| `clearButton` | ⚪ | 선택 해제 버튼 (X) |

### YAML ↔ React 매핑표

`input-button.yaml` 의 8 slot 은 `FieldButton` namespace 의 sub-component 로 1:1 매핑된다.

| YAML slot (`input-button.yaml`) | React (`FieldButton.*`) |
|---|---|
| `root` | `FieldButton.Root` |
| `value` | `FieldButton.Value` |
| `placeholder` | `FieldButton.Placeholder` |
| `prefixText` | `FieldButton.PrefixText` |
| `prefixIcon` | `FieldButton.PrefixIcon` |
| `suffixText` | `FieldButton.SuffixText` |
| `suffixIcon` | `FieldButton.SuffixIcon` |
| `clearButton` | `FieldButton.ClearButton` |

---

## Field 조합 시 추가 slot

`FieldButton` namespace 는 총 18개를 export 하지만, 그중 10개는 **`input-button.yaml` 에는 정의되어 있지 않다**. 이들은 label/description/error-message 등 *Field wrapper 전체* 를 함께 렌더링할 때만 사용하는 slot 으로, Rootage 단독 스펙 기준 InputButton 에는 포함되지 않는다. **기본 input-button 사용 시에는 불필요**하며, 레이블·에러 메시지 등 상위 Field 구조가 필요한 경우에만 추가한다.

| `FieldButton.*` (Field 조합 전용) | 역할 | 기본 input-button 사용 시 |
|---|---|---|
| `FieldButton.Header` | 레이블 영역 컨테이너 | 불필요 |
| `FieldButton.Label` | 필드 제목 | 불필요 |
| `FieldButton.IndicatorText` | 필수/선택 텍스트 표시 | 불필요 |
| `FieldButton.RequiredIndicator` | 필수 아이콘(*) | 불필요 |
| `FieldButton.Footer` | 설명/에러 영역 컨테이너 | 불필요 |
| `FieldButton.Description` | 도움말 텍스트 | 불필요 |
| `FieldButton.ErrorMessage` | 에러 메시지 | 불필요 |
| `FieldButton.HiddenInput` | 폼 제출용 hidden input | 불필요 |
| `FieldButton.Button` | 네이티브 button element | 불필요 (Root 내부에서 이미 사용) |
| `FieldButton.Control` | Value/Placeholder 컨테이너 | 불필요 |

즉, 최소 InputButton 은 `Root` 하나만으로 동작하며, 필요한 slot 만 골라 조합한다. Field wrapper 10 slot 을 함께 써야 한다면 [`./text-field.md`](./text-field.md) 의 Field 구조와 합성 규칙을 함께 참고.

---

## Variants

InputButton 은 **variant 축이 없다**. size 나 color variant 대신, 상태(state)에 따라 stroke 와 배경이 바뀐다. 필요하다면 상위 컨테이너에서 폭(width)만 조절한다.

---

## States

| State | 트리거 | 시각 변화 | token (from `input-button.yaml`) |
|-------|--------|-----------|----|
| `enabled` | 기본 | stroke 1px, 투명 배경 | `strokeColor = stroke.neutral-weak`, `color = bg.transparent` |
| `pressed` | 탭/press | 배경 약간 어두움 | `color = bg.transparent-pressed` |
| `invalid` | `invalid` prop | stroke 2px, critical 색 | `strokeWidth = 2px`, `strokeColor = stroke.critical-solid` |
| `disabled` | `disabled` prop | 배경 disabled, 텍스트 흐려짐 | `color = bg.disabled`, `value.color = fg.disabled` |
| `readonly` | `readonly` prop | 배경 disabled, 텍스트는 유지 | `color = bg.disabled`, `value.color = fg.neutral` |

### 핵심 토큰 (root / enabled 기준)

| 속성 | 값 |
|---|---|
| height | `$dimension.x13` |
| cornerRadius | `$radius.r3` |
| paddingX | `$dimension.x4` |
| gap | `$dimension.x2_5` |
| strokeWidth | `1px` (enabled), `2px` (invalid) |
| strokeColor | `$color.stroke.neutral-weak` (enabled), `$color.stroke.critical-solid` (invalid) |

`stroke` 는 투명도 기반 fade 트랜지션 (`strokeDuration = 0.1s`) 으로 invalid ↔ enabled 가 자연스럽게 전환된다.

---

## Props (핵심만)

```ts
// FieldButton.Root — 주로 쓰는 props
interface RootProps {
  value?: string;            // 선택된 값 (controlled)
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  required?: boolean;
  onClick?: (e: React.MouseEvent) => void;  // picker 열기
}
```

Value/Placeholder 는 일반적으로 children 으로 텍스트를 받고, PrefixText/SuffixText 는 `aria-hidden` 으로 렌더된다 (보조 장식이므로 스크린리더는 value 만 읽는다).

---

## 합성 규칙 (composition)

- **탭 시 picker 를 반드시 열 것** — InputButton 은 자체적으로 값을 변경하지 않는다. onClick 으로 BottomSheet/Dialog 를 띄워 picker 를 호스팅한다.
- **`value` 와 `placeholder` 는 동시 렌더하지 말 것** — 값이 있으면 placeholder 는 숨긴다. (CSS 상 `[data-has-value] placeholder { display: none }` 패턴)
- **`clearButton` 은 `value` 가 있을 때만** — 선택된 값이 없는데 X 버튼이 나오면 사용자가 혼란.
- **자유 입력이 필요하면 [`./text-field.md`](./text-field.md) 로 전환** — InputButton 에 직접 keyboard 입력을 붙이지 말 것 (anti-pattern).
- **아이콘은 [`./icon.md`](./icon.md) 의 svg 규격** — `prefixIcon`/`suffixIcon` size 는 `$dimension.x5` (20px).

---

## 접근성 (constraints, not suggestions)

- `role="button"` 이 자동 부여되며, 키보드 Enter/Space 로 활성화.
- 상위에 레이블이 없으면 `aria-label` 필수 (예: `aria-label="지역 선택"`).
- `invalid` 시 `aria-invalid="true"` 자동.
- `disabled` / `readonly` 는 HTML attr 과 ARIA 모두 반영.
- `PrefixText`/`SuffixText`/`Value`/`Placeholder` 는 `aria-hidden` — 스크린리더는 Root 의 accessible name 만 읽는다. 따라서 value 가 accessible name 에 포함되도록 `aria-label` 을 동적으로 구성하거나, Field 조합을 써서 `Label` 과 연결.

---

## Anti-patterns

```tsx
// 자유 입력이 필요한데 InputButton 사용
// 사용자가 이메일을 "타이핑" 해야 하는 흐름 — picker 가 없다
<FieldButton.Root onClick={...}>
  <FieldButton.Placeholder>이메일</FieldButton.Placeholder>
</FieldButton.Root>
// → 대신 TextField 사용: ./text-field.md 참조

// value 와 placeholder 동시 렌더
<FieldButton.Root>
  <FieldButton.Value>서울 강남구</FieldButton.Value>
  <FieldButton.Placeholder>지역을 선택하세요</FieldButton.Placeholder>
</FieldButton.Root>
// → value 가 있으면 placeholder 는 조건부 렌더

// picker 없이 단독 사용 (탭해도 아무 일도 안 일어남)
<FieldButton.Root /> // onClick 없음
// → 반드시 onClick 으로 BottomSheet/Dialog 트리거

// aria-label 없이 iconOnly 성격으로 사용
<FieldButton.Root>
  <FieldButton.PrefixIcon svg={<PinIcon />} />
</FieldButton.Root>
// → aria-label="출발지 선택" 필수
```

---

## 예제 (minimum usage)

### 1) 기본 — 지역 선택 trigger

```tsx
import { FieldButton } from "@seed-design/react";

function RegionPicker({ region, onOpen }: { region?: string; onOpen: () => void }) {
  return (
    <FieldButton.Root
      aria-label="지역 선택"
      value={region}
      onClick={onOpen}
    >
      {region ? (
        <FieldButton.Value>{region}</FieldButton.Value>
      ) : (
        <FieldButton.Placeholder>지역을 선택하세요</FieldButton.Placeholder>
      )}
    </FieldButton.Root>
  );
}
```

### 2) prefix/suffix 아이콘 조합 — 출발지 필드

```tsx
import { FieldButton } from "@seed-design/react";
import { IconPinLine, IconChevronDownLine } from "@daangn/react-monochrome-icon";

<FieldButton.Root aria-label="출발지" onClick={openDeparturePicker}>
  <FieldButton.PrefixIcon svg={<IconPinLine />} />
  <FieldButton.PrefixText>출발</FieldButton.PrefixText>
  {departure ? (
    <FieldButton.Value>{departure}</FieldButton.Value>
  ) : (
    <FieldButton.Placeholder>어디서 출발하나요?</FieldButton.Placeholder>
  )}
  <FieldButton.SuffixIcon svg={<IconChevronDownLine />} />
</FieldButton.Root>
```

### 3) invalid 상태 — 폼 제출 후 미선택

```tsx
const [date, setDate] = useState<string | undefined>();
const [submitted, setSubmitted] = useState(false);
const invalid = submitted && !date;

<FieldButton.Root
  aria-label="예약 날짜"
  invalid={invalid}
  value={date}
  onClick={openDatePicker}
>
  {date ? (
    <FieldButton.Value>{date}</FieldButton.Value>
  ) : (
    <FieldButton.Placeholder>날짜를 선택하세요</FieldButton.Placeholder>
  )}
  {date && (
    <FieldButton.ClearButton onClick={(e) => { e.stopPropagation(); setDate(undefined); }} />
  )}
</FieldButton.Root>
```

---

## 참고

- Rootage 스펙: `packages/rootage/components/input-button.yaml` (upstream sha `1f1d21d`)
- React 구현: `packages/react/src/components/FieldButton/` — namespace 이름이 `FieldButton` 인 이유는 Field 와 Button 합성 의미를 강조하기 위함.
- 자유 입력 필드: [`./text-field.md`](./text-field.md)
- 아이콘 규격: [`./icon.md`](./icon.md)
