# Which Button?

"버튼"을 써야 하는데 Seed에는 버튼류 컴포넌트가 여러 개 있다. 이 표로 먼저 골라라.

## 결정 트리

```
사용자 액션을 유발하는가?
├── YES → 일회성 / 되돌릴 수 있는 액션
│         ├── 주요 CTA (한 화면 1개)                     → ActionButton (brandSolid / neutralSolid)
│         ├── 보조 액션                                   → ActionButton (neutralWeak / neutralOutline)
│         ├── 파괴적 액션 (삭제, 초기화)                  → ActionButton (criticalSolid)
│         ├── 폼 필드 내부 (날짜 선택, 검색, 클리어)       → FieldButton / InputButton (picker trigger)
│         ├── 화면 구석에 뜨는 플로팅 원형                 → Fab / ExtendedFab
│         ├── 스크롤 따라다니는 맥락형 버튼                → ContextualFloatingButton
│         └── 이모지·아이콘 리액션 (+1, 좋아요 등)         → ReactionButton
│
└── 선택/토글 (상태를 가짐)
    ├── on/off 2단계 토글                                → Switch
    ├── 선택 가능한 태그·필터 (다중 선택, 가로 나열)       → Chip / ControlChip
    ├── 분절된 선택 (3-4개 중 1개, 가로 세그먼트)         → SegmentedControl
    ├── 체크박스 (폼 내)                                 → Checkbox / CheckboxGroup
    ├── 라디오 (폼 내 단일 선택)                         → RadioGroup
    └── 누르고 있을 때만 강조 (토글은 아님)               → ToggleButton
```

---

## 비교표

| 컴포넌트 | 상태를 가짐? | 주 사용 맥락 | 구별 포인트 |
|----------|-------------|-------------|------------|
| **ActionButton** | ❌ | 어디든 | 1회성 액션의 기본 선택. 모르겠으면 이것. |
| **FieldButton** | ❌ | 폼 내부 | Field wrapper 안에 들어가 필드처럼 보이는 버튼 |
| **InputButton** (→ FieldButton) | ❌ | 폼 내부 picker | Rootage의 `input-button` = React의 `FieldButton`. 값은 외부 picker로 결정 → [input-button](../components/input-button.md) |
| **TextButton** (Rootage-only) | ❌ | — | ⚠️ Rootage 스펙 전용, React 미제공. 실구현은 `ActionButton variant="ghost"` 또는 Anchor로 대체 → [text-button](../components/text-button.md) |
| **Fab** | ❌ | 화면 우하단 고정 | 1개만 사용. 글로벌 주요 액션(글쓰기, 추가) |
| **ExtendedFab** | ❌ | 화면 우하단 | Fab + 텍스트 라벨 |
| **ContextualFloatingButton** | ❌ | 리스트/스크롤 | 스크롤에 따라 등장/사라지는 맥락 액션 |
| **ReactionButton** | ✅ (count) | 게시글/댓글 | 좋아요 +1 같은 카운트 포함 |
| **Chip** | ✅ (optional) | 태그·필터 | 여러 개 가로 나열. 선택 토글 가능 |
| **ControlChip** | ✅ | 필터 UI | 선택 상태가 핵심인 Chip 변종 |
| **SegmentedControl** | ✅ | 탭 대체 | 3-4개 중 1개만 선택, 시각적으로 분절 |
| **Switch** | ✅ | 설정 토글 | on/off 2단계. 즉시 적용 |
| **ToggleButton** | ✅ | 도구 UI | 볼드/이탤릭 같은 포맷 토글 → [toggle-button](../components/toggle-button.md) |
| **Checkbox** | ✅ | 폼 내 다중 선택 | 체크박스 그리드·리스트 |
| **RadioGroup** | ✅ | 폼 내 단일 선택 | 라디오 그룹 |

---

## 흔한 실수와 교정

### 1. "확인/취소"를 어떻게 놓을까?

```
❌ <ActionButton variant="brandSolid">확인</ActionButton>
   <ActionButton variant="brandSolid">취소</ActionButton>
   (두 개 다 solid — 어느 게 기본인지 모름)

✅ <ActionButton variant="neutralWeak">취소</ActionButton>
   <ActionButton variant="brandSolid">확인</ActionButton>
   (주 액션만 solid, 주 액션은 오른쪽)
```

### 2. 탭 vs SegmentedControl

```
탭: 페이지 내에서 영역 전환, 5개 이상도 허용           → Tabs
SegmentedControl: 2-4개의 설정 전환, 폼 스타일        → SegmentedControl
```

### 3. 플로팅 버튼

```
화면 어디서나 접근 가능한 전역 액션?                 → Fab
특정 리스트 맥락의 액션 (스크롤 시 등장)?             → ContextualFloatingButton
이벤트성 확장된 라벨 표시가 필요한 주요 액션?          → ExtendedFab
```

### 4. Chip의 용도 혼동

```
❌ 인라인 CTA로 Chip 사용
   ("저장하기"를 Chip으로 구현 → 선택 상태가 없으므로 잘못)

✅ Chip은 "선택 가능한 태그·필터" 또는 "태그 표시" 용도
   (ActionChip — 선택 가능한 액션, ControlChip — 필터)
```

### 5. Switch vs Checkbox

```
즉시 적용되는 on/off (저장 없이 토글)               → Switch
폼의 일부, "저장" 눌러야 반영                       → Checkbox
```

---

## variant 선택 (ActionButton 내부)

| 화면 상황 | 추천 variant |
|-----------|-------------|
| "다음으로" 같은 진행형 풀폭 CTA | `brandSolid`, `size=large`, `flexGrow=1` |
| 일반적 주 액션 | `neutralSolid` |
| 2차적 액션 (같은 줄) | `neutralWeak` |
| 삭제/차단 | `criticalSolid` |
| 아웃라인 2개 조합 | `brandOutline` + `neutralOutline` |
| 인라인 링크형 | `ghost` + `color="fg.brand"` |
