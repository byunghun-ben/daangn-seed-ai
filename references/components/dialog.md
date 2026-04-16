# Dialog

**정의** — 사용자의 명시적 확인·선택이 필요한 순간 흐름을 중단시키고 띄우는 중앙 모달. 백드롭이 뒤 배경을 어둡게 덮음.

**import**
```ts
import { Dialog } from "@seed-design/react";
```

관련 결정 매트릭스: [`decision-matrices/which-overlay.md`](../decision-matrices/which-overlay.md)

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 파괴적 액션 확인 ("정말 삭제할까요?") | **Dialog** |
| 중요한 선택 요구 (이용약관 동의 등) | **Dialog** |
| 선택지를 아래에서 제공 (2-5개 옵션) | `BottomSheet` (모바일) / `Dialog`도 가능 |
| 결과 피드백 (저장됨, 복사됨) | `Snackbar` |
| 비차단적 안내 | `Callout`, `PageBanner` |
| 폼 입력 전체 화면 | 별도 페이지 (Dialog는 짧은 질문·선택용) |

---

## Anatomy

| Slot | 필수 | 역할 |
|------|------|------|
| `backdrop` | ✅ | 배경 딤 (`bg.overlay`) |
| `content` | ✅ | 카드 본체 (`bg.layer-floating`, r5, 최대폭 272px) |
| `header` | ⚪ | title + description 영역 |
| `title` | ⚪ | 제목 (t7 bold) |
| `description` | ⚪ | 본문 설명 (t5 regular) |
| `footer` | ⚪ | 액션 버튼 영역 |

---

## 기본 토큰

```
backdrop: bg.overlay,  enter/exit duration d2
content:
  bg.layer-floating
  cornerRadius : r5 (20px)
  marginX      : x8 (32px)    → 화면 가장자리 여백
  marginY      : x16 (64px)
  maxWidth     : 272px         → 좁다! (모바일 기준)
  enter: opacity 0→1, scale 1.3→1, duration d4 (expressive)
  exit:  opacity 1→0, duration d2
header:
  gap x1_5, paddingX x5, paddingTop x5
footer:
  gap x2, paddingX x5, paddingTop x4, paddingBottom x5
title:        t7 / bold / fg.neutral
description:  t5 / regular / fg.neutral
```

---

## 합성 규칙 — 액션 버튼

footer에는 1-2개의 ActionButton을 배치한다.

| 시나리오 | footer 구성 |
|----------|-------------|
| 파괴적 확인 | `취소(neutralWeak)` + `삭제(criticalSolid)` |
| 중립 확인 | `취소(neutralWeak)` + `확인(brandSolid)` |
| 단일 안내 | `확인(brandSolid)` 하나 |

**주 액션은 오른쪽**. iOS·안드로이드 모두 오른쪽이 긍정·주 액션 관용.

---

## 접근성

- 포커스 트랩 — 열려있는 동안 탭이 Dialog 밖으로 나가지 않음.
- `Escape` 키로 닫힘 (파괴적 액션은 백드롭 클릭 dismiss 비권장).
- 열리면 `Dialog.Title`에 포커스 → SR이 제목부터 읽음.
- `role="alertdialog"` (파괴적/중요) vs `role="dialog"` (일반).

---

## Anti-patterns

```tsx
❌ <Dialog>
     <Dialog.Title>저장되었습니다</Dialog.Title>
     <Dialog.Footer><ActionButton>확인</ActionButton></Dialog.Footer>
   </Dialog>
   {/* 사용자 피드백 — Snackbar로 충분 */}

❌ <Dialog>
     {/* 전체 회원가입 폼 */}
   </Dialog>
   {/* 폼은 별도 페이지 또는 BottomSheet */}

❌ {/* 파괴적 액션에서 */}
   <Dialog.Footer>
     <ActionButton variant="brandSolid">삭제</ActionButton>
     <ActionButton variant="neutralWeak">취소</ActionButton>
   </Dialog.Footer>
   {/* 좌우 순서 뒤집힘, 파괴적 액션에 brandSolid 사용 */}

❌ <Dialog>
     <Dialog.Title>계정 삭제</Dialog.Title>
     <Dialog.Description>정말로 영구적으로 모든 데이터를 되돌릴 수 없이 삭제하시겠습니까? 이 작업은 복구할 수 없으며...</Dialog.Description>
   </Dialog>
   {/* 본문 너무 김 — Dialog는 짧게, 긴 설명은 별도 페이지 */}

✅ <Dialog role="alertdialog">
     <Dialog.Title>게시글을 삭제할까요?</Dialog.Title>
     <Dialog.Description>삭제한 게시글은 복구할 수 없어요.</Dialog.Description>
     <Dialog.Footer>
       <ActionButton variant="neutralWeak" onClick={cancel}>취소</ActionButton>
       <ActionButton variant="criticalSolid" onClick={confirm}>삭제</ActionButton>
     </Dialog.Footer>
   </Dialog>
```
