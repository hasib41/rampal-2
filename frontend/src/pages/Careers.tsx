import { useState } from 'react';
import { Calendar, MapPin, Briefcase, X } from 'lucide-react';
import { PageHeader, Card, Button, Input, Textarea, LoadingSpinner } from '../components/ui';
import { useCareers } from '../hooks/useApi';
import { careersApi } from '../services/api';
import type { Career } from '../types';

export function CareersPage() {
    const { data: careers, isLoading } = useCareers();
    const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        linkedin_url: '',
        cover_letter: '',
    });
    const [resume, setResume] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCareer || !resume) return;

        setSubmitting(true);
        const data = new FormData();
        data.append('career', selectedCareer.id.toString());
        data.append('full_name', formData.full_name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('linkedin_url', formData.linkedin_url);
        data.append('cover_letter', formData.cover_letter);
        data.append('resume', resume);

        try {
            await careersApi.apply(data);
            setSubmitted(true);
        } catch (error) {
            console.error('Failed to submit application:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const closeModal = () => {
        setSelectedCareer(null);
        setSubmitted(false);
        setFormData({ full_name: '', email: '', phone: '', linkedin_url: '', cover_letter: '' });
        setResume(null);
    };

    return (
        <div className="bg-secondary min-h-screen">
            <PageHeader
                title="Careers at BIFPCL"
                subtitle="Join our team and be part of Bangladesh's energy future."
            />

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : careers?.length === 0 ? (
                        <div className="text-center text-gray-400 py-12">
                            <p>No open positions at the moment. Check back later!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {careers?.map((career) => (
                                <Card key={career.id} dark className="p-6">
                                    <h3 className="text-xl font-bold text-white">{career.title}</h3>
                                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                                        <span className="flex items-center gap-1"><Briefcase size={14} /> {career.department}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {career.location}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar size={14} className="text-accent-orange" />
                                            <span className="text-gray-400">Deadline: {new Date(career.deadline).toLocaleDateString()}</span>
                                        </div>
                                        <Button size="sm" onClick={() => setSelectedCareer(career)}>Apply Now</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Application Modal */}
            {selectedCareer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={closeModal}>
                    <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Apply for {selectedCareer.title}</h2>
                                <p className="text-gray-500 text-sm">{selectedCareer.department} | {selectedCareer.location}</p>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        {submitted ? (
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-accent-green text-2xl">✓</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Application Submitted!</h3>
                                <p className="text-gray-600 mt-2">We'll review your application and get back to you.</p>
                                <Button onClick={closeModal} className="mt-4">Close</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Full Name"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        required
                                        className="!bg-gray-100 !text-gray-900 !border-gray-300"
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="!bg-gray-100 !text-gray-900 !border-gray-300"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                        className="!bg-gray-100 !text-gray-900 !border-gray-300"
                                    />
                                    <Input
                                        label="LinkedIn (optional)"
                                        value={formData.linkedin_url}
                                        onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                        className="!bg-gray-100 !text-gray-900 !border-gray-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume / CV</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setResume(e.target.files?.[0] || null)}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <Textarea
                                    label="Cover Letter"
                                    value={formData.cover_letter}
                                    onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                                    required
                                    className="!bg-gray-100 !text-gray-900 !border-gray-300"
                                />
                                <div className="flex gap-3 pt-2">
                                    <Button type="button" variant="secondary" onClick={closeModal} className="flex-1 !text-gray-700 !border-gray-300">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={submitting} className="flex-1">
                                        {submitting ? 'Submitting...' : 'Submit Application'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
