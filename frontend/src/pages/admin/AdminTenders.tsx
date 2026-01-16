import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Calendar, FileText, Download } from 'lucide-react';
import { useTenders } from '../../hooks/useApi';
import type { Tender } from '../../types';

export function AdminTenders() {
    const { data: tenders, isLoading } = useTenders();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredTenders = tenders?.filter(tender => {
        const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tender.tender_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || tender.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusColors: Record<string, string> = {
        open: 'bg-accent-green/20 text-accent-green',
        evaluation: 'bg-accent-orange/20 text-accent-orange',
        awarded: 'bg-primary/20 text-primary-light',
        closed: 'bg-gray-500/20 text-gray-400',
    };

    const categoryColors: Record<string, string> = {
        mechanical: 'bg-blue-500/20 text-blue-400',
        electrical: 'bg-yellow-500/20 text-yellow-400',
        civil: 'bg-purple-500/20 text-purple-400',
        it: 'bg-cyan-500/20 text-cyan-400',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tenders</h1>
                    <p className="text-gray-400 mt-1">Manage procurement and tender notices</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                    <Plus size={18} />
                    Add Tender
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {['open', 'evaluation', 'awarded', 'closed'].map(status => {
                    const count = tenders?.filter(t => t.status === status).length || 0;
                    return (
                        <div
                            key={status}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${statusFilter === status
                                    ? 'bg-primary/10 border-primary'
                                    : 'bg-secondary border-gray-700 hover:border-gray-600'
                                }`}
                            onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
                        >
                            <p className="text-gray-400 text-sm capitalize">{status}</p>
                            <p className="text-2xl font-bold text-white mt-1">{count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                    type="text"
                    placeholder="Search by title or tender ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary"
                />
            </div>

            {/* Table */}
            <div className="bg-secondary rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700 bg-secondary-dark">
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Tender ID</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Title</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Category</th>
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
                        ) : filteredTenders?.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">No tenders found</td>
                            </tr>
                        ) : (
                            filteredTenders?.map((tender: Tender) => (
                                <tr key={tender.id} className="border-b border-gray-700/50 hover:bg-secondary-dark/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <FileText className="text-gray-500" size={16} />
                                            <span className="text-gray-300 font-mono text-sm">{tender.tender_id}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="text-gray-200 font-medium truncate max-w-xs">{tender.title}</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${categoryColors[tender.category] || 'bg-gray-500/20 text-gray-400'}`}>
                                            {tender.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Calendar size={14} />
                                            {new Date(tender.deadline).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[tender.status]}`}>
                                            {tender.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-primary-light hover:bg-primary/10 rounded-lg transition-colors">
                                                <Download size={16} />
                                            </button>
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
