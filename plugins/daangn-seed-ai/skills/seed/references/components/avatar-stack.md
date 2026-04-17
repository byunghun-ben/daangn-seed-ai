# Avatar.Stack

**정의** — 여러 `Avatar.Root`를 수평으로 겹쳐 쌓아 "그룹 멤버 미리보기"를 표현하는 네임스페이스 컴포넌트. `Avatar` 네임스페이스로 export되어 `Avatar.Stack`으로 사용한다.

**import**
```ts
import { Avatar } from "@seed-design/react";
// Avatar.Stack, Avatar.Root, Avatar.Image, Avatar.Fallback ...
```

> `AvatarStack`은 `Avatar` namespace 로 export (`Avatar.Stack`). 독립 import 불가.

관련 컴포넌트: [Avatar (단일)](./avatar.md)

---

## 언제 쓰나 / 언제 쓰지 않나

| 써야 함 | 대안 |
|---------|------|
| 채팅방·그룹 참여자 미리보기 (3~5명) | — |
| 게시글 좋아요 누른 사용자 프리뷰 | — |
| 팀/프로젝트 멤버 요약 표시 | — |
| 5명 초과 멤버를 표시해야 할 때 | `Avatar.Stack` + +N 카운트 Badge 병행 |
| 멤버 목록 전체를 보여줘야 할 때 | ❌ `Avatar.Stack` 아님. 전용 리스트 UI 사용 |
| 단일 프로필 이미지만 표시할 때 | ❌ `Avatar.Stack` 아님. `Avatar.Root` 직접 사용 |

---

## Anatomy

`Avatar.Stack`은 두 개의 slot으로 구성된다.

| Slot | 필수 | 역할 |
|------|------|------|
| `root` | ✅ | 전체 스택의 외부 컨테이너. 가로 방향 flex 레이아웃, `gap`(음수)으로 아이템 겹침 제어 |
| `item` | ✅ | 각 `Avatar.Root`를 감싸는 래퍼. `strokeWidth` · `cornerRadius`로 구분 테두리(ring) 표시 |

`item` slot의 `strokeColor`는 `$color.bg.layer-default`로 고정되어 배경색과 blend된 ring을 만든다. `item` slot의 `cornerRadius`는 `$radius.full`(원형)으로 고정.

---

## Size

`size` prop 하나로 `root.gap` · `item.strokeWidth` 모두 결정된다. **`Avatar.Stack` 안에서 개별 `Avatar.Root`에 별도 size를 지정하면 안 된다** — `AvatarStack`이 `PropsProvider`를 통해 size를 내려준다.

| size | Avatar 크기 | root gap | item strokeWidth | 대표 사용처 |
|------|-------------|----------|------------------|------------|
| `20` | 20px | -5px | 1px | 댓글 목록 작은 그룹 |
| `24` | 24px | -6px | 1px | 답글 프로필 그룹 |
| `36` | 36px | -8px | 2px | 댓글 프로필 그룹 |
| `42` | 42px | -10px | 2px | 게시글 상세 내 그룹 |
| `48` | 48px | -12px | 2px | 작은 리스트 그룹 |
| `56` | 56px | -13px | 3px | 큰 리스트 그룹 |
| `64` | 64px | -16px | 3px | 프로필 상세·캐러셀 |
| `80` | 80px | -20px | 4px | 대형 카드 |
| `96` | 96px | -24px | 5px | 팀 페이지 히어로 |
| `108` | 108px | -27px | 5px | 프로필 수정 화면 |

gap 값은 `avatar-stack.yaml` definitions 기준. strokeWidth 토큰은 `item.strokeWidth`.

---

## Props

```ts
interface AvatarStackProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 20 | 24 | 36 | 42 | 48 | 56 | 64 | 80 | 96 | 108;
  children: React.ReactNode; // Avatar.Root 요소들만 허용
}
```

`size` 기본값은 없음 — 반드시 명시한다. `AvatarStack`은 내부적으로 `PropsProvider`로 `size`를 모든 하위 `Avatar.Root`에 전달하므로 children에서 중복 지정 불필요.

