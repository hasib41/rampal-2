import { useState, useRef } from 'react';
import { MapPin, Briefcase, X, Upload, FileText, CheckCircle, AlertCircle, Clock, DollarSign, ChevronRight, User, Mail, Phone, Linkedin, Loader2 } from 'lucide-react';
import { PageHeader, Card, Button, LoadingSpinner } from '../components/ui';
import { useCareers } from '../hooks/useApi';
import { careersApi } from '../services/api';
import type { Career } from '../types';

// Application form steps
type FormStep = 'details' | 'documents' | 'review';

export function CareersPage() {
    const { data: careers, isLoading } = useCareers();
    const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
    const [currentStep, setCurrentStep] = useState<FormStep>('details');
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        linkedin_url: '',
        cover_letter: '',
    });
    const [resume, setResume] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Calculate days remaining
    const getDaysRemaining = (deadline: string) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Validate current step
    const validateStep = (step: FormStep): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 'details') {
            if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
            if (!formData.email.trim()) newErrors.email = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
            if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        }

        if (step === 'documents') {
            if (!resume) newErrors.resume = 'Resume is required';
            if (!formData.cover_letter.trim()) newErrors.cover_letter = 'Cover letter is required';
            else if (formData.cover_letter.length < 100) newErrors.cover_letter = 'Cover letter must be at least 100 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle step navigation
    const nextStep = () => {
        if (currentStep === 'details' && validateStep('details')) {
            setCurrentStep('documents');
        } else if (currentStep === 'documents' && validateStep('documents')) {
            setCurrentStep('review');
        }
    };

    const prevStep = () => {
        if (currentStep === 'documents') setCurrentStep('details');
        else if (currentStep === 'review') setCurrentStep('documents');
    };

    // Handle file drop
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf' || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
                setResume(file);
                setErrors({ ...errors, resume: '' });
            } else {
                setErrors({ ...errors, resume: 'Please upload a PDF or Word document' });
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setResume(e.target.files[0]);
            setErrors({ ...errors, resume: '' });
        }
    };

    const handleSubmit = async () => {
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
            setErrors({ submit: 'Failed to submit application. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    const closeModal = () => {
        setSelectedCareer(null);
        setSubmitted(false);
        setCurrentStep('details');
        setFormData({ full_name: '', email: '', phone: '', linkedin_url: '', cover_letter: '' });
        setResume(null);
        setErrors({});
    };

    const openModal = (career: Career) => {
        setSelectedCareer(career);
        setCurrentStep('details');
    };

    // Step indicator component
    const StepIndicator = () => (
        <div className="flex items-center justify-center gap-2 mb-6">
            {(['details', 'documents', 'review'] as FormStep[]).map((step, index) => {
                const isActive = currentStep === step;
                const isCompleted =
                    (step === 'details' && (currentStep === 'documents' || currentStep === 'review')) ||
                    (step === 'documents' && currentStep === 'review');

                return (
                    <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${isCompleted ? 'bg-accent-green text-white' :
                            isActive ? 'bg-primary text-white' :
                                'bg-gray-700 text-gray-400'
                            }`}>
                            {isCompleted ? <CheckCircle size={16} /> : index + 1}
                        </div>
                        {index < 2 && (
                            <div className={`w-12 h-0.5 mx-2 transition-colors ${isCompleted ? 'bg-accent-green' : 'bg-gray-700'
                                }`} />
                        )}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="bg-secondary-dark min-h-screen">
            <PageHeader
                title="Careers at BIFPCL"
                subtitle="Join our team and be part of Bangladesh's energy future. We offer competitive salaries, excellent benefits, and growth opportunities."
                bgImage="/careers-hero.jpg"
            />

            {/* Stats Section */}
            <section className="bg-secondary py-8 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <p className="text-3xl font-bold text-primary-light">{careers?.length || 0}</p>
                            <p className="text-gray-400 text-sm">Open Positions</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-accent-green">500+</p>
                            <p className="text-gray-400 text-sm">Employees</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-accent-orange">4</p>
                            <p className="text-gray-400 text-sm">Departments</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-purple-400">95%</p>
                            <p className="text-gray-400 text-sm">Employee Satisfaction</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Listings */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-white mb-8">Open Positions</h2>

                    {isLoading ? (
                        <LoadingSpinner />
                    ) : careers?.length === 0 ? (
                        <div className="text-center py-16 bg-secondary rounded-xl border border-gray-700">
                            <Briefcase className="mx-auto text-gray-600 mb-4" size={48} />
                            <p className="text-gray-400">No open positions at the moment. Check back later!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {careers?.map((career) => {
                                const daysRemaining = getDaysRemaining(career.deadline);
                                const isUrgent = daysRemaining <= 7;

                                return (
                                    <Card
                                        key={career.id}
                                        dark
                                        className="p-6 hover:border-primary/50 transition-all duration-300 group"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            {/* Job Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-white group-hover:text-primary-light transition-colors">
                                                        {career.title}
                                                    </h3>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${career.employment_type === 'full_time'
                                                        ? 'bg-accent-green/20 text-accent-green'
                                                        : 'bg-accent-orange/20 text-accent-orange'
                                                        }`}>
                                                        {career.employment_type === 'full_time' ? 'Full Time' : 'Contract'}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <Briefcase size={14} className="text-gray-500" />
                                                        {career.department}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin size={14} className="text-gray-500" />
                                                        {career.location}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <DollarSign size={14} className="text-gray-500" />
                                                        {career.salary_range}
                                                    </span>
                                                </div>

                                                <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                                                    {career.description}
                                                </p>
                                            </div>

                                            {/* Deadline & Apply */}
                                            <div className="flex md:flex-col items-center md:items-end gap-4">
                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isUrgent ? 'bg-red-500/10 text-red-400' : 'bg-gray-800 text-gray-400'
                                                    }`}>
                                                    <Clock size={14} />
                                                    <span className="text-sm font-medium">
                                                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                                                    </span>
                                                </div>
                                                <Button
                                                    onClick={() => openModal(career)}
                                                    className="group/btn"
                                                    disabled={daysRemaining <= 0}
                                                >
                                                    Apply Now
                                                    <ChevronRight size={16} className="ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Application Modal */}
            {selectedCareer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
                    <div
                        className="bg-secondary rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-primary/20 to-accent-green/10 p-6 border-b border-gray-700">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-primary-light text-sm font-medium mb-1">Apply for Position</p>
                                    <h2 className="text-2xl font-bold text-white">{selectedCareer.title}</h2>
                                    <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Briefcase size={14} /> {selectedCareer.department}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} /> {selectedCareer.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign size={14} /> {selectedCareer.salary_range}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            {submitted ? (
                                /* Success State */
                                <div className="text-center py-8">
                                    <div className="w-20 h-20 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                        <CheckCircle className="text-accent-green" size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
                                    <p className="text-gray-400 max-w-md mx-auto">
                                        Thank you for applying for the <span className="text-white font-medium">{selectedCareer.title}</span> position.
                                        We'll review your application and get back to you within 5-7 business days.
                                    </p>
                                    <Button onClick={closeModal} className="mt-6">
                                        Close
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <StepIndicator />

                                    {/* Step 1: Personal Details */}
                                    {currentStep === 'details' && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-1.5">
                                                        <User size={14} className="inline mr-1" />
                                                        Full Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.full_name}
                                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                        placeholder="John Doe"
                                                        className={`w-full px-4 py-3 bg-secondary-dark border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.full_name ? 'border-red-500' : 'border-gray-700'
                                                            }`}
                                                    />
                                                    {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-1.5">
                                                        <Mail size={14} className="inline mr-1" />
                                                        Email Address *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        placeholder="john@example.com"
                                                        className={`w-full px-4 py-3 bg-secondary-dark border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-700'
                                                            }`}
                                                    />
                                                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-1.5">
                                                        <Phone size={14} className="inline mr-1" />
                                                        Phone Number *
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        placeholder="+880 1XXX-XXXXXX"
                                                        className={`w-full px-4 py-3 bg-secondary-dark border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.phone ? 'border-red-500' : 'border-gray-700'
                                                            }`}
                                                    />
                                                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-1.5">
                                                        <Linkedin size={14} className="inline mr-1" />
                                                        LinkedIn Profile (Optional)
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={formData.linkedin_url}
                                                        onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                                        placeholder="https://linkedin.com/in/johndoe"
                                                        className="w-full px-4 py-3 bg-secondary-dark border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Documents */}
                                    {currentStep === 'documents' && (
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-semibold text-white mb-4">Documents & Cover Letter</h3>

                                            {/* Resume Upload */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    <FileText size={14} className="inline mr-1" />
                                                    Resume / CV *
                                                </label>
                                                <div
                                                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragActive
                                                        ? 'border-primary bg-primary/5'
                                                        : errors.resume
                                                            ? 'border-red-500 bg-red-500/5'
                                                            : resume
                                                                ? 'border-accent-green bg-accent-green/5'
                                                                : 'border-gray-700 hover:border-gray-600'
                                                        }`}
                                                    onDragEnter={handleDrag}
                                                    onDragLeave={handleDrag}
                                                    onDragOver={handleDrag}
                                                    onDrop={handleDrop}
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={handleFileSelect}
                                                        className="hidden"
                                                    />

                                                    {resume ? (
                                                        <div className="flex items-center justify-center gap-3">
                                                            <div className="w-12 h-12 bg-accent-green/20 rounded-xl flex items-center justify-center">
                                                                <FileText className="text-accent-green" size={24} />
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-white font-medium">{resume.name}</p>
                                                                <p className="text-gray-500 text-sm">
                                                                    {(resume.size / 1024 / 1024).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); setResume(null); }}
                                                                className="ml-4 text-gray-400 hover:text-red-400"
                                                            >
                                                                <X size={20} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Upload className={`mx-auto mb-3 ${dragActive ? 'text-primary' : 'text-gray-500'}`} size={32} />
                                                            <p className="text-white font-medium">
                                                                Drag and drop your resume here
                                                            </p>
                                                            <p className="text-gray-500 text-sm mt-1">
                                                                or click to browse (PDF, DOC, DOCX)
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                                {errors.resume && <p className="text-red-400 text-xs mt-1">{errors.resume}</p>}
                                            </div>

                                            {/* Cover Letter */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="text-sm font-medium text-gray-400">
                                                        Cover Letter *
                                                    </label>
                                                    <span className={`text-xs ${formData.cover_letter.length < 100 ? 'text-gray-500' : 'text-accent-green'}`}>
                                                        {formData.cover_letter.length} / 100 min
                                                    </span>
                                                </div>
                                                <textarea
                                                    value={formData.cover_letter}
                                                    onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                                                    placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                                                    rows={6}
                                                    className={`w-full px-4 py-3 bg-secondary-dark border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none ${errors.cover_letter ? 'border-red-500' : 'border-gray-700'
                                                        }`}
                                                />
                                                {errors.cover_letter && <p className="text-red-400 text-xs mt-1">{errors.cover_letter}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Review */}
                                    {currentStep === 'review' && (
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-semibold text-white mb-4">Review Your Application</h3>

                                            {/* Personal Info Summary */}
                                            <div className="bg-secondary-dark rounded-xl p-4 border border-gray-700">
                                                <h4 className="text-sm font-medium text-gray-400 mb-3">Personal Information</h4>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-500">Full Name</p>
                                                        <p className="text-white font-medium">{formData.full_name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Email</p>
                                                        <p className="text-white font-medium">{formData.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Phone</p>
                                                        <p className="text-white font-medium">{formData.phone}</p>
                                                    </div>
                                                    {formData.linkedin_url && (
                                                        <div>
                                                            <p className="text-gray-500">LinkedIn</p>
                                                            <p className="text-primary-light font-medium truncate">{formData.linkedin_url}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Documents Summary */}
                                            <div className="bg-secondary-dark rounded-xl p-4 border border-gray-700">
                                                <h4 className="text-sm font-medium text-gray-400 mb-3">Documents</h4>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-accent-green/20 rounded-lg flex items-center justify-center">
                                                        <FileText className="text-accent-green" size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{resume?.name}</p>
                                                        <p className="text-gray-500 text-xs">Resume uploaded</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Cover Letter Preview */}
                                            <div className="bg-secondary-dark rounded-xl p-4 border border-gray-700">
                                                <h4 className="text-sm font-medium text-gray-400 mb-3">Cover Letter</h4>
                                                <p className="text-gray-300 text-sm line-clamp-3">{formData.cover_letter}</p>
                                            </div>

                                            {errors.submit && (
                                                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                                    <AlertCircle size={16} />
                                                    {errors.submit}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Navigation Buttons */}
                                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
                                        {currentStep !== 'details' && (
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={prevStep}
                                                className="flex-1"
                                            >
                                                Back
                                            </Button>
                                        )}

                                        {currentStep === 'review' ? (
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={submitting}
                                                className="flex-1"
                                            >
                                                {submitting ? (
                                                    <>
                                                        <Loader2 className="animate-spin mr-2" size={18} />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    'Submit Application'
                                                )}
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={nextStep}
                                                className="flex-1"
                                            >
                                                Continue
                                                <ChevronRight size={16} className="ml-1" />
                                            </Button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
