import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Users,
    Briefcase,
    Newspaper,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    Zap,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { AdminLogin } from './AdminLogin';

const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/notices', icon: Bell, label: 'Notices' },
    { path: '/admin/projects', icon: Zap, label: 'Projects' },
    { path: '/admin/directors', icon: Users, label: 'Directors' },
    { path: '/admin/news', icon: Newspaper, label: 'News & Media' },
    { path: '/admin/careers', icon: Briefcase, label: 'Careers' },
    { path: '/admin/tenders', icon: FileText, label: 'Tenders' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();

    // Show login if not authenticated
    if (!isAuthenticated) {
        return <AdminLogin />;
    }

    const isActive = (path: string, exact?: boolean) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-secondary-dark">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-secondary border-b border-gray-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="text-gray-400 hover:text-white"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="text-white font-bold">BIFPCL Admin</span>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-50"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen bg-secondary border-r border-gray-700 z-50 transition-all duration-300
                    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                    ${sidebarOpen ? 'w-64' : 'w-20'}
                `}
            >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
                    {sidebarOpen && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Zap className="text-white" size={18} />
                            </div>
                            <span className="text-white font-bold">BIFPCL</span>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            setSidebarOpen(!sidebarOpen);
                            setMobileMenuOpen(false);
                        }}
                        className="hidden lg:block text-gray-400 hover:text-white p-1"
                    >
                        {sidebarOpen ? <ChevronRight size={20} /> : <Menu size={20} />}
                    </button>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                                ${isActive(item.path, item.exact)
                                    ? 'bg-primary text-white'
                                    : 'text-gray-400 hover:bg-secondary-dark hover:text-white'
                                }
                                ${!sidebarOpen && 'justify-center'}
                            `}
                        >
                            <item.icon size={20} />
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 space-y-1">
                    <Link
                        to="/"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-secondary-dark hover:text-white transition-colors
                            ${!sidebarOpen && 'justify-center'}
                        `}
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span>Back to Website</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors
                            ${!sidebarOpen && 'justify-center'}
                        `}
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`min-h-screen transition-all duration-300 pt-16 lg:pt-0
                    ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
                `}
            >
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
