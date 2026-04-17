# daangn-seed-ai

> AI-first snapshot of daangn/seed-design, packaged as a Claude Code plugin.

Claude를 이용해서 앱을 디자인할 때, generic AI-slop을 뱉지 않도록. 당근의 [Seed Design System](https://github.com/daangn/seed-design) 기반의 토큰·컴포넌트·결정 매트릭스를 활용하여 디자인할 수 있도록 안내해요.

<sub>*AI-slop: AI가 반복적으로 뱉는 뻔한 UI 패턴*</sub>

## 한눈에 보기

<table>
<tr>
<th align="center">원본 — 직접 작성한 랜딩</th>
<th align="center">daangn-seed-ai 적용 후</th>
</tr>
<tr>
<td align="center"><img src="./docs/images/before-main.png" width="280" alt="Bridge Studio original landing" /></td>
<td align="center"><img src="./docs/images/after-daangn.png" width="280" alt="Bridge Studio styled with daangn-seed-ai" /></td>
</tr>
</table>

같은 Bridge Studio 서비스 리스트예요. 왼쪽은 직접 작성한 랜딩, 오른쪽은 `/daangn-seed-ai:seed 랜딩 페이지를 리디자인해줘` 한 줄로 나온 결과고요.

`ActionButton`·`List`·`Badge` 조합과 브랜드 컬러가 자연스럽게 잡혀요.

## 왜 필요할까요?

Seed 공식 문서와 공식 `seed-design` 스킬은 훌륭하지만 Claude가 소비하기엔 한계가 있어요. 공식 문서는 여러 페이지를 왔다 갔다 해야 맥락이 잡히고 "언제 쓰지 말아야 하는지"가 잘 안 보여요. 공식 스킬은 `seed-design.io`의 llms.txt를 런타임에 WebFetch로 가져오는 구조라 upstream이 사라지면 동작을 멈추고요.

이 스킬은 Seed를 Claude의 소비 방식에 맞춰 재구조화한 **self-contained 스냅샷**이에요.

**핵심 차별점**

- **decision-first** — "어느 컴포넌트를 쓸지"가 제일 어려워요. `decision-matrices/`가 `components/`보다 먼저 참조되도록 설계했어요.
- **self-contained** — 모든 토큰·anatomy가 파일로 들어있어서 `seed-design.io`가 private이 돼도 동작해요.

**품질을 받치는 것들**

- **anti-patterns 일급** — "이렇게 쓰지 마세요"가 AI-slop을 더 잘 막아줘요. generic AI가 반복하는 실수 13종을 grep 가능한 형태로 정리했어요.
- **structured data > 산문** — slot/variant/state/token을 테이블로 정리했어요. Claude는 테이블을 더 정확히 소비해요.
- **한국어 UX 내장** — `maxGraphemeCount`, Seed의 한국어 line-height 등 한국어 기준 세팅이 반영돼 있어요.

## 설치

Claude Code 플러그인으로 배포돼요. `/plugin` 명령을 지원하는 버전이 필요해요.

### 1) 마켓플레이스 등록 + 플러그인 설치 (권장)

Claude Code에서 아래 두 줄을 실행해 주세요.

```
/plugin marketplace add byunghun-ben/daangn-seed-ai
/plugin install daangn-seed-ai@daangn-seed-ai
```

설치 후 `/reload-plugins`를 하거나 Claude Code를 재시작하면 돼요. 스킬은 `/daangn-seed-ai:seed`라는 이름으로 나타나고, description 기반 자동 로드도 같이 동작해요.

### 2) 로컬 체크아웃으로 테스트

개발·개조용이에요. 레포를 클론한 뒤 `--plugin-dir`로 바로 붙이면 돼요.

```bash
git clone https://github.com/byunghun-ben/daangn-seed-ai.git
claude --plugin-dir ./daangn-seed-ai/plugins/daangn-seed-ai
```

같은 이름의 마켓플레이스 플러그인이 설치돼 있어도 그 세션에서는 로컬 복사본이 우선해요.

## 사용

이 플러그인은 세 개의 스킬을 포함해요. 상황에 맞는 것을 골라 쓰면 돼요.

### `/daangn-seed-ai:seed` — 새 프로젝트·새 화면

처음부터 당근 스타일로 만들 때 써요. 토큰·컴포넌트·결정 매트릭스를 참조해서 generic AI-slop을 피하면서 UI를 짜요.

자동 로드 트리거:
- "당근 스타일로 회원가입 페이지 만들어줘"
- "Seed 기반으로 중고거래 리스트 UI"
- "AI 스럽지 않은 UI가 필요해"

### `/daangn-seed-ai:reconcile` — 기존 앱 분석 (읽기 전용)

이미 만들고 있는 앱을 **3-way merge**(현재 × Seed × 도메인 요구) 관점으로 분석해요. 실제 파일은 건드리지 않고 `.reconcile/plan.json`과 `.reconcile/report.md`만 생성해요.

각 관찰치를 4분류로 나눠요:

- **Keep** — 이미 Seed 철학과 맞는 것
- **Refactor** — 의도는 맞지만 토큰/컴포넌트로 치환 필요
- **Drop** — Seed와 충돌하는 AI-slop 패턴
- **Import** — Seed에서 새로 들여올 것

자동 로드 트리거:
- "기존 앱에 Seed 도입하려고 해"
- "현재 디자인 수준 분석해줘"
- "AI-slop 제거해서 당근 스타일로 맞춰줘"

`pwd`를 기준으로 프레임워크·스타일 시스템·Seed 도입 정도를 자동 감지해요. 별도 경로 입력 없이 해당 디렉토리에서 실행만 하면 돼요.

### `/daangn-seed-ai:reconcile-apply` — 적용 (쓰기)

`reconcile`이 만든 `plan.json`을 입력으로 받아 실제 리팩터를 staged로 수행해요. 각 단계마다 lint/test gate를 거치고 실패 시 해당 stage만 롤백해요.

자동 로드 트리거:
- "reconcile 적용해줘"
- "디자인 시스템 마이그레이션 실행"
- "plan.json 실행"

실행 모드:
- 기본 — staging 전체 순차 실행
- `--dry-run` — 변경 내용만 출력
- `--stage N` — 특정 stage만
- `--rollback` — 마지막 stage 되돌리기

스킬이 로드되면 각 `SKILL.md`의 "작업 유형별 라우팅" 또는 "워크플로우"에 따라 `references/` 하위 파일을 선택적으로 읽어요.

## 레포 구조

```
daangn-seed-ai/                              # 레포 루트 = 마켓플레이스
├── .claude-plugin/
│   └── marketplace.json                     # 마켓플레이스 카탈로그
├── plugins/
│   └── daangn-seed-ai/                      # 플러그인 루트
│       ├── .claude-plugin/
│       │   └── plugin.json                  # 플러그인 매니페스트
│       └── skills/
│           ├── seed/                       # /daangn-seed-ai:seed  (새 프로젝트용)
│           │   ├── SKILL.md                 # 진입점
│           │   └── references/
│           │       ├── index.md             # 트리 + 읽는 순서
│           │       ├── _snapshot.json       # upstream commit SHA + 스냅샷 메타
│           │       ├── philosophy.md        # AI-slop 회피 원칙
│           │       ├── anti-patterns.md     # 금지 사항 13종 (검증 체크리스트)
│           │       ├── tokens/              # 원본 JSON 10개 + intent 맵 md
│           │       ├── components/          # MVP 6개 + _template
│           │       ├── layout/primitives.md # Stack/Flex/Grid/Box 선택 가이드
│           │       └── decision-matrices/   # which-button / -overlay / -input / composition
│           │
│           ├── reconcile/                  # /daangn-seed-ai:reconcile  (기존 앱 분석)
│           │   ├── SKILL.md                 # 읽기 전용 3-way diff 진입점
│           │   └── references/
│           │       ├── scan-strategy.md        # cwd 감지·프레임워크 식별
│           │       ├── inventory-extraction.md # 색·간격·컴포넌트 추출 규칙
│           │       ├── diff-rules.md           # current vs Seed 비교 규칙
│           │       ├── classification.md       # Keep/Refactor/Drop/Import 결정 트리
│           │       ├── plan-schema.md          # plan.json 스키마
│           │       └── report-format.md        # report.md 템플릿
│           │
│           └── reconcile-apply/            # /daangn-seed-ai:reconcile-apply  (적용)
│               ├── SKILL.md                 # plan.json 소비 + staged apply
│               └── references/
│                   ├── transforms.md        # item 종류별 변환 방법
│                   ├── staging-order.md     # 기본 적용 순서 + gate
│                   ├── verification.md      # 최종 검증 체크리스트
│                   └── rollback.md          # 되돌리기 경로
├── scripts/                                 # 개발용 하네스 (배포 제외)
├── NOTICE.md                                # Apache 2.0 attribution
├── LICENSE
└── README.md
```

## 개발용 스크립트

`scripts/`는 플러그인 패키지에 포함되지 않아요. 레포를 클론해서 레포 루트에서 실행해 주세요.

### `scripts/sync-from-seed.mjs` — upstream diff 리포트

```bash
node scripts/sync-from-seed.mjs
```

업스트림 Seed를 `/tmp/seed-design-sync`에 얕게 클론해서 토큰·컴포넌트 diff를 출력해요. **자동 반영은 하지 않아요** — human-first → AI-first 번역엔 판단이 들어가서, 자동화하면 품질이 떨어져요. diff를 보고 `plugins/daangn-seed-ai/skills/seed/references/`와 `_snapshot.json`을 수동으로 갱신해 주세요.

### `scripts/test.mjs` — 드라이런 하네스

```bash
node scripts/test.mjs                        # 모든 시나리오
node scripts/test.mjs signup                 # 하나만
node scripts/test.mjs --lint-only <path>     # 파일 린트만
```

시나리오별로 fresh `claude -p` 서브프로세스를 띄워 스킬을 실제로 소비시키고, 생성된 HTML을 anti-patterns 기준으로 grep-린트해요. 결과물은 `temp/daangn-runs/<timestamp>/`에 저장돼요 (gitignore됨).

내장 시나리오:
- `signup` — 폼 중심 (TextField × 3, Callout, 2-button footer)
- `listDialog` — 파괴적 Dialog (criticalSolid, 주 액션 우측)
- `feedback` — Snackbar vs Dialog 구분

## 커버리지

**포팅됨 (12 components)**: ActionButton, Callout, Snackbar, Dialog, BottomSheet, TextField, Icon, Avatar, AvatarStack, Badge, NotificationBadge, Divider + 토큰 전체 + 레이아웃 + 결정 매트릭스 4개 + 내부 primitives 13종 (composition.md).

**미포팅** (필요하면 `components/_template.md`로 추가할 수 있어요):
Chip, Checkbox, RadioGroup, Switch, SegmentedControl, Tabs, List, Skeleton, Slider, SelectBox, FieldButton, Fab 등. `scripts/sync-from-seed.mjs`가 미포팅 항목을 `not-ported`로 리포트해줘요.

## Attribution

Seed 스냅샷 데이터와 컴포넌트 구조는 [daangn/seed-design](https://github.com/daangn/seed-design) (Apache 2.0)에서 파생됐어요. 자세한 내용은 [NOTICE.md](./NOTICE.md)를 봐 주세요.

스냅샷 버전은 [`plugins/daangn-seed-ai/skills/seed/references/_snapshot.json`](./plugins/daangn-seed-ai/skills/seed/references/_snapshot.json)에서 확인할 수 있어요.

## 라이선스

Apache License 2.0이에요. [LICENSE](./LICENSE)를 확인해 주세요.
