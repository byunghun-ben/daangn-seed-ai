# Divider

**정의** — 콘텐츠 블록 간 **시각적 구분**을 주는 가로/세로 구분선. 기본은 의미 있는 `<hr />`, 장식용이면 `<div>`, 리스트 내부라면 `<li>`로 렌더링을 바꿔 **DOM 시맨틱을 호출 현장에 맞춘다**.

**import**
```ts
import { Divider } from "@seed-design/react";
```

---

## 언제 쓰나 / 언제 쓰지 않나

| 써야 함 | 대안 |
|---------|------|
| 다른 의미를 가진 콘텐츠 그룹을 시각적으로 가를 때 (예: 섹션 구분, 리스트 항목 사이) | — |
| Flex 레이아웃에서 수직 구분선으로 두 영역을 나눌 때 (예: 툴바 그룹) | `Divider orientation="vertical"` |
| 메뉴/리스트 내부 항목 사이 구분선 | `<Divider as="li" role="separator" />` |
| 단지 여백만 주고 싶을 때 | ❌ Divider 아님. `gap` / `margin` 토큰 사용 |
| 카드·섹션 외곽 경계를 그릴 때 | ❌ Divider 아님. 컴포넌트 자체의 `border`·`shadow` 사용 |
| 헤더·푸터 같은 구조적 경계 | ❌ Divider 아님. semantic HTML (`<header>`, `<footer>`) + 레이아웃 토큰 |
| 텍스트 강조 (줄긋기) | ❌ Divider 아님. Text · 색상 토큰으로 처리 |

---

## Anatomy

**slot 1개**. `as` 값에 따라 렌더링되는 실제 DOM 요소와 시맨틱이 달라진다.

| Slot | 필수 | 역할 |
|------|------|------|
| `root` | ✅ | 구분선 전체. `thickness` (default `1px`) 한 방향 border 로 그린다. |

렌더링 요소는 `as` 로 고른다:

| `as` 값 | 실제 DOM | 기본 시맨틱 | 주 용도 |
|---------|----------|------------|---------|
| `"hr"` (default) | `<hr>` | implicit `role="separator"` + 암묵적 `aria-orientation="horizontal"` | 의미 있는 섹션 구분 |
| `"div"` | `<div>` | 없음 (장식) | 시각적 장식만, SR 무시 |
| `"li"` | `<li>` | 리스트 아이템 — 구분선 시맨틱 없음 | 리스트 내부 구분선 (명시적 `role="separator"` 권장) |

내부적으로 `root` 는 `border-{bottom|right}-width: thickness` 로 한 변만 그어 선을 표현한다 (별도 shape 없음). 그래서 `color` 는 **border 계열(`stroke.*`) 토큰만** 의미가 있다.

---

## Orientation

### horizontal (기본)

```tsx
<VStack>
  <Box p="x4">섹션 A</Box>
  <Divider />
  <Box p="x4">섹션 B</Box>
</VStack>
```

- `border-bottom-width: thickness` 로 가로선을 그린다.
- `as="hr"` + `orientation="horizontal"` 은 `aria-orientation` 속성 **출력 안 함** (`<hr>` 의 기본값이 horizontal 이라 중복이라 브라우저가 처리).
- `inset` 활성화 시 좌우로 `margin: 0 16px` 가 붙어 **안쪽으로 들여쓰기**. 섹션 헤더 하단 등 컨테이너 패딩과 정렬하고 싶을 때 사용.

### vertical

```tsx
<HStack height="x16">
  <Box flexGrow />
  <Divider orientation="vertical" />
  <Box flexGrow />
</HStack>
```

- `border-right-width: thickness` 로 세로선을 그린다.
- **반드시 Flex 컨테이너 안에서 써야 한다** — 선의 높이는 부모의 cross-axis 로 결정된다. 일반 block flow 에서는 높이 0 이라 안 보인다.
- `as="hr"` + `orientation="vertical"` 이면 `aria-orientation="vertical"` 을 **자동 부착** (기본값이 아니라 명시적으로 선언).
- `inset` 활성화 시 상하로 `margin: 16px 0`.

> `inset` 은 orientation 에 맞춰 **수직/수평 양쪽 margin 중 한 방향만** 찍힌다. Flex vertical divider 에 `inset` 을 쓰면 상하 margin 이 부모의 `align-items: stretch` 와 충돌할 수 있으니 주의.

---

## Props

