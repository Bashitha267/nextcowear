"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Product } from "@/lib/data";

interface NewArrivalsSectionProps {
    products: Product[];
}

const NewArrivalsSection = ({ products }: NewArrivalsSectionProps) => {
    const { addToCart } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { user, setIsLoginModalOpen } = useAuth();

    if (!products || products.length === 0) return null;

    return (
        <section className="py-20 bg-[#FDFBF7]">
            <div className="w-full px-4 md:px-10">
                <div className="text-center mb-16">
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-500 mb-4 block">
                        Fresh from the Atelier
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">New Arrivals</h2>
                    <div className="w-24 h-1 bg-gold-400 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {products.map((product) => (
                        <div key={product.id} className="flex flex-col group/item transition-all duration-500 hover:-translate-y-2">
                            <div className="relative aspect-4/5 overflow-hidden mb-6 border border-gray-100 hover:border-gold-300 transition-all duration-300 rounded-sm shadow-sm group-hover/item:shadow-xl">
                                <Link href={`/product/${product.id}`} className="block relative w-full h-full">
                                    {/* Primary Image */}
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className={`object-cover transition-opacity duration-500 ${product.additionalImages && product.additionalImages.length > 0 ? 'group-hover/item:opacity-0' : ''}`}
                                    />
                                    {/* Secondary Image on Hover */}
                                    {product.additionalImages && product.additionalImages.length > 0 && (
                                        <Image
                                            src={product.additionalImages[0]}
                                            alt={`${product.name} View 2`}
                                            fill
                                            className="absolute inset-0 object-cover opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"
                                        />
                                    )}
                                </Link>
                                {/* Ribbon Badges - Top Left */}
                                <div className="absolute top-0 left-0 w-28 h-28 overflow-hidden z-10 pointer-events-none">
                                    <div className="absolute -left-9 top-5 w-40 -rotate-45 text-white text-[10px] font-bold tracking-widest uppercase py-1.5 text-center shadow-lg backdrop-blur-md bg-emerald-600/95">
                                        New Arrival
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 translate-y-4 group-hover/item:opacity-100 group-hover/item:translate-y-0 transition-all z-20">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (!user) {
                                                setIsLoginModalOpen(true);
                                                return;
                                            }
                                            if (isInWishlist(product.id)) {
                                                removeFromWishlist(product.id);
                                            } else {
                                                addToWishlist(product.id);
                                            }
                                        }}
                                        className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 ${isInWishlist(product.id) ? 'bg-gold-500 text-white' : 'bg-white/95 text-gray-900 hover:text-gold-500'}`}
                                        title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                                    >
                                        <Heart size={18} className={isInWishlist(product.id) ? "fill-current" : ""} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const defaultSize = product.sizes?.[0] || "";
                                            const defaultColor = product.colors?.classic?.[0]?.name || product.colors?.seasonal?.[0]?.name || "";
                                            addToCart(product, 1, defaultSize, defaultColor);
                                            toast.success("Added to cart");
                                        }}
                                        className="p-3 rounded-full shadow-lg bg-white/95 text-gray-900 transition-all hover:bg-gray-900 hover:text-white hover:scale-110"
                                        title="Add to Cart"
                                    >
                                        <ShoppingBag size={18} />
                                    </button>
                                </div>
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

                <div className="mt-16 text-center">
                    <Link
                        href="/collections?sort=newest"
                        className="inline-block border border-gray-900 text-gray-900 px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-900 hover:text-white transition-all duration-300"
                    >
                        View All New Arrivals
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default NewArrivalsSection;
