---
name: segmented-control
upstream_sha: 1f1d21d
---

# SegmentedControl

**정의** — 2–5개의 상호 배타적 옵션을 가로로 나열하여 즉시 전환하는 선택 컨트롤. `SegmentedControl.Root`가 `value`/`defaultValue`/`onValueChange` 상태를 소유하고, `SegmentedControl.Indicator`가 선택된 항목 위를 슬라이딩 배경으로 표시하며, 개별 항목은 `SegmentedControl.Item`으로 구성된다. 내부적으로 `role="radiogroup"` + `<input type="radio">` 패턴을 사용해 네이티브 접근성을 보장한다.

**import**
```ts
import { SegmentedControl } from "@seed-design/react";
// namespace:
//   <SegmentedControl.Root defaultValue="..." aria-label="...">
//     <SegmentedControl.Indicator />
//     <SegmentedControl.Item value="...">라벨</SegmentedControl.Item>
//     ...
//   </SegmentedControl.Root>
```

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 2–5개 옵션을 즉시 전환 (정렬 기준, 결제 주기, 카테고리 필터) | **SegmentedControl** (이 컴포넌트) |
| 같은 화면에서 콘텐츠 뷰를 전환하며 본문 영역이 스크롤·교체됨 | `Tabs` — SegmentedControl 은 본문 영역을 swap 하지 않음 |
| 탭 수가 많아 가로 스크롤이 필요하거나 각 탭이 독립 URL을 가짐 | `Tabs` (스크롤 가능, 슬롯 라우팅) |
| visual weight 가 낮은 보조 필터 버튼 그룹 | `ControlChip` — SegmentedControl 은 하나만 선택 가능한 높은 visual weight |
| 여러 항목을 독립적으로 on/off | `CheckboxGroup` |
| 단일 on/off 설정 토글 | `Switch` |
| 라디오 버튼처럼 3개 이상 옵션을 세로로 나열 | `RadioGroup` |

**Tabs 와의 구분 요약 (3행)**
1. **스크롤 가능 여부** — `Tabs.List` 는 overflowX 스크롤로 탭이 많아도 허용하지만, SegmentedControl 은 컨테이너 너비를 균등 분할하며 스크롤하지 않는다.
2. **콘텐츠 swap 여부** — `Tabs` 는 `Tabs.Content` 슬롯으로 독립 본문 패널을 교체하지만, SegmentedControl 은 선택 값만 노출하고 본문 렌더는 사용자가 직접 처리한다.
3. **visual weight** — SegmentedControl 은 선택 항목이 Indicator(흰 배경 카드)로 강하게 돌출되는 반면, Tabs 는 하단 바(Indicator 라인)로 선택을 표시해 weight 가 낮다.

관련 결정 매트릭스: [`decision-matrices/which-tab.md`](../decision-matrices/which-tab.md)

---

## Anatomy

`SegmentedControl.Root` 하나에 `Indicator` 한 개와 `Item` 1개 이상을 배치한다. `Item` 내부 구조(`ItemLabel`, `ItemHiddenInput` 등)는 **[segmented-control-item.md](./segmented-control-item.md)** 를 참고한다.

| Slot | 필수 | element | 역할 |
|------|------|---------|------|
| `SegmentedControl.Root` | ✅ | `<div role="radiogroup">` | `value`/`defaultValue`/`onValueChange`·`disabled`·`name`·`form` 소유. CSS 변수 `--segment-index`/`--segment-count` 주입 |
| `SegmentedControl.Indicator` | ✅ (권장) | `<div>` | 선택된 Item 위를 덮는 슬라이딩 흰 카드. `transformDuration: $duration.d4` 트랜지션으로 이동. Root 안 어디에 배치해도 되나 Item 형제로 두는 것이 관례 |
| `SegmentedControl.Item` | ✅ (1개 이상) | `<label>` | 개별 옵션. `value: string` 필수. 내부 `ItemHiddenInput`(`<input type="radio">`)으로 네이티브 radio 동작. 자세한 내용은 [segmented-control-item.md](./segmented-control-item.md) 참조 |

**계층 구조**

