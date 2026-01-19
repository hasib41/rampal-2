import { useState } from 'react';
import { Mail, Phone, MapPin, ChevronDown, Download, Globe } from 'lucide-react';
import { Card, Button, Input, Textarea, Select } from '../components/ui';
import { contactApi } from '../services/api';

const categoryOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'media', label: 'Media Relations' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'careers', label: 'Careers' },
];

const faqs = [
    {
        question: 'How can I participate in the current tender process?',
        answer: 'To participate in our tender process, please register on our Vendor Portal and submit the required documentation. You can view all active tenders on our Tenders page.',
    },
    {
        question: 'What are the environmental safeguards at the Maitree Project?',
        answer: 'BIFPCL utilizes Ultra-Supercritical Technology which ensures lower emissions and higher efficiency. We strictly adhere to IFC guidelines and Equator Principles to ensure minimum impact on the ecosystem.',
    },
    {
        question: 'What is the shareholding structure of BIFPCL?',
        answer: 'BIFPCL is a 50:50 joint venture between NTPC Ltd. of India and BPDB of Bangladesh, representing a landmark bilateral cooperation in the power sector.',
    },
];

export function ContactPage() {
    const [formData, setFormData] = useState({
        full_name: '',
        organization: '',
        email: '',
        category: 'general',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await contactApi.submit(formData);
            setSubmitted(true);
        } catch (error) {
            console.error('Failed to submit:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 pt-32 bg-gradient-to-r from-emerald-900 to-teal-800">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/contact-hero.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-teal-800/75 to-emerald-900/85" />
                <div className="relative max-w-7xl mx-auto px-4">
                    <span className="text-emerald-300 text-sm font-semibold uppercase tracking-wider">
                        Stakeholder Hub
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
                        Institutional Support &<br />
                        <span className="text-emerald-300">Contact Center</span>
                    </h1>
                    <p className="mt-4 text-xl text-white/80 max-w-2xl">
                        Connecting international stakeholders, investors, and local communities to the heart of Bangladesh-India power cooperation.
                    </p>
                    <div className="flex gap-4 mt-6">
                        <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                            <Globe className="mr-2" size={18} />
                            Global Offices
                        </Button>
                        <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                            <Download className="mr-2" size={18} />
                            Download Profiles
                        </Button>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="bg-slate-50 dark:bg-secondary py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Mail className="text-primary" size={24} />
                                Send an Inquiry
                            </h2>
                            {submitted ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-accent-green text-2xl">✓</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Message Sent!</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2">We'll respond to your inquiry shortly.</p>
                                    <Button onClick={() => { setSubmitted(false); setFormData({ full_name: '', organization: '', email: '', category: 'general', message: '' }); }} className="mt-4">
                                        Send Another
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Full Name" placeholder="Enter name" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required />
                                        <Input label="Organization" placeholder="Company/Agency" value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} />
                                    </div>
                                    <Input label="Email" type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                                    <Select label="Inquiry Category" options={categoryOptions} value={formData.category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })} />
                                    <Textarea label="Message" placeholder="Details of your request..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                                    <Button type="submit" disabled={submitting} className="w-full">
                                        {submitting ? 'Submitting...' : '→ Submit Request'}
                                    </Button>
                                </form>
                            )}
                        </Card>

                        {/* Office Info */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Office Locations</h2>

                            {/* Map Placeholder */}
                            <Card className="p-0 overflow-hidden">
                                <div className="h-64 bg-gradient-to-br from-primary/10 via-emerald-50 to-slate-100 dark:from-primary/20 dark:via-secondary dark:to-secondary-light relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <MapPin className="text-primary mx-auto" size={48} />
                                            <p className="text-gray-900 dark:text-white mt-2 font-medium">BIFPCL Office</p>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Rampal, Bagerhat</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <Phone className="text-primary" size={18} />
                                        <span className="text-gray-600 dark:text-gray-300">+880 2 968 1234</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="text-primary" size={18} />
                                        <span className="text-gray-600 dark:text-gray-300">info@bifpcl.com</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Department Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { icon: Mail, title: 'Media Relations', desc: 'Press releases, media kits, and corporate branding inquiries for journalists.' },
                                    { icon: Phone, title: 'Technical Support', desc: 'Site coordination, grid connectivity, and engineering stakeholder support.' },
                                    { icon: MapPin, title: 'Careers', desc: 'Inquiries regarding human resources, internships, and professional development.' },
                                ].map((item) => (
                                    <Card key={item.title} className="p-4 hover:bg-slate-50 dark:hover:bg-secondary-light transition-colors group">
                                        <item.icon className="text-primary mb-3 group-hover:scale-110 transition-transform" size={24} />
                                        <h4 className="text-gray-900 dark:text-white font-semibold text-sm">{item.title}</h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{item.desc}</p>
                                        <span className="text-primary text-xs mt-2 inline-block cursor-pointer hover:underline">
                                            Contact Now →
                                        </span>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white dark:bg-secondary-dark py-16 border-t border-slate-100 dark:border-transparent">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
                        Common inquiries from our institutional partners and the public.
                    </p>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <Card
                                key={index}
                                className="overflow-hidden"
                            >
                                <button
                                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-secondary-light transition-colors"
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                >
                                    <span className="text-gray-900 dark:text-white font-medium">{faq.question}</span>
                                    <ChevronDown
                                        className={`text-primary transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                                        size={20}
                                    />
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-4 text-gray-600 dark:text-gray-400">
                                        {faq.answer}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
