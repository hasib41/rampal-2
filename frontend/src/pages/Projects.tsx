import { Link } from 'react-router-dom';
import { MapPin, Zap } from 'lucide-react';
import { PageHeader, Card, Button, LoadingSpinner } from '../components/ui';
import { useProjects } from '../hooks/useApi';

const statusColors = {
    operational: 'bg-accent-green',
    construction: 'bg-accent-orange',
    planning: 'bg-accent-blue',
};

const statusLabels = {
    operational: 'Operational',
    construction: 'Under Construction',
    planning: 'Planning',
};

export function ProjectsPage() {
    const { data: projects, isLoading } = useProjects();

    return (
        <div className="bg-secondary min-h-screen">
            <PageHeader
                title="Our Projects"
                subtitle="Explore our power generation facilities driving sustainable energy for Bangladesh."
            />

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : projects?.length === 0 ? (
                        <div className="text-center text-gray-400 py-12">
                            <p>No projects available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects?.map((project) => (
                                <Card key={project.id} dark className="group hover:scale-105 transition-transform duration-300">
                                    <div className="relative h-48 overflow-hidden bg-gray-700">
                                        {project.hero_image ? (
                                            <img src={project.hero_image} alt={project.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Zap size={48} className="text-gray-500" />
                                            </div>
                                        )}
                                        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColors[project.status]}`}>
                                            {statusLabels[project.status]}
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-white font-bold text-xl">{project.name}</h3>
                                        <div className="flex items-center gap-2 mt-2 text-gray-400">
                                            <MapPin size={16} />
                                            <span className="text-sm">{project.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 text-primary-light">
                                            <Zap size={16} />
                                            <span className="font-semibold">{project.capacity_mw} MW</span>
                                        </div>
                                        <Link to={`/projects/${project.slug}`}>
                                            <Button variant="outline" size="sm" className="mt-4 w-full">
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
