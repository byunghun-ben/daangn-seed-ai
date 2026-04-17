---
name: list-header
upstream_sha: 1f1d21d
---

# ListHeader

**정의** — List 섹션 바로 위에 배치하는 헤더 텍스트 컴포넌트. 기본값은 `<div>` 렌더이며, `as` prop 으로 `"h1"` ~ `"h6"` 을 opt-in 해야 screen reader 에서 heading 으로 인식된다 (upstream `ListHeader.tsx` L13 + L17 에서 default `"div"` 확인). `variant` 로 `mediumWeak` / `boldSolid` 두 가지 weight·color 조합을 제공한다.

**import**
```ts
import { ListHeader } from "@seed-design/react";
```

> **export 경로** — `@seed-design/react` 의 `packages/react/src/components/List/index.ts` 에서 직접 named export 한다. 별도 sub-path import 불필요.

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| List 섹션(설정, 메뉴 등)을 구분하는 짧은 레이블 | **ListHeader** (이 컴포넌트) |
| 본문 문단 안에서 타이포그래피 계층을 표현 | [`./typography.md`](./typography.md) 의 `Typography.Text` / `Typography.Heading` |
| HTML 의미만 필요하고 디자인 토큰은 불필요한 경우 | 원시 `<h2>` 등 native heading |
| ListHeader 와 동일한 행에 액션을 같이 노출 | ListHeader children 에 [`./action-button.md`](./action-button.md) 합성 |

**ListHeader vs Typography Text vs 그냥 h2**

- **ListHeader** — `paddingX: $dimension.spacing-x.global-gutter` 를 포함한 목록 전용 간격 토큰이 내장되어 있다. List 바로 위에서 수직 정렬과 여백이 자동으로 맞춰진다.
- **Typography.Text** — 범용 텍스트 컴포넌트. List 섹션 헤더처럼 `paddingX/Y` 가 미리 설정된 공간이 필요하면 수동 간격 지정이 필요하다.
- **그냥 h2** — 디자인 토큰이 전혀 적용되지 않는다. 시맨틱은 올바르지만 Seed 디자인 시스템의 간격·폰트 규격을 따르지 못한다.

---

## Anatomy

단일 slot `root`. `as` prop 이 실제 렌더 엘리먼트를 결정하며, children 이 header 레이블 텍스트 또는 ActionButton 합성 콘텐츠가 된다.

```
┌─ ListHeader  <as> ─────────────────────────────────────────┐
│  [children: 텍스트 | ActionButton 합성]                     │
└─────────────────────────────────────────────────────────────┘
```

| Slot | 필수 | 실제 엘리먼트 | 역할 |
|------|------|--------------|------|
| `root` | ✅ | `as` prop 값 (default `"div"`) | 컨테이너. padding·font 토큰 적용. `as` 로 `"div"` \| `"h1"` ~ `"h6"` 선택 |

**`as` prop** — upstream `ListHeader.tsx` L13 타입 정의:

```ts
as?: "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
// L17 default: as: Comp = "div"
```

default `"div"` 는 semantic 중립이다. 페이지 계층에 맞춰 `as="h2"` 또는 `as="h3"` 를 명시적으로 지정해야 한다.

---

## Variants

`variant` prop 으로 weight·color 조합을 선택한다. 두 가지 외의 조합은 없다.

| variant | fontWeight 토큰 | color 토큰 | 사용 맥락 |
|---------|----------------|-----------|-----------|
| `mediumWeak` | `$font-weight.medium` | `$color.fg.neutral-subtle` | 대부분의 설정·목록 섹션 헤더. 조용한 레이블 |
| `boldSolid` | `$font-weight.bold` | `$color.fg.neutral` | 섹션 구분이 강조되어야 할 때. 시각적 우선순위가 높은 레이블 |

---

## Token 매핑

`list-header.yaml` `definitions.base` + variant 별 토큰. 전체 원본: `packages/rootage/components/list-header.yaml`.

### base (공통)

| Slot | 속성 | 토큰 |
|------|------|------|
| `root` | `paddingX` | `$dimension.spacing-x.global-gutter` |
| `root` | `paddingY` | `$dimension.x2` |
| `root` | `gap` | `$dimension.x2_5` |
| `root` | `fontSize` | `$font-size.t4` |
| `root` | `lineHeight` | `$line-height.t4` |

### variant=mediumWeak

