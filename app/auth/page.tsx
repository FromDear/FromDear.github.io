'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleSocialLogin = async (provider: 'kakao' | 'google') => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-red-100">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block transform hover:scale-105 transition-transform duration-300">
            <h1 className="text-4xl font-black bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-2">
              FromDear
            </h1>
          </Link>
          <h2 className="text-xl font-bold text-gray-800 mt-4">
            나만의 선물 상자 만들기 🎁
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            3초 만에 로그인하고<br />
            익명의 선물을 받아보세요!
          </p>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Kakao Login */}
          <button
            type="button"
            onClick={() => handleSocialLogin('kakao')}
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-4 bg-[#FAE100] text-[#371D1E] font-bold rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C5.925 3 1 6.925 1 11.775C1 14.75 3.0625 17.375 6.0875 18.8875L5.05 22.825C4.9875 23.0125 5.2 23.1875 5.375 23.075L10.025 20C10.6625 20.075 11.325 20.125 12 20.125C18.075 20.125 23 16.2 23 11.35C23 6.5 18.075 3 12 3Z" />
            </svg>
            카카오로 3초 만에 시작하기
          </button>

          {/* Google Login */}
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            구글로 시작하기
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm border-b border-transparent hover:border-gray-600 transition-all">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
