'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MessageModal from './MessageModal';

interface Message {
    id: string;
    content: string;
    sender_name?: string;
    opened_date: string; // YYYY-MM-DD
    is_opened: boolean;
}

interface CalendarGridProps {
    messages: Message[];
    isOwner: boolean;
    username: string;
}

export default function CalendarGrid({ messages, isOwner, username }: CalendarGridProps) {
    const router = useRouter();
    const [selectedMessages, setSelectedMessages] = useState<Message[] | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');

    const TARGET_DATES = [
        { day: 19, label: 'D-7' },
        { day: 20, label: 'D-6' },
        { day: 21, label: 'D-5' },
        { day: 22, label: 'D-4' },
        { day: 23, label: 'D-3' },
        { day: 24, label: 'D-2' },
        { day: 25, label: 'D-Day' },
    ];

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    const getMessagesForDay = (day: number) => {
        return messages.filter(m => {
            const d = new Date(m.opened_date);
            return d.getDate() === day;
        });
    };

    const handleBoxClick = (day: number, dayMessages: Message[]) => {
        if (!isOwner) {
            router.push(`/${username}/message`);
            return;
        }

        const isUnlockable = (currentMonth === 12 && currentDay >= day) || (currentMonth !== 12 && currentMonth !== 11);

        if (isUnlockable) {
            if (dayMessages.length > 0) {
                setSelectedMessages(dayMessages);
                setSelectedDate(`12월 ${day}일`);
            } else {
                alert('아직 도착한 선물이 없어요! 텅 비어있네요 😢');
            }
        } else {
            const dDay = day - currentDay;
            alert(`아직 열 수 없어요! ${dDay}일만 더 기다려주세요 🔒`);
        }
    };

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto p-4">
                {TARGET_DATES.map((target, idx) => {
                    const dayMessages = getMessagesForDay(target.day);
                    const count = dayMessages.length;

                    const isUnlockable = (currentMonth === 12 && currentDay >= target.day) || (currentMonth !== 12 && currentMonth !== 11);
                    let status = 'locked';
                    if (isUnlockable) status = 'unlocked';

                    const isLast = idx === 6;

                    return (
                        <div
                            key={target.day}
                            onClick={() => handleBoxClick(target.day, dayMessages)}
                            className={`
                relative aspect-[4/5] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 transform hover:-translate-y-2 group
                ${isLast ? 'col-span-2 md:col-span-1 md:col-start-4' : ''}
                ${status === 'locked'
                                    ? 'bg-gradient-to-br from-red-600 to-red-800 shadow-[0_10px_20px_rgba(220,38,38,0.3)] border-b-8 border-red-900'
                                    : 'bg-gradient-to-br from-green-600 to-green-800 shadow-[0_10px_20px_rgba(22,163,74,0.3)] border-b-8 border-green-900'}
              `}
                        >
                            {/* 3D Ribbon Effect */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-white/20 shadow-sm"></div>
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-8 bg-white/20 shadow-sm"></div>

                            {/* Bow Tie (CSS Art) */}
                            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                <div className="relative">
                                    <div className="absolute -left-6 -top-2 w-6 h-6 bg-yellow-400 rounded-full shadow-md transform -rotate-12"></div>
                                    <div className="absolute left-0 -top-2 w-6 h-6 bg-yellow-400 rounded-full shadow-md transform rotate-12"></div>
                                    <div className="w-4 h-4 bg-yellow-300 rounded-full relative z-10 shadow-inner"></div>
                                </div>
                            </div>

                            {/* Label Badge */}
                            <div className="absolute top-3 left-3 bg-white/90 text-red-600 text-xs font-bold px-2 py-1 rounded-md shadow-sm z-20">
                                {target.label}
                            </div>

                            {/* Date Number */}
                            <div className="mt-8 text-5xl font-black text-white drop-shadow-md z-10 font-mono">
                                {target.day}
                            </div>

                            {/* Message Count Badge */}
                            {count > 0 && (
                                <div className="absolute bottom-4 right-4 bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full text-sm shadow-lg animate-bounce z-20 border-2 border-yellow-200">
                                    🎁 {count}
                                </div>
                            )}

                            {/* Locked Overlay */}
                            {status === 'locked' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl z-0">
                                    <span className="text-4xl opacity-40 mix-blend-overlay">🔒</span>
                                </div>
                            )}

                            {/* Hover Glow */}
                            <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
                        </div>
                    );
                })}
            </div>

            {selectedMessages && (
                <MessageModal
                    isOpen={!!selectedMessages}
                    onClose={() => setSelectedMessages(null)}
                    messages={selectedMessages}
                    date={selectedDate}
                />
            )}
        </>
    );
}
