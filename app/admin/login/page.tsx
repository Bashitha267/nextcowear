'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
    const { login, isAdmin, loading: authLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && isAdmin) {
            router.push('/admin');
        }
    }, [authLoading, isAdmin, router]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            // Redirection is handled in AuthContext
        } catch (err: any) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-gray-900">
            {/* Background with Blur - Darker Theme for Admin */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10 flex flex-col items-center text-white">
                <div className="w-16 h-16 bg-gold-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-gold-500/30">
                    <Lock className="text-gold-400 w-8 h-8" />
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-white mb-2 tracking-wide">Admin Portal</h1>
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-[0.2em]">Restricted Access</p>
                </div>

                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-medium placeholder:text-gray-600"
                                placeholder="admin@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-medium placeholder:text-gray-600"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-xs font-medium text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-linear-to-r from-gold-500 to-gold-600 text-black py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold-400 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-gold-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? 'Authenticating...' : 'Access Dashboard'}
                    </button>
                </form>

                {/* Demo Credentials Note */}
                <div className="mt-8 text-center">
                    <p className="text-[10px] text-gray-600">
                        Credentials: <span className="text-gray-500">admin@gmail.com</span> / <span className="text-gray-500">admin123</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
