---
name: segmented-control-item
upstream_sha: 1f1d21d
---

# SegmentedControl.Item

segmented-control.md 의 Item slot 상세 — Root / Indicator 는 [`./segmented-control.md`](./segmented-control.md) 참조.

**정의** — `SegmentedControl.Root` 안에서 개별 선택 옵션 하나를 표현하는 슬롯. 내부적으로 `<label>` 엘리먼트로 렌더링되며, 텍스트 라벨과 `SegmentedControl.ItemHiddenInput`(`<input type="radio">`)을 감싼다. `value` prop 하나로 Root 의 선택 상태와 연결되고, `disabled`/`notification` 등의 상태를 추가로 받는다.

**import**
```ts
import { SegmentedControl } from "@seed-design/react";
// namespace:
//   <SegmentedControl.Item value="...">라벨</SegmentedControl.Item>
//   <SegmentedControl.ItemHiddenInput name="..." />
```

---

## Anatomy

`SegmentedControl.Item` 은 **`<label>` 엘리먼트**이며, 두 개의 하위 요소를 포함한다.

| Slot | 필수 | element | 역할 |
|------|------|---------|------|
| `SegmentedControl.Item` | ✅ | `<label>` | 개별 옵션의 Root. `value` 필수. `disabled`·`notification` prop 을 받아 `data-*` 속성으로 하위에 전달 |
| 텍스트 (children) | ✅ | `<label>` 의 text node | 옵션 라벨. `label.fontSize = $font-size.t5`, `label.fontWeight = $font-weight.bold` 적용 |
| `SegmentedControl.ItemHiddenInput` | ✅ (폼/a11y 용) | `<input type="radio">` | visually-hidden 상태의 네이티브 radio. 폼 제출·스크린 리더·키보드 네비게이션을 네이티브에 위임. `name`·`form`·`value` 는 Root 에서 자동 전파되나, 폼 제출이 필요할 때는 `name` 을 Root 에 명시 |

**Item 이 `<label>` 인 이유** — `<label>` 이 `<input type="radio">` 를 내부에 포함하므로, 라벨 영역 클릭이 곧 radio 선택으로 연결된다. 직접 `htmlFor`/`id` 를 매기지 않아도 클릭 연결이 자동 성립한다.

**계층 구조 (Item 확대)**
```
SegmentedControl.Root  (role="radiogroup")
├── SegmentedControl.Indicator
├── SegmentedControl.Item value="a"   ← <label> element
│   ├── "옵션 A"                       ← text node (label slot)
│   └── SegmentedControl.ItemHiddenInput  ← <input type="radio"> visually-hidden
├── SegmentedControl.Item value="b"
│   ├── "옵션 B"
│   └── SegmentedControl.ItemHiddenInput
└── ...
```

---

## Variants

`segmented-control-item.yaml` 은 `base` 하나만 정의한다. size·layout 같은 추가 variant 축이 없다. 상태(state) 조합이 시각을 결정한다.

| State 조합 | root 시각 | label 색 |
|-----------|-----------|---------|
| `enabled` (unselected) | 투명 배경 | `$color.fg.neutral-subtle` |
| `enabled + pressed` | `$color.bg.neutral-weak-pressed` 배경 + `$color.stroke.neutral-muted` 테두리 1px | `$color.fg.neutral-subtle` (변화 없음) |
| `enabled + selected` | `SegmentedControl.Indicator` 가 해당 Item 위에 겹쳐 시각 변화를 담당 | `$color.fg.neutral` |
| `disabled` (개별 Item) | 포인터 이벤트 차단. `data-disabled` 부착 | `$color.fg.disabled` |
| `disabled` (Root 전체) | Root 의 `disabled` prop 으로 모든 Item 에 동일 적용 | `$color.fg.disabled` |
| `focus-visible` | HiddenInput 에 브라우저 포커스 링 위임. `data-focus-visible` 부착 | — |

