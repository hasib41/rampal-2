import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Zap, Users, Newspaper, HelpCircle, Briefcase, Mail, Leaf, FolderOpen, ChevronRight } from 'lucide-react';

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

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
        setActiveDropdown(null);
    }, [location.pathname]);

    // Toggle mobile dropdown
    const toggleMobileDropdown = (name: string) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-secondary-dark/98 backdrop-blur-md shadow-lg shadow-black/10'
                    : 'bg-secondary-dark/80 backdrop-blur-sm'
            }`}
        >
            {/* Top bar - optional accent line */}
            <div className="h-0.5 bg-gradient-to-r from-primary via-primary-light to-accent-green" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-18">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                            <Zap className="text-white" size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-lg leading-tight tracking-tight">BIFPCL</span>
                            <span className="text-gray-500 text-[10px] leading-tight hidden sm:block">Maitree Power</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center">
                        <div className="flex items-center gap-1">
                            {navLinks.map((link) =>
                                link.children ? (
                                    // Dropdown Menu
                                    <div key={link.name} className="relative group">
                                        <button className="px-4 py-2 text-gray-300 hover:text-white flex items-center gap-1.5 rounded-lg hover:bg-white/5 transition-all">
                                            {link.name}
                                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                                        </button>

                                        {/* Dropdown Panel */}
                                        <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                                            <div className="bg-secondary-dark/98 backdrop-blur-md rounded-xl shadow-2xl shadow-black/20 border border-gray-700/50 py-2 min-w-[260px] overflow-hidden">
                                                {link.children.map((child, idx) => {
                                                    const Icon = child.icon;
                                                    return (
                                                        <NavLink
                                                            key={child.path}
                                                            to={child.path}
                                                            className={({ isActive }) =>
                                                                `flex items-center gap-3 px-4 py-3 transition-all ${
                                                                    isActive
                                                                        ? 'bg-primary/10 text-primary-light'
                                                                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                                                } ${idx !== link.children.length - 1 ? 'border-b border-gray-700/30' : ''}`
                                                            }
                                                        >
                                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shrink-0">
                                                                <Icon size={16} className="text-gray-400" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm">{child.name}</p>
                                                                <p className="text-xs text-gray-500">{child.description}</p>
                                                            </div>
                                                        </NavLink>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Regular Link
                                    <NavLink
                                        key={link.path}
                                        to={link.path}
                                        className={({ isActive }) =>
                                            `px-4 py-2 rounded-lg transition-all ${
                                                isActive
                                                    ? 'text-primary-light bg-primary/10'
                                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                            }`
                                        }
                                    >
                                        {link.name}
                                    </NavLink>
                                )
                            )}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex items-center gap-3 ml-6 pl-6 border-l border-gray-700">
                            <Link
                                to="/notices"
                                className="px-4 py-2 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                            >
                                Notices
                            </Link>
                            <Link
                                to="/tenders"
                                className="relative px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <span className="flex items-center gap-2">
                                    <Briefcase size={14} />
                                    Tenders
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[calc(100vh-4rem)] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="bg-secondary-dark/98 backdrop-blur-md border-t border-gray-700/50 px-4 py-4 space-y-1">
                    {navLinks.map((link) =>
                        link.children ? (
                            // Mobile Dropdown
                            <div key={link.name} className="rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleMobileDropdown(link.name)}
                                    className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                >
                                    <span className="font-medium">{link.name}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-200 ${
                                            activeDropdown === link.name ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {/* Mobile Dropdown Items */}
                                <div
                                    className={`overflow-hidden transition-all duration-200 ${
                                        activeDropdown === link.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="pl-4 py-2 space-y-1">
                                        {link.children.map((child) => {
                                            const Icon = child.icon;
                                            return (
                                                <NavLink
                                                    key={child.path}
                                                    to={child.path}
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                                                            isActive
                                                                ? 'bg-primary/10 text-primary-light'
                                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                        }`
                                                    }
                                                >
                                                    <Icon size={16} />
                                                    <span>{child.name}</span>
                                                    <ChevronRight size={14} className="ml-auto opacity-50" />
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
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                        isActive
                                            ? 'bg-primary/10 text-primary-light'
                                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                                    }`
                                }
                            >
                                {link.icon && <link.icon size={18} />}
                                <span className="font-medium">{link.name}</span>
                            </NavLink>
                        )
                    )}

                    {/* Mobile CTA Buttons */}
                    <div className="pt-4 mt-4 border-t border-gray-700/50 space-y-2">
                        <Link
                            to="/notices"
                            className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        >
                            <span className="font-medium">Notices</span>
                            <ChevronRight size={16} className="opacity-50" />
                        </Link>
                        <Link
                            to="/tenders"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-lg"
                        >
                            <Briefcase size={16} />
                            View Tenders
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
