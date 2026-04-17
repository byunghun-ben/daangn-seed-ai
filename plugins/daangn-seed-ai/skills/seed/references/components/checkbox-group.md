---
name: checkbox-group
upstream_sha: 1f1d21d
---

# CheckboxGroup

**정의** — 여러 `Checkbox` 아이템을 수직 방향으로 일정한 간격(`gapY`)으로 배치하는 **순수 레이아웃 wrapper**. 그룹 단위 선택 배열을 관리하지 않으며 개별 Checkbox가 독립적으로 controlled/uncontrolled 상태를 유지한다. `<fieldset>`/`<legend>`와 함께 묶어 접근성·폼 제출 편의를 확보하는 용도.

**import**
```ts
import { Checkbox } from "@seed-design/react";
// namespace: <Checkbox.Group>, <Checkbox.Root>. 또는 named export: `import { CheckboxGroup } from "@seed-design/react"`.
```

> **단일 Checkbox 본체** — 개별 아이템 props(`checked`/`defaultChecked`/`onCheckedChange`/`variant`/`tone`/`size`)는 [`./checkbox.md`](./checkbox.md) 참조.

---

## 언제 쓰나 / 언제 쓰지 않나

`Checkbox.Group`은 **gapY 간격 일관성 + fieldset 접근성 쌍**을 위한 레이아웃 도구다. 그룹 단위 상태 관리 기능은 **존재하지 않는다.**

| 상황 | 선택 |
|------|------|
| 여러 Checkbox를 동일 수직 간격(`$dimension.x1`)으로 묶기 | ✅ `Checkbox.Group` |
| `<legend>` 아래 여러 항목 그룹핑 (관심 카테고리, 약관 동의) | ✅ `Checkbox.Group` + `<fieldset>`/`<legend>` |
| 그룹 전체 선택값을 `string[]`로 controlled 하게 받기 | ❌ Group이 제공하지 않음. 사용자가 `useState<string[]>` 직접 관리 |
| 여러 항목 중 하나만 선택 | ❌ `RadioGroup` |
| 단일 on/off | ❌ 단일 [`Checkbox`](./checkbox.md) |

관련 결정 매트릭스: [`decision-matrices/which-input.md`](../decision-matrices/which-input.md)

---

## Anatomy

`CheckboxGroup`은 **`<div>` 하나**(flex-column + `gapY`)로 렌더된다. upstream 선언:

```ts
// packages/react/src/components/Checkbox/Checkbox.tsx:29-34
export interface CheckboxGroupProps
  extends CheckboxGroupVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const CheckboxGroup = withGroupContext<HTMLDivElement, CheckboxGroupProps>(Primitive.div);
```

즉, **layout wrapper** 역할만. 그룹 단위 선택 배열/초기값/변경 콜백 prop은 **존재하지 않는다.** 각 `Checkbox.Root`가 자신의 checked 상태를 독립 소유.

| Slot | 필수 | 역할 |
|------|------|------|
| `Checkbox.Group` | ✅ | `<div>` container. `gapY: $dimension.x1` flex-column 적용 |
| `Checkbox.Root` × N | ✅ | 개별 체크박스. 각자 `checked`/`defaultChecked`/`onCheckedChange` 소유 |
| `<fieldset>` | ✅ (접근성) | 그룹 경계 시맨틱. Group은 fieldset이 아니므로 외부 래핑 필요 |
| `<legend>` | ✅ (접근성) | fieldset 레이블. 숨김은 `VisuallyHidden` |

---

## Variants / Tokens / States

Group은 **variant·tone·size·weight prop이 없고**, **자체 상태도 갖지 않는다.** 유일한 토큰은 `gapY: $dimension.x1` (4px) 수직 간격으로, upstream `checkbox-group.yaml`에 정의된 단일 dimension. 아이템 시각 변형·체크/disabled/invalid 상태는 전부 개별 `Checkbox.Root`에서 처리한다(상세는 [`./checkbox.md`](./checkbox.md)). 전체 그룹 비활성화는 `<fieldset disabled>`, 그룹 에러는 `<fieldset aria-describedby>`로.

