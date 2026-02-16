"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Check, X, MoveUp, MoveDown } from "lucide-react";
import { toast } from "react-hot-toast";
import { getFAQs, getAllFAQs, createFAQ, updateFAQ, deleteFAQ, FAQ } from "@/lib/api";

export default function FAQsPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        display_order: 0,
        is_active: true
    });

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        setIsLoading(true);
        try {
            const data = await getAllFAQs();
            setFaqs(data);
        } catch (error) {
            toast.error("Failed to fetch FAQs");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateFAQ(editingId, formData);
                toast.success("FAQ updated successfully");
            } else {
                await createFAQ(formData);
                toast.success("FAQ created successfully");
            }
            setIsModalOpen(false);
            fetchFAQs();
            resetForm();
        } catch (error) {
            toast.error("Failed to save FAQ");
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this FAQ?")) return;
        try {
            await deleteFAQ(id);
            toast.success("FAQ deleted successfully");
            fetchFAQs();
        } catch (error) {
            toast.error("Failed to delete FAQ");
            console.error(error);
        }
    };

    const handleEdit = (faq: FAQ) => {
        setEditingId(faq.id);
        setFormData({
            question: faq.question,
            answer: faq.answer,
            display_order: faq.display_order,
            is_active: faq.is_active
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            question: "",
            answer: "",
            display_order: faqs.length + 1,
            is_active: true
        });
    };

    const openCreateModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const toggleStatus = async (faq: FAQ) => {
        try {
            await updateFAQ(faq.id, { is_active: !faq.is_active });
            toast.success(`FAQ ${!faq.is_active ? 'activated' : 'deactivated'}`);
            fetchFAQs();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">FAQs</h1>
                    <p className="text-gray-600 mt-1">Manage frequently asked questions</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    Add FAQ
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : faqs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No FAQs found. Create one to get started.</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Question</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Answer</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {faqs.map((faq) => (
                                <tr key={faq.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {faq.display_order}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                                        {faq.question}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate">
                                        {faq.answer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => toggleStatus(faq)}
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${faq.is_active
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                }`}
                                        >
                                            {faq.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(faq)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(faq.id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingId ? 'Edit FAQ' : 'Create New FAQ'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Question
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-gold-500 focus:border-gold-500"
                                    placeholder="e.g., What is your return policy?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Answer
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-gold-500 focus:border-gold-500"
                                    placeholder="Enter the answer..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.display_order}
                                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-gold-500 focus:border-gold-500"
                                    />
                                </div>
                                <div className="flex items-center h-full pt-6">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="w-4 h-4 text-gold-600 border-gray-300 rounded focus:ring-gold-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Active</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-gold-500 rounded-lg hover:bg-gold-600"
                                >
                                    {editingId ? 'Update FAQ' : 'Create FAQ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