```
SegmentedControl.Root  (role="radiogroup")
├── SegmentedControl.Indicator       ← Root 직접 자식
├── SegmentedControl.Item value="a"  ← label 엘리먼트
├── SegmentedControl.Item value="b"
└── SegmentedControl.Item value="c"
```

**중요**
- `SegmentedControl.Indicator` 는 Root 직접 자식으로 배치한다. CSS `--segment-index`/`--segment-count` 변수를 Root 에서 주입하므로, Root 바깥에 두면 위치 계산이 깨진다.
- `SegmentedControl.Item` 의 `value` 는 그룹 내 고유해야 한다. 중복 시 선택 로직 오작동.
- Indicator 와 Item 의 DOM 순서는 시각 레이아웃에 영향을 주지 않는다(CSS `transform` 으로 위치 계산).

---

## YAML ↔ React 매핑표

| YAML spec | prop / 토큰 | 적용 슬롯 |
|-----------|------------|----------|
| `segmented-control.yaml` | — | `SegmentedControl.Root` |
| `segmented-control-indicator.yaml` | — | `SegmentedControl.Indicator` |
| `root.padding` | `$dimension.x1` | Root 내부 여백 |
| `root.cornerRadius` | `$radius.full` | Root 모서리 반경 |
| `root.color` | `$color.bg.neutral-weak-alpha` | Root 배경색 |
| `indicator.color` (enabled) | `$color.palette.gray-00` | Indicator 배경 |
| `indicator.color` (pressed) | `$color.palette.gray-100` | Indicator 눌림 배경 |
| `indicator.color` (disabled) | `$color.bg.disabled` | Indicator 비활성 배경 |
| `indicator.cornerRadius` | `$radius.full` | Indicator 모서리 반경 |
| `indicator.strokeColor` | `$color.stroke.neutral-muted` | Indicator 테두리 색 |
| `indicator.strokeWidth` | `1px` | Indicator 테두리 굵기 |
| `indicator.transformDuration` | `$duration.d4` | Indicator 이동 트랜지션 |
| `indicator.transformTimingFunction` | `$timing-function.easing` | Indicator 이동 이징 |

---

## Variants

### variant 축 없음

`segmented-control.yaml` 은 `base` 하나만 정의한다. `size`·`layout` 같은 추가 variant 축이 없으며, 너비 제어는 Root 에 인라인 `style={{ width: "..." }}` 또는 외부 레이아웃으로 처리한다.

| 속성 | 고정값 | 메모 |
|------|--------|------|
| padding (Root 내부) | `$dimension.x1` | 모든 인스턴스 동일 |
| cornerRadius (Root) | `$radius.full` | 캡슐형 외곽 |
| cornerRadius (Indicator) | `$radius.full` | 선택 카드도 캡슐형 |
| Indicator 이동 duration | `$duration.d4` | 공통 |

---

## States

Root 와 Item 에 `data-*` 속성으로 상태가 전달된다. Indicator 는 CSS `--segment-index` 변수를 통해 선택된 Item 의 위치로 `transform` 이동한다.

| State | 트리거 | 대상 | 시각 변화 |
|-------|--------|------|-----------|
| `enabled` (unselected) | 기본 | Item 라벨 | `data-checked` 없음 |
| `enabled, selected` | `value === itemValue` | Item 라벨 + Indicator | Indicator 가 `$duration.d4` 로 해당 Item 위로 이동 |
| `pressed` | pointerdown | Indicator | `indicator.color: $color.palette.gray-100` |
| `disabled` (Root) | `Root disabled` | 전체 | `data-disabled` 부착, 모든 Item 선택 불가, Indicator `$color.bg.disabled` |
| `disabled` (Item) | `Item disabled` | 해당 Item | 해당 Item 만 선택 불가 (`itemDisabled \|\| rootDisabled` OR 로 합산) |
| `focus-visible` | Tab 키 포커스 | 해당 Item | `data-focus-visible` 부착 — HiddenInput 에 브라우저 포커스 링 위임 |

**컨트롤드 vs 언컨트롤드**
- **언컨트롤드**: `defaultValue` 만 지정 → 내부 state 관리. 초기 선택을 고정할 때 사용.
- **컨트롤드**: `value` + `onValueChange` 모두 지정 → 부모가 상태 소유. 외부 버튼 연동, URL 동기화 시 필요.
- `value={undefined}` 를 조건부로 전달하는 것을 금지한다 — 컨트롤드/언컨트롤드 혼용으로 React 경고가 발생한다.

