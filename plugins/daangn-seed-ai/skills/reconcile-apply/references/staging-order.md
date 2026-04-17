# Staging Order — 기본 적용 순서

plan.json에 staging이 명시되어 있으면 그것을 따른다. 명시 없거나 비어 있으면 아래 기본 순서를 사용.

## 원칙

1. **의존성 먼저** — 토큰·패키지가 없으면 그 다음 단계가 전부 망가진다
2. **리스크 낮은 것부터** — 파괴적 변경은 뒤로 밀어서 실패 복구 비용을 줄인다
3. **검증 가능한 단위로 묶기** — stage 경계에서 lint·test가 의미 있게 돌 수 있어야 한다
4. **사용자 개입은 드물게, 의미 있게** — manual-check는 꼭 필요한 지점에만

## 기본 순서

| Stage | 이름 | 포함 items | Gate |
|-------|------|-----------|------|
| 1 | Install Seed | import(dependency, token-file) | lint-pass |
| 2 | Color tokens | refactor · kind=color | lint-pass |
| 3 | Spacing / radius / shadow tokens | refactor · kind∈{spacing, radius, shadow} | lint-pass |
| 4 | Typography tokens | refactor · kind=typography (pairedChange 포함) | lint-pass |
| 5 | Accessibility fixes | refactor · subcategory=accessibility-fix | lint-pass |
| 6 | Variant fixes | refactor · subcategory=variant-fix | tests-pass |
| 7 | Native → Seed swaps | refactor · subcategory=component-swap · from=native | tests-pass + manual |
| 8 | Custom → Seed swaps | refactor · subcategory=component-swap · from=custom | tests-pass + manual |
| 9 | Drop anti-patterns | drop · subcategory∈{anti-pattern, hardcoded-value} | manual |
| 10 | Layout idiom cleanup | drop · subcategory=redundant-decoration | manual |

## Gate 상세

### `lint-pass`

프로젝트의 기존 lint 명령을 실행. 감지 우선순위:
1. `package.json`의 `scripts.lint:check` → `scripts.lint` → `scripts.typecheck`
2. `eslint .` / `tsc --noEmit` 직접 실행 (bin 존재 시)
3. 없으면 skip + "lint 도구 미감지" warning

실패 시: 해당 stage의 변경만 롤백, 사용자에게 "lint 실패로 중단 — 수동 수정 후 재시도" 알림.

### `tests-pass`

- `scripts.test:changed` → `scripts.test` → `vitest run` / `jest`
- 전체 테스트가 2분 넘게 걸리면 `test:changed` 또는 영향 파일 기반 실행을 선호
- 없으면 skip + warning

### `manual-check`

사용자에게 diff 요약(변경 파일·stage 요약)을 보여주고 "계속할까요? (y/N)" 확인. CI나 `--yes` 플래그에서는 자동 통과.

### 복합 gate

`"gate": "lint-pass + tests-pass"` 처럼 공백·`+`로 연결. 순서대로 실행, 앞이 실패하면 뒤는 안 돈다.

## 의존성 관계

다음 의존성은 항상 유지:

```
Install Seed ──► Color/Spacing/Typography tokens
                              │
                              ▼
                      Variant fixes ──► Component swaps
                                              │
                                              ▼
                                   Accessibility fixes (재검증)
                                              │
                                              ▼
                                       Drop / Cleanup
```

- 토큰 스왑 전에 패키지 설치 필수
- 컴포넌트 스왑 전에 variant 정리 선행하면 중복 작업 감소
- Drop은 거의 항상 마지막 — 지우고 나면 복구 비용 큼

## 사용자 재정의

plan.json에서 `staging`을 명시하면 위 기본값을 덮어쓴다. 덮어쓰기 패턴:

- **전체 수동 정의** — `staging` 배열 전체 제공
- **gate만 교체** — 기본 stage 구조 유지하며 gate 값만 커스터마이즈
- **stage 생략** — 특정 stage를 건너뛰려면 해당 items를 plan에서 제거하거나 `--skip-stage 9` 사용

## 중단 복구

어떤 stage에서 실패하면:
1. 해당 stage의 변경만 롤백 (`references/rollback.md`)
2. 앞서 완료된 stage는 유지
3. `apply-log.json`에 실패 지점 기록
4. 재실행하면 완료된 stage는 자동 skip, 실패 지점부터 재개

## 병렬 실행

Stage 내부 items는 충돌 없으면 병렬 처리 가능, 하지만 **기본은 순차**. 이유: diff 읽기·커밋 분리 용이. `--parallel`로 활성화하더라도 stage 간 병렬화는 금지.
