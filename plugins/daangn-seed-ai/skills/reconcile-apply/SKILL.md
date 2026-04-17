---
description: "reconcile 스킬이 생성한 .reconcile/plan.json을 읽어, 기존 앱 코드베이스에 Seed 디자인 시스템 리팩터를 staged로 적용하는 쓰기 스킬. 'reconcile 적용', '디자인 시스템 마이그레이션 실행', 'plan.json 실행', 'Seed 리팩터 적용' 같은 요청에 로드. reconcile 리포트가 선행되어야 하며, 단계별 gate·롤백·진행 로그를 관리."
---

# reconcile-apply

`reconcile`이 만든 `.reconcile/plan.json`을 소비해서 **실제 파일을 수정**하는 스킬. staging 순서를 지키고, 각 단계마다 gate·검증·롤백 경로를 확보한다.

## 언제 로드하나

- `.reconcile/plan.json`이 이미 존재하고 확인·확정이 끝난 상태
- 대규모 리팩터를 자동·반자동으로 진행하려 할 때
- 특정 staging 그룹만 먼저 적용하고 나머지는 보류하고 싶을 때

## 언제 로드하지 않나

- plan.json이 없거나 방금 코드가 크게 바뀌어서 인벤토리가 낡은 경우 → `reconcile` 먼저 실행
- "어디부터 고쳐야 할지" 단계의 분석이 필요하면 → `reconcile`
- 단발성 파일 수정이면 → 일반 편집 도구로 충분

## 전제 조건 검증

실행 즉시 아래를 확인. 하나라도 실패하면 중단.

1. `.reconcile/plan.json` 존재 + 유효한 JSON + `version === 1`
2. `plan.json`의 `cwd`가 현재 `pwd`와 일치 (절대경로 비교)
3. 작업 트리 상태 — `git status --porcelain`에 커밋 안 된 변경이 있으면 경고하고 사용자 확인:
   - "현재 브랜치에 커밋 안 된 변경이 있습니다. 계속하면 apply 결과와 섞입니다. (a) 커밋 후 재시도 (b) stash 후 진행 (c) 그래도 진행"
4. `plan.json`의 `generatedAt`이 현재 시점에서 24시간을 넘으면 경고 — 인벤토리가 낡았을 가능성
5. `needsDecision: true`인 item이 plan에 남아 있으면 경고 — 기본적으로 해당 item은 skip. 사용자가 `--include-undecided`로 강제 포함 가능.

## 실행 모드

```
/daangn-seed-ai:reconcile-apply                 # 전체 staging 순차 실행 (기본)
/daangn-seed-ai:reconcile-apply --stage 2        # 특정 stage만
/daangn-seed-ai:reconcile-apply --dry-run        # 변경 내용만 출력, 파일 쓰기 안 함
/daangn-seed-ai:reconcile-apply --only <itemId>  # 특정 item만 (디버깅용)
/daangn-seed-ai:reconcile-apply --rollback       # 마지막 run의 apply-log 기반 역적용
```

슬래시 명령의 실제 플래그 파싱은 스킬 본문에서 자연어 해석 — 사용자가 "dry run으로 해줘" 같이 적어도 같게 동작.

## 실행 순서

1. **Preflight** — 위 전제 조건 검증 + plan 요약 출력 + 실행 계획 설명
2. **Confirm** — 사용자에게 "이 계획으로 진행할까요?" 한 번 확인 (`--yes`로 생략 가능)
3. **Per stage** — staging 배열을 순서대로:
   a. Stage 요약 표시 ("Stage 2/6: Token replacements — 42 items, ~23 files")
   b. item 하나씩 transform 수행 (`references/transforms.md`)
   c. stage 완료 시 `apply-log.json`에 기록
   d. stage의 `gate` 수행 (lint / tests / manual-check) — 실패 시 해당 stage만 롤백하고 중단
4. **Verification** — 전체 stage 완료 후 `references/verification.md`의 체크리스트 실행
5. **Report** — `.reconcile/apply-summary.md`에 최종 결과 기록

## Staging 기본 순서

plan의 staging을 따르되, plan이 비어 있거나 스킵된 경우 기본값은 다음 순서 (`references/staging-order.md`):

