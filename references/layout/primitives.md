# Layout Primitives

Seed는 제멋대로 `div + flex` 대신 의미가 드러나는 레이아웃 컴포넌트를 제공한다. AI-slop의 대표 증상은 "div를 flex로 만들고 gap을 임의의 값으로 박는" 것 — 이걸 피하려면 레이아웃 의도를 primitive로 드러내야 한다.

## 전체 목록

| 컴포넌트 | 의미 | 주 축 |
|----------|------|-------|
| `Box` | 의미 없는 기본 컨테이너 (div 대체) | — |
| `Flex` | flex 컨테이너 | 축 자유 |
| `Stack` | 세로 방향 스택 | 수직 |
| `Inline` | 가로 방향 흐름 (wrap 허용) | 수평 |
| `Grid` | CSS Grid 레이아웃 | 2D |
| `GridItem` | Grid 내부 아이템 | — |
| `Columns` | 균등 분할 컬럼 | 수평 |
| `Divider` | 구분선 | — |
| `Float` | absolute 위치 | — |
| `AspectRatio` | 고정 비율 박스 | — |
| `ConsistentWidth` | 자식 중 최대 너비로 모두 맞춤 | — |
| `ResponsivePair` | 모바일/데스크탑 2개 변형 선택 | — |

---

## 선택 가이드

| 의도 | 선택 |
|------|------|
| "세로로 쌓기" | **Stack** |
| "가로로 배치 (줄바꿈 허용)" | **Inline** |
| "가로로 배치 (고정)" | **Flex** (`direction="row"`) |
| "2열 이상의 복잡한 그리드" | **Grid** + **GridItem** |
| "2-3개 균등 분할" | **Columns** |
| "의미 없는 wrapper" | **Box** |
| "배경 이미지 위에 겹침" | **Float** |
| "이미지·영상의 16:9 등 비율 유지" | **AspectRatio** |

---

## Stack (수직)

```tsx
<Stack gap="x4">
  <Heading />
  <Body />
  <Footer />
</Stack>
```

**gap은 dimension 토큰만 사용**. `gap={16}` 같은 숫자 하드코딩 금지.

자주 쓰는 gap:
- `x2` (8px) — 타이트한 리스트
- `x3` (12px) — 카드 내부 요소
- `x4` (16px) — 섹션 내부 기본
- `x6` (24px) — 섹션 사이
- `x8` (32px) — 큰 단락 사이

---

## Inline (가로 wrap)

```tsx
<Inline gap="x2">
  <Chip>태그1</Chip>
  <Chip>태그2</Chip>
  <Chip>태그3</Chip>
</Inline>
```

`Inline`은 기본 `flex-wrap: wrap`. 칩/배지/태그의 나열에 최적.

---

## Flex (자유)

```tsx
<Flex direction="row" align="center" justify="space-between" gap="x3">
  <Title>제목</Title>
  <ActionButton variant="ghost">더보기</ActionButton>
</Flex>
```

Stack/Inline으로 안 되는 경우만 Flex. "align/justify"를 명시해야 하는 경우 주로 선택.

---

## Grid + GridItem

```tsx
<Grid templateColumns="repeat(2, 1fr)" gap="x3">
  <GridItem><Card /></GridItem>
  <GridItem><Card /></GridItem>
  <GridItem colSpan={2}><Banner /></GridItem>
</Grid>
```

**정말로 2D 레이아웃**이 필요한 경우만. 1차원이면 Stack/Inline/Columns로.

---

## Columns

```tsx
<Columns count={3} gap="x3">
  <Card />
  <Card />
  <Card />
</Columns>
```

균등 분할에 최적. 반응형 분기가 필요하면 Grid 또는 `ResponsivePair`.

---

## Box (의미 없는 wrapper)

```tsx
<Box padding="x4" backgroundColor="bg.neutral-weak" borderRadius="r3">
  <Content />
</Box>
```

의미가 없을 때만 Box. 의도가 있으면 Stack/Flex/Grid 중 하나.

---

## Spacing Props (style props)

Seed의 레이아웃 컴포넌트는 style prop을 받는다 — 모든 dimension은 토큰 이름으로 지정.

```tsx
<Stack
  paddingX="x4"           // x 축 패딩
  paddingY="x3"           // y 축 패딩
  marginTop="x8"          // 상단 마진
  gap="x3"                // 자식 간 gap
  backgroundColor="bg.neutral-weak"
  borderRadius="r3"
/>
```

**bleed** — 부모의 패딩을 음수 마진으로 "빠져나가기". Ghost 버튼, 풀폭 구분선 등에 사용.

```tsx
<Stack paddingX="x4">
  <Divider bleedX="x4" />   {/* 부모 패딩 무시하고 전체 너비 */}
</Stack>
```

---

## Anti-patterns

```tsx
❌ <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
     ...
   </div>
   {/* Stack 있음 */}

❌ <div className="card">
     <div className="row">
       <div className="title">...</div>
       <div className="actions">...</div>
     </div>
   </div>
   {/* 그냥 div 체인 — 의미 없는 className이 많다면 primitive로 */}

❌ <Stack gap={16}>                    {/* 숫자 하드코딩 */}
❌ <Stack gap="16px">                  {/* 문자열 하드코딩 */}
❌ <Stack marginTop="20px">            {/* 4px 그리드 밖 */}

✅ <Stack gap="x4" paddingX="x4">
     <Flex align="center" justify="space-between">
       <Title>제목</Title>
       <ActionButton variant="ghost" suffixIcon={<IconChevronRight />}>
         더보기
       </ActionButton>
     </Flex>
     <Inline gap="x2">
       <Chip>태그A</Chip>
       <Chip>태그B</Chip>
     </Inline>
   </Stack>
```