> **pressed 와 selected 의 분리** — `pressed` 상태의 색 변화(`$color.bg.neutral-weak-pressed`)는 Item root 에 직접 적용된다. `selected` 상태의 시각은 Indicator 슬라이딩 카드가 전담하므로, Item 자체는 배경색을 변경하지 않는다.

---

## Token 매핑

`segmented-control-item.yaml` 에서 추출. variant 없이 단일 `base` 정의.

```
segmented-control-item recipe:
  root (base / enabled):
    minWidth:            86px
    minHeight:           34px
    paddingX:            $dimension.x6
    paddingY:            $dimension.x1_5
    cornerRadius:        $radius.full
    gap:                 $dimension.x1_5
    colorDuration:       $duration.color-transition
    colorTimingFunction: $timing-function.easing

  root (pressed):
    color:               $color.bg.neutral-weak-pressed
    strokeWidth:         1px
    strokeColor:         $color.stroke.neutral-muted

  label (base / enabled):
    fontSize:            $font-size.t5
    lineHeight:          $line-height.t5
    fontWeight:          $font-weight.bold
    color:               $color.fg.neutral-subtle
    colorDuration:       $duration.color-transition
    colorTimingFunction: $timing-function.easing

  label (selected):
    color:               $color.fg.neutral

  label (disabled):
    color:               $color.fg.disabled
```

**참고 — pressed 와 selected 토큰 출처**
- `pressed.root.color = $color.bg.neutral-weak-pressed`: Item root 슬롯에 직접 적용되는 터치 피드백 배경.
- `selected.label.color = $color.fg.neutral`: selected 상태에서 라벨이 neutral 색으로 강조. Indicator 의 흰 카드와 함께 선택 항목이 명확히 구분된다.

---

## Props

```ts
import type { SegmentedControlPrimitive } from "@seed-design/react";

// SegmentedControl.Item — <label> 엘리먼트
interface SegmentedControlItemProps extends SegmentedControlPrimitive.ItemProps {
  // 식별
  value: string;          // 필수. Root 의 value/defaultValue 와 비교해 selected 결정

  // 상태
  disabled?: boolean;     // 이 Item 만 선택 불가. Root disabled 와 OR 합산

  // 시각 보조
  notification?: boolean; // true 이면 Item 에 읽지 않은 항목 dot 표시
}

// SegmentedControl.ItemHiddenInput — <input type="radio"> visually-hidden
interface SegmentedControlItemHiddenInputProps
  extends SegmentedControlPrimitive.ItemHiddenInputProps {
  // name / form / value 는 Root 에서 자동 전파
  // 폼 직접 제출이 필요하면 Root 의 name prop 을 사용하거나
  // ItemHiddenInput 에 직접 name 을 지정할 수 있음
}
```

**default 동작 요약**
- `disabled` 미지정 → `false`. Root 에 `disabled` 가 있으면 해당 Item 도 비활성.
- `notification` 미지정 → `false`. dot 미표시.
- `value` 는 TypeScript 타입 레벨에서 필수이며, 미지정 시 선택 로직 전체가 오작동한다.

---

## 합성 규칙 (composition)

- **`SegmentedControl.Root` 의 children 으로만** 사용한다 — `useSegmentedControlItemContext` 가 Root 에서 공급하는 context 없이는 Item 단독으로 동작하지 않는다. Root 없이 Item 을 렌더하면 런타임 에러.
- **`SegmentedControl.ItemHiddenInput` 이 `name` 기반 form 제출을 지원** — Root 의 `name` prop 이 모든 ItemHiddenInput 에 자동 전파된다(`<input type="radio" name={rootName} />`). HTML 폼으로 선택값을 제출해야 한다면 Root 에 `name` 을 지정한다. React Hook Form 등 controlled form 라이브러리를 쓸 때도 ItemHiddenInput 의 ref/onChange 를 통해 값을 읽는다. [checkbox.md](./checkbox.md) 의 `Checkbox.HiddenInput` 패턴과 동일 원리다.
- **`value` 는 그룹 내 고유** — 중복된 value 는 선택 로직 오작동과 키보드 이동 깨짐을 유발한다.
- **Item 개수는 2–5개** — Root 제약. 1개는 선택 의미 없음. 6개 이상은 레이아웃 깨짐.
- **`name` 은 Root 에** — Item 에 직접 `name` 을 주지 말 것. Root 에서 자동 전파된다.
- **ItemHiddenInput 은 Item 마다 정확히 1개** — 여러 개 넣으면 폼 제출 시 값 충돌.

