"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Loader2, User } from 'lucide-react';

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            // Redirect is handled in AuthContext but we can do it here too if needed, 
            // but AuthContext handles admin/user redirect.
        } catch (error: any) {
            // Error is displayed by AuthContext toast usually, but we can catch here too.
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 relative flex items-center justify-center px-4 overflow-hidden bg-trans text-white">
            {/* Back Link */}
            <Link href="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-gray-400 hover:text-gold-500 transition-colors font-medium text-sm">
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to Website
            </Link>

            {/* Background with Blur */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="relative z-10 max-w-md w-full bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10 flex flex-col items-center">
                <div className="w-20 h-20 bg-gold-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white/5">
                    <User className="text-gold-400 w-10 h-10" />
                </div>

                <h1 className="text-3xl font-serif font-bold text-white uppercase tracking-widest text-center mb-2">Welcome Back</h1>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em] mb-10">Sign in to your account</p>

                <form onSubmit={handleLogin} className="w-full space-y-6 text-left">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-medium placeholder:text-gray-600"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-medium placeholder:text-gray-600"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="text-right">
                            <Link href="/forgot-password" title="sm" className="text-[10px] font-bold text-gold-600 uppercase tracking-widest hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-linear-to-r from-gold-500 to-gold-600 text-black py-4 rounded-xl text-xs font-bold tracking-[0.4em] uppercase hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-gold-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
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

                    <p className="text-center text-sm text-gray-400 font-medium pt-4">
                        Don't have an account? <Link href="/signup" className="text-gold-500 font-bold hover:underline">Create One</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
