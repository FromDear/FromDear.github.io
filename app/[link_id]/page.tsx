
import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import GiftBoxClient from './GiftBoxClient';

type Props = {
    params: { link_id: string }
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const link_id = params.link_id;
    const cookieStore = cookies();

    // Server-side Supabase client for Metadata
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    const { data: user } = await supabase
        .from('users')
        .select('username')
        .eq('link_id', link_id)
        .single();

    const username = user?.username || '익명';

    return {
        title: `${username}님의 크리스마스 선물 상자 🎁`,
        description: `${username}님에게 따뜻한 마음을 담은 선물을 보내보세요!`,
        openGraph: {
            title: `${username}님의 크리스마스 선물 상자 🎁`,
            description: `${username}님에게 따뜻한 마음을 담은 선물을 보내보세요!`,
        },
    };
}

export default function Page({ params }: Props) {
    return <GiftBoxClient params={params} />;
}