---

## Props

```ts
// upstream (Checkbox.tsx:29-32)
interface CheckboxGroupProps
  extends CheckboxGroupVariantProps,   // 빈 타입 (gapY 만 recipe 내부)
    PrimitiveProps,                    // asChild 지원
    React.HTMLAttributes<HTMLDivElement> {}
// 표준 div 속성만 — id, className, style, aria-*, onClick, ...
// 그룹 단위 value / 초기 배열 / 변경 콜백 prop 은 존재하지 않음 → 사용자 코드에서 직접 관리.
```

---

## 합성 규칙 · 접근성 (constraints)

- **layout wrapper에 불과** — Group은 gapY만 부여, 상태 동기화 하지 않음. 그룹 controlled 선택은 `useState<string[]>` + 각 `Checkbox.Root` `checked={selected.includes(value)}` + `onCheckedChange`로 사용자 코드에서. 상세는 [`./checkbox.md`](./checkbox.md).
- **`<fieldset>` + `<legend>` 필수** — Group은 `<div>`라 fieldset 시맨틱이 없으므로 외부 래핑으로 스크린 리더에 그룹 경계 인식시킨다. legend 숨김은 `VisuallyHidden`(DOM 제거 금지). 전체 비활성화는 `<fieldset disabled>`, 에러는 `<span id="err">` + `<fieldset aria-describedby="err">`로 연결.
- **폼 제출은 HiddenInput `name`+`value`** — 같은 `name` 공유 시 체크된 항목만 FormData에 담긴다. 키보드는 Tab 이동 + 스페이스바 토글(네이티브). "최소 1개 선택" 그룹 제약은 HTML required로 처리 불가 — submit 시 사용자 코드에서 배열 길이 검증.
- **아이콘은 `@karrotmarket/react-monochrome-icon`** (`@daangn/` prefix 없음). 단일 Checkbox(예: "전체 선택" 마스터)는 Group 바깥에서 단독 사용.

---

## Anti-patterns

```tsx
❌ // group-controlled API 기대 — 실제로는 작동하지 않음 (fabricated prop, 타입 에러)
<Checkbox.Group value={selected} onChange={setSelected}>
  {/* CheckboxGroup 은 <div> layout wrapper. 그룹 배열 관리·초기 선택 배열 prop 모두 없음 */}
  <Checkbox.Root>...</Checkbox.Root>
</Checkbox.Group>

❌ <Checkbox.Group><Checkbox.Root>...</Checkbox.Root></Checkbox.Group>
   {/* fieldset/legend 없음 — 스크린 리더가 그룹 인식 못 함 */}

❌ <Checkbox.Group tone="brand">...</Checkbox.Group>
   {/* variant/tone/size prop 자체가 없음 — 타입 에러 */}

❌ import Icon from "@daangn/react-monochrome-icon/IconCheckmarkFatFill";
   // 올바른 패키지는 @karrotmarket/react-monochrome-icon
```

---

## 예제 (minimum usage)

### 1. Uncontrolled — 각 Checkbox 에 `defaultChecked` 독립 부여

가장 단순한 패턴. 각 아이템이 자체 state를 관리하고, 폼 제출 시 HiddenInput이 값을 전송한다.

```tsx
import { Checkbox } from "@seed-design/react";
import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill";

export function NotificationSettings() {
  return (
    <fieldset>
      <legend>알림 수신 설정</legend>
      <Checkbox.Group>
        <Checkbox.Root defaultChecked>
          <Checkbox.Control>
            <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
          </Checkbox.Control>
          <Checkbox.Label>채팅 메시지 알림</Checkbox.Label>
          <Checkbox.HiddenInput name="notify" value="chat" />
        </Checkbox.Root>
        <Checkbox.Root>
          <Checkbox.Control>
            <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
          </Checkbox.Control>
          <Checkbox.Label>마케팅 정보 수신</Checkbox.Label>
          <Checkbox.HiddenInput name="notify" value="marketing" />
        </Checkbox.Root>
      </Checkbox.Group>
    </fieldset>
  );
}
```

