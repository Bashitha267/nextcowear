import Image from "next/image";
import Link from "next/link";
import { Check, ShieldCheck, Zap, Heart, Globe, Award, Feather, Scissors, Leaf, Users, Quote } from "lucide-react";

export const metadata = {
    title: "Why Us | DressCo - Premium Sri Lankan Fashion",
    description: "Discover why DressCo is Sri Lanka's leading choice for premium fabrics and master craftsmanship. Experience island elegance like never before.",
};

export default function WhyUs() {
    return (
        <div className="relative min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://res.cloudinary.com/dlwrpzuwj/image/upload/v1770878852/burgess-milner-OYYE4g-I5ZQ-unsplash_c09dbk.jpg"
                    alt="Premium Fabric Background"
                    fill
                    className="object-cover brightness-[0.4] scale-105"
                    priority
                />
                <div className="relative z-10 text-center px-6 max-w-5xl">
                    <span className="inline-block text-gold-400 font-bold tracking-[0.5em] uppercase mb-6 animate-in fade-in slide-in-from-bottom duration-700">
                        The DressCo Promise
                    </span>
                    <h1 className="text-5xl md:text-8xl font-serif text-white leading-tight mb-8 animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
                        Why Choose <br />
                        <span className="bg-linear-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent">DressCo</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gold-50/80 font-light max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom duration-1000 delay-400">
                        Bridging the gap between traditional Sri Lankan comfort and modern global aesthetics.
                    </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-white to-transparent"></div>
                <div className="absolute -bottom-10 right-10 text-[20vw] font-serif font-bold text-white/5 select-none pointer-events-none">
                    HERITAGE
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="relative aspect-4/5 rounded-sm overflow-hidden shadow-2xl border-8 border-gold-50 group">
                        <Image
                            src="https://res.cloudinary.com/dlwrpzuwj/image/upload/v1770878980/mike-von-V4cl7_0N2mc-unsplash_fj0vqv.jpg"
                            alt="Sri Lankan Craftsmanship"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gold-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-sm font-bold tracking-[0.3em] text-gold-600 uppercase">Our Philosophy</h2>
                        <h3 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight">
                            Designed for the <span className="text-gold-500 italic">Tropical Heart</span>
                        </h3>
                        <p className="text-lg text-gray-600 leading-relaxed font-light">
                            We understand the Sri Lankan climate. Our fabrics are chosen not just for their beauty, but for their breathability and durability in the island's unique humidity and warmth.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                            {[
                                { icon: Feather, title: "Weightless Comfort", desc: "Feather-light fabrics that let your skin breathe." },
                                { icon: ShieldCheck, title: "Premium Durability", desc: "Made to withstand the test of time and wash." },
                                { icon: Globe, title: "Global Designs", desc: "Styles that shine in Colombo or London." },
                                { icon: Users, title: "Community First", desc: "Supporting local artisans and ethical practices." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-full bg-gold-50 flex items-center justify-center shrink-0 group-hover:bg-gold-500 transition-colors">
                                        <item.icon className="text-gold-600 group-hover:text-white transition-colors" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                        <p className="text-sm text-gray-500 leading-snug">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Fabrics Section */}
            <section className="py-24 bg-gold-950 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[50%] h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border border-gold-400/30 rounded-full animate-spin"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center mb-20 relative z-10">
                    <span className="inline-block px-4 py-1.5 rounded-full border border-gold-500/30 text-gold-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-6 bg-gold-500/5 backdrop-blur-sm">
                        The Material Edit
                    </span>
                    <h2 className="text-4xl md:text-7xl font-serif mb-8 text-gold-100">Fabric Selection</h2>
                    <p className="text-xl text-gold-100/60 max-w-3xl mx-auto font-light leading-relaxed">
                        We don't just pick fabrics; we engineer experiences. Our materials are curated for the vibrant Sri Lankan lifestyle.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                    {[
                        {
                            title: "Island Cotton",
                            tag: "Bestseller",
                            desc: "100% long-staple cotton that gets softer with every wash. Designed for 24/7 wear in island humidity.",
                            img: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=600",
                            color: "from-amber-100/20"
                        },
                        {
                            title: "Pure Linen",
                            tag: "Premium",
                            desc: "Ethically sourced flax, woven into a breathable masterpiece. The undisputed king of tropical elegance.",
                            img: "https://res.cloudinary.com/dlwrpzuwj/image/upload/v1770878852/marcus-loke-xXJ6utyoSw0-unsplash_ft50oz.jpg",
                            color: "from-gold-100/20"
                        },
                        {
                            title: "Silk Spandex",
                            tag: "Luxury",
                            desc: "A touch of stretch for the perfect silhouette, with the unparalleled sheen of pure silk. Modern luxury.",
                            img: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=600",
                            color: "from-yellow-100/20"
                        }
                    ].map((fabric, i) => (
                        <div key={i} className={`group relative overflow-hidden rounded-xl bg-linear-to-b ${fabric.color} to-gold-950/40 p-1 border border-white/10 hover:border-gold-500/50 transition-all duration-700`}>
                            <div className="relative h-80 overflow-hidden rounded-t-[10px]">
                                <Image
                                    src={fabric.img}
                                    alt={fabric.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-all duration-1000 brightness-75 group-hover:brightness-100"
                                />
                                <div className="absolute top-4 right-4 bg-gold-600 text-white text-[10px] font-bold px-3 py-1 tracking-widest uppercase rounded-full">
                                    {fabric.tag}
                                </div>
                            </div>
                            <div className="p-8">
                                <h4 className="text-3xl font-serif text-white mb-4 group-hover:text-gold-400 transition-colors">{fabric.title}</h4>
                                <p className="text-gold-50/70 font-light leading-relaxed text-base italic">
                                    "{fabric.desc}"
                                </p>
                                <div className="mt-6 w-12 h-0.5 bg-gold-500 group-hover:w-full transition-all duration-500"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Craftsmanship Section */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="absolute -left-20 top-1/2 -translate-y-1/2 text-gray-50 text-[15vw] font-serif font-black select-none pointer-events-none rotate-90">
                    CRAFT
                </div>

                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-24 items-center relative z-10">
                    <div className="flex-1 order-2 lg:order-1">
                        <h2 className="text-sm font-bold tracking-[0.4em] text-gold-600 uppercase mb-6">Unrivaled Detail</h2>
                        <h3 className="text-5xl md:text-7xl font-serif text-gray-900 mb-10 leading-[1.1]">The Island <br /><span className="bg-linear-to-r from-gold-600 to-amber-400 bg-clip-text text-transparent italic">Masterpiece</span></h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                            {[
                                { title: "Internal Finishes", desc: "Clean seams that never irritate the skin." },
                                { title: "Fit Control", desc: "3D tailored for the ideal drape." },
                                { title: "Hue Fastness", desc: "Colors that stay bright after 100 washes." },
                                { title: "Button Tech", desc: "Locked-stich buttons that stay secured." }
                            ].map((item, i) => (
                                <div key={i} className="border-l-4 border-gold-200 pl-6 group hover:border-gold-500 transition-colors">
                                    <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-wide text-sm">{item.title}</h4>
                                    <p className="text-sm text-gray-500 font-light leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 order-1 lg:order-2 relative group">
                        <div className="relative aspect-square w-full max-w-md mx-auto">
                            {/* Decorative gold ring */}
                            <div className="absolute -inset-4 border-2 border-gold-200 rounded-full group-hover:scale-105 transition-transform duration-700 animate-pulse"></div>

                            <div className="relative h-full w-full rounded-full overflow-hidden border-8 border-white shadow-2xl z-10">
                                <Image
                                    src="https://res.cloudinary.com/dnfbik3if/image/upload/v1770443139/Black_Modern_Fashion_Magazine_Cover_dowh0p.jpg"
                                    alt="Expert Tailoring"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                            </div>

                            {/* Floating tags */}
                            <div className="absolute bottom-[10%] -left-[5%] bg-white p-4 shadow-xl border border-gold-100 rounded-lg z-20 flex items-center gap-3 animate-bounce shadow-gold-500/20">
                                <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-white">
                                    <Award size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase">Quality Guaranteed</div>
                                    <div className="text-xs font-bold text-gray-900">Island Standards</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Rich Quote Section */}
            <section className="relative h-[60vh] flex items-center justify-center text-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://res.cloudinary.com/dlwrpzuwj/image/upload/v1770879368/alyssa-strohmann-TS--uNw-JqE-unsplash_nb5nez.jpg"
                        alt="Fashion Mood"
                        fill
                        className="object-cover brightness-[0.3]"
                    />
                </div>
                <div className="relative z-10 px-6 max-w-4xl">
                    <Quote size={60} className="text-gold-500 mx-auto mb-8 opacity-50" />
                    <p className="text-3xl md:text-5xl font-serif text-white leading-relaxed italic mb-10">
                        "DressCo is not just a brand; it's a testament to the sophistication of the modern Sri Lankan spirit."
                    </p>
                    <div className="w-20 h-1 bg-gold-500 mx-auto"></div>
                </div>
            </section>

            {/* Trust & Community */}
            <section className="py-20 bg-gold-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        <div>
                            <div className="text-4xl font-serif text-gold-600 mb-2">10k+</div>
                            <div className="text-xs font-bold tracking-widest text-gray-500 uppercase">Happy Customers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-serif text-gold-600 mb-2">100%</div>
                            <div className="text-xs font-bold tracking-widest text-gray-500 uppercase">Cotton Sourced Locally</div>
                        </div>
                        <div>
                            <div className="text-4xl font-serif text-gold-600 mb-2">24h</div>
                            <div className="text-xs font-bold tracking-widest text-gray-500 uppercase">Colombo Delivery</div>
                        </div>
                        <div>
                            <div className="text-4xl font-serif text-gold-600 mb-2">5.0</div>
                            <div className="text-xs font-bold tracking-widest text-gray-500 uppercase">Average Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-4xl md:text-6xl font-serif text-gray-900 mb-8 leading-tight">Ready to elevate your <br /> wardrobe?</h2>
                    <p className="text-xl text-gray-600 mb-12 font-light">Join thousands of Sri Lankans who have switched to DressCo's premium comfort.</p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            href="/collections"
                            className="bg-gold-500 text-white px-12 py-5 rounded-sm font-bold tracking-widest uppercase hover:bg-gold-600 transition-all shadow-lg"
                        >
                            Shop Now
                        </Link>
                        <Link
                            href="/reviews"
                            className="border border-gray-200 text-gray-900 px-12 py-5 rounded-sm font-bold tracking-widest uppercase hover:border-gold-500 hover:text-gold-500 transition-all"
                        >
                            Read Reviews
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
