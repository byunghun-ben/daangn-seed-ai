# Avatar

**정의** — 사용자·상점의 프로필 이미지를 표시하는 컴포넌트. 완전한 원형(`cornerRadius: full`) · 로드 실패 시 fallback · 우하단 상태 badge 옵션을 표준화한다.

**import**
```ts
import { Avatar } from "@seed-design/react";
// namespace 사용: <Avatar.Root>, <Avatar.Image>, <Avatar.Fallback>, <Avatar.Badge>
// 여러 Avatar를 겹쳐 보이려면 Avatar.Stack — ./avatar-stack.md 참조
```

> **Stack 은 별도 문서** — 여러 Avatar를 "겹쳐" 표시하는 `Avatar.Stack`은 [`./avatar-stack.md`](./avatar-stack.md) 참조. 이 문서는 단일 Avatar만 다룬다.

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 사용자·상점 프로필 이미지 (댓글·리스트·상세·수정 화면) | **Avatar** (이 컴포넌트) |
| 여러 참여자 프로필을 겹쳐 보이기 (채팅방 참여자, 공저자) | `Avatar.Stack` ([`./avatar-stack.md`](./avatar-stack.md)) |
| 이미지가 없거나 로드 실패한 기본 placeholder | `Avatar` + `fallback={<IdentityPlaceholder.Root><IdentityPlaceholder.Image /></IdentityPlaceholder.Root>}` |
| 카테고리·상태 심벌 (원형 아이콘, 장식) | ❌ Avatar 아님. `Icon` / `Badge` |
| 상품·게시물 대표 이미지 (정사각·비정형) | ❌ Avatar 아님. `<img>` + 전용 카드 |
| 선택 가능한 프로필 토글 (다중 선택 UI) | ❌ Avatar 단독 아님. `Checkbox` / `ControlChip`와 조합 |

관련 결정 매트릭스: [`decision-matrices/composition.md`](../decision-matrices/composition.md)

---

## Anatomy

네 개의 슬롯으로 구성된다. `Root`가 sizing·stroke·cornerRadius를 담당하고, `Image`/`Fallback`은 이미지 로드 상태에 따라 자동 전환된다. `Badge`는 우하단 상태 점(온라인·인증 등)을 나타낸다.

| Slot | 필수 | 역할 |
|------|------|------|
| `Avatar.Root` | ✅ | 원형 컨테이너 (`cornerRadius: full`), size·strokeColor·strokeWidth 결정. `ref`는 `HTMLDivElement` |
| `Avatar.Image` | ✅ | 실제 이미지 (`<img>`). `src` · `alt` 전달. 로드 실패 시 자동으로 Fallback으로 교체 |
| `Avatar.Fallback` | ⚪ | `Image` 로드 실패·미지정 시 보여지는 대체 요소. 보통 `<IdentityPlaceholder.Root><IdentityPlaceholder.Image /></IdentityPlaceholder.Root>` · 이니셜 텍스트 |
| `Avatar.Badge` | ⚪ | 우하단 상태 표시 (온라인·인증·매너온도). `badgeMask` 모양 하나를 부모에서 설정. **size=20에서는 미지원** |

**중요**
- `Image` → `Fallback` 전환은 `@seed-design/react-image`의 `Image` primitive가 자동 처리. 개발자가 직접 `onError` 걸 필요 없음.
- `Badge`는 `badgeMask` 모양(circle·flower·shield)에 맞춰 Avatar 이미지 가장자리를 "파내는" 형태로 합성된다 → SVG mask가 적용되므로 Badge 안의 콘텐츠는 마스크 범위 안에서만 보인다.
- **size=20**에서는 물리적으로 badge를 얹을 공간이 부족해 `Avatar.Badge` 와 `badgeMask` prop 모두 무시된다 (런타임 경고).

---

## Size

Avatar는 **variant 개념이 없고 size가 유일한 축**이다. 10개 고정값만 허용 — 임의 px 하드코딩 금지.

| size | root size | stroke | badge 지원 | 대표 사용처 |
|------|-----------|--------|-----------|------------|
| `"20"` | 20px | 1px | ❌ | 댓글 작성자 인라인 |
| `"24"` | 24px | 1px | ✅ | 답글 프로필 |
| `"36"` | 36px | 1px | ✅ | 댓글 프로필 |
| `"42"` | 42px | 1px | ✅ | 게시글 상세 내 프로필 |
| `"48"` | 48px | 1px | ✅ | 작은 리스트 |
| `"56"` | 56px | 1px | ✅ | 큰 리스트 |
| `"64"` | 64px | 1px | ✅ | 프로필 상세 · 캐러셀 |
| `"80"` | 80px | 1px | ✅ | 프로필 카드 헤더 |
| `"96"` | 96px | 1px | ✅ | 프로필 상세 (대형) |
| `"108"` | 108px | 1px | ✅ | 프로필 수정 화면 |

