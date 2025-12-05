'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import CalendarGrid from '@/components/CalendarGrid';
import Link from 'next/link';
import SnowEffect from '@/components/SnowEffect';

export default function PublicCalendarPage({ params }: { params: { username: string } }) {
    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('username', decodeURIComponent(params.username))
                .single();

            if (profile) {
                setUser(profile);

                const { data: msgs } = await supabase
                    .from('messages')
                    .select('id, opened_date, is_opened, user_id')
                    .eq('user_id', profile.id);

                if (msgs) {
                    setMessages(msgs);
                }
            }
            setLoading(false);
        };

        fetchData();
    }, [params.username]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center px-4">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">사용자를 찾을 수 없어요 😢</h1>
                <p className="text-gray-600 mb-8">주소가 올바른지 확인해주세요.</p>
                <Link href="/" className="px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors shadow-lg">
                    홈으로 가기
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen relative bg-gradient-to-br from-red-50 via-white to-green-50 py-10 px-4 overflow-hidden">
            <SnowEffect />

            <div className="relative z-10 max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-block px-4 py-1 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 text-sm font-medium mb-4 shadow-sm border border-white">
                        FromDear 🎄 Christmas D-7
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        <span className="text-red-600">{user.username}</span>님의 크리스마스
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto font-medium">
                        따뜻한 메시지를 남겨주세요.<br />
                        12월 19일부터 매일 하나씩 선물 상자가 열립니다.
                    </p>

                    <Link
                        href={`/${user.username}/message`}
                        className="inline-block px-10 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg animate-pulse"
                    >
                        선물 상자에 메시지 넣기 🎁
                    </Link>
                </div>

                <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-6 md:p-12 shadow-2xl border border-white/60">
                    <CalendarGrid
                        messages={messages}
                        isOwner={false}
                        username={user.username}
                    />
                </div>

                <div className="mt-16 text-center">
                    <Link href="/" className="text-gray-500 hover:text-red-600 font-bold border-b-2 border-transparent hover:border-red-600 transition-all text-lg">
                        나도 캘린더 만들기 →
                    </Link>
                </div>
            </div>
        </main>
    );
}
