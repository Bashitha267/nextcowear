"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Phone, MapPin, Building, ArrowRight, Loader2 } from 'lucide-react';

export default function Signup() {
    const router = useRouter();
    const { signup } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        email: '',
        password: '',
        phone_number: '', // WhatsApp
        address: '',
        town: '', // Closest Town
        secondary_phone: '', // Optional
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signup(formData);
            // Redirect is handled in AuthContext
        } catch (error: any) {
            console.error(error);
            // Error is displayed by AuthContext
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 relative flex items-center justify-center px-4 overflow-hidden bg-gray-900 text-white">
            {/* Back Link */}
            <Link href="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-gray-400 hover:text-gold-500 transition-colors font-medium text-sm">
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to Website
            </Link>

            {/* Background with Blur */}
            <div className="absolute inset-0 z-0">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="relative z-10 max-w-2xl w-full bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10 flex flex-col items-center">
                <div className="w-20 h-20 bg-gold-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white/5">
                    <User className="text-gold-400 w-10 h-10" />
                </div>

                <h1 className="text-3xl font-serif font-bold text-white uppercase tracking-widest text-center mb-2">Create Account</h1>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em] mb-10">Join the DressCo family</p>

                <form onSubmit={handleSignup} className="w-full space-y-6 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name *</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                <input
                                    name="first_name"
                                    required
                                    type="text"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-medium placeholder:text-gray-600"
                                    placeholder="Sarah"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">WhatsApp Number *</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                <input
                                    name="phone_number"
                                    required
                                    type="tel"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-medium placeholder:text-gray-600"
                                    placeholder="+94 7X XXX XXXX"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address *</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input
                                name="email"
                                required
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-medium placeholder:text-gray-600"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password *</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input
                                name="password"
                                required
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-medium placeholder:text-gray-600"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Shipping Address *</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-4 text-gray-500 w-4 h-4" />
                            <textarea
                                name="address"
                                required
                                rows={2}
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-medium resize-none placeholder:text-gray-600 text-left"
                                placeholder="Street address, P.O. box, etc."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Closest Town *</label>
                            <div className="relative">
                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                <input
                                    name="town"
                                    required
                                    type="text"
                                    value={formData.town}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-medium placeholder:text-gray-600"
                                    placeholder="e.g. Negombo"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alternative Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                <input
                                    name="secondary_phone"
                                    type="tel"
                                    value={formData.secondary_phone}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-medium placeholder:text-gray-600"
                                    placeholder="+94 7X XXX XXXX"
                                />
                            </div>
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
                                <span>Sign Up</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-400 font-medium pt-4">
                        Already have an account? <Link href="/login" className="text-gold-500 font-bold hover:underline">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
