# Deep Sleep

‘Deep Sleep'은 매일 나의 수면 시간을 기록하고, 조회·수정·삭제할 수 있는 간단한 풀스택 모바일 서비스입니다.
React 기반의 클라이언트와 Fastify+SQLite 기반의 서버로 구성되어 있으며, 누구나 빠르게 자신의 수면 패턴을 관리할 수 있어요.

---

## 주요 기능

- **수면 기록 생성**

  - 수면 시작 시간 & 종료 시간 입력
  - 자동으로 소요 시간(`durationMinutes`) 계산
  - 수면 품질(1–5) 및 메모 필드

- **기록 조회**

  - 전체 기록 조회 (관리자용)
  - 사용자별 기록 리스트
  - 개별 기록 상세 보기

- **기록 수정 & 삭제**
  - 입력 오류 수정: 시작/종료 시간 간 유효성 검증
  - 기록 삭제 시 확인 모달

---

## 폴더 구조

```
/server
├─ src/
│  ├─ config/        환경 변수 로딩
│  ├─ db/            Drizzle ORM 스키마·마이그레이션
│  ├─ migrations/    테이블 생성 스크립트
│  ├─ services/      비즈니스 로직 (SleepRecordService)
│  ├─ controllers/   요청 핸들러
│  ├─ routes/        Fastify 플러그인
│  └─ index.ts       서버 시작점

/client
├─ src/
│  ├─ hooks/         useSleepRecords 커스텀 훅
│  ├─ services/      API 호출 로직
│  ├─ components/    SleepRecordList, SleepRecordForm, Button 등
│  ├─ routes/        페이지 컴포넌트 (리스트·생성·수정)
│  ├─ layouts/       MainLayout
│  └─ App.tsx        라우팅 설정

```

---

## Changelog

### [1.2.0]

#### Added

- 🤖 **AI 수면 패턴 조언 기능**
  - **AI 기반 수면 패턴 요약**
    - 엔드포인트: `GET /api/ai/advice?periodDays={days}`
    - 내 최근 `{days}`일 수면 기록 기반으로
      - 평균·최단·최장 수면시간 계산
      - 한 문장 요약 리포트 생성
    - 클라이언트에서 호출: `useAiAdvice(periodDays)` 훅

#### Changed

- 🎨 **홈페이지 UI 개편**
  - “수면 관리” 앱 컨셉에 맞춰 텍스트·버튼·레이아웃 단순화

#### Fixed

- 🔒 **인증 흐름 개선**
  - 로그인·로그아웃 직후 상단바 즉시 갱신되도록 `useAuth` 훅 개선
- 🛠 **불필요한 `ApiResponse` 중복 정의 제거**
- 🔁 **수면 기록 수정 API 최적화**
  - 수정 요청 시 불필요한 추가 조회 호출을 제거해, API 요청 횟수를 1회로 줄임
- ✅ **사용자 ID 기반 개인 기록 조회/추가 지원**
  - `useSleepRecords(userId)` 훅과 `/api/sleep-records/user/:userId` 엔드포인트로
    - 자기 자신의 수면 기록만 조회 및 생성 가능하도록 개선

### [1.1.0]

#### Added

- 🔍 **수면 통계 인사이트 기능**
  - **최근 30일 수면 시간 추이** 차트 (라인)
    - 엔드포인트: `GET /api/statistics/sleep-trend?days=30`
    - 클라이언트에서 분 단위를 “Xh Ym” 포맷으로 변환
  - **요일별 평균 수면 시간** 차트 (막대)
    - 엔드포인트: `GET /api/statistics/weekday-average`
    - 클라이언트에서 분 단위를 “Xh Ym” 포맷으로 변환
- 🛠 **백엔드**
  - `statisticsService.getSleepTrend(userId, days)` 구현
  - `statisticsService.getWeekdayAverage(userId)` 구현
  - 인증 미들웨어(`fastify.authenticate`) 적용된 `statisticsController` & `statisticsRoutes` 추가
- 🛠 **프론트엔드**
  - `useStatistics` 훅 추가 (API 호출 & 상태 관리)
  - `SleepTrendByMonth`, `WeekdayAverageChart` 컴포넌트 구현
  - `StatisticsPage` 라우팅 및 레이아웃 업데이트
- 🔐 **인증(Session) 기능**
  - `POST   /api/session/login` : 이메일 로그인 → 토큰 발행
  - `DELETE /api/session/logout` : 로그아웃(토큰 만료)
  - `GET    /api/session/me` : 내 정보 조회
  - Fastify 플러그인 `authenticate` 미들웨어 적용

### [1.0.0]

#### Added

- 🎉 **기본 수면 기록 CRUD 기능**
  - `POST /api/sleep-records` : 기록 생성
  - `GET  /api/sleep-records` : 전체 기록 조회
  - `GET  /api/sleep-records/:id` : 단일 기록 조회
  - `PUT  /api/sleep-records/:id` : 기록 수정
  - `DELETE /api/sleep-records/:id` : 기록 삭제

---

## 기술 스택

### 공통

- 패키지 매니저: pnpm (workspace 기능 활용)
- 언어: TypeScript
- Node.js 버전: 22.x
- 테스트: Vitest
- 코드 품질: Prettier

### 클라이언트

- 프레임워크: React
- 빌드 도구: Vite
- 라우팅: React Router
- 스타일링: TailwindCSS

### 서버

- 프레임워크: Fastify
- 데이터베이스: SQLite with DirzzleORM

## 설치 및 실행

### 초기 설치

```bash
# 프로젝트 루트 디렉토리에서 실행
pnpm install
```

### 개발 서버 실행

```bash
# 클라이언트 및 서버 동시 실행
pnpm dev

# 클라이언트만 실행
pnpm dev:client

# 서버만 실행
pnpm dev:server
```

### 테스트 실행

```bash
# 클라이언트 테스트
pnpm test:client

# 서버 테스트
pnpm test:server

# 모든 테스트 실행
pnpm test
```

### 빌드

```bash
# 클라이언트 및 서버 빌드
pnpm build
```

## 환경 변수 설정

- 클라이언트: `client/.env` 파일에 설정 (예시는 `client/.env.example` 참조)
- 서버: `server/.env` 파일에 설정 (예시는 `server/.env.example` 참조)

## API 엔드포인트

서버는 다음과 같은 기본 API 엔드포인트를 제공합니다:

• 유저 관련

- `GET /api/health`: 서버 상태 확인
- `GET /api/users`: 유저 목록 조회
- `GET /api/users/:id`: 특정 유저 조회
- `POST /api/users`: 새 유저 추가
- `PUT /api/users/:id`: 유저 정보 수정
- `DELETE /api/users/:id`: 유저 삭제

• 수면 기록 관련

- `GET /api/sleep-records` : 전체 수면 기록 조회 (관리자용)
- `GET /api/sleep-records/:id` : 단일 수면 기록 조회
- `GET /api/sleep-records/user/:userId` : 특정 사용자 수면 기록 조회
- `POST /api/sleep-records` : 수면 기록 생성
- `PUT /api/sleep-records/:id` : 수면 기록 수정
- `DELETE /api/sleep-records/:id` : 수면 기록 삭제
