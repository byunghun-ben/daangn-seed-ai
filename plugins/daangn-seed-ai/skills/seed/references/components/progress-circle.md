# ProgressCircle

**정의** — 원형 로딩·진행률 인디케이터. `value` prop의 유무로 **indeterminate(무한 회전 스피너)** 과 **determinate(정확한 진행률)** 두 모드를 가진다. 작업이 진행 중임을 알리거나, 완료까지 남은 진척도를 시각화할 때 쓴다.

**import**
```ts
import { ProgressCircle } from "@seed-design/react";
// namespace 사용: <ProgressCircle.Root>, <ProgressCircle.Track>, <ProgressCircle.Range>
```

> **중요** — `indeterminate`는 **React prop이 아니다**. `value`를 생략(또는 `undefined`)하면 자동으로 indeterminate 모드(회전 스피너), 숫자를 넘기면 determinate 모드(진행률 채움)로 전환된다. CSS variant 토큰은 이 `data-progress-state` 상태를 기준으로 자동 적용된다.

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 네트워크 요청·저장 등 **짧은 대기 시간** 스피너 (끝 예측 불가) | `ProgressCircle.Root` (value 생략 → indeterminate) |
| 업로드·다운로드·설치처럼 **정확한 진행률**(0~100%)을 보여줄 수 있을 때 | `ProgressCircle.Root value={n}` (determinate) |
| **화면 전체를 덮는 로딩 오버레이** (검은 배경 위 흰 스피너) | `size="40" tone="staticWhite"` |
| **버튼/카드 내부**에 작은 스피너 | `size="24" tone="neutral"` |
| 리스트·카드의 **데이터 shape 플레이스홀더** (레이아웃 프리뷰) | ❌ ProgressCircle 아님. [`./skeleton.md`](./skeleton.md) |
| "NEW" · "품절" 같은 **상태 라벨** | ❌ ProgressCircle 아님. [`./badge.md`](./badge.md) |
| 탭 · 아이콘의 **미확인 알림 표시** | ❌ ProgressCircle 아님. [`./notification-badge.md`](./notification-badge.md) |
| 가로 막대형 진행률 | ❌ ProgressCircle 아님. (별도 `Progress` 막대가 필요하면 팀에 요청) |

### Skeleton vs ProgressCircle (loading 축의 3분할)

동일하게 "로딩 중"을 전달하지만 목적 축이 다르다 — 섞어 쓰지 않는다.

| 목적 | 선택 |
|------|------|
| **데이터 shape 유지 + 레이아웃 프리뷰** (목록·카드·상세의 골격을 미리 보여줌) | [`Skeleton`](./skeleton.md) |
| **작업/로딩 상태 표시** (shape 없음, 끝 예측 불가) | `ProgressCircle` indeterminate (value 생략) |
| **정확한 진행률 표시** (0~100%, 끝이 보임) | `ProgressCircle` determinate (value 지정) |

관련 결정 매트릭스: [`decision-matrices/which-overlay.md`](../decision-matrices/which-overlay.md) (로딩·피드백 채널 선택 기준 포함)

---

## Anatomy

3개의 slot이 **반드시 함께** 쓰인다. Root는 `<svg>`, Track/Range는 `<circle>`.

| Slot | 필수 | 역할 |
|------|------|------|
| `ProgressCircle.Root` | ✅ | `<svg>` 컨테이너. size·tone variant로 Track/Range에 `--size`·`--thickness`를 전파. `value` 유무로 indeterminate/determinate 모드 결정 + `role="progressbar"`·`aria-value*` 자동 부착. `ref`: `SVGSVGElement` |
| `ProgressCircle.Track` | ✅ | 배경 원(`<circle>`). 전체 둘레를 흐린 색으로 그리며 "아직 진행되지 않은 부분"을 시각화 |
| `ProgressCircle.Range` | ✅ | 진행 호(`<circle>`). determinate는 `value`에 비례한 원호, indeterminate는 회전 스피너. `strokeDasharray`/`strokeDashoffset`으로 길이 제어 |

Track/Range는 `Track → Range` 순서로 선언한다 (나중 것이 위에 올라옴). 세 slot 모두 필수이며 하나라도 빠지면 의도된 시각이 깨진다.

---

## Variants

### `size`

| 값 | root size | thickness | 사용 맥락 |
|-----|-----------|-----------|-----------|
| `"24"` | 24px | 3px | **특정 요소 안에서 사용** — 버튼·리스트·인라인 |
| `"40"` | 40px | 5px | **전체 페이지 로딩** — 오버레이·빈 화면 중앙 |

### `tone`

| 값 | track | range | 사용 맥락 |
|-----|-------|-------|-----------|
| `"neutral"` | `palette.gray-200` | `palette.gray-500` | 가장 보편적. 로딩 인식이 스타일보다 중요할 때 |
| `"brand"` | `palette.carrot-200` | `bg.brand-solid` | 온보딩·주요 전환점 등 브랜드 강조 |
| `"staticWhite"` | `palette.static-white-alpha-300` | `palette.static-white` | **어두운 오버레이 위 전용** — 밝은 배경 금지 |

