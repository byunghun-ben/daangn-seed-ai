# PageBanner

**정의** — 페이지의 **최상단에 고정**되어 전역 상태·공지·프로모션을 전달하는 알림 띠. 스크롤되지 않는 상단 영역에 붙어, 현재 페이지 전체에 영향을 주는 메시지를 표시한다.

**import**
```ts
import { PageBanner } from "@seed-design/react";
// namespace: <PageBanner.Root>, <PageBanner.Body>, <PageBanner.Content>,
//            <PageBanner.Title>, <PageBanner.Description>, <PageBanner.Button>,
//            <PageBanner.CloseButton>
```

> **Callout · InlineBanner 와 구분** — 섹션 내부 안내는 `Callout`, 구형 인라인 배너는 [`./inline-banner.md`](./inline-banner.md)(deprecated, 마이그레이션 대상)를 참고. PageBanner 는 **페이지당 최상단 1개** 고정 영역을 차지한다.

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 페이지 최상단에 고정되는 전역 공지·프로모션·경고 | **PageBanner** (이 컴포넌트) |
| 섹션 내부 · 콘텐츠 흐름 중간 알림 | `Callout` ([`./callout.md`](./callout.md)) |
| 일시적 액션 결과 피드백 (저장됨, 복사됨) | `Snackbar` ([`./snackbar.md`](./snackbar.md)) |
| 폼 필드 아래 에러·도움말 | Field 의 `description` / `errorMessage` |
| 구형 인라인 배너 (deprecated) | `InlineBanner` → **PageBanner 로 마이그레이션** ([`./inline-banner.md`](./inline-banner.md)) |

관련 결정 매트릭스: [`decision-matrices/which-overlay.md`](../decision-matrices/which-overlay.md)

---

## Anatomy

React namespace 기준으로 **7 slot**. `Root` 가 variant·tone 컨텍스트를 제공하고, `Body` 는 레이아웃 wrapper, `Content` 는 텍스트 블록을 묶고, `CloseButton` 은 우측 닫기 영역이다.

| Slot | 필수 | 역할 |
|------|------|------|
| `PageBanner.Root` | ✅ | 외곽 컨테이너. `variant` · `tone` 결정, 배경 색·그라디언트, min-height 보장 |
| `PageBanner.Body` | ✅ | 가로 레이아웃 wrapper. prefix 아이콘 · `Content` · `Button` 을 한 줄에 배치 (React 전용 layout slot) |
| `PageBanner.Content` | ✅ | `Title` / `Description` 을 세로로 묶는 텍스트 블록 (gap 관리) |
| `PageBanner.Title` | ⚪ | 굵은 제목 1줄. `bold` 가중치, `t4` 크기 |
| `PageBanner.Description` | ⚪ | 보조 설명 1줄. `medium` 가중치, `t4` 크기 |
| `PageBanner.Button` | ⚪ | 우측 인라인 액션 버튼 (예: "자세히", "이동"). `targetHeight=x10` |
| `PageBanner.CloseButton` | ⚪ | 우측 끝 닫기 버튼. `aria-label` 필수. YAML 의 `suffixIcon` slot 에 대응 (React 전용 wrapper) |

**중요**
- `Title` · `Description` 은 둘 다 선택이지만, **최소 하나는 있어야 배너로서 의미**가 있다. 일반적으로 `Title` 단독 또는 `Title` + `Description` 조합.
- `Button` 과 `CloseButton` 은 공존 가능. `Button` 은 긍정 행동 유도, `CloseButton` 은 dismiss 용.
- prefix 아이콘은 **YAML-only slot** 이며 React namespace 에는 `PrefixIcon` 래퍼가 **export 되지 않는다** (`PageBanner.*` 목록: Root/Body/Content/Title/Description/Button/CloseButton 뿐). YAML `prefixIcon` 의 size·margin·color 토큰은 `--seed-prefix-icon-*` CSS variable 로 Root 에 주입되어 있으므로, 사용자는 `PageBanner.Body` 첫 자식으로 raw SVG/Icon 을 직접 넣고 `className="seed-prefix-icon"` 을 수동으로 붙이거나 팀 전용 wrapper 를 만들어 사용한다 (현재 React API 로는 자동 wiring 이 없다).

---

## YAML Slot tokens (보조 표)

YAML (`packages/rootage/components/page-banner.yaml`) 은 **7 slot** 을 정의한다. React namespace 와 slot 이름·역할이 1:1로 정확히 맞지 않는 부분이 있으므로 매핑을 참고.

