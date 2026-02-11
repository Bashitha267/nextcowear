"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Plus, ChevronRight } from "lucide-react";
import { Product } from "@/lib/data"; // or from lib/api if I define it there, using data for now as it's shared

interface BestSellersSectionProps {
    products: Product[];
}

const BestSellersSection = ({ products }: BestSellersSectionProps) => {
    const [activeTab, setActiveTab] = useState<'Women' | 'Men' | 'Kids'>('Women');

    const filteredProducts = useMemo(() => {
        return products.filter(p => p.category === activeTab).slice(0, 4);
    }, [products, activeTab]);

    return (
        <section className="py-20 bg-gold-50">
            <div className="w-full px-4 md:px-10">
                <div className="text-center mb-16">
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-500 mb-6 block">
                        Discover Our Best Selling Collection
                    </span>
                    <div className="flex justify-center gap-4 sm:gap-8 md:gap-12 border-b border-gold-200/50 pb-px overflow-x-auto no-scrollbar">
                        {['Women', 'Men', 'Kids'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.2em] uppercase py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === tab
                                        ? 'border-gold-500 text-gold-600'
                                        : 'border-transparent text-gray-400 hover:text-gold-500'
                                    }`}
                            >
                                For {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative group">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="flex flex-col group/item transition-all duration-500 hover:-translate-y-2">
                                <div className="relative aspect-[4/5] overflow-hidden mb-6 border border-gold-50 hover:border-gold-300 transition-all duration-300 rounded-sm shadow-sm group-hover/item:shadow-xl">
                                    <Link href={`/product/${product.id}`} className="block relative w-full h-full">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                                        />
                                    </Link>
                                    {product.isBestSeller && (
                                        <span className="absolute top-2 left-2 bg-gold-600 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 shadow-sm z-10">
                                            Best Seller
                                        </span>
                                    )}
                                    <button className="absolute bottom-4 right-4 bg-white/95 p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover/item:opacity-100 group-hover/item:translate-y-0 transition-all hover:bg-gold-500 hover:text-white z-20">
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="text-center px-2">
                                    <Link href={`/product/${product.id}`} className="block group/title">
                                        <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2 text-gray-900 line-clamp-2 h-8 group-hover/title:text-gold-600 transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <div className="text-gold-600 text-sm mb-4 font-bold tracking-wider">
                                        RS {product.price.toLocaleString()}
                                    </div>
                                    <div className="flex justify-center gap-1.5 mb-5">
                                        {[...(product.colors.classic || []), ...(product.colors.seasonal || [])].slice(0, 5).map((color, idx) => (
                                            <div
                                                key={idx}
                                                className="w-3.5 h-3.5 rounded-full border border-gray-100 shadow-inner hover:scale-125 transition-transform cursor-pointer"
                                                style={{ backgroundColor: color.hex }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="flex text-gold-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={11} className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-200"} strokeWidth={1} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">({product.reviews})</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Slider Arrow - Optional logic, simplified for now */}
                    {filteredProducts.length > 0 && (
                        <div className="hidden lg:flex absolute right-0 top-[40%] translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 items-center justify-center z-10 hover:bg-gold-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer">
                            <ChevronRight size={24} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BestSellersSection;
