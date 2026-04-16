# ActionButton

**정의** — 명확한 액션을 수행하는 기본 인터랙션 컴포넌트. 폼·다이얼로그·리스트에서 클릭 가능한 모든 곳에 사용되는 1차 선택지.

**import**
```ts
import { ActionButton } from "@seed-design/react";
```

관련 결정 매트릭스: [`decision-matrices/which-button.md`](../decision-matrices/which-button.md)

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 일반적인 버튼·CTA | **ActionButton** (이 컴포넌트) |
| 폼 필드 내부의 버튼 (검색, 클리어, 날짜 픽) | `FieldButton` |
| 선택 가능한 태그/칩 (토글 가능) | `Chip` / `ControlChip` |
| 원형 플로팅 액션 버튼 | `Fab`, `ExtendedFab` |
| "눌러서 값 변경" (on/off) | `Switch`, `ToggleButton` |

---

## Anatomy

| Slot | 필수 | 역할 |
|------|------|------|
| `root` | ✅ | `<button>` 요소, 배경·보더·상태 관리 |
| `label` | ⚪ | 텍스트 레이블 (layout=withText) |
| `icon` | ⚪ | layout=iconOnly일 때의 단독 아이콘 |
| `prefixIcon` | ⚪ | 라벨 앞 아이콘 (suffixIcon과 동시 사용 금지) |
| `suffixIcon` | ⚪ | 라벨 뒤 아이콘 (prefixIcon과 동시 사용 금지, Chevron·메뉴 표시용) |
| `progressCircle` | ⚪ | loading=true일 때 자동 렌더 |

---

## Variants

### `variant`

| 값 | 의미 | 규칙 |
|-----|------|------|
| `brandSolid` | 브랜드 주요 CTA (카로트 컬러 채움) | **화면당 1개 권장**. 사용자 간 연결이 일어나는 핵심 기능. |
| `neutralSolid` | 대부분 화면의 기본 CTA (다크 채움) | **화면당 1개 권장**. |
| `neutralWeak` | 보조 액션 | 여러 개 가능. CTA 제외 대부분의 액션. |
| `criticalSolid` | 파괴적 액션 (삭제, 초기화) | 되돌릴 수 없는 작업. 남발 금지. |
| `brandOutline` | 브랜드 아웃라인 | `neutralOutline`과만 조합. solid variants와 함께 쓰지 않음. |
| `neutralOutline` | 중립 아웃라인 | `brandOutline`과만 조합. solid variants와 함께 쓰지 않음. |
| `ghost` | 배경 없음, 텍스트/아이콘만 | `color` prop으로 색상 조절. `fontWeight`는 regular/medium/bold. |

### `size`

| 값 | 형태 | 사용 맥락 |
|-----|------|-----------|
| `xsmall` | Pill (알약형) | 작은 공간, 인라인 액션, ChipGroup 내부 |
| `small` | 중간 | 카드 내부, 세컨더리 |
| `medium` | 표준 | 화면 중앙 범용 |
| `large` | 큼 | **CTA 전용** (풀폭 "다음으로" 등) |

### `layout`

| 값 | 의미 | 필수 조건 |
|-----|------|---------|
| `withText` | 텍스트 (+ 선택 아이콘) | children에 텍스트 |
| `iconOnly` | 아이콘만 | **`aria-label` 또는 `aria-labelledby` 필수** |

---

## States

| State | 트리거 | 변화 |
|-------|--------|------|
| `enabled` | 기본 | variant별 기본 배경/전경 토큰 |
| `pressed` | press/hover | `bg.X-solid-pressed` / `bg.X-weak-pressed` |
| `disabled` | `disabled` prop | `bg.disabled` + `fg.disabled`, non-interactive |
| `loading` | `loading` prop | ProgressCircle 표시, pressed와 같은 배경, 클릭 비활성 |

---

## Variant → Token 매핑 (발췌)

```
brandSolid
  root:  bg.brand-solid                → pressed: bg.brand-solid-pressed
  label: fg.brand-contrast             (= 흰색 고정)
  loading: bg.brand-solid-pressed

neutralSolid
  root:  bg.neutral-inverted           → pressed: bg.neutral-inverted-pressed
  label: fg.neutral-inverted

neutralWeak
  root:  bg.neutral-weak               → pressed: bg.neutral-weak-pressed
  label: fg.neutral

criticalSolid
  root:  bg.critical-solid             → pressed: bg.critical-solid-pressed
  label: fg.critical-contrast

disabled (모든 variant 공통)
  root:  bg.disabled
  label/icon: fg.disabled
```

