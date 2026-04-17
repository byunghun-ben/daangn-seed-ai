---
project: daangn-seed-ai
source_issues: ["#19", "#18", "#14"]
cluster: ABC composite · polish + 1A (form controls) + 1D (buttons)
created: 2026-04-17
status: draft-r2
critic_round: 2
upstream_sha: 1f1d21d
wave_count: 5
story_count: 13
---

# Plan: #19 polish + #18 polish + #14 clusters 1A & 1D (R2)

## 변경 이력 (R1 → R2)

plan-critic R1 피드백 반영. CRITICAL 3 / HIGH 5 / MEDIUM 5 모두 처리.

- **D1~D8 재넘버링 + D9 신규** (rootage-only kind).
- **D8 재정의**: InputButton 은 Rootage ID. React 에서는 FieldButton namespace 로 구현됨. S12 는 alias 관계를 명시하고 text-field.md 와 경계 구분.
- **D7 재정의**: TextButton 은 React 1f1d21d 시점 바인딩 미제공. S10 은 Rootage 토큰 스펙 + native button 가이드.
- **D9 신규**: sync script `kind` enum 에 `rootage-only` 추가. S4 에 포함.
- **S2 수락기준 교정**: 블록 재배치로 인한 false diff 검증 로직 폐기, H2 아래 본문 블록 hash 집합 불변으로 약화 + awk 비교 스크립트 제공.
- **S10 복잡도** M → S. **S12 복잡도** L → M.
- **Wave 재구성**: Wave 1(polish) → Wave 2a(S5/S7/S9 병렬) → Wave 2b(S6/S8) → Wave 3(S10/S11/S12) → Wave 4(S13). S6/S8 이 각각 S5/S7 링크를 검증하므로 분리.
- HIGH: S11 용어 통일, S9 Switch size 타입 리터럴, S4 JSON 스키마 검증, S13→S4 hard dep, S13 dead-link 검증 모두 반영.
- MEDIUM: S5 icon import 검증, S1 grep regex 강화, S6 controlled/uncontrolled, S9 form integration 추가.

### Self check

- [x] CRITICAL-1: D8/S12 FieldButton namespace alias 및 YAML↔React 매핑표 명시.
- [x] CRITICAL-2: D7/S10 React 미제공 callout + `grep -c '@seed-design/react.*TextButton' = 0` 수락기준.
- [x] CRITICAL-3: S2 block hash 집합 비교(awk) 스크립트로 교체.
- [x] HIGH-1: S11 React `pressed/onPressedChange` vs 시각적 `selected` 용어 분리 명시.
- [x] HIGH-2: S9 Switch size 타입 리터럴 일치 검증.
- [x] HIGH-3: S4 JSON 모든 entry `status` + `kind` 보유 검증.
- [x] HIGH-4: S13 hard dep S4 추가.
- [x] HIGH-5: S13 dead-link 검증(markdown-link-check equivalent).
- [x] MED-1: Wave 2 를 2a/2b 로 분할.
- [x] MED-2: S5 예제 icon import `@daangn/react-monochrome-icon` 실제 export 일치 검증.
- [x] MED-3: S1 grep 정규식 `'<PrefixIcon\b'` 강화.
- [x] MED-4: S6 controlled/uncontrolled 수락기준.
- [x] MED-5: S9 form integration(`SwitchHiddenInput` + `name`/`value`/`form`) 수락기준.

---

## 스코프 명시

- 본 plan 은 **3 개 이슈를 한 run 에 통합**한다.
  - **#19** — upstream SHA 1f1d21d 기준 skeleton 섹션 순서 통일 + page-banner PrefixIcon 예제 보정 (2 스토리)
  - **#18** — avatar Props upstream primitive 표시 주석 + sync script 의 `internal-primitive (see composition.md)` 문자열 의존성 제거 (2 스토리)
  - **#14** — Tier 1 core epic 의 cluster 1A (checkbox/checkbox-group/radio/radio-group/switch, 5 스토리) + cluster 1D (text-button/toggle-button/input-button, 3 스토리) + integration (1 스토리) = **9 스토리**
- 총 **13 스토리 · 5 Wave**.
- 기존에 포팅된 18 컴포넌트 MD 는 수정하지 않는다 (avatar 주석 추가 제외).
- 1A 5 종 + 1D 3 종을 더하면 components MD 총 **18 → 26 개**.

---

## 사전 조사 (필수 확인 결과)

### A. 1F 공통 H2 섹션 순서 대조

`_template.md` 기준 표준 순서: **언제 → Anatomy → Variants → States → Props → 합성 규칙 → 접근성 → Anti-patterns → 예제** (9 섹션).

1F 4 파일 실제 순서(수정 불필요, 참고용):

| 파일 | H2 순서 |
|------|---------|
| `_template.md` | 언제 · Anatomy · Variants · States · Props(핵심만) · 합성 규칙(composition) · 접근성 · Anti-patterns · 예제(minimum usage) |
| `avatar.md` | 언제 · Anatomy · Size · States · Token 매핑 · Props · 합성 규칙 · 접근성 · Anti-patterns · 예제 |
| `badge.md` | 언제 · Anatomy · Variants · Variant×Tone 매트릭스 · Size · Truncating · Props · 합성 규칙 · 접근성 · Anti-patterns · 예제 |
| `divider.md` | 언제 · Anatomy · Orientation · Props · 합성 규칙 · 접근성 · Anti-patterns · 예제 |
| `notification-badge.md` | 언제 · Anatomy · Size · Props · 합성 규칙 · 접근성 · Anti-patterns · 예제 |
| `skeleton.md` (**현재**) | 언제 · Anatomy · Variants · **Motion/Base 토큰 · Props · States** · 합성 규칙 · 접근성 · Anti-patterns · 예제 |

**결정**: 1F 파일은 Variants 위치에 "컴포넌트 고유축"(Size/Orientation)을 두고, States/Props/합성/접근성/Anti/예제 순서는 모두 일치한다. skeleton 만 `Motion/Base 토큰` 과 `Props` 가 `States` **앞에** 와서 벗어난다. **skeleton 을 표준 순서**(Variants → States → Motion/Base 토큰 → Props → ...)로 재배치한다.

### B. upstream `PageBanner` — PrefixIcon 실례 확인

`/tmp/seed-design-sync/packages/react/src/components/PageBanner/` namespace export 목록(`PageBanner.namespace.ts`):

```
Root, Body, Content, Title, Description, Button, CloseButton
```

**`PrefixIcon` 래퍼는 React 에 존재하지 않는다.** YAML 에는 `prefixIcon` slot 이 있지만 React namespace 는 wrapping 하지 않고, 사용자가 `PageBanner.Body` 첫 자식에 raw icon 을 넣도록 기대된다.

현재 `page-banner.md` Anatomy/YAML-slot-tokens 섹션은 올바르게 `className="seed-prefix-icon"` 가이드를 프로즈로 설명하지만, **예제 코드** (§예제 3 "AI 프로모션 magic weak") 는 `<IconSparkleFill />` 만 넣고 className 부착 또는 wrapper 를 **보여주지 않는다**. 이 예제가 AI slop 의 원인이므로 수정 필요.

