# 가수 섭외 CRM(고객 관계 관리) 시스템

<p align="center">
  <img src="apps/web/public/logo.png" alt="CRM 시스템 로고" width="200">
</p>

## 📋 프로젝트 소개

본 프로젝트는 가수 섭외 및 계약 관리를 위한 종합적인 CRM(Customer Relationship Management) 시스템입니다. 기업 행사, 축제, 콘서트 등에 가수를 섭외하는 과정에서 발생하는 고객 요청, 가수 매칭, 협상, 계약, 일정 관리 등의 업무를 효율적으로 처리할 수 있는 웹 애플리케이션입니다.

### 프로젝트 목표

- 고객 요청부터 계약 완료까지 전체 프로세스의 디지털화
- 효율적인 고객 관계 관리 및 데이터 중앙화
- 협상 과정의 투명성 및 추적 가능성 확보
- 일정 및 계약 관리의 효율성 향상

## 🛠️ 기술 스택

### 프론트엔드

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Form Handling**: React Hook Form (일부 페이지)
- **API Communication**: Fetch API

### 백엔드

- **Framework**: NestJS
- **Language**: TypeScript
- **Database ORM**: TypeORM
- **Database**: MySQL
- **Authentication**: JWT
- **API Documentation**: Swagger
- **Caching**: Redis (선택적)

### 인프라

- **Deployment**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (선택적)

## ✨ 주요 기능

### 1. 요청 관리

- 고객의 가수 섭외 요청 접수 및 처리
- 요청 상태 추적 및 관리
- 요청 관련 문서 및 첨부 파일 관리

### 2. 매칭/협상 관리

- 고객 요청에 적합한 가수 매칭
- 가격 및 조건 협상 과정 관리
- 협상 이력 기록 및 조회
- 최종 견적서 생성 및 관리

### 3. 일정/계약 관리

- 공연 일정 관리 (캘린더 뷰 제공)
- 계약서 생성 및 관리
- 계약 상태 추적
- 계약 관련 문서 생성 및 보관

### 4. 고객 관리

- 고객 정보 관리
- 고객별 히스토리 관리
- 고객 세그먼트 관리
- 고객 상호작용 기록

### 5. 대시보드

- 주요 지표 실시간 표시
- 금일 일정 요약
- 최근 요청 및 계약 현황
- 데이터 시각화

## 📦 설치 및 실행 방법

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 9.0.0 이상
- Docker 및 Docker Compose (선택적)

### 로컬 개발 환경 설정

1. 저장소 클론

```bash
git clone https://github.com/yourusername/crm-project.git
cd crm-project
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정
   `.env.example` 파일을 복사하여 `.env` 파일을 생성하고 필요한 환경 변수를 설정합니다.

```bash
cp .env.example .env
```

4. 개발 서버 실행

```bash
npm run dev
```

프론트엔드 서버는 `http://localhost:3000`에서 실행됩니다.
백엔드 서버는 `http://localhost:5000`에서 실행됩니다.

### Docker를 사용한 실행

```bash
docker-compose up -d
```

## 🗂️ 프로젝트 구조

프로젝트는 Nx 모노레포 구조로 되어 있으며, 주요 구조는 다음과 같습니다:

```
crm-project/
├── apps/
│   ├── api/                   # 백엔드 (NestJS)
│   │   ├── src/
│   │   │   ├── auth/          # 인증 관련 모듈
│   │   │   ├── users/         # 사용자 관련 모듈
│   │   │   ├── customers/     # 고객 관련 모듈
│   │   │   ├── requests/      # 요청 관련 모듈
│   │   │   ├── negotiations/  # 협상 관련 모듈
│   │   │   ├── schedules/     # 일정 관련 모듈
│   │   │   ├── contracts/     # 계약 관련 모듈
│   │   │   └── ...
│   │
│   └── web/                   # 프론트엔드 (Next.js)
│       ├── public/            # 정적 파일
│       └── src/
│           ├── app/           # 페이지 구조 (App Router)
│           ├── components/    # 재사용 가능한 컴포넌트
│           ├── services/      # API 통신 서비스
│           ├── utils/         # 유틸리티 함수
│           └── ...
│
├── libs/                      # 공유 라이브러리
│   ├── common-types/          # 공통 타입 정의
│   └── ui-components/         # 공통 UI 컴포넌트
│
└── tools/                     # 빌드 및 배포 도구
```

## 📚 API 문서

백엔드 서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:
http://localhost:5000/api

## 📝 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.

## 👥 연락처 및 기여

이 프로젝트에 관심이 있거나 질문이 있으신 경우, 다음 이메일로 연락 주세요:
example@email.com

프로젝트 개선을 위한 기여는 언제나 환영합니다. 버그 제보, 기능 요청, 또는 코드 기여를 위해 이슈를 등록하거나 풀 리퀘스트를 보내주세요.

## ✅ 구현된 기능 목록

### 고객 요청 관리

- [x] 요청 목록 조회 및 필터링
- [x] 신규 요청 등록
- [x] 요청 상세 조회
- [x] 요청 상태 변경

### 매칭/협상 관리

- [x] 매칭 목록 조회 및 필터링
- [x] 새 협상 등록
- [x] 협상 내역 조회
- [x] 가격 조정 및 협상 진행
- [x] 최종 견적서 생성

### 일정/계약 관리

- [x] 일정 캘린더 뷰
- [x] 새 일정 등록
- [x] 계약 생성 및 관리
- [x] 계약 상태 변경
- [x] 계약서 프리뷰

### 고객 관리

- [x] 고객 목록 조회
- [x] 고객 상세 정보
- [x] 고객별 요청 및 계약 이력

### 대시보드

- [x] 주요 통계 지표
- [x] 최근 요청 목록
- [x] 오늘의 일정
- [x] 시스템 알림

## Docker를 사용한 배포

### 사전 요구사항

- Docker
- Docker Compose

### 배포 단계

1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 필요한 환경 변수를 설정합니다:

```
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=crm_db
NODE_ENV=production
```

2. Docker Compose를 사용한 배포

```bash
# 빌드 및 실행
docker-compose up -d --build

# 로그 확인
docker-compose logs -f

# 컨테이너 중지
docker-compose down
```

3. 자동 배포 스크립트 사용

배포 스크립트를 사용하여 서버에 배포할 수 있습니다:

```bash
# 스크립트에 실행 권한 부여
chmod +x deploy.sh

# 배포 스크립트 실행 전 설정 수정
# - SERVER_USER: 서버 사용자 이름
# - SERVER_IP: 서버 IP 주소
# - SERVER_PATH: 서버의 배포 경로

# 배포 스크립트 실행
./deploy.sh
```

## 배포 후 접속

- 프론트엔드: http://your-server-ip:3000
- 백엔드 API: http://your-server-ip:4000
