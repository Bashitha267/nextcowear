'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function AdminLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !isAdmin && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [user, loading, isAdmin, pathname, router]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-100">
                <Loader2 className="w-10 h-10 animate-spin text-gold-600" />
            </div>
        );
    }

    // Allow login page to render without layout wrapper logic if wanted, 
    // or if it needs to be full screen.
    // However, usually login page shouldn't have sidebar/header.
    // If we are on login page, we might want to return children directly?
    // Let's see if the design implies Sidebar/Header on login. 
    // Usually no.
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (!isAdmin) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            <Toaster
                position="top-right"
                toastOptions={{
                    success: {
                        style: {
                            background: '#16a34a', // green-600
                            color: 'white',
                        },
                    },
                    error: {
                        style: {
                            background: '#dc2626', // red-600
                            color: 'white',
                        },
                    },
                    duration: 2000,
                }}
            />
            {/* Sidebar */}
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
