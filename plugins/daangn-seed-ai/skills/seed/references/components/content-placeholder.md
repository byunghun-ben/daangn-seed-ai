# ContentPlaceholder

**정의** — "영속적 빈 상태(empty state)"를 시각적으로 표현하는 컴포넌트. 리스트에 데이터가 없거나, 검색 결과가 0건이거나, 접근 권한이 없어 표시할 콘텐츠가 없을 때 카테고리별 대표 SVG와 함께 상황을 전달한다.

**import**
```ts
import { ContentPlaceholder } from "@seed-design/react";
// namespace 사용: <ContentPlaceholder.Root>, <ContentPlaceholder.Asset>
```

> **`Skeleton` 과 혼동 금지** — `Skeleton` 은 "데이터 로드 중(일시적)" 의 임시 골격이고, `ContentPlaceholder` 는 "데이터가 없음(영속적)" 의 종착 상태다. 둘을 같은 화면에 겹쳐 쓰지 말 것. 자세한 비교는 [`./skeleton.md`](./skeleton.md) 참조.

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 컴포넌트 |
|------|---------|
| 데이터 로드 중 (일시적, 네트워크 응답 대기) | `Skeleton` ([`./skeleton.md`](./skeleton.md)) |
| 데이터 없음 — 빈 리스트·검색 결과 0건·접근 제한 (영속적) | **ContentPlaceholder** (이 컴포넌트) |
| 일시적 오류 후 재시도 유도 (네트워크 실패) | `Callout` + 재시도 버튼 |
| 축하·보상 같은 의도적 "완료" 상태 | 일러스트 + `Text` (ContentPlaceholder 아님) |
| 이미지 로드 실패 시 프로필 대체 | `Avatar.Fallback` + `IdentityPlaceholder` |

- **영속적 = 사용자가 액션을 취하기 전까지 계속 유지되는 상태**. 예: "저장한 글이 없어요", "이 카테고리에 등록된 매물이 없어요".
- **일시적 = 몇백 ms ~ 몇 초 후 다른 상태로 전환되는 중간 상태**. 로드 중 → Skeleton.

---

## Anatomy

두 개의 슬롯으로 구성된다. `Root` 가 레이아웃·sizing context 를 제공하고, `Asset` 이 카테고리별 일러스트(SVG)를 담는다.

| Slot | 필수 | 역할 |
|------|------|------|
| `ContentPlaceholder.Root` | ✅ | 외부 컨테이너 (`<div>`). `type` variant 를 받아 자식 `Asset` 에 context 로 전달. `heightFraction` 관리 |
| `ContentPlaceholder.Asset` | ✅ | 일러스트 영역 (`<Slot>`). `children` 비우면 `type` 의 preset SVG 자동 주입. `children` 있으면 그대로 렌더 (BYO SVG) |

- `Asset` 은 `@radix-ui/react-slot` 의 `Slot` 기반 → BYO 자식 element 루트에 className 이 병합된다.
- `Root` 의 `type` 이 Context 로 `Asset` 에 전달되어 preset map 을 lookup 한다. `Root` 없이 `Asset` 만 쓰면 **fallback 으로 `default` type preset 이 렌더된다** (`contentPlaceholderAssetPresetMap[parentProps?.type ?? "default"]`). 즉 에러는 나지 않지만 `default` 이외의 카테고리 일러스트가 필요하면 **반드시 `Root type="..."` 안에 중첩** 해야 한다.

---

## Variants

### `type` (12개)

YAML 에 정의된 12 개 category 고정. 새 type 추가 금지 — 필요하면 BYO SVG 로 `Asset` 에 직접 주입한다.

| 값 | 대표 카테고리 | 사용 예 (empty state) |
|-----|-------------|---------------------|
| `default` | 범용 | "저장한 항목이 없어요" 같은 **일반 empty state**. 카테고리 맥락이 없을 때 |
| `buySell` | 중고거래 | "중고거래 리스트가 비었어요", "관심 목록에 저장한 물건이 없어요" |
| `car` | 중고차 | "등록된 중고차가 없어요", "이 지역의 차 매물이 없어요" |
| `commerce` | 당근마켓(쇼핑) | "장바구니가 비었어요", "상품 리스트가 비었어요" |
| `coupon` | 쿠폰·혜택 | "발급받은 쿠폰이 없어요", "사용 가능한 쿠폰이 없어요" |
| `food` | 동네맛집·음식 | "이 지역의 음식점이 없어요", "저장한 맛집이 없어요" |
| `group` | 모임·커뮤니티 | "참여 중인 모임이 없어요", "근처 모임이 없어요" |
| `image` | 이미지·사진 | "업로드한 사진이 없어요", "이미지 검색 결과가 없어요" |
| `jobs` | 알바·구인구직 | "등록된 알바가 없어요", "지원한 공고가 없어요" |
| `business` | 비즈프로필·가게 | "등록된 가게가 없어요", "단골 가게가 없어요" |
| `post` | 동네생활·게시글 | "작성한 게시글이 없어요", "댓글을 단 글이 없어요" |
| `realty` | 부동산 | "이 지역의 매물이 없어요", "저장한 매물이 없어요" |

