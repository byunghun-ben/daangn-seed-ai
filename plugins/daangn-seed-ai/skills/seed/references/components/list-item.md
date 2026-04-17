---
name: list-item
upstream_sha: 1f1d21d
---

# List

**정의** — `list-item.yaml` 이 List 전체 namespace(`Root`/`Item`/`Content`/`Prefix`/`Suffix`/`Title`/`Detail` 7 slot)의 토큰과 상태를 정의한다. `<ul>`/`<li>` 기반의 row 컬렉션을 구성하며, 각 `Item`은 `createWithStateProps`를 통해 Checkbox·RadioGroupItem·Switch 컨텍스트와 자동으로 상태(data-checked / data-disabled 등)를 연동한다.

**import**
```ts
import { List } from "@seed-design/react";
// namespace:
//   <List.Root>          — <ul>
//     <List.Item>        — <li>
//       <List.Prefix>    — 왼쪽 보조 영역 (아이콘, 아바타)
//       <List.Content>   — 텍스트 컬럼
//         <List.Title>   — 주 텍스트
//         <List.Detail>  — 보조 텍스트
//       </List.Content>
//       <List.Suffix>    — 오른쪽 보조 영역 (아이콘, 버튼)
//     </List.Item>
//   </List.Root>
```

> **⚠️ import 경로 주의** — upstream `docs/examples/react/list/*.tsx` 는 `seed-design/ui/list` 에서 아래 4개 wrapping 컴포넌트를 import 하지만, 이들은 **`@seed-design/react` namespace 에 존재하지 않는다** (해당 namespace 에는 Root/Item/Content/Prefix/Suffix/Title/Detail 7개만). 본 스킬은 **`@seed-design/react`** 직접 사용을 전제로 하므로 다음 패턴으로 변환한다:
>
> - `ListDivider` → [`./divider.md`](./divider.md) 의 `<Divider />` 사용
> - `ListButtonItem` → `<List.Item asChild><button>...</button></List.Item>` (스킬 자체 설계)
> - `ListLinkItem` → `<List.Item asChild><a href="...">...</a></List.Item>` (스킬 자체 설계)
> - `ListCheckItem` → `<List.Item><Checkbox.Root>...<List.Content>...</List.Content></Checkbox.Root></List.Item>` (스킬 자체 설계)

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 설정 항목, 메뉴, 알림처럼 동일한 구조의 row 를 반복해서 나열 | **List** (이 컴포넌트) |
| 탭·클릭 하나로 단일 동작을 실행하는 독립 버튼 여러 개 나열 | [`./action-button.md`](./action-button.md) 반복 배치 |
| 이미지·설명·가격이 복잡하게 조합된 상품 카드 그리드 | Card 반복 배치 |
| 네이티브 모바일 `UITableView` / `RecyclerView` 와 동일한 스크롤 리스트 | **List** — 스크롤 컨테이너는 외부에서 관리 |
| 2–5개 항목을 가로로 나열하는 선택 그룹 | `SegmentedControl` / `ControlChip` |
| row 마다 Checkbox·Radio·Switch 를 결합해 selection 목록 구성 | **List** + 합성 규칙 참고 |

---

## Anatomy

7개 slot 계층. `Root`가 `<ul>`을 렌더하고, `itemBorderRadius` prop 으로 `--list-item-border-radius` CSS 변수를 주입한다. 각 `Item`(`<li>`)은 pressed 상태에서 `marginX`·`cornerRadius` 토큰으로 시각 피드백을 준다.

```
┌─ List.Root  <ul>  ──────────────────────────────────────────────┐
│ ┌─ List.Item  <li>  ───────────────────────────────────────────┐ │
│ │  [List.Prefix]  [List.Content]                [List.Suffix]  │ │
│ │                   ├─ List.Title                              │ │
│ │                   └─ List.Detail                             │ │
│ └──────────────────────────────────────────────────────────────┘ │
│  ...반복...                                                       │
└──────────────────────────────────────────────────────────────────┘
```

