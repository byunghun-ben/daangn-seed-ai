# Composition — 컴포넌트 조합 규칙

개별 컴포넌트는 정확해도 조합 단계에서 무너지는 경우가 많다. 이 문서는 "여러 컴포넌트를 같이 쓸 때의 규칙"을 정리한다.

## 페이지 골격 (표준 패턴)

```tsx
<Stack gap="x6">                                {/* 섹션 사이 24px */}
  <PageBanner tone="informative">...</PageBanner>  {/* 선택: 페이지 상단 공지 */}

  <Stack gap="x2">                              {/* 헤더 내부는 타이트 */}
    <Text.Title1>페이지 제목</Text.Title1>
    <Text.Body color="fg.neutral-muted">설명</Text.Body>
  </Stack>

  <Stack gap="x4">                              {/* 콘텐츠 섹션 */}
    <Stack gap="x3">
      {/* 필드나 카드 */}
    </Stack>
    <Callout tone="neutral">...</Callout>       {/* 섹션 내부 알림 */}
  </Stack>

  <Flex gap="x2">                               {/* 하단 액션 바 */}
    <ActionButton variant="neutralWeak">취소</ActionButton>
    <ActionButton variant="brandSolid" flexGrow={1}>저장</ActionButton>
  </Flex>
</Stack>
```

---

## 폼 구성

```tsx
<Stack gap="x4">                                {/* 필드 간 16px */}
  <TextField label="닉네임" required />
  <TextField label="이메일" required />
  <RadioGroupField label="지역">...</RadioGroupField>
  <Checkbox>이용약관 동의</Checkbox>
</Stack>
```

**필드 간 간격은 x3(12px) ~ x4(16px)**. 섹션이 나뉘면 x6(24px)로 벌림.

---

## 리스트 구성

```tsx
<Stack gap="x0">                                {/* 구분선 자동 */}
  <List.Header>목록 제목</List.Header>
  <List.Item>...</List.Item>
  <List.Item>...</List.Item>
  <List.Item>...</List.Item>
</Stack>
```

또는 카드형:
```tsx
<Stack gap="x3">                                {/* 카드 사이 12px */}
  <Card />
  <Card />
</Stack>
```

---

## 액션 바 (footer) 패턴

### 1개 CTA (가장 흔함)

```tsx
<ActionButton variant="brandSolid" size="large" flexGrow={1}>
  다음으로
</ActionButton>
```

### 2개 (취소 + 확인)

```tsx
<Flex gap="x2">
  <ActionButton variant="neutralWeak" onClick={cancel}>
    취소
  </ActionButton>
  <ActionButton variant="brandSolid" flexGrow={1} onClick={confirm}>
    확인
  </ActionButton>
</Flex>
```

**주 액션이 오른쪽**. flexGrow=1로 확장.

### 파괴적 + 취소

```tsx
<Flex gap="x2">
  <ActionButton variant="neutralWeak">취소</ActionButton>
  <ActionButton variant="criticalSolid" flexGrow={1}>삭제</ActionButton>
</Flex>
```

---

## 헤더 패턴

```tsx
<Flex align="center" justify="space-between" paddingX="x4" paddingY="x3">
  <Text.Title2>제목</Text.Title2>
  <ActionButton variant="ghost" layout="iconOnly" aria-label="설정">
    <IconSettings />
  </ActionButton>
</Flex>
```

---

## 조합 금지 리스트

| 금지 | 이유 | 대안 |
|------|------|------|
| `brandSolid` + `brandSolid` 나란히 | 주 액션 불분명 | `neutralWeak` + `brandSolid` |
| `brandOutline` + `brandSolid` | 스타일 혼재 | `neutralWeak` + `brandSolid` |
| `Dialog` 안에 `Dialog` | 스택 금지 | 하나로 통합 |
| `BottomSheet` 안에 긴 폼 | UX 부적합 | 별도 페이지 |
| `Snackbar` + `Snackbar` | 큐잉 | 앞선 것 dismiss |
| `Fab` + `Fab` | 1개만 허용 | 하나로 통합 |
| `Chip`과 `ActionButton` 혼용 (같은 줄) | 의미 충돌 | 하나의 타입으로 |
| `Callout` + `InlineBanner` 같은 영역 | 중복 | 하나만 |

---

## 반응형 분기

Seed는 기본 모바일-퍼스트. 데스크탑 분기는 `ResponsivePair` 또는 viewport 기반 conditional render.

```tsx
<ResponsivePair
  mobile={<BottomSheet>...</BottomSheet>}
  desktop={<Dialog>...</Dialog>}
/>
```

실제로는 BottomSheet가 데스크탑에서 자동으로 중앙 모달처럼 변형되므로 대부분의 경우 분기 불필요.

---

## 세이프 에어리어 대응

모바일 앱 컨텍스트(iOS 노치·하단 인디케이터)에서는 Seed가 제공하는 `--seed-safe-area-top`, `--seed-safe-area-bottom` 변수를 사용.

```tsx
<Stack paddingTop="safe-area-top" paddingBottom="safe-area-bottom">
  ...
</Stack>
```

이는 Seed의 base.css에서 자동 주입되며, 수동으로 iOS·Android 분기 필요 없음.
