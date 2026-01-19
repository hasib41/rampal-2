import { Leaf, TreesIcon, Heart, GraduationCap, Target, Droplets, Wind } from 'lucide-react';
import { Card, LoadingSpinner } from '../components/ui';
import { useCSRInitiatives } from '../hooks/useApi';

const categoryIcons: Record<string, React.ElementType> = {
    education: GraduationCap,
    health: Heart,
    environment: TreesIcon,
    community: Leaf,
};

export function SustainabilityPage() {
    const { data: initiatives, isLoading } = useCSRInitiatives();

    return (
        <div className="min-h-screen bg-white dark:bg-secondary-dark">
            {/* Hero with green theme */}
            <section className="relative py-24 pt-32 bg-gradient-to-r from-green-800 to-green-600">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/sustainability-bg.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/70 to-green-900/80" />
                <div className="relative max-w-7xl mx-auto px-4">
                    <span className="text-green-300 text-sm font-semibold uppercase tracking-wider">
                        Environmental Stewardship
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
                        Powering Growth,<br />
                        <span className="text-green-200">Preserving Nature</span>
                    </h1>
                    <p className="mt-4 text-xl text-white/80 max-w-2xl">
                        BIFPCL's commitment to clean energy production with deep environmental responsibility and thriving local communities.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-slate-50 dark:bg-secondary py-16 border-y border-slate-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { value: '1.2M+', label: 'Beneficiaries Reached', icon: Heart },
                        { value: '540K', label: 'Trees Planted', icon: TreesIcon },
                        { value: '28%', label: 'Below Emission Standards', icon: Wind },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <stat.icon className="text-green-600 dark:text-green-400" size={28} />
                            </div>
                            <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Initiatives */}
            <section className="bg-white dark:bg-secondary-dark py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            Driving <span className="text-green-600 dark:text-green-400">Holistic Change</span>
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Our sustainability initiatives span education, healthcare, environmental conservation, and community development.
                        </p>
                    </div>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {initiatives?.map((initiative) => {
                                const Icon = categoryIcons[initiative.category] || Leaf;
                                return (
                                    <Card key={initiative.id} className="p-6 bg-white dark:bg-secondary border-slate-200 dark:border-gray-700 hover:border-green-500/50 hover:shadow-lg transition-all">
                                        <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                                            <Icon className="text-green-600 dark:text-green-400" size={24} />
                                        </div>
                                        <h3 className="text-gray-900 dark:text-white font-semibold text-lg">{initiative.title}</h3>
                                        <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{initiative.description}</p>
                                        <p className="mt-4 text-green-600 dark:text-green-400 font-bold">{initiative.impact_metric}</p>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Environmental Commitment */}
            <section className="bg-slate-50 dark:bg-secondary py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Droplets,
                                title: 'Water Conservation',
                                description: 'Advanced water treatment and recycling systems minimize freshwater usage',
                            },
                            {
                                icon: Wind,
                                title: 'Air Quality',
                                description: 'State-of-the-art emission control keeps pollutants well below standards',
                            },
                            {
                                icon: TreesIcon,
                                title: 'Biodiversity',
                                description: 'Green belt development and wildlife habitat preservation programs',
                            },
                        ].map((item) => (
                            <Card key={item.title} className="p-6 bg-white dark:bg-secondary-dark border-slate-200 dark:border-gray-700">
                                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                                    <item.icon className="text-green-600 dark:text-green-400" size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                                <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{item.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Net Zero Journey */}
            <section className="bg-white dark:bg-secondary-dark py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Journey to<br />
                                <span className="text-green-600 dark:text-green-400">Net-Zero</span>
                            </h2>
                            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                                Our transition to a low-carbon future. Sets our strategy for environmental stewardship and sustainable operations for decades to come.
                            </p>
                            <ul className="mt-6 space-y-3">
                                {['Ultra-supercritical technology for higher efficiency', 'Advanced emission control systems', 'Continuous environmental monitoring', 'Renewable energy integration roadmap'].map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                        <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-secondary border-green-200 dark:border-green-800/50">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                    <Target className="text-green-600 dark:text-green-400" size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-6">2050 Net-Zero Target</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">Committed to carbon neutrality through innovation and sustainable practices.</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
