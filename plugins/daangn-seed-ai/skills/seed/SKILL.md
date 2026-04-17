---
description: "당근 Seed 디자인 시스템을 AI-first로 재구조화한 self-contained 스냅샷. 빠른 앱 개발에서 generic AI-slop 회피, 토큰/컴포넌트/결정 매트릭스 기반 UI 설계 시 사용. '당근 디자인으로 만들어줘', 'Seed 기반 UI', 'daangn-seed-ai', 'daangn-ai', 'AI 스럽지 않은 UI' 같은 요청에 로드."
---

# daangn-seed-ai

당근 Seed 디자인 시스템의 토큰·컴포넌트·사용 규약을 Claude가 바로 소비할 수 있는 구조로 재구성한 스킬. 외부 네트워크나 `seed-design.io` 의존 없이 스냅샷 데이터만으로 동작한다.

## 언제 로드하나

- 새 웹 앱/화면을 빠르게 만들고 싶은데 "AI 생성물 같은" 제네릭 UI를 피하고 싶을 때
- 당근 스타일(또는 그 파생 브랜드)의 UI를 구현해야 할 때
- 토큰 체계·컴포넌트 anatomy가 필요하지만 Seed 문서를 매번 WebFetch 하고 싶지 않을 때

## 언제 로드하지 않나

- 당근과 무관한 브랜드/미학이 필요한 경우 → `impeccable` 또는 `design-consultation`
- 이미 다른 디자인 시스템(shadcn, Material 등)이 도입된 프로젝트
- 순수 마케팅 페이지·랜딩(당근 스타일은 제품 UI에 최적화됨)

## 철학 — AI-slop 회피

1. **의미론적 토큰 우선** — primitive(`gray-500`) 대신 semantic(`fg.neutral-muted`) 사용. 역할이 드러나면 디자인이 일관된다.
2. **기존 컴포넌트 우선** — 유사한 컴포넌트를 새로 만들지 말고 기존 anatomy에 맞춘다. "버튼 비슷한 div"가 AI-slop의 제1원인.
3. **공백과 정렬 규칙 준수** — 4px 그리드, 수직 리듬, 컴포넌트 간 간격 토큰화. 제멋대로 간격은 AI-slop의 제2원인.
4. **상태 머신 명시** — hover/pressed/disabled/loading 상태를 빠뜨리지 않는다.
5. **한국어 타이포 우선** — 영어 기준 line-height가 한국어에선 좁게 보임. Seed의 typography 토큰이 이미 반영됨.

상세: `references/philosophy.md`

## 작업 유형별 라우팅

사용자 의도를 먼저 분류하고 해당 레퍼런스만 읽는다.

| 의도 | 읽을 파일 |
|------|-----------|
| 컬러 결정 / 토큰 이름 확인 | `references/tokens/color.md` |
| 타이포 스케일 / 폰트 크기 | `references/tokens/typography.md` |
| 간격·반경 | `references/tokens/spacing.md`, `references/tokens/radius.md` |
| 그림자·모션 | `references/tokens/shadow.json`, `duration.json`, `timing-function.json` (raw) |
| 레이아웃 구성 (Flex/Stack/Grid) | `references/layout/primitives.md` (spacing rhythm은 `tokens/spacing.md`) |
| 특정 컴포넌트 사용 | `references/components/{name}.md` |
| "어떤 버튼/오버레이/입력을 써야 하나" | `references/decision-matrices/{which-*}.md` |
| 여러 컴포넌트를 조합 | `references/decision-matrices/composition.md` |
| 금지 사항 / 리뷰 | `references/anti-patterns.md` (항상 권장) |

## 사용 워크플로우

1. **의도 파악** — 사용자 요청이 "토큰만", "컴포넌트 선택", "전체 화면 조립" 중 어디인지 분류
2. **결정 매트릭스 선행** — 2개 이상 컴포넌트가 후보라면 `decision-matrices/` 먼저 읽고 하나를 확정
3. **anatomy 준수** — 컴포넌트 파일의 slots/states/variants/constraints를 그대로 구현. 임의 추가 금지
4. **anti-patterns 체크** — 작성 후 `anti-patterns.md`의 금지 목록과 대조
5. **토큰 사용 검증** — hardcoded 값(`#ff6f0f`, `16px`) 대신 토큰 이름 사용 확인

## 참조 파일 인덱스

`references/index.md`에 전체 트리 + 각 파일의 용도 요약.

## Attribution

Seed 스냅샷 데이터와 컴포넌트 구조는 Apache 2.0 라이선스의 [daangn/seed-design](https://github.com/daangn/seed-design)에서 파생됨. 상세는 `NOTICE.md`.

## 동기화 정책

스냅샷은 자동 갱신되지 않는다. upstream 변경 감지·반영은 `scripts/sync-from-seed.mjs`로 diff 리포트를 생성하고 사람이 판단해 반영한다 — human-first → AI-first 번역에는 판단이 필요하기 때문에 자동화는 품질을 떨어뜨린다.
