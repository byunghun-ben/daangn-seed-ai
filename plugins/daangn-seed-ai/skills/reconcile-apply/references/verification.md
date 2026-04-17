# Verification — 최종 검증

모든 stage가 끝난 후 실행. 일부 검증은 각 stage 끝에서도 실행되지만, 최종 단계에서 종합 점검.

## 1. Anti-pattern 재확인

`seed` 스킬의 `references/anti-patterns.md` 체크리스트를 다시 돌린다. 방법:

- 리팩터 대상 파일에 대해 anti-patterns.md의 "❌" 패턴을 grep
- 새로 생긴 위반이 있으면 (apply 자체가 만든 문제) 즉시 경고
- 기존 위반이 처리되지 않고 남아 있으면 plan에 추가할 후보로 나열

리포트 섹션:

```markdown
## Anti-pattern 재스캔

| # | 항목 | 이전 | 현재 | 결론 |
|---|------|------|------|------|
| 1 | 하드코딩 값 | 42 | 3 | ✅ 정리됨 (3건은 domain exception) |
| 2 | 네이티브 button | 7 | 0 | ✅ 완료 |
| 13 | AI-slop 레이아웃 | 12 | 12 | ⚠️ needsDecision으로 미처리 |
```

## 2. 프로젝트 도구 재실행

각 도구가 있으면 최종 실행 후 결과 저장:

- **Lint**: `scripts.lint:check` 우선 (`--fix` 없이 검증만). 실패 시 경고만, 자동 수정 금지.
- **Type check**: `scripts.typecheck` 또는 `tsc --noEmit`
- **Tests**: `scripts.test`
- **Build** (선택): `scripts.build` — 시간 많이 걸리면 사용자 확인 후

결과는 `.reconcile/apply-summary.md`에 요약.

## 3. 신규 Anti-pattern 발생 탐지

apply가 오히려 새 anti-pattern을 만들었는지 확인. 전형적 사례:

- ActionButton으로 바꿀 때 variant를 임의로 정해서 `brandSolid` 중복
- Dialog에 Title을 삽입했는데 문자열이 "TODO" 같은 placeholder로 남음
- aria-label이 "label" 같은 기본값으로 들어감

탐지되면 해당 item을 `rework` 리스트에 넣고 리포트.

## 4. 영향 범위 스모크 체크

git diff 기준으로 변경된 파일 개수·라인 수를 계산. 예상치와 크게 다르면 경고:
- 변경 파일 수가 plan 예측의 2배 초과
- 변경 라인 수가 plan 예측의 3배 초과

→ apply 로직이 스코프를 넘은 가능성 — 사용자에게 제시.

## 5. 도메인 예외 일관성

plan의 `domainExceptions`에 등재된 값이 여전히 코드에 남아 있는지 확인. 사라졌으면(실수로 변환됐으면) 경고 — 사용자가 롤백 여부 결정.

## 6. 최종 리포트

`.reconcile/apply-summary.md`:

```markdown
# Reconcile Apply Summary

Plan: .reconcile/plan.json (generated 2026-04-17T12:34)
Applied: 2026-04-17T15:20
Duration: 2h 46m

## Stage 결과

| # | 이름 | items | applied | skipped | failed | gate |
|---|------|-------|---------|---------|--------|------|
| 1 | Install Seed | 3 | 3 | 0 | 0 | pass |
| 2 | Color tokens | 23 | 23 | 0 | 0 | pass |
| 3 | Spacing/radius/shadow | 12 | 11 | 1 | 0 | pass |
| ... | | | | | | |

## Skip 사유

- `spacing-0f8b-Footer`: 파일 moved — 재스캔 필요
- ...

## Verification

- Anti-pattern 재스캔: 기존 87건 → 12건 (7건 미처리는 needsDecision 반영)
- Lint: 0 error
- Typecheck: 0 error
- Tests: 142 passed, 0 failed

## 미해결 항목 (needsDecision)

- 브랜드 컬러 `#5b8def` — 도메인 브랜드로 확정할지 Seed로 교체할지 결정 필요
- ...

## 다음 단계 권장

1. 미해결 7건에 결정 내리기 → reconcile 재실행
2. 새로 추가된 component-swap 부분 시각 검증 (브라우저에서 확인)
3. 리팩터 전/후 스크린샷 비교 (있다면)
```

## 7. Git 상태 점검

- 스테이지 안 된 변경이 남아 있으면 카운트만 보고. 자동 커밋은 각 stage에서 이미 완료됐어야 함.
- 커밋 메시지 스타일 검증 (프로젝트 Husky 등이 반려하지 않도록 transforms.md 규약 준수)
- 푸시는 **하지 않음** — 사용자 판단.

## 8. 실패 처리

verification 단계에서 실패 발견 시:
- **조기 실패** (lint/type/test) → 즉시 보고, 자동 롤백은 안 함 (사용자가 결정)
- **warning 수준** (스코프 초과 등) → 요약에 `⚠️`로 표시만

verification 자체는 읽기만 — 파일 수정 금지.
