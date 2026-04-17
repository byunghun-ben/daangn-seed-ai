# References — Index

이 폴더의 파일들은 Claude가 작업 유형에 따라 선택적으로 읽도록 설계된 참조 자료. 한꺼번에 다 읽지 말고, `SKILL.md`의 "작업 유형별 라우팅" 표에 따라 필요한 것만.

## 전체 구조

```
references/
├── index.md                    ← 이 파일
├── _snapshot.json              ← upstream commit SHA + 스냅샷 메타데이터
├── philosophy.md               ← 스킬의 철학·AI-slop 회피 원칙
├── anti-patterns.md            ← 금지 사항 목록 (리뷰 체크리스트)
│
├── tokens/
│   ├── README.md               ← 토큰 티어·우선순위·사용 원칙
│   ├── color.md                ← semantic 컬러 intent 맵 (bg/fg/stroke/banner)
│   ├── color.json              ← 원본 컬러 토큰 (palette + semantic)
│   ├── typography.md           ← t1-t10 스케일·페어링·레시피
│   ├── font-size.json          ← 원본 폰트 사이즈
│   ├── line-height.json        ← 원본 라인 하이트
│   ├── font-weight.json        ← 원본 폰트 두께
│   ├── spacing.md              ← 4px 리듬·레벨별 기본값
│   ├── dimension.json          ← 원본 간격 토큰
│   ├── radius.md               ← 반경 intent + 컴포넌트별 기본
│   ├── radius.json             ← 원본 반경 토큰
│   ├── shadow.json             ← 원본 그림자
│   ├── duration.json           ← 모션 duration
│   ├── timing-function.json    ← 모션 easing
│   └── gradient.json           ← 그래디언트
│
├── components/
│   ├── _template.md            ← 컴포넌트 문서 작성 규칙
│   ├── action-button.md        ← 일반 액션 버튼
│   ├── callout.md              ← 섹션 내 알림 카드
│   ├── snackbar.md             ← 일시 피드백 토스트
│   ├── dialog.md               ← 중앙 모달
│   ├── bottom-sheet.md         ← 하단 시트
│   ├── text-field.md           ← 텍스트 입력
│   └── icon.md                 ← Icon 슬롯 컨테이너 + BYO 아이콘 라이브러리 가이드
│
├── layout/
│   └── primitives.md           ← Box/Flex/Stack/Grid 등 레이아웃 컴포넌트
│
└── decision-matrices/
    ├── which-button.md         ← "어떤 버튼을?" 결정 트리
    ├── which-overlay.md        ← "어떤 오버레이를?" 결정 트리
    ├── which-input.md          ← "어떤 입력을?" 결정 트리
    └── composition.md          ← 여러 컴포넌트 조합 규칙
```

## 읽는 순서 권장

### 처음 접할 때 (한 번만)
1. `philosophy.md` — 이 스킬의 사상
2. `tokens/README.md` — 토큰 체계 이해
3. `anti-patterns.md` — 하지 말아야 할 것들 체크리스트화

### 실제 구현 작업 시
1. `decision-matrices/which-*.md` — 어떤 컴포넌트를 쓸지 확정
2. `components/{name}.md` — 선택한 컴포넌트의 anatomy·variant·states
3. `tokens/*.md` — 색·간격·타이포 결정 시 해당 파일
4. `anti-patterns.md` — 작성 후 검증

### 레이아웃 짜기
1. `layout/primitives.md` — Stack/Flex/Grid 선택
2. `tokens/spacing.md` — gap·padding 토큰 결정
3. `decision-matrices/composition.md` — 조합 규칙

## 커버리지

**MVP 스코프**: 토큰 전체 + 고빈도 컴포넌트 6개(ActionButton, Callout, Snackbar, Dialog, BottomSheet, TextField) + Icon 슬롯 컨테이너 가이드 + 레이아웃 + 결정 매트릭스 4개.

**Icon 관련 주의** — Seed는 아이콘 **슬롯 API**(`Icon`/`PrefixIcon`/`SuffixIcon`/`IconRequired`)만 제공하고 **아이콘 에셋은 의도적으로 제공하지 않는다**. `components/icon.md`는 슬롯 anatomy + BYO(Bring Your Own) 라이브러리 선택 가이드까지 다룬다. 당근팀은 `@karrotmarket/react-monochrome-icon`, 외부는 Lucide/Tabler 권장.

**미포팅 컴포넌트** (필요 시 `_template.md` 기반으로 추가):
- Avatar, Badge, Chip, Checkbox, RadioGroup, Switch, SegmentedControl, Tabs, List, Skeleton, ProgressCircle, Slider, SelectBox, FieldButton, Fab 등

추가 시 `packages/rootage/components/{name}.yaml`(upstream clone)에서 slot/variant 데이터를 가져오고 `_template.md` 포맷으로 작성. `scripts/sync-from-seed.mjs`의 component diff가 미포팅을 `not-ported`로 표시한다.
