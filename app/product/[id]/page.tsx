"use client";

import React, { useState, useEffect } from "react";
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
import { Product } from "@/lib/data";
import TestimonialsDrawer from "@/components/TestimonialsDrawer";
import { getProductById, getRelatedProducts } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-hot-toast";

const ProductDetailsPage = () => {
    const params = useParams();
    const productId = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [expandedAccordion, setExpandedAccordion] = useState<string | null>("overview");
    const [isAdding, setIsAdding] = useState(false);

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const fetchedProduct = await getProductById(productId);
                setProduct(fetchedProduct);

                if (fetchedProduct) {
                    const related = await getRelatedProducts(fetchedProduct.category, fetchedProduct.id);
                    setRelatedProducts(related);

                    // Set initial selections
                    if (fetchedProduct.colors?.classic && fetchedProduct.colors.classic.length > 0) {
                        setSelectedColor(fetchedProduct.colors.classic[0].name);
                    } else if (fetchedProduct.colors?.seasonal && fetchedProduct.colors.seasonal.length > 0) {
                        setSelectedColor(fetchedProduct.colors.seasonal[0].name);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch product details", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductData();
        }
    }, [productId]);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) return <div className="min-h-screen flex items-center justify-center font-serif text-2xl text-gray-400">Product not found</div>;

    const images = product.additionalImages && product.additionalImages.length > 0 ? [product.image, ...product.additionalImages] : [product.image];

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
                                src={images[selectedImage] || product.image}
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
                        {images.length > 1 && (
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
                        )}
                    </div>

                    {/* Right Column: Information */}
                    <div className="flex flex-col justify-center space-y-10">
                        <div className="space-y-4">
                            <h1 className="text-xl md:text-4xl lg:text-5xl font-serif text-gray-900 tracking-tight leading-tight uppercase font-medium">{product.name}</h1>
                            <div className="flex flex-col">
                                <div className="flex flex-col items-start gap-1">
                                    <div className="text-lg md:text-3xl font-bold text-gray-900 mt-2">
                                        RS {product.price.toLocaleString()}
                                    </div>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs md:text-sm text-gray-400 font-medium">
                                                Traditional retail price: <span className="line-through">RS {product.originalPrice.toLocaleString()}</span>
                                            </span>
                                            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                            </span>
                                        </div>
                                    )}
                                </div>
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

                        {/* Description */}
                        <div className="border-t border-gray-100 pt-8">
                            <p className="text-base text-gray-600 leading-relaxed font-medium">
                                {product.description || "Crafted from our signature premium fabric, this essential piece combines timeless style with unparalleled comfort. Designed to be a cornerstone of your wardrobe, it features meticulous attention to detail and a silhouette that flatters every form."}
                            </p>
                        </div>

                        {/* Colors */}
                        <div className="space-y-8 border-t border-gray-100 pt-8">
                            {product.colors.classic && product.colors.classic.length > 0 && (
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
                                                className={`group relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedColor === color.name ? 'ring-2 ring-gray-900 ring-offset-4 scale-105 shadow-lg' : 'hover:scale-110'}`}
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

                            {product.colors.seasonal && product.colors.seasonal.length > 0 && (
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
                        {product.sizes.length > 0 && (
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
                        )}

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
                                <button
                                    onClick={() => {
                                        if (product.sizes.length > 0 && !selectedSize) {
                                            toast.error("Please select a size");
                                            return;
                                        }
                                        setIsAdding(true);
                                        // Simulate a small delay for better UX
                                        setTimeout(() => {
                                            addToCart(product, quantity, selectedSize, selectedColor);
                                            toast.success("Added to cart");
                                            setIsAdding(false);
                                        }, 500);
                                    }}
                                    disabled={isAdding}
                                    className="flex-1 bg-gray-900 text-white py-6 rounded-sm text-xs font-bold tracking-[0.4em] uppercase hover:bg-gold-600 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 group overflow-hidden relative disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <span className="relative z-10">{isAdding ? "Adding..." : "Add to Cart"}</span>
                                    {!isAdding && <ShoppingBag size={18} className="relative z-10 group-hover:scale-110 transition-transform" />}
                                    <div className="absolute inset-0 bg-gold-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                                </button>
                            </div>

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
                            {/* Stats */}
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-7xl font-light text-gray-900 leading-none">{product.rating}</span>
                                <div className="flex text-gray-900">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={24} className={i < Math.floor(product.rating) ? "fill-current" : "fill-gray-200 text-gray-200"} />
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Based on {product.reviews} reviews</span>
                            </div>

                            {/* Bars - Mocked distribution */}
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
                </section>

                {/* You Might Also Like - Dynamic */}
                {relatedProducts.length > 0 && (
                    <section className="mt-40">
                        <div className="text-center mb-16">
                            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold-600 mb-4 block animate-in fade-in duration-700">Complete The Look</span>
                            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 tracking-tight mb-8">YOU MIGHT ALSO LIKE</h2>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((rel) => (
                                <Link key={rel.id} href={`/product/${rel.id}`} className="group block">
                                    <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden mb-4 border border-gray-100 rounded-sm">
                                        <Image
                                            src={rel.image}
                                            alt={rel.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xs font-bold tracking-widest uppercase text-gray-900 mb-2 truncate group-hover:text-gold-600 transition-colors">{rel.name}</h3>
                                        <p className="text-sm font-bold text-gray-900">RS {rel.price.toLocaleString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <div className="absolute top-34 md:top-48 left-0 right-0 pointer-events-none">
                    <TestimonialsDrawer />
                </div>
            </main>
        </div>
    );
};

export default ProductDetailsPage;
