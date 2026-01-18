import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, FileText, Calendar, DollarSign, X } from 'lucide-react';
import { useTenders } from '../../hooks/useApi';
import { tendersApi } from '../../services/api';
import type { Tender } from '../../types';
import { Button, Input, Select, Textarea, Modal, ConfirmModal } from '../../components/ui';

export function AdminTenders() {
    const { data: tenders, isLoading, refetch } = useTenders();
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingTender, setEditingTender] = useState<Tender | null>(null);
    const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        tender_id: '',
        title: '',
        category: 'mechanical',
        description: '',
        status: 'open',
        publication_date: '',
        deadline: '',
        value_range: '',
        document: null as File | null
    });

    const resetForm = () => {
        setFormData({
            tender_id: '',
            title: '',
            category: 'mechanical',
            description: '',
            status: 'open',
            publication_date: '',
            deadline: '',
            value_range: '',
            document: null
        });
        setEditingTender(null);
    };

    const handleEdit = (tender: Tender) => {
        setEditingTender(tender);
        setFormData({
            tender_id: tender.tender_id,
            title: tender.title,
            category: tender.category,
            description: tender.description,
            status: tender.status,
            publication_date: tender.publication_date,
            deadline: tender.deadline,
            value_range: tender.value_range,
            document: null
        });
        setIsFormOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedTender) return;
        setFormLoading(true);
        try {
            await tendersApi.delete(selectedTender.id);
            await refetch();
            setIsDeleteOpen(false);
        } catch (error) {
            console.error('Failed to delete tender:', error);
            alert('Failed to delete tender');
        } finally {
            setFormLoading(false);
            setSelectedTender(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        const data = new FormData();
        data.append('tender_id', formData.tender_id);
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('status', formData.status);
        data.append('publication_date', formData.publication_date);
        data.append('deadline', formData.deadline);
        data.append('value_range', formData.value_range);
        if (formData.document) {
            data.append('document', formData.document);
        }

        try {
            if (editingTender) {
                await tendersApi.update(editingTender.id, data);
            } else {
                await tendersApi.create(data);
            }
            await refetch();
            setIsFormOpen(false);
            resetForm();
        } catch (error) {
            console.error('Failed to save tender:', error);
            alert('Failed to save tender');
        } finally {
            setFormLoading(false);
        }
    };

    const filteredTenders = tenders?.filter(tender =>
        tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.tender_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusColors: Record<string, string> = {
        open: 'bg-accent-green/20 text-accent-green',
        evaluation: 'bg-accent-orange/20 text-accent-orange',
        awarded: 'bg-primary/20 text-primary-light',
        closed: 'bg-red-500/20 text-red-500',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tenders</h1>
                    <p className="text-gray-400 mt-1">Manage procurement tenders</p>
                </div>
                <Button onClick={() => { resetForm(); setIsFormOpen(true); }}>
                    <Plus size={18} className="mr-2" />
                    New Tender
                </Button>
            </div>

            {/* Search Bar - Enhanced */}
            <div className="relative max-w-lg">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search className="text-gray-400" size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search tenders..."
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

            {/* Tenders Grid */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="col-span-full text-center py-8 text-gray-500">Loading...</div>
                ) : filteredTenders?.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">No tenders found</div>
                ) : (
                    filteredTenders?.map((tender) => (
                        <div
                            key={tender.id}
                            className="bg-secondary rounded-xl border border-gray-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gray-600 transition-colors group"
                        >
                            <div className="flex-1">
                                <div className="flex items-center justify-between md:justify-start gap-4 mb-2">
                                    <span className="text-sm font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">
                                        {tender.tender_id}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusColors[tender.status]}`}>
                                        {tender.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{tender.title}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={16} />
                                        {tender.value_range}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        Deadline: {tender.deadline}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-gray-400 hover:text-primary-light hover:bg-primary/10 rounded transition-colors">
                                    <FileText size={18} />
                                </button>
                                <button
                                    onClick={() => handleEdit(tender)}
                                    className="p-2 text-gray-400 hover:text-primary-light hover:bg-primary/10 rounded transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => { setSelectedTender(tender); setIsDeleteOpen(true); }}
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
                title={editingTender ? "Edit Tender" : "New Tender"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Tender ID"
                            value={formData.tender_id}
                            onChange={(e) => setFormData({ ...formData, tender_id: e.target.value })}
                            required
                        />
                        <Select
                            label="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            options={[
                                { value: 'mechanical', label: 'Mechanical' },
                                { value: 'electrical', label: 'Electrical' },
                                { value: 'civil', label: 'Civil' },
                                { value: 'it', label: 'IT Services' }
                            ]}
                        />
                    </div>
                    <Input
                        label="Tender Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <Textarea
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Publication Date"
                            type="date"
                            value={formData.publication_date}
                            onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
                            required
                        />
                        <Input
                            label="Deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Value Range"
                            value={formData.value_range}
                            onChange={(e) => setFormData({ ...formData, value_range: e.target.value })}
                        />
                        <Select
                            label="Status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            options={[
                                { value: 'open', label: 'Open' },
                                { value: 'evaluation', label: 'Evaluation' },
                                { value: 'awarded', label: 'Awarded' },
                                { value: 'closed', label: 'Closed' }
                            ]}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Tender Document (PDF)</label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setFormData({ ...formData, document: file });
                            }}
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                        />
                        {editingTender?.document && !formData.document && (
                            <p className="text-xs text-gray-500 mt-1">Current: {editingTender.document}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={formLoading}>
                            {formLoading ? 'Saving...' : 'Save Tender'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Tender"
                message={`Are you sure you want to delete "${selectedTender?.tender_id}"?`}
                isLoading={formLoading}
            />
        </div>
    );
}
