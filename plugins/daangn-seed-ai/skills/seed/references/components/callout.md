# Callout

**정의** — 화면 중간에 삽입되어 상태·안내·경고를 전달하는 정적 알림 카드. 스크롤되는 콘텐츠의 일부로 존재하며, 토스트처럼 사라지지 않는다.

**import**
```ts
import { Callout } from "@seed-design/react";
```

관련 결정 매트릭스: [`decision-matrices/which-overlay.md`](../decision-matrices/which-overlay.md)

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 화면 상단/중간에 고정된 안내 (예: "배송지가 설정되지 않았습니다") | **Callout** |
| 일시적 액션 결과 피드백 (저장됨, 복사됨) | `Snackbar` |
| 페이지 최상단 전역 배너 | `PageBanner` (Callout은 섹션 내부) |
| 폼 필드 아래 에러/도움말 | Field의 `description` / `errorMessage` |

---

## Anatomy

| Slot | 필수 | 역할 |
|------|------|------|
| `root` | ✅ | 배경·패딩·보더 반경 (12px `paddingX/Y`) |
| `prefixIcon` | ⚪ | 좌측 아이콘 (**Fill 타입 권장**). [`icon.md`](./icon.md) 참조. |
| `title` | ⚪ | 제목 (bold) |
| `description` | ⚪ | 설명 (regular) |
| `link` | ⚪ | 인라인 링크 텍스트 (Actionable Callout에선 비권장) |
| `suffixIcon` | ⚪ | 우측 아이콘 (닫기·화살표). [`icon.md`](./icon.md) 참조. |

---

## Variants

### `tone`

| 값 | 의미 | 배경 토큰 | 대표 사용 |
|-----|------|-----------|-----------|
| `neutral` | 일반 정보 | `bg.neutral-weak` | 설명, 팁 |
| `informative` | 유용한 정보 | `bg.informative-weak` | 업데이트 안내 |
| `positive` | 긍정 상태 | `bg.positive-weak` | 완료, 승인 알림 |
| `warning` | 주의 | `bg.warning-weak` | 제한 시간 안내, 확인 요청 |
| `critical` | 중요 문제 | `bg.critical-weak` | 에러, 차단 상태 |
| `magic` | AI/특수 | `gradient.glow-magic` | AI 기능 소개 |

---

## 기본 토큰 (base)

```
paddingX/Y     : x3_5 (14px)
gap            : x3 (12px)
cornerRadius   : r2_5 (10px)
minHeight      : 50px
prefixIcon size: x4 (16px)
title/description/link font: t4 / t4 / weight={bold|regular|regular}
```

---

## 합성 규칙

- **Actionable Callout** (root에 onClick이 있는 경우) — `link` slot은 비권장. 전체가 클릭 영역이므로 `suffixIcon`에 chevron을 두는 게 관용.
- **non-actionable Callout** — `link`로 인라인 CTA를 제공.
- **`tone=magic`은 AI/프로모션 전용** — 일반 긍정 상태는 `positive` 사용.
- **페이지당 Callout은 1~2개** — 여러 개 쌓이면 신호 과잉.

---

## Anti-patterns

```tsx
❌ <Callout tone="positive">
     저장되었습니다
   </Callout>
   {/* 일시적 피드백 — Snackbar가 맞다 */}

❌ <div style={{background: '#fff4e6', padding: 14}}>...</div>
   {/* Callout 대신 자체 구현 — 토큰·테마 대응 불가 */}

❌ <Callout tone="critical">
     잘못된 입력입니다
   </Callout>
   {/* 폼 에러 — Field의 errorMessage 사용 */}

✅ <Callout tone="warning" prefixIcon={<IconWarningFill />}>
     <Callout.Title>배송 지연 안내</Callout.Title>
     <Callout.Description>현재 지역 폭설로 1-2일 지연될 수 있습니다.</Callout.Description>
   </Callout>

✅ <Callout tone="informative" onClick={openDetails} suffixIcon={<IconChevronRight />}>
     <Callout.Title>프로필을 완성해보세요</Callout.Title>
   </Callout>
```
