
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { ProductReview } from "@/lib/api";

interface ReviewsCarouselProps {
    initialReviews: any[]; // Using any to match the Supabase return type flexibly or ProductReview
    totalReviews: number;
}

export default function ReviewsCarousel({ initialReviews, totalReviews }: ReviewsCarouselProps) {
    // Since we are doing a client-side carousel of a fixed number of featured reviews (passed from server),
    // we can just manage the index here.
    // The user asked to "show 3 by 3 reviews".
    // Assuming this means displaying 3 reviews at a time in a grid/carousel.

    // Actually, the designs usually show 3 reviews in a row on desktop.
    // "implement the functionss of that chloran left and right buttons" likely refers to pagination or sliding.

    // If we have many reviews, we should probably fetch them or just slice the pre-fetched ones if we fetched enough.
    // The server code fetched `getFeaturedReviews(3)`. To support "left and right buttons", we might need more reviews or fetch more client-side.
    // But if the user says "show 3 by 3", maybe they mean pages of 3.

    // Let's assume we want to carousel through the reviews we have. 
    // If we only have 3, the buttons won't do much unless we fetch more.
    // Let's assume we might receive more reviews or should fetch all featured reviews to carousel them.
    // For now, let's just make it a client component that accepts the reviews and handles the "next/prev" if there are more than 3.

    // However, the current parent component fetches only 3.
    // We should prob update the parent to fetch more, e.g. 9, to allow some sliding.

    const [startIndex, setStartIndex] = useState(0);
    const reviewsPerPage = 3;

    const visibleReviews = initialReviews.slice(startIndex, startIndex + reviewsPerPage);

    const handleNext = () => {
        if (startIndex + reviewsPerPage < initialReviews.length) {
            setStartIndex(prev => prev + reviewsPerPage);
        } else {
            // Optional: loop back to start
            setStartIndex(0);
        }
    };

    const handlePrev = () => {
        if (startIndex - reviewsPerPage >= 0) {
            setStartIndex(prev => prev - reviewsPerPage);
        } else {
            // Optional: go to end
            setStartIndex(Math.max(0, initialReviews.length - reviewsPerPage));
        }
    };

    // Calculate average rating if needed, or just use static/total count
    // The user asked for "real reviews count". We can pass that as a prop.

    return (
        <section className="py-20 bg-gold-100/30 border-t border-gold-200/40 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gold-500 rounded-full blur-sm opacity-20"></div>
            <div className="w-full px-4 md:px-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <h2 className="text-2xl font-serif text-gray-900 inline-block mr-4">
                            Real Reviews From Real Customers
                        </h2>
                        <Link href="/reviews" className="text-sm text-gray-500 underline hover:text-gold-500 transition-colors">
                            See all reviews
                        </Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className="fill-gray-900 text-gray-900" />
                            ))}
                            <span className="ml-2 text-sm text-gray-500">{totalReviews} Reviews</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrev}
                                disabled={initialReviews.length <= 3}
                                className="p-2 border border-gray-200 rounded-full hover:border-gold-500 hover:text-gold-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={initialReviews.length <= 3}
                                className="p-2 border border-gray-200 rounded-full hover:border-gold-500 hover:text-gold-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 min-h-[300px]">
                    {visibleReviews.length > 0 ? (
                        visibleReviews.map((review) => (
                            <div key={review.id} className="flex gap-6 group hover:bg-white/50 p-4 rounded-xl transition-all animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="shrink-0 w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 group-hover:bg-gold-50 transition-colors">
                                    <Quote size={24} className="text-gold-500" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className={i < review.rating ? "fill-gray-900 text-gray-900" : "text-gray-200"} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {review.title && <h3 className="font-serif text-lg mb-2 text-gray-900 line-clamp-1">{review.title}</h3>}
                                    <p className="text-sm text-gray-500 leading-relaxed mb-4 italic line-clamp-3">
                                        "{review.content}"
                                    </p>
                                    <span className="text-sm font-bold tracking-wider text-gray-900">{review.author_name}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        // This state should theoretically not be reached if initialReviews is empty from parent, but good to have
                        <div className="col-span-full text-center text-gray-500 italic pb-10">
                            No featured reviews yet. Be the first to verify our quality!
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
