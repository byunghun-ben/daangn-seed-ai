# InlineBanner

> **⚠️ Deprecated** — upstream seed-design에서 "Use Page Banner instead"로 표시됨. 신규 코드에선 [`PageBanner`](./page-banner.md) 사용 권장.

**정의** — 섹션·리스트 상단에 고정되어 상태·공지·경고를 전달하던 인라인 알림 밴드. 7개의 weak/solid compound variant(`neutralWeak`, `positiveWeak`, `informativeWeak`, `warningWeak`, `warningSolid`, `criticalWeak`, `criticalSolid`)로 톤·강도를 한 번에 표현한다 — `tone`/`variant` 를 분리한 축이 아니라 단일 compound 값이다.

**import**
```ts
import { InlineBanner } from "@seed-design/react";
```

이 문서는 (1) 기존 InlineBanner 사용 코드의 유지보수 가이드, (2) PageBanner로의 마이그레이션 참조 역할만 한다. 신규 화면에서는 쓰지 않는다.

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 기존 코드 유지보수 — 이미 InlineBanner 쓰는 스크린 | **InlineBanner** (변경 범위 최소화) → 리팩터링 시 PageBanner로 이관 |
| 신규 화면에서 페이지 상단 고정 배너가 필요 | → [`PageBanner`](./page-banner.md) |
| 섹션 내부 정적 안내 카드 | → [`Callout`](./callout.md) |
| 일시적 피드백 (저장됨, 복사됨) | → [`Snackbar`](./snackbar.md) |
| 폼 필드 아래 에러/도움말 | → Field의 `description` / `errorMessage` |

관련 결정 매트릭스: [`decision-matrices/which-overlay.md`](../decision-matrices/which-overlay.md)

---

## Anatomy

React namespace API (`InlineBanner.*`) 기준 6 slot.

| Slot | 필수 | 역할 |
|------|------|------|
| `Root` | ✅ | 외부 컨테이너 (variant 배경, padding, minHeight 관리) |
| `Content` | ✅ | Title·Description을 감싸는 세로 레이아웃 래퍼 |
| `Title` | ⚪ | 제목 (bold) |
| `Description` | ⚪ | 설명 (medium) |
| `Link` | ⚪ | 우측 인라인 링크/CTA |
| `CloseButton` | ⚪ | 우측 닫기 버튼 (dismiss 가능한 배너) |

---

## YAML Slot tokens (rootage spec)

YAML `inline-banner.yaml` 에 정의된 slot과 token properties.

| YAML slot | properties | 역할 |
|-----------|------------|------|
| `root` | `paddingX` = x4, `paddingY` = x2_5, `minHeight` = x10, `color` | 컨테이너 배경·패딩 |
| `prefixIcon` | `size` = x4, `marginRight` = x2, `color` | 좌측 아이콘 |
| `title` | `fontSize`/`lineHeight` = t4, `fontWeight` = bold, `color` | 제목 |
| `description` | `fontSize`/`lineHeight` = t4, `fontWeight` = medium, `color` | 설명 |
| `link` | `targetHeight` = x10, `fontSize`/`lineHeight` = t2, `fontWeight` = regular, `marginLeft` = x4, `color` | 인라인 링크 |
| `suffixIcon` | `size` = x4, `targetSize` = x10, `marginLeft` = x4, `color` | 우측 아이콘 |

**네이밍 차이** — React namespace는 `Root/Content/Title/Description/Link/CloseButton`, YAML rootage spec은 `root/prefixIcon/title/description/link/suffixIcon`. prefixIcon/suffixIcon은 YAML spec에만 존재하는 icon slot 토큰이며, React는 현재 기본 구현에서 직접 expose하지 않음.

---

## Variants

variant 7개. `base` definition은 공통 dimension/typography를 정의하며, 각 variant는 `color` 토큰만 교체한다.

| variant | root bg | title/description/link/icon fg | 사용 맥락 |
|---------|---------|--------------------------------|-----------|
| `neutralWeak` | `$color.bg.neutral-weak` | `$color.fg.neutral` | 일반 안내 (중립) |
| `positiveWeak` | `$color.bg.positive-weak` | `$color.fg.positive-contrast` | 긍정 상태, 완료 안내 |
| `informativeWeak` | `$color.bg.informative-weak` | `$color.fg.informative-contrast` | 정보성 공지 |
| `warningWeak` | `$color.bg.warning-weak` | `$color.fg.warning-contrast` | 주의 (약한 톤) |
| `warningSolid` | `$color.bg.warning-solid` | `$color.fg.neutral` | 주의 (강조 — 노랑 위 검정 글씨, AA 대비 확보) |
| `criticalWeak` | `$color.bg.critical-weak` | `$color.fg.critical-contrast` | 에러·차단 (약한 톤) |
| `criticalSolid` | `$color.bg.critical-solid` | `$color.palette.static-white` | 에러·차단 (최고 강조 — 빨강 위 흰 글씨) |

> `criticalSolid`만 fg를 `$color.palette.static-white`로 고정한다. 다른 solid/weak variant는 contrast 토큰 또는 `fg.neutral`을 사용.

---

## States

| State | 트리거 | 시각 변화 |
|-------|--------|-----------|
| `enabled` | 기본 | variant별 배경/전경 토큰 적용 |

InlineBanner는 pressed/disabled 상태를 갖지 않는다 (정적 알림). 인터랙션은 내부 `Link`·`CloseButton`이 담당.

---

## Props (핵심만)

