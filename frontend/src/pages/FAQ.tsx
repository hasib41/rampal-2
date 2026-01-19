import { useState, useMemo } from 'react';
import { Search, ChevronDown, Zap, Leaf, Users, Building2, FileText, HelpCircle, X } from 'lucide-react';
import { Card } from '../components/ui';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQCategory {
    id: string;
    name: string;
    icon: React.ElementType;
    description: string;
    faqs: FAQItem[];
}

const faqCategories: FAQCategory[] = [
    {
        id: 'general',
        name: 'General',
        icon: HelpCircle,
        description: 'Basic information about BIFPCL',
        faqs: [
            {
                question: 'What is BIFPCL?',
                answer: 'Bangladesh-India Friendship Power Company (Pvt.) Limited (BIFPCL) is a 50:50 joint venture between Bangladesh Power Development Board (BPDB) and NTPC Limited of India. It operates the Maitree Super Thermal Power Project, a symbol of Indo-Bangladesh friendship and cooperation in the power sector.',
            },
            {
                question: 'What is the shareholding structure of BIFPCL?',
                answer: 'BIFPCL is owned equally by two government entities: 50% by NTPC Limited of India and 50% by Bangladesh Power Development Board (BPDB). This balanced ownership structure ensures equal partnership and shared benefits between both nations.',
            },
            {
                question: 'Where is the Maitree Super Thermal Power Project located?',
                answer: 'The Maitree Super Thermal Power Project is located in Rampal Upazila, Bagerhat District, in southwestern Bangladesh. The site is approximately 14 kilometers north of the Sundarbans, the world\'s largest mangrove forest.',
            },
            {
                question: 'What is the total power generation capacity?',
                answer: 'The Maitree Super Thermal Power Project has a total installed capacity of 1,320 MW, consisting of two units of 660 MW each. This makes it one of the largest power plants in Bangladesh.',
            },
            {
                question: 'When did the power plant become operational?',
                answer: 'Unit 1 of the Maitree Super Thermal Power Project was commissioned in 2023, followed by Unit 2. Both units are now fully operational, contributing significantly to Bangladesh\'s power grid.',
            },
        ],
    },
    {
        id: 'technology',
        name: 'Technology',
        icon: Zap,
        description: 'Technical specifications and operations',
        faqs: [
            {
                question: 'What technology does the power plant use?',
                answer: 'The Maitree Super Thermal Power Project uses Ultra-Supercritical (USC) technology, which operates at higher temperatures and pressures than conventional plants. This results in approximately 42-43% thermal efficiency, significantly higher than the 33-35% efficiency of subcritical plants.',
            },
            {
                question: 'What fuel does the power plant use?',
                answer: 'The plant uses imported coal as its primary fuel. The coal is sourced from reliable international suppliers and transported via sea to the Mongla Port, from where it is transferred to the plant site through a dedicated conveyor system.',
            },
            {
                question: 'What is the Plant Load Factor (PLF)?',
                answer: 'The Maitree Super Thermal Power Project operates at a high Plant Load Factor (PLF), typically exceeding 85%. This indicates efficient utilization of the plant\'s capacity and reliable power generation.',
            },
            {
                question: 'How is power transmitted from the plant?',
                answer: 'The generated power is evacuated through a 400 kV double-circuit transmission line connected to the national grid. The Power Grid Company of Bangladesh (PGCB) manages the transmission infrastructure.',
            },
            {
                question: 'What cooling system does the plant use?',
                answer: 'The plant uses a closed-cycle cooling system with natural draft cooling towers. This system minimizes water consumption and prevents thermal discharge into nearby water bodies, protecting the local ecosystem.',
            },
        ],
    },
    {
        id: 'environment',
        name: 'Environment',
        icon: Leaf,
        description: 'Environmental protection and sustainability',
        faqs: [
            {
                question: 'What are the environmental safeguards at the Maitree Project?',
                answer: 'BIFPCL has implemented comprehensive environmental safeguards including Flue Gas Desulfurization (FGD) for SO2 removal, Electrostatic Precipitators (ESP) for particulate matter control, Selective Catalytic Reduction (SCR) for NOx reduction, and a closed-cycle cooling system to prevent thermal pollution.',
            },
            {
                question: 'How does the plant protect the Sundarbans?',
                answer: 'Multiple measures protect the Sundarbans: the plant is located 14 km away from the forest boundary, uses USC technology for lower emissions, employs world-class pollution control equipment, and follows strict IFC Performance Standards and Equator Principles. Continuous environmental monitoring ensures compliance.',
            },
            {
                question: 'What is the Effluent Treatment Process?',
                answer: 'The plant has a Zero Liquid Discharge (ZLD) system that treats all wastewater and recycles it for plant use. No industrial effluent is discharged into surrounding water bodies, protecting local aquatic ecosystems.',
            },
            {
                question: 'How is coal ash managed?',
                answer: 'Coal ash is managed through a dry ash handling system. The ash is stored in a scientifically designed ash pond with proper lining to prevent groundwater contamination. BIFPCL is also exploring ash utilization in cement and brick manufacturing.',
            },
            {
                question: 'Does BIFPCL conduct environmental monitoring?',
                answer: 'Yes, BIFPCL conducts continuous ambient air quality monitoring through online stations, regular water quality testing in surrounding areas, periodic noise level assessments, and wildlife and ecological surveys. Reports are submitted to environmental authorities quarterly.',
            },
        ],
    },
    {
        id: 'community',
        name: 'Community',
        icon: Users,
        description: 'CSR initiatives and local engagement',
        faqs: [
            {
                question: 'What CSR initiatives does BIFPCL undertake?',
                answer: 'BIFPCL implements comprehensive CSR programs including education support (scholarships, school infrastructure), healthcare (medical camps, mobile clinics), environmental conservation (mangrove plantation), livelihood development (skill training, women empowerment), and infrastructure development in local communities.',
            },
            {
                question: 'How many local people are employed at the plant?',
                answer: 'BIFPCL prioritizes local employment and has created thousands of direct and indirect jobs. During construction, over 4,000 local workers were employed. Currently, a significant portion of the operational workforce comes from the local community.',
            },
            {
                question: 'What educational support does BIFPCL provide?',
                answer: 'BIFPCL provides extensive educational support including merit-based scholarships for engineering and medical students, construction and renovation of local schools, distribution of educational materials, computer labs and libraries in local institutions, and vocational training programs.',
            },
            {
                question: 'How can local communities benefit from BIFPCL?',
                answer: 'Local communities benefit through employment opportunities, improved infrastructure (roads, electricity, water supply), healthcare facilities, educational support, skill development programs, and economic growth through increased business activity in the region.',
            },
            {
                question: 'Does BIFPCL support local healthcare?',
                answer: 'Yes, BIFPCL operates regular health camps, provides mobile medical units, supports local hospitals with equipment and supplies, organizes vaccination drives, and offers specialized health programs for women and children.',
            },
        ],
    },
    {
        id: 'business',
        name: 'Business',
        icon: Building2,
        description: 'Tenders, procurement, and partnerships',
        faqs: [
            {
                question: 'How can I participate in the tender process?',
                answer: 'To participate in BIFPCL tenders: 1) Visit our Tenders page to view active opportunities, 2) Register as a vendor by submitting required documentation, 3) Download tender documents for opportunities that match your capabilities, 4) Submit your bid before the deadline with all required documents.',
            },
            {
                question: 'What are the vendor registration requirements?',
                answer: 'Vendor registration requires: valid business registration/trade license, tax identification documents, company profile and capabilities statement, relevant certifications and licenses, financial statements, and references from previous projects.',
            },
            {
                question: 'Does BIFPCL prefer local suppliers?',
                answer: 'BIFPCL actively supports local suppliers and has a policy of prioritizing qualified local vendors. We encourage local businesses to register as vendors and participate in our procurement processes for goods and services.',
            },
            {
                question: 'How can I become a contractor for BIFPCL?',
                answer: 'Contractors can register through our vendor portal, demonstrate relevant experience and capabilities, ensure compliance with our safety and quality standards, and participate in our competitive bidding processes for civil, electrical, and mechanical works.',
            },
            {
                question: 'Who can I contact for business inquiries?',
                answer: 'For business inquiries, you can reach out through our Contact page, email our procurement department, or visit our corporate office. We welcome partnerships and collaborations that align with our operational needs.',
            },
        ],
    },
    {
        id: 'careers',
        name: 'Careers',
        icon: FileText,
        description: 'Employment and career opportunities',
        faqs: [
            {
                question: 'How can I apply for a job at BIFPCL?',
                answer: 'To apply for positions at BIFPCL: 1) Visit our Careers page to view current openings, 2) Review job requirements and qualifications, 3) Prepare your resume and cover letter, 4) Submit your application through our online portal before the deadline.',
            },
            {
                question: 'What qualifications are typically required?',
                answer: 'Requirements vary by position. Technical roles typically require engineering degrees (Mechanical, Electrical, Civil) with relevant experience in power plants. Administrative roles require appropriate degrees and professional experience. All positions require commitment to safety and excellence.',
            },
            {
                question: 'Does BIFPCL offer internships?',
                answer: 'Yes, BIFPCL offers internship programs for engineering students and recent graduates. Internships provide hands-on experience in power plant operations, maintenance, and management. Interested candidates can apply through our Careers page.',
            },
            {
                question: 'What employee benefits does BIFPCL provide?',
                answer: 'BIFPCL offers competitive compensation packages including salary, housing allowance, medical insurance, provident fund, annual bonuses, professional development opportunities, and various other benefits as per company policy.',
            },
            {
                question: 'Is there on-site accommodation for employees?',
                answer: 'Yes, BIFPCL provides township facilities for employees including residential quarters, recreational facilities, medical center, educational facilities for children, shopping complex, and other amenities to ensure comfortable living.',
            },
        ],
    },
];

