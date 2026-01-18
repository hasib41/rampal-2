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
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { AdminLogin } from './AdminLogin';

const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/notices', icon: Bell, label: 'Notices' },
    { path: '/admin/projects', icon: Zap, label: 'Projects' },
    { path: '/admin/directors', icon: Users, label: 'Directors' },
    { path: '/admin/news', icon: Newspaper, label: 'News' },
    { path: '/admin/careers', icon: Briefcase, label: 'Careers' },
    { path: '/admin/tenders', icon: FileText, label: 'Tenders' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();

    if (!isAuthenticated) {
        return <AdminLogin />;
    }

    const isActive = (path: string, exact?: boolean) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-[#09090b]">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#0f0f12] border-b border-white/5">
                <div className="flex items-center justify-between h-full px-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 text-gray-400 hover:text-white rounded-lg"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                                <Zap className="text-white" size={14} />
                            </div>
                            <span className="text-white font-semibold text-sm">BIFPCL</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 z-50"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-screen z-50
                    bg-[#0f0f12] border-r border-white/5
                    transition-all duration-200
                    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                    ${sidebarOpen ? 'w-52' : 'w-16'}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="h-14 flex items-center justify-between px-3 border-b border-white/5">
                        {sidebarOpen && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <Zap className="text-white" size={16} />
                                </div>
                                <div>
                                    <span className="text-white font-semibold text-sm">BIFPCL</span>
                                    <p className="text-[9px] text-gray-500 -mt-0.5">Admin</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hidden lg:flex p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg"
                        >
                            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="lg:hidden p-1.5 text-gray-500 hover:text-white"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
                        {navItems.map((item) => {
                            const active = isActive(item.path, item.exact);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                                        ${active
                                            ? 'bg-primary text-white'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }
                                        ${!sidebarOpen && 'justify-center px-0'}
                                    `}
                                >
                                    <item.icon size={20} />
                                    {sidebarOpen && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom */}
                    <div className="p-2 border-t border-white/5 space-y-1">
                        <Link
                            to="/"
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all ${!sidebarOpen && 'justify-center px-0'}`}
                        >
                            <LogOut size={20} />
                            {sidebarOpen && <span>Back to Site</span>}
                        </Link>
                        <button
                            onClick={logout}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all ${!sidebarOpen && 'justify-center px-0'}`}
                        >
                            <LogOut size={20} />
                            {sidebarOpen && <span>Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className={`transition-all duration-200 ${sidebarOpen ? 'lg:pl-52' : 'lg:pl-16'}`}>
                <main className="p-4 pt-16 lg:pt-4 min-h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
