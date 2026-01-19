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

// Category colors - using actual category values from API
const categoryColors: Record<string, { bg: string; text: string; lightBg: string }> = {
    urgent: { bg: 'bg-red-500', text: 'text-white', lightBg: 'bg-red-50 dark:bg-red-500/10' },
    general: { bg: 'bg-blue-500', text: 'text-white', lightBg: 'bg-blue-50 dark:bg-blue-500/10' },
    tender: { bg: 'bg-emerald-500', text: 'text-white', lightBg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    recruitment: { bg: 'bg-purple-500', text: 'text-white', lightBg: 'bg-purple-50 dark:bg-purple-500/10' },
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
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
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
                                    className={`flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group ${index === 0 ? 'bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10' : ''}`}
                                >
                                    {/* Number Badge */}
                                    <div className={`${catStyle.bg} text-white rounded-xl w-12 h-12 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform`}>
                                        <span className="text-lg font-bold">{String(index + 1).padStart(2, '0')}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        {/* Tags Row */}
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                            {/* Category Tag */}
                                            <span className={`${catStyle.bg} ${catStyle.text} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide`}>
                                                {notice.category_display || category}
                                            </span>

                                            {/* Date */}
                                            <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                                                <Calendar size={10} />
                                                {formattedDate}
                                            </span>

                                            {/* File Attached */}
                                            {notice.document && (
                                                <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded">
                                                    <Paperclip size={10} />
                                                    Attachment
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-gray-900 dark:text-white font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2 leading-snug">
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
                                        size={18}
                                        className="text-gray-300 dark:text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-3"
                                    />
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
