import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Zap, Users, Newspaper, HelpCircle, Briefcase, Mail, Leaf, FolderOpen, ChevronRight, Sun, Moon, FileText, ExternalLink } from 'lucide-react';
import { useTheme } from '../../contexts';

// Partner site links
const partnerLinks = [
    { name: 'BPDB', url: 'https://bpdb.gov.bd', label: 'Bangladesh Power Development Board' },
    { name: 'NTPC', url: 'https://ntpc.co.in', label: 'NTPC Limited, India' },
];

// Navigation structure with icons for dropdowns
const navLinks = [
    { name: 'Home', path: '/' },
    {
        name: 'About',
        children: [
            { name: 'Board of Directors', path: '/directors', icon: Users, description: 'Meet our leadership team' },
            { name: 'Media Center', path: '/media', icon: Newspaper, description: 'News and press releases' },
            { name: 'FAQ', path: '/faq', icon: HelpCircle, description: 'Frequently asked questions' },
        ],
    },
    { name: 'Projects', path: '/projects', icon: FolderOpen },
    { name: 'Sustainability', path: '/sustainability', icon: Leaf },
    { name: 'Careers', path: '/careers', icon: Briefcase },
    { name: 'Contact', path: '/contact', icon: Mail },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    const prevPathRef = useRef(location.pathname);
    useEffect(() => {
        if (prevPathRef.current !== location.pathname) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsOpen(false);
            setActiveDropdown(null);
            prevPathRef.current = location.pathname;
        }
    }, [location.pathname]);

    // Toggle mobile dropdown
    const toggleMobileDropdown = (name: string) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-white dark:bg-secondary-dark shadow-lg shadow-gray-200/50 dark:shadow-black/20 border-b border-gray-100 dark:border-transparent'
                    : 'bg-white/95 dark:bg-secondary-dark/90 backdrop-blur-md border-b border-gray-100/50 dark:border-transparent'
            }`}
        >
            {/* Top accent bar with partner links */}
            <div className="h-7 bg-gradient-to-r from-primary via-primary-dark to-primary hidden sm:flex items-center justify-end px-4">
                <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-white/60">Partners:</span>
                    {partnerLinks.map((partner, index) => (
                        <a
                            key={partner.name}
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={partner.label}
                            className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
                        >
                            {partner.name}
                            <ExternalLink size={10} />
                            {index < partnerLinks.length - 1 && <span className="ml-3 text-white/30">|</span>}
                        </a>
                    ))}
                </div>
            </div>
            {/* Mobile accent bar */}
            <div className="h-1 bg-gradient-to-r from-primary via-primary-light to-accent-green sm:hidden" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-[72px]">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105">
                                <Zap className="text-white" size={22} />
                            </div>
                            {/* Pulse effect on hover */}
                            <div className="absolute inset-0 rounded-xl bg-primary/20 animate-ping opacity-0 group-hover:opacity-75 transition-opacity" style={{ animationDuration: '1.5s' }} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-900 dark:text-white font-bold text-lg leading-tight tracking-tight">BIFPCL</span>
                            <span className="text-gray-500 dark:text-gray-400 text-[10px] leading-tight hidden sm:block font-medium">Maitree Super Thermal Power</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center">
                        <div className="flex items-center">
                            {navLinks.map((link) =>
                                link.children ? (
                                    // Dropdown Menu
                                    <div key={link.name} className="relative group">
                                        <button className="relative px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white flex items-center gap-1.5 rounded-lg transition-all font-medium text-sm">
                                            {link.name}
                                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                                        </button>

                                        {/* Dropdown Panel */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                                            {/* Arrow */}
                                            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-secondary-dark rotate-45 border-l border-t border-gray-200 dark:border-gray-700/50" />

                                            <div className="relative bg-white dark:bg-secondary-dark rounded-2xl shadow-2xl shadow-gray-300/50 dark:shadow-black/30 border border-gray-200 dark:border-gray-700/50 py-3 min-w-[280px] overflow-hidden">
                                                {link.children.map((child) => {
                                                    const Icon = child.icon;
                                                    return (
                                                        <NavLink
                                                            key={child.path}
                                                            to={child.path}
                                                            className={({ isActive }) =>
                                                                `flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all ${
                                                                    isActive
                                                                        ? 'bg-primary/10 text-primary'
                                                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                                                }`
                                                            }
                                                        >
                                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shrink-0 shadow-sm`}>
                                                                <Icon size={18} className="text-primary dark:text-primary-light" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-sm">{child.name}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">{child.description}</p>
                                                            </div>
                                                        </NavLink>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Regular Link with active indicator
                                    <NavLink
                                        key={link.path}
                                        to={link.path}
                                        className={({ isActive }) =>
                                            `relative px-4 py-2 rounded-lg transition-all font-medium text-sm group ${
                                                isActive
                                                    ? 'text-primary'
                                                    : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {link.name}
                                                {/* Active indicator line */}
                                                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                                                    isActive ? 'w-6' : 'w-0 group-hover:w-4'
                                                }`} />
                                            </>
                                        )}
                                    </NavLink>
                                )
                            )}
                        </div>

                        {/* CTA Section */}
                        <div className="flex items-center gap-2 ml-6 pl-6 border-l border-gray-200 dark:border-gray-700">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="relative w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center justify-center group"
                                aria-label="Toggle theme"
                            >
                                <div className="relative">
                                    {theme === 'light' ? (
                                        <Moon size={18} className="transition-transform group-hover:rotate-12" />
                                    ) : (
                                        <Sun size={18} className="transition-transform group-hover:rotate-45" />
                                    )}
                                </div>
                            </button>

                            {/* Notices Button */}
                            <Link
                                to="/notices"
                                className="relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                            >
                                <FileText size={16} />
                                Notices
                            </Link>

                            {/* Tenders CTA Button */}
                            <Link
                                to="/tenders"
                                className="relative flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group overflow-hidden"
                            >
                                {/* Shine effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <Briefcase size={16} className="relative" />
                                <span className="relative">Tenders</span>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu buttons */}
                    <div className="lg:hidden flex items-center gap-2">
                        {/* Mobile Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                                isOpen
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                            }`}
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                        >
                            <div className="relative w-5 h-5">
                                <span className={`absolute left-0 top-1 w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 top-2' : ''}`} />
                                <span className={`absolute left-0 top-2 w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? 'opacity-0 translate-x-2' : ''}`} />
                                <span className={`absolute left-0 top-3 w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 top-2' : ''}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[calc(100vh-5rem)] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="bg-white dark:bg-secondary-dark border-t border-gray-100 dark:border-gray-700/50 px-4 py-4 space-y-1 shadow-inner shadow-gray-100/50 dark:shadow-none">
                    {navLinks.map((link) =>
                        link.children ? (
                            // Mobile Dropdown
                            <div key={link.name} className="rounded-xl overflow-hidden">
                                <button
                                    onClick={() => toggleMobileDropdown(link.name)}
                                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-medium ${
                                        activeDropdown === link.name
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <span>{link.name}</span>
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 ${
                                            activeDropdown === link.name ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {/* Mobile Dropdown Items */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${
                                        activeDropdown === link.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="py-2 space-y-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                        {link.children.map((child) => {
                                            const Icon = child.icon;
                                            return (
                                                <NavLink
                                                    key={child.path}
                                                    to={child.path}
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                                            isActive
                                                                ? 'bg-primary/10 text-primary'
                                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                                        }`
                                                    }
                                                >
                                                    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                        <Icon size={16} className="text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="font-medium text-sm">{child.name}</span>
                                                        <p className="text-xs text-gray-500 dark:text-gray-500">{child.description}</p>
                                                    </div>
                                                    <ChevronRight size={16} className="text-gray-400" />
                                                </NavLink>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Mobile Regular Link
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${
                                        isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`
                                }
                            >
                                {link.icon && <link.icon size={20} className="text-gray-500" />}
                                <span>{link.name}</span>
                            </NavLink>
                        )
                    )}

                    {/* Mobile CTA Section */}
                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700/50 space-y-3">
                        {/* Notices */}
                        <Link
                            to="/notices"
                            className="flex items-center gap-3 px-4 py-3.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all font-medium"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <FileText size={18} className="text-gray-600 dark:text-gray-400" />
                            </div>
                            <span>Notices</span>
                            <ChevronRight size={18} className="ml-auto text-gray-400" />
                        </Link>

                        {/* Tenders CTA */}
                        <Link
                            to="/tenders"
                            className="flex items-center justify-center gap-3 w-full py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                        >
                            <Briefcase size={18} />
                            View All Tenders
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
