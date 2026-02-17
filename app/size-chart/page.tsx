import React from "react";
import Image from "next/image";
import { Ruler, Info, Star } from "lucide-react";

export const metadata = {
    title: "Size Chart | DressCo - Premium Sri Lankan Fashion",
    description: "Find your perfect fit with DressCo's comprehensive size guides for men, women, and kids.",
};

const SizeChartPage = () => {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20 font-light">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom duration-700">
                    <span className="text-gold-600 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                        Finding Your Fit
                    </span>
                    <h1 className="text-4xl md:text-7xl font-serif text-gray-900 mb-8 uppercase tracking-[0.2em]">
                        Size Chart
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed italic">
                        Our garments are designed for the premium Sri Lankan lifestyle, combining comfort with contemporary silhouettes. Use our guide below to find your perfect DressCo fit.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-32">
                    {/* Measurement Guide */}
                    <div className="space-y-12">
                        <div className="inline-flex items-center gap-3 border-b-2 border-gold-500 pb-2">
                            <Ruler className="text-gold-600" size={24} />
                            <h2 className="text-2xl font-serif text-gray-900 uppercase tracking-widest">How to Measure</h2>
                        </div>

                        <div className="space-y-8">
                            {[
                                { title: "Chest / Bust", desc: "Measure around the fullest part of your chest, keeping the tape horizontal." },
                                { title: "Waist", desc: "Measure around the narrowest part (typically where your body bends side to side), keeping the tape horizontal." },
                                { title: "Hips", desc: "Measure around the fullest part of your hips, keeping the tape horizontal." },
                                { title: "Length", desc: "Measure from the highest point of the shoulder down to the hem." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <span className="text-gold-200 text-4xl font-serif font-bold group-hover:text-gold-500 transition-colors duration-500">0{i + 1}</span>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2">{item.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gold-50 p-8 rounded-sm border-l-4 border-gold-500">
                            <div className="flex gap-4">
                                <Info className="text-gold-600 shrink-0" size={20} />
                                <p className="text-[13px] text-gray-600 leading-relaxed font-medium uppercase tracking-wide">
                                    <span className="text-gold-700 font-bold">Pro Tip:</span> If you're between sizes, we recommend sizing up for a more relaxed, island-ready fit, or sizing down for a more tailored silhouette.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Size Tables */}
                    <div className="space-y-16">
                        {/* Women's Table */}
                        <div className="bg-white border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-shadow duration-700">
                            <h3 className="text-lg font-bold text-gray-900 mb-8 uppercase tracking-[0.2em] flex items-center gap-2">
                                Women's Essentials
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="py-4 font-bold text-gold-600 uppercase tracking-widest text-[10px]">Size</th>
                                            <th className="py-4 font-bold text-gold-600 uppercase tracking-widest text-[10px]">Bust (in)</th>
                                            <th className="py-4 font-bold text-gold-600 uppercase tracking-widest text-[10px]">Waist (in)</th>
                                            <th className="py-4 font-bold text-gold-600 uppercase tracking-widest text-[10px]">Hips (in)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-500">
                                        {[
                                            { s: "XS", b: "31-32", w: "24-25", h: "34-35" },
                                            { s: "S", b: "33-34", w: "26-27", h: "36-37" },
                                            { s: "M", b: "35-36", w: "28-29", h: "38-39" },
                                            { s: "L", b: "37-38", w: "30-31", h: "40-41" },
                                            { s: "XL", b: "39-40", w: "32-33", h: "42-43" }
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 font-bold text-gray-900">{row.s}</td>
                                                <td className="py-4">{row.b}</td>
                                                <td className="py-4">{row.w}</td>
                                                <td className="py-4">{row.h}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Men's Table */}
                        <div className="bg-white border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-shadow duration-700">
                            <h3 className="text-lg font-bold text-gray-900 mb-8 uppercase tracking-[0.2em]">Men's Essentials</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="py-4 font-bold text-gold-600 uppercase tracking-widest text-[10px]">Size</th>
                                            <th className="py-4 font-bold text-gold-600 uppercase tracking-widest text-[10px]">Chest (in)</th>
                                            <th className="py-4 font-bold text-gold-600 uppercase tracking-widest text-[10px]">Waist (in)</th>
                                            <th className="py-4 font-bold text-gold-600 uppercase tracking-widest text-[10px]">Shoulder (in)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-500">
                                        {[
                                            { s: "S", b: "36-38", w: "30-32", h: "17.5" },
                                            { s: "M", b: "38-40", w: "32-34", h: "18.0" },
                                            { s: "L", b: "40-42", w: "34-36", h: "18.5" },
                                            { s: "XL", b: "42-44", w: "36-38", h: "19.0" },
                                            { s: "XXL", b: "44-46", w: "38-40", h: "19.5" }
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 font-bold text-gray-900">{row.s}</td>
                                                <td className="py-4">{row.b}</td>
                                                <td className="py-4">{row.w}</td>
                                                <td className="py-4">{row.h}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Brand Promise Section */}
                <div className="bg-gold-950 py-24 text-center rounded-sm relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <Image
                            src="https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?auto=format&fit=crop&q=80&w=1200"
                            alt="Background Texture"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="relative z-10 max-w-4xl mx-auto px-6">
                        <Star className="text-gold-500 mx-auto mb-8" size={32} />
                        <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 tracking-widest uppercase">The DressCo Standard</h2>
                        <p className="text-gold-100/70 text-lg leading-relaxed font-light mb-12 italic">
                            "Every garment we produce undergoes rigorous fit-testing to ensure it meets our island standards for comfort and elegance. We don't just sell clothes; we provide the perfect fit for your lifestyle."
                        </p>
                        <hr className="w-20 mx-auto border-gold-500/30 mb-12" />
                        <div className="text-[10px] font-bold text-gold-500 tracking-[0.4em] uppercase">Meticulously Crafted in Sri Lanka</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SizeChartPage;
