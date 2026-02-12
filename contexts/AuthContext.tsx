"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { hashPassword } from '@/lib/crypto';
import { toast } from 'react-hot-toast';

interface User {
    id: string;
    email: string;
    role: 'admin' | 'customer';
    name?: string;
    full_name?: string; // For admin
    first_name?: string; // For customer
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: any) => Promise<void>;
    logout: () => void;
    isLoginModalOpen: boolean;
    setIsLoginModalOpen: (isOpen: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAdmin: false,
    login: async () => { },
    signup: async () => { },
    logout: () => { },
    isLoginModalOpen: false,
    setIsLoginModalOpen: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check for existing session in localStorage
        const storedUser = localStorage.getItem('dressco_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user session", e);
                localStorage.removeItem('dressco_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const hashedPassword = await hashPassword(password);

            // 1. Check Admin Users
            const { data: adminData, error: adminError } = await supabase
                .from('admin_users')
                .select('*')
                .eq('email', email)
                .eq('password_hash', hashedPassword)
                .maybeSingle();

            if (adminData) {
                const adminUser: User = {
                    id: adminData.id,
                    email: adminData.email,
                    role: 'admin',
                    name: adminData.full_name,
                    full_name: adminData.full_name
                };
                setUser(adminUser);
                localStorage.setItem('dressco_user', JSON.stringify(adminUser));
                toast.success('Welcome back, Admin!');
                router.push('/admin');
                return;
            }

            // 2. Check Regular Users
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .eq('password_hash', hashedPassword)
                .maybeSingle();

            if (userData) {
                const regularUser: User = {
                    id: userData.id,
                    email: userData.email,
                    role: 'customer',
                    name: userData.first_name,
                    first_name: userData.first_name
                };
                setUser(regularUser);
                localStorage.setItem('dressco_user', JSON.stringify(regularUser));
                toast.success('Welcome back!');
                router.push('/');
                return;
            }

            throw new Error('Invalid email or password');

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Login failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (formData: any) => {
        setLoading(true);
        try {
            const hashedPassword = await hashPassword(formData.password);

            // Check if email already exists
            const { data: existingUser } = await supabase
                .from('users')
                .select('email')
                .eq('email', formData.email)
                .maybeSingle();

            if (existingUser) {
                throw new Error('Email already registered');
            }

            const newUser = {
                email: formData.email,
                password_hash: hashedPassword,
                first_name: formData.first_name,
                phone_number: formData.phone_number,
                address_line1: formData.address,
                city: formData.town,
                secondary_phone: formData.secondary_phone,
                is_active: true
            };

            const { data, error } = await supabase
                .from('users')
                .insert([newUser])
                .select()
                .single();

            if (error) throw error;

            // Auto-login after signup
            const user: User = {
                id: data.id,
                email: data.email,
                role: 'customer',
                name: data.first_name,
                first_name: data.first_name
            };

            setUser(user);
            localStorage.setItem('dressco_user', JSON.stringify(user));
            toast.success('Account created successfully!');
            router.push('/');

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Signup failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('dressco_user');
        router.push('/');
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAdmin: user?.role === 'admin',
            login,
            signup,
            logout,
            isLoginModalOpen,
            setIsLoginModalOpen
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
