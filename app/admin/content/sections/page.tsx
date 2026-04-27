'use client';

import { useState, useEffect, Suspense } from 'react';
import { Trash2, Loader2, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { SiteAsset } from '@/lib/api';
import { useSearchParams, useRouter } from 'next/navigation';

const VALID_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dnfbik3if';
const isBrokenUrl = (url?: string) =>
    !!url &&
    url.includes('res.cloudinary.com') &&
    !url.includes(VALID_CLOUD);


const PAGE_GROUPS = [
    {
        id: 'home',
        name: 'Home Page',
        sections: [
            { id: 'hero', name: "Main Hero Section" },
            { id: 'women_collection', name: "Women's Collection Card" },
            { id: 'men_collection', name: "Men's Collection Card" },
            { id: 'kids_collection', name: "Kids' Collection Card" },
            { id: 'why_us', name: "Why Premium Fabric Section" },
        ]
    },
    {
        id: 'collections',
        name: 'Collections Page',
        sections: [
            { id: 'collections_hero', name: 'Collections: Hero (Desktop)' },
            { id: 'collections_hero_mobile', name: 'Collections: Hero (Mobile)' },
        ]
    },
    {
        id: 'why_us',
        name: 'Why Choose Us Page',
        sections: [
            { id: 'why_us_hero', name: 'Why Us: Hero Section' },
            { id: 'why_us_philosophy', name: 'Why Us: Philosophy' },
            { id: 'why_us_fabrics', name: 'Why Us: Fabric Edit' },
            { id: 'why_us_craftsmanship', name: 'Why Us: Craftsmanship' },
            { id: 'why_us_quote_bg', name: 'Why Us: Quote Background' }
        ]
    },
    {
        id: 'heritage',
        name: 'Our Heritage Page',
        sections: [
            { id: 'heritage_hero', name: 'Heritage: Hero Section' },
            { id: 'heritage_chapter_1', name: 'Heritage: Chapter 1' },
            { id: 'heritage_craft', name: 'Heritage: Craft Section' },
            { id: 'about_us_backup', name: 'About Us Section (Backup)' }
        ]
    }
];

function SectionAssetsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const filter = searchParams.get('filter') || 'home';

    const [assets, setAssets] = useState<SiteAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAssets();
    }, [filter]);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const group = PAGE_GROUPS.find(g => g.id === filter);
            if (!group) return;

            const { data, error } = await supabase
                .from('site_assets')
                .select('*')
                .in('section_key', group.sections.map(s => s.id))
                .order('display_order', { ascending: true });

            if (error) throw error;
            setAssets(data || []);
        } catch (error) {
            console.error('Error fetching site assets:', error);
            toast.error('Failed to load assets');
        } finally {
            setLoading(false);
        }
    };

    const currentGroup = PAGE_GROUPS.find(g => g.id === filter);

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

    const handleSave = async (assetData: Partial<SiteAsset>, sectionKey: string, id?: string) => {
        setSubmitting(true);
        try {
            // Clean the data: remove internal fields that shouldn't be in the update/insert payload
            const { id: _id, created_at, ...updateData } = assetData as any;

            if (id) {
                const { error } = await supabase
                    .from('site_assets')
                    .update(updateData)
                    .eq('id', id);
                if (error) throw error;
                toast.success('Updated!');
            } else {
                const { error } = await supabase
                    .from('site_assets')
                    .insert([{ ...updateData, section_key: sectionKey }]);
                if (error) throw error;
                toast.success('Saved!');
            }
            fetchAssets();
        } catch (error: any) {
            toast.error(error.message || 'Error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this asset? You can re-upload a fresh image after.')) return;
        setSubmitting(true);
        try {
            const { error } = await supabase.from('site_assets').delete().eq('id', id);
            if (error) throw error;
            toast.success('Deleted — you can now upload a fresh image.');
            fetchAssets();
        } catch (error: any) {
            toast.error(error.message || 'Delete failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white px-8 py-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-serif font-black text-gray-900">Page Designer</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Direct Content Editor</p>
                </div>
                <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    {PAGE_GROUPS.map(group => (
                        <button
                            key={group.id}
                            onClick={() => router.push(`/admin/content/sections?filter=${group.id}`)}
                            className={`px-6 py-2 rounded-lg text-xs font-black tracking-widest uppercase transition-all ${filter === group.id ? 'bg-white text-gold-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {group.name.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                    <Loader2 className="w-8 h-8 text-gold-500 animate-spin mb-4" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Loading Layout...</p>
                </div>
            ) : (
                <div className="space-y-12 pb-24">
                    {currentGroup?.sections.map(sectionConfig => {
                        const sectionAssets = assets.filter(a => a.section_key === sectionConfig.id);
                        return (
                            <div key={sectionConfig.id} className="space-y-4">
                                <div className="flex items-center gap-4 px-2">
                                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">{sectionConfig.name}</h2>
                                    <div className="flex-1 h-px bg-gray-100"></div>
                                </div>

                                <div className={sectionAssets.length > 1 || sectionConfig.id.includes('fabrics') || sectionConfig.id.includes('craft') ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
                                    {/* Show existing assets */}
                                    {sectionAssets.map(asset => (
                                        <AssetRowEditor
                                            key={asset.id}
                                            asset={asset}
                                            sectionKey={sectionConfig.id}
                                            onSave={(data) => handleSave(data, sectionConfig.id, asset.id)}
                                            onDelete={() => handleDelete(asset.id)}
                                            isUploading={submitting}
                                            uploadFn={uploadToCloudinary}
                                        />
                                    ))}

                                    {/* Show one empty slot only if the section is completely empty */}
                                    {sectionAssets.length === 0 && (
                                        <AssetRowEditor
                                            sectionKey={sectionConfig.id}
                                            onSave={(data) => handleSave(data, sectionConfig.id)}
                                            isUploading={submitting}
                                            uploadFn={uploadToCloudinary}
                                            isAddMore
                                        />
                                    )}

                                    {/* Fill with empty slots up to 3 for specific sections */}
                                    {(sectionConfig.id.includes('fabrics') || sectionConfig.id.includes('craft')) && sectionAssets.length < 3 &&
                                        Array.from({ length: 3 - sectionAssets.length }).map((_, idx) => (
                                            <AssetRowEditor
                                                key={`empty-${idx}`}
                                                sectionKey={sectionConfig.id}
                                                onSave={(data) => handleSave(data, sectionConfig.id)}
                                                isUploading={submitting}
                                                uploadFn={uploadToCloudinary}
                                                isAddMore
                                            />
                                        ))
                                    }

                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

interface AssetRowEditorProps {
    asset?: SiteAsset;
    sectionKey: string;
    onSave: (data: Partial<SiteAsset>) => void;
    onDelete?: () => void;
    isUploading: boolean;
    uploadFn: (file: File) => Promise<string>;
    isAddMore?: boolean;
}

function AssetRowEditor({ asset, sectionKey, onSave, onDelete, isUploading, uploadFn, isAddMore }: AssetRowEditorProps) {
    const [localAsset, setLocalAsset] = useState<Partial<SiteAsset>>(asset || {
        title: '',
        subtitle: '',
        description: '',
        image_url: '',
        display_order: 0,
        is_active: true
    });
    const [localUploading, setLocalUploading] = useState(false);

    // Determine if the local preview URL is safe to show
    const previewUrl = localAsset.image_url &&
        !localAsset.image_url.includes('IMAGE_LINK_HERE') &&
        !isBrokenUrl(localAsset.image_url)
        ? localAsset.image_url
        : null;

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLocalUploading(true);
        try {
            const url = await uploadFn(file);
            const updatedAsset = { ...localAsset, image_url: url };
            setLocalAsset(updatedAsset);
            // Auto-save to Supabase if updating an existing record
            if (asset?.id) {
                onSave(updatedAsset);
            }
            toast.success(asset?.id ? 'Image Uploaded & Saved' : 'Image Uploaded');
        } catch (e) {
            toast.error('Failed to upload image');
        } finally {
            setLocalUploading(false);
        }
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:border-gold-200 group ${isAddMore ? 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0' : ''}`}>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 shrink-0">
                    <div className="relative aspect-video md:aspect-[4/3] rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                <ImageIcon size={24} className="text-gray-200" />
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest bg-gray-900/50 px-3 py-2 rounded-full backdrop-blur-sm shadow-xl border border-white/20 hover:scale-105 active:scale-95 transition-all">
                                {localUploading ? 'Uploading...' : 'Set Image'}
                            </span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
                        </label>
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Main Heading</label>
                            <input
                                type="text"
                                value={localAsset.title || ''}
                                onChange={e => setLocalAsset({ ...localAsset, title: e.target.value })}
                                className="w-full text-xs font-bold bg-gray-50 px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-gold-500/50 border border-transparent focus:border-gold-100 transition-all font-serif"
                                placeholder="..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Small Label</label>
                            <input
                                type="text"
                                value={localAsset.subtitle || ''}
                                onChange={e => setLocalAsset({ ...localAsset, subtitle: e.target.value })}
                                className="w-full text-xs font-bold bg-gray-50 px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-gold-500/50 border border-transparent focus:border-gold-100 transition-all"
                                placeholder="..."
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Content Description</label>
                        <textarea
                            value={localAsset.description || ''}
                            onChange={e => setLocalAsset({ ...localAsset, description: e.target.value })}
                            className="w-full text-xs font-medium bg-gray-50 px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-gold-500/50 border border-transparent focus:border-gold-100 transition-all min-h-[60px]"
                            placeholder="..."
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onSave({ ...localAsset, is_active: !localAsset.is_active })}
                                className={`p-2 rounded-lg transition-all ${localAsset.is_active ? 'text-gold-600 hover:bg-gold-50' : 'text-gray-300 hover:bg-gray-100'}`}
                            >
                                {localAsset.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                {localAsset.is_active ? 'Live' : 'Hidden'}
                            </span>
                        </div>
                        <button
                            onClick={() => onSave(localAsset)}
                            disabled={isUploading || localUploading || !previewUrl}
                            className="text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-black transition-all hover:scale-105 active:scale-95 disabled:opacity-30 flex items-center gap-2"
                        >
                            {isUploading && <Loader2 size={12} className="animate-spin" />}
                            {asset ? 'Update' : (isAddMore ? 'Create' : 'Save')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SectionAssetsPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Loading Editor Environment...</p>
            </div>
        }>
            <SectionAssetsContent />
        </Suspense>
    );
}
