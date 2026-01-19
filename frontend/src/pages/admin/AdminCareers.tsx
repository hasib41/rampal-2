import { useState } from 'react';
import { Plus, Edit2, Trash2, Briefcase, MapPin } from 'lucide-react';
import { useCareers } from '../../hooks/useApi';
import { careersApi } from '../../services/api';
import type { Career } from '../../types';
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

export function AdminCareers() {
    const { data: careers, isLoading, refetch } = useCareers();
    const [searchTerm, setSearchTerm] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingCareer, setEditingCareer] = useState<Career | null>(null);
    const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
    const [formLoading, setFormLoading] = useState(false);

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
            title: '', department: '', location: '', employment_type: 'full_time',
            description: '', requirements: '', salary_range: '', deadline: '', is_active: true
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
                await careersApi.update(editingCareer.id, { ...editingCareer, ...formData, employment_type: formData.employment_type as Career['employment_type'] });
            } else {
                await careersApi.create({ ...formData, id: 0, employment_type: formData.employment_type as Career['employment_type'] });
            }
            await refetch();
            setIsFormOpen(false);
            resetForm();
        } catch (error) {
            console.error('Failed to save career:', error);
        } finally {
            setFormLoading(false);
        }
    };

    const filteredCareers = careers?.filter(career =>
        career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCount = careers?.filter(c => c.is_active).length || 0;

    return (
        <div className="space-y-5">
            <PageHeader
                title="Careers"
                description="Manage job listings"
                action={
                    <Button size="sm" leftIcon={<Plus size={16} />} onClick={() => { resetForm(); setIsFormOpen(true); }}>
                        Post Job
                    </Button>
                }
            />

            {/* Stats */}
            <div className="flex gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-lg">
                    <Briefcase size={16} className="text-primary" />
                    <span className="text-gray-600 dark:text-gray-400">Total:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{careers?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-lg">
                    <Briefcase size={16} className="text-emerald-500 dark:text-emerald-400" />
                    <span className="text-gray-600 dark:text-gray-400">Active:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{activeCount}</span>
                </div>
            </div>

            {/* Search */}
            <div className="w-72">
                <SearchInput
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClear={() => setSearchTerm('')}
                />
            </div>

            {/* Table */}
            <Card padding="none">
                {isLoading ? (
                    <LoadingState text="Loading careers..." />
                ) : filteredCareers?.length === 0 ? (
                    <EmptyState
                        icon={<Briefcase size={36} />}
                        title="No job listings"
                        action={<Button size="sm" onClick={() => { resetForm(); setIsFormOpen(true); }} leftIcon={<Plus size={16} />}>Post Job</Button>}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02]">
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Position</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Department</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Location</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Type</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Deadline</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                                    <th className="text-right py-3.5 px-5 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {filteredCareers?.map((career) => (
                                    <tr key={career.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                                        <td className="py-3.5 px-5">
                                            <span className="text-gray-900 dark:text-white font-medium">{career.title}</span>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <span className="text-gray-600 dark:text-gray-400">{career.department}</span>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                                <MapPin size={14} />
                                                {career.location}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <Badge variant="default">{career.employment_type.replace('_', ' ')}</Badge>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {new Date(career.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <Badge variant={career.is_active ? 'success' : 'danger'}>
                                                {career.is_active ? 'Active' : 'Closed'}
                                            </Badge>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center justify-end gap-1">
                                                <IconButton icon={<Edit2 size={16} />} size="sm" tooltip="Edit" onClick={() => handleEdit(career)} />
                                                <IconButton icon={<Trash2 size={16} />} size="sm" tooltip="Delete" variant="danger" onClick={() => { setSelectedCareer(career); setIsDeleteOpen(true); }} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingCareer ? "Edit Job" : "Post Job"}
                size="lg"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} isLoading={formLoading}>
                            {editingCareer ? 'Update' : 'Post'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Job Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required />
                        <Input label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Select
                            label="Type"
                            value={formData.employment_type}
                            onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                            options={[
                                { value: 'full_time', label: 'Full Time' },
                                { value: 'contract', label: 'Contract' }
                            ]}
                        />
                        <Input label="Salary Range" value={formData.salary_range} onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })} />
                        <Input label="Deadline" type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
                    </div>
                    <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} required />
                    <Textarea label="Requirements" value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} rows={3} required />
                    <Checkbox
                        checked={formData.is_active}
                        onChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        label="Active (visible to applicants)"
                    />
                </form>
            </Modal>

            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Job"
                message={`Delete "${selectedCareer?.title}"? This cannot be undone.`}
                confirmText="Delete"
                variant="danger"
                isLoading={formLoading}
            />
        </div>
    );
}
