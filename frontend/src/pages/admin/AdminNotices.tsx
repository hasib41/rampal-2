import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Calendar, Eye, Star, X, FileText, AlertCircle, Briefcase, Bell, Download, Loader2 } from 'lucide-react';
import { useNotices } from '../../hooks/useApi';
import { noticesApi } from '../../services/api';
import type { Notice } from '../../types';

interface NoticeFormData {
    title: string;
    category: 'general' | 'urgent' | 'tender' | 'recruitment';
    excerpt: string;
    content: string;
    published_date: string;
    is_featured: boolean;
    is_active: boolean;
}

const emptyFormData: NoticeFormData = {
    title: '',
    category: 'general',
    excerpt: '',
    content: '',
    published_date: new Date().toISOString().split('T')[0],
    is_featured: false,
    is_active: true,
};

const categoryConfig: Record<string, { icon: typeof FileText; color: string; bgColor: string }> = {
    general: { icon: FileText, color: 'text-primary-light', bgColor: 'bg-primary/20' },
    urgent: { icon: AlertCircle, color: 'text-red-400', bgColor: 'bg-red-500/20' },
    tender: { icon: Briefcase, color: 'text-accent-orange', bgColor: 'bg-accent-orange/20' },
    recruitment: { icon: Bell, color: 'text-accent-green', bgColor: 'bg-accent-green/20' },
};

export function AdminNotices() {
    const { data: notices, isLoading, refetch } = useNotices();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
    const [formData, setFormData] = useState<NoticeFormData>(emptyFormData);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const filteredNotices = notices?.filter(notice => {
        const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || notice.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const openCreateModal = () => {
        setEditingNotice(null);
        setFormData(emptyFormData);
        setIsModalOpen(true);
    };

    const openEditModal = async (notice: Notice) => {
        setEditingNotice(notice);
        // Fetch full notice details (including content) since list API doesn't include it
        try {
            const fullNotice = await noticesApi.getBySlug(notice.slug);
            setFormData({
                title: fullNotice.title,
                category: fullNotice.category,
                excerpt: fullNotice.excerpt || '',
                content: fullNotice.content || '',
                published_date: fullNotice.published_date,
                is_featured: fullNotice.is_featured,
                is_active: true,
            });
        } catch (error) {
            console.error('Failed to fetch notice details:', error);
            // Fallback to using list data without content
            setFormData({
                title: notice.title,
                category: notice.category,
                excerpt: notice.excerpt || '',
                content: '',
                published_date: notice.published_date,
                is_featured: notice.is_featured,
                is_active: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement API call to create/update notice
        console.log('Form submitted:', formData, editingNotice ? 'UPDATE' : 'CREATE');
        setIsModalOpen(false);
        refetch();
    };

    const handleDelete = async (id: number) => {
        // TODO: Implement API call to delete notice
        console.log('Delete notice:', id);
        setDeleteConfirm(null);
        refetch();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Notices</h1>
                    <p className="text-gray-400 mt-1">Manage notice board announcements</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                >
                    <Plus size={18} />
                    Add Notice
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(categoryConfig).map(([key, config]) => {
                    const count = notices?.filter(n => n.category === key).length || 0;
                    const Icon = config.icon;
                    return (
                        <div
                            key={key}
                            className={`p-4 rounded-xl border border-gray-700 bg-secondary cursor-pointer hover:border-gray-600 transition-colors ${filterCategory === key ? 'ring-2 ring-primary' : ''
                                }`}
                            onClick={() => setFilterCategory(filterCategory === key ? 'all' : key)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                                    <Icon className={config.color} size={20} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{count}</p>
                                    <p className="text-gray-400 text-sm capitalize">{key}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2.5 bg-secondary border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary"
                >
                    <option value="all">All Categories</option>
                    <option value="general">General</option>
                    <option value="urgent">Urgent</option>
                    <option value="tender">Tender</option>
                    <option value="recruitment">Recruitment</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-secondary rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700 bg-secondary-dark">
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Notice</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Category</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Date</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Status</th>
                            <th className="text-right py-4 px-6 text-gray-400 font-medium text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">Loading...</td>
                            </tr>
                        ) : filteredNotices?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">No notices found</td>
                            </tr>
                        ) : (
                            filteredNotices?.map((notice: Notice) => {
                                const config = categoryConfig[notice.category] || categoryConfig.general;
                                const Icon = config.icon;

                                return (
                                    <tr key={notice.id} className="border-b border-gray-700/50 hover:bg-secondary-dark/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-start gap-3">
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                                                    <Icon className={config.color} size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-gray-200 font-medium truncate max-w-md">{notice.title}</p>
                                                        {notice.is_featured && (
                                                            <Star className="text-yellow-400 flex-shrink-0" size={14} fill="currentColor" />
                                                        )}
                                                    </div>
                                                    {notice.excerpt && (
                                                        <p className="text-gray-500 text-sm truncate max-w-md mt-1">{notice.excerpt}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                                                {notice.category_display}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                <Calendar size={14} />
                                                {new Date(notice.published_date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Eye className="text-accent-green" size={16} />
                                                <span className="text-accent-green text-sm">Active</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                {notice.document && (
                                                    <a
                                                        href={notice.document}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-gray-400 hover:text-primary-light hover:bg-primary/10 rounded-lg transition-colors"
                                                    >
                                                        <Download size={16} />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => openEditModal(notice)}
                                                    className="p-2 text-gray-400 hover:text-primary-light hover:bg-primary/10 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(notice.id)}
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary-dark rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                            <h2 className="text-xl font-bold text-white">
                                {editingNotice ? 'Edit Notice' : 'Create Notice'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary"
                                    placeholder="Enter notice title"
                                />
                            </div>

                            {/* Category & Date Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as NoticeFormData['category'] })}
                                        className="w-full px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary"
                                    >
                                        <option value="general">General</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="tender">Tender</option>
                                        <option value="recruitment">Recruitment</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Published Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.published_date}
                                        onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                                        className="w-full px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Excerpt (Short Summary)</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    rows={2}
                                    maxLength={300}
                                    className="w-full px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary resize-none"
                                    placeholder="Brief summary for list view (max 300 characters)"
                                />
                                <p className="text-gray-500 text-xs mt-1">{formData.excerpt.length}/300 characters</p>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Full Content</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={6}
                                    className="w-full px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary resize-none"
                                    placeholder="Full notice content..."
                                />
                            </div>

                            {/* Toggles */}
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_featured}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary bg-secondary"
                                    />
                                    <span className="text-gray-300">Featured Notice</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary bg-secondary"
                                    />
                                    <span className="text-gray-300">Active</span>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                                >
                                    {editingNotice ? 'Update Notice' : 'Create Notice'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary-dark rounded-2xl border border-gray-700 p-6 max-w-md w-full">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                <Trash2 className="text-red-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Delete Notice</h3>
                                <p className="text-gray-400 text-sm">This action cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete this notice? All associated data will be permanently removed.
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
