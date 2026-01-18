import { Link, useParams } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2, Download, Clock, Tag, Newspaper, TrendingUp, User, Copy, Check, ChevronRight, Eye } from 'lucide-react';
import { Button, LoadingSpinner, Card } from '../components/ui';
import { useNews } from '../hooks/useApi';
import { newsApi, getMediaUrl } from '../services/api';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const categoryConfig: Record<string, { label: string; icon: typeof Newspaper; color: string; bgColor: string; gradient: string }> = {
    press: { label: 'Press Release', icon: Newspaper, color: 'text-primary-light', bgColor: 'bg-primary/20', gradient: 'from-primary/20 to-blue-600/10' },
    event: { label: 'Event', icon: Calendar, color: 'text-accent-green', bgColor: 'bg-accent-green/20', gradient: 'from-accent-green/20 to-green-600/10' },
    in_the_news: { label: 'In The News', icon: TrendingUp, color: 'text-accent-orange', bgColor: 'bg-accent-orange/20', gradient: 'from-accent-orange/20 to-orange-600/10' },
    update: { label: 'Update', icon: Clock, color: 'text-purple-400', bgColor: 'bg-purple-500/20', gradient: 'from-purple-500/20 to-purple-600/10' },
};

export function MediaDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [copied, setCopied] = useState(false);

    // Fetch single article by slug
    const { data: article, isLoading, error } = useQuery({
        queryKey: ['news', slug],
        queryFn: () => newsApi.getBySlug(slug || ''),
        enabled: !!slug,
    });

    // Fetch all news for related articles
    const { data: allNews } = useNews();

    // Get related articles (same category, excluding current)
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

    // Format date nicely
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Calculate read time
    const getReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content?.split(/\s+/).length || 0;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes < 1 ? '1 min read' : `${minutes} min read`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-secondary-dark flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-secondary-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Newspaper className="text-gray-600" size={48} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Article Not Found</h1>
                    <p className="text-gray-400 mb-8 max-w-md">The article you're looking for doesn't exist or may have been removed.</p>
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
        <div className="min-h-screen bg-secondary-dark">
            {/* Hero Section */}
            <section className="relative">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 h-[60vh]">
                    {article.image ? (
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('${getMediaUrl(article.image)}')` }}
                        />
                    ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-secondary-dark/60 via-secondary-dark/80 to-secondary-dark" />
                </div>

                {/* Hero Content */}
                <div className="relative max-w-5xl mx-auto px-4 pt-24 pb-12">
                    {/* Breadcrumb */}
                    <Link
                        to="/media"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-light transition-colors mb-8 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Media Centre
                    </Link>

                    {/* Category & Featured Badge */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bgColor} ${config.color} font-medium text-sm backdrop-blur-sm`}>
                            <Icon size={16} />
                            {config.label}
                        </span>
                        {article.is_featured && (
                            <span className="px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium backdrop-blur-sm">
                                ★ Featured Article
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8 max-w-4xl">
                        {article.title}
                    </h1>

                    {/* Meta Info Bar */}
                    <div className="flex flex-wrap items-center gap-6 text-gray-400 pb-8 border-b border-gray-700/50">
                        <span className="flex items-center gap-2">
                            <Calendar size={18} className="text-gray-500" />
                            {formatDate(article.published_date)}
                        </span>
                        {article.author && (
                            <span className="flex items-center gap-2">
                                <User size={18} className="text-gray-500" />
                                {article.author}
                            </span>
                        )}
                        <span className="flex items-center gap-2">
                            <Eye size={18} className="text-gray-500" />
                            {getReadTime(article.content || '')}
                        </span>
                    </div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="relative -mt-4">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-8">
                            <article className="bg-secondary rounded-2xl border border-gray-700/50 overflow-hidden">
                                {/* Featured Image (if exists) */}
                                {article.image && (
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img
                                            src={getMediaUrl(article.image)}
                                            alt={article.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="p-8 lg:p-12">
                                    {/* Excerpt/Lead */}
                                    {article.excerpt && (
                                        <div className="mb-8 pb-8 border-b border-gray-700/50">
                                            <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed font-medium">
                                                {article.excerpt}
                                            </p>
                                        </div>
                                    )}

                                    {/* Full Content */}
                                    {article.content ? (
                                        <div className="prose-custom">
                                            <div
                                                className="text-gray-300 leading-relaxed text-lg space-y-4"
                                                dangerouslySetInnerHTML={{
                                                    __html: article.content
                                                        .split('\n\n')
                                                        .map(paragraph => {
                                                            // Handle list items
                                                            if (paragraph.trim().startsWith('-')) {
                                                                const items = paragraph.split('\n')
                                                                    .filter(line => line.trim().startsWith('-'))
                                                                    .map(line => `<li class="text-gray-300 py-1">${line.replace(/^-\s*/, '')}</li>`)
                                                                    .join('');
                                                                return `<ul class="list-disc list-inside space-y-1 my-4 text-gray-300">${items}</ul>`;
                                                            }
                                                            // Handle headers (Key findings:, etc.)
                                                            if (paragraph.includes(':') && paragraph.length < 50) {
                                                                return `<h3 class="text-white font-semibold text-xl mt-8 mb-4">${paragraph}</h3>`;
                                                            }
                                                            // Regular paragraphs
                                                            return `<p class="text-gray-300 leading-relaxed">${paragraph
                                                                .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                                                                }</p>`;
                                                        })
                                                        .join('')
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-400">
                                                Full article content is not available. Please download the attached document for more details.
                                            </p>
                                        </div>
                                    )}

                                    {/* Tags Section */}
                                    <div className="mt-12 pt-8 border-t border-gray-700/50">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <Tag size={16} className="text-gray-500" />
                                            <span className="text-gray-500 text-sm">Tags:</span>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-4 py-1.5 rounded-full bg-secondary-dark text-gray-300 text-sm hover:bg-gray-700 transition-colors cursor-pointer">
                                                    BIFPCL
                                                </span>
                                                <span className="px-4 py-1.5 rounded-full bg-secondary-dark text-gray-300 text-sm hover:bg-gray-700 transition-colors cursor-pointer">
                                                    Power Plant
                                                </span>
                                                <span className={`px-4 py-1.5 rounded-full ${config.bgColor} ${config.color} text-sm`}>
                                                    {config.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-24 space-y-6">
                                {/* Actions Card */}
                                <Card dark className="p-6 border-gray-700/50">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <Share2 size={18} className="text-primary-light" />
                                        Share & Actions
                                    </h3>
                                    <div className="space-y-3">
                                        {article.attachment && (
                                            <a
                                                href={getMediaUrl(article.attachment)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-3 w-full px-4 py-3.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl transition-all font-medium shadow-lg shadow-primary/20"
                                            >
                                                <Download size={18} />
                                                Download Document
                                            </a>
                                        )}

                                        <button
                                            onClick={handleShare}
                                            className="flex items-center justify-center gap-3 w-full px-4 py-3.5 bg-secondary-dark hover:bg-gray-700 text-white rounded-xl transition-colors border border-gray-700"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check size={18} className="text-accent-green" />
                                                    <span className="text-accent-green">Link Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={18} />
                                                    Copy Link
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </Card>

                                {/* Related Articles */}
                                {relatedArticles && relatedArticles.length > 0 && (
                                    <Card dark className="p-6 border-gray-700/50">
                                        <h3 className="text-lg font-semibold text-white mb-4">Related Articles</h3>
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
                                                        <div className="flex gap-4 p-3 -mx-3 rounded-xl hover:bg-secondary-dark/50 transition-colors">
                                                            {related.image ? (
                                                                <img
                                                                    src={getMediaUrl(related.image)}
                                                                    alt={related.title}
                                                                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                                                                />
                                                            ) : (
                                                                <div className={`w-20 h-20 rounded-xl ${relatedConfig.bgColor} flex items-center justify-center flex-shrink-0`}>
                                                                    <RelatedIcon className={relatedConfig.color} size={28} />
                                                                </div>
                                                            )}
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-white group-hover:text-primary-light transition-colors line-clamp-2 font-medium">
                                                                    {related.title}
                                                                </p>
                                                                <p className="text-gray-500 text-sm mt-2">
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
                                    </Card>
                                )}

                                {/* Quick Navigation */}
                                <Link to="/media" className="block">
                                    <div className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-gray-700/50 hover:border-primary/50 transition-colors group">
                                        <span className="text-gray-300 group-hover:text-white transition-colors">
                                            View All Articles
                                        </span>
                                        <ChevronRight size={18} className="text-gray-500 group-hover:text-primary-light group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* More Articles Section */}
            {allNews && allNews.length > 1 && (
                <section className="py-20 mt-16 border-t border-gray-700/50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-bold text-white">More From Media Centre</h2>
                            <Link
                                to="/media"
                                className="hidden md:flex items-center gap-2 text-primary-light hover:text-primary transition-colors"
                            >
                                View All <ChevronRight size={16} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {allNews.filter(n => n.id !== article.id).slice(0, 3).map((newsItem) => {
                                const itemConfig = categoryConfig[newsItem.category] || categoryConfig.update;
                                const ItemIcon = itemConfig.icon;

                                return (
                                    <Link key={newsItem.id} to={`/media/${newsItem.slug}`} className="group">
                                        <Card dark className="overflow-hidden hover:border-primary/50 transition-all duration-300 h-full">
                                            <div className="h-48 overflow-hidden bg-secondary-dark relative">
                                                {newsItem.image ? (
                                                    <img
                                                        src={getMediaUrl(newsItem.image)}
                                                        alt={newsItem.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${itemConfig.gradient}`}>
                                                        <ItemIcon className={itemConfig.color} size={40} />
                                                    </div>
                                                )}
                                                {/* Category Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${itemConfig.bgColor} ${itemConfig.color} backdrop-blur-sm`}>
                                                        <ItemIcon size={12} />
                                                        {itemConfig.label}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-white font-semibold text-lg line-clamp-2 group-hover:text-primary-light transition-colors mb-3">
                                                    {newsItem.title}
                                                </h3>
                                                {newsItem.excerpt && (
                                                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                                        {newsItem.excerpt}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                    <Calendar size={14} />
                                                    {new Date(newsItem.published_date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile View All */}
                        <div className="mt-8 text-center md:hidden">
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
