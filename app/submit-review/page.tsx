'use client';

import { useState } from 'react';
import { Star, Send, Loader2, CheckCircle2, ArrowLeft, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function SubmitReviewPage() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        author_name: '',
        title: '',
        content: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a star rating');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase.from('site_reviews').insert([{
                ...formData,
                rating,
                is_approved: false
            }]);

            if (error) throw error;
            setSubmitted(true);
            toast.success('Your review has been submitted for moderation!');
        } catch (error: any) {
            console.error('Error submitting review:', error);
            toast.error(error.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gold-100 p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-serif font-bold text-gray-900">Thank You!</h2>
                        <p className="text-gray-600">Your feedback is incredibly valuable to us. Our team will review your submission shortly.</p>
                    </div>
                    <Link
                        href="/"
                        className="block w-full py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-gold-200"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-12 px-6">
            <div className="max-w-xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gold-600 transition-colors font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Store
                    </Link>
                </div>

                <div className="bg-white rounded-[2rem] shadow-2xl shadow-gold-100/50 overflow-hidden border border-gold-50">
                    <div className="bg-gold-500 p-10 text-center space-y-3">
                        <MessageSquare className="w-12 h-12 text-white/90 mx-auto" />
                        <h1 className="text-4xl font-serif font-bold text-white leading-tight">Share Your Experience</h1>
                        <p className="text-white/80 font-medium">We'd love to hear your thoughts on DressCo.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                        {/* Rating */}
                        <div className="text-center space-y-4">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Rate our service</p>
                            <div className="flex justify-center gap-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="transform transition-all active:scale-95 duration-200"
                                    >
                                        <Star
                                            className={`w-10 h-10 ${star <= (hover || rating) ? 'text-gold-500 fill-gold-500 scale-110' : 'text-gray-200'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm font-semibold text-gold-600 h-5">
                                {rating > 0 && ['Poor', 'Fair', 'Good', 'Excellent', 'Exceptional'][rating - 1]}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 ml-1">Your Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.author_name}
                                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-gold-500 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-gray-400 font-medium"
                                    placeholder="e.g., Sarah Johnson"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 ml-1">Review Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-gold-500 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-gray-400 font-medium"
                                    placeholder="Summarize your experience"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 ml-1">Tell us more *</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-gold-500 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-gray-400 font-medium resize-none"
                                    placeholder="What did you like about our products or service?"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-5 bg-gold-500 hover:bg-gold-600 text-white rounded-[1.5rem] font-bold text-lg transition-all shadow-xl shadow-gold-200 flex items-center justify-center gap-3 disabled:bg-gold-300 disabled:shadow-none translate-y-0 active:translate-y-1"
                        >
                            {submitting ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Review
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-400 text-xs px-12 leading-relaxed">
                    By submitting your review, you agree to our Terms of Service. Your review will be moderated before appearing live on our storefront.
                </p>
            </div>
        </div>
    );
}
