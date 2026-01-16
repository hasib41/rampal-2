import axios from 'axios';
import type {
    CompanyInfo, Project, Director, NewsArticle,
    Career, Tender, CSRInitiative, ContactFormData, Notice
} from '../types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

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
};

// Directors
export const directorsApi = {
    getAll: () => api.get<PaginatedResponse<Director>>('/directors/').then(getResults),
};

// News
export const newsApi = {
    getAll: () => api.get<PaginatedResponse<NewsArticle>>('/news/').then(getResults),
    getFeatured: () => api.get<NewsArticle[]>('/news/featured/').then(res => res.data),
    getBySlug: (slug: string) => api.get<NewsArticle>(`/news/${slug}/`).then(res => res.data),
};

// Careers
export const careersApi = {
    getAll: () => api.get<PaginatedResponse<Career>>('/careers/').then(getResults),
    getById: (id: number) => api.get<Career>(`/careers/${id}/`).then(res => res.data),
    apply: (data: FormData) => api.post('/apply/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

// Tenders
export const tendersApi = {
    getAll: (params?: Record<string, string>) =>
        api.get<PaginatedResponse<Tender>>('/tenders/', { params }).then(getResults),
};

// CSR
export const csrApi = {
    getAll: () => api.get<PaginatedResponse<CSRInitiative>>('/csr/').then(getResults),
};

// Notices
export const noticesApi = {
    getAll: () => api.get<PaginatedResponse<Notice>>('/notices/').then(getResults),
};

// Contact
export const contactApi = {
    submit: (data: ContactFormData) => api.post('/contact/', data),
};

