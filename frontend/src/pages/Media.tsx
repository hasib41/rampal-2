import { useState } from 'react';
import { Calendar, ArrowRight, Download, FileText, Search, Newspaper, Video, Image, Star, TrendingUp, Clock, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, LoadingSpinner } from '../components/ui';
import { useNews } from '../hooks/useApi';
import { getMediaUrl } from '../services/api';

const categoryConfig: Record<string, { label: string; icon: typeof Newspaper; color: string; bgColor: string; lightColor: string; lightBg: string }> = {
    press: { label: 'Press Release', icon: Newspaper, color: 'text-primary-light', bgColor: 'bg-primary/20', lightColor: 'text-primary', lightBg: 'bg-primary/10' },
    event: { label: 'Event', icon: Calendar, color: 'text-accent-green', bgColor: 'bg-accent-green/20', lightColor: 'text-emerald-600', lightBg: 'bg-emerald-50' },
    in_the_news: { label: 'In The News', icon: TrendingUp, color: 'text-accent-orange', bgColor: 'bg-accent-orange/20', lightColor: 'text-orange-600', lightBg: 'bg-orange-50' },
    update: { label: 'Update', icon: Clock, color: 'text-purple-400', bgColor: 'bg-purple-500/20', lightColor: 'text-purple-600', lightBg: 'bg-purple-50' },
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
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const featuredNews = news?.find((n) => n.is_featured);
    const otherNews = news?.filter((n) => !n.is_featured);

    // Filter news based on category and search
    const filteredNews = otherNews?.filter(n => {
        const matchesCategory = activeCategory === 'all' || n.category === activeCategory;
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <>
            {/* Hero Section */}
            <section className="relative py-24 pt-32 bg-gradient-to-r from-emerald-900 to-teal-800">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: featuredNews?.image ? `url('${getMediaUrl(featuredNews.image)}')` : `url('/media-hero.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-teal-800/75 to-emerald-900/85" />
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-emerald-300 text-sm font-semibold uppercase tracking-wider border border-white/20">
                        <Newspaper size={14} />
                        Media Centre
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">
                        News & Updates
                    </h1>
                    <p className="mt-4 text-xl text-white/80 max-w-2xl mx-auto">
                        Stay informed with the latest press releases, project updates, events, and media coverage from BIFPCL.
                    </p>
                </div>
            </section>

            {/* Featured Story Section */}
            {featuredNews && (
                <section className="bg-slate-50 dark:bg-secondary py-12">
                    <div className="max-w-7xl mx-auto px-4">
                        {/* Section Label */}
                        <div className="flex items-center gap-2 mb-6">
                            <Star className="text-amber-500" size={20} fill="currentColor" />
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Featured Story</span>
                        </div>

                        <Link to={`/media/${featuredNews.slug}`} className="block group">
                            <div className="bg-white dark:bg-secondary-dark rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow border border-gray-100 dark:border-gray-800">
                                <div className="grid md:grid-cols-2 gap-0">
                                    {/* Image */}
                                    <div className="h-64 md:h-80 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        {featuredNews.image ? (
                                            <img
                                                src={getMediaUrl(featuredNews.image)}
                                                alt={featuredNews.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Newspaper className="text-gray-300 dark:text-gray-600" size={64} />
                                            </div>
                                        )}
                                    </div>
                                    {/* Content */}
                                    <div className="p-8 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-yellow-500/20 text-amber-600 dark:text-yellow-400 text-xs font-semibold flex items-center gap-1">
                                                <Star size={12} fill="currentColor" /> Featured
                                            </span>
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light">
                                                {categoryConfig[featuredNews.category]?.label || 'News'}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                            {featuredNews.title}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400 mt-4 line-clamp-3">{featuredNews.excerpt}</p>
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <span className="text-gray-500 text-sm flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(featuredNews.published_date).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </span>
                                            <span className="text-primary font-medium flex items-center gap-1">
                                                Read Story <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
            <section className="bg-white dark:bg-secondary border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                        {/* Category Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                            {categories.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                    <button
                                        key={cat.key}
                                        onClick={() => setActiveCategory(cat.key)}
                                        className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-all rounded-lg flex items-center gap-2 ${activeCategory === cat.key
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-secondary-dark'
                                            }`}
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
                                <Search className="text-gray-400" size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search news..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-72 pl-12 pr-10 py-3 bg-gray-50 dark:bg-secondary-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-xl"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* News Grid */}
            <section className="bg-slate-50 dark:bg-secondary-dark py-16">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
                            <Newspaper className="text-white" size={22} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Articles</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {filteredNews?.length || 0} articles found
                            </p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            {filteredNews && filteredNews.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredNews.map((article) => {
                                        const config = categoryConfig[article.category] || categoryConfig.update;
                                        const Icon = config.icon;

                                        return (
                                            <Link
                                                key={article.id}
                                                to={`/media/${article.slug}`}
                                                className="group"
                                            >
                                                <div className="h-full bg-white dark:bg-secondary rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-primary/5 hover:-translate-y-1">
                                                    {/* Image */}
                                                    <div className="h-52 overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                                                        {article.image ? (
                                                            <img
                                                                src={getMediaUrl(article.image)}
                                                                alt={article.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <div className="w-20 h-20 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                                                                    <Icon className="text-primary" size={36} />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Category Badge */}
                                                        <div className="absolute top-4 left-4">
                                                            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white flex items-center gap-1.5 shadow-md">
                                                                <Icon size={12} />
                                                                {config.label}
                                                            </span>
                                                        </div>

                                                        {/* Download Button */}
                                                        {article.attachment && (
                                                            <a
                                                                href={getMediaUrl(article.attachment)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="absolute top-4 right-4 p-2.5 bg-gray-900/80 dark:bg-black/70 rounded-lg hover:bg-primary transition-colors shadow-md"
                                                                title="Download"
                                                            >
                                                                <Download size={16} className="text-white" />
                                                            </a>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-6">
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 mb-3">
                                                            {article.title}
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                                            {article.excerpt}
                                                        </p>

                                                        {/* Footer */}
                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                                            <span className="text-gray-500 text-sm flex items-center gap-2">
                                                                <Calendar size={14} />
                                                                {new Date(article.published_date).toLocaleDateString('en-US', {
                                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                                })}
                                                            </span>
                                                            <span className="text-primary text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                Read more <ArrowRight size={14} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white dark:bg-secondary rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <FileText className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Articles Found</h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {searchTerm
                                            ? `No results for "${searchTerm}". Try a different search term.`
                                            : 'No articles available in this category yet.'}
                                    </p>
                                </div>
                            )}

                            {/* Load More */}
                            {filteredNews && filteredNews.length > 6 && (
                                <div className="text-center mt-12">
                                    <Button variant="outline">Load More Updates</Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Gallery Preview */}
            <section className="bg-white dark:bg-secondary py-16 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <Image className="text-white" size={22} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Media Gallery</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Photos and videos from our projects</p>
                            </div>
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Image size={18} />
                            View All
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-secondary-dark relative group cursor-pointer border border-gray-200 dark:border-gray-700">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/5 flex items-center justify-center">
                                    {i % 2 === 0 ? (
                                        <Video className="text-primary" size={32} />
                                    ) : (
                                        <Image className="text-primary" size={32} />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-primary/80 dark:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">View</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subscribe Section */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-emerald-800">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>
                <div className="relative max-w-3xl mx-auto px-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-6">
                        <Newspaper className="text-white" size={32} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Subscribe to Media Briefings
                    </h2>
                    <p className="text-white/80 text-lg max-w-xl mx-auto">
                        Get the latest press releases, corporate announcements, and project milestones delivered directly to your inbox.
                    </p>
                    <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Your work email address"
                            className="flex-1 px-5 py-3.5 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-white/50"
                        />
                        <button
                            type="submit"
                            className="px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Subscribe
                        </button>
                    </form>
                    <p className="text-white/50 text-sm mt-4">
                        By subscribing, you agree to our Privacy Policy and Media Distribution Terms.
                    </p>
                </div>
            </section>
        </>
    );
}
