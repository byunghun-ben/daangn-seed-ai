---
project: daangn-seed-ai
source_issues: ["#14"]
cluster: 1G · Feedback & loading
created: 2026-04-17
status: confirmed
upstream_sha: 1f1d21d
---

# Plan: Tier 1 · Cluster 1G — Feedback & Loading (6 components)

## 스코프 명시

- 이 plan은 **#14 Tier 1 core high-frequency components** epic의 **cluster 1G만** 다룬다.
- 1G = `inline-banner`, `page-banner`, `content-placeholder`, `skeleton`, `progress-circle`, `typography` (6개).
- 이전 cluster(1F — Avatar/Badge/Divider 등)는 이미 완료되어 `components/` 디렉토리에 존재.
- 이후 cluster(1H 이상)는 별도 ralph run으로 처리. 본 plan에서 제외.

## 요구사항 (What needs to be true when done)

1. `plugins/daangn-seed-ai/skills/seed/references/components/` 아래 6개 신규 MD 파일 존재
   - `inline-banner.md` (deprecated 마커 포함), `page-banner.md`, `content-placeholder.md`, `skeleton.md`, `progress-circle.md`, `typography.md`
2. 각 MD는 `_template.md` 패턴을 따르고 upstream YAML의 slot/variant/state를 누락 없이 반영.
3. React import 경로는 `/tmp/seed-design-sync/packages/react/src/components/*`의 실제 exported API와 일치.
4. `references/index.md`가 갱신되어 6개 신규 컴포넌트가 트리에 포함되고 커버리지 섹션이 업데이트됨.
5. `decision-matrices/which-overlay.md`의 `InlineBanner` 행에 `deprecated` 표기 추가.
6. `node scripts/sync-from-seed.mjs`를 실행하면 6개가 `not-ported`에서 사라진다 (자동 감지, 코드 수정 불필요).
7. 빌드/린트 에러 없음 (본 레포는 MD only — 기존 lint 스크립트 통과).

---

## 주요 설계 결정 (Design decisions locked before execution)

### D1 — `inline-banner`는 포팅하되 deprecated 마커 필수

- upstream YAML(`inline-banner.yaml:6`)에 `deprecated: Use Page Banner instead.` 명시.
- 결정: **포팅한다.** 이유:
  1. React package에 여전히 export되어 실사용 코드가 존재할 가능성.
  2. sync 스크립트가 YAML을 기준으로 "ported/not-ported"를 판정하므로 포팅하지 않으면 계속 false-positive 발생.
  3. AI-first 스킬에선 "쓰지 말고 PageBanner로 마이그레이션"이라는 명시적 가이드가 더 가치 있음.
- 작성 규칙:
  - 파일 최상단 import 섹션 바로 위에 `> **⚠️ Deprecated** — upstream seed-design에서 "Use Page Banner instead"로 표시됨. 신규 코드에선 [`PageBanner`](./page-banner.md) 사용 권장.` 블록.
  - "언제 쓰나" 테이블 첫 행을 "**기존 코드 유지보수**"로 하고, "신규 화면"은 전부 PageBanner로 라우팅.
  - Anti-pattern 섹션에 `❌ 신규 기능에 InlineBanner 사용` 케이스 명시.

### D2 — `typography` 컴포넌트 MD는 YAML 이름을 따라 `typography.md`로 저장하되, React import는 `Text`

- upstream YAML: `typography.yaml` (Typography라는 rootage 추상 스펙).
- React package: 해당 스펙을 `Text` 컴포넌트로 구현 (`components/Text/Text.tsx`). Export: `export { Text, TextProps } from "./Text"`.
- 파일명 규칙: sync 스크립트가 YAML 이름 기준 diff를 돌리므로 **`typography.md`로 저장**해야 ported로 인식됨.
- 본문 규칙:
  - 파일 상단에 `> **Note** — upstream rootage는 이 스펙을 "Typography"라고 부르지만, React package에선 \`Text\` 컴포넌트로 구현된다. 본 문서는 API 측 이름(\`Text\`)을 쓴다.` 블록.
  - import: `import { Text } from "@seed-design/react";`
  - "`tokens/typography.md`와의 관계" 섹션을 Anatomy 바로 뒤에 배치. 토큰은 스케일 정의, 컴포넌트는 해당 스케일을 적용하는 API라는 것을 분명히.
  - Variants 테이블에 `textStyle`의 50+ 값 전체를 나열하면 읽기 어려우므로 **그룹화**: 
    - Semantic aliases (`screenTitle`, `articleBody`, `articleNote`) — 권장
    - Scale tokens (`t1Regular` … `t10Bold`) — 세밀 조정용
    - Static scale tokens (`t1StaticRegular` … `t10StaticBold`) — 폰트 스케일링 무시 필요 시
  - TextProps에만 있고 YAML엔 없는 기능(`as` polymorphic, `maxLines`, `color`, `align`, `userSelect`, `whiteSpace`)을 Props 섹션에 명시. 이들은 YAML 스펙 바깥의 React 편의 API라는 점도 표기.