### `indeterminate` (자동 결정, React prop 아님)

YAML/CSS에는 `indeterminate=true` / `indeterminate=false` 두 variant가 있지만, **React API에는 `indeterminate` prop이 없다**. `value` 유무로 자동 전환된다.

| 조건 | 모드 | `data-progress-state` | 적용 토큰 |
|------|------|-----------------------|------------|
| `value` 생략 or `undefined` | **indeterminate** (회전 스피너) | `"indeterminate"` | `indeterminate=true` |
| `value={n}` | **determinate** (진행률 채움) | `"loading"` (n<max) / `"complete"` (n===max) | `indeterminate=false` |

---

## Animation tokens

Range slot에 상태별로 다른 애니메이션 토큰이 바인딩된다.

### indeterminate=true (스피너 회전)

| 토큰 | 값 | 역할 |
|------|-----|------|
| `lengthDuration` | `1.2s` | 호 길이가 늘어났다 줄어드는 주기 |
| `rotateDuration` | `1.2s` | 원 전체 한 바퀴 회전 주기 |
| `headTimingFunction` | `cubic-bezier(0.35, 0, 0.65, 1)` | 호 앞쪽 끝 가속 |
| `tailTimingFunction` | `cubic-bezier(0.35, 0, 0.65, 0.6)` | 호 뒤쪽 끝 감속 |
| `rotateTimingFunction` | `cubic-bezier(0.35, 0.25, 0.65, 0.75)` | 전체 회전 easing |

head/tail이 각각 다른 bezier로 움직여야 머티리얼 스타일의 "늘어났다 줄어드는 스피너"가 된다 — CSS로 덮어쓰지 말 것.

### indeterminate=false (진행률 전환)

| 토큰 | 값 | 역할 |
|------|-----|------|
| `lengthDuration` | `300ms` | `value` 변경 시 호 길이 전환 시간 |
| `lengthTimingFunction` | `cubic-bezier(0, 0, 0.15, 1)` | 전환 easing (느리게 정착) |

`value`가 바뀔 때마다 호 길이가 300ms 동안 이 easing으로 이어지므로, 빠르게 여러 단계를 건너뛰어도 튀지 않는다.

---

## Props

```ts
// Root ─ value·min·max·size·tone을 받는 컨테이너
interface ProgressCircleRootProps extends React.SVGAttributes<SVGSVGElement> {
  value?: number;         // 생략 → indeterminate(스피너). 숫자 → determinate. 범위 [minValue, maxValue]
  minValue?: number;      // default: 0
  maxValue?: number;      // default: 100
  size?: "24" | "40";     // default: "40"
  tone?: "neutral" | "brand" | "staticWhite"; // default: "neutral"
  asChild?: boolean;
}

// Track / Range ─ 추가 prop 없음 (SVG circle 속성 + asChild)
interface ProgressCircleTrackProps extends React.SVGAttributes<SVGCircleElement> { asChild?: boolean; }
interface ProgressCircleRangeProps extends React.SVGAttributes<SVGCircleElement> { asChild?: boolean; }
```

**값 범위 주의** — `value`는 기본적으로 **0~100** 스케일이다 (`maxValue` 기본값 100). 0~1 비율로 전달하려면 `<ProgressCircle.Root value={0.4} minValue={0} maxValue={1}>` 처럼 `maxValue`까지 같이 넘긴다. 그대로 `value={0.4}`만 주면 0.4%로 해석되어 거의 비어 보인다.

---

## 합성 규칙 (composition)

- **세 slot은 한 묶음** — `Root > Track + Range` 구조 필수. Track 없이 Range만 쓰면 진행률 비교 기준이 사라진다.
- **Root는 `<svg>`** — `<button>` 안에 인라인으로 넣을 때는 부모를 `inline-flex` 로 감싸 정렬을 맞춘다.
- **staticWhite는 어두운 배경 전용** — 흰 배경 위에서는 대비 부족으로 거의 안 보인다. 풀스크린 오버레이 안에만 배치.
- **size=24는 인라인, size=40은 페이지 로딩** — 사이 크기는 없다.
- **ActionButton `loading`은 자동 스피너** — 버튼에 `loading` prop을 주면 내부적으로 size=24 ProgressCircle이 렌더되므로 수동으로 끼워 넣지 않는다.
- **determinate는 value를 주기적으로 갱신** — 2~3초 이상 멈추면 "멈춘 건가?" 의심 → indeterminate가 낫다.
- **한 화면에 하나만** — 여러 스피너는 주의 초점을 희석. 각 카드 로딩은 Skeleton으로 대체한다.

---

## 접근성 (constraints, not suggestions)

- **Root는 `role="progressbar"` + `aria-valuemin`/`aria-valuemax` 자동 부착** (headless hook). 직접 `role`을 덮어쓰지 말 것.
- **determinate**: `aria-valuenow` 가 `value` 와 자동 동기화. 스크린 리더는 "progressbar, 40 percent" 로 읽는다. 맥락 라벨은 부모에 `aria-label="업로드 진행률"` 로 붙인다.
- **indeterminate**: `aria-valuenow` 대신 `aria-valuetext="loading..."` 만 설정된다. 명시적 의미 전달을 위해 **부모 요소에 `aria-busy="true"` + `aria-label="로딩 중"`** (또는 맥락 라벨)을 권장:
  ```tsx
  <div role="status" aria-busy="true" aria-label="메시지를 불러오는 중">
    <ProgressCircle.Root><ProgressCircle.Track /><ProgressCircle.Range /></ProgressCircle.Root>
  </div>
  ```
