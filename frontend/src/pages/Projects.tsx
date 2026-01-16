import { Link } from 'react-router-dom';
import { MapPin, Zap, ExternalLink, BarChart3 } from 'lucide-react';
import { Card, Button, LoadingSpinner } from '../components/ui';
import { useProjects } from '../hooks/useApi';

const statusColors: Record<string, string> = {
    operational: 'bg-accent-green',
    construction: 'bg-accent-orange',
    planning: 'bg-accent-blue',
};

const statusLabels: Record<string, string> = {
    operational: 'Operational',
    construction: 'Under Construction',
    planning: 'Planning',
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects?.map((project) => (
                                <Card
                                    key={project.id}
                                    dark
                                    className="group hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                                >
                                    <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
                                        {project.hero_image ? (
                                            <img
                                                src={project.hero_image}
                                                alt={project.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Zap size={64} className="text-gray-600" />
                                            </div>
                                        )}
                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark via-transparent to-transparent" />
                                        {/* Status badge */}
                                        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColors[project.status]}`}>
                                            {statusLabels[project.status]}
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-white font-bold text-xl group-hover:text-primary-light transition-colors">{project.name}</h3>
                                        <div className="flex items-center gap-2 mt-3 text-gray-400">
                                            <MapPin size={16} />
                                            <span className="text-sm">{project.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Zap size={16} className="text-primary-light" />
                                            <span className="text-primary-light font-bold text-lg">{project.capacity_mw} MW</span>
                                        </div>
                                        <Link to={`/projects/${project.slug}`}>
                                            <Button variant="outline" size="sm" className="mt-5 w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
