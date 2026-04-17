---
project: daangn-seed-ai
source_issues: ["#20", "#14 (1B cluster)", "#14 (1E cluster)"]
created: 2026-04-17
status: confirmed
upstream_sha: 1f1d21d
run_label: Ralph ABC (polish + 1B navigation + 1E lists)
---

# Plan: Seed Design AI-first 컴포넌트 문서 ABC run

## Executive Summary

이번 run 은 세 묶음을 병렬 처리한다.
**A)** #20 codex MEDIUM 2건 polish — input-button.md Token 매핑 섹션의 `root` slot ↔ React wrapper 3계층 구분 명시 + checkbox-group.md 의 anti-pattern 과 3개 예제 사이 deep-path import 모순 해소. **C4 교정**: 동일한 deep-path 이슈가 checkbox.md 에 8건 존재 → 문서 간 일관성 위해 checkbox.md 도 같은 run 에 포함.
**B)** #14 Tier 1B navigation 5개 — tab, tablist, segmented-control, segmented-control-item, top-navigation. 단, upstream 검증 결과 `tab.yaml` + `tablist.yaml` ↔ React `Tabs` namespace 하나로 통합 구현이고, `top-navigation` 은 **rootage-only** (React 구현/CSS recipe 부재) 임을 plan 에 반영.
**C)** #14 Tier 1E lists 3개 — list-item, list-header, link-content. `list-item.yaml` ↔ React `List` namespace 전체(Root/Item/Content/Prefix/Suffix/Title/Detail) 매핑. `link-content.yaml` 은 upstream 에서 **deprecated** (metadata.deprecated 필드), React 구현도 `@deprecated Use ActionButton variant="ghost"` 마크. 따라서 link-content.md 는 inline-banner.md 와 같은 deprecation stub 포맷을 따른다.

13개 스토리 5개 Wave 로 분해. 예상 총 소요 3.5–4.5h (Wave 병렬 가정 시 2h).

---

## Issue Scope

| 클러스터 | 이슈 | 대상 파일 | 유형 |
|---------|------|---------|------|
| A-polish | #20 | `components/input-button.md` (L134 Token 매핑 섹션), `components/checkbox-group.md` (L90–107 anti-pattern + L120/160/207 예제 import), `components/checkbox.md` (L346/L366/L390/L410/L411/L441/L459 8건 deep-path) | fix |
| B-navigation | #14-1B | `components/tab.md`, `components/tablist.md`, `components/segmented-control.md`, `components/segmented-control-item.md`, `components/top-navigation.md` | new |
| C-lists | #14-1E | `components/list-item.md`, `components/list-header.md`, `components/link-content.md` | new |
| integration | #14 Tier-1 closeout | `references/index.md`, `references/decision-matrices/which-button.md` (L65-70 Tabs/SegmentedControl 링크 활성화), `references/decision-matrices/which-input.md` (H1: L14/L38 SegmentedControl 링크 활성화 + which-tab 참조 1줄), `references/decision-matrices/which-tab.md` (신규) | update+new |

**ROOTAGE_ONLY_COMPONENTS 확장 필요**: `scripts/sync-from-seed.mjs` line 97 의 `Set(["text-button", "radio"])` 에 **`"top-navigation"` 추가**. 추가 시 report 에서 `status: rootage-only` 로 분류됨.

---

## Design Decisions

### D1. checkbox-group.md 의 anti-pattern 결정 — `(a) named export 통일`

**선택**: 예제 3개 (L120, L160, L207) 의 `import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill"` 를 모두 `import { IconCheckmarkFatFill } from "@karrotmarket/react-monochrome-icon"` 로 교체. anti-pattern 섹션(L105–107) 은 **유지**하되 표현을 "default import + deep path 는 tree-shaking 저해" 로 명시.

**근거**:
- `@karrotmarket/react-monochrome-icon` 이 named export 를 primary API 로 제공. tree-shaking 최적화 근거 (bundler 가 named import 기준으로만 dead-code-eliminate 가능).
- 기존 ActionSheet/RadioGroup 예제 (radio-group.md, switch.md) 가 이미 named export 를 사용 → 일관성.
- deep-path import 는 번들러가 전체 모듈 그래프를 순회하게 만들어 초기 번들 크기가 커질 수 있음.
- (b) "deep-path 허용" 으로 바꾸면 anti-pattern 자체가 사라져 문서의 가치가 감소.

### D2. input-button.md Token 매핑 섹션 헤더 문구

**L134 `## Token 매핑` 직후, `input-button.yaml` 설명 바로 앞에 다음 문장 삽입**:

> **YAML ↔ React recipe owner 분리** — `input-button.yaml` 의 `root` slot 은 **YAML 단일 slot 이지만, React 에서는 `FieldButton.Control` 이 `inputButton` recipe context 를 소유**한다. 즉 stroke / padding / height / bg 토큰은 `FieldButton.Root` 가 아닌 `FieldButton.Control` 의 `useClassNames()` 로 주입된다. `FieldButton.Root` 는 `field` recipe (layout + values context) 만 담당. 아래 표의 `root` 는 **YAML slot 이름** 이며, React 대응은 이미 위 "YAML ↔ React 매핑표" 에 정리된 3계층 (Root=layout / Control=style host / Button=trigger) 을 따른다.

**근거**: R3 codex MEDIUM 은 "Token 매핑 표에서 `root` 가 어느 React 컴포넌트에 매핑되는지 모호" 를 지적. 이 문장이 표 읽기 전에 "YAML root ≠ React Root" 라는 mental model 을 세운다.

### D3. top-navigation 은 rootage-only

**확정**:
- `/tmp/seed-design-sync/packages/react/src/components/` 에 `TopNavigation/` 디렉토리 **없음**
- `/tmp/seed-design-sync/packages/react-headless/` 에 `top-navigation/` 패키지 **없음**
- `/tmp/seed-design-sync/packages/css/recipes/` 에 `top-navigation.*` **없음**
- → `top-navigation.md` 는 `status: rootage-only` frontmatter 필수. `text-button.md` 구조를 따라 "직접 구현 시 가이드" 섹션 포함. 대체 경로로 React Navigation header / react-router `<Header>` / 자체 구현 권장 (H4 교정: stackflow 예시는 upstream refs 부재로 제거).
- `scripts/sync-from-seed.mjs` L97 `ROOTAGE_ONLY_COMPONENTS` set 에 `"top-navigation"` 추가 (같은 PR 에 포함).

### D4. tab / tablist 통합 서술 전략

**결정**: tab.md 와 tablist.md 는 **별도 파일로 유지** (rootage spec 일치). 단, 각 파일 상단에 다음 문구 삽입:

> `tab.yaml` + `tablist.yaml` 은 Rootage 에서 별도 spec 이지만, React 에서는 단일 `Tabs` namespace (`Tabs.Root` / `Tabs.List` / `Tabs.Trigger` / `Tabs.Indicator` / `Tabs.Content`) 로 통합 구현된다. 본 문서는 `tab.yaml` ↔ `Tabs.Trigger` 슬롯에 한정한 token/anatomy 기술이며, 전체 사용 가이드는 [`./tablist.md`](./tablist.md) (또는 inverse) 와 함께 읽어야 완결된다.

- **tablist.md** → Tabs.Root + Tabs.List + Tabs.Indicator (tablist YAML 의 root + indicator slot)
- **tab.md** → Tabs.Trigger (tab YAML 의 root + label slot)
- **Tabs.Content, Tabs.Carousel, Tabs.CarouselCamera 는 tablist.md 에 "합성" 섹션에서 정리** (YAML 에는 없지만 React 에만 존재하는 slot)
- 예제는 tablist.md 에 완전한 `Tabs.Root>List>Trigger>Content` 예시 풀. tab.md 에는 trigger 에 한정된 variant/token 예제만.

### D5. segmented-control / segmented-control-item 구조

