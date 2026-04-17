# Transforms — item 종류별 변환 방법

plan.json의 각 item은 `category` + `subcategory` + `kind` 조합으로 transform 함수가 결정된다. 각 transform은 "예측 → diff 미리보기 → 적용" 3단계.

## 공통 규약

- **입력**: item 1개 + 스캔 시점의 `occurrences[]`
- **dry-run**: 기본 지원 — 실제 쓰지 않고 변경될 내용을 diff 형식으로 출력
- **실패 표기**: transform은 never-throw. 실패 시 `{ result: "skipped", reason: "..." }` 반환하고 apply-log에 기록.
- **스코프**: 해당 item의 occurrences 범위에만 변경을 가한다. "이 파일 전체 정리" 금지.

## 1. token-replace

### 1.1 CSS / inline style / CSS-in-JS 문자열

패턴: `property: value` → `property: var(--seed-...)`.

```
BEFORE: background: '#ff6f0f';
AFTER:  background: var(--seed-color-bg-brand-solid);
```

- 공백·따옴표 정규화 유지
- 주석·세미콜론 위치 보존
- Prettier·ESLint가 있으면 단계 gate에서 자동 포맷이 돌 것으로 가정 — transform 자체는 formatting 책임 없음

### 1.2 Tailwind class

Arbitrary value를 Seed 토큰 매핑으로 교체.

```
BEFORE: className="bg-[#ff6f0f] p-[17px] text-[14px]"
AFTER:  className="bg-[var(--seed-color-bg-brand-solid)] p-4 text-sm"
```

- `p-[17px]` 같은 off-grid는 Seed 4px 그리드에 가장 가까운 값으로 정규화 (16px → `p-4`). 정규화 폭이 2px 이상이면 `needsDecision` 원복.
- 기본 Tailwind 팔레트로 매핑 가능하면(`text-sm` 등) 우선 사용, 안 되면 `text-[var(...)]` arbitrary 방식.
- Tailwind config에 `theme.extend.colors.brand` 같은 키를 추가하는 경로는 별도 item(`dependency` 또는 `config-change`)로 빼둔다 — transform은 설정파일 수정 책임 없음.

### 1.3 pairedChange

font-size와 line-height처럼 쌍 변경. 같은 선언 블록 또는 같은 className에 동반 수정.

```
BEFORE:
  font-size: 14px;
  line-height: 1.5;
AFTER:
  font-size: var(--seed-font-size-t4);
  line-height: var(--seed-line-height-t4);
```

쌍 중 하나만 발견하면(다른 라인·파일에 분리) warning + skip, 또는 "쌍 상대를 탐색해서 같이 수정" 옵션을 사용자 확인 후 수행.

## 2. component-swap

### 2.1 네이티브 → Seed

`<button>` → `<ActionButton>`, `<input>` → `<TextField>` 등.

변환 단계:
1. 파일 상단에 import 추가 (없으면)
   ```tsx
   import { ActionButton } from "@seed-design/react-load";
   ```
2. 요소 이름 치환
3. props 매핑
   - 공통: `className`, `onClick`, `disabled`, `aria-*`는 그대로
   - `type="submit"`은 ActionButton이 지원하므로 유지
   - `<button>`의 자식 텍스트는 그대로 children으로
4. 스타일 props 정규화
   - `style={{ ... }}`에 남은 하드코딩 값은 이 transform 범위 밖(token-replace item이 따로 처리)
5. 기본 variant 결정: CTA성이 확실하면 `brandSolid`, 보조면 `neutralWeak`. 결정 불가면 `variant="brandSolid"` + 코드 주석으로 "TODO: variant 재검토" 남기고 warning.

**판정이 애매하면 transform은 skip하고 `needsDecision: true` 역주입**. plan에 원래부터 needsDecision이면 preflight에서 이미 제외됨.

### 2.2 커스텀 → Seed

프로젝트 내 `<Button>` 컴포넌트를 ActionButton으로. 두 갈래:

**A. 컴포넌트 파일 자체를 래퍼로 교체** (일괄 대체)
- `src/ui/Button.tsx`의 구현을 ActionButton 래핑으로 교체
- 기존 props signature 유지 (`variant` prop의 값이 다르면 내부에서 매핑)
- 호출부는 건드리지 않음

**B. 호출부를 ActionButton으로 교체** (점진적)
- 호출부마다 import 추가 + 요소 이름 교체
- 커스텀 컴포넌트는 미사용으로 남거나 사용자가 추후 제거

기본 A를 선호 — 영향 범위 작음. plan item의 metadata로 A/B 선택 가능.

### 2.3 Modal / Dialog / Sheet 계열

3가지 후보(`Dialog` · `BottomSheet` · 그대로 Modal)가 나뉘므로 transform은 plan item의 `target`에 지정된 것만 수행. 없으면 skip + needsDecision.

