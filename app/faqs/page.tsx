"use client";

import React, { useState, useEffect } from "react";
import { getFAQs, FAQ } from "@/lib/api";
import { Plus, Minus, Search, HelpCircle } from "lucide-react";

const FAQsPage = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchFAQs = async () => {
            const data = await getFAQs();
            setFaqs(data);
            setLoading(false);
        };
        fetchFAQs();
    }, []);

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
                    <span className="text-gold-600 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                        Support Center
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-8 uppercase tracking-widest">
                        Frequently Asked <br /> Questions
                    </h1>

                    {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto mt-12">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for a question..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-sm py-4 pl-12 pr-6 focus:outline-none focus:border-gold-500 transition-colors text-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-sm"></div>
                        ))
                    ) : filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div
                                key={faq.id}
                                className="border border-gray-100 rounded-sm overflow-hidden transition-all duration-300 hover:border-gold-200"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50/50 transition-colors"
                                >
                                    <span className="text-sm md:text-base font-bold text-gray-900 tracking-wide uppercase">
                                        {faq.question}
                                    </span>
                                    {openIndex === index ? (
                                        <Minus size={18} className="text-gold-600 shrink-0" />
                                    ) : (
                                        <Plus size={18} className="text-gray-400 shrink-0" />
                                    )}
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <div className="p-6 pt-0 text-sm text-gray-500 leading-relaxed font-light border-t border-gray-50">
                                        <p className="whitespace-pre-line">{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-sm">
                            <HelpCircle size={48} className="text-gray-200 mx-auto mb-4" />
                            <h3 className="text-lg font-serif text-gray-900 mb-2">No results found</h3>
                            <p className="text-sm text-gray-400 font-light">Try searching with different keywords.</p>
                        </div>
                    )}
                </div>

                {/* Still have questions? */}
                <div className="mt-20 p-12 bg-gold-950 text-center rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <h3 className="text-2xl font-serif text-white mb-4 relative z-10 uppercase tracking-widest">Still have questions?</h3>
                    <p className="text-gold-100/60 mb-8 relative z-10 font-light italic">
                        Can't find what you're looking for? Our dedicated team is here to assist you with any inquiries.
                    </p>
                    <a
                        href="mailto:hello@dressco.lk"
                        className="inline-block bg-gold-500 text-white px-10 py-4 rounded-sm font-bold tracking-[0.2em] uppercase hover:bg-gold-600 transition-all text-xs relative z-10"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQsPage;
