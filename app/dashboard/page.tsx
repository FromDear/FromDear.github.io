'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import SnowEffect from '@/components/SnowEffect';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<any>(null);

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

            if (!profile) {
                // User logged in but no profile -> Go to onboarding
                router.push('/onboarding');
                return;
            }

            setUser(profile);

            // Fetch messages
            const { data: msgs } = await supabase
                .from('messages')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (msgs) {
                setMessages(msgs);
            }
            setLoading(false);
        };

        checkUser();
    }, [router]);

    const copyLink = () => {
        if (!user || !user.link_id) return;
        const url = `${window.location.origin}/${user.link_id}`;
        navigator.clipboard.writeText(url);
        setCopySuccess('링크가 복사되었습니다!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleMessageClick = async (msg: any) => {
        setSelectedMessage(msg);

        if (!msg.is_opened) {
            await supabase
                .from('messages')
                .update({ is_opened: true })
                .eq('id', msg.id);

            setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_opened: true } : m));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 py-10 px-4 overflow-hidden relative">
            <SnowEffect />

            <div className="max-w-5xl mx-auto relative z-10">
                <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="text-center md:text-left">
                        <div className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold mb-2">
                            Merry Christmas 🎄
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                            {user?.username}님의 선물 상자 🎁
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">
                            지금까지 <span className="text-red-600 font-bold">{messages.length}</span>개의 마음을 받았어요!
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <button
                            onClick={copyLink}
                            className="flex-1 md:flex-none px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            {copySuccess ? '✅ 복사 완료!' : '🔗 내 우체통 링크 복사'}
                        </button>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                router.push('/');
                            }}
                            className="px-6 py-3 text-gray-500 hover:text-red-600 font-medium transition-colors"
                        >
                            로그아웃
                        </button>
                    </div>
                </header>

                <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-6 md:p-12 shadow-2xl border border-white/60 min-h-[500px]">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-32">
                            <div className="text-7xl mb-6 opacity-30 animate-bounce">🎁</div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-2">아직 도착한 선물이 없어요</h3>
                            <p className="text-gray-500 mb-8">친구들에게 링크를 공유해보세요!</p>
                            <button
                                onClick={copyLink}
                                className="px-8 py-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg hover:bg-red-700 hover:-translate-y-1 transition-all"
                            >
                                링크 공유하고 선물 받기 📮
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {messages.map((msg, idx) => (
                                <div
                                    key={msg.id}
                                    onClick={() => handleMessageClick(msg)}
                                    className={`
                                        aspect-square rounded-3xl p-6 shadow-lg relative overflow-hidden group cursor-pointer transition-all duration-300 flex flex-col items-center justify-center
                                        ${msg.is_opened ? 'bg-white' : 'bg-red-50 border-2 border-red-100'}
                                        hover:-translate-y-2 hover:shadow-2xl
                                    `}
                                >
                                    <span className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                        {msg.is_opened ? '🧸' : '🎁'}
                                    </span>
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${msg.is_opened ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-600'}`}>
                                        {msg.sender_name || '익명'}
                                    </span>

                                    {!msg.is_opened && (
                                        <div className="absolute top-4 right-4 w-3 h-3 bg-red-600 rounded-full animate-ping" />
                                    )}

                                    <span className="absolute bottom-4 text-xs text-gray-400 font-mono">
                                        {new Date(msg.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-10 text-center">
                    <p className="text-gray-500 mb-4">
                        친구들에게 링크를 공유하고 더 많은 메시지를 받아보세요!
                    </p>
                    <div className="inline-block bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-500 text-sm">
                        {window.location.origin}/{user?.link_id}
                    </div>
                </div>
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMessage(null)}>
                    <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl transform transition-all scale-100 relative translate-y-0" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedMessage(null)}
                            className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 transition-colors"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="text-center mb-8 pt-4">
                            <div className="text-5xl mb-6">🎄</div>
                            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                                <span className="text-red-600">{selectedMessage.sender_name || '익명'}</span>님이 보낸<br />
                                마음의 선물입니다
                            </h3>
                            <p className="text-gray-400 text-sm mt-3 font-medium">
                                {new Date(selectedMessage.created_at).toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-[#FFFDF5] p-8 rounded-2xl text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[50vh] overflow-y-auto mb-8 text-lg border border-red-50 shadow-inner">
                            {selectedMessage.content}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                            >
                                닫기
                            </button>
                            {/* 추후 답장 기능이나 이미지 저장 기능 추가 가능 */}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
