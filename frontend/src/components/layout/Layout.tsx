import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CertificateModal, ChatBot } from '../ui';

export function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />

            {/* Certificate Modal - fetches settings from API and shows on first visit */}
            <CertificateModal />

            {/* AI ChatBot - floating assistant */}
            <ChatBot />
        </div>
    );
}
