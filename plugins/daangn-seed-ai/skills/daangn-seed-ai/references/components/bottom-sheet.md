# BottomSheet

**정의** — 화면 하단에서 올라와 컨텐츠 일부를 덮는 모달. 모바일에서 선택지/폼/상세 정보를 보여줄 때의 1차 선택. 데스크탑에서도 중앙 정렬로 동작.

**import**
```ts
import { BottomSheet } from "@seed-design/react";
```

관련 결정 매트릭스: [`decision-matrices/which-overlay.md`](../decision-matrices/which-overlay.md)

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 선택지 리스트 (3-10개) | **BottomSheet** |
| 상세 정보 패널 | **BottomSheet** |
| 짧은 폼 (1-3 필드) | **BottomSheet** |
| 긴 폼 / 전체 화면 | 별도 페이지 |
| 파괴적 확인 (삭제할까요?) | `Dialog` |
| 토스트형 피드백 | `Snackbar` |
| 선택지 단순 2-4개 | `ActionSheet` (iOS 스타일 전용) |

---

## Anatomy

| Slot | 필수 | 역할 |
|------|------|------|
| `backdrop` | ✅ | 배경 딤 (`bg.overlay`) |
| `content` | ✅ | 하단 시트 본체 (상단만 둥근 r6) |
| `header` | ⚪ | title + description |
| `title` | ⚪ | 제목 (t8 bold) |
| `description` | ⚪ | 부제 (t5 / `fg.neutral-muted`) |
| `body` | ✅ | 메인 컨텐츠 영역 |
| `footer` | ⚪ | 액션 버튼 영역 |
| `closeButton` | ⚪ | 우상단 닫기 버튼 |
| `handle` | ⚪ | 상단 드래그 핸들 (별도 `BottomSheetHandle` 컴포넌트) |

---

## Variants

### `headerAlignment`

| 값 | 의미 |
|-----|------|
| `left` | 제목 좌측 정렬 (**기본 권장**) |
| `center` | 제목 중앙 정렬 (iOS 스타일) |

### `closeButton`

| 값 | 의미 |
|-----|------|
| `true` | 우상단 닫기 X 버튼 표시 |
| `false` | 닫기 버튼 없음 (드래그·백드롭으로만 닫음) |

---

## 기본 토큰

```
backdrop: bg.overlay, enter d6, exit d4
content:
  bg.layer-floating
  maxWidth      : 640px         (데스크탑에서 이 이상으로 안 퍼짐)
  topCornerRadius: r6 (24px)    (상단만, 하단은 0)
  enter duration d6 (expressive) / exit d4
header: gap x2, paddingTop x6, paddingBottom x4
body:   paddingX global-gutter
footer: paddingX global-gutter, paddingTop x3, paddingBottom x4
title:       t8 bold / fg.neutral
description: t5 regular / fg.neutral-muted
closeButton: top x6 / right x4
```

---

## 합성 규칙

- **드래그 제스처 기본 허용** — 사용자가 아래로 스와이프하면 닫힘. 파괴적 액션에는 비활성화 고려.
- **closeButton과 드래그 중 하나는 제공** — 둘 다 없으면 탈출 불가 (접근성 위반).
- **footer는 sticky** — 바디가 길어져도 footer는 하단 고정.
- **body 내부 스크롤** — content 자체 높이는 viewport 비례 제한, 본문은 내부 스크롤.

---

## 접근성

- 포커스 트랩.
- `Escape` 키로 닫힘.
- 열리면 타이틀 또는 첫 포커스 가능 요소로 포커스 이동.
- `role="dialog"` + `aria-labelledby={title id}`.

---

## Anti-patterns

```tsx
❌ <BottomSheet>
     <BottomSheet.Title>저장되었습니다</BottomSheet.Title>
   </BottomSheet>
   {/* 피드백 — Snackbar */}

❌ <BottomSheet>
     {/* 20개 폼 필드가 있는 풀 폼 */}
   </BottomSheet>
   {/* 긴 폼 — 별도 페이지 */}

❌ <BottomSheet closeButton={false}>
     <BottomSheet.Body>...</BottomSheet.Body>
     {/* 드래그도 비활성 */}
   </BottomSheet>
   {/* 닫을 방법이 없음 */}

✅ <BottomSheet headerAlignment="left" closeButton>
     <BottomSheet.Header>
       <BottomSheet.Title>정렬 기준</BottomSheet.Title>
     </BottomSheet.Header>
     <BottomSheet.Body>
       <RadioGroup>
         <RadioGroup.Item value="recent">최신순</RadioGroup.Item>
         <RadioGroup.Item value="price">가격 낮은 순</RadioGroup.Item>
         <RadioGroup.Item value="distance">거리순</RadioGroup.Item>
       </RadioGroup>
     </BottomSheet.Body>
     <BottomSheet.Footer>
       <ActionButton variant="brandSolid" size="large" flexGrow={1}>
         적용
       </ActionButton>
     </BottomSheet.Footer>
   </BottomSheet>
```