### C. upstream 1A form control API 추출

| React namespace | 구성 slot | variant 축 | size 축 | 특이사항 |
|-----------------|-----------|------------|---------|----------|
| `Checkbox` | Root, Control, Group, HiddenInput, Indicator, Label | `weight: regular|bold` (+ deprecated `default`·`stronger`) · checkmark `variant: square|ghost` · `tone: brand|neutral` | `medium|large` | Root 가 `<label>` 로 렌더됨. Indicator 는 `unchecked/checked/indeterminate` SVG 를 prop 으로 받는다 |
| `Checkbox.Group` (same namespace) | Root only | (CheckboxGroupVariantProps, 현재 variant 축 **없음**) | — | `gapY: $dimension.x1` 만 base. 레이아웃 wrapper |
| `RadioGroup` | Root, Item, ItemLabel, ItemControl, ItemIndicator, ItemHiddenInput | radiomark `tone: brand|neutral` (Root 에 `weight: regular|bold`) | `medium|large` | **Radio 는 standalone export 되지 않는다** — `RadioGroup.Item` 으로만 사용. YAML `radio.yaml` 은 존재하지만 React API 는 RadioGroup 내부 primitive |
| `Switch` | Root, Control, Thumb, Label, HiddenInput | switchmark `tone: brand|neutral` | `16|24|32` (+ deprecated `small`·`medium`) | Root 가 `<label>`. `Thumb` 은 `Control` 안의 이동 점. S9 실행 단계에서 `SwitchVariantProps['size']` 타입 리터럴 직접 읽어 md 표기와 정확 대조 |

### D. upstream 1D button API 추출 (R2 교정)

| YAML ID | React export 실체 (1f1d21d) | 바인딩 상태 | 비고 |
|---------|----------------------------|-------------|------|
| `text-button.yaml` | **없음** (`packages/react/src/components/TextButton/` 폴더 없음, `index.ts` 에 export 없음) | **rootage-only** | Rootage 전용 디자인 스펙. native `<button>` + Rootage 토큰 수동 적용 또는 ActionButton `variant="ghost"` 대안. base.enabled + pressed 축만. |
| `toggle-button.yaml` | `ToggleButton` flat export (namespace 아님) | **ported** | Props: `variant: brandSolid|neutralWeak`, `size: xsmall|small`, `loading: boolean`, `pressed`(RAC-style). YAML `prefixIcon`/`suffixIcon` 은 slot 클래스명. React API 는 `pressed`/`onPressedChange` 네이밍. |
| `input-button.yaml` | `FieldButton` namespace (동일 React 컴포넌트의 alias) | **ported (via FieldButton)** | FieldButton.namespace.ts export 18개: Root, Control, Label, Value, Placeholder, PrefixIcon, PrefixText, SuffixIcon, SuffixText, ClearButton, HiddenInput, IndicatorText, ErrorMessage, Description, Button, Header, Footer, RequiredIndicator. input-button.yaml 8 slot (root/value/placeholder/prefixText/prefixIcon/suffixText/suffixIcon/clearButton) 은 이 중 subset. |

**R2 핵심 교정**:
- **text-button** 은 React 미제공. MD 는 "Rootage 토큰 스펙 문서" 로 작성.
- **input-button** 은 FieldButton alias. MD 는 `import { FieldButton } from "@seed-design/react"` 를 명시하고 YAML↔React 매핑표 제공.

### E. `scripts/sync-from-seed.mjs` status 스트링 현황

현재 `diffComponents` 리턴에서 component 하나당 `{ status: "..." }` 객체 한 줄만 emit.

- `LOCAL_ONLY_COMPONENTS`: `"local-only (slot utility / guidance)"`
- not present upstream: `"removed-upstream"`
- present both: `"ported"`
- upstream only, internal: **`"internal-primitive (see composition.md)"`** ← 이 문자열에 JSON 소비자가 의존하면 fragile
- upstream only, other: `"not-ported"`

**변경 방향**: status 는 `{ported, not-ported, removed-upstream, local-only, internal-primitive, rootage-only}` **kebab tag 만** 유지하고, 상세 문구는 별도 `kind` / `note` 필드로 분리. JSON `--json` 모드 + 사람 친화 표시 둘 다 깨지지 않도록 backward compat 유지. **`rootage-only` 는 R2 신규** — YAML 이 있지만 React export 가 없는 컴포넌트(예: text-button) 에 부여.

---

## 주요 설계 결정 (Design decisions locked before execution, R2)

### D1 — PrefixIcon 수정 방식: **className 직접 부착** 선택

- 선택지:
  - (a) 예제 코드의 icon 에 `className="seed-prefix-icon"` 추가.
  - (b) 팀 전용 `<PrefixIcon>` wrapper 컴포넌트를 예제 안에서 정의.
- 결정: **(a)**. 이유:
  1. upstream 에 `PrefixIcon` wrapper 가 없으므로 (b) 는 daangn-seed-ai skill 이 독자 API 를 소개하는 꼴이 되어 문서 일관성 훼손.
  2. `page-banner.md` Anatomy/YAML 섹션이 이미 (a) 를 가이드로 제시하고 있어, 예제만 (a) 로 맞추면 self-consistent.
  3. (b) 는 팀이 실제로 wrapper 를 만들기 전까지는 예제 코드가 동작 검증 불가.
- 적용 형태:
  ```tsx
  <IconSparkleFill className="seed-prefix-icon" aria-hidden />
  ```
- 검증: `grep -c 'seed-prefix-icon' page-banner.md` 결과가 **3 이상** (Anatomy 1 + YAML 표 1 + 예제 3 신규 1) · `grep -cE '<PrefixIcon\b' page-banner.md` = **0**.

### D2 — Skeleton 섹션 순서 기준 파일: **`_template.md`**

- avatar/badge/divider/notification-badge 모두 `States` 를 `Variants`(또는 size/orientation) 바로 뒤에 두고, `Token 매핑`(또는 유사 섹션) 은 **State 뒤 · Props 앞**에 온다.
- 결정: skeleton.md 의 최종 H2 순서를 다음으로 확정:
  1. `언제 쓰나 / 언제 쓰지 않나`
  2. `Anatomy`
  3. `Variants` (tone + radius 유지)
  4. `States`
  5. `Motion / Base 토큰`
  6. `Props (핵심만)`
  7. `합성 규칙`
  8. `접근성`
  9. `Anti-patterns`
  10. `예제`
- 본문 텍스트는 **일체 수정하지 않는다**. H2 block 전체를 순서만 재배치.
- 검증(R2): H2 line sequence 일치 + **H2 아래 본문 블록 각각의 내용 hash 집합** 이 재배치 전후 동일. awk one-liner:
  ```bash
  awk '/^## /{if(body)print body;print;body="";next}{body=body"\n"$0}END{if(body)print body}' skeleton.md | sort | sha256sum
  ```
  재배치 전/후 결과가 동일해야 함.

