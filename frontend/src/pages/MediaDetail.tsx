import { Link, useParams } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2, Download, Clock, Tag, Newspaper, TrendingUp, User, Copy, Check, ChevronRight, BookOpen } from 'lucide-react';
import { Button, LoadingSpinner } from '../components/ui';
import { useNews } from '../hooks/useApi';
import { newsApi, getMediaUrl } from '../services/api';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const categoryConfig: Record<string, { label: string; icon: typeof Newspaper; color: string; darkColor: string; bgColor: string; darkBgColor: string; borderColor: string; darkBorderColor: string }> = {
    press: { label: 'Press Release', icon: Newspaper, color: 'text-emerald-700', darkColor: 'dark:text-emerald-400', bgColor: 'bg-emerald-50', darkBgColor: 'dark:bg-emerald-900/30', borderColor: 'border-emerald-200', darkBorderColor: 'dark:border-emerald-700' },
    event: { label: 'Event', icon: Calendar, color: 'text-blue-700', darkColor: 'dark:text-blue-400', bgColor: 'bg-blue-50', darkBgColor: 'dark:bg-blue-900/30', borderColor: 'border-blue-200', darkBorderColor: 'dark:border-blue-700' },
    in_the_news: { label: 'In The News', icon: TrendingUp, color: 'text-orange-700', darkColor: 'dark:text-orange-400', bgColor: 'bg-orange-50', darkBgColor: 'dark:bg-orange-900/30', borderColor: 'border-orange-200', darkBorderColor: 'dark:border-orange-700' },
    update: { label: 'Update', icon: Clock, color: 'text-purple-700', darkColor: 'dark:text-purple-400', bgColor: 'bg-purple-50', darkBgColor: 'dark:bg-purple-900/30', borderColor: 'border-purple-200', darkBorderColor: 'dark:border-purple-700' },
};