**결정**: 별도 파일 유지. segmented-control.md 는 Root (padding/cornerRadius/bg) + **Indicator** 까지 포함 (YAML `segmented-control-indicator.yaml` 은 스코프 밖이지만 React `SegmentedControl.Indicator` 가 segmented-control recipe 의 sub-slot 이므로 같이 다룬다). segmented-control-item.md 는 Item (label/selected/disabled state + ItemHiddenInput) 에 한정.

**근거**:
- `segmented-control-indicator.yaml` 은 독립 rootage spec 이지만, CSS recipe 는 `segmented-control.css` 하나로 통합. 별도 .md 파일 만들면 reader 혼란.
- `segmented-control-item.yaml` 은 독립 spec 이고 React 에도 `SegmentedControl.Item` 으로 분리. 별도 파일이 맞다.

### D6. link-content 는 deprecation stub

**확정**:
- `link-content.yaml` metadata: `deprecated: Use Action Button with variant="ghost" instead.`
- `LinkContent.tsx` 에 `@deprecated Use ActionButton with variant="ghost" instead.` 주석 2회.
- → `link-content.md` 는 `inline-banner.md` 의 deprecation 포맷을 따른다:
  1. 파일 최상단에 "⚠️ DEPRECATED — 새 코드에서 사용 금지" 경고 박스
  2. migration 경로 제시 (ActionButton variant="ghost" 로 치환하는 before/after 예시)
  3. 기존 rootage 토큰 표 (size=t4/t5/t6 × weight=regular/bold) 는 "참고" 섹션으로 유지

### D7. which-tab.md 신규 여부

**결정**: **신규 생성**. 근거:
- 사용자 질문 "탭 컴포넌트 써야 하는데 어떤 걸?" 이 충분히 빈번. `Tabs` vs `SegmentedControl` vs `ChipTabs` 차이가 명확하지 않으면 잘못 선택하기 쉽다 (3-4개 단순 선택에 Tabs 쓰는 실수 등).
- `decision-matrices/which-button.md` 에는 이미 "선택/토글" 트리에 SegmentedControl / ChipTab 이 있지만, **Tabs (페이지 전환형)** 는 "액션" 이 아니어서 해당 matrix 에 없다. 독립 matrix 필요.
- ChipTabs 는 upstream 존재하지만 이번 run 스코프 외. which-tab.md 내부에서 ChipTabs 를 "**not-ported yet**" 으로 언급하고 1C 이후 포팅 대상임을 명시.

### D8. which-list.md 신규 여부

**결정**: **생성하지 않음**. 근거:
- list-item / list-header / link-content 세 개는 모두 역할이 다르다 (List = row 컬렉션, ListHeader = 섹션 제목, LinkContent = deprecated → ActionButton).
- List 는 "컬렉션" 카테고리로 단독 존재. "이 중 뭐 쓰지?" 식 선택 고민이 발생할 공간이 없다.
- 대신 list-item.md 의 "언제 쓰나 / 언제 쓰지 않나" 표에 **ActionButton / Chip / Card / NavigationList(native) 와의 경계**를 명시하는 것으로 충분.
- link-content.md 는 deprecated 이므로 matrix 에 넣으면 혼란.

### D9. which-button.md 갱신 범위 (C5 재작성)

**결정**: **최소 수정 (덜 파괴적 옵션)**. 실제 L65-70 의 "탭 vs SegmentedControl" 블록을 확인한 결과:

```
### 2. 탭 vs SegmentedControl

탭: 페이지 내에서 영역 전환, 5개 이상도 허용           → Tabs
SegmentedControl: 2-4개의 설정 전환, 폼 스타일        → SegmentedControl
```

**처리 방침**:
1. **L68 `→ Tabs` 를 `→ [Tabs](../components/tablist.md)` 로 링크 활성화** (덜 파괴적)
2. L68 `→ SegmentedControl` 를 `→ [SegmentedControl](../components/segmented-control.md)` 로 링크 활성화
3. 해당 블록 맨 아래에 `"상세 비교는 [`which-tab.md`](./which-tab.md) 참조"` 1줄 추가
4. L21 `SegmentedControl` / L43 `SegmentedControl` 표 행에도 동일하게 링크 활성화 (기존 plan 유지)
5. **ChipTabs 는 which-button.md 에 추가하지 않음** — 기존에도 존재하지 않았으며 (R3 오진단), 추가 시 scope 외 (1C cluster). 현 상태 유지

**오진단 수정 (C5)**:
- 이전 plan 의 "기존 L21-24 에 ChipTab 이 이미 있음" 주장은 **오진단**. 실제 확인 결과 which-button.md 에 `ChipTab` 문자열은 존재하지 않음. `ControlChip` 만 L20, L42 에 존재 → "ChipTab" 관련 수정은 하지 않고, 기존 `ControlChip` 은 유지
- 이전 plan 의 "Tabs 는 which-button.md 에 넣지 않는다" 주장은 **오진단**. 실제 L65-L70 블록에 이미 `Tabs` 언급이 있음 → **해당 블록을 제거하지 않고**, 링크만 활성화하여 which-tab.md 로 유도

---

## Risks & Open Questions (plan-critic 대비)

### R1. Tabs 의 Carousel / CarouselCamera slot 이 YAML 에 없음

**우려**: `Tabs.Carousel` 과 `Tabs.CarouselCamera` 는 React-only slot 인데 (YAML `tablist.yaml` / `tab.yaml` 양쪽에 없음), AI 가 YAML-only 를 "완전한 스펙" 으로 오인하면 carousel 기능을 누락한다.
**완화**: tablist.md 에 "YAML spec 과 React 구현 차이" 섹션 별도. Carousel/CarouselCamera 는 "React-only 확장 (swipeable tab content)" 으로 명시, upstream `swipeable.tsx` 예제 참조 링크 포함.

### R2. List 예제의 `ListDivider`, `ListButtonItem` 이 @seed-design/react 에 없음

**우려**: upstream docs/examples 가 `seed-design/ui/list` (wrapping 레이어) 에서 `ListDivider`, `ListButtonItem` 을 import. 하지만 `@seed-design/react` (= 우리 스킬이 다루는 레벨) 의 List namespace 에는 Root/Item/Content/Prefix/Suffix/Title/Detail 만 존재. AI 가 예제를 보고 `List.ButtonItem` 을 쓰면 런타임 에러.
**완화**: list-item.md 에 **"upstream examples 는 `seed-design/ui` 경로를 쓰지만 본 스킬은 `@seed-design/react` 기준"** 경고 명시. `ListDivider` 는 [`./divider.md`](./divider.md) + `<Divider />` 로 대체하는 before/after 예시 포함. `ListButtonItem` 은 `<Box as="button"><List.Item>...</List.Item></Box>` 또는 `<List.Item asChild><button>...</button></List.Item>` 패턴으로 대체.

### R3. SegmentedControl preview 가 `<SegmentedControl>` alias 사용

**우려**: `seed-design/ui/segmented-control` 은 `SegmentedControl` / `SegmentedControlItem` 을 alias 로 reexport. `@seed-design/react` 에선 `SegmentedControl.Root`, `SegmentedControl.Item` 이 기본. 기존 스킬 컨벤션(radio-group, checkbox 등) 은 namespace dot 표기 유지.
**완화**: segmented-control.md 와 segmented-control-item.md 모두 **namespace form (`SegmentedControl.Root`)** 을 primary 로 쓰고, upstream preview 의 alias form 은 "alternative import" 로만 언급. switch.md L**와 동일 전략.

### R4. top-navigation 의 `theme=cupertino/android` variant 처리

**우려**: top-navigation.yaml 은 `theme=cupertino` (44px) / `theme=android` (56px) 2개 변형을 가짐. React 미구현이므로 사용자가 직접 구현 시 어떤 theme 을 택해야 할지 모호.
**완화 (H4 교정)**: top-navigation.md 의 "직접 구현 시 가이드" 섹션은 **pseudo-TSX impl + Rootage 토큰 → CSS variable 주입 수준** 으로 한정. 구현 방법은 "**React Navigation header 또는 자체 구현**" 으로 단순화. **stackflow API 예시는 제거** — upstream refs 가 없어 AI-slop 위험.

### R5. `tab` vs `chip-tab` vs `segmented-control` decision matrix 커버리지