| YAML slot | 관리 properties | React 대응 |
|-----------|-----------------|-----------|
| `root` | `paddingX`, `paddingY`, `minHeight`, `color`, `gradient` | `PageBanner.Root` |
| `prefixIcon` | `size`, `marginRight`, `color` | **React namespace 에 `PrefixIcon` 래퍼가 없음** — Body 첫 자식에 raw SVG 를 직접 두고 `className="seed-prefix-icon"` 로 slot 클래스를 수동 부착해야 토큰이 연결된다 |
| `content` | `gap` | `PageBanner.Content` |
| `title` | `fontSize`, `lineHeight`, `fontWeight`, `color` | `PageBanner.Title` |
| `description` | `fontSize`, `lineHeight`, `fontWeight`, `color` | `PageBanner.Description` |
| `button` | `targetHeight`, `fontSize`, `lineHeight`, `fontWeight`, `color` | `PageBanner.Button` |
| `suffixIcon` | `size`, `targetSize`, `marginLeft`, `color` | `PageBanner.CloseButton` (닫기 아이콘에 해당) |

> `PageBanner.Body` 와 `PageBanner.CloseButton` 은 React 전용 layout wrapper 이고 YAML 의 직접 token 이 없다 (CloseButton 은 `suffixIcon` token 을 참조). 반대로 `prefixIcon` 과 `suffixIcon` 은 YAML-only spec 으로, React 에서는 Body 내부 배치 · CloseButton 으로 흡수된다.

### 기본 토큰 (base, enabled)

```
root:       paddingX=x4 (16px), paddingY=x2_5 (10px), minHeight=x10 (40px)
prefixIcon: size=x4 (16px), marginRight=x2 (8px)
content:    gap=x1_5 (6px)
title:       fontSize=t4, lineHeight=t4, fontWeight=bold
description: fontSize=t4, lineHeight=t4, fontWeight=medium
button:      targetHeight=x10 (40px), fontSize=t3, lineHeight=t3, fontWeight=bold
suffixIcon:  size=x4 (16px), targetSize=x10 (40px), marginLeft=x2 (8px)
```

---

## Variants

PageBanner 는 **variant**(시각 강도) × **tone**(의미 색상) 2축 조합. variant 2개 × tone 6개 = 12조합이나, `magic + solid` 는 미지원이므로 **실제 유효 조합은 11개**.

### `variant`

| 값 | 의미 | 배경 처리 | 사용처 |
|-----|------|-----------|--------|
| `weak` | 옅은 배경 | `bg.{tone}-weak` (magic 은 gradient) | 상시 안내, 페이지 내 소프트한 공지 |
| `solid` | 진한 배경 | `bg.{tone}-solid` (또는 inverted/static-white fg) | 긴급 공지, 프로모션 강조 |

### `tone`

| 값 | 의미 | 사용 예 |
|-----|------|---------|
| `neutral` | 일반 상태 · 공지 | "서비스 점검 예정입니다" |
| `positive` | 긍정 · 완료 | "프로모션 혜택 적용 중" |
| `informative` | 정보성 | "새로운 기능이 추가되었습니다" |
| `warning` | 주의 · 잠재 문제 | "배송 지연 가능 지역입니다" |
| `critical` | 심각 · 차단 | "결제 오류 · 즉시 확인 필요" |
| `magic` | AI · 특수 프로모션 (weak 전용) | "AI 추천으로 더 빠르게 찾아보세요" |

---

## Variant × Tone 호환 매트릭스

`tone=magic` 은 디자인 시스템 정의상 **`variant=weak` 와만 조합**되며, `solid` 와 함께 쓸 수 없다. YAML (`components/page-banner.yaml`) 에 `tone=magic, variant=solid` 정의가 **존재하지 않는다** — description 에도 명시적으로 "variant=solid와 조합하여 사용하지 않습니다" 라고 선언된 제약.

| variant \\ tone | neutral | positive | informative | warning | critical | magic |
|---|---|---|---|---|---|---|
| **weak** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **solid** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ not supported |

**magic 전용 규칙**
- `tone=magic` + `variant=weak` 에서만 유효하며, 배경은 **`$gradient.glow-magic`** (pressed 시 `$gradient.glow-magic-pressed`).
- 글자 색은 `fg.neutral` 고정 (일반 semantic fg 토큰이 아님).
- `magic + solid` 조합을 코드에서 시도하면 토큰 resolve 가 실패하므로 타입 레벨에서 차단되거나 런타임 fallback 이 들어간다 — **사용 금지**.

---

## States

PageBanner 는 인터랙티브 상태가 제한적이다. root 자체의 disabled / loading 상태는 **존재하지 않는다** (YAML 에 정의되지 않음).

