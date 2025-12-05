# FromDear

익명 롤링페이퍼 + 어드벤트 캘린더 웹 앱

## 프로젝트 개요

12월을 위한 따뜻한 메시지를 익명으로 받고, 12월 1일부터 매일 하나씩 열어보는 감성 웹 서비스입니다.

## 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Authentication + Database)
- **Deployment**: Vercel

## 시작하기

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
/app
  /[username]          # 사용자별 캘린더 페이지
  /[username]/message  # 익명 메시지 작성 페이지
  /auth                # 인증 페이지 (로그인/회원가입)
  /dashboard           # 대시보드
/components           # 재사용 컴포넌트
/lib                  # 유틸리티 함수 및 Supabase 클라이언트
```

## 데이터베이스 스키마

### users 테이블
- id (uuid, primary key)
- username (text, unique) - 고유 닉네임 (링크에 사용)
- email (text, unique)
- created_at (timestamp)

### messages 테이블
- id (uuid, primary key)
- user_id (uuid, foreign key → users.id)
- content (text) - 메시지 내용
- is_opened (boolean, default: false) - 열람 여부
- opened_date (date, nullable) - 언제 열렸는지
- created_at (timestamp)

## 배포

Vercel에 배포하려면:

```bash
vercel
```

또는 GitHub에 푸시하면 자동으로 배포됩니다.