### D3 — Avatar Props 주석 위치: **`AvatarRootProps` / `AvatarImageProps` 타입 선언 줄 바로 위**

- upstream `Avatar.tsx:14,20` 에서 실제 선언:
  ```ts
  export interface AvatarRootProps extends AvatarVariantProps, Image.RootProps {}
  export interface AvatarImageProps extends Image.ContentProps {}
  ```
- 현재 md Props 섹션은 `React.HTMLAttributes<HTMLDivElement>` / `React.ImgHTMLAttributes<HTMLImageElement>` 로 **단순화** 표시.
- 결정: **주석 1줄** 추가 (타입 치환 X). 형식은 기존대로 유지 + upstream 실체 명시.
- 검증: `grep -c 'Image.RootProps' avatar.md` ≥ 1, `grep -c 'Image.ContentProps' avatar.md` ≥ 1, `grep -c '@seed-design/react-image' avatar.md` ≥ 1.

### D4 — sync-script `kind` 필드 추가 방식: **status 는 kebab 태그만, 상세는 `kind` + `note`**

- 결정: `diffComponents` 의 report 엔트리를 `{ status, kind, note? }` 로 정규화 (backward compat 확장).
  ```js
  // AFTER
  {
    status: "internal-primitive",            // kebab tag, machine-friendly
    kind: "internal-primitive",               // 분류 카테고리 (status 와 동일값이거나 enum)
    note: "Documented collectively in decision-matrices/composition.md",
  }
  ```
- 다른 status 도 동일하게 정규화:
  - `{ status: "local-only", kind: "local-only", note: "slot utility / guidance" }`
  - `{ status: "ported", kind: "ported" }` (note 없음)
  - `{ status: "removed-upstream", kind: "removed-upstream" }`
  - `{ status: "not-ported", kind: "not-ported" }`
  - `{ status: "rootage-only", kind: "rootage-only", note: "YAML spec exists, no React export at this SHA" }` (**D9**)
- 사람용 출력 은 `note` 가 있으면 `${status} — ${note}` 로 인쇄.
- 검증(R2):
  - `node scripts/sync-from-seed.mjs --json` output 의 `components` 모든 entry 가 `status` **AND** `kind` 필드 둘 다 보유. `status` enum = {ported, not-ported, removed-upstream, local-only, internal-primitive, rootage-only} 중 하나.
  - 한 줄 node 검증:
    ```bash
    node -e 'const j=JSON.parse(require("fs").readFileSync(0));const s=new Set(["ported","not-ported","removed-upstream","local-only","internal-primitive","rootage-only"]);for(const[k,v] of Object.entries(j.components)){if(!v.status||!v.kind||!s.has(v.status))throw new Error(k+": "+JSON.stringify(v));}console.log("ok")' < /tmp/sync.json
    ```
  - `grep -c 'see composition.md' scripts/sync-from-seed.mjs` = 0 (상세 문구는 note 로 이동).
  - Human 모드 출력이 기존과 시각적으로 동등 (note 가 있으면 hyphen 뒤에 붙음).

### D5 — Radio 문서화 방식: **`radio-group.md` 에 통합, `radio.md` 는 리다이렉트 스텁**

- upstream React 는 `RadioGroup.Item` 만 export 하고 standalone `Radio` export 는 없다. 그러나 YAML `radio.yaml` 이 sync diff 에서 `not-ported` 로 감지되므로 **무언가 파일이 필요**.
- 결정: `radio-group.md` 에 full 문서, `radio.md` 는 2-5 줄 pointer stub + YAML 토큰 표(variant/size).
- `radio.md` stub 내용: "React 에서 Radio 는 RadioGroup 내부 primitive 로만 쓰인다. 사용법은 [`radio-group.md`](./radio-group.md) 참조" + Variants(tone/size)·YAML 토큰 표는 포함.

### D6 — `checkbox.md` vs `checkbox-group.md` 스플릿 (Radio 와 대칭)

- `checkbox.md` 는 **standalone Checkbox** 문서. `checkbox-group.md` 는 **wrapper/layout 문서** — gap, 다중 선택 패턴, FormData 처리 예제.

### D7 — 1D `text-button.md` — **Rootage 전용 · React 바인딩 미제공** (R2 재정의)

- **사실**: upstream SHA 1f1d21d 시점 `packages/react/src/components/TextButton/` 폴더는 존재하지 않으며, `packages/react/src/components/index.ts` 에 `TextButton` export 없음.
- upstream `text-button.yaml` 은 variant/size 축 없이 base.enabled + pressed 만 정의. 1 종류의 "작은 신호용 링크형 버튼" 디자인 스펙.
- **결정**: `text-button.md` 는 Rootage 토큰 스펙 문서로 작성. 첫 단락에 다음 callout:
  > ⚠️ **React 컴포넌트 미제공 · Rootage 토큰 스펙 문서** — upstream `@seed-design/react` 1f1d21d 시점에는 TextButton 바인딩이 없습니다. native `<button>` + Rootage 토큰을 수동으로 적용하거나 `ActionButton variant="ghost"` 를 대안으로 사용하세요.
- MD 구조: `Variants` 없음 → `기본 스펙 (Rootage tokens)` → `States` (enabled/pressed/disabled) → `직접 구현 시 가이드` → 합성 규칙 → 접근성 → Anti-patterns → 예제 (native button + Rootage 토큰).

### D8 — 1D `input-button.md` — **FieldButton alias** (R2 재정의)

- **사실**: upstream `packages/react/src/components/FieldButton/FieldButton.namespace.ts` 는 Root, Control, Label, Value, Placeholder, PrefixIcon, PrefixText, SuffixIcon, SuffixText, ClearButton, HiddenInput, IndicatorText, ErrorMessage, Description, Button, Header, Footer, RequiredIndicator (18 exports) 를 제공. `input-button.yaml` 의 8 slot(root/value/placeholder/prefixText/prefixIcon/suffixText/suffixIcon/clearButton) 은 이 namespace 의 subset 으로 그대로 구현됨.
- **결정**: `input-button.md` 는 Rootage ID 이며 React 에서는 `FieldButton` namespace 로 구현됨. MD 파일명은 `input-button.md` 유지.
- 첫 단락: `import { FieldButton } from "@seed-design/react"` 를 명시하고 **YAML↔React 매핑표** 제공 (input-button.yaml slot → FieldButton.{Root, Value, Placeholder, PrefixText, PrefixIcon, SuffixText, SuffixIcon, ClearButton}).
- FieldButton 의 18 exports 중 input-button.yaml 8 slot 에 해당하는 subset 만 "Anatomy" 섹션에 배치하고, 나머지(Header/Footer/ErrorMessage/Description/RequiredIndicator) 는 `## Field 조합 시 추가 slot` 하위 섹션으로 분리.
- **text-field.md 와 경계**:
  - `text-field.md` = **자유 입력** (text-input + field + field-label composition).
  - `input-button.md` = **picker trigger** (클릭 시 BottomSheet/Dialog/ActionSheet 띄워 값 선택).
