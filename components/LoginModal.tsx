"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, User, X } from 'lucide-react';
import Link from 'next/link';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            onClose();
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-1002 flex items-center justify-center px-4">
            {/* Backdrop with Blur */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-lg transition-opacity duration-500"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative z-10 max-w-md w-full  bg-gold-600/10 border border-white/10 rounded-[2.5rem] shadow-2xl p-8 md:p-12 flex flex-col items-center animate-in zoom-in-95 fade-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all group"
                >
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="w-20 h-20 bg-gold-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white/5">
                    <User className="text-gold-400 w-10 h-10" />
                </div>

                <div className="text-center mb-10 text-white">
                    <h2 className="text-3xl font-serif font-bold uppercase tracking-widest mb-2">Welcome Back</h2>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">Restricted Client Portal</p>
                </div>

                <form onSubmit={handleLogin} className="w-full space-y-6 text-left">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gold-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative text-white">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-700 w-4 h-4" />
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-medium placeholder:text-gray-600"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gold-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-700 w-4 h-4" />
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-medium placeholder:text-gray-600"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="text-right">
                            <Link href="/forgot-password" onClick={onClose} className="text-[10px] font-bold text-gold-500/80 uppercase tracking-widest hover:text-gold-400 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-linear-to-r from-gold-500 to-gold-600 text-black py-4.5 rounded-2xl text-[10px] font-bold tracking-[0.4em] uppercase hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-gold-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group mt-4"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-300 font-medium pt-6">
                        Don't have an account? <Link href="/signup" onClick={onClose} className="text-gold-500 font-bold hover:underline ml-1">Create One</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