> **type 별 slot 값은 모두 `{}`** — YAML `definitions` 에서 `type=buySell` 부터 `type=realty` 까지 전부 빈 객체다. 즉 **CSS variant 는 base 와 동일**하고, 타입 간 차이는 **preset SVG 뿐** 이다. 레이아웃·색·치수는 12 종이 동일하다.

---

## Preset SVG 시스템

**위치**: `packages/react/src/components/ContentPlaceholder/presets.tsx` → `contentPlaceholderAssetPresetMap`.

렌더 로직: `Asset.children` 있으면 그대로, 없으면 `parent.type` 을 key 로 preset map 에서 SVG lookup 후 Slot 에 주입.

- 모든 preset SVG 는 `viewBox="0 0 64 64"` 정사각 + `fill="none"` + path fill 상속 → recipe 의 `asset.color` 토큰이 적용된다.
- 모든 preset 에 `aria-hidden="true"` 고정 — Asset 은 장식용, 의미 전달은 함께 쓰는 텍스트가 담당.
- **BYO (Bring Your Own) SVG**: `Asset` 자식에 SVG 를 넣으면 preset 대신 사용. Slot 규약상 루트가 `<svg>` 여야 className 병합이 올바르다.

---

## Base 토큰

YAML `definitions.base.enabled` 원문 그대로:

```
root:
  color: $color.palette.gray-200          # 컨테이너 기본 색
asset:
  minWidth:       $dimension.x4           # 하한 (토큰)
  maxWidth:       160px                   # 상한 (YAML 원문 리터럴 — $dimension 토큰으로 치환 없이 그대로 사용)
  heightFraction: 0.5                     # root 높이의 50% 를 asset 이 차지
  color:          $color.palette.gray-400 # SVG fill
```

**해석 규칙**
- `minWidth` 는 `$dimension.x4` 토큰, `maxWidth` 는 리터럴 `160px` — upstream YAML 이 혼합 형태로 선언한 그대로 보존한다 (해당 값을 표현하는 rootage `dimension` 토큰이 없으므로 리터럴을 그대로 둔 것).
- `heightFraction: 0.5` 는 분수(비율) — recipe 가 `height: calc(parent * 0.5)` 로 전개. px 로 덮어쓰지 말 것.
- `asset.color`(gray-400) > `root.color`(gray-200) 로 대비 확보.

---

## States

ContentPlaceholder 는 인터랙티브 컴포넌트가 아니다. pressed/disabled/focus 상태가 없다.

| State | 트리거 | 시각 변화 |
|-------|-------|----------|
| `enabled` | 기본 (유일한 상태) | `type` preset (또는 BYO SVG) 렌더 |

동반되는 텍스트(안내 문구)·액션 버튼(예: "글쓰기") 은 ContentPlaceholder 외부에 배치한다 — `Root` 자체는 일러스트 슬롯만 책임진다.

---

## Props

```ts
// Root ─ type variant · 전체 컨테이너
interface ContentPlaceholderRootProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "default" | "buySell" | "car" | "commerce" | "coupon" | "food"
       | "group" | "image" | "jobs" | "business" | "post" | "realty"; // default: "default"
  asChild?: boolean;
}

// Asset ─ 일러스트 슬롯 (children 없으면 preset SVG 자동 주입)
interface ContentPlaceholderAssetProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}
```

`type` 미지정 → `"default"`(범용 일러스트). `Asset.children` 미지정 → preset 자동 주입. 있음 → BYO SVG 그대로 (루트 `<svg>`).

---

## 합성 규칙 (composition)

- **`Root` 없이 `Asset` 단독 사용은 `default` preset 으로만 유효** — parent context 가 없으면 `default` type 의 preset 이 fallback 으로 렌더된다. `buySell`·`car` 등 카테고리별 일러스트를 의도한다면 반드시 `Root type="..."` 안에 중첩.
- **문구·CTA 버튼과 함께 배치** — ContentPlaceholder 자체는 일러스트만 담당. 전체 empty state 는 보통 `ContentPlaceholder + <Text>(안내) + <ActionButton>(유도)` 조합.
- **한 화면에 2개 이상 금지** — 페이지 전체의 empty state 를 의미하므로 여러 개 동시 노출 시 의도 흐려짐.
- **Skeleton 에서 직접 전환** — 로드 종료 시점에 데이터가 비었으면 Skeleton → ContentPlaceholder 로 교체. 같은 영역에 둘을 겹쳐 놓지 말 것.
- **BYO SVG 는 `viewBox` 64×64 권장** — preset 과 정렬을 맞추려면 `viewBox="0 0 64 64"` + `fill="none"` 구조를 따르는 것이 안전.

---

## 접근성

