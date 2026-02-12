"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getOrdersByUserId } from '@/lib/api';
import { Package, Truck, CheckCircle, Clock, ChevronRight, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function MyOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        if (!user) return;
        setLoading(true);
        const data = await getOrdersByUserId(user.id);
        setOrders(data || []);
        setLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock size={16} />;
            case 'processing': return <Package size={16} />;
            case 'shipped': return <Truck size={16} />;
            case 'delivered': return <CheckCircle size={16} />;
            case 'cancelled': return <XCircle size={16} />;
            default: return <Package size={16} />;
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 bg-white rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
                <p className="text-gray-500 mb-8">You haven&apos;t placed any orders yet.</p> {/* Escaped apostrophe */}
                <Link
                    href="/collections"
                    className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-gold-600 transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-12 space-y-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900">My Orders</h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-gray-900 text-lg">{order.order_number || `#${order.id.slice(0, 8)}`}</h3>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-2xl font-serif font-bold text-gray-900">LKR {Number(order.total).toLocaleString()}</p>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{order.order_items?.length} Items</p>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 space-y-8">
                            {/* Order Items List */}
                            {order.order_items?.map((item: any) => (
                                <div key={item.id} className="flex gap-6 items-start">
                                    <div className="w-20 h-24 md:w-24 md:h-32 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 relative group">
                                        {item.product_image_url ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={item.product_image_url} alt={item.product_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={20} /></div>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-gray-900 text-sm md:text-base leading-tight">{item.product_name}</h4>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                                                {item.color_name && <span>Color: <span className="text-gray-900 font-bold">{item.color_name}</span></span>}
                                                {item.size_name && <span>Size: <span className="text-gray-900 font-bold">{item.size_name}</span></span>}
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-md inline-block">
                                                Qty: {item.quantity}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gold-600 text-sm md:text-base">LKR {Number(item.subtotal || (item.unit_price * item.quantity)).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="px-6 md:px-8 pb-6 md:pb-8 flex justify-end border-t border-gray-50 pt-6">
                            <Link
                                href={`/order-success?id=${order.id}`}
                                className="inline-flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-widest hover:text-gold-600 transition-colors group"
                            >
                                View Receipt <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
