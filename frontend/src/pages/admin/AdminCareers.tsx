import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Calendar, MapPin, Briefcase, Eye, EyeOff } from 'lucide-react';
import { useCareers } from '../../hooks/useApi';
import type { Career } from '../../types';

export function AdminCareers() {
    const { data: careers, isLoading } = useCareers();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCareers = careers?.filter(career =>
        career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const departments = [...new Set(careers?.map(c => c.department) || [])];
    const activeCount = careers?.filter(c => c.is_active).length || 0;
    const upcomingDeadlines = careers?.filter(c => {
        const deadline = new Date(c.deadline);
        const now = new Date();
        const diff = deadline.getTime() - now.getTime();
        const days = diff / (1000 * 60 * 60 * 24);
        return days <= 7 && days > 0;
    }).length || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Careers</h1>
                    <p className="text-gray-400 mt-1">Manage job listings and recruitment</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                    <Plus size={18} />
                    Add Job
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-secondary rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Total Positions</p>
                    <p className="text-2xl font-bold text-white mt-1">{careers?.length || 0}</p>
                </div>
                <div className="bg-secondary rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Active Listings</p>
                    <p className="text-2xl font-bold text-accent-green mt-1">{activeCount}</p>
                </div>
                <div className="bg-secondary rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Departments</p>
                    <p className="text-2xl font-bold text-primary-light mt-1">{departments.length}</p>
                </div>
                <div className="bg-secondary rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Closing Soon</p>
                    <p className="text-2xl font-bold text-accent-orange mt-1">{upcomingDeadlines}</p>
                </div>
            </div>

            {/* Search Bar - Enhanced */}
            <div className="relative max-w-lg">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search className="text-gray-400" size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search positions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 bg-secondary-dark border-2 border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-600"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-300 transition-colors text-xl"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-secondary rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700 bg-secondary-dark">
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Position</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Department</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Location</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Deadline</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Status</th>
                            <th className="text-right py-4 px-6 text-gray-400 font-medium text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td>
                            </tr>
                        ) : filteredCareers?.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">No positions found</td>
                            </tr>
                        ) : (
                            filteredCareers?.map((career: Career) => {
                                const deadline = new Date(career.deadline);
                                const now = new Date();
                                const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                const isExpired = daysRemaining < 0;
                                const isClosingSoon = daysRemaining <= 7 && daysRemaining > 0;

                                return (
                                    <tr key={career.id} className="border-b border-gray-700/50 hover:bg-secondary-dark/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                                    <Briefcase className="text-primary-light" size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-gray-200 font-medium">{career.title}</p>
                                                    <p className="text-gray-500 text-xs capitalize">{career.employment_type.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-gray-300">{career.department}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1 text-gray-400 text-sm">
                                                <MapPin size={14} />
                                                {career.location}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className={isExpired ? 'text-red-400' : isClosingSoon ? 'text-accent-orange' : 'text-gray-400'} />
                                                <span className={`text-sm ${isExpired ? 'text-red-400' : isClosingSoon ? 'text-accent-orange' : 'text-gray-400'}`}>
                                                    {new Date(career.deadline).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                {isClosingSoon && !isExpired && (
                                                    <span className="px-1.5 py-0.5 bg-accent-orange/20 text-accent-orange text-xs rounded">
                                                        {daysRemaining}d left
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {career.is_active ? (
                                                <div className="flex items-center gap-1.5">
                                                    <Eye className="text-accent-green" size={16} />
                                                    <span className="text-accent-green text-sm">Active</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5">
                                                    <EyeOff className="text-gray-500" size={16} />
                                                    <span className="text-gray-500 text-sm">Inactive</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-gray-400 hover:text-primary-light hover:bg-primary/10 rounded-lg transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
