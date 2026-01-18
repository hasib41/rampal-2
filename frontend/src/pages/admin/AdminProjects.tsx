import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, MapPin, Zap, Eye, X } from 'lucide-react';
import { useProjects } from '../../hooks/useApi';
import { projectsApi } from '../../services/api';
import type { Project } from '../../types';
import { Button, Input, Select, Textarea, Modal, ConfirmModal } from '../../components/ui';

export function AdminProjects() {
    const { data: projects, isLoading, refetch } = useProjects();
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    // Form State
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
            name: '',
            location: '',
            capacity_mw: '',
            technology: '',
            status: 'operational',
            description: '',
            latitude: '',
            longitude: '',
            efficiency_percent: '',
            hero_image: null
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
            alert('Failed to delete project');
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
            if (value !== null && value !== '') {
                data.append(key, value);
            }
        });

        try {
            if (editingProject) {
                await projectsApi.update(editingProject.id, data);
            } else {
                await projectsApi.create(data);
            }
            await refetch();
            setIsFormOpen(false);
            resetForm();
        } catch (error) {
            console.error('Failed to save project:', error);
            alert('Failed to save project');
        } finally {
            setFormLoading(false);
        }
    };

    const filteredProjects = projects?.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusColors: Record<string, string> = {
        operational: 'bg-accent-green/20 text-accent-green',
        construction: 'bg-accent-orange/20 text-accent-orange',
        planning: 'bg-primary/20 text-primary-light',
    };

    const totalCapacity = projects?.reduce((sum, p) => sum + p.capacity_mw, 0) || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Projects</h1>
                    <p className="text-gray-400 mt-1">Manage power generation projects</p>
                </div>
                <Button onClick={() => { resetForm(); setIsFormOpen(true); }}>
                    <Plus size={18} className="mr-2" />
                    Add Project
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-secondary rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Total Projects</p>
                    <p className="text-2xl font-bold text-white mt-1">{projects?.length || 0}</p>
                </div>
                <div className="bg-secondary rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Total Capacity</p>
                    <p className="text-2xl font-bold text-white mt-1">{totalCapacity.toLocaleString()} MW</p>
                </div>
                <div className="bg-secondary rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Operational</p>
                    <p className="text-2xl font-bold text-accent-green mt-1">
                        {projects?.filter(p => p.status === 'operational').length || 0}
                    </p>
                </div>
            </div>

            {/* Search Bar - Enhanced */}
            <div className="relative max-w-lg">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search className="text-gray-400" size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search projects..."
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

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {isLoading ? (
                    <div className="col-span-full text-center py-8 text-gray-500">Loading...</div>
                ) : filteredProjects?.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">No projects found</div>
                ) : (
                    filteredProjects?.map((project: Project) => (
                        <div
                            key={project.id}
                            className="bg-secondary rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors group"
                        >
                            <div className="flex">
                                {/* Image */}
                                <div className="w-32 h-32 flex-shrink-0 bg-gray-700">
                                    {project.hero_image ? (
                                        <img src={project.hero_image} alt={project.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                            <Zap size={32} />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-white font-semibold">{project.name}</h3>
                                            <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                                                <MapPin size={14} />
                                                {project.location}
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusColors[project.status]}`}>
                                            {project.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 mt-3 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Zap className="text-primary-light" size={14} />
                                            <span className="text-gray-300">{project.capacity_mw} MW</span>
                                        </div>
                                        <span className="text-gray-500">{project.technology}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => window.open(`/project/${project.slug}`, '_blank')}
                                            className="p-1.5 text-gray-400 hover:text-primary-light hover:bg-primary/10 rounded transition-colors"
                                            title="View Project"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="p-1.5 text-gray-400 hover:text-primary-light hover:bg-primary/10 rounded transition-colors"
                                            title="Edit Project"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => { setSelectedProject(project); setIsDeleteOpen(true); }}
                                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                            title="Delete Project"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
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
                title={editingProject ? "Edit Project" : "Add Project"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Project Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Capacity (MW)"
                            type="number"
                            value={formData.capacity_mw}
                            onChange={(e) => setFormData({ ...formData, capacity_mw: e.target.value })}
                            required
                        />
                        <Select
                            label="Status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            options={[
                                { value: 'operational', label: 'Operational' },
                                { value: 'construction', 'label': 'Under Construction' },
                                { value: 'planning', label: 'Planning' }
                            ]}
                        />
                    </div>
                    <Input
                        label="Technology"
                        value={formData.technology}
                        onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                        required
                    />
                    <Textarea
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            label="Latitude"
                            type="number"
                            step="any"
                            value={formData.latitude}
                            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        />
                        <Input
                            label="Longitude"
                            type="number"
                            step="any"
                            value={formData.longitude}
                            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        />
                        <Input
                            label="Efficiency (%)"
                            type="number"
                            step="0.01"
                            value={formData.efficiency_percent}
                            onChange={(e) => setFormData({ ...formData, efficiency_percent: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Hero Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setFormData({ ...formData, hero_image: file });
                            }}
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                        />
                        {editingProject?.hero_image && !formData.hero_image && (
                            <p className="text-xs text-gray-500 mt-1">Current: {editingProject.hero_image}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={formLoading}>
                            {formLoading ? 'Saving...' : 'Save Project'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Project"
                message={`Are you sure you want to delete "${selectedProject?.name}"? This action cannot be undone.`}
                isLoading={formLoading}
            />
        </div>
    );
}
