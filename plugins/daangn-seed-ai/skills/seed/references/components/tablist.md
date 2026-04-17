---
name: tablist
upstream_sha: 1f1d21d
---

# Tablist (Tabs namespace)

**정의** — 탭 전환 UI의 헤더 레이어. `Tabs.List`(탭 목록 컨테이너)·`Tabs.Trigger`(개별 탭 버튼)·`Tabs.Indicator`(선택 표시 하단 바)로 구성되며, `Tabs.Root`가 값 상태를 소유하고 `Tabs.Content`로 본문을 렌더하는 전체 Tabs namespace의 핵심 부분이다.

**import**
```ts
import { Tabs } from "@seed-design/react";
// namespace:
//   <Tabs.Root defaultValue="...">
//     <Tabs.List>
//       <Tabs.Trigger value="...">라벨</Tabs.Trigger>
//       ...
//       <Tabs.Indicator />
//     </Tabs.List>
//     <Tabs.Content value="...">...</Tabs.Content>
//   </Tabs.Root>
```

> **YAML ↔ React namespace 통합 안내**
> Rootage 스펙은 `tab.yaml` (개별 탭 버튼 토큰)과 `tablist.yaml` (탭 목록 컨테이너·인디케이터 토큰)로 분리되어 있으나, React 구현은 단일 `Tabs` namespace로 통합되어 있습니다. 본 문서는 `tablist.yaml` 스펙(컨테이너·인디케이터)을 중심으로 서술합니다. 탭 버튼(`Tabs.Trigger`) 토큰과 상태는 **[tab.md](./tab.md)** 와 함께 읽어야 완결됩니다.

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 같은 화면에서 2개 이상의 콘텐츠 뷰를 전환 (상품 설명 / 리뷰 / Q&A) | **Tabs** (이 컴포넌트) |
| 2–5개 옵션을 즉시 전환하는 작은 컨트롤 (정렬 기준, 카테고리 필터) | `SegmentedControl` / `ControlChip` |
| 페이지 전체를 이동하는 메뉴 (하단 탭 바, 사이드 네비게이션) | `NavigationBar` / `Sidebar` |
| 단일 on/off 토글 | `Switch` |
| 여러 항목 다중 선택 | `CheckboxGroup` |
| 탭마다 독립 URL이 필요한 라우팅 | 라우터 기반 `<Link>` 패턴 + `Tabs.Root value` 연동 |

관련 결정 매트릭스: [`decision-matrices/which-tab.md`](../decision-matrices/which-tab.md)

---

## Anatomy

`Tabs.Root`가 값 상태를 소유하고, `Tabs.List` 아래에 `Tabs.Trigger`(들)과 선택 인디케이터 `Tabs.Indicator`가 놓인다. `Tabs.Content`는 List 밖에 형제로 배치한다.

| Slot | 필수 | element | 역할 |
|------|------|---------|------|
| `Tabs.Root` | ✅ | `<div>` | `value`/`defaultValue`/`onValueChange`·`orientation`·`lazyMount`·`unmountOnExit` 소유. CSS 변수 `--indicator-left`/`--indicator-width` 주입 |
| `Tabs.List` | ✅ | `<div role="tablist">` | 탭 버튼 목록 컨테이너. `tablist.yaml`의 `root` 슬롯 토큰(배경·하단 스트로크·높이·paddingX) 적용. 키보드 이벤트(ArrowLeft/Right, Home, End) 처리 |
| `Tabs.Trigger` | ✅ (1개 이상) | `<button role="tab">` | 개별 탭 버튼. `value: string` 필수. `tab.yaml` 토큰(라벨 색·폰트·minHeight·paddingX/Y) 적용. 선택된 trigger만 `tabIndex=0`, 나머지는 `tabIndex=-1` (roving tabindex) |
| `Tabs.Indicator` | ✅ (권장) | `<span>` | 선택된 탭 아래 하단 바. `tablist.yaml`의 `indicator` 슬롯 토큰(height·color·transformDuration·insetX) 적용. `transform` CSS 변수로 위치 이동 |
| `Tabs.Content` | ✅ (1개 이상) | `<div role="tabpanel">` | 탭 본문 패널. `value`가 현재 선택된 `Tabs.Root` 값과 일치할 때만 표시 (`aria-hidden` 자동 처리) |

