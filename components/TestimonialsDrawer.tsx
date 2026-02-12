"use client";

import React, { useState, useEffect } from "react";
import { Star, X, Check, Loader2 } from "lucide-react";
import { getSiteReviews, getProductReviews } from "@/lib/api";

const TestimonialsDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"site" | "product">("site");
    const [siteReviews, setSiteReviews] = useState<any[]>([]);
    const [productReviews, setProductReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const [siteData, productData] = await Promise.all([
                    getSiteReviews(),
                    getProductReviews()
                ]);
                setSiteReviews(siteData);
                setProductReviews(productData);
            } catch (error) {
                console.error("Failed to fetch testimonials", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const currentReviews = activeTab === "site" ? siteReviews : productReviews;

    const averageRating = (reviews: any[]) => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const ratingDistribution = (reviews: any[]) => {
        const counts = [0, 0, 0, 0, 0];
        reviews.forEach(r => {
            if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++;
        });
        return counts.reverse().map((count, i) => ({
            stars: 5 - i,
            count,
            pct: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%'
        }));
    };

    return (
        <>
            {/* Trigger Button */}
            <div className={`fixed left-0 top-1/4 -translate-y-1/2 z-40 transition-transform duration-300 ${isOpen ? 'translate-x-[500px] lg:translate-x-[600px]' : 'translate-x-0'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gray-900 text-white py-4 rounded-r-md shadow-2xl flex flex-col items-center gap-3 hover:bg-gold-600 transition-colors border-y border-r border-white/10"
                    aria-label="Open Reviews"
                >
                    <span className="whitespace-nowrap text-xs font-bold tracking-[0.3em] uppercase -rotate-90 py-6">
                        Reviews
                    </span>
                    <Star size={14} className="fill-white" />
                </button>
            </div>

            {/* Overlay Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-9998 animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer Panel */}
            <div
                className={`fixed top-0 left-0 h-full w-full md:w-[500px] lg:w-[600px] bg-white shadow-2xl z-9999 transform transition-transform duration-500 ease-in-out overflow-hidden flex flex-col border-r border-gold-100 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all active:scale-95 z-10"
                >
                    <X size={24} />
                </button>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-thin scrollbar-thumb-gold-200">
                    <div className="text-center mb-12">
                        <span className="text-gold-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Testimonials</span>
                        <h2 className="text-3xl font-serif text-gray-900 mb-8 uppercase tracking-widest">Customer Voice</h2>

                        <div className="flex flex-col items-center gap-4 mb-8 bg-gold-50/30 py-8 rounded-sm">
                            <span className="text-7xl text-gray-900 font-serif leading-none">
                                {averageRating(currentReviews)}
                            </span>
                            <div className="flex gap-1 text-gold-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} className={i < Math.floor(Number(averageRating(currentReviews))) ? "fill-current" : "text-gray-200"} />
                                ))}
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                                Based on {currentReviews.length} {activeTab} reviews
                            </span>
                        </div>

                        {/* Rating Bars */}
                        <div className="mb-12 space-y-3 max-w-xs mx-auto">
                            {ratingDistribution(currentReviews).map((row) => (
                                <div key={row.stars} className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
                                    <span className="w-4">{row.stars}</span>
                                    <Star size={10} className="fill-current" />
                                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gray-900 rounded-full transition-all duration-700" style={{ width: row.pct }}></div>
                                    </div>
                                    <span className="w-8 text-right">{row.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-8 border-b border-gray-100 mb-10 overflow-x-auto no-scrollbar">
                        <button
                            className={`pb-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all whitespace-nowrap ${activeTab === 'site' ? 'text-gray-900 border-b-2 border-gold-500' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={() => setActiveTab('site')}
                        >
                            Site Experience
                        </button>
                        <button
                            className={`pb-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all whitespace-nowrap ${activeTab === 'product' ? 'text-gray-900 border-b-2 border-gold-500' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={() => setActiveTab('product')}
                        >
                            Products
                        </button>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-8">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 size={32} className="text-gold-500 animate-spin" />
                            </div>
                        ) : currentReviews.length > 0 ? (
                            currentReviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-100 pb-10 last:border-0 hover:bg-gold-50/20 p-6 -mx-6 rounded-sm transition-colors group">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm border border-gray-200 group-hover:border-gold-300 transition-colors">
                                                {review.author_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-gray-900 uppercase tracking-widest">{review.author_name}</div>
                                                <div className="flex items-center gap-1.5 text-[9px] text-gold-600 uppercase tracking-widest mt-1">
                                                    <Check size={10} className="stroke-3" /> Verified Buyer
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{new Date(review.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex gap-0.5 mb-4 text-gray-900">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-gray-100"} />
                                        ))}
                                    </div>

                                    <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">{review.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-6 font-light italic">"{review.content}"</p>

                                    {activeTab === 'product' && review.product && (
                                        <div className="bg-white border border-gray-100 p-3 flex items-center gap-3 mb-6 rounded-sm shadow-sm group-hover:border-gold-200 transition-colors">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product:</div>
                                            <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest underline underline-offset-4">{review.product.name}</span>
                                        </div>
                                    )}

                                    <div className="flex gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span>Helpful?</span>
                                        <button className="hover:text-gold-600 transition-colors">👍 {review.helpful_count || 0}</button>
                                        <button className="hover:text-red-400 transition-colors">👎 0</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 text-gray-400 text-sm italic">
                                No reviews yet. Be the first to tell us what you think!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TestimonialsDrawer;
