# NotificationBadge

**정의** — 아이콘·탭·메뉴 등 다른 UI 요소에 겹쳐 붙어 **"읽지 않음 · 미확인 신호"** 를 전달하는 작은 마커. 텍스트 라벨(상태 분류)이 아니라 **존재 여부** 가 핵심 정보다.

**import**
```ts
import { NotificationBadge, NotificationBadgePositioner } from "@seed-design/react";
```

> **중요** — 상태를 "분류" 해서 보여주는 용도라면 `Badge` 를 쓴다 (예: "NEW", "품절"). NotificationBadge 는 **카운트/도트로 미확인 신호** 만 전달하며, 부모 요소의 **우상단에 고정 부착** 되는 것이 기본 동작이다.

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 탭 · 메뉴 아이콘에 "읽지 않은 알림 N개" 표시 | `<NotificationBadge size="large">3</NotificationBadge>` in Positioner |
| 아이콘 우상단에 "새 항목 있음" 도트 하나 | `<NotificationBadge size="small" />` in Positioner |
| "NEW" · "품절" · "인기" 같은 **상태 분류 라벨** | ❌ NotificationBadge 아님. [`./badge.md`](./badge.md) (Badge) |
| "3명 참여 중" 같은 **메타 정보 카운트** | ❌ NotificationBadge 아님. Badge 또는 Text |
| 카테고리 태그 · 필터 칩 | ❌ NotificationBadge 아님. Chip |
| 버튼 내부 라벨 장식 | ❌ NotificationBadge 아님. PrefixIcon / Badge |
| 절대 좌표로 임의 위치에 배지를 띄우고 싶을 때 | ❌ 금지. Positioner 로 부모 요소에 부착 |

**Badge vs NotificationBadge 핵심 차이**:

| 축 | Badge | NotificationBadge |
|----|-------|-------------------|
| 목적 | 객체의 **속성·상태 분류** (텍스트 라벨) | **미확인 신호** (수/존재 여부) |
| 위치 | 인라인 (텍스트 흐름 안) | 부모 요소 **우상단 부착** (Positioner) |
| 색상 | tone 6종 (neutral/brand/informative/positive/warning/critical) | brand-solid **고정** |
| 크기 | small/medium | large (라벨 포함) / small (6px 도트) |
| 라벨 | 필수 (텍스트) | large 만 가능, small 은 없음 |

관련 결정 매트릭스: `decision-matrices/composition.md`

---

## Anatomy

NotificationBadge 시스템은 **2개의 export** 로 구성된다. 배지 본체와 위치 지정자를 분리해서, 합성 규칙을 명확히 강제한다.

### NotificationBadge (배지 본체)

| Slot | 필수 | 역할 |
|------|------|------|
| `root` | ✅ | 외부 컨테이너 (브랜드 배경 · 원형) |
| `label` | ⚪ | 카운트 텍스트 (size=large 에서만, static-white) |

### NotificationBadgePositioner (부착 앵커)

| Slot | 필수 | 역할 |
|------|------|------|
| `root` | ✅ | **자기 자신이 `position: absolute`인 span 앵커**. `attach`/`size` variant로 부모 기준 우상단(또는 텍스트 옆) 좌표를 계산. size를 PropsProvider로 자식 NotificationBadge에 전파. |

Positioner는 배지 본체를 `children` 으로 감싸 `position: absolute`로 배치하는 **앵커 래퍼**다. 따라서 **Positioner 자체는 외부 `position: relative` 컨테이너(icon 또는 text를 렌더하는 부모) 안에 배치되어야 한다**. Positioner가 icon을 wrap하지 않는다 — icon과 Positioner는 형제이며, 공통 relative 부모 안에서 Positioner가 자동으로 우상단에 앵커링된다.

---

## Size

NotificationBadge 는 **2개 사이즈** 를 제공한다. 도트(small) 와 라벨형(large) 은 역할이 다르다.

| Size | 용도 | 치수 | 라벨 | 토큰 |
|------|------|------|------|------|
| `large` | 구체적 카운트/상태 (예: "3", "99+") | minHeight **18px** · paddingX `x1` · paddingY 0 | 가능 (필수는 아님) | fontSize `t1` · lineHeight `t1` · fontWeight `bold` |
| `small` | 도트 (존재 여부만) | **6×6px** 원형 | **불가** | — |

공통: `cornerRadius: $radius.full`, root bg: `$color.bg.brand-solid`, label color: `$color.palette.static-white`.

Positioner 의 부착 오프셋 (부모 우상단 기준 절대 좌표):

