import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Users, GripVertical } from 'lucide-react';
import { useDirectors } from '../../hooks/useApi';
import type { Director } from '../../types';

export function AdminDirectors() {
    const { data: directors, isLoading } = useDirectors();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDirectors = directors?.filter(director =>
        director.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        director.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Board of Directors</h1>
                    <p className="text-gray-400 mt-1">Manage director profiles and information</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                    <Plus size={18} />
                    Add Director
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                    type="text"
                    placeholder="Search directors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary"
                />
            </div>

            {/* Directors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    <div className="col-span-full text-center py-8 text-gray-500">Loading...</div>
                ) : filteredDirectors?.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">No directors found</div>
                ) : (
                    filteredDirectors?.map((director: Director) => (
                        <div
                            key={director.id}
                            className="bg-secondary rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <GripVertical className="text-gray-600 cursor-grab" size={20} />
                                </div>
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                                    {director.photo ? (
                                        <img src={director.photo} alt={director.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                            <Users size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-white font-semibold">{director.name}</h3>
                                            <p className="text-primary-light text-sm">{director.title}</p>
                                            <p className="text-gray-500 text-xs mt-1">{director.organization}</p>
                                        </div>
                                        {director.is_chairman && (
                                            <span className="px-2 py-0.5 bg-accent-orange/20 text-accent-orange text-xs rounded">
                                                Chairman
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-gray-400 hover:text-primary-light hover:bg-primary/10 rounded-lg transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