---

## Token 매핑

`segmented-control.yaml` (Root 슬롯) 과 `segmented-control-indicator.yaml` (Indicator 슬롯) 토큰. D5 결정: indicator yaml 을 별도 파일로 분리하지 않고 본 문서 Token 매핑 섹션의 "indicator" sub-table 로 통합한다.

```
segmented-control recipe (Root 컨테이너):
  root.padding:        $dimension.x1
  root.cornerRadius:   $radius.full
  root.color:          $color.bg.neutral-weak-alpha

  base / enabled:
    (위 값이 유일한 정의 — size·layout variant 없음)

segmented-control-indicator recipe (Indicator 슬롯):
  root.color (enabled):   $color.palette.gray-00          ← 흰 카드 배경
  root.color (pressed):   $color.palette.gray-100         ← 눌림 피드백
  root.color (disabled):  $color.bg.disabled              ← 비활성 배경
  root.cornerRadius:      $radius.full
  root.strokeColor:       $color.stroke.neutral-muted
  root.strokeWidth:       1px
  root.transformDuration: $duration.d4                    ← D4 트랜지션
  root.transformTimingFunction: $timing-function.easing
```

> `indicator.transformDuration = $duration.d4`: Indicator 가 선택 항목 위치로 슬라이드하는 트랜지션 속도. CSS `transform: translateX(...)` 에만 적용되며 `transition: transform $duration.d4 $timing-function.easing` 으로 구현된다.

---

## Props

```ts
import type {
  SegmentedControlPrimitive,
  SegmentedControlVariantProps,
} from "@seed-design/react";
import type * as React from "react";

// 1) SegmentedControl.Root — 값 상태 소유 + role="radiogroup"
interface SegmentedControlRootProps
  extends SegmentedControlVariantProps,
          SegmentedControlPrimitive.RootProps {
  // 상태
  value?: string;                            // controlled
  defaultValue?: string;                     // uncontrolled initial
  onValueChange?: (value: string) => void;

  // 비활성
  disabled?: boolean;

  // 폼 연동
  name?: string;      // 내부 HiddenInput name 으로 전파
  form?: string;      // HTML form attr 전파

  // 접근성
  // aria-label 또는 aria-labelledby 반드시 필요 (아래 접근성 섹션 참고)
}

// 2) SegmentedControl.Indicator — 슬라이딩 선택 카드
//    SegmentedControlPrimitive 에 별도 Indicator 타입 없음
//    → Primitive.div 래퍼이므로 HTMLDivElement attrs 전달 가능
interface SegmentedControlIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  // children 없음.
  // --segment-index / --segment-count CSS 변수로 위치 자동 계산
  // transform 트랜지션: $duration.d4
}
```

**default 동작 요약**
- `defaultValue` 미지정 → 모든 Item 미선택 (Indicator 초기 위치 없음).
- `disabled` 미지정 → `false`.
- variant 없음 → 단일 `base` 스타일 적용.

---

## 합성 규칙 (composition)

- **모든 Item 은 하나의 Root 아래** — `useSegmentedControlContext` 가 없으면 Item 단독은 동작하지 않는다. Root 없이 단독 사용 금지.
- **각 Item 의 `value` 는 그룹 내 고유** — 중복된 값은 선택 로직 오작동 및 키보드 이동 깨짐을 유발한다.
- **`SegmentedControl.Indicator` 는 Root 직접 자식** — CSS 변수 `--segment-index`/`--segment-count` 범위가 Root 에 한정되므로 바깥에 두면 위치 계산 실패.
- **너비 제어는 Root 에 인라인 style 또는 외부 레이아웃** — variant 가 없으므로 고정 너비가 필요하면 `style={{ width: "..." }}` 로 지정한다.
- **Item 내부 구조는 segmented-control-item.md 참조** — `ItemLabel`, `ItemHiddenInput`, `notification` prop 등은 별도 문서에서 다룬다.
- **`name` 은 Root 에** — Root 의 `name` 이 모든 Item 의 HiddenInput 으로 전파된다. Item 에 직접 name 을 주지 말 것.

---