- **tone=staticWhite 대비** — 어두운 배경 위에서만 WCAG 대비를 만족. 밝은 배경에서는 `aria-label`이 있어도 시각 정보가 전달되지 않는다.
- **색만으로 의미 전달 금지** — 의미는 주변 텍스트 또는 `aria-label` 이 담당.
- **완료 알림** — determinate가 100%가 되어도 스크린 리더에 자동 공지되지 않는다. 별도 `role="status"` 텍스트/Snackbar로 알린다.

---

## Anti-patterns

```tsx
❌ <ProgressCircle.Root indeterminate={true}>…</ProgressCircle.Root>
   {/* indeterminate는 prop이 아님 — value 생략으로 자동 전환 */}

❌ <ProgressCircle.Root value={0.4}>…</ProgressCircle.Root>
   {/* maxValue 기본이 100이라 0.4% 로 해석됨 → 거의 비어 보임.
       0~1 스케일을 쓰려면 maxValue={1} 도 함께 지정 */}

❌ <ProgressCircle.Root tone="staticWhite">…</ProgressCircle.Root>
   {/* 밝은 배경 위 staticWhite — 대비 부족. 어두운 오버레이 안에만 */}

❌ <ProgressCircle.Root size="40" style={{ width: 60, height: 60 }}>…</ProgressCircle.Root>
   {/* size를 px로 덮어쓰기 — 24/40 두 토큰만 허용 */}

❌ <ProgressCircle.Root><ProgressCircle.Range /></ProgressCircle.Root>
   {/* Track 없이 Range만 — 진행률 비교 기준 상실 */}

❌ <ActionButton loading>
     <ProgressCircle.Root size="24"><ProgressCircle.Track /><ProgressCircle.Range /></ProgressCircle.Root>
     저장
   </ActionButton>
   {/* ActionButton loading은 내부 스피너 자동 렌더 — 중복 금지 */}

❌ <ProgressCircle.Root role="status">…</ProgressCircle.Root>
   {/* role 덮어쓰기 — progressbar 가 이미 자동 부착 */}

✅ <div role="status" aria-busy="true" aria-label="불러오는 중">
     <ProgressCircle.Root size="40" tone="neutral">
       <ProgressCircle.Track />
       <ProgressCircle.Range />
     </ProgressCircle.Root>
   </div>

✅ <ProgressCircle.Root value={uploaded} maxValue={total} aria-label="업로드 진행률">
     <ProgressCircle.Track />
     <ProgressCircle.Range />
   </ProgressCircle.Root>
```

---

## 예제 (minimum usage)

### 1. indeterminate 스피너 (버튼 내부 인라인)

```tsx
import { ProgressCircle } from "@seed-design/react";

<span aria-busy="true" aria-label="저장 중">
  <ProgressCircle.Root size="24" tone="neutral">
    <ProgressCircle.Track />
    <ProgressCircle.Range />
  </ProgressCircle.Root>
</span>
```

`value`를 생략하면 자동으로 indeterminate 모드 (회전 스피너). `size="24"`는 버튼·리스트 내부에 맞는 크기. 부모에 `aria-busy` 와 `aria-label` 을 붙여 스크린 리더에 맥락을 전달한다.

### 2. determinate 진행률 (파일 업로드)

```tsx
import { ProgressCircle } from "@seed-design/react";

function UploadProgress({ uploadedBytes, totalBytes }: { uploadedBytes: number; totalBytes: number }) {
  return (
    <ProgressCircle.Root size="40" tone="brand" value={uploadedBytes} maxValue={totalBytes} aria-label="업로드 진행률">
      <ProgressCircle.Track />
      <ProgressCircle.Range />
    </ProgressCircle.Root>
  );
}
```

`value`에 현재 값, `maxValue`에 총량을 주면 `aria-valuenow` / `aria-valuemax` 가 자동 동기화되어 스크린 리더가 "progressbar, 40 percent" 처럼 읽는다. 300ms easing으로 `value` 변화가 부드럽게 이어진다.

### 3. 풀스크린 오버레이 (어두운 배경 위 staticWhite)

```tsx
import { ProgressCircle } from "@seed-design/react";

const overlayStyle = {
  position: "fixed", inset: 0,
  background: "rgba(0, 0, 0, 0.6)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000,
} as const;

<div role="status" aria-busy="true" aria-label="처리 중" style={overlayStyle}>
  <ProgressCircle.Root size="40" tone="staticWhite">
    <ProgressCircle.Track />
    <ProgressCircle.Range />
  </ProgressCircle.Root>
</div>
```

`tone="staticWhite"`는 어두운 반투명 오버레이 위에서만 충분한 대비를 확보한다.
