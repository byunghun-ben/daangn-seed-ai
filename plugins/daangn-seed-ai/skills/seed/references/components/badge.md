# Badge

**정의** — 객체의 속성이나 상태를 시각적으로 표현하는 작은 텍스트 라벨. 사용자의 주의를 끌고 콘텐츠의 빠른 인지와 탐색을 돕는다.

**import**
```ts
import { Badge } from "@seed-design/react";
```

> **주의** — `NotificationBadge`(숫자형 알림 점/카운터)와는 별개 컴포넌트. Badge는 **텍스트 라벨 기반 상태 표현**에만 쓴다.

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 객체의 상태·속성·카테고리를 텍스트로 라벨링 ("NEW", "거절됨", "베타") | **Badge** (이 컴포넌트) |
| 미확인 알림 개수·빨간 점 표시 | `NotificationBadge` |
| 선택 가능한(토글) 태그 | `Chip` / `ControlChip` |
| 일회성 액션을 트리거하는 버튼 | `ActionButton` |
| 이미지·일러스트 라벨 (긴 문장·마케팅 카피) | `Callout` 또는 일반 `Text` |

---

## Anatomy

| Slot | 필수 | 역할 |
|------|------|------|
| `root` | ✅ | `<span>` 컨테이너. 배경·보더·cornerRadius·padding 관리 |
| `label` | ✅ | 내부 텍스트 `<span>`. fontSize·fontWeight·color 관리 |

`<span>` 기반이라 인라인 텍스트 흐름에 자연스럽게 섞인다. 블록 레이아웃이 필요하면 부모에서 `Flex`로 감싼다.

---

## Variants

Badge는 **variant**(시각 강도) × **tone**(의미 색상) 2축으로 조합된다. variant 3개 × tone 6개 = **18조합**. 여기에 `size` 2개까지 곱하면 36조합이지만, size는 문맥·밀도에 따른 축이라 2D 매트릭스는 variant×tone만 본다.

### `variant`

| 값 | 의미 | 사용처 |
|-----|------|--------|
| `solid` | 채워진 배경 | **배경이 복잡하거나 이미지 위에 Badge가 겹치는 경우.** 대비가 확실해야 할 때. |
| `outline` | 테두리만, 배경 투명 | **중간 정도의 주목도**가 필요한 본문 또는 상세 화면. |
| `weak` | 옅은 배경 + 강한 전경 | **반복적인 구조**(리스트·카드 그리드)에서 사용. 배경색이 있는 환경에는 비권장. |

### `tone`

yaml `schema.tone` 은 5개만 정의돼 있으나, `definitions` 에는 `brand` 포함 6개 조합이 모두 존재한다. React `BadgeVariantProps` 도 6개 tone을 실제로 지원한다 → **6개 tone 을 사실상 기준**으로 본다.

| 값 | 의미 | 사용처 |
|-----|------|--------|
| `neutral` | 상태가 특별히 없거나 **상태값이 명확하지 않은 초기 상태** | 카테고리·일반 태그·기본 라벨 |
| `brand` | 브랜드(당근) 색 강조 | 브랜드 프로모션 라벨, 당근 전용 기능 표시 |
| `informative` | 정보성 상태 | **베타 기능 안내**, 사용자 권한 제한, 정보 기반 메시지 |
| `positive` | 긍정·완료 상태 | **완료, 적용됨, 승인됨, 발행됨**, 저장 성공, 검토 통과 |
| `warning` | 주의·잠재 문제 | **만료 임박, 제출 누락, 필수 정보 부족** 등 잠재적 문제 상태 |
| `critical` | 부정·실패·차단 상태 | **검수 거절, 제재 상태, 편집 불가**, 유효성 검증 실패 |

---

## Variant × Tone 매트릭스

각 셀은 해당 조합의 **대표 토큰**을 보여준다. solid=배경, outline=stroke, weak=배경(투명인 tone은 fg). 실제 라벨 색은 별도 (아래 "fg 매핑 참고" 블록).

| variant \\ tone | neutral | brand | informative | positive | warning | critical |
|---|---|---|---|---|---|---|
| **solid** | `palette.gray-800` | `bg.brand-solid` | `bg.informative-solid` | `bg.positive-solid` | `bg.warning-solid` | `bg.critical-solid` |
| **outline** | `stroke.neutral-muted` | `stroke.brand-weak` | `stroke.informative-weak` | `stroke.positive-weak` | `stroke.warning-weak` | `stroke.critical-weak` |
| **weak** | `bg.neutral-weak` | `bg.brand-weak` | `bg.informative-weak` | `bg.positive-weak` | `bg.warning-weak` | `bg.critical-weak` |

**라벨(fg) 매핑 참고**:

```
solid    → label: palette.static-white (warning 은 palette.static-black-alpha-900, neutral 은 fg.neutral-inverted)
outline  → label: fg.{tone} (neutral 은 fg.neutral-muted)
weak     → label: fg.{tone}-contrast (neutral 은 fg.neutral-muted)
```

> **왜 warning solid 만 검정 글씨인가** — 노란/오렌지 계열 bg 위에서 흰 글씨는 AA 명도대비(4.5:1)를 통과하지 못한다. Seed는 `palette.static-black-alpha-900` 으로 명시적 override 한다.

---

## Size