### D3 — Loading decision matrix는 follow-up 이슈로 분리

- `skeleton`과 `progress-circle`은 "로딩"이라는 같은 과제를 다루지만 용례가 다름(skeleton=데이터 도착 전 골격, progress-circle=작업 진행 중 스피너).
- 본 cluster에선 **각 MD의 "언제 쓰나" 섹션에서 상호 대조 표**만 포함 (예: "데이터를 불러오는 동안 레이아웃 유지 → Skeleton, 알 수 없는 대기시간 스피너 → ProgressCircle indeterminate").
- 새 `decision-matrices/which-loading.md` 생성은 스코프 최소화 원칙에 따라 **follow-up 이슈로 이관**. Cluster 1G 완료 후 별도 이슈로 제안.

### D4 — `which-overlay.md`만 minimally 갱신

- `PageBanner`, `InlineBanner`, `Callout`은 이미 which-overlay 비교표에 있음.
- 변경: **InlineBanner 행에 `⚠️ deprecated` 뱃지 추가 + 결정트리의 "리스트 내부 플로팅 안내" 라인을 "→ PageBanner (InlineBanner는 deprecated)"로 수정**.
- 그 외 decision-matrix 수정 불필요.

---

## Wave 분할

**전략**: 서로 다른 MD 파일끼리는 파일 충돌이 없으므로 **Wave 1에서 6개 컴포넌트 MD를 병렬 작성**. `index.md`와 `which-overlay.md`는 6개가 모두 완성된 후 Wave 2에서 통합 편집.

### Wave 1 — 6 components in parallel (병렬 실행 가능)

모두 독립 파일. 서로 참조 링크만 걸고 아직 실체가 없어도 markdown link는 깨지지 않음 (상대 경로로 작성). 

### Wave 2 — Integration (Wave 1 전부 완료 후 순차)

- index.md 갱신 (트리 + 커버리지 섹션)
- which-overlay.md patch (InlineBanner deprecated 표기)
- sync-from-seed.mjs 재실행으로 ported 판정 검증

---

## 스토리별 상세

### W1-S1: InlineBanner reference (deprecated)

- **파일**: `plugins/daangn-seed-ai/skills/seed/references/components/inline-banner.md`
- **복잡도**: M
- **배정 모델**: opus
- **소스**:
  - YAML: `/tmp/seed-design-sync/packages/rootage/components/inline-banner.yaml` — **7 variants**: neutralWeak / positiveWeak / informativeWeak / warningWeak / warningSolid / criticalWeak / criticalSolid. Plus common `base` definition (variant 집계에 포함하지 않음).
  - React: `/tmp/seed-design-sync/packages/react/src/components/InlineBanner/` — namespace API. Exported slots: `Root, CloseButton, Content, Title, Description, Link`. 단 YAML에는 `prefixIcon`, `suffixIcon`, `link` slot 토큰 정의되나 React namespace엔 `Link`/`CloseButton`만 명시됨 → React API 기준으로 작성하되 YAML의 prefix/suffix icon slot 토큰은 "Slot tokens (CSS vars)" 섹션에 보조 표로.