```ts
interface DividerProps extends Omit<React.HTMLAttributes<HTMLHRElement>, "color"> {
  /**
   * 렌더링할 HTML 요소.
   * - "hr": 의미 있는 구분선 (SR이 "수평/수직 분할선"으로 읽음)
   * - "div": 장식적 요소 (SR이 무시)
   * - "li": 리스트 내부 구분선 (명시적 role="separator" 권장)
   * @default "hr"
   */
  as?: "hr" | "div" | "li";

  /**
   * 선 색상. stroke.* 계열 semantic 토큰만 사용.
   * @default "stroke.neutralMuted"
   */
  color?: BoxProps["borderColor"];

  /**
   * 선 두께. dimension 또는 number(px).
   * @default 1
   */
  thickness?: BoxProps["borderWidth"];

  /**
   * 방향. "vertical" 은 Flex 컨테이너 안에서만 의미가 있음.
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * 들여쓰기 여부. true 면 orientation 에 맞춰 한 축에 16px margin 이 붙음.
   * @default false
   */
  inset?: boolean;
}
```

| Prop | 기본값 | 비고 |
|------|--------|------|
| `as` | `"hr"` | 대부분 기본 유지. 장식/리스트일 때만 바꿈 |
| `color` | `"stroke.neutralMuted"` | `fg.*` 토큰 금지 (전경 토큰은 border 의미론과 맞지 않음) |
| `thickness` | `1` (px) | dimension 토큰 사용 권장. 하드코딩 px 지양 |
| `orientation` | `"horizontal"` | vertical 은 Flex 필수 |
| `inset` | `false` | horizontal 이면 좌우 16px, vertical 이면 상하 16px |
| `role` | — | 기본값 없음. `as !== "hr"` 이고 의미 부여가 필요하면 `role="separator"` 수동 지정 |
| `aria-orientation` | — | `as="hr"` + `orientation="vertical"` 일 때만 자동 부착. 그 외에는 `role="separator"` 를 준 경우 자동 부착 |

나머지 표준 HTML 속성은 `<hr>` 의 HTMLAttributes 그대로 pass-through (`className`, `id`, `style`, `data-*` 등). **단 `color` 는 충돌 방지를 위해 의도적으로 제외**되어 CSS color 가 아니라 Seed 토큰 prop 로 바인딩된다.

---

## 합성 규칙 (composition)

- **리스트 내부**(`<ul>`/`<ol>`/`<menu>`) 에서는 `as="li"` 를 쓴다. `<ul>` 자식이 `<hr>` 이면 invalid HTML + SR 이 리스트 길이를 잘못 센다.
- **`orientation="vertical"` 은 Flex (HStack/Row) 내부에서만**. Block flow 에 두면 높이가 0 이라 화면에 안 보인다.
- **`color` 는 `stroke.*` 계열 semantic 토큰만** 사용. `fg.*` (전경) 이나 `bg.*` (배경) 을 border 에 쓰면 토큰 의미론이 깨진다.
- **`thickness` 는 dimension 토큰 또는 1-2px** 로 제한. 굵은 분리는 섹션 배경(`bg.layer*`) 이나 컴포넌트 경계로 표현한다.
- Callout·Card·BottomSheet 등 **이미 경계가 있는 컴포넌트 내부**에 Divider 를 넣을 때는 `color="stroke.neutralMuted"` (default) 유지. 진한 `stroke.neutral` 은 이중 경계처럼 보인다.

---

## 접근성 (스크린리더 동작)

Divider 의 스크린리더 행동은 **`as` 값에 전적으로 달려 있다**. 세 가지 케이스를 구분해 적용해야 한다.

- **(a) `as="hr"` — 의미 있는 구분선 (default)**
  - `<hr>` 은 HTML 표준상 implicit `role="separator"` 를 가진다. SR 은 "수평 분할선"(horizontal) 또는 "수직 분할선"(vertical) 으로 읽는다.
  - `orientation="horizontal"` 은 `<hr>` 의 기본 축이라 `aria-orientation` 을 **출력하지 않는다** (중복 제거, DOM 이 깔끔).
  - `orientation="vertical"` 이면 `aria-orientation="vertical"` 을 **자동 부착** — 기본값과 달라진 순간 명시가 필요하기 때문.
  - 사용 시점: 섹션 간 **시맨틱 구분**을 SR 사용자도 인식해야 할 때 (설정 화면 그룹, 폼 섹션 경계 등).

- **(b) `as="div"` — 장식적 요소**
  - `<div>` 는 implicit role 이 없다. SR 은 이 요소를 **완전히 무시**한다.
  - `role` / `aria-*` 를 **추가하면 안 된다** — 장식에 의미를 부여하는 건 SR 사용자에게 노이즈를 만든다.
  - 사용 시점: 순수 시각적 구분만 필요한 경우 (카드 내부 헤더/본문 분리, 레이아웃 리듬 유지 등). 콘텐츠 구조가 SR 에게도 이미 명확하다면 Divider 를 굳이 시맨틱하게 만들 필요 없음.

