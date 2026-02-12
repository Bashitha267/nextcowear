'use client';

import { useState, useEffect } from 'react';
import {
    UserPlus,
    Settings,
    Shield,
    Mail,
    User,
    Lock,
    Loader2,
    Trash2,
    CheckCircle2,
    XCircle,
    UserCheck,
    AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { hashPassword } from '@/lib/crypto';

interface AdminUser {
    id: string;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

export default function AdminSettingsPage() {
    const { user: currentAdmin } = useAuth();
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // New Admin Form
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        role: 'staff'
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const { data, error } = await supabase
                .from('admin_users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAdmins(data || []);
        } catch (error: any) {
            console.error('Error:', error);
            toast.error('Failed to load administrators');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Hash the password
            const hashedPassword = await hashPassword(formData.password);

            const { error } = await supabase
                .from('admin_users')
                .insert([{
                    email: formData.email,
                    password_hash: hashedPassword,
                    full_name: formData.full_name,
                    role: formData.role,
                    can_manage_products: true,
                    can_manage_orders: true,
                    can_manage_users: true,
                    can_manage_content: true,
                    can_view_analytics: true,
                    is_active: true
                }]);

            if (error) {
                if (error.code === '23505') throw new Error('Email already registered');
                throw error;
            }

            toast.success('Admin added successfully');
            setShowAddModal(false);
            setFormData({ email: '', password: '', full_name: '', role: 'staff' });
            fetchAdmins();
        } catch (error: any) {
            toast.error(error.message || 'Failed to add admin');
        } finally {
            setSubmitting(false);
        }
    };

    const toggleAdminStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('admin_users')
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            toast.success('Status updated');
            fetchAdmins();
        } catch (error: any) {
            toast.error('Failed to update status');
        }
    };

    const deleteAdmin = async (id: string) => {
        if (id === currentAdmin?.id) {
            toast.error("You cannot delete yourself");
            return;
        }

        if (!confirm('Are you sure you want to remove this administrator?')) return;

        try {
            const { error } = await supabase
                .from('admin_users')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Admin removed');
            fetchAdmins();
        } catch (error: any) {
            toast.error('Failed to remove admin');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <Settings size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">System Settings</h1>
                        <p className="text-gray-500 mt-1 font-medium">Manage administrators and platform preferences</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest transition-all shadow-xl shadow-gold-500/20 active:scale-95"
                >
                    <UserPlus size={18} />
                    Add New Admin
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Admin Management Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-gold-600" />
                                <h2 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Administrators</h2>
                            </div>
                            <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-gray-500 border border-gray-100 uppercase tracking-tighter">
                                {admins.length} Total
                            </span>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {admins.map((admin) => (
                                <div key={admin.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${admin.role === 'admin' ? 'bg-gray-900 text-gold-400' : 'bg-gold-50 text-gold-600'
                                            }`}>
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-gray-900">{admin.full_name}</h3>
                                                {admin.id === currentAdmin?.id && (
                                                    <span className="text-[10px] bg-gold-100 text-gold-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">You</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5 font-medium">
                                                <Mail size={12} className="text-gray-400" />
                                                {admin.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => toggleAdminStatus(admin.id, admin.is_active)}
                                            className={`p-2 rounded-xl transition-all ${admin.is_active
                                                    ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                }`}
                                            title={admin.is_active ? 'Deactivate' : 'Activate'}
                                        >
                                            {admin.is_active ? <UserCheck size={20} /> : <XCircle size={20} />}
                                        </button>
                                        <button
                                            onClick={() => deleteAdmin(admin.id)}
                                            className="p-2 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                                            title="Delete Account"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Cards Section */}
                <div className="space-y-6">
                    <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl group-hover:bg-gold-500/20 transition-all duration-700"></div>
                        <Shield className="w-12 h-12 text-gold-400 mb-6" />
                        <h3 className="text-xl font-serif font-bold mb-3 tracking-wide">Security Notice</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-medium">
                            Administrators have full access to manage products, orders, and customer data. Please ensure strong passwords are used and access is restricted to authorized personnel only.
                        </p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gold-50 rounded-2xl">
                                <AlertCircle className="w-6 h-6 text-gold-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm">System Logs</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl italic text-xs text-gray-400 font-medium">
                                System logs feature coming soon...
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Admin Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => !submitting && setShowAddModal(false)}
                    />
                    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 md:p-12 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-gold-50 rounded-2xl flex items-center justify-center text-gold-600">
                                <UserPlus size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Add Admin</h2>
                                <p className="text-gray-500 text-sm font-medium">Create a new staff account</p>
                            </div>
                        </div>

                        <form onSubmit={handleAddAdmin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter name"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        required
                                        type="email"
                                        placeholder="Enter email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Temporary Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        required
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-8 py-4 border border-gray-200 text-gray-500 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-8 py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-gold-600 transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting && <Loader2 size={16} className="animate-spin" />}
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