**우려**: ChipTabs 는 미포팅이지만 which-tab.md 에는 포함해야 비교가 완결. 미포팅 컴포넌트 언급이 과도하면 AI 혼란.
**완화**: which-tab.md 비교표에 ChipTabs 행을 넣되 **"⚠️ not-ported (2026-04 기준)"** 배지 + "사용 시 upstream 참조 또는 `@seed-design/react` ChipTabs export 사용" 1줄 안내. 상세 문서화는 1C run 에 위임.

### R6. Open question — 사용자 확인 필요?

- **RESOLVED**: 모든 설계 결정(D1~D9) 은 이미 plan 본문에 확정값 기재. plan-critic 이 반대 의견 제시 시 재검토.
- 추가 결정이 필요한 사항 **없음**. 아키텍처 변경 아니므로 ask.sh 호출 없이 Wave 1 진입 가능.

---

## 공통 작성 규칙 (Wave 2/3/4 전역 적용)

### 규칙 A: `@seed-design/react` namespace form 만 사용 (wrapping 레이어 금지)

본 스킬이 전제하는 import layer 는 **`@seed-design/react`** (primitive 단계). upstream 저장소의 `seed-design/ui/*` 폴더는 alias/wrapping 레이어이며, 아래 이름들은 **본 스킬의 어느 파일에도 예제·본문·Props 표에 등장해서는 안 된다**:

- Tabs: `TabsRoot`, `TabsList`, `TabsTrigger`, `TabsIndicator`, `TabsContent` (aliased direct exports) — `Tabs.Root/.List/.Trigger/.Indicator/.Content` 형태만 사용
- SegmentedControl: `SegmentedControlRoot`, `SegmentedControlItem`, `SegmentedControlIndicator`, `SegmentedControlItemHiddenInput` — `SegmentedControl.Root/.Item/.Indicator` 형태만 사용
- List: `ListRoot`, `ListItem`, `ListContent`, `ListPrefix`, `ListSuffix`, `ListTitle`, `ListDetail`, **그리고 특히 `ListDivider`, `ListButtonItem`, `ListLinkItem`, `ListCheckItem`** (upstream `seed-design/ui/list` 전용 wrapping 컴포넌트 — `@seed-design/react` 에 존재하지 않음) — `List.Root/.Item/.Content/.Prefix/.Suffix/.Title/.Detail` 7개 namespace 만 사용

변환 절차:
1. upstream `docs/examples/react/*/*.tsx` 를 그대로 복붙하지 않는다
2. upstream `ListDivider` → `<Divider />` (divider.md 참조)
3. upstream `ListButtonItem` / `ListLinkItem` / `ListCheckItem` → `<List.Item asChild><button|a|...>...</List.Item>` 또는 Checkbox.Root 등 상태 컴포넌트로 감싸서 **스킬 자체 설계** 예제로 재작성
4. wrapping 컴포넌트 이름이 upstream 예제에 나오더라도 본 스킬 문서에는 **해당 단어 자체가 등장하지 않아야** 한다 (경고 박스에서 "사용 금지" 로 언급하는 경우만 예외)

### 규칙 B: Frontmatter 컨벤션 (이번 run)

파일 유형 별 frontmatter:

| 유형 | 필드 | 해당 스토리 |
|------|------|------------|
| ported (정상 포팅) | `name`, `upstream_sha`. `status` **생략** | S3 (tablist), S4 (segmented-control), S6 (tab), S7 (segmented-control-item), S8 (list-item), S9 (list-header) |
| rootage-only | `name`, `upstream_sha`, `status: rootage-only` | S5 (top-navigation) |
| deprecated (ported but deprecated) | `name`, `upstream_sha`, `status: ported`, `deprecated: true` (독립 필드) | S10 (link-content) |

`scripts/sync-from-seed.mjs` 의 status enum (L119–120) 확장은 **이번 run out-of-scope**. `deprecated` 는 status enum 확장이 아닌 **독립 boolean 필드** 로 처리하여 sync script 호환성 유지.

### 규칙 C: 예제 아이콘 import 는 named export only

모든 신규 파일의 예제 코드는 `import { IconXxx } from "@karrotmarket/react-monochrome-icon";` 형태만 사용 (D1 / checkbox-group.md anti-pattern 과 일관). deep-path default import 는 anti-pattern 블록 내부 "잘못된 예" 로만 허용.

---

## Stories (Wave 기반)

### Wave 1 — #20 polish (병렬 2 스토리, 예상 20분)

#### S1: input-button.md Token 매핑 섹션 헤더 문구 추가
- **complexity**: S (sonnet)
- **files**:
  - `plugins/daangn-seed-ai/skills/seed/references/components/input-button.md` (edit only)
- **acceptance criteria**:
  - `## Token 매핑` 헤더 (현재 L134) 바로 아래 + `input-button.yaml 의 definitions.base ...` 직전에 D2 문구 (정확히 또는 의미 동등) 한 문단 삽입
  - 삽입 후 L134–L172 범위의 "root (layout wrapper) — enabled" 표는 **유지**. 표 위에만 새 문단 추가, 표 제목은 그대로 "root (layout wrapper) — enabled"
  - 파일 라인 수 변경: +6 ~ +10 lines (432 → 438–442)
  - `grep -c "FieldButton.Control" plugins/daangn-seed-ai/skills/seed/references/components/input-button.md` 1건 이상 (D2 문구의 핵심 어구 "FieldButton.Control")
  - `grep -c "inputButton recipe" plugins/daangn-seed-ai/skills/seed/references/components/input-button.md` 1건 이상 (recipe context 언급)
  - 기존 "### YAML ↔ React 매핑표" (L78) 와 **중복 서술 금지**: 새 문단은 1문장 요약만, 상세는 기존 표 참조
- **upstream refs**:
  - `/tmp/seed-design-sync/packages/rootage/components/input-button.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/FieldButton/FieldButton.tsx` (withFieldProvider / withProvider 3계층)
- **dependencies**: 없음

#### S2: checkbox-group.md + checkbox.md deep-path import 통일 + anti-pattern 명시화
- **complexity**: S (sonnet)
- **files**:
  - `plugins/daangn-seed-ai/skills/seed/references/components/checkbox-group.md` (edit only)
  - `plugins/daangn-seed-ai/skills/seed/references/components/checkbox.md` (edit only)
- **scope 근거**: codex R3 가 checkbox-group.md 만 지적했으나 checkbox.md 도 L346/L366/L390/L410/L411/L441/L459 총 8건의 deep-path import 가 있어 **문서 간 일관성 파괴** 위험. 같은 run 에 묶어서 일관 처리.
- **acceptance criteria**:
  - **checkbox-group.md**: L120, L160, L207 의 `import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill";` → `import { IconCheckmarkFatFill } from "@karrotmarket/react-monochrome-icon";` 로 모두 교체 (3곳)
  - **checkbox.md**: L346, L366, L390, L410, L411, L441, L459 의 deep-path import 8건 모두 named export 로 교체 (`import { IconX } from "@karrotmarket/react-monochrome-icon";` 형태)
  - checkbox-group.md L105–108 anti-pattern 블록은 유지하되 문구 개선: "default import + deep path import" 가 "tree-shaking 저해" 임을 1줄 추가. 올바른 예시는 named export 형태만 포함
  - `grep -c "from \"@karrotmarket/react-monochrome-icon/" plugins/daangn-seed-ai/skills/seed/references/components/checkbox-group.md` ≤ 1 (anti-pattern 블록 내부 1건만 허용)
  - `grep -c "from \"@karrotmarket/react-monochrome-icon/" plugins/daangn-seed-ai/skills/seed/references/components/checkbox.md` = **0** (예제는 모두 named export)
  - 파일 라인 수 유지 (± 3 lines)
- **upstream refs**:
  - `/tmp/seed-design-sync/docs/examples/react/checkbox/*.tsx` (named export 사용 확인)
- **dependencies**: 없음

---

### Wave 2 — #14-1B 독립 컴포넌트 3개 (병렬, 예상 90분)

