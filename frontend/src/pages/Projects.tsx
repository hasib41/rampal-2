import { Link } from 'react-router-dom';
import { MapPin, Zap, ExternalLink, BarChart3 } from 'lucide-react';
import { Button, LoadingSpinner } from '../components/ui';
import { useProjects } from '../hooks/useApi';
import { getMediaUrl } from '../services/api';

const statusConfig: Record<string, { bg: string; text: string; border: string; gradient: string; label: string }> = {
    operational: {
        bg: 'bg-accent-green/20',
        text: 'text-accent-green',
        border: 'border-accent-green/50',
        gradient: 'from-accent-green to-green-600',
        label: 'Operational',
    },
    construction: {
        bg: 'bg-accent-orange/20',
        text: 'text-accent-orange',
        border: 'border-accent-orange/50',
        gradient: 'from-accent-orange to-orange-600',
        label: 'Under Construction',
    },
    planning: {
        bg: 'bg-primary/20',
        text: 'text-primary-light',
        border: 'border-primary/50',
        gradient: 'from-primary to-blue-600',
        label: 'Planning',
    },
};

export function ProjectsPage() {
    const { data: projects, isLoading } = useProjects();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 pt-32">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/projects-hero.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/60" />
                <div className="relative max-w-7xl mx-auto px-4">
                    <span className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold uppercase tracking-wider">
                        <Zap size={16} />
                        Ultra-Supercritical Tech
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
                        Maitree Super<br />
                        <span className="text-primary-light">Thermal Power</span>
                    </h1>
                    <p className="mt-4 text-xl text-white/80 max-w-2xl">
                        A futuristic energy landmark at Rampal, Bangladesh featuring high-efficiency power generation through international collaboration and sustainable engineering excellence.
                    </p>
                    <div className="flex gap-4 mt-6">
                        <Button>
                            <BarChart3 className="mr-2" size={18} />
                            Technical Metrics
                        </Button>
                        <Button variant="outline">
                            <ExternalLink className="mr-2" size={18} />
                            Live Site View
                        </Button>
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="bg-secondary py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-white mb-8">All Projects</h2>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : projects?.length === 0 ? (
                        <div className="text-center text-gray-400 py-12">
                            <Zap className="mx-auto mb-2 opacity-50" size={48} />
                            <p>No projects available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects?.map((project, index) => {
                                const status = statusConfig[project.status] || statusConfig.planning;
                                return (
                                    <Link
                                        key={project.id}
                                        to={`/projects/${project.slug}`}
                                        className="group relative bg-secondary-dark rounded-2xl overflow-hidden border border-gray-700 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
                                    >
                                        {/* Hover gradient overlay */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${status.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 z-10 pointer-events-none`} />

                                        {/* Image Section */}
                                        <div className="relative h-48 sm:h-56 overflow-hidden">
                                            {project.hero_image ? (
                                                <img
                                                    src={getMediaUrl(project.hero_image)}
                                                    alt={project.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                                    <Zap size={48} className="text-gray-600" />
                                                </div>
                                            )}
                                            {/* Gradient overlays */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark via-secondary-dark/20 to-transparent" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-secondary-dark/50 via-transparent to-transparent" />

                                            {/* Status badge */}
                                            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg ${status.bg} ${status.text} border ${status.border} text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5`}>
                                                <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${status.gradient}`} />
                                                {status.label}
                                            </div>

                                            {/* Project number */}
                                            <span className="absolute top-4 right-4 text-5xl font-bold text-white/10 group-hover:text-white/20 transition-colors">
                                                0{index + 1}
                                            </span>

                                            {/* Capacity badge on image */}
                                            <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary-dark/90 backdrop-blur-sm border border-gray-700">
                                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${status.gradient} flex items-center justify-center`}>
                                                    <Zap className="text-white" size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-lg leading-none">{project.capacity_mw}</p>
                                                    <p className="text-gray-400 text-xs">MW</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="relative p-5 sm:p-6">
                                            <h3 className="text-white font-bold text-lg sm:text-xl group-hover:text-primary-light transition-colors line-clamp-2 mb-3">
                                                {project.name}
                                            </h3>

                                            <div className="flex items-center gap-2 text-gray-400">
                                                <MapPin size={16} className="text-gray-500 shrink-0" />
                                                <span className="text-sm truncate">{project.location}</span>
                                            </div>

                                            {/* View Details Button */}
                                            <div className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary/10 border border-primary/30 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                                                <span className="text-sm font-medium text-primary-light group-hover:text-white transition-colors">
                                                    View Details
                                                </span>
                                                <ExternalLink className="text-primary-light group-hover:text-white transition-colors" size={14} />
                                            </div>
                                        </div>

                                        {/* Bottom accent line */}
                                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${status.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
