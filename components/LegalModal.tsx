"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronRight, Info, Loader2 } from "lucide-react";
import Image from "next/image";
import { SettingsService } from "@/lib/settings";

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "Size Chart" | "Refund Policy" | "Shipping Policy" | "Terms & Privacy";
}

const LegalModal = ({ isOpen, onClose, type }: LegalModalProps) => {
    const [content, setContent] = useState<string>("");
    const [sizeChartUrl, setSizeChartUrl] = useState<string>("");
    const [sizeChartDesc, setSizeChartDesc] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchContent();
        }
    }, [isOpen, type]);

    const fetchContent = async () => {
        setLoading(true);
        try {
            if (type === "Size Chart") {
                const data = await SettingsService.getSizeChart();
                setSizeChartUrl(data.url);
                setSizeChartDesc(data.description);
            } else {
                const docType = type === "Refund Policy" ? "refund" :
                    type === "Shipping Policy" ? "shipping" : "terms";
                const text = await SettingsService.getLegalDocument(docType);
                setContent(text);
            }
        } catch (error) {
            console.error("Error loading content", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                </div>
            );
        }

        switch (type) {
            case "Size Chart":
                return (
                    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-serif text-gray-900 mb-4 uppercase tracking-widest">Perfect Fit Guide</h2>
                            <p className="text-gray-500 font-light italic">Detailed measurements for men, women, and kids.</p>
                        </div>

                        {sizeChartUrl ? (
                            <div className="relative aspect-3/4 md:aspect-video w-full rounded-sm overflow-hidden border border-gold-100 shadow-2xl">
                                <Image
                                    src={sizeChartUrl}
                                    alt="Size Chart"
                                    fill
                                    className="object-contain bg-white"
                                />
                            </div>
                        ) : (
                            <div className="p-10 text-center bg-gray-50 border border-dashed border-gray-200 rounded-lg">
                                <p className="text-gray-400 text-sm">Size chart image not available yet.</p>
                            </div>
                        )}

                        {(sizeChartDesc || !sizeChartUrl) && (
                            <div className="bg-gold-50 p-6 rounded-sm border-l-4 border-gold-500 flex gap-4">
                                <Info className="text-gold-600 shrink-0" size={20} />
                                <div className="text-xs text-gray-600 leading-relaxed font-medium uppercase tracking-wide whitespace-pre-line">
                                    {sizeChartDesc || (
                                        <span>
                                            <span className="text-gold-700 font-bold">Pro Tip:</span> Our garments are tailored for the tropical heart. Use a soft measuring tape for the most accurate results.
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case "Refund Policy":
            case "Shipping Policy":
            case "Terms & Privacy":
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-serif text-gray-900 mb-4 uppercase tracking-widest">{type}</h2>
                            <p className="text-gray-500 font-light italic">
                                {type === "Refund Policy" && "Hassle-free 30-day returns and exchanges."}
                                {type === "Shipping Policy" && "Island-wide fulfillment across Sri Lanka."}
                                {type === "Terms & Privacy" && "Your data security and site usage guidelines."}
                            </p>
                        </div>

                        <div className="prose prose-sm prose-gray max-w-none font-light">
                            {content ? (
                                <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
                            ) : (
                                <p className="text-center text-gray-400 italic">Content pending update...</p>
                            )}
                        </div>

                        {/* Contact snippet mostly relevant for Refund/Shipping */}
                        {(type === "Refund Policy" || type === "Shipping Policy") && (
                            <div className="p-6 bg-gold-950 text-white rounded-sm mt-8">
                                <p className="text-xs font-bold tracking-widest uppercase mb-2">Need Assistance?</p>
                                <p className="text-[11px] text-gold-200/80 mb-4 italic">Reach out to our dedicated concierge team.</p>
                                <div className="flex flex-col gap-2">
                                    <a href="mailto:infodresscoware@gmail.com" className="text-xs font-bold text-gold-400 underline underline-offset-4 hover:text-white transition-colors">infodresscoware@gmail.com</a>
                                    <a href="tel:0771260404" className="text-xs font-bold text-gold-400 underline underline-offset-4 hover:text-white transition-colors">077 126 0404</a>
                                </div>
                            </div>
                        )}
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
