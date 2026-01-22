import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Download, ExternalLink, Search, Star, Bell, Briefcase, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '../components/ui';
import { useNotices } from '../hooks/useApi';
import type { Notice } from '../types';

const categoryConfig: Record<string, { icon: typeof FileText; color: string; bgColor: string }> = {
    general: { icon: FileText, color: 'text-primary-light', bgColor: 'bg-primary/20' },
    urgent: { icon: AlertCircle, color: 'text-red-400', bgColor: 'bg-red-500/20' },
    tender: { icon: Briefcase, color: 'text-accent-orange', bgColor: 'bg-accent-orange/20' },
    recruitment: { icon: Bell, color: 'text-accent-green', bgColor: 'bg-accent-green/20' },
};

const categories = [
    { key: 'all', label: 'All Notices' },
    { key: 'general', label: 'General' },
    { key: 'urgent', label: 'Urgent' },
    { key: 'tender', label: 'Tender' },
    { key: 'recruitment', label: 'Recruitment' },
];

export function NoticesPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const params = activeCategory !== 'all' ? { category: activeCategory } : undefined;
    const { data: notices, isLoading } = useNotices(params);

    const filteredNotices = notices?.filter(notice =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const featuredNotices = filteredNotices?.filter(n => n.is_featured);
    const regularNotices = filteredNotices?.filter(n => !n.is_featured);

    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-emerald-900 to-teal-800 py-24 pt-32">
                <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-teal-800/75 to-emerald-900/85" />
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white text-sm mb-6">
                        <FileText size={16} />
                        <span>Official Announcements</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Notice <span className="text-emerald-300">Board</span>
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Stay updated with the latest announcements, tenders, and recruitment notifications from BIFPCL.
                    </p>
                </div>
            </section>

            {/* Filters Section */}
            <section className="bg-white/95 dark:bg-secondary backdrop-blur-sm border-b border-slate-200 dark:border-gray-700 sticky top-16 z-20">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Search className="text-gray-400" size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search notices..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-10 py-3 bg-gray-50 dark:bg-secondary-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-xl"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {/* Category Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
                            {categories.map((cat) => (
                                <button
                                    key={cat.key}
                                    onClick={() => setActiveCategory(cat.key)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.key
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 dark:bg-secondary-dark text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-secondary-light'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Notices List */}
            <section className="bg-slate-50/80 dark:bg-secondary-dark py-12">
                <div className="max-w-7xl mx-auto px-4">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {/* Featured Notices */}
                            {featuredNotices && featuredNotices.length > 0 && (
                                <div className="mb-12">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Star className="text-yellow-500 dark:text-yellow-400" size={20} />
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Featured Notices</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {featuredNotices.map((notice) => (
                                            <NoticeCard key={notice.id} notice={notice} featured />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Regular Notices */}
                            {regularNotices && regularNotices.length > 0 ? (
                                <div className="space-y-4">
                                    {regularNotices.map((notice) => (
                                        <NoticeCard key={notice.id} notice={notice} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <FileText className="mx-auto text-gray-400 dark:text-gray-600 mb-4" size={48} />
                                    <p className="text-gray-500">No notices found matching your criteria.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
}

function NoticeCard({ notice, featured = false }: { notice: Notice; featured?: boolean }) {
    const config = categoryConfig[notice.category] || categoryConfig.general;
    const Icon = config.icon;

    return (
        <Link
            to={`/notices/${notice.slug}`}
            className={`block rounded-xl border transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 group ${featured
                ? 'bg-gradient-to-br from-white to-emerald-50/30 dark:from-secondary dark:to-secondary-dark border-yellow-500/30'
                : 'bg-white dark:bg-secondary border-slate-200 dark:border-gray-700'
                }`}
        >
            <div className="p-6">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                        <Icon className={config.color} size={24} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.bgColor} ${config.color}`}>
                                {notice.category_display}
                            </span>
                            {featured && (
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-500 dark:text-yellow-400 flex items-center gap-1">
                                    <Star size={10} /> Featured
                                </span>
                            )}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                            {notice.title}
                        </h3>

                        {notice.excerpt && (
                            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                {notice.excerpt}
                            </p>
                        )}

                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(notice.published_date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>

                            {notice.document && (
                                <span className="flex items-center gap-1 text-primary">
                                    <Download size={14} />
                                    {notice.attachment_name || 'Download'}
                                </span>
                            )}

                            {notice.link && (
                                <span className="flex items-center gap-1 text-primary">
                                    <ExternalLink size={14} />
                                    External Link
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
