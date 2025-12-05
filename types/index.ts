// 사용자 타입
export interface User {
  id: string
  username: string
  email: string
  created_at: string
}

// 메시지 타입
export interface Message {
  id: string
  user_id: string
  content: string
  is_opened: boolean
  opened_date: string | null
  created_at: string
}



