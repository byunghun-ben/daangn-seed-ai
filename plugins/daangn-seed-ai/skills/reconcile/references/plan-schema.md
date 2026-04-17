# plan.json Schema

`reconcile-apply`가 기계적으로 읽는 유일한 입력. 스키마가 안정적이어야 둘을 분리 개발·테스트 가능.

## 버전 관리

- `version: 1` — 현재 스키마 버전. apply 측도 1을 받으면 동작.
- 후방 호환 깨지면 메이저 증가.

## 최상위 구조

```json
{
  "version": 1,
  "generatedAt": "2026-04-17T12:34:56.000Z",
  "generatedBy": "daangn-seed-ai/reconcile@0.1.0",
  "cwd": "/Users/.../my-app",
  "detected": { /* detected.json 인라인 복제 */ },
  "domainExceptions": [ /* 사용자 확정한 예외 목록 */ ],
  "summary": {
    "keep": 142,
    "refactor": 58,
    "drop": 12,
    "import": 3,
    "needsDecision": 7
  },
  "items": [ /* 개별 작업 item */ ],
  "staging": [ /* 적용 순서 그룹 */ ],
  "warnings": [ /* scan·diff 한계 */ ]
}
```

모노레포면 루트에 패키지별 split:

```json
{
  "version": 1,
  "generatedAt": "...",
  "packages": [
    { "name": "apps/web", "path": "apps/web", "plan": { /* 위 구조의 items/staging/summary */ } },
    { "name": "apps/admin", "path": "apps/admin", "plan": { /* ... */ } }
  ]
}
```

## item 스키마

```json
{
  "id": "unique-stable-id",
  "category": "keep" | "refactor" | "drop" | "import",
  "subcategory": "token-replace" | "component-swap" | "variant-fix" | "...",
  "kind": "color" | "spacing" | "typography" | "radius" | "shadow" | "component" | "layout" | "dependency",
  "current": "현재 값 또는 코드 발췌",
  "target": "치환 목표 (refactor/import만)",
  "rationale": "왜 이 분류인가 — 한 줄",
  "antiPatternId": 4,
  "occurrences": [
    { "file": "src/components/Header.tsx", "line": 42, "column": 15, "snippet": "background: '#ff6f0f'" }
  ],
  "moreOccurrences": 44,
  "confidence": 0.95,
  "needsDecision": false,
  "risk": "low",
  "impact": "feature-wide",
  "pairedChange": {
    "kind": "typography",
    "field": "line-height",
    "target": "var(--seed-line-height-t4)"
  },
  "alternatives": [
    { "target": "var(--seed-color-bg-brand-weak)", "when": "강조가 약해도 되는 문맥" }
  ],
  "domainException": null
}
```

### 필수 vs 선택

**필수**: `id`, `category`, `kind`, `rationale`, `confidence`, `risk`, `impact`

**조건부 필수**:
- `refactor`, `import` → `target` 필수
- `drop` → `reason` 필수 (`rationale`과 별개로 "왜 제거 가능한가")
- `keep` + `domainException` 있는 경우 → `domainException` 필수

**선택**: `subcategory`, `antiPatternId`, `pairedChange`, `alternatives`, `moreOccurrences`

### `id` 규칙

- 재실행해도 같은 관찰치에 같은 id가 나오도록 **결정론적**으로 생성
- 포맷: `{kind}-{hash8}-{hint}` (예: `color-a1b2c3d4-header-bg`)
- hash는 `kind + current + occurrences[0].file + occurrences[0].line`의 SHA1 앞 8자

### `confidence` 해석

| 범위 | 의미 | apply 기본 동작 |
|------|------|-----------------|
| ≥ 0.9 | 안전 치환 | 자동 적용 |
| 0.7~0.9 | 검토 후 적용 | 사용자 확인 요구(설정에 따라) |
| 0.5~0.7 | 결정 필요 | 기본 skip, `--force`로만 적용 |
| < 0.5 | apply 불가 | skip + warning |

### `risk` 해석

| 값 | staging 그룹 |
|----|--------------|
| `low` | 초기 단계 (토큰 치환·aria 추가) |
| `medium` | 중간 단계 (컴포넌트 스왑·레이아웃 교체) |
| `high` | 마지막 (구조 변경·의존성 추가) |

## staging 스키마

apply가 따를 실행 순서. items의 id를 그룹핑.

```json
{
  "staging": [
    {
      "order": 1,
      "name": "Install Seed dependencies",
      "description": "필요한 @seed-design/* 패키지 설치 + base.css import",
      "itemIds": ["import-dep-react-load", "import-css-base-reset"],
      "gate": "tests-pass | lint-pass | manual-check | none",
      "rollback": "npm uninstall + CSS import 롤백"
    },
    {
      "order": 2,
      "name": "Token replacements (low-risk)",
      "description": "하드코딩 값 → Seed 토큰",
      "itemIds": ["color-...", "spacing-..."],
      "gate": "lint-pass",
      "rollback": "per-item diff 역적용"
    },
    {
      "order": 3,
      "name": "Component swaps",
      "description": "네이티브 → Seed 컴포넌트",
      "itemIds": ["component-..."],
      "gate": "tests-pass + manual-check",
      "rollback": "git restore per file"
    }
  ]
}
```

### `gate` 값

- `none` — 다음 단계로 바로 진행
- `lint-pass` — 프로젝트 lint 통과 확인 후 진행
- `tests-pass` — 기존 테스트 통과 확인
- `manual-check` — 사용자에게 "다음 단계 진행할까요?" 확정 요청
- 복수 지정 가능: `"gate": "lint-pass + tests-pass"`

## warnings 스키마

스캔·diff 한계를 투명하게 기록.

```json
{
  "warnings": [
    { "scope": "scan", "message": "Vue SFC의 <style scoped> 내부 일부 값 추출 실패 (12개)", "files": ["src/Foo.vue"] },
    { "scope": "diff", "message": "커스텀 Button 컴포넌트의 props signature 자동 매핑 불가 — ActionButton 치환 시 수동 검토 필요" }
  ]
}
```

## domainExceptions 스키마

사용자 확인으로 확정된 예외. 다시 reconcile 돌려도 자동으로 Keep 유지.

```json
{
  "domainExceptions": [
    {
      "match": { "kind": "color", "current": "#5b8def" },
      "reason": "도메인 브랜드 색 (당근 오렌지 아님)",
      "confirmedAt": "2026-04-17T...",
      "scope": "app-wide"
    }
  ]
}
```

`match`는 "다음 실행 시 이 조건의 관찰치는 자동으로 Keep" 이라는 의미. apply는 이 목록을 수정하지 않는다.

## 참고 — 두 스킬 간 계약

- **reconcile**: plan.json을 **생성·재생성**한다. 기존 파일이 있으면 `domainExceptions`는 보존하고 나머지 섹션만 재구성.
- **reconcile-apply**: plan.json을 **읽기만** 한다. 진행 기록은 `.reconcile/apply-log.json`에 별도로 남긴다.

이 경계가 깨지면 (apply가 plan을 수정하면) 재실행 시 상태가 꼬인다.
