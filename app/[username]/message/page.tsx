'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function MessagePage({ params }: { params: { username: string } }) {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [senderName, setSenderName] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('username', decodeURIComponent(params.username))
                .single();

            if (profile) {
                setUser(profile);
            }
        };
        fetchUser();
    }, [params.username]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || loading) return;
        setLoading(true);

        try {
            // D-7 Logic: Dec 19 ~ Dec 25 (7 Days)
            // Distribution: Round Robin (0 -> 19, 1 -> 20, ... 6 -> 25, 7 -> 19)

            // 1. Get current message count to determine slot
            const { count, error: countError } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            if (countError) throw countError;

            const currentCount = count || 0;
            const slotIndex = currentCount % 7; // 0~6
            const targetDay = 19 + slotIndex; // 19~25

            const dateStr = `2024-12-${targetDay.toString().padStart(2, '0')}`;

            const { error } = await supabase.from('messages').insert({
                user_id: user.id,
                content,
                sender_name: senderName || '익명',
                opened_date: dateStr,
                is_opened: false
            });

            if (error) throw error;

            alert(`메시지가 12월 ${targetDay}일 상자에 담겼어요! 🎁`);
            router.push(`/${params.username}`);

        } catch (error: any) {
            console.error(error);
            alert('메시지 전송에 실패했어요.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;

    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 py-10 px-4">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border-2 border-red-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {user.username}님에게 선물 보내기 🎁
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        메시지는 12월 19일부터 25일 사이<br />
                        선물 상자에 자동으로 담깁니다.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            보내는 사람 (선택)
                        </label>
                        <input
                            type="text"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            placeholder="익명 (비워두면 익명으로 전달돼요)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                            maxLength={20}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            메시지 내용
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            placeholder="따뜻한 크리스마스 인사를 남겨주세요..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all h-40 resize-none"
                            maxLength={500}
                        />
                        <div className="text-right text-xs text-gray-400 mt-1">
                            {content.length}/500
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                        {loading ? '선물 상자에 넣기 🎁' : '메시지 보내기 💌'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href={`/${params.username}`} className="text-sm text-gray-500 hover:text-gray-700">
                        취소하고 돌아가기
                    </Link>
                </div>
            </div>
        </main>
    );
}
