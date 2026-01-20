import { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Image, Star, Video, Upload, X } from 'lucide-react';
import { useGallery } from '../../hooks/useApi';
import { galleryApi, getMediaUrl } from '../../services/api';
import type { GalleryImage } from '../../types';
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

interface GalleryFormData {
    title: string;
    slug: string;
    category: 'project' | 'construction' | 'event' | 'facility';
    media_type: 'image' | 'video';
    description: string;
    video_url: string;
    order: string;
    is_featured: boolean;
    image: File | null;
}

const emptyFormData: GalleryFormData = {
    title: '',
    slug: '',
    category: 'project',
    media_type: 'image',
    description: '',
    video_url: '',
    order: '0',
    is_featured: false,
    image: null,
};

const categoryConfig: Record<string, { label: string; variant: 'primary' | 'success' | 'warning' | 'info' }> = {
    project: { label: 'Project Photos', variant: 'primary' },
    construction: { label: 'Construction', variant: 'warning' },
    event: { label: 'Events', variant: 'success' },
    facility: { label: 'Facility', variant: 'info' },
};

export function AdminGallery() {
    const { data: gallery, isLoading, refetch } = useGallery();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
    const [deletingImage, setDeletingImage] = useState<GalleryImage | null>(null);
    const [formData, setFormData] = useState<GalleryFormData>(emptyFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredGallery = gallery?.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const openCreateModal = () => {
        setEditingImage(null);
        setFormData(emptyFormData);
        setImagePreview(null);
        setError(null);
        setIsModalOpen(true);
    };

    const openEditModal = async (image: GalleryImage) => {
        setEditingImage(image);
        setError(null);
        setFormData({
            title: image.title,
            slug: image.slug,
            category: image.category,
            media_type: image.media_type,
            description: image.description || '',
            video_url: image.video_url || '',
            order: image.order.toString(),
            is_featured: image.is_featured,
            image: null,
        });
        setImagePreview(image.image ? getMediaUrl(image.image) : null);
        setIsModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setFormData({ ...formData, image: null });
        setImagePreview(editingImage?.image ? getMediaUrl(editingImage.image) : null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setError(null);

        // Validation
        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }
        if (!editingImage && !formData.image) {
            setError('Image is required');
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            if (formData.slug) submitData.append('slug', formData.slug);
            submitData.append('category', formData.category);
            submitData.append('media_type', formData.media_type);
            submitData.append('description', formData.description);
            submitData.append('video_url', formData.video_url);
            submitData.append('order', formData.order);
            submitData.append('is_featured', formData.is_featured.toString());

            if (formData.image) {
                submitData.append('image', formData.image);
            }

            if (editingImage) {
                await galleryApi.update(editingImage.id, submitData);
            } else {
                await galleryApi.create(submitData);
            }

            setIsModalOpen(false);
            refetch();
        } catch (err: unknown) {
            console.error('Failed to save gallery image:', err);
            // Extract error message from API response
            const axiosError = err as { response?: { data?: Record<string, string[]> } };
            if (axiosError.response?.data) {
                const errors = Object.entries(axiosError.response.data)
                    .map(([key, msgs]) => `${key}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                    .join('; ');
                setError(errors || 'Failed to save gallery image.');
            } else {
                setError('Failed to save gallery image. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingImage) return;

        try {
            await galleryApi.delete(deletingImage.id);
            setDeletingImage(null);
            refetch();
        } catch (error) {
            console.error('Failed to delete gallery image:', error);
        }
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    return (
        <div className="space-y-5">
            <PageHeader
                title="Media Gallery"
                description="Manage photos and videos for the gallery"
                action={
                    <Button size="sm" leftIcon={<Plus size={16} />} onClick={openCreateModal}>
                        Add Image
                    </Button>
                }
            />

            {/* Stats */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setCategoryFilter('all')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${categoryFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                >
                    <Image size={16} />
                    All <span className="font-medium">{gallery?.length || 0}</span>
                </button>
                {Object.entries(categoryConfig).map(([key, config]) => {
                    const count = gallery?.filter(g => g.category === key).length || 0;
                    return (
                        <button
                            key={key}
                            onClick={() => setCategoryFilter(categoryFilter === key ? 'all' : key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${categoryFilter === key ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                        >
                            {config.label} <span className="font-medium">{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className="w-72">
                <SearchInput
                    placeholder="Search gallery..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClear={() => setSearchTerm('')}
                />
            </div>

            {/* Gallery Grid */}
            <Card padding="none">
                {isLoading ? (
                    <LoadingState text="Loading gallery..." />
                ) : filteredGallery?.length === 0 ? (
                    <EmptyState
                        icon={<Image size={36} />}
                        title="No images found"
                        action={<Button size="sm" onClick={openCreateModal} leftIcon={<Plus size={16} />}>Add Image</Button>}
                    />
                ) : (
                    <div className="p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredGallery?.map((item: GalleryImage) => {
                                const config = categoryConfig[item.category] || categoryConfig.project;
                                return (
                                    <div
                                        key={item.id}
                                        className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10"
                                    >
                                        {item.image ? (
                                            <img
                                                src={getMediaUrl(item.image)}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                {item.media_type === 'video' ? <Video size={32} /> : <Image size={32} />}
                                            </div>
                                        )}

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                            <div className="flex items-start justify-between">
                                                <Badge variant={config.variant} size="sm">{config.label}</Badge>
                                                <div className="flex items-center gap-1">
                                                    {item.is_featured && <Star className="text-amber-400" size={14} fill="currentColor" />}
                                                    {item.media_type === 'video' && <Video className="text-white" size={14} />}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-medium line-clamp-2 mb-2">{item.title}</p>
                                                <div className="flex items-center gap-1">
                                                    <IconButton
                                                        icon={<Edit2 size={14} />}
                                                        size="sm"
                                                        tooltip="Edit"
                                                        onClick={() => openEditModal(item)}
                                                        className="bg-white/20 hover:bg-white/30 text-white"
                                                    />
                                                    <IconButton
                                                        icon={<Trash2 size={14} />}
                                                        size="sm"
                                                        tooltip="Delete"
                                                        variant="danger"
                                                        onClick={() => setDeletingImage(item)}
                                                        className="bg-white/20 hover:bg-red-500 text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </Card>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingImage ? "Edit Gallery Image" : "Add Gallery Image"}
                size="lg"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} isLoading={isSubmitting}>
                            {editingImage ? 'Update' : 'Create'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    <Input
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: editingImage ? formData.slug : generateSlug(e.target.value) })}
                        required
                    />
                    <Input
                        label="Slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        hint="URL-friendly identifier (auto-generated)"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as GalleryFormData['category'] })}
                            options={[
                                { value: 'project', label: 'Project Photos' },
                                { value: 'construction', label: 'Construction Updates' },
                                { value: 'event', label: 'Events' },
                                { value: 'facility', label: 'Facility' },
                            ]}
                        />
                        <Select
                            label="Media Type"
                            value={formData.media_type}
                            onChange={(e) => setFormData({ ...formData, media_type: e.target.value as GalleryFormData['media_type'] })}
                            options={[
                                { value: 'image', label: 'Image' },
                                { value: 'video', label: 'Video' },
                            ]}
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Image {!editingImage && <span className="text-red-500">*</span>}
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="flex flex-col items-center justify-center py-8 cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="text-gray-400 mb-2" size={32} />
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Click to upload image</p>
                                    <p className="text-gray-400 text-xs mt-1">PNG, JPG up to 10MB</p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {formData.media_type === 'video' && (
                        <Input
                            label="Video URL"
                            value={formData.video_url}
                            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                            placeholder="https://youtube.com/..."
                            hint="YouTube or external video URL"
                        />
                    )}

                    <Textarea
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Display Order"
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                            hint="Lower numbers appear first"
                        />
                        <div className="flex items-end pb-2">
                            <Checkbox
                                checked={formData.is_featured}
                                onChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                                label="Featured Image"
                            />
                        </div>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={!!deletingImage}
                onClose={() => setDeletingImage(null)}
                onConfirm={handleDelete}
                title="Delete Gallery Image"
                message={`Delete "${deletingImage?.title}"? This cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}