| Slot | 필수 | 실제 엘리먼트 | 역할 |
|------|------|--------------|------|
| `List.Root` | ✅ | `<ul>` | 컨테이너. `itemBorderRadius`로 CSS 변수 주입 |
| `List.Item` | ✅ | `<li>` | row 단위. `asChild`로 `<button>`/`<a>` 교체 가능. `highlighted` prop 지원 |
| `List.Content` | ✅ | `<div>` | Title + Detail 수직 배치 컬럼 |
| `List.Prefix` | ⚪ | `<div>` | 왼쪽 보조 영역 (아이콘 22px, 아바타 등) |
| `List.Suffix` | ⚪ | `<div>` | 오른쪽 보조 영역 (아이콘 18px, 보조 텍스트, 버튼) |
| `List.Title` | ✅ | `<div>` | 주 텍스트. `$font-size.t5` / `$color.fg.neutral` |
| `List.Detail` | ⚪ | `<div>` | 보조 텍스트. `$font-size.t3` / `$color.fg.neutral-subtle` |

**`itemBorderRadius`** — `List.Root`의 prop. `handleRadius()` 유틸을 거쳐 `--list-item-border-radius` CSS 변수로 주입되고, pressed 상태의 `cornerRadius` 토큰이 이 값을 우선 사용한다. 카드 형태 리스트처럼 모서리를 둥글게 하고 싶을 때 지정한다.

---

## Variants

List namespace 는 **`base`** variant 하나만 정의한다(list-item.yaml `definitions.base`). `tone`·`size`·`weight` 같은 추가 축이 없으며, 상태별 토큰 차이만 존재한다.

| variant | 기본값 | 설명 |
|---------|--------|------|
| `base` | ✅ | 유일한 variant. 5가지 상태 토큰을 내부적으로 관리 |

---

## States

YAML `definitions.base` 에 정의된 5개 상태. `Item` 이 interactive(asChild button/a)일 때 pressed 상태 토큰이 활성화된다.

| 상태 | 트리거 | 시각 변화 |
|------|--------|-----------|
| `enabled` | 기본 | `root.color: $color.bg.transparent` — 배경 투명 |
| `pressed` | 포인터 down / touch | `root.color: $color.bg.transparent-pressed`, `marginX: $dimension.x1_5`, `cornerRadius: $dimension.x2_5` — 측면 여백 + 둥근 모서리 |
| `highlighted` | `highlighted` prop true | `root.color: $color.bg.brand-weak` — 브랜드 약한 배경 |
| `highlighted + pressed` | highlighted 상태에서 포인터 down | `root.color: $color.bg.brand-weak-pressed` |
| `disabled` | `disabled` prop true | `title.color`, `detail.color`, `prefixIcon.color`, `suffixIcon.color` 모두 `$color.fg.disabled` |

---

## Token 매핑

`list-item.yaml` `definitions.base.enabled` 기준. 전체 토큰 원본: `packages/rootage/components/list-item.yaml`.

| Slot | 속성 | 토큰 |
|------|------|------|
| `root` | `paddingY` | `$dimension.x3` |
| `root` | `paddingX` | `$dimension.spacing-x.global-gutter` |
| `root` | `color` | `$color.bg.transparent` (배경) |
| `root` | `colorDuration` | `$duration.color-transition` |
| `root` | `marginDuration` / `borderRadiusDuration` | `$duration.d3` |
| `root` (pressed) | `color` | `$color.bg.transparent-pressed` |
| `root` (pressed) | `marginX` | `$dimension.x1_5` |
| `root` (pressed) | `cornerRadius` | `$dimension.x2_5` |
| `root` (highlighted) | `color` | `$color.bg.brand-weak` |
| `content` | `gap` | `$dimension.x0_5` |
| `content` | `paddingRight` | `$dimension.x2_5` |
| `title` | `color` | `$color.fg.neutral` |
| `title` | `fontSize` | `$font-size.t5` |
| `title` | `fontWeight` | `$font-weight.regular` |
| `detail` | `color` | `$color.fg.neutral-subtle` |
| `detail` | `fontSize` | `$font-size.t3` |
| `detail` | `fontWeight` | `$font-weight.regular` |
| `prefix` | `paddingRight` | `$dimension.x3` |
| `prefixIcon` | `size` | `22px` |
| `prefixIcon` | `color` | `$color.fg.neutral` |
| `suffix` | `gap` | `$dimension.x1` |
| `suffixText` | `color` | `$color.fg.neutral-subtle` |
| `suffixText` | `fontSize` | `$font-size.t5` |
| `suffixIcon` | `size` | `18px` |
| `suffixIcon` | `color` | `$color.fg.neutral-subtle` |

