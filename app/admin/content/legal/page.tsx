'use client';

import { useState, useEffect } from 'react';
import { SettingsService } from '@/lib/settings';
import { Save, Loader2, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LegalPage() {
    const [selectedTab, setSelectedTab] = useState<'refund' | 'shipping' | 'terms'>('refund');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchContent();
    }, [selectedTab]);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const data = await SettingsService.getLegalDocument(selectedTab);
            setContent(data || '');
        } catch (error) {
            console.error('Error fetching content:', error);
            // toast.error('Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await SettingsService.setLegalDocument(selectedTab, content);
            toast.success(`${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Policy saved!`);
        } catch (error) {
            console.error('Error saving content:', error);
            toast.error('Failed to save content');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'refund', label: 'Refund Policy' },
        { id: 'shipping', label: 'Shipping Policy' },
        { id: 'terms', label: 'Terms & Privacy' },
    ];

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Legal Documents</h1>
                    <p className="text-gray-600 mt-1">Manage your store's legal policies and terms</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-bold uppercase text-xs tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-100 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id as any)}
                            className={`px-6 py-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${selectedTab === tab.id
                                ? 'text-gold-600 border-gold-500 bg-gold-50/30'
                                : 'text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Editor Area */}
                <div className="p-6 md:p-8 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <FileText size={14} />
                            Currently Editing: <span className="text-gray-900">{tabs.find(t => t.id === selectedTab)?.label}</span>
                        </label>
                        {loading && <Loader2 className="w-4 h-4 text-gold-500 animate-spin" />}
                    </div>

                    {loading ? (
                        <div className="h-96 bg-gray-50 rounded-lg animate-pulse"></div>
                    ) : (
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-[500px] p-6 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-mono text-sm leading-relaxed text-gray-700 resize-none"
                            placeholder={`Enter your ${tabs.find(t => t.id === selectedTab)?.label} content here... (Supports Markdown/HTML)`}
                        />
                    )}

                    <div className="flex items-center gap-2 text-xs text-gray-400 italic bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-600">
                        <CheckCircle size={14} />
                        Content supports basic HTML formatting for lists, bold text, etc.
                    </div>
                </div>
            </div>
        </div>
    );
}
