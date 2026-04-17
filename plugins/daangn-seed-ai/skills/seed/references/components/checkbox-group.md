---
name: checkbox-group
upstream_sha: 1f1d21d
---

# CheckboxGroup

**정의** — 여러 `Checkbox`를 하나의 레이아웃 컨테이너로 묶어 수직 간격(`gapY`)을 관리하는 wrapper 컴포넌트. `<fieldset>` / `<legend>` 시맨틱과 함께 group-scoped `value[]` / `onValueChange` 상태를 제공해 controlled/uncontrolled 다중 선택 UI를 만든다.

**import**
```ts
import { Checkbox } from "@seed-design/react";
// namespace 사용: <Checkbox.Group>, <Checkbox.Root>, ...

// 또는 standalone named export
import { CheckboxGroup } from "@seed-design/react";
```

> **단일 Checkbox 본체** — 개별 아이템 props(`checked`, `onCheckedChange`, `variant`, `tone`, `size`)는 [`./checkbox.md`](./checkbox.md)를 참조.

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | Checkbox 단일 | CheckboxGroup | RadioGroup |
|------|:---:|:---:|:---:|
| 항목 1개, 독립적 on/off (단일 약관 동의) | ✅ | ❌ | ❌ |
| 2개 이상 항목을 **복수 선택** (관심사 태그, 필터 다중 선택) | ❌ | ✅ | ❌ |
| 2개 이상 항목 중 **하나만** 선택 (성별, 배송 방법) | ❌ | ❌ | ✅ |
| 공통 `<legend>` + 에러 메시지가 필요한 체크박스 묶음 | ❌ | ✅ | ❌ |
| 전체 선택/해제 마스터 체크박스 + 하위 아이템 묶음 | 마스터 단독 | 하위 아이템 묶음 | ❌ |

관련 결정 매트릭스: [`decision-matrices/which-input.md`](../decision-matrices/which-input.md)

---

## Anatomy

`CheckboxGroup`은 `<div>` 하나(flexbox column)로 렌더되며, 내부 `Checkbox.Root` 아이템들 사이에 `gapY` 토큰을 적용한다. 접근성 구조는 외부 `<fieldset>` / `<legend>`로 보강한다.

| Slot | 필수 | 역할 |
|------|------|------|
| `Checkbox.Group` (root) | ✅ | `<div>` container. `gapY: $dimension.x1` flex-column. `value[]` / `onValueChange` 공급 |
| `Checkbox.Root` × N | ✅ | 개별 체크박스 아이템. Group context에서 `checked` 자동 계산 |
| `<fieldset>` (래퍼) | ✅ (접근성) | 그룹 경계를 스크린 리더에 알림. Group 자체가 fieldset이 아니므로 외부에서 래핑 필요 |
| `<legend>` | ✅ (접근성) | fieldset 레이블. 시각적으로 숨기려면 `VisuallyHidden` 사용 |

---

## Variants

`CheckboxGroup` 자체에는 `variant` prop이 없다. 레이아웃 토큰(`gapY`)만 관리하며, 개별 아이템 시각 변형은 각 `Checkbox.Root`의 `variant` / `tone` / `size` / `weight`로 제어한다.

### `gapY` — 아이템 간 수직 간격

| 상태 | 토큰 | 픽셀 환산(기준) |
|------|------|----------------|
| `base.enabled` | `$dimension.x1` | 4px (1 unit) |

upstream YAML(`checkbox-group.yaml`)에서 유일하게 정의된 dimension 토큰. 직접 오버라이드하지 말고 Group wrapper만 사용한다.

---

## States

`CheckboxGroup`은 상태를 직접 갖지 않는다. 그룹 레벨 상태는 아래처럼 내부 아이템에 위임된다.

| 관심사 | 처리 위치 |
|--------|-----------|
| 개별 아이템 checked/unchecked | 각 `Checkbox.Root` |
| 전체 group value 배열 | `CheckboxGroup`의 `value` / `onValueChange` |
| 에러 표시 | `<fieldset>` 외부 `aria-describedby` |
| disabled (전체) | 각 `Checkbox.Root disabled` 또는 `<fieldset disabled>` |

---

## Token 매핑

upstream `checkbox-group.yaml`에서 추출.

```
root:
  gapY: $dimension.x1   // 아이템 간 수직 간격 (4px 기준 1 unit)
```

