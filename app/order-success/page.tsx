"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Package, Truck, Calendar, ArrowRight, Loader2, Phone } from 'lucide-react';
import Link from 'next/link';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('id');
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        if (!orderId) {
            router.push('/');
            return;
        }

        const fetchOrder = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (*)
                `)
                .eq('id', orderId)
                .single();

            if (error) {
                console.error("Error fetching order:", error);
            } else {
                setOrder(data);
            }
            setLoading(false);
        };

        fetchOrder();
    }, [orderId, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-gold-600 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
                <h1 className="text-2xl font-serif text-gray-900">Order Not Found</h1>
                <Link href="/" className="text-gold-600 hover:underline">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-gray-50 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gold-600 p-8 text-center text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold mb-2">Order Confirmed!</h1>
                    <p className="text-gold-100 font-medium">Thank you for your purchase, {order.customer_name?.split(' ')[0]}</p>
                </div>

                <div className="p-8 md:p-12 space-y-10">
                    {/* Order Status Tracker */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative">
                        {/* Connecting Line (Mobile: hidden, Desktop: visible) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2" />

                        <div className="flex flex-col items-center gap-2 bg-white px-2 z-10">
                            <div className="w-10 h-10 rounded-full bg-gold-600 flex items-center justify-center text-white shadow-lg">
                                <CheckCircle size={20} />
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gold-600">Confirmed</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 bg-white px-2 z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-gold-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                <Package size={20} />
                            </div>
                            <span className={`text-[10px] uppercase font-bold tracking-widest ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-gold-600' : 'text-gray-400'}`}>Processing</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 bg-white px-2 z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${['shipped', 'delivered'].includes(order.status) ? 'bg-gold-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                <Truck size={20} />
                            </div>
                            <span className={`text-[10px] uppercase font-bold tracking-widest ${['shipped', 'delivered'].includes(order.status) ? 'text-gold-600' : 'text-gray-400'}`}>On Delivery</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Order Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-sm font-medium text-gray-600">Order Number</span>
                                    <span className="text-sm font-bold text-gray-900">{order.order_number || order.id.slice(0, 8)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-sm font-medium text-gray-600">Date</span>
                                    <span className="text-sm font-bold text-gray-900">{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-sm font-medium text-gray-600">Total Amount</span>
                                    <span className="text-sm font-bold text-gold-600">LKR {Number(order.total).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-sm font-medium text-gray-600">Payment Method</span>
                                    <span className="text-sm font-bold text-gray-900 capitalize">{order.payment_method?.replace('_', ' ')}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Shipping Info</h3>
                            <div className="bg-gray-50 p-6 rounded-2xl space-y-2">
                                <p className="font-bold text-gray-900">{order.customer_name}</p>
                                <p className="text-sm text-gray-600">{order.shipping_address_line1}</p>
                                <p className="text-sm text-gray-600">{order.shipping_city}</p>
                                <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    {order.primary_phone}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center pt-8 border-t border-gray-100 space-y-8">
                        <Link href="/collections" className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-gray-900 hover:text-gold-600 transition-colors">
                            Continue Shopping <ArrowRight size={14} />
                        </Link>

                        <div className="flex flex-col items-center gap-2 text-gray-400">
                            <p className="text-[10px] uppercase font-bold tracking-widest">Need Assistance?</p>
                            <div className="flex items-center gap-2 text-gold-600 font-bold">
                                <Phone size={16} />
                                <span>+94 77 123 4567</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccess() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-gold-600 animate-spin" />
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
