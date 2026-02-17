"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQ } from "@/lib/api";

interface FAQSectionProps {
    faqs: FAQ[];
}

const FAQSection = ({ faqs }: FAQSectionProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (!faqs || faqs.length === 0) return null;

    return (
        <section id="faq" className="py-20 bg-gold-50/50 border-t border-gold-100">
            <div className="w-full px-4 md:px-10">
                <div className="text-center mb-16">
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold-600 mb-4 block">
                        Got Questions?
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">Frequently Asked Questions</h2>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Find answers to common questions about our products, shipping, and returns.
                    </p>
                </div>

                <div className="bg-white rounded-sm shadow-sm border border-gold-200 overflow-hidden max-w-5xl mx-auto">
                    {faqs.map((faq, index) => (
                        <div key={faq.id} className={`border-b border-gold-100/50 last:border-b-0 transition-colors ${openIndex === index ? 'bg-gold-50/30' : ''}`}>
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 md:px-8 py-6 flex items-center justify-between gap-4 text-left group hover:bg-gold-50/20 transition-colors"
                            >
                                <span className={`font-serif font-medium text-lg text-gray-900 group-hover:text-gold-700 transition-colors ${openIndex === index ? 'text-gold-700' : ''}`}>
                                    {faq.question}
                                </span>
                                <div className={`shrink-0 w-8 h-8 rounded-full border border-gold-200 flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-gold-500 border-gold-500 text-white rotate-180' : 'bg-white text-gold-400 group-hover:border-gold-300 group-hover:text-gold-500'}`}>
                                    {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                                </div>
                            </button>
                            <div
                                className={`grid transition-[grid-template-rows] duration-500 ease-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                            >
                                <div className="overflow-hidden">
                                    <div className="px-6 md:px-8 pb-8 pt-2 text-gray-600 leading-relaxed border-l-2 border-gold-300 ml-6 md:ml-8 mb-6">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
