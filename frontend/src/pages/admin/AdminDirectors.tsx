import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Users, Shield, User, X } from 'lucide-react';
import { useDirectors } from '../../hooks/useApi';
import { directorsApi } from '../../services/api';
import type { Director } from '../../types';
import { Button, Input, Textarea, Modal, ConfirmModal } from '../../components/ui';

export function AdminDirectors() {
    const { data: directors, isLoading, refetch } = useDirectors();
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingDirector, setEditingDirector] = useState<Director | null>(null);
    const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    // Form State
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
            alert('Failed to delete director');
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
            alert('Failed to save director');
        } finally {
            setFormLoading(false);
        }
    };

    const filteredDirectors = directors?.filter(director =>
        director.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        director.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Board of Directors</h1>
                    <p className="text-gray-400 mt-1">Manage board members and directors</p>
                </div>
                <Button onClick={() => { resetForm(); setIsFormOpen(true); }}>
                    <Plus size={18} className="mr-2" />
                    Add Member
                </Button>
            </div>

            {/* Search Bar - Enhanced */}
            <div className="relative max-w-lg">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search className="text-gray-400" size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search directors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 bg-secondary-dark border-2 border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-600"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-300 transition-colors text-xl"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Directors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full text-center py-8 text-gray-500">Loading...</div>
                ) : filteredDirectors?.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">No directors found</div>
                ) : (
                    filteredDirectors?.map((director) => (
                        <div
                            key={director.id}
                            className="bg-secondary rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors group relative"
                        >
                            {director.is_chairman && (
                                <div className="absolute top-0 right-0 p-2 z-10">
                                    <div className="bg-primary text-white text-xs px-2 py-1 rounded-bl-lg shadow-lg font-medium flex items-center gap-1">
                                        <Shield size={12} />
                                        Chairman
                                    </div>
                                </div>
                            )}

                            <div className="aspect-[4/5] bg-gray-800 relative">
                                {director.photo ? (
                                    <img src={director.photo} alt={director.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                        <User size={64} />
                                    </div>
                                )}

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleEdit(director)}
                                        className="p-2 bg-white/10 hover:bg-primary text-white rounded-full transition-colors backdrop-blur-sm"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => { setSelectedDirector(director); setIsDeleteOpen(true); }}
                                        className="p-2 bg-white/10 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-sm"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-bold text-white">{director.name}</h3>
                                <p className="text-primary-light font-medium text-sm mt-1">{director.title}</p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                    <Users size={14} />
                                    {director.organization}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingDirector ? "Edit Director" : "Add Director"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
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
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Display Order"
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                            required
                        />
                        <div className="flex items-center pt-8">
                            <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={formData.is_chairman}
                                    onChange={(e) => setFormData({ ...formData, is_chairman: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-600 bg-secondary-light text-primary focus:ring-primary"
                                />
                                Is Chairman?
                            </label>
                        </div>
                    </div>
                    <Textarea
                        label="Bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setFormData({ ...formData, photo: file });
                            }}
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                        />
                        {editingDirector?.photo && !formData.photo && (
                            <p className="text-xs text-gray-500 mt-1">Current: {editingDirector.photo}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={formLoading}>
                            {formLoading ? 'Saving...' : 'Save Member'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Director"
                message={`Are you sure you want to delete "${selectedDirector?.name}"?`}
                isLoading={formLoading}
            />
        </div>
    );
}
