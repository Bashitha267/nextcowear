'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User, Menu, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface AdminHeaderProps {
    onMenuClick?: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await fetch('/api/admin/auth/logout', { method: 'POST' });
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
            <div className="px-4 md:px-6 py-3 flex items-center justify-between">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-gray-600 lg:hidden hover:bg-gray-100 rounded-lg"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className="flex-1 md:flex-none"></div>

                {/* Right side buttons */}
                <div className="flex items-center space-x-2 md:space-x-4">
                    {/* Visit Live Site */}
                    <Link
                        href="/"
                        target="_blank"
                        className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gold-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span>Visit Site</span>
                    </Link>

                    {/* User Menu */}
                    <div className="hidden sm:flex items-center space-x-3 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-xs leading-none">
                            <p className="font-bold text-gray-900">Admin</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="flex items-center space-x-2 px-3 md:px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50 border border-gray-100"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">{loading ? '...' : 'Logout'}</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
