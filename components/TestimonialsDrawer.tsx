"use client";

import React, { useState } from "react";
import { Star, X, Filter, ChevronDown, Check } from "lucide-react";

const TestimonialsDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Site Reviews");

    const reviews = [
        {
            id: 1,
            name: "Nina R.",
            verified: true,
            date: "02/07/26",
            rating: 5,
            title: "This is the best t-shirt",
            content: "This is the best t-shirt I have ever purchased. It fits perfectly and I love the material. I plan on buying more and highly recommend it!",
            product: "Womens 3/4 Sleeve Crew Neck",
        },
        {
            id: 2,
            name: "Liz G.",
            verified: true,
            date: "02/07/26",
            rating: 5,
            title: "Love everything about it. The",
            content: "Love everything about it. The fit, the feel, the look. Will definitely be buying more.",
            product: "Womens Elbow Sleeve V-Neck",
        },
        {
            id: 3,
            name: "Sarah M.",
            verified: true,
            date: "02/05/26",
            rating: 5,
            title: "Perfect fit",
            content: "Finally found a shirt that fits perfectly. The fabric is amazing and breathes well.",
        },
        {
            id: 4,
            name: "John D.",
            verified: true,
            date: "02/01/26",
            rating: 4,
            title: "Great quality",
            content: "High quality material, just a bit tighter than I expected. But overall very good.",
        },
    ];

    return (
        <>
            {/* Trigger Button - positioned in Hero Section as requested */}
            <div className={`absolute left-0 top-20 translate-y-3 z-40 transition-transform duration-300 ${isOpen ? 'translate-x-[500px] lg:translate-x-[600px]' : 'translate-x-0'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gray-900 text-white py-4 rounded-r-md shadow-lg flex flex-col items-center gap-3 hover:bg-gold-600 transition-colors"
                    aria-label="Open Reviews"
                >
                    <span className="whitespace-nowrap text-xs font-bold tracking-widest uppercase -rotate-90 py-5">
                        Reviews
                    </span>
                    <Star size={12} className="fill-white" />
                </button>
            </div>

            {/* Overlay Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-9998"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer Panel */}
            <div
                className={`fixed top-0 left-0 h-full w-full md:w-[500px] lg:w-[600px] bg-white shadow-2xl z-9999 transform transition-transform duration-500 ease-in-out overflow-hidden flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-thin scrollbar-thumb-gold-200 scrollbar-track-transparent">

                    <div className="text-center mb-10">
                        <h2 className="text-xl font-sans text-gray-500 mb-8">Customer Testimonials</h2>

                        <div className="flex flex-col items-center gap-2 mb-2">
                            <span className="text-6xl text-gray-800 font-light">4.8</span>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} className="fill-gray-800 text-gray-800" />
                                ))}
                            </div>
                            <span className="text-sm text-gray-400">Based on 3452 reviews</span>
                        </div>
                    </div>

                    {/* Rating Bars */}
                    <div className="mb-10 space-y-2 max-w-xs mx-auto">
                        {[
                            { stars: 5, count: 2918, pct: '90%' },
                            { stars: 4, count: 309, pct: '15%' },
                            { stars: 3, count: 160, pct: '8%' },
                            { stars: 2, count: 44, pct: '3%' },
                            { stars: 1, count: 21, pct: '1%' },
                        ].map((row) => (
                            <div key={row.stars} className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="w-3">{row.stars}</span>
                                <Star size={10} className="fill-gray-500 text-gray-500" />
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-600 rounded-full" style={{ width: row.pct }}></div>
                                </div>
                                <span className="w-8 text-right">{row.count}</span>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-8 border-b border-gray-100 mb-3">
                        <button
                            className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'Site Reviews' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={() => setActiveTab('Site Reviews')}
                        >
                            Site Reviews
                        </button>
                        <button
                            className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'Product Reviews' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={() => setActiveTab('Product Reviews')}
                        >
                            Product Reviews
                        </button>
                    </div>



                    {/* Reviews List */}
                    <div className="space-y-5">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-100 pb-10 last:border-0 hover:bg-gray-50/50 p-4 -mx-4 rounded-lg transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{review.name}</div>
                                            {review.verified && (
                                                <div className="flex items-center gap-1 text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                                                    <Check size={10} className="stroke-3" /> Verified Buyer
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">{review.date}</span>
                                </div>

                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={`${i < review.rating ? 'fill-gray-900 text-gray-900' : 'text-gray-200'}`}
                                        />
                                    ))}
                                </div>

                                <h3 className="text-base font-bold text-gray-900 mb-2">{review.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-4">{review.content}</p>

                                {review.product && (
                                    <div className="text-xs text-gray-400 font-medium">
                                        Product Reviewed: <span className="text-gray-700">{review.product}</span>
                                    </div>
                                )}

                                <div className="mt-4 flex gap-4 text-xs text-gray-400">
                                    <span>Was this review helpful?</span>
                                    <button className="hover:text-gray-900 flex items-center gap-1">👍 0</button>
                                    <button className="hover:text-gray-900 flex items-center gap-1">👎 0</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <div className="flex gap-2">
                            <button className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white text-xs rounded-sm">1</button>
                            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 text-xs rounded-sm transition-colors">2</button>
                            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 text-xs rounded-sm transition-colors">3</button>
                            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 text-xs rounded-sm transition-colors">4</button>
                            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 text-xs rounded-sm transition-colors">5</button>
                            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 text-xs rounded-sm transition-colors">&gt;</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TestimonialsDrawer;
