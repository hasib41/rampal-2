import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Users, Leaf, MapPin, FileText, Calendar, ChevronRight, ArrowRight, ChevronLeft, AlertCircle, Briefcase, UserPlus, Star, Newspaper, Clock, ExternalLink, TrendingUp } from 'lucide-react';
import { Button, Stat, Card, LoadingSpinner } from '../components/ui';
import { useDirectors, useCSRInitiatives, useNotices, useNews, useTenders } from '../hooks/useApi';
import { getMediaUrl } from '../services/api';

// Hero slides data
const heroSlides = [
    {
        image: '/hero-bg.jpg',
        title: 'Energy for',
        highlight: 'Growth',
        description: 'A symbol of Indo-Bangladesh Friendship, powering the future of millions with sustainable and efficient power generation.',
    },
    {
        image: '/projects-hero.jpg',
        title: 'Powering',
        highlight: 'Progress',
        description: 'State-of-the-art Ultra-Supercritical technology delivering 1320MW of clean, efficient power to Bangladesh.',
    },
    {
        image: '/sustainability-bg.jpg',
        title: 'Committed to',
        highlight: 'Sustainability',
        description: 'Leading environmental stewardship with world-class emission controls and community development programs.',
    },
    {
        image: '/contact-hero.jpg',
        title: 'Building a',
        highlight: 'Future Together',
        description: 'Join us in our mission to transform the energy landscape of Bangladesh through innovation and collaboration.',
    },
];