필수 삽입:
- `<Dialog.Title>` (없으면 자동 삽입 — 기존 `title` prop·h2 등에서 추출)
- `<Dialog.Description>` (있을 때만)

aria-* 속성은 Seed 컴포넌트가 내부에서 관리하므로 기존 수동 aria 속성은 제거.

## 3. variant-fix

```
BEFORE:
  <ActionButton variant="brandSolid">취소</ActionButton>
  <ActionButton variant="brandSolid">저장</ActionButton>

AFTER:
  <ActionButton variant="neutralWeak">취소</ActionButton>
  <ActionButton variant="brandSolid">저장</ActionButton>
```

- 텍스트 내용으로 "주 액션" 추정: "확인·저장·등록·완료·다음" 계열이 brandSolid 유지, 나머지가 neutralWeak로.
- `onClick` 대상 이름도 힌트 (`handleSubmit`, `handleCancel` 등).
- 판정 애매 → needsDecision로 역주입.

## 4. accessibility-fix

### iconOnly 버튼에 aria-label

```
BEFORE: <ActionButton layout="iconOnly"><IconSearch /></ActionButton>
AFTER:  <ActionButton layout="iconOnly" aria-label="검색"><IconSearch /></ActionButton>
```

- label 유추: 아이콘 컴포넌트 이름(`IconSearch` → "검색") + 주변 문맥
- 유추 신뢰도 < 0.7면 `aria-label="TODO"` + warning

### TextField label

```
BEFORE: <TextField placeholder="이메일" />
AFTER:  <TextField label="이메일" placeholder="example@domain.com" />
```

- placeholder가 라벨 역할을 하는 경우만 대상
- placeholder 예시 값이 없으면 비우고 label만 설정

### Dialog Title

```
BEFORE: <Dialog>...</Dialog>
AFTER:  <Dialog><Dialog.Title>제목 미정</Dialog.Title>...</Dialog>
```

기존 h1/h2·title prop에서 추출. 없으면 "제목 미정" + warning.

## 5. drop

### 5.1 속성 제거

```
BEFORE: <ActionButton style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
AFTER:  <ActionButton>
```

- `style` 객체에서 해당 키만 제거. 객체가 비면 `style` prop 자체 삭제.

### 5.2 요소 단순화

```
BEFORE:
  <div role="button" onClick={fn} tabIndex={0}>
    <span>클릭</span>
  </div>

AFTER:
  <ActionButton onClick={fn}>클릭</ActionButton>
```

drop + swap 결합 — `category: "drop"` 이지만 실제로는 `component-swap`으로 위임.

### 5.3 AI-slop 레이아웃

중앙정렬 flex 연쇄 등은 맥락 없이 자동 제거 위험이 커서 기본 `needsDecision`. transform은 skip + 리포트만.

## 6. import

### 6.1 패키지 설치

```bash
# pnpm
pnpm add @seed-design/react-load @seed-design/css

# npm
npm install @seed-design/react-load @seed-design/css

# yarn
yarn add @seed-design/react-load @seed-design/css
```

감지된 패키지 매니저에 맞춰 명령 실행 전 사용자 확인. lockfile 존재로 매니저 감지.

### 6.2 CSS import 추가

```tsx
// 앱 엔트리 (예: src/main.tsx, pages/_app.tsx, app/layout.tsx)
import "@seed-design/css/base.css";
import "@seed-design/css/token.css";
```

엔트리 파일은 프레임워크별로 자동 탐색:
- Next.js App Router: `app/layout.tsx`
- Next.js Pages: `pages/_app.tsx`
- Vite React: `src/main.tsx` / `src/main.ts`
- Remix: `app/root.tsx`
- 못 찾으면 사용자에게 경로 확인

## 7. 커밋 메시지

각 stage가 끝날 때 기본적으로 자동 커밋(사용자가 `--no-commit`으로 끌 수 있음).

포맷:

```
style(seed-reconcile): apply <stage name>

- <item 1 한줄 요약>
- <item 2 한줄 요약>
- ... (최대 10개, 이상은 `+N more`)

Stage: <order>/<total>
Items: <count>
Files: <count>
Plan: .reconcile/plan.json (generated <timestamp>)
```

- 타입은 `style` (design system refactor) 또는 `refactor` (component swap). category 기반 결정.
- 글로벌 규칙상 Co-Authored-By 라인은 `~/.claude/settings.json`에서 이미 비활성화 → 추가하지 않음.

## 8. 변환 skip 기준 (공통)

- 파일 없음 / 라인 번호 밖 / 패턴 미스매치 → skip
- 동적 prop spread로 props를 특정 불가 → skip + warning
- 같은 파일에 conflict 있는 다른 item 이미 적용됨 → skip + 나중에 같이 처리하라는 warning
- dry-run 모드면 모든 변경을 diff로만 출력하고 절대 쓰지 않음
