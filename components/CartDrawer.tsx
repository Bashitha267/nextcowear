"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CartDrawer = () => {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen
    } = useCart();

    // if (!isCartOpen) return null; // Removed to allow exit animations if we were using AnimatePresence, but simple CSS logic needs rendering.
    // Actually, for simple CSS transition without unmounting, we need to keep it mounted but hidden or translated off-screen.
    // However, ConditionalLayout conditonally renders this. If we want animation, we should probably toggle visibility/transform instead of unmounting.

    // Let's refactor to stay mounted but use visibility/transform

    return (
        <div className={`fixed inset-0 z-1000 flex justify-end transition-all duration-500 ${isCartOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'}`}>
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className={`relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-3">
                        <ShoppingBag size={20} className="text-gold-600" />
                        <h2 className="text-lg font-serif font-bold text-gray-900 tracking-wide uppercase">Your Bag ({totalItems})</h2>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-gold-200">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-60">
                            <ShoppingBag size={64} className="text-gold-300" strokeWidth={1} />
                            <div className="space-y-2">
                                <p className="text-lg font-bold text-gray-900">Your bag is empty</p>
                                <p className="text-sm text-gray-500 max-w-[200px] mx-auto">Looks like you haven't added anything to your bag yet.</p>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="px-8 py-3 bg-gold-600 text-white text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-gold-700 transition-colors shadow-md hover:shadow-lg"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.cartItemId} className="flex gap-4 group">
                                {/* Image */}
                                <div className="relative w-24 aspect-3/4 bg-gray-50 rounded-sm overflow-hidden border border-gray-100 shrink-0">
                                    <Image
                                        src={item.product.image}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start gap-2">
                                        <Link
                                            href={`/product/${item.product.id}`}
                                            onClick={() => setIsCartOpen(false)}
                                            className="text-sm font-bold text-gray-900 hover:text-gold-600 transition-colors line-clamp-2"
                                        >
                                            {item.product.name}
                                        </Link>
                                        <button
                                            onClick={() => removeFromCart(item.cartItemId)}
                                            className="text-gray-300 hover:text-red-500 transition-colors p-1 -mr-2"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="mt-1 space-y-1">
                                        <p className="text-xs text-gray-500 font-medium">Color: <span className="text-gray-900">{item.selectedColor}</span></p>
                                        <p className="text-xs text-gray-500 font-medium">Size: <span className="text-gray-900">{item.selectedSize}</span></p>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-4">
                                        <div className="flex items-center border border-gray-200 rounded-sm h-8">
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="w-8 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">
                                            RS {(item.product.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="border-t border-gray-100 p-6 bg-gray-50/50 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Subtotal</span>
                                <span className="font-bold text-gray-900">RS {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Shipping</span>
                                <span className="text-gray-500 italic">Calculated at checkout</span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button className="w-full bg-gold-600 text-white py-4 rounded-sm text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden">
                                <span className="relative z-10">Checkout</span>
                                <span className="w-full h-full absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                            </button>
                            <p className="text-[10px] text-gray-400 text-center mt-3">
                                Taxes and shipping calculated at checkout
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