> **10개 vs 8개 불일치 주의** — yaml schema(`variants.size.values`)에는 8개만 (20·24·36·42·48·56·64·108)만 명시돼 있지만 `definitions`에는 10개 모두(+ 80·96) 실제 토큰이 정의돼 있고, React 소스 `AvatarSize` 타입도 10개를 받는다. **10개 모두 사용 가능**.

### badge / badgeMask 오프셋 (size별)

Badge는 Avatar 크기에 따라 자동 스케일된다 (개발자가 offset 지정 X). 참고용 수치:

| size | badge size | badge offset | badgeMask size | badgeMask offset |
|------|-----------|-------------|----------------|------------------|
| 20 | — | — | — | — |
| 24 | 10px | 15px | 12px | 14px |
| 36 | 14px | 22px | 18px | 20px |
| 42 | 16px | 26px | 20px | 24px |
| 48 | 18px | 30px | 22px | 28px |
| 56 | 20px | 36px | 24px | 34px |
| 64 | 22px | 42px | 26px | 40px |
| 80 | 28px | 54px | 32px | 52px |
| 96 | 32px | 65px | 38px | 62px |
| 108 | 36px | 74px | 44px | 70px |

---

## States

Avatar는 인터랙티브 컴포넌트가 아니므로 pressed / disabled 상태가 없다. 유일한 상태는 **이미지 로드 성공 / 실패**.

| State | 트리거 | 시각 변화 |
|-------|--------|-----------|
| `enabled` (image loaded) | `src`에 유효한 이미지 응답 | `Image` 슬롯 렌더 |
| `enabled` (fallback) | `src` 없음 · 로드 실패 · 404 | `Fallback` 슬롯으로 자동 교체 |

**합성 시 interactive 상태**: Avatar를 `<a>` · `<button>` 안에 감싸면 부모의 focus ring이 적용된다. Avatar 자체에 pressed 상태는 없다.

---

## Token 매핑

yaml `definitions.base.enabled`에서 추출된 공통 토큰:

```
root:
  cornerRadius: $radius.full                 # 항상 원형 (size 상관없이)
  strokeColor:  $color.stroke.neutral-subtle # Avatar와 배경 경계선
  strokeWidth:  1px                          # 모든 size에서 동일

badge / badgeMask:
  size/offset: size마다 정해진 px (위 표 참조)
```

**주의 — 토큰 사용 원칙**
- `cornerRadius`는 `full` 고정. square/rounded Avatar 변형은 존재하지 않음.
- `strokeColor`는 `stroke.neutral-subtle` 고정 (다크모드 자동 대응). 직접 CSS 덮어쓰기 금지.
- Avatar 내부 Badge 배경색은 semantic color 토큰 (`bg.positive-solid` 등) 또는 palette 토큰 사용. 하드코딩 hex 금지.

---

## Props

```ts
import type * as React from "react";

// 1) Root ─ sizing · stroke · badgeMask 결정 (부모)
interface AvatarRootProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "20" | "24" | "36" | "42" | "48" | "56" | "64" | "80" | "96" | "108";  // default: "48"
  badgeMask?: "none" | "circle" | "flower" | "shield";  // default: "none" (mask 없음). size=20에서 무시됨
  asChild?: boolean;                            // default: false (Radix Slot 병합)
}

// 2) Image ─ 실제 <img> 속성
interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;                                 // 없거나 로드 실패 시 Fallback으로 전환
  alt?: string;                                 // default: ""
  asChild?: boolean;
}

// 3) Fallback ─ 로드 실패·미지정 시 렌더
interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;                   // 보통 <IdentityPlaceholder.Root><IdentityPlaceholder.Image /></IdentityPlaceholder.Root> 또는 이니셜
  asChild?: boolean;
}

// 4) Badge ─ 우하단 상태 마크
interface AvatarBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;                            // default: false. true면 자식을 Badge root로 승격
  children?: React.ReactNode;                   // 색 점·체크 아이콘·인증 SVG 등
}
```