**계층 구조**

```
Tabs.Root
├── Tabs.List
│   ├── Tabs.Trigger value="a"
│   ├── Tabs.Trigger value="b"
│   └── Tabs.Indicator          ← List 안에 배치
├── Tabs.Content value="a"
└── Tabs.Content value="b"
```

**중요**
- `Tabs.Indicator`는 반드시 `Tabs.List` 안에 자식으로 배치한다. 바깥에 두면 CSS 변수 범위를 벗어나 위치 계산이 깨진다.
- `Tabs.Content`는 `Tabs.List` 형제로 배치한다. List 안에 넣지 않는다.
- `Tabs.Trigger`의 `value`는 그룹 내 고유해야 한다. 중복되면 선택 로직이 오작동한다.

---

## YAML ↔ React 매핑표

| YAML spec | prop / 토큰 | 적용 슬롯 |
|-----------|------------|----------|
| `tablist.yaml` | — | `Tabs.List`, `Tabs.Indicator` |
| `tab.yaml` | — | `Tabs.Trigger` |
| `layout=hug` / `layout=fill` | `Tabs.Root triggerLayout` prop | `Tabs.List` root.paddingX, `Tabs.Indicator` indicator.insetX |
| `size=small` / `size=medium` | `Tabs.Root size` prop | `Tabs.List` root.height, `Tabs.Trigger` 크기 |
| `tablist.yaml` indicator.transformDuration | `$duration.d4` | `Tabs.Indicator` transform transition |
| `tablist.yaml` indicator.color | `$color.fg.neutral` | `Tabs.Indicator` |
| `tablist.yaml` root.strokeColor | `$color.stroke.neutral-muted` | `Tabs.List` 하단 선 |

> `triggerLayout` prop은 `Tabs.Root`에 지정하며, 내부적으로 List의 paddingX와 Indicator의 insetX를 함께 제어한다.

---

## Variants

### size

`Tabs.Root`의 `size` prop으로 지정한다. `Tabs.List` 높이와 `Tabs.Trigger` 라벨 크기에 함께 적용된다.

| 값 | List 높이 | Trigger minHeight | 라벨 fontSize | 사용 맥락 |
|----|----------|------------------|--------------|-----------|
| `"small"` | 40px | 40px | `$font-size.t4` | 콘텐츠가 밀집된 화면, 보조 탭 |
| `"medium"` | 44px | 44px | `$font-size.t5` | 일반적인 메인 탭 (기본값) |

### layout (triggerLayout)

`Tabs.Root`의 `triggerLayout` prop으로 지정한다.

| 값 | 설명 | List paddingX | Indicator insetX | 사용 맥락 |
|----|------|--------------|-----------------|-----------|
| `"hug"` | 각 탭이 콘텐츠 너비에 맞게 수축 | `$dimension.spacing-x.global-gutter` | `0px` | 탭 수가 많거나 가변 레이블 |
| `"fill"` | 탭이 List 너비를 균등 분할 | `0px` | `$dimension.spacing-x.global-gutter` | 탭 수가 적고(2–4개) 고정 너비 레이아웃 |

---

## States

`Tabs.List`와 `Tabs.Trigger`에 `data-*` 속성으로 상태가 전달된다.

