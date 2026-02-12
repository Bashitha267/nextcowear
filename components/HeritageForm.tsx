"use client";

import React, { useState } from "react";
import { Send, Heart } from "lucide-react";

export const HeritageForm = () => {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            setFormState({ name: "", email: "", subject: "", message: "" });
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 border-2 border-gold-500">
                    <Heart size={40} className="fill-current" />
                </div>
                <h3 className="text-2xl font-serif text-gray-900 uppercase tracking-widest">Message Received</h3>
                <p className="text-gray-500 max-w-sm">
                    Thank you for reaching out to the heritage desk. We will get back to you within 24 hours.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="text-gold-600 font-bold uppercase text-[10px] tracking-widest border-b border-gold-600 pb-1"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="relative group">
                    <input
                        type="text"
                        required
                        placeholder="YOUR NAME"
                        className="w-full bg-transparent border-b-2 border-gray-200 py-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-gold-500 transition-colors placeholder:text-gray-300"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                </div>
                <div className="relative group">
                    <input
                        type="email"
                        required
                        placeholder="EMAIL ADDRESS"
                        className="w-full bg-transparent border-b-2 border-gray-200 py-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-gold-500 transition-colors placeholder:text-gray-300"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    />
                </div>
            </div>
            <div className="relative group">
                <input
                    type="text"
                    required
                    placeholder="REASON FOR CONTACT"
                    className="w-full bg-transparent border-b-2 border-gray-200 py-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-gold-500 transition-colors placeholder:text-gray-300"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                />
            </div>
            <div className="relative group">
                <textarea
                    rows={4}
                    required
                    placeholder="YOUR MESSAGE"
                    className="w-full bg-transparent border-b-2 border-gray-200 py-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-gold-500 transition-colors placeholder:text-gray-300 resize-none"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                />
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 text-white py-6 rounded-sm text-[10px] font-bold tracking-[0.5em] uppercase hover:bg-gold-600 transition-all flex items-center justify-center gap-4 relative overflow-hidden group shadow-2xl disabled:opacity-70"
            >
                <span className="relative z-10">{isSubmitting ? "Sovereignly Sending..." : "Send Message"}</span>
                <Send size={16} className={`relative z-10 transition-transform ${isSubmitting ? 'translate-x-20 opacity-0' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
                <div className="absolute inset-0 bg-gold-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </button>
        </form>
    );
};
