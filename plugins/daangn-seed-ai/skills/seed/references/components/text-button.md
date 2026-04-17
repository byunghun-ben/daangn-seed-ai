---
name: text-button
upstream_sha: 1f1d21d
status: rootage-only
---

# TextButton

> **React 컴포넌트 미제공 · Rootage 토큰 스펙 문서**
>
> `text-button` 은 Seed Design Rootage 디자인 스펙에만 존재한다.
> `@seed-design/react` 패키지에 `TextButton` 컴포넌트가 없으므로 import 불가.
> 직접 구현이 필요하다면 아래 "직접 구현 시 가이드" 섹션을 참고한다.

**역할** — 배경 없이 텍스트(레이블)만 표시하는 최소한의 인터랙티브 버튼. 인라인 텍스트 맥락이나 보조 액션에서 시각적 무게를 최소화할 때 사용한다.

관련 컴포넌트: [`./action-button.md`](./action-button.md)

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 텍스트 흐름 속 인라인 "더보기", "취소" 같은 보조 액션 | **TextButton** (직접 구현) |
| 명확한 CTA, 화면 주 액션 | `ActionButton variant="brandSolid"` / `neutralSolid` |
| 배경 없는 아이콘+텍스트 조합 | `ActionButton variant="ghost"` |
| 선택 가능한 토글 태그 | `Chip` / `ControlChip` |

---

## Anatomy

| Slot | 필수 | 역할 |
|------|------|------|
| `root` | ✅ | `<button>` 컨테이너. 배경·패딩·코너·상태 관리 |
| `label` | ✅ | 텍스트 레이블. 색상·폰트 속성 보유 |

Variants 축 없음 (Rootage 스펙상 단일 형태)

---

## 기본 스펙 (Rootage tokens)

Rootage YAML (`text-button.yaml`, SHA `1f1d21d`) 기준. variant/size 축 없이 `base` 하나만 존재한다.

### enabled 상태

| Slot | 속성 | Rootage 토큰 | 비고 |
|------|------|-------------|------|
| `root` | `minHeight` | `$dimension.x9` | 36px 기준 (Seed dimension scale) |
| `root` | `paddingX` | `$dimension.x3_5` | 수평 패딩 |
| `root` | `paddingY` | `$dimension.x2` | 수직 패딩 |
| `root` | `cornerRadius` | `$radius.r2` | 작은 라운드 |
| `label` | `color` | `$color.fg.neutral-muted` | 약한 중립 텍스트 색 |
| `label` | `fontSize` | `$font-size.t4` | Body 2 수준 |
| `label` | `lineHeight` | `$line-height.t4` | fontSize에 대응 |
| `label` | `fontWeight` | `$font-weight.bold` | 굵은 텍스트 |

### pressed 상태

| Slot | 속성 | Rootage 토큰 |
|------|------|-------------|
| `root` | `color` | `$color.bg.layer-default-pressed` |

> `pressed` 토큰 `$color.bg.layer-default-pressed` 는 pressed 시 root에 반투명 오버레이 색상을 적용한다. CSS 변수로는 `var(--seed-v3-color-bg-layer-default-pressed)`.

---

## CSS 변수 매핑 (런타임 참고)

Seed v3 CSS 변수 형식으로 치환하면:

| Rootage 토큰 | CSS 변수 |
|-------------|---------|
| `$dimension.x9` | `var(--seed-dimension-x9)` |
| `$dimension.x3_5` | `var(--seed-dimension-x3-5)` |
| `$dimension.x2` | `var(--seed-dimension-x2)` |
| `$radius.r2` | `var(--seed-radius-r2)` |
| `$color.fg.neutral-muted` | `var(--seed-v3-color-fg-neutral-muted)` |
| `$font-size.t4` | `var(--seed-font-size-t4)` |
| `$font-weight.bold` | `var(--seed-font-weight-bold)` |
| `$color.bg.layer-default-pressed` | `var(--seed-v3-color-bg-layer-default-pressed)` |

---

## 직접 구현 시 가이드

`@seed-design/react`에 TextButton이 없으므로 두 가지 대안 중 프로젝트 상황에 맞게 선택한다.

### (a) native `<button>` + CSS 변수 직접 적용

Seed 토큰을 CSS 변수로 직접 적용하는 방식. 디자인 토큰과 1:1 대응이 보장된다.

