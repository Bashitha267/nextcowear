'use client';

import { useState, useEffect } from 'react';
import {
    Star,
    Check,
    X,
    Trash2,
    MessageSquare,
    ShoppingBag,
    Copy,
    ExternalLink,
    Loader2,
    Filter,
    ThumbsUp,
    User,
    CheckCircle2,
    Search
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface ReviewBase {
    id: string;
    author_name: string;
    rating: number;
    title: string;
    content: string;
    is_approved: boolean;
    created_at: string;
}

interface SiteReview extends ReviewBase {
    is_featured: boolean;
}

interface ProductReview extends ReviewBase {
    product_id: string;
    product_name?: string;
    verified_purchase: boolean;
    helpful_count: number;
}

export default function ReviewsPage() {
    const [siteReviews, setSiteReviews] = useState<SiteReview[]>([]);
    const [productReviews, setProductReviews] = useState<ProductReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'site' | 'product'>('pending');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAllReviews();
    }, []);

    const fetchAllReviews = async () => {
        setLoading(true);
        try {
            const [siteRes, prodRes] = await Promise.all([
                supabase.from('site_reviews').select('*').order('created_at', { ascending: false }),
                supabase.from('product_reviews').select('*, products(name)').order('created_at', { ascending: false })
            ]);

            if (siteRes.error) throw siteRes.error;
            if (prodRes.error) throw prodRes.error;

            setSiteReviews(siteRes.data || []);

            // Map product name from foreign key
            const formattedProducts = (prodRes.data || []).map(r => ({
                ...r,
                product_name: r.products?.name || 'Unknown Product'
            }));
            setProductReviews(formattedProducts);

        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (type: 'site' | 'product', id: string) => {
        try {
            const table = type === 'site' ? 'site_reviews' : 'product_reviews';
            const { error } = await supabase.from(table).update({ is_approved: true }).eq('id', id);
            if (error) throw error;

            toast.success('Review approved!');
            fetchAllReviews();
        } catch (error) {
            toast.error('Approval failed');
        }
    };

    const handleToggleFeature = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('site_reviews')
                .update({ is_featured: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            toast.success(currentStatus ? 'Removed from featured' : 'Added to featured!');
            fetchAllReviews();
        } catch (error) {
            toast.error('Failed to update featured status');
        }
    };

    const handleDelete = async (type: 'site' | 'product', id: string) => {
        if (!window.confirm('Are you sure you want to delete this review Permanently?')) return;
        try {
            const table = type === 'site' ? 'site_reviews' : 'product_reviews';
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;

            toast.success('Review deleted');
            fetchAllReviews();
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    const copyReviewLink = () => {
        const url = `${window.location.origin}/submit-review`;
        navigator.clipboard.writeText(url);
        toast.success('Review submission link copied to clipboard!');
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= rating ? 'text-gold-500 fill-gold-500' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    const filteredReviews = () => {
        let list: (SiteReview | ProductReview)[] = [];
        let type: 'site' | 'product' | 'all' = 'all';

        if (activeTab === 'pending') {
            const pendingSite = siteReviews.filter(r => !r.is_approved).map(r => ({ ...r, type: 'site' }));
            const pendingProduct = productReviews.filter(r => !r.is_approved).map(r => ({ ...r, type: 'product' }));
            list = [...pendingSite, ...pendingProduct];
        } else if (activeTab === 'site') {
            list = siteReviews.map(r => ({ ...r, type: 'site' }));
        } else {
            list = productReviews.map(r => ({ ...r, type: 'product' }));
        }

        return list.filter(r =>
            r.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.title.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading moderation queue...</p>
            </div>
        );
    }

    const reviewsToDisplay = filteredReviews();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Review Moderation</h1>
                    <p className="text-gray-600 mt-1">Manage and approve customer feedback across the platform.</p>
                </div>
                <button
                    onClick={copyReviewLink}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gold-500 text-gold-600 hover:bg-gold-50 rounded-lg transition-all shadow-sm font-bold"
                >
                    <Copy className="w-5 h-5" />
                    Copy Submission Link
                </button>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-full md:w-auto">
                    {[
                        { id: 'pending', label: 'Pending Approval', icon: Filter },
                        { id: 'site', label: 'Site Reviews', icon: MessageSquare },
                        { id: 'product', label: 'Product Reviews', icon: ShoppingBag }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-white text-gold-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {tab.id === 'pending' && reviewsToDisplay.length > 0 && activeTab === 'pending' && (
                                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                                    {reviewsToDisplay.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by author or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-sm"
                    />
                </div>
            </div>

            {/* Review List */}
            <div className="grid grid-cols-1 gap-4">
                {reviewsToDisplay.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <CheckCircle2 className="w-16 h-16 text-green-200 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900">All caught up!</h3>
                        <p className="text-gray-500 mt-1">No reviews currently waiting for your attention.</p>
                    </div>
                ) : (
                    reviewsToDisplay.map((review: any) => (
                        <div key={review.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-gold-200 transition-all flex flex-col md:flex-row gap-6">
                            {/* Author & Info */}
                            <div className="md:w-64 shrink-0 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-600 font-bold uppercase">
                                        {review.author_name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-gray-900 truncate">{review.author_name}</p>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        {renderStars(review.rating)}
                                        <span className="text-xs font-bold text-gray-700">{review.rating}.0</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {review.type === 'product' ? (
                                            <span className="flex items-center gap-1 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                                <ShoppingBag className="w-3 h-3" />
                                                Product Review
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                                <MessageSquare className="w-3 h-3" />
                                                Site Review
                                            </span>
                                        )}
                                        {review.verified_purchase && (
                                            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                                Verified Purchase
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-2">
                                {review.type === 'product' && (
                                    <p className="text-xs font-bold text-gold-600 uppercase mb-1">
                                        Reviewing: <span className="underline">{review.product_name}</span>
                                    </p>
                                )}
                                <h4 className="font-bold text-gray-900 text-lg leading-snug">
                                    {review.title || "No Title Provided"}
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed italic">
                                    "{review.content}"
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="md:w-48 shrink-0 flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                {!review.is_approved && (
                                    <button
                                        onClick={() => handleApprove(review.type, review.id)}
                                        className="flex-1 md:w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
                                    >
                                        <Check className="w-4 h-4" />
                                        Approve
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(review.type, review.id)}
                                    className="flex-1 md:w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-xl text-sm font-bold transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {review.is_approved ? 'Delete' : 'Reject'}
                                </button>
                                {review.is_approved && (
                                    <div className="hidden md:flex flex-col gap-1 w-full">
                                        <div className="flex items-center justify-center gap-1 text-green-600 bg-green-50 py-1.5 rounded-lg">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase">Approved</span>
                                        </div>
                                        {review.type === 'site' && (
                                            <button
                                                onClick={() => handleToggleFeature(review.id, review.is_featured)}
                                                className={`flex items-center justify-center gap-2 py-1.5 rounded-lg border-2 transition-all ${review.is_featured ? 'bg-gold-500 border-gold-500 text-white' : 'border-gold-500 text-gold-600 hover:bg-gold-50'}`}
                                            >
                                                <Star className={`w-3 h-3 ${review.is_featured ? 'fill-white' : ''}`} />
                                                <span className="text-[10px] font-bold uppercase">{review.is_featured ? 'Featured' : 'Feature'}</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
