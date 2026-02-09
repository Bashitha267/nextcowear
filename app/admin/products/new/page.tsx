'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';

export default function NewProductPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        sku: '',
        regularPrice: '',
        oversizedPrice: '',
        salePrice: '',
        mainCategory: '',
        subCategory: '',
        stockQuantity: '',
        isBestSeller: false,
        isNewArrival: false,
        isFeatured: false,
        isActive: true,
        metaTitle: '',
        metaDescription: '',
    });
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // TODO: Implement API call to save product
            console.log('Product data:', { ...formData, images });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('Product created successfully!');
            router.push('/admin/products');
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/products"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Add New Product</h1>
                        <p className="text-gray-600 mt-1">Create a new product listing</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                        placeholder="Enter product name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                        placeholder="Enter product description"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                                        SKU *
                                    </label>
                                    <input
                                        type="text"
                                        id="sku"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                        placeholder="e.g., TSHIRT-001"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="regularPrice" className="block text-sm font-medium text-gray-700 mb-2">
                                        Regular Price (LKR) *
                                    </label>
                                    <input
                                        type="number"
                                        id="regularPrice"
                                        name="regularPrice"
                                        value={formData.regularPrice}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                        placeholder="2500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="oversizedPrice" className="block text-sm font-medium text-gray-700 mb-2">
                                        Oversized Price (LKR)
                                    </label>
                                    <input
                                        type="number"
                                        id="oversizedPrice"
                                        name="oversizedPrice"
                                        value={formData.oversizedPrice}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                        placeholder="2800"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-2">
                                        Sale Price (LKR)
                                    </label>
                                    <input
                                        type="number"
                                        id="salePrice"
                                        name="salePrice"
                                        value={formData.salePrice}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                        placeholder="2000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
                            <ImageUploader onUpload={setImages} maxImages={5} />
                        </div>

                        {/* SEO */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        id="metaTitle"
                                        name="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                        placeholder="Product meta title for search engines"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                        Meta Description
                                    </label>
                                    <textarea
                                        id="metaDescription"
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                        placeholder="Product meta description for search engines"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Category */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Category</h2>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="mainCategory" className="block text-sm font-medium text-gray-700 mb-2">
                                        Main Category *
                                    </label>
                                    <select
                                        id="mainCategory"
                                        name="mainCategory"
                                        value={formData.mainCategory}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                    >
                                        <option value="">Select category</option>
                                        <option value="men">Men</option>
                                        <option value="women">Women</option>
                                        <option value="kids">Kids</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-2">
                                        Sub Category
                                    </label>
                                    <select
                                        id="subCategory"
                                        name="subCategory"
                                        value={formData.subCategory}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                    >
                                        <option value="">Select sub category</option>
                                        <option value="tshirts">T-Shirts</option>
                                        <option value="pants">Pants</option>
                                        <option value="hoodies">Hoodies</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Inventory */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h2>

                            <div>
                                <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    id="stockQuantity"
                                    name="stockQuantity"
                                    value={formData.stockQuantity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                    placeholder="100"
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status & Features</h2>

                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isBestSeller"
                                        checked={formData.isBestSeller}
                                        onChange={handleChange}
                                        className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Best Seller</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isNewArrival"
                                        checked={formData.isNewArrival}
                                        onChange={handleChange}
                                        className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">New Arrival</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleChange}
                                        className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Featured</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Active</span>
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center space-x-2 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2.5 rounded-lg transition-colors font-medium disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                <span>{loading ? 'Saving...' : 'Save Product'}</span>
                            </button>

                            <Link
                                href="/admin/products"
                                className="w-full text-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
