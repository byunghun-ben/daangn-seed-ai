# Snackbar

**정의** — 사용자 액션의 결과를 하단에서 잠깐 보여주고 자동으로 사라지는 일시적 피드백. 다음 화면으로의 이동을 방해하지 않음.

**import**
```ts
import { Snackbar } from "@seed-design/react";
```

관련 결정 매트릭스: [`decision-matrices/which-overlay.md`](../decision-matrices/which-overlay.md)

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| "저장되었습니다", "복사됨", "삭제됨" 같은 일시적 결과 | **Snackbar** |
| 실패 + 재시도 유도 | Snackbar (`actionButton` slot) |
| 화면에 영구적으로 고정된 상태 안내 | `Callout` |
| 사용자의 명시적 확인이 필요한 경우 (OK/Cancel) | `Dialog` |
| 페이지 최상단 전역 공지 | `PageBanner` |

---

## Anatomy

| Slot | 필수 | 역할 |
|------|------|------|
| `region` | ✅ | 화면 하단의 컨테이너 영역 (안전 영역 고려) |
| `root` | ✅ | Snackbar 카드 (다크 배경, 짙은 반전) |
| `message` | ✅ | 본문 텍스트 |
| `prefixIcon` | ⚪ | 좌측 아이콘 (positive/critical 시 상태 컬러) |
| `content` | ✅ | 텍스트 영역 wrapper |
| `actionButton` | ⚪ | "실행 취소", "다시 시도" 같은 1개의 인라인 액션 |

---

## Variants

### `variant`

| 값 | 의미 | prefixIcon 컬러 |
|-----|------|-----------------|
| `default` | 일반 알림 | — |
| `positive` | 성공·완료 | `fg.positive` |
| `critical` | 실패·에러 | `fg.critical` |

**배경·텍스트는 모든 variant에서 동일** (`bg.neutral-inverted` + `fg.neutral-inverted`, 다크 배경). variant는 **아이콘 컬러만** 바꾼다.

---

## 기본 토큰

```
root
  cornerRadius : r2 (8px)
  minHeight    : 44px
  maxWidth     : 560px
  paddingX/Y   : x2_5 (10px)
  enter: opacity 0→1, scale 0.8→1, duration d3
  exit:  opacity 1→0, scale 1→0.8, duration d2

message
  font: t4 / t4 regular
  color: fg.neutral-inverted

actionButton (인라인)
  color: fg.brand  (다크 배경 위의 오렌지 강조)
  font: t4 / t4 bold
  targetMinHeight: 44px  (터치 타겟 확보)
```

---

## 합성 규칙

- **actionButton은 최대 1개** — 두 개 이상 넣으면 Dialog가 맞다.
- **메시지는 한 줄 유지** — 70자 이내가 관용. 길면 Callout으로.
- **동시에 떠 있는 Snackbar는 1개** — 여러 개 큐잉 시 앞의 것을 즉시 dismiss.
- **자동 dismiss 기본 4초** — actionButton이 있으면 6초까지 허용 (인터랙션 기회 확보).

---

## 접근성

- 메시지는 `role="status"` 또는 `role="alert"`(critical)로 SR 공지.
- 자동 dismiss는 키보드 포커스 시 일시정지.
- `actionButton`이 있으면 포커스 가능.

---

## Anti-patterns

```tsx
❌ <Snackbar>중요한 결정이 필요합니다. OK를 누르세요.</Snackbar>
   {/* 확인이 필요하면 Dialog */}

❌ <Snackbar>공지: 12월 24일 서비스 점검</Snackbar>
   {/* 영구 공지 — PageBanner 또는 Callout */}

❌ <Snackbar>
     <Snackbar.ActionButton>재시도</Snackbar.ActionButton>
     <Snackbar.ActionButton>취소</Snackbar.ActionButton>
   </Snackbar>
   {/* 액션 2개 — Dialog */}

✅ <Snackbar variant="positive">
     <Snackbar.Message>저장되었습니다</Snackbar.Message>
   </Snackbar>

✅ <Snackbar variant="critical">
     <Snackbar.Message>업로드 실패</Snackbar.Message>
     <Snackbar.ActionButton onClick={retry}>재시도</Snackbar.ActionButton>
   </Snackbar>
```