| 값 | minHeight | fontSize | paddingX | cornerRadius | 사용 맥락 |
|-----|-----------|----------|----------|--------------|-----------|
| `large` | `x6` (24px) | `t2` | `x2` (8px) | `r1_5` | 카드 메인 타이틀 옆, 독립 배지 |
| `medium` | `x5` (20px) | `t1` | `x1_5` (6px) | `r1` | 리스트 항목, 카드 메타 영역, 인라인 태그 |

픽셀 값은 기본 스케일(1rem=16px) 기준. 실제 값은 토큰 resolve 를 통해 결정되며, **하드코딩 px 금지**.

paddingY: large=`x1`(4px), medium=`x0_5`(2px).

---

## Truncating

Badge 는 긴 텍스트를 **자동으로 말줄임(ellipsis) 처리**한다.

| size | maxWidth |
|------|---------|
| `medium` | `6.75rem` (108px) |
| `large` | `7.5rem` (120px) |

- 10글자 이상 · 한글 섞인 길이에서 cut-off 발생.
- CSS `text-overflow: ellipsis` + `white-space: nowrap` + `overflow: hidden` 조합 자동 적용.
- **긴 문장을 Badge 로 표현하지 말 것** — 2~6자 권장. 넘치는 경우 Callout·Text 로 대체.

---

## Props

```ts
interface BadgeProps extends BadgeVariantProps, PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {
  size?: "medium" | "large";           // default: "medium"
  variant?: "solid" | "outline" | "weak"; // default: "weak"
  tone?: "neutral" | "brand" | "informative" | "positive" | "warning" | "critical"; // default: "neutral"
  children: React.ReactNode;           // 라벨 텍스트
}
```

- 내부적으로 `@seed-design/react-primitive` 의 `Primitive.span` 기반 → `asChild` 패턴 지원.
- 별도 `onClick` 액션이 필요하면 **Badge 대신 ActionButton/Chip 사용** (Badge는 비인터랙티브 상태 표시용).

---

## 합성 규칙 (composition)

- **`NotificationBadge` 와 혼용 금지** — `NotificationBadge` 는 숫자/점 기반 알림 카운터, Badge 는 텍스트 라벨 상태 표시. 같은 DOM 위치에 두 종류가 겹치면 의미가 모호해진다.
- **같은 줄에 Badge 3개 이상 금지** — 시각 소음이 커지고 중요도 구분이 사라진다. 2개까지만 허용하고, 그 이상이면 Chip 그룹 또는 텍스트 요약으로 대체.
- **`tone` 은 실제 상태를 반영해야 한다** — `positive=성공/승인`, `critical=거절/차단`, `neutral=기본/미정`. "예쁘니까 brand solid" 같은 장식적 선택 금지.
- **인터랙티브 요소 내부 배치** — Badge 자체는 non-interactive. 카드 헤더·리스트 항목 안에 넣어 **부모가 클릭**되는 구조로 설계.
- **배경색 있는 컨테이너에서 `weak` 금지** — `weak` variant 는 투명도 기반이라 컬러 배경 위에서 색이 왜곡된다. 해당 경우 `solid` 로 전환.

---

## 접근성

- Badge 텍스트는 스크린 리더가 그대로 읽는다. 축약어(`"R"`, `"✓"`)만으로 의미 전달 금지 — 최소 2글자 이상의 명확한 라벨 사용.
- **색상 단독으로 상태 구분 금지** — `tone` 만으로 positive/critical 을 구분하면 색맹 사용자가 판독 불가. 텍스트 라벨 자체가 의미를 담아야 한다 (예: "승인됨" / "거절됨").
- `<span>` 기반이므로 포커스 대상이 아니다. 포커스가 필요하면 Chip/Button 을 고려.
- 라벨 텍스트에 이모지만 넣지 말 것 — 플랫폼별 렌더링 편차·AT 호환성 문제.

---

## Anti-patterns

```tsx
❌ <Badge tone="positive" variant="solid">✓</Badge>
   {/* 기호 하나만 — 스크린 리더가 "체크"로 읽지 않음, 의미 불명확 */}

❌ <Flex>
     <Badge tone="brand">브랜드</Badge>
     <Badge tone="positive">완료</Badge>
     <Badge tone="informative">베타</Badge>
     <Badge tone="warning">임박</Badge>
   </Flex>
   {/* 한 줄에 Badge 4개 — 시각 과부하, 중요도 구분 실패 */}

❌ <Card style={{ backgroundColor: "#fff3e0" }}>
     <Badge tone="warning" variant="weak">주의</Badge>
   </Card>
   {/* 컬러 배경 위 weak — 반투명 bg 가 배경과 섞여 색 왜곡 */}

✅ <Badge tone="positive" variant="weak">승인됨</Badge>

✅ <Card>
     <Badge tone="warning" variant="solid">만료 임박</Badge>
   </Card>
```

---

## 예제 (minimum usage)

### 기본 — 카테고리 라벨 (neutral weak)

```tsx
<Badge tone="neutral" variant="weak">
  중고거래
</Badge>
```

### 브랜드 강조 (brand solid)

```tsx
<Badge tone="brand" variant="solid" size="large">
  당근 프로
</Badge>
```

### 긴 텍스트 — 자동 말줄임

```tsx
<Badge tone="warning" variant="weak" size="medium">
  만료까지 3일 남았습니다
</Badge>
{/* maxWidth 6.75rem 에서 자동 ellipsis: "만료까지 3일 남…" */}
```
