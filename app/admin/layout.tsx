import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import AdminLayoutContent from '@/components/admin/AdminLayoutContent';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Login page doesn't need authentication check - it renders without layout
    // All other admin pages require authentication
    // Server-side auth check removed in favor of client-side AuthContext check
    // const authenticated = await isAuthenticated();
    // if (!authenticated) {
    //     redirect('/login');
    // }


    return (
        <AdminLayoutContent>
            {children}
        </AdminLayoutContent>
    );
}
