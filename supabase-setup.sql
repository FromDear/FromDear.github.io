-- FromDear 데이터베이스 스키마 설정

-- users 테이블 생성 (Supabase Auth와 연동)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- messages 테이블 생성
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender_name TEXT, -- 보낸 사람 이름 (익명일 경우 '익명' 또는 NULL)
  is_opened BOOLEAN DEFAULT FALSE,
  opened_date DATE, -- 열람 가능한 날짜 (1~25일)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_opened_date ON public.messages(opened_date);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

-- RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS 정책: Users
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.users FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

-- RLS 정책: Messages
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.messages;
CREATE POLICY "Anyone can insert messages" 
ON public.messages FOR INSERT 
WITH CHECK (true);

-- [수정됨] 누구나 메시지를 읽을 수 있음 (캘린더 상태 표시를 위해)
-- 주의: 실제 서비스에서는 content 컬럼을 숨기는 View를 사용하거나 RPC를 사용해야 함.
-- 현재 MVP에서는 클라이언트에서 content를 보여주지 않는 것으로 처리.
DROP POLICY IF EXISTS "Users can read own messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can read messages" ON public.messages;
CREATE POLICY "Anyone can read messages" 
ON public.messages FOR SELECT 
USING (true);

-- Auth Hook: 새 유저 가입 시 public.users에 자동 추가
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger 설정
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
