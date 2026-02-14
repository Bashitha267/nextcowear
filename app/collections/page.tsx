"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    ChevronDown,
    ChevronUp,
    Filter,
    LayoutGrid,
    List,
    Search,
    Star,
    X,
    Plus,
    Minus,
    SlidersHorizontal,
    ArrowRight,
    Heart,
    ShoppingBag
} from "lucide-react";
import { Product } from "@/lib/data"; // Keep Product type if still used
import { getProducts, getCategories, getFilterOptions } from '@/lib/api';
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-hot-toast";

// Define Category type if not already defined elsewhere
interface Category {
    name: string;
    subCategories: string[];
}

const CollectionsContent = () => {
    const searchParams = useSearchParams();

    // Data State
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filterOptions, setFilterOptions] = useState<{ colors: { name: string, hex_value: string }[], sizes: string[] }>({ colors: [], sizes: [] });
    const [loading, setLoading] = useState(true);

    // Filters State
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>("All");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
    const [sortBy, setSortBy] = useState<string>("recommended");
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    // UI State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;

    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { user, setIsLoginModalOpen } = useAuth();
    const { addToCart } = useCart();

    // Helper for Wishlist
    const handleWishlistToggle = async (e: React.MouseEvent, productId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            setIsLoginModalOpen(true);
            return;
        }

        if (isInWishlist(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    // Fetch Initial Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { getProducts, getCategories, getFilterOptions } = await import('@/lib/api');
                const [productsData, categoriesData, optionsData] = await Promise.all([
                    getProducts(),
                    getCategories(),
                    getFilterOptions()
                ]);

                setProducts(productsData);
                setCategories(categoriesData);
                setFilterOptions(optionsData);
            } catch (error) {
                console.error("Failed to fetch collections data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle initial filters from URL
    useEffect(() => {
        if (categories.length > 0) {
            const category = searchParams.get('category');
            const sub = searchParams.get('sub');

            if (category) {
                const matchedCat = categories.find(c => c.name.toLowerCase() === category.toLowerCase())?.name;
                if (matchedCat) {
                    setSelectedCategory(matchedCat);
                    if (sub) {
                        const matchedSub = categories.find(c => c.name === matchedCat)?.subCategories.find(s => s.toLowerCase() === sub.toLowerCase());
                        if (matchedSub) {
                            setSelectedSubCategory(matchedSub);
                        }
                    }
                }
            }
        }
    }, [searchParams, categories]);

    // Accordion state for filters
    const [expandedFilters, setExpandedFilters] = useState({
        categories: true,
        price: true,
        sort: true,
        colors: true,
        sizes: true
    });

    const toggleFilter = (key: keyof typeof expandedFilters) => {
        setExpandedFilters(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Filter and Sort logic
    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (selectedCategory !== "All") {
            result = result.filter(p => p.category === selectedCategory);
        }

        if (selectedSubCategory !== "All") {
            result = result.filter(p => p.subCategory === selectedSubCategory);
        }

        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        if (selectedColors.length > 0) {
            result = result.filter(p =>
                p.colors.classic?.some(c => selectedColors.includes(c.name)) ||
                p.colors.seasonal?.some(c => selectedColors.includes(c.name))
            );
        }

        if (selectedSizes.length > 0) {
            result = result.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
        }

        // Sorting
        switch (sortBy) {
            case "price-low":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                result.sort((a, b) => b.price - a.price);
                break;
            case "newest":
                result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case "top-sellers":
                result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
                break;
            default:
                // recommended/default
                break;
        }

        return result;
    }, [selectedCategory, selectedSubCategory, priceRange, sortBy, selectedColors, selectedSizes, products]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    const toggleColor = (colorName: string) => {
        setSelectedColors(prev =>
            prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
        );
        setCurrentPage(1);
    };

    const toggleSize = (sizeName: string) => {
        setSelectedSizes(prev =>
            prev.includes(sizeName) ? prev.filter(s => s !== sizeName) : [...prev, sizeName]
        );
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-[#FCF9F2] pt-20 lg:pt-26 pb-20">
            {/* Hero / Banner Area */}
            <section className="relative h-[45vh] lg:h-[50vh] mb-12 flex items-center justify-center overflow-hidden bg-gold-300 ">
                <Image
                    src="https://res.cloudinary.com/dnfbik3if/image/upload/v1770473563/Brown_Aesthetic_Fashion_Sale_Billboard_Landscape_baomjp.png"
                    alt="Collections Banner Desktop"
                    fill
                    className="hidden lg:block object-cover opacity-80 brightness-70"
                    priority
                />
                <Image
                    src="https://res.cloudinary.com/dnfbik3if/image/upload/v1770443930/Beige_White_and_Brown_Modern_Fashion_Facebook_Cover_on5b6y.jpg"
                    alt="Collections Banner Mobile"
                    fill
                    className="lg:hidden object-cover opacity-80 brightness-70"
                    priority
                />
                <div className="relative z-10 text-center text-white px-4">
                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.6em] uppercase mb-4 block animate-in fade-in slide-in-from-bottom duration-700">
                        Premium Selection
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-lg tracking-wider">COLLECTIONS</h1>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase opacity-80">
                        <Link href="/" className="hover:text-gold-200 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-gold-200">Products</span>
                    </div>
                </div>
            </section>

            <div className="w-full px-4 md:px-10 flex flex-col lg:flex-row gap-12">
                {/* Sidebar Filters (Desktop) */}
                <aside className="hidden lg:block w-72 shrink-0">
                    <div className="sticky top-40 space-y-8">
                        <div className="flex items-center justify-between py-2 border-b-2 border-gold-200 pb-4 mb-8">
                            <h2 className="text-xl font-serif text-gray-900 tracking-tight mb-2">FILTERS</h2>
                            <button
                                onClick={() => {
                                    setSelectedCategory("All");
                                    setSelectedSubCategory("All");
                                    setPriceRange([0, 50000]);
                                }}
                                className="text-[10px] font-bold tracking-widest text-gold-600 hover:text-gold-400 transition-colors uppercase underline underline-offset-4"
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Categories Filter */}
                        <div className="border-b border-gold-100 pb-6">
                            <button
                                onClick={() => toggleFilter('categories')}
                                className="flex items-center justify-between w-full mb-6 group"
                            >
                                <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 group-hover:text-gold-600 transition-colors">Category</span>
                                {expandedFilters.categories ? <Minus size={14} className="text-gold-500" /> : <Plus size={14} className="text-gold-500" />}
                            </button>
                            {expandedFilters.categories && (
                                <div className="space-y-6">
                                    {categories.map((cat) => (
                                        <div key={cat.name} className="animate-in fade-in duration-300">
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory(selectedCategory === cat.name ? "All" : cat.name);
                                                    setSelectedSubCategory("All");
                                                }}
                                                className={`flex items-center justify-between w-full text-[11px] font-bold tracking-widest uppercase mb-3 transition-all ${selectedCategory === cat.name ? 'text-gold-600 pl-2 border-l-2 border-gold-500' : 'text-gray-500 hover:text-gold-400'}`}
                                            >
                                                <span>{cat.name}</span>
                                                <ChevronDown
                                                    size={12}
                                                    className={`transition-transform duration-300 ${selectedCategory === cat.name ? 'rotate-180' : ''}`}
                                                />
                                            </button>
                                            {selectedCategory === cat.name && (
                                                <div className="pl-4 space-y-3 border-l border-gold-200 ml-1 mt-2 animate-in slide-in-from-top-1 duration-300">
                                                    <button
                                                        onClick={() => setSelectedSubCategory("All")}
                                                        className={`text-[10px] font-bold tracking-widest uppercase block transition-colors ${selectedSubCategory === "All" ? 'text-gold-500 bg-gold-50/50 px-2 py-1 rounded-sm' : 'text-gray-400 hover:text-gold-400'}`}
                                                    >
                                                        All {cat.name}
                                                    </button>
                                                    {cat.subCategories.map(sub => (
                                                        <button
                                                            key={sub}
                                                            onClick={() => setSelectedSubCategory(sub)}
                                                            className={`text-[10px] font-bold tracking-widest uppercase block transition-colors ${selectedSubCategory === sub ? 'text-gold-500 bg-gold-50/50 px-2 py-1 rounded-sm' : 'text-gray-400 hover:text-gold-400'}`}
                                                        >
                                                            {sub}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            setSelectedCategory("All");
                                            setSelectedSubCategory("All");
                                        }}
                                        className={`text-[11px] font-bold tracking-widest uppercase block transition-colors ${selectedCategory === "All" ? 'text-gold-600 pl-2 border-l-2 border-gold-500' : 'text-gray-500 hover:text-gold-400'}`}
                                    >
                                        All Categories
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Price Filter */}
                        <div className="border-b border-gold-100 pb-6">
                            <button
                                onClick={() => toggleFilter('price')}
                                className="flex items-center justify-between w-full mb-6 group"
                            >
                                <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 group-hover:text-gold-600 transition-colors">Price Range</span>
                                {expandedFilters.price ? <Minus size={14} className="text-gold-500" /> : <Plus size={14} className="text-gold-500" />}
                            </button>
                            {expandedFilters.price && (
                                <div className="px-1 animate-in fade-in duration-300">
                                    <input
                                        type="range"
                                        min="0"
                                        max="50000"
                                        step="1000"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                        className="w-full accent-gold-500 bg-gold-200 h-1.5 rounded-full cursor-pointer appearance-none mb-4"
                                    />
                                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 uppercase tracking-widest">
                                        <span>RS 0</span>
                                        <span className="bg-gold-500 text-white px-3 py-1 rounded-sm">RS {priceRange[1].toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Product Grid Area */}
                <main className="flex-1">
                    {/* Redesigned Controls Bar (Mobile Optimized) */}
                    <div className="mb-14">
                        {/* Mobile Grid Controls */}
                        <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
                            <button
                                className="flex items-center justify-center gap-3 bg-white border border-gold-200 h-14 rounded-sm text-[10px] font-extrabold tracking-[0.2em] uppercase hover:bg-gold-50 transition-all active:scale-[0.97] shadow-xs"
                                onClick={() => setIsFilterOpen(true)}
                            >
                                <SlidersHorizontal size={14} className="text-gold-600" />
                                Filters
                            </button>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full bg-white border border-gold-200 h-14 px-4 rounded-sm text-[10px] font-extrabold tracking-[0.2em] uppercase appearance-none focus:outline-none focus:border-gold-500 transition-colors pr-10"
                                >
                                    <option value="recommended">Sort: Default</option>
                                    <option value="newest">Newest</option>
                                    <option value="top-sellers">Popular</option>
                                    <option value="price-low">Price: Low</option>
                                    <option value="price-high">Price: High</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Results Count & Desktop Controls */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gold-100 pb-8">
                            <div className="hidden lg:flex items-center gap-6">
                                <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-gray-400">
                                    Showing <span className="text-gray-900 underline underline-offset-8 decoration-gold-400 decoration-2">{paginatedProducts.length}</span> of <span className="text-gray-900">{filteredProducts.length}</span> Products
                                </div>
                            </div>

                            {/* Mobile specific count (Centered) */}
                            <div className="lg:hidden w-full text-center">
                                <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-gray-400 flex items-center justify-center gap-3">
                                    <span className="w-6 h-px bg-gold-200"></span>
                                    {paginatedProducts.length} Results Found
                                    <span className="w-6 h-px bg-gold-200"></span>
                                </span>
                            </div>

                            {/* Desktop Sort */}
                            <div className="hidden lg:flex items-center gap-4">
                                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 whitespace-nowrap">Sort By:</span>
                                <div className="relative w-56">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="bg-white border-2 border-gold-100 py-3.5 px-6 rounded-sm text-[10px] font-bold tracking-[0.2em] uppercase focus:outline-none focus:border-gold-500 w-full appearance-none cursor-pointer transition-all pr-12 hover:border-gold-300"
                                    >
                                        <option value="recommended">Recommended</option>
                                        <option value="newest">New Arrivals</option>
                                        <option value="top-sellers">Top Sellers</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    {paginatedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-4 gap-y-14 sm:gap-x-8 sm:gap-y-20">
                            {paginatedProducts.map((product) => (
                                <div key={product.id} className="group animate-in fade-in zoom-in duration-500">
                                    <div className="relative aspect-3/4 overflow-hidden mb-6 border-2 border-gold-50 group-hover:border-gold-300 transition-all duration-700 shadow-sm rounded-sm">
                                        <Link href={`/product/${product.id}`} className="block relative w-full h-full cursor-pointer overflow-hidden z-10">
                                            {/* Primary Image */}
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className={`object-cover transition-opacity duration-500 ${product.additionalImages && product.additionalImages.length > 0 ? 'group-hover:opacity-0' : ''}`}
                                            />
                                            {/* Secondary Image on Hover */}
                                            {product.additionalImages && product.additionalImages.length > 0 && (
                                                <Image
                                                    src={product.additionalImages[0]}
                                                    alt={`${product.name} View 2`}
                                                    fill
                                                    className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                />
                                            )}

                                            {(product.isNew || product.isBestSeller || product.isFeatured) && (
                                                <div className="absolute top-0 left-0 w-28 h-28 overflow-hidden z-20 pointer-events-none">
                                                    <div className={`absolute -left-9 top-5 w-40 -rotate-45 text-white text-[10px] font-bold tracking-widest uppercase py-1.5 text-center shadow-lg backdrop-blur-md 
                                                        ${product.isNew ? 'bg-emerald-600/95' : product.isFeatured ? 'text-gold-200 bg-gray-900/95' : 'bg-gold-600/95'}`}>
                                                        {product.isNew ? 'New Arrival' : product.isFeatured ? 'Featured' : 'Best Seller'}
                                                    </div>
                                                </div>
                                            )}
                                        </Link>

                                        {/* Wishlist Button - Top Right */}
                                        <button
                                            onClick={(e) => handleWishlistToggle(e, product.id)}
                                            className={`absolute top-4 right-4 p-2.5 rounded-full shadow-lg transition-all z-20 hover:scale-110 active:scale-90 ${isInWishlist(product.id) ? 'bg-gold-500 text-white' : 'bg-white/95 text-gray-400 hover:text-gold-500'}`}
                                            title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                                        >
                                            <div className={isInWishlist(product.id) ? "animate-in zoom-in spin-in-12 duration-300" : ""}>
                                                <Heart size={18} className={isInWishlist(product.id) ? "fill-current" : ""} />
                                            </div>
                                        </button>

                                        {/* Quick Add Bottom Bar */}
                                        <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    const defaultSize = product.sizes?.[0] || "";
                                                    const defaultColor = product.colors?.classic?.[0]?.name || product.colors?.seasonal?.[0]?.name || "";
                                                    addToCart(product, 1, defaultSize, defaultColor);
                                                    toast.success("Added to cart");
                                                }}
                                                className="w-full bg-white/95 backdrop-blur-md text-gray-900 border-t border-gold-200 py-4 text-[10px] font-extrabold tracking-[0.4em] uppercase hover:bg-gold-500 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-2"
                                            >
                                                Add to Cart <ShoppingBag size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <Link href={`/product/${product.id}`} className="block mb-3 group-hover:text-gold-600 transition-colors">
                                            <h3 className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-gray-900 h-10 line-clamp-2 leading-relaxed px-2">{product.name}</h3>
                                        </Link>
                                        <div className="flex items-center justify-center gap-3 mb-4">
                                            <span className={`text-[12px] font-bold tracking-widest ${product.originalPrice ? 'text-gold-600' : 'text-gray-900'}`}>
                                                RS {product.price.toLocaleString()}
                                            </span>
                                            {product.originalPrice && (
                                                <span className="text-[10px] text-gray-400 line-through tracking-wider">
                                                    RS {product.originalPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-center gap-2 mb-5">
                                            {[...(product.colors.classic || []), ...(product.colors.seasonal || [])].slice(0, 5).map((color, idx) => (
                                                <div
                                                    key={`${color.name}-${idx}`}
                                                    className="w-3.5 h-3.5 rounded-full border border-gray-100 shadow-sm transition-all hover:scale-150 cursor-pointer hover:shadow-md"
                                                    style={{ backgroundColor: color.hex }}
                                                    title={color.name}
                                                />
                                            ))}
                                            {[...(product.colors.classic || []), ...(product.colors.seasonal || [])].length > 5 && (
                                                <span className="text-[8px] font-bold text-gray-400 self-center">
                                                    +{[...(product.colors.classic || []), ...(product.colors.seasonal || [])].length - 5}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="flex text-gold-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={11} className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-200"} strokeWidth={1} />
                                                ))}
                                            </div>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] border-l border-gray-200 pl-2">({product.reviews})</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white border-2 border-dashed border-gold-200 rounded-sm">
                            <X size={48} className="mx-auto mb-6 text-gold-300" />
                            <h3 className="text-2xl font-serif text-gray-900 mb-4 tracking-tight">No Products Found</h3>
                            <p className="text-gray-500 text-[11px] font-bold tracking-widest uppercase max-w-xs mx-auto mb-10 leading-relaxed italic">Try adjusting your filters or search criteria to find what you're looking for.</p>
                            <button
                                onClick={() => {
                                    setSelectedCategory("All");
                                    setSelectedSubCategory("All");
                                    setPriceRange([0, 50000]);
                                }}
                                className="bg-gold-500 text-white px-10 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gold-700 transition-all shadow-xl active:scale-95"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-24 pt-14 border-t border-gold-100 flex flex-col sm:flex-row items-center justify-between gap-10">
                            <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">
                                Page <span className="text-gray-900 font-extrabold underline decoration-gold-400">{currentPage}</span> of <span className="text-gray-900">{totalPages}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className={`w-12 h-12 border border-gold-200 flex items-center justify-center transition-all rounded-sm ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-gold-500 hover:text-white hover:border-gold-500'}`}
                                >
                                    <ChevronUp size={20} className="-rotate-90" />
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-12 h-12 border text-[11px] font-bold transition-all rounded-sm tracking-widest ${currentPage === i + 1 ? 'bg-gold-600 text-white border-gold-600 shadow-lg scale-110 z-10' : 'border-gold-100 text-gray-400 hover:border-gold-400 hover:text-gold-600'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    className={`w-12 h-12 border border-gold-200 flex items-center justify-center transition-all rounded-sm ${currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : 'hover:bg-gold-500 hover:text-white hover:border-gold-500'}`}
                                >
                                    <ChevronUp size={20} className="rotate-90" />
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="group flex items-center gap-3 text-[10px] font-extrabold tracking-[0.3em] uppercase text-gold-600 hover:text-gold-800 transition-colors"
                            >
                                Back to top
                                <ChevronUp size={18} className="group-hover:-translate-y-1.5 transition-transform duration-300" />
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Filter Drawer (Enhanced Smooth Entrance from Left) */}
            {isFilterOpen && (
                <div
                    className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-md lg:hidden animate-in fade-in duration-500 cursor-pointer ease-in-out"
                    onClick={() => setIsFilterOpen(false)}
                >
                    <div
                        className="absolute left-0 top-0 h-full w-[90%] max-w-sm bg-[#FCF9F2] shadow-2xl animate-in slide-in-from-left duration-700 flex flex-col border-r border-gold-200 cursor-default ease-in-out"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-8 border-b border-gold-200 bg-white shadow-sm animate-in fade-in slide-in-from-left duration-700 delay-100">
                            <h2 className="text-2xl font-serif text-gray-900 tracking-tight">FILTERS</h2>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="p-3 bg-gold-50 rounded-full hover:bg-gold-100 transition-colors active:scale-90"
                            >
                                <X size={24} className="text-gray-900" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-12 no-scrollbar animate-in fade-in duration-1000 delay-200">
                            {/* Mobile Categories */}
                            <div>
                                <h3 className="text-[11px] font-bold tracking-[0.4em] uppercase text-gold-600 mb-8 flex items-center gap-4">
                                    <span className="w-10 h-px bg-gold-400"></span>
                                    Category
                                </h3>
                                <div className="space-y-8">
                                    {categories.map((cat) => (
                                        <div key={cat.name} className="animate-in fade-in duration-300">
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory(selectedCategory === cat.name ? "All" : cat.name);
                                                    setSelectedSubCategory("All");
                                                }}
                                                className={`flex items-center justify-between w-full text-[13px] font-bold tracking-widest uppercase transition-all ${selectedCategory === cat.name ? 'text-gold-600 scale-105 origin-left' : 'text-gray-500'}`}
                                            >
                                                <span>{cat.name}</span>
                                                <ChevronDown
                                                    size={16}
                                                    className={`transition-transform duration-300 ${selectedCategory === cat.name ? 'rotate-180 text-gold-500' : 'text-gray-400'}`}
                                                />
                                            </button>
                                            {selectedCategory === cat.name && (
                                                <div className="pl-6 mt-6 space-y-6 border-l-2 border-gold-200 animate-in slide-in-from-top-2 duration-500">
                                                    <button
                                                        onClick={() => setSelectedSubCategory("All")}
                                                        className={`text-[11px] font-bold tracking-widest uppercase block transition-colors ${selectedSubCategory === "All" ? 'text-gold-500' : 'text-gray-400'}`}
                                                    >
                                                        All {cat.name}
                                                    </button>
                                                    {cat.subCategories.map(sub => (
                                                        <button
                                                            key={sub}
                                                            onClick={() => setSelectedSubCategory(sub)}
                                                            className={`text-[11px] font-bold tracking-widest uppercase block transition-colors ${selectedSubCategory === sub ? 'text-gold-500' : 'text-gray-400'}`}
                                                        >
                                                            {sub}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            setSelectedCategory("All");
                                            setSelectedSubCategory("All");
                                        }}
                                        className={`text-[13px] font-bold tracking-widest uppercase block transition-colors ${selectedCategory === "All" ? 'text-gold-600' : 'text-gray-500'}`}
                                    >
                                        All Categories
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Price */}
                            <div>
                                <h3 className="text-[11px] font-bold tracking-[0.4em] uppercase text-gold-600 mb-8 flex items-center gap-4">
                                    <span className="w-10 h-px bg-gold-400"></span>
                                    Price Range
                                </h3>
                                <div className="px-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max="50000"
                                        step="1000"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                        className="w-full accent-gold-500 mb-8 h-2 bg-gold-100 rounded-full appearance-none shadow-inner"
                                    />
                                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 uppercase tracking-widest">
                                        <span>RS 0</span>
                                        <span className="bg-gold-600 text-white px-5 py-2.5 rounded-sm shadow-xl font-extrabold">RS {priceRange[1].toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 border-t border-gold-100 bg-white">
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="w-full bg-gold-600 text-white py-6 text-xs font-bold tracking-[0.4em] uppercase shadow-[0_10px_30px_rgba(212,175,55,0.3)] active:scale-[0.98] transition-all rounded-sm flex items-center justify-center gap-3"
                            >
                                Show {filteredProducts.length} Results
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const CollectionsPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin"></div>
            </div>
        }>
            <CollectionsContent />
        </Suspense>
    );
};

export default CollectionsPage;
