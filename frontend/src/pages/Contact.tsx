import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { PageHeader, Card, Button, Input, Textarea, Select } from '../components/ui';
import { contactApi } from '../services/api';

const categoryOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'media', label: 'Media Relations' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'careers', label: 'Careers' },
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
        <div className="bg-secondary min-h-screen">
            <PageHeader
                title="Institutional Support & Contact Center"
                subtitle="Connecting with stakeholders, investors, and communities."
            />

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <Card dark className="p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Send an Inquiry</h2>
                            {submitted ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-accent-green text-2xl">✓</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Message Sent!</h3>
                                    <p className="text-gray-400 mt-2">We'll respond to your inquiry shortly.</p>
                                    <Button onClick={() => { setSubmitted(false); setFormData({ full_name: '', organization: '', email: '', category: 'general', message: '' }); }} className="mt-4">
                                        Send Another
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Full Name" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required />
                                        <Input label="Organization" value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} />
                                    </div>
                                    <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                                    <Select label="Inquiry Category" options={categoryOptions} value={formData.category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })} />
                                    <Textarea label="Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                                    <Button type="submit" disabled={submitting} className="w-full">
                                        {submitting ? 'Submitting...' : 'Submit Request'}
                                    </Button>
                                </form>
                            )}
                        </Card>

                        {/* Office Info */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Office Locations</h2>
                            <Card dark className="p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Head Office</h3>
                                <div className="space-y-3 text-gray-300">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-primary-light mt-1" size={18} />
                                        <p>BIFPCL Office, Rampal, Bagerhat, Bangladesh</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="text-primary-light" size={18} />
                                        <p>+880-2-XXX-XXXX</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="text-primary-light" size={18} />
                                        <p>info@bifpcl.com</p>
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { title: 'Media Relations', desc: 'Press inquiries and corporate branding' },
                                    { title: 'Technical Support', desc: 'Engineering and stakeholder support' },
                                    { title: 'Careers', desc: 'Human resources and professional development' },
                                ].map((item) => (
                                    <Card key={item.title} dark className="p-4">
                                        <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                                        <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
