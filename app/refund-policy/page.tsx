import React from "react";
import { RefreshCw, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";

export const metadata = {
    title: "Refund Policy | DressCo - Premium Sri Lankan Fashion",
    description: "Review DressCo's return and refund policy for premium garments. Hassle-free returns within 30 days.",
};

const RefundPolicyPage = () => {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20 font-light">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom duration-700">
                    <span className="text-gold-600 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                        Our Guarantee
                    </span>
                    <h1 className="text-4xl md:text-7xl font-serif text-gray-900 mb-8 uppercase tracking-[0.2em]">
                        Refund Policy
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed italic">
                        At DressCo, we stand behind the quality of our craftsmanship. If you're not completely satisfied with your purchase, we're here to help.
                    </p>
                </div>

                {/* Core Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {[
                        { icon: Clock, title: "30-Day Returns", desc: "Return unused items within 30 days of delivery." },
                        { icon: RefreshCw, title: "Easy Exchanges", desc: "Swap for a different size or color with ease." },
                        { icon: ShieldCheck, title: "Quality Check", desc: "Full refund for any manufacturing defects." }
                    ].map((item, i) => (
                        <div key={i} className="bg-gray-50 p-8 text-center border border-gray-100 rounded-sm group hover:border-gold-500 transition-all duration-500">
                            <item.icon className="text-gold-600 mx-auto mb-4 group-hover:scale-110 transition-transform" size={28} />
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">{item.title}</h3>
                            <p className="text-[12px] text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Policy Details */}
                <div className="space-y-16">
                    <section>
                        <h2 className="text-xl font-serif text-gray-900 uppercase tracking-widest border-b border-gold-200 pb-4 mb-8">
                            Returns & Exchanges
                        </h2>
                        <div className="space-y-6 text-gray-600 leading-relaxed">
                            <p>To be eligible for a return, your item must be:</p>
                            <ul className="space-y-4">
                                {[
                                    "Unworn and unwashed",
                                    "In the original packaging",
                                    "With all original tags still attached",
                                    "Accompanied by the original receipt or proof of purchase"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle2 size={16} className="text-gold-600 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-sm pt-4">
                                Items purchased during "Final Sale" events are not eligible for returns or exchanges unless they have a manufacturing defect.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif text-gray-900 uppercase tracking-widest border-b border-gold-200 pb-4 mb-8">
                            Refund Process
                        </h2>
                        <div className="space-y-6 text-gray-600 leading-relaxed text-sm">
                            <p>
                                Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 7-10 business days.
                            </p>
                            <div className="p-6 bg-gold-50 border-l-4 border-gold-500 italic">
                                Note: Original shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif text-gray-900 uppercase tracking-widest border-b border-gold-200 pb-4 mb-8">
                            How to Initiate a Return
                        </h2>
                        <div className="space-y-6 text-gray-600 leading-relaxed text-sm">
                            <p>
                                To start a return, please contact our support team at <span className="font-bold text-gray-900">returns@dressco.lk</span> with your order number and the reason for the return. We will provide you with a Return Authorization and further instructions.
                            </p>
                        </div>
                    </section>

                    <section className="bg-gold-950 p-12 text-center rounded-sm">
                        <h2 className="text-white font-serif text-2xl uppercase tracking-widest mb-6">Need Immediate Assistance?</h2>
                        <p className="text-gold-100/60 text-sm mb-8 font-light max-w-xl mx-auto italic">
                            Our concierge team is available Monday to Friday, 9am to 6pm, to help with any return-related questions.
                        </p>
                        <a
                            href="tel:+94112345678"
                            className="inline-block border border-gold-500 text-gold-500 px-8 py-3 rounded-sm font-bold tracking-[0.2em] uppercase hover:bg-gold-500 hover:text-white transition-all text-[11px]"
                        >
                            Call Us: +94 112 345 678
                        </a>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicyPage;
