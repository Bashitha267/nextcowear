'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Check } from 'lucide-react';

interface Color {
    id: string;
    name: string;
    hex_value: string;
}

interface Size {
    id: string;
    name: string;
}

interface MainCategory {
    id: string;
    name: string;
}

interface SubCategory {
    id: string;
    name: string;
    main_category_id: string;
}

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

    const [availableColors, setAvailableColors] = useState<Color[]>([]);
    const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [colorsRes, sizesRes, mainRes, subRes] = await Promise.all([
                    supabase.from('colors').select('*').order('display_order'),
                    supabase.from('sizes').select('*').order('display_order'),
                    supabase.from('main_categories').select('*').order('display_order'),
                    supabase.from('sub_categories').select('*').order('display_order'),
                ]);

                if (colorsRes.data) setAvailableColors(colorsRes.data);
                if (sizesRes.data) setAvailableSizes(sizesRes.data);
                if (mainRes.data) setMainCategories(mainRes.data);
                if (subRes.data) setSubCategories(subRes.data);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                toast.error('Failed to load form data');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (formData.mainCategory) {
            setFilteredSubCategories(subCategories.filter(s => s.main_category_id === formData.mainCategory));
        } else {
            setFilteredSubCategories([]);
        }
    }, [formData.mainCategory, subCategories]);

    const toggleColor = (id: string) => {
        setSelectedColors(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const toggleSize = (id: string) => {
        setSelectedSizes(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Insert Product
            const { data: product, error: productError } = await supabase
                .from('products')
                .insert([{
                    name: formData.name,
                    description: formData.description,
                    sku: formData.sku,
                    regular_price: parseFloat(formData.regularPrice),
                    sale_price: formData.salePrice ? parseFloat(formData.salePrice) : null,
                    main_category_id: formData.mainCategory || null,
                    sub_category_id: formData.subCategory || null,
                    stock_quantity: parseInt(formData.stockQuantity) || 0,
                    is_best_seller: formData.isBestSeller,
                    is_new_arrival: formData.isNewArrival,
                    is_featured: formData.isFeatured,
                    is_active: formData.isActive
                }])
                .select()
                .single();

            if (productError) throw productError;

            // 2. Insert Colors
            if (selectedColors.length > 0) {
                const colorsToInsert = selectedColors.map(colorId => ({
                    product_id: product.id,
                    color_id: colorId
                }));
                const { error: colorError } = await supabase.from('product_colors').insert(colorsToInsert);
                if (colorError) throw colorError;
            }

            // 3. Insert Sizes
            if (selectedSizes.length > 0) {
                const sizesToInsert = selectedSizes.map(sizeId => ({
                    product_id: product.id,
                    size_id: sizeId
                }));
                const { error: sizeError } = await supabase.from('product_sizes').insert(sizesToInsert);
                if (sizeError) throw sizeError;
            }

            toast.success('Product created successfully!');
            router.push('/admin/products');
        } catch (error: any) {
            console.error('Error creating product:', error);
            toast.error(error.message || 'Failed to create product');
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

                        {/* Colors & Sizes */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Attributes</h2>

                            <div className="space-y-8">
                                {/* Colors */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        Available Colors
                                    </label>
                                    <div className="flex flex-wrap gap-4">
                                        {availableColors.map(color => (
                                            <button
                                                key={color.id}
                                                type="button"
                                                onClick={() => toggleColor(color.id)}
                                                className="group flex flex-col items-center gap-2"
                                            >
                                                <div
                                                    className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center relative ${selectedColors.includes(color.id)
                                                        ? 'border-gold-500 scale-110 shadow-md'
                                                        : 'border-transparent hover:border-gray-300'
                                                        }`}
                                                    style={{ backgroundColor: color.hex_value }}
                                                >
                                                    {selectedColors.includes(color.id) && (
                                                        <Check className={`w-5 h-5 ${
                                                            // Determine if white or black icon is better based on hex
                                                            color.hex_value.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'
                                                            }`} />
                                                    )}
                                                </div>
                                                <span className={`text-xs font-medium transition-colors ${selectedColors.includes(color.id) ? 'text-gold-600' : 'text-gray-500 group-hover:text-gray-900'
                                                    }`}>
                                                    {color.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sizes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        Available Sizes
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {availableSizes.map(size => (
                                            <button
                                                key={size.id}
                                                type="button"
                                                onClick={() => toggleSize(size.id)}
                                                className={`min-w-[48px] h-12 px-4 rounded-lg border-2 font-bold transition-all ${selectedSizes.includes(size.id)
                                                    ? 'bg-gold-500 border-gold-500 text-white shadow-md'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gold-300 hover:text-gold-600'
                                                    }`}
                                            >
                                                {size.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
                            <ImageUploader onUpload={setImages} maxImages={5} />
                        </div> */}

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
                                        {mainCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        disabled={!formData.mainCategory}
                                    >
                                        <option value="">Select sub category</option>
                                        {filteredSubCategories.map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
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