export function MediaDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [copied, setCopied] = useState(false);

    const { data: article, isLoading, error } = useQuery({
        queryKey: ['news', slug],
        queryFn: () => newsApi.getBySlug(slug || ''),
        enabled: !!slug,
    });

    const { data: allNews } = useNews();

    const relatedArticles = allNews
        ?.filter(n => n.category === article?.category && n.id !== article?.id)
        .slice(0, 3);

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: article?.title,
                url: window.location.href,
            });
        } else {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content?.split(/\s+/).length || 0;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes < 1 ? '1 min read' : `${minutes} min read`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-16">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-16">
                <div className="text-center px-4">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Newspaper className="text-gray-400 dark:text-gray-500" size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                        The article you're looking for doesn't exist or may have been removed.
                    </p>
                    <Link to="/media">
                        <Button>
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Media Centre
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const config = categoryConfig[article.category] || categoryConfig.update;
    const Icon = config.icon;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="relative pt-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                {/* Hero Image */}
                {article.image && (
                    <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden">
                        <img
                            src={getMediaUrl(article.image)}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Hero Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {/* Breadcrumb */}
                    <Link
                        to="/media"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors mb-6 group text-sm"
                        aria-label="Back to Media Centre"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Media Centre
                    </Link>

                    {/* Category & Featured Badge */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} ${config.darkBgColor} ${config.color} ${config.darkColor} border ${config.borderColor} ${config.darkBorderColor} font-medium text-sm`}>
                            <Icon size={14} />
                            {config.label}
                        </span>
                        {article.is_featured && (
                            <span className="px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700 text-sm font-medium">
                                Featured Article
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                        {article.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600 dark:text-gray-400 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <span className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
                            <time dateTime={article.published_date}>
                                {formatDate(article.published_date)}
                            </time>
                        </span>
                        {article.author && (
                            <span className="flex items-center gap-2">
                                <User size={16} className="text-gray-400 dark:text-gray-500" />
                                {article.author}
                            </span>
                        )}
                        <span className="flex items-center gap-2">
                            <BookOpen size={16} className="text-gray-400 dark:text-gray-500" />
                            {getReadTime(article.content || '')}
                        </span>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8 sm:py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Article Content */}
                        <article className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="p-6 sm:p-8">
                                    {/* Excerpt */}
                                    {article.excerpt && (
                                        <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                                            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                                {article.excerpt}
                                            </p>
                                        </div>
                                    )}

                                    {/* Content */}
                                    {article.content ? (
                                        <div className="prose prose-gray dark:prose-invert max-w-none">
                                            {article.content.split('\n\n').map((paragraph, index) => {
                                                if (paragraph.trim().startsWith('-')) {
                                                    const items = paragraph.split('\n')
                                                        .filter(line => line.trim().startsWith('-'))
                                                        .map(line => line.replace(/^-\s*/, ''));
                                                    return (
                                                        <ul key={index} className="list-disc list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300">
                                                            {items.map((item, i) => (
                                                                <li key={i} className="leading-relaxed">{item}</li>
                                                            ))}
                                                        </ul>
                                                    );
                                                }
                                                if (paragraph.includes(':') && paragraph.length < 50) {
                                                    return (
                                                        <h3 key={index} className="text-lg font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                                                            {paragraph}
                                                        </h3>
                                                    );
                                                }
                                                return (
                                                    <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                                        {paragraph.split(/\*\*(.+?)\*\*/g).map((part, i) =>
                                                            i % 2 === 1 ? (
                                                                <strong key={i} className="font-semibold text-gray-900 dark:text-white">{part}</strong>
                                                            ) : (
                                                                part
                                                            )
                                                        )}
                                                    </p>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Full article content is not available. Please download the attached document for more details.
                                            </p>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <Tag size={14} className="text-gray-400 dark:text-gray-500" />
                                            <span className="text-gray-500 dark:text-gray-400 text-sm">Tags:</span>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                                                    BIFPCL
                                                </span>
                                                <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                                                    Power Plant
                                                </span>
                                                <span className={`px-3 py-1 rounded-full ${config.bgColor} ${config.darkBgColor} ${config.color} ${config.darkColor} text-sm`}>
                                                    {config.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Actions Card */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Share2 size={16} className="text-primary dark:text-primary-light" />
                                        Share & Actions
                                    </h3>
                                    <div className="space-y-3">
                                        {article.attachment && (
                                            <a
                                                href={getMediaUrl(article.attachment)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-medium text-sm"
                                                aria-label="Download document attachment"
                                            >
                                                <Download size={16} />
                                                Download Document
                                            </a>
                                        )}

                                        <button
                                            onClick={handleShare}
                                            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
                                            aria-label={copied ? 'Link copied to clipboard' : 'Copy link to clipboard'}
                                        >
                                            {copied ? (
                                                <>
                                                    <Check size={16} className="text-green-600 dark:text-green-400" />
                                                    <span className="text-green-600 dark:text-green-400">Link Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={16} />
                                                    Copy Link
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Related Articles */}
                                {relatedArticles && relatedArticles.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Related Articles</h3>
                                        <div className="space-y-4">
                                            {relatedArticles.map((related) => {
                                                const relatedConfig = categoryConfig[related.category] || categoryConfig.update;
                                                const RelatedIcon = relatedConfig.icon;

                                                return (
                                                    <Link
                                                        key={related.id}
                                                        to={`/media/${related.slug}`}
                                                        className="block group"
                                                    >
                                                        <div className="flex gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                            {related.image ? (
                                                                <img
                                                                    src={getMediaUrl(related.image)}
                                                                    alt={related.title}
                                                                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                                                />
                                                            ) : (
                                                                <div className={`w-16 h-16 rounded-lg ${relatedConfig.bgColor} ${relatedConfig.darkBgColor} flex items-center justify-center flex-shrink-0`}>
                                                                    <RelatedIcon className={`${relatedConfig.color} ${relatedConfig.darkColor}`} size={24} />
                                                                </div>
                                                            )}
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors line-clamp-2 font-medium text-sm">
                                                                    {related.title}
                                                                </p>
                                                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                                                    {new Date(related.published_date).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* View All Link */}
                                <Link to="/media" className="block">
                                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary-light/50 hover:shadow-sm transition-all group">
                                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-sm font-medium">
                                            View All Articles
                                        </span>
                                        <ChevronRight size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-primary-light group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* More Articles Section */}
            {allNews && allNews.length > 1 && (
                <section className="py-12 sm:py-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">More From Media Centre</h2>
                            <Link
                                to="/media"
                                className="hidden sm:flex items-center gap-1 text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors text-sm font-medium"
                            >
                                View All <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allNews.filter(n => n.id !== article.id).slice(0, 3).map((newsItem) => {
                                const itemConfig = categoryConfig[newsItem.category] || categoryConfig.update;
                                const ItemIcon = itemConfig.icon;

                                return (
                                    <Link key={newsItem.id} to={`/media/${newsItem.slug}`} className="group">
                                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/30 hover:border-gray-300 dark:hover:border-gray-600 transition-all h-full">
                                            <div className="h-44 overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                                                {newsItem.image ? (
                                                    <img
                                                        src={getMediaUrl(newsItem.image)}
                                                        alt={newsItem.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className={`w-full h-full flex items-center justify-center ${itemConfig.bgColor} ${itemConfig.darkBgColor}`}>
                                                        <ItemIcon className={`${itemConfig.color} ${itemConfig.darkColor}`} size={36} />
                                                    </div>
                                                )}
                                                {/* Category Badge */}
                                                <div className="absolute top-3 left-3">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${itemConfig.bgColor} ${itemConfig.darkBgColor} ${itemConfig.color} ${itemConfig.darkColor} border ${itemConfig.borderColor} ${itemConfig.darkBorderColor}`}>
                                                        <ItemIcon size={10} />
                                                        {itemConfig.label}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <h3 className="text-gray-900 dark:text-white font-semibold line-clamp-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors mb-2">
                                                    {newsItem.title}
                                                </h3>
                                                {newsItem.excerpt && (
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                                                        {newsItem.excerpt}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                                                    <Calendar size={12} />
                                                    {new Date(newsItem.published_date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile View All */}
                        <div className="mt-8 text-center sm:hidden">
                            <Link to="/media">
                                <Button>View All Articles</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
