# Color — Semantic Intent Map

**기본 원칙**: palette 토큰을 UI 코드에 박지 말 것. semantic 토큰(`bg.*`, `fg.*`, `stroke.*`, `banner.*`)을 쓴다.

## 역할 축 (role)

semantic 컬러는 "역할"과 "강도"의 2차원 격자로 설계됨.

| 역할 | 의미 | 대표 사용처 |
|------|------|-----------|
| `brand` | 브랜드 프라이머리 (당근 오렌지) | 주요 CTA, 선택된 상태, 브랜드 강조 |
| `neutral` | 중립 회색 스케일 | 기본 텍스트, 보더, 배경, 비강조 UI 전반 |
| `critical` | 위험·파괴적 액션 | 삭제·차단 버튼, 에러 메시지, 경고 |
| `warning` | 주의 | 경고 배너, 유의 필요한 상태 |
| `positive` | 성공·긍정 | 완료 상태, 성공 토스트, 긍정 피드백 |
| `informative` | 정보성 | 정보 배너, 링크, 중립 안내 |
| `magic` | 특수·AI·프로모션 | AI 기능, 이벤트, 특별 강조 |

## 강도 축 (intensity)

| 접미사 | 의미 | 용도 |
|--------|------|------|
| `-solid` | 채움, 고대비 | 주요 액션의 배경, 강한 강조 |
| `-weak` | 옅은 배경 | 보조 액션, 배경 강조, 알림 배너 |
| `-contrast` | solid 배경 위의 전경 | solid 배경과 페어링되는 텍스트/아이콘 |
| `-pressed` | 눌림 상태 | hover/pressed 인터랙션 |

## Background (`$color.bg.*`)

```
bg.brand-solid           → 주요 CTA 버튼 배경
bg.brand-solid-pressed   →   └ pressed 상태
bg.brand-weak            → 선택된 탭, 브랜드 배너, 강조 영역
bg.brand-weak-pressed    →   └ pressed 상태

bg.neutral-solid         → 다크 모드 카드, 반전 배경
bg.neutral-solid-muted   → 보조 강조 (덜 강한 solid)
bg.neutral-weak          → 일반 카드, 리스트 hover
bg.neutral-weak-alpha    →   └ 반투명 버전 (오버레이 위)

bg.critical-solid        → 삭제/차단 CTA 배경
bg.critical-weak         → 에러 영역 배경

bg.positive-solid        → 완료/성공 CTA 배경 (드물게 사용)
bg.positive-weak         → 성공 배너 배경

bg.warning-solid         → 강한 경고 CTA (드물게)
bg.warning-weak          → 경고 배너 배경

bg.informative-solid     → 정보성 CTA
bg.informative-weak      → 정보 배너 배경

bg.layer-default         → 기본 레이어 (페이지 배경)
bg.layer-basement        → 가장 낮은 레이어 (앱 배경)
bg.layer-fill            → 채워진 컨텐츠 영역
bg.layer-floating        → 떠있는 요소 (Dialog, BottomSheet)
bg.layer-floating-pressed →  └ pressed 상태

bg.overlay               → 모달 뒤 딤 처리 (rgba 오버레이)
bg.overlay-muted         → 약한 오버레이

bg.disabled              → 비활성 상태 배경
bg.magic-weak            → AI/이벤트 강조 배경
```

### 언제 solid vs weak?

- **solid**: 사용자가 "이 버튼이 기본(primary) 액션"임을 한눈에 알아야 할 때. 한 화면에 solid CTA는 1개가 원칙.
- **weak**: 보조·반복 액션, 배너, 선택된 상태 표시. 한 화면에 여러 개 가능.

## Foreground (`$color.fg.*`)

텍스트, 아이콘, 글리프 색.

```
fg.neutral              → 기본 본문 텍스트
fg.neutral-muted        → 보조 텍스트 (타임스탬프, 라벨)
fg.neutral-subtle       → 더 약한 보조 텍스트 (플레이스홀더 근접)
fg.neutral-inverted     → 다크 배경 위 텍스트

fg.brand                → 브랜드 강조 텍스트 (링크, 가격 등)
fg.brand-contrast       → bg.brand-solid 위의 텍스트 (보통 흰색)

fg.critical             → 에러 메시지, 삭제 링크
fg.critical-contrast    → bg.critical-solid 위의 텍스트

fg.positive             → 성공 텍스트
fg.positive-contrast    → bg.positive-solid 위의 텍스트

fg.warning              → 경고 텍스트
fg.warning-contrast     → bg.warning-solid 위의 텍스트

fg.informative          → 정보성 강조 텍스트, 링크
fg.informative-contrast → bg.informative-solid 위의 텍스트

fg.placeholder          → input placeholder
fg.disabled             → 비활성 텍스트
```

### Contrast 페어링 규칙

`bg.X-solid` 배경에는 반드시 `fg.X-contrast`를 페어링. 예외 없음.

```
bg.brand-solid     ⇢ fg.brand-contrast     ✅
bg.critical-solid  ⇢ fg.critical-contrast  ✅
bg.brand-solid     ⇢ fg.neutral            ❌ (대비 부족)
```

## Stroke (`$color.stroke.*`)

테두리 색.

```
stroke.neutral-weak      → 기본 divider, 카드 보더
stroke.neutral-subtle    →   └ 더 약한 버전 (리스트 구분선)
stroke.neutral-solid     → 강한 보더 (Input focus 전)
stroke.neutral-muted     → 중간 보더
stroke.neutral-contrast  → 고대비 보더 (다크 배경 위)

stroke.brand-solid       → 아웃라인 CTA 보더
stroke.brand-weak        → 선택 상태 약한 보더

stroke.critical-solid    → 에러 Input 보더
stroke.positive-solid    → 성공 Input 보더
stroke.warning-solid     → 경고 Input 보더

stroke.focus-ring        → 포커스 링 (접근성 필수)
```

## Banner (`$color.banner.*`)

`InlineBanner`, `PageBanner` 전용 사전 정의된 컬러 세트. 의미 축이 아닌 "색상명"으로 분류된다(예외적).

```
banner.blue, banner.cool-gray, banner.green, banner.orange,
banner.pink, banner.purple, banner.red, banner.teal,
banner.warm-gray, banner.yellow
```

**사용 규칙**: 의미 매핑은 컴포넌트가 알아서 함. 직접 사용하지 말고 `<InlineBanner variant="...">` 프롭으로 간접 지정.

## Palette (primitive — 사용 주의)

`$color.palette.*`는 scale별 11단계(00, 100~1000) × 8색상(gray, carrot, blue, red, green, yellow, pink, purple) 구조.

**직접 사용 케이스 (예외적)**:
- 테마 확장·커스텀 semantic 토큰 정의 시
- 일러스트레이션·아이콘의 고정 색상
- 브랜드 자산(로고 등) 그대로 렌더링

**직접 사용 금지 케이스 (대부분)**:
- 일반 UI 컴포넌트의 배경/텍스트/보더

원본 hex 값은 `color.json` 참조.

## Anti-patterns

```
❌ color: #333;
❌ color: rgb(51, 51, 51);
❌ color: var(--seed-color-palette-gray-900);  # primitive 직접 사용
✅ color: var(--seed-color-fg-neutral);

❌ background: var(--seed-color-palette-carrot-500);  # 브랜드 primitive
✅ background: var(--seed-color-bg-brand-solid);

❌ bg.brand-solid + fg.neutral                 # contrast 위반
✅ bg.brand-solid + fg.brand-contrast
```