- **수락 기준**:
  1. 파일 상단에 `> **⚠️ Deprecated** — Use [`PageBanner`](./page-banner.md) instead.` 블록이 있다.
  2. Anatomy 테이블에 `Root / Content / Title / Description / Link / CloseButton` 6개 slot이 namespace 기준으로 명시되고, 각 역할과 필수 여부 표기.
  2a. **YAML Slot tokens 보조 표** — Anatomy 다음에 별도 섹션으로, YAML에 정의된 6 slot (`root`, `prefixIcon`, `title`, `description`, `link`, `suffixIcon`)과 각각의 토큰 property를 별도 표로 기록. React namespace와 YAML slot의 네이밍 차이를 한 줄로 설명.
  3. `variant` 7개 전체(neutralWeak/positiveWeak/informativeWeak/warningWeak/warningSolid/criticalWeak/criticalSolid)가 테이블로 나열됨. 각 행에 bg 토큰(`$color.bg.X-weak` 등) + fg 토큰 기록.
  4. import는 `import { InlineBanner } from "@seed-design/react";` (namespace import) 형식.
  5. Anti-patterns 섹션에 "신규 기능에 InlineBanner 쓰면 안 됨" 케이스 포함.
  6. 예제 코드가 namespace 패턴(`<InlineBanner.Root><InlineBanner.Title>...`)을 사용.
  7. 150-250 lines.
- **의존성**: 없음

### W1-S2: PageBanner reference

- **파일**: `plugins/daangn-seed-ai/skills/seed/references/components/page-banner.md`
- **복잡도**: L (variant × tone 매트릭스 11개 조합 + magic tone의 gradient 특수 규칙)
- **배정 모델**: opus
- **소스**:
  - YAML: `/tmp/seed-design-sync/packages/rootage/components/page-banner.yaml` (variant=weak/solid × tone=neutral/positive/informative/warning/critical/magic — 단 `magic + solid` 조합은 YAML 정의 없음 + description에 "variant=solid와 조합하여 사용하지 않습니다" 명시)
  - React: namespace API — `Root, Body, Content, Title, Description, Button, CloseButton`. 
- **수락 기준**:
  1. Anatomy 테이블에 **React namespace 기준 7개 slot** 전부 (Root/Body/Content/Title/Description/Button/CloseButton).
  1a. **YAML Slot tokens 보조 표** — 별도 섹션으로, YAML에 정의된 7 slot (`root`, `prefixIcon`, `content`, `title`, `description`, `button`, `suffixIcon`)과 토큰 properties 기록. `Body`/`CloseButton`은 React layout wrapper 역할이라 YAML token이 없음을, `prefixIcon`/`suffixIcon`은 YAML-only slot (현재 React namespace에선 기본 `Title`/`Description` 옆 영역에 inline 삽입되는 방식)임을 1줄 설명.
  2. Variants 섹션에 `variant` (weak/solid) 테이블과 `tone` (neutral/positive/informative/warning/critical/magic) 테이블이 분리돼 있다.
  3. 호환 매트릭스 표가 있어서 `magic + solid`가 `❌ not supported`로 표기됨.
  4. States 테이블에 `enabled` / `pressed` 2개 (YAML의 pressed 정의 반영).
  5. `tone=magic`이 `$gradient.glow-magic` 사용한다는 사실이 명시.
  6. import는 `import { PageBanner } from "@seed-design/react";`
  7. 합성 규칙 섹션에 "PageBanner는 페이지 최상단 고정. Callout(섹션 내부) / InlineBanner(deprecated) 와의 구분" 명시.
  8. 250-350 lines.
- **의존성**: 없음

### W1-S3: ContentPlaceholder reference

- **파일**: `plugins/daangn-seed-ai/skills/seed/references/components/content-placeholder.md`
- **복잡도**: M
- **배정 모델**: opus
- **소스**:
  - YAML: `content-placeholder.yaml` — **12개 `type` variants**: default, buySell, car, commerce, coupon, food, group, image, jobs, business, post, realty. 모든 type variant에 slot 값은 비어있고(`{}`) base에서만 토큰 정의.
  - React: `ContentPlaceholder/ContentPlaceholder.namespace.ts` — slots: `Root`, `Asset`. 별도 `presets.tsx`에 type별 SVG 프리셋이 들어있어 `Asset` slot 안에 넣는 패턴.
