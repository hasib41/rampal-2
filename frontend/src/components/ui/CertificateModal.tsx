import { useState, useEffect } from 'react';
import { X, Award } from 'lucide-react';
import { siteSettingsApi, getMediaUrl } from '../../services/api';
import type { SiteSettings } from '../../types';

// Storage key for tracking if modal has been shown this session
const CERTIFICATE_MODAL_SHOWN_KEY = 'bifpcl_certificate_modal_shown';

export function CertificateModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSettingsAndShow = async () => {
            // Check if modal was already shown this session
            const hasBeenShown = sessionStorage.getItem(CERTIFICATE_MODAL_SHOWN_KEY);
            if (hasBeenShown) {
                setIsLoading(false);
                return;
            }

            try {
                const data = await siteSettingsApi.get();
                setSettings(data);

                // Only show if enabled and has an image
                if (data.show_certificate_modal && data.certificate_image) {
                    setIsOpen(true);
                    sessionStorage.setItem(CERTIFICATE_MODAL_SHOWN_KEY, 'true');
                }
            } catch (error) {
                console.error('Failed to load certificate settings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSettingsAndShow();
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    // Handle escape key press
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Don't render anything if loading, not open, or no settings
    if (isLoading || !isOpen || !settings) return null;

    const imageUrl = getMediaUrl(settings.certificate_image);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-modal-title"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Award className="w-6 h-6 sm:w-7 sm:h-7" />
                        <h2
                            id="certificate-modal-title"
                            className="text-lg sm:text-xl font-bold tracking-wide"
                            style={{ fontStyle: 'italic' }}
                        >
                            {settings.certificate_title || 'BIFPCL ISO CERTIFICATE'}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label="Close certificate modal"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* Certificate Image Container */}
                <div className="relative bg-white overflow-y-auto max-h-[calc(90vh-60px)]">
                    {/* Loading placeholder */}
                    {!imageLoaded && !imageError && (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent" />
                        </div>
                    )}

                    {/* Error state */}
                    {imageError && (
                        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                            <Award className="w-16 h-16 text-emerald-500 mb-4" />
                            <p className="text-gray-600 text-lg font-medium">Certificate Image</p>
                            <p className="text-gray-400 text-sm mt-1">
                                Unable to load certificate image
                            </p>
                        </div>
                    )}

                    {/* Certificate Image */}
                    <img
                        src={imageUrl}
                        alt={settings.certificate_title || 'BIFPCL ISO Certificate'}
                        className={`w-full h-auto block ${imageLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                        loading="eager"
                    />
                </div>
            </div>
        </div>
    );
}
