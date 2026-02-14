"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Loader2, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    sender_type: 'user' | 'admin';
    content: string;
    created_at: string;
}

const RECOMMENDED_QUESTIONS = [
    'Track my order',
    'Return policy',
    'Shipping info',
    'Contact support'
];

export default function ChatWidget() {
    const { user, setIsLoginModalOpen } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial load and conversation setup
    useEffect(() => {
        if (user && isOpen && !conversationId) {
            setupConversation();
        }
    }, [user, isOpen]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // Real-time subscription
    useEffect(() => {
        if (!conversationId) return;

        const subscription = supabase
            .channel(`chat:${conversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
                filter: `conversation_id=eq.${conversationId}`
            }, (payload) => {
                const newMessage = payload.new as Message;
                setMessages(prev => {
                    if (prev.find(m => m.id === newMessage.id)) return prev;
                    return [...prev, newMessage];
                });
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [conversationId]);

    const setupConversation = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Check if conversation exists
            let { data: conversation, error } = await supabase
                .from('chat_conversations')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (!conversation) {
                // Create new conversation
                const { data: newConv, error: createError } = await supabase
                    .from('chat_conversations')
                    .insert([{ user_id: user.id }])
                    .select()
                    .single();
                if (createError) throw createError;
                conversation = newConv;
            }

            setConversationId(conversation?.id || null);

            // Load relative messages
            if (conversation?.id) {
                const { data: msgs, error: msgsError } = await supabase
                    .from('chat_messages')
                    .select('*')
                    .eq('conversation_id', conversation.id)
                    .order('created_at', { ascending: true });

                if (msgsError) throw msgsError;
                setMessages(msgs || []);
            }
        } catch (error: any) {
            console.error('Chat error:', error);
            toast.error('Could not load chat');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e?: React.FormEvent, customContent?: string) => {
        if (e) e.preventDefault();
        const content = customContent || inputValue.trim();

        if (!content || !conversationId || !user) return;

        if (!customContent) setInputValue('');

        try {
            const { data: newMessage, error } = await supabase
                .from('chat_messages')
                .insert([{
                    conversation_id: conversationId,
                    sender_id: user.id,
                    sender_type: 'user',
                    content: content
                }])
                .select()
                .single();

            if (error) throw error;

            // Optimistic update (just in case subscription is slow or fails)
            if (newMessage) {
                setMessages(prev => {
                    if (prev.find(m => m.id === newMessage.id)) return prev;
                    return [...prev, newMessage];
                });

                // Trigger auto-reply
                sendAutoReply(conversationId);
            }

            // Simple update for last message
            await supabase
                .from('chat_conversations')
                .update({
                    last_message: content,
                    last_message_at: new Date().toISOString()
                })
                .eq('id', conversationId);

        } catch (error: any) {
            toast.error('Failed to send message');
            if (!customContent) setInputValue(content);
        }
    };

    const sendAutoReply = async (convId: string) => {
        setTimeout(async () => {
            try {
                // Try to find a system admin user to send the reply from
                // Ideally this should be a specific bot user, but we'll try to find an admin
                // or just use a system placeholder if RLS allows (likely won't, so we need a real ID)
                // For now, we will simulate it on the client for the user's benefit

                // 1. Check if we already have a recent admin message to avoid spam
                const { data: recent } = await supabase
                    .from('chat_messages')
                    .select('*')
                    .eq('conversation_id', convId)
                    .eq('sender_type', 'admin')
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (recent && recent.length > 0) {
                    const lastMsgTime = new Date(recent[0].created_at).getTime();
                    const now = new Date().getTime();
                    if (now - lastMsgTime < 60000) return; // Don't auto-reply if admin replied in last minute
                }

                // 2. Fetch an admin ID (any admin)
                // This query might fail if public users can't read users table (likely)
                // If so, we can't persist the auto-reply easily from client without an Edge Function.
                // We will optimistic-add it to local state to show "Staff will contact you soon".

                const replyContent = "Thank you for your message. Our staff will contact you soon.";

                // Attempt to insert if we can (this might fail due to RLS)
                // We'll skip the insert for now to avoid errors and just show a Toast or local message?
                // The requirements say "automatically reply him".
                // Best effort: Insert with current user ID but sender_type='admin' (might be blocked)
                // or just leave it. 
                // Let's trying creating a message object locally for display only if we can't save it.

                const autoReplyMsg: Message = {
                    id: 'auto-reply-' + Date.now(),
                    conversation_id: convId,
                    sender_id: 'system',
                    sender_type: 'admin',
                    content: replyContent,
                    created_at: new Date().toISOString()
                };

                setMessages(prev => [...prev, autoReplyMsg]);

            } catch (err) {
                console.error("Auto reply error", err);
            }
        }, 1500);
    };

    const handleQuickQuestion = (question: string) => {
        handleSendMessage(undefined, question);
    };

    return (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-9999 flex flex-col items-end max-w-full">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[calc(100vw-32px)] md:w-[380px] h-[70vh] md:h-[550px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-linear-to-r from-gray-900 to-gray-800 p-6 text-white flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center border border-gold-500/30">
                                <User className="text-gold-400 w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-widest uppercase">Support</h3>
                                {/* Online Status Removed */}
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50"
                    >
                        {!user ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                <div className="w-16 h-16 bg-gold-50 rounded-full flex items-center justify-center mb-4">
                                    <User className="text-gold-600 w-8 h-8" />
                                </div>
                                <h4 className="text-gray-900 font-bold text-sm uppercase tracking-widest mb-2">Member Chat</h4>
                                <p className="text-xs text-gray-500 leading-relaxed mb-6">Please sign in to your account to start a conversation with our support team.</p>
                                <button
                                    onClick={() => setIsLoginModalOpen(true)}
                                    className="px-8 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold-600 transition-all shadow-lg active:scale-95"
                                >
                                    Sign In to Chat
                                </button>
                            </div>
                        ) : user.role === 'admin' ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                                    <MessageCircle className="text-purple-600 w-8 h-8" />
                                </div>
                                <h4 className="text-gray-900 font-bold text-sm uppercase tracking-widest mb-2">Admin Mode</h4>
                                <p className="text-xs text-gray-500 leading-relaxed mb-6">You are signed in as an administrator. Please use the Admin Dashboard to reply to customer messages.</p>
                                <button
                                    onClick={() => window.location.href = '/admin/messages'}
                                    className="px-8 py-3 bg-purple-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg active:scale-95"
                                >
                                    Go to Messages
                                </button>
                            </div>
                        ) : loading ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                <div className="w-16 h-16 bg-gold-50 rounded-full flex items-center justify-center mb-4">
                                    <MessageCircle className="text-gold-600 w-8 h-8" />
                                </div>
                                <h4 className="text-gray-900 font-bold text-sm uppercase tracking-widest mb-2">Hello!</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">System is online. How can we help you today?</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-xs ${msg.sender_type === 'user'
                                        ? 'bg-gray-900 text-white rounded-tr-none'
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                        }`}>
                                        <p className="leading-relaxed">{msg.content}</p>
                                        <span className={`text-[9px] mt-1.5 block opacity-50 font-medium ${msg.sender_type === 'user' ? 'text-right' : 'text-left'
                                            }`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Area */}
                    {user && user.role !== 'admin' && (
                        <div className="bg-white border-t border-gray-100 flex flex-col">
                            {/* Recommended Questions */}
                            <div className="px-4 pt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                {RECOMMENDED_QUESTIONS.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleQuickQuestion(q)}
                                        className="whitespace-nowrap px-3 py-1.5 bg-gray-100 hover:bg-gold-50 hover:text-gold-600 hover:border-gold-200 border border-transparent rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-600 transition-all active:scale-95"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                            <form
                                onSubmit={handleSendMessage}
                                className="p-4 flex items-center gap-3 pt-2"
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium placeholder:text-gray-400"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="w-11 h-11 bg-gold-500 hover:bg-gold-600 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:grayscale"
                                >
                                    <Send size={18} className="ml-0.5" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 relative ${isOpen ? 'bg-gray-900 rotate-90' : 'bg-gold-600 hover:bg-gold-500'
                    }`}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full animate-bounce hidden"></span>
                )}
            </button>
        </div >
    );
}
