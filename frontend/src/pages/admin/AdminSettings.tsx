import { useState } from 'react';
import { Save, Globe, Bell, Shield, Building, AlertTriangle } from 'lucide-react';
import { useCompanyInfo } from '../../hooks/useApi';
import {
    Card,
    Button,
    Input,
    Textarea,
    Toggle,
    Tabs,
    PageHeader
} from '../../components/ui';

export function AdminSettings() {
    const { data: companyInfo } = useCompanyInfo();
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);

    const tabs = [
        { id: 'general', label: 'General', icon: <Globe size={16} /> },
        { id: 'company', label: 'Company', icon: <Building size={16} /> },
        { id: 'notifications', label: 'Alerts', icon: <Bell size={16} /> },
        { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    ];

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <div className="space-y-5">
            <PageHeader title="Settings" description="Manage application settings" />
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'general' && (
                <div className="space-y-5">
                    <Card padding="md">
                        <h3 className="font-medium text-white mb-5">Website Settings</h3>
                        <div className="space-y-4">
                            <Input label="Site Title" defaultValue="BIFPCL - Bangladesh-India Friendship Power Company" />
                            <Textarea label="Meta Description" rows={2} defaultValue="Official website of Bangladesh-India Friendship Power Company Limited (BIFPCL)." maxLength={160} showCount />
                            <div className="flex items-center justify-between py-3 px-4 bg-white/[0.02] rounded-lg">
                                <Toggle checked={false} onChange={() => {}} label="Maintenance Mode" description="Disable public access" />
                            </div>
                        </div>
                    </Card>
                    <div className="flex justify-end">
                        <Button leftIcon={<Save size={16} />} onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
                    </div>
                </div>
            )}

            {activeTab === 'company' && (
                <div className="space-y-5">
                    <Card padding="md">
                        <h3 className="font-medium text-white mb-5">Company Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Company Name" defaultValue={companyInfo?.name || 'BIFPCL'} />
                            <Input label="Tagline" defaultValue={companyInfo?.tagline || ''} />
                            <Input label="Total Capacity (MW)" type="number" defaultValue={String(companyInfo?.total_capacity_mw || 1320)} />
                            <Input label="Technology" defaultValue={companyInfo?.technology || 'Ultra-Super Critical'} />
                            <Input label="Partnership Ratio" defaultValue={companyInfo?.partnership_ratio || '50:50'} />
                            <div />
                            <div className="col-span-2">
                                <Textarea label="Description" rows={3} defaultValue={companyInfo?.description || ''} />
                            </div>
                        </div>
                    </Card>
                    <div className="flex justify-end">
                        <Button leftIcon={<Save size={16} />} onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
                    </div>
                </div>
            )}

            {activeTab === 'notifications' && (
                <Card padding="md">
                    <h3 className="font-medium text-white mb-5">Notification Preferences</h3>
                    <div className="space-y-3">
                        {[
                            { title: 'Job Applications', desc: 'New applications', enabled: true },
                            { title: 'Tender Submissions', desc: 'New bids', enabled: true },
                            { title: 'Contact Inquiries', desc: 'Form submissions', enabled: false },
                            { title: 'System Updates', desc: 'Maintenance alerts', enabled: true },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-3 px-4 bg-white/[0.02] rounded-lg">
                                <Toggle checked={item.enabled} onChange={() => {}} label={item.title} description={item.desc} />
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {activeTab === 'security' && (
                <div className="space-y-5">
                    <Card padding="md">
                        <h3 className="font-medium text-white mb-5">Security Settings</h3>
                        <div className="space-y-4">
                            <Input label="Admin Email" type="email" defaultValue="admin@bifpcl.com" />
                            <div className="flex items-center justify-between py-3 px-4 bg-white/[0.02] rounded-lg">
                                <div>
                                    <p className="text-white">Two-Factor Auth</p>
                                    <p className="text-sm text-gray-500">Extra security layer</p>
                                </div>
                                <Button variant="secondary" size="sm">Enable</Button>
                            </div>
                            <div className="flex items-center justify-between py-3 px-4 bg-white/[0.02] rounded-lg">
                                <div>
                                    <p className="text-white">Change Password</p>
                                    <p className="text-sm text-gray-500">Update credentials</p>
                                </div>
                                <Button variant="secondary" size="sm">Update</Button>
                            </div>
                        </div>
                    </Card>
                    <Card padding="md" className="!border-red-500/20 !bg-red-500/5">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="text-red-400 shrink-0" size={20} />
                            <div>
                                <h3 className="font-medium text-red-400">Danger Zone</h3>
                                <p className="text-sm text-gray-400 mt-1 mb-4">Irreversible actions</p>
                                <Button variant="danger" size="sm">Reset Settings</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