**default 동작 요약**
- `size` 미지정 → `"48"` (yaml의 기본 variant).
- `badgeMask` 미지정 → `"none"` (upstream recipe default).
- `alt` 미지정 → 빈 문자열 (스크린 리더 건너뜀 — 의미 있는 이미지면 반드시 지정).
- `asChild={true}` → 자식 element를 그대로 root로 쓰며 className만 병합 (Radix Slot 규약).

---

## 합성 규칙 (composition)

- **Root · Image · Fallback · Badge는 반드시 한 Root 아래 있어야 한다** — `Avatar.Image` 단독 사용 금지. Slot Recipe Context가 sizing을 전달하는 구조이므로 고립된 슬롯은 css 적용이 안 된다.
- **Fallback 내부는 `IdentityPlaceholder` 우선** — Seed의 표준 기본 이미지. 직접 이니셜 텍스트를 넣을 수는 있으나 디자인 톤이 깨지기 쉽다.
- **Badge 내부**에는 원형 dot · SVG 마크만 넣는다. 텍스트·큰 아이콘은 마스크 밖으로 삐져나와 잘린다.
- **`asChild={true}` + `<Box>` / `<img>`** 패턴으로 Badge 콘텐츠 스타일링 권장 (예제 참조).
- **여러 Avatar 겹쳐 배치**는 손수 `margin-left: -x`를 주지 말고 `Avatar.Stack` 사용 ([`./avatar-stack.md`](./avatar-stack.md)).
- **클릭 가능한 프로필**은 Avatar를 `<a>` 또는 `<button>` 으로 감싼다 — Avatar 자체에 `onClick` 전달은 동작하지만 시맨틱하지 않다.

---

## 접근성

- `Avatar.Image`의 `alt`는 **의미 있는 이미지일 때 반드시 지정**. 프로필의 경우 보통 `alt="<사용자명>의 프로필"` 또는 맥락상 이름이 이미 노출되면 `alt=""` (중복 안내 방지).
- **장식용 Badge**에는 `aria-hidden` 자동 적용되지 않는다 — 순전히 시각 정보면 직접 `aria-hidden="true"` 부착. 의미가 있으면 (예: "본인 인증됨") 주변 텍스트나 `aria-label`로 그 뜻이 전달돼야 한다.
- **Fallback의 `<IdentityPlaceholder.Root><IdentityPlaceholder.Image /></IdentityPlaceholder.Root>`** 는 기본적으로 `aria-hidden`. 로드 실패 시 사용자에게 이름·이메일 등 다른 식별자가 보여지고 있는지 확인.
- **Color 단독 의미 전달 금지** — 녹색 Badge = 온라인 같은 매핑을 할 때 색만으로 상태를 전달하지 말고 `aria-label` 또는 보조 텍스트 병행 ("온라인").
- Avatar가 버튼 역할이면 (예: 클릭해서 프로필 모달 열기) 반드시 `<button>` 으로 감싸고 `aria-label` 지정. Avatar 자체를 `role="button"`으로 만들지 말 것.

---

## Anti-patterns

```tsx
❌ <img
     src="https://.../profile.jpg"
     style={{ width: 48, height: 48, borderRadius: '50%' }}
   />
   {/* <img> 직접 사용 — stroke/fallback/토큰 연결 없음, AI-slop 유발 */}

❌ <Avatar.Root style={{ width: 50, height: 50 }}>
     <Avatar.Image src={url} />
   </Avatar.Root>
   {/* size를 px로 하드코딩 — 10개 토큰 중 하나("48")로 지정할 것 */}

❌ <Avatar.Root size="20" badgeMask="circle">
     <Avatar.Image src={url} />
     <Avatar.Badge>
       <Box bg="palette.green600" borderRadius="full" width="x3" height="x3" />
     </Avatar.Badge>
   </Avatar.Root>
   {/* size=20에서는 badge/badgeMask 미지원 — 무시되거나 잘린다 */}

❌ <Avatar.Image src={url} />
   {/* Root 없이 Image만 — sizing context 없어 css 적용 안 됨 */}

❌ <Avatar.Root size="48" style={{ borderRadius: 8 }}>...</Avatar.Root>
   {/* cornerRadius는 full 고정 — square Avatar는 디자인 시스템에 없음 */}

❌ <Avatar.Root size="64">
     <Avatar.Image src={url} alt="사용자 프로필 사진" />
   </Avatar.Root>
   {/* 옆에 사용자 이름이 보이는 맥락이라면 중복 안내 — alt="" 로 */}

❌ <Avatar.Root size="64">
     <Avatar.Image src={url} />
     <Avatar.Fallback>김</Avatar.Fallback>
     <Avatar.Badge>
       <div style={{ background: '#4CAF50', borderRadius: '50%' }} />
     </Avatar.Badge>
   </Avatar.Root>
   {/* 배지 배경을 hex로 하드코딩 — palette/semantic 토큰 사용 */}

✅ <Avatar.Root size="48">
     <Avatar.Image src={user.avatarUrl} alt="" />
     <Avatar.Fallback><IdentityPlaceholder.Root identity="person"><IdentityPlaceholder.Image /></IdentityPlaceholder.Root></Avatar.Fallback>
   </Avatar.Root>

✅ <Avatar.Root size="64" badgeMask="circle">
     <Avatar.Image src={user.avatarUrl} alt="" />
     <Avatar.Fallback><IdentityPlaceholder.Root><IdentityPlaceholder.Image /></IdentityPlaceholder.Root></Avatar.Fallback>
     <Avatar.Badge asChild>
       <Box bg="bg.positive-solid" borderRadius="full" aria-label="온라인" />
     </Avatar.Badge>
   </Avatar.Root>
```