| State | 트리거 | 시각 변화 | token 예 (tone=neutral, variant=weak 기준) |
|-------|--------|-----------|-------------------------------------------|
| `enabled` | 기본 | root 배경 normal | `root.color = $color.bg.neutral-weak` |
| `pressed` | **Root 가 `<button>` 으로 렌더된 경우에만** root 자체 press·hover | root 배경 한 단계 어두워짐 | `root.color = $color.bg.neutral-weak-pressed` |

**root pressed 의 실제 적용 범위**
- upstream CSS 는 `.seed-page-banner__root:is(button):is(:hover, [data-hover])` (또는 `:active`) 로 selector 가 제한되어 있다.
- React `PageBanner.Root` 의 기본 렌더 요소는 `<div>` (dismissible 패턴) 이므로 **기본 사용에서는 root pressed 가 절대 트리거되지 않는다**.
- `asChild` 로 Root 를 `<button>` 으로 바꿔야만 pressed 가 켜진다 — 드문 케이스.
- 내부 `Button` · `CloseButton` 을 눌러도 root 배경은 **변하지 않는다**. 각 버튼은 자기 pressed 토큰(버튼 컴포넌트 recipe) 으로만 반응.

**tone=magic 의 pressed**
- `enabled`: `root.gradient = $gradient.glow-magic`
- `pressed`: `root.gradient = $gradient.glow-magic-pressed` (역시 Root 가 `<button>` 일 때만)

---

## 합성 규칙 (composition)

- **PageBanner 는 페이지당 1개 · 페이지 최상단 고정** — 여러 개 쌓거나 스크롤 중간에 배치하지 말 것. 섹션 내부 메시지는 [`Callout`](./callout.md) 이 올바른 선택.
- **`Callout` 과의 경계** — Callout 은 콘텐츠 흐름의 일부로 스크롤되는 정적 카드. PageBanner 는 페이지 전체 맥락의 상단 고정 띠. 역할이 다르므로 혼용 금지.
- **`InlineBanner` 는 deprecated** — 구형 프로젝트에서 남아있는 `InlineBanner` 는 PageBanner 로 마이그레이션한다. 자세한 매핑은 [`./inline-banner.md`](./inline-banner.md) 참조.
- **`CloseButton` 은 사용자가 dismiss 가능한 경우에만** — 법적·보안 고지 등 반드시 봐야 하는 메시지에는 `CloseButton` 을 넣지 말 것.
- **`Button` 라벨은 2~5자** — "자세히", "이동", "확인" 같은 간결한 CTA. 길어지면 모바일에서 줄바꿈 · 레이아웃 붕괴.
- **prefix 아이콘은 Fill 타입 권장** — YAML 주석에도 명시. Outline 아이콘은 배너 크기에서 시인성이 떨어진다.
- **`tone` 은 메시지의 실제 성격을 반영** — `critical = 진짜 차단 상황`, `warning = 주의 필요`, `positive = 완료/혜택`. "예쁘니까 magic" 같은 장식적 선택 금지.

---

## 접근성 (constraints, not suggestions)

- `PageBanner.CloseButton` 은 아이콘 전용 버튼이므로 **`aria-label` 필수** (예: `aria-label="배너 닫기"`).
- **색상 단독으로 tone 전달 금지** — critical / warning 을 색만으로 구분하면 색맹 사용자 판독 불가. `Title` · `Description` 텍스트 자체가 성격을 전달해야 한다.
- 페이지 상단 고정이므로 **스크린 리더가 가장 먼저 읽는 영역**. 문장은 완결된 한 문장으로 작성 ("오늘 00시부터 점검합니다" 식).
- 일시적 공지가 아닌 경우 `role="region"` + `aria-label` 을 Root 에 부여해 landmark 로 노출 고려.
- `Button` 은 네이티브 `<button>` 시맨틱으로 렌더되므로 키보드 Tab 포커스 · Enter/Space 액션이 자동 지원된다.

---

## Anti-patterns

