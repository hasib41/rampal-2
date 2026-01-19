import { useState } from 'react';
import { Search, Download, Calendar, Eye, Filter } from 'lucide-react';
import { Card, Select, LoadingSpinner, Button } from '../components/ui';
import { useTenders } from '../hooks/useApi';
import { getMediaUrl } from '../services/api';

const statusColors: Record<string, string> = {
    open: 'bg-accent-green',
    evaluation: 'bg-accent-orange',
    awarded: 'bg-accent-blue',
    closed: 'bg-gray-500',
};

const statusLabels: Record<string, string> = {
    open: 'OPEN',
    evaluation: 'EVALUATION',
    awarded: 'AWARDED',
    closed: 'CLOSED',
};

const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'mechanical', label: 'Mechanical' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'civil', label: 'Civil' },
    { value: 'it', label: 'IT Services' },
];

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'evaluation', label: 'Evaluation' },
    { value: 'awarded', label: 'Awarded' },
    { value: 'closed', label: 'Closed' },
];

export function TendersPage() {
    const [filters, setFilters] = useState({ category: '', status: '' });
    const [search, setSearch] = useState('');
    const { data: tenders, isLoading } = useTenders(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    );

    const filteredTenders = tenders?.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.tender_id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-16 pt-28 bg-secondary-dark">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url('/tenders-hero.jpg')` }}
                />
                <div className="relative max-w-7xl mx-auto px-4">
                    <span className="text-primary-light text-sm font-semibold uppercase tracking-wider">
                        Procurement Portal
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
                        Tenders & Procurement Database
                    </h1>
                    <p className="mt-2 text-gray-400 max-w-2xl">
                        Access comprehensive public and restricted procurement opportunities for the Bangladesh-India Friendship Power Company (Pvt.) Ltd.
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                        <Button variant="outline" size="sm">
                            <Download className="mr-2" size={16} />
                            Export CSV
                        </Button>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="bg-secondary-dark py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Search & Filters */}
                    <Card dark className="p-4 mb-6">
                        <div className="flex flex-wrap gap-4 items-end">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <Search className="text-gray-400" size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search by Tender ID, keyword, or title..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-12 pr-10 py-3 bg-secondary-dark border-2 border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-600"
                                    />
                                    {search && (
                                        <button
                                            onClick={() => setSearch('')}
                                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-300 transition-colors text-xl"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                            <Select
                                options={categoryOptions}
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="min-w-[150px]"
                            />
                            <Select
                                options={statusOptions}
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="min-w-[150px]"
                            />
                            <button className="p-2 bg-secondary hover:bg-secondary-light rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Filter size={20} />
                            </button>
                        </div>
                    </Card>

                    {/* Active Status Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {filters.status && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary-light text-sm rounded-full">
                                Status: {filters.status.toUpperCase()}
                                <button
                                    onClick={() => setFilters({ ...filters, status: '' })}
                                    className="ml-1 hover:text-white"
                                >×</button>
                            </span>
                        )}
                        {filters.category && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary-light text-sm rounded-full">
                                Category: {filters.category}
                                <button
                                    onClick={() => setFilters({ ...filters, category: '' })}
                                    className="ml-1 hover:text-white"
                                >×</button>
                            </span>
                        )}
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-400 text-sm">
                            Showing {filteredTenders?.length || 0} results
                        </p>
                    </div>

                    {/* Tenders Table */}
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <Card dark className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-secondary border-b border-gray-700">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">Tender ID</th>
                                            <th className="text-left px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">Subject / Package Title</th>
                                            <th className="text-left px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">Status</th>
                                            <th className="text-left px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">Publication Date</th>
                                            <th className="text-left px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">Deadline</th>
                                            <th className="text-left px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/50">
                                        {filteredTenders?.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-12 text-gray-400">
                                                    <Filter className="mx-auto mb-2 opacity-50" size={32} />
                                                    No tenders found matching your criteria.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredTenders?.map((tender) => (
                                                <tr key={tender.id} className="hover:bg-secondary/50 transition-colors">
                                                    <td className="px-4 py-4">
                                                        <span className="text-primary-light font-mono text-sm font-medium">{tender.tender_id}</span>
                                                    </td>
                                                    <td className="px-4 py-4 max-w-sm">
                                                        <p className="text-white font-medium">{tender.title}</p>
                                                        <p className="text-gray-500 text-xs mt-1">{tender.category}</p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white ${statusColors[tender.status]}`}>
                                                            {statusLabels[tender.status]}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-gray-400 text-sm">
                                                        {new Date(tender.publication_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Calendar size={14} className="text-gray-500" />
                                                            <span className={tender.status === 'open' ? 'text-accent-orange font-medium' : 'text-gray-400'}>
                                                                {new Date(tender.deadline).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex gap-3">
                                                            <button className="text-gray-400 hover:text-primary-light transition-colors" title="View Details">
                                                                <Eye size={18} />
                                                            </button>
                                                            {tender.document && (
                                                                <a href={getMediaUrl(tender.document)} className="text-gray-400 hover:text-primary-light transition-colors" title="Download Document">
                                                                    <Download size={18} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}

                </div>
            </section>
        </div>
    );
}