```ts
interface InlineBannerRootProps {
  variant?:
    | "neutralWeak"
    | "positiveWeak"
    | "informativeWeak"
    | "warningWeak"
    | "warningSolid"
    | "criticalWeak"
    | "criticalSolid";
  // default: "neutralWeak"
}
```

- `Content`·`Title`·`Description`·`Link`·`CloseButton`은 모두 layout/text slot으로 별도 variant prop 없음.
- `Root`의 variant가 자식 slot들의 색상 토큰을 컨텍스트로 전파.

---

## 합성 규칙 (composition)

- **Root는 variant 선택만 담당, 내용은 Content로 그룹핑** — Title·Description을 직접 Root 자식으로 두지 말고 `InlineBanner.Content` 안에 배치.
- **Link와 CloseButton은 동시에 쓰지 않는다** — 한쪽은 CTA, 다른 쪽은 dismiss. 두 개가 겹치면 사용자는 어느 쪽이 주 액션인지 판단 못 한다.
- **페이지당 1개** — InlineBanner가 여러 개 쌓이면 신호 과잉. 신규 코드라면 PageBanner로 이관하면서 이 원칙 그대로 유지.
- **Toast/Snackbar 대체 금지** — InlineBanner는 사라지지 않는 정적 배너. 일시 피드백은 Snackbar.

---

## 접근성

- `variant`가 전달하는 의미(긍정/경고/에러)는 **텍스트로도 명시**되어야 한다. 색상만으로 구분하지 않는다.
- `CloseButton`에는 `aria-label="닫기"` 필수 (아이콘만 있는 경우).
- 중요한 에러/차단 배너(`criticalWeak`/`criticalSolid`)는 `role="alert"` 또는 `aria-live="assertive"`를 부모에 부여해 스크린 리더가 즉시 읽도록.
- dismiss 가능한 경우 키보드 포커스가 CloseButton에 도달해야 함.

---

## Anti-patterns

```tsx
❌ <InlineBanner.Root variant="criticalSolid">
     <InlineBanner.Content>
       <InlineBanner.Title>새 기능 안내</InlineBanner.Title>
     </InlineBanner.Content>
   </InlineBanner.Root>
   {/* 신규 기능에 InlineBanner 사용 (deprecated) — PageBanner로 작성해야 함 */}

❌ <InlineBanner.Root variant="criticalSolid">
     <InlineBanner.Content>
       <InlineBanner.Title>저장되었습니다</InlineBanner.Title>
     </InlineBanner.Content>
   </InlineBanner.Root>
   {/* variant=criticalSolid 남발 — 빨강+흰글씨는 차단/에러 상황에만. 성공 피드백은 Snackbar 또는 positiveWeak */}

❌ <InlineBanner.Root variant="warningWeak">
     <InlineBanner.Content>
       <InlineBanner.Title>확인 필요</InlineBanner.Title>
     </InlineBanner.Content>
     <InlineBanner.Link>자세히</InlineBanner.Link>
     <InlineBanner.CloseButton aria-label="닫기" />
   </InlineBanner.Root>
   {/* Link와 CloseButton 동시 사용 — 주 액션 모호 */}

✅ // 기존 코드 유지보수 — variant만 상황에 맞게 교체
   <InlineBanner.Root variant="warningWeak">
     <InlineBanner.Content>
       <InlineBanner.Title>배송 지연 안내</InlineBanner.Title>
       <InlineBanner.Description>현재 지역 폭설로 1-2일 지연될 수 있습니다.</InlineBanner.Description>
     </InlineBanner.Content>
     <InlineBanner.Link>자세히</InlineBanner.Link>
   </InlineBanner.Root>
```

---

## 예제 (minimum usage)

### 기본 — 경고 안내 + 인라인 링크

```tsx
import { InlineBanner } from "@seed-design/react";

<InlineBanner.Root variant="warningWeak">
  <InlineBanner.Content>
    <InlineBanner.Title>배송 지연 안내</InlineBanner.Title>
    <InlineBanner.Description>현재 지역 폭설로 1-2일 지연될 수 있습니다.</InlineBanner.Description>
  </InlineBanner.Content>
  <InlineBanner.Link>자세히</InlineBanner.Link>
</InlineBanner.Root>
```

### 에러 + dismiss 가능

```tsx
import { InlineBanner } from "@seed-design/react";

<InlineBanner.Root variant="criticalWeak">
  <InlineBanner.Content>
    <InlineBanner.Title>결제 실패</InlineBanner.Title>
    <InlineBanner.Description>카드 정보를 다시 확인해주세요.</InlineBanner.Description>
  </InlineBanner.Content>
  <InlineBanner.CloseButton aria-label="닫기" />
</InlineBanner.Root>
```

---

## PageBanner로 마이그레이션 (참고)

신규 코드나 리팩터링 시 매핑:

| InlineBanner variant | PageBanner 대응 |
|----------------------|-----------------|
| `neutralWeak` | `variant="weak"` + `tone="neutral"` |
| `positiveWeak` | `variant="weak"` + `tone="positive"` |
| `informativeWeak` | `variant="weak"` + `tone="informative"` |
| `warningWeak` | `variant="weak"` + `tone="warning"` |
| `warningSolid` | `variant="solid"` + `tone="warning"` |
| `criticalWeak` | `variant="weak"` + `tone="critical"` |
| `criticalSolid` | `variant="solid"` + `tone="critical"` |

상세 규칙은 [`page-banner.md`](./page-banner.md) 참조.
