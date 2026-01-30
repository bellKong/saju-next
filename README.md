# 사주 - AI 사주팔자, 궁합, 운세 서비스

Next.js 기반의 AI 사주 서비스입니다. 크레딧 기반 결제 시스템과 결과 공유 기능을 제공합니다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **인증**: Auth.js (NextAuth) - Google, Kakao OAuth
- **데이터베이스**: Neon (PostgreSQL) + Prisma ORM
- **결제**: Toss Payments, KakaoPay
- **AI**: OpenAI GPT-4
- **스타일링**: Tailwind CSS
- **배포**: Vercel

## 주요 기능

### 1. 인증
- Google 소셜 로그인
- Kakao 소셜 로그인
- 세션 기반 인증

### 2. 크레딧 시스템
- 1회/5회/10회 충전권 구매
- 크레딧 잔액 관리
- 원장(Ledger) 기반 트랜잭션 추적

### 3. 사주 서비스
- **사주팔자**: 생년월일시 기반 상세 분석
- **궁합**: 두 사람의 궁합 분석
- **운세**: 오늘의 운세 확인

### 4. 결과 관리
- 열람 내역 저장 및 조회
- 공유 링크 생성
- 공유 취소 기능

### 5. 결제
- Toss Payments 통합
- KakaoPay 통합
- 결제 검증 및 웹훅 처리
- 환불 처리

## 시작하기

### 1. 저장소 클론 및 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 2. 환경변수 설정