| 상태 | 트리거 | 대상 | 시각 변화 |
|------|--------|------|-----------|
| `enabled` (unselected) | 기본 | Trigger 라벨 | `$color.fg.neutral-subtle` |
| `selected` | `value === triggerValue` | Trigger 라벨 + Indicator | 라벨 `$color.fg.neutral`, Indicator 위치 이동 |
| `disabled` | `Trigger disabled` | Trigger 라벨 | `$color.fg.disabled`, 포인터 이벤트 차단, `aria-disabled` 부착 |
| `focused` | Tab 키 / 화살표 키로 포커스 | Trigger | `data-focus-visible` 부착, 브라우저 포커스 링 |
| `ssr` | SSR 렌더링 중 | Root·List·Trigger | `data-ssr` 부착 — Indicator hydration 전 위치 점프 방지 |

**컨트롤드 vs 언컨트롤드**
- **언컨트롤드**: `defaultValue`만 지정 → 내부 state 관리. 초기 선택 탭을 고정할 때 사용.
- **컨트롤드**: `value` + `onValueChange` 모두 지정 → 부모가 상태 소유. URL 동기화, 외부 버튼 연동 시 필요.
- `value={undefined}` 조건부 전달 금지 — 컨트롤드/언컨트롤드 혼용으로 React 경고 발생.

---

## Token 매핑

`tablist.yaml`의 root·indicator 슬롯 토큰. recipe variant(size·layout)로만 제어하고, 하드 CSS 덮어쓰기 금지.

```
tablist recipe (List 컨테이너):
  root.color:             $color.bg.layer-default
  root.strokeBottomWidth: 1px
  root.strokeColor:       $color.stroke.neutral-muted

  layout=hug:
    root.paddingX:        $dimension.spacing-x.global-gutter
    indicator.insetX:     0px
  layout=fill:
    root.paddingX:        0px
    indicator.insetX:     $dimension.spacing-x.global-gutter

  size=small:
    root.height:          40px
  size=medium:
    root.height:          44px

tablist recipe (Indicator):
  indicator.height:              2px
  indicator.color:               $color.fg.neutral
  indicator.transformDuration:   $duration.d4        ← D4 트랜지션
  indicator.transformTimingFunction: $timing-function.easing
```

> `indicator.transformDuration = $duration.d4`: Indicator가 선택 탭 위치로 슬라이드하는 트랜지션 속도. CSS `transform`에만 적용되며 `transition: transform $duration.d4 $timing-function.easing` 으로 구현된다.

---

## Props

`TabsPrimitive.RootProps` 및 `TabsVariantProps` 등 관련 타입은 `@seed-design/react` 에서 직접 re-export 된다. 별도 sub-path import 없이 아래와 같이 사용한다.

```ts
import type {
  TabsPrimitive,
  TabsVariantProps,   // size: "small" | "medium"; triggerLayout: "hug" | "fill"
} from "@seed-design/react";

// 1) Tabs.Root — 값 상태 소유
interface TabsRootProps
  extends TabsVariantProps,
          TabsPrimitive.RootProps {
  // 상태
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  // 레이아웃
  size?: "small" | "medium";          // default "medium"
  triggerLayout?: "hug" | "fill";     // default "hug"
  orientation?: "horizontal" | "vertical"; // default "horizontal"

  // 렌더 전략
  lazyMount?: boolean;     // Content를 처음 선택될 때까지 마운트 지연 (default false)
  unmountOnExit?: boolean; // Content가 비선택 시 DOM에서 제거 (default false)
}

// 2) Tabs.List — 탭 목록 컨테이너 (tablist.yaml root 슬롯)
interface TabsListProps extends TabsPrimitive.ListProps {
  // role="tablist" 자동 부착
  // paddingX / height 는 Root의 size·triggerLayout으로 제어됨
}

// 3) Tabs.Trigger — 개별 탭 버튼 (tab.yaml 토큰)
interface TabsTriggerProps extends TabsPrimitive.TriggerProps {
  value: string;       // 필수 — Content value와 매핑
  disabled?: boolean;
}

// 4) Tabs.Indicator — 선택 표시 하단 바 (tablist.yaml indicator 슬롯)
interface TabsIndicatorProps extends TabsPrimitive.IndicatorProps {
  // children 없음. CSS 변수 --indicator-left / --indicator-width 로 위치 자동 계산
  // transform 트랜지션: $duration.d4
}

// 5) Tabs.Content — 탭 본문 패널
interface TabsContentProps extends TabsPrimitive.ContentProps {
  value: string;       // 필수 — 해당 Trigger value와 동일하게
}
```

