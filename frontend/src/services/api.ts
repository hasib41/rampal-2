import axios from 'axios';
import type {
    CompanyInfo, Project, Director, NewsArticle,
    Career, Tender, CSRInitiative, ContactFormData, Notice
} from '../types';

// API Base URL (without /api suffix for media URLs)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const BACKEND_URL = API_BASE.replace('/api', '');

const api = axios.create({
    baseURL: API_BASE,
});

// =============================================================================
// IMAGE URL HELPER
// =============================================================================
/**
 * Resolves image/media URLs to full URLs
 * - If URL is already absolute (http/https), returns as-is
 * - If URL is relative, prepends the backend URL
 * - If URL is null/undefined, returns empty string
 */
export function getMediaUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // Handle relative URLs - prepend backend URL
    return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

// Type for paginated responses from Django REST Framework
interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// Helper to extract results from paginated response
const getResults = <T>(response: { data: PaginatedResponse<T> }): T[] => response.data.results;

// Company
export const companyApi = {
    getInfo: () => api.get<CompanyInfo>('/company/').then(res => res.data),
};

// Projects
export const projectsApi = {
    getAll: () => api.get<PaginatedResponse<Project>>('/projects/').then(getResults),
    getBySlug: (slug: string) => api.get<Project>(`/projects/${slug}/`).then(res => res.data),
    create: (data: FormData) => api.post<Project>('/projects/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
    update: (id: number, data: FormData) => api.patch<Project>(`/projects/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
    delete: (id: number) => api.delete(`/projects/${id}/`),
};

// Directors
export const directorsApi = {
    getAll: () => api.get<PaginatedResponse<Director>>('/directors/').then(getResults),
    create: (data: FormData) => api.post<Director>('/directors/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
    update: (id: number, data: FormData) => api.patch<Director>(`/directors/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
    delete: (id: number) => api.delete(`/directors/${id}/`),
};

// News
export const newsApi = {
    getAll: () => api.get<PaginatedResponse<NewsArticle>>('/news/').then(getResults),
    getFeatured: () => api.get<NewsArticle[]>('/news/featured/').then(res => res.data),
    getBySlug: (slug: string) => api.get<NewsArticle>(`/news/${slug}/`).then(res => res.data),
    create: (data: FormData) => api.post<NewsArticle>('/news/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
    update: (id: number, data: FormData) => api.patch<NewsArticle>(`/news/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
    delete: (id: number) => api.delete(`/news/${id}/`),
};

// Careers
export const careersApi = {
    getAll: () => api.get<PaginatedResponse<Career>>('/careers/').then(getResults),
    getById: (id: number) => api.get<Career>(`/careers/${id}/`).then(res => res.data),
    apply: (data: FormData) => api.post('/apply/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    create: (data: Career) => api.post<Career>('/careers/', data).then(res => res.data),
    update: (id: number, data: Career) => api.patch<Career>(`/careers/${id}/`, data).then(res => res.data),
    delete: (id: number) => api.delete(`/careers/${id}/`),
};

// Tenders
export const tendersApi = {
    getAll: (params?: Record<string, string>) =>
        api.get<PaginatedResponse<Tender>>('/tenders/', { params }).then(getResults),
    create: (data: FormData) => api.post<Tender>('/tenders/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
    update: (id: number, data: FormData) => api.patch<Tender>(`/tenders/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
    delete: (id: number) => api.delete(`/tenders/${id}/`),
};

// CSR
export const csrApi = {
    getAll: () => api.get<PaginatedResponse<CSRInitiative>>('/csr/').then(getResults),
};

// Notices
export const noticesApi = {
    getAll: (params?: Record<string, string>) =>
        api.get<PaginatedResponse<Notice>>('/notices/', { params }).then(getResults),
    getBySlug: (slug: string) => api.get<Notice>(`/notices/${slug}/`).then(res => res.data),
    getFeatured: () => api.get<Notice[]>('/notices/featured/').then(res => res.data),
    create: (data: FormData) => api.post<Notice>('/notices/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
    update: (id: number, data: FormData) => api.patch<Notice>(`/notices/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
    delete: (id: number) => api.delete(`/notices/${id}/`),
};

// Contact
export const contactApi = {
    submit: (data: ContactFormData) => api.post('/contact/', data),
};