- 두 문서는 서로 교차 링크 필수.

### D9 — sync script `kind` enum 에 `rootage-only` 추가 (R2 신규)

- 배경: text-button 처럼 YAML spec 은 존재하지만 React export 가 없는 컴포넌트를 명확히 분류해야 함. 기존 `not-ported` 는 "언젠가 포팅될 것" 뉘앙스 강함.
- `LOCAL_ONLY_COMPONENTS` 와 별도로 `ROOTAGE_ONLY_COMPONENTS` 세트를 `scripts/sync-from-seed.mjs` 에 추가. 1f1d21d 시점:
  ```js
  const ROOTAGE_ONLY_COMPONENTS = new Set(["text-button"]);
  ```
- `diffComponents` 에서 "YAML 있음 + React export 없음 + 이 세트에 포함" 이면 `{ status: "rootage-only", kind: "rootage-only", note: "YAML spec exists, no React export at this SHA" }`.
- S4 에 포함 (별도 S4b 로 분리하지 않음) — `LOCAL_ONLY_COMPONENTS` 와 동일 파일 · 동일 함수 내 추가이므로 surgical 범위.

---

## Wave 분할 (R2 재구성)

**전략**: polish 4 스토리 병렬 → 1A independent 3 병렬 → 1A dependent 2 병렬 → 1D 3 병렬 → integration 단독.

**의존성 근거**: S6(checkbox-group) 가 S5(checkbox) 로의 교차 링크를, S8(radio-group) 가 S7(radio stub) 로의 역참조를 **문서 생성 시점에** 검증할 수 있도록 분리. 동시 실행 시 working tree 상 아직 파일이 없어 링크 검증 수락기준 false positive 가능. MED-1 반영.

### Wave 1 — Polish (#19 + #18), 4 스토리 병렬

- S1, S2, S3, S4 동시 실행 가능.

### Wave 2a — 1A independent (#14), 3 스토리 병렬

- S5 (checkbox.md), S7 (radio.md stub), S9 (switch.md) 동시 실행.

### Wave 2b — 1A dependent (#14), 2 스토리 병렬

- S6 (checkbox-group.md, depends on S5), S8 (radio-group.md, depends on S7) 동시 실행.

### Wave 3 — 1D buttons (#14), 3 스토리 병렬

- S10 (text-button.md), S11 (toggle-button.md), S12 (input-button.md) 동시 실행.

### Wave 4 — Integration (#14), 1 스토리

- S13: Wave 1~3 완료를 전제로 `index.md`, `decision-matrices/which-input.md`, `decision-matrices/which-button.md` 3 파일 편집. **Hard dep: S4 (sync script `kind` enum 확정)** + S5~S12.

---

## 스토리

### S1 (#19-1): page-banner.md — PrefixIcon 예제에 className 부착

- **설명**: `plugins/daangn-seed-ai/skills/seed/references/components/page-banner.md` §예제 3 "AI 프로모션 magic weak" 내 `<IconSparkleFill />` 를 `<IconSparkleFill className="seed-prefix-icon" aria-hidden />` 로 교체. Anti-patterns 블록에는 예시 아이콘이 없으므로 손대지 않는다. 다른 예제(§예제 1,2,4) 는 아이콘이 없어 무변경.
- **수정 파일**: `plugins/daangn-seed-ai/skills/seed/references/components/page-banner.md`
- **upstream 참조**: `/tmp/seed-design-sync/packages/react/src/components/PageBanner/PageBanner.namespace.ts` (PrefixIcon 미 export 확인), `/tmp/seed-design-sync/packages/rootage/components/page-banner.yaml` (prefixIcon slot 토큰)
- **수락 기준**:
  1. `grep -c 'seed-prefix-icon' page-banner.md` ≥ 3.
  2. `grep -n 'IconSparkleFill' page-banner.md` 모든 매치 줄에 `className="seed-prefix-icon"` 동반.
  3. **(MED-3)** `grep -cE '<PrefixIcon\b' page-banner.md` = 0 (팀 wrapper 도입 금지 확인, word-boundary 로 오탐 배제).
  4. 문서 전체 H2 수 변동 없음.
- **복잡도**: S
- **권장 모델**: sonnet
- **의존성**: 없음

### S2 (#19-2): skeleton.md — H2 섹션 순서 재배치

- **설명**: `skeleton.md` 의 H2 블록 순서를 `_template.md` 표준으로 정리. `States` 를 `Variants` 바로 뒤로 이동, `Motion / Base 토큰` 을 `Props` 앞으로 이동. 본문 텍스트/코드 블록은 바꾸지 않고 블록 단위로만 재배치.
- **수정 파일**: `plugins/daangn-seed-ai/skills/seed/references/components/skeleton.md`
- **기준 파일**: `_template.md` + 1F 4 파일 공통 패턴.
- **수락 기준**:
  1. `grep -n '^## ' skeleton.md` 출력이 정확히 다음 10 줄(순서대로): `언제 쓰나 / 언제 쓰지 않나`, `Anatomy`, `Variants`, `States`, `Motion / Base 토큰`, `Props (핵심만)`, `합성 규칙`, `접근성`, `Anti-patterns`, `예제`.
  2. 재배치 전후 `wc -l skeleton.md` 차이 ≤ 2.
  3. **(CRITICAL-3 교정)** H2 아래 본문 블록 각각의 내용 hash 집합이 재배치 전후 동일. 검증 스크립트:
     ```bash
     # before 와 after 의 정렬된 블록 집합이 같아야 함
     awk '/^## /{if(body)print body;print;body="";next}{body=body"\n"$0}END{if(body)print body}' skeleton.md | sort | sha256sum
     ```
     (git stash pop 전후로 비교 가능. 로컬 실행시 before hash 를 캡처 후 after hash 와 일치 확인.)
- **복잡도**: S
- **권장 모델**: sonnet
- **의존성**: 없음

### S3 (#18-3): avatar.md — upstream primitive 주석 추가

- **설명**: `avatar.md` §Props 섹션의 `AvatarRootProps` 인터페이스 정의 바로 위에 실제 upstream 이 `Image.RootProps` (react-image primitive) 를 extends 한다는 사실을 주석 2-3 줄로 기입. 동일하게 `AvatarImageProps` 위에 `Image.ContentProps` 주석.
- **수정 파일**: `plugins/daangn-seed-ai/skills/seed/references/components/avatar.md`
- **upstream 참조**: `/tmp/seed-design-sync/packages/react/src/components/Avatar/Avatar.tsx:14,20`
- **수락 기준**:
  1. `grep -n 'Image.RootProps' avatar.md` ≥ 1.
  2. `grep -n 'Image.ContentProps' avatar.md` ≥ 1.
  3. `grep -n '@seed-design/react-image' avatar.md` ≥ 1.
  4. 기존 interface body, default 설명, 예제 코드 등 그 외 콘텐츠는 불변.
- **복잡도**: S
- **권장 모델**: sonnet
- **의존성**: 없음

### S4 (#18-4): sync-from-seed.mjs — status/kind 분리, rootage-only 도입

