import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Users, Leaf, MapPin, FileText, Calendar, ChevronRight, ArrowRight, ChevronLeft } from 'lucide-react';
import { Button, Stat, SectionTitle, Card, LoadingSpinner } from '../components/ui';
import { useDirectors, useCSRInitiatives, useNotices } from '../hooks/useApi';

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
    const topDirectors = directors?.slice(0, 3);

    const categoryColors: Record<string, string> = {
        general: 'bg-primary/10 text-primary border-primary/30',
        urgent: 'bg-red-500/10 text-red-400 border-red-500/30',
        tender: 'bg-accent-orange/10 text-accent-orange border-accent-orange/30',
        recruitment: 'bg-accent-green/10 text-accent-green border-accent-green/30',
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
            <section className="relative min-h-screen flex items-center bg-gradient-to-br from-secondary-dark via-secondary to-secondary-dark overflow-hidden">
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
                <div className="relative max-w-7xl mx-auto px-4 py-32 z-10">
                    {heroSlides.map((slide, index) => (
                        <div
                            key={index}
                            className={`transition-all duration-700 ease-in-out ${index === currentSlide
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8 absolute inset-0 pointer-events-none'
                                }`}
                        >
                            <h1 className="text-5xl md:text-7xl font-bold text-white max-w-3xl leading-tight">
                                {slide.title} <span className="text-primary-light">{slide.highlight}</span>
                            </h1>
                            <p className="mt-6 text-xl text-gray-300 max-w-2xl">
                                {slide.description}
                            </p>
                        </div>
                    ))}
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link to="/projects">
                            <Button>Explore Projects</Button>
                        </Link>
                        <Link to="/tenders">
                            <Button variant="secondary">View Active Tenders</Button>
                        </Link>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group"
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 ${index === currentSlide
                                    ? 'w-8 h-2 bg-primary-light rounded-full'
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
            <section className="bg-secondary py-16 border-y border-gray-700">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Stat value="1320" suffix="MW" label="Total Capacity" />
                    <Stat value="Ultra-Super" label="Critical Technology" />
                    <Stat value="50:50" label="India-Bangladesh Joint Venture" />
                </div>
            </section>

            {/* Notice Board Section - Dark Theme */}
            <section className="bg-secondary-dark py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <Card dark className="overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-primary/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <FileText className="text-primary-light" size={22} />
                                </div>
                                <h2 className="text-xl font-bold text-white">Notice Board</h2>
                            </div>
                            <Link to="/notices" className="text-primary-light hover:text-primary text-sm flex items-center gap-1 transition-colors">
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Notices List */}
                        {noticesLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <div className="divide-y divide-gray-700/50">
                                {notices?.slice(0, 5).map((notice) => (
                                    <div
                                        key={notice.id}
                                        className="flex items-start gap-4 px-6 py-4 hover:bg-secondary/50 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex-shrink-0 mt-1.5">
                                            <div className="w-2 h-2 rounded-full bg-primary-light" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-200 font-medium group-hover:text-primary-light transition-colors line-clamp-1">
                                                {notice.title}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="flex items-center gap-1 text-gray-500 text-sm">
                                                    <Calendar size={12} />
                                                    {new Date(notice.published_date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded border ${categoryColors[notice.category] || categoryColors.general}`}>
                                                    {notice.category_display}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-gray-600 group-hover:text-primary-light transition-colors flex-shrink-0" size={18} />
                                    </div>
                                ))}
                                {(!notices || notices.length === 0) && (
                                    <div className="px-6 py-12 text-center text-gray-500">
                                        No notices available at this time.
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            </section>

            {/* Pioneering Section */}
            <section className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionTitle
                        title="Pioneering Energy Infrastructure"
                        subtitle="Bangladesh-India Friendship Power Company Limited is committed to sustainable energy production through global standards."
                        light
                    />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
                        {[
                            { icon: Zap, title: 'Environmental Compliance', desc: 'World-class emission controls' },
                            { icon: Users, title: 'Community Impact', desc: 'Local employment & development' },
                            { icon: Leaf, title: 'Operational Safety', desc: 'Zero-incident commitment' },
                            { icon: MapPin, title: 'Strategic Location', desc: 'Rampal, Bagerhat' },
                        ].map((item) => (
                            <Card key={item.title} className="p-6 text-center">
                                <item.icon className="mx-auto text-primary" size={40} />
                                <h3 className="mt-4 font-semibold text-lg text-gray-900">{item.title}</h3>
                                <p className="mt-2 text-gray-600 text-sm">{item.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section className="bg-secondary py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionTitle
                        title="Our Leadership"
                        subtitle="Guided by leaders with vision, experience, and a dedication to excellence in sustainable power generation."
                    />
                    {directorsLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {topDirectors?.map((director) => (
                                <Card key={director.id} dark className="text-center p-6">
                                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-700">
                                        {director.photo ? (
                                            <img src={director.photo} alt={director.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Users size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="mt-4 text-white font-semibold">{director.name}</h3>
                                    <p className="text-primary-light text-sm">{director.title}</p>
                                </Card>
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-8">
                        <Link to="/directors">
                            <Button variant="outline">View Full Board of Directors</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CSR Section */}
            <section className="bg-secondary-dark py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionTitle
                        title="Sustainability & CSR"
                        subtitle="Beyond power generation, we're committed to environmental stewardship and supporting local communities."
                    />
                    {csrLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {csrInitiatives?.slice(0, 3).map((initiative) => (
                                <Card key={initiative.id} dark className="p-6">
                                    <div className="w-12 h-12 bg-accent-green/20 rounded-lg flex items-center justify-center mb-4">
                                        <Leaf className="text-accent-green" />
                                    </div>
                                    <h3 className="text-white font-semibold">{initiative.title}</h3>
                                    <p className="mt-2 text-gray-400 text-sm">{initiative.description}</p>
                                    <p className="mt-3 text-accent-green font-semibold">{initiative.impact_metric}</p>
                                </Card>
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-8">
                        <Link to="/sustainability">
                            <Button variant="outline">Learn More About CSR</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
