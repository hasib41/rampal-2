import { useState } from 'react';
import { Plus, Edit2, Trash2, Users, Shield, User } from 'lucide-react';
import { useDirectors } from '../../hooks/useApi';
import { directorsApi, getMediaUrl } from '../../services/api';
import type { Director } from '../../types';
import {
    Card,
    Button,
    Input,
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

export function AdminDirectors() {
    const { data: directors, isLoading, refetch } = useDirectors();
    const [searchTerm, setSearchTerm] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingDirector, setEditingDirector] = useState<Director | null>(null);
    const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        title: '',
        organization: '',
        bio: '',
        order: '0',
        is_chairman: false,
        photo: null as File | null
    });

    const resetForm = () => {
        setFormData({
            name: '',
            title: '',
            organization: '',
            bio: '',
            order: '0',
            is_chairman: false,
            photo: null
        });
        setEditingDirector(null);
    };

    const handleEdit = (director: Director) => {
        setEditingDirector(director);
        setFormData({
            name: director.name,
            title: director.title,
            organization: director.organization,
            bio: director.bio,
            order: director.order.toString(),
            is_chairman: director.is_chairman,
            photo: null
        });
        setIsFormOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedDirector) return;
        setFormLoading(true);
        try {
            await directorsApi.delete(selectedDirector.id);
            await refetch();
            setIsDeleteOpen(false);
        } catch (error) {
            console.error('Failed to delete director:', error);
        } finally {
            setFormLoading(false);
            setSelectedDirector(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('title', formData.title);
        data.append('organization', formData.organization);
        data.append('bio', formData.bio);
        data.append('order', formData.order);
        data.append('is_chairman', formData.is_chairman ? 'true' : 'false');
        if (formData.photo) {
            data.append('photo', formData.photo);
        }

        try {
            if (editingDirector) {
                await directorsApi.update(editingDirector.id, data);
            } else {
                await directorsApi.create(data);
            }
            await refetch();
            setIsFormOpen(false);
            resetForm();
        } catch (error) {
            console.error('Failed to save director:', error);
        } finally {
            setFormLoading(false);
        }
    };

    const filteredDirectors = directors?.filter(director =>
        director.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        director.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const chairmanCount = directors?.filter(d => d.is_chairman).length || 0;

    return (
        <div className="space-y-5">
            <PageHeader
                title="Board of Directors"
                description="Manage board members and directors"
                action={
                    <Button size="sm" leftIcon={<Plus size={16} />} onClick={() => { resetForm(); setIsFormOpen(true); }}>
                        Add Member
                    </Button>
                }
            />

            {/* Stats Row */}
            <div className="flex gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                    <Users size={16} className="text-primary-light" />
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white font-medium">{directors?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                    <Shield size={16} className="text-amber-400" />
                    <span className="text-gray-400">Chairman:</span>
                    <span className="text-white font-medium">{chairmanCount}</span>
                </div>
            </div>

            {/* Search */}
            <div className="max-w-sm">
                <SearchInput
                    placeholder="Search directors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClear={() => setSearchTerm('')}
                />
            </div>

            {/* Table */}
            <Card padding="none">
                {isLoading ? (
                    <LoadingState text="Loading directors..." />
                ) : filteredDirectors?.length === 0 ? (
                    <EmptyState
                        icon={<Users size={36} />}
                        title="No directors found"
                        description="Add board members to get started"
                        action={<Button size="sm" onClick={() => { resetForm(); setIsFormOpen(true); }} leftIcon={<Plus size={16} />}>Add Member</Button>}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02]">
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Member</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Title</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Organization</th>
                                    <th className="text-center py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Order</th>
                                    <th className="text-right py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredDirectors?.map((director) => (
                                    <tr key={director.id} className="hover:bg-white/[0.02]">
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/5 overflow-hidden flex-shrink-0">
                                                    {director.photo ? (
                                                        <img src={getMediaUrl(director.photo)} alt={director.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                            <User size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-medium truncate">{director.name}</span>
                                                        {director.is_chairman && (
                                                            <Badge variant="warning" size="sm">Chairman</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <span className="text-gray-300">{director.title}</span>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <span className="text-gray-400">{director.organization}</span>
                                        </td>
                                        <td className="py-3.5 px-5 text-center">
                                            <span className="text-gray-500">{director.order}</span>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center justify-end gap-1">
                                                <IconButton
                                                    icon={<Edit2 size={16} />}
                                                    size="sm"
                                                    tooltip="Edit"
                                                    onClick={() => handleEdit(director)}
                                                />
                                                <IconButton
                                                    icon={<Trash2 size={16} />}
                                                    size="sm"
                                                    tooltip="Delete"
                                                    variant="danger"
                                                    onClick={() => { setSelectedDirector(director); setIsDeleteOpen(true); }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingDirector ? "Edit Director" : "Add Director"}
                size="md"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} isLoading={formLoading}>
                            {editingDirector ? 'Update' : 'Add Member'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Display Order"
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                        />
                    </div>
                    <Input
                        label="Title / Designation"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <Input
                        label="Organization"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        required
                    />
                    <Textarea
                        label="Bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={3}
                        required
                    />
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setFormData({ ...formData, photo: file });
                                }}
                                className="text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                            />
                        </div>
                        <Checkbox
                            checked={formData.is_chairman}
                            onChange={(checked) => setFormData({ ...formData, is_chairman: checked })}
                            label="Is Chairman"
                        />
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Director"
                message={`Are you sure you want to delete "${selectedDirector?.name}"?`}
                confirmText="Delete"
                variant="danger"
                isLoading={formLoading}
            />
        </div>
    );
}
