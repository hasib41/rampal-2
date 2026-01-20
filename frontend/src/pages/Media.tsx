import { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Download, FileText, Search, Newspaper, Video, Image, Star, TrendingUp, Clock, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, LoadingSpinner } from '../components/ui';
import { useNews, useGallery } from '../hooks/useApi';
import { getMediaUrl } from '../services/api';
import type { GalleryImage } from '../types';

const categoryConfig: Record<string, { label: string; icon: typeof Newspaper; color: string; darkColor: string; bgColor: string; darkBgColor: string; borderColor: string; darkBorderColor: string }> = {
    press: { label: 'Press Release', icon: Newspaper, color: 'text-emerald-700', darkColor: 'dark:text-emerald-400', bgColor: 'bg-emerald-50', darkBgColor: 'dark:bg-emerald-900/30', borderColor: 'border-emerald-200', darkBorderColor: 'dark:border-emerald-700' },
    event: { label: 'Event', icon: Calendar, color: 'text-blue-700', darkColor: 'dark:text-blue-400', bgColor: 'bg-blue-50', darkBgColor: 'dark:bg-blue-900/30', borderColor: 'border-blue-200', darkBorderColor: 'dark:border-blue-700' },
    in_the_news: { label: 'In The News', icon: TrendingUp, color: 'text-orange-700', darkColor: 'dark:text-orange-400', bgColor: 'bg-orange-50', darkBgColor: 'dark:bg-orange-900/30', borderColor: 'border-orange-200', darkBorderColor: 'dark:border-orange-700' },
    update: { label: 'Update', icon: Clock, color: 'text-purple-700', darkColor: 'dark:text-purple-400', bgColor: 'bg-purple-50', darkBgColor: 'dark:bg-purple-900/30', borderColor: 'border-purple-200', darkBorderColor: 'dark:border-purple-700' },
};

const categories = [
    { key: 'all', label: 'All Updates', icon: Filter },
    { key: 'press', label: 'Press Releases', icon: Newspaper },
    { key: 'event', label: 'Events', icon: Calendar },
    { key: 'in_the_news', label: 'In the News', icon: TrendingUp },
    { key: 'update', label: 'Updates', icon: Clock },
];