- **수락 기준**:
  1. Anatomy 테이블에 `Root` / `Asset` 2 slot.
  2. Variants 섹션에 `type` 12개 전체 나열 + 각 type의 용례 설명("empty state for: buy-sell list / car detail / ..." 등).
  3. React의 preset SVG가 `packages/react/src/components/ContentPlaceholder/presets.tsx`에 정의됨을 명시, 사용자가 BYO SVG도 가능함을 표기.
  4. base 토큰은 **YAML 원문 표기 그대로** (`root.color: $color.palette.gray-200`, `asset.minWidth: $dimension.x4`, `asset.maxWidth: $dimension.x40`, `asset.heightFraction: 0.5`) 기록. 직접값은 참조 형태가 없을 때만 사용 (1F 일관성 규칙).
  5. "언제 쓰나" 테이블에 Skeleton과 대비 (Skeleton=로딩 중 임시 골격, ContentPlaceholder=영속적 empty state).
  6. import는 `import { ContentPlaceholder } from "@seed-design/react";` namespace 패턴.
  7. 180-250 lines.
- **의존성**: 없음 (Skeleton과 상호 참조는 양쪽 MD가 동시에 생성되므로 양방향 링크로 작성)

### W1-S4: Skeleton reference

- **파일**: `plugins/daangn-seed-ai/skills/seed/references/components/skeleton.md`
- **복잡도**: S
- **배정 모델**: sonnet
- **소스**:
  - YAML: `skeleton.yaml` — tone (neutral/magic) × radius (0/8/16/full).
  - React: `Skeleton/Skeleton.tsx` — **flat export** (`export const Skeleton`) **not namespace**. Props = `SkeletonVariantProps + PrimitiveProps + width/height + HTMLAttributes`.
- **수락 기준**:
  1. Anatomy에 `Root`(=Skeleton 자체) + `Shimmer`(pseudo-element / 자동 애니메이션) 2 slot 설명.
  2. Variants 테이블: `tone` (neutral/magic), `radius` (0/8/16/full — full = pill/circle for Avatar placeholders).
  3. `tone=magic`이 `$gradient.shimmer-magic` 사용한다는 사실 명시. **base shimmer 토큰** (`shimmer.duration: 1.5s`, `shimmer.timingFunction: $timing-function.easing`)을 Motion 또는 base token 섹션에 기록.
  4. width/height prop이 필수 (명시 없으면 부모 크기 상속 또는 0) — 자주 쓰는 패턴 예제 3개 이상 (text line / card / avatar circle).
  5. import는 `import { Skeleton } from "@seed-design/react";` (flat — namespace 아님). `InlineBanner`/`PageBanner`와 달리 sub-component 없음을 명시.
  6. "언제 쓰나" 테이블에 ProgressCircle과의 비교 행 포함 (data-shaped 로딩 vs 작업-shaped 로딩).
  7. 150-200 lines.
- **의존성**: 없음

### W1-S5: ProgressCircle reference

- **파일**: `plugins/daangn-seed-ai/skills/seed/references/components/progress-circle.md`
- **복잡도**: M
- **배정 모델**: opus
- **소스**:
  - YAML: `progress-circle.yaml` — size (24/40) × tone (neutral/brand/staticWhite) × indeterminate (true/false).
  - React: namespace API — `Root, Track, Range`.
- **수락 기준**:
  1. Anatomy: `Root` / `Track` (배경 원) / `Range` (진행 호/스피너) 3 slot.
  2. Variants:
     - `size`: 24(inline, 요소 내부) / 40(전체 페이지 로딩)
     - `tone`: neutral / brand / staticWhite(어두운 overlay 위)
     - `indeterminate`: true(무한 회전, 대기 길이 불명) / false(진행률 표시)
  3. `indeterminate=true`일 때의 애니메이션 토큰(rotateDuration 1.2s, headTimingFunction 등) 명시.
  4. `indeterminate=false`일 때 `lengthDuration 300ms` 명시, `value` prop을 0-1로 전달하는 사용 패턴 예제.
  5. 접근성: `role="progressbar"`, `aria-valuenow`/`aria-valuemin`/`aria-valuemax` indeterminate=false에서만. indeterminate=true면 `aria-busy="true"` + `aria-label` 권장.
  6. import는 `import { ProgressCircle } from "@seed-design/react";` namespace.
  7. "언제 쓰나" 표에 Skeleton과의 비교 행.
  8. 180-260 lines.
- **의존성**: 없음

### W1-S6: Typography (Text) reference

