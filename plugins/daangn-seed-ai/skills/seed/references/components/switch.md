---
name: switch
upstream_sha: 1f1d21d
---

# Switch

**정의** — 단일 on/off 상태를 즉시 전환하는 토글 컨트롤. 설정 화면의 "푸시 알림", "다크 모드" 처럼 **변경이 즉시 반영**되는 이진(binary) 선택에 사용한다. 폼의 checkbox 와는 의미가 다르다 — 아래 [Switch vs Checkbox](#switch-vs-checkbox) 섹션 참조.

**import**
```ts
import { Switch } from "@seed-design/react";
// namespace 사용:
// <Switch.Root>
//   <Switch.Control><Switch.Thumb /></Switch.Control>
//   <Switch.Label>푸시 알림</Switch.Label>
//   <Switch.HiddenInput />
// </Switch.Root>
```

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 즉시 반영되는 설정 on/off (푸시 알림, 다크 모드, 위치 권한) | **Switch** (이 컴포넌트) |
| 폼 제출 시 함께 처리되는 동의/선택 (약관 동의, 관심 카테고리 다중 선택) | `Checkbox` ([`./checkbox.md`](./checkbox.md)) |
| 여러 값 중 하나 선택 (라디오 그룹) | `Radio` ([`./radio.md`](./radio.md)) |
| 눌렀다 뗄 수 있는 영구 상태 버튼 (필터 on/off, bold/italic 툴바) | `ToggleButton` ([`./toggle-button.md`](./toggle-button.md)) |
| 일회성 액션 (저장, 전송) | `ActionButton` ([`./action-button.md`](./action-button.md)) |
| 리스트 아이템의 선택 (ListItem 내부) | `Checkbox` + ListItem 조합 |

관련 결정 매트릭스: [`decision-matrices/composition.md`](../decision-matrices/composition.md)

### Switch vs Checkbox

| 차이점 | Switch | Checkbox |
|--------|--------|----------|
| 의미 | **즉시 반영되는 설정** (상태 = 동작) | **폼 제출 대상** (값을 선택 후 submit) |
| 상호작용 | 토글 즉시 효과 발생 | submit 전엔 UI 표시만 |
| 시각 | 실제 물리 스위치 은유 (레일 + 썸) | 체크 마크 (✓) |
| 사용 예 | "다크 모드 켜기", "푸시 알림" | "약관 동의", "관심 카테고리 여러 개" |
| 토글 후 확인 버튼 필요? | ❌ 없음 (즉시 반영) | ✅ 보통 submit 필요 |

> **판단 기준** — "토글 후 별도 저장 버튼 없이 바로 반영되나?" → **Switch**. "여러 항목 체크 후 제출 단계가 있나?" → **Checkbox**. 자세한 내용은 [`./checkbox.md`](./checkbox.md) 참조.

### Switch vs ToggleButton

| 차이점 | Switch | ToggleButton |
|--------|--------|--------------|
| 시각 | 레일 + 썸 (on/off 은유) | 버튼 (pressed/unpressed) |
| 의미 | **설정값** (상태 지속, 설정 화면) | **뷰 모드 / 필터** (툴바·에디터) |
| 라벨 위치 | 레일 **옆** 텍스트 | 버튼 **내부** 텍스트·아이콘 |
| 사용 예 | "위치 권한", "자동 로그인" | "굵게(B)", "필터: 신상품만" |

> 기준: 설정 화면의 행(row) 인터랙션이면 Switch, 툴바·필터처럼 같은 공간에 여러 개 모여 있고 각각이 뷰를 변형하면 ToggleButton. 자세한 내용은 [`./toggle-button.md`](./toggle-button.md) 참조.

---

## Anatomy

Switch 는 5 개의 슬롯으로 구성된다. **Root 가 label element (`<label>`)** 로 렌더되어, 클릭 시 내부 HiddenInput 이 자동으로 토글된다 (네이티브 input 동작).

| Slot | 필수 | element | 역할 |
|------|------|---------|------|
| `Switch.Root` | ✅ | `<label>` | 전체 래퍼. size·gap 을 결정하고 클릭 영역 확장 (label element 여서 내부 HiddenInput 이 자동 연결) |
| `Switch.Control` | ✅ | `<div>` | 레일(rail). 배경 색으로 on/off 상태를 표시. Switchmark root 에 해당 (tone·size 토큰 수신) |
| `Switch.Thumb` | ✅ | `<div>` | 레일 위의 썸(thumb). `translate` 로 좌→우 이동, `scale` 로 press 애니메이션. Switchmark thumb 에 해당 |
| `Switch.Label` | ⚪ | `<span>` | 토글 옆 텍스트 라벨. `disabled` 상태를 자동으로 반영 (`opacity` 변화). 없어도 되지만 **접근성 권장** |
| `Switch.HiddenInput` | ✅ | `<input type="checkbox">` | 실제 폼 값을 담는 시각적으로 숨긴 input. `name`·`value`·`form` prop 수신. FormData 수집 대상 |

**중요**
- `Root` 가 `<label>` 이므로 **외부에서 다시 `<label>` 로 감싸지 말 것** — 중첩 label 은 HTML 스펙 위반.
- `HiddenInput` 은 외관상 보이지 않지만 **반드시 렌더해야** 접근성(screen reader 가 `role="switch"` 로 인식)·폼 제출·키보드 `Space`/`Enter` 토글이 동작한다.
- `Control` 내부에는 `Thumb` 1 개만 넣는다. 다른 children 은 디자인 시스템 외 커스텀이 필요한 경우에만.
- `Label` 은 `Root` 의 형제 slot 이고 기본 `<span>` 이다 — 블록 element (`<p>`, `<div>`) 로 교체하지 않는다.

---

## Variants

### `size`

upstream `SwitchVariantProps["size"]` 리터럴:

```ts
size?: "16" | "24" | "32"
```

| 값 | Root height | Control height × width | Thumb size | Label 폰트 | 사용 맥락 |
|-----|------------|-----------------------|------------|-----------|-----------|
| `"16"` | 24px (`x6`) | 16 × 26px | 12 × 12px | `$font-size.t3` | 리스트 인라인 · 촘촘한 설정 그리드 |
| `"24"` | 24px (`x6`) | 24 × 38px | 20 × 20px | `$font-size.t4` | 일반 설정 행(기본권장) |
| `"32"` | 32px (`x8`) | 32 × 52px | 26 × 26px | `$font-size.t5` | 강조 스위치 · 터치 타겟 우선 (기본값) |

기본값: `"32"` (upstream default).

> **size 토큰 규약** — 반드시 위 3 개 문자열 리터럴만 허용. 숫자(`size={32}`)·px 하드코딩 금지. 커스텀 사이즈는 당근 디자인 시스템에 존재하지 않는다.

#### ⚠️ deprecated size 값 (migration 경고)

과거 버전에서는 `size="small"` / `size="medium"` 을 사용했으나, 현재 upstream 에서 **deprecated** 로 표기돼 있고 `@seed-design/react@1.3.0` 에서 제거될 예정이다 (`Switch.tsx` 내부 console.warn). 새 코드에서는 아래 매핑대로 치환한다:

| deprecated | 교체 |
|-----------|------|
| `size="small"` | `size="16"` |
| `size="medium"` | `size="32"` |

런타임에서도 `process.env.NODE_ENV !== "production"` 일 때 `[SEED Design System] Switch size='small' is deprecated ...` 경고를 콘솔에 출력한다. 새 화면을 만들 때는 처음부터 `"16"|"24"|"32"` 만 쓸 것.

### `tone`

Switchmark(Control + Thumb 의 색) 의 tone 축. upstream `SwitchmarkVariantProps["tone"]` 리터럴:

```ts
tone?: "neutral" | "brand"
```

| 값 | 의미 | `selected` 레일 색 | thumb 색 (enabled) | 사용 맥락 |
|-----|------|--------------------|---------------------|-----------|
| `"brand"` | 브랜드 강조 (기본) | `$color.bg.brand-solid` (당근 주황) | `$color.palette.static-white` | 핵심 설정 (푸시 알림·마케팅 수신 등 사용자 설득이 있는 ON 상태) |
| `"neutral"` | 중립 | `$color.bg.neutral-inverted` | `$color.fg.neutral-inverted` | 시스템 설정(다크 모드·개발자 옵션 등 브랜드 색이 과도한 경우) |

기본값: `"brand"` (upstream default).

---

## States

| State | 트리거 | 시각 변화 |
|-------|--------|-----------|
| `enabled` / unselected | 기본, 미선택 | Control 은 `$color.palette.gray-600` 배경, Thumb 은 `scale: 0.8` 로 약간 축소 |
| `enabled` / selected | `defaultChecked` / `checked=true` | tone 에 따라 Control 배경 전환 + Thumb 이 오른쪽으로 `translate` + `scale: 1.0` 으로 확대 |
| `disabled` | `disabled` prop | Control `opacity: 0.38`, Label `opacity: 0.58` — 클릭 불가 |
| `disabled` / selected | `disabled=true` + `checked=true` | tone=neutral 에서 Control 은 `$color.palette.gray-600`, Thumb 은 `$color.palette.static-black-alpha-700` (체크 흔적은 남지만 흐림) |
| `focus-visible` | 키보드 포커스 | HiddenInput 에 포커스 링 (브라우저 기본 + Seed 포커스 스타일) |

색·scale·translate 전환은 모두 `$duration.d1` / `$duration.d3` + `$timing-function.easing` 으로 부드럽게 이어진다 (아래 Token 매핑 표).

---

## Token 매핑

### 공통 (switch / switchmark base.enabled)

```
switch.root:
  height:          $dimension.x6|x8               # size 에 따라
  gap:             $dimension.x1_5|x2|x2_5        # Label 과의 간격
switch.label:
  color:           $color.fg.neutral
  fontWeight:      $font-weight.medium
  fontSize:        $font-size.t3|t4|t5            # size 에 따라
  lineHeight:      $line-height.t3|t4|t5
  opacity:         0.58 (disabled)                # 흐림
  opacityDuration: $duration.d1

switchmark.root (Control):
  cornerRadius:          $radius.full
  color (enabled,rest):  $color.palette.gray-600
  colorDuration:         $duration.d1
  colorDelay:            20ms                     # 색 전환 시 약간의 지연
  colorTimingFunction:   $timing-function.easing
  opacity (disabled):    0.38
switchmark.thumb:
  cornerRadius:          $radius.full
  colorDuration:         $duration.d1
  colorDelay:            20ms
```

### thumb 모션 (scale / translate)

Thumb 의 on/off 전환은 단순 좌→우 이동이 아니라 **scale** (눌린 느낌) + **translate** (실제 위치 이동) 의 조합이다.

| 축 | 속성 | enabled(unselected) | enabled,selected | duration | timing |
|----|------|---------------------|-------------------|----------|--------|
| scale | `thumb.scale` | `0.8` (약간 축소) | `1.0` (원래 크기) | `$duration.d3` | `$timing-function.easing` |
| translate | `thumb.translate` (좌↔우) | 왼쪽 끝 (`padding` 만큼 안쪽) | 오른쪽 끝 | `$duration.d3` | `$timing-function.easing` |
| color | `thumb.color` | tone 별 enabled 색 | 동일 (대부분 유지) | `$duration.d1` (+ 20ms delay) | `$timing-function.easing` |

padding 은 size 별:

| size | paddingX | paddingY |
|------|---------|----------|
| `"16"` | 2px | 2px |
| `"24"` | 2px | 2px |
| `"32"` | 3px | 3px |

**주의 — 토큰 사용 원칙**
- `cornerRadius` 는 `$radius.full` 고정 (둥근 레일 + 원형 썸). 사각 Switch 는 디자인 시스템에 없다.
- 색은 모두 semantic / palette 토큰. hex 하드코딩 금지.
- duration/timing 함수는 upstream recipe 에서 자동 주입. 직접 `transition` CSS 덮어쓰기 금지.

---

## Props

```ts
import type * as React from "react";

// 1) Root ─ size·tone·checked 상태·disabled 를 모두 수신. label element 로 렌더됨.
//    upstream: SwitchRootProps extends SwitchmarkVariantProps & SwitchPrimitive.RootProps
interface SwitchRootProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  size?: "16" | "24" | "32"                       // default: "32"
    | /* @deprecated */ "small" | "medium";        // deprecated, 자동 매핑 후 1.3.0 에서 제거
  tone?: "neutral" | "brand";                      // default: "brand"
  checked?: boolean;                               // controlled
  defaultChecked?: boolean;                        // uncontrolled
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;                              // default: false
  invalid?: boolean;                               // 폼 검증 실패 시각 표시
  required?: boolean;
  readOnly?: boolean;
  name?: string;                                   // form 제출 시 key
  value?: string;                                  // checked 시 폼에 실릴 값 (default: "on")
  form?: string;                                   // 외부 <form id="..."> 연결
  id?: string;
}

// 2) Control ─ 레일. tone/size 를 Root 에서 전달받으므로 prop 은 거의 비움.
interface SwitchControlProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

// 3) Thumb ─ 레일 위의 원형 썸. 자동으로 translate/scale 전환.
interface SwitchThumbProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

// 4) Label ─ 토글 옆 텍스트. <span> 으로 렌더. disabled 시 opacity 자동 반영.
interface SwitchLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

// 5) HiddenInput ─ 시각적으로 숨긴 checkbox input. name/value/form 수신.
interface SwitchHiddenInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // type 은 내부적으로 "checkbox" 고정 — 덮어쓰지 말 것.
}
```

**default 동작 요약**
- `size` 미지정 → `"32"`. deprecated `"small"` / `"medium"` 입력 시 자동으로 `"16"` / `"32"` 로 매핑되며 개발 환경에서 콘솔 경고.
- `tone` 미지정 → `"brand"`.
- `defaultChecked` 미지정 → `false` (off 로 시작).
- `onCheckedChange` 는 `(checked: boolean)` 을 직접 인자로 받는다 — 객체 destructuring (`{ checked }`) 이 아니고, 네이티브 `onChange` 이벤트도 아니다.
- `value` 미지정 → HiddenInput 이 checked 상태일 때 `"on"` 이 FormData 에 실림.

---

## 합성 규칙 (composition)

- **5 slot 모두 한 Root 아래 있어야 한다** — Slot Recipe Context 가 sizing/tone 토큰을 전달. 고립된 Control/Thumb 은 스타일이 적용되지 않는다.
- **Root 를 이중 `<label>` 로 감싸지 말 것** — Root 자체가 `<label>`. 외부에서 다시 `<label htmlFor>` 로 감싸면 HTML 스펙 위반이고 클릭 2 회 토글되는 버그가 발생한다.
- **HiddenInput 은 생략 금지** — 시각적으로 안 보여도 반드시 렌더. 접근성(`role="switch"`), 폼 제출, 키보드 토글이 이 input 에 의존한다.
- **Label 생략 시 aria-label 필수** — [접근성](#접근성) 섹션 참조.
- **설정 리스트 안에 배치** — `ListItem` 의 trailing slot 에 Switch 전체를 넣는 패턴 권장. Switch 를 rows 사이 구분선 없이 다수 배치할 때는 `Divider` ([`./divider.md`](./divider.md)) 보다 `ListItem` 의 자체 row-separator 사용.
- **controlled vs uncontrolled** — 외부 상태(저장/로딩)와 동기화해야 하면 `checked` + `onCheckedChange`, 순수 토글 UX 면 `defaultChecked` 만.

---

## 접근성 (constraints, not suggestions)

- Switch Root 는 자동으로 내부 HiddenInput 을 `role="switch"` 로 노출한다 (native checkbox input + ARIA role). 스크린 리더는 "스위치, 켬/꺼짐" 으로 읽는다.
- **라벨링** — 시각 Label 이 있으면 충분하다. 없으면 `<Switch.Root aria-label="푸시 알림">` 처럼 Root 에 `aria-label` 필수. Label 없이 `aria-label` 도 없으면 AT 사용자는 무엇을 토글하는지 알 수 없다.
- **키보드** — `Tab` 으로 포커스, `Space` / `Enter` 로 토글. 네이티브 input 동작.
- **focus-visible** — HiddenInput 이 포커스를 받으면 Seed 의 포커스 링 스타일이 Control 주변에 나타난다. 브라우저 기본 outline 을 `display: none` 으로 숨기지 말 것.
- **색만으로 상태 전달 금지** — "켬/꺼짐" 을 tone=brand 주황색에만 의존하지 말고 on/off 위치 변화 + Label 텍스트로 의미 전달. 라벨이 "푸시 알림" 이고 상태가 "켬" 이면 AT 가 "푸시 알림, 스위치, 켬" 으로 읽어준다.
- **disabled 이유 공지** — 단순히 `disabled` 만 걸면 사용자는 왜 꺼져 있는지 모른다. 주변에 "[설정] → [알림 권한] 허용 후 사용 가능" 같은 보조 텍스트 또는 `Callout` ([`./callout.md`](./callout.md)) 을 함께 제공.

---

## Anti-patterns

```tsx
❌ <Switch.Root checked={on} onCheckedChange={setOn}>
     <Switch.Control><Switch.Thumb /></Switch.Control>
   </Switch.Root>
   {/* HiddenInput 누락 — 키보드 토글·폼 제출·AT role=switch 동작 안 함 */}

❌ <label>
     <Switch.Root>
       <Switch.Control><Switch.Thumb /></Switch.Control>
       <Switch.Label>다크 모드</Switch.Label>
       <Switch.HiddenInput />
     </Switch.Root>
   </label>
   {/* Root 가 이미 <label> — 중첩 label (HTML 스펙 위반, 토글 이중 발화) */}

❌ <Switch.Root size="small">...</Switch.Root>
   {/* deprecated — size="16" 으로 교체. 1.3.0 에서 제거 */}

❌ <Switch.Root size={32}>...</Switch.Root>
   {/* 숫자 리터럴 — 반드시 문자열 "16"|"24"|"32" */}

❌ <Switch.Root checked={userAgreed} onCheckedChange={setAgreed}>
     <Switch.Control><Switch.Thumb /></Switch.Control>
     <Switch.Label>이용약관에 동의합니다</Switch.Label>
     <Switch.HiddenInput name="agreed" />
   </Switch.Root>
   {/* 약관 "동의" 는 폼 제출 대상 — Switch 가 아니라 Checkbox 사용 */}

❌ <Switch.Root style={{ transition: 'none' }}>...</Switch.Root>
   {/* upstream recipe 의 thumb scale/translate 애니메이션을 죽임 — 시각 피드백 손실 */}

❌ <Switch.Root disabled aria-label="위치 권한">...</Switch.Root>
   {/* disabled 만 걸고 이유 설명 없음 — 사용자는 왜 꺼져 있는지 모름 */}

✅ <Switch.Root
     size="32"
     tone="brand"
     checked={pushEnabled}
     onCheckedChange={(checked) => setPushEnabled(checked)}
   >
     <Switch.Control><Switch.Thumb /></Switch.Control>
     <Switch.Label>푸시 알림</Switch.Label>
     <Switch.HiddenInput name="push" />
   </Switch.Root>
```

---

## 예제 (minimum usage)

### 1. 기본 사용 (uncontrolled, 즉시 반영)

```tsx
import { Switch } from "@seed-design/react";

<Switch.Root size="32" tone="brand" defaultChecked>
  <Switch.Control>
    <Switch.Thumb />
  </Switch.Control>
  <Switch.Label>푸시 알림</Switch.Label>
  <Switch.HiddenInput name="push" />
</Switch.Root>
```

`defaultChecked` 로 초기 상태만 지정하고 내부 상태는 컴포넌트가 관리. 값을 외부에서 볼 필요 없으면 이 형태가 가장 간결하다.

### 2. Controlled (외부 상태 + 서버 동기화)

```tsx
import { Switch } from "@seed-design/react";
import { useState } from "react";

function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  return (
    <Switch.Root
      size="24"
      tone="neutral"
      checked={dark}
      onCheckedChange={async (checked) => {
        setDark(checked);
        await savePreference({ darkMode: checked });
      }}
    >
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label>다크 모드</Switch.Label>
      <Switch.HiddenInput name="darkMode" />
    </Switch.Root>
  );
}
```

`onCheckedChange` 는 `(checked: boolean)` 을 직접 받는다 — 네이티브 `onChange` 이벤트가 아님. 서버 저장이 실패했을 때는 `setDark(!checked)` 로 롤백하는 패턴과 조합.

### 3. tone=brand (강조) vs tone=neutral (시스템)

```tsx
// brand: 사용자 설득이 필요한 주요 설정 (마케팅 수신 · 푸시 등)
<Switch.Root size="32" tone="brand" defaultChecked>
  <Switch.Control><Switch.Thumb /></Switch.Control>
  <Switch.Label>광고성 정보 수신</Switch.Label>
  <Switch.HiddenInput name="marketing" />
</Switch.Root>

// neutral: 시스템/개발자 옵션 — 브랜드 색이 과할 때
<Switch.Root size="24" tone="neutral">
  <Switch.Control><Switch.Thumb /></Switch.Control>
  <Switch.Label>베타 기능 사용</Switch.Label>
  <Switch.HiddenInput name="betaFeatures" />
</Switch.Root>
```

### 4. Form integration (FormData 제출)

Switch 는 `<form>` 에 네이티브하게 동작한다. `name`·`value`·`form` prop 으로 연결하고 HiddenInput 이 실제 값을 담는다.

```tsx
import { Switch } from "@seed-design/react";

function PreferencesForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // Switch 가 checked 상태일 때만 FormData 에 해당 name 이 포함됨.
    // value 미지정 시 기본값은 "on".
    const push      = data.get("push");         // "on" | null
    const marketing = data.get("marketing");    // "yes" | null  (value="yes" 지정)
    const dark      = data.get("darkMode");     // "on" | null

    console.log({ push: push === "on", marketing: marketing === "yes", dark: dark === "on" });
    // → { push: true, marketing: false, dark: true } 등
  }

  return (
    <form id="prefs-form" onSubmit={handleSubmit}>
      <Switch.Root size="32" tone="brand" defaultChecked form="prefs-form">
        <Switch.Control><Switch.Thumb /></Switch.Control>
        <Switch.Label>푸시 알림</Switch.Label>
        <Switch.HiddenInput name="push" />
      </Switch.Root>

      <Switch.Root size="32" tone="brand" form="prefs-form">
        <Switch.Control><Switch.Thumb /></Switch.Control>
        <Switch.Label>광고성 정보 수신</Switch.Label>
        {/* value 를 커스터마이즈해서 FormData 값 제어 */}
        <Switch.HiddenInput name="marketing" value="yes" />
      </Switch.Root>

      <Switch.Root size="24" tone="neutral" defaultChecked form="prefs-form">
        <Switch.Control><Switch.Thumb /></Switch.Control>
        <Switch.Label>다크 모드</Switch.Label>
        <Switch.HiddenInput name="darkMode" />
      </Switch.Root>

      <button type="submit">저장</button>
    </form>
  );
}
```

**제출 결과 설명**
- 각 Switch 가 `checked` 상태일 때 **해당 `name` 키만** FormData 에 포함된다 (체크되지 않은 체크박스와 동일한 브라우저 네이티브 동작).
- `value` 를 지정하지 않으면 `"on"` 이 들어간다 — 위 예제의 `push`, `darkMode` 는 `"on"` / `null`.
- `value="yes"` 로 지정한 `marketing` 은 `"yes"` / `null`.
- `form="prefs-form"` prop 은 `<Switch.Root>` 를 `<form>` DOM 바깥에 두더라도 해당 form 의 제출에 포함시키고 싶을 때 사용 (상세 바텀시트 안에 설정 토글이 있고 실제 폼은 바깥에 있을 때 등). form 내부에 위치하면 생략 가능.
- Switch 는 내부적으로 `<input type="checkbox">` 이므로 Zod · react-hook-form · server action 등 기존 폼 스택과 그대로 호환된다.