---

## 접근성 (constraints, not suggestions)

- **Item 은 `<label>` 이므로 `role` 을 추가하지 말 것** — 내부 `<input type="radio">` 가 `role="radio"` + `aria-checked` 를 브라우저 네이티브로 처리한다.
- **`aria-checked` 자동 처리** — ItemHiddenInput 이 `checked={value === itemValue}` 를 받으므로 `aria-checked` 를 별도로 지정하지 않아도 된다.
- **텍스트 없는 Item (아이콘만 사용)** → Item 에 `aria-label` 추가. 텍스트 라벨이 없으면 스크린 리더가 선택지를 알 수 없다.
- **`disabled` 처리** — `disabled` prop 으로 Item 을 비활성화하면 `data-disabled` 가 자동 부착되고 포인터 이벤트도 차단된다. CSS 만으로 시각을 흐리게 하는 것은 접근성 위반이다.
- **키보드 네비게이션** — `Tab` 으로 그룹 진입 후 `ArrowLeft`/`ArrowRight` 로 Item 이동, 이동 즉시 선택된다(roving tabindex + radio 거동 위임). `Tab` 으로 그룹 탈출.
- **`focus-visible`** — HiddenInput 에 브라우저 포커스 링이 표시된다. `data-focus-visible` 로 CSS 커스텀 포커스 스타일을 추가할 수 있다.

---

## Anti-patterns

```tsx
// 1. Root 없이 Item 단독 사용 — context 누락으로 런타임 에러
❌
<SegmentedControl.Item value="a">옵션 A</SegmentedControl.Item>

// 2. value prop 생략 — 선택 로직 전체 오작동 (TypeScript 도 에러)
❌
<SegmentedControl.Root defaultValue="a" aria-label="정렬">
  <SegmentedControl.Indicator />
  <SegmentedControl.Item>인기</SegmentedControl.Item>   {/* value 없음 */}
  <SegmentedControl.Item value="new">최신</SegmentedControl.Item>
</SegmentedControl.Root>

// 3. radio / checkbox 를 Item 대신 혼용 — Seed 토큰·pressed·disabled·포커스 처리 전혀 없음
❌
<SegmentedControl.Root defaultValue="hot" aria-label="정렬">
  <SegmentedControl.Indicator />
  <label>
    <input type="radio" name="sort" value="hot" /> 인기
  </label>
  <label>
    <input type="radio" name="sort" value="new" /> 최신
  </label>
</SegmentedControl.Root>

// 4. ItemHiddenInput 없이 폼 제출 시도 — 선택값이 폼 데이터에 포함되지 않음
❌
<form onSubmit={handleSubmit}>
  <SegmentedControl.Root name="sort" defaultValue="hot" aria-label="정렬">
    <SegmentedControl.Indicator />
    <SegmentedControl.Item value="hot">인기</SegmentedControl.Item>
    <SegmentedControl.Item value="new">최신</SegmentedControl.Item>
    {/* ItemHiddenInput 누락 — name="sort" 값이 폼에 포함되지 않음 */}
  </SegmentedControl.Root>
</form>

// 5. Item 에 직접 name 부여 — Root 의 name 전파와 충돌
❌
<SegmentedControl.Root defaultValue="hot" aria-label="정렬">
  <SegmentedControl.Indicator />
  <SegmentedControl.Item value="hot">
    인기
    <SegmentedControl.ItemHiddenInput name="mySort" />  {/* Root name 과 충돌 */}
  </SegmentedControl.Item>
</SegmentedControl.Root>

✅
<SegmentedControl.Root name="sort" defaultValue="hot" aria-label="정렬 기준">
  <SegmentedControl.Indicator />
  <SegmentedControl.Item value="hot">인기</SegmentedControl.Item>
  <SegmentedControl.Item value="new">최신</SegmentedControl.Item>
  <SegmentedControl.Item value="distance">거리순</SegmentedControl.Item>
</SegmentedControl.Root>
{/* ItemHiddenInput 은 Root 의 name="sort" 를 자동 상속 */}
```

