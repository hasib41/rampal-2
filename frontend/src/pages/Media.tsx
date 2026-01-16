import { useState } from 'react';
import { Calendar, ArrowRight, Download, FileText, Search, Newspaper, Video, Image, Star, TrendingUp, Clock, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Button, LoadingSpinner } from '../components/ui';
import { useNews } from '../hooks/useApi';

const categoryConfig: Record<string, { label: string; icon: typeof Newspaper; color: string; bgColor: string }> = {
    press: { label: 'Press Release', icon: Newspaper, color: 'text-primary-light', bgColor: 'bg-primary/20' },
    event: { label: 'Event', icon: Calendar, color: 'text-accent-green', bgColor: 'bg-accent-green/20' },
    in_the_news: { label: 'In The News', icon: TrendingUp, color: 'text-accent-orange', bgColor: 'bg-accent-orange/20' },
    update: { label: 'Update', icon: Clock, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
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
            <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-secondary-dark via-secondary to-secondary-dark">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Background Image (if featured news has image) */}
                {featuredNews?.image && (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-20"
                        style={{ backgroundImage: `url('${featuredNews.image}')` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-dark via-secondary-dark/80 to-transparent" />

                <div className="relative max-w-7xl mx-auto px-4 py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Title & Description */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-xl shadow-primary/30">
                                    <Newspaper className="text-white" size={28} />
                                </div>
                                <div>
                                    <span className="text-primary-light text-sm font-semibold tracking-wider uppercase">Media Centre</span>
                                    <h1 className="text-4xl md:text-5xl font-bold text-white">News & Updates</h1>
                                </div>
                            </div>
                            <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                                Stay informed with the latest press releases, project updates, events, and media coverage from BIFPCL.
                            </p>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-6 mt-10">
                                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-3xl font-bold text-white">{news?.length || 0}</p>
                                    <p className="text-gray-400 text-sm">Total Articles</p>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-3xl font-bold text-primary-light">{news?.filter(n => n.category === 'press').length || 0}</p>
                                    <p className="text-gray-400 text-sm">Press Releases</p>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-3xl font-bold text-accent-green">{news?.filter(n => n.category === 'event').length || 0}</p>
                                    <p className="text-gray-400 text-sm">Events</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Featured Story Card */}
                        {featuredNews && (
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary-light to-accent-green rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                                <Card dark className="relative overflow-hidden rounded-2xl border-gray-700/50">
                                    {featuredNews.image && (
                                        <div className="h-56 overflow-hidden">
                                            <img
                                                src={featuredNews.image}
                                                alt={featuredNews.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-semibold flex items-center gap-1">
                                                <Star size={12} fill="currentColor" /> Featured
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryConfig[featuredNews.category]?.bgColor} ${categoryConfig[featuredNews.category]?.color}`}>
                                                {categoryConfig[featuredNews.category]?.label}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold text-white group-hover:text-primary-light transition-colors line-clamp-2">
                                            {featuredNews.title}
                                        </h2>
                                        <p className="text-gray-400 mt-3 line-clamp-2">{featuredNews.excerpt}</p>
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                                            <span className="text-gray-500 text-sm flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(featuredNews.published_date).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </span>
                                            <Link to={`/media/${featuredNews.slug}`}>
                                                <Button>Read Story</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Category Tabs & Search */}
            <section className="bg-secondary border-b border-gray-700 sticky top-0 z-20">
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
                                            : 'text-gray-400 hover:text-white hover:bg-secondary-dark'
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
                                className="w-full md:w-72 pl-12 pr-10 py-3 bg-secondary-dark border-2 border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-600"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-300 transition-colors text-xl"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* News Grid */}
            <section className="bg-secondary-dark py-16">
                <div className="max-w-7xl mx-auto px-4">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            {filteredNews && filteredNews.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredNews.map((article) => {
                                        const config = categoryConfig[article.category] || categoryConfig.update;
                                        const Icon = config.icon;

                                        return (
                                            <Link
                                                key={article.id}
                                                to={`/media/${article.slug}`}
                                                className="group"
                                            >
                                                <Card dark className="h-full overflow-hidden rounded-xl border-gray-700 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                                                    {/* Image */}
                                                    <div className="h-52 overflow-hidden relative bg-gradient-to-br from-secondary to-secondary-dark">
                                                        {article.image ? (
                                                            <img
                                                                src={article.image}
                                                                alt={article.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <div className={`w-20 h-20 rounded-2xl ${config.bgColor} flex items-center justify-center`}>
                                                                    <Icon className={config.color} size={36} />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Category Badge */}
                                                        <div className="absolute top-4 left-4">
                                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${config.bgColor} ${config.color} backdrop-blur-sm flex items-center gap-1.5`}>
                                                                <Icon size={12} />
                                                                {config.label}
                                                            </span>
                                                        </div>

                                                        {/* Download Button */}
                                                        {article.attachment && (
                                                            <a
                                                                href={article.attachment}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="absolute top-4 right-4 p-2.5 bg-secondary/90 backdrop-blur-sm rounded-lg hover:bg-primary transition-colors"
                                                                title="Download"
                                                            >
                                                                <Download size={16} className="text-white" />
                                                            </a>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-6">
                                                        <h3 className="text-lg font-semibold text-white group-hover:text-primary-light transition-colors line-clamp-2 mb-3">
                                                            {article.title}
                                                        </h3>
                                                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                                            {article.excerpt}
                                                        </p>

                                                        {/* Footer */}
                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                                                            <span className="text-gray-500 text-sm flex items-center gap-2">
                                                                <Calendar size={14} />
                                                                {new Date(article.published_date).toLocaleDateString('en-US', {
                                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                                })}
                                                            </span>
                                                            <span className="text-primary-light text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                Read more <ArrowRight size={14} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <FileText className="mx-auto text-gray-600 mb-4" size={64} />
                                    <h3 className="text-xl font-semibold text-white mb-2">No Articles Found</h3>
                                    <p className="text-gray-400">
                                        {searchTerm
                                            ? `No results for "${searchTerm}". Try a different search term.`
                                            : 'No articles available in this category yet.'}
                                    </p>
                                </div>
                            )}

                            {/* Load More */}
                            {filteredNews && filteredNews.length > 6 && (
                                <div className="text-center mt-12">
                                    <Button variant="secondary">Load More Updates</Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Gallery Preview */}
            <section className="bg-secondary py-16 border-t border-gray-700">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Media Gallery</h2>
                            <p className="text-gray-400 mt-1">Photos and videos from our projects and events</p>
                        </div>
                        <Button variant="secondary" className="flex items-center gap-2">
                            <Image size={18} />
                            View Gallery
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-video rounded-xl overflow-hidden bg-secondary-dark relative group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                    {i % 2 === 0 ? (
                                        <Video className="text-primary-light" size={32} />
                                    ) : (
                                        <Image className="text-primary-light" size={32} />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-sm">View</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subscribe Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-secondary-dark" />
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
                        <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3.5 rounded-xl font-semibold">
                            Subscribe
                        </Button>
                    </form>
                    <p className="text-white/50 text-sm mt-4">
                        By subscribing, you agree to our Privacy Policy and Media Distribution Terms.
                    </p>
                </div>
            </section>
        </>
    );
}
