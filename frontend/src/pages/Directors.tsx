import { useState } from 'react';
import { X, Users, Download, ChevronRight, Award, Building2 } from 'lucide-react';
import { Button, LoadingSpinner } from '../components/ui';
import { useDirectors } from '../hooks/useApi';
import { getMediaUrl } from '../services/api';
import type { Director } from '../types';

export function DirectorsPage() {
    const { data: directors, isLoading } = useDirectors();
    const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);

    return (
        <div className="bg-slate-50 dark:bg-secondary min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 pt-32 bg-gradient-to-r from-emerald-900 to-teal-800">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/directors-hero.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-teal-800/75 to-emerald-900/85" />
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-emerald-300 text-sm font-semibold uppercase tracking-wider border border-white/20">
                        <Award size={14} />
                        Leadership
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">
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
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
                            <Users className="text-white" size={22} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Member Directors</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Our distinguished board members</p>
                        </div>
                    </div>

                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {directors?.map((director, index) => (
                                <div
                                    key={director.id}
                                    className="group bg-white dark:bg-secondary-dark rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-800 shadow-sm"
                                    onClick={() => setSelectedDirector(director)}
                                >
                                    {/* Photo */}
                                    <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                                        {director.photo ? (
                                            <img
                                                src={getMediaUrl(director.photo)}
                                                alt={director.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                                                <Users size={72} />
                                            </div>
                                        )}

                                        {/* Order Badge */}
                                        <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center shadow-md">
                                            <span className="text-primary font-bold text-sm">{String(index + 1).padStart(2, '0')}</span>
                                        </div>

                                    </div>

                                    {/* Info */}
                                    <div className="p-5 relative -mt-8">
                                        <div className="bg-white dark:bg-secondary-dark rounded-xl p-4 shadow-lg shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-gray-700">
                                            <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-tight">{director.name}</h3>
                                            <p className="text-primary text-sm font-semibold mt-1">{director.title}</p>
                                            <div className="flex items-center gap-1.5 mt-2 text-gray-500 dark:text-gray-400">
                                                <Building2 size={12} />
                                                <p className="text-xs truncate">{director.organization}</p>
                                            </div>

                                            <button className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 bg-primary/10 hover:bg-primary hover:text-white text-primary text-sm font-medium rounded-lg transition-all group-hover:bg-primary group-hover:text-white">
                                                View Profile <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && (!directors || directors.length === 0) && (
                        <div className="text-center py-20 bg-white dark:bg-secondary-dark rounded-2xl border border-gray-100 dark:border-gray-800">
                            <Users className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
                            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No directors found</p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Check back later for updates</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Director Modal */}
            {selectedDirector && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-sm"
                    onClick={() => setSelectedDirector(null)}
                >
                    <div
                        className="bg-white dark:bg-secondary-dark rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                    <Award className="text-white" size={18} />
                                </div>
                                <div>
                                    <span className="text-gray-900 dark:text-white font-semibold">Board Profile</span>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">Director Information</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedDirector(null)}
                                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* Photo */}
                                <div className="w-40 h-48 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 ring-4 ring-primary/20 shadow-xl">
                                    {selectedDirector.photo ? (
                                        <img src={getMediaUrl(selectedDirector.photo)} alt={selectedDirector.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                                            <Users size={56} />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{selectedDirector.name}</h2>
                                    <p className="text-primary text-lg font-semibold mt-1">{selectedDirector.title}</p>
                                    <div className="flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-400">
                                        <Building2 size={14} />
                                        <p className="text-sm">{selectedDirector.organization}</p>
                                    </div>

                                    <div className="mt-5 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <h4 className="text-gray-900 dark:text-white font-semibold text-sm mb-2">Biography</h4>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                            {selectedDirector.bio || 'No biography available.'}
                                        </p>
                                    </div>

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
