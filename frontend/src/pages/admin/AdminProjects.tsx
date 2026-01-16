import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, MapPin, Zap, Eye } from 'lucide-react';
import { useProjects } from '../../hooks/useApi';
import type { Project } from '../../types';

export function AdminProjects() {
    const { data: projects, isLoading } = useProjects();
    const [searchTerm, setSearchTerm] = useState('');

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
                <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                    <Plus size={18} />
                    Add Project
                </button>
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

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary"
                />
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
                                        <button className="p-1.5 text-gray-400 hover:text-primary-light hover:bg-primary/10 rounded transition-colors">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-primary-light hover:bg-primary/10 rounded transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
