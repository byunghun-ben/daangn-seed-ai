---
name: tab
upstream_sha: 1f1d21d
---

# Tab (Tabs.Trigger)

> **D4 안내** — `tab.yaml` 은 `Tabs.Trigger` 의 `root + label` slot 에 한정. 전체 사용 가이드는 [`./tablist.md`](./tablist.md) 와 함께 읽어야 완결.

**정의** — Tabs UI에서 개별 탭 버튼 하나를 담당하는 컴포넌트. `Tabs.List` 내부에 배치되며, 클릭 시 해당 `value`에 대응하는 `Tabs.Content`를 활성화한다. `tab.yaml`은 이 컴포넌트의 `root`(크기·패딩)와 `label`(폰트·색상) slot 토큰만을 정의한다.

**import**
```ts
import { Tabs } from "@seed-design/react";
// Tabs.Trigger 는 반드시 Tabs.List 안에 배치:
// <Tabs.Root defaultValue="a">
//   <Tabs.List>
//     <Tabs.Trigger value="a">라벨</Tabs.Trigger>
//     <Tabs.Indicator />
//   </Tabs.List>
//   <Tabs.Content value="a">...</Tabs.Content>
// </Tabs.Root>
```

---

## Anatomy

`Tabs.Trigger`는 두 개의 slot으로 구성된다.

| Slot | element | 역할 |
|------|---------|------|
| `root` | `<button role="tab">` | 탭 버튼 전체 영역. `minHeight` · `paddingX` · `paddingY` 토큰 적용. 클릭·키보드 이벤트 처리 |
| `label` | `<span>` (내부 텍스트) | 탭 라벨 텍스트. `fontSize` · `lineHeight` · `fontWeight` · `color` 토큰 적용 |

**구조**
```
Tabs.Trigger (root — button[role="tab"])
└── label (span)
      └── {children}
```

> Anatomy 외부 구조(Tabs.List 내 위치, Tabs.Root 값 연동 등)는 [`./tablist.md`](./tablist.md) 참조.

---

## Variants

`Tabs.Root`의 `size` prop으로 제어한다. Trigger 단독으로 size를 지정할 수 없으며, List 전체 높이와 연동된다.

| size 값 | root.minHeight | root.paddingX | root.paddingY | label.fontSize | 사용 맥락 |
|---------|---------------|--------------|--------------|---------------|-----------|
| `"small"` | 40px | `$dimension.x2_5` | `$dimension.x2_5` | `$font-size.t4` | 콘텐츠 밀집 화면, 보조 탭 |
| `"medium"` (기본) | 44px | `$dimension.x2_5` | `$dimension.x2_5` | `$font-size.t5` | 일반적인 메인 탭 |

---

## States

`Tabs.Trigger`에는 3가지 상태가 있다. 모두 `data-*` 속성을 통해 스타일이 적용되며, 직접 인라인 스타일로 색상을 덮어쓰는 것은 금지된다.

| 상태 | 조건 | label.color |
|------|------|------------|
| `enabled` (미선택) | 기본 | `$color.fg.neutral-subtle` |
| `selected` | `value === Tabs.Root value` | `$color.fg.neutral` |
| `disabled` | `disabled` prop 지정 | `$color.fg.disabled`, 포인터 이벤트 차단 |

- `selected` 상태 전환은 `Tabs.Root`가 `value`를 갱신할 때 headless 레이어가 자동 처리한다.
- `disabled` Trigger는 `aria-disabled` 속성이 자동으로 부착된다.

---

## Token 매핑

`tab.yaml`에서 선언하는 토큰 전체. recipe variant(`size`)만으로 제어한다.

```
tab recipe (Tabs.Trigger):

  base:
    enabled:  label.color = $color.fg.neutral-subtle
    selected: label.color = $color.fg.neutral
    disabled: label.color = $color.fg.disabled

  size=medium:
    root.minHeight: 44px
    root.paddingX:  $dimension.x2_5
    root.paddingY:  $dimension.x2_5
    label.fontSize:    $font-size.t5
    label.lineHeight:  $line-height.t5
    label.fontWeight:  $font-weight.bold

  size=small:
    root.minHeight: 40px
    root.paddingX:  $dimension.x2_5
    root.paddingY:  $dimension.x2_5
    label.fontSize:    $font-size.t4
    label.lineHeight:  $line-height.t4
    label.fontWeight:  $font-weight.bold
```

> `tablist.yaml` 토큰(`Tabs.List` 높이·배경, `Tabs.Indicator` 색·트랜지션)은 [`./tablist.md`](./tablist.md) 참조.

---

## Props

```ts
import type { TabsPrimitive } from "@seed-design/react";

// TabsTriggerProps — tab.yaml 토큰 슬롯 적용 대상
interface TabsTriggerProps extends TabsPrimitive.TriggerProps {
  value: string;      // 필수 — 대응하는 Tabs.Content value와 일치해야 함
  disabled?: boolean; // 선택 — true 시 클릭·선택 불가, aria-disabled 자동 부착
  children: React.ReactNode; // label slot에 렌더. 텍스트만 허용 (중첩 Trigger 금지)
}
```

