'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Upload, Image as ImageIcon, Loader2, Ruler, Check } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface Color {
    id: string;
    name: string;
    hex_value: string;
}

interface Size {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    main_category_id?: string;
    sub_category_id?: string;
    regular_price: number;
    sale_price?: number;
    sku: string;
    stock_quantity: number;
    is_best_seller: boolean;
    is_new_arrival: boolean;
    is_featured: boolean;
    is_active: boolean;
    main_image?: string;
    additional_images?: string[];
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

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
    const [subCategories, setSubCategories] = useState<Record<string, SubCategory[]>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState(false);
    const [skuCounter, setSkuCounter] = useState(1000);

    const [availableColors, setAvailableColors] = useState<Color[]>([]);
    const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        sku: '',
        main_category_id: '',
        sub_category_id: '',
        regular_price: 0,
        sale_price: 0,
        stock_quantity: 0,
        is_best_seller: false,
        is_new_arrival: false,
        is_featured: false,
        is_active: true,
        main_image: '',
        additional_images: []
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // Fetch Categories
            const { data: mainData } = await supabase.from('main_categories').select('id, name').order('name');
            const { data: subData } = await supabase.from('sub_categories').select('id, name, main_category_id').order('name');

            setMainCategories(mainData || []);

            const subsByMain: Record<string, SubCategory[]> = {};
            subData?.forEach(sub => {
                if (!subsByMain[sub.main_category_id]) subsByMain[sub.main_category_id] = [];
                subsByMain[sub.main_category_id].push(sub);
            });
            setSubCategories(subsByMain);

            // Fetch Attributes
            const [colorsRes, sizesRes] = await Promise.all([
                supabase.from('colors').select('*').order('display_order'),
                supabase.from('sizes').select('*').order('display_order'),
            ]);
            if (colorsRes.data) setAvailableColors(colorsRes.data);
            if (sizesRes.data) setAvailableSizes(sizesRes.data);

