"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, ChevronDown, LogOut, Settings, Package, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { CATEGORIES } from "@/lib/data";
import LoginModal from "./LoginModal";

interface NavLink {
    name: string;
    href: string;
    children?: string[];
}

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const [categories, setCategories] = useState<{ name: string, subCategories: string[] }[]>([]);
    const { totalItems, setIsCartOpen } = useCart();
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const { getCategories } = await import('@/lib/api');
            const data = await getCategories();
            if (data) {
                setCategories(data);
            }
        };
        fetchCategories();

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (totalItems > 0) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [totalItems]);

    const navLinks: NavLink[] = [
        { name: "Home", href: "/" },
        { name: "Collections", href: "/collections" },
        ...(categories.map(cat => ({
            name: cat.name,
            href: `/collections?category=${cat.name}`,
            children: cat.subCategories
        })) as NavLink[]),
    ];

    const rightLinks: NavLink[] = [
        { name: "Why Us", href: "/why-us" },
        { name: "Reviews", href: "/reviews" },
        { name: "Our Heritage", href: "/our-heritage" },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-999 transition-all duration-500 ${isScrolled
                    ? "bg-white/95 backdrop-blur-md py-2 lg:py-3 shadow-sm border-b border-gold-100"
                    : "bg-white py-3 lg:py-4 border-t-4 border-t-gold-500 border-b border-b-gold-50"
                    }`}
            >
                <div className="w-full px-4 md:px-12 flex items-center h-full">

                    <div className="flex-1 flex items-center justify-start relative">
                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden text-gray-900 hover:text-gold-500 transition-colors p-4 -ml-4 relative z-1001"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMobileMenuOpen(!isMobileMenuOpen);
                            }}
                            aria-label="Toggle Menu"
                        >
                            {isMobileMenuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
                        </button>

                        {/* Desktop Left Links */}
                        <div className="hidden lg:flex items-center space-x-6 xl:space-x-10">
                            {navLinks.map((link) => (
                                <div
                                    key={link.name}
                                    className="relative group h-full flex items-center"
                                    onMouseEnter={() => setActiveDropdown(link.name)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link
                                        href={link.href}
                                        className="text-[10px] md:text-[9px] lg:text-[8px] xl:text-[14px] font-bold tracking-[0.2em] uppercase hover:text-gold-600 transition-colors text-gray-900 flex items-center gap-2 py-4"
                                    >
                                        {link.name}
                                        {link.children && link.children.length > 0 && (
                                            <ChevronDown
                                                size={11}
                                                className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180 text-gold-500' : 'text-gray-400'}`}
                                            />
                                        )}
                                    </Link>

                                    {/* Dropdown Menu */}
                                    {link.children && link.children.length > 0 && (
                                        <div className={`absolute top-full left-0 w-64 bg-white shadow-2xl border-t-2 border-gold-500 py-8 px-10 transition-all duration-300 origin-top transform ${activeDropdown === link.name ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                                            <div className="flex flex-col space-y-5 border-l-2 border-gold-100 pl-5">
                                                <Link
                                                    href={link.href}
                                                    className="text-[14px] font-extrabold tracking-[0.2em] uppercase text-gold-600 hover:text-gold-800 transition-colors"
                                                >
                                                    View All
                                                </Link>
                                                {link.children.map((sub: string) => (
                                                    <Link
                                                        key={sub}
                                                        href={`/collections?category=${link.name}&sub=${sub}`}
                                                        className="text-[13px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-gold-600 transition-colors whitespace-nowrap"
                                                    >
                                                        {sub}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Center Section: Logo (Shrink-0) */}
                    <div className="shrink-0 flex justify-center relative z-50">
                        <Link href="/" className="block relative h-14 lg:h-16 w-28 md:w-36 lg:w-56" onClick={() => setIsMobileMenuOpen(false)}>
                            <Image
                                src="/logo.png"
                                alt="DressCo Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Right Section: Desktop Links & Icons (Flex-1) */}
                    <div className="flex-1 flex items-center justify-end gap-6 xl:gap-8">
                        <div className="hidden lg:flex items-center space-x-6 xl:space-x-10">
                            {rightLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-[10px] md:text-[9px] lg:text-[8px] xl:text-[14px] font-bold tracking-[0.2em] uppercase hover:text-gold-600 transition-colors text-gray-900"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4 lg:space-x-7 relative z-50">
                            <button className="text-gray-900 hover:text-gold-600 transition-colors" title="Search">
                                <Search size={24} strokeWidth={1} />
                            </button>
                            <button
                                className="text-gray-900 hover:text-gold-600 transition-all relative group/cart"
                                title="Shopping Bag"
                                onClick={() => setIsCartOpen(true)}
                            >
                                <ShoppingBag size={24} strokeWidth={1} />
                                {totalItems > 0 && (
                                    <span className={`absolute -top-2 -right-2 bg-gold-600 text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shadow-sm group-hover/cart:scale-110 transition-transform ${isAnimating ? 'animate-bounce' : ''}`}>
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            {/* User Account Dropdown */}
                            <div className="relative">
                                {user ? (
                                    <div className="relative">
                                        <button
                                            className="flex items-center gap-2 group focus:outline-none"
                                            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-600 font-bold text-sm border-2 border-transparent group-hover:border-gold-200 transition-all">
                                                {(user.name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
                                            </div>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isUserDropdownOpen && (
                                            <div className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                                <div className="px-6 py-4 border-b border-gray-50 mb-2 bg-gray-50/50 rounded-t-2xl">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                                                    <p className="text-sm font-bold text-gray-900 truncate">{user.name || user.email}</p>
                                                    <p className="text-[10px] text-gold-600 font-medium uppercase tracking-wide mt-1">{user.role}</p>
                                                </div>
                                                <div className="flex flex-col p-2 space-y-1">
                                                    <Link
                                                        href={user.role === 'admin' ? "/admin/orders" : "/account/orders"}
                                                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gold-50 hover:text-gold-900 transition-all uppercase tracking-widest"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        <Package size={16} /> {user.role === 'admin' ? 'Admin Dashboard' : 'My Orders'}
                                                    </Link>

                                                    {user.role !== 'admin' && (
                                                        <Link
                                                            href="/account"
                                                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gold-50 hover:text-gold-900 transition-all uppercase tracking-widest"
                                                            onClick={() => setIsUserDropdownOpen(false)}
                                                        >
                                                            <UserCircle size={16} /> My Account
                                                        </Link>
                                                    )}

                                                    <div className="h-px bg-gray-100 my-1 mx-2" />

                                                    <button
                                                        onClick={() => {
                                                            logout();
                                                            setIsUserDropdownOpen(false);
                                                        }}
                                                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest text-left w-full"
                                                    >
                                                        <LogOut size={16} /> Logout
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsLoginOpen(true)}
                                        className="text-gray-900 hover:text-gold-600 transition-colors block"
                                        title="Sign In"
                                    >
                                        <User size={24} strokeWidth={1} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Overlay */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden absolute top-full left-[-16px] md:left-[-48px] w-[calc(100%+32px)] md:w-[calc(100%+96px)] bg-white border-t border-gold-100 shadow-2xl overflow-y-auto max-h-[85vh] animate-in fade-in slide-in-from-top duration-300 z-1000">
                            <div className="px-8 py-12 flex flex-col space-y-10 bg-white">
                                {[...navLinks, ...rightLinks].map((link) => (
                                    <div key={link.name} className="flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <Link
                                                href={link.href}
                                                className="text-[14px] font-bold tracking-[0.2em] uppercase text-gray-900 py-1"
                                                onClick={() => (!link.children || link.children.length === 0) && setIsMobileMenuOpen(false)}
                                            >
                                                {link.name}
                                            </Link>
                                            {link.children && link.children.length > 0 && (
                                                <button
                                                    onClick={() => setMobileExpanded(mobileExpanded === link.name ? null : link.name)}
                                                    className="p-3 text-gold-600 bg-gold-50/50 rounded-full active:scale-95 transition-all"
                                                >
                                                    <ChevronDown className={`transition-transform duration-300 ${mobileExpanded === link.name ? 'rotate-180' : ''}`} size={20} />
                                                </button>
                                            )}
                                        </div>

                                        {link.children && link.children.length > 0 && mobileExpanded === link.name && (
                                            <div className="mt-5 pl-7 border-l-2 border-gold-200 flex flex-col space-y-6 py-2 animate-in fade-in slide-in-from-left duration-500">
                                                <Link
                                                    href={link.href}
                                                    className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-gold-600"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    View All {link.name}
                                                </Link>
                                                {link.children.map((sub: string) => (
                                                    <Link
                                                        key={sub}
                                                        href={`/collections?category=${link.name}&sub=${sub}`}
                                                        className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        {sub}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
};

export default Navbar;
