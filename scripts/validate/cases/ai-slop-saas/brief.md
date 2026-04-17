# Case: ai-slop-saas

## 의도

reconcile 스킬이 해결하려는 문제의 **원형**. Claude에게 아무런 디자인 시스템 정보 없이 "AI PM 보조 SaaS 랜딩 만들어줘"라고 했을 때 전형적으로 나오는 generic AI-slop 화면.

## 포함된 안티패턴 (의도적)

`plugins/daangn-seed-ai/skills/seed/references/anti-patterns.md`와 매핑:

| # | 패턴 | 위치 |
|---|------|------|
| 1 | 하드코딩 HEX (보라-핑크 그라디언트) | hero, CTA |
| 1 | off-grid 간격 (15px, 17px, 23px) | 여러 섹션 |
| 1 | 과도한 radius (20px+, 28px) | 카드, 버튼 |
| 2 | 네이티브 `<button>` 직접 사용 | 모든 CTA |
| 2 | `<div role="button">` | 네비 아이콘 |
| 2 | 네이티브 `<input>` 래퍼 없음 + placeholder-only | 뉴스레터 폼 |
| 3 | primitive flex/grid (레이아웃 컴포넌트 없음) | 전체 |
| 4 | solid 버튼 나란히 2개 | hero CTA 쌍 |
| 7 | font-size 14px + line-height 1.5 (페어링) | 전체 본문 |
| 13 | 중앙정렬 flex 연쇄 | hero, CTA, footer |
| 13 | 파스텔 그라디언트 남발 | hero, features |
| 13 | 버튼 그림자 | 모든 CTA |
| 13 | 이모지 장식 (✨ 🚀 💡) | features |

## 기대하는 reconcile 결과 (대략)

- **Refactor** 다수 — 색·간격·라디우스 하드코딩 → Seed 토큰
- **Drop** 중다 — 버튼 그림자, 과도 그라디언트, 중앙정렬 연쇄
- **Import** 소수 — ActionButton/TextField 도입 (현재는 네이티브)
- **needsDecision** 일부 — 브랜드 컬러를 당근 오렌지로 통합할지, 보라 유지할지

## 화면 구성

단일 HTML 파일 (`source/index.html`), 외부 CDN/asset 의존 없음. `<style>`에 전부 인라인.

- Header: 로고 "Nimbus AI" + nav 링크 + 로그인/Start free CTA
- Hero: 헤드라인 + 서브헤드 + CTA 2개 (Start free, Watch demo) + 그라디언트 배경
- Features 그리드 3열: 이모지 + 제목 + 설명
- CTA 섹션: 뉴스레터 가입 (이메일 input + 버튼)
- Footer: 링크 + 카피라이트

모바일 퍼스트가 아닌 데스크탑 기준 (AI-slop은 모바일 분기 없이 flex 가운데정렬이 흔함).