레이아웃 외의 색상·크기 토큰은 모두 개별 `Checkbox.Root`의 recipe가 담당한다. 토큰을 직접 덮어쓰지 말 것.

---

## Props

```ts
import type { CheckboxGroupProps } from "@seed-design/react";
// 또는 import type { Checkbox } from "@seed-design/react"; // Checkbox.GroupProps

interface CheckboxGroupProps
  extends CheckboxGroupVariantProps,        // 현재는 빈 타입 (gapY는 recipe 내부)
    React.HTMLAttributes<HTMLDivElement> {
  // group-scoped controlled
  value?: string[];
  onValueChange?: (value: string[]) => void;

  // group-scoped uncontrolled
  defaultValue?: string[];

  // 공통 HTML div props (id, className, style, ...)
  asChild?: boolean;
}
```

**주의**: `CheckboxGroup`에는 `variant`/`tone`/`size`/`weight` prop이 없다. 이 값들은 각 `Checkbox.Root`에 개별 지정한다. 모든 아이템에 동일한 variant를 쓰고 싶다면 아이템 배열을 map으로 렌더하면서 공통 props를 전달한다.

---

## 합성 규칙 (composition)

- **`Checkbox.Group`은 `Checkbox.Root`의 직접 부모여야 한다** — Group이 공급하는 value context를 Root가 소비하므로, DOM 중간에 wrapper div를 끼우면 context가 차단된다(단, Radix `asChild`를 쓰면 우회 가능).
- **`fieldset`은 Group 바깥** — `Checkbox.Group`은 `<div>`로 렌더되므로 fieldset 시맨틱을 내장하지 않는다. 항상 `<fieldset>` / `<legend>`로 감싸야 접근성 기준을 충족한다.
- **value는 문자열 배열** — `Checkbox.HiddenInput`의 `value` prop(문자열)이 Group의 `value[]`에 포함되는지로 checked를 계산한다. HiddenInput에 `value`를 반드시 지정할 것.
- **아이콘은 `@karrotmarket/react-monochrome-icon`** — 단색 아이콘만 토큰 색 제어가 동작한다.
- **단일 Checkbox는 Group 안에 넣지 않는다** — 독립적 on/off 아이템은 Group 바깥에서 단독으로 사용한다(예: "전체 선택" 마스터 체크박스).

---

## 접근성 (constraints, not suggestions)

- **`<fieldset>` + `<legend>` 필수** — `Checkbox.Group` 자체가 그룹 경계를 선언하지 않으므로, 시맨틱 HTML로 외부에서 반드시 래핑해야 스크린 리더가 그룹을 인식한다.
- **`<legend>`는 생략 불가** — legend를 숨기고 싶으면 `VisuallyHidden`을 쓰되 DOM에서 제거해서는 안 된다.
- **에러 메시지** — 그룹 수준 에러는 `<span id="group-err">`를 두고 `<fieldset aria-describedby="group-err">`로 연결. 개별 아이템 에러가 아닐 경우 fieldset에 연결한다.
- **`<fieldset disabled>`** — 전체 그룹을 비활성화할 때 fieldset에 `disabled` 속성을 주면 내부 폼 요소가 일괄 비활성화된다. CSS로 시각적 비활성 처리도 함께 해야 한다.
- **키보드** — Tab으로 포커스 이동, 스페이스바로 토글. 별도 handler 불필요(네이티브 input 거동).
- **required 그룹** — "최소 하나 이상 선택" 제약은 HTML 레벨에서 자동 처리되지 않으므로, 폼 submit 시 value 배열 길이를 검증하고 에러를 aria-describedby로 연결한다.

---

## Anti-patterns