---

## 예제

### 1. 기본 Item 사용 — Root 안에서 item 배치

세 개의 Item 을 Root 에 배치하고 `defaultValue` 로 초기 선택을 지정한다. Indicator 가 `$duration.d4` 트랜지션으로 선택된 Item 위로 이동한다. 개별 Item 에 `disabled` 를 지정해 일부만 선택 불가로 만들 수 있다.

```tsx
import { SegmentedControl } from "@seed-design/react";

export default function BasicItemExample() {
  return (
    <SegmentedControl.Root defaultValue="hot" aria-label="정렬 기준">
      <SegmentedControl.Indicator />
      <SegmentedControl.Item value="hot">인기</SegmentedControl.Item>
      <SegmentedControl.Item value="new">최신</SegmentedControl.Item>
      <SegmentedControl.Item value="distance" disabled>
        거리순
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
```

`distance` Item 에 `disabled` 를 지정하면 해당 Item 만 선택 불가(`data-disabled` 부착, 라벨 `$color.fg.disabled`)가 되고, 나머지 두 Item 은 정상 동작한다.

### 2. controlled + ItemHiddenInput — 폼 제출 (name 기반)

`useState` 로 선택 상태를 관리하고, Root 에 `name` 을 지정해 ItemHiddenInput 이 자동으로 `name="billingCycle"` radio 로 폼에 포함되도록 한다. `onSubmit` 시 `FormData` 에서 `billingCycle` 키로 선택값을 읽을 수 있다.

```tsx
import { SegmentedControl } from "@seed-design/react";
import { useState } from "react";

export default function ControlledWithFormSubmit() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log("billingCycle:", data.get("billingCycle"));
  }

  return (
    <form onSubmit={handleSubmit}>
      <SegmentedControl.Root
        name="billingCycle"
        value={billingCycle}
        onValueChange={setBillingCycle}
        aria-label="결제 주기"
      >
        <SegmentedControl.Indicator />
        <SegmentedControl.Item value="monthly">
          월간
          <SegmentedControl.ItemHiddenInput />
        </SegmentedControl.Item>
        <SegmentedControl.Item value="annual">
          연간
          <SegmentedControl.ItemHiddenInput />
        </SegmentedControl.Item>
        <SegmentedControl.Item value="enterprise">
          기업 맞춤
          <SegmentedControl.ItemHiddenInput />
        </SegmentedControl.Item>
      </SegmentedControl.Root>
      <button type="submit">제출</button>
    </form>
  );
}
```

`SegmentedControl.ItemHiddenInput` 은 `<input type="radio" name="billingCycle" value="monthly|annual|enterprise">` 로 렌더된다. 선택된 Item 의 HiddenInput 만 폼 제출 시 포함되어 `billingCycle=monthly` 형태로 서버에 전달된다. [checkbox.md](./checkbox.md) 의 `Checkbox.HiddenInput` 과 동일한 radio-group-like form 제출 패턴이다.

---

## 관련 문서

- [`./segmented-control.md`](./segmented-control.md) — `SegmentedControl.Root` · `SegmentedControl.Indicator` 토큰·props·CSS 변수 메커니즘
- [`./checkbox.md`](./checkbox.md) — `Checkbox.HiddenInput` 패턴 (visually-hidden input 으로 폼/a11y 를 네이티브에 위임하는 동일 원리)
- Rootage 스펙: `packages/rootage/components/segmented-control-item.yaml`
