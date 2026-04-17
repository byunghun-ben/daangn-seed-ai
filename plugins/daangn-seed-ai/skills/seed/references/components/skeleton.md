# Skeleton

**정의** — 데이터를 불러오는 동안 실제 콘텐츠 자리를 점유하는 shimmer 애니메이션 플레이스홀더. width/height prop으로 크기를 명시하여 레이아웃 이동(CLS) 없이 로딩 중 UI를 유지한다.

**import**
```ts
import { Skeleton } from "@seed-design/react";
```

> **Note** — Skeleton은 namespace API가 아닌 flat export. sub-component 없이 `<Skeleton ... />` 하나로 사용.

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 데이터 로드 중 — shape가 있는 UI 자리를 미리 점유 | **Skeleton** |
| 작업 진행 중 — shape 없이 스피너만 보여줄 때 | `ProgressCircle` ([./progress-circle.md](./progress-circle.md)) |
| 데이터 없음 — 로딩 완료 후 영속적인 empty state | `ContentPlaceholder` ([./content-placeholder.md](./content-placeholder.md)) |

---

## Anatomy

| Slot | 필수 | 역할 |
|------|------|------|
| `root` | ✅ | 콘텐츠 영역을 점유하는 배경 컨테이너. `color`·`cornerRadius` 토큰 적용. |
| `shimmer` | ✅ | root 위에 오버레이되는 CSS-only 애니메이션 레이어. 별도 DOM 요소 없이 pseudo-element로 구현되므로 **직접 조작 불가**. |

> `shimmer` 슬롯은 CSS pseudo-element(`::after`)로 자동 렌더링된다. props로 제어할 수 없으며 tone에 따라 gradient가 자동 결정된다.

---

## Variants

### `tone`

| 값 | 의미 | shimmer gradient | 대표 사용 |
|-----|------|-----------------|-----------|
| `neutral` | 일반 데이터 로딩 | `$gradient.shimmer-neutral` | 텍스트·카드·리스트 로딩 |
| `magic` | AI 기능 활성화 중 | `$gradient.shimmer-magic` | AI 생성 콘텐츠 로딩 |

- **tone=neutral**: root 배경은 `$color.palette.gray-200` 기반.
- **tone=magic**: root 배경은 `$color.bg.magic-weak`, shimmer는 `$gradient.shimmer-magic` 사용.

### `radius`

값은 모두 **문자열**이다. 다른 컴포넌트의 boolean `full`과 다르게 `"full"` 문자열을 전달한다.

| 값 | cornerRadius 토큰 | 대표 사용 |
|-----|-----------------|-----------|
| `"0"` | `0px` (기본값) | 전체 폭 배너·이미지 플레이스홀더 |
| `"8"` | `8px` | 텍스트 줄·태그 자리 |
| `"16"` | `16px` | 카드·썸네일 자리 |
| `"full"` | `$radius.full` | Avatar·원형·pill 자리 |

---

## Motion / Base 토큰

shimmer 애니메이션은 모든 tone에 공통으로 적용된다.

| 토큰 | 값 |
|------|----|
| `shimmer.duration` | `1.5s` |
| `shimmer.timingFunction` | `$timing-function.easing` |

---

## Props (핵심만)

```ts
interface SkeletonProps {
  tone?: "neutral" | "magic";
  radius?: "0" | "8" | "16" | "full";
  width?: StyleProps["width"];   // 명시하지 않으면 부모 크기 상속 또는 0
  height?: StyleProps["height"]; // 명시하지 않으면 부모 크기 상속 또는 0
  // + HTMLAttributes<HTMLDivElement> (className, style, aria-* 등)
}
```

`width`와 `height`는 **반드시 명시**한다. 생략하면 콘텐츠가 없어 높이가 0이 되거나 부모 크기에 의존하게 되어 레이아웃이 깨진다.

---

## States

Skeleton 은 **인터랙티브 상태가 없다**. pressed/hover/focus/disabled 같은 상호작용 변주를 갖지 않으며, 유일한 상태는 shimmer 애니메이션 한 가지다 — `root` 위에 `::after` pseudo-element 로 `1.5s` 주기의 shimmer gradient 가 계속 반복된다.

| State | 트리거 | 시각 변화 |
|-------|--------|-----------|
| `enabled` | 기본 (유일) | tone 별 배경 + shimmer 애니메이션 지속 |