export function MediaPage() {
    const { data: news, isLoading } = useNews();
    const { data: galleryImages } = useGallery();
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    // Close lightbox on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedImage(null);
        };
        if (selectedImage) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [selectedImage]);

    const featuredNews = news?.find((n) => n.is_featured);
    const otherNews = news?.filter((n) => !n.is_featured);

    const filteredNews = otherNews?.filter(n => {
        const matchesCategory = activeCategory === 'all' || n.category === activeCategory;
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-20 bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-800 dark:from-emerald-800 dark:via-emerald-900 dark:to-teal-900">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-emerald-100 text-sm font-medium mb-4">
                        <Newspaper size={14} />
                        Media Centre
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2">
                        News & Updates
                    </h1>
                    <p className="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto">
                        Stay informed with the latest press releases, project updates, events, and media coverage from BIFPCL.
                    </p>
                </div>
            </section>

            {/* Featured Story Section */}
            {featuredNews && (
                <section className="py-10 sm:py-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Label */}
                        <div className="flex items-center gap-2 mb-6">
                            <Star className="text-amber-500" size={18} fill="currentColor" />
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Featured Story</span>
                        </div>

                        <Link to={`/media/${featuredNews.slug}`} className="block group">
                            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg dark:shadow-gray-900/30 transition-shadow border border-gray-200 dark:border-gray-700">
                                <div className="grid md:grid-cols-2 gap-0">
                                    {/* Image */}
                                    <div className="h-56 sm:h-64 md:h-72 overflow-hidden bg-gray-100 dark:bg-gray-700">
                                        {featuredNews.image ? (
                                            <img
                                                src={getMediaUrl(featuredNews.image)}
                                                alt={featuredNews.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Newspaper className="text-gray-300 dark:text-gray-600" size={56} />
                                            </div>
                                        )}
                                    </div>
                                    {/* Content */}
                                    <div className="p-6 sm:p-8 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700 text-xs font-semibold flex items-center gap-1">
                                                <Star size={10} fill="currentColor" /> Featured
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryConfig[featuredNews.category]?.bgColor || 'bg-gray-100'} ${categoryConfig[featuredNews.category]?.darkBgColor || 'dark:bg-gray-700'} ${categoryConfig[featuredNews.category]?.color || 'text-gray-700'} ${categoryConfig[featuredNews.category]?.darkColor || 'dark:text-gray-300'} border ${categoryConfig[featuredNews.category]?.borderColor || 'border-gray-200'} ${categoryConfig[featuredNews.category]?.darkBorderColor || 'dark:border-gray-600'}`}>
                                                {categoryConfig[featuredNews.category]?.label || 'News'}
                                            </span>
                                        </div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors line-clamp-2">
                                            {featuredNews.title}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 mt-3 line-clamp-3 text-sm sm:text-base">{featuredNews.excerpt}</p>
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(featuredNews.published_date).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </span>
                                            <span className="text-primary dark:text-primary-light font-medium flex items-center gap-1 text-sm">
                                                Read Story <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>
            )}

            {/* Category Tabs & Search */}
            <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                        {/* Category Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 -mx-1 px-1">
                            {categories.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                    <button
                                        key={cat.key}
                                        onClick={() => setActiveCategory(cat.key)}
                                        className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-all rounded-lg flex items-center gap-2 ${
                                            activeCategory === cat.key
                                                ? 'bg-primary text-white shadow-md'
                                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                        aria-pressed={activeCategory === cat.key}
                                    >
                                        <Icon size={16} />
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Search className="text-gray-400 dark:text-gray-500" size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search news..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 pl-11 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary dark:focus:border-primary-light focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary-light/20 transition-all text-sm"
                                aria-label="Search news articles"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* News Grid */}
            <section className="py-10 sm:py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                            <Newspaper className="text-primary dark:text-primary-light" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Articles</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {filteredNews?.length || 0} articles found
                            </p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            {filteredNews && filteredNews.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredNews.map((article) => {
                                        const config = categoryConfig[article.category] || categoryConfig.update;
                                        const Icon = config.icon;

                                        return (
                                            <Link
                                                key={article.id}
                                                to={`/media/${article.slug}`}
                                                className="group"
                                            >
                                                <article className="h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/30">
                                                    {/* Image */}
                                                    <div className="h-44 sm:h-48 overflow-hidden relative bg-gray-100 dark:bg-gray-700">
                                                        {article.image ? (
                                                            <img
                                                                src={getMediaUrl(article.image)}
                                                                alt={article.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <div className={`w-16 h-16 rounded-xl ${config.bgColor} ${config.darkBgColor} flex items-center justify-center`}>
                                                                    <Icon className={`${config.color} ${config.darkColor}`} size={28} />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Category Badge */}
                                                        <div className="absolute top-3 left-3">
                                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.darkBgColor} ${config.color} ${config.darkColor} border ${config.borderColor} ${config.darkBorderColor} flex items-center gap-1`}>
                                                                <Icon size={10} />
                                                                {config.label}
                                                            </span>
                                                        </div>

                                                        {/* Download Button */}
                                                        {article.attachment && (
                                                            <a
                                                                href={getMediaUrl(article.attachment)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-lg shadow-sm hover:shadow transition-all"
                                                                title="Download attachment"
                                                                aria-label="Download attachment"
                                                            >
                                                                <Download size={14} className="text-gray-700 dark:text-gray-300" />
                                                            </a>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-5">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors line-clamp-2 mb-2">
                                                            {article.title}
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                                            {article.excerpt}
                                                        </p>

                                                        {/* Footer */}
                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                                            <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1.5">
                                                                <Calendar size={12} />
                                                                {new Date(article.published_date).toLocaleDateString('en-US', {
                                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                                })}
                                                            </span>
                                                            <span className="text-primary dark:text-primary-light text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                Read more <ArrowRight size={12} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </article>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <FileText className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Articles Found</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        {searchTerm
                                            ? `No results for "${searchTerm}". Try a different search term.`
                                            : 'No articles available in this category yet.'}
                                    </p>
                                </div>
                            )}

                            {/* Load More */}
                            {filteredNews && filteredNews.length > 6 && (
                                <div className="text-center mt-10">
                                    <Button variant="outline">Load More Updates</Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Gallery Preview */}
            <section className="py-10 sm:py-12 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Image className="text-purple-600 dark:text-purple-400" size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Media Gallery</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Photos and videos from our projects</p>
                            </div>
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Image size={16} />
                            View All
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {galleryImages && galleryImages.length > 0 ? (
                            galleryImages.slice(0, 8).map((item: GalleryImage) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedImage(item)}
                                    className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 relative group cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all hover:scale-[1.02]"
                                >
                                    {item.image ? (
                                        <img
                                            src={getMediaUrl(item.image)}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                                            {item.media_type === 'video' ? (
                                                <Video className="text-gray-400 dark:text-gray-500" size={28} />
                                            ) : (
                                                <Image className="text-gray-400 dark:text-gray-500" size={28} />
                                            )}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                        <div className="flex items-center justify-between">
                                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/20 text-white">
                                                {item.category_display}
                                            </span>
                                            {item.media_type === 'video' && (
                                                <Video className="text-white" size={16} />
                                            )}
                                        </div>
                                        <p className="text-white text-sm font-medium line-clamp-2">{item.title}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Placeholder when no gallery images
                            [1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 relative group cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                                        {i % 2 === 0 ? (
                                            <Video className="text-gray-400 dark:text-gray-500" size={28} />
                                        ) : (
                                            <Image className="text-gray-400 dark:text-gray-500" size={28} />
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">Coming Soon</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Subscribe Section */}
            <section className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-br from-primary via-emerald-700 to-teal-700 dark:from-emerald-800 dark:via-emerald-900 dark:to-teal-900">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>
                <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center mx-auto mb-6">
                        <Newspaper className="text-white" size={28} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                        Subscribe to Media Briefings
                    </h2>
                    <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto">
                        Get the latest press releases, corporate announcements, and project milestones delivered directly to your inbox.
                    </p>
                    <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Your work email address"
                            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
                            aria-label="Email address for subscription"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Subscribe
                        </button>
                    </form>
                    <p className="text-white/50 text-xs sm:text-sm mt-4">
                        By subscribing, you agree to our Privacy Policy and Media Distribution Terms.
                    </p>
                </div>
            </section>

            {/* Image Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Close lightbox"
                    >
                        <X size={24} />
                    </button>
                    <div
                        className="relative max-w-5xl max-h-[90vh] w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedImage.image ? (
                            <img
                                src={getMediaUrl(selectedImage.image)}
                                alt={selectedImage.title}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            />
                        ) : selectedImage.media_type === 'video' && selectedImage.video_url ? (
                            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                                <iframe
                                    src={selectedImage.video_url.replace('watch?v=', 'embed/')}
                                    title={selectedImage.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className="aspect-video w-full bg-gray-800 rounded-lg flex items-center justify-center">
                                <Image className="text-gray-500" size={64} />
                            </div>
                        )}
                        <div className="mt-4 text-center">
                            <h3 className="text-white text-lg font-semibold">{selectedImage.title}</h3>
                            {selectedImage.description && (
                                <p className="text-white/70 text-sm mt-1 max-w-2xl mx-auto">{selectedImage.description}</p>
                            )}
                            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80">
                                {selectedImage.category_display}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
