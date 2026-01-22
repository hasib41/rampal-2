import { Link, useParams } from 'react-router-dom';
import { FileText, Calendar, Download, ExternalLink, ArrowLeft, Share2, Bell, Briefcase, AlertCircle, Clock } from 'lucide-react';
import { Button, LoadingSpinner, Card } from '../components/ui';
import { useNotice, useNotices } from '../hooks/useApi';
import { getMediaUrl } from '../services/api';

const categoryConfig: Record<string, { icon: typeof FileText; color: string; bgColor: string }> = {
    general: { icon: FileText, color: 'text-primary-light', bgColor: 'bg-primary/20' },
    urgent: { icon: AlertCircle, color: 'text-red-400', bgColor: 'bg-red-500/20' },
    tender: { icon: Briefcase, color: 'text-accent-orange', bgColor: 'bg-accent-orange/20' },
    recruitment: { icon: Bell, color: 'text-accent-green', bgColor: 'bg-accent-green/20' },
};

export function NoticeDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { data: notice, isLoading, error } = useNotice(slug || '');
    const { data: allNotices } = useNotices();

    // Get related notices (same category, excluding current)
    const relatedNotices = allNotices
        ?.filter(n => n.category === notice?.category && n.id !== notice?.id)
        .slice(0, 3);

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: notice?.title,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-secondary-dark flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !notice) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-secondary-dark flex items-center justify-center">
                <div className="text-center">
                    <FileText className="mx-auto text-gray-400 dark:text-gray-600 mb-4" size={64} />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Notice Not Found</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">The notice you're looking for doesn't exist.</p>
                    <Link to="/notices">
                        <Button>Back to Notices</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const config = categoryConfig[notice.category] || categoryConfig.general;
    const Icon = config.icon;

    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 dark:from-secondary-dark dark:via-secondary dark:to-secondary-dark py-16 pt-32">
                <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-10" />
                <div className="relative max-w-4xl mx-auto px-4">
                    {/* Breadcrumb */}
                    <Link
                        to="/notices"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white dark:text-gray-400 dark:hover:text-primary-light transition-colors mb-8"
                    >
                        <ArrowLeft size={18} />
                        Back to Notices
                    </Link>

                    {/* Category Badge */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bgColor} ${config.color}`}>
                            <Icon size={16} />
                            {notice.category_display}
                        </span>
                        {notice.is_featured && (
                            <span className="px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm">
                                Featured
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
                        {notice.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-6 text-white/70 dark:text-gray-400">
                        <span className="flex items-center gap-2">
                            <Calendar size={18} />
                            Published: {new Date(notice.published_date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                        {notice.updated_at && (
                            <span className="flex items-center gap-2">
                                <Clock size={18} />
                                Updated: {new Date(notice.updated_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="bg-slate-50 dark:bg-secondary-dark py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <Card className="p-8">
                                {notice.excerpt && (
                                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                                        {notice.excerpt}
                                    </p>
                                )}

                                {notice.content ? (
                                    <div className="prose prose-lg dark:prose-invert max-w-none">
                                        <div
                                            className="text-gray-700 dark:text-gray-300 leading-relaxed [&_strong]:text-gray-900 dark:[&_strong]:text-white"
                                            dangerouslySetInnerHTML={{
                                                __html: notice.content
                                                    // Convert **bold** to <strong>
                                                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                                    // Convert numbered lists (1. item)
                                                    .replace(/^(\d+)\.\s+(.+)$/gm, '<li class="ml-4">$1. $2</li>')
                                                    // Convert bullet points (- item)
                                                    .replace(/^-\s+(.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
                                                    // Convert newlines to <br>
                                                    .replace(/\n/g, '<br/>')
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No additional content available for this notice. Please download the attached document for more details.
                                    </p>
                                )}
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Actions */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
                                <div className="space-y-3">
                                    {notice.document && (
                                        <a
                                            href={getMediaUrl(notice.document)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 w-full px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                                        >
                                            <Download size={18} />
                                            <span>{notice.attachment_name || 'Download Attachment'}</span>
                                        </a>
                                    )}

                                    {notice.link && (
                                        <a
                                            href={notice.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 w-full px-4 py-3 bg-gray-100 dark:bg-secondary-light hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition-colors"
                                        >
                                            <ExternalLink size={18} />
                                            <span>Visit Link</span>
                                        </a>
                                    )}

                                    <button
                                        onClick={handleShare}
                                        className="flex items-center gap-3 w-full px-4 py-3 bg-gray-100 dark:bg-secondary-light hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition-colors"
                                    >
                                        <Share2 size={18} />
                                        <span>Share Notice</span>
                                    </button>
                                </div>
                            </Card>

                            {/* Related Notices */}
                            {relatedNotices && relatedNotices.length > 0 && (
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Notices</h3>
                                    <div className="space-y-3">
                                        {relatedNotices.map((related) => (
                                            <Link
                                                key={related.id}
                                                to={`/notices/${related.slug}`}
                                                className="block p-3 rounded-lg bg-gray-50 dark:bg-secondary-dark hover:bg-gray-100 dark:hover:bg-secondary-light transition-colors group"
                                            >
                                                <p className="text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors line-clamp-2 text-sm">
                                                    {related.title}
                                                </p>
                                                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                                                    {new Date(related.published_date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
