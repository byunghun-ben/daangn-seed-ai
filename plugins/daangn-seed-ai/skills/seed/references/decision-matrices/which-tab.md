# Which Tab / Segment?

"탭"이나 "세그먼트"처럼 콘텐츠를 전환하거나 값을 분절 선택하는 UI를 구현할 때 이 트리로 먼저 결정하라.

## 결정 트리

```
무엇을 하는 UI인가?
├── 콘텐츠/영역 전환 (페이지 내에서 다른 내용을 보여줌)
│   ├── 항목이 많거나 스크롤 가능해야 함 (5개+)    → Tabs (TabList + Tab)
│   ├── 항목이 2-5개, 일반 콘텐츠 스위처           → Tabs (TabList + Tab)
│   └── 원형(pill) 스타일, 시각적으로 playful한 필터 → ChipTabs ⚠️ (not-ported, upstream 참조 필수)
│
├── 단일 값 선택 (3-4개 분절, 폼·설정형)
│   └── 2-4개 옵션, 동등한 선택지                  → SegmentedControl
│
└── 여러 필터 태그 (다중 선택 가능)
    └── 태그 스타일 on/off 토글                    → Chip / ControlChip
        (which-button.md 참조)
```

---

## 비교표

| 컴포넌트 | 상태 | 항목 수 | 주 용도 | 포팅 여부 |
|----------|------|---------|---------|-----------|
| [**Tabs** (TabList + Tab)](../components/tablist.md) | 활성 탭 인덱스 | 2-∞ (스크롤 가능) | 콘텐츠 영역 전환 | 포팅됨 |
| [**SegmentedControl**](../components/segmented-control.md) | 선택된 값 (string) | 2-4 | 폼·설정의 단일 분절 선택 | 포팅됨 |
| **ChipTabs** | 활성 탭 | 3-8 (가로 스크롤) | 카테고리 필터, 시각적 pill 탭 | ⚠️ not-ported |
| [**RadioGroup**](../components/radio-group.md) | 선택된 값 (string) | 2-∞ | 폼 내 세로 단일 선택 | 포팅됨 |
| **ActionChip / ControlChip** | boolean (토글) | 1+ | 가로 나열 다중 필터 | ⚠️ not-ported |

---

## 구성 컴포넌트

### Tabs — TabList + Tab

Seed의 탭은 두 컴포넌트로 구성된다.

- [`tablist.md`](../components/tablist.md) — TabList 컨테이너 (스크롤 컨트롤, 활성 탭 상태 관리)
- [`tab.md`](../components/tab.md) — 개별 Tab 아이템 (label, badge, disabled)

```tsx
<TabList value={activeTab} onValueChange={setActiveTab}>
  <Tab value="buy">구매</Tab>
  <Tab value="sell">판매</Tab>
  <Tab value="history">거래 내역</Tab>
</TabList>
```

### SegmentedControl — SegmentedControl + SegmentedControlItem

- [`segmented-control.md`](../components/segmented-control.md) — SegmentedControl 컨테이너
- [`segmented-control-item.md`](../components/segmented-control-item.md) — 개별 아이템

```tsx
<SegmentedControl value={size} onValueChange={setSize}>
  <SegmentedControl.Item value="S">S</SegmentedControl.Item>
  <SegmentedControl.Item value="M">M</SegmentedControl.Item>
  <SegmentedControl.Item value="L">L</SegmentedControl.Item>
</SegmentedControl>
```

---

## 흔한 실수와 교정

### 1. 3-4개 필터에 Tabs 사용

```
❌ 사이즈 S/M/L/XL 선택을 Tabs로 구현
   (Tabs는 콘텐츠 영역 전환 — 값 선택 UI가 아님)

✅ <SegmentedControl value={size} onValueChange={setSize}>
     <SegmentedControl.Item value="S">S</SegmentedControl.Item>
     ...
   </SegmentedControl>
   (3-4개 단일 값 선택 → SegmentedControl)
```

**규칙**: "이 컴포넌트를 선택하면 아래 콘텐츠 영역이 바뀌는가?" → YES: Tabs / NO: SegmentedControl 또는 RadioGroup

### 2. 단순 필터 UI에 Tabs 사용

```
❌ "최신순 / 인기순 / 거리순" 정렬을 TabList로 구현
   (선택 결과가 콘텐츠 전환이 아니라 정렬 파라미터 변경이면 Tabs가 아님)

✅ <SegmentedControl value={sort} onValueChange={setSort}>
     <SegmentedControl.Item value="recent">최신순</SegmentedControl.Item>
     <SegmentedControl.Item value="popular">인기순</SegmentedControl.Item>
     <SegmentedControl.Item value="nearby">거리순</SegmentedControl.Item>
   </SegmentedControl>
```

### 3. SegmentedControl을 가로 스크롤 탭으로 오용

```
❌ 카테고리가 7개인데 SegmentedControl 사용
   (SegmentedControl은 2-4개 고정 항목용 — 5개 이상이면 overflow 발생)

✅ <TabList value={category} onValueChange={setCategory}>
     {categories.map(c => <Tab key={c.id} value={c.id}>{c.name}</Tab>)}
   </TabList>
   (항목이 많거나 동적이면 TabList — 가로 스크롤 지원)
```

### 4. ChipTabs를 아무 탭 대신 쓴다

```
❌ 일반 콘텐츠 스위처 UI에 ChipTabs 사용
   (ChipTabs는 pill 스타일 — 브랜드 시각 언어가 뚜렷이 다름)

⚠️  ChipTabs는 현재 Seed AI 스킬에 포팅되지 않았다.
    임의로 API를 추측하여 사용하면 AI-slop 코드가 생성될 위험이 높다.
    upstream Rootage 문서를 직접 참조하고, 확신이 없으면 TabList로 대체하라.
```

---

## ChipTabs 강한 경고

> **ChipTabs는 이 스킬에 포팅되지 않았다 (not-ported).**
>
> - Rootage upstream에는 ChipTabs가 존재하지만 현재 `components/` 폴더에 문서가 없다.
> - AI가 API를 추측해 코드를 생성하면 잘못된 props·variant·이벤트 시그니처로 **AI-slop** 코드가 만들어진다.
> - 필요하다면 `packages/rootage/components/chip-tabs.yaml`(upstream clone)에서 실제 슬롯/variant 데이터를 확인한 뒤 `_template.md` 포맷으로 먼저 문서화하라.
> - 그 전까지는 **TabList + Tab**으로 대체하는 것이 안전하다.

---

## 참고 링크

- [`components/tab.md`](../components/tab.md) — Tab 개별 아이템 anatomy
- [`components/tablist.md`](../components/tablist.md) — TabList 컨테이너 anatomy
- [`components/segmented-control.md`](../components/segmented-control.md) — SegmentedControl anatomy
- [`components/segmented-control-item.md`](../components/segmented-control-item.md) — SegmentedControlItem anatomy
- [`decision-matrices/which-input.md`](./which-input.md) — 폼 입력 전반 결정 트리 (SegmentedControl 입력 맥락 포함)
- [`decision-matrices/which-button.md`](./which-button.md) — Chip / ControlChip 선택 판단
