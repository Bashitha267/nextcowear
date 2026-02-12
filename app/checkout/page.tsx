"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { createOrder } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    CreditCard,
    Truck,
    ShieldCheck,
    ArrowRight,
    User,
    Phone,
    MapPin,
    Building,
    Mail,
    Loader2,
    ChevronRight,
    Lock
} from 'lucide-react';
import Link from 'next/link';

export default function Checkout() {
    const { cart, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        email: '',
        phone_number: '',
        address: '',
        town: '',
        secondary_phone: '',
        payment_method: 'card',
    });

    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: '',
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                first_name: user.name ? user.name.split(' ')[0] : '',
                email: user.email || '',
                // Other fields like phone/address are not in the basic User session currently
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardData({ ...cardData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) {
            toast.error("Your cart is empty");
            return;
        }
        setLoading(true);

        try {
            let userId = user?.id;

            // 1. Handle User Logic (Auto-creation/Lookup)
            if (!userId) {
                // Check if user exists in our public table by email
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', formData.email)
                    .single();

                if (existingUser) {
                    userId = existingUser.id;
                } else {
                    // Create a new user record in the 'users' table 
                    const { data: newUser, error: userError } = await supabase
                        .from('users')
                        .insert([{
                            email: formData.email,
                            first_name: formData.first_name,
                            phone_number: formData.phone_number,
                            address_line1: formData.address,
                            city: formData.town,
                            secondary_phone: formData.secondary_phone,
                            password_hash: 'guest_checkout' // Placeholder
                        }])
                        .select()
                        .single();

                    if (userError) throw userError;
                    userId = newUser.id;
                }
            }

            // 2. Prepare Order Data
            const orderData = {
                user_id: userId,
                customer_name: formData.first_name,
                customer_email: formData.email,
                primary_phone: formData.phone_number,
                secondary_phone: formData.secondary_phone,
                shipping_address_line1: formData.address,
                shipping_city: formData.town,
                shipping_state: 'Lanka', // Default or from town lookup
                subtotal: subtotal,
                total: subtotal,
                payment_method: formData.payment_method,
                payment_status: formData.payment_method === 'card' ? 'paid' : 'pending',
                status: 'pending'
            };

            // 3. Create Order
            // Filter out any potential invalid items where product might be missing/null
            const validCartItems = cart.filter(item => item && item.product);

            if (validCartItems.length === 0) {
                toast.error("Cart seems to be corrupted. Please clear cart and try again.");
                setLoading(false);
                return;
            }

            const itemsToSubmit = validCartItems.map(item => ({
                id: item.product.id,
                name: item.product.name,
                image: item.product.image,
                color: item.selectedColor || 'Default', // Fallback
                size: item.selectedSize || 'Default',   // Fallback
                price: item.product.price,
                quantity: item.quantity
            }));

            const order = await createOrder(orderData, itemsToSubmit);

            toast.success('Order placed successfully!');
            clearCart();
            router.push(`/order-success?id=${order.id}`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0 && !loading) {
        return (
            <div className="min-h-screen pt-40 pb-20 flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <CreditCard className="text-gray-400 w-10 h-10" />
                </div>
                <h2 className="text-2xl font-serif text-gray-900 uppercase tracking-widest">Cart is Empty</h2>
                <Link href="/collections" className="text-gold-600 font-bold uppercase tracking-widest border-b-2 border-gold-600 pb-1">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-12">
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-12">
                    <Link href="/cart" className="hover:text-gold-600 transition-colors">Cart</Link>
                    <ChevronRight size={10} />
                    <span className="text-gray-900">Checkout</span>
                    <ChevronRight size={10} />
                    <span>Payment</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left: Forms */}
                    <div className="lg:col-span-7 space-y-12">
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">01</div>
                                <h2 className="text-2xl font-serif text-gray-900 uppercase tracking-widest">Contact Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">First Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                        <input
                                            name="first_name"
                                            required
                                            type="text"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-12 py-3.5 text-sm focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium"
                                            placeholder="Sarah"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                        <input
                                            name="email"
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-12 py-3.5 text-sm focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium"
                                            placeholder="sarah@example.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">02</div>
                                <h2 className="text-2xl font-serif text-gray-900 uppercase tracking-widest">Shipping Details</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">WhatsApp Number *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                        <input
                                            name="phone_number"
                                            required
                                            type="tel"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-12 py-3.5 text-sm focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium"
                                            placeholder="+94 7X XXX XXXX"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Shipping Address *</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 text-gray-300 w-4 h-4" />
                                        <textarea
                                            name="address"
                                            required
                                            rows={2}
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-12 py-3.5 text-sm focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium resize-none text-left"
                                            placeholder="Street address, apartment, etc."
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Closest Town *</label>
                                        <div className="relative">
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                            <input
                                                name="town"
                                                required
                                                type="text"
                                                value={formData.town}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-12 py-3.5 text-sm focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium"
                                                placeholder="Negombo"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Alternative Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                            <input
                                                name="secondary_phone"
                                                type="tel"
                                                value={formData.secondary_phone}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-12 py-3.5 text-sm focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium"
                                                placeholder="+94 7X XXX XXXX"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">03</div>
                                <h2 className="text-2xl font-serif text-gray-900 uppercase tracking-widest">Payment Method</h2>
                            </div>

                            {/* Card UI */}
                            <div className="relative w-full max-w-md aspect-[1.6/1] bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 text-white overflow-hidden mb-8 group overflow-x-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-10 bg-gold-400/20 rounded-md border border-gold-400/30 backdrop-blur-sm shadow-inner" />
                                        <span className="text-xl font-serif italic text-white/40">DressCo</span>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Card Number</p>
                                        <p className="text-xl md:text-2xl font-mono tracking-wider break-all">
                                            {cardData.number ? cardData.number.replace(/\d{4}(?=.)/g, '$& ') : '•••• •••• •••• ••••'}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center text-left">
                                        <div>
                                            <p className="text-[8px] text-white/40 uppercase tracking-[0.2em]">Card Holder</p>
                                            <p className="text-xs font-bold uppercase tracking-widest">{cardData.name || 'Your Name'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] text-white/40 uppercase tracking-[0.2em]">Expires</p>
                                            <p className="text-xs font-bold">{cardData.expiry || 'MM/YY'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Card Number *</label>
                                    <input
                                        name="number"
                                        required
                                        type="text"
                                        maxLength={16}
                                        value={cardData.number}
                                        onChange={handleCardChange}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium"
                                        placeholder="0000 0000 0000 0000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Card Holder Name *</label>
                                    <input
                                        name="name"
                                        required
                                        type="text"
                                        value={cardData.name}
                                        onChange={handleCardChange}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium"
                                        placeholder="SARAH SILVA"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Expiry *</label>
                                        <input
                                            name="expiry"
                                            required
                                            type="text"
                                            maxLength={5}
                                            value={cardData.expiry}
                                            onChange={handleCardChange}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium"
                                            placeholder="MM/YY"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">CVC *</label>
                                        <input
                                            name="cvc"
                                            required
                                            type="text"
                                            maxLength={3}
                                            value={cardData.cvc}
                                            onChange={handleCardChange}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium"
                                            placeholder="123"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-32">
                            <h3 className="text-xl font-serif text-gray-900 uppercase tracking-widest mb-8">Order Summary</h3>

                            <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-100">
                                {cart.map((item) => (
                                    <div key={item.cartItemId} className="flex gap-4">
                                        <div className="relative w-16 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                                            <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">{item.product.name}</h4>
                                                <span className="text-[11px] font-bold text-gray-900">LKR {item.product.price.toLocaleString()}</span>
                                            </div>
                                            <div className="mt-1 flex flex-wrap gap-2">
                                                <span className="text-[9px] text-gray-400 font-bold uppercase bg-gray-50 px-2 py-0.5 rounded-full">{item.selectedSize}</span>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase bg-gray-50 px-2 py-0.5 rounded-full">{item.selectedColor}</span>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase bg-gray-50 px-2 py-0.5 rounded-full">Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-t border-gray-50 pt-6 mb-8">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                    <span>Subtotal</span>
                                    <span>LKR {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Calculated later</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold uppercase tracking-wider text-gray-900 pt-2">
                                    <span>Total</span>
                                    <span className="text-gold-600">LKR {subtotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-gray-900 text-white py-4.5 rounded-xl text-xs font-bold tracking-[0.4em] uppercase hover:bg-gold-600 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 disabled:opacity-50 group"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        <span>Complete Order</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest pb-3 border-b border-gray-50">
                                    <Truck size={14} className="text-gold-500" />
                                    <span>Fast Delivery Islandwide</span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest pb-3 border-b border-gray-50">
                                    <ShieldCheck size={14} className="text-gold-500" />
                                    <span>Secure Encrypted Payment</span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    <Lock size={14} className="text-gold-500" />
                                    <span>100% Cotton Authenticity</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
