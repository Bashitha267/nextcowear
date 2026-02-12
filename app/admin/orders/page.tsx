"use client";

import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import {
    Search,
    Filter,
    Eye,
    MoreVertical,
    CheckCircle,
    Clock,
    Truck,
    XCircle,
    ChevronDown,
    ChevronRight,
    Loader2,
    Package,
    Trash2,
    Mail,
    Phone
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]); // Re-fetch when filter changes

    // Debounce search? Or just simple filter
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchOrders();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getAllOrders({
                status: statusFilter === 'all' ? undefined : statusFilter,
                search: searchQuery
            });
            setOrders(data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            toast.success(`Order status updated to ${newStatus}`);
            // Optimistic update
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Helper to shorten UUID if order_number is missing
    const getOrderId = (order: any) => {
        return order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`;
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;

        try {
            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('id', orderId);

            if (error) throw error;

            toast.success('Order deleted successfully');
            setOrders(prev => prev.filter(o => o.id !== orderId));
            if (selectedOrder?.id === orderId) {
                setIsDetailOpen(false);
                setSelectedOrder(null);
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Failed to delete order');
        }
    };

    // ... (existing helper functions)

    return (
        <div className="p-6 md:p-10 space-y-6">
            {/* ... (Header and Filters kept same) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-sm text-gray-500">Manage customer orders and shipments</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 cursor-pointer capitalize w-full md:w-auto"
                        >
                            <option value="all">All Status</option>
                            {ORDER_STATUSES.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-4">
                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold-600" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
                        No orders found.
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="font-mono font-bold text-gray-900 block mb-1">{getOrderId(order)}</span>
                                    <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 py-3 border-y border-gray-50">
                                <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-600 font-bold text-xs shrink-0">
                                    {order.customer_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-gray-900 truncate">{order.customer_name}</p>
                                    <p className="text-xs text-gray-500 truncate">{order.customer_email}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total</p>
                                    <p className="text-lg font-bold text-gray-900">LKR {Number(order.total).toLocaleString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDeleteOrder(order.id)}
                                        className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors active:scale-95"
                                        title="Delete Order"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setIsDetailOpen(true);
                                        }}
                                        className="px-4 py-2.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gold-600 transition-colors active:scale-95 flex items-center gap-2"
                                    >
                                        <Eye size={16} /> Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-gold-600" />
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 font-mono">
                                            {getOrderId(order)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{order.customer_name}</span>
                                                <span className="text-xs text-gray-500">{order.customer_email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className={`px-3 py-1 text-xs font-bold rounded-full border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gold-500/50 uppercase tracking-wider w-32 text-center ${getStatusColor(order.status)}`}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {ORDER_STATUSES.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-right text-gray-900">
                                            LKR {Number(order.total).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setIsDetailOpen(true);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded-full transition-all active:scale-95"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all active:scale-95"
                                                    title="Delete Order"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Detail Modal/Drawer */}
            {isDetailOpen && selectedOrder && (
                <div className="fixed inset-0 z-100 flex items-center justify-end bg-black/20 backdrop-blur-sm" onClick={() => setIsDetailOpen(false)}>
                    <div
                        className="w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-8 py-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                                <p className="text-sm text-gray-500 mt-1 font-mono">{getOrderId(selectedOrder)}</p>
                            </div>
                            <button onClick={() => setIsDetailOpen(false)} className="text-gray-400 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Status Bar */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Current Status</label>
                                <div className="flex items-center gap-4">
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                                        className={`px-4 py-2 text-sm font-bold rounded-lg border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gold-500/50 uppercase tracking-wider w-full ${getStatusColor(selectedOrder.status)}`}
                                    >
                                        {ORDER_STATUSES.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="text-xs text-gray-500">
                                        <span className="block font-bold text-gray-900 mb-1">Placed On</span>
                                        {new Date(selectedOrder.created_at).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <span className="block font-bold text-gray-900 mb-1">Last Updated</span>
                                        {new Date(selectedOrder.updated_at).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Customer</h3>
                                    <div className="space-y-3 text-sm text-gray-600">
                                        <p className="font-semibold text-gray-900">{selectedOrder.customer_name}</p>
                                        <p className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /> {selectedOrder.customer_email}</p>
                                        <p className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {selectedOrder.primary_phone}</p>
                                        {selectedOrder.secondary_phone && (
                                            <p className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {selectedOrder.secondary_phone} (Alt)</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Shipping Address</h3>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p>{selectedOrder.shipping_address_line1}</p>
                                        <p>{selectedOrder.shipping_address_line2}</p>
                                        <p className="font-medium text-gray-900">{selectedOrder.shipping_city}</p>
                                        <p>{selectedOrder.shipping_state}, {selectedOrder.shipping_postal_code}</p>
                                        <p>{selectedOrder.shipping_country}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Items ({selectedOrder.order_items?.length || 0})</h3>
                                <div className="space-y-4">
                                    {selectedOrder.order_items?.map((item: any) => (
                                        <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                            <div className="relative w-20 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                                {item.product_image_url ? (
                                                    <Image src={item.product_image_url} alt={item.product_name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Package size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start gap-4">
                                                        <h4 className="text-sm font-bold text-gray-900 leading-snug">{item.product_name}</h4>
                                                        <p className="text-sm font-bold text-gray-900 whitespace-nowrap">LKR {Number(item.subtotal).toLocaleString()}</p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {item.size_name && (
                                                            <span className="text-[10px] bg-gray-50 border border-gray-200 px-2 py-1 rounded text-gray-600 font-bold uppercase tracking-wide">
                                                                Size: <span className="text-gray-900">{item.size_name}</span>
                                                            </span>
                                                        )}
                                                        {item.color_name && (
                                                            <span className="text-[10px] bg-gray-50 border border-gray-200 px-2 py-1 rounded text-gray-600 font-bold uppercase tracking-wide">
                                                                Color: <span className="text-gray-900">{item.color_name}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-2 text-xs text-gray-400 font-medium pt-2 border-t border-gray-50 flex justify-between items-center">
                                                    <span>Qty: {item.quantity}</span>
                                                    <span>{item.quantity} × LKR {Number(item.unit_price).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Financials */}
                            <div className="bg-gray-50 p-6 rounded-xl space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium text-gray-900">LKR {Number(selectedOrder.subtotal).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="font-medium text-gray-900">LKR {Number(selectedOrder.shipping_cost).toLocaleString()}</span>
                                </div>
                                {Number(selectedOrder.discount) > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount</span>
                                        <span>- LKR {Number(selectedOrder.discount).toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-gray-200 flex justify-between items-end">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="text-xl font-bold text-gold-600">LKR {Number(selectedOrder.total).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
