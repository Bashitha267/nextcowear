'use client';

import { useState, useEffect } from 'react';
import { Loader2, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

const SECTION_KEY = 'hero';

interface HeroAsset {
    id?: string;
    section_key: string;
    image_url: string;
    title: string;
    subtitle: string;
    description: string;
    is_active: boolean;
    display_order: number;
}

const DEFAULT_ASSET: HeroAsset = {
    section_key: SECTION_KEY,
    image_url: '',
    title: 'Island Elegance, Everyday Style',
    subtitle: 'Sri Lankan Heritage 2026',
    description: 'Discover the best cloths, meticulously tailed for comfort and sophistication. Experience the authentic touch of luxury.',
    is_active: true,
    display_order: 0,
};

export default function HeroImagePage() {
    const [asset, setAsset] = useState<HeroAsset>(DEFAULT_ASSET);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchHeroAsset();
    }, []);

    const fetchHeroAsset = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('site_assets')
                .select('*')
                .eq('section_key', SECTION_KEY)
                .order('display_order', { ascending: true })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
            if (data) setAsset(data as HeroAsset);
        } catch (error) {
            console.error('Error fetching hero asset:', error);
        } finally {
            setLoading(false);
        }
    };

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: 'POST', body: formData }
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Upload failed');
        return data.secure_url;
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setAsset(prev => ({ ...prev, image_url: url }));
            toast.success('Image uploaded! Click Save to apply.');
        } catch {
            toast.error('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!asset.image_url) {
            toast.error('Please upload an image first.');
            return;
        }
        setSaving(true);
        try {
            const { id, ...payload } = asset as any;
            if (id) {
                // Update existing record
                const { error } = await supabase
                    .from('site_assets')
                    .update({ ...payload })
                    .eq('id', id);
                if (error) throw error;
            } else {
                // Insert new record
                const { data, error } = await supabase
                    .from('site_assets')
                    .insert([{ ...payload }])
                    .select()
                    .single();
                if (error) throw error;
                if (data) setAsset(data as HeroAsset);
            }
            toast.success('Hero section saved!');
            fetchHeroAsset();
        } catch (error: any) {
            toast.error(error.message || 'Save failed.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Loading Hero Editor...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white px-8 py-6 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-serif font-black text-gray-900">Hero Section</h1>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                    Main homepage hero image & text
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Image Upload */}
                <div className="p-6 border-b border-gray-50">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-3">
                        Hero Image
                    </label>

                    {asset.image_url ? (
                        <div className="relative aspect-[16/7] rounded-xl overflow-hidden group border border-gray-100">
                            <img
                                src={asset.image_url}
                                alt="Hero Preview"
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay: change image */}
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <span className="bg-white/90 text-gray-900 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-xl hover:bg-gold-500 hover:text-white transition-all">
                                    {uploading ? 'Uploading...' : 'Change Image'}
                                </span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                            </label>
                            {uploading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <Loader2 className="w-10 h-10 text-gold-400 animate-spin" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center aspect-[16/7] border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gold-400 hover:bg-gold-50/50 transition-all group">
                            {uploading ? (
                                <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-3" />
                            ) : (
                                <Upload className="w-12 h-12 text-gray-300 mb-3 group-hover:text-gold-400 transition-colors" />
                            )}
                            <p className="text-sm font-bold text-gray-400 group-hover:text-gold-600 transition-colors">
                                {uploading ? 'Uploading...' : 'Click to upload hero image'}
                            </p>
                            <p className="text-xs text-gray-300 mt-1">Recommended: 1920×1080 (JPG, PNG, WebP)</p>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                        </label>
                    )}
                </div>

                {/* Text Fields */}
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                                Main Title <span className="text-gray-300">(use comma to split into two lines)</span>
                            </label>
                            <input
                                type="text"
                                value={asset.title}
                                onChange={e => setAsset(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full text-sm font-bold bg-gray-50 px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-gold-500/30 border border-transparent focus:border-gold-100 transition-all font-serif"
                                placeholder="Island Elegance, Everyday Style"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                                Top Label / Subtitle
                            </label>
                            <input
                                type="text"
                                value={asset.subtitle}
                                onChange={e => setAsset(prev => ({ ...prev, subtitle: e.target.value }))}
                                className="w-full text-sm font-bold bg-gray-50 px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-gold-500/30 border border-transparent focus:border-gold-100 transition-all"
                                placeholder="Sri Lankan Heritage 2026"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                            Description / Body Text
                        </label>
                        <textarea
                            value={asset.description}
                            onChange={e => setAsset(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full text-sm font-medium bg-gray-50 px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-gold-500/30 border border-transparent focus:border-gold-100 transition-all"
                            placeholder="Discover the best cloths, meticulously crafted..."
                        />
                    </div>
                </div>

                {/* Footer: Save */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${asset.id ? 'bg-green-400' : 'bg-orange-400'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            {asset.id ? 'Record exists in Supabase' : 'No record yet — will create on save'}
                        </span>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving || uploading || !asset.image_url}
                        className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest bg-gray-900 text-white px-8 py-2.5 rounded-lg hover:bg-black transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
                    >
                        {saving ? (
                            <Loader2 size={13} className="animate-spin" />
                        ) : (
                            <Check size={13} />
                        )}
                        {saving ? 'Saving...' : 'Save Hero Section'}
                    </button>
                </div>
            </div>

            {/* Preview hint */}
            <div className="text-center">
                <a
                    href="/"
                    target="_blank"
                    className="text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-gold-500 transition-colors"
                >
                    Preview on homepage →
                </a>
            </div>
        </div>
    );
}