            // Fetch Products
            await fetchProducts();
        } catch (error) {
            console.error('Error fetching initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);

            // Set SKU counter to last high value
            if (data && data.length > 0) {
                const skus = data.filter(p => p.sku).map(p => {
                    const parts = p.sku.split('-');
                    const num = parseInt(parts[parts.length - 1]);
                    return isNaN(num) ? 999 : num;
                });
                if (skus.length > 0) setSkuCounter(Math.max(...skus) + 1);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const generateSKU = (mainCatId: string, subCatId: string) => {
        const mainCat = mainCategories.find(c => c.id === mainCatId);
        const subCat = subCategories[mainCatId]?.find(c => c.id === subCatId);

        if (mainCat && subCat) {
            const mainName = mainCat.name.toUpperCase();
            const subName = subCat.name.toUpperCase().substring(0, 3);
            const sku = `${mainName}-${subName}-${skuCounter}`;
            setFormData(prev => ({ ...prev, sku }));
        }
    };

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );

            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || 'Upload failed');
            return data.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    };

    const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const imageUrl = await uploadToCloudinary(file);
            setFormData(prev => ({ ...prev, main_image: imageUrl }));
            toast.success('Main image uploaded!');
        } catch (error) {
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleAdditionalImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        try {
            const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
            const imageUrls = await Promise.all(uploadPromises);
            setFormData(prev => ({
                ...prev,
                additional_images: [...(prev.additional_images || []), ...imageUrls]
            }));
            toast.success(`${imageUrls.length} images uploaded!`);
        } catch (error) {
            toast.error('Failed to upload images. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeAdditionalImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            additional_images: prev.additional_images?.filter((_, i) => i !== index)
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' ? parseFloat(value) || 0 : value;

        setFormData(prev => {
            const updated = { ...prev, [name]: newValue };
            if (name === 'main_category_id' && updated.sub_category_id) generateSKU(value as string, updated.sub_category_id as string);
            else if (name === 'sub_category_id' && updated.main_category_id) generateSKU(updated.main_category_id as string, value as string);
            return updated;
        });
    };

    const toggleBoolean = (field: keyof Product) => {
        setFormData(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleEdit = async (product: Product) => {
        setFormData({ ...product });

        // Fetch current product attributes
        try {
            const [colorRes, sizeRes] = await Promise.all([
                supabase.from('product_colors').select('color_id').eq('product_id', product.id),
                supabase.from('product_sizes').select('size_id').eq('product_id', product.id),
            ]);

            if (colorRes.data) setSelectedColors(colorRes.data.map(c => c.color_id));
            if (sizeRes.data) setSelectedSizes(sizeRes.data.map(s => s.size_id));
        } catch (error) {
            console.error('Error fetching product attributes:', error);
        }

        setShowForm(true);
    };

    const toggleColor = (id: string) => {
        setSelectedColors(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    };

    const toggleSize = (id: string) => {
        setSelectedSizes(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setFormData({
            name: '', description: '', sku: '', main_category_id: '', sub_category_id: '',
            regular_price: 0, sale_price: 0, stock_quantity: 0,
            is_best_seller: false, is_new_arrival: false, is_featured: false, is_active: true,
            main_image: '', additional_images: []
        });
        setSelectedColors([]);
        setSelectedSizes([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Convert empty strings to null for UUID columns
            const cleanedData = {
                ...formData,
                main_category_id: formData.main_category_id || null,
                sub_category_id: formData.sub_category_id || null,
            };

            let error;
            let resultProduct;

            if (formData.id) {
                // Update existing product
                const { data, error: updateError } = await supabase
                    .from('products')
                    .update(cleanedData)
                    .eq('id', formData.id)
                    .select()
                    .single();
                error = updateError;
                resultProduct = data;
            } else {
                // Insert new product
                const { data, error: insertError } = await supabase
                    .from('products')
                    .insert([cleanedData])
                    .select()
                    .single();
                error = insertError;
                resultProduct = data;
            }

            if (error) throw error;
            if (!resultProduct) throw new Error('Failed to retrieve product record');

            // Update Junction Tables (Colors & Sizes)
            if (formData.id) {
                // Clear existing first for update
                await Promise.all([
                    supabase.from('product_colors').delete().eq('product_id', formData.id),
                    supabase.from('product_sizes').delete().eq('product_id', formData.id)
                ]);
            }

            const productId = resultProduct.id;
            const attributeUpdates = [];

            if (selectedColors.length > 0) {
                attributeUpdates.push(
                    supabase.from('product_colors').insert(
                        selectedColors.map(colorId => ({ product_id: productId, color_id: colorId }))
                    )
                );
            }

            if (selectedSizes.length > 0) {
                attributeUpdates.push(
                    supabase.from('product_sizes').insert(
                        selectedSizes.map(sizeId => ({ product_id: productId, size_id: sizeId }))
                    )
                );
            }

            if (attributeUpdates.length > 0) {
                const results = await Promise.all(attributeUpdates);
                const firstError = results.find(r => r.error);
                if (firstError) throw firstError.error;
            }

            if (!formData.id) setSkuCounter(prev => prev + 1);
            await fetchProducts();
            handleCloseForm();
            toast.success(formData.id ? 'Product updated successfully!' : 'Product created successfully!');
        } catch (error: any) {
            console.error('Error saving product:', error);
            toast.error(error.message || 'Failed to save product');
        } finally {
            setSubmitting(false);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            await fetchProducts();
            toast.success('Product deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-1">Manage your jewelry collection</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors shadow-sm font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add New Product
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search products by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                    />
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-lg border border-dashed border-gray-300">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                        <p className="text-gray-500">Try adjusting your search or add a new product.</p>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                            <div className="relative h-64 overflow-hidden bg-gray-50">
                                {product.main_image ? (
                                    <img
                                        src={product.main_image}
                                        alt={product.name}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <ImageIcon className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                                    {product.is_best_seller && (
                                        <span className="bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">BEST SELLER</span>
                                    )}
                                    {product.is_new_arrival && (
                                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">NEW</span>
                                    )}
                                </div>
                                <div className="absolute top-2 right-2 flex gap-1">
                                    {!product.is_active && (
                                        <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-80 shadow-sm">INACTIVE</span>
                                    )}
                                </div>
                            </div>

                            <div className="p-5 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
                                        <p className="text-xs text-gray-500 font-mono mt-0.5">{product.sku}</p>
                                    </div>
                                    <div className="flex items-center gap-1 ml-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-2 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 line-clamp-2 min-h-10">
                                    {product.description || "No description provided."}
                                </p>

                                <div className="space-y-1">
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-xl font-bold text-gray-900">
                                            LKR {product.regular_price.toLocaleString()}
                                        </span>
                                        {product.sale_price && product.sale_price > 0 && (
                                            <span className="text-sm text-gray-500 line-through">
                                                LKR {product.sale_price.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Stock:</span>
                                    <span className={`font-semibold ${product.stock_quantity > 20 ? 'text-green-600' : product.stock_quantity > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                                        {product.stock_quantity > 0 ? `${product.stock_quantity} units` : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-2xl font-serif font-bold text-gray-900">
                                {formData.id ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button
                                onClick={handleCloseForm}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                        <input
                                            type="text" name="name" required value={formData.name} onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                            placeholder="Premium Cotton T-Shirt"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Auto-generated)</label>
                                        <input
                                            type="text" name="sku" value={formData.sku} readOnly
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed font-mono"
                                            placeholder="Select categories to generate SKU"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Category *</label>
                                        <select
                                            name="main_category_id" required value={formData.main_category_id} onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                        >
                                            <option value="">Select Main Category</option>
                                            {mainCategories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category *</label>
                                        <select
                                            name="sub_category_id" required value={formData.sub_category_id} onChange={handleInputChange}
                                            disabled={!formData.main_category_id}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select Sub Category</option>
                                            {formData.main_category_id && subCategories[formData.main_category_id]?.map(sub => (
                                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description" value={formData.description} onChange={handleInputChange} rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                        placeholder="Enter product description..."
                                    />
                                </div>
                            </div>

                            {/* Attributes */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Attributes</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Colors</label>
                                        <div className="flex flex-wrap gap-4">
                                            {availableColors.map(color => (
                                                <button
                                                    key={color.id} type="button" onClick={() => toggleColor(color.id)}
                                                    className="group flex flex-col items-center gap-1.5"
                                                >
                                                    <div
                                                        className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center relative ${selectedColors.includes(color.id) ? 'border-gold-500 scale-110 shadow-md' : 'border-transparent hover:border-gray-300'}`}
                                                        style={{ backgroundColor: color.hex_value }}
                                                    >
                                                        {selectedColors.includes(color.id) && (
                                                            <Check className={`w-4 h-4 ${color.hex_value.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'}`} />
                                                        )}
                                                    </div>
                                                    <span className={`text-[10px] font-medium transition-colors ${selectedColors.includes(color.id) ? 'text-gold-600' : 'text-gray-500 group-hover:text-gray-900'}`}>
                                                        {color.name}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Sizes</label>
                                        <div className="flex flex-wrap gap-2">
                                            {availableSizes.map(size => (
                                                <button
                                                    key={size.id} type="button" onClick={() => toggleSize(size.id)}
                                                    className={`px-4 py-2 rounded-lg border-2 font-bold text-sm transition-all ${selectedSizes.includes(size.id) ? 'bg-gold-500 border-gold-500 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-gold-300 hover:text-gold-600'}`}
                                                >
                                                    {size.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Images */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Images</h3>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Main Image *</label>
                                        {formData.main_image ? (
                                            <div className="relative w-48 aspect-square rounded-lg overflow-hidden border-2 border-gray-300 group">
                                                <img src={formData.main_image} alt="Main" className="w-full h-full object-cover" />
                                                <button
                                                    type="button" onClick={() => setFormData(prev => ({ ...prev, main_image: '' }))}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-48 aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gold-500 transition-colors bg-gray-50">
                                                <div className="flex flex-col items-center p-2 text-center">
                                                    {uploading ? <Loader2 className="w-8 h-8 text-gold-500 animate-spin mb-2" /> : <Upload className="w-8 h-8 text-gray-400 mb-2" />}
                                                    <p className="text-xs text-gray-500 font-medium">{uploading ? 'Uploading...' : 'Click to upload'}</p>
                                                </div>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleMainImageUpload} disabled={uploading} />
                                            </label>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {formData.additional_images?.map((url, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                                    <img src={url} alt={`Add ${idx}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button" onClick={() => removeAdditionalImage(idx)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gold-500 transition-colors bg-gray-50">
                                                <Plus className="w-6 h-6 text-gray-400" />
                                                <input type="file" className="hidden" accept="image/*" multiple onChange={handleAdditionalImagesUpload} disabled={uploading} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing & Stock */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price *</label>
                                            <input type="number" name="regular_price" required value={formData.regular_price} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gold-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
                                            <input type="number" name="sale_price" value={formData.sale_price} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gold-500" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Inventory</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                                        <input type="number" name="stock_quantity" required value={formData.stock_quantity} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gold-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Visibility & Flags */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Status & Visibility</h3>
                                <div className="flex flex-wrap gap-4">
                                    {[
                                        { label: 'Featured Product', field: 'is_featured' as keyof Product },
                                        { label: 'New Arrival', field: 'is_new_arrival' as keyof Product },
                                        { label: 'Best Seller', field: 'is_best_seller' as keyof Product },
                                        { label: 'Active', field: 'is_active' as keyof Product }
                                    ].map(item => (
                                        <button
                                            key={item.field} type="button" onClick={() => toggleBoolean(item.field)}
                                            className={`px-4 py-2 rounded-full border-2 transition-all font-medium ${formData[item.field] ? 'bg-gold-500 border-gold-500 text-white shadow-md' : 'border-gray-200 text-gray-500 hover:border-gold-300'}`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white pt-6 pb-2 border-t border-gray-100 flex gap-4">
                                <button type="button" onClick={handleCloseForm} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">Cancel</button>
                                <button type="submit" disabled={submitting} className="flex-2 px-10 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg shadow-lg font-bold flex items-center justify-center gap-2 disabled:bg-gold-300">
                                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {submitting ? 'Saving...' : (formData.id ? 'Update Product' : 'Add Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
