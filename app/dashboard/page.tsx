'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import CalendarGrid from '@/components/CalendarGrid';
import Link from 'next/link';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState('');

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth');
                return;
            }

            // Fetch user profile to get username
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profile) {
                setUser(profile);

                // Fetch messages
                const { data: msgs } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('user_id', session.user.id);

                if (msgs) {
                    setMessages(msgs);
                }
            }
            setLoading(false);
        };

        checkUser();
    }, [router]);

    const copyLink = () => {
        if (!user) return;
        const url = `${window.location.origin}/${user.username}`;
        navigator.clipboard.writeText(url);
        setCopySuccess('링크가 복사되었습니다!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {user?.username}님의 캘린더 🎄
                        </h1>
                        <p className="text-gray-600 mt-2">
                            지금까지 {messages.length}개의 메시지를 받았어요!
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={copyLink}
                            className="px-6 py-2 bg-white text-red-600 border-2 border-red-200 rounded-full font-semibold hover:bg-red-50 transition-colors shadow-sm"
                        >
                            {copySuccess || '내 링크 복사하기 🔗'}
                        </button>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                router.push('/');
                            }}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
                        >
                            로그아웃
                        </button>
                    </div>
                </header>

                <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-xl border border-white">
                    <CalendarGrid
                        messages={messages}
                        isOwner={true}
                        username={user?.username}
                    />
                </div>

                <div className="mt-10 text-center">
                    <p className="text-gray-500 mb-4">
                        친구들에게 링크를 공유하고 더 많은 메시지를 받아보세요!
                    </p>
                    <div className="inline-block bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-500 text-sm">
                        {window.location.origin}/{user?.username}
                    </div>
                </div>
            </div>
        </main>
    );
}
