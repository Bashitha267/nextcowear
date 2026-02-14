'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Send, User, Loader2, MessageCircle, ChevronRight, Clock, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface Conversation {
    id: string;
    user_id: string;
    last_message: string;
    last_message_at: string;
    unread_count_admin: number;
    users: {
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
    };
}

interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    sender_type: 'user' | 'admin';
    content: string;
    created_at: string;
}

export default function AdminMessagesPage() {
    const { user: adminUser } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchConversations();

        // Subscribe to new messages globally for list updates
        const channel = supabase
            .channel('admin_all_chats')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, () => {
                fetchConversations();
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_conversations' }, () => {
                fetchConversations();
            })
            .subscribe();

        return () => { channel.unsubscribe(); };
    }, []);

    useEffect(() => {
        if (selectedConv) {
            fetchMessages(selectedConv.id);
            // Mark as read
            markAsRead(selectedConv.id);

            // Subscribe to specific conversation
            const channel = supabase
                .channel(`admin_chat:${selectedConv.id}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `conversation_id=eq.${selectedConv.id}`
                }, (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages(prev => {
                        if (prev.find(m => m.id === newMessage.id)) return prev;
                        return [...prev, newMessage];
                    });
                })
                .subscribe();

            return () => { channel.unsubscribe(); };
        }
    }, [selectedConv]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const { data, error } = await supabase
                .from('chat_conversations')
                .select('*, users(first_name, last_name, email, phone_number)')
                .order('last_message_at', { ascending: false });

            if (error) throw error;
            setConversations(data as any[] || []);
        } catch (error: any) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('conversation_id', id)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages(data || []);
        } catch (error: any) {
            toast.error('Failed to load messages');
        }
    };

    const markAsRead = async (id: string) => {
        await supabase
            .from('chat_conversations')
            .update({ unread_count_admin: 0 })
            .eq('id', id);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !selectedConv || !adminUser) return;

        const content = inputValue.trim();
        setInputValue('');
        setSending(true);

        try {
            const { data: newMessage, error } = await supabase
                .from('chat_messages')
                .insert([{
                    conversation_id: selectedConv.id,
                    sender_id: adminUser.id,
                    sender_type: 'admin',
                    content: content
                }])
                .select()
                .single();

            if (error) throw error;

            if (newMessage) {
                setMessages(prev => {
                    if (prev.find(m => m.id === newMessage.id)) return prev;
                    return [...prev, newMessage as Message];
                });
            }

            await supabase
                .from('chat_conversations')
                .update({
                    last_message: content,
                    last_message_at: new Date().toISOString(),
                    unread_count_user: 1 // Simple notification for user
                })
                .eq('id', selectedConv.id);

        } catch (error: any) {
            toast.error('Failed to send');
            setInputValue(content);
        } finally {
            setSending(false);
        }
    };

    const filteredConversations = conversations.filter(c =>
        c.users.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.users.phone_number && c.users.phone_number.includes(searchTerm)) ||
        (`${c.users.first_name} ${c.users.last_name}`).toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px]">
                <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-140px)] flex bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Sidebar List - Dark Themes */}
            <div className={`${selectedConv ? 'hidden md:flex' : 'flex'} w-full md:w-96 border-r border-gray-800 flex-col bg-gray-900 transition-all duration-300`}>
                <div className="p-6 border-b border-gray-800 bg-gray-900/50">
                    <h1 className="text-2xl font-serif font-bold text-white mb-4">Conversations</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredConversations.length === 0 ? (
                        <div className="p-10 text-center">
                            <MessageCircle className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                            <p className="text-sm text-gray-500 font-medium">No conversations</p>
                        </div>
                    ) : (
                        filteredConversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setSelectedConv(conv)}
                                className={`w-full p-5 text-left border-b border-gray-800/50 transition-all flex items-center justify-between group ${selectedConv?.id === conv.id ? 'bg-gold-500/10 border-l-4 border-l-gold-500' : 'hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    {/* Green Dot for unread messages (Left side) */}
                                    {conv.unread_count_admin > 0 && (
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)] shrink-0"></div>
                                    )}

                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${selectedConv?.id === conv.id ? 'bg-gold-500 text-white' : 'bg-gray-800 text-gold-500'
                                        }`}>
                                        <User size={24} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className={`font-bold truncate ${selectedConv?.id === conv.id ? 'text-white' : 'text-gray-200'}`}>
                                                {conv.users.first_name} {conv.users.last_name}
                                                <span className={`ml-2 text-[10px] font-normal opacity-70 ${selectedConv?.id === conv.id ? 'text-gray-300' : 'text-gray-500'}`}>
                                                    {conv.users.phone_number}
                                                </span>
                                            </h4>
                                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider ml-2">
                                                {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </p>
                                        </div>
                                        <p className={`text-xs truncate mt-0.5 ${conv.unread_count_admin > 0 ? 'text-gold-400 font-bold' : 'text-gray-500'}`}>
                                            {conv.last_message || 'No messages yet'}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area - Light Theme */}
            <div className={`flex-1 flex-col bg-gray-50 ${selectedConv ? 'flex' : 'hidden md:flex'}`}>
                {selectedConv ? (
                    <>
                        {/* Header */}
                        <div className="p-4 md:p-6 border-b border-gray-200 bg-white flex items-center justify-between shadow-xs sticky top-0 z-10">
                            <div className="flex items-center gap-3 md:gap-4">
                                <button
                                    onClick={() => setSelectedConv(null)}
                                    className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-md cursor-pointer">
                                    <User size={20} className="md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900 border-none outline-none text-base md:text-lg leading-tight">
                                        {selectedConv.users.first_name} {selectedConv.users.last_name}
                                    </h2>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{selectedConv.users.phone_number || selectedConv.users.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-10 space-y-6"
                        >
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] ${msg.sender_type === 'admin' ? 'text-right' : 'text-left'}`}>
                                        <div className={`inline-block p-5 rounded-3xl text-sm shadow-sm transition-all hover:shadow-md ${msg.sender_type === 'admin'
                                            ? 'bg-gray-900 text-white rounded-tr-none'
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                                            }`}>
                                            <p className="leading-relaxed">{msg.content}</p>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 px-1 opacity-60">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-6 bg-white border-t border-gray-200 shadow-sm">
                            <form
                                onSubmit={handleSendMessage}
                                className="flex items-center gap-4"
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Write your response here..."
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || sending}
                                    className="w-14 h-14 bg-gold-500 hover:bg-gold-600 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-95 disabled:opacity-50 hover:-rotate-12"
                                >
                                    <Send size={24} className="ml-1" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-20 bg-white">
                        <div className="w-24 h-24 bg-gold-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <MessageCircle className="text-gold-600 w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2 uppercase tracking-widest">Select a Messenger</h2>
                        <p className="text-gray-400 max-w-sm font-medium">Choose a customer from the sidebar to begin providing support in real-time.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
