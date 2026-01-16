export interface CompanyInfo {
    id: number;
    name: string;
    tagline: string;
    description: string;
    total_capacity_mw: number;
    technology: string;
    partnership_ratio: string;
}

export interface Project {
    id: number;
    name: string;
    slug: string;
    location: string;
    capacity_mw: number;
    technology: string;
    status: 'operational' | 'construction' | 'planning';
    description: string;
    hero_image: string;
    latitude?: number;
    longitude?: number;
    efficiency_percent?: number;
}

export interface Director {
    id: number;
    name: string;
    title: string;
    organization: string;
    photo: string;
    bio: string;
    is_chairman: boolean;
    order: number;
}

export interface NewsArticle {
    id: number;
    title: string;
    slug: string;
    category: 'press' | 'event' | 'in_the_news' | 'update';
    excerpt: string;
    content: string;
    image: string;
    published_date: string;
    is_featured: boolean;
}

export interface Career {
    id: number;
    title: string;
    department: string;
    location: string;
    employment_type: 'full_time' | 'contract';
    description: string;
    requirements: string;
    salary_range: string;
    deadline: string;
    is_active: boolean;
}

export interface Tender {
    id: number;
    tender_id: string;
    title: string;
    category: 'mechanical' | 'electrical' | 'civil' | 'it';
    description: string;
    status: 'open' | 'evaluation' | 'awarded' | 'closed';
    publication_date: string;
    deadline: string;
    value_range: string;
    document: string;
}

export interface CSRInitiative {
    id: number;
    title: string;
    category: string;
    description: string;
    impact_metric: string;
    image: string;
}

export interface ContactFormData {
    full_name: string;
    organization?: string;
    email: string;
    category: string;
    message: string;
}

export interface JobApplicationData {
    career: number;
    full_name: string;
    email: string;
    phone: string;
    linkedin_url?: string;
    resume: File;
    cover_letter: string;
}

export interface Notice {
    id: number;
    title: string;
    slug: string;
    category: 'general' | 'urgent' | 'tender' | 'recruitment';
    category_display: string;
    excerpt: string;
    content: string;
    published_date: string;
    document?: string;
    attachment_name?: string;
    link?: string;
    is_featured: boolean;
    created_at?: string;
    updated_at?: string;
}

