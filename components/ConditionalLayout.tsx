'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ChatWidget from "@/components/ChatWidget";

export default function ConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/signup';

    return (
        <>
            {!isAdminPath && <Navbar />}
            <main>{children}</main>
            {!isAdminPath && <CartDrawer />}
            {!isAdminPath && <ChatWidget />}
            {!isAdminPath && <Footer />}
        </>
    );
}
