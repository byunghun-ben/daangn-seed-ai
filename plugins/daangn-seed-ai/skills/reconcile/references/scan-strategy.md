# Scan Strategy — cwd 감지 로직

스킬은 `pwd`만 받고 나머지는 추론한다. 추론 실패 시 즉시 사용자에게 질문 — 추측 금지.

## 1. 프로젝트 감지

다음 파일을 순서대로 확인해서 프로젝트 성격을 분류한다.

| 파일 | 의미 |
|------|------|
| `package.json` | Node 생태계 (대부분의 웹앱) |
| `pnpm-workspace.yaml` · `turbo.json` · `nx.json` · `lerna.json` | 모노레포 — 루트가 아니라 개별 패키지를 각각 reconcile 대상으로 봐야 함 |
| `Cargo.toml` · `go.mod` · `pubspec.yaml` | 웹 프론트엔드가 아님 — 중단하고 사용자 확인 |
| (아무것도 없음) | 개별 파일 뭉치 — 사용자에게 대상 범위 확인 |

### 프레임워크 서브-감지

`package.json`의 `dependencies` + `devDependencies`를 합쳐서 확인.

| 키 | framework 값 |
|----|--------------|
| `next` | `next` |
| `@remix-run/*` | `remix` |
| `react` (단독) + `vite` | `vite-react` |
| `react-native` · `expo` | `react-native` |
| `vue` | `vue` |
| `svelte` · `@sveltejs/kit` | `svelte` |
| `solid-js` | `solid` |
| 위 어느 것도 아님 | `unknown` → 사용자 확인 |

모노레포에서는 각 패키지별로 이 감지를 반복.

## 2. 스타일 시스템 감지

복수 시스템 혼용이 흔하다. 발견된 것을 모두 배열로 기록 (`primary`는 가장 많이 쓰인 것).

| 증거 | 스타일 시스템 |
|------|---------------|
| `tailwind.config.{js,ts,cjs,mjs}` + `@tailwind` directive in CSS | `tailwind` |
| `*.module.css` · `*.module.scss` 파일 존재 | `css-modules` |
| `import styled from 'styled-components'` · `'@emotion/styled'` | `styled-components` 또는 `emotion` |
| `*.css.ts` + `@vanilla-extract/*` | `vanilla-extract` |
| 루트 CSS 파일에 커스텀 properties만 | `plain-css` |
| `stitches.config.*` · `panda.config.*` · `unocss.config.*` | 각각 `stitches` · `panda` · `unocss` |

**혼용 판정**:
- 2개 이상 발견 → `primary`는 사용 빈도 1위, `mixed: true` 플래그 기록
- 3개 이상 → 중단하고 사용자 확인 ("이 프로젝트는 스타일 시스템이 3개 이상 혼용됩니다. Seed를 어디에 매핑할지 정해 주세요.")

## 3. Seed 도입 상태 감지

```
- @seed-design/react-*          → seed 사용 중 (공식)
- @karrotmarket/react-*         → 당근 내부 라이브러리 사용 중
- seed-design.io imports        → WebFetch 런타임 의존 (구버전)
- 아무것도 없음                  → 미도입
```

결과값: `none` | `partial` | `full`.

- `partial`: Seed 의존성은 있으나 실제 컴포넌트 사용이 전체의 30% 미만
- `full`: Seed 컴포넌트가 주도적. 이 경우 reconcile의 주된 역할은 "검증·anti-pattern 청소"

판정 근거가 애매하면(예: 의존성은 있는데 실제 임포트는 적음) 사용자에게 보여주고 확정.

## 4. 스캔 타겟 결정

아래 순서로 존재 여부 확인, 첫 번째 존재하는 것 사용.

1. `src/`
2. `app/` (Next.js App Router 등)
3. `components/` + `pages/` 페어
4. 루트 — 다만 `.reconcile/`, `node_modules/`, `dist/`, `build/`, `.next/`, `.turbo/`, `coverage/`, `.git/`, `public/`, `static/`, `assets/` 제외

모노레포면 각 패키지의 동일 규칙 적용, 루트는 스캔하지 않음.

## 5. 파일 확장자 매트릭스

프레임워크별 스캔 대상 확장자:

| framework | 소스 | 스타일 |
|-----------|------|--------|
| next · vite-react · remix | `.tsx`, `.ts`, `.jsx`, `.js` | `.css`, `.scss`, `.module.css`, `.css.ts` |
| vue | `.vue`, `.ts`, `.js` | `.vue`(`<style>`), `.css`, `.scss` |
| svelte | `.svelte`, `.ts`, `.js` | `.svelte`(`<style>`), `.css` |
| react-native | `.tsx`, `.ts`, `.jsx`, `.js` | 인라인 `StyleSheet.create` 객체 |
| unknown | 사용자 확인 후 결정 | — |

## 6. 감지 결과 기록

결과는 `.reconcile/detected.json` 하나로 합쳐서 저장. 스키마:

```json
{
  "cwd": "/abs/path",
  "project": {
    "kind": "single" | "monorepo",
    "packages": [
      {
        "name": "apps/web",
        "path": "apps/web",
        "framework": "next",
        "styleSystems": { "primary": "tailwind", "all": ["tailwind", "css-modules"], "mixed": true },
        "seedAdoption": "partial",
        "scanTargets": ["src", "app"],
        "extensions": {
          "source": [".tsx", ".ts"],
          "style": [".css", ".module.css"]
        }
      }
    ]
  },
  "warnings": [
    "tailwind.config.ts와 styled-components가 동시에 발견됨 — primary를 tailwind로 추정"
  ]
}
```

## 7. 중단 조건 (fail-fast)

다음 상황에서 스캔을 중단하고 사용자에게 명확히 알린다.

- 웹 프론트엔드 아님 (`Cargo.toml` 등)
- 프레임워크 `unknown`
- 스타일 시스템 3개 이상 혼용
- 스캔 타겟 디렉토리 존재 안 함 + 루트에 소스 파일 0개
- cwd가 `node_modules/` 내부
- cwd에 `.git`이 없고 `package.json`도 없음 — 잘못된 디렉토리 가능성
