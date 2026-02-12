'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingCart,
    Users,
    Star,
    Grid3x3,
    FileText,
    ChevronDown,
    Image as ImageIcon,
    HelpCircle,
    Ruler,
    FileCheck,
    Palette,
    RectangleHorizontal,
    MessageCircle,
    Settings,
    X
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    children?: NavItem[];
}

const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Colors', href: '/admin/colors', icon: Palette },
    { name: 'Sizes', href: '/admin/sizes', icon: RectangleHorizontal },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Messages', href: '/admin/messages', icon: MessageCircle },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    {
        name: 'Content',
        href: '/admin/content',
        icon: FileText,
        children: [
            { name: 'Hero Images', href: '/admin/content/hero', icon: ImageIcon },
            { name: 'FAQs', href: '/admin/content/faqs', icon: HelpCircle },
            { name: 'Size Charts', href: '/admin/content/size-charts', icon: Ruler },
            { name: 'Legal', href: '/admin/content/legal', icon: FileCheck }
        ]
    },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>(['Content']);

    // Close sidebar on navigation (mobile)
    useEffect(() => {
        if (isOpen && setIsOpen) {
            setIsOpen(false);
        }
    }, [pathname]);

    const toggleExpand = (itemName: string) => {
        setExpandedItems(prev =>
            prev.includes(itemName)
                ? prev.filter(name => name !== itemName)
                : [...prev, itemName]
        );
    };

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === href;
        }
        return pathname?.startsWith(href);
    };

    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
            } flex flex-col shadow-2xl lg:shadow-none`}>
            {/* Logo & Close Button */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <Link href="/admin" className="block">
                    <h1 className="text-2xl font-serif font-bold text-gold-400">DressCo</h1>
                    <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
                </Link>
                {setIsOpen && (
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 -mr-2 text-gray-400 hover:text-white lg:hidden"
                    >
                        <X className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <ul className="space-y-1">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            {item.children ? (
                                // Parent with children
                                <div>
                                    <button
                                        onClick={() => toggleExpand(item.name)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${isActive(item.href)
                                            ? 'bg-gold-500 text-white'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <item.icon className="w-5 h-5 mr-3" />
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${expandedItems.includes(item.name) ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>

                                    {/* Children */}
                                    {expandedItems.includes(item.name) && (
                                        <ul className="mt-1 ml-4 space-y-1">
                                            {item.children.map((child) => (
                                                <li key={child.name}>
                                                    <Link
                                                        href={child.href}
                                                        className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive(child.href)
                                                            ? 'bg-gold-500 text-white'
                                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                                            }`}
                                                    >
                                                        <child.icon className="w-4 h-4 mr-2" />
                                                        {child.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                // Simple link
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${isActive(item.href)
                                        ? 'bg-gold-500 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800">
                <Link
                    href="/"
                    target="_blank"
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center"
                >
                    <span>View Website</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
