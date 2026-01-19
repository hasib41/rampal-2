import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Zap, Gauge, Calendar } from 'lucide-react';
import { Button, Card, LoadingSpinner } from '../components/ui';
import { useProject } from '../hooks/useApi';
import { getMediaUrl } from '../services/api';

export function ProjectDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { data: project, isLoading, error } = useProject(slug || '');

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-secondary pt-24 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-secondary pt-24">
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl text-gray-900 dark:text-white">Project not found</h1>
                    <Link to="/projects" className="text-primary mt-4 inline-block">
                        ← Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-secondary">
            {/* Hero */}
            <section className="relative h-[60vh] min-h-[400px] bg-gradient-to-r from-emerald-900 to-teal-800">
                {project.hero_image && (
                    <img src={getMediaUrl(project.hero_image)} alt={project.name} className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-teal-800/75 to-emerald-900/85 z-10" />
                <div className="relative z-20 h-full flex items-end">
                    <div className="max-w-7xl mx-auto px-4 pb-12 w-full">
                        <Link to="/projects" className="text-white/70 hover:text-white flex items-center gap-2 mb-4 transition-colors">
                            <ArrowLeft size={20} /> Back to Projects
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">{project.name}</h1>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <span className="flex items-center gap-2 text-white/80">
                                <MapPin size={18} /> {project.location}
                            </span>
                            <span className="flex items-center gap-2 text-emerald-300 font-semibold">
                                <Zap size={18} /> {project.capacity_mw} MW
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Project</h2>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{project.description}</p>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Specifications</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Zap className="text-primary" size={20} />
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Capacity</p>
                                            <p className="text-gray-900 dark:text-white font-semibold">{project.capacity_mw} MW</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Gauge className="text-primary" size={20} />
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Technology</p>
                                            <p className="text-gray-900 dark:text-white font-semibold">{project.technology}</p>
                                        </div>
                                    </div>
                                    {project.efficiency_percent && (
                                        <div className="flex items-center gap-3">
                                            <Calendar className="text-primary" size={20} />
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">Efficiency</p>
                                                <p className="text-gray-900 dark:text-white font-semibold">{project.efficiency_percent}%</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <Link to="/contact">
                                <Button className="w-full">Contact for Inquiries</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