- **설명**: `scripts/sync-from-seed.mjs` 의 `diffComponents` 에서 report 엔트리를 `{ status, kind, note? }` 형태로 정규화. `ROOTAGE_ONLY_COMPONENTS = new Set(["text-button"])` 추가. JSON 출력 기존 필드 `status` 는 kebab 태그만 유지하고, 상세 문구는 `note` 로 분리. Human 인쇄부도 `note` 있으면 `${status} — ${note}` 로 표시.
- **수정 파일**: `scripts/sync-from-seed.mjs`
- **수락 기준**:
  1. `grep -c 'see composition.md' scripts/sync-from-seed.mjs` = 0.
  2. `grep -c 'ROOTAGE_ONLY_COMPONENTS' scripts/sync-from-seed.mjs` ≥ 1.
  3. `grep -c '"text-button"' scripts/sync-from-seed.mjs` ≥ 1 (세트 내 등록 확인).
  4. `node scripts/sync-from-seed.mjs --json > /tmp/sync.json` 실행 후 **(HIGH-3)** 검증 스크립트 통과:
     ```bash
     node -e 'const j=JSON.parse(require("fs").readFileSync(0));const s=new Set(["ported","not-ported","removed-upstream","local-only","internal-primitive","rootage-only"]);for(const[k,v] of Object.entries(j.components)){if(!v.status||!v.kind||!s.has(v.status))throw new Error(k+": "+JSON.stringify(v));}console.log("ok")' < /tmp/sync.json
     ```
     (모든 component 가 `status` + `kind` 둘 다 보유, `status` 는 enum 내에 있음)
  5. `/tmp/sync.json` 의 `components["text-button"].status === "rootage-only"`.
  6. `node scripts/sync-from-seed.mjs` (human mode) 실행 시 `internal-primitive` 항목은 `internal-primitive — Documented collectively in decision-matrices/composition.md` 형식.
  7. `git diff scripts/sync-from-seed.mjs` 의 변경 ≤ 60 줄.
- **복잡도**: M
- **권장 모델**: opus (JSON 스키마 backward compat 판단 필요)
- **의존성**: 없음

### S5 (#14-1A-5): checkbox.md — standalone Checkbox 문서 신규 작성

- **설명**: Checkbox namespace 의 Root/Control/Group(ref)/HiddenInput/Indicator/Label 6 slot 을 self-contained MD 로 문서화. YAML `checkbox.yaml` + `checkmark.yaml` 의 variant (weight regular/bold, checkmark variant square/ghost, tone brand/neutral, size medium/large) 를 모두 반영. Indicator 의 `unchecked/checked/indeterminate` prop 은 SVG 를 전달하는 형태임을 예제로 명시.
- **생성 파일**: `plugins/daangn-seed-ai/skills/seed/references/components/checkbox.md`
- **upstream 참조**:
  - `/tmp/seed-design-sync/packages/rootage/components/checkbox.yaml`
  - `/tmp/seed-design-sync/packages/rootage/components/checkmark.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/Checkbox/Checkbox.namespace.ts`
  - `/tmp/seed-design-sync/packages/react/src/components/Checkbox/Checkbox.tsx`
  - **(MED-2)** `/tmp/seed-design-sync/packages/react-monochrome-icon/src/index.ts` — 예제에 쓸 `IconCheckmarkLine`/`IconMinusLine` 등 실존 export 확인
- **수락 기준**:
  1. 파일 존재, 최소 150 줄.
  2. H2 섹션 순서가 `언제 쓰나 · Anatomy · Variants · States · Token 매핑 · Props · 합성 규칙 · 접근성 · Anti-patterns · 예제` 중 최소 8 개 이상 포함.
  3. `grep -cE 'Checkbox\.(Root|Control|Indicator|Label|HiddenInput)' checkbox.md` ≥ 5.
  4. `weight="regular"` 와 `weight="bold"` 둘 다 예제에 등장.
  5. `indeterminate` 사용 예제 최소 1 개.
  6. deprecated `default` / `stronger` 에 대한 안내 1 문단 포함.
  7. Anti-patterns 섹션에 "React 속성으로 `<input type="checkbox">` 직접 사용" 케이스 포함.
  8. **(MED-2)** 예제 내 아이콘 import 가 `@daangn/react-monochrome-icon` 의 실제 export 와 일치:
     ```bash
     grep -oE "from ['\"]@daangn/react-monochrome-icon['\"]" checkbox.md
     # 이 import 의 import 본문(`{ IconCheckmarkLine, IconMinusLine, ... }`) 각 이름이 /tmp/seed-design-sync/packages/react-monochrome-icon/src/index.ts 에 export 되어야 함
     ```
- **복잡도**: M
- **권장 모델**: opus
- **의존성**: 없음

### S6 (#14-1A-6): checkbox-group.md — wrapper/layout 문서 신규 작성

- **설명**: CheckboxGroup 은 `gapY` 만 관리하는 경량 wrapper. Fieldset role, legend 접근성, `name=` 공유, FormData 처리, 가로/세로 배치 예제 포함.
- **생성 파일**: `plugins/daangn-seed-ai/skills/seed/references/components/checkbox-group.md`
- **upstream 참조**:
  - `/tmp/seed-design-sync/packages/rootage/components/checkbox-group.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/Checkbox/Checkbox.tsx` (`CheckboxGroup` 선언 확인)
- **수락 기준**:
  1. 파일 존재, 최소 100 줄.
  2. "언제 쓰나" 표에 `Checkbox 단일` vs `CheckboxGroup` vs `RadioGroup` 구분.
  3. `<fieldset>` / `<legend>` 접근성 패턴 예제 1 개.
  4. `gapY` 토큰 표기 `$dimension.x1` 명시.
  5. `import { Checkbox } from "@seed-design/react"` + `<Checkbox.Group>` 명시.
  6. **(MED-4)** controlled 예제 (`value={selected} onValueChange={setSelected}`) 1 개 + uncontrolled 예제 (`defaultValue={["option-1"]}`) 1 개.
  7. `[./checkbox.md](./checkbox.md)` 교차 링크 ≥ 1, 링크된 파일이 working tree 에 실제 존재.
- **복잡도**: S
- **권장 모델**: sonnet
- **의존성**: **hard dep S5** (checkbox.md 파일이 working tree 에 존재해야 링크 수락기준 통과)

### S7 (#14-1A-7): radio.md — RadioGroup.Item 개념 스텁

- **설명**: upstream React 에 `Radio` standalone export 가 없다는 사실 + YAML `radio.yaml` spec 존재를 설명하는 short redirect doc.
- **생성 파일**: `plugins/daangn-seed-ai/skills/seed/references/components/radio.md`
- **upstream 참조**:
  - `/tmp/seed-design-sync/packages/rootage/components/radio.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/RadioGroup/RadioGroup.namespace.ts` (Radio 미 export 확인)
