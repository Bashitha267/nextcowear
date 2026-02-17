import React from "react";
import { Truck, Globe, MapPin, Package, ShieldCheck } from "lucide-react";

export const metadata = {
    title: "Shipping Policy | DressCo - Premium Sri Lankan Fashion",
    description: "Information about DressCo's shipping rates, delivery times, and island-wide fulfillment.",
};

const ShippingPolicyPage = () => {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20 font-light">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom duration-700">
                    <span className="text-gold-600 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                        Fulfillment & Logistics
                    </span>
                    <h1 className="text-4xl md:text-7xl font-serif text-gray-900 mb-8 uppercase tracking-[0.2em]">
                        Shipping Policy
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed italic">
                        From our island heart to your doorstep. We take pride in ensuring your luxury essentials arrive in perfect condition and in a timely manner.
                    </p>
                </div>

                {/* Shipping Tiers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-gray-50 p-10 border border-gray-100 rounded-sm relative overflow-hidden group hover:border-gold-500 transition-all duration-500">
                        <Truck className="text-gold-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-lg font-serif text-gray-900 uppercase tracking-widest mb-4">Domestic (Sri Lanka)</h3>
                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="font-bold uppercase tracking-tighter">Colombo & Suburbs</span>
                                <span className="text-gold-700 font-bold">1-2 Working Days</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="font-bold uppercase tracking-tighter">Outstation</span>
                                <span className="text-gold-700 font-bold">3-5 Working Days</span>
                            </div>
                            <p className="text-[12px] italic pt-2">Flat rate of LKR 450 applies to all domestic orders under LKR 10,000.</p>
                        </div>
                    </div>

                    <div className="bg-gold-950 p-10 border border-white/5 rounded-sm relative overflow-hidden group hover:border-gold-500 transition-all duration-500">
                        <Globe className="text-gold-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-lg font-serif text-white uppercase tracking-widest mb-4">International</h3>
                        <div className="space-y-4 text-sm text-gold-100/80">
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="font-bold uppercase tracking-tighter">Worldwide Express</span>
                                <span className="text-gold-500 font-bold">7-10 Working Days</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="font-bold uppercase tracking-tighter">Availability</span>
                                <span className="text-gold-500 font-bold">Over 50 Countries</span>
                            </div>
                            <p className="text-[12px] italic pt-2 text-gold-100/60">Calculated at checkout based on destination and weight.</p>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="space-y-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="relative aspect-square rounded-sm overflow-hidden border-8 border-gold-50">
                            <img
                                src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaad21?auto=format&fit=crop&q=80&w=800"
                                alt="Premium Packaging"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 text-gold-600 mb-2">
                                <Package size={20} />
                                <span className="text-xs font-bold tracking-[0.3em] uppercase">Premium Packaging</span>
                            </div>
                            <h2 className="text-3xl font-serif text-gray-900 uppercase tracking-widest leading-tight">Meticulously <br /> Protected</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Every DressCo item is wrapped in our signature eco-friendly silk paper and placed in a reinforced premium box to ensure it reaches you as pristine as it left our studio.
                            </p>
                            <div className="flex items-center gap-3 text-gold-600">
                                <ShieldCheck size={20} />
                                <span className="text-[11px] font-bold uppercase tracking-widest">Insured and Tracked Shipments</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-12 bg-white border border-gray-100 p-12 shadow-sm">
                        <section>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <MapPin size={18} className="text-gold-600" />
                                Order Tracking
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                Once your order is dispatched, you will receive an email and an SMS with your unique tracking number and a link to track your shipment in real-time.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-gray-50">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Customs & Duties</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                For international orders, please note that any customs duties or import taxes are the responsibility of the recipient. These fees are not included in our shipping costs and vary by country.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-gray-50">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Unclaimed Shipments</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                If a shipment is rejected or remains unclaimed at the delivery address, the courier will return it to us. Return costs and original shipping fees will be deducted from any potential refund.
                            </p>
                        </section>
                    </div>

                    {/* Trust Bar */}
                    <div className="flex flex-wrap justify-between items-center gap-8 py-12 border-y border-gray-100 opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b3/DHL_Express_logo.svg" alt="DHL" className="h-4" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/FedEx_Express.svg" alt="FedEx" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Aramex_logo.svg" alt="Aramex" className="h-6" />
                        <div className="text-xs font-bold tracking-widest uppercase text-gray-400">Domestic Logistics Partners</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicyPage;
