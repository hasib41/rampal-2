import { useState } from 'react';
import { X, Users } from 'lucide-react';
import { PageHeader, Card, Button, LoadingSpinner } from '../components/ui';
import { useDirectors } from '../hooks/useApi';
import type { Director } from '../types';

export function DirectorsPage() {
    const { data: directors, isLoading } = useDirectors();
    const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);

    return (
        <div className="bg-secondary min-h-screen">
            <PageHeader
                title="Board of Directors"
                subtitle="Meet the leaders guiding BIFPCL towards sustainable energy excellence."
            />

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {directors?.map((director) => (
                                <Card
                                    key={director.id}
                                    dark
                                    className="p-6 text-center cursor-pointer hover:bg-secondary transition-colors"
                                    onClick={() => setSelectedDirector(director)}
                                >
                                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-700">
                                        {director.photo ? (
                                            <img src={director.photo} alt={director.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Users size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="mt-4 text-white font-semibold">{director.name}</h3>
                                    <p className="text-primary-light text-sm">{director.title}</p>
                                    <p className="text-gray-400 text-xs mt-1">{director.organization}</p>
                                    <Button variant="outline" size="sm" className="mt-4">
                                        View Profile
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Director Modal */}
            {selectedDirector && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setSelectedDirector(null)}>
                    <div className="bg-secondary-dark rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Board Profile</span>
                            <button onClick={() => setSelectedDirector(null)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-700">
                                    {selectedDirector.photo ? (
                                        <img src={selectedDirector.photo} alt={selectedDirector.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Users size={48} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedDirector.name}</h2>
                                    <p className="text-primary-light">{selectedDirector.title}</p>
                                    <p className="text-gray-400 text-sm">{selectedDirector.organization}</p>
                                </div>
                            </div>
                            <p className="mt-6 text-gray-300 leading-relaxed">{selectedDirector.bio}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