- **수락 기준**:
  1. 파일 존재, 40-80 줄 (stub).
  2. 첫 H2 또는 callout 블록에 "React 에서는 RadioGroup.Item 으로만 사용" 명시.
  3. `[./radio-group.md](./radio-group.md)` 링크 ≥ 2 회.
  4. `weight=regular` / `weight=bold` / `size=medium` / `size=large` 토큰 표 포함.
  5. "standalone Radio 는 React API 에 없음" 이라는 문장을 직접 명기.
- **복잡도**: S
- **권장 모델**: sonnet
- **의존성**: 없음

### S8 (#14-1A-8): radio-group.md — RadioGroup 전체 namespace 문서 신규 작성

- **설명**: Root, Item, ItemLabel, ItemControl, ItemIndicator, ItemHiddenInput 6 slot 문서화. `radiomark.yaml` 의 variant tone(brand/neutral), size(medium/large) 를 Item 축으로 포함.
- **생성 파일**: `plugins/daangn-seed-ai/skills/seed/references/components/radio-group.md`
- **upstream 참조**:
  - `/tmp/seed-design-sync/packages/rootage/components/radio-group.yaml`
  - `/tmp/seed-design-sync/packages/rootage/components/radio.yaml`
  - `/tmp/seed-design-sync/packages/rootage/components/radiomark.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/RadioGroup/RadioGroup.namespace.ts`
  - `/tmp/seed-design-sync/packages/react/src/components/RadioGroup/RadioGroup.tsx`
- **수락 기준**:
  1. 파일 존재, 최소 180 줄.
  2. 6 slot 모두 Anatomy 표에 등장.
  3. `tone="brand"` 와 `tone="neutral"` 양쪽 예제 최소 1 회.
  4. controlled (`value`, `onValueChange`) 예제 1 개 + uncontrolled (`defaultValue`) 1 개.
  5. `[./radio.md](./radio.md)` 상호 링크 ≥ 1, 링크된 파일이 working tree 에 실제 존재.
  6. Anti-patterns 에 "RadioGroup 없이 Item 단독 사용" 금지 케이스 포함.
  7. 접근성: `<fieldset>`/`<legend>` 또는 `role="radiogroup"` 1 문단.
- **복잡도**: M
- **권장 모델**: opus
- **의존성**: **hard dep S7** (radio.md stub 파일이 working tree 에 존재해야 링크 수락기준 통과)

### S9 (#14-1A-9): switch.md — Switch namespace 문서 신규 작성

- **설명**: Root/Control/Thumb/Label/HiddenInput 5 slot 문서화. `switch.yaml` + `switchmark.yaml` 의 size · tone 축 명시. thumb scale/translate/color 모션 토큰 표, controlled vs uncontrolled 예제, form integration.
- **생성 파일**: `plugins/daangn-seed-ai/skills/seed/references/components/switch.md`
- **upstream 참조**:
  - `/tmp/seed-design-sync/packages/rootage/components/switch.yaml`
  - `/tmp/seed-design-sync/packages/rootage/components/switchmark.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/Switch/Switch.namespace.ts`
  - `/tmp/seed-design-sync/packages/react/src/components/Switch/Switch.tsx` (**HIGH-2**: `SwitchVariantProps['size']` 타입 리터럴 직접 확인)
- **수락 기준**:
  1. 파일 존재, 최소 180 줄.
  2. `Switch.Root`, `Switch.Control`, `Switch.Thumb`, `Switch.Label`, `Switch.HiddenInput` 모든 slot 언급.
  3. **(HIGH-2)** Variants 표의 size 값이 `Switch.tsx` 의 `SwitchVariantProps['size']` 타입 리터럴과 정확히 일치. 실행 단계에서 해당 타입을 읽고 md 에 기재된 리터럴 문자열과 문자 단위 비교 (현재 확인된 리터럴: `"16"`, `"24"`, `"32"` + deprecated `"small"`, `"medium"`).
  4. deprecated 값에 대한 migration 경고 1 문단 포함.
  5. tone `brand` / `neutral` 양쪽 예제 최소 1 회.
  6. "Switch vs Checkbox" 구분 callout 포함.
  7. **(MED-5)** form integration 예제 1 개 — `<Switch.Root name="notifications" value="on" form="prefs-form">` + `<Switch.HiddenInput>` 조합, FormData 제출 결과까지 설명.
- **복잡도**: M
- **권장 모델**: opus
- **의존성**: 없음

### S10 (#14-1D-10): text-button.md — Rootage 토큰 스펙 문서 (R2 재정의)

- **설명**: upstream 1f1d21d 시점 React 미제공. MD 는 Rootage YAML 토큰 스펙 + native `<button>` + Rootage 토큰 적용 가이드 + ActionButton ghost 대안 비교.
- **생성 파일**: `plugins/daangn-seed-ai/skills/seed/references/components/text-button.md`
- **upstream 참조**:
  - `/tmp/seed-design-sync/packages/rootage/components/text-button.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/` (TextButton 폴더 부재 확인 — 실행 단계에서 `ls` 로 재확인)
- **수락 기준**:
  1. 파일 존재, 최소 100 줄 (이전 M 에서 S 로 하향하며 분량 기준도 130 → 100).
  2. 첫 단락(또는 블록 callout) 에 "**React 컴포넌트 미제공 · Rootage 토큰 스펙 문서**" 문구 포함.
  3. **(CRITICAL-2)** `grep -c 'import.*TextButton.*@seed-design/react' text-button.md` = 0 — 존재하지 않는 컴포넌트를 import 하는 예제 금지.
  4. `Variants` 섹션 없음(또는 "없음" 명시). 대신 `## 기본 스펙 (Rootage tokens)`.
  5. `minHeight=x9`, `paddingX=x3_5`, `paddingY=x2`, `cornerRadius=r2`, `fg.neutral-muted`, `fontWeight=bold`, `fontSize=t4` 모두 Token 매핑에 명시.
  6. `pressed` state 토큰 `bg.layer-default-pressed` 명시.
  7. `## 직접 구현 시 가이드` 섹션 포함 — 두 대안: (a) native `<button>` + Rootage CSS 변수 수동 적용, (b) `ActionButton variant="ghost"` 근사치.
  8. `[./action-button.md](./action-button.md)` 교차 링크 ≥ 1.
  9. 예제 최소 2 개 (native button 예제 1 + ActionButton ghost 대안 예제 1).
- **복잡도**: **S** (R1 M 에서 하향 — React 컴포넌트 없어 Props/Anatomy 섹션이 단순, 주로 토큰 표 + 짧은 가이드)
- **권장 모델**: sonnet
- **의존성**: 없음

### S11 (#14-1D-11): toggle-button.md — ToggleButton 문서 신규 작성

- **설명**: ToggleButton 은 flat export(namespace 아님). React props: `variant: brandSolid|neutralWeak`, `size: xsmall|small`, `loading: boolean`, `pressed: boolean` / `onPressedChange`. YAML `toggle-button.yaml` 의 `selected,pressed` · `selected,loading` 조합 state 표 작성.
- **생성 파일**: `plugins/daangn-seed-ai/skills/seed/references/components/toggle-button.md`
- **upstream 참조**:
  - `/tmp/seed-design-sync/packages/rootage/components/toggle-button.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/ToggleButton/ToggleButton.tsx`
  - `/tmp/seed-design-sync/packages/react/src/components/ToggleButton/index.ts`
