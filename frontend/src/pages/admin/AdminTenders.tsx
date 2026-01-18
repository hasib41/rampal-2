import { useState } from 'react';
import { Plus, Edit2, Trash2, FileText, Download, CheckCircle } from 'lucide-react';
import { useTenders } from '../../hooks/useApi';
import { tendersApi, getMediaUrl } from '../../services/api';
import type { Tender } from '../../types';
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
    LoadingState
} from '../../components/ui';

export function AdminTenders() {
    const { data: tenders, isLoading, refetch } = useTenders();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingTender, setEditingTender] = useState<Tender | null>(null);
    const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        tender_id: '',
        title: '',
        category: 'mechanical',
        description: '',
        status: 'open',
        publication_date: new Date().toISOString().split('T')[0],
        deadline: '',
        value_range: '',
        document: null as File | null
    });

    const resetForm = () => {
        setFormData({
            tender_id: '', title: '', category: 'mechanical', description: '', status: 'open',
            publication_date: new Date().toISOString().split('T')[0], deadline: '', value_range: '', document: null
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
        } finally {
            setFormLoading(false);
            setSelectedTender(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== '') data.append(key, value);
        });
        try {
            if (editingTender) await tendersApi.update(editingTender.id, data);
            else await tendersApi.create(data);
            await refetch();
            setIsFormOpen(false);
            resetForm();
        } catch (error) {
            console.error('Failed to save tender:', error);
        } finally {
            setFormLoading(false);
        }
    };

    const filteredTenders = tenders?.filter(tender => {
        const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tender.tender_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || tender.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const statusConfig: Record<string, { variant: 'success' | 'warning' | 'primary' | 'danger' }> = {
        open: { variant: 'success' },
        evaluation: { variant: 'warning' },
        awarded: { variant: 'primary' },
        closed: { variant: 'danger' },
    };

    const openCount = tenders?.filter(t => t.status === 'open').length || 0;

    return (
        <div className="space-y-5">
            <PageHeader
                title="Tenders"
                description="Manage procurement tenders"
                action={
                    <Button size="sm" leftIcon={<Plus size={16} />} onClick={() => { resetForm(); setIsFormOpen(true); }}>
                        New Tender
                    </Button>
                }
            />

            {/* Stats */}
            <div className="flex gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                    <FileText size={16} className="text-primary-light" />
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white font-medium">{tenders?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-lg">
                    <CheckCircle size={16} className="text-emerald-400" />
                    <span className="text-gray-400">Open:</span>
                    <span className="text-white font-medium">{openCount}</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
                <div className="w-72">
                    <SearchInput
                        placeholder="Search tenders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClear={() => setSearchTerm('')}
                    />
                </div>
                <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    options={[
                        { value: 'all', label: 'All Status' },
                        { value: 'open', label: 'Open' },
                        { value: 'evaluation', label: 'Evaluation' },
                        { value: 'awarded', label: 'Awarded' },
                        { value: 'closed', label: 'Closed' },
                    ]}
                    className="w-40"
                />
            </div>

            {/* Table */}
            <Card padding="none">
                {isLoading ? (
                    <LoadingState text="Loading tenders..." />
                ) : filteredTenders?.length === 0 ? (
                    <EmptyState
                        icon={<FileText size={36} />}
                        title="No tenders found"
                        action={<Button size="sm" onClick={() => { resetForm(); setIsFormOpen(true); }} leftIcon={<Plus size={16} />}>New Tender</Button>}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02]">
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">ID</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Title</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Category</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Deadline</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Value</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Status</th>
                                    <th className="text-right py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredTenders?.map((tender) => {
                                    const status = statusConfig[tender.status] || statusConfig.open;
                                    return (
                                        <tr key={tender.id} className="hover:bg-white/[0.02]">
                                            <td className="py-3.5 px-5">
                                                <span className="font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">{tender.tender_id}</span>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <span className="text-white truncate block max-w-xs">{tender.title}</span>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <span className="text-gray-400 capitalize">{tender.category}</span>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <span className="text-gray-400">
                                                    {new Date(tender.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <span className="text-gray-400">{tender.value_range || '-'}</span>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <Badge variant={status.variant}>{tender.status}</Badge>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center justify-end gap-1">
                                                    {tender.document && (
                                                        <IconButton icon={<Download size={16} />} size="sm" tooltip="Download" onClick={() => window.open(getMediaUrl(tender.document), '_blank')} />
                                                    )}
                                                    <IconButton icon={<Edit2 size={16} />} size="sm" tooltip="Edit" onClick={() => handleEdit(tender)} />
                                                    <IconButton icon={<Trash2 size={16} />} size="sm" tooltip="Delete" variant="danger" onClick={() => { setSelectedTender(tender); setIsDeleteOpen(true); }} />
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
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingTender ? "Edit Tender" : "New Tender"}
                size="lg"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} isLoading={formLoading}>
                            {editingTender ? 'Update' : 'Create'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Tender ID" value={formData.tender_id} onChange={(e) => setFormData({ ...formData, tender_id: e.target.value })} placeholder="BIFPCL/2024/001" required />
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
                    <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                    <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} required />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Publication Date" type="date" value={formData.publication_date} onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })} required />
                        <Input label="Deadline" type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Value Range" value={formData.value_range} onChange={(e) => setFormData({ ...formData, value_range: e.target.value })} placeholder="$100k - $500k" />
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
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Document (PDF)</label>
                        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFormData({ ...formData, document: f }); }}
                            className="text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-medium file:bg-primary file:text-white cursor-pointer" />
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Tender"
                message={`Delete "${selectedTender?.tender_id}"? This cannot be undone.`}
                confirmText="Delete"
                variant="danger"
                isLoading={formLoading}
            />
        </div>
    );
}
