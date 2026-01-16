import { useState } from 'react';
import { Search, Download, Calendar, ExternalLink } from 'lucide-react';
import { PageHeader, Card, Select, LoadingSpinner } from '../components/ui';
import { useTenders } from '../hooks/useApi';

const statusColors: Record<string, string> = {
    open: 'bg-accent-green',
    evaluation: 'bg-accent-orange',
    awarded: 'bg-accent-blue',
    closed: 'bg-gray-500',
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
        <div className="bg-secondary-dark min-h-screen">
            <PageHeader
                title="Tenders & Procurement Database"
                subtitle="Access comprehensive public and restricted procurement opportunities."
            />

            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Filters */}
                    <Card dark className="p-4 mb-8">
                        <div className="flex flex-wrap gap-4 items-end">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by Tender ID, keyword, or title..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="input-field pl-10"
                                    />
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
                        </div>
                    </Card>

                    {/* Tenders Table */}
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <Card dark className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-secondary border-b border-gray-700">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Tender ID</th>
                                            <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Subject / Package Title</th>
                                            <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Status</th>
                                            <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Deadline</th>
                                            <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {filteredTenders?.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-8 text-gray-400">
                                                    No tenders found matching your criteria.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredTenders?.map((tender) => (
                                                <tr key={tender.id} className="hover:bg-secondary/50">
                                                    <td className="px-4 py-3">
                                                        <span className="text-primary-light font-mono text-sm">{tender.tender_id}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className="text-white font-medium">{tender.title}</p>
                                                        <p className="text-gray-400 text-xs mt-1">{tender.category}</p>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${statusColors[tender.status]}`}>
                                                            {tender.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                                                            <Calendar size={14} />
                                                            {new Date(tender.deadline).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex gap-2">
                                                            <button className="text-gray-400 hover:text-white" title="View">
                                                                <ExternalLink size={16} />
                                                            </button>
                                                            {tender.document && (
                                                                <a href={tender.document} className="text-gray-400 hover:text-white" title="Download">
                                                                    <Download size={16} />
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