---

## Props

### `ListRootProps`

`VStackProps`를 상속. 주요 추가 prop:

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `itemBorderRadius` | `StyleProps["borderRadius"]` | — | `--list-item-border-radius` CSS 변수로 주입. pressed 상태 모서리에 적용 |
| `as` | `ElementType` | `"ul"` | 컨테이너 엘리먼트 교체 (`"div"`, `"fieldset"` 등) |

### `ListItemProps`

`PrimitiveProps` + `ListItemVariantProps` + `Pick<StyleProps, "alignItems">` 상속.

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `highlighted` | `boolean` | `false` | 브랜드 약한 배경(`$color.bg.brand-weak`) 활성화 |
| `disabled` | `boolean` | `false` | 하위 텍스트·아이콘 색상을 `$color.fg.disabled` 로 변경 |
| `asChild` | `boolean` | `false` | Slot 패턴으로 children 의 root 엘리먼트를 `<li>` 대신 사용 |
| `alignItems` | `StyleProps["alignItems"]` | — | Prefix/Content/Suffix 수직 정렬 |

### `ListContentProps`

| Prop | 타입 | 설명 |
|------|------|------|
| `gap` | `StyleProps["gap"]` | Title/Detail 간격 override |
| `pr` / `paddingRight` | `StyleProps["pr"]` | 오른쪽 padding override |

### `ListPrefixProps`

| Prop | 타입 | 설명 |
|------|------|------|
| `pr` / `paddingRight` | `StyleProps["pr"]` | Content 와의 간격 override |

### `ListSuffixProps`

| Prop | 타입 | 설명 |
|------|------|------|
| `gap` | `StyleProps["gap"]` | 내부 아이템 간격 override |
| `position` | `StyleProps["position"]` | 절대 위치 등 레이아웃 override |

### `ListTitleProps`

`PrimitiveProps` + `React.HTMLAttributes<HTMLDivElement>`. style override 가능.

### `ListDetailProps`

`PrimitiveProps` + `React.HTMLAttributes<HTMLDivElement>`. style override 가능.

---

## 합성 규칙

`List.Item` 내부에서 Checkbox·RadioGroupItem·Switch 를 합성하면 `createWithStateProps`가 해당 컨텍스트를 자동으로 읽어 `data-checked`/`data-disabled` 등의 state prop 을 Item 과 Content/Title/Detail 에 주입한다. 이를 통해 별도의 prop 드릴링 없이 토큰 기반 상태 스타일이 연동된다.

**Checkbox 합성 패턴**

```tsx
// Checkbox.Root 가 checked 상태를 관리
// List.Item 내부 슬롯들은 data-checked 를 자동으로 수신
<List.Item>
  <Checkbox.Root defaultChecked>
    <List.Content>
      <List.Title>알림 수신 동의</List.Title>
      <List.Detail>푸시 알림을 받으시겠습니까?</List.Detail>
    </List.Content>
    <List.Suffix>
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
    </List.Suffix>
    <Checkbox.HiddenInput />
  </Checkbox.Root>
</List.Item>
```

**RadioGroupItem 합성 패턴**

`RadioGroup.Root` 를 `List.Root`에 `asChild`로 합성하고, 각 `List.Item` 안에 `RadioGroup.Item` 을 배치한다. `createWithStateProps`가 `useRadioGroupItemContext`를 읽어 선택 상태를 슬롯에 자동 주입한다.

```tsx
import { List, RadioGroup } from "@seed-design/react";

<List.Root asChild>
  <RadioGroup.Root defaultValue="sms" aria-label="알림 수신 방법">
    {["sms", "email", "push"].map((value) => (
      <List.Item key={value}>
        <RadioGroup.Item value={value}>
          <List.Content>
            <List.Title>{value.toUpperCase()}</List.Title>
          </List.Content>
          <List.Suffix>
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
          </List.Suffix>
          <RadioGroup.ItemHiddenInput />
        </RadioGroup.Item>
      </List.Item>
    ))}
  </RadioGroup.Root>
</List.Root>
```

**Switch 합성 패턴**

