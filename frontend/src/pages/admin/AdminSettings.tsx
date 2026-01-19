import { useState } from 'react';
import {
    Save, Globe, Bell, Shield, Building, AlertTriangle,
    MapPin, Phone, Mail, Clock, Facebook, Twitter, Linkedin,
    Youtube, Image, Eye, EyeOff, Check,
    Calendar, Users, Briefcase, FileText
} from 'lucide-react';
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

// Helper component for section headers
function SectionHeader({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-5">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{title}</h3>
            {description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>}
        </div>
    );
}

// Helper component for form field groups
function FieldGroup({ children, columns = 1 }: { children: React.ReactNode; columns?: 1 | 2 | 3 }) {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    };
    return <div className={`grid ${gridCols[columns]} gap-4`}>{children}</div>;
}

// Helper component for info callout
function InfoCallout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 p-4 mt-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary text-xs">i</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{children}</p>
        </div>
    );
}

export function AdminSettings() {
    const { data: companyInfo } = useCompanyInfo();
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Form states
    const [generalSettings, setGeneralSettings] = useState({
        siteName: 'BIFPCL',
        siteTagline: 'Powering Bangladesh\'s Future Together',
        language: 'en',
        timezone: 'Asia/Dhaka',
        dateFormat: 'DD/MM/YYYY',
        maintenanceMode: false,
        maintenanceMessage: 'We are currently performing scheduled maintenance. Please check back soon.',
        showComingSoon: false,
    });

    const [companySettings, setCompanySettings] = useState({
        fullName: companyInfo?.name || 'Bangladesh-India Friendship Power Company (Pvt.) Limited',
        shortName: 'BIFPCL',
        registrationNo: '',
        yearEstablished: '2012',
        description: companyInfo?.description || '',
        totalCapacity: companyInfo?.total_capacity_mw || 1320,
        technology: companyInfo?.technology || 'Ultra-Supercritical',
        partnership: companyInfo?.partnership_ratio || '50:50 (NTPC India & BPDB Bangladesh)',
    });

    const [contactSettings, setContactSettings] = useState({
        // Head Office
        headOfficeAddress: 'UTC Building (Level-16), 8 Panthapath, Kawran Bazar, Dhaka-1215',
        headOfficePhone: '+880-2-55013515',
        headOfficeFax: '+880-2-55013517',

        // Site Office
        siteOfficeAddress: 'Rampal, Bagerhat, Bangladesh',
        siteOfficePhone: '',

        // Email Addresses
        generalEmail: 'info@bifpcl.com',
        careersEmail: 'careers@bifpcl.com',
        tendersEmail: 'tenders@bifpcl.com',
        mediaEmail: 'media@bifpcl.com',

        // Working Hours
        workingDays: 'Sunday - Thursday',
        workingHours: '9:00 AM - 5:00 PM',

        // Social Media
        facebook: '',
        twitter: '',
        linkedin: '',
        youtube: '',
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailJobApplications: true,
        emailTenderSubmissions: true,
        emailContactInquiries: true,
        emailNewsletterSignups: false,
        emailSystemAlerts: true,
        emailWeeklyReport: false,
        notifyAdminEmail: 'admin@bifpcl.com',
    });

    const [securitySettings, setSecuritySettings] = useState({
        adminEmail: 'admin@bifpcl.com',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        sessionTimeout: '30',
        twoFactorEnabled: false,
    });

    const tabs = [
        { id: 'general', label: 'General', icon: <Globe size={16} /> },
        { id: 'company', label: 'Company', icon: <Building size={16} /> },
        { id: 'contact', label: 'Contact', icon: <MapPin size={16} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
        { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    ];

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    return (
        <div className="space-y-5">
            <PageHeader
                title="Settings"
                description="Configure your website settings and preferences"
            />

            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {/* Success Toast */}
            {saveSuccess && (
                <div className="fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 bg-accent-green/20 border border-accent-green/30 rounded-xl shadow-lg animate-slide-up z-50">
                    <Check className="text-accent-green" size={20} />
                    <span className="text-gray-900 dark:text-white font-medium">Settings saved successfully!</span>
                </div>
            )}

            {/* ============ GENERAL TAB ============ */}
            {activeTab === 'general' && (
                <div className="space-y-5">
                    {/* Website Identity */}
                    <Card padding="md">
                        <SectionHeader
                            title="Website Identity"
                            description="Basic information that appears across your website"
                        />
                        <FieldGroup columns={2}>
                            <Input
                                label="Website Name"
                                value={generalSettings.siteName}
                                onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                                placeholder="Your organization name"
                                hint="Displayed in browser tabs and search results"
                            />
                            <Input
                                label="Tagline / Slogan"
                                value={generalSettings.siteTagline}
                                onChange={(e) => setGeneralSettings({...generalSettings, siteTagline: e.target.value})}
                                placeholder="A short phrase describing your mission"
                                hint="Appears below your logo on some pages"
                            />
                        </FieldGroup>
                    </Card>

                    {/* Regional Settings */}
                    <Card padding="md">
                        <SectionHeader
                            title="Regional Settings"
                            description="Language and date/time preferences for your website"
                        />
                        <FieldGroup columns={3}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                                <select
                                    value={generalSettings.language}
                                    onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                                    className="w-full px-4 py-3 bg-white dark:bg-secondary-dark border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="en">English</option>
                                    <option value="bn">বাংলা (Bengali)</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1.5">Primary website language</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Zone</label>
                                <select
                                    value={generalSettings.timezone}
                                    onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                                    className="w-full px-4 py-3 bg-white dark:bg-secondary-dark border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="Asia/Dhaka">Bangladesh (GMT+6)</option>
                                    <option value="Asia/Kolkata">India (GMT+5:30)</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1.5">Used for dates and deadlines</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Format</label>
                                <select
                                    value={generalSettings.dateFormat}
                                    onChange={(e) => setGeneralSettings({...generalSettings, dateFormat: e.target.value})}
                                    className="w-full px-4 py-3 bg-white dark:bg-secondary-dark border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                                    <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1.5">How dates appear on the site</p>
                            </div>
                        </FieldGroup>
                    </Card>

                    {/* Site Status */}
                    <Card padding="md">
                        <SectionHeader
                            title="Website Status"
                            description="Control public access to your website"
                        />
                        <div className="space-y-4">
                            <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-gray-700/50">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-gray-900 dark:text-white">Maintenance Mode</h4>
                                        {generalSettings.maintenanceMode && (
                                            <span className="px-2 py-0.5 bg-accent-orange/20 text-accent-orange text-xs font-medium rounded-full">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        When enabled, visitors will see a maintenance page instead of your website.
                                        Admin users can still access the site normally.
                                    </p>
                                </div>
                                <Toggle
                                    checked={generalSettings.maintenanceMode}
                                    onChange={(checked) => setGeneralSettings({...generalSettings, maintenanceMode: checked})}
                                />
                            </div>

                            {generalSettings.maintenanceMode && (
                                <div className="pl-4 border-l-2 border-accent-orange/30">
                                    <Textarea
                                        label="Message to Visitors"
                                        value={generalSettings.maintenanceMessage}
                                        onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMessage: e.target.value})}
                                        rows={2}
                                        placeholder="Explain why the site is unavailable..."
                                        hint="This message will be shown to visitors during maintenance"
                                    />
                                </div>
                            )}

                            <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-gray-700/50">
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white">Coming Soon Mode</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Show a "Coming Soon" page for sections that are still under development.
                                    </p>
                                </div>
                                <Toggle
                                    checked={generalSettings.showComingSoon}
                                    onChange={(checked) => setGeneralSettings({...generalSettings, showComingSoon: checked})}
                                />
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end">
                        <Button leftIcon={<Save size={16} />} onClick={handleSave} isLoading={isSaving}>
                            Save Changes
                        </Button>
                    </div>
                </div>
            )}

            {/* ============ COMPANY TAB ============ */}
            {activeTab === 'company' && (
                <div className="space-y-5">
                    {/* Basic Information */}
                    <Card padding="md">
                        <SectionHeader
                            title="Organization Details"
                            description="Official information about your organization"
                        />
                        <div className="space-y-4">
                            <FieldGroup columns={2}>
                                <Input
                                    label="Full Legal Name"
                                    value={companySettings.fullName}
                                    onChange={(e) => setCompanySettings({...companySettings, fullName: e.target.value})}
                                    placeholder="Full registered company name"
                                    hint="As registered with government authorities"
                                />
                                <Input
                                    label="Short Name / Acronym"
                                    value={companySettings.shortName}
                                    onChange={(e) => setCompanySettings({...companySettings, shortName: e.target.value})}
                                    placeholder="e.g., BIFPCL"
                                    hint="Used in navigation and headers"
                                />
                            </FieldGroup>
                            <FieldGroup columns={2}>
                                <Input
                                    label="Registration Number"
                                    value={companySettings.registrationNo}
                                    onChange={(e) => setCompanySettings({...companySettings, registrationNo: e.target.value})}
                                    placeholder="Company registration number"
                                    hint="Official registration or incorporation number"
                                />
                                <Input
                                    label="Year Established"
                                    value={companySettings.yearEstablished}
                                    onChange={(e) => setCompanySettings({...companySettings, yearEstablished: e.target.value})}
                                    placeholder="e.g., 2012"
                                    hint="When the organization was founded"
                                />
                            </FieldGroup>
                            <Textarea
                                label="About the Organization"
                                value={companySettings.description}
                                onChange={(e) => setCompanySettings({...companySettings, description: e.target.value})}
                                rows={3}
                                placeholder="Brief description of your organization and its mission..."
                                hint="This appears on the About page and in search results"
                            />
                        </div>
                    </Card>

                    {/* Project/Technical Details */}
                    <Card padding="md">
                        <SectionHeader
                            title="Project Information"
                            description="Technical details about your power generation capacity"
                        />
                        <FieldGroup columns={3}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Total Capacity
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={companySettings.totalCapacity}
                                        onChange={(e) => setCompanySettings({...companySettings, totalCapacity: Number(e.target.value)})}
                                        className="w-full px-4 py-3 pr-14 bg-white dark:bg-secondary-dark border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">MW</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5">Power generation capacity in megawatts</p>
                            </div>
                            <Input
                                label="Technology Type"
                                value={companySettings.technology}
                                onChange={(e) => setCompanySettings({...companySettings, technology: e.target.value})}
                                placeholder="e.g., Ultra-Supercritical"
                                hint="Primary technology used"
                            />
                            <Input
                                label="Partnership Structure"
                                value={companySettings.partnership}
                                onChange={(e) => setCompanySettings({...companySettings, partnership: e.target.value})}
                                placeholder="e.g., 50:50 Joint Venture"
                                hint="Ownership or partnership details"
                            />
                        </FieldGroup>
                    </Card>

                    {/* Logo Upload */}
                    <Card padding="md">
                        <SectionHeader
                            title="Brand Assets"
                            description="Upload your organization's logo and favicon"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Organization Logo</label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer group">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                                        <Image className="text-gray-500" size={28} />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Click to upload or drag and drop</p>
                                    <p className="text-gray-500 text-xs mt-1">PNG, JPG up to 2MB (recommended: 512x512px)</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Favicon</label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer group">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                                        <Globe className="text-gray-500" size={28} />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Click to upload favicon</p>
                                    <p className="text-gray-500 text-xs mt-1">ICO or PNG, 32x32px or 64x64px</p>
                                </div>
                            </div>
                        </div>
                        <InfoCallout>
                            The logo appears in the website header, footer, and official documents.
                            The favicon is the small icon shown in browser tabs.
                        </InfoCallout>
                    </Card>

                    <div className="flex justify-end">
                        <Button leftIcon={<Save size={16} />} onClick={handleSave} isLoading={isSaving}>
                            Save Changes
                        </Button>
                    </div>
                </div>
            )}

            {/* ============ CONTACT TAB ============ */}
            {activeTab === 'contact' && (
                <div className="space-y-5">
                    {/* Head Office */}
                    <Card padding="md">
                        <SectionHeader
                            title="Head Office"
                            description="Main corporate office address and contact details"
                        />
                        <div className="space-y-4">
                            <Textarea
                                label="Address"
                                value={contactSettings.headOfficeAddress}
                                onChange={(e) => setContactSettings({...contactSettings, headOfficeAddress: e.target.value})}
                                rows={2}
                                placeholder="Full street address..."
                            />
                            <FieldGroup columns={2}>
                                <Input
                                    label="Phone Number"
                                    value={contactSettings.headOfficePhone}
                                    onChange={(e) => setContactSettings({...contactSettings, headOfficePhone: e.target.value})}
                                    placeholder="+880-2-XXXXXXXX"
                                    leftIcon={<Phone size={16} />}
                                />
                                <Input
                                    label="Fax Number"
                                    value={contactSettings.headOfficeFax}
                                    onChange={(e) => setContactSettings({...contactSettings, headOfficeFax: e.target.value})}
                                    placeholder="+880-2-XXXXXXXX"
                                    leftIcon={<FileText size={16} />}
                                />
                            </FieldGroup>
                        </div>
                    </Card>

                    {/* Site Office */}
                    <Card padding="md">
                        <SectionHeader
                            title="Project Site Office"
                            description="Power plant location and contact details"
                        />
                        <div className="space-y-4">
                            <Textarea
                                label="Site Address"
                                value={contactSettings.siteOfficeAddress}
                                onChange={(e) => setContactSettings({...contactSettings, siteOfficeAddress: e.target.value})}
                                rows={2}
                                placeholder="Power plant site address..."
                            />
                            <FieldGroup columns={2}>
                                <Input
                                    label="Site Office Phone"
                                    value={contactSettings.siteOfficePhone}
                                    onChange={(e) => setContactSettings({...contactSettings, siteOfficePhone: e.target.value})}
                                    placeholder="+880-XXXXXXXXXX"
                                    leftIcon={<Phone size={16} />}
                                />
                            </FieldGroup>
                        </div>
                    </Card>

                    {/* Email Addresses */}
                    <Card padding="md">
                        <SectionHeader
                            title="Email Addresses"
                            description="Department-specific email addresses for inquiries"
                        />
                        <FieldGroup columns={2}>
                            <Input
                                label="General Inquiries"
                                value={contactSettings.generalEmail}
                                onChange={(e) => setContactSettings({...contactSettings, generalEmail: e.target.value})}
                                placeholder="info@yourcompany.com"
                                leftIcon={<Mail size={16} />}
                                hint="For general questions and information"
                            />
                            <Input
                                label="Careers / HR"
                                value={contactSettings.careersEmail}
                                onChange={(e) => setContactSettings({...contactSettings, careersEmail: e.target.value})}
                                placeholder="careers@yourcompany.com"
                                leftIcon={<Briefcase size={16} />}
                                hint="For job applications and HR matters"
                            />
                            <Input
                                label="Tenders / Procurement"
                                value={contactSettings.tendersEmail}
                                onChange={(e) => setContactSettings({...contactSettings, tendersEmail: e.target.value})}
                                placeholder="tenders@yourcompany.com"
                                leftIcon={<FileText size={16} />}
                                hint="For tender submissions and vendor queries"
                            />
                            <Input
                                label="Media / Press"
                                value={contactSettings.mediaEmail}
                                onChange={(e) => setContactSettings({...contactSettings, mediaEmail: e.target.value})}
                                placeholder="media@yourcompany.com"
                                leftIcon={<Users size={16} />}
                                hint="For press and media inquiries"
                            />
                        </FieldGroup>
                    </Card>

                    {/* Working Hours */}
                    <Card padding="md">
                        <SectionHeader
                            title="Office Hours"
                            description="When your offices are open for visitors and calls"
                        />
                        <FieldGroup columns={2}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Working Days</label>
                                <select
                                    value={contactSettings.workingDays}
                                    onChange={(e) => setContactSettings({...contactSettings, workingDays: e.target.value})}
                                    className="w-full px-4 py-3 bg-white dark:bg-secondary-dark border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="Sunday - Thursday">Sunday - Thursday</option>
                                    <option value="Monday - Friday">Monday - Friday</option>
                                    <option value="Saturday - Thursday">Saturday - Thursday</option>
                                </select>
                            </div>
                            <Input
                                label="Working Hours"
                                value={contactSettings.workingHours}
                                onChange={(e) => setContactSettings({...contactSettings, workingHours: e.target.value})}
                                placeholder="e.g., 9:00 AM - 5:00 PM"
                                leftIcon={<Clock size={16} />}
                            />
                        </FieldGroup>
                    </Card>

                    {/* Social Media */}
                    <Card padding="md">
                        <SectionHeader
                            title="Social Media"
                            description="Links to your official social media profiles"
                        />
                        <FieldGroup columns={2}>
                            <Input
                                label="Facebook Page"
                                value={contactSettings.facebook}
                                onChange={(e) => setContactSettings({...contactSettings, facebook: e.target.value})}
                                placeholder="https://facebook.com/yourpage"
                                leftIcon={<Facebook size={16} />}
                            />
                            <Input
                                label="Twitter / X"
                                value={contactSettings.twitter}
                                onChange={(e) => setContactSettings({...contactSettings, twitter: e.target.value})}
                                placeholder="https://twitter.com/yourhandle"
                                leftIcon={<Twitter size={16} />}
                            />
                            <Input
                                label="LinkedIn"
                                value={contactSettings.linkedin}
                                onChange={(e) => setContactSettings({...contactSettings, linkedin: e.target.value})}
                                placeholder="https://linkedin.com/company/yourcompany"
                                leftIcon={<Linkedin size={16} />}
                            />
                            <Input
                                label="YouTube Channel"
                                value={contactSettings.youtube}
                                onChange={(e) => setContactSettings({...contactSettings, youtube: e.target.value})}
                                placeholder="https://youtube.com/@yourchannel"
                                leftIcon={<Youtube size={16} />}
                            />
                        </FieldGroup>
                        <InfoCallout>
                            Social media links will appear in the website footer and contact page.
                            Leave blank to hide a social network.
                        </InfoCallout>
                    </Card>

                    <div className="flex justify-end">
                        <Button leftIcon={<Save size={16} />} onClick={handleSave} isLoading={isSaving}>
                            Save Changes
                        </Button>
                    </div>
                </div>
            )}

            {/* ============ NOTIFICATIONS TAB ============ */}
            {activeTab === 'notifications' && (
                <div className="space-y-5">
                    {/* Notification Email */}
                    <Card padding="md">
                        <SectionHeader
                            title="Notification Recipient"
                            description="Where should we send email notifications?"
                        />
                        <Input
                            label="Admin Email Address"
                            value={notificationSettings.notifyAdminEmail}
                            onChange={(e) => setNotificationSettings({...notificationSettings, notifyAdminEmail: e.target.value})}
                            placeholder="admin@yourcompany.com"
                            leftIcon={<Mail size={16} />}
                            hint="All notifications will be sent to this email address"
                        />
                    </Card>

                    {/* Email Notifications */}
                    <Card padding="md">
                        <SectionHeader
                            title="Email Notifications"
                            description="Choose which activities should trigger email alerts"
                        />
                        <div className="space-y-3">
                            <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-gray-700/50">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Briefcase className="text-primary-light" size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Job Applications</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                            Receive an email when someone applies for a job position
                                        </p>
                                    </div>
                                </div>
                                <Toggle
                                    checked={notificationSettings.emailJobApplications}
                                    onChange={(checked) => setNotificationSettings({...notificationSettings, emailJobApplications: checked})}
                                />
                            </div>

                            <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-gray-700/50">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center shrink-0">
                                        <FileText className="text-accent-green" size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Tender Submissions</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                            Get notified when a vendor submits a tender bid
                                        </p>
                                    </div>
                                </div>
                                <Toggle
                                    checked={notificationSettings.emailTenderSubmissions}
                                    onChange={(checked) => setNotificationSettings({...notificationSettings, emailTenderSubmissions: checked})}
                                />
                            </div>

                            <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-gray-700/50">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-accent-orange/10 flex items-center justify-center shrink-0">
                                        <Mail className="text-accent-orange" size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Contact Form Messages</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                            Receive emails when visitors submit the contact form
                                        </p>
                                    </div>
                                </div>
                                <Toggle
                                    checked={notificationSettings.emailContactInquiries}
                                    onChange={(checked) => setNotificationSettings({...notificationSettings, emailContactInquiries: checked})}
                                />
                            </div>

                            <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-gray-700/50">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                                        <Bell className="text-purple-400" size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Newsletter Sign-ups</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                            Get notified when someone subscribes to your newsletter
                                        </p>
                                    </div>
                                </div>
                                <Toggle
                                    checked={notificationSettings.emailNewsletterSignups}
                                    onChange={(checked) => setNotificationSettings({...notificationSettings, emailNewsletterSignups: checked})}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* System Notifications */}
                    <Card padding="md">
                        <SectionHeader
                            title="System Alerts"
                            description="Important system and security notifications"
                        />
                        <div className="space-y-3">
                            <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-gray-700/50">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                                        <AlertTriangle className="text-red-400" size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">System Alerts</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                            Critical alerts about system errors or security issues
                                        </p>
                                    </div>
                                </div>
                                <Toggle
                                    checked={notificationSettings.emailSystemAlerts}
                                    onChange={(checked) => setNotificationSettings({...notificationSettings, emailSystemAlerts: checked})}
                                />
                            </div>

                            <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-gray-700/50">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center shrink-0">
                                        <Calendar className="text-gray-400" size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Weekly Summary Report</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                            Receive a weekly email summarizing website activity
                                        </p>
                                    </div>
                                </div>
                                <Toggle
                                    checked={notificationSettings.emailWeeklyReport}
                                    onChange={(checked) => setNotificationSettings({...notificationSettings, emailWeeklyReport: checked})}
                                />
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end">
                        <Button leftIcon={<Save size={16} />} onClick={handleSave} isLoading={isSaving}>
                            Save Changes
                        </Button>
                    </div>
                </div>
            )}

            {/* ============ SECURITY TAB ============ */}
            {activeTab === 'security' && (
                <div className="space-y-5">
                    {/* Admin Account */}
                    <Card padding="md">
                        <SectionHeader
                            title="Admin Account"
                            description="Manage your administrator account settings"
                        />
                        <Input
                            label="Admin Email Address"
                            type="email"
                            value={securitySettings.adminEmail}
                            onChange={(e) => setSecuritySettings({...securitySettings, adminEmail: e.target.value})}
                            placeholder="admin@yourcompany.com"
                            leftIcon={<Mail size={16} />}
                            hint="Used for login and account recovery"
                        />
                    </Card>

                    {/* Change Password */}
                    <Card padding="md">
                        <SectionHeader
                            title="Change Password"
                            description="Update your admin panel password"
                        />
                        <div className="space-y-4">
                            <div className="relative">
                                <Input
                                    label="Current Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={securitySettings.currentPassword}
                                    onChange={(e) => setSecuritySettings({...securitySettings, currentPassword: e.target.value})}
                                    placeholder="Enter your current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <FieldGroup columns={2}>
                                <Input
                                    label="New Password"
                                    type="password"
                                    value={securitySettings.newPassword}
                                    onChange={(e) => setSecuritySettings({...securitySettings, newPassword: e.target.value})}
                                    placeholder="Enter new password"
                                    hint="At least 8 characters with numbers and symbols"
                                />
                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    value={securitySettings.confirmPassword}
                                    onChange={(e) => setSecuritySettings({...securitySettings, confirmPassword: e.target.value})}
                                    placeholder="Re-enter new password"
                                />
                            </FieldGroup>
                            <div className="flex justify-end">
                                <Button variant="secondary">
                                    Update Password
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Session Settings */}
                    <Card padding="md">
                        <SectionHeader
                            title="Session Settings"
                            description="Control how long you stay logged in"
                        />
                        <div className="max-w-sm">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Auto Logout After Inactivity</label>
                            <select
                                value={securitySettings.sessionTimeout}
                                onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                                className="w-full px-4 py-3 bg-white dark:bg-secondary-dark border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="60">1 hour</option>
                                <option value="120">2 hours</option>
                                <option value="480">8 hours (work day)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1.5">
                                You'll be automatically logged out after this period of inactivity
                            </p>
                        </div>
                    </Card>

                    {/* Two-Factor Auth */}
                    <Card padding="md">
                        <SectionHeader
                            title="Two-Factor Authentication"
                            description="Add an extra layer of security to your account"
                        />
                        <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-gray-700/50">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center shrink-0">
                                    <Shield className="text-accent-green" size={18} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                                        {securitySettings.twoFactorEnabled ? (
                                            <span className="px-2 py-0.5 bg-accent-green/20 text-accent-green text-xs font-medium rounded-full flex items-center gap-1">
                                                <Check size={10} /> Enabled
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs font-medium rounded-full">
                                                Not Enabled
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Require a verification code from your phone in addition to your password when logging in.
                                    </p>
                                </div>
                            </div>
                            <Button variant={securitySettings.twoFactorEnabled ? 'secondary' : 'primary'} size="sm">
                                {securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'}
                            </Button>
                        </div>
                    </Card>

                    {/* Danger Zone */}
                    <Card padding="md" className="!border-red-500/30 !bg-red-500/5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                                <AlertTriangle className="text-red-400" size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-400 text-lg">Danger Zone</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-5">
                                    These actions are irreversible. Please proceed with caution.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Button variant="danger" size="sm">
                                        Reset All Settings
                                    </Button>
                                    <Button variant="secondary" size="sm" className="!border-red-500/30 !text-red-400 hover:!bg-red-500/10">
                                        Clear All Data
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end">
                        <Button leftIcon={<Save size={16} />} onClick={handleSave} isLoading={isSaving}>
                            Save Changes
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
