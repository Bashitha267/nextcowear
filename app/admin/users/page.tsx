'use client';

import { useState, useEffect } from 'react';
import { Search, Trash2, User, Shield, Loader2, Mail, Phone, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface Customer {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    is_active: boolean;
    created_at: string;
}

interface AdminUser {
    id: string;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

export default function UsersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'customers' | 'admins'>('customers');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const [customersRes, adminsRes] = await Promise.all([
                supabase.from('users').select('*').order('created_at', { ascending: false }),
                supabase.from('admin_users').select('*').order('created_at', { ascending: false })
            ]);

            if (customersRes.error) throw customersRes.error;
            if (adminsRes.error) throw adminsRes.error;

            setCustomers(customersRes.data || []);
            setAdmins(adminsRes.data || []);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: string, type: 'customers' | 'admins') => {
        if (!window.confirm(`Are you sure you want to delete this ${type === 'customers' ? 'user' : 'admin'}? This action cannot be undone.`)) {
            return;
        }

        try {
            const table = type === 'customers' ? 'users' : 'admin_users';
            const { error } = await supabase.from(table).delete().eq('id', id);

            if (error) throw error;

            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error: any) {
            console.error('Error deleting user:', error);
            toast.error(error.message || 'Failed to delete user');
        }
    };

    const filteredCustomers = customers.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (`${u.first_name} ${u.last_name}`).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAdmins = admins.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading user data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">Manage customers and administrative staff</p>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('customers')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-widest uppercase transition-all ${activeTab === 'customers'
                            ? 'bg-white text-gold-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Customers ({customers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('admins')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-widest uppercase transition-all ${activeTab === 'admins'
                            ? 'bg-white text-gold-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Admins ({admins.length})
                    </button>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">User</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Info</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined Date</th>
                                {activeTab === 'admins' && <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>}
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {(activeTab === 'customers' ? filteredCustomers : filteredAdmins).map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeTab === 'admins' ? 'bg-purple-50 text-purple-600' : 'bg-gold-50 text-gold-600'}`}>
                                                {activeTab === 'admins' ? <Shield size={20} /> : <User size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">
                                                    {activeTab === 'admins'
                                                        ? (user as AdminUser).full_name
                                                        : `${(user as Customer).first_name || ''} ${(user as Customer).last_name || ''}`.trim() || 'No Name'}
                                                </p>
                                                <p className="text-xs text-gray-500 font-mono">{user.id.substring(0, 8)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail size={14} className="text-gray-400" />
                                                <span>{user.email}</span>
                                            </div>
                                            {activeTab === 'customers' && (user as Customer).phone_number && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone size={14} className="text-gray-400" />
                                                    <span>{(user as Customer).phone_number}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span>{new Date(user.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    {activeTab === 'admins' && (
                                        <td className="px-6 py-5">
                                            <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider">
                                                {(user as AdminUser).role}
                                            </span>
                                        </td>
                                    )}
                                    <td className="px-6 py-5">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => handleDeleteUser(user.id, activeTab)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {(activeTab === 'customers' ? filteredCustomers : filteredAdmins).length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No {activeTab} found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            {searchTerm ? `No results for "${searchTerm}"` : `There are currently no ${activeTab} in the database.`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
