import { useState } from 'react';
import { Plus, Edit2, Trash2, FileText, Star, AlertCircle, Briefcase, Bell, Download, ExternalLink } from 'lucide-react';
import { useNotices } from '../../hooks/useApi';
import { noticesApi, getMediaUrl } from '../../services/api';
import type { Notice } from '../../types';
import {
    Card,
    Button,
    Input,
    Textarea,
    Select,
    Toggle,
    Badge,
    Modal,
    ConfirmModal,
    PageHeader,
    SearchInput,
    EmptyState,
    LoadingState,
    IconButton
} from '../../components/ui';

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

const categoryConfig: Record<string, { icon: typeof FileText; badge: 'primary' | 'danger' | 'warning' | 'success' }> = {
    general: { icon: FileText, badge: 'primary' },
    urgent: { icon: AlertCircle, badge: 'danger' },
    tender: { icon: Briefcase, badge: 'warning' },
    recruitment: { icon: Bell, badge: 'success' },
};

const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'tender', label: 'Tender' },
    { value: 'recruitment', label: 'Recruitment' },
];

const formCategoryOptions = categoryOptions.filter(opt => opt.value !== 'all');

export function AdminNotices() {
    const { data: notices, isLoading, refetch } = useNotices();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
    const [formData, setFormData] = useState<NoticeFormData>(emptyFormData);
    const [deleteConfirm, setDeleteConfirm] = useState<Notice | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        } catch {
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
        setIsSubmitting(true);
        console.log('Form submitted:', formData, editingNotice ? 'UPDATE' : 'CREATE');
        setTimeout(() => {
            setIsModalOpen(false);
            setIsSubmitting(false);
            refetch();
        }, 500);
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        console.log('Delete notice:', deleteConfirm.id);
        setDeleteConfirm(null);
        refetch();
    };

    return (
        <div className="space-y-5">
            <PageHeader
                title="Notices"
                description="Manage notice board announcements"
                action={
                    <Button size="sm" leftIcon={<Plus size={16} />} onClick={openCreateModal}>
                        Add Notice
                    </Button>
                }
            />

            {/* Stats Row */}
            <div className="flex flex-wrap gap-2">
                {Object.entries(categoryConfig).map(([key, config]) => {
                    const count = notices?.filter(n => n.category === key).length || 0;
                    const Icon = config.icon;
                    const isActive = filterCategory === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setFilterCategory(filterCategory === key ? 'all' : key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                isActive 
                                    ? 'bg-primary text-white' 
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            <Icon size={16} />
                            <span className="capitalize">{key}</span>
                            <span className={`font-medium ${isActive ? 'text-white' : 'text-white'}`}>{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Search and Filter */}
            <div className="flex gap-3">
                <div className="w-72">
                    <SearchInput
                        placeholder="Search notices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClear={() => setSearchTerm('')}
                    />
                </div>
                <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    options={categoryOptions}
                    className="w-44"
                />
            </div>

            {/* Table */}
            <Card padding="none">
                {isLoading ? (
                    <LoadingState text="Loading notices..." />
                ) : filteredNotices?.length === 0 ? (
                    <EmptyState
                        icon={<Bell size={36} />}
                        title="No notices found"
                        description={searchTerm ? "Try adjusting your search" : "Create your first notice"}
                        action={!searchTerm && <Button size="sm" onClick={openCreateModal} leftIcon={<Plus size={16} />}>Add Notice</Button>}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02]">
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Notice</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Category</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Date</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Status</th>
                                    <th className="text-right py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredNotices?.map((notice: Notice) => {
                                    const config = categoryConfig[notice.category] || categoryConfig.general;
                                    return (
                                        <tr key={notice.id} className="hover:bg-white/[0.02]">
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-gray-200 truncate max-w-md">{notice.title}</span>
                                                    {notice.is_featured && (
                                                        <Star className="text-amber-400 shrink-0" size={14} fill="currentColor" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <Badge variant={config.badge}>
                                                    {notice.category_display}
                                                </Badge>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <span className="text-gray-400">
                                                    {new Date(notice.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <Badge variant="success">Active</Badge>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center justify-end gap-1">
                                                    {notice.document && (
                                                        <IconButton icon={<Download size={16} />} size="sm" tooltip="Download" onClick={() => window.open(getMediaUrl(notice.document), '_blank')} />
                                                    )}
                                                    {notice.link && (
                                                        <IconButton icon={<ExternalLink size={16} />} size="sm" tooltip="Open Link" onClick={() => window.open(notice.link, '_blank')} />
                                                    )}
                                                    <IconButton icon={<Edit2 size={16} />} size="sm" tooltip="Edit" onClick={() => openEditModal(notice)} />
                                                    <IconButton icon={<Trash2 size={16} />} size="sm" tooltip="Delete" variant="danger" onClick={() => setDeleteConfirm(notice)} />
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
                title={editingNotice ? 'Edit Notice' : 'Create Notice'}
                size="lg"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} isLoading={isSubmitting}>
                            {editingNotice ? 'Update' : 'Create'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Title"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Category"
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as NoticeFormData['category'] })}
                            options={formCategoryOptions}
                        />
                        <Input
                            label="Published Date"
                            type="date"
                            required
                            value={formData.published_date}
                            onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                        />
                    </div>
                    <Textarea
                        label="Excerpt"
                        hint="Short summary for list view"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        rows={2}
                        maxLength={300}
                        showCount
                    />
                    <Textarea
                        label="Full Content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={4}
                    />
                    <div className="flex items-center gap-6">
                        <Toggle
                            checked={formData.is_featured}
                            onChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                            label="Featured"
                        />
                        <Toggle
                            checked={formData.is_active}
                            onChange={(checked) => setFormData({ ...formData, is_active: checked })}
                            label="Active"
                        />
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={handleDelete}
                title="Delete Notice"
                message={`Delete "${deleteConfirm?.title}"? This cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}