**default 동작 요약**
- `size` 미지정 → `"medium"`.
- `triggerLayout` 미지정 → `"hug"`.
- `defaultValue` 미지정 → 모든 탭 미선택 (Indicator 초기 위치 없음).
- `lazyMount`/`unmountOnExit` 미지정 → 모든 Content를 초기에 마운트, 숨길 때도 DOM 유지.

---

## 합성 규칙 (composition)

- **모든 Trigger·Content는 하나의 Root 아래** — `useTabsContext()`가 없으면 Trigger/Indicator가 동작하지 않는다. Root 없이 단독 사용 금지.
- **Trigger와 Content의 `value`는 쌍으로 일치해야 한다** — `Trigger value="a"`에 대응하는 `Content value="a"`가 없으면 탭을 눌러도 본문이 표시되지 않는다.
- **`Tabs.Indicator`는 `Tabs.List` 자식으로** — List의 `--indicator-left`/`--indicator-width` CSS 변수 범위 안에 있어야 위치 계산이 동작한다.
- **`triggerLayout`과 `size`는 Root에서 일괄 지정** — List나 Trigger에 직접 paddingX/height를 스타일로 덮어쓰면 인디케이터 위치 오차가 생긴다.
- **`lazyMount={true}`는 SSR 서버 렌더 품질과 교환** — 비선택 Content가 초기 HTML에 포함되지 않으므로 SEO가 중요한 본문에는 주의한다.
- **`unmountOnExit={true}`는 상태 보존 불필요 시만** — 폼·스크롤 위치 등 탭 내부 상태를 유지해야 한다면 false(기본)로 둔다.

---

## Carousel / CarouselCamera (React-only 확장)

> YAML 스펙(`tablist.yaml`, `tab.yaml`)에는 Carousel 관련 슬롯이 없습니다. 이 섹션은 React 구현에서만 제공하는 추가 슬롯으로, 기본 Tabs 스펙과 독립적으로 동작합니다.

스와이프 가능한 콘텐츠 전환이 필요할 때 `Tabs.Content` 대신 `Tabs.Carousel` + `Tabs.CarouselCamera` 조합을 사용한다.

```tsx
import { Tabs } from "@seed-design/react";

<Tabs.Root defaultValue="1">
  <Tabs.List>
    <Tabs.Trigger value="1">탭1</Tabs.Trigger>
    <Tabs.Trigger value="2">탭2</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Carousel swipeable>
    <Tabs.CarouselCamera>
      <Tabs.Content value="1">콘텐츠1</Tabs.Content>
      <Tabs.Content value="2">콘텐츠2</Tabs.Content>
    </Tabs.CarouselCamera>
  </Tabs.Carousel>
</Tabs.Root>
```

| Slot | 역할 |
|------|------|
| `Tabs.Carousel` | 드래그·스와이프 이벤트 처리 래퍼. `swipeable`·`loop`·`autoHeight`·`dragThreshold`·`onSettle` prop 수신 |
| `Tabs.CarouselCamera` | 실제 슬라이드 뷰포트. Content들을 가로 배열. `Tabs.Carousel` 직접 자식 |

- `Tabs.Content`는 `Tabs.Carousel` 없이도 사용할 수 있다 (기본 패턴). Carousel은 옵션 레이어다.
- `carouselPreventDrag` 유틸(`import { carouselPreventDrag } from "@seed-design/react"`)을 내부 스크롤 요소에 적용하면 콘텐츠 스크롤과 탭 스와이프 충돌을 방지한다.

---

## 접근성 (constraints, not suggestions)