- `value`는 그룹 내 고유해야 한다. 중복 시 선택 로직이 오작동한다.
- `size`는 `Tabs.Root`에서 일괄 지정한다. Trigger에 직접 지정하는 prop이 아니다.

---

## 합성 규칙

- **반드시 `Tabs.List` 안에 배치한다** — `Tabs.List` 바깥에서 렌더하면 `useTabsContext()`가 없어 런타임 에러가 발생한다.
- **`value` prop은 필수다** — 생략하면 Content와 연결이 끊어져 탭 클릭 시 아무 패널도 활성화되지 않는다.
- **`children`은 텍스트(label)만** — 빈 label(`children=""` 또는 `null`)은 접근성 위반이다. label slot이 비어 있으면 스크린 리더가 탭을 설명할 수 없다.
- **Trigger 안에 다른 Trigger를 중첩하지 않는다** — `<button>` 안에 `<button>`은 HTML 명세 위반이며 이벤트 전파가 비정상 동작한다.

---

## 접근성

headless 레이어(`@seed-design/react-tabs`)가 자동으로 처리하며, 직접 추가할 필요가 없다.

| 속성/동작 | 처리 주체 | 설명 |
|----------|---------|------|
| `role="tab"` | headless 자동 | 버튼에 tab role 부착 |
| `aria-selected` | headless 자동 | 선택된 Trigger에 `true`, 나머지에 `false` |
| `aria-controls` | headless 자동 | 대응하는 Content 패널 id 연결 |
| `tabIndex` roving | headless 자동 | 선택된 Trigger만 `0`, 나머지는 `-1` |
| `aria-disabled` | headless 자동 | `disabled` prop 시 부착 |
| 키보드 화살표 이동 | headless 자동 | `ArrowLeft`/`ArrowRight`로 이전·다음 탭 포커스 이동. `Home`/`End`로 첫·마지막 이동. 이벤트는 `Tabs.List`가 처리 |

> 색만으로 selected 상태를 전달하지 않는다. `Tabs.Indicator` 위치 + `aria-selected` 두 가지 단서를 함께 제공해야 한다.

---

## Anti-patterns

```tsx
// 1. Tabs.List 바깥에서 Tabs.Trigger 단독 사용 — useTabsContext 없음, 런타임 에러
<Tabs.Root defaultValue="a">
  <Tabs.Trigger value="a">탭A</Tabs.Trigger>  {/* List 누락 */}
  <Tabs.Content value="a">콘텐츠A</Tabs.Content>
</Tabs.Root>

// 2. value prop 생략 — Content와 연결 불가, 클릭해도 패널 표시 안 됨
<Tabs.List>
  <Tabs.Trigger>라벨</Tabs.Trigger>  {/* value 없음 */}
  <Tabs.Indicator />
</Tabs.List>

// 3. Trigger 안에 Trigger 중첩 — button 안 button HTML 명세 위반
<Tabs.List>
  <Tabs.Trigger value="a">
    <Tabs.Trigger value="nested">중첩</Tabs.Trigger>  {/* 금지 */}
  </Tabs.Trigger>
  <Tabs.Indicator />
</Tabs.List>
```

---

## 예제

### 1. 기본 Tabs.Trigger — 라벨 있는 단순 trigger

`Tabs.Root` > `Tabs.List` > `Tabs.Trigger` 기본 합성 패턴. 전체 Tabs 합성 구조는 [`./tablist.md`](./tablist.md) 참조.

```tsx
import { Tabs } from "@seed-design/react";

export default function BasicTrigger() {
  return (
    <Tabs.Root defaultValue="1">
      <Tabs.List>
        <Tabs.Trigger value="1">라벨1</Tabs.Trigger>
        <Tabs.Trigger value="2">라벨2</Tabs.Trigger>
        <Tabs.Trigger value="3">라벨3</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="1">Content 1</Tabs.Content>
      <Tabs.Content value="2">Content 2</Tabs.Content>
      <Tabs.Content value="3">Content 3</Tabs.Content>
    </Tabs.Root>
  );
}
```

### 2. disabled state — 특정 탭 비활성화

`disabled` prop을 지정한 Trigger는 클릭·선택이 차단되고 `label.color`가 `$color.fg.disabled`로 변경된다. `aria-disabled`는 headless가 자동으로 부착한다.

```tsx
import { Tabs } from "@seed-design/react";

export default function DisabledTrigger() {
  return (
    <Tabs.Root defaultValue="1">
      <Tabs.List>
        <Tabs.Trigger value="1">라벨1</Tabs.Trigger>
        <Tabs.Trigger value="2" disabled>
          라벨2
        </Tabs.Trigger>
        <Tabs.Trigger value="3">라벨3</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="1">Content 1</Tabs.Content>
      <Tabs.Content value="2">Content 2</Tabs.Content>
      <Tabs.Content value="3">Content 3</Tabs.Content>
    </Tabs.Root>
  );
}
```

---

## 관련 문서

- [`./tablist.md`](./tablist.md) — Tabs 전체 namespace. `Tabs.Root` · `Tabs.List` · `Tabs.Indicator` · `Tabs.Content` 합성 가이드
- [`decision-matrices/which-tab.md`](../decision-matrices/which-tab.md) — Tabs vs SegmentedControl vs NavigationBar 선택 기준