#### S3: tablist.md 신규 (Tabs namespace 본체, 예제 포함)
- **complexity**: M (opus)
- **files**:
  - `plugins/daangn-seed-ai/skills/seed/references/components/tablist.md` (new)
- **acceptance criteria**:
  - 파일 라인 수 400–600 범위
  - frontmatter: `name: tablist`, `upstream_sha: 1f1d21d` (`status` 생략 — 공통 규칙 B 참조)
  - 섹션 존재 (필수): `정의 한 줄`, `import`, `언제 쓰나/언제 쓰지 않나`, `Anatomy`, `YAML ↔ React 매핑표`, `Variants` (size=small/medium, layout=hug/fill), `States`, `Token 매핑`, `Props` (Tabs.Root / Tabs.List / Tabs.Indicator 각각), `합성 규칙`, `접근성`, `Anti-patterns` (최소 4개), `예제` (최소 3개: 1. 기본 (defaultValue uncontrolled) / 2. layout=fill / 3. controlled value+onValueChange)
  - D4 문구 삽입 (tab.md 와 상호 참조)
  - R1 완화: Carousel / CarouselCamera slot 을 "React-only 확장" 섹션으로 별도 분리. 기본 tabs 스펙과 섞지 않음
  - **공통 규칙 A 엄수**: `import { Tabs } from "@seed-design/react"` namespace 형식으로 통일 (`Tabs.Root/.List/.Trigger/.Indicator/.Content`). upstream `seed-design/ui/tabs` 의 `TabsRoot/TabsList/...` aliased export 는 본문·예제·Props 어디에도 등장 금지. 아이콘 import 는 규칙 C 에 따라 named export only
  - `Tabs.Indicator` 의 transform-based animation 이 `tablist.yaml` `indicator.transformDuration = $duration.d4` 기반임을 Token 매핑 표에 명시
  - `decision-matrices/which-tab.md` 로의 링크 1건 이상
- **upstream refs**:
  - `/tmp/seed-design-sync/packages/rootage/components/tablist.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/Tabs/Tabs.tsx`, `Tabs.namespace.ts`
  - `/tmp/seed-design-sync/packages/react-headless/tabs/src/useTabs.ts`, `Tabs.tsx`
  - `/tmp/seed-design-sync/docs/examples/react/tabs/{preview,layout-fill,layout-hug,size-medium,size-small,swipeable,disabled,notification}.tsx`
- **dependencies**: 없음

#### S4: segmented-control.md 신규 (Root + Indicator)
- **complexity**: M (opus)
- **files**:
  - `plugins/daangn-seed-ai/skills/seed/references/components/segmented-control.md` (new)
- **acceptance criteria**:
  - 파일 라인 수 350–500 범위
  - frontmatter: `name: segmented-control`, `upstream_sha: 1f1d21d` (`status` 생략)
  - 섹션: 정의 / import / 언제 쓰나 / Anatomy (Root + Indicator + Item 언급만) / YAML ↔ React 매핑 / Variants (base only — SegmentedControl 은 variant 축 없음 명시) / States / Token 매핑 (root padding/cornerRadius/color + indicator color/cornerRadius/strokeColor + transform duration) / Props (Root = SegmentedControlPrimitive.RootProps + VariantProps / Indicator = HTMLDivElement attrs) / 합성 규칙 (Item 은 segmented-control-item.md 참조) / 접근성 (aria-label 필수, 내부 radio role 언급) / Anti-patterns (최소 3개) / 예제 (총 2개: 1. 기본 preview / 2. controlled value+onValueChange with notification state)
  - D5 결정 반영: segmented-control-indicator.yaml 을 별도 파일로 생성하지 않고 본 문서 Token 매핑 섹션에 "indicator" sub-table 통합
  - **공통 규칙 A 엄수**: `import { SegmentedControl } from "@seed-design/react"` namespace 형식 (`SegmentedControl.Root/.Item/.Indicator`) 으로 통일. upstream `seed-design/ui/segmented-control` 의 alias form (`SegmentedControlRoot` 등) 은 본문·예제·Props 어디에도 등장 금지
  - Tabs 와의 구분 포인트 (스크롤 가능 여부 / 콘텐츠 swap 여부 / visual weight) 를 "언제 쓰나" 표에 최소 3행
  - `decision-matrices/which-tab.md` 로 링크 1건 이상
- **upstream refs**:
  - `/tmp/seed-design-sync/packages/rootage/components/segmented-control.yaml`
  - `/tmp/seed-design-sync/packages/rootage/components/segmented-control-indicator.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/SegmentedControl/SegmentedControl.tsx`, `.namespace.ts`
  - `/tmp/seed-design-sync/packages/react-headless/segmented-control/src/useSegmentedControl.ts`
  - `/tmp/seed-design-sync/docs/examples/react/segmented-control/{preview,notification,fixed-width,value-changes,disabled}.tsx`
- **dependencies**: 없음

#### S5: top-navigation.md 신규 (rootage-only, text-button.md 패턴)
- **complexity**: M (opus)
- **files**:
  - `plugins/daangn-seed-ai/skills/seed/references/components/top-navigation.md` (new)
  - `scripts/sync-from-seed.mjs` (edit: L97 ROOTAGE_ONLY_COMPONENTS set 에 `"top-navigation"` 추가)
- **acceptance criteria**:
  - 파일 라인 수 **300–600 범위** (variants 4축 × Rootage 토큰 표 4 slot 수용. coding-style.md 800 한도 내)
  - frontmatter: `name: top-navigation`, `upstream_sha: 1f1d21d`, `status: rootage-only` (규칙 B: rootage-only 유형)
  - 최상단에 "React 컴포넌트 미제공 · Rootage 토큰 스펙 전용" 경고 박스 (text-button.md 패턴 복제)
  - 섹션: 정의 / 언제 쓰나 / Anatomy (root + icon + title + subtitle 4개 slot 나열) / Variants (theme=cupertino 44px / theme=android 56px, tone=layer / tone=transparent, divider=true/false, titleLayout=titleOnly / withSubtitle — 총 2×2×2×2=16 combos 중 유효 조합 명시) / **토큰 표 (slot 별 4개 sub-table)**: (a) root (paddingX / height / bg / borderBottom) / (b) icon (size / color) / (c) title (fontSize / lineHeight / fontWeight / color) / (d) subtitle (fontSize / lineHeight / color) — 각 sub-table 은 variant 축 (theme × tone × divider × titleLayout 유효 조합) 을 컬럼으로, property 를 행으로. 전체 셀 수 ~200, 토큰 표 총 100줄 예상 / **"직접 구현 시 가이드"** (pseudo-TSX impl + Rootage 토큰 → CSS variable 주입 수준 — React Navigation `HeaderTitle` / react-router `<Header>` / 자체 구현 권장, **stackflow API 예시는 upstream refs 부재로 제거**) / R4 완화 문구 / Anti-patterns (직접 배경색 hardcode 금지, theme variant 를 CSS 로 override 금지 등)
  - 예제는 "직접 구현 시 참고용 pseudo-TSX" 1개 (Rootage 토큰을 CSS var 로 주입하는 방식) — H4 결정에 따라 **stackflow 예시는 제거** (upstream refs 없이 AI-slop 위험). 구현 방법은 "React Navigation header 또는 자체 구현" 으로 단순화
  - `scripts/sync-from-seed.mjs` diff: 기존 `new Set(["text-button", "radio"])` → `new Set(["text-button", "radio", "top-navigation"])`. 주석에 "top-navigation: no React/CSS recipe, rootage-only spec" 명시
  - **검증 (C1 교정)**: `node scripts/sync-from-seed.mjs --json | jq '.components["top-navigation"]'` 실행 결과가 `{"status":"rootage-only","kind":"rootage-only","note":"Rootage spec only, no React export","legacyStatus":"rootage-only (no React export)"}` 매치 (top-navigation 항목은 localNames 에 존재하고 ROOTAGE_ONLY_COMPONENTS 에 있으므로 L172-174 경로)
  - **검증 (C1 교정)**: 4개 신규 컴포넌트 (tab, tablist, segmented-control, segmented-control-item) 는 `diffComponents` 의 report 에서 `ported` 로 분류 — 정상 ported 는 `localNames` ∩ `upstreamNames` 이면서 어떤 set 에도 없는 경우. report 에 엔트리 자체가 **ported 상태로 등장** (`{"status":"ported","kind":"ported","legacyStatus":"ported"}`)
  - **검증 (C1 교정)**: `plugins/daangn-seed-ai/skills/seed/references/_snapshot.json` 은 이번 run 에서 **수정하지 않음**. 기존 SHA (`1f1d21d`) 그대로 유지. diff 는 sync 스크립트의 런타임 report 로만 확인
