---
name: toggle-button
upstream_sha: 1f1d21d
---

# ToggleButton

**정의** — **눌렀다 뗄 수 있는 영구 상태 버튼**. 툴바의 포매팅 토글(bold / italic), 필터 on/off, 뷰 모드 전환(리스트 / 그리드) 처럼 **같은 공간에 여러 개가 나열되고 각각이 뷰를 변형**할 때 사용한다. 설정 화면의 즉시 반영 on/off 는 `Switch` 를 사용 — 아래 [ToggleButton vs Switch](#togglebutton-vs-switch) 섹션 참조.

**import**
```ts
import { ToggleButton } from "@seed-design/react";
// flat export — namespace 아님. 단일 컴포넌트.
// <ToggleButton variant="brandSolid" pressed={pressed} onPressedChange={setPressed}>
//   버튼
// </ToggleButton>
```

아이콘을 함께 쓸 때는 `PrefixIcon` / `SuffixIcon` 슬롯 컴포넌트를 children 으로 넣는다:
```ts
import { ToggleButton, PrefixIcon, SuffixIcon } from "@seed-design/react";
import { IconBellFill, IconChevronRightFill } from "@karrotmarket/react-monochrome-icon";
```

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 툴바 포매팅 토글 (B / I / U), 필터 태그 on/off, 뷰 모드(리스트/그리드) 전환 | **ToggleButton** (이 컴포넌트) |
| 설정 화면의 즉시 반영 on/off (푸시 알림, 다크 모드) | `Switch` ([`./switch.md`](./switch.md)) |
| 여러 값 중 하나만 선택 (라디오 그룹) | `Radio` ([`./radio.md`](./radio.md)) |
| 폼 제출 대상 다중 선택 (약관 동의, 관심 카테고리) | `Checkbox` ([`./checkbox.md`](./checkbox.md)) |
| 일회성 액션 (저장, 전송, 결제) | `ActionButton` ([`./action-button.md`](./action-button.md)) |
| 칩 형태의 선택 (검색 필터, 카테고리) | `Chip` (업스트림 Chip 컴포넌트) |
| 폼 내부의 간소한 텍스트 액션 | `TextButton` ([`./text-button.md`](./text-button.md)) |

관련 결정 매트릭스: [`decision-matrices/composition.md`](../decision-matrices/composition.md)

### ToggleButton vs Switch

[`./switch.md`](./switch.md) 와 대칭 관계. 같은 "이진 상태" 를 시각적으로 전혀 다르게 표현한다.

| 차이점 | ToggleButton | Switch |
|--------|--------------|--------|
| 시각 | 버튼 박스 (누른 / 안 누른 상태) | 레일 + 썸 (on / off 은유) |
| 의미 | **뷰 모드 / 필터 / 포매팅** | **설정값** (지속되는 on/off) |
| 라벨 위치 | 버튼 **내부** (아이콘 + 텍스트) | 레일 **옆** 텍스트 |
| 배치 | 툴바 · 필터 바에 **여러 개 나열** | 설정 행(row) 에 **단독** |
| 사용 예 | "굵게(B)", "리스트 뷰", "신상품만" | "푸시 알림", "다크 모드" |
| React API | `pressed` / `onPressedChange` | `checked` / `onCheckedChange` |

> **판단 기준** — "같은 공간에 이 버튼이 여러 개 나란히 놓여 각각 뷰를 변형하나?" → **ToggleButton**. "한 줄에 라벨 옆 on/off 토글이고 즉시 설정 반영이 목적인가?" → **Switch**. 자세한 내용은 [`./switch.md`](./switch.md) 참조.

---

## Anatomy

ToggleButton 은 YAML 스펙 상 5 개의 슬롯 (root / label / prefixIcon / suffixIcon / progressCircle) 을 가지지만, **React API 는 flat 단일 컴포넌트** `<ToggleButton>` 1 개다. 아이콘 슬롯은 CSS className (`seed-prefix-icon`, `seed-suffix-icon`) 으로 스타일만 주입되고, 실제 DOM 은 children 에 넣는 `PrefixIcon` / `SuffixIcon` 컴포넌트가 담당한다. `progressCircle` slot 은 **현재 upstream CSS recipe 에 DOM 렌더링 규칙이 없음** — `data-loading` attribute 는 root 의 background 만 변경한다 (아래 [loading 동작](#loading-동작--data-loading-attribute--spinner-dom-자동-렌더-없음) 참조).

| YAML slot | 필수 | React 렌더 방법 | 역할 |
|-----------|------|-----------------|------|
| `root` | ✅ | `<ToggleButton>` (내부에서 `<TogglePrimitive.Root>` = `<button type="button">`) | 외부 컨테이너. `variant` / `size` / `pressed` / `loading` / `disabled` 수신 |
| `label` | ⚪ | children 에 텍스트 | 버튼 내부 텍스트. 아이콘만 있는 케이스에서는 생략 가능 (단 `aria-label` 필수) |
| `prefixIcon` | ⚪ | children 에 `<PrefixIcon svg={<IconX />} />` | 시작 아이콘. `className="seed-prefix-icon"` 으로 size/color 토큰 수신 |
| `suffixIcon` | ⚪ | children 에 `<SuffixIcon svg={<IconY />} />` | 끝 아이콘. 동일 메커니즘 |
| `progressCircle` | ⚪ | YAML slot 만 존재 — upstream CSS recipe 에서는 DOM 렌더 없음 | `loading=true` 는 `data-loading` attribute 로 root background 만 pressed 변형으로 전환. spinner DOM 이 필요하면 사용자가 children 에 직접 `<ProgressCircle>` 배치 |

**중요**
- `children` 에 생 SVG 를 바로 넣지 말 것. 반드시 `<PrefixIcon svg={...}>` / `<SuffixIcon svg={...}>` 로 감싸야 seed 의 아이콘 size / color 토큰이 자동 주입된다.
- `<ToggleButton>` 안에는 아이콘 1개 + 라벨 1개 + 아이콘 1개 조합이 최대. 3 개 이상 자식이나 중첩 버튼 금지.
- `loading` prop 은 root 에 `data-loading=""` attribute 만 부착한다. upstream CSS recipe (`toggle-button.css`) 는 이 attribute 에 반응해 background 를 pressed 변형으로 전환하지만 **progressCircle 이나 spinner DOM 을 자동 렌더하지는 않는다** — 시각적 스피너가 필요하면 children 에 직접 `<ProgressCircle>` 을 배치.

---

## Variants

### `variant`

upstream `ToggleButtonVariantProps["variant"]` 리터럴 (기본값 `"brandSolid"`):

```ts
variant?: "brandSolid" | "neutralWeak"
```

| 값 | 의미 | 미선택(enabled) 배경 | 선택(pressed) 배경 | 사용 예 |
|-----|------|---------------------|---------------------|---------|
| `"brandSolid"` | 브랜드 컬러로 강조. 미선택 상태에서 이미 주황 배경 — 현재 유효 / 기본값 선택을 강조할 때 | `$color.bg.brand-solid` (당근 주황) | `$color.bg.neutral-weak` (선택 시 **회색**으로 역전) | "구독 중" / "즐겨찾기 해제" 같이 현재 on 이 기본값인 케이스 |
| `"neutralWeak"` | 기본적인 토글. 미선택은 중립 회색, 선택 시에도 동일 회색 톤 (약간 어두워짐) | `$color.bg.neutral-weak` | `$color.bg.neutral-weak-pressed` | "필터 태그", "툴바 포매팅" 같이 여러 토글이 균등하게 나열될 때 (권장) |

기본값: `"brandSolid"` (upstream default — `ToggleButton.tsx` 의 `variant = "brandSolid"`).

> 여러 개를 툴바에 나열할 때는 `"neutralWeak"` 가 시각적으로 더 안정적이다. `"brandSolid"` 는 주황이 강해 동등한 선택지 여러 개에는 어울리지 않는다.

### `size`

upstream `ToggleButtonVariantProps["size"]` 리터럴 (기본값 `"small"`):

```ts
size?: "xsmall" | "small"
```

| 값 | minHeight | paddingX / paddingY | label 폰트 | 아이콘 size | 사용 맥락 |
|-----|-----------|---------------------|-----------|-------------|-----------|
| `"xsmall"` | 32px (`$dimension.x8`) | 14px / 6px (`x3_5` / `x1_5`) | `$font-size.t3` | 14px (`x3_5`) | 촘촘한 필터 바, 리스트 내 인라인 토글 |
| `"small"` | 36px (`$dimension.x9`) | 16px / 8px (`x4` / `x2`) | `$font-size.t4` | 14px (`x3_5`) | 일반 툴바, 필터 그룹 (기본권장) |

기본값: `"small"` (upstream default). `medium` / `large` 크기는 이 컴포넌트에 **없다** — 더 큰 CTA 가 필요하면 `ActionButton` 을 사용하라.

> **size 토큰 규약** — 반드시 위 2 개 문자열 리터럴만 허용. `size="medium"` / `size="large"` / 숫자 / px 하드코딩 금지.

코너 반경은 두 size 모두 `$radius.full` (pill shape) 로 고정.

---

## States

| State | 트리거 | 시각 변화 | 주요 token |
|-------|--------|-----------|-----------|
| `enabled` (미선택) | 기본 | variant 기본 배경색 | `$color.bg.brand-solid` / `$color.bg.neutral-weak` |
| `pressed` (미선택 + 누르는 중) | press/hover 순간 | 배경이 `-pressed` 변형으로 어두워짐 | `$color.bg.brand-solid-pressed` / `$color.bg.neutral-weak-pressed` |
| `selected` (선택됨, 떼어진 상태) | `pressed` prop = `true` | brandSolid 는 **회색**으로 반전, neutralWeak 은 동일 회색 유지 | `$color.bg.neutral-weak` |
| `selected,pressed` (선택됨 + 다시 누르는 중) | `pressed` prop=`true` + press/hover | 선택 상태의 배경이 한 단계 더 어두워짐 | `$color.bg.neutral-weak-pressed` |
| `disabled` | `disabled` prop = `true` | 배경·라벨·아이콘 모두 disabled 토큰으로 흐려짐, non-interactive | `$color.bg.disabled` / `$color.fg.disabled` |
| `loading` (미선택 + 로딩) | `loading` prop = `true`, `pressed`=`false` | 버튼 배경이 pressed 변형으로 전환 (spinner DOM 자동 렌더는 없음 — 필요하면 children 에 `<ProgressCircle>`) | `$color.bg.brand-solid-pressed` |
| `selected,loading` | `loading`=`true`, `pressed`=`true` | 선택 상태 배경을 pressed 변형으로 표시 | `$color.bg.neutral-weak-pressed` |

### State 매트릭스 (variant × state)

YAML 의 `variant` × `state` 조합 (brandSolid / neutralWeak 2 variant 각각에 대해 7 state):

| | enabled | pressed | selected | selected,pressed | disabled | loading | selected,loading |
|-|---------|---------|----------|-------------------|----------|---------|-------------------|
| **brandSolid** | brand-solid | brand-solid-pressed | neutral-weak | neutral-weak-pressed | disabled | brand-solid-pressed | neutral-weak-pressed |
| **neutralWeak** | neutral-weak | neutral-weak-pressed | neutral-weak | neutral-weak-pressed | disabled | neutral-weak-pressed | neutral-weak-pressed |

> YAML 에서 `selected,pressed` / `selected,loading` 과 같이 콤마로 연결된 이름은 **복합 상태 (selected AND pressed)** 를 의미한다. React API 에서는 `pressed={true}` (YAML 의 `selected`) 와 press 순간의 hover / `loading=true` 가 자동으로 결합되어 표현되므로 개발자가 직접 복합 상태를 명시할 필요가 없다.

### loading 동작 — `data-loading` attribute & spinner DOM 자동 렌더 없음

`ToggleButton.tsx` 내부 로직:

```tsx
const api = usePendingButton({ loading, disabled: otherProps.disabled });
// ...
<TogglePrimitive.Root
  ref={ref}
  className={clsx(recipeClassName, className)}
  {...api.stateProps}   // data-loading="" / data-disabled="" attribute 주입
  {...otherProps}
/>
```

- `loading=true` 가 들어오면 `usePendingButton` 훅이 `data-loading=""` attribute 를 root 에 부착한다.
- upstream CSS recipe (`toggle-button.css`) 의 `.seed-toggle-button[data-loading]` 셀렉터는 **root 의 `background` 만** `-pressed` 변형으로 전환한다. `::before` / `::after` pseudo-element 나 spinner DOM 을 자동 렌더하는 규칙은 **없다**.
- 따라서 progressCircle 은 **YAML 스펙 상의 slot 이름일 뿐 실제 DOM 생성은 일어나지 않는다**. 시각적 스피너가 필요하면 사용자가 직접 children 에 `<ProgressCircle>` (또는 동등한 컴포넌트) 을 배치해야 한다.
- 결과적으로 `loading` prop 의 시각 효과는 "배경색이 한 단계 어두워지는 것" 이다 — 스피너가 돌지 않아도 버튼이 "지금 바쁨" 이라는 신호는 전달된다.
- 단, `loading` 은 **`disabled` 를 자동으로 포함하지 않는다**. 로딩 중 버튼이 클릭돼도 이벤트가 발생할 수 있으므로, 이벤트를 막으려면 `disabled={loading}` 를 명시적으로 함께 넘겨야 한다 (업스트림 `loading.tsx` 예제 주석 기준).

---

## YAML slot 과 React API 구분

ToggleButton 의 가장 큰 함정은 **YAML 스펙의 슬롯 구조**와 **React API 의 prop 구조**가 1:1 대응하지 않는다는 점이다. 이 섹션에서 확실히 구분한다.

- **YAML slot (`toggle-button.yaml`)** — `root`, `label`, `prefixIcon`, `suffixIcon`, `progressCircle` 의 5 개 slot. 이들은 **CSS className 슬롯** (Rootage 스펙) 이며 각 slot 에 `color` / `size` / `fontWeight` 등 디자인 토큰이 정의된다. 실제 DOM element 는 seed-design CSS 엔진이 `className="seed-prefix-icon"` 같은 클래스를 통해 스타일을 주입한다.
- **React API** — flat 단일 컴포넌트 `<ToggleButton>` 1 개. namespace (`ToggleButton.Label`, `ToggleButton.PrefixIcon` 같은) 는 **존재하지 않는다**. children 에 아이콘을 넣을 때는 공통 슬롯 컴포넌트 `<PrefixIcon svg={...}>` / `<SuffixIcon svg={...}>` 를 import 해서 사용한다 (`@seed-design/react` 에서 export — 내부적으로 `className="seed-prefix-icon"` / `className="seed-suffix-icon"` 를 자동 부착).
- **YAML 의 `selected` ↔ React 의 `pressed`** — YAML state 축의 `selected` 는 "시각적으로 눌려있는(지속) 상태" 라는 **디자인 상태명**이다. 대응하는 React API 는 `pressed` / `onPressedChange` 이름을 쓴다 (업스트림이 radix-style `TogglePrimitive.RootProps` 를 확장하기 때문). 두 용어는 같은 개념이지만 **맥락이 다를 뿐**이므로 섞어 쓰지 않는다.

### 매핑 표 (YAML ↔ React)

| YAML 슬롯 / state | React API 매핑 | 메모 |
|-------------------|----------------|------|
| slot `root` | `<ToggleButton>` 자체 | flat 컴포넌트 |
| slot `label` | children 텍스트 노드 | 별도 wrapper 없음 |
| slot `prefixIcon` | children `<PrefixIcon svg={...} />` | `@seed-design/react` 에서 import |
| slot `suffixIcon` | children `<SuffixIcon svg={...} />` | `@seed-design/react` 에서 import |
| slot `progressCircle` | `loading={true}` 시 `data-loading` attribute 만 부착 (background 전환). spinner DOM 은 자동 렌더되지 않음 | 필요하면 children 에 `<ProgressCircle>` 직접 배치 |
| state `enabled` | `pressed={false}`, `loading={false}`, `disabled={false}` | 기본 |
| state `selected=true` | `pressed={true}` | 동일 개념 — 이름만 다름 |
| state `pressed` (YAML) | press 순간 브라우저 hover/active | prop 아님 — CSS `[data-pressed]` / `:active` |
| state `selected,pressed` | `pressed={true}` + press 순간 | 자동 결합 |
| state `disabled` | `disabled={true}` | 그대로 |
| state `loading` | `loading={true}` | disabled 는 포함되지 않음 |
| state `selected,loading` | `pressed={true}` + `loading={true}` | 자동 결합 |

> 이 문서의 나머지 섹션은 맥락에 따라 용어를 분리해서 쓴다: **React API 를 설명할 때는 `pressed` / `onPressedChange`**, **YAML 스펙 / 시각 상태 이름을 설명할 때는 `selected`**. 한 문장 안에서 두 용어를 섞지 않는다.

---

## Props (핵심만)

```ts
import type * as React from "react";

// upstream: ToggleButtonProps extends ToggleButtonVariantProps & UsePendingButtonProps & TogglePrimitive.RootProps
interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // recipe variants
  variant?: "brandSolid" | "neutralWeak";       // default: "brandSolid"
  size?: "xsmall" | "small";                    // default: "small"

  // loading (UsePendingButtonProps)
  loading?: boolean;                            // default: false — disabled 를 자동 포함하지 않음

  // toggle state (TogglePrimitive.RootProps)
  pressed?: boolean;                            // controlled
  defaultPressed?: boolean;                     // uncontrolled
  onPressedChange?: (pressed: boolean) => void;

  // 일반 button 속성
  disabled?: boolean;                           // default: false
  "aria-label"?: string;                        // 아이콘-only 일 때 필수
}
```

**default 동작 요약**
- `variant` 미지정 → `"brandSolid"`.
- `size` 미지정 → `"small"`.
- `pressed` / `defaultPressed` 둘 다 미지정 → `false` (미선택 상태로 시작).
- `onPressedChange` 는 **boolean 을 직접 받는다** — `{ pressed }` 객체가 아님. (Switch 의 `onCheckedChange({ checked })` 와 다름에 주의)
- `loading` 은 `disabled` 를 포함하지 않으므로, 로딩 중 재클릭을 막으려면 `disabled={loading}` 를 명시.

---

## 합성 규칙 (composition)

- **그룹 구성** — ToggleButton 여러 개를 `display: flex; gap: 8px` 로 나열하거나 Seed 의 `ButtonGroup` (있다면) 안에 배치. 각 버튼이 독립적으로 토글되므로 "한 번에 하나만" 이 필요한 경우엔 `RadioGroup` 을 써야 한다.
- **아이콘 포함** — children 에 `<PrefixIcon svg={...}>` 또는 `<SuffixIcon svg={...}>` 를 넣는다. `@karrotmarket/react-monochrome-icon` 의 아이콘 컴포넌트를 `svg` prop 에 전달.
- **controlled vs uncontrolled** — 서버 / 전역 상태와 동기화 필요하면 `pressed` + `onPressedChange`, 순수 로컬 UX 면 `defaultPressed` 만.
- **Loading 중 disabled 결합** — 네트워크 호출 중이면 `<ToggleButton loading={pending} disabled={pending}>` 로 더블 클릭 방지.
- **Dialog / BottomSheet 내부 배치 금지 사례** — 단일 선택 필터(라디오 성격) 는 ToggleButton 그룹 대신 `RadioGroup` 사용.
- **Chip 과의 구분** — 시각적으로 유사한 컴포넌트 `Chip` 이 존재하지만, Chip 은 "데이터 항목" (태그 / 키워드) 을 표현하고 ToggleButton 은 "명령 / 모드 전환" 을 표현한다. 필터 UI 는 주로 Chip, 툴바 / 포매팅은 ToggleButton.

---

## 접근성 (constraints, not suggestions)

- 내부적으로 `<TogglePrimitive.Root>` 는 `<button type="button">` 으로 렌더되며, radix-style 로 `aria-pressed="true"` / `aria-pressed="false"` 를 자동 부착한다. 스크린 리더는 "토글 버튼, 선택됨/선택 안 됨" 으로 읽는다.
- **라벨링** — 버튼 안에 텍스트 라벨이 있으면 충분. **아이콘-only** (`<PrefixIcon>` 만 있고 텍스트 노드 없음) 일 때는 `aria-label` 이 **필수**. 예: `<ToggleButton aria-label="알림 구독 토글"><PrefixIcon svg={<IconBellFill/>} /></ToggleButton>`.
- **키보드** — `Tab` 으로 포커스, `Space` / `Enter` 로 토글. 네이티브 button 동작.
- **focus-visible** — 키보드 포커스 시 Seed 의 focus ring 이 자동 표시됨. 브라우저 기본 outline 을 `display:none` 으로 숨기지 말 것.
- **색만으로 상태 전달 금지** — brandSolid variant 는 `pressed={true}` 일 때 주황 → 회색으로 반전되는 강한 변화가 있지만, neutralWeak variant 는 거의 색이 같다. neutralWeak 는 반드시 텍스트 변화(예: "필터 on" / "필터 off") 나 아이콘(체크마크) 으로 상태를 보조해야 한다. `aria-pressed` attribute 만 설정하고 시각 피드백이 없으면 sighted 사용자가 상태를 놓친다.
- **disabled 이유 공지** — 단순히 `disabled` 만 걸면 사용자는 왜 꺼져 있는지 모른다. 주변에 보조 텍스트나 [`./callout.md`](./callout.md) 로 이유를 설명.

---

## Anti-patterns

```tsx
// YAML 슬롯 구조를 React namespace 로 잘못 이해
❌ <ToggleButton.Root>
     <ToggleButton.PrefixIcon><IconBellFill /></ToggleButton.PrefixIcon>
     <ToggleButton.Label>알림</ToggleButton.Label>
   </ToggleButton.Root>
   // ToggleButton 은 flat. namespace API 는 존재하지 않는다.

// 생 SVG 를 children 에 직접
❌ <ToggleButton pressed={on} onPressedChange={setOn}>
     <IconBellFill />
     알림
   </ToggleButton>
   // seed 의 아이콘 size/color 토큰이 적용되지 않음.
   // 반드시 <PrefixIcon svg={<IconBellFill/>} /> 로 감쌀 것.

// loading prop 이 progressCircle 을 자동 렌더한다고 가정
❌ <ToggleButton loading>
     {/* loading 만 걸면 spinner 가 나올 거라 기대 — 실제로는 background 만 전환됨 */}
     저장 중
   </ToggleButton>
   // upstream CSS recipe 는 data-loading 에 대해 background 만 바꾼다.
   // spinner DOM 이 필요하면 children 에 <ProgressCircle /> 을 명시적으로 배치.

// loading 만 걸고 disabled 생략
❌ <ToggleButton loading={saving} pressed={on} onPressedChange={setOn}>
     토글
   </ToggleButton>
   // 로딩 중 클릭이 다시 발생할 수 있음. 이벤트 차단이 필요하면
   // disabled={saving} 를 명시.

// 아이콘-only 에서 aria-label 누락
❌ <ToggleButton><PrefixIcon svg={<IconBellFill/>} /></ToggleButton>
   // AT 사용자는 무엇을 토글하는지 알 수 없음.

// size 리터럴 아닌 값
❌ <ToggleButton size="medium">토글</ToggleButton>
   // 지원하지 않는 리터럴. "xsmall" | "small" 중 하나만.

// 동등한 선택지 여러 개에 brandSolid
❌ <div>
     <ToggleButton variant="brandSolid">리스트 뷰</ToggleButton>
     <ToggleButton variant="brandSolid">그리드 뷰</ToggleButton>
     <ToggleButton variant="brandSolid">카드 뷰</ToggleButton>
   </div>
   // 주황이 너무 강함. neutralWeak 로 나열 + 현재 뷰만 pressed.

// onPressedChange 시그니처 오해
❌ <ToggleButton onPressedChange={({ pressed }) => setPressed(pressed)}>
     토글
   </ToggleButton>
   // 콜백은 boolean 을 직접 받음. ({ pressed }) 객체가 아님.
   // Switch 의 onCheckedChange({ checked }) 와 혼동하지 말 것.

// 올바른 예
✅ <ToggleButton
     variant="neutralWeak"
     size="small"
     pressed={isPressed}
     onPressedChange={setIsPressed}
     disabled={saving}
     loading={saving}
     aria-label="알림 구독 토글"
   >
     <PrefixIcon svg={<IconBellFill />} />
     {isPressed ? "구독 중" : "구독하기"}
   </ToggleButton>
```

---

## 예제 (minimum usage)

### 1. 기본 사용 (uncontrolled)

```tsx
import { ToggleButton } from "@seed-design/react";

<ToggleButton variant="neutralWeak" size="small" defaultPressed={false}>
  필터
</ToggleButton>
```

`defaultPressed` 로 초기 상태만 지정하고 내부 상태는 컴포넌트가 관리. 외부 상태가 필요 없는 가장 간단한 형태.

### 2. Controlled (외부 상태 + 서버 저장)

```tsx
import { ToggleButton } from "@seed-design/react";
import { useState } from "react";

function SubscribeButton() {
  const [isPressed, setIsPressed] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleToggle(next: boolean) {
    setSaving(true);
    try {
      await api.subscribe({ subscribed: next });
      setIsPressed(next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ToggleButton
      variant="neutralWeak"
      size="small"
      pressed={isPressed}
      onPressedChange={handleToggle}
      loading={saving}
      disabled={saving}
    >
      {isPressed ? "구독 중" : "구독하기"}
    </ToggleButton>
  );
}
```

controlled 형태는 `pressed` + `onPressedChange` 를 함께 넘긴다. `onPressedChange` 는 boolean 을 직접 받으므로 구조 분해할 필요 없음.

### 3. variant=brandSolid vs variant=neutralWeak

```tsx
// brandSolid: 미선택이 주황 (강조). "기본값이 ON" 에 어울림
<ToggleButton variant="brandSolid" pressed={notifOn} onPressedChange={setNotifOn}>
  {notifOn ? "알림 ON" : "알림 OFF"}
</ToggleButton>

// neutralWeak: 동등한 선택지 여러 개. 툴바 · 필터 표준
<div style={{ display: "flex", gap: 8 }}>
  <ToggleButton variant="neutralWeak" pressed={view === "list"} onPressedChange={() => setView("list")}>
    리스트
  </ToggleButton>
  <ToggleButton variant="neutralWeak" pressed={view === "grid"} onPressedChange={() => setView("grid")}>
    그리드
  </ToggleButton>
</div>
```

### 4. size=xsmall (촘촘한 필터) vs size=small (일반)

```tsx
// xsmall: 리스트 인라인, 조밀한 필터 바
<ToggleButton size="xsmall" variant="neutralWeak" pressed={onlyNew} onPressedChange={setOnlyNew}>
  신상품만
</ToggleButton>

// small: 일반 툴바 (기본)
<ToggleButton size="small" variant="neutralWeak" pressed={bold} onPressedChange={setBold}>
  굵게
</ToggleButton>
```

### 5. 아이콘 포함 (PrefixIcon / SuffixIcon)

```tsx
import { ToggleButton, PrefixIcon, SuffixIcon } from "@seed-design/react";
import { IconBellFill, IconChevronRightFill } from "@karrotmarket/react-monochrome-icon";
import { useState } from "react";

function NotificationToggle() {
  const [on, setOn] = useState(false);
  return (
    <ToggleButton variant="neutralWeak" pressed={on} onPressedChange={setOn}>
      <PrefixIcon svg={<IconBellFill />} />
      {on ? "알림 ON" : "알림 OFF"}
      <SuffixIcon svg={<IconChevronRightFill />} />
    </ToggleButton>
  );
}
```

아이콘은 반드시 `<PrefixIcon svg={...}>` / `<SuffixIcon svg={...}>` 로 감싼다. 내부적으로 `className="seed-prefix-icon"` / `className="seed-suffix-icon"` 를 부착하여 CSS recipe 의 size / color 토큰이 적용된다.

### 6. 로딩 상태 (비동기 저장)

```tsx
import { ToggleButton } from "@seed-design/react";
import { useState } from "react";

function AsyncToggle() {
  const [pressed, setPressed] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleToggle() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPressed((prev) => !prev);
    }, 2000);
  }

  // loading 은 disabled 를 자동으로 포함하지 않음 — 이벤트 차단이 필요하면 disabled 명시.
  return (
    <ToggleButton loading={loading} pressed={pressed} onPressedChange={handleToggle}>
      시간이 걸리는 토글
    </ToggleButton>
  );
}
```

`loading={true}` 는 `data-loading` attribute 를 통해 배경을 `-pressed` 변형으로 전환한다. upstream CSS recipe 는 spinner DOM 을 자동 렌더하지 않으므로, 시각적 스피너가 필요하면 children 에 직접 `<ProgressCircle>` 을 배치한다. 최소 UX 로는 배경색 전환만으로도 "바쁨" 신호는 전달된다.

### 7. 아이콘-only (aria-label 필수)

```tsx
import { ToggleButton, PrefixIcon } from "@seed-design/react";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";

<ToggleButton
  variant="neutralWeak"
  size="xsmall"
  pressed={subscribed}
  onPressedChange={setSubscribed}
  aria-label="알림 구독 토글"
>
  <PrefixIcon svg={<IconBellFill />} />
</ToggleButton>
```

텍스트 라벨이 없으면 스크린 리더가 버튼의 목적을 알 수 없다. `aria-label` 은 선택이 아니라 **필수**.