## 접근성 (constraints, not suggestions)

- **Root 는 자동으로 `role="radiogroup"`** 을 부착한다. 직접 role 을 추가하지 말 것.
- **`aria-label` 필수** — 그룹이 무엇에 대한 선택인지 반드시 `Root` 에 `aria-label` 또는 `aria-labelledby` 를 지정해야 한다. 지정하지 않으면 스크린 리더가 컨트롤의 목적을 알 수 없다.
- **내부 radio role** — 각 Item 의 HiddenInput 이 `<input type="radio">` 이므로 `role="radio"` + `aria-checked` 를 브라우저 네이티브로 처리한다. `role` 을 직접 추가하지 말 것.
- **키보드 네비게이션** — `Tab` 으로 그룹 진입 후 `ArrowLeft`/`ArrowRight` 로 옵션 이동, 이동 즉시 선택(roving tabindex + radio 거동 위임). `Tab` 으로 그룹 탈출.
- **disabled 처리** — Root 또는 Item 에 `disabled` prop 을 사용하면 `data-disabled` 가 자동 부착되고 포인터 이벤트도 차단된다. CSS 로만 시각을 변경하는 것은 접근성 위반.
- **색만으로 selected 상태 전달 금지** — Indicator 위치 이동과 `data-checked` 두 가지 단서를 함께 제공한다. Indicator 를 제거하면 시각적 선택 단서가 색 대비에만 의존하게 된다.
- **`aria-label` 없이 Item 의 텍스트만으로 식별이 불가능한 경우** (아이콘만 사용할 때) → Item 에 `aria-label` 추가.

---

## Anti-patterns

```tsx
// 1. Root 없이 Item + Indicator 단독 사용 — context 누락으로 런타임 에러
❌
<SegmentedControl.Indicator />
<SegmentedControl.Item value="a">A</SegmentedControl.Item>

// 2. aria-label 누락 — 스크린 리더가 "radio group" 으로만 읽고 목적 파악 불가
❌
<SegmentedControl.Root defaultValue="hot">
  <SegmentedControl.Indicator />
  <SegmentedControl.Item value="hot">인기</SegmentedControl.Item>
  <SegmentedControl.Item value="new">최신</SegmentedControl.Item>
</SegmentedControl.Root>

// 3. Indicator 를 Root 바깥에 배치 — CSS 변수 범위 벗어나 위치 계산 깨짐
❌
<div>
  <SegmentedControl.Indicator />   {/* Root 바깥 — transform 오차 발생 */}
  <SegmentedControl.Root defaultValue="a" aria-label="정렬">
    <SegmentedControl.Item value="a">A</SegmentedControl.Item>
  </SegmentedControl.Root>
</div>

// 4. controlled 인데 onValueChange 누락 — UI 갱신 불가
❌
<SegmentedControl.Root value={selected} aria-label="정렬">
  {/* onValueChange 없음 — 선택해도 value 가 변경되지 않아 UI 고정 */}
  <SegmentedControl.Indicator />
  <SegmentedControl.Item value="hot">인기</SegmentedControl.Item>
  <SegmentedControl.Item value="new">최신</SegmentedControl.Item>
</SegmentedControl.Root>

// 5. aliased direct export 사용 — Namespace form 만 허용됨
// e.g. `import { Root, Item, Indicator } from "@seed-design/react/SegmentedControl"`
// 또는 aliased named exports 를 직접 사용하는 패턴은 금지.
// 반드시 `import { SegmentedControl } from "@seed-design/react"` 후
// SegmentedControl.Root / .Item / .Indicator 형태로만 사용한다.
❌
import { Root, Item, Indicator } from "@seed-design/react/SegmentedControl"; // 잘못된 sub-path import
<Root defaultValue="a" aria-label="정렬">
  <Indicator />
  <Item value="a">인기</Item>
  <Item value="b">최신</Item>
</Root>

// 6. 탭 콘텐츠 swap 에 SegmentedControl 을 Tabs 대신 사용
❌
<SegmentedControl.Root value={tab} onValueChange={setTab} aria-label="탭">
  <SegmentedControl.Indicator />
  <SegmentedControl.Item value="a">상품 정보</SegmentedControl.Item>
  <SegmentedControl.Item value="b">리뷰</SegmentedControl.Item>
</SegmentedControl.Root>
{tab === "a" && <ProductContent />}   {/* Tabs 를 써야 하는 패턴 */}
{tab === "b" && <ReviewContent />}

✅
<SegmentedControl.Root defaultValue="hot" aria-label="정렬 기준">
  <SegmentedControl.Indicator />
  <SegmentedControl.Item value="hot">인기</SegmentedControl.Item>
  <SegmentedControl.Item value="new">최신</SegmentedControl.Item>
  <SegmentedControl.Item value="distance">거리순</SegmentedControl.Item>
</SegmentedControl.Root>
```

