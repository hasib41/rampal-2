import { useState } from 'react';
import { Plus, Edit2, Trash2, Image, Star, Newspaper } from 'lucide-react';
import { useNews } from '../../hooks/useApi';
import { newsApi, getMediaUrl } from '../../services/api';
import type { NewsArticle } from '../../types';
import {
    Card,
    Button,
    Input,
    Select,
    Textarea,
    Modal,
    ConfirmModal,
    PageHeader,
    SearchInput,
    Badge,
    IconButton,
    EmptyState,
    LoadingState,
    Checkbox
} from '../../components/ui';

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

const categoryConfig: Record<string, { label: string; variant: 'primary' | 'success' | 'warning' | 'info' }> = {
    press: { label: 'Press Release', variant: 'primary' },
    event: { label: 'Event', variant: 'success' },
    in_the_news: { label: 'In The News', variant: 'warning' },
    update: { label: 'Update', variant: 'info' },
};

export function AdminNews() {
    const { data: news, isLoading, refetch } = useNews();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
    const [deletingArticle, setDeletingArticle] = useState<NewsArticle | null>(null);
    const [formData, setFormData] = useState<NewsFormData>(emptyFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredNews = news?.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const openCreateModal = () => {
        setEditingArticle(null);
        setFormData(emptyFormData);
        setIsModalOpen(true);
    };

    const openEditModal = async (article: NewsArticle) => {
        setEditingArticle(article);
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
        } catch {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log('Submitting:', formData);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsModalOpen(false);
            refetch();
        }, 500);
    };

    const handleDelete = async () => {
        if (!deletingArticle) return;
        console.log('Deleting:', deletingArticle.id);
        setDeletingArticle(null);
        refetch();
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    return (
        <div className="space-y-5">
            <PageHeader
                title="News & Media"
                description="Manage press releases and articles"
                action={
                    <Button size="sm" leftIcon={<Plus size={16} />} onClick={openCreateModal}>
                        Add Article
                    </Button>
                }
            />

            {/* Stats */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setCategoryFilter('all')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${categoryFilter === 'all' ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                    <Newspaper size={16} />
                    All <span className="font-medium">{news?.length || 0}</span>
                </button>
                {Object.entries(categoryConfig).map(([key, config]) => {
                    const count = news?.filter(n => n.category === key).length || 0;
                    return (
                        <button
                            key={key}
                            onClick={() => setCategoryFilter(categoryFilter === key ? 'all' : key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${categoryFilter === key ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                            {config.label} <span className="font-medium">{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className="w-72">
                <SearchInput
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClear={() => setSearchTerm('')}
                />
            </div>

            {/* Table */}
            <Card padding="none">
                {isLoading ? (
                    <LoadingState text="Loading articles..." />
                ) : filteredNews?.length === 0 ? (
                    <EmptyState
                        icon={<Newspaper size={36} />}
                        title="No articles found"
                        action={<Button size="sm" onClick={openCreateModal} leftIcon={<Plus size={16} />}>Add Article</Button>}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02]">
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Article</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Category</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Date</th>
                                    <th className="text-center py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Featured</th>
                                    <th className="text-right py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredNews?.map((article: NewsArticle) => {
                                    const config = categoryConfig[article.category] || categoryConfig.press;
                                    return (
                                        <tr key={article.id} className="hover:bg-white/[0.02]">
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded bg-white/5 overflow-hidden flex-shrink-0">
                                                        {article.image ? (
                                                            <img src={getMediaUrl(article.image)} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                                <Image size={18} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="text-white font-medium truncate block max-w-sm">{article.title}</span>
                                                        {article.excerpt && (
                                                            <span className="text-gray-500 text-sm truncate block max-w-sm">{article.excerpt}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <Badge variant={config.variant}>{config.label}</Badge>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <span className="text-gray-400">
                                                    {new Date(article.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-5 text-center">
                                                {article.is_featured && <Star className="inline text-amber-400" size={16} fill="currentColor" />}
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center justify-end gap-1">
                                                    <IconButton icon={<Edit2 size={16} />} size="sm" tooltip="Edit" onClick={() => openEditModal(article)} />
                                                    <IconButton icon={<Trash2 size={16} />} size="sm" tooltip="Delete" variant="danger" onClick={() => setDeletingArticle(article)} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingArticle ? "Edit Article" : "Create Article"}
                size="lg"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} isLoading={isSubmitting}>
                            {editingArticle ? 'Update' : 'Create'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: editingArticle ? formData.slug : generateSlug(e.target.value) })}
                        required
                    />
                    <Input
                        label="Slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        hint="URL-friendly identifier"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as NewsFormData['category'] })}
                            options={[
                                { value: 'press', label: 'Press Release' },
                                { value: 'event', label: 'Event' },
                                { value: 'in_the_news', label: 'In The News' },
                                { value: 'update', label: 'Update' },
                            ]}
                        />
                        <Input
                            label="Published Date"
                            type="date"
                            value={formData.published_date}
                            onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                            required
                        />
                    </div>
                    <Textarea
                        label="Excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        rows={2}
                        maxLength={300}
                        showCount
                        hint="Brief summary"
                    />
                    <Textarea
                        label="Content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={5}
                    />
                    <Checkbox
                        checked={formData.is_featured}
                        onChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                        label="Featured Article"
                    />
                </form>
            </Modal>

            <ConfirmModal
                isOpen={!!deletingArticle}
                onClose={() => setDeletingArticle(null)}
                onConfirm={handleDelete}
                title="Delete Article"
                message={`Delete "${deletingArticle?.title}"? This cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}
