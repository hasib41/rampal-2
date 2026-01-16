import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Calendar, Eye, EyeOff } from 'lucide-react';
import { useNotices } from '../../hooks/useApi';
import type { Notice } from '../../types';

export function AdminNotices() {
    const { data: notices, isLoading } = useNotices();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNotices = notices?.filter(notice =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categoryColors: Record<string, string> = {
        general: 'bg-primary/20 text-primary-light',
        urgent: 'bg-red-500/20 text-red-400',
        tender: 'bg-accent-orange/20 text-accent-orange',
        recruitment: 'bg-accent-green/20 text-accent-green',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Notices</h1>
                    <p className="text-gray-400 mt-1">Manage notice board announcements</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                    <Plus size={18} />
                    Add Notice
                </button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-secondary rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700 bg-secondary-dark">
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Title</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Category</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Date</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Status</th>
                            <th className="text-right py-4 px-6 text-gray-400 font-medium text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">Loading...</td>
                            </tr>
                        ) : filteredNotices?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">No notices found</td>
                            </tr>
                        ) : (
                            filteredNotices?.map((notice: Notice) => (
                                <tr key={notice.id} className="border-b border-gray-700/50 hover:bg-secondary-dark/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <p className="text-gray-200 font-medium truncate max-w-md">{notice.title}</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[notice.category] || categoryColors.general}`}>
                                            {notice.category_display}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Calendar size={14} />
                                            {new Date(notice.published_date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <Eye className="text-accent-green" size={16} />
                                            <span className="text-accent-green text-sm">Active</span>
                                        </div>
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