`Switch.Root` 를 `List.Item` 내부에 중첩한다. `createWithStateProps`가 `useSwitchContext` 를 읽어 `data-checked` 를 주입한다.

```tsx
import { List, Switch } from "@seed-design/react";

<List.Item>
  <Switch.Root defaultChecked>
    <List.Prefix>
      {/* 아이콘 등 보조 요소 */}
    </List.Prefix>
    <List.Content>
      <List.Title>야간 방해 금지</List.Title>
      <List.Detail>밤 10시 ~ 오전 7시</List.Detail>
    </List.Content>
    <List.Suffix>
      <Switch.Thumb />
    </List.Suffix>
    <Switch.HiddenInput />
  </Switch.Root>
</List.Item>
```

---

## 접근성

- `List.Root` 는 `<ul>`로 렌더되므로 `role="list"` 는 별도 지정 불필요. `as="fieldset"`으로 교체 시 `aria-label` 또는 `<legend>` 필요.
- `List.Item` 이 interactive(클릭 가능)일 때 반드시 `asChild`로 `<button>` 또는 `<a>` 로 교체해야 한다. `<li>` 에 직접 `onClick` 만 붙이는 것은 a11y 위반이다.
- 클릭 가능한 `<button>`에는 의미 있는 `aria-label` 또는 텍스트 콘텐츠가 있어야 한다.
- `disabled` prop 을 사용할 때 `<button disabled>` 로도 전달되도록 `asChild` 패턴에서 `disabled` attribute 를 함께 넘긴다.
- Checkbox·Radio·Switch 합성 시 각 컨트롤의 접근성 속성(`aria-checked`, `role="checkbox"` 등)은 해당 컴포넌트가 자동 처리한다.

---

## Anti-patterns

**1. `<li>` 에 직접 onClick 부착**
```tsx
// BAD — li 는 interactive role 이 없어 스크린 리더가 인식 못 함
<List.Item onClick={handleClick}>...</List.Item>

// GOOD
<List.Item asChild>
  <button type="button" onClick={handleClick}>...</button>
</List.Item>
```

**2. Content 없이 Title/Detail 직접 Item 하위에 배치**
```tsx
// BAD — Content 가 gap/paddingRight 토큰을 제공하는 슬롯
<List.Item>
  <List.Title>제목</List.Title>
  <List.Detail>상세</List.Detail>
</List.Item>

// GOOD
<List.Item>
  <List.Content>
    <List.Title>제목</List.Title>
    <List.Detail>상세</List.Detail>
  </List.Content>
</List.Item>
```

**3. @karrotmarket/react-monochrome-icon 아이콘 경로 직접 사용**
```tsx
// BAD
import { IconChevronRightLine } from "@karrotmarket/react-monochrome-icon";

// GOOD — @seed-design/react 의 Icon 컴포넌트와 함께 named export 사용
import { Icon, IconChevronRightFill } from "@seed-design/react";
<List.Suffix><Icon svg={<IconChevronRightFill />} /></List.Suffix>
```

**4. Prefix/Suffix 에 raw `<img>` 또는 raw `<svg>` 직접 삽입**
```tsx
// BAD — 토큰 size/color 연동 안 됨
<List.Prefix><svg>...</svg></List.Prefix>

// GOOD — Icon 컴포넌트 래핑으로 prefixIcon 토큰(22px, color) 적용
import { Icon, IconPersonCircleFill } from "@seed-design/react";
<List.Prefix><Icon svg={<IconPersonCircleFill />} /></List.Prefix>
```

**5. highlighted prop 을 CSS 직접 override 로 대체**
```tsx
// BAD — 상태 전환 애니메이션(colorDuration)이 깨짐
<List.Item style={{ background: "var(--color-bg-brand-weak)" }}>...</List.Item>

// GOOD
<List.Item highlighted>...</List.Item>
```

