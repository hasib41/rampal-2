import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Calendar, Image, Star, StarOff, X, Newspaper, TrendingUp, Clock } from 'lucide-react';
import { useNews } from '../../hooks/useApi';
import { newsApi } from '../../services/api';
import type { NewsArticle } from '../../types';

interface NewsFormData {
    title: string;
    slug: string;
    category: 'press' | 'event' | 'in_the_news' | 'update';
    excerpt: string;
    content: string;
    published_date: string;
    is_featured: boolean;
}

const emptyFormData: NewsFormData = {
    title: '',
    slug: '',
    category: 'press',
    excerpt: '',
    content: '',
    published_date: new Date().toISOString().split('T')[0],
    is_featured: false,
};

export function AdminNews() {
    const { data: news, isLoading, refetch } = useNews();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
    const [deletingArticle, setDeletingArticle] = useState<NewsArticle | null>(null);
    const [formData, setFormData] = useState<NewsFormData>(emptyFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredNews = news?.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categoryColors: Record<string, string> = {
        press: 'bg-primary/20 text-primary-light',
        event: 'bg-accent-green/20 text-accent-green',
        in_the_news: 'bg-accent-orange/20 text-accent-orange',
        update: 'bg-purple-500/20 text-purple-400',
    };

    const categoryLabels: Record<string, string> = {
        press: 'Press Release',
        event: 'Event',
        in_the_news: 'In The News',
        update: 'Update',
    };

    const categoryIcons: Record<string, typeof Newspaper> = {
        press: Newspaper,
        event: Calendar,
        in_the_news: TrendingUp,
        update: Clock,
    };

    const openCreateModal = () => {
        setEditingArticle(null);
        setFormData(emptyFormData);
        setIsModalOpen(true);
    };

    const openEditModal = async (article: NewsArticle) => {
        setEditingArticle(article);
        // Fetch full article details including content
        try {
            const fullArticle = await newsApi.getBySlug(article.slug);
            setFormData({
                title: fullArticle.title,
                slug: fullArticle.slug,
                category: fullArticle.category,
                excerpt: fullArticle.excerpt || '',
                content: fullArticle.content || '',
                published_date: fullArticle.published_date,
                is_featured: fullArticle.is_featured,
            });
        } catch (error) {
            console.error('Failed to fetch article details:', error);
            setFormData({
                title: article.title,
                slug: article.slug,
                category: article.category,
                excerpt: article.excerpt || '',
                content: '',
                published_date: article.published_date,
                is_featured: article.is_featured,
            });
        }
        setIsModalOpen(true);
    };

    const openDeleteModal = (article: NewsArticle) => {
        setDeletingArticle(article);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: Implement API call when backend endpoint is ready
        console.log('Submitting:', formData);
        alert(editingArticle ? 'Article updated! (API not connected yet)' : 'Article created! (API not connected yet)');

        setIsSubmitting(false);
        setIsModalOpen(false);
        refetch();
    };

    const handleDelete = async () => {
        if (!deletingArticle) return;

        // TODO: Implement API call when backend endpoint is ready
        console.log('Deleting:', deletingArticle.id);
        alert('Article deleted! (API not connected yet)');

        setIsDeleteModalOpen(false);
        setDeletingArticle(null);
        refetch();
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">News & Media</h1>
                    <p className="text-gray-400 mt-1">Manage press releases and news articles</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                >
                    <Plus size={18} />
                    Add Article
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['all', 'press', 'event', 'update'].map(category => {
                    const count = category === 'all'
                        ? news?.length || 0
                        : news?.filter(a => a.category === category).length || 0;
                    const Icon = category === 'all' ? Newspaper : categoryIcons[category];

                    return (
                        <div
                            key={category}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${categoryFilter === category
                                    ? 'bg-primary/10 border-primary'
                                    : 'bg-secondary border-gray-700 hover:border-gray-600'
                                }`}
                            onClick={() => setCategoryFilter(category)}
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-gray-400 text-sm capitalize">
                                    {category === 'all' ? 'All Articles' : categoryLabels[category] || category}
                                </p>
                                <Icon size={18} className="text-gray-500" />
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">{count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary"
                />
            </div>

            {/* Table */}
            <div className="bg-secondary rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700 bg-secondary-dark">
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Article</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Category</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Date</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Featured</th>
                            <th className="text-right py-4 px-6 text-gray-400 font-medium text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">Loading...</td>
                            </tr>
                        ) : filteredNews?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">No articles found</td>
                            </tr>
                        ) : (
                            filteredNews?.map((article: NewsArticle) => (
                                <tr key={article.id} className="border-b border-gray-700/50 hover:bg-secondary-dark/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gray-700 flex-shrink-0 overflow-hidden">
                                                {article.image ? (
                                                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                        <Image size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-gray-200 font-medium truncate max-w-sm">{article.title}</p>
                                                <p className="text-gray-500 text-sm truncate max-w-sm">{article.excerpt}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[article.category]}`}>
                                            {categoryLabels[article.category] || article.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Calendar size={14} />
                                            {new Date(article.published_date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        {article.is_featured ? (
                                            <Star className="text-yellow-400 fill-yellow-400" size={18} />
                                        ) : (
                                            <StarOff className="text-gray-600" size={18} />
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(article)}
                                                className="p-2 text-gray-400 hover:text-primary-light hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Edit article"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(article)}
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete article"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-white">
                                {editingArticle ? 'Edit Article' : 'Create New Article'}
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
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                            slug: editingArticle ? formData.slug : generateSlug(e.target.value)
                                        });
                                    }}
                                    className="w-full px-4 py-2.5 bg-secondary-dark border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary"
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-secondary-dark border border-gray-700 rounded-lg text-gray-400 focus:outline-none focus:border-primary"
                                    placeholder="auto-generated-from-title"
                                />
                            </div>

                            {/* Category and Date Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as NewsFormData['category'] })}
                                        className="w-full px-4 py-2.5 bg-secondary-dark border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary"
                                    >
                                        <option value="press">Press Release</option>
                                        <option value="event">Event</option>
                                        <option value="in_the_news">In The News</option>
                                        <option value="update">Update</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Published Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.published_date}
                                        onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-secondary-dark border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Excerpt (Short Summary)
                                </label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    rows={2}
                                    maxLength={300}
                                    className="w-full px-4 py-2.5 bg-secondary-dark border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary resize-none"
                                    placeholder="Brief summary of the article..."
                                />
                                <p className="text-gray-500 text-xs mt-1">{formData.excerpt.length}/300 characters</p>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Content
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={8}
                                    className="w-full px-4 py-2.5 bg-secondary-dark border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary resize-none"
                                    placeholder="Full article content... Use **bold** for emphasis."
                                />
                            </div>

                            {/* Featured Toggle */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-700 bg-secondary-dark text-primary focus:ring-primary"
                                />
                                <label htmlFor="is_featured" className="text-gray-300">
                                    Featured Article
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : (editingArticle ? 'Update Article' : 'Create Article')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && deletingArticle && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary rounded-2xl border border-gray-700 w-full max-w-md p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Delete Article</h2>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to delete <span className="text-white font-medium">"{deletingArticle.title}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
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
