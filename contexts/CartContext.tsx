"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/lib/data";

export interface CartItem {
    product: Product;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
    // Add a unique ID for the cart item itself (combination of product + variants)
    cartItemId: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity: number, selectedSize: string, selectedColor: string) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, newQuantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("dressco_cart");
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart from local storage", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("dressco_cart", JSON.stringify(cart));
        }
    }, [cart, isLoaded]);

    const addToCart = (product: Product, quantity: number, selectedSize: string, selectedColor: string) => {
        const cartItemId = `${product.id}-${selectedSize}-${selectedColor}`;

        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item => item.cartItemId === cartItemId);

            if (existingItemIndex > -1) {
                // Item exists, update quantity
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            } else {
                // New item
                return [...prevCart, {
                    product,
                    quantity,
                    selectedSize,
                    selectedColor,
                    cartItemId
                }];
            }
        });

        setIsCartOpen(true); // Open cart sidebar when adding
    };

    const removeFromCart = (cartItemId: string) => {
        setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const subtotal = cart.reduce((total, item) => {
        const price = item.product.price;
        return total + (price * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            subtotal,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
