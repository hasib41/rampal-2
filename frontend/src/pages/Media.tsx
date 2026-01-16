import { useState } from 'react';
import { Calendar, ArrowRight, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Button, LoadingSpinner, Input } from '../components/ui';
import { useNews } from '../hooks/useApi';

const categoryLabels: Record<string, string> = {
    press: 'Press Release',
    event: 'Event',
    in_the_news: 'In The News',
    update: 'Update',
};

const categories = ['All Updates', 'Press Releases', 'Events', 'In the News', 'Updates'];

export function MediaPage() {
    const { data: news, isLoading } = useNews();
    const [activeCategory, setActiveCategory] = useState('All Updates');
    const [email, setEmail] = useState('');

    const featuredNews = news?.find((n) => n.is_featured);
    const otherNews = news?.filter((n) => !n.is_featured);

    // Filter news based on category
    const filteredNews = activeCategory === 'All Updates'
        ? otherNews
        : otherNews?.filter(n => categoryLabels[n.category] === activeCategory.replace('es', 'e').replace('s', ''));

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 pt-32 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/media-hero.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/80 to-white/40" />
                <div className="relative max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div></div>
                        <div>
                            <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full mb-4">
                                TOP STORY
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                Maitree Super Thermal Power Project Reaches New Milestone
                            </h1>
                            <p className="mt-4 text-gray-600">
                                BIFPCL achieves a critical development phase in the Bangladesh-India power generation joint venture, furthering the vision of regional energy security and sustainability infrastructure.
                            </p>
                            <div className="flex items-center gap-4 mt-6">
                                <Button>
                                    Read Full Story
                                </Button>
                                <span className="text-gray-400 text-sm flex items-center gap-2">
                                    <Calendar size={14} />
                                    Published: May 15, 2024
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Tabs */}
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-8 overflow-x-auto py-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors rounded-lg ${activeCategory === cat
                                        ? 'bg-primary text-white'
                                        : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* News Content */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {/* Featured Article */}
                            {featuredNews && activeCategory === 'All Updates' && (
                                <Card className="mb-12 overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        <div className="h-64 md:h-auto bg-gray-200">
                                            {featuredNews.image && (
                                                <img src={featuredNews.image} alt={featuredNews.title} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="p-8 flex flex-col justify-center">
                                            <span className="text-primary text-sm font-semibold">{categoryLabels[featuredNews.category]}</span>
                                            <h2 className="text-2xl font-bold text-gray-900 mt-2">{featuredNews.title}</h2>
                                            <p className="text-gray-600 mt-4">{featuredNews.excerpt}</p>
                                            <div className="flex items-center justify-between mt-6">
                                                <Link to={`/media/${featuredNews.slug}`}>
                                                    <Button>Read Full Article</Button>
                                                </Link>
                                                <span className="text-gray-400 text-sm flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    {new Date(featuredNews.published_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* News Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {(filteredNews || otherNews)?.map((article) => (
                                    <Card key={article.id} className="overflow-hidden group hover:shadow-lg transition-all">
                                        <div className="h-48 bg-gray-200 overflow-hidden relative">
                                            {article.image ? (
                                                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                                                    <FileText className="text-primary" size={48} />
                                                </div>
                                            )}
                                            {article.attachment && (
                                                <a
                                                    href={article.attachment}
                                                    className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                                                    title="Download Report"
                                                >
                                                    <Download size={16} className="text-primary" />
                                                </a>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <span className="text-primary text-xs font-semibold">{categoryLabels[article.category]}</span>
                                            <h3 className="text-lg font-semibold text-gray-900 mt-1 line-clamp-2">{article.title}</h3>
                                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{article.excerpt}</p>
                                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                                <span className="text-gray-400 text-xs">{new Date(article.published_date).toLocaleDateString()}</span>
                                                <Link to={`/media/${article.slug}`} className="text-primary text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                                    Read more <ArrowRight size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Load More */}
                            {(filteredNews || otherNews)?.length && (filteredNews || otherNews).length > 0 && (
                                <div className="text-center mt-10">
                                    <Button variant="outline">Load More Updates</Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Subscribe Section */}
            <section className="bg-primary py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        Subscribe to Media Briefings
                    </h2>
                    <p className="text-white/80 mt-2">
                        Get the latest press releases, corporate announcements, and project milestones delivered directly to your inbox.
                    </p>
                    <form className="mt-6 flex gap-3 max-w-md mx-auto">
                        <Input
                            placeholder="Your work email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                        <Button className="bg-white text-primary hover:bg-gray-100">
                            Subscribe
                        </Button>
                    </form>
                    <p className="text-white/60 text-xs mt-3">
                        By subscribing, you agree to our Privacy Policy and Media Distribution Terms.
                    </p>
                </div>
            </section>
        </div>
    );
}