- Group은 순수 레이아웃 — `gapY: $dimension.x1` 간격만 적용.
- 초기값은 개별 `defaultChecked`로. Group에 초기 선택 배열 prop은 없음.
- 같은 `name="notify"`를 공유하는 체크된 HiddenInput만 FormData에 포함.

---

### 2. Controlled — 사용자 코드에서 `useState<string[]>` 로 그룹 배열 관리

Group이 배열 상태를 제공하지 않으므로, **부모 컴포넌트가 직접 선택 배열을 관리**한다.

```tsx
import { useState } from "react";
import { Checkbox } from "@seed-design/react";
import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill";

const OPTIONS = [
  { label: "패션 · 잡화", value: "fashion" },
  { label: "가전 · 디지털", value: "electronics" },
  { label: "생활 · 가구", value: "living" },
];

export function CategoryFilter() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (v: string, on: boolean) =>
    setSelected((prev) => (on ? [...prev, v] : prev.filter((x) => x !== v)));

  return (
    <fieldset>
      <legend>관심 카테고리 (복수 선택)</legend>
      <Checkbox.Group>
        {OPTIONS.map((opt) => (
          <Checkbox.Root
            key={opt.value}
            checked={selected.includes(opt.value)}
            onCheckedChange={(on) => toggle(opt.value, on)}
          >
            <Checkbox.Control>
              <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
            </Checkbox.Control>
            <Checkbox.Label>{opt.label}</Checkbox.Label>
            <Checkbox.HiddenInput name="category" value={opt.value} />
          </Checkbox.Root>
        ))}
      </Checkbox.Group>
    </fieldset>
  );
}
```

- `selected` 배열은 부모 소유 — Group은 관여하지 않는다. 각 아이템 `onCheckedChange`가 배열을 토글.
- 폼 제출이 필요 없으면 HiddenInput의 `name` 생략 가능.

---

### 3. `<fieldset>` / `<legend>` + FormData 제출 (접근성 + 네이티브 동작)

Group 상태 없이도 브라우저 네이티브 FormData 규약으로 그룹 제출이 동작한다.

```tsx
import { Checkbox } from "@seed-design/react";
import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill";

const TERMS = [
  { v: "service", l: "(필수) 서비스 이용약관", req: true },
  { v: "privacy", l: "(필수) 개인정보 처리방침", req: true },
  { v: "marketing", l: "(선택) 마케팅 정보 수신" },
];

export const AgreementForm = () => (
  <form onSubmit={(e) => {
    e.preventDefault();
    console.log(new FormData(e.currentTarget).getAll("terms"));
    // → ["service", "privacy"] — 체크된 항목만
  }}>
    <fieldset aria-describedby="agreement-error">
      <legend>이용약관 동의</legend>
      <Checkbox.Group>
        {TERMS.map((t) => (
          <Checkbox.Root key={t.v} required={t.req}>
            <Checkbox.Control>
              <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
            </Checkbox.Control>
            <Checkbox.Label>{t.l}</Checkbox.Label>
            <Checkbox.HiddenInput name="terms" value={t.v} />
          </Checkbox.Root>
        ))}
      </Checkbox.Group>
      <span id="agreement-error" role="alert">필수 항목을 모두 동의해 주세요.</span>
    </fieldset>
    <button type="submit">가입하기</button>
  </form>
);
```

`<fieldset>`+`<legend>`가 그룹 경계/이름을 스크린 리더에 제공하고 `aria-describedby`로 에러 연결. "최소 1개 선택" 제약은 HTML required로 처리되지 않으므로 submit 시 사용자 코드에서 검증한다.

---

## 관련 문서

- [./checkbox.md](./checkbox.md) — 단일 Checkbox (Anatomy, variant/tone/size, indeterminate, controlled 패턴)
- [`./radio.md`](./radio.md) — 단일 선택 시 Radio/RadioGroup
- [`decision-matrices/which-input.md`](../decision-matrices/which-input.md) — 입력 컴포넌트 선택 기준
