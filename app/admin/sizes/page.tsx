'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Ruler, X, Edit2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface Size {
    id: string;
    name: string;
    display_order: number;
}

export default function SizesPage() {
    const [sizes, setSizes] = useState<Size[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingSize, setEditingSize] = useState<Size | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        display_order: 0
    });

    useEffect(() => {
        fetchSizes();
    }, []);

    const fetchSizes = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('sizes')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setSizes(data || []);
        } catch (error) {
            console.error('Error fetching sizes:', error);
            toast.error('Failed to load sizes');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (size: Size) => {
        setEditingSize(size);
        setFormData({
            name: size.name,
            display_order: size.display_order
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingSize) {
                const { error } = await supabase
                    .from('sizes')
                    .update(formData)
                    .eq('id', editingSize.id);
                if (error) throw error;
                toast.success('Size updated successfully!');
            } else {
                const { error } = await supabase
                    .from('sizes')
                    .insert([formData]);
                if (error) throw error;
                toast.success('Size added successfully!');
            }

            fetchSizes();
            setFormData({ name: '', display_order: 0 });
            setEditingSize(null);
            setShowForm(false);
        } catch (error: any) {
            console.error('Error saving size:', error);
            toast.error(error.message || 'Failed to save size');
        } finally {
            setSubmitting(false);
        }
    };

    const deleteSize = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this size? This may affect products using it.')) return;

        try {
            const { error } = await supabase
                .from('sizes')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Size deleted successfully!');
            fetchSizes();
        } catch (error) {
            console.error('Error deleting size:', error);
            toast.error('Failed to delete size');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading sizes...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Sizes</h1>
                    <p className="text-gray-600 mt-1">Manage size options for products</p>
                </div>
                <button
                    onClick={() => {
                        setEditingSize(null);
                        setFormData({ name: '', display_order: sizes.length });
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors shadow-sm font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add New Size
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sizes.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-lg border border-dashed border-gray-300">
                        <Ruler className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No sizes found</h3>
                        <p className="text-gray-500">Get started by adding a new size.</p>
                    </div>
                ) : (
                    sizes.map((size) => (
                        <div key={size.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group hover:border-gold-300 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gold-50 border border-gold-100 flex items-center justify-center text-gold-600 font-bold">
                                    {size.name}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{size.name}</p>
                                    <p className="text-xs text-gray-500 font-mono">Order: {size.display_order}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(size)}
                                    className="p-2 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => deleteSize(size.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Size Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-serif font-bold text-gray-900">
                                {editingSize ? 'Edit Size' : 'Add New Size'}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Size Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                    placeholder="e.g., S, M, L, XL, 32, 34"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    value={formData.display_order}
                                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                    placeholder="0"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Lower numbers appear first in the list.</p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
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
                                    {submitting ? 'Saving...' : (editingSize ? 'Update Size' : 'Add Size')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