- **`Tabs.List`는 자동으로 `role="tablist"`**, `aria-orientation="horizontal"`(또는 vertical) 부착. 직접 role을 추가하지 말 것.
- **`Tabs.Trigger`는 자동으로 `role="tab"`**, `aria-selected`·`aria-controls` 자동 부착. 선택된 Trigger만 `tabIndex=0`, 나머지는 `-1`(roving tabindex 패턴).
- **`Tabs.Content`는 자동으로 `role="tabpanel"`**, `aria-labelledby`(해당 Trigger id)·`aria-hidden` 자동 처리.
- **키보드 네비게이션**:
  - `Tab` → tablist 진입 (선택된 탭으로 포커스)
  - `ArrowLeft` / `ArrowRight` → 이전/다음 탭으로 포커스 이동 + 즉시 선택
  - `Home` → 첫 번째 탭으로
  - `End` → 마지막 탭으로
  - `Tab` (List 안에서) → tablist 탈출 → Content 패널로 포커스
- **disabled 탭**: 키보드 화살표 이동 시 건너뛰지 않고 포커스는 받지만 선택되지 않는다 (aria-disabled 패턴). 포인터 클릭도 차단.
- **색만으로 selected 상태 전달 금지** — `data-selected` + Indicator 위치 두 가지 단서를 함께 제공한다. Indicator를 제거하면 시각적 선택 상태가 색 대비에만 의존하게 되므로 접근성 위반.

---

## Anti-patterns

```tsx
❌ // 1. Root 없이 List·Trigger 단독 사용 — useTabsContext 누락으로 런타임 에러
<Tabs.List>
  <Tabs.Trigger value="a">탭A</Tabs.Trigger>
</Tabs.List>

❌ // 2. Trigger value와 Content value 불일치 — 탭 클릭해도 본문 표시 안 됨
<Tabs.Root defaultValue="a">
  <Tabs.List>
    <Tabs.Trigger value="a">탭A</Tabs.Trigger>
    <Tabs.Trigger value="b">탭B</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="tab-a">콘텐츠A</Tabs.Content>  {/* "a" ≠ "tab-a" */}
  <Tabs.Content value="tab-b">콘텐츠B</Tabs.Content>
</Tabs.Root>

❌ // 3. Indicator를 List 바깥에 배치 — CSS 변수 범위 벗어나 위치 계산 깨짐
<Tabs.Root defaultValue="a">
  <Tabs.List>
    <Tabs.Trigger value="a">탭A</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Indicator />   {/* List 바깥 — 위치 오차 발생 */}
  <Tabs.Content value="a">콘텐츠A</Tabs.Content>
</Tabs.Root>

❌ // 4. controlled인데 onValueChange 누락 — 탭 선택 후 UI 갱신 안 됨
<Tabs.Root value={selectedTab}>
  {/* onValueChange 없음 — value가 변경되지 않아 UI freeze */}
  <Tabs.List>
    <Tabs.Trigger value="a">탭A</Tabs.Trigger>
    <Tabs.Trigger value="b">탭B</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
</Tabs.Root>

❌ // 5. triggerLayout · size를 List/Trigger 인라인 스타일로 덮어쓰기
<Tabs.Root defaultValue="a">
  <Tabs.List style={{ padding: "0 16px", height: "48px" }}>  {/* 토큰 무시, Indicator 오차 */}
    <Tabs.Trigger value="a">탭A</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
</Tabs.Root>

❌ // 6. Content를 List 안에 중첩 배치
<Tabs.Root defaultValue="a">
  <Tabs.List>
    <Tabs.Trigger value="a">탭A</Tabs.Trigger>
    <Tabs.Indicator />
    <Tabs.Content value="a">콘텐츠A</Tabs.Content>  {/* role="tablist" 안에 tabpanel 금지 */}
  </Tabs.List>
</Tabs.Root>

✅ // 올바른 기본 패턴
<Tabs.Root defaultValue="a" size="medium" triggerLayout="hug">
  <Tabs.List>
    <Tabs.Trigger value="a">탭A</Tabs.Trigger>
    <Tabs.Trigger value="b">탭B</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="a">콘텐츠A</Tabs.Content>
  <Tabs.Content value="b">콘텐츠B</Tabs.Content>
</Tabs.Root>
```

