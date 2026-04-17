---
name: link-content
upstream_sha: 1f1d21d
status: ported
deprecated: true
---

# LinkContent

> **⚠️ DEPRECATED** — rootage metadata: "Use Action Button with variant=\"ghost\" instead."

이 문서는 (1) 기존 LinkContent 사용 코드의 레거시 유지보수 가이드, (2) `ActionButton variant="ghost"`로의 마이그레이션 참조 역할만 한다. 새 코드에서는 LinkContent를 사용하지 않는다.

---

## 이 문서를 읽는 이유

1. **레거시 코드 이해** — 이미 `<LinkContent>` 가 사용된 화면을 유지보수할 때, 기존 size/weight/color 스펙을 참고하기 위해.
2. **토큰 참고** — `size=t4/t5/t6` × `weight=regular/bold` 매트릭스 토큰을 확인하거나, migration 후에도 동일 토큰을 ActionButton에 적용하기 위해.

새 화면·신규 기능에서는 LinkContent를 사용하면 안 된다. → [`./action-button.md`](./action-button.md) 의 `variant="ghost"` 사용.

---

## Migration 가이드: LinkContent → ActionButton variant="ghost"

### 치환 규칙

| LinkContent | ActionButton variant="ghost" |
|------------|------------------------------|
| `<LinkContent color="fg.neutral">텍스트</LinkContent>` | `<ActionButton variant="ghost" color="fg.neutral">텍스트</ActionButton>` |
| `<LinkContent size="t4">` | `<ActionButton variant="ghost" size="small">` |
| `<LinkContent size="t5">` | `<ActionButton variant="ghost" size="medium">` (기본) |
| `<LinkContent size="t6">` | `<ActionButton variant="ghost" size="large">` |
| `weight="regular"` | `fontWeight="regular"` |
| `weight="bold"` | `fontWeight="bold"` |
| `<SuffixIcon svg={...} />` | children 에 `<SuffixIcon svg={...} />` 그대로 사용 |

### 필수 패키지

```ts
import { ActionButton, SuffixIcon } from "@seed-design/react";
```

> **아이콘 import**: 아이콘은 `@seed-design/react` 의 named export `SuffixIcon` 을 사용한다. karrotmarket 아이콘 패키지의 subpath 직접 import는 쓰지 않는다.

자세한 ghost variant 스펙은 [`./action-button.md`](./action-button.md) 참조.

---

## 기존 Rootage 스펙 참고 (레거시)

> **새 코드에서는 아래 스펙을 직접 사용하지 않는다.** migration target인 ActionButton의 토큰 매핑 확인 용도로만 참고.

upstream `link-content.yaml` (SHA `1f1d21d`) 기준 `size × weight` 2축 매트릭스.

### size 토큰

`root.gap` = `$dimension.x0_5` (모든 size 공통)

| size | label.fontSize | label.lineHeight | suffixIcon.size |
|------|---------------|-----------------|-----------------|
| `t4` | `$font-size.t4` | `$line-height.t4` | `$dimension.x3` |
| `t5` | `$font-size.t5` | `$line-height.t5` | `$dimension.x3_5` |
| `t6` | `$font-size.t6` | `$line-height.t6` | `$dimension.x4` |

### weight 토큰

| weight | label.fontWeight |
|--------|-----------------|
| `regular` | `$font-weight.regular` |
| `bold` | `$font-weight.bold` |

### Anatomy (슬롯)

| Slot | 역할 |
|------|------|
| `root` | 컨테이너. `gap` = `$dimension.x0_5` (label ↔ suffixIcon 사이 간격) |
| `label` | 텍스트 레이블. fontSize/lineHeight/fontWeight 보유 |
| `suffixIcon` | 우측 아이콘. size 토큰만 보유 |

---

## 예제

### 1. 기존 LinkContent 예시 (DEPRECATED — 레거시 코드 이해용)

```tsx
// DEPRECATED: LinkContent 는 upstream 에서 deprecated 처리되었습니다.
// 아래 코드는 기존 구현 참고용으로만 사용하고 새 코드에 작성하지 않습니다.
// LinkContent.tsx 에 @deprecated JSDoc 주석이 2회 선언되어 있습니다
// (LinkContentProps interface 와 LinkContent export 각 1회씩).
import { LinkContent, SuffixIcon } from "@seed-design/react";
// 아이콘은 @seed-design/react 의 named export 로 감싸 사용 — named path import 사용 금지

// ❌ 새 코드에서 사용 금지 — DEPRECATED
<LinkContent size="t5" weight="bold" color="fg.brand">
  더보기
  <SuffixIcon svg={chevronRightIcon} />
</LinkContent>
```

### 2. ActionButton variant="ghost" 변환 (Migration target)

```tsx
// ✅ 위 LinkContent 코드와 동등한 ActionButton 구현
import { ActionButton, SuffixIcon } from "@seed-design/react";

<ActionButton variant="ghost" size="medium" fontWeight="bold" color="fg.brand">
  더보기
  <SuffixIcon svg={chevronRightIcon} />
</ActionButton>
```

---

## 새 코드 작성 시 사용 금지

- `upstream LinkContent.tsx` 에 `@deprecated` JSDoc 마크가 2회 선언되어 있다 (`LinkContentProps` interface, `LinkContent` const export 각 1회).
- `link-content.yaml` metadata에도 `deprecated: Use Action Button with variant="ghost" instead.` 가 명시되어 있다.
- 신규 코드에서 `<LinkContent>` import 및 사용은 금지한다.
- 기존 코드를 리팩터링할 때 `ActionButton variant="ghost"` 로 이관한다. 자세한 ghost 스펙은 [`./action-button.md`](./action-button.md) 참조.
