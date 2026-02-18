'use client';

import { useState, useEffect } from 'react';
import { SettingsService } from '@/lib/settings';
import { Uploadcloud, Save, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function SizeChartsPage() {
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchSizeChart();
    }, []);

    const fetchSizeChart = async () => {
        setLoading(true);
        try {
            const data = await SettingsService.getSizeChart();
            setImageUrl(data.url || '');
            setDescription(data.description || '');
        } catch (error) {
            console.error('Error fetching size chart:', error);
            // toast.error('Failed to load size chart settings');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            const data = await res.json();

            if (data.secure_url) {
                setImageUrl(data.secure_url);
                toast.success('Image uploaded successfully!');
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await SettingsService.setSizeChart(imageUrl, description);
            toast.success('Size Chart settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveImage = () => {
        if (confirm('Are you sure you want to remove the current image?')) {
            setImageUrl('');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Size Chart Management</h1>
                    <p className="text-gray-600 mt-1">Update the global size chart reference image</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || uploading}
                    className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-bold uppercase text-xs tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Upload Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <ImageIcon size={16} className="text-gold-500" />
                        Chart Image
                    </h3>

                    <div className="relative aspect-3/4 bg-gray-50 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 group hover:border-gold-300 transition-colors flex items-center justify-center">
                        {imageUrl ? (
                            <>
                                <Image
                                    src={imageUrl}
                                    alt="Size Chart"
                                    fill
                                    className="object-contain p-4"
                                />
                                <button
                                    onClick={handleRemoveImage}
                                    className="absolute top-4 right-4 p-2 bg-white/90 text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                    title="Remove Image"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </>
                        ) : (
                            <div className="text-center p-6 space-y-2">
                                <Uploadcloud className="w-12 h-12 text-gray-300 mx-auto group-hover:text-gold-400 transition-colors" />
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    {uploading ? 'Uploading...' : 'Click to Upload'}
                                </p>
                            </div>
                        )}

                        {!imageUrl && !uploading && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        )}
                    </div>

                    <p className="text-[10px] text-gray-400 mt-4 italic text-center">
                        Supports JPG, PNG, WEBP. Max file size 5MB. Recommended: Potrait (3:4) aspect ratio.
                    </p>
                </div>

                {/* Description Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <FileText size={16} className="text-gold-500" />
                        Additional Instructions
                    </h3>

                    <div className="flex-1">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-full min-h-[300px] p-6 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-mono text-sm leading-relaxed text-gray-700 resize-none"
                            placeholder="Add any specific measuring instructions, fit tips, or disclaimer text here..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

import { FileText } from 'lucide-react';
