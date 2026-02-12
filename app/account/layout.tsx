"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { User, Package, LogOut } from 'lucide-react';

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleSignOut = async () => {
        logout();
        router.push('/'); // Will be handled by logout generally, but safe to keep
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center pt-20">Loading...</div>;
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-gray-50">
            {children}
        </div>
    );
}