```tsx
// magic tone 을 solid 와 조합 — YAML 에 정의되지 않은 조합
<PageBanner.Root variant="solid" tone="magic">
  <PageBanner.Body>...</PageBanner.Body>
</PageBanner.Root>

// CloseButton 에 aria-label 누락 — 스크린 리더가 "버튼" 으로만 읽음
<PageBanner.CloseButton />

// 페이지 중간에 PageBanner 배치 — Callout 의 영역
<section>
  <h2>섹션 제목</h2>
  <PageBanner.Root variant="weak" tone="informative">
    <PageBanner.Body>
      <PageBanner.Content>
        <PageBanner.Title>섹션 안내</PageBanner.Title>
      </PageBanner.Content>
    </PageBanner.Body>
  </PageBanner.Root>
</section>

// 한 페이지에 PageBanner 2개 이상 중첩 — 신호 과잉
<PageBanner.Root variant="solid" tone="critical">...</PageBanner.Root>
<PageBanner.Root variant="weak" tone="informative">...</PageBanner.Root>

// tone 이 메시지 성격과 불일치 — "결제 실패" 를 positive 로 표시
<PageBanner.Root variant="solid" tone="positive">
  <PageBanner.Body>
    <PageBanner.Content>
      <PageBanner.Title>결제에 실패했습니다</PageBanner.Title>
    </PageBanner.Content>
  </PageBanner.Body>
</PageBanner.Root>

// 올바른 예 — dismissable 정보 공지
<PageBanner.Root variant="weak" tone="informative">
  <PageBanner.Body>
    <PageBanner.Content>
      <PageBanner.Title>새로운 검색 필터가 추가되었어요</PageBanner.Title>
      <PageBanner.Description>이제 거리·가격 조건으로 더 빠르게 찾을 수 있어요.</PageBanner.Description>
    </PageBanner.Content>
    <PageBanner.Button>자세히</PageBanner.Button>
  </PageBanner.Body>
  <PageBanner.CloseButton aria-label="배너 닫기" />
</PageBanner.Root>
```

---

## 예제 (minimum usage)

### 1. 기본 — informative weak + 액션 버튼 + 닫기

```tsx
import { PageBanner } from "@seed-design/react";

<PageBanner.Root variant="weak" tone="informative">
  <PageBanner.Body>
    <PageBanner.Content>
      <PageBanner.Title>새로운 검색 필터가 추가되었어요</PageBanner.Title>
      <PageBanner.Description>거리·가격 조건으로 더 빠르게 찾아보세요.</PageBanner.Description>
    </PageBanner.Content>
    <PageBanner.Button onClick={openDetails}>자세히</PageBanner.Button>
  </PageBanner.Body>
  <PageBanner.CloseButton aria-label="배너 닫기" onClick={dismiss} />
</PageBanner.Root>
```

### 2. 긴급 공지 — critical solid, dismiss 불가

```tsx
import { PageBanner } from "@seed-design/react";

<PageBanner.Root variant="solid" tone="critical">
  <PageBanner.Body>
    <PageBanner.Content>
      <PageBanner.Title>결제 오류가 발생했어요</PageBanner.Title>
      <PageBanner.Description>결제 수단을 다시 확인해주세요.</PageBanner.Description>
    </PageBanner.Content>
    <PageBanner.Button onClick={goToPayment}>확인</PageBanner.Button>
  </PageBanner.Body>
</PageBanner.Root>
```

차단성 메시지이므로 `CloseButton` 을 두지 않아 사용자가 문제를 반드시 인지하도록 한다.

### 3. AI 프로모션 — magic weak (solid 조합 금지)

```tsx
import { PageBanner } from "@seed-design/react";
import { IconSparkleFill } from "@daangn/react-monochrome-icon";

<PageBanner.Root variant="weak" tone="magic">
  <PageBanner.Body>
    <IconSparkleFill />
    <PageBanner.Content>
      <PageBanner.Title>AI 가 대신 찾아드릴게요</PageBanner.Title>
      <PageBanner.Description>원하는 조건을 알려주시면 매물을 추천해드려요.</PageBanner.Description>
    </PageBanner.Content>
    <PageBanner.Button onClick={openAiSearch}>시작하기</PageBanner.Button>
  </PageBanner.Body>
  <PageBanner.CloseButton aria-label="배너 닫기" onClick={dismiss} />
</PageBanner.Root>
```

`$gradient.glow-magic` 배경이 적용된다. `variant="solid"` 와의 조합은 지원되지 않으므로 AI 프로모션은 반드시 `weak` 로 표시.

### 4. 간단한 공지 — title 만

```tsx
import { PageBanner } from "@seed-design/react";

<PageBanner.Root variant="weak" tone="neutral">
  <PageBanner.Body>
    <PageBanner.Content>
      <PageBanner.Title>오늘 00:00 ~ 02:00 서비스 점검이 진행됩니다.</PageBanner.Title>
    </PageBanner.Content>
  </PageBanner.Body>
  <PageBanner.CloseButton aria-label="배너 닫기" onClick={dismiss} />
</PageBanner.Root>
```

한 줄 공지는 `Description` 없이 `Title` 만 사용. 배너 높이가 최소화되어 페이지 콘텐츠 점유를 줄인다.
