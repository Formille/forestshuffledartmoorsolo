# Forest Shuffle: Dartmoor Solo Play Companion PWA

보드게임 "Forest Shuffle: Dartmoor"의 솔로 모드를 지원하는 Progressive Web App (PWA) 컴패니언 앱입니다.

## 기능

- **게임 설정**: 15개의 도전 과제 중 선택 및 난이도 설정
- **안나(Anna) 오토마 관리**: 오토마 덱 자동 관리 및 행동 표시
- **점수 계산**: 솔로 모드 전용 점수 조정 로직 (Black-Tailed Godwit, Dartmoor Pony)
- **게임 기록**: LocalStorage를 사용한 게임 기록 저장
- **인증 이미지**: 승리 시 Canvas API로 생성되는 인증 이미지
- **소셜 공유**: Web Share API를 사용한 공유 기능
- **다국어 지원**: 한국어/영어 지원
- **오프라인 지원**: PWA로 오프라인에서도 작동

## 기술 스택

- React 18 + Vite 5
- TypeScript
- Tailwind CSS
- Zustand (상태 관리)
- react-i18next (다국어)
- vite-plugin-pwa (PWA 지원)

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프리뷰
npm run preview
```

## 프로젝트 구조

```
src/
├── components/      # React 컴포넌트
├── data/           # 게임 데이터 (도전 과제, 오토마 덱)
├── hooks/          # 커스텀 훅
├── services/       # 비즈니스 로직
├── store/          # Zustand 스토어
├── types/          # TypeScript 타입 정의
├── utils/          # 유틸리티 함수
└── i18n/           # 다국어 설정
```

## 주요 기능 설명

### 도전 과제
15개의 도전 과제가 있으며, 각각 Bronze/Silver/Gold 난이도별 최소 점수가 설정되어 있습니다.

### 오토마 덱
20장의 오토마 카드로 구성되며, 각 카드는 다음 행동을 포함합니다:
- 덱에서 공터로 카드 추가 (1-3장)
- 공터에서 카드 제거 (0-2장, 방향 지정)
- 덱 맨 위 카드 제거

### 솔로 모드 점수 조정
- **Black-Tailed Godwit**: 습지 6개 미만 시 0점
- **Dartmoor Pony**: 습지 8개 미만 시 15점 → 5점

## 라이선스

이 프로젝트는 개인 사용을 위한 컴패니언 앱입니다.