\`.env.example\`을 참고하여 \`.env\` 파일을 생성하고 필요한 값을 설정하세요.

\`\`\`bash
cp .env.example .env
\`\`\`

#### 필수 설정

1. **Neon Database**
   - [Neon](https://neon.tech/)에서 PostgreSQL 데이터베이스 생성
   - Pooled connection URL을 \`DATABASE_URL\`에 설정
   - Direct connection URL을 \`DIRECT_URL\`에 설정

2. **Auth.js Secret**
   \`\`\`bash
   openssl rand -base64 32
   \`\`\`

3. **Google OAuth**
   - [Google Cloud Console](https://console.cloud.google.com/)에서 OAuth 2.0 클라이언트 ID 생성
   - Authorized redirect URIs: \`http://localhost:3000/api/auth/callback/google\`

4. **Kakao OAuth**
   - [Kakao Developers](https://developers.kakao.com/)에서 앱 생성
   - Redirect URI: \`http://localhost:3000/api/auth/callback/kakao\`

5. **Toss Payments**
   - [Toss Payments Developers](https://developers.tosspayments.com/)에서 테스트 키 발급

6. **KakaoPay**
   - [KakaoPay Developers](https://developers.kakaopay.com/)에서 키 발급

7. **OpenAI**
   - [OpenAI Platform](https://platform.openai.com/api-keys)에서 API 키 발급

### 3. 데이터베이스 설정

\`\`\`bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 마이그레이션
npm run db:push
\`\`\`

### 4. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

\`\`\`
saju/
├── app/                        # Next.js App Router
│   ├── (protected)/           # 인증 필요 페이지
│   │   ├── saju/             # 사주팔자
│   │   ├── compatibility/    # 궁합
│   │   ├── fortune/          # 운세
│   │   ├── history/          # 내역
│   │   └── billing/          # 크레딧 충전
│   ├── api/                  # API 라우트
│   │   ├── auth/            # Auth.js
│   │   ├── payments/        # 결제 API
│   │   ├── readings/        # 사주 생성/조회
│   │   ├── webhooks/        # 결제 웹훅
│   │   └── me/              # 사용자 정보
│   ├── login/               # 로그인 페이지
│   ├── share/[shareId]/     # 공유 페이지
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 홈 페이지
│   └── globals.css          # 글로벌 스타일
├── lib/                      # 유틸리티
│   ├── auth.ts              # Auth.js 설정
│   ├── prisma.ts            # Prisma 클라이언트
│   ├── openai.ts            # OpenAI 통합
│   └── payments/            # 결제 유틸
│       └── products.ts      # 상품 정의
├── prisma/
│   └── schema.prisma        # 데이터베이스 스키마
├── types/
│   └── next-auth.d.ts       # TypeScript 타입 확장
├── middleware.ts            # Next.js 미들웨어
└── package.json
\`\`\`

## API 엔드포인트

### 인증
- \`GET/POST /api/auth/[...nextauth]\` - Auth.js 핸들러

### 결제
- \`POST /api/payments/intent\` - 결제 준비
- \`POST /api/payments/toss/confirm\` - Toss 결제 확인
- \`POST /api/payments/kakaopay/confirm\` - KakaoPay 결제 확인
- \`POST /api/webhooks/toss\` - Toss 웹훅
- \`POST /api/webhooks/kakaopay\` - KakaoPay 웹훅

### 크레딧 & 사주
- \`GET /api/me/entitlement\` - 크레딧 잔액 조회
- \`POST /api/readings\` - 사주/궁합/운세 생성
- \`GET /api/readings\` - 내역 조회
- \`GET /api/readings/[id]\` - 특정 결과 조회
- \`POST /api/readings/[id]/share\` - 공유 링크 생성
- \`DELETE /api/readings/[id]/share\` - 공유 취소
- \`GET /api/share/[shareId]\` - 공유 데이터 조회

## 데이터베이스 스키마

주요 테이블:
- \`User\` - 사용자 정보 및 크레딧 잔액
- \`Account\` / \`Session\` - Auth.js
- \`PaymentIntent\` - 결제 시작 단계
- \`Payment\` - 확정된 결제
- \`CreditLedger\` - 크레딧 증감 원장
- \`Reading\` - 사주/궁합/운세 결과
- \`Share\` - 공유 링크

## 보안 고려사항

### 1. 환경변수 관리
- 절대 \`.env\` 파일을 커밋하지 마세요
- Vercel 환경변수에 프로덕션 키 설정

### 2. 결제 검증
- 모든 결제는 서버에서 검증
- \`providerPaymentId\`를 unique 제약으로 중복 방지
- 트랜잭션으로 원자성 보장

### 3. 크레딧 차감
- Row-level locking으로 동시성 제어
- OpenAI 실패 시 자동 환불

### 4. API 키 보호
- OpenAI 키는 서버에서만 사용
- 클라이언트에 절대 노출 금지

## 배포

### Vercel 배포

1. Vercel에 프로젝트 연결
2. 환경변수 설정 (모든 \`.env.example\` 항목)
3. 자동 배포

### 환경변수 체크리스트
- ✅ \`DATABASE_URL\`
- ✅ \`DIRECT_URL\`
- ✅ \`AUTH_SECRET\`
- ✅ \`GOOGLE_CLIENT_ID\` / \`GOOGLE_CLIENT_SECRET\`
- ✅ \`KAKAO_CLIENT_ID\` / \`KAKAO_CLIENT_SECRET\`
- ✅ \`TOSS_CLIENT_KEY\` / \`TOSS_SECRET_KEY\`
- ✅ \`KAKAOPAY_CID\` / \`KAKAOPAY_ADMIN_KEY\`
- ✅ \`OPENAI_API_KEY\`

## 개발 가이드

### 새로운 상품 추가
\`lib/payments/products.ts\`에서 상품 정의 추가

### 크레딧 정책 변경
- 사주 생성: \`app/api/readings/route.ts\`에서 차감 로직 수정
- 가격 변경: \`lib/payments/products.ts\`에서 수정

### OpenAI 프롬프트 수정
\`lib/openai.ts\`에서 각 함수의 프롬프트 커스터마이징

## 문제 해결

### Prisma 오류
\`\`\`bash
npm run db:generate
\`\`\`

### 마이그레이션 초기화
\`\`\`bash
npm run db:push
\`\`\`

### 데이터베이스 GUI
\`\`\`bash
npm run db:studio
\`\`\`

## 라이선스

ISC

## 지원

문제가 발생하면 이슈를 생성해주세요.