export function HomePage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const { data: directors, isLoading: directorsLoading } = useDirectors();
    const { data: csrInitiatives, isLoading: csrLoading } = useCSRInitiatives();
    const { data: notices, isLoading: noticesLoading } = useNotices();
    const { data: news, isLoading: newsLoading } = useNews();
    const { data: tenders, isLoading: tendersLoading } = useTenders();

    const topDirectors = directors?.slice(0, 3);
    const recentNews = news?.slice(0, 4);
    const openTenders = tenders?.filter(t => t.status === 'open').slice(0, 3);

    const categoryColors: Record<string, string> = {
        general: 'bg-primary/10 text-primary border-primary/30',
        urgent: 'bg-red-500/10 text-red-400 border-red-500/30',
        tender: 'bg-accent-orange/10 text-accent-orange border-accent-orange/30',
        recruitment: 'bg-accent-green/10 text-accent-green border-accent-green/30',
    };

    const newsCategoryConfig: Record<string, { label: string; icon: typeof Newspaper; color: string; bgColor: string }> = {
        press: { label: 'Press Release', icon: Newspaper, color: 'text-primary-light', bgColor: 'bg-primary/20' },
        event: { label: 'Event', icon: Calendar, color: 'text-accent-green', bgColor: 'bg-accent-green/20' },
        in_the_news: { label: 'In The News', icon: TrendingUp, color: 'text-accent-orange', bgColor: 'bg-accent-orange/20' },
        update: { label: 'Update', icon: Clock, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    };

    // Helper function to calculate days remaining
    const getDaysRemaining = (deadline: string) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Auto-play functionality
    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }, []);

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        // Resume auto-play after 10 seconds of inactivity
        setTimeout(() => setIsAutoPlaying(true), 10000);
    }, []);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    return (
        <>
            {/* Hero Section with Slider */}
            <section className="relative min-h-[85vh] sm:min-h-screen flex items-center bg-gradient-to-br from-secondary-dark via-secondary to-secondary-dark overflow-hidden">
                {/* Slide Backgrounds */}
                {heroSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-30' : 'opacity-0'
                            }`}
                        style={{ backgroundImage: `url('${slide.image}')` }}
                    />
                ))}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-dark/80 via-transparent to-secondary-dark/60" />

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 py-20 pt-24 sm:py-28 sm:pt-28 md:py-32 z-10">
                    {heroSlides.map((slide, index) => (
                        <div
                            key={index}
                            className={`transition-all duration-700 ease-in-out ${index === currentSlide
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8 absolute inset-0 pointer-events-none'
                                }`}
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white max-w-3xl leading-tight">
                                {slide.title} <span className="text-primary-light">{slide.highlight}</span>
                            </h1>
                            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl">
                                {slide.description}
                            </p>
                        </div>
                    ))}
                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Link to="/projects">
                            <Button className="w-full sm:w-auto">Explore Projects</Button>
                        </Link>
                        <Link to="/tenders">
                            <Button variant="secondary" className="w-full sm:w-auto">View Active Tenders</Button>
                        </Link>
                    </div>
                </div>

                {/* Navigation Arrows - Hidden on mobile, shown on larger screens */}
                <button
                    onClick={prevSlide}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 transition-all duration-300 group"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={20} className="sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 transition-all duration-300 group"
                    aria-label="Next slide"
                >
                    <ChevronRight size={20} className="sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 ${index === currentSlide
                                ? 'w-6 sm:w-8 h-2 bg-primary-light rounded-full'
                                : 'w-2 h-2 bg-white/40 hover:bg-white/60 rounded-full'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
                    <div
                        className="h-full bg-primary-light transition-all duration-300"
                        style={{
                            width: `${((currentSlide + 1) / heroSlides.length) * 100}%`,
                        }}
                    />
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-secondary py-10 sm:py-12 md:py-16 border-y border-gray-700">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    <Stat value="1320" suffix="MW" label="Total Capacity" />
                    <Stat value="Ultra-Super" label="Critical Technology" />
                    <Stat value="50:50" label="India-Bangladesh Joint Venture" />
                </div>
            </section>

            {/* Notice Board Section - Redesigned */}
            <section className="bg-secondary-dark py-12 sm:py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
                        <div>
                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
                                    <FileText className="text-white" size={20} />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white">Notice Board</h2>
                            </div>
                            <p className="text-gray-400 text-sm sm:text-base mt-1">Latest announcements and important updates</p>
                        </div>
                        <Link
                            to="/notices"
                            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary-light rounded-lg transition-all border border-primary/30"
                        >
                            View All Notices <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Notices Grid */}
                    {noticesLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {notices?.slice(0, 6).map((notice, index) => {
                                    const isFirst = index === 0 && notice.is_featured;
                                    const categoryStyle = categoryColors[notice.category] || categoryColors.general;

                                    return (
                                        <Link
                                            key={notice.id}
                                            to={`/notices/${notice.slug}`}
                                            className={`group relative rounded-xl border transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 active:scale-[0.99] ${isFirst
                                                ? 'sm:col-span-2 lg:col-span-2 bg-gradient-to-br from-primary/10 via-secondary to-secondary border-primary/30'
                                                : 'bg-secondary border-gray-700'
                                                }`}
                                        >
                                            <div className="p-4 sm:p-6">
                                                {/* Category & Date Row */}
                                                <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                                                    <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${categoryStyle}`}>
                                                        {notice.category === 'urgent' && <AlertCircle size={10} className="sm:w-3 sm:h-3" />}
                                                        {notice.category === 'tender' && <Briefcase size={10} className="sm:w-3 sm:h-3" />}
                                                        {notice.category === 'recruitment' && <UserPlus size={10} className="sm:w-3 sm:h-3" />}
                                                        {notice.category === 'general' && <FileText size={10} className="sm:w-3 sm:h-3" />}
                                                        {notice.category_display}
                                                    </span>
                                                    {notice.is_featured && (
                                                        <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 text-xs font-medium flex items-center gap-1 shrink-0">
                                                            <Star size={10} fill="currentColor" /> <span className="hidden sm:inline">Featured</span>
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Title */}
                                                <h3 className={`font-semibold text-white group-hover:text-primary-light transition-colors mb-3 ${isFirst ? 'text-lg sm:text-xl line-clamp-2' : 'text-base sm:text-lg line-clamp-2'
                                                    }`}>
                                                    {notice.title}
                                                </h3>

                                                {/* Excerpt (only for featured) */}
                                                {isFirst && notice.excerpt && (
                                                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 hidden sm:block">
                                                        {notice.excerpt}
                                                    </p>
                                                )}

                                                {/* Footer */}
                                                <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-gray-700/50">
                                                    <span className="flex items-center gap-1.5 sm:gap-2 text-gray-500 text-xs sm:text-sm">
                                                        <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                                                        {new Date(notice.published_date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-primary-light text-xs sm:text-sm sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                        Read More <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {(!notices || notices.length === 0) && (
                                <div className="text-center py-16 bg-secondary rounded-xl border border-gray-700">
                                    <FileText className="mx-auto text-gray-600 mb-4" size={48} />
                                    <p className="text-gray-500">No notices available at this time.</p>
                                </div>
                            )}

                            {/* Mobile View All Button */}
                            <div className="mt-8 text-center md:hidden">
                                <Link to="/notices">
                                    <Button>View All Notices</Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Latest News/Media Section */}
            <section className="bg-secondary py-12 sm:py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
                        <div>
                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-accent-orange to-orange-600 flex items-center justify-center shadow-lg shadow-accent-orange/20">
                                    <Newspaper className="text-white" size={20} />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white">Latest News</h2>
                            </div>
                            <p className="text-gray-400 text-sm sm:text-base mt-1">Stay updated with our latest announcements and media coverage</p>
                        </div>
                        <Link
                            to="/media"
                            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-accent-orange/10 hover:bg-accent-orange/20 text-accent-orange rounded-lg transition-all border border-accent-orange/30"
                        >
                            View All News <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* News Grid */}
                    {newsLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {recentNews?.map((article, index) => {
                                    const config = newsCategoryConfig[article.category] || newsCategoryConfig.update;
                                    const Icon = config.icon;
                                    const isFirst = index === 0;

                                    return (
                                        <Link
                                            key={article.id}
                                            to={`/media/${article.slug}`}
                                            className={`group rounded-xl border border-gray-700 overflow-hidden bg-secondary-dark hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 active:scale-[0.99] ${isFirst ? 'sm:col-span-2' : ''
                                                }`}
                                        >
                                            {/* Image */}
                                            <div className={`relative overflow-hidden bg-gray-800 ${isFirst ? 'h-40 sm:h-56' : 'h-36 sm:h-44'}`}>
                                                {article.image ? (
                                                    <img
                                                        src={getMediaUrl(article.image)}
                                                        alt={article.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className={`w-full h-full flex items-center justify-center ${config.bgColor}`}>
                                                        <Icon className={config.color} size={isFirst ? 40 : 28} />
                                                    </div>
                                                )}
                                                <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                                                    <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                                                        <Icon size={10} className="sm:w-3 sm:h-3" />
                                                        {config.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-3 sm:p-4">
                                                <h3 className={`font-semibold text-white group-hover:text-primary-light transition-colors line-clamp-2 ${isFirst ? 'text-base sm:text-lg' : 'text-sm'}`}>
                                                    {article.title}
                                                </h3>
                                                {isFirst && article.excerpt && (
                                                    <p className="text-gray-400 text-sm mt-2 line-clamp-2 hidden sm:block">{article.excerpt}</p>
                                                )}
                                                <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 text-gray-500 text-xs">
                                                    <Calendar size={10} className="sm:w-3 sm:h-3" />
                                                    {new Date(article.published_date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {(!recentNews || recentNews.length === 0) && (
                                <div className="text-center py-16 bg-secondary-dark rounded-xl border border-gray-700">
                                    <Newspaper className="mx-auto text-gray-600 mb-4" size={48} />
                                    <p className="text-gray-500">No news articles available.</p>
                                </div>
                            )}

                            {/* Mobile View All Button */}
                            <div className="mt-8 text-center md:hidden">
                                <Link to="/media">
                                    <Button>View All News</Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Open Tenders Section */}
            <section className="bg-secondary-dark py-12 sm:py-16 md:py-20 border-t border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
                        <div>
                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-accent-green to-green-600 flex items-center justify-center shadow-lg shadow-accent-green/20">
                                    <Briefcase className="text-white" size={20} />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white">Open Tenders</h2>
                            </div>
                            <p className="text-gray-400 text-sm sm:text-base mt-1">Active procurement opportunities for vendors and contractors</p>
                        </div>
                        <Link
                            to="/tenders"
                            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-accent-green/10 hover:bg-accent-green/20 text-accent-green rounded-lg transition-all border border-accent-green/30"
                        >
                            View All Tenders <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Tenders Grid */}
                    {tendersLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                {openTenders?.map((tender) => {
                                    const daysRemaining = getDaysRemaining(tender.deadline);
                                    const isUrgent = daysRemaining <= 7;

                                    return (
                                        <Card
                                            key={tender.id}
                                            dark
                                            className="p-4 sm:p-6 hover:border-accent-green/50 transition-all duration-300 group relative overflow-hidden active:scale-[0.99]"
                                        >
                                            {/* Urgency Badge */}
                                            {isUrgent && (
                                                <div className="absolute top-0 right-0">
                                                    <div className="bg-red-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-bl-lg">
                                                        URGENT
                                                    </div>
                                                </div>
                                            )}

                                            {/* Tender ID */}
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <span className="px-2 py-1 bg-primary/20 text-primary-light text-xs font-mono rounded">
                                                    {tender.tender_id}
                                                </span>
                                                <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded capitalize">
                                                    {tender.category}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-white text-sm sm:text-base font-semibold line-clamp-2 mb-3 sm:mb-4 group-hover:text-accent-green transition-colors">
                                                {tender.title}
                                            </h3>

                                            {/* Deadline Info */}
                                            <div className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg ${isUrgent ? 'bg-red-500/10 border border-red-500/30' : 'bg-gray-800'}`}>
                                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${isUrgent ? 'bg-red-500/20' : 'bg-accent-green/20'}`}>
                                                    <Clock className={isUrgent ? 'text-red-400' : 'text-accent-green'} size={16} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`text-xs sm:text-sm font-semibold ${isUrgent ? 'text-red-400' : 'text-white'}`}>
                                                        {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Deadline passed'}
                                                    </p>
                                                    <p className="text-gray-500 text-xs truncate">
                                                        Due: {new Date(tender.deadline).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action */}
                                            <Link
                                                to="/tenders"
                                                className="mt-3 sm:mt-4 flex items-center justify-center gap-2 w-full py-2 sm:py-2.5 bg-accent-green/10 hover:bg-accent-green/20 active:bg-accent-green/30 text-accent-green rounded-lg transition-colors text-xs sm:text-sm font-medium border border-accent-green/30"
                                            >
                                                <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                                                View Details
                                            </Link>
                                        </Card>
                                    );
                                })}
                            </div>

                            {(!openTenders || openTenders.length === 0) && (
                                <div className="text-center py-16 bg-secondary rounded-xl border border-gray-700">
                                    <Briefcase className="mx-auto text-gray-600 mb-4" size={48} />
                                    <p className="text-gray-500">No open tenders at this time.</p>
                                    <Link to="/tenders" className="inline-flex items-center gap-2 text-primary-light mt-3 hover:underline">
                                        View all tenders <ArrowRight size={14} />
                                    </Link>
                                </div>
                            )}

                            {/* Mobile View All Button */}
                            <div className="mt-8 text-center md:hidden">
                                <Link to="/tenders">
                                    <Button className="bg-accent-green hover:bg-accent-green/80">View All Tenders</Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Project Location Map Section */}
            <section className="bg-secondary py-12 sm:py-16 md:py-20 border-t border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
                        {/* Map Image */}
                        <div className="relative group rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
                            <img
                                src="/project-map.png"
                                alt="Rampal Power Station Location Map"
                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Overlay on hover/tap */}
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark/90 via-transparent to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6">
                                <div>
                                    <p className="text-white font-semibold text-sm sm:text-base">Rampal Power Station</p>
                                    <p className="text-gray-300 text-xs sm:text-sm">Bagerhat, Bangladesh</p>
                                </div>
                            </div>
                            {/* Location Pin Animation */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                <div className="relative">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full animate-ping absolute inset-0 opacity-50" />
                                </div>
                            </div>
                        </div>

                        {/* Info Content */}
                        <div className="order-1 lg:order-2">
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                    <MapPin className="text-white" size={20} />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white">Project Location</h2>
                            </div>

                            <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                                The Maitree Super Thermal Power Project is strategically located in Rampal Upazila, Bagerhat District,
                                approximately 14 kilometers from the Sundarbans, the world's largest mangrove forest. The location
                                was carefully selected to ensure minimal environmental impact while maximizing efficiency.
                            </p>

                            {/* Location Details */}
                            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary-dark rounded-xl">
                                    <MapPin className="text-primary-light shrink-0" size={20} />
                                    <div className="min-w-0">
                                        <p className="text-white font-semibold text-sm sm:text-base">Rampal, Bagerhat</p>
                                        <p className="text-gray-500 text-xs sm:text-sm">Khulna Division, Bangladesh</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary-dark rounded-xl">
                                    <Zap className="text-accent-orange shrink-0" size={20} />
                                    <div className="min-w-0">
                                        <p className="text-white font-semibold text-sm sm:text-base">1320 MW Capacity</p>
                                        <p className="text-gray-500 text-xs sm:text-sm">2 x 660 MW Ultra-Supercritical Units</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary-dark rounded-xl">
                                    <Leaf className="text-accent-green shrink-0" size={20} />
                                    <div className="min-w-0">
                                        <p className="text-white font-semibold text-sm sm:text-base">Environmental Compliance</p>
                                        <p className="text-gray-500 text-xs sm:text-sm">World-class emission controls and monitoring</p>
                                    </div>
                                </div>
                            </div>

                            <Link to="/projects">
                                <Button className="w-full sm:w-auto">
                                    View Project Details <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pioneering Section */}
            <section className="relative bg-secondary py-12 sm:py-16 md:py-24 overflow-hidden border-t border-gray-700/50">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

                <div className="relative max-w-7xl mx-auto px-4">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary-light text-sm font-medium mb-4">
                            <Zap size={14} />
                            Our Commitment
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                            Pioneering Energy Infrastructure
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base md:text-lg">
                            Bangladesh-India Friendship Power Company Limited is committed to sustainable energy production through global standards.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[
                            { icon: Zap, title: 'Environmental Compliance', desc: 'World-class emission controls meeting international standards', color: 'from-primary to-blue-600' },
                            { icon: Users, title: 'Community Impact', desc: 'Local employment & sustainable development programs', color: 'from-accent-orange to-orange-600' },
                            { icon: Leaf, title: 'Operational Safety', desc: 'Zero-incident commitment with rigorous safety protocols', color: 'from-accent-green to-green-600' },
                            { icon: MapPin, title: 'Strategic Location', desc: 'Optimally positioned in Rampal, Bagerhat', color: 'from-purple-500 to-purple-700' },
                        ].map((item, index) => (
                            <div
                                key={item.title}
                                className="group relative bg-secondary-dark rounded-2xl p-5 sm:p-6 md:p-8 hover:bg-secondary-dark/80 transition-all duration-500 border border-gray-700 hover:border-gray-600 overflow-hidden"
                            >
                                {/* Hover gradient overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500`} />

                                {/* Number badge */}
                                <span className="absolute top-4 right-4 text-4xl sm:text-5xl font-bold text-gray-800 group-hover:text-gray-700 transition-colors">
                                    0{index + 1}
                                </span>

                                {/* Icon */}
                                <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className="text-white" size={24} />
                                </div>

                                {/* Content */}
                                <h3 className="relative font-bold text-base sm:text-lg text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="relative text-gray-400 text-xs sm:text-sm leading-relaxed">
                                    {item.desc}
                                </p>

                                {/* Bottom accent line */}
                                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section className="bg-secondary py-12 sm:py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
                        <div>
                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
                                    <Users className="text-white" size={20} />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white">Our Leadership</h2>
                            </div>
                            <p className="text-gray-400 text-sm sm:text-base mt-1">Guided by leaders with vision, experience, and a dedication to excellence</p>
                        </div>
                        <Link
                            to="/directors"
                            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary-light rounded-lg transition-all border border-primary/30"
                        >
                            View All Directors <ArrowRight size={16} />
                        </Link>
                    </div>
                    {directorsLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
                            {topDirectors?.map((director) => (
                                <Card key={director.id} dark className="text-center p-4 sm:p-6">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden bg-gray-700">
                                        {director.photo ? (
                                            <img src={getMediaUrl(director.photo)} alt={director.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Users size={36} />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="mt-3 sm:mt-4 text-white font-semibold text-sm sm:text-base">{director.name}</h3>
                                    <p className="text-primary-light text-xs sm:text-sm">{director.title}</p>
                                </Card>
                            ))}
                        </div>
                    )}
                    {/* Mobile View All Button */}
                    <div className="mt-6 sm:mt-8 text-center md:hidden">
                        <Link to="/directors">
                            <Button>View Full Board of Directors</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CSR Section */}
            <section className="bg-secondary-dark py-12 sm:py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
                        <div>
                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-accent-green to-green-600 flex items-center justify-center shadow-lg shadow-accent-green/20">
                                    <Leaf className="text-white" size={20} />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white">Sustainability & CSR</h2>
                            </div>
                            <p className="text-gray-400 text-sm sm:text-base mt-1">Beyond power generation, we're committed to environmental stewardship and supporting local communities</p>
                        </div>
                        <Link
                            to="/sustainability"
                            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-accent-green/10 hover:bg-accent-green/20 text-accent-green rounded-lg transition-all border border-accent-green/30"
                        >
                            Learn More <ArrowRight size={16} />
                        </Link>
                    </div>
                    {csrLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                            {csrInitiatives?.slice(0, 3).map((initiative, index) => (
                                <div
                                    key={initiative.id}
                                    className="group relative bg-secondary rounded-2xl p-5 sm:p-6 hover:bg-secondary/80 transition-all duration-500 border border-gray-700 hover:border-accent-green/50 overflow-hidden"
                                >
                                    {/* Hover gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent-green to-green-600 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500" />

                                    {/* Number badge */}
                                    <span className="absolute top-4 right-4 text-4xl sm:text-5xl font-bold text-gray-800 group-hover:text-gray-700 transition-colors">
                                        0{index + 1}
                                    </span>

                                    {/* Icon */}
                                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-accent-green to-green-600 flex items-center justify-center shadow-lg mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                                        <Leaf className="text-white" size={24} />
                                    </div>

                                    {/* Content */}
                                    <h3 className="relative font-bold text-base sm:text-lg text-white mb-2">
                                        {initiative.title}
                                    </h3>
                                    <p className="relative text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-3">
                                        {initiative.description}
                                    </p>
                                    <p className="relative text-accent-green font-semibold text-sm sm:text-base">
                                        {initiative.impact_metric}
                                    </p>

                                    {/* Bottom accent line */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-green to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Mobile View All Button */}
                    <div className="mt-6 sm:mt-8 text-center md:hidden">
                        <Link to="/sustainability">
                            <Button className="bg-accent-green hover:bg-accent-green/80">Learn More About CSR</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
