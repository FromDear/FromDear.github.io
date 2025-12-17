'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth');
                return;
            }
            setCurrentUser(session.user);
        };
        getUser();
    }, [router]);

    const generateLinkId = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Nicknames (username column) can be duplicates now.
            // We use the User ID (UUID) for the unique URL.

            let uniqueLinkId = '';
            let isUnique = false;

            // Generate unique Link ID with collision check
            while (!isUnique) {
                uniqueLinkId = generateLinkId();
                const { data } = await supabase
                    .from('users')
                    .select('link_id')
                    .eq('link_id', uniqueLinkId)
                    .single();

                if (!data) {
                    isUnique = true;
                }
            }

            const { error } = await supabase
                .from('users')
                .insert({
                    id: currentUser.id,
                    username: username, // Display Name
                    link_id: uniqueLinkId, // Unique Random URL ID
                    created_at: new Date().toISOString(),
                });

            if (error) throw error;

            router.push('/dashboard');
        } catch (error: any) {
            console.error('Error:', error);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-red-100">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        반가워요! 👋
                    </h1>
                    <p className="text-gray-600">
                        선물 상자에 사용할 이름을<br />
                        정해주세요.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            내 이름 (또는 별명)
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            maxLength={20}
                            placeholder="예: 산타할아버지, 루돌프"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-center text-lg font-bold"
                        />
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            * 영문, 한글, 숫자 모두 가능해요 (20자 이내)
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !username.trim()}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                        {loading ? '저장 중...' : '시작하기 🚀'}
                    </button>
                </form>
            </div>
        </main>
    );
}
