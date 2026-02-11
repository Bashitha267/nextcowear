'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Image as ImageIcon, X, Upload, Check, GripVertical, Settings2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface HeroImage {
    id: string;
    image_url: string;
    alt_text?: string;
    title?: string;
    subtitle?: string;
    cta_text?: string;
    cta_link?: string;
    display_order: number;
    is_active: boolean;
}

export default function HeroImagesPage() {
    const [images, setImages] = useState<HeroImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingImage, setEditingImage] = useState<HeroImage | null>(null);

    const [formData, setFormData] = useState({
        image_url: '',
        alt_text: '',
        title: '',
        subtitle: '',
        cta_text: '',
        cta_link: '',
        display_order: 0,
        is_active: true
    });

    useEffect(() => {
        fetchHeroImages();
    }, []);

    const fetchHeroImages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('hero_images')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setImages(data || []);
        } catch (error) {
            console.error('Error fetching hero images:', error);
            toast.error('Failed to load hero images');
        } finally {
            setLoading(false);
        }
    };

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: 'POST', body: data }
            );

            const resData = await response.json();
            if (!response.ok) throw new Error(resData.error?.message || 'Upload failed');
            return resData.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const imageUrl = await uploadToCloudinary(file);
            setFormData(prev => ({ ...prev, image_url: imageUrl, alt_text: file.name.split('.')[0] }));
            toast.success('Image uploaded successfully!');
        } catch (error) {
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (image: HeroImage) => {
        setEditingImage(image);
        setFormData({
            image_url: image.image_url,
            alt_text: image.alt_text || '',
            title: image.title || '',
            subtitle: image.subtitle || '',
            cta_text: image.cta_text || '',
            cta_link: image.cta_link || '',
            display_order: image.display_order,
            is_active: image.is_active
        });
        setShowForm(true);
    };

    const toggleActive = async (image: HeroImage) => {
        try {
            const { error } = await supabase
                .from('hero_images')
                .update({ is_active: !image.is_active })
                .eq('id', image.id);

            if (error) throw error;
            toast.success(`Slide ${image.is_active ? 'deactivated' : 'activated'}!`);
            fetchHeroImages();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image_url) {
            toast.error('Please upload an image first');
            return;
        }

        setSubmitting(true);
        try {
            if (editingImage) {
                const { error } = await supabase
                    .from('hero_images')
                    .update(formData)
                    .eq('id', editingImage.id);
                if (error) throw error;
                toast.success('Hero slide updated successfully!');
            } else {
                const { error } = await supabase
                    .from('hero_images')
                    .insert([formData]);
                if (error) throw error;
                toast.success('Hero slide added successfully!');
            }

            fetchHeroImages();
            setFormData({
                image_url: '',
                alt_text: '',
                title: '',
                subtitle: '',
                cta_text: '',
                cta_link: '',
                display_order: images.length,
                is_active: true
            });
            setEditingImage(null);
            setShowForm(false);
        } catch (error: any) {
            console.error('Error saving hero image:', error);
            toast.error(error.message || 'Failed to save slide');
        } finally {
            setSubmitting(false);
        }
    };

    const deleteImage = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this hero slide?')) return;

        try {
            const { error } = await supabase
                .from('hero_images')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Hero slide deleted successfully!');
            fetchHeroImages();
        } catch (error) {
            console.error('Error deleting hero image:', error);
            toast.error('Failed to delete slide');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading hero gallery...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Hero Slideshow</h1>
                    <p className="text-gray-600 mt-1">Manage the high-impact visual sliders for your store entrance.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingImage(null);
                        setFormData({
                            image_url: '',
                            alt_text: '',
                            title: '',
                            subtitle: '',
                            cta_text: '',
                            cta_link: '',
                            display_order: images.length,
                            is_active: true
                        });
                        setShowForm(true);
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors shadow-sm font-medium"
                >
                    <Plus className="w-5 h-5" />
                    New Slide
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.length === 0 ? (
                    <div className="col-span-full py-24 text-center bg-white rounded-xl border-2 border-dashed border-gray-200">
                        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900">Your gallery is empty</h3>
                        <p className="text-gray-500 mt-2">Add stunning hero images to wow your visitors.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-6 text-gold-600 font-semibold hover:text-gold-700 underline flex items-center gap-2 mx-auto"
                        >
                            <Plus className="w-4 h-4" />
                            Add your first slide
                        </button>
                    </div>
                ) : (
                    images.map((image) => (
                        <div key={image.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden group hover:shadow-md transition-all ${!image.is_active ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                                <img
                                    src={image.image_url}
                                    alt={image.alt_text}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => handleEdit(image)}
                                        className="p-2.5 bg-white text-gray-800 rounded-full hover:bg-gold-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
                                    >
                                        <Settings2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => toggleActive(image)}
                                        className={`p-2.5 bg-white rounded-full transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 ${image.is_active ? 'text-gray-800 hover:bg-gray-800 hover:text-white' : 'text-gold-500 hover:bg-gold-500 hover:text-white'}`}
                                    >
                                        {image.is_active ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => deleteImage(image.id)}
                                        className="p-2.5 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-150"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className={`px-2 py-1 text-[10px] font-bold rounded shadow-sm ${image.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                        {image.is_active ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                    <span className="px-2 py-1 bg-black/60 text-white text-[10px] font-bold rounded shadow-sm">
                                        ORDER: {image.display_order}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 truncate">{image.title || 'Untitled Slide'}</h3>
                                <p className="text-sm text-gray-500 line-clamp-1 mt-1">{image.subtitle || 'No subtitle'}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Slide Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
                        <div className="bg-gold-500 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-serif font-bold text-white">
                                {editingImage ? 'Modify Hero Slide' : 'Design New Hero Slide'}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                            {/* Image Upload Area */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Slide Visual *</label>
                                {formData.image_url ? (
                                    <div className="relative aspect-[21/9] rounded-xl overflow-hidden border-2 border-gray-100 shadow-inner group">
                                        <img src={formData.image_url} alt="Hero preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gold-500 hover:text-white transition-colors">
                                                Change Image
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                            </label>
                                        </div>
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center aspect-[21/9] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gold-500 hover:bg-gold-50 transition-all">
                                        <div className="flex flex-col items-center">
                                            {uploading ? (
                                                <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
                                            ) : (
                                                <Upload className="w-10 h-10 text-gray-400" />
                                            )}
                                            <p className="mt-3 text-sm font-medium text-gray-600">
                                                {uploading ? 'Processing Visual...' : 'Click to upload hero image'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">Recommended: 1920x1080px (PNG, JPG)</p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                    </label>
                                )}
                            </div>

                            {/* Content Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Main Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                                        placeholder="Epic Collection 2024"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Subtitle / Caption</label>
                                    <input
                                        type="text"
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                                        placeholder="Experience Premium Cotton"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Button Text</label>
                                    <input
                                        type="text"
                                        value={formData.cta_text}
                                        onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                                        placeholder="Shop Now"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Link (URL)</label>
                                    <input
                                        type="text"
                                        value={formData.cta_link}
                                        onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                                        placeholder="/collections/new-arrivals"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Display Order</label>
                                    <input
                                        type="number"
                                        value={formData.display_order}
                                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                                    />
                                </div>
                                <div className="flex items-end pb-1.5">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                className="sr-only"
                                            />
                                            <div className={`w-12 h-6 rounded-full transition-colors ${formData.is_active ? 'bg-gold-500' : 'bg-gray-200'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">Slide is Visible</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || uploading}
                                    className="flex-[2] px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-xl transition-all font-bold shadow-lg shadow-gold-200 flex items-center justify-center gap-2 disabled:bg-gold-300 disabled:shadow-none"
                                >
                                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {submitting ? 'Saving Slide...' : (editingImage ? 'Update Gallery Slide' : 'Publish to Gallery')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