- **(c) `as="li"` — 리스트 내부 구분선**
  - `<li>` 의 기본 role 은 `listitem`. 아무 설정 없이 두면 SR 이 **"X 개 중 N 번째 항목"** 이라고 읽으며 구분선을 콘텐츠로 오인한다.
  - 반드시 `role="separator"` 를 **명시적으로** 지정해 리스트 아이템이 아니라 구분자임을 알린다. Divider 내부 로직은 `as !== "hr"` + `role="separator"` 조합일 때만 `aria-orientation` 을 자동 부착한다.
  - `<ul>` / `<ol>` 의 직계 자식은 `<li>` 여야 HTML 이 유효하다. 리스트 안에 `<hr>` 을 두면 브라우저마다 파싱이 다르고, SR 이 리스트 길이를 잘못 센다.
  - 사용 시점: 메뉴·옵션 리스트·네비게이션 그룹 내부에서 논리적으로 다른 묶음을 가를 때.

요약:

| `as` | role | `aria-orientation` 출력 조건 | SR 동작 |
|------|------|----------------------------|---------|
| `"hr"` | implicit `separator` | `orientation==="vertical"` 일 때만 자동 | "수평/수직 분할선" |
| `"div"` | 없음 | 안 붙음 | 완전 무시 |
| `"li"` | `listitem` (기본) → `"separator"` 수동 | `role="separator"` 를 준 경우에만 자동 | 구분자로 읽힘 (`role` 없으면 리스트 항목으로 오인) |

---

## Anti-patterns

```tsx
❌ <ul>
     <li>항목 A</li>
     <Divider />  {/* as="hr" 기본 → <ul> 직계 자식이 <hr> 이라 invalid HTML */}
     <li>항목 B</li>
   </ul>

❌ <Divider as="hr" />
   {/* 카드 내부 순수 장식용 구분선인데 <hr> 유지 → SR 이 불필요하게 "분할선" 읽음 */}

❌ <HStack>
     <Box>A</Box>
     <Divider orientation="vertical" inset />
     <Box>B</Box>
   </HStack>
   {/* vertical + inset: 상하 16px margin 이 stretch 와 겹쳐 선이 컨테이너를 넘치거나 잘림 */}

❌ <Divider color="fg.neutral" />
   {/* fg.* 는 전경 토큰 — border 의미론 위반. stroke.* 를 써야 토큰 교체(테마) 시에도 올바르게 갱신 */}

❌ <Divider color="#E0E0E0" thickness="2px" />
   {/* 하드코딩된 hex + 하드코딩 px — 다크모드/테마 분기 안 됨 */}

❌ <Box p="x4">
     <Divider orientation="vertical" />  {/* Flex 가 아닌 block 컨테이너 안 — 높이 0 이라 안 보임 */}
   </Box>

❌ <Divider as="li" />
   {/* 리스트 내부 의도가 있으나 role="separator" 누락 → SR 이 "리스트의 빈 항목" 으로 잘못 읽음 */}

✅ <ul>
     <li>항목 A</li>
     <Divider as="li" role="separator" />
     <li>항목 B</li>
   </ul>

✅ <Box borderRadius="card" bg="bg.layerDefault">
     <Box p="x4">헤더</Box>
     <Divider as="div" />  {/* 카드 내부 장식만 필요 → SR 무시 */}
     <Box p="x4">본문</Box>
   </Box>

✅ <HStack height="x8">
     <Box flexGrow />
     <Divider orientation="vertical" />  {/* Flex + vertical, inset 생략 */}
     <Box flexGrow />
   </HStack>
```

---

## 예제 (minimum usage)

### 기본 horizontal

```tsx
import { Divider, VStack, Box } from "@seed-design/react";

<VStack width="full" bg="bg.layerDefault" p="x4">
  <Box p="x4">
    이메일 인증이 필요합니다. 가입 시 사용한 이메일로 인증 링크를 보냈어요.
  </Box>
  <Divider />
  <Box p="x4">
    인증을 마치면 전체 기능을 사용할 수 있어요.
  </Box>
</VStack>
```

### vertical in Flex

```tsx
import { Divider, HStack, Box } from "@seed-design/react";

<HStack bg="bg.layerDefault" height="x16" gap="x4">
  <Box flexGrow />
  <Divider orientation="vertical" />
  <Box flexGrow />
</HStack>
```

`HStack` (= `display: flex; flex-direction: row`) 안이라 divider 높이가 부모의 `height="x16"` 에 맞춰 자동으로 채워진다.

### list inset (as="li")

```tsx
import { Divider, Box } from "@seed-design/react";

<ul>
  <li><Box p="x4">알림 설정</Box></li>
  <Divider as="li" role="separator" inset />
  <li><Box p="x4">차단 목록</Box></li>
  <li><Box p="x4">개인정보</Box></li>
  <Divider as="li" role="separator" inset />
  <li><Box p="x4">로그아웃</Box></li>
</ul>
```

- `as="li"` 로 `<ul>` 의 유효한 직계 자식이 되도록.
- `role="separator"` 로 SR 에게 **리스트 항목이 아니라 구분자**임을 전달.
- `inset` 으로 좌우 16px 들여쓰기 — 리스트 컨테이너의 기본 패딩과 시각적으로 정렬.
