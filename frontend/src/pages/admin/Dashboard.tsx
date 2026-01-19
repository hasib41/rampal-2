import { Link } from 'react-router-dom';
import {
    Zap,
    Users,
    FileText,
    Briefcase,
    Bell,
    ArrowRight,
    BarChart3
} from 'lucide-react';
import { useProjects, useDirectors, useNotices, useTenders, useCareers, useNews } from '../../hooks/useApi';
import { Card, Badge, LoadingState } from '../../components/ui';

export function AdminDashboard() {
    const { data: projects, isLoading: projectsLoading } = useProjects();
    const { data: directors, isLoading: directorsLoading } = useDirectors();
    const { data: notices, isLoading: noticesLoading } = useNotices();
    const { data: tenders, isLoading: tendersLoading } = useTenders();
    const { data: careers, isLoading: careersLoading } = useCareers();
    const { data: news, isLoading: newsLoading } = useNews();

    const isLoading = projectsLoading || directorsLoading || noticesLoading || tendersLoading || careersLoading || newsLoading;

    const openTenders = tenders?.filter(t => t.status === 'open').length || 0;
    const activeCareers = careers?.length || 0;

    const powerData = [
        { month: 'Jan', unit1: 580, unit2: 560 },
        { month: 'Feb', unit1: 590, unit2: 570 },
        { month: 'Mar', unit1: 610, unit2: 590 },
        { month: 'Apr', unit1: 620, unit2: 605 },
        { month: 'May', unit1: 640, unit2: 620 },
        { month: 'Jun', unit1: 650, unit2: 630 },
    ];

    const maxPower = 660;

    if (isLoading) {
        return <LoadingState text="Loading dashboard..." />;
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">Welcome back! System overview.</p>
                </div>
                <Badge variant="success" dot>Online</Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Capacity', value: '1,320 MW', icon: Zap, color: 'text-primary-light', bg: 'bg-primary/10', link: '/admin/projects' },
                    { label: 'Notices', value: notices?.length || 0, icon: Bell, color: 'text-violet-400', bg: 'bg-violet-500/10', link: '/admin/notices' },
                    { label: 'Open Tenders', value: openTenders, icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10', link: '/admin/tenders' },
                    { label: 'Job Openings', value: activeCareers, icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/10', link: '/admin/careers' },
                ].map((stat) => (
                    <Link key={stat.label} to={stat.link}>
                        <Card hover padding="md" className="h-full">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={stat.color} size={22} />
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Chart */}
                <Card className="lg:col-span-2" padding="md">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <BarChart3 size={18} className="text-primary" />
                            <span className="font-medium text-gray-900 dark:text-white">Power Generation (MW)</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary"></span> Unit 1</span>
                            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Unit 2</span>
                        </div>
                    </div>
                    <div className="flex items-end justify-between gap-3 h-40">
                        {powerData.map((data) => (
                            <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex gap-1 items-end h-32">
                                    <div className="flex-1 bg-primary rounded-t" style={{ height: `${(data.unit1 / maxPower) * 100}%` }} />
                                    <div className="flex-1 bg-emerald-500 rounded-t" style={{ height: `${(data.unit2 / maxPower) * 100}%` }} />
                                </div>
                                <span className="text-gray-500 text-sm">{data.month}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Content Overview */}
                <Card padding="md">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">Content Overview</h3>
                    <div className="space-y-3">
                        {[
                            { icon: Bell, label: 'Notices', count: notices?.length || 0, color: 'text-primary' },
                            { icon: Users, label: 'Directors', count: directors?.length || 0, color: 'text-violet-500 dark:text-violet-400' },
                            { icon: FileText, label: 'News', count: news?.length || 0, color: 'text-amber-500 dark:text-amber-400' },
                            { icon: Zap, label: 'Projects', count: projects?.length || 0, color: 'text-emerald-500 dark:text-emerald-400' },
                            { icon: Briefcase, label: 'Careers', count: careers?.length || 0, color: 'text-pink-500 dark:text-pink-400' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between py-2 px-3 bg-gray-100 dark:bg-white/[0.02] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <item.icon className={item.color} size={16} />
                                    <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                                </div>
                                <span className="text-gray-900 dark:text-white font-medium">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Quick Actions */}
                <Card padding="md">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        {[
                            { label: 'Add Notice', desc: 'Post announcement', icon: Bell, href: '/admin/notices', color: 'bg-primary/20 text-primary' },
                            { label: 'New Tender', desc: 'Publish procurement', icon: FileText, href: '/admin/tenders', color: 'bg-amber-500/20 text-amber-400' },
                            { label: 'Post Job', desc: 'Career opportunity', icon: Briefcase, href: '/admin/careers', color: 'bg-emerald-500/20 text-emerald-400' },
                        ].map((action) => (
                            <Link
                                key={action.label}
                                to={action.href}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.03] transition-colors group"
                            >
                                <div className={`p-2.5 rounded-lg ${action.color}`}>
                                    <action.icon size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-900 dark:text-white">{action.label}</p>
                                    <p className="text-sm text-gray-500">{action.desc}</p>
                                </div>
                                <ArrowRight size={16} className="text-gray-400 dark:text-gray-600 group-hover:text-primary transition-colors" />
                            </Link>
                        ))}
                    </div>
                </Card>

                {/* Recent Notices */}
                <Card padding="md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">Recent Notices</h3>
                        <Link to="/admin/notices" className="text-sm text-primary hover:text-primary-dark flex items-center gap-1">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {notices?.slice(0, 4).map((notice) => (
                            <div key={notice.id} className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.02]">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-700 dark:text-gray-300 truncate">{notice.title}</p>
                                    <p className="text-sm text-gray-500">{new Date(notice.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                </div>
                            </div>
                        ))}
                        {(!notices || notices.length === 0) && (
                            <p className="text-gray-500 text-center py-6">No notices yet</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