function FAQAccordion({ faq, isOpen, onToggle }: { faq: FAQItem; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="border-b border-white/10 last:border-b-0">
            <button
                className="w-full px-4 py-4 sm:px-6 sm:py-5 flex items-start justify-between text-left hover:bg-white/[0.02] transition-colors gap-3 active:bg-white/[0.04]"
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <span className="text-white font-medium text-sm sm:text-base leading-relaxed">{faq.question}</span>
                <ChevronDown
                    className={`text-primary-light flex-shrink-0 transition-transform duration-300 mt-0.5 ${isOpen ? 'rotate-180' : ''}`}
                    size={20}
                />
            </button>
            <div
                className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="px-4 pb-4 sm:px-6 sm:pb-5 text-gray-400 text-sm sm:text-base leading-relaxed">
                        {faq.answer}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function FAQPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [openFaqs, setOpenFaqs] = useState<Set<string>>(new Set());

    const toggleFaq = (categoryId: string, faqIndex: number) => {
        const key = `${categoryId}-${faqIndex}`;
        setOpenFaqs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const filteredCategories = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();

        if (!query && activeCategory === 'all') {
            return faqCategories;
        }

        return faqCategories
            .filter(category => activeCategory === 'all' || category.id === activeCategory)
            .map(category => ({
                ...category,
                faqs: category.faqs.filter(
                    faq =>
                        !query ||
                        faq.question.toLowerCase().includes(query) ||
                        faq.answer.toLowerCase().includes(query)
                ),
            }))
            .filter(category => category.faqs.length > 0);
    }, [searchQuery, activeCategory]);

    const totalResults = filteredCategories.reduce((sum, cat) => sum + cat.faqs.length, 0);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-16 pt-24 sm:py-20 sm:pt-28 md:py-24 md:pt-32 bg-gradient-to-br from-secondary via-secondary to-secondary-dark">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.1),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.1),transparent_50%)]" />
                </div>
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 border border-primary/20 rounded-full mb-4 sm:mb-6">
                        <HelpCircle className="text-primary-light" size={16} />
                        <span className="text-primary-light text-xs sm:text-sm font-medium">Help Center</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                        Frequently Asked Questions
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto px-2">
                        Find answers to common questions about BIFPCL, our operations, and how to work with us.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-6 sm:mt-8 max-w-xl mx-auto relative">
                        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                                aria-label="Clear search"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {/* Search Results Count */}
                    {searchQuery && (
                        <p className="mt-3 sm:mt-4 text-gray-400 text-sm sm:text-base">
                            Found <span className="text-primary-light font-medium">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for "{searchQuery}"
                        </p>
                    )}
                </div>
            </section>

            {/* Category Tabs */}
            <section className="bg-secondary border-b border-white/10 sticky top-16 z-20">
                <div className="max-w-7xl mx-auto px-3 sm:px-4">
                    <div
                        className="flex gap-1.5 sm:gap-2 overflow-x-auto py-3 sm:py-4 -mx-3 px-3 sm:-mx-4 sm:px-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                                activeCategory === 'all'
                                    ? 'bg-primary text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5 active:bg-white/10'
                            }`}
                        >
                            All Topics
                        </button>
                        {faqCategories.map(category => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ${
                                        activeCategory === category.id
                                            ? 'bg-primary text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5 active:bg-white/10'
                                    }`}
                                >
                                    <Icon size={14} className="sm:w-4 sm:h-4" />
                                    <span className="hidden xs:inline sm:inline">{category.name}</span>
                                    <span className="xs:hidden sm:hidden">{category.name.slice(0, 3)}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="bg-secondary py-8 sm:py-12 md:py-16">
                <div className="max-w-4xl mx-auto px-3 sm:px-4">
                    {filteredCategories.length === 0 ? (
                        <div className="text-center py-12 sm:py-16">
                            <HelpCircle className="mx-auto text-gray-500 mb-4" size={40} />
                            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No results found</h3>
                            <p className="text-gray-400 text-sm sm:text-base">
                                Try adjusting your search or browse all categories.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setActiveCategory('all');
                                }}
                                className="mt-4 text-primary-light hover:underline text-sm sm:text-base"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 sm:space-y-10 md:space-y-12">
                            {filteredCategories.map(category => {
                                const Icon = category.icon;
                                return (
                                    <div key={category.id}>
                                        {/* Category Header */}
                                        <div className="flex items-start sm:items-center gap-3 mb-4 sm:mb-6">
                                            <div className="p-2 sm:p-2.5 bg-primary/10 rounded-lg flex-shrink-0">
                                                <Icon className="text-primary-light w-5 h-5 sm:w-6 sm:h-6" />
                                            </div>
                                            <div className="min-w-0">
                                                <h2 className="text-xl sm:text-2xl font-bold text-white">{category.name}</h2>
                                                <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{category.description}</p>
                                            </div>
                                        </div>

                                        {/* FAQ Card */}
                                        <Card padding="none" className="overflow-hidden">
                                            {category.faqs.map((faq, index) => (
                                                <FAQAccordion
                                                    key={index}
                                                    faq={faq}
                                                    isOpen={openFaqs.has(`${category.id}-${index}`)}
                                                    onToggle={() => toggleFaq(category.id, index)}
                                                />
                                            ))}
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-secondary-dark py-12 sm:py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                        Still have questions?
                    </h2>
                    <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base max-w-md mx-auto">
                        Can't find the answer you're looking for? Our team is here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-primary hover:bg-primary-light text-white font-medium rounded-lg transition-colors text-sm sm:text-base active:scale-[0.98]"
                        >
                            Contact Support
                        </a>
                        <a
                            href="mailto:info@bifpcl.com"
                            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg border border-white/10 transition-colors text-sm sm:text-base active:scale-[0.98]"
                        >
                            Email Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