- **수락 기준**:
  1. 파일 존재, 최소 170 줄.
  2. `variant="brandSolid"`, `variant="neutralWeak"` 양쪽 예제.
  3. `size="xsmall"`, `size="small"` 모두 언급.
  4. `loading` + `progressCircle` slot 자동 렌더 설명 1 문단.
  5. controlled 예제 1 개 — `pressed={isPressed} onPressedChange={setIsPressed}`.
  6. State 매트릭스 표에 `selected,pressed`, `selected,loading`, `disabled` 모두 등장.
  7. ToggleButton vs Switch 구분 callout.
  8. **(HIGH-1)** `## YAML slot 과 React API 구분` 1 문단 — YAML 의 `prefixIcon`/`suffixIcon`/`progressCircle`/`label` 은 **CSS className (slot)** 이고 React 컴포넌트 API 가 아님을 명시. YAML state 축의 `selected` 는 시각적 디자인 상태, React API 는 `pressed`/`onPressedChange` 네이밍 — 둘의 매핑표 제공.
  9. **(HIGH-1)** MD 내 `selected` 와 `pressed` 혼용 금지 — "React API" 섹션에서는 일관되게 `pressed`, "시각적 상태/YAML" 설명에서만 `selected` 사용.
- **복잡도**: M
- **권장 모델**: opus
- **의존성**: 없음

### S12 (#14-1D-12): input-button.md — FieldButton alias 문서 (R2 재정의)

- **설명**: `input-button.yaml` 은 Rootage ID. React 에서는 `FieldButton` namespace 로 구현됨. MD 파일명은 `input-button.md` 유지하되 첫 단락 + YAML↔React 매핑표로 alias 관계 명시. text-field.md 와 경계: text-field=자유 입력, input-button=picker trigger.
- **생성 파일**: `plugins/daangn-seed-ai/skills/seed/references/components/input-button.md`
- **upstream 참조**:
  - `/tmp/seed-design-sync/packages/rootage/components/input-button.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/FieldButton/FieldButton.namespace.ts` (18 exports)
  - `/tmp/seed-design-sync/packages/react/src/components/FieldButton/FieldButton.tsx`
- **수락 기준**:
  1. 파일 존재, 최소 140 줄 (L → M 하향, 기준 160 → 140).
  2. 첫 단락에 `import { FieldButton } from "@seed-design/react"` 명시.
  3. **(CRITICAL-1)** YAML ↔ React 매핑표 포함 — input-button.yaml 의 8 slot (root/value/placeholder/prefixText/prefixIcon/suffixText/suffixIcon/clearButton) 이 각각 FieldButton.{Root, Value, Placeholder, PrefixText, PrefixIcon, SuffixText, SuffixIcon, ClearButton} 에 대응한다는 표.
  4. 8 slot 모두 Anatomy 섹션에 등장.
  5. FieldButton namespace 의 18 exports 중 input-button.yaml 에 없는 slot (Header, Footer, ErrorMessage, Description, RequiredIndicator, Button, Control, HiddenInput, IndicatorText, Label) 은 `## Field 조합 시 추가 slot` 하위 섹션으로 분리되어 "기본 input-button 사용 시에는 불필요" 로 명시.
  6. State 매트릭스에 `enabled`, `pressed`, `invalid`, `disabled`, `readonly` 5 종 모두 포함.
  7. `height=x13`, `cornerRadius=r3`, `strokeColor=stroke.neutral-weak`, `strokeColor(invalid)=stroke.critical-solid` 모두 명시.
  8. **(CRITICAL-1)** `[./text-field.md](./text-field.md)` 교차 링크 ≥ 1 — text-field=자유 입력 / input-button=picker trigger 경계 설명 1 문단 포함.
  9. Anti-patterns 에 "자유 입력이 필요한데 InputButton(FieldButton) 사용" 금지 케이스 포함 (대신 text-field.md 로 유도).
- **복잡도**: **M** (R1 L 에서 하향 — FieldButton 전체 18 export 를 다 다루지 않고 input-button 8 slot subset 에 집중, 나머지는 pointer)
- **권장 모델**: opus
- **의존성**: 없음

### S13 (#14-INT-13): index.md + which-input.md + which-button.md 통합 갱신

- **설명**: Wave 1-3 완료 후 참조 인덱스와 결정 매트릭스를 갱신.
  1. `references/index.md` 트리에 8 개 신규 파일 줄 추가. 커버리지 문구 `총 18 컴포넌트` → `총 26 컴포넌트`. "미포팅 컴포넌트" 리스트에서 Checkbox, RadioGroup, Switch, ToggleButton 제거. "Rootage-only" 섹션 신규 추가 — text-button 1 건.
  2. `decision-matrices/which-input.md` — 현재 결정트리 각 라인의 `→` 뒤에 신규 MD 로의 링크 부착. 비교표도 동일.
  3. `decision-matrices/which-button.md` — 비교표에 `TextButton (Rootage-only)`, `InputButton (→ FieldButton)`, `ToggleButton` 행 추가 + 결정트리에서 "폼 필드 내부 → FieldButton" 옆에 `InputButton (picker trigger)` 라인 추가.
- **수정 파일**:
  - `plugins/daangn-seed-ai/skills/seed/references/index.md`
  - `plugins/daangn-seed-ai/skills/seed/references/decision-matrices/which-input.md`
  - `plugins/daangn-seed-ai/skills/seed/references/decision-matrices/which-button.md`
- **수락 기준**:
  1. `grep -c 'checkbox.md\|checkbox-group.md\|radio.md\|radio-group.md\|switch.md\|text-button.md\|toggle-button.md\|input-button.md' index.md` ≥ 8.
  2. `grep -c '총 26 컴포넌트' index.md` ≥ 1.
  3. which-button.md 에 `TextButton`, `InputButton`, `ToggleButton` 행 모두 존재.
  4. `grep -cE '\]\(\.\./components/(checkbox|radio-group|switch)\.md\)' which-input.md` ≥ 3.
  5. **(HIGH-4)** `node scripts/sync-from-seed.mjs --json > /tmp/sync.json` 실행 결과에서:
     - `j.components["checkbox"].status === "ported"` (string equality)
     - 동일하게 `checkbox-group`, `radio-group`, `switch`, `toggle-button`, `input-button` 모두 `status === "ported"`.
     - `j.components["text-button"].status === "rootage-only"`.
     - `j.components["radio"]` 은 `status === "rootage-only"` 또는 `"not-ported"` (upstream React export 없음이므로 D5 에 따라 스텁이지만 sync 분류는 실행 단계에서 결정 — S4 의 `ROOTAGE_ONLY_COMPONENTS` 세트에 radio 포함 여부를 S4 실행 시 결정).
  6. `components/` 아래 `.md` 파일 수 = 기존 19(18 + `_template.md`) + 8 = 27.
  7. **(HIGH-5)** dead-link 검증 — 다음 grep-based 스크립트가 exit 0:
     ```bash
     cd plugins/daangn-seed-ai/skills/seed/references
     # 모든 MD 의 상대 링크 수집 후 실존 확인
     grep -rhoE '\]\(\.\./?[^)]+\.md\)' . | sed -E 's/^\]\(//;s/\)$//' | sort -u | while read link; do
       for base in components decision-matrices .; do
         [ -f "$base/$link" ] && found=1 && break
         found=0
       done
       [ "$found" = "0" ] && echo "DEAD: $link" && exit 1
     done; echo "ok"
     ```
     (또는 동등한 markdown-link-check 로 0 errors 확인. 8 개 신규 MD + 기존 MD 상호 참조 모두 커버.)