---

## 예제 (minimum usage)

### 1. 기본 사용 — 이미지만

```tsx
import { Avatar } from "@seed-design/react";

<Avatar.Root size="48">
  <Avatar.Image src={user.avatarUrl} alt="" />
</Avatar.Root>
```

### 2. Fallback 포함 (로드 실패 대비)

```tsx
import { Avatar } from "@seed-design/react";
import { IdentityPlaceholder } from "@seed-design/react";

<Avatar.Root size="64">
  <Avatar.Image src={user.avatarUrl} alt="" />
  <Avatar.Fallback>
    <IdentityPlaceholder.Root identity="person">
      <IdentityPlaceholder.Image />
    </IdentityPlaceholder.Root>
  </Avatar.Fallback>
</Avatar.Root>
```

`src`가 없거나 로드에 실패하면 `IdentityPlaceholder`로 자동 전환된다. 개발자가 `onError` 걸 필요 없음. `IdentityPlaceholder`는 namespace로만 export되므로 `.Root` + `.Image` 형태로 사용한다 (callable component 아님).

### 3. Badge 붙이기 (온라인 상태 표시)

```tsx
import { Avatar, Box } from "@seed-design/react";
import { IdentityPlaceholder } from "@seed-design/react";

<Avatar.Root size="64" badgeMask="circle">
  <Avatar.Image src={user.avatarUrl} alt="" />
  <Avatar.Fallback>
    <IdentityPlaceholder.Root>
      <IdentityPlaceholder.Image />
    </IdentityPlaceholder.Root>
  </Avatar.Fallback>
  <Avatar.Badge asChild>
    <Box bg="bg.positive-solid" borderRadius="full" aria-label="온라인" />
  </Avatar.Badge>
</Avatar.Root>
```

`badgeMask="circle"`이 Avatar 이미지 가장자리를 원형으로 "파내서" Badge가 깔끔히 얹히도록 한다. `flower` · `shield` mask는 당근 인증 배지 같은 특수 형상용.

### 4. 인증 Badge (custom SVG)

```tsx
<Avatar.Root size="80" badgeMask="shield">
  <Avatar.Image src={user.avatarUrl} alt="" />
  <Avatar.Fallback><IdentityPlaceholder.Root><IdentityPlaceholder.Image /></IdentityPlaceholder.Root></Avatar.Fallback>
  <Avatar.Badge asChild>
    <img src="/shield_blue_checkmark.svg" alt="본인 인증됨" />
  </Avatar.Badge>
</Avatar.Root>
```

Badge가 의미를 가지면 (인증 배지) `alt` / `aria-label` 로 그 의미를 전달한다.

### 5. 클릭 가능한 프로필 (Avatar를 버튼으로 감싸기)

```tsx
<button
  type="button"
  onClick={() => openProfile(user.id)}
  aria-label={`${user.name}의 프로필 보기`}
  style={{ border: 'none', background: 'transparent', padding: 0 }}
>
  <Avatar.Root size="56">
    <Avatar.Image src={user.avatarUrl} alt="" />
    <Avatar.Fallback><IdentityPlaceholder.Root><IdentityPlaceholder.Image /></IdentityPlaceholder.Root></Avatar.Fallback>
  </Avatar.Root>
</button>
```

Avatar 자체에 `role="button"`을 붙이지 말 것 — 네이티브 `<button>`을 외곽으로 감싸면 포커스·키보드 처리가 자동.
