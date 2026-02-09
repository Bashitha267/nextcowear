import { Package, ShoppingCart, Star, Users } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import Link from 'next/link';

// Temporary mock data - will be replaced with real Supabase queries
const stats = {
    orders: {
        total: 145,
        trend: { value: '+12%', isPositive: true }
    },
    products: {
        total: 48,
        active: 42
    },
    reviews: {
        total: 89,
        pending: 5
    },
    users: {
        total: 234,
        newThisMonth: 18
    }
};

const recentOrders = [
    { id: 'ORD-20260209-00001', customer: 'John Doe', total: 'LKR 4,500', status: 'pending', date: '2 mins ago' },
    { id: 'ORD-20260209-00002', customer: 'Jane Smith', total: 'LKR 6,200', status: 'confirmed', date: '15 mins ago' },
    { id: 'ORD-20260208-00089', customer: 'Mike Johnson', total: 'LKR 3,800', status: 'shipped', date: '1 hour ago' },
    { id: 'ORD-20260208-00088', customer: 'Sarah Williams', total: 'LKR 7,100', status: 'delivered', date: '2 hours ago' },
    { id: 'ORD-20260208-00087', customer: 'David Brown', total: 'LKR 5,400', status: 'confirmed', date: '3 hours ago' },
];

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
};

export default function AdminDashboard() {
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
                    value={stats.orders.total}
                    icon={ShoppingCart}
                    trend={stats.orders.trend}
                    bgColor="bg-blue-50"
                    iconColor="text-blue-600"
                />
                <StatCard
                    title="Total Products"
                    value={stats.products.total}
                    icon={Package}
                    bgColor="bg-green-50"
                    iconColor="text-green-600"
                />
                <StatCard
                    title="Reviews"
                    value={stats.reviews.total}
                    icon={Star}
                    trend={{ value: `${stats.reviews.pending} pending`, isPositive: false }}
                    bgColor="bg-yellow-50"
                    iconColor="text-yellow-600"
                />
                <StatCard
                    title="Registered Users"
                    value={stats.users.total}
                    icon={Users}
                    trend={{ value: `+${stats.users.newThisMonth} this month`, isPositive: true }}
                    bgColor="bg-purple-50"
                    iconColor="text-purple-600"
                />
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    <Link
                        href="/admin/orders"
                        className="text-sm text-gold-600 hover:text-gold-700 font-medium"
                    >
                        View All →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="text-sm font-medium text-gold-600 hover:text-gold-700"
                                        >
                                            {order.id}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {order.customer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {order.total}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.date}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/admin/products/new"
                    className="bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
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
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center">
                        <Star className="w-8 h-8 mr-4" />
                        <div>
                            <h3 className="font-semibold text-lg">Pending Reviews</h3>
                            <p className="text-sm text-blue-100 mt-1">{stats.reviews.pending} reviews to moderate</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/admin/orders?status=pending"
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center">
                        <ShoppingCart className="w-8 h-8 mr-4" />
                        <div>
                            <h3 className="font-semibold text-lg">Process Orders</h3>
                            <p className="text-sm text-purple-100 mt-1">Review pending orders</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
