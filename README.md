# daangn-seed-ai

Claude Code 스킬. 당근 [Seed Design System](https://github.com/daangn/seed-design)을 AI-first로 재구조화한 self-contained 스냅샷. 빠른 앱 개발에서 generic AI-slop을 회피하고, 토큰·컴포넌트·결정 매트릭스 기반으로 Seed 스타일 UI를 작성하도록 안내한다.

## 왜 필요한가

Seed 공식 문서는 사람이 읽기 위해 설계됐다. 마케팅 랜딩, 인터랙티브 playground, 산문형 설명. Claude가 그 구조를 소비하려면 여러 페이지를 왔다 갔다 하며 맥락을 재구성해야 하고, "언제 쓰지 말아야 하나"는 거의 보이지 않는다.

당근이 배포하는 공식 `seed-design` 스킬도 좋지만 `seed-design.io`의 llms.txt를 런타임 WebFetch로 불러오는 구조라 upstream이 사라지면 동작하지 않는다.

이 스킬은 Seed를 Claude의 소비 방식에 맞춰 재구조화한 **self-contained 스냅샷**이다.

- **decision-first** — "어느 컴포넌트를 쓸지"가 제일 어렵다. `decision-matrices/`가 `components/`보다 먼저 참조된다.
- **anti-patterns 일급** — "이렇게 쓰지 마세요"가 AI-slop을 더 잘 막는다. generic AI가 반복하는 실수 13종을 grep 가능한 형태로 나열.
- **structured data > 산문** — slot/variant/state/token을 테이블로. Claude는 테이블을 더 정확히 소비한다.
- **self-contained** — 모든 토큰·anatomy가 파일로 들어있다. seed-design.io가 private 돼도 동작.
- **한국어 UX 내장** — `maxGraphemeCount`, Seed의 한국어 line-height 등 한국어 기준 세팅 반영.

## 설치

### 1) Claude Code 스킬 디렉토리에 심볼릭 링크 (권장, 업데이트 즉시 반영)

```bash
git clone https://github.com/byunghun-ben/daangn-seed-ai.git ~/Documents/projects/daangn-seed-ai
ln -s ~/Documents/projects/daangn-seed-ai ~/.claude/skills/daangn-seed-ai
```

### 2) 복사 설치 (간단하지만 업데이트 수동)

```bash
git clone https://github.com/byunghun-ben/daangn-seed-ai.git /tmp/daangn-seed-ai
cp -r /tmp/daangn-seed-ai ~/.claude/skills/daangn-seed-ai
```

설치 후 Claude Code에서 `/reload-plugins` 또는 재시작하면 스킬이 로드된다.

## 사용

스킬은 아래 같은 트리거로 자동 로드된다.

- "당근 스타일로 회원가입 페이지 만들어줘"
- "Seed 기반으로 중고거래 리스트 UI"
- "AI 스럽지 않은 UI가 필요해"

또는 명시적으로 `daangn-seed-ai 스킬을 써서 ...`로 호출.

스킬이 로드되면 `SKILL.md`의 "작업 유형별 라우팅" 표에 따라 `references/` 하위 파일을 선택적으로 읽는다.

## 레퍼런스 구조

```
SKILL.md                          # 진입점
NOTICE.md                         # Apache 2.0 attribution to upstream Seed
references/
├── index.md                      # 트리 + 읽는 순서
├── _snapshot.json                # upstream commit SHA + 스냅샷 메타데이터
├── philosophy.md                 # AI-slop 회피 원칙
├── anti-patterns.md              # 금지 사항 13종 (검증 체크리스트)
├── tokens/                       # 원본 JSON 10개 + intent 맵 md
├── components/                   # MVP 6개: ActionButton/Callout/Snackbar/Dialog/BottomSheet/TextField + _template
├── layout/primitives.md          # Stack/Flex/Grid/Box 선택 가이드
└── decision-matrices/            # which-button / which-overlay / which-input / composition
```

## 스크립트

### `scripts/sync-from-seed.mjs` — upstream diff 리포트

```bash
node scripts/sync-from-seed.mjs
```

업스트림 Seed를 `/tmp/seed-design-sync`에 얕게 클론해서 토큰·컴포넌트 diff를 출력한다. **자동 반영은 하지 않는다** — human-first → AI-first 번역에는 판단이 들어가서 자동화하면 품질이 떨어진다. 사람이 diff를 보고 `references/`와 `_snapshot.json`을 수동 갱신한다.

### `scripts/test.mjs` — 드라이런 하네스

```bash
node scripts/test.mjs               # 모든 시나리오
node scripts/test.mjs signup        # 하나만
node scripts/test.mjs --lint-only <path>   # 파일 린트만
```

시나리오별로 fresh `claude -p` 서브프로세스를 띄워 스킬을 실제로 소비하게 하고, 생성된 HTML을 anti-patterns 기준으로 grep-린트한다. 결과물은 `temp/daangn-runs/<timestamp>/`에 저장.

내장 시나리오:
- `signup` — 폼 중심 (TextField × 3, Callout, 2-button footer)
- `listDialog` — 파괴적 Dialog (criticalSolid, 주 액션 우측)
- `feedback` — Snackbar vs Dialog 구분

## 커버리지 (MVP)

**포팅됨 (6 components)**: ActionButton, Callout, Snackbar, Dialog, BottomSheet, TextField + 토큰 전체 + 레이아웃 + 결정 매트릭스 4개.

**미포팅** (필요 시 `components/_template.md`로 추가):
Avatar, Badge, Chip, Checkbox, RadioGroup, Switch, SegmentedControl, Tabs, List, Icon, Skeleton, Slider, SelectBox, FieldButton, Fab 등. `scripts/sync-from-seed.mjs`가 미포팅 항목을 `not-ported`로 리포트한다.

## Attribution

Seed 스냅샷 데이터와 컴포넌트 구조는 [daangn/seed-design](https://github.com/daangn/seed-design) (Apache 2.0)에서 파생. 상세는 [NOTICE.md](./NOTICE.md).

스냅샷 버전은 [`references/_snapshot.json`](./references/_snapshot.json) 참조.

## 라이선스

Apache License 2.0. [LICENSE](./LICENSE) 참조.