**6. Checkbox·Switch 합성 시 createWithStateProps 없이 data-* 수동 주입**
```tsx
// BAD — List.Item 이 state prop 을 받지 못해 disabled/checked 스타일이 안 나옴
const [checked, setChecked] = useState(false);
<List.Item data-checked={checked}>
  <List.Content>
    <List.Title>수동 상태 주입</List.Title>
  </List.Content>
</List.Item>

// GOOD — Checkbox.Root 를 List.Item 내부에 합성하면 createWithStateProps 가
//         useCheckboxContext 를 통해 자동으로 data-checked / data-disabled 를 주입한다
<List.Item>
  <Checkbox.Root checked={checked} onCheckedChange={setChecked}>
    <List.Content>
      <List.Title>자동 상태 연동</List.Title>
    </List.Content>
    <List.Suffix>
      <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
    </List.Suffix>
    <Checkbox.HiddenInput />
  </Checkbox.Root>
</List.Item>
```

---

## 예제

### (a) 기본 — Title + Detail row 컬렉션

```tsx
import { List } from "@seed-design/react";

export function BasicList() {
  const items = [
    { id: "1", title: "공지사항", detail: "새로운 공지사항이 있습니다" },
    { id: "2", title: "이벤트", detail: "진행 중인 이벤트를 확인하세요" },
    { id: "3", title: "자주 묻는 질문", detail: "궁금한 점을 찾아보세요" },
  ];

  return (
    <List.Root>
      {items.map((item) => (
        <List.Item key={item.id}>
          <List.Content>
            <List.Title>{item.title}</List.Title>
            <List.Detail>{item.detail}</List.Detail>
          </List.Content>
        </List.Item>
      ))}
    </List.Root>
  );
}
```

### (b) Prefix/Suffix 아이콘

```tsx
import { List, Icon, IconPersonCircleFill, IconChevronRightFill } from "@seed-design/react";

export function IconList() {
  return (
    <List.Root>
      <List.Item>
        <List.Prefix>
          <Icon svg={<IconPersonCircleFill />} />
        </List.Prefix>
        <List.Content>
          <List.Title>프로필 설정</List.Title>
          <List.Detail>이름, 사진, 소개를 수정할 수 있습니다</List.Detail>
        </List.Content>
        <List.Suffix>
          <Icon svg={<IconChevronRightFill />} />
        </List.Suffix>
      </List.Item>
      <List.Item>
        <List.Prefix>
          <Icon svg={<IconPersonCircleFill />} />
        </List.Prefix>
        <List.Content>
          <List.Title>알림 설정</List.Title>
          <List.Detail>푸시 알림 수신 여부를 설정합니다</List.Detail>
        </List.Content>
        <List.Suffix>
          <Icon svg={<IconChevronRightFill />} />
        </List.Suffix>
      </List.Item>
    </List.Root>
  );
}
```

### (c) Checkbox state 연동

```tsx
import { List, Checkbox } from "@seed-design/react";

export function CheckboxList() {
  return (
    <List.Root as="fieldset" aria-label="수신 동의 목록">
      <List.Item>
        <Checkbox.Root defaultChecked>
          <List.Content>
            <List.Title>마케팅 정보 수신 동의</List.Title>
            <List.Detail>이벤트 및 혜택 정보를 받습니다</List.Detail>
          </List.Content>
          <List.Suffix>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
          </List.Suffix>
          <Checkbox.HiddenInput />
        </Checkbox.Root>
      </List.Item>
      <List.Item>
        <Checkbox.Root>
          <List.Content>
            <List.Title>야간 알림 수신 동의</List.Title>
            <List.Detail>오후 9시 이후 알림을 받습니다</List.Detail>
          </List.Content>
          <List.Suffix>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
          </List.Suffix>
          <Checkbox.HiddenInput />
        </Checkbox.Root>
      </List.Item>
    </List.Root>
  );
}
```

### (d) clickable asChild — 전체 row 클릭

```tsx
import { List, Icon, IconChevronRightFill } from "@seed-design/react";

interface MenuItem {
  id: string;
  label: string;
  description: string;
  onClick: () => void;
}

export function ClickableList({ items }: { items: MenuItem[] }) {
  return (
    <List.Root>
      {items.map((item) => (
        <List.Item key={item.id} asChild>
          <button type="button" onClick={item.onClick}>
            <List.Content>
              <List.Title>{item.label}</List.Title>
              <List.Detail>{item.description}</List.Detail>
            </List.Content>
            <List.Suffix>
              <Icon svg={<IconChevronRightFill />} />
            </List.Suffix>
          </button>
        </List.Item>
      ))}
    </List.Root>
  );
}
```