---

## 합성 규칙 (composition)

- `children`에는 `<Avatar.Root>` 만 직접 전달한다. 다른 컴포넌트(`<div>`, `<span>`, `<Badge>` 등) 혼입 금지.
- **mixed size 금지** — `Avatar.Stack`에 `size` 를 주면 모든 자식에 동일 size가 자동 적용된다. 자식 `Avatar.Root`에 별도 `size` 를 넣으면 충돌하므로 지정하지 않는다.
- **3~5개 권장, 5 초과 시 +N 카운트 Badge 사용** — 5명 이상을 표시해야 하면 앞 3~4개 `Avatar.Root` + `+N` 텍스트 Badge를 Stack 옆에 배치한다.
- `Avatar.Stack` 자체는 인터랙션(클릭·포커스)을 제공하지 않는다. 탭 가능 컨테이너가 필요하면 `<button>`으로 래핑 후 `aria-label`을 부여한다.

---

## 접근성

- `Avatar.Stack`은 기본적으로 `<div>`를 렌더한다. 의미론적 역할이 없으므로 그룹을 설명하는 컨텍스트(라벨, 텍스트)를 근처에 배치한다.
- 각 `Avatar.Root` 이미지에 `alt` 속성을 제공한다. alt가 없으면 스크린 리더가 파일명을 읽는다.
  ```tsx
  <Avatar.Image src={src} alt="홍길동 프로필 이미지" />
  ```
- 5명 초과로 +N Badge를 표시할 경우, Badge에도 의미 있는 `aria-label`(`"외 5명"`) 을 추가한다.
- 탭 가능하게 만들어야 한다면 `<button>` 래핑 + `aria-label="멤버 5명 보기"` 패턴을 사용한다.

---

## Anti-patterns

```tsx
❌ <Avatar.Stack size={48}>
     <Avatar.Root size={36}>
       <Avatar.Image src={src1} alt="김철수" />
     </Avatar.Root>
   </Avatar.Stack>
   {/* children Avatar.Root 에 size 중복 지정 — PropsProvider size 와 충돌 */}

❌ <Avatar.Stack size={48}>
     <Avatar.Root>
       <Avatar.Image src={src1} alt="김철수" />
     </Avatar.Root>
     <Badge>+3</Badge>
   </Avatar.Stack>
   {/* Avatar.Root 가 아닌 다른 컴포넌트를 children 으로 전달 */}

❌ <Avatar.Stack size={48}>
     <Avatar.Root size={48}><Avatar.Image src={src1} alt="김철수" /></Avatar.Root>
     <Avatar.Root size={36}><Avatar.Image src={src2} alt="이영희" /></Avatar.Root>
   </Avatar.Stack>
   {/* stack 안에 서로 다른 size — mixed size 금지 */}
```

---

## 예제 (minimum usage)

### 기본 (3명 그룹)

```tsx
import { Avatar } from "@seed-design/react";

<Avatar.Stack size={48}>
  <Avatar.Root>
    <Avatar.Image src="/profiles/user1.jpg" alt="김철수 프로필" />
    <Avatar.Fallback />
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="/profiles/user2.jpg" alt="이영희 프로필" />
    <Avatar.Fallback />
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="/profiles/user3.jpg" alt="박민준 프로필" />
    <Avatar.Fallback />
  </Avatar.Root>
</Avatar.Stack>
```

### 오버플로 +N (5명 초과)

```tsx
import { Avatar, Badge } from "@seed-design/react";

const visibleUsers = users.slice(0, 4);
const overflowCount = users.length - visibleUsers.length;

<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <Avatar.Stack size={36}>
    {visibleUsers.map((user) => (
      <Avatar.Root key={user.id}>
        <Avatar.Image src={user.avatarUrl} alt={`${user.name} 프로필`} />
        <Avatar.Fallback />
      </Avatar.Root>
    ))}
  </Avatar.Stack>
  {overflowCount > 0 && (
    <Badge aria-label={`외 ${overflowCount}명`}>+{overflowCount}</Badge>
  )}
</div>
```
