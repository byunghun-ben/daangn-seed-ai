# Icon (slot container)

**정의** — 외부 아이콘 라이브러리에서 가져온 SVG를 Seed 디자인 시스템에 연결하는 **슬롯 컨테이너**. 아이콘 에셋 자체는 제공하지 않음 (Seed는 의도적으로 아이콘 라이브러리에 agnostic).

**import**
```ts
import { Icon, PrefixIcon, SuffixIcon, IconRequired } from "@seed-design/react";
```

> **중요** — 이 문서는 **아이콘 에셋이 아니라 슬롯 API**를 다룬다. 실제 SVG는 별도 라이브러리(`@karrotmarket/react-monochrome-icon` 또는 Lucide/Tabler 등)에서 가져온다. [BYO 가이드](#byo-bring-your-own-icon) 참조.

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 독립형 아이콘 (텍스트 없이 단독 렌더) | `<Icon svg={...} />` |
| 아이콘을 iconOnly 버튼 안에 (ActionButton 등) | `<Icon svg={...} />` (상위가 IconRequired 자동 가드) |
| 컴포넌트 **라벨 앞**에 아이콘 (버튼·콜아웃·스낵바·필드) | `<PrefixIcon svg={...} />` |
| 컴포넌트 **라벨 뒤**에 아이콘 (chevron·expand 표시) | `<SuffixIcon svg={...} />` |
| 장식용 이미지 (로고·일러스트) | ❌ Icon 아님. `<img>` 또는 전용 컴포넌트 |
| 상태 표시 뱃지 · 카테고리 칩 | ❌ Icon 아님. `Badge` / `Chip` |

관련 결정 매트릭스: `decision-matrices/composition.md` (아이콘 배치 규칙)

---

## Anatomy

세 가지 슬롯 컴포넌트 + 한 가지 가드 유틸리티.

| 컴포넌트 | 역할 | 자동 속성 | 주요 props |
|---------|------|-----------|-----------|
| `Icon` | 독립형 · iconOnly 슬롯 | `aria-hidden`, `className="seed-icon"` | `svg`, `size`, `color` |
| `PrefixIcon` | 라벨 앞 슬롯 (부모 컴포넌트가 sizing) | `aria-hidden`, `className="seed-prefix-icon"` | `svg` |
| `SuffixIcon` | 라벨 뒤 슬롯 (부모 컴포넌트가 sizing) | `aria-hidden`, `className="seed-suffix-icon"` | `svg` |
| `IconRequired` | iconOnly 버튼의 런타임 가드 (컴포넌트 소스에서 자동 부착) | — | `enabled`, `children` |

모두 Radix Slot 기반이라 **children을 그대로 렌더**한다 (wrapper DOM 없음). 즉 SVG의 외부 속성(`width`/`height`/`fill`)은 그대로 유지되며, Icon의 `size`/`color`는 CSS 변수(`--seed-icon-size`, `--seed-icon-color`)로 전달된다.

**주의** — `aria-hidden`이 자동으로 붙으므로 아이콘만으로 의미를 전달하면 스크린 리더에 안 읽힌다. iconOnly 버튼에는 **`aria-label`이 부모 쪽에 필수**.

---

## Size

`size` prop은 dimension 토큰을 받는다. 하드코딩된 px 금지.

| 토큰 | 값 | 전형적 사용처 |
|------|------|-------------|
| `x3` | 12px | 매우 작은 메타 정보 (시간 · 위치 미세 아이콘) |
| `x3_5` | 14px | 칩 · 인라인 라벨 |
| `x4` | **16px** | Callout prefixIcon · Snackbar prefixIcon · 작은 버튼 |
| `x5` | 20px | ActionButton medium prefixIcon · 리스트 항목 leading |
| `x6` | **24px** | ActionButton large iconOnly · 표준 툴바 아이콘 |
| `x7` | 28px | Fab · 큰 카드 leading |
| `x8` | 32px | 빈 상태(EmptyState) 일러스트 아이콘 |

**컴포넌트별 권장 크기** (상세는 각 컴포넌트 doc):

- Callout prefixIcon: **x4 (16px)**
- Snackbar prefixIcon: **x5 (20px)**
- ActionButton prefixIcon (size=medium): **x5 (20px)**
- ActionButton iconOnly (size=large): **x6 (24px)**
- TextField prefixIcon: **x5 (20px)**

부모 컴포넌트가 이미 sizing을 처리하면 `PrefixIcon`/`SuffixIcon`에 명시적 `size` 안 줘도 됨.

---

## Color

`color` prop은 semantic foreground 토큰을 받는다.

| 토큰 | 의미 |
|------|------|
| `fg.neutral` | 기본 (라벨과 동색) |
| `fg.neutral-muted` | 약함 (힌트 · 헬퍼) |
| `fg.brand` | 브랜드 강조 |
| `fg.critical` | 에러 상태 |
| `fg.positive` | 성공 상태 |
| `fg.warning` | 경고 상태 |
| `fg.informative` | 정보 상태 |
| `fg.disabled` | disabled 상태 (자동 적용) |

부모 컴포넌트의 state/variant가 슬롯 아이콘 색상을 내려주는 게 기본. `Icon`에 직접 `color`를 주는 경우는 **독립형 아이콘**이거나 **장식적 변형**을 원할 때뿐.

---

## Props

```ts
interface IconProps {
  svg: React.ReactNode;              // 외부 라이브러리의 아이콘 컴포넌트
  size?: DimensionToken;             // "x3" | "x4" | "x5" | "x6" | ...
  color?: ColorToken;                // "fg.neutral" | "fg.brand" | ...
}

interface PrefixIconProps { svg: React.ReactNode; }
interface SuffixIconProps { svg: React.ReactNode; }

interface IconRequiredProps {
  enabled: boolean;                  // iconOnly 조건일 때만 true
  children: React.ReactNode;
}
```

`Icon`은 내부적으로 `--seed-icon-size`와 `--seed-icon-color` CSS 변수를 전달하고 Radix Slot으로 children에 병합한다.

---

## IconRequired 가드 (런타임 검증)

`ActionButton` 같은 컴포넌트 소스에서 `layout="iconOnly"`일 때 자동으로 부착된다. 개발자가 직접 쓸 일은 없지만 **에러 메시지가 나오면 원인을 알아야 한다**:

런타임 에러 조건 (NODE_ENV !== 'production'):

1. `layout="iconOnly"` 하위에 `<Icon>` **0개**
   > "Icon-only Component must render `<Icon />` as a child. Check if you are using raw svg icon instead of `<Icon svg={} />`."
2. `layout="iconOnly"` 하위에 `<Icon>` **2개 이상**
   > "Icon-only Component must render only one `<Icon />` under children."
3. iconOnly가 iconOnly 안에 **중첩**
   > "Icon-only Component must not be nested within another Icon-Only."

해결: 항상 `<Icon svg={<LucideXxx />} />` 형태로 감싼 1개를 children에 넣고, iconOnly 중첩 금지.

---

## BYO (Bring Your Own) icon

Seed는 아이콘 에셋을 제공하지 않는다. 아래 중 하나를 선택:

### 당근 팀 (내부)

```bash
npm install @karrotmarket/react-monochrome-icon @karrotmarket/react-multicolor-icon
```

- GitHub Packages 인증 필요 (`.npmrc`에 `@karrotmarket:registry=https://npm.pkg.github.com`)
- 단색 300여 개 + 멀티컬러 일부
- 명명: `IconHeartFill`, `IconPlusLine`, `IconChevronRightFill` (형태명 기반)

### 외부 프로젝트

Seed 스타일과 가장 잘 맞는 순서:

1. **[Lucide](https://lucide.dev)** — stroke-based outline, 24px grid, stroke-width 조절 가능. **첫 번째 추천**.
2. **[Tabler Icons](https://tabler.io/icons)** — 유사한 outline 스타일, 아이콘 수 많음.
3. **[Phosphor](https://phosphoricons.com)** — Fill/Line/Duotone 변형 다수, Seed의 Fill/Line 구분에 대응 가능.

**선택 기준** (AI-slop을 피하려면):

- ✅ **Stroke-based (outline) 단색** — Seed 아이콘의 기본 스타일과 일치
- ✅ **24px grid 기준** 디자인 — sizing 토큰과 호환
- ✅ **일관된 stroke width** (1.5~2px 권장)
- ✅ **모서리 rounded** — 당근 로고의 부드러운 인상 반영
- ❌ 3D/isometric · 글로시 · 그라디언트 아이콘 (Seed 톤과 상충)
- ❌ 한 프로젝트에서 **여러 라이브러리 혼용 금지** (Lucide + Heroicons 섞으면 선굵기·corner radius 불일치)

---

## 접근성 (필수 조건)

- 모든 Icon 슬롯은 **`aria-hidden` 자동**. 의미 전달은 부모에서 `aria-label`로.
- `layout="iconOnly"` 버튼에 `aria-label` **필수** (IconRequired 가드와 별개로 ARIA 요건).
- 아이콘 색상으로만 상태 구분 금지 (색맹 접근성). 반드시 라벨·아이콘 형상 변경 병행.
  - 예: 에러는 `fg.critical` + ❌ 모양, 성공은 `fg.positive` + ✓ 모양.
- SVG `title` 요소 금지 (Icon이 `aria-hidden`을 붙이므로 무효화됨).

---

## Anti-patterns

```tsx
❌ <ActionButton layout="iconOnly" aria-label="검색">
     <svg viewBox="0 0 24 24">...</svg>
   </ActionButton>
   {/* raw SVG — IconRequired 런타임 에러 + Icon sizing/coloring 토큰 연결 안 됨 */}

❌ <PrefixIcon svg={<img src="/icons/heart.svg" />} />
   {/* <img>로 SVG 삽입 — Seed 컬러 토큰이 적용 안 됨, 크기도 CSS 변수로 제어 불가 */}

❌ <Callout prefixIcon="⚠️">경고 메시지</Callout>
   {/* emoji 아이콘 — 플랫폼별 렌더링 차이, Seed 컬러 토큰 미적용, aria 설계 깨짐 */}

❌ import { IconHeart } from "lucide-react";
   import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
   {/* 두 라이브러리 혼용 — stroke width·corner radius 불일치 → AI-slop */}

❌ <Icon svg={<IconSearch />} size="20px" />
   {/* 하드코딩 px — dimension 토큰(x5) 사용 */}

❌ <Icon svg={<IconHeart />} color="#ff4444" />
   {/* 하드코딩 hex — semantic 토큰(fg.critical) 사용 */}

❌ <ActionButton layout="iconOnly" aria-label="삭제">
     <Icon svg={<IconDelete />} />
     <Icon svg={<IconTrash />} />
   </ActionButton>
   {/* iconOnly 하위에 Icon 2개 — IconRequired 런타임 에러 */}

✅ <ActionButton layout="iconOnly" aria-label="검색">
     <Icon svg={<IconSearch />} />
   </ActionButton>

✅ <Callout tone="warning" prefixIcon={<PrefixIcon svg={<IconWarningFill />} />}>
     인증되지 않은 이메일입니다
   </Callout>

✅ <Icon svg={<IconHeartFill />} size="x5" color="fg.brand" />
```

---

## 예제

### 독립형 아이콘 (좋아요 카운트 옆)

```tsx
<Flex gap="x1" alignItems="center">
  <Icon svg={<IconHeartFill />} size="x4" color="fg.critical" />
  <Text color="fg.neutral-muted">24</Text>
</Flex>
```

### 버튼 앞 아이콘

```tsx
<ActionButton variant="neutralWeak" size="medium">
  <PrefixIcon svg={<IconPlusLine />} />
  항목 추가
</ActionButton>
```

### 리스트 항목 suffix chevron

```tsx
<ActionButton variant="ghost" flexGrow={1}>
  설정
  <SuffixIcon svg={<IconChevronRightLine />} />
</ActionButton>
```

### iconOnly 버튼 (검색)

```tsx
<ActionButton variant="ghost" layout="iconOnly" aria-label="검색">
  <Icon svg={<IconSearchLine />} />
</ActionButton>
```

### Snackbar status 아이콘 (Fill 권장)

```tsx
<Snackbar variant="positive">
  <PrefixIcon svg={<IconCheckmarkFill />} />
  저장되었습니다
</Snackbar>
```

### Lucide 사용 예 (외부 프로젝트)

```tsx
import { Icon, PrefixIcon } from "@seed-design/react";
import { Heart, Plus, ChevronRight, Search } from "lucide-react";

<Icon svg={<Heart fill="currentColor" />} size="x5" color="fg.brand" />
<PrefixIcon svg={<Plus />} />
<SuffixIcon svg={<ChevronRight />} />
```

Lucide 아이콘 이름은 파스칼 케이스 (`Heart`, `ChevronRight`). 한 프로젝트에 하나의 라이브러리만 고정.