Skeleton 을 hover 하거나 click 해도 시각 변화는 일어나지 않는다. 인터랙션이 필요한 플레이스홀더라면 Skeleton 이 아닌 실제 컴포넌트를 써야 한다.

---

## 합성 규칙

- **크기는 실제 콘텐츠와 동일하게** — Skeleton이 사라질 때 레이아웃 이동이 없도록 실제 렌더링될 요소의 width·height를 그대로 사용.
- **radius는 실제 컴포넌트의 corner와 일치** — 카드(16), 텍스트(8), 아바타(full), 배너(0)처럼 실제 UI의 형태를 따른다.
- **tone=magic은 AI 전용** — 일반 데이터 로딩에 magic을 쓰면 AI 기능처럼 오인될 수 있다.
- **ContentPlaceholder와 대체 관계** — 로딩이 끝나고 데이터가 없으면 Skeleton을 ContentPlaceholder로 교체한다. Skeleton은 로딩 중에만 노출.

---

## 접근성

- Skeleton은 시각적 플레이스홀더이므로 `aria-hidden="true"` 처리하거나, 로딩 중임을 알리는 부모 컨테이너에 `aria-busy="true"`를 부여한다.
- 스크린리더 사용자에게는 Skeleton 개수가 아니라 "로딩 중" 상태 하나만 전달되어야 한다.

```tsx
// 권장: 컨테이너에 aria-busy, Skeleton은 aria-hidden
<section aria-busy={isLoading} aria-label="게시글 목록">
  {isLoading ? (
    <>
      <Skeleton aria-hidden="true" tone="neutral" radius="8" width="100%" height="20px" />
      <Skeleton aria-hidden="true" tone="neutral" radius="8" width="80%" height="20px" />
    </>
  ) : (
    <PostList posts={posts} />
  )}
</section>
```

---

## Anti-patterns

```tsx
❌ <Skeleton />
   {/* width/height 없음 — 높이 0이 되어 화면에 보이지 않음 */}

❌ <Skeleton tone="neutral" radius="full" width="40px" height="40px" />
   {/* radius="full"이 아닌 radius={true} 같은 boolean 전달 — 문자열 "full"만 유효 */}

❌ <Skeleton tone="magic" radius="16" width="200px" height="200px" />
   {/* AI 기능과 무관한 일반 카드 이미지 로딩 — tone="neutral" 사용 */}

❌ <div style={{ background: "#E0E0E0", borderRadius: 8, width: 100, height: 20 }} />
   {/* 자체 구현 — shimmer 애니메이션 없음, 다크모드·테마 토큰 미적용 */}

✅ <Skeleton tone="neutral" radius="8" width="100%" height="20px" />

✅ <Skeleton tone="magic" radius="16" width="100%" height="80px" />
```

---

## 예제

### 텍스트 한 줄 플레이스홀더

```tsx
import { Skeleton } from "@seed-design/react";

// t4 폰트 라인높이에 맞춘 텍스트 한 줄 자리
<Skeleton tone="neutral" radius="8" width="100%" height="20px" />
```

### 카드 이미지 플레이스홀더 (정사각형)

```tsx
import { Skeleton } from "@seed-design/react";

// 200×200 썸네일 자리, 카드/썸네일용 radius 16
<Skeleton tone="neutral" radius="16" width="200px" height="200px" />
```

### 아바타 원형 플레이스홀더

```tsx
import { Skeleton } from "@seed-design/react";

// 40×40 원형 Avatar 자리, pill/원형용 radius full
<Skeleton tone="neutral" radius="full" width="40px" height="40px" />
```

### 리스트 아이템 (아바타 + 텍스트 2줄)

```tsx
import { Skeleton } from "@seed-design/react";

<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
  <Skeleton tone="neutral" radius="full" width="40px" height="40px" />
  <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
    <Skeleton tone="neutral" radius="8" width="60%" height="16px" />
    <Skeleton tone="neutral" radius="8" width="40%" height="14px" />
  </div>
</div>
```

### AI 기능 로딩 (tone=magic)

```tsx
import { Skeleton } from "@seed-design/react";

// AI 생성 결과를 불러오는 동안 — shimmer-magic gradient 자동 적용
<Skeleton tone="magic" radius="16" width="100%" height="120px" />
```
