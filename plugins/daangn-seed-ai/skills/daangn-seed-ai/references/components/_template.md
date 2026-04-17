# Component — `{PascalName}`

> 이 템플릿은 `components/*.md` 작성 규칙. 실제 컴포넌트 파일을 작성할 때 이 구조를 그대로 따른다.

**정의 한 줄** — 컴포넌트의 역할을 한 문장으로 (무엇을, 왜, 언제).

**import 경로** — `import { X } from "@seed-design/react";` (실제 경로)

---

## 언제 쓰나 / 언제 쓰지 않나

| 써야 함 | 대안 |
|---------|------|
| 시나리오 1 | 다른 컴포넌트 |
| 시나리오 2 | 다른 컴포넌트 |

관련 결정 매트릭스: `decision-matrices/{which-*}.md`

---

## Anatomy

slots 나열 + 각 slot의 역할. 필수 slot과 선택 slot을 구분.

| Slot | 필수 | 역할 |
|------|------|------|
| `root` | ✅ | 외부 컨테이너 |
| `label` | ✅ | 텍스트 |
| `prefixIcon` | ⚪ | 시작 아이콘 |

---

## Variants

### `variant`

| 값 | 의미 | 사용 예 | 규칙 |
|-----|------|---------|------|
| `brandSolid` | 브랜드 주요 CTA | 핵심 액션 | 화면당 1개 |
| `...` | ... | ... | ... |

### `size`

| 값 | 높이 | 사용 맥락 |
|-----|------|-----------|
| `small` | 32px | 리스트·인라인 |
| `medium` | 40px | 일반 폼 |
| `large` | 48px | 풀폭 CTA |

---

## States

| State | 트리거 | 시각 변화 | token |
|-------|--------|-----------|-------|
| `enabled` | 기본 | — | `bg.X-solid` |
| `pressed` | press/hover | 배경 어두워짐 | `bg.X-solid-pressed` |
| `disabled` | `disabled` prop | 흐려짐, non-interactive | `bg.disabled` / `fg.disabled` |
| `loading` | `loading` prop | ProgressCircle 표시 | — |

---

## Props (핵심만)

```ts
interface XProps {
  variant?: "brandSolid" | "neutralSolid" | "neutralWeak" | "criticalSolid" | "brandOutline" | "neutralOutline" | "ghost";
  size?: "xsmall" | "small" | "medium" | "large";
  layout?: "withText" | "iconOnly";
  loading?: boolean;
  disabled?: boolean;
  // ...
}
```

---

## 합성 규칙 (composition)

- 다른 컴포넌트와의 페어링 규칙
- 금지되는 조합
- 권장되는 wrapper (예: FieldButton은 Field 안에서만)

---

## 접근성 (constraints, not suggestions)

- 필수 ARIA 속성 (예: `layout=iconOnly`는 `aria-label` 필수)
- 키보드 인터랙션
- 포커스 상태

---

## Anti-patterns

```tsx
❌ <ActionButton variant="brandSolid" layout="iconOnly" />
   {/* aria-label 없음 */}

❌ <div role="button" onClick={...}>클릭</div>
   {/* 네이티브 button 대신 div — Seed 컴포넌트 우선 */}

✅ <ActionButton variant="brandSolid" aria-label="검색">
     <Icon>...</Icon>
   </ActionButton>
```

---

## 예제 (minimum usage)

```tsx
import { ActionButton } from "@seed-design/react";

<ActionButton variant="brandSolid" size="large" onClick={...}>
  다음으로
</ActionButton>
```
