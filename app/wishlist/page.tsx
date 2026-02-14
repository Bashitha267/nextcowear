
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/contexts/WishlistContext";
import { getProductById } from "@/lib/api"; // Assuming we can fetch by IDs
import { Product } from "@/lib/data";
import { Loader2, Heart, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-hot-toast";

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            setLoading(true);
            try {
                if (wishlist.length > 0) {
                    const productPromises = wishlist.map(id => getProductById(id));
                    const fetchedProducts = await Promise.all(productPromises);
                    // Filter out nulls in case some products were deleted
                    setProducts(fetchedProducts.filter(p => p !== null) as Product[]);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Failed to fetch wishlist products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistProducts();
    }, [wishlist]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FCF9F2] pt-32 pb-20 px-4 md:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight">MY WISHLIST</h1>
                    <div className="w-24 h-1 bg-gold-400 mx-auto"></div>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product.id} className="group flex flex-col bg-white rounded-sm shadow-sm hover:shadow-xl transition-all duration-300 border border-gold-100/50">
                                <div className="relative aspect-4/5 overflow-hidden">
                                    <Link href={`/product/${product.id}`} className="block relative w-full h-full">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </Link>
                                    <button
                                        onClick={() => removeFromWishlist(product.id)}
                                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm z-10"
                                        title="Remove from Wishlist"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <Link href={`/product/${product.id}`}>
                                        <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-900 mb-2 line-clamp-1 hover:text-gold-600 transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="text-sm font-bold text-gold-600 mb-6">RS {product.price.toLocaleString()}</p>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const defaultSize = product.sizes?.[0] || "";
                                            const defaultColor = product.colors?.classic?.[0]?.name || product.colors?.seasonal?.[0]?.name || "";
                                            addToCart(product, 1, defaultSize, defaultColor);
                                            toast.success("Added to cart");
                                        }}
                                        className="mt-auto w-full bg-gray-900 text-white py-3 rounded-sm text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gold-600 transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        Add to Cart
                                        <ShoppingBag size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-sm">
                        <Heart size={48} className="mx-auto mb-6 text-gray-200" />
                        <h2 className="text-2xl font-serif text-gray-900 mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Save items you love to your wishlist to revisit them later.</p>
                        <Link
                            href="/collections"
                            className="inline-block bg-gold-600 text-white px-8 py-3.5 rounded-sm text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gold-700 transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
