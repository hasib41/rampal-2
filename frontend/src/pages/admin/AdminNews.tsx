import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Calendar, Image, Star, StarOff } from 'lucide-react';
import { useNews } from '../../hooks/useApi';
import type { NewsArticle } from '../../types';

export function AdminNews() {
    const { data: news, isLoading } = useNews();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const filteredNews = news?.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categoryColors: Record<string, string> = {
        press: 'bg-primary/20 text-primary-light',
        event: 'bg-accent-green/20 text-accent-green',
        in_the_news: 'bg-accent-orange/20 text-accent-orange',
        update: 'bg-purple-500/20 text-purple-400',
    };

    const categoryLabels: Record<string, string> = {
        press: 'Press Release',
        event: 'Event',
        in_the_news: 'In The News',
        update: 'Update',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">News & Media</h1>
                    <p className="text-gray-400 mt-1">Manage press releases and news articles</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                    <Plus size={18} />
                    Add Article
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {['all', 'press', 'event', 'update'].map(category => {
                    const count = category === 'all'
                        ? news?.length || 0
                        : news?.filter(a => a.category === category).length || 0;
                    return (
                        <div
                            key={category}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${categoryFilter === category
                                    ? 'bg-primary/10 border-primary'
                                    : 'bg-secondary border-gray-700 hover:border-gray-600'
                                }`}
                            onClick={() => setCategoryFilter(category)}
                        >
                            <p className="text-gray-400 text-sm capitalize">
                                {category === 'all' ? 'All Articles' : categoryLabels[category] || category}
                            </p>
                            <p className="text-2xl font-bold text-white mt-1">{count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary"
                />
            </div>

            {/* Table */}
            <div className="bg-secondary rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700 bg-secondary-dark">
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Article</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Category</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Date</th>
                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Featured</th>
                            <th className="text-right py-4 px-6 text-gray-400 font-medium text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">Loading...</td>
                            </tr>
                        ) : filteredNews?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">No articles found</td>
                            </tr>
                        ) : (
                            filteredNews?.map((article: NewsArticle) => (
                                <tr key={article.id} className="border-b border-gray-700/50 hover:bg-secondary-dark/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gray-700 flex-shrink-0 overflow-hidden">
                                                {article.image ? (
                                                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                        <Image size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-gray-200 font-medium truncate max-w-sm">{article.title}</p>
                                                <p className="text-gray-500 text-sm truncate max-w-sm">{article.excerpt}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[article.category]}`}>
                                            {categoryLabels[article.category] || article.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Calendar size={14} />
                                            {new Date(article.published_date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        {article.is_featured ? (
                                            <Star className="text-yellow-400 fill-yellow-400" size={18} />
                                        ) : (
                                            <StarOff className="text-gray-600" size={18} />
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-primary-light hover:bg-primary/10 rounded-lg transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
