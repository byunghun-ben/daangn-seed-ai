# Anti-patterns (AI-Slop Avoidance)

**이 파일은 작성 후 항상 대조할 것.** Claude가 UI를 만들 때 반복적으로 저지르는 실수 목록. 각 항목은 "감지 가능한 패턴"으로 기술되어 있어 리뷰 시 grep으로도 검증 가능.

## 1. 하드코딩된 디자인 값

### 색상
```
❌ color: #333;
❌ color: rgb(51, 51, 51);
❌ backgroundColor: '#ff6f0f';
❌ color: var(--seed-color-palette-gray-900);   (primitive 직접 사용)

✅ color: var(--seed-color-fg-neutral);
✅ backgroundColor: var(--seed-color-bg-brand-solid);
```

### 간격
```
❌ padding: 15px;                               (4px 그리드 밖)
❌ margin: 17px 23px;                           (마법의 숫자)
❌ gap: 9px;

✅ padding: var(--seed-dimension-x4);           (16px)
✅ gap: var(--seed-dimension-x2);               (8px)
```

### 타이포
```
❌ font-size: 14px;
❌ font-size: 1rem; line-height: 1.5;           (페어링 규칙 위반)

✅ font-size: var(--seed-font-size-t4);
   line-height: var(--seed-line-height-t4);
```

### 반경
```
❌ border-radius: 5px;
❌ border-radius: 10px 10px 0 0;                (BottomSheet가 아닌데 상단만)

✅ border-radius: var(--seed-radius-r3);
```

---

## 2. 네이티브 요소 대신 Seed 컴포넌트

```
❌ <button onClick={...}>클릭</button>
❌ <div role="button" onClick={...}>클릭</div>
❌ <input type="text" placeholder="이름" />
❌ <select>...</select>

✅ <ActionButton variant="brandSolid" onClick={...}>클릭</ActionButton>
✅ <TextField label="이름" />
✅ <SelectBox>...</SelectBox> 또는 <RadioGroup>...</RadioGroup>
```

---

## 3. primitive 레이아웃 대신 Seed 레이아웃

```
❌ <div style={{ display: 'flex', gap: 16 }}>...</div>
❌ <div className="card">
     <div className="row">
       <div className="title">...</div>
       <div className="actions">...</div>
     </div>
   </div>

✅ <Stack gap="x4">
     <Flex align="center" justify="space-between">
       <Title>...</Title>
       <ActionButton>...</ActionButton>
     </Flex>
   </Stack>
```

---

## 4. 의미 없는 variant 선택

```
❌ 한 화면에 solid 버튼 여러 개 (어느 게 기본 액션인지 모름)
   <ActionButton variant="brandSolid">저장</ActionButton>
   <ActionButton variant="brandSolid">취소</ActionButton>

✅ 주 액션만 solid, 보조는 weak
   <ActionButton variant="neutralWeak">취소</ActionButton>
   <ActionButton variant="brandSolid">저장</ActionButton>
```

```
❌ 파괴적 액션에 brandSolid
   <ActionButton variant="brandSolid" onClick={deleteForever}>삭제</ActionButton>

✅ criticalSolid 사용
   <ActionButton variant="criticalSolid" onClick={deleteForever}>삭제</ActionButton>
```

```
❌ outline + solid 혼재
   <ActionButton variant="brandOutline">취소</ActionButton>
   <ActionButton variant="brandSolid">확인</ActionButton>

✅ 같은 계열로 페어
   <ActionButton variant="neutralWeak">취소</ActionButton>
   <ActionButton variant="brandSolid">확인</ActionButton>
```

---

## 5. 오버레이 오용

(상세: `decision-matrices/which-overlay.md`)

```
❌ Dialog로 "저장되었습니다" 피드백             → Snackbar
❌ Snackbar로 영구 공지                         → PageBanner / Callout
❌ Callout으로 일시 피드백                      → Snackbar
❌ BottomSheet에 20개 필드의 풀폼               → 별도 페이지
❌ Dialog를 2-3개 연속 스택                     → 단일 흐름
```

