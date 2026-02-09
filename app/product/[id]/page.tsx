"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    Star,
    Plus,
    Minus,
    ChevronDown,
    ChevronRight,
    Share2,
    Heart,
    Check,
    Ruler,
    Truck,
    ShieldCheck,
    ArrowRight,
    ShoppingBag
} from "lucide-react";
import { products, Product } from "@/lib/data";
import TestimonialsDrawer from "@/components/TestimonialsDrawer";

const ProductDetailsPage = () => {
    const params = useParams();
    const productId = params.id as string;

    // Find product or use master as fallback
    const product = useMemo(() => {
        return products.find(p => p.id === productId) || products.find(p => p.id === 'elbow-v-neck') as Product;
    }, [productId]);

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [expandedAccordion, setExpandedAccordion] = useState<string | null>("overview");

    if (!product) return <div className="min-h-screen flex items-center justify-center font-serif text-2xl text-gray-400">Product not found</div>;

    const images = product.additionalImages || [product.image];
    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const toggleAccordion = (id: string) => {
        setExpandedAccordion(expandedAccordion === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br mt-5 lg:mt-10 from-white via-gold-50/20 to-white pt-24 pb-20 font-sans relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-100/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-200/10 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 md:px-10 mb-6 font-sans relative z-10">
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gray-400">
                    <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="/collections" className="hover:text-gold-500 transition-colors">Collections</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-900">{product.name}</span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* Left Column: Image Gallery */}
                    <div className="space-y-6">
                        {/* Main Image container */}
                        <div className="relative aspect-4/5 bg-gray-50 overflow-hidden group border border-gray-100 rounded-[2.5rem] shadow-sm">
                            <Image
                                src={images[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                            {product.isBestSeller && (
                                <span className="absolute top-4 left-4 bg-gray-900 text-white text-[9px] font-bold tracking-[0.3em] uppercase px-3 py-1.5 z-10 rounded-full">Best Seller</span>
                            )}
                        </div>

                        {/* Thumbnails Row */}
                        <div className="grid grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition-all ${selectedImage === idx ? 'border-gray-900 scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <Image src={img} alt={`${product.name} thumbnail ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Information */}
                    <div className="flex flex-col justify-center space-y-10">
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 tracking-tight leading-tight uppercase font-medium">{product.name}</h1>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                                    RS {product.price.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex text-gold-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-200"} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gold-500 underline underline-offset-4 decoration-1" onClick={() => {
                                        const el = document.getElementById('reviews');
                                        el?.scrollIntoView({ behavior: 'smooth' });
                                    }}>
                                        ({product.reviews} Reviews)
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 font-medium italic">Traditional retail price: RS {(product.price * 1.5).toLocaleString()}</p>
                        </div>

                        {/* Description */}
                        <div className="border-t border-gray-100 pt-8">
                            <p className="text-base text-gray-600 leading-relaxed font-medium">
                                {product.description || "Crafted from our signature premium fabric, this essential piece combines timeless style with unparalleled comfort. Designed to be a cornerstone of your wardrobe, it features meticulous attention to detail and a silhouette that flatters every form."}
                            </p>
                        </div>

                        {/* Colors */}
                        <div className="space-y-8 border-t border-gray-100 pt-8">
                            {product.colors.classic && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-900">Classic:</h3>
                                        <span className="text-xs font-bold tracking-widest text-gold-600 uppercase italic">Limited Availability</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {product.colors.classic.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => setSelectedColor(color.name)}
                                                className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedColor === color.name ? 'ring-2 ring-gray-900 ring-offset-4 scale-110 shadow-lg' : 'hover:scale-110'}`}
                                                title={color.name}
                                            >
                                                <div
                                                    className="w-full h-full rounded-full border border-gray-200 shadow-inner"
                                                    style={{ backgroundColor: color.hex }}
                                                />
                                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 text-gray-400 whitespace-nowrap transition-all">{color.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.colors.seasonal && (
                                <div className="space-y-4 pt-4">
                                    <div className="flex justify-between items-center px-1">
                                        <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-900">Seasonal:</h3>
                                        <span className="text-xs font-bold tracking-widest text-gold-500 uppercase italic">Spring Collection</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {product.colors.seasonal.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => setSelectedColor(color.name)}
                                                className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedColor === color.name ? 'ring-2 ring-gray-900 ring-offset-4 scale-110 shadow-lg' : 'hover:scale-110'}`}
                                                title={color.name}
                                            >
                                                <div
                                                    className="w-full h-full rounded-full border border-gray-200 shadow-inner"
                                                    style={{ backgroundColor: color.hex }}
                                                />
                                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 text-gray-400 whitespace-nowrap transition-all">{color.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sizes */}
                        <div className="space-y-6 pt-10 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-900">Select Size:</h3>
                                <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gold-500 transition-colors uppercase tracking-[0.2em] underline underline-offset-4">
                                    <Ruler size={16} /> Size Chart
                                </button>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-14 border flex items-center justify-center text-[11px] font-bold tracking-widest transition-all rounded-sm shadow-sm ${selectedSize === size ? 'bg-gray-900 text-white border-gray-900 scale-105 shadow-xl z-10' : 'bg-white text-gray-600 border-gray-200 hover:border-gold-300 hover:bg-gold-50/30'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            <div className="bg-gold-50/40 p-5 rounded-sm flex items-start gap-3 border-l-4 border-gold-400 animate-in fade-in duration-700">
                                <ShieldCheck className="text-gold-600 shrink-0 mt-0.5" size={18} />
                                <p className="text-[11px] text-gray-700 leading-relaxed font-bold tracking-wide italic">
                                    <span className="text-gold-600 font-extrabold uppercase tracking-widest">Fit Tip:</span> Pre-shrunk with a contoured fit—size up if you’re between sizes or prefer a looser feel.
                                </p>
                            </div>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="space-y-6 pt-8">
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex items-center justify-center border-2 border-gold-100 h-16 rounded-sm w-full sm:w-40 font-bold bg-white">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-full flex items-center justify-center hover:bg-gold-50 transition-colors text-gold-600"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="flex-1 text-center text-sm font-extrabold text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-full flex items-center justify-center hover:bg-gold-50 transition-colors text-gold-600"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button className="flex-1 bg-gray-900 text-white py-6 rounded-sm text-xs font-bold tracking-[0.4em] uppercase hover:bg-gold-600 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 group overflow-hidden relative">
                                    <span className="relative z-10">Add to Cart</span>
                                    <ShoppingBag size={18} className="relative z-10 group-hover:scale-110 transition-transform" />
                                    <div className="absolute inset-0 bg-gold-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                                </button>
                            </div>
                            {/* <button className="w-full bg-[#5A31F4] text-white h-16 rounded-sm text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg active:scale-95">
                                Buy with <span className="text-lg italic font-serif lowercase tracking-tighter">shop</span>
                            </button> */}

                            <div className="text-center pt-2">
                                <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest underline underline-offset-4 hover:text-gold-500 transition-colors">
                                    More payment options
                                </button>
                            </div>

                            <p className="text-[10px] text-gray-400 text-center leading-relaxed max-w-sm mx-auto italic">
                                By placing your order you agree to purchase from DressCo as the merchant of record, subject to Global-e’s Terms and Conditions and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Full Width Accordion Details below the grid */}
                <div className="pt-20 mt-10 border-t border-gray-100">
                    {[
                        { id: 'overview', label: 'OVERVIEW', content: product.details?.overview },
                        { id: 'sustainability', label: 'SUSTAINABILITY', content: product.details?.sustainability },
                        { id: 'fit', label: 'FIT', content: product.details?.fit },
                        { id: 'returns', label: 'SHIPPING & RETURNS', content: product.details?.returns },
                    ].map((item) => (
                        <div key={item.id} className="border-b border-gray-100 group">
                            <button
                                onClick={() => toggleAccordion(item.id)}
                                className="w-full flex items-center justify-between py-8 text-xs font-extrabold tracking-[0.3em] uppercase text-gray-900 hover:text-gold-600 transition-colors"
                            >
                                {item.label}
                                {expandedAccordion === item.id ? <Minus size={16} /> : <Plus size={16} />}
                            </button>
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedAccordion === item.id ? 'max-h-96 pb-10' : 'max-h-0'}`}>
                                <p className="text-base text-gray-500 leading-relaxed font-medium pl-6 border-l-2 border-gold-200">
                                    {item.content || "Experience the premium quality and exceptional craftsmanship that defines DressCo. Meticulously tested and refined for your daily comfort."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reviews Section */}
                <section id="reviews" className="mt-32 pt-20 border-t border-gray-100">
                    <div className="text-center mb-20">
                        <div className="flex items-center justify-center gap-8 text-[11px] font-bold tracking-[0.4em] uppercase text-gray-500 mb-12">
                            <span className="text-gray-900 border-b-2 border-gray-900 pb-2">Reviews</span>
                            <span className="hover:text-gold-500 transition-colors cursor-pointer">Q&A</span>
                        </div>
                        <h2 className="text-2xl font-serif text-gray-900 mb-12 flex items-center justify-center gap-4">
                            <span className="w-12 h-px bg-gold-200"></span>
                            Customer Reviews
                            <span className="w-12 h-px bg-gold-200"></span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-center w-full max-w-[1800px] mx-auto bg-gold-50/20 p-6 md:p-12 rounded-sm border border-gold-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
                                <div className="absolute top-0 right-0 w-[200%] h-[200%] border-t-2 border-r-2 border-gold-500 rotate-45 transform translate-x-1/2 -translate-y-1/2"></div>
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <span className="text-7xl font-light text-gray-900 leading-none">{product.rating}</span>
                                <div className="flex text-gray-900">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={24} className="fill-current" />
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Based on {product.reviews} reviews</span>
                            </div>

                            <div className="space-y-3 flex-1 w-full max-w-xs mx-auto">
                                {[
                                    { stars: 5, count: Math.round(product.reviews * 0.85), pct: '85%' },
                                    { stars: 4, count: Math.round(product.reviews * 0.10), pct: '10%' },
                                    { stars: 3, count: Math.round(product.reviews * 0.03), pct: '3%' },
                                    { stars: 2, count: Math.round(product.reviews * 0.01), pct: '1%' },
                                    { stars: 1, count: Math.round(product.reviews * 0.01), pct: '1%' },
                                ].map((row) => (
                                    <div key={row.stars} className="flex items-center gap-4 text-[10px] font-bold text-gray-500">
                                        <span className="w-4">{row.stars}</span>
                                        <Star size={11} className="fill-gray-400" />
                                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-gray-900 rounded-full" style={{ width: row.pct }}></div>
                                        </div>
                                        <span className="w-8 text-right text-gray-400">{row.count}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col items-center gap-10">
                                <div className="text-center">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Fit</span>
                                    <div className="w-32 h-1 bg-gray-100 rounded-full relative mb-4">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-gray-900 rounded-full shadow-md z-10" />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">True to size</span>
                                </div>
                                <button className="bg-gray-700 text-white px-10 py-4 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase hover:bg-gold-600 transition-all shadow-xl active:scale-95 group relative overflow-hidden">
                                    <span className="relative z-10">Write A Review</span>
                                    <div className="absolute inset-0 bg-gold-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="w-full max-w-[1800px] mx-auto space-y-16">
                        {[
                            {
                                name: "Leslie A. us",
                                date: "02/06/26",
                                rating: 5,
                                title: "Love the shirt!",
                                content: "Ordering my third color today. The premium fabric feels incredible against the skin and the elbow length sleeves are so flattering.",
                                response: "Hello Leslie! We are thrilled to hear that you love the shirt, and we truly appreciate you coming back for more colors. That means a lot to us. Thank you for your support!"
                            },
                            {
                                name: "carol n. us",
                                date: "02/05/26",
                                rating: 5,
                                title: "Exceptional Quality",
                                content: "Very good quality. Will be ordering more. The fit is exactly as described in the tip.",
                                response: "Hello Carol! Thank you for the kind words. We are so glad the quality stood out to you, and we look forward to sending more your way soon. Thank you for choosing us!"
                            }
                        ].map((rev, i) => (
                            <div key={i} className="border-b border-gray-100 pb-16 animate-in fade-in duration-1000">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gold-50 border border-gold-200 rounded-full flex items-center justify-center text-gold-600 font-bold shadow-sm">
                                            {rev.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-gray-900">{rev.name}</span>
                                                <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                                                    <Check size={10} className="stroke-3" /> Verified Buyer
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 tracking-widest">{rev.date}</span>
                                </div>

                                <div className="flex mb-4">
                                    <div className="flex text-gray-900 gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className="fill-current" />
                                        ))}
                                    </div>
                                </div>

                                <h3 className="text-lg font-serif font-bold text-gray-900 mb-3 tracking-tight">{rev.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-8 italic">"{rev.content}"</p>

                                {rev.response && (
                                    <div className="bg-gold-50/30 p-8 rounded-sm border-l-4 border-gold-400 mb-8 ml-4 md:ml-12 animate-in slide-in-from-left duration-700">
                                        <div className="text-[10px] font-bold text-gold-600 uppercase tracking-[0.3em] mb-3">DressCo Response:</div>
                                        <p className="text-sm text-gray-600 leading-relaxed italic">{rev.response}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-10">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Was this review helpful?</span>
                                        <div className="flex gap-4">
                                            <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-gold-500 transition-colors">👍 0</button>
                                            <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-gold-500 transition-colors">👎 0</button>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex flex-col items-center">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Fit</span>
                                        <div className="w-20 h-1 bg-gray-100 rounded-full relative">
                                            <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rounded-full" />
                                        </div>
                                        <span className="text-[8px] text-gray-400 mt-2 font-bold tracking-tighter">True to size</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* You Might Also Like */}
                {relatedProducts.length > 0 && (
                    <section className="mt-40">
                        <div className="text-center mb-16">
                            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold-600 mb-4 block">Complete The Look</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 tracking-tight leading-tight uppercase font-medium">YOU MIGHT ALSO LIKE</h2>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                            {relatedProducts.map((rel) => (
                                <Link key={rel.id} href={`/product/${rel.id}`} className="group animate-in fade-in duration-700">
                                    <div className="relative aspect-3/4 overflow-hidden mb-6 border border-gold-50 group-hover:border-gold-300 transition-all duration-500 rounded-sm shadow-sm group-hover:shadow-xl group-hover:-translate-y-2">
                                        <Image src={rel.image} alt={rel.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                                        <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="bg-white/95 backdrop-blur-md text-gray-900 py-4 text-[9px] font-extrabold tracking-widest uppercase text-center border-t border-gold-100 flex items-center justify-center gap-2 group/btn">
                                                View Product <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-[10px] font-extrabold tracking-widest uppercase text-gray-900 mb-2 truncate px-2">{rel.name}</h3>
                                        <p className="text-sm font-bold text-gold-600">RS {rel.price.toLocaleString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <div className=" absolute top-34 md:top-48 left-0 right-0">
                <TestimonialsDrawer />

            </div>
        </div>
    );
};

export default ProductDetailsPage;
