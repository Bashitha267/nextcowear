import React from "react";
import Link from "next/link";
import Image from "next/image";
// import { Visa, Mastercard, Amex } from 'react-svg-credit-card-payment-icons';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";
const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
            <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
                    {/* About Us */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-900 border-b border-gray-100 pb-4 inline-block w-full">
                            About Us
                        </h4>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500 leading-relaxed max-w-xs transition-colors hover:text-gray-700">
                                DressCo is a proud Sri Lankan based company dedicated to crafting the finest
                                ethical and sustainable T-shirts. We combine heritage craftsmanship
                                with modern design to bring you luxury essentials that last.
                            </p>
                            <p className="text-sm text-gray-500 italic">
                                From Our Island to Your Wardrobe!
                            </p>
                            <Link
                                href="/our-story"
                                className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 border-b-2 border-gold-500 pb-1 hover:text-gold-500 transition-colors inline-block"
                            >
                                Read more
                            </Link>
                        </div>
                    </div>

                    {/* Shop */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-900 border-b border-gray-100 pb-4 inline-block w-full">
                            Shop
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { name: "Womens Short Sleeve", href: "/women/short-sleeve" },
                                { name: "Womens Long Sleeve", href: "/women/long-sleeve" },
                                { name: "Womens French Terry", href: "/women/french-terry" },
                                { name: "Mens Short Sleeve", href: "/men/short-sleeve" },
                                { name: "Mens Long Sleeve", href: "/men/long-sleeve" },
                                { name: "Mens French Terry", href: "/men/french-terry" },
                                { name: "All Collections", href: "/collections" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-500 hover:text-gold-500 transition-colors font-medium"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Explore */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-900 border-b border-gray-100 pb-4 inline-block w-full">
                            Explore
                        </h4>
                        <ul className="space-y-4">
                            {[
                                "Returns",
                                "Reviews",
                                "FAQs",
                                "Size Charts",
                                "Care Guide",
                                "Sustainable Living",
                                "Terms & Privacy",
                                "Accessibility Statement",
                            ].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                                        className="text-sm text-gray-500 hover:text-gold-500 transition-colors font-medium"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-900 border-b border-gray-100 pb-4 inline-block w-full">
                            Connect
                        </h4>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <Phone size={16} className="text-gold-500" />
                                    <span className="font-semibold">+94 112 345 678</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <Mail size={16} className="text-gold-500" />
                                    <span className="font-semibold">hello@dressco.lk</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-gray-500">
                                    <MapPin size={16} className="text-gold-500 shrink-0 mt-1" />
                                    <span className="font-semibold">
                                        123 Designer Avenue,<br />
                                        Colombo 00700,<br />
                                        Sri Lanka
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 pt-4">
                                <Link href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                                    <Facebook size={20} strokeWidth={1.5} />
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                                    <Instagram size={20} strokeWidth={1.5} />
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                                    <Twitter size={20} strokeWidth={1.5} />
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                                    <Youtube size={20} strokeWidth={1.5} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <div className="space-y-2">
                        <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">
                            &copy; {new Date().getFullYear()} DressCo (PVT) Ltd. All Rights Reserved.
                        </p>
                        <p className="text-[9px] text-gray-400 tracking-widest uppercase">
                            Premium T-Shirts | Born in Sri Lanka
                        </p>
                    </div>

                    <div className="flex items-center gap-6 opacity-90  transition-all duration-500 text-gold-500">

                        <FaCcVisa size={30} />
                        <FaCcMastercard size={30} />
                        <FaCcAmex size={30} />
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
