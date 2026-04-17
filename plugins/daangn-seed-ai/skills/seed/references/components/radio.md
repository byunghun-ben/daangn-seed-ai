---
name: radio
upstream_sha: 1f1d21d
---

# Radio (Rootage 스펙)

> **standalone Radio 는 React API 에 없음.**
> React 에서는 `RadioGroup.Item` 으로만 사용한다.
> 개별 Radio 선택지를 렌더링하려면 [./radio-group.md](./radio-group.md) 를 참고하라.

---

## 언제 쓰나 / 언제 쓰지 않나

| 써야 함 | 대안 |
|---------|------|
| 여러 선택지 중 하나를 단독 선택 | Checkbox (다중 선택) |
| 폼 내 라디오 그룹 구성 | [./radio-group.md](./radio-group.md) — `RadioGroup` 전체 참조 |

> React API 에는 `Radio` 단독 컴포넌트가 존재하지 않는다.
> 항상 `RadioGroup` 의 하위 구조인 `RadioGroup.Item` 으로만 사용한다.

---

## Rootage 토큰

`radio.yaml` 에 정의된 variant 토큰 목록.

### weight

| 값 | 토큰 | 적용 슬롯 |
|----|------|-----------|
| `weight=regular` | `$font-weight.regular` | `label.fontWeight` |
| `weight=bold` | `$font-weight.bold` | `label.fontWeight` |

### size

| 값 | minHeight | fontSize | lineHeight |
|----|-----------|----------|------------|
| `size=medium` | `$dimension.x8` | `$font-size.t4` | `$line-height.t4` |
| `size=large` | `$dimension.x9` | `$font-size.t5` | `$line-height.t5` |

기타 기본 토큰:
- `label.color` (enabled): `$color.fg.neutral`
- `label.color` (disabled): `$color.fg.disabled`
- `root.gap`: `$dimension.x2`

---

## React API

**별도 export 없음. RadioGroup.Item 을 사용하라.**

`RadioGroup.namespace.ts` 에서 export 되는 항목:

```ts
// RadioGroup 에서만 export — Radio standalone 없음
RadioGroup.Root
RadioGroup.Item          // ← 개별 라디오 선택지
RadioGroup.ItemLabel
RadioGroup.ItemControl
RadioGroup.ItemIndicator
RadioGroup.ItemHiddenInput
```

사용 예는 [./radio-group.md](./radio-group.md) 의 코드 예제를 참고하라.

---

## 참고

- [./radio-group.md](./radio-group.md) — `RadioGroup` 전체 API, 코드 예제, Props 상세
- Rootage 스펙 원본: `packages/rootage/components/radio.yaml`
- 관련 마크 컴포넌트: `packages/rootage/components/radiomark.yaml` (시각 인디케이터 토큰)
