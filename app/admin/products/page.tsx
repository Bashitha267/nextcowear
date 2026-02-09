import Link from 'next/link';
import { Plus, Search } from 'lucide-react';

// Temporary mock data
const products = [
    {
        id: '1',
        name: 'Premium Cotton T-Shirt',
        sku: 'TSHIRT-001',
        category: 'Men / T-Shirts',
        price: 2500,
        stock: 45,
        status: 'active',
        isBestSeller: true,
        image: 'https://res.cloudinary.com/dnfbik3if/image/upload/v1770442924/tshirt_vp2ngs.jpg'
    },
    {
        id: '2',
        name: 'French Terry Hoodie',
        sku: 'HOODIE-001',
        category: 'Women / Hoodies',
        price: 4500,
        stock: 12,
        status: 'active',
        isBestSeller: false,
        image: 'https://res.cloudinary.com/dnfbik3if/image/upload/v1770442924/tshirt_vp2ngs.jpg'
    },
];

export default function ProductsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-1">Manage your product catalog</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center space-x-2 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Product</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                            />
                        </div>
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none">
                        <option value="">All Categories</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="kids">Kids</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    SKU
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 flex-shrink-0">
                                                <img
                                                    className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                                                    src={product.image}
                                                    alt={product.name}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                {product.isBestSeller && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gold-100 text-gold-800">
                                                        Best Seller
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.sku}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        LKR {product.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.stock}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                            className="text-gold-600 hover:text-gold-900 mr-4"
                                        >
                                            Edit
                                        </Link>
                                        <button className="text-red-600 hover:text-red-900">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