- **upstream refs**:
  - `/tmp/seed-design-sync/packages/rootage/components/top-navigation.yaml`
  - `/Users/byunghun/Documents/projects/daangn-seed-ai/plugins/daangn-seed-ai/skills/seed/references/components/text-button.md` (구조 참고)
  - `/Users/byunghun/Documents/projects/daangn-seed-ai/scripts/sync-from-seed.mjs` (L92–L100, L172, L186)
- **dependencies**: 없음

---

### Wave 3 — #14-1B 의존 컴포넌트 2개 (병렬, 예상 45분)

#### S6: tab.md 신규 (Tabs.Trigger 한정 서술)
- **complexity**: S (sonnet — 참조 범위 좁음)
- **files**:
  - `plugins/daangn-seed-ai/skills/seed/references/components/tab.md` (new)
- **acceptance criteria**:
  - 파일 라인 수 200–350 범위 (tablist.md 와 중복 최소화)
  - frontmatter: `name: tab`, `upstream_sha: 1f1d21d` (`status` 생략)
  - **최상단에 D4 문구 삽입**: "tab.yaml 은 Tabs.Trigger 의 root+label slot 에 한정. 전체 사용은 [tablist.md] 참조"
  - 섹션: 정의 (Tabs.Trigger 단일 탭) / Anatomy (root + label 2개 slot 만) / Variants (size=small 40px / size=medium 44px) / States (enabled / selected / disabled) / Token 매핑 (size별 minHeight/paddingX/paddingY + label fontSize/lineHeight/fontWeight/color) / Props (TabsTriggerProps extends TabsPrimitive.TriggerProps) / 합성 규칙 (반드시 Tabs.List 내부 / value prop 필수 / 비어있는 label 금지) / 접근성 (role="tab" 자동, aria-selected 자동, keyboard arrow navigation) / Anti-patterns (최소 3개: Tabs.List 바깥에서 사용 / value 생략 / Trigger 내부에 또 다른 Trigger 중첩) / 예제 (총 2개: 1. 기본 trigger / 2. disabled state)
  - **공통 규칙 A 엄수**: `import { Tabs } from "@seed-design/react"` + `<Tabs.Trigger value="...">` namespace 형태만 사용. upstream wrapping (`TabsTrigger` aliased export) 은 본문·예제 어디에도 등장 금지. 전체 구조 예제는 "tablist.md 예제 참조" 로 링크
  - 상호 참조: 문서 끝 "관련 문서" 섹션에 tablist.md / decision-matrices/which-tab.md 링크
- **upstream refs**:
  - `/tmp/seed-design-sync/packages/rootage/components/tab.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/Tabs/Tabs.tsx` (TabsTrigger)
  - `/tmp/seed-design-sync/packages/react-headless/tabs/src/useTabsTriggerContext.tsx`
  - `/tmp/seed-design-sync/docs/examples/react/tabs/{disabled,notification,size-medium,size-small}.tsx`
- **dependencies**: S3 (tablist.md) — cross-reference 링크가 깨지지 않도록 tablist.md 가 먼저 존재해야 함. 병렬 작성은 가능하되 **같은 session 에서 순서대로 저장 권장**.

#### S7: segmented-control-item.md 신규
- **complexity**: M (opus)
- **files**:
  - `plugins/daangn-seed-ai/skills/seed/references/components/segmented-control-item.md` (new)
- **acceptance criteria**:
  - 파일 라인 수 250–400 범위
  - frontmatter: `name: segmented-control-item`, `upstream_sha: 1f1d21d` (`status` 생략)
  - 최상단에 "segmented-control.md 의 Item slot 상세 — Root/Indicator 는 부모 문서 참조" 문구
  - 섹션: 정의 / Anatomy (root + label + ItemHiddenInput — Item 은 `<label>` element 라는 점 명시) / Variants (base + pressed + selected + disabled state combos) / Token 매핑 (root: minWidth=86px/minHeight=34px/paddingX=$dimension.x6/paddingY=$dimension.x1_5/cornerRadius=$radius.full/gap=$dimension.x1_5/colorDuration/colorTimingFunction + label: fontSize=$font-size.t5 등 + pressed overrides + selected label color / disabled label color) / Props (SegmentedControlItemProps extends SegmentedControlPrimitive.ItemProps — value 필수) / 합성 규칙 (SegmentedControl.Root 의 children 으로만 / ItemHiddenInput 이 name 기반 form 제출 지원) / 접근성 (native radio semantic + aria-checked) / Anti-patterns (최소 3개: 단독 사용 / value 생략 / radio/checkbox 대체 혼용) / 예제 (총 2개: 1. 기본 Item / 2. controlled + ItemHiddenInput form submission)
  - **공통 규칙 A 엄수**: `import { SegmentedControl } from "@seed-design/react"` namespace 형식 (`SegmentedControl.Item`) 으로 통일. upstream aliased `SegmentedControlItem`, `SegmentedControlItemHiddenInput` 직접 export 는 본문·예제·Props 어디에도 등장 금지 (namespace form 의 `SegmentedControl.Item`, `SegmentedControl.ItemHiddenInput` 만 사용)
  - ItemHiddenInput 이 form submission 용임을 명확히 설명 (useSegmentedControl 의 radio-group-like behavior 언급)
  - segmented-control.md / checkbox.md (HiddenInput 패턴 유사성) 크로스 링크
- **upstream refs**:
  - `/tmp/seed-design-sync/packages/rootage/components/segmented-control-item.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/SegmentedControl/SegmentedControl.tsx` (SegmentedControlItem, SegmentedControlItemHiddenInput)
  - `/tmp/seed-design-sync/packages/react-headless/segmented-control/src/{useSegmentedControl.ts,useSegmentedControlItemContext.tsx}`
  - `/tmp/seed-design-sync/docs/examples/react/segmented-control/{fixed-width,value-changes,notification,disabled,long-label}.tsx`
- **dependencies**: S4 (segmented-control.md) — 상호 참조 존재

---

### Wave 4 — #14-1E lists 3개 (병렬, 예상 80분)

#### S8: list-item.md 신규 (List namespace 본체 — Root/Item/Content/Prefix/Suffix/Title/Detail)
- **complexity**: L (opus — 7 slot 을 한 파일에 통합, 예제 다양성 높음)
- **files**:
  - `plugins/daangn-seed-ai/skills/seed/references/components/list-item.md` (new)
