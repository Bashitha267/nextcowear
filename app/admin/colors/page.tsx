'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Palette, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface Color {
    id: string;
    name: string;
    hex_value: string;
}

export default function ColorsPage() {
    const [colors, setColors] = useState<Color[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        hex_value: '#000000'
    });

    useEffect(() => {
        fetchColors();
    }, []);

    const fetchColors = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('colors')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setColors(data || []);
        } catch (error) {
            console.error('Error fetching colors:', error);
            toast.error('Failed to load colors');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('colors')
                .insert([formData]);

            if (error) throw error;

            toast.success('Color added successfully!');
            fetchColors();
            setFormData({ name: '', hex_value: '#000000' });
            setShowForm(false);
        } catch (error: any) {
            console.error('Error adding color:', error);
            toast.error(error.message || 'Failed to add color');
        } finally {
            setSubmitting(false);
        }
    };

    const deleteColor = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this color?')) return;

        try {
            const { error } = await supabase
                .from('colors')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Color deleted successfully!');
            fetchColors();
        } catch (error) {
            console.error('Error deleting color:', error);
            toast.error('Failed to delete color');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading colors...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Colors</h1>
                    <p className="text-gray-600 mt-1">Manage color options for products</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors shadow-sm font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add New Color
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {colors.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-lg border border-dashed border-gray-300">
                        <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No colors found</h3>
                        <p className="text-gray-500">Get started by adding a new color.</p>
                    </div>
                ) : (
                    colors.map((color) => (
                        <div key={color.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full border border-gray-200 shadow-inner"
                                    style={{ backgroundColor: color.hex_value }}
                                />
                                <div>
                                    <p className="font-semibold text-gray-900">{color.name}</p>
                                    <p className="text-xs text-gray-500 uppercase">{color.hex_value}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteColor(color.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add Color Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-serif font-bold text-gray-900">Add New Color</h2>
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
                                    Color Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                    placeholder="e.g., Royal Blue, Matte Black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Hex Value *
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={formData.hex_value}
                                        onChange={(e) => setFormData({ ...formData, hex_value: e.target.value })}
                                        className="h-10 w-20 border border-gray-300 rounded-lg cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        required
                                        value={formData.hex_value}
                                        onChange={(e) => setFormData({ ...formData, hex_value: e.target.value })}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none uppercase font-mono"
                                        placeholder="#000000"
                                    />
                                </div>
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
                                    {submitting ? 'Adding...' : 'Add Color'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
