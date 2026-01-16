import { useState } from 'react';
import { Save, Globe, Bell, Shield, Zap } from 'lucide-react';
import { useCompanyInfo } from '../../hooks/useApi';

export function AdminSettings() {
    const { data: companyInfo } = useCompanyInfo();
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'company', label: 'Company Info', icon: Zap },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-gray-400 mt-1">Manage application settings and preferences</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-700 pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                            ? 'bg-primary text-white'
                            : 'text-gray-400 hover:bg-secondary hover:text-white'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* General Settings */}
            {activeTab === 'general' && (
                <div className="space-y-6">
                    <div className="bg-secondary rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Website Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Site Title</label>
                                <input
                                    type="text"
                                    defaultValue="BIFPCL - Bangladesh-India Friendship Power Company"
                                    className="w-full px-4 py-2.5 bg-secondary-dark border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Meta Description</label>
                                <textarea
                                    rows={3}
                                    defaultValue="Official website of Bangladesh-India Friendship Power Company Limited (BIFPCL) - A symbol of Indo-Bangladesh friendship in power generation."
                                    className="w-full px-4 py-2.5 bg-secondary-dark border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary resize-none"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-secondary-dark rounded-lg">
                                <div>
                                    <p className="text-white font-medium">Maintenance Mode</p>
                                    <p className="text-gray-500 text-sm">Temporarily disable public access</p>
                                </div>
                                <button className="w-12 h-6 bg-gray-600 rounded-full relative transition-colors">
                                    <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* Company Info */}
            {activeTab === 'company' && (
                <div className="space-y-6">
                    <div className="bg-secondary rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Company Name</label>
                                <input
                                    type="text"
                                    defaultValue={companyInfo?.name || ''}
                                    className="w-full px-4 py-2.5 bg-secondary-dark border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Tagline</label>
                                <input
                                    type="text"
                                    defaultValue={companyInfo?.tagline || ''}
                                    className="w-full px-4 py-2.5 bg-secondary-dark border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Total Capacity (MW)</label>
                                <input
                                    type="number"
                                    defaultValue={companyInfo?.total_capacity_mw || 1320}
                                    className="w-full px-4 py-2.5 bg-secondary-dark border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Technology</label>
                                <input
                                    type="text"
                                    defaultValue={companyInfo?.technology || ''}
                                    className="w-full px-4 py-2.5 bg-secondary-dark border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-gray-400 text-sm mb-2">Partnership Ratio</label>
                                <input
                                    type="text"
                                    defaultValue={companyInfo?.partnership_ratio || ''}
                                    className="w-full px-4 py-2.5 bg-secondary-dark border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-gray-400 text-sm mb-2">Description</label>
                                <textarea
                                    rows={4}
                                    defaultValue={companyInfo?.description || ''}
                                    className="w-full px-4 py-2.5 bg-secondary-dark border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
                <div className="bg-secondary rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                        {[
                            { title: 'New Job Applications', desc: 'Get notified when someone applies for a position' },
                            { title: 'Tender Submissions', desc: 'Receive alerts for new tender submissions' },
                            { title: 'Contact Inquiries', desc: 'Get notified for new contact form submissions' },
                            { title: 'System Updates', desc: 'Receive notifications about system updates' },
                        ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-secondary-dark rounded-lg">
                                <div>
                                    <p className="text-white font-medium">{item.title}</p>
                                    <p className="text-gray-500 text-sm">{item.desc}</p>
                                </div>
                                <button className="w-12 h-6 bg-primary rounded-full relative transition-colors">
                                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
                <div className="space-y-6">
                    <div className="bg-secondary rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Admin Email</label>
                                <input
                                    type="email"
                                    defaultValue="admin@bifpcl.com"
                                    className="w-full px-4 py-2.5 bg-secondary-dark border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-secondary-dark rounded-lg">
                                <div>
                                    <p className="text-white font-medium">Two-Factor Authentication</p>
                                    <p className="text-gray-500 text-sm">Add an extra layer of security</p>
                                </div>
                                <button className="px-4 py-2 bg-primary/20 text-primary-light rounded-lg hover:bg-primary/30 transition-colors">
                                    Enable
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-secondary-dark rounded-lg">
                                <div>
                                    <p className="text-white font-medium">Change Password</p>
                                    <p className="text-gray-500 text-sm">Update your admin password</p>
                                </div>
                                <button className="px-4 py-2 bg-secondary border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/30">
                        <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
                        <p className="text-gray-400 text-sm mb-4">These actions are irreversible. Please proceed with caution.</p>
                        <button className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors">
                            Reset All Settings
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