| Size | attach=icon | attach=text |
|------|-------------|-------------|
| large | insetEnd 8px · insetTop 14px | gap 2px |
| small | insetEnd 7px · insetTop 7px | gap 2px |

**size 선택 기준**:
- 숫자/카운트 정보가 필요하면 **large**.
- 존재 여부만 중요하고 공간이 제한되면 **small**.
- "0" 은 **표시하지 않는다** (배지 자체를 렌더 안 함).

---

## Props

```ts
// NotificationBadge — 배지 본체
interface NotificationBadgeProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {
  size?: "small" | "large";  // 기본 "large". Positioner 안에서는 생략 권장 (Positioner 에서 상속)
  // children: 라벨 텍스트 (size=large 에서만 의미 있음)
}

// NotificationBadgePositioner — 부착 래퍼
interface NotificationBadgePositionerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {
  attach?: "icon" | "text";  // 기본 "icon". 아이콘 우상단 or 텍스트 옆
  size?: "small" | "large";  // 기본 "large". 내부 NotificationBadge 에 자동 상속
}
```

- `NotificationBadge` 는 **size variant 만** 가진다. 색상/형태는 전부 고정.
- `NotificationBadgePositioner` 는 **attach + size** 2개 variant. PropsProvider 로 자식 NotificationBadge 에 size 를 전파한다.
- 두 컴포넌트 모두 `span` 요소로 렌더 (Radix Primitive).

---

## 합성 규칙 (composition)

- **Positioner 필수** — 아이콘/탭 우상단에 부착할 때는 **반드시** `NotificationBadgePositioner` 로 감싼다. 직접 절대 좌표를 지정하지 않는다.
- **Positioner는 `position: absolute`** — CSS recipe 상 `position: absolute; top/right` 로 배치된다. 따라서 **부착 대상(icon/text)을 감싸는 공통 부모는 `position: relative`** 여야 한다. `<button>` · `<div>` 등이 이 역할.
- **children = NotificationBadge 만** — Positioner는 배지만 children으로 받는다. Icon/Text는 **Positioner 바깥**, relative 부모 안의 형제로 배치한다.
  ```tsx
  <button style={{ position: "relative" }} aria-label="알림 3개">
    <Icon svg={<IconBellLine />} size="x6" />
    <NotificationBadgePositioner attach="icon" size="large">
      <NotificationBadge>3</NotificationBadge>
    </NotificationBadgePositioner>
  </button>
  ```
- **Badge 와 혼용 금지** — 같은 요소에 Badge(상태 라벨)와 NotificationBadge(미확인 신호)를 동시에 붙이지 않는다. 둘의 의미 축이 달라 사용자 혼란을 유발한다.
- **라벨 길이 제한** — size=large 의 label 은 **2자리 이내** 권장. 100 이상은 `"99+"` 로 표기 (공간·가독성 둘 다 보호).
- **small 에는 텍스트 없음** — `<NotificationBadge size="small">3</NotificationBadge>` 처럼 쓰지 않는다. 도트는 존재 여부만 전달.
- **0 은 숨김** — 카운트가 0이면 배지 자체를 조건부 렌더하지 않는다 (`{count > 0 && <NotificationBadge>{count}</NotificationBadge>}`).
- **위치 고정** — 우상단 부착이 기본이다. 좌상단 · 중앙 등 커스텀 좌표는 **금지** (시각적 충돌·일관성 훼손).
- **한 화면 남용 금지** — 동일 화면에 여러 NotificationBadge 가 보이면 주의 신호가 희석된다. **우선순위 높은 알림에만** 사용.

---

## 접근성 (constraints, not suggestions)

- NotificationBadge 는 **시각 신호** 다. 숫자만으로 의미를 전달하면 스크린 리더 사용자에게 누락될 수 있다.
  - 부모 버튼/링크에 `aria-label="알림 (읽지 않음 3개)"` 처럼 **상태를 포함한 라벨** 을 붙인다.
  - 또는 `<span className="sr-only">읽지 않은 알림 3개</span>` 를 숨겨서 추가.
- 배지 자체는 장식적으로 취급하고, **의미 전달은 부모 요소의 aria 속성** 이 담당.
- 색상(brand-solid 빨강 계열)만으로 상태를 구분하지 않도록, **숫자 또는 `aria-label`** 로 보조한다.
- `aria-hidden="true"` 를 배지 자체에 붙이는 것도 선택지 (부모에 aria-label 이 있다면 배지를 숨겨서 중복 읽기 방지).

---

## Anti-patterns