- **acceptance criteria**:
  - 파일 라인 수 **500–750 범위** (radio-group.md 576 참고, coding-style.md 800 한도). 축소 옵션: Anti-patterns 6개 미만 / Token 매핑 기본값은 yaml 링크 참조로 치환
  - frontmatter: `name: list-item`, `upstream_sha: 1f1d21d` (`status` 생략 — 규칙 B ported 유형)
  - **매우 중요**: 최상단 "import 경로" 밑에 **R2 완화 경고 박스 (4개 이름 모두 명시)**:
    > **⚠️ import 경로 주의** — upstream `docs/examples/react/list/*.tsx` 는 `seed-design/ui/list` 에서 **`ListDivider`, `ListButtonItem`, `ListLinkItem`, `ListCheckItem`** 4개 wrapping 컴포넌트를 import 하지만, 이들은 **`@seed-design/react` namespace 에 존재하지 않는다** (해당 namespace 에는 Root/Item/Content/Prefix/Suffix/Title/Detail 7개만). 본 스킬은 **`@seed-design/react`** 직접 사용을 전제로 하므로 다음 패턴으로 변환한다:
    > - `ListDivider` → [`./divider.md`](./divider.md) 의 `<Divider />` 사용
    > - `ListButtonItem` → `<List.Item asChild><button>...</button></List.Item>` (스킬 자체 설계)
    > - `ListLinkItem` → `<List.Item asChild><a href="...">...</a></List.Item>` (스킬 자체 설계)
    > - `ListCheckItem` → `<List.Item><Checkbox.Root>...<List.Content>...</List.Content></Checkbox.Root></List.Item>` 또는 `<List.Item asChild><Checkbox.Root>...</Checkbox.Root></List.Item>` (스킬 자체 설계)
  - 섹션: 정의 (list-item.yaml 이 List 전체 namespace 를 커버) / import (`import { List } from "@seed-design/react"`) / 언제 쓰나 (row 컬렉션 vs ActionButton 반복 vs Card 반복 vs 네이티브 mobile list 의 차이 — 최소 4행) / Anatomy (Root=`<ul>` / Item=`<li>` / Content / Prefix / Suffix / Title / Detail 7개 slot 계층 다이어그램 + itemBorderRadius CSS var 설명) / Variants (base only) / States (enabled / pressed / highlighted / highlighted,pressed / disabled — YAML 에 정의된 5 state 모두) / Token 매핑 (root paddingY=$dimension.x3 / paddingX=$dimension.spacing-x.global-gutter / color duration / marginX=$dimension.x1_5 pressed / content gap=$dimension.x0_5 + title fontSize=$font-size.t5 + detail fontSize=$font-size.t3 + prefix paddingRight=$dimension.x3 + prefixIcon size=22px + suffix gap=$dimension.x1 + suffixText fontSize=$font-size.t5 + suffixIcon size=18px + pressed cornerRadius=$dimension.x2_5 등 — 축소 옵션 시 "전체 토큰은 list-item.yaml 참조" 로 대체 가능) / Props (ListRootProps with itemBorderRadius / ListItemProps / ListContentProps / ListPrefixProps / ListSuffixProps / ListTitleProps / ListDetailProps 최소 골격) / 합성 규칙 (Checkbox / RadioGroupItem / Switch 를 Item 내부에 합성 시 createWithStateProps 로 상태 연동되는 점 언급) / 접근성 (Item 이 interactive 일 때 asChild button / role 처리) / Anti-patterns (최소 5개, 축소 시 3개까지 허용: Divider 대신 `<hr>` / Item 없이 Content 단독 / Prefix/Suffix 에 Button 중첩해서 중복 tap target / asChild 없이 `<a>` wrap / itemBorderRadius 를 individual Item 에 설정)
  - **예제 정확히 4개 (C2 교정 — upstream 복붙 금지, 스킬 자체 설계로 재작성)**:
    1. **(a) 기본**: `<List.Root>` + `<List.Item>` + `<List.Content>` + `<List.Title>` + `<List.Detail>` 조합 (단순 row 컬렉션)
    2. **(b) Prefix/Suffix 아이콘 합성**: `<List.Prefix>` 에 아이콘 + `<List.Suffix>` 에 보조 아이콘 (아이콘 import 는 규칙 C 에 따라 named export only)
    3. **(c) Checkbox state 연동**: `<List.Item><Checkbox.Root>...<List.Content>...</List.Content></Checkbox.Root></List.Item>` 또는 `<List.Item asChild><Checkbox.Root>...</Checkbox.Root></List.Item>` 형태. upstream `check.tsx` 의 `ListCheckItem` 복제 금지
    4. **(d) clickable**: `<List.Item asChild><button type="button" onClick={...}>...</button></List.Item>`. upstream `clickable.tsx` 의 `ListButtonItem` 복제 금지 — **스킬 자체 설계로 작성**
  - **공통 규칙 A 엄수**: 예제·본문·Anti-patterns 어디에도 `ListDivider`, `ListButtonItem`, `ListLinkItem`, `ListCheckItem` 이 **실제 코드로 등장 금지**. 경고 박스 내부 "사용 금지" 언급은 예외
  - 예제 컨벤션: `import { List } from "@seed-design/react"` + namespace form (`<List.Root>`, `<List.Item>` 등) 으로 통일. 예제 간 일관성 유지
- **upstream refs**:
  - `/tmp/seed-design-sync/packages/rootage/components/list-item.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/List/{List.tsx,List.namespace.ts,index.ts}`
  - `/tmp/seed-design-sync/docs/examples/react/list/{preview,affixes,alignment,border-radius,check,clickable,disabled,header,highlighted,radio,switch,bottom-sheet}.tsx`
- **dependencies**: 없음 (병렬 가능)

#### S9: list-header.md 신규
- **complexity**: M (opus)
- **files**:
  - `plugins/daangn-seed-ai/skills/seed/references/components/list-header.md` (new)
- **acceptance criteria**:
  - 파일 라인 수 200–320 범위 (작은 단일 컴포넌트)
  - frontmatter: `name: list-header`, `upstream_sha: 1f1d21d` (`status` 생략)
  - 섹션: **정의 (List 섹션 위 헤더 텍스트 — default 는 `<div>`, `as` prop 으로 h1~h6 opt-in — 공통 규칙 A 와 별개로 ListHeader 는 `@seed-design/react` 에 direct export)** / import (`import { ListHeader } from "@seed-design/react"`) / 언제 쓰나 vs Typography Text vs 그냥 h2 / Anatomy (root 단일 slot, 그러나 `as` prop 으로 "div"|"h1"|"h2"|"h3"|"h4"|"h5"|"h6" 중 선택, default="div") / Variants (variant=mediumWeak / variant=boldSolid — 2개만) / Token 매핑 (root paddingX=$dimension.spacing-x.global-gutter / paddingY=$dimension.x2 / gap=$dimension.x2_5 / fontSize=$font-size.t4 / lineHeight=$line-height.t4 + variant 별 fontWeight/color) / Props (ListHeaderProps with `as?: "div"|"h1"|"h2"|"h3"|"h4"|"h5"|"h6"` default "div", variant) / 합성 규칙 (List 바로 위에 배치, VStack 으로 감쌀 때 gap 주의, children 에 ActionButton 가능 — header.tsx 예제 L55 패턴) / **접근성 (H2 교정): default `as="div"` 는 semantic 중립이므로, 실제 사용 시 페이지 계층에 맞춰 `as="h2"` 또는 `as="h3"` 를 **반드시 opt-in** 해야 한다. 단일 페이지 h1 유일성 유지, h1 skip 금지** / Anti-patterns (최소 3개: `<h2>` 를 children 으로 2회 중첩 / variant 생략한 채 fontWeight 를 style 로 override / `as` prop 을 생략하고 default `<div>` 를 그대로 두어 screen reader 에서 heading 으로 인식되지 않음) / 예제 (총 3개: 1. 기본 `variant="mediumWeak"` + `as="h2"` / 2. `variant="boldSolid"` + `as="h3"` / 3. ActionButton 합성)
  - **근거 (H2)**: `/tmp/seed-design-sync/packages/react/src/components/List/ListHeader.tsx` L13 `as?: "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"` + L17 `as: Comp = "div"` — default 확인됨
  - ListHeader 와 List 가 **별도 recipe** 임을 강조 (list-header.css / list-item.css 분리)
- **upstream refs**:
  - `/tmp/seed-design-sync/packages/rootage/components/list-header.yaml`
  - `/tmp/seed-design-sync/packages/react/src/components/List/ListHeader.tsx`
  - `/tmp/seed-design-sync/packages/react/src/components/List/index.ts` (export 확인 — List 의 index 가 ListHeader 를 별도로 export 하는지 여부)
  - `/tmp/seed-design-sync/docs/examples/react/list/header.tsx`
- **dependencies**: 없음

#### S10: link-content.md 신규 (deprecation stub)
- **complexity**: S (sonnet)
- **files**:
  - `plugins/daangn-seed-ai/skills/seed/references/components/link-content.md` (new)
