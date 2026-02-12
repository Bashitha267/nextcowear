import React from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Award, Leaf, Users } from "lucide-react";
import { Metadata } from "next";
import { HeritageForm } from "@/components/HeritageForm";

export const metadata: Metadata = {
    title: "Our Heritage | DressCo Sri Lanka",
    description: "Discover the story behind DressCo. From the heart of Sri Lankan looms to contemporary luxury essentials, learn about our journey, craftsmanship, and commitment to ethical fashion.",
};

const HeritagePage = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-gold-200">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=2000"
                        alt="Premium Fabric Heritage"
                        fill
                        className="object-cover brightness-50"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-white"></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl animate-in fade-in slide-in-from-bottom duration-1000">
                    <span className="text-gold-400 font-bold tracking-[0.5em] uppercase text-xs mb-6 block">Est. 2024 | Island Soul</span>
                    <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 tracking-tighter leading-tight">
                        THE ISLAND <br />
                        <span className="text-gold-500 italic">HERITAGE</span>
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        A journey of threads, traditions, and the timeless spirit of Sri Lanka. Woven with purpose, tailored for the world.
                    </p>
                    <div className="mt-12">
                        <div className="w-px h-24 bg-linear-to-b from-gold-500 to-transparent mx-auto animate-bounce"></div>
                    </div>
                </div>
            </section>

            {/* Chapter 1: The Root */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="relative">
                        <div className="relative aspect-4/5 rounded-sm overflow-hidden shadow-2xl z-10">
                            <Image
                                src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1000"
                                alt="Tradition"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-gold-50 rounded-full blur-3xl z-0 opacity-60"></div>
                        <div className="absolute -bottom-10 -right-10 border-20 border-gold-100 w-full h-full -z-10 translate-x-4 translate-y-4"></div>
                    </div>

                    <div className="space-y-8 animate-in fade-in slide-in-from-right duration-1000">
                        <div className="space-y-4">
                            <span className="text-gold-600 font-bold tracking-[0.3em] uppercase text-[10px]">Chapter One</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 tracking-tight">The Sacred <span className="text-gold-600 italic">Root</span></h2>
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed font-light">
                            DressCo wasn't born in a boardroom; it was conceived in the vibrant artisan villages of Sri Lanka. We saw the rhythmic movement of the looms and the deep wisdom in the hands of our elders.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Our founder, inspired by the resilience and artistry of local weavers, set out to bridge the gap between ancient craftsmanship and contemporary luxury. Every piece we create is a tribute to the "Island Soul"—a blend of effortless elegance and raw, natural beauty.
                        </p>
                        <div className="flex items-center gap-6 pt-6">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-serif text-gray-900">100%</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Ethical</span>
                            </div>
                            <div className="w-px h-12 bg-gray-100"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-serif text-gray-900">20+</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Artisans</span>
                            </div>
                            <div className="w-px h-12 bg-gray-100"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-serif text-gray-900">10k+</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Stories</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Golden Thread Section (Full Width Gradient) */}
            <section className="py-40 bg-gray-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(212,175,55,0.2)_0%,transparent_70%)]"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10 px-6">
                    <Award className="text-gold-500 mx-auto mb-10 w-16 h-16 stroke-1 animate-pulse" />
                    <h2 className="text-4xl md:text-6xl font-serif text-white mb-10 tracking-tight leading-tight">
                        "Luxury is not just what you wear, but the <span className="text-gold-500 italic">integrity</span> of how it was made."
                    </h2>
                    <div className="flex items-center justify-center gap-4 text-gold-500/60 font-serif text-xl">
                        <span className="w-12 h-px bg-gold-900"></span>
                        The DressCo Philosophy
                        <span className="w-12 h-px bg-gold-900"></span>
                    </div>
                </div>
            </section>

            {/* Chapter 2: The Craft */}
            <section className="py-32 bg-gold-50/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div className="space-y-6 group">
                            <div className="aspect-square relative rounded-sm overflow-hidden mb-8 shadow-md">
                                <Image
                                    src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800"
                                    alt="Fabric detail"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <Leaf className="text-gold-600 w-8 h-8" />
                            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest">Natural Purity</h3>
                            <p className="text-gray-500 font-light leading-relaxed">
                                We prioritize organic cotton and sustainable linen harvested under the Sri Lankan sun. Materials that breathe with you.
                            </p>
                        </div>
                        <div className="space-y-6 group">
                            <div className="aspect-square relative rounded-sm overflow-hidden mb-8 shadow-md">
                                <Image
                                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
                                    alt="Studio"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <Award className="text-gold-600 w-8 h-8" />
                            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest">Master Tailoring</h3>
                            <p className="text-gray-500 font-light leading-relaxed">
                                Precision meets passion. Our workshop in Colombo employs master tailors who treat every seam as a work of art.
                            </p>
                        </div>
                        <div className="space-y-6 group">
                            <div className="aspect-square relative rounded-sm overflow-hidden mb-8 shadow-md">
                                <Image
                                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800"
                                    alt="Our team"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <Users className="text-gold-600 w-8 h-8" />
                            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest">Community First</h3>
                            <p className="text-gray-500 font-light leading-relaxed">
                                Beyond fashion, we build futures. Every purchase supports local education and healthcare initiatives for our weaving communities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section: The Dialogue */}
            <section className="py-32 px-6 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-24">
                        {/* Info Column */}
                        <div className="lg:w-1/3 space-y-12">
                            <div className="space-y-4">
                                <span className="text-gold-600 font-bold tracking-[0.3em] uppercase text-[10px]">The Dialogue</span>
                                <h2 className="text-4xl md:text-5xl font-serif text-gray-900 tracking-tight">Connect With Our <br /><span className="text-gold-600 italic">Concierge</span></h2>
                                <p className="text-gray-500 font-light leading-relaxed pt-4">
                                    Have a question about our heritage, or need assistance with your selection? Our team is here to provide a personalized experience.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 bg-gold-50 rounded-full flex items-center justify-center text-gold-600 border border-gold-100 group-hover:bg-gold-500 group-hover:text-white transition-all duration-300">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Email Us</span>
                                        <span className="text-sm font-bold text-gray-900 hover:text-gold-600 transition-colors cursor-pointer">heritage@dressco.lk</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 bg-gold-50 rounded-full flex items-center justify-center text-gold-600 border border-gold-100 group-hover:bg-gold-500 group-hover:text-white transition-all duration-300">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Call Us</span>
                                        <span className="text-sm font-bold text-gray-900 hover:text-gold-600 transition-colors cursor-pointer">+94 112 345 678</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 bg-gold-50 rounded-full flex items-center justify-center text-gold-600 border border-gold-100 group-hover:bg-gold-500 group-hover:text-white transition-all duration-300">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Visit Us</span>
                                        <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Colombo 007, Sri Lanka</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                    <button key={i} className="w-10 h-10 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gold-600 hover:border-gold-200 transition-all">
                                        <Icon size={18} strokeWidth={1.5} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="lg:w-2/3 bg-gray-50 p-8 md:p-16 rounded-sm border border-gray-100 relative">
                            <HeritageForm />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HeritagePage;
