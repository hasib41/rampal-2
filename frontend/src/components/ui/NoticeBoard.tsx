import { Link } from 'react-router-dom';
import { FileText, Users, Paperclip, ChevronRight, Megaphone, ArrowRight, Calendar } from 'lucide-react';

interface Notice {
    id: number;
    title: string;
    slug: string;
    category: string;
    category_display: string;
    published_date: string;
    excerpt?: string;
    document?: string;
}

interface Director {
    id: number;
    name: string;
    title: string;
    organization: string;
    photo: string;
    bio: string;
    is_chairman: boolean;
    order: number;
}

// Category colors - subtle, professional design
const categoryColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    urgent: { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-500/30', dot: 'bg-red-500' },
    general: { bg: 'bg-slate-100 dark:bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-500/30', dot: 'bg-slate-500' },
    tender: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/30', dot: 'bg-emerald-500' },
    recruitment: { bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-500/30', dot: 'bg-violet-500' },
};

interface NoticeBoardProps {
    notices: Notice[];
    directors?: Director[];
    loading?: boolean;
    getMediaUrl: (path: string) => string;
}

export function NoticeBoard({ notices, directors, loading, getMediaUrl }: NoticeBoardProps) {
    // Get top directors for team section (sorted by order)
    const teamMembers = directors?.slice(0, 3) || [];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notice Board - Left Side */}
            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-secondary-dark rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <Megaphone className="text-white" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Notice Board</h2>
                                    <p className="text-white/70 text-xs">Latest announcements & updates</p>
                                </div>
                            </div>
                            <Link
                                to="/notices"
                                className="hidden sm:flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors"
                            >
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Notice List */}
                    <div className="p-4 space-y-3">
                        {notices?.slice(0, 5).map((notice, index) => {
                            const date = new Date(notice.published_date);
                            const formattedDate = date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            });

                            const category = notice.category?.toLowerCase() || 'general';
                            const catStyle = categoryColors[category] || categoryColors.general;

                            return (
                                <Link
                                    key={notice.id}
                                    to={`/notices/${notice.slug}`}
                                    className={`block rounded-xl border ${catStyle.border} ${catStyle.bg} hover:shadow-md transition-all group overflow-hidden`}
                                >
                                    <div className="flex items-start gap-3 p-3">
                                        {/* Left accent bar */}
                                        <div className={`w-1 self-stretch rounded-full ${catStyle.dot} flex-shrink-0`} />

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Tags Row */}
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                {/* Category Tag */}
                                                <span className={`${catStyle.text} text-[10px] font-bold uppercase tracking-wide`}>
                                                    {notice.category_display || category}
                                                </span>

                                                <span className="text-gray-300 dark:text-gray-600">•</span>

                                                {/* Date */}
                                                <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                                                    <Calendar size={10} />
                                                    {formattedDate}
                                                </span>

                                                {/* File Attached */}
                                                {notice.document && (
                                                    <>
                                                        <span className="text-gray-300 dark:text-gray-600">•</span>
                                                        <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                                            <Paperclip size={10} />
                                                            File
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-gray-800 dark:text-gray-100 font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                {notice.title}
                                            </h3>

                                            {/* Excerpt for first item */}
                                            {index === 0 && notice.excerpt && (
                                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-1">
                                                    {notice.excerpt}
                                                </p>
                                            )}
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight
                                            size={16}
                                            className="text-gray-400 dark:text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                                        />
                                    </div>
                                </Link>
                            );
                        })}

                        {(!notices || notices.length === 0) && (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <FileText className="text-gray-400 dark:text-gray-500" size={28} />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No notices available</p>
                                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Check back later for updates</p>
                            </div>
                        )}
                    </div>

                    {/* See More Button - Mobile */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 sm:hidden">
                        <Link
                            to="/notices"
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
                        >
                            View All Notices <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Directors Sidebar - Right Side */}
            <div>
                {/* Board of Directors Card */}
                <div className="bg-white dark:bg-secondary-dark rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    <div className="bg-gradient-to-r from-primary to-primary-dark px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Users className="text-white" size={20} />
                            </div>
                            <h3 className="text-white font-bold text-lg">Board of Directors</h3>
                        </div>
                    </div>

                    {/* Team Members List */}
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {teamMembers.map((director) => (
                            <div
                                key={director.id}
                                className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Photo */}
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-primary/20 group-hover:border-primary/40 transition-colors shadow-lg flex-shrink-0">
                                        {director.photo ? (
                                            <img
                                                src={getMediaUrl(director.photo)}
                                                alt={director.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                                <Users className="text-primary" size={24} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-primary transition-colors">
                                            {director.name}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">
                                            {director.title}
                                        </p>
                                        <p className="text-primary text-xs mt-1 font-medium">
                                            {director.organization}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {(!teamMembers || teamMembers.length === 0) && (
                            <div className="p-8 text-center">
                                <Users className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={40} />
                                <p className="text-gray-500 dark:text-gray-400">No team members available</p>
                            </div>
                        )}
                    </div>

                    {/* View All Link */}
                    {directors && directors.length > 3 && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                            <Link
                                to="/directors"
                                className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
                            >
                                View All Directors <ArrowRight size={14} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
