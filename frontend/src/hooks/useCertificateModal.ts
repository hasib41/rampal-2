// Storage key for tracking if modal has been shown this session
const CERTIFICATE_MODAL_SHOWN_KEY = 'bifpcl_certificate_modal_shown';

// Hook to manually control the certificate modal
export function useCertificateModal() {
    const resetModal = () => {
        sessionStorage.removeItem(CERTIFICATE_MODAL_SHOWN_KEY);
    };

    const hasBeenShown = () => {
        return sessionStorage.getItem(CERTIFICATE_MODAL_SHOWN_KEY) === 'true';
    };

    return { resetModal, hasBeenShown };
}
