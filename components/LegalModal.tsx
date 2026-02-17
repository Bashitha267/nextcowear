"use client";

import React from "react";
import { X, ChevronRight, Info } from "lucide-react";
import Image from "next/image";

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "Size Chart" | "Refund Policy" | "Shipping Policy" | "Terms & Privacy";
}

const LegalModal = ({ isOpen, onClose, type }: LegalModalProps) => {
    if (!isOpen) return null;

    const renderContent = () => {
        switch (type) {
            case "Size Chart":
                return (
                    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-serif text-gray-900 mb-4 uppercase tracking-widest">Perfect Fit Guide</h2>
                            <p className="text-gray-500 font-light italic">Detailed measurements for men, women, and kids.</p>
                        </div>
                        <div className="relative aspect-3/4 md:aspect-video w-full rounded-sm overflow-hidden border border-gold-100 shadow-2xl">
                            <Image
                                src="https://res.cloudinary.com/dlwrpzuwj/image/upload/v1770878852/Size-Chart-Web_e2p7x6.jpg"
                                alt="Size Chart"
                                fill
                                className="object-contain bg-white"
                            />
                        </div>
                        <div className="bg-gold-50 p-6 rounded-sm border-l-4 border-gold-500 flex gap-4">
                            <Info className="text-gold-600 shrink-0" size={20} />
                            <p className="text-xs text-gray-600 leading-relaxed font-medium uppercase tracking-wide">
                                <span className="text-gold-700 font-bold">Pro Tip:</span> Our garments are tailored for the tropical heart. Use a soft measuring tape for the most accurate results.
                            </p>
                        </div>
                    </div>
                );
            case "Refund Policy":
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-serif text-gray-900 mb-4 uppercase tracking-widest">Refund Policy</h2>
                            <p className="text-gray-500 font-light italic">Hassle-free 30-day returns and exchanges.</p>
                        </div>
                        <section className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gold-100 pb-2">Returns Eligibility</h3>
                            <ul className="space-y-4 text-sm text-gray-600">
                                {[
                                    "Items must be unworn and unwashed with original tags.",
                                    "Returns must be initiated within 30 days of delivery.",
                                    "Original packaging must be included.",
                                    "Proof of purchase is required for all returns."
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 items-start">
                                        <ChevronRight size={16} className="text-gold-500 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                        <section className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gold-100 pb-2">The Refund Process</h3>
                            <p className="text-sm text-gray-600 leading-relaxed font-light">
                                Once received and inspected, refunds are processed back to your original payment method within 7-10 working days. We ensure complete transparency at every step.
                            </p>
                            <div className="p-6 bg-gold-950 text-white rounded-sm">
                                <p className="text-xs font-bold tracking-widest uppercase mb-2">Need Assistance?</p>
                                <p className="text-[11px] text-gold-200/80 mb-4 italic">Reach out to our dedicated concierge team.</p>
                                <div className="flex flex-col gap-2">
                                    <a href="mailto:infodresscoware@gmail.com" className="text-xs font-bold text-gold-400 underline underline-offset-4 hover:text-white transition-colors">infodresscoware@gmail.com</a>
                                    <a href="tel:0771260404" className="text-xs font-bold text-gold-400 underline underline-offset-4 hover:text-white transition-colors">077 126 0404</a>
                                </div>
                            </div>
                        </section>
                    </div>
                );
            case "Shipping Policy":
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-serif text-gray-900 mb-4 uppercase tracking-widest">Shipping Policy</h2>
                            <p className="text-gray-500 font-light italic">Island-wide fulfillment across Sri Lanka.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="p-8 bg-gold-50 border border-gold-100 rounded-sm">
                                <h4 className="text-xs font-bold text-gold-700 uppercase tracking-widest mb-4">Domestic Fulfillment (Sri Lanka)</h4>
                                <div className="space-y-4 text-sm text-gray-900 font-bold">
                                    <div className="flex justify-between border-b border-gray-200 pb-2">
                                        <span>Colombo & Suburbs</span>
                                        <span>1-2 Working Days</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-2">
                                        <span>Island-wide (Outstation)</span>
                                        <span>3-5 Working Days</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-4 leading-relaxed italic">
                                    *International shipping is currently unavailable as we focus on providing the best experience for our home island.
                                </p>
                            </div>
                        </div>
                        <section className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gold-100 pb-2">Dispatch Details</h3>
                            <p className="text-sm text-gray-600 leading-relaxed font-light">
                                Orders placed before 1:00 PM (SLT) are dispatched on the same business day. You will receive a tracking link via SMS once your package leaves our studio.
                            </p>
                        </section>
                    </div>
                );
            case "Terms & Privacy":
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-serif text-gray-900 mb-4 uppercase tracking-widest">Privacy & Terms</h2>
                            <p className="text-gray-500 font-light italic">Your data security and site usage guidelines.</p>
                        </div>
                        <div className="space-y-10">
                            <section>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Privacy Commitment</h3>
                                <p className="text-sm text-gray-600 leading-relaxed font-light">
                                    Your privacy is paramount. We only collect details necessary to process your orders and enhance your site experience. We never sell your data to third parties.
                                </p>
                            </section>
                            <section>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Terms of Service</h3>
                                <p className="text-sm text-gray-600 leading-relaxed font-light">
                                    By using dresscowear.com, you agree to our usage guidelines. All content, images, and designs are the property of DressCo (PVT) Ltd and may not be used without explicit permission.
                                </p>
                            </section>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-6 lg:p-10">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gold-950/40 backdrop-blur-md animate-in fade-in duration-500"
                onClick={onClose}
            />

            {/* Modal Body */}
            <div className="relative w-full max-w-4xl bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0 bg-white z-10">
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold-600">DressCo Legal</span>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-all group active:scale-95"
                    >
                        <X size={20} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-thin scrollbar-thumb-gold-200">
                    {renderContent()}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                    <p className="text-[9px] text-gray-400 font-bold tracking-widest uppercase font-serif">
                        DressCo (PVT) Ltd. Sri Lanka
                    </p>
                    <button
                        onClick={onClose}
                        className="bg-gray-900 text-white px-8 py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-gold-600 transition-all rounded-sm shadow-lg"
                    >
                        Close Document
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegalModal;