- **파일**: `plugins/daangn-seed-ai/skills/seed/references/components/typography.md`
- **복잡도**: L (50+ textStyle variant + 토큰과의 구분 설명 + React-only props 여러 개)
- **배정 모델**: opus
- **소스**:
  - YAML: `typography.yaml` — **`textStyle` variant 51개 (3 semantic + 24 rem scale + 24 static scale)**. slots: `root` only. (카운트 근거: `grep -E "textStyle=" typography.yaml` → 3+24+24=51. Semantic=screenTitle/articleBody/articleNote. Rem scale=t1~t7 각 Regular/Medium/Bold(21) + t8Bold/t9Bold/t10Bold(3). Static scale=t1~t7 Static각 Regular/Medium/Bold(21) + t8StaticBold/t9StaticBold/t10StaticBold(3).)
  - React: `Text/Text.tsx` — `TextProps` = textStyle + as + color + fontSize + lineHeight + fontWeight + maxLines + textDecorationLine + align + userSelect + whiteSpace.
- **수락 기준**:
  1. 파일 상단에 "upstream에선 Typography, React에선 Text"라는 네이밍 주석 블록.
  2. 별도 섹션 "**tokens/typography.md와의 관계**"가 Anatomy 다음에 위치. 토큰 = 스케일 정의, 컴포넌트 = 스케일 적용 API임을 설명. 상호 참조 링크 `→ [tokens/typography.md](../tokens/typography.md)`.
  3. Variants 섹션에서 `textStyle` **51개**를 **3개 그룹 테이블**로 분리:
     - Semantic aliases — 3개 (`screenTitle`, `articleBody`, `articleNote`). 권장 엔트리포인트.
     - Scale (rem/dynamic) — 24개 (`t1Regular`/`t1Medium`/`t1Bold` … `t7Regular`/`t7Medium`/`t7Bold` + `t8Bold`/`t9Bold`/`t10Bold`). t8-10은 Bold-only (Regular/Medium 미정의).
     - Scale (static, px) — 24개 (`t1StaticRegular` … `t7StaticBold` + `t8StaticBold`/`t9StaticBold`/`t10StaticBold`). 폰트 스케일링 무시 필요 시.
  4. Props 테이블에 React-only 기능(`as`, `maxLines`, `color`, `align`, `userSelect`, `whiteSpace`, `textDecorationLine`, `fontSize`/`lineHeight`/`fontWeight` 부분 오버라이드) 전부 포함.
  5. `as` prop의 허용 값(`span` default / `p, h1-h6, strong, dt, dd, legend`) 명시.
  6. `maxLines` 동작 설명 (1=ellipsis single line, 2+=multi-line clamp).
  7. import는 `import { Text } from "@seed-design/react";`.
  8. Anti-pattern: "textStyle 없이 Text로 감싸고 fontSize만 지정" (의미 손실), "Text 대신 plain `<div>` + 수동 className" (테마 대응 불가).
  9. 250-350 lines.
- **의존성**: 없음 (단 `tokens/typography.md` 링크만 걸리면 됨 — 이미 존재)

### W2-S7: Integration — index.md 갱신 + which-overlay.md 패치

- **파일**: 
  - `plugins/daangn-seed-ai/skills/seed/references/index.md` (트리 + 커버리지 섹션 갱신)
  - `plugins/daangn-seed-ai/skills/seed/references/decision-matrices/which-overlay.md` (InlineBanner deprecated 마킹)
- **복잡도**: S
- **배정 모델**: sonnet
- **수락 기준**:
  1. `index.md`의 `components/` 트리 섹션에 6개 신규 파일(`inline-banner.md`, `page-banner.md`, `content-placeholder.md`, `skeleton.md`, `progress-circle.md`, `typography.md`)이 1-line 설명과 함께 추가됨.
  2. `index.md`의 "커버리지" 섹션에서:
     - MVP 스코프 라인이 "12 → 18 컴포넌트"로 갱신
     - "미포팅 컴포넌트" 목록에서 Skeleton, ProgressCircle 제거
     - Typography가 `tokens/typography.md`와 구분됨을 한 줄로 주석
     - InlineBanner는 "deprecated — 마이그레이션 가이드로 유지" 표기
  3. `which-overlay.md` 결정트리의 "리스트 아이템 근처의 플로팅 안내" 라인이 "`PageBanner` (InlineBanner는 deprecated 마이그레이션 대상)"로 수정.
  4. `which-overlay.md` 비교표의 InlineBanner 행 첫 컬럼이 `**InlineBanner** ⚠️ deprecated`로 변경.
  5. `node scripts/sync-from-seed.mjs`를 실행하면 6개 컴포넌트가 `not-ported` 목록에 더 이상 나오지 않는다 (스크립트는 YAML 파일명과 `components/*.md` 존재 여부를 대조).
