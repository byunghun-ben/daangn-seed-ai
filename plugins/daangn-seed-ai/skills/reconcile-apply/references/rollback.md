# Rollback — 되돌리기 경로

apply는 "되돌릴 수 있는" 것을 전제로 실행한다. 각 stage 완료 시점에 커밋을 남기거나, 최소한 before 스냅샷의 SHA를 apply-log에 기록.

## 기본 전략

### Stage 단위 커밋 (기본)

각 stage가 gate를 통과하면 자동 커밋. 커밋 메시지는 `transforms.md`의 포맷.

**롤백**:
- 마지막 stage만 되돌리기: `git reset --hard HEAD~1` (스킬은 이 명령을 제안만 하고, 실행은 사용자 확인 필수)
- 특정 stage로 되돌리기: apply-log의 `gitRef.before`를 찾아 `git reset --hard <sha>`
- **글로벌 규칙상 reset --hard는 파괴적** — 반드시 사용자 confirm. 대안으로 `git revert <sha>` 제안.

### Item 단위 커밋 (`--per-item-commit`)

세밀한 롤백이 필요한 경우. 커밋 수가 폭발적으로 늘어 기본값 아님.

### 커밋 없이 진행 (`--no-commit`)

사용자가 수동 커밋을 선호할 때. 이 모드에서는 롤백이 `git restore <files>`로 진행 — stage 단위로 묶어 restore.

## apply-log 기반 rollback

### `--rollback` 기본 동작

마지막 stage를 되돌린다:
1. apply-log.json에서 가장 최근 run 찾기
2. 해당 stage의 `gitRef.before` 확인
3. 사용자에게 "Stage X를 되돌립니다: A → B (변경된 파일 N개). 계속할까요?" 확인
4. `git reset --hard <before>` 또는 `git revert <after>` (사용자 선택)
5. apply-log에 rollback 기록 추가

### `--rollback --all`

모든 stage 되돌림. 최초 시작점(`runs[0].gitRef.before`)로 reset. 파괴적이므로 이중 확인.

### `--rollback --stage <N>`

특정 stage만 되돌림. 중간 stage 롤백은 뒤 stage의 변경이 앞 stage에 의존할 수 있으므로 경고 + "전체 재적용을 권장"한다는 메시지.

## 자동 롤백 트리거

apply 실행 중 다음 상황에서 자동 롤백을 **시도**한다 (사용자 확인 후):

- **Gate 실패**: 해당 stage만 자동 롤백. 이전 stage는 유지.
- **transform crash**: stage 중간에 예외 — 이미 부분 적용된 변경을 되돌리고 사용자 보고. 테스트 자동 수정 루프가 아니라 "실패를 사람에게 넘기는" 동작.
- **파일 conflict 감지**: 동일 파일에 여러 item이 겹쳐 실제 적용이 엇갈린 경우 해당 stage 롤백 권장.

## 수동 롤백 가이드 (복잡한 경우)

### 커밋 안 한 채 apply를 시작했고 실패한 경우

- `git status`에 기존 변경 + apply 변경이 섞여 있음
- 권장: `git stash` → apply 변경만 새로운 브랜치로 옮기기 → 기존 변경 복원

스킬은 이 상황에서 자동 행동을 취하지 않는다. 메시지로만 가이드.

### 서브모듈·Git LFS

롤백 대상에 서브모듈·LFS 파일이 있으면 경고. `git reset --hard`가 LFS 상태를 엉망으로 만들 수 있음.

### pre-commit hook이 커밋을 변형한 경우

- Husky + lint-staged가 자동 포맷을 추가한 경우 stage 커밋이 예상보다 많은 파일을 포함할 수 있음
- rollback은 해당 커밋 전체를 되돌리므로 포맷 롤백도 같이 일어남 — 사용자에게 명시.

## 롤백 후 상태 복원

롤백 완료 후:
- apply-log의 해당 run을 `rolledBack: true`로 마크
- plan.json은 그대로 유지 — 다시 apply 가능
- `.reconcile/apply-summary.md`는 마지막 성공 상태로 재생성하거나 "rolled back" 표시

## 실행 안 하는 것

- 원격(`git push`)을 건드리지 않는다 — 모든 롤백은 로컬만
- force-push를 제안하지 않는다 — 이미 push된 커밋은 `git revert` 권장
- 백업 tarball 같은 것을 만들지 않는다 — git이 이미 백업 역할

## 안전 규약 (글로벌 규칙과 정렬)

- **사전 질문**: `git reset --hard`는 항상 사용자 확인 후 실행
- **경계 준수**: `.reconcile/` 외부 파일은 plan item 범위만 건드림 — rollback도 그 범위만 영향
- **로그 보존**: apply-log.json은 rollback해도 삭제하지 않음. 히스토리 증거.
