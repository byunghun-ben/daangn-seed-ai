# Which Input?

폼에서 사용자 입력을 받아야 할 때, Seed에는 용도별 입력 컴포넌트가 여럿 있다.

## 결정 트리

```
어떤 종류의 값을 받나?
├── 자유 텍스트 (이름, 메일, 메모)                 → TextField
├── 2개 상태 (on/off)
│   ├── 폼 내부, "저장" 눌러야 반영                → Checkbox (단일)
│   └── 즉시 적용, 설정형                          → Switch
├── 여러 옵션 중 1개 선택
│   ├── 3-4개, 가로 세그먼트                      → SegmentedControl
│   ├── 드롭다운형                                → SelectBox
│   ├── 세로 라디오 리스트                         → RadioGroup / RadioGroupField
│   └── 하단 시트에서 선택                         → BottomSheet + RadioGroup
├── 여러 옵션 중 다중 선택
│   ├── 체크박스 그리드                            → CheckboxGroup
│   └── 태그 스타일 (필터 UI)                     → ControlChip 여러 개
├── 수치 범위 (슬라이더)                          → Slider
├── 짧은 트리거 (날짜·위치 버튼처럼)              → FieldButton
└── 자유 선택 (ChipGroup)                        → TagGroup
```

---

## 비교표

| 컴포넌트 | 값 타입 | 단일/다중 | 주 맥락 |
|----------|---------|-----------|---------|
| **TextField** | string | — | 자유 텍스트 |
| **Checkbox** | boolean | 단일 | 동의, 선택지 |
| **CheckboxGroup** | `string[]` | 다중 | 체크박스 그리드 |
| **RadioGroup** | string | 단일 | 옵션 리스트 |
| **RadioGroupField** | string | 단일 | label/error 포함 RadioGroup |
| **SelectBox** | string | 단일 | 드롭다운 |
| **SegmentedControl** | string | 단일 | 3-4 가로 분절 |
| **Switch** | boolean | 단일 | 즉시 토글 |
| **Slider** | number | 단일/범위 | 수치 범위 |
| **ToggleButton** | boolean | 단일 | 포맷 토글 (Bold/Italic) |
| **FieldButton** | — | — | 선택 트리거 (값은 외부 picker) |
| **TagGroup** | `string[]` | 다중 | 자유 태그 입력 |
| **ControlChip** | boolean (선택됨) | — | 필터 토글 (여러 개 조합) |

---

## 흔한 실수와 교정

### 1. RadioGroup 대신 Select를 쓴다 (3-4개 옵션)

```
❌ <SelectBox options={[{ value: 'S', label: 'Small' }, ...]} />
   (3-4개면 접어두지 말고 펼쳐서 보여주는 게 빠름)

✅ <RadioGroup>
     <RadioGroup.Item value="S">Small</RadioGroup.Item>
     <RadioGroup.Item value="M">Medium</RadioGroup.Item>
     <RadioGroup.Item value="L">Large</RadioGroup.Item>
   </RadioGroup>
```

**규칙**: 5개 미만 → RadioGroup 또는 SegmentedControl / 5개 이상 → SelectBox

### 2. Switch 대신 Checkbox를 쓴다 (설정)

```
❌ 설정 페이지에서
   <Checkbox checked={notifEnabled} onCheckedChange={...}>
     알림 받기
   </Checkbox>
   (저장 버튼 없이 즉시 적용되는 설정 — Switch가 맞음)

✅ <Switch checked={notifEnabled} onCheckedChange={saveImmediately}>
     알림 받기
   </Switch>
```

**규칙**:
- Switch — 즉시 적용, 시스템 설정 뉘앙스
- Checkbox — 폼의 일부, 저장 버튼으로 반영

### 3. TextField의 한글 카운트 문제

```
❌ <TextField maxLength={10} />  (한국어)
   ("한국어" = 6글자? 3글자? 자모 입력 중 잘림)

✅ <TextField maxGraphemeCount={10} />
   (grapheme 단위 — 한글 완성형 1글자 = 1카운트)
```

### 4. FieldButton을 TextField처럼 쓴다

```
❌ <FieldButton>값을 직접 타이핑</FieldButton>
   (FieldButton은 클릭해서 picker를 띄우는 용도)

✅ <FieldButton onClick={openDatePicker}>
     2026.04.17
   </FieldButton>
   {/* 클릭 시 날짜 picker BottomSheet가 뜸 */}
```

### 5. ControlChip을 ActionButton처럼 쓴다

```
❌ <ControlChip onClick={save}>저장</ControlChip>
   (ControlChip은 선택 상태를 가진 필터 — on/off 토글이 본질)

✅ <Inline gap="x2">
     <ControlChip checked={filter.includes('recent')}>최신</ControlChip>
     <ControlChip checked={filter.includes('nearby')}>근처</ControlChip>
   </Inline>
```

---

## 폼 구조 권장 패턴

폼은 `Field` wrapper를 통해 일관된 구조를 갖는다 — label, description, error를 하나의 단위로 묶는다.

```tsx
<Stack gap="x4">
  <TextField
    label="닉네임"
    description="공백 없이 2-12자"
    maxGraphemeCount={12}
    value={nickname}
    onValueChange={setNickname}
    required
  />

  <RadioGroupField
    label="지역"
    value={region}
    onValueChange={setRegion}
  >
    <RadioGroup.Item value="seoul">서울</RadioGroup.Item>
    <RadioGroup.Item value="busan">부산</RadioGroup.Item>
  </RadioGroupField>

  <Checkbox checked={agreed} onCheckedChange={setAgreed}>
    이용약관에 동의합니다
  </Checkbox>

  <ActionButton
    variant="brandSolid"
    size="large"
    flexGrow={1}
    disabled={!canSubmit}
    onClick={submit}
  >
    가입하기
  </ActionButton>
</Stack>
```