---

## 예제

### 1. 기본 — 언컨트롤드 (`defaultValue`)

세 개의 탭이 `defaultValue`로 초기 선택된 상태로 렌더된다. Indicator가 선택 탭 하단으로 슬라이드하며 `$duration.d4` 트랜지션이 적용된다.

```tsx
import { Tabs } from "@seed-design/react";

export default function BasicTabs() {
  return (
    <Tabs.Root defaultValue="product">
      <Tabs.List>
        <Tabs.Trigger value="product">상품 정보</Tabs.Trigger>
        <Tabs.Trigger value="review">리뷰</Tabs.Trigger>
        <Tabs.Trigger value="qna">Q&A</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="product">
        <div>상품 상세 내용</div>
      </Tabs.Content>
      <Tabs.Content value="review">
        <div>리뷰 목록</div>
      </Tabs.Content>
      <Tabs.Content value="qna">
        <div>Q&A 목록</div>
      </Tabs.Content>
    </Tabs.Root>
  );
}
```

### 2. `layout="fill"` — 탭이 너비를 균등 분할

탭 수가 적고(2–4개) 고정 너비 레이아웃에서 각 탭이 동일한 너비를 차지한다. `triggerLayout="fill"` 지정 시 List의 paddingX가 0이 되고 Indicator의 insetX에 `$dimension.spacing-x.global-gutter`가 적용된다.

```tsx
import { Tabs } from "@seed-design/react";

export default function FillTabs() {
  return (
    <Tabs.Root defaultValue="buy" triggerLayout="fill">
      <Tabs.List>
        <Tabs.Trigger value="buy">구매</Tabs.Trigger>
        <Tabs.Trigger value="sell">판매</Tabs.Trigger>
        <Tabs.Trigger value="saved">저장</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="buy">
        <div>구매 내역</div>
      </Tabs.Content>
      <Tabs.Content value="sell">
        <div>판매 내역</div>
      </Tabs.Content>
      <Tabs.Content value="saved">
        <div>저장된 항목</div>
      </Tabs.Content>
    </Tabs.Root>
  );
}
```

### 3. Controlled — `value` + `onValueChange`로 외부 상태 연동

URL 파라미터나 외부 버튼과 탭 상태를 동기화할 때 사용한다. `value`와 `onValueChange`를 모두 제공해야 하며, 한쪽만 주면 탭이 갱신되지 않거나 React 경고가 발생한다.

```tsx
import { Tabs } from "@seed-design/react";
import { useState } from "react";

export default function ControlledTabs() {
  const [activeTab, setActiveTab] = useState<string>("all");

  return (
    <div>
      <button onClick={() => setActiveTab("recent")}>최신으로 이동</button>
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="all">전체</Tabs.Trigger>
          <Tabs.Trigger value="recent">최신</Tabs.Trigger>
          <Tabs.Trigger value="popular">인기</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="all">
          <div>전체 목록</div>
        </Tabs.Content>
        <Tabs.Content value="recent">
          <div>최신 목록</div>
        </Tabs.Content>
        <Tabs.Content value="popular">
          <div>인기 목록</div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
```

---

## 관련 문서

- [`./tab.md`](./tab.md) — Rootage `tab.yaml` 스펙. `Tabs.Trigger` 토큰(라벨 색·폰트·크기·상태)을 담당
- [`decision-matrices/which-tab.md`](../decision-matrices/which-tab.md) — Tabs vs SegmentedControl vs NavigationBar 선택 기준
- Rootage 스펙: `packages/rootage/components/tablist.yaml` · `tab.yaml`