---

## Props

```ts
interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "brandSolid" | "neutralSolid" | "neutralWeak" | "criticalSolid"
          | "brandOutline" | "neutralOutline" | "ghost";
  size?: "xsmall" | "small" | "medium" | "large";
  layout?: "withText" | "iconOnly";         // default: "withText"
  loading?: boolean;                         // default: false
  disabled?: boolean;

  // ghost variant 전용
  color?: ScopedColorFg | ScopedColorPalette; // default: "fg.neutral"
  fontWeight?: "regular" | "medium" | "bold"; // default: "bold"

  // 레이아웃 미세 조정
  flexGrow?: number;
  bleedX?: DimensionToken;                   // ghost 시각 정렬용
  bleedY?: DimensionToken;
}
```

---

## 합성 규칙

- **outline끼리**: `brandOutline` + `neutralOutline` 조합 허용. `brandSolid + neutralOutline` 같은 solid+outline 혼재는 **금지**.
- **한 화면의 solid CTA는 1개** — 기본 변형은 `brandSolid` 또는 `neutralSolid`, 보조는 `neutralWeak`.
- **ghost는 인라인 맥락에서만** — 텍스트 블록 끝의 "더보기" 같은 용도.
- **iconOnly는 최후의 수단** — 접근성이 떨어진다. 사용해야 한다면 `aria-label` 필수.
- **Chip과 혼용 금지** — 선택 가능한 토글은 Chip, 1회성 액션은 ActionButton.

---

## 접근성 (필수 조건)

- `layout="iconOnly"` → `aria-label` 또는 `aria-labelledby` **필수**. 빠지면 런타임 경고 발생.
- 키보드: `Enter` / `Space` 활성화. 네이티브 `<button>` 기반이므로 자동 처리.
- `disabled` 상태는 포커스 이동에서 제외.
- 로딩 상태에서도 사용자에게 진행 중임을 전달 (ProgressCircle + `aria-busy` 자동).

---

## Anti-patterns

```tsx
❌ <ActionButton variant="brandSolid" layout="iconOnly">
     <Icon>search</Icon>
   </ActionButton>
   {/* aria-label 누락 */}

❌ <div role="button" onClick={...}>다음으로</div>
   {/* 네이티브 button 대신 div */}

❌ <ActionButton variant="brandSolid">저장</ActionButton>
   <ActionButton variant="neutralSolid">취소</ActionButton>
   {/* 한 화면에 solid 두 개 — 계층이 안 보임 */}

❌ <ActionButton variant="brandOutline" />
   <ActionButton variant="brandSolid" />
   {/* outline과 solid 혼재 */}

❌ <ActionButton style={{ backgroundColor: '#ff6f0f' }}>...</ActionButton>
   {/* 하드코딩 색상 — 다크모드·테마 대응 불가 */}

✅ <ActionButton variant="brandSolid" size="large" onClick={handleNext}>
     다음으로
   </ActionButton>

✅ <ActionButton variant="brandSolid" layout="iconOnly" aria-label="검색">
     <IconSearch />
   </ActionButton>

✅ {/* 폼 푸터 */}
   <ActionButton variant="neutralWeak" onClick={cancel}>취소</ActionButton>
   <ActionButton variant="brandSolid" onClick={save}>저장</ActionButton>
   {/* 주 액션만 solid, 보조는 weak */}
```

---

## 예제

### 최소 사용

```tsx
<ActionButton variant="brandSolid" size="large" onClick={handleSubmit}>
  다음으로
</ActionButton>
```

### 아이콘 + 텍스트

```tsx
<ActionButton variant="neutralWeak" prefixIcon={<IconPlus />}>
  항목 추가
</ActionButton>
```

### 로딩

```tsx
<ActionButton variant="brandSolid" loading={isSubmitting} onClick={handleSubmit}>
  저장
</ActionButton>
```

### 풀폭 CTA

```tsx
<ActionButton variant="brandSolid" size="large" flexGrow={1} onClick={next}>
  계속하기
</ActionButton>
```

### Ghost (인라인 액션)

```tsx
<Text>이 항목은 더 이상 판매되지 않습니다.
  <ActionButton variant="ghost" color="fg.brand" fontWeight="bold">
    유사 상품 보기
  </ActionButton>
</Text>
```
