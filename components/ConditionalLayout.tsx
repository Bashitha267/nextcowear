'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ChatWidget from "@/components/ChatWidget";
import LoginModal from "@/components/LoginModal";
import { useAuth } from '@/contexts/AuthContext';

export default function ConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { isLoginModalOpen, setIsLoginModalOpen } = useAuth();
    const isAdminPath = pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/signup';

    return (
        <>
            {!isAdminPath && <Navbar />}
            <main>{children}</main>
            {!isAdminPath && <CartDrawer />}
            {!isAdminPath && <ChatWidget />}
            {!isAdminPath && <Footer />}
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </>
    );
}
