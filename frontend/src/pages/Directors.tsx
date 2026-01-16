import { useState } from 'react';
import { X, Users, Download, ChevronRight } from 'lucide-react';
import { Card, Button, LoadingSpinner } from '../components/ui';
import { useDirectors } from '../hooks/useApi';
import type { Director } from '../types';

export function DirectorsPage() {
    const { data: directors, isLoading } = useDirectors();
    const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);

    return (
        <div className="bg-secondary min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 pt-32">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/directors-hero.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/85 to-secondary/70" />
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <span className="text-primary-light text-sm font-semibold uppercase tracking-wider">
                        Leadership
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
                        Board of Directors
                    </h1>
                    <p className="mt-4 text-xl text-white/80 max-w-2xl mx-auto">
                        Meet the leaders guiding BIFPCL towards sustainable energy excellence through visionary governance and strategic leadership.
                    </p>
                </div>
            </section>

            {/* Directors Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-white mb-8">Member Directors</h2>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {directors?.map((director) => (
                                <Card
                                    key={director.id}
                                    dark
                                    className="overflow-hidden group cursor-pointer hover:bg-secondary-light transition-all duration-300 hover:-translate-y-1"
                                    onClick={() => setSelectedDirector(director)}
                                >
                                    {/* Photo */}
                                    <div className="relative h-56 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
                                        {director.photo ? (
                                            <img
                                                src={director.photo}
                                                alt={director.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                <Users size={64} />
                                            </div>
                                        )}
                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark/90 via-transparent to-transparent" />
                                    </div>

                                    {/* Info */}
                                    <div className="p-5">
                                        <h3 className="text-white font-semibold text-lg">{director.name}</h3>
                                        <p className="text-primary-light text-sm font-medium mt-1">{director.title}</p>
                                        <p className="text-gray-400 text-xs mt-1">{director.organization}</p>

                                        <button className="mt-4 flex items-center gap-1 text-primary-light text-sm hover:gap-2 transition-all">
                                            Profile <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Director Modal */}
            {selectedDirector && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedDirector(null)}>
                    <div
                        className="bg-gradient-to-br from-secondary-dark to-secondary rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700/50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
                            <span className="px-3 py-1 bg-primary/20 text-primary-light text-xs font-semibold rounded-full">
                                BOARD PROFILE
                            </span>
                            <button
                                onClick={() => setSelectedDirector(null)}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* Photo */}
                                <div className="w-36 h-44 flex-shrink-0 rounded-xl overflow-hidden bg-gray-700 ring-2 ring-primary/30">
                                    {selectedDirector.photo ? (
                                        <img src={selectedDirector.photo} alt={selectedDirector.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                            <Users size={48} />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedDirector.name}</h2>
                                    <p className="text-primary-light text-lg font-medium mt-1">{selectedDirector.title}</p>
                                    <p className="text-gray-400">{selectedDirector.organization}</p>

                                    <p className="mt-4 text-gray-300 leading-relaxed text-sm">{selectedDirector.bio}</p>

                                    <Button variant="outline" className="mt-6">
                                        <Download size={16} className="mr-2" />
                                        Download Full Profile
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