- **복잡도**: M
- **권장 모델**: opus (3 파일 동시 편집, 일관성 검증 필요)
- **의존성**: **hard dep S4** + S5, S6, S7, S8, S9, S10, S11, S12 **모두 완료**. S4 의 `kind` enum 확정 없이는 수락기준 5 의 string equality 검증 불가.

---

## 의존성 그래프

```
Wave 1 (polish, 병렬)
├── S1 (#19-1 page-banner.md) ── 독립
├── S2 (#19-2 skeleton.md)     ── 독립
├── S3 (#18-3 avatar.md)       ── 독립
└── S4 (#18-4 sync.mjs)        ── 독립

Wave 2a (1A independent, 병렬)
├── S5 (checkbox.md)           ── 독립
├── S7 (radio.md stub)         ── 독립
└── S9 (switch.md)             ── 독립

Wave 2b (1A dependent, 병렬)
├── S6 (checkbox-group.md)     ── hard dep S5
└── S8 (radio-group.md)        ── hard dep S7

Wave 3 (1D, 병렬)
├── S10 (text-button.md)       ── 독립
├── S11 (toggle-button.md)     ── 독립
└── S12 (input-button.md)      ── 독립

Wave 4 (integration)
└── S13 (index.md + 2 matrices) ── hard dep: S4 + S5..S12 완료
```

---

## 리스크 & 완화 (R2)

| 리스크 | 영향 | 완화 |
|--------|------|------|
| S4 JSON 소비자가 상세 문구에 의존하는 코드가 숨어있음 | 중 | `status` 는 기존 kebab 태그 유지, 상세는 별도 `note` 필드. 변경 후 repo 내 `grep 'see composition.md'` 로 사용처 확인. |
| S10 text-button 의 "React 미제공" 상태가 후속 SHA 에서 바뀔 가능성 | 저 | upstream SHA 1f1d21d 고정. MD 상단 frontmatter 또는 callout 에 `upstream_sha: 1f1d21d` 명시하여 후속 sync 시 재평가 트리거. |
| S12 FieldButton 의 18 export 중 input-button 8 slot subset 경계가 모호 | 중 | D8 에 매핑표 · `## Field 조합 시 추가 slot` 하위 섹션 분리 방침 고정. 실행 시 FieldButton.tsx 의 slot 별 role 주석을 읽어 반영. |
| S8 RadioGroup ItemIndicator 기본 SVG 가 upstream 업데이트로 변경 | 저 | upstream SHA 1f1d21d 고정. RadioGroup.tsx 의 circle fill 을 그대로 코드 블록 인용. |
| S2 섹션 재배치로 인한 내부 앵커 링크 깨짐 | 저 | skeleton.md 는 타 MD 에서 `#variants` 같은 앵커 링크를 받지 않음 (S13 dead-link 검증이 최종 방어). |
| Wave 2a 동시 3 + Wave 3 동시 3 스토리 실행 시 token 사용 급증 | 중 | 각 스토리 M 이하(180 줄 MD). opus 사용 시에도 스토리당 context ~3k 이내. |
| Checkbox Indicator 예제의 아이콘 import 가 실제로 export 되지 않는 이름일 가능성 | 중 | **MED-2** 수락기준에 `@daangn/react-monochrome-icon` 실제 export 대조 추가. |
| S11 YAML `selected` 와 React API `pressed` 혼용으로 문서 독자 혼동 | 중 | **HIGH-1** 수락기준에 용어 통일 + 매핑표 1 문단 의무화. |
| S9 Switch size 리터럴 표기가 타입과 어긋나 AI 에이전트 오용 | 중 | **HIGH-2** 수락기준에 `SwitchVariantProps['size']` 타입 리터럴 직접 대조. |
| S13 8 개 신규 MD 의 상호 링크 중 오타로 dead link 발생 | 중 | **HIGH-5** dead-link 검증 스크립트를 수락기준에 포함. |

---

## 결정사항 (Decision log, R2)

- **D1 (PrefixIcon)**: className 직접 부착 방식 채택. wrapper 도입 X.
- **D2 (skeleton 순서)**: `_template.md` 표준 기준 States → Motion/Base 토큰 → Props 순.
- **D3 (avatar 주석)**: `AvatarRootProps` / `AvatarImageProps` 타입 선언 위 주석 2-3 줄.
- **D4 (sync kind)**: `{status, kind, note?}` 분리, status 는 kebab 태그만.
- **D5 (radio)**: radio-group.md 에 full 문서, radio.md 는 stub.
- **D6 (checkbox split)**: checkbox.md (단일) + checkbox-group.md (wrapper) 분리.
- **D7 (text-button, R2 재정의)**: React 미제공. MD 는 Rootage 토큰 스펙 + native button 가이드.
- **D8 (input-button, R2 재정의)**: Rootage ID `input-button` 은 React `FieldButton` namespace 로 구현됨 (alias). MD 는 매핑표 + subset 집중.
- **D9 (R2 신규)**: sync script `kind` enum 에 `rootage-only` 추가. `ROOTAGE_ONLY_COMPONENTS` 세트로 분류.

---

## 완료 기준 (전체)

1. 13 스토리 모두 수락 기준 충족.
2. `node scripts/sync-from-seed.mjs --json` 실행 시:
   - `checkbox`, `checkbox-group`, `radio-group`, `switch`, `toggle-button`, `input-button` 6 개 `status === "ported"`.
   - `text-button` `status === "rootage-only"`.
   - 기존 18 개 여전히 `ported`.
   - 모든 component entry 가 `status` + `kind` 필드 보유.
3. `components/` 아래 `.md` 파일 수: 기존 19 + 8 신규 = 27.
4. `grep -c 'seed-prefix-icon' page-banner.md` ≥ 3.
5. `grep -n '^## ' skeleton.md` 가 표준 순서 10 줄과 정확히 일치.
6. `grep -c 'Image.RootProps\|Image.ContentProps' avatar.md` ≥ 2.
7. `grep -c 'see composition.md' scripts/sync-from-seed.mjs` = 0.
8. index.md, which-input.md, which-button.md 에 8 신규 파일 링크 모두 실존 (dead-link 검증 통과).
9. 전체 run 실행 후 추가 lint/build 에러 없음 (MD only repo).