---

## 예제

### 1. 기본 — 언컨트롤드 (`defaultValue`)

세 개의 옵션이 `defaultValue`로 초기 선택된 상태로 렌더된다. Indicator 가 선택 항목 위로 `$duration.d4` 트랜지션과 함께 이동한다.

```tsx
import { SegmentedControl } from "@seed-design/react";

export default function BasicSegmentedControl() {
  return (
    <SegmentedControl.Root defaultValue="hot" aria-label="정렬 기준">
      <SegmentedControl.Indicator />
      <SegmentedControl.Item value="hot">인기</SegmentedControl.Item>
      <SegmentedControl.Item value="new">최신</SegmentedControl.Item>
      <SegmentedControl.Item value="distance">거리순</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
```

### 2. Controlled + notification 상태

`value`/`onValueChange` 로 외부 상태를 소유하고, 특정 Item 에 `notification` prop 으로 읽지 않은 항목 표시를 붙인다. 해당 탭을 선택하면 notification 이 사라지도록 상태를 갱신한다.

```tsx
import { SegmentedControl } from "@seed-design/react";
import { useState } from "react";

export default function ControlledWithNotification() {
  const [billing, setBilling] = useState("monthly");
  const [hasSeenAnnual, setHasSeenAnnual] = useState(false);

  return (
    <SegmentedControl.Root
      value={billing}
      onValueChange={(value) => {
        setBilling(value);
        if (value === "annual") setHasSeenAnnual(true);
      }}
      aria-label="결제 주기"
    >
      <SegmentedControl.Indicator />
      <SegmentedControl.Item value="monthly">월간</SegmentedControl.Item>
      <SegmentedControl.Item value="annual" notification={!hasSeenAnnual}>
        연간
      </SegmentedControl.Item>
      <SegmentedControl.Item value="enterprise">기업 맞춤</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
```

---

## CSS 변수 동작 (내부 메커니즘)

> 직접 제어할 필요는 없으나 레이아웃 디버깅 시 참고한다.

`useSegmentedControl` 훅이 Root 엘리먼트에 두 개의 CSS 변수를 주입한다.

| 변수 | 의미 | 계산 방법 |
|------|------|-----------|
| `--segment-index` | 현재 선택된 Item 의 0-based 순서 | `dom.getSegmentIndex(value, rootEl)` — 값 미선택 시 `-1` |
| `--segment-count` | Root 안의 전체 Item 수 | `dom.getAllValues(rootEl).length` |

Indicator 의 CSS 는 이 두 변수를 이용해 `translateX(calc(var(--segment-index) / var(--segment-count) * 100%))` 형태로 위치를 계산한다. 따라서:
- Root 의 너비를 인라인 스타일로 제한하면 Indicator 위치도 자동으로 재계산된다.
- DOM 에서 Item 을 동적으로 추가/제거하면 `segmentCount` 가 재계산되어 Indicator 비율이 조정된다.
- SSR 환경에서는 Root 가 마운트될 때까지 `--segment-index = -1` 이므로 Indicator 가 보이지 않다가 hydration 후 나타난다. 이 점프를 방지하려면 `defaultValue` 를 항상 지정한다.

---

## 관련 문서

- [`./segmented-control-item.md`](./segmented-control-item.md) — `SegmentedControl.Item` 토큰·props·`notification` prop 상세
- [`decision-matrices/which-tab.md`](../decision-matrices/which-tab.md) — Tabs vs SegmentedControl vs NavigationBar 선택 기준
- Rootage 스펙: `packages/rootage/components/segmented-control.yaml` · `segmented-control-indicator.yaml`
