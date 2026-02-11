'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Edit, Trash2, FolderPlus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface MainCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

interface SubCategory {
    id: string;
    name: string;
    slug: string;
    main_category_id: string;
}

export default function CategoriesPage() {
    const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [showMainCategoryForm, setShowMainCategoryForm] = useState(false);
    const [showSubCategoryForm, setShowSubCategoryForm] = useState(false);

    const [mainCategoryFormData, setMainCategoryFormData] = useState({
        name: '',
        slug: '',
        description: ''
    });

    const [subCategoryFormData, setSubCategoryFormData] = useState({
        name: '',
        slug: '',
        main_category_id: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            // Fetch main categories
            const { data: mainData, error: mainError } = await supabase
                .from('main_categories')
                .select('*')
                .order('display_order', { ascending: true });

            if (mainError) throw mainError;
            setMainCategories(mainData || []);

            // Fetch subcategories
            const { data: subData, error: subError } = await supabase
                .from('sub_categories')
                .select('*')
                .order('display_order', { ascending: true });

            if (subError) throw subError;
            setSubCategories(subData || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    // Auto-generate slug from name
    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };

    const handleMainCategoryNameChange = (name: string) => {
        setMainCategoryFormData({
            ...mainCategoryFormData,
            name,
            slug: generateSlug(name)
        });
    };

    const handleSubCategoryNameChange = (name: string) => {
        setSubCategoryFormData({
            ...subCategoryFormData,
            name,
            slug: generateSlug(name)
        });
    };

    const handleAddMainCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('main_categories')
                .insert([{
                    name: mainCategoryFormData.name,
                    slug: mainCategoryFormData.slug,
                    description: mainCategoryFormData.description,
                    is_active: true
                }]);

            if (error) throw error;

            await fetchCategories();
            setMainCategoryFormData({ name: '', slug: '', description: '' });
            setShowMainCategoryForm(false);
            toast.success('Main category added successfully!');
        } catch (error: any) {
            console.error('Error adding main category:', error);
            toast.error(error.message || 'Failed to add main category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddSubCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('sub_categories')
                .insert([{
                    name: subCategoryFormData.name,
                    slug: subCategoryFormData.slug,
                    main_category_id: subCategoryFormData.main_category_id,
                    is_active: true
                }]);

            if (error) throw error;

            await fetchCategories();
            setSubCategoryFormData({ name: '', slug: '', main_category_id: '' });
            setShowSubCategoryForm(false);
            toast.success('Subcategory added successfully!');
        } catch (error: any) {
            console.error('Error adding subcategory:', error);
            toast.error(error.message || 'Failed to add subcategory');
        } finally {
            setSubmitting(false);
        }
    };

    const deleteMainCategory = async (id: string) => {
        if (!window.confirm('Are you sure? This will also delete all associated subcategories.')) return;

        try {
            const { error } = await supabase
                .from('main_categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchCategories();
            toast.success('Category deleted successfully!');
        } catch (error) {
            console.error('Error deleting main category:', error);
            toast.error('Failed to delete category');
        }
    };

    const deleteSubCategory = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this subcategory?')) return;

        try {
            const { error } = await supabase
                .from('sub_categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchCategories();
            toast.success('Subcategory deleted successfully!');
        } catch (error) {
            console.error('Error deleting subcategory:', error);
            toast.error('Failed to delete subcategory');
        }
    };

    const getSubCategoriesForMain = (mainCategoryId: string) => {
        return subCategories.filter(sub => sub.main_category_id === mainCategoryId);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading categories...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600 mt-1">Manage product categories and subcategories</p>
                </div>
                <button
                    onClick={() => setShowMainCategoryForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors shadow-sm font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add Main Category
                </button>
            </div>

            {/* Main Categories Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mainCategories.length === 0 ? (
                    <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <FolderPlus className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories yet</h3>
                            <p className="text-gray-500 mb-4">Get started by creating your first main category</p>
                            <button
                                onClick={() => setShowMainCategoryForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Main Category
                            </button>
                        </div>
                    </div>
                ) : (
                    mainCategories.map((mainCategory) => (
                        <div key={mainCategory.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Main Category Header */}
                            <div className="bg-linear-to-r from-gold-50 to-white p-4 border-b border-gray-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900">{mainCategory.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">/{mainCategory.slug}</p>
                                        {mainCategory.description && (
                                            <p className="text-sm text-gray-600 mt-2">{mainCategory.description}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setSubCategoryFormData({ ...subCategoryFormData, main_category_id: mainCategory.id });
                                                setShowSubCategoryForm(true);
                                            }}
                                            className="p-2 text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                                            title="Add Subcategory"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteMainCategory(mainCategory.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Subcategories */}
                            <div className="p-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-between">
                                    <span>Subcategories ({getSubCategoriesForMain(mainCategory.id).length})</span>
                                </h4>
                                {getSubCategoriesForMain(mainCategory.id).length === 0 ? (
                                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                        <p className="text-sm text-gray-400 mb-2">No subcategories</p>
                                        <button
                                            onClick={() => {
                                                setSubCategoryFormData({ ...subCategoryFormData, main_category_id: mainCategory.id });
                                                setShowSubCategoryForm(true);
                                            }}
                                            className="text-sm text-gold-600 hover:text-gold-700 font-medium"
                                        >
                                            + Add First Subcategory
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {getSubCategoriesForMain(mainCategory.id).map((subCategory) => (
                                            <div
                                                key={subCategory.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gold-200 transition-colors"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900">{subCategory.name}</p>
                                                    <p className="text-xs text-gray-500">/{subCategory.slug}</p>
                                                </div>
                                                <button
                                                    onClick={() => deleteSubCategory(subCategory.id)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Main Category Modal */}
            {showMainCategoryForm && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-serif font-bold text-gray-900">Add Main Category</h2>
                            <button
                                onClick={() => setShowMainCategoryForm(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddMainCategory} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={mainCategoryFormData.name}
                                    onChange={(e) => handleMainCategoryNameChange(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                    placeholder="e.g., Men, Women, Kids"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Slug (Auto-generated)
                                </label>
                                <input
                                    type="text"
                                    value={mainCategoryFormData.slug}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={mainCategoryFormData.description}
                                    onChange={(e) => setMainCategoryFormData({ ...mainCategoryFormData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                    placeholder="Brief description of this category"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowMainCategoryForm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors font-medium shadow-sm flex items-center justify-center gap-2"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {submitting ? 'Adding...' : 'Add Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Sub Category Modal */}
            {showSubCategoryForm && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-serif font-bold text-gray-900">Add Subcategory</h2>
                            <button
                                onClick={() => setShowSubCategoryForm(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddSubCategory} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Main Category *
                                </label>
                                <select
                                    required
                                    value={subCategoryFormData.main_category_id}
                                    onChange={(e) => setSubCategoryFormData({ ...subCategoryFormData, main_category_id: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                >
                                    <option value="">Select Main Category</option>
                                    {mainCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subcategory Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={subCategoryFormData.name}
                                    onChange={(e) => handleSubCategoryNameChange(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                    placeholder="e.g., T-Shirts, Hoodies, Shorts"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Slug (Auto-generated)
                                </label>
                                <input
                                    type="text"
                                    value={subCategoryFormData.slug}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowSubCategoryForm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors font-medium shadow-sm flex items-center justify-center gap-2"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {submitting ? 'Adding...' : 'Add Subcategory'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