```tsx
❌ // fieldset/legend 없이 Group만 사용
<Checkbox.Group value={selected} onValueChange={setSelected}>
  <Checkbox.Root>...</Checkbox.Root>
  {/* 스크린 리더가 그룹을 인식하지 못함 */}
</Checkbox.Group>

❌ // HiddenInput에 value 미지정
<Checkbox.Group value={selected} onValueChange={setSelected}>
  <Checkbox.Root>
    <Checkbox.Control><Checkbox.Indicator checked={<IconCheckmarkFatFill />} /></Checkbox.Control>
    <Checkbox.Label>옵션 1</Checkbox.Label>
    <Checkbox.HiddenInput name="options" />
    {/* value 없음 — Group이 checked 여부를 계산할 수 없음 */}
  </Checkbox.Root>
</Checkbox.Group>

❌ // Group 안에 단독 Checkbox를 넣고 onCheckedChange도 함께 쓰기
<Checkbox.Group value={selected} onValueChange={setSelected}>
  <Checkbox.Root checked={singleFlag} onCheckedChange={setSingleFlag}>
    {/* Group과 Root 상태 충돌 — 둘 중 하나만 사용 */}
  </Checkbox.Root>
</Checkbox.Group>

❌ // variant/tone을 Group에 지정 (prop 자체가 없음)
<Checkbox.Group tone="brand">   {/* 타입 에러 */}
  ...
</Checkbox.Group>

✅ // 올바른 구조: fieldset + Group + 아이템별 value
<fieldset>
  <legend>관심 카테고리</legend>
  <Checkbox.Group value={selected} onValueChange={setSelected}>
    <Checkbox.Root>
      <Checkbox.Control><Checkbox.Indicator checked={<IconCheckmarkFatFill />} /></Checkbox.Control>
      <Checkbox.Label>패션</Checkbox.Label>
      <Checkbox.HiddenInput name="category" value="fashion" />
    </Checkbox.Root>
  </Checkbox.Group>
</fieldset>
```

---

## 예제 (minimum usage)

### 1. Controlled — `value` + `onValueChange`

```tsx
import { useState } from "react";
import { Checkbox } from "@seed-design/react";
import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill";

const options = [
  { label: "패션 · 잡화", value: "fashion" },
  { label: "가전 · 디지털", value: "electronics" },
  { label: "생활 · 가구", value: "living" },
];

export function CategoryFilter() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <fieldset>
      <legend>관심 카테고리 (복수 선택)</legend>
      <Checkbox.Group value={selected} onValueChange={setSelected}>
        {options.map((opt) => (
          <Checkbox.Root key={opt.value}>
            <Checkbox.Control>
              <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
            </Checkbox.Control>
            <Checkbox.Label>{opt.label}</Checkbox.Label>
            <Checkbox.HiddenInput name="category" value={opt.value} />
          </Checkbox.Root>
        ))}
      </Checkbox.Group>
      <p>선택: {selected.join(", ") || "없음"}</p>
    </fieldset>
  );
}
```

`value={selected}` + `onValueChange={setSelected}` — 부모가 선택 배열을 소유한다. `selected`에 `"fashion"`이 포함되면 해당 아이템이 checked 처리된다.

---

### 2. Uncontrolled — `defaultValue`

```tsx
import { Checkbox } from "@seed-design/react";
import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill";

export function NotificationSettings() {
  return (
    <fieldset>
      <legend>알림 수신 설정</legend>
      <Checkbox.Group defaultValue={["option-1"]}>
        <Checkbox.Root>
          <Checkbox.Control>
            <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
          </Checkbox.Control>
          <Checkbox.Label>채팅 메시지 알림</Checkbox.Label>
          <Checkbox.HiddenInput name="notify" value="option-1" />
        </Checkbox.Root>
        <Checkbox.Root>
          <Checkbox.Control>
            <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
          </Checkbox.Control>
          <Checkbox.Label>거래 상태 알림</Checkbox.Label>
          <Checkbox.HiddenInput name="notify" value="option-2" />
        </Checkbox.Root>
        <Checkbox.Root>
          <Checkbox.Control>
            <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
          </Checkbox.Control>
          <Checkbox.Label>마케팅 정보 수신</Checkbox.Label>
          <Checkbox.HiddenInput name="notify" value="option-3" />
        </Checkbox.Root>
      </Checkbox.Group>
    </fieldset>
  );
}
```

`defaultValue={["option-1"]}` — 초기 선택값을 지정하고 이후 상태는 내부 관리. 폼 제출 시 HiddenInput이 `notify=option-1`, `notify=option-2` 형태로 포함된다.

---

### 3. `<fieldset>` / `<legend>` 접근성 패턴

