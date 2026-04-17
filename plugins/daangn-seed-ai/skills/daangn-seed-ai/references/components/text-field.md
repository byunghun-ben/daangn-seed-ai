# TextField

**정의** — 한 줄/여러 줄의 텍스트 입력을 받는 기본 폼 필드. 레이블, 설명, 에러 메시지, prefix/suffix를 포함한 완전한 필드 구조.

**import**
```ts
import { TextField } from "@seed-design/react";
```

관련 결정 매트릭스: [`decision-matrices/which-input.md`](../decision-matrices/which-input.md)

---

## 언제 쓰나 / 언제 쓰지 않나

| 상황 | 선택 |
|------|------|
| 일반 텍스트 입력 (이름, 메일, 전화번호) | **TextField** |
| 멀티라인 입력 (리뷰, 메시지) | `TextField` (multiline 모드) |
| 짧은 클릭 선택형 (날짜, 위치) | `FieldButton` |
| 옵션 중 선택 | `SelectBox`, `RadioGroup` |
| boolean 토글 | `Switch`, `Checkbox` |
| 검색 전용 (아이콘·X 버튼 포함) | `TextField`에 prefixIcon·suffixAction 조합 |

---

## Anatomy (Field 기반)

TextField는 `Field` wrapper를 사용한다. Field는 5개 영역으로 구성:

```
┌─────────────────────────────────────────┐
│ label  [indicator]             [action] │  ← header
├─────────────────────────────────────────┤
│ [prefix] ████████ input ████ [suffix]   │  ← input (본체)
├─────────────────────────────────────────┤
│ [icon] description                 [char count] │  ← footer
└─────────────────────────────────────────┘
```

| Slot | 필수 | 역할 |
|------|------|------|
| `label` | ⚪ | 필드 제목 |
| `indicator` | ⚪ | 필수 표시 (`*`, "필수") |
| `input` | ✅ | 입력 영역 (본체) |
| `prefix` | ⚪ | 입력 앞 요소 (아이콘, 단위 표시) |
| `suffix` | ⚪ | 입력 뒤 요소 (X 버튼, 아이콘) |
| `description` | ⚪ | 도움말 텍스트 (`fg.neutral-muted`) |
| `errorMessage` | ⚪ | 에러 메시지 (`fg.critical`) |
| `charCount` | ⚪ | 글자 수 표시 |

---

## States

| State | 트리거 | 시각 |
|-------|--------|------|
| `enabled` | 기본 | `stroke.neutral-weak` 보더 |
| `focused` | 포커스 시 | `stroke.neutral-solid` + focus ring |
| `invalid` | `invalid` prop | `stroke.critical-solid` |
| `disabled` | `disabled` prop | 흐려짐 |
| `readonly` | `readonly` prop | 입력만 막힘, 스타일 기본 유지 |

---

## Props (핵심)

```ts
interface TextFieldProps {
  // 값
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  // 상태
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  required?: boolean;

  // 레이블/설명
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  placeholder?: string;

  // 제한
  maxGraphemeCount?: number;   // 한글 자모 단위 카운트 (Seed 특화!)

  // 장식
  prefix?: ReactNode;
  suffix?: ReactNode;
}
```

### 한글 특화 — `maxGraphemeCount`

Seed의 TextField는 한글 자모 분리 입력을 그래픽 단위(grapheme)로 카운트하는 유틸을 제공. 일반 `maxLength`로 한글을 다루면 "ㄱ"→"가"→"각" 입력 중간에 잘려서 UX가 깨진다. 한글 앱에선 `maxGraphemeCount`를 쓸 것.

---

## 합성 규칙

- **label 없으면 `aria-label` 필수** — 접근성 위반 방지.
- **errorMessage와 description 동시 표시 금지** — errorMessage가 있으면 description은 가려짐.
- **prefix/suffix는 가벼운 장식용** — 복잡한 버튼은 `FieldButton` 별도 배치.
- **required는 indicator와 함께** — `required` prop만 두고 indicator 숨기면 사용자가 모름.

---

## 접근성

- `label`이 input과 `htmlFor` 자동 연결.
- 에러 상태는 `aria-invalid` + `aria-describedby={errorMessage id}` 자동.
- 키보드: Tab 진입, Escape로 값 클리어(suffix 지원 시).

---

## Anti-patterns

```tsx
❌ <input type="text" placeholder="이름" />
   {/* 네이티브 input — label, error, focus ring 다 없음 */}

❌ <TextField placeholder="이메일" />
   {/* label 없고 placeholder만 — 포커스 시 라벨 사라짐 */}

❌ <TextField
     invalid
     description="이메일 형식이 아닙니다"
   />
   {/* 에러는 errorMessage로 */}

❌ <TextField maxLength={10} />  {/* 한국어 앱 */}
   {/* 한글 자모 중간 절단 — maxGraphemeCount 사용 */}

✅ <TextField
     label="이메일"
     description="로그인 ID로 사용됩니다"
     placeholder="example@domain.com"
     required
     onValueChange={setEmail}
     value={email}
   />

✅ <TextField
     label="닉네임"
     maxGraphemeCount={12}
     errorMessage={error}
     invalid={!!error}
   />
```