- **acceptance criteria**:
  - 파일 라인 수 120–220 범위 (작게)
  - **frontmatter (C3 확정)**: `name: link-content`, `upstream_sha: 1f1d21d`, `status: ported`, `deprecated: true` (4개 필드). `deprecated` 는 `status` enum 확장이 아닌 **독립 boolean 필드** — `scripts/sync-from-seed.mjs` 의 status enum (L119-120) 확장은 이번 run out-of-scope
  - **최상단 (C3 확정)**: `inline-banner.md` 의 **blockquote 문체** 를 차용한 DEPRECATED 처리 — `> **⚠️ DEPRECATED** — rootage metadata: "Use Action Button with variant=\"ghost\" instead."` 형식. frontmatter 구조는 **text-button.md 최신 컨벤션** 을 따름
  - 섹션: deprecated blockquote / migration 가이드 (LinkContent → ActionButton variant="ghost" 치환 예시) / "이 문서를 읽는 이유" (레거시 코드 이해 / 토큰 참고) / 기존 rootage 스펙 참고용 (size=t4/t5/t6 × weight=regular/bold matrix / gap=$dimension.x0_5) / before (LinkContent) / after (ActionButton variant="ghost" + PrefixText/SuffixIcon) 비교 예시 (총 2개) / "새 코드 작성 시 사용 금지" 명시
  - 예제 (총 2개): 1. "기존 LinkContent 예시 + DEPRECATED 주석" / 2. "동등한 ActionButton 변환"
  - 상호 참조: [`./action-button.md`](./action-button.md) 링크 최소 2건
  - `@deprecated` JSDoc 마크가 upstream `LinkContent.tsx` 에 2회 있음을 명시
- **upstream refs**:
  - `/tmp/seed-design-sync/packages/rootage/components/link-content.yaml` (metadata.deprecated 필드)
  - `/tmp/seed-design-sync/packages/react/src/components/LinkContent/LinkContent.tsx` (@deprecated 주석)
  - `/tmp/seed-design-sync/docs/examples/react/link-content/{preview,color,size}.tsx`
  - `/Users/byunghun/Documents/projects/daangn-seed-ai/plugins/daangn-seed-ai/skills/seed/references/components/inline-banner.md` (deprecation 포맷 참고)
- **dependencies**: 없음

---

### Wave 5 — Integration + decision matrix (단일 스토리, 예상 30분)

#### S11: index.md 커버리지 업데이트 + which-tab.md 신규 + which-button.md / which-input.md 링크 업데이트
- **complexity**: M (opus)
- **files**:
  - `plugins/daangn-seed-ai/skills/seed/references/index.md` (edit)
  - `plugins/daangn-seed-ai/skills/seed/references/decision-matrices/which-tab.md` (new)
  - `plugins/daangn-seed-ai/skills/seed/references/decision-matrices/which-button.md` (edit — 최소 수정)
  - **`plugins/daangn-seed-ai/skills/seed/references/decision-matrices/which-input.md` (edit — H1 추가)**
- **acceptance criteria**:
  - **index.md**:
    - L31–58 "components/" 트리에 8개 신규 파일 항목 추가: `list-item.md`, `list-header.md`, `link-content.md (⚠️ deprecated)`, `tab.md`, `tablist.md`, `segmented-control.md`, `segmented-control-item.md`, `top-navigation.md (⚠️ Rootage-only)` — alphabetical 또는 grouped-by-cluster 순 (기존 패턴 따르기)
    - L66 decision-matrices 트리에 `which-tab.md` 추가
    - L90 "커버리지" 문단 "총 26 컴포넌트" → "**총 34 컴포넌트** (이번 run 에서 list-item/list-header/link-content⚠️ + tab/tablist/segmented-control/segmented-control-item + top-navigation⚠️ 8개 추가)" 로 갱신
    - L97–101 "Rootage-only" 섹션에 `top-navigation.md` 추가 (text-button, radio 와 동일 포맷)
    - L102–105 "미포팅 컴포넌트" 섹션에서 `SegmentedControl, Tabs, List` 제거 (이번 run 에서 처리) → Chip, ChipTabs, Slider, SelectBox, Fab 등만 잔존
  - **which-tab.md**:
    - 100–250 line
    - 결정 트리: "콘텐츠 전환인가?" → YES 면 Tabs (스크롤 가능 / content swap) vs ChipTabs (원형, visual playful) / "단일 값 선택인가?" → SegmentedControl (3-4 분절)
    - 비교표: Tabs / ChipTabs⚠️(not-ported) / SegmentedControl / (참고) RadioGroup / ActionChip
    - 흔한 실수: 3-4개 필터에 Tabs 사용 (SegmentedControl 이 맞음) / 단순 필터 UI 에 Tabs 사용 / SegmentedControl 을 스크롤 가로 탭으로 오용
    - 링크: components/tab.md, tablist.md, segmented-control.md, segmented-control-item.md, decision-matrices/which-input.md
  - **which-button.md (C5 교정)**:
    - L21 `SegmentedControl` 항목에 `[SegmentedControl](../components/segmented-control.md)` 링크 활성화
    - L43 `SegmentedControl` 표 행도 동일 링크 활성화
    - **L68 `→ Tabs` 를 `→ [Tabs](../components/tablist.md)` 로 링크 활성화**
    - **L68 `→ SegmentedControl` 를 `→ [SegmentedControl](../components/segmented-control.md)` 로 링크 활성화**
    - **L65-70 블록 맨 아래에 `"> 상세 비교는 [`which-tab.md`](./which-tab.md) 참조"` 1줄 추가**
    - ChipTabs 는 추가하지 않음 (기존에도 없음 — 현 상태 유지, scope 외)
    - `ControlChip` (L20, L42) 은 기존 그대로 유지
  - **which-input.md (H1 추가)**:
    - L14, L38 의 `SegmentedControl` 언급에 `[SegmentedControl](../components/segmented-control.md)` 링크 활성화
    - L11-17 결정트리의 적절한 위치에 `"탭형 페이지 전환 → [which-tab.md](./which-tab.md) 참조"` 1줄 추가
  - 모든 변경 후 `grep -c "not-ported" plugins/daangn-seed-ai/skills/seed/references/index.md` 값이 run 전보다 감소 (Tabs, SegmentedControl, List 가 제거됨)
- **upstream refs**: 없음 (문서 내부 정합성만)
- **dependencies**: **S1~S10 모두 완료 후 시작**. 미리 만들어지지 않은 파일에 대한 링크가 생기면 broken link.

---

## Acceptance Criteria (issue-level)

### #20 전체
- [ ] `grep "FieldButton.Control" plugins/daangn-seed-ai/skills/seed/references/components/input-button.md` 최소 1건 (D2 문구 핵심 어구)
- [ ] `grep "inputButton recipe" plugins/daangn-seed-ai/skills/seed/references/components/input-button.md` 최소 1건 (D2 문구 recipe 언급)
- [ ] `grep -c "from \"@karrotmarket/react-monochrome-icon/" plugins/daangn-seed-ai/skills/seed/references/components/checkbox-group.md` 1건 이하 (anti-pattern 내부의 1건만 허용)
- [ ] **C4 검증**: `grep -c "from \"@karrotmarket/react-monochrome-icon/" plugins/daangn-seed-ai/skills/seed/references/components/checkbox.md` **0건** (예제는 모두 named export)
- [ ] 기존 input-button.md 의 "YAML ↔ React 매핑표" (L78–L91) 가 그대로 유지되며 새 문단과 **의미 중복 없음**
- [ ] codex CLI review 수행 후 MEDIUM 이슈 0건