| Slot | 속성 | 토큰 |
|------|------|------|
| `root` | `fontWeight` | `$font-weight.medium` |
| `root` | `color` | `$color.fg.neutral-subtle` |

### variant=boldSolid

| Slot | 속성 | 토큰 |
|------|------|------|
| `root` | `fontWeight` | `$font-weight.bold` |
| `root` | `color` | `$color.fg.neutral` |

---

## Props

### `ListHeaderProps`

`PrimitiveProps` + `React.HTMLAttributes<HTMLDivElement>` + `ListHeaderVariantProps` 상속.

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `as` | `"div" \| "h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"` | `"div"` | 렌더 엘리먼트. 기본 `"div"` 는 semantic 중립 — screen reader 에서 heading 으로 인식되지 않는다. 페이지 계층에 맞춰 반드시 opt-in 필요 |
| `variant` | `"mediumWeak" \| "boldSolid"` | — | weight·color 조합 선택 |
| `children` | `React.ReactNode` | — | 텍스트 레이블 또는 ActionButton 합성 콘텐츠 |
| `className` | `string` | — | 추가 CSS 클래스 (내부 className 과 병합됨) |
| `ref` | `React.Ref<HTMLDivElement>` | — | `forwardRef` 로 전달 |

---

## 합성 규칙

