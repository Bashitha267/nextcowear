"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, CheckCircle2, ShoppingBag, ThumbsUp, MessageSquare, Filter } from "lucide-react";
import { getSiteReviews, getProductReviews } from "@/lib/api";

const ReviewsPage = () => {
    const [activeTab, setActiveTab] = useState<"site" | "product">("site");
    const [siteReviews, setSiteReviews] = useState<any[]>([]);
    const [productReviews, setProductReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            const [siteData, productData] = await Promise.all([
                getSiteReviews(),
                getProductReviews()
            ]);
            setSiteReviews(siteData);
            setProductReviews(productData);
            setLoading(false);
        };
        fetchReviews();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
        });
    };

    const getFilteredReviews = () => {
        const reviews = activeTab === "site" ? siteReviews : productReviews;
        if (ratingFilter === null) return reviews;
        return reviews.filter((r) => r.rating === ratingFilter);
    };

    const filteredReviews = getFilteredReviews();

    const averageRating = (reviews: any[]) => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const totalAverage = averageRating([...siteReviews, ...productReviews]);
    const totalCount = siteReviews.length + productReviews.length;

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Section */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 uppercase tracking-widest leading-tight">
                        Real Reviews From Real <br /> Customers
                    </h1>
                    <p className="text-gold-600 font-medium tracking-widest uppercase text-sm mb-8">
                        Customer Testimonials
                    </p>

                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center gap-4">
                            <span className="text-5xl font-serif text-gray-900">{totalAverage || "5.0"}</span>
                            <div className="flex flex-col items-start leading-none">
                                <div className="flex gap-0.5 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            className={
                                                i < Math.floor(Number(totalAverage))
                                                    ? "fill-gray-900 text-gray-900"
                                                    : i < Number(totalAverage)
                                                        ? "fill-gray-900/50 text-gray-900/50"
                                                        : "text-gray-200"
                                            }
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                                    Based on {totalCount} reviews
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Tabs */}
                <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-100 pb-8 mb-12 gap-8 sticky top-20 bg-white z-20 py-4">
                    <div className="flex gap-2 p-1 bg-gray-50 rounded-sm border border-gray-100">
                        <button
                            onClick={() => setActiveTab("site")}
                            className={`px-6 py-2.5 text-[11px] font-bold tracking-[0.2em] uppercase transition-all rounded-sm ${activeTab === "site"
                                ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            Site Reviews
                        </button>
                        <button
                            onClick={() => setActiveTab("product")}
                            className={`px-6 py-2.5 text-[11px] font-bold tracking-[0.2em] uppercase transition-all rounded-sm ${activeTab === "product"
                                ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            Product Reviews
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Filter by:</span>
                            <select
                                className="bg-gray-50 border border-gray-200 text-[11px] font-bold tracking-widest uppercase px-4 py-2 rounded-sm focus:outline-none focus:border-gold-500 transition-colors"
                                onChange={(e) => setRatingFilter(e.target.value === "all" ? null : Number(e.target.value))}
                                value={ratingFilter === null ? "all" : ratingFilter}
                            >
                                <option value="all">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>
                        <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                            Sort by: <span className="text-gray-900">Most recent</span>
                        </div>
                    </div>
                </div>

                {/* Reviews Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-12">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse flex flex-col md:flex-row gap-8 pb-12 border-b border-gray-100">
                                <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                                <div className="flex-1 space-y-4">
                                    <div className="h-4 bg-gray-100 w-1/4 rounded"></div>
                                    <div className="h-4 bg-gray-100 w-3/4 rounded"></div>
                                    <div className="h-4 bg-gray-100 w-1/2 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredReviews.length > 0 ? (
                    <div className="grid grid-cols-1 gap-16">
                        {filteredReviews.map((review, index) => (
                            <div
                                key={review.id}
                                className="flex flex-col md:flex-row gap-8 pb-16 border-b border-gray-100 group animate-in fade-in slide-in-from-bottom duration-500"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Author Info */}
                                <div className="w-full md:w-48 shrink-0">
                                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                                        <div className="w-12 h-12 rounded-full bg-gold-50 flex items-center justify-center text-gold-600 font-bold border border-gold-100 group-hover:bg-gold-500 group-hover:text-white transition-all duration-300">
                                            {review.author_name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold tracking-widest text-gray-900 uppercase">
                                                {review.author_name}
                                            </span>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <CheckCircle2 size={10} className="text-gold-600" />
                                                <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                                                    Verified Buyer
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={i < review.rating ? "fill-gray-900 text-gray-900" : "text-gray-200"}
                                                    />
                                                ))}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 tracking-wide uppercase">
                                                {review.title || "Top Review!"}
                                            </h3>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                                            {formatDate(review.created_at)}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-500 leading-relaxed max-w-3xl font-light mb-8 italic">
                                        "{review.content}"
                                    </p>

                                    {/* Product Specific Info */}
                                    {activeTab === "product" && review.product && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 mb-8 flex items-center gap-4 w-fit group/prod hover:border-gold-300 transition-colors">
                                            <div className="relative w-12 h-16 rounded shadow-sm overflow-hidden bg-white">
                                                <Image
                                                    src={review.product.main_image || "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=200"}
                                                    alt={review.product.name}
                                                    fill
                                                    className="object-cover group-hover/prod:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase">Reviewed Product</span>
                                                <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">{review.product.name}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Review Meta/Actions */}
                                    <div className="flex flex-wrap items-center gap-8 pt-4">
                                        <div className="flex items-center gap-6">
                                            <button className="flex items-center gap-2 group/btn">
                                                <ThumbsUp size={14} className="text-gray-400 group-hover/btn:text-gold-500 transition-colors" />
                                                <span className="text-[10px] font-bold text-gray-400 group-hover/btn:text-gray-900 transition-colors uppercase">
                                                    Was this helpful? ({review.helpful_count || 0})
                                                </span>
                                            </button>
                                            <button className="flex items-center gap-2 group/btn">
                                                <MessageSquare size={14} className="text-gray-400 group-hover/btn:text-gold-500 transition-colors" />
                                                <span className="text-[10px] font-bold text-gray-400 group-hover/btn:text-gray-900 transition-colors uppercase">
                                                    Reply
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 border-2 border-dashed border-gray-100 rounded-sm">
                        <Filter size={48} className="text-gray-200 mx-auto mb-6" />
                        <h3 className="text-xl font-serif text-gray-900 mb-2">No reviews found</h3>
                        <p className="text-sm text-gray-400 font-light">Try adjusting your filters to see more results.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsPage;