1. Install Seed (dependency, base.css)
2. Token replace — colors
3. Token replace — spacing · radius · shadow
4. Token replace — typography (pairedChange 포함)
5. Accessibility fixes (aria-label, Dialog.Title 보충)
6. Variant fixes (버튼 variant 정리)
7. Component swap — 네이티브 → Seed
8. Component swap — 커스텀 → Seed
9. Drop — anti-pattern 제거
10. Layout idiom 정리

리스크 낮은 것부터. 각 단계에서 실패하면 그 아래 단계는 시도하지 않는다.

## 변환 종류

상세: `references/transforms.md`. 핵심만:

- **token-replace** — 하드코딩 값 → semantic 토큰 치환. 가장 안전.
- **component-swap** — 네이티브/커스텀 컴포넌트 → Seed 컴포넌트. import 추가 + props 매핑 필요.
- **variant-fix** — 기존 Seed 컴포넌트의 variant만 수정.
- **accessibility-fix** — aria/label/title 삽입. 비파괴적.
- **drop** — 속성·요소 제거. 파괴적 — dry-run 우선 권장.
- **import** — 패키지 설치 (`npm install` / `pnpm add` / `yarn add`) + CSS import 추가.

## 안전 규칙

- **scope 엄격**: plan의 items에 명시된 파일·라인만 건드린다. "김에 같이 정리" 금지.
- **한 item 한 커밋 지향**: stage 단위 또는 item 단위로 커밋 (사용자가 선택). 커밋 메시지 형식은 `references/transforms.md`.
- **dry-run 가능**: 모든 transform은 dry-run 모드 지원 필수. 실제 파일 쓰기 전 diff 출력.
- **롤백 경로 확보**: 매 stage 전 `git status` 체크포인트 + apply-log에 before 스냅샷 해시. `--rollback`으로 마지막 stage만 되돌리기.
- **외부 명령 경계 확인**: `npm install` 등 네트워크 명령은 실행 전 사용자 확인 필수 (글로벌 규칙과 일치).

## apply-log 스키마

```json
{
  "planPath": ".reconcile/plan.json",
  "planGeneratedAt": "2026-04-17T...",
  "startedAt": "2026-04-17T...",
  "completedAt": "...",
  "runs": [
    {
      "stage": 2,
      "name": "Token replacements",
      "startedAt": "...",
      "items": [
        { "id": "color-abc-header", "result": "applied", "filesTouched": ["src/Header.tsx"], "diffDigest": "sha1..." },
        { "id": "color-def-footer", "result": "skipped", "reason": "file not found — likely moved" }
      ],
      "gate": { "type": "lint-pass", "result": "pass", "output": "eslint: 0 errors" },
      "gitRef": { "before": "abc123", "after": "def456" }
    }
  ]
}
```

## 에러 처리 정책

- **item 단위 실패**: 건너뛰고 apply-log에 기록, stage는 계속. item 연쇄 실패 5개 넘으면 stage 중단.
- **stage gate 실패**: 해당 stage 롤백 + 다음 stage 진행 안 함 + 사용자 알림.
- **predict 실패**: transform이 target 패턴을 찾지 못하면(파일 변경됨) 건너뛰고 사용자에게 "인벤토리 재스캔 권장".
- **conflict**: 동일 파일에 대한 여러 item이 서로 상충(같은 줄을 다르게 바꾸려 함) → 뒤 item skip + warning.

## 참조 파일 인덱스

- `references/transforms.md` — 각 category·subcategory별 변환 방법
- `references/staging-order.md` — 기본 staging·dependency 순서
- `references/verification.md` — anti-patterns.md 체크리스트 수행
- `references/rollback.md` — 실패 시 되돌리기 경로

## `seed` 스킬과의 관계

apply도 자체 기준을 가지지 않고 `seed` 스킬의 references를 참조한다. 특히:
- 컴포넌트 스왑 시 `skills/seed/references/components/{name}.md`의 slots·props를 기준으로 API 매핑
- variant fix 시 `skills/seed/references/decision-matrices/which-button.md` 같은 결정 트리 재참조
- 최종 검증은 `skills/seed/references/anti-patterns.md`의 체크리스트
