'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import SnowEffect from '@/components/SnowEffect';

export default function PublicCalendarPage({ params }: { params: { username: string } }) {
    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            // Note: params.username actually contains the link_id
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('link_id', params.username) // Query by link_id
                .single();

            if (profile) {
                setUser(profile);

                const { data: msgs } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('user_id', profile.id)
                    .order('created_at', { ascending: false });

                if (msgs) {
                    setMessages(msgs);
                }
            }
            setLoading(false);
        };

        fetchData();
    }, [params.username]);

    const handleMessageClick = async (msg: any) => {
        setSelectedMessage(msg);

        // Mark as opened if not already
        if (!msg.is_opened) {
            await supabase
                .from('messages')
                .update({ is_opened: true })
                .eq('id', msg.id);

            // Update local state to reflect read status
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
                    <div className="inline-block px-4 py-1 bg-white/80 backdrop-blur-sm rounded-full text-red-600 text-sm font-medium mb-4 shadow-sm border border-white">
                        FromDear 🎄 Merry Christmas
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        <span className="text-green-600">{user.username}</span>님의
                        <br className="md:hidden" /> 크리스마스 선물 상자 🎁
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto font-medium">
                        따뜻한 마음이 배달왔어요.<br />
                        도착한 선물들을 열어보세요!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href={`/${params.username}/message`}
                            className="inline-block px-10 py-4 bg-gradient-to-r from-red-600 to-green-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg animate-pulse"
                        >
                            나도 선물 보내기 🎁
                        </Link>
                    </div>
                </div>

                {/* 메시지 리스트 영역 */}
                <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-6 md:p-12 shadow-2xl border border-white/60 min-h-[400px]">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20">
                            <div className="text-6xl mb-6 opacity-50">📭</div>
                            <h3 className="text-2xl font-bold text-gray-600 mb-2">아직 도착한 선물이 없어요</h3>
                            <p className="text-gray-500">가장 먼저 친구에게 마음을 선물해보세요!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {messages.map((msg, idx) => (
                                <div
                                    key={msg.id}
                                    onClick={() => handleMessageClick(msg)}
                                    className="aspect-square bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden group cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center"
                                >
                                    <span className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                        {msg.is_opened ? '🧸' : '🎁'}
                                    </span>
                                    <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                        {msg.sender_name || '익명'}
                                    </span>
                                    {!msg.is_opened && (
                                        <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/" className="text-gray-500 hover:text-red-600 font-bold border-b-2 border-transparent hover:border-red-600 transition-all text-lg">
                        나도 선물 상자 만들기 →
                    </Link>
                </div>
            </div>

            {/* Message Reading Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedMessage(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl transform transition-all scale-100 relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedMessage(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="text-center mb-8">
                            <div className="text-4xl mb-4">🎁</div>
                            <h3 className="text-2xl font-bold text-gray-900 text-balance break-keep">
                                {selectedMessage.sender_name || '익명'}님이 보낸 선물
                            </h3>
                            <p className="text-gray-400 text-sm mt-2">
                                {new Date(selectedMessage.created_at).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto mb-6">
                            {selectedMessage.content}
                        </div>

                        <button
                            onClick={() => setSelectedMessage(null)}
                            className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
