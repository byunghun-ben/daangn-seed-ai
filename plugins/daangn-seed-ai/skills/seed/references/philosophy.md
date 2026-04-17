# Philosophy — AI-first, AI-slop 회피

## 왜 이 스킬이 존재하나

Seed의 공식 문서는 사람이 읽기 위해 설계됐다. 마케팅 랜딩, 인터랙티브 playground, 산문형 설명, 예시로 암묵적 컨벤션 학습. 이 구조를 Claude가 소비하면 맥락을 매번 재구성해야 하고, "언제 쓰지 말아야 하나"는 거의 보이지 않는다.

**이 스킬은 Seed를 Claude의 소비 방식에 맞춰 재구조화한 스냅샷이다.** 5가지 원칙:

1. **결정 먼저, 구현은 그 다음** — 어느 컴포넌트를 쓸지가 제일 어렵고, 일단 고르면 구현은 쉽다. 그래서 `decision-matrices/`가 `components/`보다 먼저 참조되도록 설계.
2. **anti-patterns 일급** — "이렇게 쓰세요"보다 "이렇게 쓰지 마세요"가 AI-slop을 더 잘 막는다. generic AI가 만드는 모든 실수가 anti-pattern 파일에 나열돼 있다.
3. **구조화된 데이터 > 산문** — slot/variant/state/token은 테이블로, 근거는 본문으로. Claude는 테이블을 더 정확히 소비한다.
4. **self-contained** — 모든 토큰·anatomy가 파일로 들어있다. seed-design.io가 private 돼도 스킬은 동작한다.
5. **한국어 UX 내장** — Seed가 한국어 기준으로 설계된 것(`maxGraphemeCount`, 한국어 line-height 등)을 그대로 반영.

---

## AI-slop이란 무엇인가

LLM이 디자인 시스템 없이 UI를 만들 때 드러나는 공통 증상:

| 증상 | 근본 원인 |
|------|----------|
| 과도한 중앙 정렬 | 어디 놓을지 모르니 가운데 |
| 파스텔 그라디언트 남발 | "예쁘게"에 대한 안전한 기본값 |
| 둥근 모서리 과다 (20px+) | 부드럽게 하려는 무난한 선택 |
| 버튼에 그림자 | 입체감 없으면 허전하다는 편견 |
| 제멋대로 간격 (9px, 17px) | 4px 그리드 없이 눈대중 |
| 한 화면의 solid 버튼 3개 | 계층 없이 다 강조 |
| 플레이스홀더가 라벨 대체 | 공간 절약 우선 |
| placeholder만 보이는 폼 | 포커스 시 맥락 상실 |
| 이모지로 장식 | 신뢰도 희생 |

Seed는 이 모든 항목의 반대편에 있다. **flat, neutral-dominant, 정돈된 그리드, 명확한 계층**.

---

## 이 스킬을 사용하는 기본 자세

### 1. 구현 전에 decision-matrix

컴포넌트를 바로 쓰지 말고, 먼저 "어느 카테고리인가"를 `decision-matrices/`에서 확정한다. 버튼 하나 추가하기 전에:

> 이 액션은 일회성인가 토글인가? → ActionButton or Switch
> 주요 CTA인가? → brandSolid
> 한 화면에 이미 solid가 있나? → weak로 강등

### 2. variant 이름에 담긴 의도 존중

`brandSolid`, `neutralWeak`, `criticalSolid` — 이름이 이미 "언제 쓸지"를 말한다. "색상을 마음에 든 것"으로 고르지 말고 "역할에 맞는 것"으로 고른다.

### 3. 토큰을 줄여 쓰기 욕구를 참기

`paddingX="16px"`로 쓰고 싶어도 `paddingX="x4"`로 쓴다. 숫자가 "왜 16px인가"를 드러내지 못한다. 토큰은 "다음 사람(또는 AI)이 이해할 수 있는 근거"이다.

### 4. 한국어 기본

한국어 앱을 만든다면 `maxGraphemeCount`, Seed의 line-height, 한국어 레이블 길이(라틴 대비 30~50% 짧음)를 고려. 버튼에 "Continue"를 "계속"으로 바꾸면 패딩이 남아서 어색할 수 있음 — size 조정.

### 5. 접근성은 제약이지 옵션이 아님

`layout="iconOnly"` + `aria-label` 없음은 런타임 경고가 나는 에러 조건으로 취급. Dialog에 Title 없음도 동일.

---

## 이 스킬이 하지 않는 것

- 새로운 미학·브랜드 가이드라인 제공 → `impeccable` 또는 `design-consultation`
- Seed의 모든 컴포넌트 백과사전화 → MVP는 고빈도 15개 내외
- runtime에 npm 패키지·llms.txt fetch → self-contained 스냅샷
- 자동 동기화 → 수동 diff 리뷰 (품질 보장)
- 비당근 프로젝트에 맞추는 fork 워크플로우 → 후속 `daangn-fork` 스킬 (로드맵)

---

## 핵심 한 줄

> **decision-matrix로 고르고, component 파일로 구현하고, anti-patterns로 검증한다.**