- **List 바로 위에 배치** — `ListHeader` 는 `List.Root`(`<ul>`) 바로 앞에 위치해야 한다. 두 컴포넌트 사이에 다른 요소가 끼어들면 시각·의미 관계가 깨진다.
- **VStack 으로 감쌀 때 gap 주의** — `ListHeader` 와 `List.Root` 를 `VStack` 으로 감쌀 경우 VStack 의 `gap` 이 ListHeader 의 하단 `paddingY`(`$dimension.x2`) 와 중첩되어 간격이 의도보다 커질 수 있다. `VStack gap="0"` 또는 외부 gap 없이 배치하는 것을 권장한다.
- **children 에 ActionButton 가능** — 섹션 헤더 오른쪽에 "더보기" 또는 "도움말" 등의 ActionButton 을 children 으로 직접 넣을 수 있다. 이때 `ListHeader` 의 `gap` 토큰(`$dimension.x2_5`)이 텍스트와 버튼 사이 간격을 제공한다. 자세한 패턴은 [예제 (c)](#c-actionbutton-합성) 참조.
- **관련 컴포넌트** — List 아이템 구성은 [`./list-item.md`](./list-item.md) 참조.

---

## 접근성

default `as="div"` 는 semantic 중립이므로, 실제 사용 시 페이지 계층에 맞춰 `as="h2"` 또는 `as="h3"` 를 **반드시 opt-in** 해야 screen reader 에서 heading 으로 인식된다. 단일 페이지 h1 유일성 유지, heading level skip 금지.

구체적인 지침:

- **`as` 생략 금지** — `as` prop 을 지정하지 않으면 default `"div"` 로 렌더된다. `<div>` 는 heading role 이 없으므로 VoiceOver/TalkBack 에서 섹션 구분 heading 으로 읽히지 않는다. 반드시 `as="h2"` 또는 상위 계층에 맞는 값을 지정한다.
- **h1 유일성** — 페이지 내 `<h1>` 은 하나여야 한다. ListHeader 에 `as="h1"` 을 쓰지 않는다. 보통 `as="h2"` 또는 `as="h3"` 을 사용한다.
- **heading level skip 금지** — `h2` 다음 `h4` 처럼 레벨을 건너뛰면 스크린 리더 사용자가 문서 구조를 파악하기 어렵다. 페이지 계층에 따라 순차적으로 지정한다.
- **aria-label** — ListHeader 자체에 `aria-label` 이 필요한 경우는 드물다. children 텍스트가 명확한 레이블이 된다.

---

## Anti-patterns

**1. `<h2>` 를 children 으로 중첩**

```tsx
// BAD — ListHeader 가 <div> 로 렌더될 때 <div><h2>...</h2></div> 가 되어
//        heading 이 중첩되고 시각적 스타일도 토큰과 충돌한다
<ListHeader variant="mediumWeak">
  <h2>계정 설정</h2>
</ListHeader>

// BAD — as="h2" 일 때는 <h2><h2>...</h2></h2> 로 invalid HTML
<ListHeader as="h2" variant="mediumWeak">
  <h2>계정 설정</h2>
</ListHeader>

// GOOD — as prop 으로 semantic 엘리먼트를 지정하고 children 은 텍스트만
<ListHeader as="h2" variant="mediumWeak">
  계정 설정
</ListHeader>
```

**2. variant 생략 + fontWeight 를 style 로 override**

```tsx
// BAD — variant 를 지정하지 않으면 color 토큰도 적용되지 않는다.
//        style 로 fontWeight 를 덮으면 디자인 토큰 시스템에서 이탈한다
<ListHeader as="h2" style={{ fontWeight: "bold" }}>
  계정 설정
</ListHeader>

// GOOD — variant 로 weight·color 조합을 선택
<ListHeader as="h2" variant="boldSolid">
  계정 설정
</ListHeader>
```

**3. `as` prop 생략으로 default `<div>` 방치 — screen reader 미인식**

```tsx
// BAD — as 미지정 → <div> 렌더 → heading role 없음 → 스크린 리더가 섹션 헤더로 인식 안 함
<ListHeader variant="mediumWeak">
  계정 설정
</ListHeader>

// GOOD — 페이지 계층에 맞춰 as 명시 (upstream ListHeader.tsx L13 + L17 에서 default "div" 확인)
<ListHeader as="h2" variant="mediumWeak">
  계정 설정
</ListHeader>
```

---

## 예제

### (a) 기본 — `variant="mediumWeak"` + `as="h2"`

```tsx
import { List, ListHeader } from "@seed-design/react";

export function SettingsSection() {
  return (
    <div>
      <ListHeader as="h2" variant="mediumWeak">
        계정 설정
      </ListHeader>
      <List.Root>
        <List.Item asChild>
          <button type="button">
            <List.Content>
              <List.Title>내 계정</List.Title>
              <List.Detail>이메일과 연락처, 본인 인증 관리</List.Detail>
            </List.Content>
          </button>
        </List.Item>
        <List.Item asChild>
          <button type="button">
            <List.Content>
              <List.Title>보안 · 인증 관리</List.Title>
              <List.Detail>비밀번호, 생체 인증 사용을 관리해요</List.Detail>
            </List.Content>
          </button>
        </List.Item>
      </List.Root>
    </div>
  );
}
```

### (b) `variant="boldSolid"` + `as="h3"`

```tsx
import { List, ListHeader } from "@seed-design/react";

export function SubSection() {
  return (
    <div>
      <ListHeader as="h3" variant="boldSolid">
        알림 설정
      </ListHeader>
      <List.Root>
        <List.Item asChild>
          <button type="button">
            <List.Content>
              <List.Title>푸시 알림</List.Title>
              <List.Detail>앱 푸시 알림 수신 여부를 설정합니다</List.Detail>
            </List.Content>
          </button>
        </List.Item>
        <List.Item asChild>
          <button type="button">
            <List.Content>
              <List.Title>야간 방해 금지</List.Title>
              <List.Detail>밤 10시 ~ 오전 7시</List.Detail>
            </List.Content>
          </button>
        </List.Item>
      </List.Root>
    </div>
  );
}
```

### (c) ActionButton 합성

ListHeader children 에 [`./action-button.md`](./action-button.md) 을 직접 배치하는 패턴. `gap` 토큰(`$dimension.x2_5`)이 텍스트와 버튼 사이 간격을 제공한다 (upstream `docs/examples/react/list/header.tsx` L55–L69 패턴).

```tsx
import {
  List,
  ListHeader,
  ActionButton,
  PrefixIcon,
  IconQuestionmarkCircleFill,
} from "@seed-design/react";

export function SectionWithHelp() {
  return (
    <div>
      <ListHeader as="h2" variant="mediumWeak">
        도움이 필요하신가요?
        <ActionButton
          variant="ghost"
          size="small"
          bleedX="asPadding"
          bleedY="asPadding"
        >
          <PrefixIcon svg={<IconQuestionmarkCircleFill />} />
          도움말
        </ActionButton>
      </ListHeader>
      <List.Root>
        <List.Item asChild>
          <button type="button">
            <List.Content>
              <List.Title>자주 묻는 질문</List.Title>
              <List.Detail>궁금한 점을 빠르게 찾아보세요</List.Detail>
            </List.Content>
          </button>
        </List.Item>
        <List.Item asChild>
          <button type="button">
            <List.Content>
              <List.Title>고객센터 문의</List.Title>
              <List.Detail>1:1 채팅으로 문의할 수 있습니다</List.Detail>
            </List.Content>
          </button>
        </List.Item>
      </List.Root>
    </div>
  );
}
```