- **의존성**: W1-S1 ~ W1-S6 전부 완료 필요

---

## 리스크 및 완화

| 리스크 | 영향 | 완화 |
|--------|------|------|
| YAML과 React API 불일치 (예: YAML에 있는데 React에 안 보이는 slot) | Medium | 각 스토리에서 "YAML slot tokens vs React exported slots" 섹션을 분리. React API가 사용자 관점이므로 우선이지만, YAML tokens은 CSS var 레벨 참조용으로 보조 표. |
| typography의 51개 variant 피로 | Low | 3그룹 분리 + Semantic aliases를 기본 entrypoint로 권장 (full scale은 "세밀 조정 시"로 위치화). |
| Skeleton이 namespace가 아닌 flat export인 사실을 독자가 놓침 | Low | 파일 상단 import 블록 바로 아래에 "이 컴포넌트는 namespace API가 아님" 한 줄 주석. |
| which-overlay.md를 수정할 때 기존 설명 흐름 깨짐 | Low | Wave 2에서 순차 수행 + diff만 최소로 패치. |
| sync-from-seed.mjs가 typography.md를 tokens/typography.md와 혼동 | Low (script는 `components/` 디렉토리만 스캔) | Wave 2 sync 실행 후 ported 판정 검증 필수. |

---

## 결정사항 (Decisions locked)

1. ✅ 6개 컴포넌트 모두 포팅 (inline-banner deprecated 포함)
2. ✅ typography는 `typography.md` 파일명 고정, import는 `Text` 사용, 이중 네이밍은 파일 상단 노트로 해결
3. ✅ loading decision matrix 생성은 follow-up 이슈로 이관
4. ✅ decision-matrices 수정은 `which-overlay.md`만, 2 라인 패치
5. ✅ Wave 1(6 components 병렬) → Wave 2(integration) 2-wave 실행
6. ✅ 복잡도별 모델 라우팅: S=sonnet(Skeleton, Integration), L=opus(PageBanner, Typography), M=opus(나머지)

---

## 검증 방법 (Definition of Done)

Wave 2 완료 후:

1. 컴포넌트 MD 카운트 검증:
   - `ls plugins/daangn-seed-ai/skills/seed/references/components/*.md | wc -l` = 19 (기존 12 + `_template.md` + 신규 6).
   - `ls plugins/daangn-seed-ai/skills/seed/references/components/*.md | grep -v "/_" | wc -l` = 18 (sync 스크립트 ported count와 동치).
2. `node scripts/sync-from-seed.mjs` 실행 결과 stdout에서 6개 컴포넌트가 `missing/not-ported` 목록에 없다.
3. 각 MD 파일이 최소 100 lines 이상 (placeholder 방지).
4. Grep으로 `TODO|TBD|XXX|FIXME|추후` 0건 확인.
5. 각 MD 파일에 `import {` 문자열 존재 (import 경로 누락 방지).
6. inline-banner.md에 `deprecated` 문자열 존재.
7. typography.md에 `tokens/typography.md` 링크 존재.

---

## 예상 소요 시간

- Wave 1 (6 stories 병렬): L 스토리 1개 + M 스토리 3개 + S 스토리 1개 + L 스토리 1개 — 병렬이므로 가장 긴 L 스토리 기준 ≈ 1 컨텍스트 윈도우(약 25-40분 실제 작업량, AI 실행 시 개당 5-10분).
- Wave 2 (1 story 순차): S 스토리 — 10-15분.
- 리뷰 루프 포함 총 예상: 약 60-90분.

---

## Follow-up 제안 (본 plan 바깥)

- Cluster 1H: 그다음 Tier 1 잔여 컴포넌트 (list-item, list-header, 등 — #14 확인 후 결정)
- Loading decision matrix: `which-loading.md` 신규 생성 (Skeleton vs ProgressCircle vs ContentPlaceholder 상호 비교)
- `tokens/typography.md`에 Text 컴포넌트 역참조 링크 추가 (본 plan 스코프 바깥)