```tsx
❌ <div style={{ position: "absolute", top: 0, right: 0 }}>
     <NotificationBadge>3</NotificationBadge>
   </div>
   {/* Positioner 없이 수동 절대 좌표 — 오프셋 불일치, 토큰 연결 끊김 */}

❌ <NotificationBadgePositioner size="small">
     <Icon svg={<IconBellLine />} />
     <NotificationBadge size="small">3</NotificationBadge>
   </NotificationBadgePositioner>
   {/* Positioner children 에 Icon 을 넣음 — Positioner 자체가 absolute 라 Icon 도 앵커 위치로 튕겨 나감. Icon 은 형제로 분리해야 함. */}

❌ <NotificationBadgePositioner attach="icon" size="large">
     <NotificationBadge>3</NotificationBadge>
   </NotificationBadgePositioner>
   {/* 외부 relative 컨테이너 없음 — Positioner 가 잘못된 조상에 앵커링됨 */}

❌ <NotificationBadgePositioner attach="icon">
     <NotificationBadge>NEW</NotificationBadge>
   </NotificationBadgePositioner>
   {/* 상태 라벨("NEW")을 NotificationBadge 로 — 이건 Badge 의 역할 */}

❌ <div style={{ position: "relative" }}>
     <Icon svg={<IconBellLine />} />
     <Badge tone="critical">긴급</Badge>
     <NotificationBadgePositioner attach="icon"><NotificationBadge>3</NotificationBadge></NotificationBadgePositioner>
   </div>
   {/* Badge + NotificationBadge 혼용 — 의미 축 충돌 */}

❌ <NotificationBadge>9999</NotificationBadge>
   {/* 4자리 이상 — 레이아웃 깨짐. "99+" 로 표기 */}

❌ {count === 0 && <NotificationBadge>0</NotificationBadge>}
   {/* 0 을 표시 — 미확인이 없으면 배지 자체를 렌더하지 않는다 */}

✅ <button style={{ position: "relative" }} aria-label="알림 있음">
     <Icon svg={<IconBellLine />} size="x6" />
     <NotificationBadgePositioner attach="icon" size="small">
       <NotificationBadge />
     </NotificationBadgePositioner>
   </button>

✅ <button style={{ position: "relative" }} aria-label={`메일 ${count}개`}>
     <Icon svg={<IconMailLine />} size="x6" />
     <NotificationBadgePositioner attach="icon" size="large">
       <NotificationBadge>{count > 99 ? "99+" : count}</NotificationBadge>
     </NotificationBadgePositioner>
   </button>
```

---

## 예제 (minimum usage)

### 아이콘 위 small 도트 (읽지 않음 존재 신호)

```tsx
import { NotificationBadge, NotificationBadgePositioner, Icon } from "@seed-design/react";
import { IconBellLine } from "@karrotmarket/react-monochrome-icon";

<button style={{ position: "relative" }} aria-label="알림 (읽지 않음 있음)">
  <Icon svg={<IconBellLine />} size="x6" />
  <NotificationBadgePositioner attach="icon" size="small">
    <NotificationBadge />
  </NotificationBadgePositioner>
</button>
```

`<button>` 이 `position: relative` 를 가져야 Positioner 의 `absolute` 좌표가 버튼 우상단 기준으로 계산된다.

### 탭 위 large 카운트 (읽지 않은 메시지 수)

```tsx
import { NotificationBadge, NotificationBadgePositioner, Icon } from "@seed-design/react";
import { IconChatLine } from "@karrotmarket/react-monochrome-icon";

function ChatTab({ unreadCount }: { unreadCount: number }) {
  const ariaLabel =
    unreadCount > 0 ? `채팅 (읽지 않음 ${unreadCount}개)` : "채팅";
  const display = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <button style={{ position: "relative" }} aria-label={ariaLabel}>
      <Icon svg={<IconChatLine />} size="x6" />
      {unreadCount > 0 && (
        <NotificationBadgePositioner attach="icon" size="large">
          <NotificationBadge>{display}</NotificationBadge>
        </NotificationBadgePositioner>
      )}
    </button>
  );
}
```

### 텍스트 옆 도트 (메뉴 항목의 미확인 신호)

```tsx
<span style={{ position: "relative", display: "inline-flex" }}>
  <Text>공지사항</Text>
  <NotificationBadgePositioner attach="text" size="small">
    <NotificationBadge />
  </NotificationBadgePositioner>
</span>
```

`attach="text"` 는 텍스트 오른쪽 끝에서 오프셋 2px 만큼 우측으로 이동한다. 부모가 `position: relative` + `inline-flex` (또는 `inline-block`) 이어야 한다.
