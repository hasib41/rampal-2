import { Link } from 'react-router-dom';

const footerLinks = {
    quickLinks: [
        { name: 'FAQ', path: '/faq' },
        { name: 'Careers', path: '/careers' },
        { name: 'Sustainability', path: '/sustainability' },
        { name: 'Contact', path: '/contact' },
    ],
    legal: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Compliance', path: '/compliance' },
    ],
};

export function Footer() {
    return (
        <footer className="bg-slate-100 dark:bg-secondary-dark text-gray-600 dark:text-gray-300 border-t border-slate-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src="/Logo.png"
                                alt="BIFPCL Logo"
                                className="w-14 h-14 object-contain"
                            />
                            <h3 className="text-gray-900 dark:text-white font-bold text-xl">BIFPCL</h3>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Bangladesh-India Friendship Power Company (Pvt.) Limited. A mega-scale joint venture
                            powering the nation's progress with sustainable energy.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {footerLinks.quickLinks.map((link) => (
                                <li key={link.path}>
                                    <Link to={link.path} className="hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.path}>
                                    <Link to={link.path} className="hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Connect</h4>
                        <div className="space-y-2 text-sm">
                            <p>Email: info@bifpcl.com</p>
                            <p>Phone: +880-2-XXXXXXX</p>
                            <p>Rampal, Bagerhat, Bangladesh</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-gray-700 mt-8 pt-8 text-center text-sm">
                    <p>© {new Date().getFullYear()} BIFPCL. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
