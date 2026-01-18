import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Briefcase, MapPin, Clock, DollarSign, X } from 'lucide-react';
import { useCareers } from '../../hooks/useApi';
import { careersApi } from '../../services/api';
import type { Career } from '../../types';
import { Button, Input, Select, Textarea, Modal, ConfirmModal } from '../../components/ui';

export function AdminCareers() {
    const { data: careers, isLoading, refetch } = useCareers();
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingCareer, setEditingCareer] = useState<Career | null>(null);
    const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        employment_type: 'full_time',
        description: '',
        requirements: '',
        salary_range: '',
        deadline: '',
        is_active: true
    });

    const resetForm = () => {
        setFormData({
            title: '',
            department: '',
            location: '',
            employment_type: 'full_time',
            description: '',
            requirements: '',
            salary_range: '',
            deadline: '',
            is_active: true
        });
        setEditingCareer(null);
    };

    const handleEdit = (career: Career) => {
        setEditingCareer(career);
        setFormData({
            title: career.title,
            department: career.department,
            location: career.location,
            employment_type: career.employment_type,
            description: career.description,
            requirements: career.requirements,
            salary_range: career.salary_range,
            deadline: career.deadline,
            is_active: career.is_active
        });
        setIsFormOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedCareer) return;
        setFormLoading(true);
        try {
            await careersApi.delete(selectedCareer.id);
            await refetch();
            setIsDeleteOpen(false);
        } catch (error) {
            console.error('Failed to delete career:', error);
            alert('Failed to delete career');
        } finally {
            setFormLoading(false);
            setSelectedCareer(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            if (editingCareer) {
                // For update, we need to pass the ID and the Career object
                const updateData: Career = {
                    ...editingCareer,
                    ...formData,
                    employment_type: formData.employment_type as Career['employment_type']
                };
                await careersApi.update(editingCareer.id, updateData);
            } else {
                // For create, we create a partial object that satisfies the API specific requirement if needed, 
                // but here we cast to Career (minus ID usually handled by backend, but typescript needs it)
                // The backend serializer expects all fields.

                await careersApi.create({
                    ...formData,
                    id: 0,
                    employment_type: formData.employment_type as Career['employment_type']
                });
            }
            await refetch();
            setIsFormOpen(false);
            resetForm();
        } catch (error) {
            console.error('Failed to save career:', error);
            alert('Failed to save career');
        } finally {
            setFormLoading(false);
        }
    };

    const filteredCareers = careers?.filter(career =>
        career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Careers</h1>
                    <p className="text-gray-400 mt-1">Manage job listings and applications</p>
                </div>
                <Button onClick={() => { resetForm(); setIsFormOpen(true); }}>
                    <Plus size={18} className="mr-2" />
                    Post Job
                </Button>
            </div>

            {/* Search Bar - Enhanced */}
            <div className="relative max-w-lg">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search className="text-gray-400" size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search careers..."
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

            {/* Careers List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : filteredCareers?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No careers found</div>
                ) : (
                    filteredCareers?.map((career) => (
                        <div
                            key={career.id}
                            className="bg-secondary rounded-xl border border-gray-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gray-600 transition-colors group"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-white">{career.title}</h3>
                                    {!career.is_active && (
                                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-500">
                                            Closed
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Briefcase size={16} />
                                        {career.department}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <MapPin size={16} />
                                        {career.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Clock size={16} />
                                        {career.employment_type.replace('_', ' ')}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <DollarSign size={16} />
                                        {career.salary_range}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(career)}
                                    className="p-2 text-gray-400 hover:text-primary-light hover:bg-primary/10 rounded transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => { setSelectedCareer(career); setIsDeleteOpen(true); }}
                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingCareer ? "Edit Job Posting" : "Post New Job"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Job Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Department"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            required
                        />
                        <Input
                            label="Location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Employment Type"
                            value={formData.employment_type}
                            onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                            options={[
                                { value: 'full_time', label: 'Full Time' },
                                { value: 'contract', label: 'Contract' }
                            ]}
                        />
                        <Input
                            label="Salary Range"
                            value={formData.salary_range}
                            onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                        />
                    </div>
                    <Textarea
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                    <Textarea
                        label="Requirements"
                        value={formData.requirements}
                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            required
                        />
                        <div className="flex items-center pt-8">
                            <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-600 bg-secondary-light text-primary focus:ring-primary"
                                />
                                Is Active?
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={formLoading}>
                            {formLoading ? 'Saving...' : 'Save Job'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Career"
                message={`Are you sure you want to delete "${selectedCareer?.title}"?`}
                isLoading={formLoading}
            />
        </div>
    );
}
