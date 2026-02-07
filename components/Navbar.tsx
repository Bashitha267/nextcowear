"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";

/**
 * Premium Navbar for DressCo
 * Features:
 * - White and Gold theme
 * - Centered logo
 * - Responsive mobile menu
 * - Scroll-based transparency and shrinking
 */
const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Women", href: "/women" },
        { name: "Men", href: "/men" },
        { name: "French Terry", href: "/french-terry" },
        { name: "Sustainability", href: "/sustainability" },
        { name: "Why Us", href: "/why-us" },
    ];

    const rightLinks = [
        { name: "Reviews", href: "/reviews" },
        { name: "Our Story", href: "/our-story" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/98 backdrop-blur-md py-6 lg:py-8 shadow-md border-b-2 border-gold-200"
                : "bg-white py-7 lg:py-9 border-t-4 border-gold-500"
                }`}
        >
            <div className="max-w-[1440px] mx-auto px-4 md:px-10 flex items-center justify-between relative">
                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden text-gray-900 hover:text-gold-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Left Side: Links (Desktop) */}
                <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-[11px] font-semibold tracking-[0.2em] uppercase hover:text-gold-500 transition-colors text-gray-900"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Center: Logo */}
                <div className="absolute left-1/2 -translate-x-1/2 shrink-0">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="DressCo Logo"
                            width={240}
                            height={80}
                            className="h-14 lg:h-16 w-auto object-cover"
                            priority
                        />
                    </Link>
                </div>

                {/* Right Side: Links & Icons (Desktop) */}
                <div className="flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
                    <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 mr-4">
                        {rightLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[11px] font-semibold tracking-[0.2em] uppercase hover:text-gold-500 transition-colors text-gray-900"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-3 md:space-x-5">
                        <button className="text-gold-600 hover:text-gold-400 transition-colors">
                            <User size={19} strokeWidth={1.5} />
                        </button>
                        <button className="text-gold-600 hover:text-gold-400 transition-colors">
                            <Search size={19} strokeWidth={1.5} />
                        </button>
                        <button className="text-gold-600 hover:text-gold-400 transition-colors relative">
                            <ShoppingBag size={19} strokeWidth={1.5} />
                            <span className="absolute -top-1.5 -right-1.5 bg-gold-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                                0
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gold-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top duration-300">
                    <div className="flex flex-col p-8 space-y-6 bg-white">
                        {[...navLinks, ...rightLinks].map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-semibold tracking-[0.2em] uppercase hover:text-gold-500 transition-colors text-gray-900"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
