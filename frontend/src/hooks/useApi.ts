import { useQuery } from '@tanstack/react-query';
import {
    companyApi, projectsApi, directorsApi, newsApi,
    careersApi, tendersApi, csrApi, noticesApi, galleryApi
} from '../services/api';

export const useCompanyInfo = () =>
    useQuery({ queryKey: ['company'], queryFn: companyApi.getInfo });

export const useProjects = () =>
    useQuery({ queryKey: ['projects'], queryFn: projectsApi.getAll });

export const useProject = (slug: string) =>
    useQuery({ queryKey: ['project', slug], queryFn: () => projectsApi.getBySlug(slug), enabled: !!slug });

export const useDirectors = () =>
    useQuery({ queryKey: ['directors'], queryFn: directorsApi.getAll });

export const useNews = () =>
    useQuery({ queryKey: ['news'], queryFn: newsApi.getAll });

export const useFeaturedNews = () =>
    useQuery({ queryKey: ['news', 'featured'], queryFn: newsApi.getFeatured });

export const useNewsArticle = (slug: string) =>
    useQuery({ queryKey: ['news', slug], queryFn: () => newsApi.getBySlug(slug), enabled: !!slug });

export const useCareers = () =>
    useQuery({ queryKey: ['careers'], queryFn: careersApi.getAll });

export const useCareer = (id: number) =>
    useQuery({ queryKey: ['career', id], queryFn: () => careersApi.getById(id), enabled: !!id });

export const useTenders = (params?: Record<string, string>) =>
    useQuery({ queryKey: ['tenders', params], queryFn: () => tendersApi.getAll(params) });

export const useCSRInitiatives = () =>
    useQuery({ queryKey: ['csr'], queryFn: csrApi.getAll });

export const useNotices = (params?: Record<string, string>) =>
    useQuery({ queryKey: ['notices', params], queryFn: () => noticesApi.getAll(params) });

export const useNotice = (slug: string) =>
    useQuery({ queryKey: ['notice', slug], queryFn: () => noticesApi.getBySlug(slug), enabled: !!slug });

export const useFeaturedNotices = () =>
    useQuery({ queryKey: ['notices', 'featured'], queryFn: noticesApi.getFeatured });

export const useGallery = (params?: Record<string, string>) =>
    useQuery({ queryKey: ['gallery', params], queryFn: () => galleryApi.getAll(params) });

export const useGalleryImage = (slug: string) =>
    useQuery({ queryKey: ['gallery', slug], queryFn: () => galleryApi.getBySlug(slug), enabled: !!slug });

export const useFeaturedGallery = () =>
    useQuery({ queryKey: ['gallery', 'featured'], queryFn: galleryApi.getFeatured });