---

## 6. 접근성 누락

```
❌ <ActionButton layout="iconOnly">
     <IconSearch />
   </ActionButton>
   (aria-label 없음)

❌ <TextField placeholder="이메일" />
   (label 없음, placeholder만)

❌ <Dialog>
     {/* Dialog.Title 없음 */}
   </Dialog>

✅ <ActionButton layout="iconOnly" aria-label="검색"><IconSearch /></ActionButton>
✅ <TextField label="이메일" />
✅ <Dialog><Dialog.Title>...</Dialog.Title>...</Dialog>
```

---

## 7. 한글 UX 누락

```
❌ <TextField maxLength={10} />                 (한글 자모 중간 절단)
✅ <TextField maxGraphemeCount={10} />

❌ font-size: 14px; line-height: 1.5;           (한국어에 좁음)
✅ font-size: var(--seed-font-size-t4);
   line-height: var(--seed-line-height-t4);     (한국어 기준 조정됨)
```

---

## 8. 상태 머신 누락

```
❌ 버튼에 hover만 — pressed, disabled, loading 빠짐
❌ Input에 focus 스타일 없음
❌ loading 중에도 클릭 가능

✅ Seed 컴포넌트는 이 모든 상태를 자동 제공 — 직접 구현하지 말 것
```

---

## 9. 색상 대비 위반

```
❌ bg.brand-solid 배경 + fg.neutral 텍스트      (대비 부족)
✅ bg.brand-solid 배경 + fg.brand-contrast 텍스트
```

**규칙**: `bg.X-solid`에는 반드시 `fg.X-contrast`를 페어링.

---

## 10. 제멋대로 한 화면에 radius 혼재

```
❌ 한 화면에 radius 5px, 10px, 12px, 20px, 9999px 혼용

✅ 기본 r3 (12px) + 원형 full 두 가지로 90% 커버
   카드/모달만 r4~r5
```

---

## 11. 여백 리듬 깨짐

```
❌ 섹션 간격이 제각각: 12px, 17px, 22px, 15px

✅ x4 (16px) 또는 x6 (24px)의 배수로 통일
```

---

## 12. 플레이스홀더를 라벨 대체용으로 사용

```
❌ <TextField placeholder="이메일" />
   (placeholder가 유일한 라벨 — 타이핑 시 사라지면 맥락 잃음)

✅ <TextField label="이메일" placeholder="example@domain.com" />
```

---

## 13. "AI가 만든 티" 나는 레이아웃 특징

- 중앙 정렬 플렉스가 반복됨 (`justifyContent: center`가 도처에)
- 너무 많은 그라디언트·그림자 (Seed는 거의 사용 안 함)
- 파스텔 톤 연속 (Seed는 neutral 주도)
- 둥근 모서리 과다 (`border-radius: 20px` 남발)
- 버튼에 그림자 (Seed는 flat 지향)

Seed는 **flat + neutral-dominant + 정돈된 간격**이 기본.

---

## 리뷰 체크리스트

작성 후 이 목록으로 자기 검증:

- [ ] 모든 색·간격·반경·폰트에 하드코딩 없음 (CSS 변수 또는 토큰 이름)
- [ ] `<div role="button">`, 네이티브 `<input>`, `<select>` 없음
- [ ] 레이아웃은 Stack/Flex/Grid/Box 중 하나
- [ ] 한 화면에 solid variant 버튼 1개만 (또는 0개)
- [ ] iconOnly 버튼에 `aria-label` 있음
- [ ] TextField에 `label` 있음 (placeholder만 쓰지 않음)
- [ ] Dialog/BottomSheet에 Title 있음
- [ ] 한국어 앱이면 `maxGraphemeCount` 사용
- [ ] Snackbar와 Dialog 구분되어 있음 (피드백 vs 차단)
- [ ] `bg.X-solid` + `fg.X-contrast` 페어 유지
