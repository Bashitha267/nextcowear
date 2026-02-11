import { Package, ShoppingCart, Star, Users, Hammer } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with Service Role Key for Admin Access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getDashboardStats() {
    // Parallel fetching for performance
    const [
        { count: ordersCount },
        { count: productsCount },
        { count: reviewsCount },
        { count: usersCount }
    ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('product_reviews').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true })
    ]);

    return {
        orders: ordersCount || 0,
        products: productsCount || 0,
        reviews: reviewsCount || 0,
        users: usersCount || 0
    };
}

export default async function AdminDashboard() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Overview of your store performance</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Orders"
                    value={stats.orders}
                    icon={ShoppingCart}
                    bgColor="bg-blue-50"
                    iconColor="text-blue-600"
                />
                <StatCard
                    title="Total Products"
                    value={stats.products}
                    icon={Package}
                    bgColor="bg-green-50"
                    iconColor="text-green-600"
                />
                <StatCard
                    title="Total Reviews"
                    value={stats.reviews}
                    icon={Star}
                    bgColor="bg-yellow-50"
                    iconColor="text-yellow-600"
                />
                <StatCard
                    title="Registered Users"
                    value={stats.users}
                    icon={Users}
                    bgColor="bg-purple-50"
                    iconColor="text-purple-600"
                />
            </div>

            {/* Orders Section - Under Development */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="bg-gray-100 p-4 rounded-full">
                    <Hammer className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Orders Management</h2>
                    <p className="text-gray-500 mt-2 max-w-md">
                        The detailed orders management section is currently under development.
                        You can view the total order count above.
                    </p>
                </div>
                <div className="pt-2">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gold-50 text-gold-700 border border-gold-100">
                        Available Soon
                    </span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/admin/products/new"
                    className="bg-linear-to-r from-gold-500 to-gold-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center">
                        <Package className="w-8 h-8 mr-4" />
                        <div>
                            <h3 className="font-semibold text-lg">Add New Product</h3>
                            <p className="text-sm text-gold-100 mt-1">Upload and create products</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/admin/reviews"
                    className="bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center">
                        <Star className="w-8 h-8 mr-4" />
                        <div>
                            <h3 className="font-semibold text-lg">Reviews</h3>
                            <p className="text-sm text-blue-100 mt-1">Manage customer reviews</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/admin/users"
                    className="bg-linear-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center">
                        <Users className="w-8 h-8 mr-4" />
                        <div>
                            <h3 className="font-semibold text-lg">Users</h3>
                            <p className="text-sm text-purple-100 mt-1">Manage registered users</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
