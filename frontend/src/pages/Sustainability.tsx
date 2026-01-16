import { Leaf, TreesIcon, Heart, GraduationCap } from 'lucide-react';
import { Stat, SectionTitle, Card, LoadingSpinner } from '../components/ui';
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
        <div className="min-h-screen">
            {/* Hero with green theme */}
            <section className="relative py-24 pt-32 bg-gradient-to-r from-green-800 to-green-600">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        Powering Growth,<br />
                        <span className="text-green-200">Preserving Nature</span>
                    </h1>
                    <p className="mt-4 text-xl text-white/80 max-w-2xl">
                        BIFPCL's commitment to clean energy production with deep environmental responsibility and thriving local communities.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-secondary py-16 border-y border-gray-700">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Stat value="1.2M+" label="Beneficiaries Reached" />
                    <Stat value="540K" label="Trees Planted" />
                    <Stat value="28%" label="Below Emission Standards" />
                </div>
            </section>

            {/* Initiatives */}
            <section className="bg-secondary-dark py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionTitle
                        title="Driving Holistic Change"
                        subtitle="Our sustainability initiatives span education, healthcare, environmental conservation, and community development."
                    />
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {initiatives?.map((initiative) => {
                                const Icon = categoryIcons[initiative.category] || Leaf;
                                return (
                                    <Card key={initiative.id} dark className="p-6">
                                        <div className="w-12 h-12 bg-accent-green/20 rounded-lg flex items-center justify-center mb-4">
                                            <Icon className="text-accent-green" size={24} />
                                        </div>
                                        <h3 className="text-white font-semibold text-lg">{initiative.title}</h3>
                                        <p className="mt-2 text-gray-400 text-sm">{initiative.description}</p>
                                        <p className="mt-4 text-accent-green font-bold">{initiative.impact_metric}</p>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Net Zero Journey */}
            <section className="bg-secondary py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white">
                                Journey to<br />
                                <span className="text-accent-green">Net-Zero</span>
                            </h2>
                            <p className="mt-4 text-gray-400 leading-relaxed">
                                Our transition to a low-carbon future. Sets our strategy for environmental stewardship and sustainable operations for decades to come.
                            </p>
                            <ul className="mt-6 space-y-3">
                                {['Ultra-supercritical technology for higher efficiency', 'Advanced emission control systems', 'Continuous environmental monitoring', 'Renewable energy integration roadmap'].map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-gray-300">
                                        <span className="text-accent-green mt-1">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Card dark className="p-8 bg-gradient-to-br from-green-900/50 to-secondary-light">
                            <div className="text-center">
                                <Leaf className="text-accent-green mx-auto" size={64} />
                                <h3 className="text-2xl font-bold text-white mt-4">2050 Net-Zero Target</h3>
                                <p className="text-gray-400 mt-2">Committed to carbon neutrality through innovation and sustainable practices.</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
