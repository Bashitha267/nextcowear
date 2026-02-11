'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Toaster } from 'react-hot-toast';

export default function AdminLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
