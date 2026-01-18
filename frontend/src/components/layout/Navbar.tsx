import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Sustainability', path: '/sustainability' },
    {
        name: 'About',
        children: [
            { name: 'Board of Directors', path: '/directors' },
            { name: 'Media Center', path: '/media' },
            { name: 'FAQ', path: '/faq' },
        ],
    },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-secondary-dark/95 backdrop-blur-sm fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-white font-bold text-xl">BIFPCL</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) =>
                            link.children ? (
                                <div key={link.name} className="relative group">
                                    <button className="text-gray-300 hover:text-white flex items-center gap-1">
                                        {link.name} <ChevronDown size={16} />
                                    </button>
                                    <div className="absolute top-full left-0 mt-2 bg-secondary rounded-lg shadow-xl py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        {link.children.map((child) => (
                                            <NavLink
                                                key={child.path}
                                                to={child.path}
                                                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-secondary-light"
                                            >
                                                {child.name}
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `${isActive ? 'text-primary-light' : 'text-gray-300'} hover:text-white`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            )
                        )}
                        <Link to="/tenders" className="btn-primary text-sm py-2">
                            Tenders
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden bg-secondary-dark border-t border-gray-700">
                    {navLinks.map((link) =>
                        link.children ? (
                            <div key={link.name}>
                                <span className="block px-4 py-3 text-gray-400 text-sm">{link.name}</span>
                                {link.children.map((child) => (
                                    <NavLink
                                        key={child.path}
                                        to={child.path}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-8 py-2 text-gray-300 hover:text-white"
                                    >
                                        {child.name}
                                    </NavLink>
                                ))}
                            </div>
                        ) : (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 text-gray-300 hover:text-white"
                            >
                                {link.name}
                            </NavLink>
                        )
                    )}
                    <Link
                        to="/tenders"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 text-primary-light font-medium"
                    >
                        Tenders
                    </Link>
                </div>
            )}
        </nav>
    );
}