```tsx
import { Checkbox } from "@seed-design/react";
import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill";

// 시각적으로 legend를 표시하되 스크린 리더에 그룹 이름을 제공하는 기본 패턴
export function AccessibleAgreementGroup() {
  return (
    <fieldset aria-describedby="agreement-error">
      {/* <legend>은 스크린 리더가 그룹 진입 시 읽는 레이블 */}
      <legend>이용약관 동의</legend>

      <Checkbox.Group defaultValue={[]}>
        <Checkbox.Root required>
          <Checkbox.Control>
            <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
          </Checkbox.Control>
          <Checkbox.Label>(필수) 서비스 이용약관</Checkbox.Label>
          <Checkbox.HiddenInput name="terms" value="service" />
        </Checkbox.Root>

        <Checkbox.Root required>
          <Checkbox.Control>
            <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
          </Checkbox.Control>
          <Checkbox.Label>(필수) 개인정보 처리방침</Checkbox.Label>
          <Checkbox.HiddenInput name="terms" value="privacy" />
        </Checkbox.Root>

        <Checkbox.Root>
          <Checkbox.Control>
            <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
          </Checkbox.Control>
          <Checkbox.Label>(선택) 마케팅 정보 수신</Checkbox.Label>
          <Checkbox.HiddenInput name="terms" value="marketing" />
        </Checkbox.Root>
      </Checkbox.Group>

      {/* 그룹 수준 에러 메시지: aria-describedby로 fieldset에 연결 */}
      <span id="agreement-error" role="alert">
        필수 항목을 모두 동의해 주세요.
      </span>
    </fieldset>
  );
}
```

`<fieldset>` + `<legend>` 조합이 스크린 리더에 그룹 경계와 이름을 제공한다. `aria-describedby`로 에러 메시지를 그룹 전체에 연결할 수 있다.

---

### 4. 전체 선택 마스터 + CheckboxGroup 하위 아이템

```tsx
import { useState } from "react";
import { Checkbox } from "@seed-design/react";
import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill";
import IconMinusFatFill from "@karrotmarket/react-monochrome-icon/IconMinusFatFill";

const ITEMS = ["service", "privacy", "marketing"];

export function MasterCheckboxExample() {
  const [selected, setSelected] = useState<string[]>([]);

  const allChecked = selected.length === ITEMS.length;
  const isIndeterminate = selected.length > 0 && !allChecked;

  return (
    <fieldset>
      <legend>전체 약관 동의</legend>

      {/* 마스터 체크박스 — Group 바깥에서 단독 사용 */}
      <Checkbox.Root
        checked={allChecked}
        indeterminate={isIndeterminate}
        onCheckedChange={(next) => setSelected(next ? ITEMS : [])}
        weight="bold"
      >
        <Checkbox.Control>
          <Checkbox.Indicator
            checked={<IconCheckmarkFatFill />}
            indeterminate={<IconMinusFatFill />}
          />
        </Checkbox.Control>
        <Checkbox.Label>전체 동의</Checkbox.Label>
        <Checkbox.HiddenInput />
      </Checkbox.Root>

      {/* 하위 아이템 묶음 */}
      <Checkbox.Group value={selected} onValueChange={setSelected}>
        <Checkbox.Root>
          <Checkbox.Control>
            <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
          </Checkbox.Control>
          <Checkbox.Label>(필수) 서비스 이용약관</Checkbox.Label>
          <Checkbox.HiddenInput name="terms" value="service" />
        </Checkbox.Root>
        <Checkbox.Root>
          <Checkbox.Control>
            <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
          </Checkbox.Control>
          <Checkbox.Label>(필수) 개인정보 처리방침</Checkbox.Label>
          <Checkbox.HiddenInput name="terms" value="privacy" />
        </Checkbox.Root>
        <Checkbox.Root>
          <Checkbox.Control>
            <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
          </Checkbox.Control>
          <Checkbox.Label>(선택) 마케팅 정보 수신</Checkbox.Label>
          <Checkbox.HiddenInput name="terms" value="marketing" />
        </Checkbox.Root>
      </Checkbox.Group>
    </fieldset>
  );
}
```

---

## 관련 문서

- [`./checkbox.md`](./checkbox.md) — 단일 Checkbox 본체 (Anatomy, variant, tone, size, indeterminate)
- [`./radio.md`](./radio.md) — 단일 선택이면 Radio / RadioGroup
- [`decision-matrices/which-input.md`](../decision-matrices/which-input.md) — Checkbox vs Radio vs Switch vs ControlChip 선택 기준
