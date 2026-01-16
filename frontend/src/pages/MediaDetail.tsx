import { Link, useParams } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2, Download, ExternalLink, Clock, Tag, Newspaper, TrendingUp, User } from 'lucide-react';
import { Button, LoadingSpinner, Card } from '../components/ui';
import { useNews } from '../hooks/useApi';
import { newsApi } from '../services/api';
import { useQuery } from '@tanstack/react-query';

const categoryConfig: Record<string, { label: string; icon: typeof Newspaper; color: string; bgColor: string }> = {
    press: { label: 'Press Release', icon: Newspaper, color: 'text-primary-light', bgColor: 'bg-primary/20' },
    event: { label: 'Event', icon: Calendar, color: 'text-accent-green', bgColor: 'bg-accent-green/20' },
    in_the_news: { label: 'In The News', icon: TrendingUp, color: 'text-accent-orange', bgColor: 'bg-accent-orange/20' },
    update: { label: 'Update', icon: Clock, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
};

export function MediaDetailPage() {
    const { slug } = useParams<{ slug: string }>();

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
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
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
                    <Newspaper className="mx-auto text-gray-600 mb-4" size={64} />
                    <h1 className="text-2xl font-bold text-white mb-2">Article Not Found</h1>
                    <p className="text-gray-400 mb-6">The article you're looking for doesn't exist.</p>
                    <Link to="/media">
                        <Button>Back to Media Centre</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const config = categoryConfig[article.category] || categoryConfig.update;
    const Icon = config.icon;

    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-end overflow-hidden">
                {/* Background Image */}
                {article.image ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${article.image}')` }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-dark via-secondary to-secondary-dark" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark via-secondary-dark/80 to-transparent" />

                <div className="relative max-w-4xl mx-auto px-4 py-16 w-full">
                    {/* Breadcrumb */}
                    <Link
                        to="/media"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-light transition-colors mb-6"
                    >
                        <ArrowLeft size={18} />
                        Back to Media Centre
                    </Link>

                    {/* Category & Featured Badge */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${config.bgColor} ${config.color}`}>
                            <Icon size={16} />
                            {config.label}
                        </span>
                        {article.is_featured && (
                            <span className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm font-medium">
                                ★ Featured Article
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                        {article.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 text-gray-400">
                        <span className="flex items-center gap-2">
                            <Calendar size={18} />
                            {new Date(article.published_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                        {article.author && (
                            <span className="flex items-center gap-2">
                                <User size={18} />
                                {article.author}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="bg-secondary-dark py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <Card dark className="p-8">
                                {/* Excerpt/Lead */}
                                {article.excerpt && (
                                    <p className="text-xl text-gray-300 leading-relaxed mb-8 pb-8 border-b border-gray-700 font-medium">
                                        {article.excerpt}
                                    </p>
                                )}

                                {/* Full Content */}
                                {article.content ? (
                                    <div className="prose prose-invert prose-lg max-w-none">
                                        <div
                                            className="text-gray-300 leading-relaxed"
                                            dangerouslySetInnerHTML={{
                                                __html: article.content
                                                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
                                                    .replace(/^(\d+)\.\s+(.+)$/gm, '<li class="ml-4">$1. $2</li>')
                                                    .replace(/^-\s+(.+)$/gm, '<li class="ml-4">• $1</li>')
                                                    .replace(/\n\n/g, '</p><p class="mt-4">')
                                                    .replace(/\n/g, '<br/>')
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <p className="text-gray-400">
                                        Full article content is not available. Please download the attached document for more details.
                                    </p>
                                )}

                                {/* Tags (if available) */}
                                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-700">
                                    <Tag size={16} className="text-gray-500" />
                                    <span className="px-3 py-1 rounded-full bg-secondary text-gray-400 text-sm">BIFPCL</span>
                                    <span className="px-3 py-1 rounded-full bg-secondary text-gray-400 text-sm">Power Plant</span>
                                    <span className="px-3 py-1 rounded-full bg-secondary text-gray-400 text-sm">{config.label}</span>
                                </div>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Actions */}
                            <Card dark className="p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                                <div className="space-y-3">
                                    {article.attachment && (
                                        <a
                                            href={article.attachment}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 w-full px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                                        >
                                            <Download size={18} />
                                            <span>Download Document</span>
                                        </a>
                                    )}

                                    <button
                                        onClick={handleShare}
                                        className="flex items-center gap-3 w-full px-4 py-3 bg-secondary hover:bg-gray-600 text-white rounded-lg transition-colors border border-gray-700"
                                    >
                                        <Share2 size={18} />
                                        <span>Share Article</span>
                                    </button>
                                </div>
                            </Card>

                            {/* Related Articles */}
                            {relatedArticles && relatedArticles.length > 0 && (
                                <Card dark className="p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Related Articles</h3>
                                    <div className="space-y-4">
                                        {relatedArticles.map((related) => (
                                            <Link
                                                key={related.id}
                                                to={`/media/${related.slug}`}
                                                className="block group"
                                            >
                                                <div className="flex gap-3">
                                                    {related.image ? (
                                                        <img
                                                            src={related.image}
                                                            alt={related.title}
                                                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className={`w-16 h-16 rounded-lg ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                                                            <Icon className={config.color} size={24} />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="text-gray-300 group-hover:text-primary-light transition-colors line-clamp-2 text-sm font-medium">
                                                            {related.title}
                                                        </p>
                                                        <p className="text-gray-500 text-xs mt-1">
                                                            {new Date(related.published_date).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* Back to Media */}
                            <Link to="/media" className="block">
                                <Button variant="secondary" className="w-full">
                                    ← Back to Media Centre
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* More Articles */}
            {allNews && allNews.length > 0 && (
                <section className="bg-secondary py-16 border-t border-gray-700">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-2xl font-bold text-white mb-8">More From Media Centre</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {allNews.filter(n => n.id !== article.id).slice(0, 3).map((newsItem) => {
                                const itemConfig = categoryConfig[newsItem.category] || categoryConfig.update;
                                const ItemIcon = itemConfig.icon;

                                return (
                                    <Link key={newsItem.id} to={`/media/${newsItem.slug}`} className="group">
                                        <Card dark className="overflow-hidden hover:border-primary/50 transition-all">
                                            <div className="h-40 overflow-hidden bg-secondary-dark">
                                                {newsItem.image ? (
                                                    <img
                                                        src={newsItem.image}
                                                        alt={newsItem.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ItemIcon className={itemConfig.color} size={32} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <span className={`text-xs font-semibold ${itemConfig.color}`}>
                                                    {itemConfig.label}
                                                </span>
                                                <h3 className="text-white font-medium mt-1 line-clamp-2 group-hover:text-primary-light transition-colors">
                                                    {newsItem.title}
                                                </h3>
                                                <p className="text-gray-500 text-xs mt-2">
                                                    {new Date(newsItem.published_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
