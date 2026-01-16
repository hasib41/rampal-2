import {
    Zap,
    Users,
    FileText,
    Briefcase,
    Bell,
    TrendingUp,
    TrendingDown,
    Activity,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import { useProjects, useDirectors, useNotices, useTenders, useCareers, useNews } from '../../hooks/useApi';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon: React.ElementType;
    color: string;
}

function StatCard({ title, value, change, trend, icon: Icon, color }: StatCardProps) {
    return (
        <div className="bg-secondary rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-400 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{value}</p>
                    {change && (
                        <div className="flex items-center gap-1 mt-2">
                            {trend === 'up' && <TrendingUp className="text-accent-green" size={14} />}
                            {trend === 'down' && <TrendingDown className="text-red-400" size={14} />}
                            <span className={`text-sm ${trend === 'up' ? 'text-accent-green' : trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                                {change}
                            </span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="text-white" size={24} />
                </div>
            </div>
        </div>
    );
}

interface QuickActionProps {
    title: string;
    description: string;
    icon: React.ElementType;
    onClick?: () => void;
}

function QuickAction({ title, description, icon: Icon, onClick }: QuickActionProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-4 p-4 bg-secondary-dark hover:bg-secondary rounded-lg border border-gray-700 hover:border-primary/50 transition-all text-left w-full group"
        >
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Icon className="text-primary-light" size={20} />
            </div>
            <div className="flex-1">
                <p className="text-white font-medium">{title}</p>
                <p className="text-gray-500 text-sm">{description}</p>
            </div>
            <ArrowUpRight className="text-gray-600 group-hover:text-primary-light transition-colors" size={18} />
        </button>
    );
}

export function AdminDashboard() {
    const { data: projects } = useProjects();
    const { data: directors } = useDirectors();
    const { data: notices } = useNotices();
    const { data: tenders } = useTenders();
    const { data: careers } = useCareers();
    const { data: news } = useNews();

    const openTenders = tenders?.filter(t => t.status === 'open').length || 0;
    const activeCareers = careers?.length || 0;

    // Power generation data (mock data for visualization)
    const powerData = [
        { month: 'Jan', unit1: 580, unit2: 560 },
        { month: 'Feb', unit1: 590, unit2: 570 },
        { month: 'Mar', unit1: 610, unit2: 590 },
        { month: 'Apr', unit1: 620, unit2: 605 },
        { month: 'May', unit1: 640, unit2: 620 },
        { month: 'Jun', unit1: 650, unit2: 630 },
    ];

    const maxPower = 660;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Welcome back! Here's an overview of your system.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg border border-gray-700">
                    <Calendar className="text-gray-400" size={18} />
                    <span className="text-gray-300 text-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Capacity"
                    value="1,320 MW"
                    change="+2.5% efficiency"
                    trend="up"
                    icon={Zap}
                    color="bg-gradient-to-br from-primary to-primary-dark"
                />
                <StatCard
                    title="Active Projects"
                    value={projects?.length || 0}
                    icon={Activity}
                    color="bg-gradient-to-br from-accent-green to-green-600"
                />
                <StatCard
                    title="Open Tenders"
                    value={openTenders}
                    change={`${openTenders} active bids`}
                    trend="neutral"
                    icon={FileText}
                    color="bg-gradient-to-br from-accent-orange to-orange-600"
                />
                <StatCard
                    title="Job Openings"
                    value={activeCareers}
                    icon={Briefcase}
                    color="bg-gradient-to-br from-purple-500 to-purple-700"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Power Generation Chart */}
                <div className="lg:col-span-2 bg-secondary rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Power Generation</h2>
                            <p className="text-gray-400 text-sm">Monthly output by unit (MW)</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <span className="text-gray-400">Unit 1</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-accent-green" />
                                <span className="text-gray-400">Unit 2</span>
                            </div>
                        </div>
                    </div>

                    {/* Simple Bar Chart */}
                    <div className="flex items-end justify-between gap-4 h-48">
                        {powerData.map((data) => (
                            <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex gap-1 items-end h-40">
                                    <div
                                        className="flex-1 bg-primary rounded-t-sm transition-all hover:bg-primary-light"
                                        style={{ height: `${(data.unit1 / maxPower) * 100}%` }}
                                        title={`Unit 1: ${data.unit1} MW`}
                                    />
                                    <div
                                        className="flex-1 bg-accent-green rounded-t-sm transition-all hover:bg-green-400"
                                        style={{ height: `${(data.unit2 / maxPower) * 100}%` }}
                                        title={`Unit 2: ${data.unit2} MW`}
                                    />
                                </div>
                                <span className="text-gray-500 text-xs">{data.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Stats */}
                <div className="bg-secondary rounded-xl p-6 border border-gray-700">
                    <h2 className="text-lg font-semibold text-white mb-4">Content Overview</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-secondary-dark rounded-lg">
                            <div className="flex items-center gap-3">
                                <Bell className="text-primary-light" size={18} />
                                <span className="text-gray-300">Notices</span>
                            </div>
                            <span className="text-white font-semibold">{notices?.length || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-secondary-dark rounded-lg">
                            <div className="flex items-center gap-3">
                                <Users className="text-primary-light" size={18} />
                                <span className="text-gray-300">Directors</span>
                            </div>
                            <span className="text-white font-semibold">{directors?.length || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-secondary-dark rounded-lg">
                            <div className="flex items-center gap-3">
                                <FileText className="text-primary-light" size={18} />
                                <span className="text-gray-300">News Articles</span>
                            </div>
                            <span className="text-white font-semibold">{news?.length || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-secondary-dark rounded-lg">
                            <div className="flex items-center gap-3">
                                <Zap className="text-primary-light" size={18} />
                                <span className="text-gray-300">Projects</span>
                            </div>
                            <span className="text-white font-semibold">{projects?.length || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-secondary rounded-xl p-6 border border-gray-700">
                    <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <QuickAction
                            title="Add New Notice"
                            description="Post a new announcement"
                            icon={Bell}
                        />
                        <QuickAction
                            title="Create Tender"
                            description="Publish new procurement"
                            icon={FileText}
                        />
                        <QuickAction
                            title="Post Job Opening"
                            description="Add career opportunity"
                            icon={Briefcase}
                        />
                    </div>
                </div>

                {/* Recent Notices */}
                <div className="bg-secondary rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Recent Notices</h2>
                        <a href="/admin/notices" className="text-primary-light text-sm hover:text-primary transition-colors">
                            View All
                        </a>
                    </div>
                    <div className="space-y-3">
                        {notices?.slice(0, 4).map((notice) => (
                            <div key={notice.id} className="flex items-start gap-3 p-3 bg-secondary-dark rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-300 text-sm truncate">{notice.title}</p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {new Date(notice.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {(!notices || notices.length === 0) && (
                            <p className="text-gray-500 text-center py-4">No notices yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
