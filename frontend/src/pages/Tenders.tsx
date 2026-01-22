import { useState } from 'react';
import { Search, Download, Calendar, Eye, Filter, FileText, DollarSign, Tag } from 'lucide-react';
import { Card, Select, LoadingSpinner, Button, Modal } from '../components/ui';
import { useTenders } from '../hooks/useApi';
import { getMediaUrl } from '../services/api';
import type { Tender } from '../types';

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
    const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
    const { data: tenders, isLoading } = useTenders(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    );

    const filteredTenders = tenders?.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.tender_id.toLowerCase().includes(search.toLowerCase())
    );

    // Export tenders to CSV
    const exportToCSV = () => {
        if (!filteredTenders || filteredTenders.length === 0) return;

        const headers = ['Tender ID', 'Title', 'Category', 'Status', 'Publication Date', 'Deadline', 'Value Range'];
        const rows = filteredTenders.map(tender => [
            tender.tender_id,
            `"${tender.title.replace(/"/g, '""')}"`, // Escape quotes in title
            tender.category,
            tender.status,
            new Date(tender.publication_date).toLocaleDateString(),
            new Date(tender.deadline).toLocaleDateString(),
            tender.value_range || 'N/A'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `BIFPCL_Tenders_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-16 pt-28 bg-gradient-to-r from-emerald-900 to-teal-800">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/tenders-hero.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-teal-800/75 to-emerald-900/85" />
                <div className="relative max-w-7xl mx-auto px-4">
                    <span className="text-emerald-300 text-sm font-semibold uppercase tracking-wider">
                        Procurement Portal
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
                        Tenders & Procurement Database
                    </h1>
                    <p className="mt-2 text-white/80 max-w-2xl">
                        Access comprehensive public and restricted procurement opportunities for the Bangladesh-India Friendship Power Company (Pvt.) Ltd.
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-white/30 text-white hover:bg-white/10"
                            onClick={exportToCSV}
                            disabled={!filteredTenders || filteredTenders.length === 0}
                        >
                            <Download className="mr-2" size={16} />
                            Export CSV
                        </Button>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="bg-slate-50/80 dark:bg-secondary-dark py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Search & Filters */}
                    <Card className="p-4 mb-6">
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
                                        className="w-full pl-12 pr-10 py-3 bg-white dark:bg-secondary-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                                    />
                                    {search && (
                                        <button
                                            onClick={() => setSearch('')}
                                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-xl"
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
                            <button className="p-2 bg-slate-100 dark:bg-secondary hover:bg-slate-200 dark:hover:bg-secondary-light rounded-lg text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
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
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Showing {filteredTenders?.length || 0} results
                        </p>
                    </div>

                    {/* Tenders Table */}
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <Card className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-100 dark:bg-secondary border-b border-slate-200 dark:border-gray-700">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Tender ID</th>
                                            <th className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Subject / Package Title</th>
                                            <th className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Status</th>
                                            <th className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Publication Date</th>
                                            <th className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Deadline</th>
                                            <th className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-gray-700/50">
                                        {filteredTenders?.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-12 text-gray-500 dark:text-gray-400">
                                                    <Filter className="mx-auto mb-2 opacity-50" size={32} />
                                                    No tenders found matching your criteria.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredTenders?.map((tender) => (
                                                <tr key={tender.id} className="hover:bg-slate-50 dark:hover:bg-secondary/50 transition-colors">
                                                    <td className="px-4 py-4">
                                                        <span className="text-primary font-mono text-sm font-medium">{tender.tender_id}</span>
                                                    </td>
                                                    <td className="px-4 py-4 max-w-sm">
                                                        <p className="text-gray-900 dark:text-white font-medium">{tender.title}</p>
                                                        <p className="text-gray-500 text-xs mt-1">{tender.category}</p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white ${statusColors[tender.status]}`}>
                                                            {statusLabels[tender.status]}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400 text-sm">
                                                        {new Date(tender.publication_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Calendar size={14} className="text-gray-500" />
                                                            <span className={tender.status === 'open' ? 'text-accent-orange font-medium' : 'text-gray-600 dark:text-gray-400'}>
                                                                {new Date(tender.deadline).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex gap-3">
                                                            <button
                                                                className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                                                                title="View Details"
                                                                onClick={() => setSelectedTender(tender)}
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            {tender.document && (
                                                                <a
                                                                    href={getMediaUrl(tender.document)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                                                                    title="Download Document"
                                                                >
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

            {/* Tender Detail Modal */}
            <Modal
                isOpen={!!selectedTender}
                onClose={() => setSelectedTender(null)}
                title="Tender Details"
                size="lg"
            >
                {selectedTender && (
                    <div className="space-y-6">
                        {/* Header Info */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-primary font-mono text-sm font-semibold">
                                    {selectedTender.tender_id}
                                </span>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                                    {selectedTender.title}
                                </h3>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColors[selectedTender.status]}`}>
                                {statusLabels[selectedTender.status]}
                            </span>
                        </div>

                        {/* Meta Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-secondary rounded-lg">
                                <Tag size={18} className="text-primary" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                        {selectedTender.category}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-secondary rounded-lg">
                                <DollarSign size={18} className="text-primary" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Value Range</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {selectedTender.value_range || 'Not specified'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-secondary rounded-lg">
                                <Calendar size={18} className="text-primary" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Publication Date</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {new Date(selectedTender.publication_date).toLocaleDateString('en-US', {
                                            month: 'long', day: 'numeric', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-secondary rounded-lg">
                                <Calendar size={18} className={selectedTender.status === 'open' ? 'text-accent-orange' : 'text-gray-400'} />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Deadline</p>
                                    <p className={`text-sm font-medium ${selectedTender.status === 'open' ? 'text-accent-orange' : 'text-gray-900 dark:text-white'}`}>
                                        {new Date(selectedTender.deadline).toLocaleDateString('en-US', {
                                            month: 'long', day: 'numeric', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {selectedTender.description && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {selectedTender.description}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            {selectedTender.document && (
                                <a
                                    href={getMediaUrl(selectedTender.document)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1"
                                >
                                    <Button className="w-full">
                                        <FileText size={16} className="mr-2" />
                                        Download Document
                                    </Button>
                                </a>
                            )}
                            <Button
                                variant="ghost"
                                onClick={() => setSelectedTender(null)}
                                className={selectedTender.document ? '' : 'flex-1'}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
