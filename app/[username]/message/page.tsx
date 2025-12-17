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
            // params.username is actually link_id
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('link_id', params.username) // Use link_id for lookup
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
            const { error } = await supabase.from('messages').insert({
                user_id: user.id,
                content,
                sender_name: senderName || '익명',
                opened_date: null, // No lock
                is_opened: false // Initially unread
            });

            if (error) throw error;

            alert(`마음의 선물이 성공적으로 전달되었어요! 🎁`);
            router.push(`/${params.username}`);

        } catch (error: any) {
            console.error(error);
            alert('선물 전송에 실패했어요.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;

    return (
        <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 py-10 px-4">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border-2 border-red-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {user.username}님에게 마음 선물하기 🎁
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        따뜻한 크리스마스 인사를 남겨주세요.<br />
                        친구에게 바로 배달됩니다.
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
                            placeholder="여기에 소중한 마음을 담아주세요..."
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
                        className="w-full py-3 bg-gradient-to-r from-red-500 to-green-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                        {loading ? '포장 중...' : '선물 보내기 🎁'}
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
