import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Button, LoadingSpinner } from '../components/ui';
import { useNews } from '../hooks/useApi';

const categoryLabels: Record<string, string> = {
    press: 'Press Release',
    event: 'Event',
    in_the_news: 'In The News',
    update: 'Update',
};

export function MediaPage() {
    const { data: news, isLoading } = useNews();
    const featuredNews = news?.find((n) => n.is_featured);
    const otherNews = news?.filter((n) => !n.is_featured);

    return (
        <div className="bg-white min-h-screen">
            <PageHeader
                title="Media Center & Press Releases"
                subtitle="Stay updated with the latest news and announcements from BIFPCL."
            />

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {/* Featured Article */}
                            {featuredNews && (
                                <Card className="mb-12 overflow-hidden">
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        <div className="h-64 md:h-auto bg-gray-200">
                                            {featuredNews.image && (
                                                <img src={featuredNews.image} alt={featuredNews.title} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="p-8">
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
                                {otherNews?.map((article) => (
                                    <Card key={article.id} className="overflow-hidden group">
                                        <div className="h-48 bg-gray-200 overflow-hidden">
                                            {article.image && (
                                                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