- **preset SVG 는 모두 `aria-hidden="true"`** → 스크린 리더가 읽지 않는다. 상황을 전달하는 텍스트(예: "저장한 글이 없어요")를 반드시 동반한다.
- **BYO SVG 에도 `aria-hidden="true"` 부착**. 일러스트가 의미를 가지면 안 되고, 의미는 주변 텍스트로 전달한다.
- **안내 문구는 `<Text>` 등 semantic 요소** 로 작성한다. 일러스트 alt 로 문맥을 대체하지 말 것.
- **색만으로 상태 구분 금지** — `type=critical` 같은 tone variant 는 존재하지 않지만, 컨테이너 색을 커스터마이징할 때도 텍스트가 상황을 설명해야 한다.
- 액션 유도가 있다면 `<ActionButton>` 을 ContentPlaceholder 하단에 두고 키보드 포커스가 자연스럽게 걸리도록 DOM 순서를 유지.

---

## Anti-patterns

```tsx
❌ <ContentPlaceholder.Asset />
   {/* Root 없이 Asset 단독 — 에러는 없지만 parentProps?.type 이 undefined 이므로 강제 "default" fallback.
       카테고리별 일러스트(`buySell`, `car` 등) 의도라면 반드시 Root type="..." 로 감싼다. */}

❌ <ContentPlaceholder.Root type="buySell"><ContentPlaceholder.Asset /></ContentPlaceholder.Root>
   {/* 일러스트만 덩그러니 — 빈 상태인지 로딩인지 구분 불가. 안내 문구·CTA 동반 필수 */}

❌ {isLoading ? <Skeleton /> : <ContentPlaceholder.Root type="post" />}
   {/* 로드 실패와 "데이터 없음" 을 같은 분기로 — 실패는 Callout + 재시도 */}

❌ <ContentPlaceholder.Asset>
     <div><svg>...</svg></div>
   </ContentPlaceholder.Asset>
   {/* BYO 루트가 <div> — Slot className 이 div 에 붙어 sizing 깨짐. 루트를 <svg> 로 */}

❌ <ContentPlaceholder.Root type="newCategory">...</ContentPlaceholder.Root>
   {/* YAML 에 없는 type — TS 에러. 새 맥락은 BYO SVG 로 표현 */}

✅ <ContentPlaceholder.Root type="post"><ContentPlaceholder.Asset /></ContentPlaceholder.Root>
   <Text>작성한 게시글이 없어요</Text>
   <ActionButton variant="brandSolid" onClick={writePost}>글쓰기</ActionButton>
```

---

## 예제 (minimum usage)

### 1. preset 사용 — 카테고리에 해당하는 일러스트 자동 주입

```tsx
import { ContentPlaceholder } from "@seed-design/react";

<ContentPlaceholder.Root type="buySell">
  <ContentPlaceholder.Asset />
</ContentPlaceholder.Root>
```

`type="buySell"` 이 `Asset` 으로 context 전달 → `contentPlaceholderAssetPresetMap["buySell"]` 의 쇼핑백 SVG 자동 렌더. 안내 문구·CTA 는 외부에서 `Text` · `ActionButton` 으로 조합한다.

### 2. 전체 empty state — ContentPlaceholder + 안내 + CTA

```tsx
import { ContentPlaceholder, Text, ActionButton } from "@seed-design/react";

<div role="status">
  <ContentPlaceholder.Root type="post">
    <ContentPlaceholder.Asset />
  </ContentPlaceholder.Root>
  <Text>작성한 게시글이 없어요</Text>
  <ActionButton variant="brandSolid" onClick={() => router.push("/write")}>
    첫 글 쓰기
  </ActionButton>
</div>
```

최상위 wrapper 에 `role="status"` 를 부여해 스크린 리더가 "빈 상태" 임을 인지하도록 한다 (`aria-live="polite"` 기본값).

### 3. BYO SVG — preset 에 없는 맥락 (예: 이벤트 전용)

```tsx
import { ContentPlaceholder } from "@seed-design/react";

<ContentPlaceholder.Root>
  <ContentPlaceholder.Asset>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="..." />
    </svg>
  </ContentPlaceholder.Asset>
</ContentPlaceholder.Root>
```

- BYO SVG 의 루트는 반드시 `<svg>` (Slot 규약 — className 이 루트 element 에 병합).
- `viewBox="0 0 64 64"` 와 `aria-hidden="true"` 를 유지해 preset 과 동일한 렌더 결과를 얻는다.
- `fill="none"` + path 에 fill 상속 구조를 지키면 recipe 의 `asset.color` 토큰이 적용된다.

### 4. 검색 결과 없음 (type=image)

```tsx
<div role="status">
  <ContentPlaceholder.Root type="image">
    <ContentPlaceholder.Asset />
  </ContentPlaceholder.Root>
  <Text>"{query}" 에 대한 검색 결과가 없어요</Text>
  <Text variant="label3">검색어를 다시 확인해 주세요</Text>
</div>
```

CTA 가 없는 empty state — 사용자가 입력을 수정하는 것이 next action 이므로 버튼은 생략한다.
