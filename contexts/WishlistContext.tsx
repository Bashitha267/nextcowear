
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

interface WishlistItem {
    id: string; // Product ID
    created_at: string;
}

interface WishlistContextType {
    wishlist: string[]; // List of product IDs
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const [wishlist, setWishlist] = useState<string[]>([]);
    const { user, setIsLoginModalOpen } = useAuth();

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('wishlists')
                .select('product_id')
                .eq('user_id', user.id);

            if (error) throw error;
            setWishlist(data.map((item: any) => item.product_id));
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const addToWishlist = async (productId: string) => {
        if (!user) {
            setIsLoginModalOpen(true);
            return;
        }

        try {
            const { error } = await supabase
                .from('wishlists')
                .insert([{ user_id: user.id, product_id: productId }]);

            if (error) {
                if (error.code === '23505') { // Unique violation
                    toast.error('Already in wishlist');
                } else {
                    throw error;
                }
            } else {
                setWishlist([...wishlist, productId]);
                toast.success('Added to wishlist');
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            toast.error('Failed to add to wishlist');
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('wishlists')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', productId);

            if (error) throw error;

            setWishlist(wishlist.filter(id => id !== productId));
            toast.success('Removed from wishlist');
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('Failed to remove from wishlist');
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.includes(productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
