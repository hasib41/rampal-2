import { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Zap, ExternalLink } from 'lucide-react';
import { useProjects } from '../../hooks/useApi';
import { projectsApi, getMediaUrl } from '../../services/api';
import type { Project } from '../../types';
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

export function AdminProjects() {
    const { data: projects, isLoading, refetch } = useProjects();
    const [searchTerm, setSearchTerm] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        capacity_mw: '',
        technology: '',
        status: 'operational',
        description: '',
        latitude: '',
        longitude: '',
        efficiency_percent: '',
        hero_image: null as File | null
    });

    const resetForm = () => {
        setFormData({
            name: '', location: '', capacity_mw: '', technology: '', status: 'operational',
            description: '', latitude: '', longitude: '', efficiency_percent: '', hero_image: null
        });
        setEditingProject(null);
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setFormData({
            name: project.name,
            location: project.location,
            capacity_mw: project.capacity_mw.toString(),
            technology: project.technology,
            status: project.status,
            description: project.description,
            latitude: project.latitude?.toString() || '',
            longitude: project.longitude?.toString() || '',
            efficiency_percent: project.efficiency_percent?.toString() || '',
            hero_image: null
        });
        setIsFormOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedProject) return;
        setFormLoading(true);
        try {
            await projectsApi.delete(selectedProject.id);
            await refetch();
            setIsDeleteOpen(false);
        } catch (error) {
            console.error('Failed to delete project:', error);
        } finally {
            setFormLoading(false);
            setSelectedProject(null);
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
            if (editingProject) await projectsApi.update(editingProject.id, data);
            else await projectsApi.create(data);
            await refetch();
            setIsFormOpen(false);
            resetForm();
        } catch (error) {
            console.error('Failed to save project:', error);
        } finally {
            setFormLoading(false);
        }
    };

    const filteredProjects = projects?.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusConfig: Record<string, { variant: 'success' | 'warning' | 'primary'; label: string }> = {
        operational: { variant: 'success', label: 'Operational' },
        construction: { variant: 'warning', label: 'Construction' },
        planning: { variant: 'primary', label: 'Planning' },
    };

    const totalCapacity = projects?.reduce((sum, p) => sum + p.capacity_mw, 0) || 0;

    return (
        <div className="space-y-5">
            <PageHeader
                title="Projects"
                description="Manage power generation projects"
                action={
                    <Button size="sm" leftIcon={<Plus size={16} />} onClick={() => { resetForm(); setIsFormOpen(true); }}>
                        Add Project
                    </Button>
                }
            />

            {/* Stats */}
            <div className="flex gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                    <Zap size={16} className="text-primary-light" />
                    <span className="text-gray-400">Projects:</span>
                    <span className="text-white font-medium">{projects?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                    <Zap size={16} className="text-amber-400" />
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white font-medium">{totalCapacity.toLocaleString()} MW</span>
                </div>
            </div>

            {/* Search */}
            <div className="w-72">
                <SearchInput
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClear={() => setSearchTerm('')}
                />
            </div>

            {/* Table */}
            <Card padding="none">
                {isLoading ? (
                    <LoadingState text="Loading projects..." />
                ) : filteredProjects?.length === 0 ? (
                    <EmptyState
                        icon={<Zap size={36} />}
                        title="No projects found"
                        action={<Button size="sm" onClick={() => { resetForm(); setIsFormOpen(true); }} leftIcon={<Plus size={16} />}>Add Project</Button>}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02]">
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Project</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Location</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Capacity</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Technology</th>
                                    <th className="text-left py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Status</th>
                                    <th className="text-right py-3.5 px-5 text-sm font-medium text-gray-400 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredProjects?.map((project: Project) => {
                                    const status = statusConfig[project.status] || statusConfig.operational;
                                    return (
                                        <tr key={project.id} className="hover:bg-white/[0.02]">
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded bg-white/5 overflow-hidden flex-shrink-0">
                                                        {project.hero_image ? (
                                                            <img src={getMediaUrl(project.hero_image)} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Zap size={16} className="text-gray-500" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-white font-medium">{project.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center gap-1.5 text-gray-400">
                                                    <MapPin size={14} />
                                                    {project.location}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <span className="text-white font-medium">{project.capacity_mw} MW</span>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <span className="text-gray-400">{project.technology}</span>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <Badge variant={status.variant}>{status.label}</Badge>
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center justify-end gap-1">
                                                    <IconButton icon={<ExternalLink size={16} />} size="sm" tooltip="View" onClick={() => window.open(`/projects/${project.slug}`, '_blank')} />
                                                    <IconButton icon={<Edit2 size={16} />} size="sm" tooltip="Edit" onClick={() => handleEdit(project)} />
                                                    <IconButton icon={<Trash2 size={16} />} size="sm" tooltip="Delete" variant="danger" onClick={() => { setSelectedProject(project); setIsDeleteOpen(true); }} />
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
                title={editingProject ? "Edit Project" : "Add Project"}
                size="lg"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} isLoading={formLoading}>
                            {editingProject ? 'Update' : 'Create'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Project Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        <Input label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Input label="Capacity (MW)" type="number" value={formData.capacity_mw} onChange={(e) => setFormData({ ...formData, capacity_mw: e.target.value })} required />
                        <Input label="Technology" value={formData.technology} onChange={(e) => setFormData({ ...formData, technology: e.target.value })} required />
                        <Select
                            label="Status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            options={[
                                { value: 'operational', label: 'Operational' },
                                { value: 'construction', label: 'Under Construction' },
                                { value: 'planning', label: 'Planning' }
                            ]}
                        />
                    </div>
                    <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} required />
                    <div className="grid grid-cols-3 gap-4">
                        <Input label="Latitude" type="number" step="any" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} />
                        <Input label="Longitude" type="number" step="any" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} />
                        <Input label="Efficiency (%)" type="number" step="0.01" value={formData.efficiency_percent} onChange={(e) => setFormData({ ...formData, efficiency_percent: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Hero Image</label>
                        <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFormData({ ...formData, hero_image: f }); }}
                            className="text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-medium file:bg-primary file:text-white cursor-pointer" />
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Project"
                message={`Delete "${selectedProject?.name}"? This cannot be undone.`}
                confirmText="Delete"
                variant="danger"
                isLoading={formLoading}
            />
        </div>
    );
}