### #14-1B (navigation)
- [ ] 5개 신규 파일 모두 존재 + frontmatter 정합 (upstream_sha=1f1d21d). frontmatter 는 공통 규칙 B 준수 (ported 4개는 `status` 생략, top-navigation 만 `status: rootage-only`)
- [ ] tablist.md + tab.md 가 양방향 링크
- [ ] segmented-control.md + segmented-control-item.md 가 양방향 링크
- [ ] top-navigation.md 에 `status: rootage-only` + `scripts/sync-from-seed.mjs` 의 `ROOTAGE_ONLY_COMPONENTS` set 에 `"top-navigation"` 등록 완료
- [ ] **C1 검증**: `node scripts/sync-from-seed.mjs --json | jq '.components["top-navigation"]'` 결과가 `{"status":"rootage-only","kind":"rootage-only","note":"Rootage spec only, no React export","legacyStatus":"rootage-only (no React export)"}` 매치
- [ ] **C1 검증**: `node scripts/sync-from-seed.mjs --json | jq '.components | keys | map(select(. == "tab" or . == "tablist" or . == "segmented-control" or . == "segmented-control-item"))'` 결과가 `[]` 또는 해당 4개 (ported 는 sync 스크립트 구조상 report 에 `ported` 엔트리로 등장. L178-180)
- [ ] **C1 검증**: `plugins/daangn-seed-ai/skills/seed/references/_snapshot.json` 의 `commit` 필드가 이번 run 에서 **변경되지 않음** (기존 `1f1d21d` 유지)
- [ ] 각 파일 라인 수가 스토리 목표 범위 내
- [ ] 예제 코드 블록이 유효한 TSX 문법 + @seed-design/react import 경로 정확
- [ ] **공통 규칙 A 검증**: `grep -rE "(TabsRoot|TabsList|TabsTrigger|SegmentedControlRoot|SegmentedControlItem(HiddenInput)?|SegmentedControlIndicator)\b" plugins/daangn-seed-ai/skills/seed/references/components/{tab,tablist,segmented-control,segmented-control-item}.md` 결과 0건 (wrapping 레이어 이름 본문 등장 금지)

### #14-1E (lists)
- [ ] 3개 신규 파일 모두 존재 + frontmatter 정합 (규칙 B 준수)
- [ ] list-item.md 에 R2 완화 경고 박스 포함 (`ListDivider`, `ListButtonItem`, `ListLinkItem`, `ListCheckItem` 4개 이름 모두 명시)
- [ ] **C2 검증**: `grep -cE "\b(ListDivider|ListButtonItem|ListLinkItem|ListCheckItem)\b" plugins/daangn-seed-ai/skills/seed/references/components/list-item.md` 결과가 **경고 박스 내부 1회씩** (= 총 4회) 만 허용. 예제·본문·Anti-patterns 등 다른 위치 등장 시 fail
- [ ] list-item.md 예제가 정확히 4개 (기본 / Prefix+Suffix / Checkbox 합성 / clickable asChild) — upstream `check.tsx`/`clickable.tsx` 복붙 금지
- [ ] list-header.md 와 list-item.md 가 상호 링크 (header.tsx 예제가 List 와 ListHeader 를 함께 씀)
- [ ] **H2 검증**: list-header.md Props 섹션에 `as?: "div"|"h1"|..|"h6"` default `"div"` 명시. 접근성 섹션에 "실제 사용 시 `as="h2"`/`"h3"` opt-in 필수" 문구 포함
- [ ] link-content.md frontmatter 에 `status: ported, deprecated: true` 명시 + 최상단 blockquote 형식 DEPRECATED 처리 (inline-banner.md 문체 차용)
- [ ] 예제 import 는 모두 named export (`import { X } from "@karrotmarket/react-monochrome-icon"`) — 규칙 C

### Integration
- [ ] index.md 커버리지 숫자 갱신 (26 → 34)
- [ ] which-tab.md 신규 생성
- [ ] which-button.md L21/L43/L68 의 SegmentedControl 및 L68 Tabs 링크 활성화 + L65-70 블록 맨 아래 which-tab.md 참조 1줄 추가
- [ ] **H1 검증**: which-input.md L14/L38 SegmentedControl 링크 활성화 + L11-17 결정트리에 "탭형 페이지 전환 → which-tab.md 참조" 1줄 추가
- [ ] 모든 상호 링크가 유효 (broken link 없음 — 체크: 각 링크 타겟 파일이 실재)
- [ ] 파일당 라인 수 800 초과 없음 (coding-style.md 준수)
- [ ] upstream_sha 모든 신규 파일에 `1f1d21d` 일치

---

## Out-of-scope (이번 run 에 포함되지 않음)

- **ChipTabs 포팅** — 1C cluster. which-tab.md 에서만 "not-ported" 로 언급.
- **Chip / ControlChip / ActionChip 포팅** — 1C cluster.
- **Slider / SelectBox / Fab / ExtendedFab 포팅** — Tier 2+ cluster.
- **새 token 파일 추가** — 이번 run 은 컴포넌트 문서만. tokens/ 는 건드리지 않음.
- **SKILL.md 개정** — 컴포넌트 목록 변경은 index.md 로 흡수. SKILL.md 는 다음 run 에서 일괄 재점검.
- **`seed-design/ui/*` wrapping 레이어 문서화** — 우리 스킬은 `@seed-design/react` 기준. wrapping 레이어(ListDivider / ListButtonItem / TabsRoot aliased export 등) 는 scope 외, 향후 별도 reference 로 분리 검토.
- **reconcile-apply / reconcile 스킬 업데이트** — 별도 스킬. 이번 run 은 seed 스킬 내부 문서만.
- **SegmentedControl.Indicator 의 CSS animation 시퀀스 시각화** — transformDuration 은 token 기재. 실시간 transform 계산 로직은 react-headless 코드 참고 수준에서 멈춤.
- **TopNavigation 의 React 실구현** — rootage-only 로 표시만. 실제 React 컴포넌트 생성은 upstream 책임.

---

## Wave 의존성 그래프

```
Wave 1 (S1, S2) ──┐
                  │
Wave 2 (S3, S4, S5) ──┬──> Wave 3 (S6 deps S3, S7 deps S4) ──┐
                      │                                       │
Wave 4 (S8, S9, S10) ─────────────────────────────────────────┴──> Wave 5 (S11)

병렬 가능 Wave: 1, 2, 4 (상호 독립)
순차 Wave: 3 (Wave 2 의 tablist/segmented-control 이 먼저 있어야 cross-ref 유효)
최종 Wave: 5 (모든 하위 문서가 존재해야 index.md/matrix 링크 valid)
```

**예상 총 시간**:
- 병렬 실행 (Wave 1+2+4 동시, Wave 3 그 다음, Wave 5 마지막): ~2h 5min
- 순차 실행 (1→2→3→4→5): ~4h 25min
- 실제는 Wave 1+2+4 병렬 → Wave 3 → Wave 5 로 진행 권장

---

## Critic 대비: 왜 이 구조인가

### tab/tablist 분리 왜?
YAML 이 별도 spec 이고 Rootage 토큰 소유 경계가 다름 (tab 은 trigger 의 `minHeight/paddingX/label`, tablist 는 list 의 `strokeBottomWidth/indicator`). React namespace 가 하나여도 YAML 소유권 경계를 명시하는 게 "YAML ↔ React 매핑 표" 철학의 핵심. 합치면 매핑 표가 이중 서술되어 혼란.

### link-content 를 deprecated 인데도 왜 문서화?
1. 기존 앱 리팩토링 시 "이 레거시 컴포넌트가 뭐였지?" 를 이해할 수 있어야 함. reconcile 스킬이 기존 코드에서 LinkContent 발견 시 참조.
2. Rootage 토큰은 여전히 존재. 토큰 참고용.
3. migration 가이드 자체가 문서의 main value.
→ inline-banner.md 가 동일 패턴. 제거하지 않고 deprecation stub 유지.

### top-navigation rootage-only — sync 스크립트 수정까지 왜 묶나?
sync-from-seed.mjs 가 `not-ported` 와 `rootage-only` 를 구분해 리포트. set 에 추가하지 않으면 top-navigation.md 를 작성해도 스크립트가 "not-ported" 로 잘못 분류 → snapshot 과 문서 상태 불일치. 같은 PR 에서 해결해야 atomic.

### Wave 3 의존성은 왜 S3→S6, S4→S7?
cross-reference 링크 (`[tablist.md](./tablist.md)`) 가 broken 이면 critic 이 즉시 reject. 같은 session 에서 순서 맞추면 해결.
