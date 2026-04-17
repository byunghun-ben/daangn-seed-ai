---
project: daangn-seed-ai
source_issues: ["#17", "#14 (cluster 1F)"]
epic: "#2"
created: 2026-04-17
status: confirmed
wave_count: 2
story_count: 8
---

# Plan: Tier 1F data-display port + #17 internal primitives section

## 요구사항

이 run은 두 개의 독립된 스코프를 병렬 실행한다.

1. **Issue #17 (primitives 섹션)** — `decision-matrices/composition.md` 에 13 primitives를 단일 섹션으로 문서화. 개별 `.md` 파일 작성 금지. sync-from-seed.mjs 에 `INTERNAL_PRIMITIVES` allowlist 추가하여 not-ported 목록에서 제거.
2. **Issue #14 cluster 1F (data display 5종)** — `references/components/` 에 avatar, avatar-stack, badge, notification-badge, divider 각각 개별 `.md` 작성. 템플릿 포맷 (`_template.md`) 준수, 완성도는 `icon.md`·`action-button.md` 수준.

두 스코프는 편집 파일 집합이 완전히 disjoint (1F는 `components/*.md` 신규, #17은 `decision-matrices/composition.md` 편집) 이므로 Wave 1에서 병렬 가능. Wave 2는 두 스코프의 산출물을 통합 (`index.md` 커버리지 + sync 스크립트 allowlist + 회귀 검증).

**Boil-the-lake 원칙**: 각 컴포넌트 doc 은 AI가 단독으로 정확한 코드를 생성할 수 있는 수준의 정보 밀도 — anatomy·variant·size·state·token 매핑·props·합성규칙·접근성·anti-patterns·예제 2종 이상 전부 포함.

---

## 스토리

### W1-S1: #17-composition-primitives-section
- **설명**: `decision-matrices/composition.md` 맨 아래에 "내부 primitives (직접 사용 금지)" 섹션을 신설하고 13개 primitive를 4개 서브섹션으로 분류해 기록한다. 각 primitive는 `이름 · 소비 컴포넌트 · 역할 · 직접 사용 금지 원칙` 형태로 표 기록. deprecated primitive (action-sheet-close-button · extended-action-sheet-close-button · menu-sheet-close-button) 는 별도 "deprecated — 참고용만" 하위 블록으로 분리. `field-label` 은 언급만 하고 "#15 2C의 field 문서와 함께 처리 예정"이라 명시.
- **수정 파일**:
  - `plugins/daangn-seed-ai/skills/seed/references/decision-matrices/composition.md` (편집)
- **수락 기준**:
  1. 섹션 제목 "내부 primitives (직접 import 금지)" 가 `composition.md` 에 추가됨
  2. 4개 서브섹션 (Mark · Sheet · Slider · Form) 모두 존재
  3. Mark 서브섹션에 5개 primitive 표 (checkmark · radiomark · switchmark · select-box-checkmark · segmented-control-indicator) 각각 `소비 컴포넌트` 열과 `역할` 열을 가진 행으로 기록됨
  4. Sheet 서브섹션에 5개 primitive 표 기록되고 deprecated 3개는 "deprecated" 라벨이 붙거나 별도 블록으로 분리됨 (upstream yaml 의 `deprecated:` 메타 반영)
  5. Slider 서브섹션에 `slider-thumb` + `slider-tick` 2개 기록
  6. Form 서브섹션은 `field-label` 1개를 "Tier 2C field 와 함께 처리" 주석과 함께 기록
  7. 섹션 도입부에 "이들 primitive 는 부모 컴포넌트가 자동 조립한다. 예외적 수동 조합 (고도로 커스텀된 Sheet 등) 외에는 직접 import 금지" 문장 포함
  8. 구조적 제약 (라인 수 대신):
     - 섹션 도입부 문단 1개, 최대 5줄
     - 각 primitive 행 = 3열 테이블 1행 (이름 · 소비 컴포넌트 · 역할), 각 셀 60자 이내
     - 각 서브섹션은 "## {섹션명}" 헤더 + 선택적 설명 1줄 + 테이블. 문단형 설명 금지.
     - deprecated 블록도 동일 3열 테이블 포맷
- **복잡도**: M (단일 파일 · 13 항목 · 구조화된 편집)
- **의존성**: 없음
- **Wave**: 1
- **모델**: opus
- **참고 파일**:
  - upstream yaml (각 primitive 의 deprecated 필드 · 소비 컴포넌트 확인용):
    - `/tmp/seed-design-sync/packages/rootage/components/{checkmark,radiomark,switchmark,select-box-checkmark,segmented-control-indicator}.yaml`
    - `/tmp/seed-design-sync/packages/rootage/components/{bottom-sheet-close-button,bottom-sheet-handle,action-sheet-close-button,extended-action-sheet-close-button,menu-sheet-close-button}.yaml`
    - `/tmp/seed-design-sync/packages/rootage/components/{slider-thumb,slider-tick,field-label}.yaml`
  - 기존 `composition.md` 구조 (선행 섹션 톤 맞추기용)

---

### W1-S2: 1F-avatar-port
- **설명**: `references/components/avatar.md` 신규 작성. upstream `avatar.yaml` 의 10개 size (20~108) + slots (root·badgeMask·badge) + state (enabled) 를 템플릿 포맷으로 변환. React 소스 (`Avatar.tsx`) 의 namespace export 구조 (`Avatar.Root · Avatar.Image · Avatar.Fallback · Avatar.Badge · Avatar.Stack`) 를 Props 섹션에 반영. MDX (`avatar.mdx`) 의 Size·Badge·Fallback 예제 포맷을 참고해 "예제" 섹션 3종 이상 작성. `IdentityPlaceholder` fallback 패턴 언급 (단, 해당 컴포넌트는 Tier 3이므로 "fallback slot 에 사용자 지정 컴포넌트 삽입 가능" 수준으로만).
- **수정 파일**:
  - `plugins/daangn-seed-ai/skills/seed/references/components/avatar.md` (신규)
- **수락 기준**:
  1. 필수 H2 섹션: `언제 쓰나 / 언제 쓰지 않나` · `Anatomy` · `Size` · `States` · `Props` · `합성 규칙 (composition)` · `접근성` · `Anti-patterns` · `예제 (minimum usage)`. Avatar 는 variant 개념 없으므로 `Variants` 대신 `Size` 섹션 사용 (icon.md 패턴). 해당 없는 섹션은 "N/A — 이유" 한 줄 스텁 금지, 섹션 자체를 생략 가능.
  2. Anatomy 표에 4개 slot (root · image · fallback · badge) 각각 필수/선택 표시 + 역할 기재
  3. Size 표에 10개 값 (20/24/36/42/48/56/64/80/96/108) 모두 기재 + 각 size 의 대표 사용처 (upstream yaml 의 description 참고)
  4. size=20 에서 badge/badgeMask 미지원 조건 명시
  5. Props TypeScript 인터페이스: `AvatarRootProps · AvatarImageProps · AvatarFallbackProps · AvatarBadgeProps` 각각 기재
  6. Anti-patterns ❌ 3개 + ✅ 2개 이상 (예: `<img>` 직접 사용 금지 · size 를 px 하드코딩 금지 · size=20 에서 badge 사용 금지)
  7. 예제 3개 이상 (기본 · Fallback · Badge 붙이기)
  8. 맨 위에 `import { Avatar } from "@seed-design/react";` 와 namespace 사용법 (`<Avatar.Root><Avatar.Image /></Avatar.Root>`) 기재
  9. `icon.md` 수준 품질 — 토큰 매핑 (`cornerRadius: $radius.full · strokeColor: $color.stroke.neutral-subtle`) 은 반드시 포함
- **복잡도**: M (신규 파일 · upstream 3 소스 참고 · namespace API)
- **의존성**: 없음
- **Wave**: 1
- **모델**: opus
- **참고 파일**:
  - `/tmp/seed-design-sync/packages/rootage/components/avatar.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/Avatar/Avatar.tsx`
  - `/tmp/seed-design-sync/packages/react/src/components/Avatar/Avatar.namespace.ts`
  - `/tmp/seed-design-sync/docs/content/react/components/avatar.mdx`
  - 로컬 템플릿: `plugins/daangn-seed-ai/skills/seed/references/components/_template.md`
  - 품질 레퍼런스: `plugins/daangn-seed-ai/skills/seed/references/components/icon.md` · `action-button.md`

---

### W1-S3: 1F-avatar-stack-port
- **설명**: `references/components/avatar-stack.md` 신규 작성. upstream `avatar-stack.yaml` 의 10개 size + 2 slots (root·item) 반영. React 는 `Avatar.Stack` namespace export 형태이므로 "import 경로와 Avatar 와의 관계"를 명시 (`Avatar.tsx` 내 `AvatarStack` 컴포넌트가 children `<Avatar />` 목록을 받아 겹침 렌더). size 별 gap (-5 ~ -27px) 과 item strokeWidth 토큰 매핑 기재. "언제 쓰나" 섹션에서 avatar.md 와의 관계 cross-link.
- **수정 파일**:
  - `plugins/daangn-seed-ai/skills/seed/references/components/avatar-stack.md` (신규)
- **수락 기준**:
  1. 필수 H2 섹션: `언제 쓰나 / 언제 쓰지 않나` · `Anatomy` · `Size` · `Props` · `합성 규칙 (composition)` · `접근성` · `Anti-patterns` · `예제 (minimum usage)`. States/Variants 는 AvatarStack 자체 속성이 없으므로 생략.
  2. Anatomy 표에 2 slot (root · item) + 역할
  3. Size 표에 10개 값 + 각 size 의 gap 값 + item strokeWidth
  4. Props: `AvatarStackProps` 인터페이스 (size · children)
  5. 합성 규칙: "children 에 `<Avatar.Root>` 만 넣어야 한다" · "mixed size 금지" · "3~5개 권장, 5 초과 시 +N 카운트 badge 사용"
  6. Anti-patterns ❌ 3개 (예: 다른 컴포넌트를 children 으로 · size prop 을 Avatar 에 중복 지정 · stack 안에 개별 size)
  7. 예제 2개 (기본 · 오버플로 +N)
  8. `avatar.md` 로 cross-link (`./avatar.md` 상대 경로)
  9. "AvatarStack 은 Avatar namespace 로 export 된다 (`Avatar.Stack`)" 명시
- **복잡도**: S (신규 파일 · yaml 단순 · Avatar 와 긴밀 연결)
- **의존성**: 없음 (avatar.md 와 병렬 가능 — cross-link 는 상대 경로로 파일 존재 여부 무관하게 기재)
- **Wave**: 1
- **모델**: sonnet
- **참고 파일**:
  - `/tmp/seed-design-sync/packages/rootage/components/avatar-stack.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/Avatar/Avatar.tsx` (AvatarStack 부분)
  - `/tmp/seed-design-sync/docs/content/react/components/avatar.mdx` (Stack 예제)

---

### W1-S4: 1F-badge-port
- **설명**: `references/components/badge.md` 신규 작성. upstream `badge.yaml` 의 2 size (large·medium) × 3 variant (solid·outline·weak) × 6 tone (neutral·brand·informative·positive·warning·critical) = 36개 조합의 토큰 매핑 압축 기재. Variant × Tone 2D 매트릭스 표 제공. truncating (maxWidth) 동작 언급. MDX 의 Tones/Variants 분리 구조 반영.
- **수정 파일**:
  - `plugins/daangn-seed-ai/skills/seed/references/components/badge.md` (신규)
- **수락 기준**:
  1. 필수 H2 섹션: `언제 쓰나 / 언제 쓰지 않나` · `Anatomy` · `Variants` (tone + variant 하위 분리) · `Size` · `Truncating` · `Props` · `합성 규칙 (composition)` · `접근성` · `Anti-patterns` · `예제 (minimum usage)`. States 는 Badge 에 없으므로 생략.
  2. Anatomy 표: root · label 2 slot
  3. Variants 섹션: variant (solid · outline · weak) 3개 · tone (neutral · brand · informative · positive · warning · critical) 6개 각각 표로 기재 + 사용처 (upstream yaml description 반영)
  4. Size 표: large (minHeight x6 · fontSize t2 · paddingX x2) + medium (minHeight x5 · fontSize t1 · paddingX x1_5) 각각 픽셀·토큰 병기
  5. Variant × Tone 매트릭스 표 1개 (가로: 6 tone · 세로: 3 variant · 셀 내용 = 해당 variant 의 대표 토큰: solid→bg 토큰 · outline→stroke 토큰 · weak→bg 토큰. weak 의 bg 가 투명이면 fg 토큰 명시)
  6. Props: `BadgeProps extends BadgeVariantProps` (size · variant · tone · children)
  7. Truncating 섹션 (`maxWidth` 6.75rem/7.5rem · 말줄임 ellipsis 자동) 명시
  8. 합성 규칙: "NotificationBadge 와 혼용 금지" · "같은 줄에 3개 이상 금지" · "tone 은 실제 상태 반영 (positive = 성공 · critical = 거절 · neutral = 기본)"
  9. Anti-patterns ❌ 3개 + ✅ 2개 이상
  10. 예제 3개 이상 (tone=neutral weak · tone=brand solid · truncating 10+ 글자)
- **복잡도**: M (36 조합 · 2D variant 매트릭스 설계 필요)
- **의존성**: 없음
- **Wave**: 1
- **모델**: opus
- **참고 파일**:
  - `/tmp/seed-design-sync/packages/rootage/components/badge.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/Badge/Badge.tsx`
  - `/tmp/seed-design-sync/docs/content/react/components/badge.mdx`
  - 매트릭스 구조 레퍼런스: `plugins/daangn-seed-ai/skills/seed/references/components/action-button.md` (Variant → Token 매핑 블록)

---

### W1-S5: 1F-notification-badge-port
- **설명**: `references/components/notification-badge.md` 신규 작성. upstream `notification-badge.yaml` 의 2 size (large·small) 반영. upstream React 소스에 `NotificationBadge` + `NotificationBadgePositioner` 2개 export 가 있으므로 두 컴포넌트 모두 문서화. `attach` prop (icon 위 · text 위) 로 부모 요소에 붙이는 positioner 사용법 기재. Badge 와의 차이점 ("count/status dot 전용 · label 텍스트는 짧은 숫자 위주") 을 "언제 쓰나" 섹션에서 명확히.
- **수정 파일**:
  - `plugins/daangn-seed-ai/skills/seed/references/components/notification-badge.md` (신규)
- **수락 기준**:
  1. 필수 H2 섹션: `언제 쓰나 / 언제 쓰지 않나` (Badge 와의 구분 포함) · `Anatomy` (NotificationBadge + Positioner 분리) · `Size` · `Props` · `합성 규칙 (composition)` · `접근성` · `Anti-patterns` · `예제 (minimum usage)`. States/Variants 없음.
  2. Anatomy 표: NotificationBadge (root · label) + NotificationBadgePositioner (root) 분리 기재
  3. Size 표: large (minHeight 18px · fontSize t1 · paddingX x1 · 라벨 가능) · small (6×6px 도트 · 라벨 없음) 구분
  4. Props 2개 인터페이스: `NotificationBadgeProps` · `NotificationBadgePositionerProps` (attach · size)
  5. 색상 토큰: root bg 는 `$color.bg.brand-solid` 고정 · label 은 `static-white`
  6. 합성 규칙: "icon 우상단에 붙일 때 Positioner 로 감싼다" · "Badge 와 혼용 금지 (Badge 는 상태 라벨 · NotificationBadge 는 미확인 신호)" · "label 은 2자리 이내 · 100+ 는 '99+' 표기"
  7. Anti-patterns ❌ 3개 (예: Positioner 없이 절대 위치 수동 지정 · small size 에 label 지정 · 상태 정보를 NotificationBadge 로 표현)
  8. 예제 2개 이상 (icon 위 small 도트 · tab 위 large 카운트)
  9. `badge.md` 와의 구분을 "언제 쓰나" 표에 포함
  10. `/tmp/seed-design-sync/docs/content/react/components/notification-badge.mdx` 파일이 없을 경우 `badge.mdx` 의 NotificationBadge 언급 섹션 + React 소스 주석을 근거로 사용
- **복잡도**: M (2 컴포넌트 · Positioner 위치 지정 메커니즘)
- **의존성**: 없음 (badge.md 와 병렬 가능)
- **Wave**: 1
- **모델**: opus
- **참고 파일**:
  - `/tmp/seed-design-sync/packages/rootage/components/notification-badge.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/NotificationBadge/NotificationBadge.tsx`
  - (MDX 는 notification-badge 전용 파일 없음 — 다른 소스 참조)

---

### W1-S6: 1F-divider-port
- **설명**: `references/components/divider.md` 신규 작성. upstream `divider.yaml` 은 매우 단순 (thickness 만) 이지만 React 소스 (`Divider.tsx`) 는 `as` prop (hr · div · li) · `orientation` (horizontal · vertical) · `inset` · `color` · `thickness` 5 prop 을 갖는다. 접근성 핵심 (`<hr>` 의 implicit role=separator · `as="div"` 시 장식용 · `role="separator"` 명시 규칙) 은 `divider.mdx` 의 Screen Reader Behavior 섹션 전문 포팅 수준으로 상세 기재.
- **수정 파일**:
  - `plugins/daangn-seed-ai/skills/seed/references/components/divider.md` (신규)
- **수락 기준**:
  1. 필수 H2 섹션: `언제 쓰나 / 언제 쓰지 않나` · `Anatomy` · `Orientation` (horizontal + vertical 분리) · `Props` · `합성 규칙 (composition)` · `접근성 (스크린리더 동작)` · `Anti-patterns` · `예제 (minimum usage)`. Variants/States/Size 없음.
  2. Anatomy: root 1 slot (`thickness: 1px` default) + `as` 에 따른 렌더링 요소 차이 설명
  3. Props: `DividerProps` (as · color · thickness · orientation · inset · ...HTMLAttributes) 전체 기재 + 각 prop default
  4. Orientation 섹션: horizontal · vertical 2 예제 + inset (16px margin) 효과 설명
  5. 접근성 섹션에 3가지 렌더링 케이스 각각 기재 (각 케이스는 하위 불릿 1개로 충분):
     (a) `as="hr"` — implicit role=separator, aria-orientation 자동
     (b) `as="div"` — 장식용, 스크린리더 무시 (role/aria 불필요)
     (c) `as="li"` — 명시적 `role="separator"` 필요. 리스트 시맨틱 유지.
  6. 합성 규칙: "List 내부에서는 `as="li"`" · "orientation=vertical 은 Flex 내부에서만" · "color 는 `stroke.*` 계열만"
  7. Anti-patterns ❌ 3개 (예: 장식용인데 `as="hr"` 유지 · inset 과 Flex vertical 동시 사용 · fg 토큰 사용)
  8. 예제 3개 (기본 horizontal · vertical in Flex · list inset)
- **복잡도**: M (yaml 단순하지만 React props · 접근성 규칙이 풍부)
- **의존성**: 없음
- **Wave**: 1
- **모델**: opus
- **참고 파일**:
  - `/tmp/seed-design-sync/packages/rootage/components/divider.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/Divider/Divider.tsx`
  - `/tmp/seed-design-sync/docs/content/react/components/divider.mdx` (Screen Reader Behavior 섹션이 핵심)

---

### W2-S7: integration-index-coverage
- **설명**: `references/index.md` 의 구조 트리 (ASCII 그래프) 와 커버리지 섹션을 Wave 1 산출물에 맞춰 갱신. 기존 6개 MVP + icon 에서 1F 5개 (avatar · avatar-stack · badge · notification-badge · divider) 를 구조 트리에 추가하고 커버리지 문단에 "Tier 1F data display 5 포팅 완료" 및 남은 미포팅 카운트 갱신 (72 → 67 추정). #17 primitives 섹션이 composition.md 에 추가됐음을 "결정 매트릭스" 트리 항목 주석으로 명시 ("composition.md — 조합 규칙 + 내부 primitives 13개").
- **수정 파일**:
  - `plugins/daangn-seed-ai/skills/seed/references/index.md` (편집)
- **수락 기준**:
  1. 구조 트리의 `components/` 블록에 `avatar.md · avatar-stack.md · badge.md · notification-badge.md · divider.md` 5줄 추가 + 각 한 줄 설명
  2. 구조 트리의 `decision-matrices/composition.md` 주석이 "조합 규칙 + 내부 primitives 13개 (직접 사용 금지)" 형태로 갱신
  3. "커버리지" 문단이 "MVP 6 + Icon + Tier 1F 5 = 총 12 컴포넌트" 를 반영
  4. "미포팅 컴포넌트" 문단에서 `Avatar`, `Badge` 제거 · `AvatarStack`, `NotificationBadge`, `Divider` 추가되지 않음 (포팅 완료 반영)
  5. 파일 전체가 기존 톤·문체와 일치 (새 섹션 추가 금지 · 기존 섹션만 편집)
- **복잡도**: S (단일 파일 · 3곳 편집)
- **의존성**: W1-S2, W1-S3, W1-S4, W1-S5, W1-S6 완료 (파일 존재 확인 필요)
- **Wave**: 2
- **모델**: sonnet
- **참고 파일**:
  - 기존 `plugins/daangn-seed-ai/skills/seed/references/index.md`
  - Wave 1 산출 `components/*.md` 5종

---

### W2-S8: integration-sync-allowlist-and-verify
- **설명**: `scripts/sync-from-seed.mjs` 에 `INTERNAL_PRIMITIVES` 세트 추가하고 `diffComponents` 함수가 이 세트의 primitive 를 "internal-primitive (documented in composition.md)" 상태로 표시하며 not-ported 에서 제외하도록 로직 확장. 기존 `LOCAL_ONLY_COMPONENTS` 는 의미가 다르므로 (로컬만 있고 upstream 에 없는 case) 별개 세트로 유지. 13개 primitive 이름을 정확히 yaml 파일명과 일치시킴. 추가 후 `node scripts/sync-from-seed.mjs` 로 not-ported 카운트 검증 (1F 5개 + primitives 13개 = 18개 감소 기대), `node scripts/test.mjs` 로 기존 3개 시나리오 (signup · listDialog · feedback) 회귀 통과 확인.
- **수정 파일**:
  - `scripts/sync-from-seed.mjs` (편집)
- **수락 기준**:
  1. `scripts/sync-from-seed.mjs` 상단 (LOCAL_ONLY_COMPONENTS 근처) 에 `INTERNAL_PRIMITIVES` Set 선언 추가, 13개 이름 정확히 포함:
     `checkmark`, `radiomark`, `switchmark`, `select-box-checkmark`, `segmented-control-indicator`, `bottom-sheet-close-button`, `bottom-sheet-handle`, `action-sheet-close-button`, `extended-action-sheet-close-button`, `menu-sheet-close-button`, `slider-thumb`, `slider-tick`, `field-label`
  2. `diffComponents` 함수에서 upstream 에 있고 local 에 없는 primitive 가 `INTERNAL_PRIMITIVES` 에 속하면 status 를 `"internal-primitive (see composition.md)"` 로 표시하고 not-ported 에서 제외
  3. 주석으로 "INTERNAL_PRIMITIVES: 부모 컴포넌트가 자동 조립하므로 개별 doc 없음. composition.md 에서 통합 문서화." 설명 추가
  4. `node scripts/sync-from-seed.mjs --json` 실행 시 출력 JSON 의 `components` 객체에서:
     - `avatar`, `avatar-stack`, `badge`, `notification-badge`, `divider` 는 `status="ported"` 로 표시 (포팅 완료)
     - 13개 primitive 이름이 각각 `status` 필드에 `internal-primitive` 문자열을 포함 (정확한 라벨은 구현 시 결정, "internal-primitive" substring match 필수)
     - 현재 baseline: not-ported=72 (resume 시점 확인됨). 기대값: `not-ported=72 - 18 = 54` (1F 5개 + primitives 13개). 검증은 exact match (not-ported count == 54). 만약 구현 중 yaml 업데이트로 baseline 이 달라지면 executor 가 `.ralph/execution.jsonl` 의 `plan_blocker_cleared` 이벤트의 `baseline_not_ported` 필드를 기준으로 다시 계산.
  5. `node scripts/test.mjs` 실행 시 3 시나리오 (signup · listDialog · feedback) 모두 pass (Tier 1F 컴포넌트는 해당 시나리오에서 쓰이지 않으므로 회귀 없음)
  6. lint / node 실행 경고 0개
- **복잡도**: S (단일 파일 · 세트 추가 · 조건 분기 1줄)
- **의존성**: W1-S1 (composition.md primitive 섹션 존재 확인), W1-S2~S6 (components/*.md 5종 존재 확인)
- **Wave**: 2
- **모델**: sonnet
- **참고 파일**:
  - 기존 `scripts/sync-from-seed.mjs` (LOCAL_ONLY_COMPONENTS 패턴 참고)
  - `scripts/test.mjs` (회귀 실행용)
  - upstream yaml 파일명 (13개 정확한 이름 확인): `/tmp/seed-design-sync/packages/rootage/components/`

---

## 파일 충돌 분석

Wave 1 의 6 스토리가 편집/생성하는 파일:

| 스토리 | 파일 | 작업 |
|---|---|---|
| W1-S1 | `decision-matrices/composition.md` | edit (맨 아래 섹션 추가) |
| W1-S2 | `components/avatar.md` | create |
| W1-S3 | `components/avatar-stack.md` | create |
| W1-S4 | `components/badge.md` | create |
| W1-S5 | `components/notification-badge.md` | create |
| W1-S6 | `components/divider.md` | create |

**충돌 없음** — 6 파일 모두 서로 disjoint. 완전 병렬 실행 안전.

Wave 2:

| 스토리 | 파일 | 작업 |
|---|---|---|
| W2-S7 | `references/index.md` | edit |
| W2-S8 | `scripts/sync-from-seed.mjs` | edit |

두 스토리도 서로 disjoint. Wave 2 내에서도 병렬 가능. 단 **W1 전부 완료 후 W2 시작** (W2-S7 은 `components/*.md` 5개 파일 존재 확인 · W2-S8 은 sync 스크립트 실행 시 실제 1F 포팅 + primitive 세트가 모두 반영된 상태여야 검증 의미 있음).

---

## 리스크

### R1 — upstream clone 경로 의존
**내용**: 모든 스토리가 `/tmp/seed-design-sync/` 가 유효한 daangn/seed-design clone 임을 전제. 2026-04-17 resume 시점에 경로가 비어 있었고, `node scripts/sync-from-seed.mjs --json` 을 1회 실행하여 자동 clone 을 트리거함 (sync 스크립트의 `cloneUpstream()` 로직). 이후 `/tmp/seed-design-sync/packages/rootage/components/avatar.yaml` 및 13 primitive yaml 존재 확인됨. baseline not-ported=72.
**완화**:
  - story-executor 는 작업 시작 시 `test -d /tmp/seed-design-sync/packages/rootage/components/` 로 선행 체크. 없으면 `node scripts/sync-from-seed.mjs --json > /dev/null` 으로 자동 clone 트리거 후 재확인. 여전히 없으면 텔레그램 알림 + 해당 스토리 스킵.
  - 각 story 의 "참고 파일" 에 절대 경로 명시 (이미 반영됨).

### R2 — Avatar namespace API 문서화 혼동
**내용**: upstream 의 `Avatar.tsx` 는 `AvatarRoot`, `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarStack` 5 컴포넌트를 한 파일에서 export 하고 `Avatar.namespace.ts` 에서 `Avatar.Root · Avatar.Image · Avatar.Fallback · Avatar.Badge · Avatar.Stack` 으로 re-export 한다. 사용자 향 import 는 namespace 형태. W1-S2 (avatar.md) 와 W1-S3 (avatar-stack.md) 이 이 관계를 일관되게 설명해야 한다.
**완화**: 두 스토리 모두 "import 경로" 섹션에서 namespace API (`import { Avatar } from "@seed-design/react"; <Avatar.Root> ... </Avatar.Root>`) 를 첫 번째 예로 쓰고, W1-S3 가 W1-S2 를 cross-link. executor 가 `icon.md` 의 `Icon`/`PrefixIcon`/`SuffixIcon` 분리 문서화 패턴을 참고.

### R3 — Deprecated primitives 처리 누락
**내용**: upstream yaml 3개 (`action-sheet-close-button`, `extended-action-sheet-close-button`, `menu-sheet-close-button`) 가 `deprecated: No longer used` 메타를 가진다. W1-S1 이 이를 반드시 "deprecated — 참고용만" 블록으로 분리해 써야 하고, W2-S8 의 `INTERNAL_PRIMITIVES` 에는 여전히 포함해서 sync diff 에서 조용히 통과시켜야 한다 (yaml 파일 자체는 upstream 에 존재).
**완화**: W1-S1 의 수락기준 #4 · W2-S8 의 `INTERNAL_PRIMITIVES` 13개 리스트에 deprecated 3개 포함 명시.

### R4 — Badge 2D variant 매트릭스 폭증
**내용**: Badge 는 6 tone × 3 variant = 18 조합 × 2 size = 36 케이스. 전부 풀어 쓰면 문서가 과비대해져 "AI 가 한 번에 읽어 이해" 하기 어려워진다 (skill 철학 위반).
**완화**: W1-S4 수락기준 #5 에서 `Variant × Tone 매트릭스 표 1개 (가로 6 tone · 세로 3 variant · 셀: bg 토큰만 요약)` 형태로 압축. 자세한 토큰은 yaml 을 참고하도록 "상세 토큰 매핑은 `upstream yaml` 참조" 주석.

### R5 — 회귀 테스트 fragility
**내용**: `scripts/test.mjs` 는 `claude -p` 서브프로세스를 띄워 HTML 을 생성하고 grep 기반 anti-pattern lint 를 돈다. 1F 컴포넌트는 기존 3 시나리오 (signup · listDialog · feedback) 의 expected/forbidden 패턴과 무관하므로 회귀 가능성 낮음. 단 스킬 파일 개수 증가로 claude 의 skill 로딩 토큰 사용량이 늘어 timeout 가능성.
**완화**: W2-S8 에서 회귀 시 실패 발생 시 "기존 통과였던 것이 깨졌나 (true regression)" vs "timeout 같은 환경 이슈" 를 구분해 report. 환경 이슈면 재실행 1회 허용.

---

## 결정사항

### D1 — Wave 1 완전 병렬 실행
**결정**: 6 스토리 모두 disjoint 파일 세트이므로 병렬 실행. Ralph orchestrator 가 worktree 또는 동일 디렉터리에서 병렬 executor 를 돌려도 충돌 없음.
**근거**: 파일 충돌 분석 테이블 확인.

### D2 — Deprecated primitives 는 INTERNAL_PRIMITIVES 에 포함
**결정**: action-sheet-close-button · extended-action-sheet-close-button · menu-sheet-close-button 세 개는 upstream yaml 에 존재하므로 sync diff 가 not-ported 로 잡지 않도록 allowlist 포함. 단 composition.md 에서는 "deprecated — 참고용만" 블록으로 분리.
**근거**: upstream yaml `deprecated:` 필드 확인. 문서 생성 생략은 철학에 맞지만 diff 노이즈 제거 필요.

### D3 — avatar-stack 은 독립 문서로 유지
**결정**: React 소스에서는 `Avatar/Avatar.tsx` 에 `AvatarStack` 이 같이 있지만, 1F 클러스터 스펙이 `avatar-stack.yaml` 을 별도 port 대상으로 지정했고 사용 맥락이 다르므로 별개 `.md` 파일 유지. avatar.md 에서 "Stack 은 `./avatar-stack.md` 참조" cross-link.
**근거**: Epic #14 이슈 본문 1F 표에 `avatar-stack` 이 `avatar` 와 별행으로 존재.

### D4 — Tier 1F 컴포넌트를 dry-run 시나리오에 추가하지 않음
**결정**: signup/listDialog/feedback 시나리오에 Avatar·Badge 등을 삽입하는 변형 시나리오는 이번 run 에서 만들지 않는다. 기존 3 시나리오 회귀만 필수.
**근거**: Ralph Phase 2 지시 "회귀만 필수, 새 시나리오 추가는 선택" 명시. 새 시나리오 설계는 1B/1C (버튼·칩·탭) 완료 후 "UI 가 더 풍부해진 단계" 에서 의미 있음.

### D5 — Props 인터페이스는 React 소스를 단일 진실 원천으로 사용
**결정**: yaml 은 디자인 토큰·slot 구조 근거, React TSX 파일 (`*.tsx`) 은 Props 타입·default 값 근거. 두 소스가 충돌하면 React 소스 우선.
**근거**: 사용자가 실제 작성하는 코드는 React 기반. yaml 은 디자인 시스템 사양이지 런타임 API 가 아님. `icon.md` 가 이미 이 패턴 (Props 섹션은 TSX 기준) 을 쓰고 있음.

### D6 — 모델 라우팅
- opus: W1-S1 (구조화 편집 · 13항목 분류) · W1-S2 (namespace API 이해) · W1-S4 (2D variant) · W1-S5 (2 컴포넌트) · W1-S6 (접근성 규칙)
- sonnet: W1-S3 (단순 yaml) · W2-S7 (인덱스 갱신) · W2-S8 (스크립트 allowlist 1줄)
**근거**: "L (opus) 6+ 파일 · 복잡" 은 이번 범위에 없음. 2~5 파일 / 구조화 편집 = M = opus. 단순 수정 = S = sonnet.

---

## 검증

Wave 2 완료 후 반드시 실행 (W2-S8 내 포함):

1. `node scripts/sync-from-seed.mjs --json` → components 섹션에서:
   - `avatar`, `avatar-stack`, `badge`, `notification-badge`, `divider` 가 `status="ported"`
   - 13개 primitive 가 `status` 에 `internal-primitive` 포함
   - not-ported exact count = **54** (baseline 72 - 18)
2. `node scripts/test.mjs` → signup · listDialog · feedback 3개 모두 pass
3. `git status` → 편집 3개 (composition.md · index.md · sync-from-seed.mjs) + 신규 5개 (avatar/avatar-stack/badge/notification-badge/divider .md) = 총 8개 파일
4. `git diff --stat` → 삭제 라인 없음 (기존 컨텐츠 파괴 없음 확인)

---

## 성공 기준 요약

- Tier 1F 포팅: 7 → 12 컴포넌트 (5 추가)
- 내부 primitives 문서화: 13개 composition.md 단일 섹션
- sync-from-seed.mjs not-ported 보고: 72 → 54 (exact 18건 감소)
- dry-run 회귀: 3/3 pass
- lint · 실행 경고: 0개
- 새 파일: 5개 · 편집 파일: 3개 · 삭제 파일: 0개
