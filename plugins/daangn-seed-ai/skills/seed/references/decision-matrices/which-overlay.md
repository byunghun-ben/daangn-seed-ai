# Which Overlay?

"팝업"을 띄워야 하는데 Seed에는 오버레이 계열이 여러 개 있다. 이 표로 먼저 골라라.

## 결정 트리

```
사용자가 명시적으로 닫거나 선택해야 하나?
├── YES (차단)
│   ├── 짧은 확인·선택 (OK/Cancel, 삭제할까요?)      → Dialog
│   ├── 하단에서 올라오는 리스트/폼 (3-10 옵션)        → BottomSheet
│   ├── iOS 스타일 간단 선택 (2-5 옵션)               → ActionSheet
│   ├── 세로로 긴 세부 메뉴                           → ExtendedActionSheet
│   └── 특정 요소 주변의 힌트/가이드                  → HelpBubble
│
└── NO (비차단)
    ├── 하단에서 잠깐 뜨고 사라지는 피드백           → Snackbar
    ├── 페이지 상단의 영구 고지                       → PageBanner
    ├── 섹션 내부 고정 알림                           → Callout
    ├── 섹션 내부·리스트 근처의 정적 안내             → Callout (InlineBanner는 deprecated — PageBanner 는 페이지 최상단 고정이라 여기 오지 않음)
    └── 아이콘·버튼의 숫자 뱃지                       → NotificationBadge / Badge
```

---

## 비교표

| 컴포넌트 | 차단? | 위치 | 자동 dismiss? | 액션 수 |
|----------|------|------|---------------|---------|
| **Dialog** | ✅ | 중앙 | ❌ | 1-2개 |
| **BottomSheet** | ✅ | 하단 (모바일) / 중앙 (데스크탑) | ❌ | 유연 (여러 개 허용) |
| **ActionSheet** | ✅ | 하단 | ❌ | 2-5개 옵션 + 취소 |
| **ExtendedActionSheet** | ✅ | 하단, 키 큼 | ❌ | 세로 메뉴 |
| **MenuSheet** | ✅ | 하단 | ❌ | 메뉴 항목 |
| **HelpBubble** | ✅ (일시) | 요소 주변 | 보통 ✅ | 0-1개 |
| **Snackbar** | ❌ | 하단 | ✅ (4-6초) | 0-1개 (최대) |
| **PageBanner** | ❌ | 페이지 상단 | ❌ | 1개 (X 버튼) |
| **Callout** | ❌ | 섹션 내부 | ❌ | 0-1개 인라인 |
| **InlineBanner** ⚠️ deprecated | ❌ | 리스트 내부 | ❌ | 0-1개 |

---

## 흔한 실수와 교정

### 1. "저장되었습니다"에 Dialog를 쓴다

```
❌ <Dialog>
     <Dialog.Title>저장되었습니다</Dialog.Title>
     <Dialog.Footer><ActionButton>확인</ActionButton></Dialog.Footer>
   </Dialog>
   (사용자 흐름을 불필요하게 차단 — 그냥 Snackbar)

✅ <Snackbar variant="positive">
     <Snackbar.Message>저장되었습니다</Snackbar.Message>
   </Snackbar>
```

### 2. 선택지 3개에 Dialog를 쓴다

```
❌ <Dialog>
     <Dialog.Title>정렬</Dialog.Title>
     <RadioGroup>... 3개 옵션</RadioGroup>
   </Dialog>
   (Dialog는 짧은 확인용 — 선택지는 BottomSheet가 편함)

✅ <BottomSheet headerAlignment="left">
     <BottomSheet.Title>정렬 기준</BottomSheet.Title>
     <RadioGroup>... 3개 옵션</RadioGroup>
   </BottomSheet>
```

### 3. 영구 공지를 Snackbar에 넣는다

```
❌ <Snackbar>12월 24일 서비스 점검</Snackbar>
   (4초 후 사라짐 — 중요 공지는 유지 필요)

✅ <PageBanner tone="informative">
     12월 24일 00:00 ~ 06:00 서비스 점검
   </PageBanner>
```

### 4. 폼 에러에 Dialog를 쓴다

```
❌ <Dialog>
     <Dialog.Description>이메일 형식이 아닙니다</Dialog.Description>
   </Dialog>

✅ <TextField
     label="이메일"
     invalid={!valid}
     errorMessage="이메일 형식이 아닙니다"
   />
```

### 5. 긴 폼을 BottomSheet에 넣는다

```
❌ BottomSheet 안에 20개 필드
   (BottomSheet는 짧은 폼·리스트용)

✅ 별도 페이지로 분리 + 상단에 뒤로가기
```

### 6. Dialog 2-3개를 연속으로 띄운다

```
❌ Dialog A 확인 → Dialog B 뜸 → Dialog C 뜸
   (스택형 차단 — 사용자 피로 증가)

✅ 하나의 흐름으로 통합. 여러 단계가 필요하면 별도 페이지(멀티스텝)
```

---

## 모바일 vs 데스크탑

| 컴포넌트 | 모바일 | 데스크탑 |
|----------|--------|----------|
| **Dialog** | 중앙 모달 | 중앙 모달 |
| **BottomSheet** | 하단 시트 | 중앙 모달로 변형 (maxWidth 640px) |
| **ActionSheet** | 하단 시트 | 드롭다운 또는 BottomSheet 대체 |

Seed는 기본적으로 반응형으로 동작. 데스크탑에서 "하단 시트를 그대로 띄우지" 않는다.

---

## 접근성 공통 규칙

| 컴포넌트 | role | focus trap | escape |
|----------|------|-----------|--------|
| Dialog | `dialog` / `alertdialog` | ✅ | ✅ |
| BottomSheet | `dialog` | ✅ | ✅ |
| ActionSheet | `dialog` | ✅ | ✅ |
| Snackbar | `status` / `alert` | ❌ (비차단) | — |
| PageBanner | `status` | ❌ | — |
| Callout | `status` (tone=critical은 `alert`) | ❌ | — |