```tsx
// TextButton.tsx — native <button> + Seed CSS variables
import type { ButtonHTMLAttributes } from "react";

interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function TextButton({ children, style, ...props }: TextButtonProps) {
  return (
    <button
      style={{
        // root tokens (base / enabled)
        minHeight: "var(--seed-dimension-x9)",
        paddingLeft: "var(--seed-dimension-x3-5)",
        paddingRight: "var(--seed-dimension-x3-5)",
        paddingTop: "var(--seed-dimension-x2)",
        paddingBottom: "var(--seed-dimension-x2)",
        borderRadius: "var(--seed-radius-r2)",
        // label tokens
        color: "var(--seed-v3-color-fg-neutral-muted)",
        fontSize: "var(--seed-font-size-t4)",
        fontWeight: "var(--seed-font-weight-bold)",
        // reset
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      onMouseDown={(e) => {
        // pressed overlay는 root slot의 color (=background) 에 적용.
        // text-button.yaml pressed.root.color = $color.bg.layer-default-pressed.
        // label 색 (fg.neutral-muted) 은 pressed state 에서도 그대로 유지.
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "var(--seed-v3-color-bg-layer-default-pressed)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "transparent";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "transparent";
      }}
      {...props}
    >
      {children}
    </button>
  );
}
```

```tsx
// 사용 예
<TextButton onClick={handleCancel}>취소</TextButton>
<TextButton onClick={handleMore}>더보기</TextButton>
```

### (b) `ActionButton variant="ghost"` 근사치

Seed React 컴포넌트를 사용해야 한다면 `ActionButton variant="ghost"`가 가장 유사한 대안이다.
`ghost`는 배경 없이 텍스트/아이콘만 표시하며, `color` prop으로 `fg.neutral-muted` 색상을 지정할 수 있다.
단, `ghost`는 ActionButton의 props 체계(size, layout, fontWeight 등)를 따르며 TextButton 스펙과 완전히 일치하지는 않는다.

자세한 내용은 [`./action-button.md`](./action-button.md) 참조.

```tsx
import { ActionButton } from "@seed-design/react";

// TextButton 근사치 — ghost variant 사용
<ActionButton
  variant="ghost"
  color="fg.neutral-muted"
  fontWeight="bold"
  onClick={handleCancel}
>
  취소
</ActionButton>
```

---

## States

| State | 토큰 | 설명 |
|-------|------|------|
| `enabled` | `$color.fg.neutral-muted` (label) | 기본 상태 |
| `pressed` | `$color.bg.layer-default-pressed` (root) | 눌렸을 때 오버레이 |

> `disabled` 및 `loading` state 토큰은 `text-button.yaml` 스펙에 정의되어 있지 않다. 필요하다면 ActionButton의 `fg.disabled` / `bg.disabled` 토큰을 참고한다.

---

## 접근성

- 반드시 네이티브 `<button>` 태그를 사용한다. `<div role="button">` 금지.
- 레이블 텍스트가 충분히 명확하지 않으면 `aria-label` 추가.
- `disabled` 처리 시 `pointer-events: none` 만으로는 부족하다 — `disabled` prop 또는 `aria-disabled` 병행 사용.

---

## Anti-patterns

```tsx
// 존재하지 않는 컴포넌트 — @seed-design/react 에 TextButton export 없음, 아래 구문 불가
❌ // "@seed-design/react" 패키지에 TextButton export 없음 — 사용 불가

// div로 버튼 구현 — 접근성 문제
❌ <div onClick={handleClick} style={{ color: "..." }}>취소</div>

// 하드코딩 색상 — 다크모드·테마 대응 불가
❌ <button style={{ color: "#868b94" }}>취소</button>

// Seed CSS 변수 + 네이티브 button — 올바른 방법
✅ <button style={{ color: "var(--seed-v3-color-fg-neutral-muted)" }}>취소</button>

// ActionButton ghost 근사치 — @seed-design/react 사용 시
✅ <ActionButton variant="ghost" color="fg.neutral-muted" fontWeight="bold">취소</ActionButton>
```

---

## 관련 문서

- [`./action-button.md`](./action-button.md) — ghost variant를 포함한 모든 ActionButton 스펙
- `decision-matrices/which-button.md` — 어떤 버튼을 선택할지 매트릭스
