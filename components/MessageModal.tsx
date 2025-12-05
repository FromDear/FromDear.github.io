'use client';

import { useEffect, useState } from 'react';

interface Message {
    id: string;
    content: string;
    sender_name?: string;
    created_at?: string;
}

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    messages: Message[];
    date: string;
}

export default function MessageModal({ isOpen, onClose, messages, date }: MessageModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div
                className={`relative bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl shadow-2xl p-6 md:p-8 transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                >
                    ✕
                </button>

                <div className="text-center mb-8">
                    <div className="inline-block px-4 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold mb-3">
                        {date}의 선물 꾸러미 🎁
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                        총 {messages.length}개의 마음이 도착했어요
                    </h3>
                </div>

                <div className="space-y-6">
                    {messages.map((msg, idx) => (
                        <div key={msg.id} className="bg-orange-50 p-6 rounded-2xl border border-orange-100 relative">
                            <div className="absolute -top-3 -left-2 bg-white border border-orange-200 text-orange-500 rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-sm">
                                {idx + 1}
                            </div>
                            <p className="text-lg text-gray-700 font-medium leading-relaxed whitespace-pre-wrap mb-4">
                                {msg.content}
                            </p>
                            <div className="text-right">
                                <span className="text-sm text-gray-500 font-semibold bg-white px-3 py-1 rounded-full border border-orange-100">
                                    From. {msg.sender_name || '익명'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-lg"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
