# BIFPCL Corporate Website - Complete Development Guide

## Overview
A modern corporate website for Bangladesh-India Friendship Power Company Limited (BIFPCL).

**Tech Stack:**
- Frontend: React 18 + TypeScript + Tailwind CSS + Vite
- Backend: Django 5 + Django REST Framework + PostgreSQL

---

## STEP 1: Backend Setup

### 1.1 Create Django Project
```bash
cd e:\progamming\Project\rampalProject2
mkdir backend && cd backend
python -m venv venv
.\venv\Scripts\activate
pip install django djangorestframework django-cors-headers pillow python-dotenv psycopg2-binary
django-admin startproject config .
python manage.py startapp core
python manage.py startapp api
```

### 1.2 Configure settings.py
```python
# config/settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third party
    'rest_framework',
    'corsheaders',
    # Local
    'core',
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add at top
    'django.middleware.common.CommonMiddleware',
    # ... rest of middleware
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ]
}

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

### 1.3 Core Models (core/models.py)
```python
from django.db import models

class CompanyInfo(models.Model):
    """Singleton model for company information"""
    name = models.CharField(max_length=200, default="BIFPCL")
    tagline = models.CharField(max_length=300)
    description = models.TextField()
    total_capacity_mw = models.IntegerField(default=1320)
    technology = models.CharField(max_length=100, default="Ultra-Super Critical")
    partnership_ratio = models.CharField(max_length=20, default="50:50")
    
    class Meta:
        verbose_name_plural = "Company Info"


class Project(models.Model):
    """Power plant projects"""
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    location = models.CharField(max_length=200)
    capacity_mw = models.IntegerField()
    technology = models.CharField(max_length=100)
    status = models.CharField(max_length=50, choices=[
        ('operational', 'Operational'),
        ('construction', 'Under Construction'),
        ('planning', 'Planning'),
    ])
    description = models.TextField()
    hero_image = models.ImageField(upload_to='projects/')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    efficiency_percent = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Director(models.Model):
    """Board of Directors"""
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    organization = models.CharField(max_length=200)
    photo = models.ImageField(upload_to='directors/')
    bio = models.TextField()
    order = models.IntegerField(default=0)
    is_chairman = models.BooleanField(default=False)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name


class NewsArticle(models.Model):
    """Press releases and news"""
    CATEGORY_CHOICES = [
        ('press', 'Press Release'),
        ('event', 'Event'),
        ('in_the_news', 'In The News'),
        ('update', 'Update'),
    ]
    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    excerpt = models.TextField(max_length=500)
    content = models.TextField()
    image = models.ImageField(upload_to='news/')
    published_date = models.DateField()
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-published_date']

    def __str__(self):
        return self.title


class Career(models.Model):
    """Job listings"""
    title = models.CharField(max_length=200)
    department = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    employment_type = models.CharField(max_length=50, choices=[
        ('full_time', 'Full Time'),
        ('contract', 'Contract'),
    ])
    description = models.TextField()
    requirements = models.TextField()
    salary_range = models.CharField(max_length=100, blank=True)
    deadline = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class JobApplication(models.Model):
    """Job applications"""
    career = models.ForeignKey(Career, on_delete=models.CASCADE, related_name='applications')
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    linkedin_url = models.URLField(blank=True)
    resume = models.FileField(upload_to='resumes/')
    cover_letter = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
    ])

    def __str__(self):
        return f"{self.full_name} - {self.career.title}"


class Tender(models.Model):
    """Procurement tenders"""
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('evaluation', 'Evaluation'),
        ('awarded', 'Awarded'),
        ('closed', 'Closed'),
    ]
    CATEGORY_CHOICES = [
        ('mechanical', 'Mechanical'),
        ('electrical', 'Electrical'),
        ('civil', 'Civil'),
        ('it', 'IT Services'),
    ]
    tender_id = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=300)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    publication_date = models.DateField()
    deadline = models.DateField()
    value_range = models.CharField(max_length=100, blank=True)
    document = models.FileField(upload_to='tenders/', blank=True)

    class Meta:
        ordering = ['-publication_date']

    def __str__(self):
        return f"{self.tender_id} - {self.title}"


class ContactInquiry(models.Model):
    """Contact form submissions"""
    CATEGORY_CHOICES = [
        ('general', 'General Inquiry'),
        ('media', 'Media Relations'),
        ('technical', 'Technical Support'),
        ('careers', 'Careers'),
    ]
    full_name = models.CharField(max_length=200)
    organization = models.CharField(max_length=200, blank=True)
    email = models.EmailField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.full_name} - {self.category}"


class CSRInitiative(models.Model):
    """CSR and sustainability projects"""
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=[
        ('education', 'Education for All'),
        ('health', 'Health Outreach'),
        ('environment', 'Mangrove Conservation'),
        ('community', 'Community Development'),
    ])
    description = models.TextField()
    impact_metric = models.CharField(max_length=100)  # e.g., "1.2M+ beneficiaries"
    image = models.ImageField(upload_to='csr/')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title
```

### 1.4 API Serializers (api/serializers.py)
```python
from rest_framework import serializers
from core.models import *

class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = '__all__'

class ProjectListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'slug', 'location', 'capacity_mw', 'status', 'hero_image']

class ProjectDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class DirectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Director
        fields = '__all__'

class NewsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = ['id', 'title', 'slug', 'category', 'excerpt', 'image', 'published_date', 'is_featured']

class NewsDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = '__all__'

class CareerListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Career
        fields = ['id', 'title', 'department', 'location', 'employment_type', 'salary_range', 'deadline']

class CareerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Career
        fields = '__all__'

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ['career', 'full_name', 'email', 'phone', 'linkedin_url', 'resume', 'cover_letter']

class TenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tender
        fields = '__all__'

class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = ['full_name', 'organization', 'email', 'category', 'message']

class CSRInitiativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSRInitiative
        fields = '__all__'
```

### 1.5 API Views (api/views.py)
```python
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from core.models import *
from .serializers import *

class CompanyInfoView(generics.RetrieveAPIView):
    serializer_class = CompanyInfoSerializer
    def get_object(self):
        return CompanyInfo.objects.first()

class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all()
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectListSerializer

class DirectorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Director.objects.all()
    serializer_class = DirectorSerializer

class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NewsArticle.objects.all()
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return NewsDetailSerializer
        return NewsListSerializer
    
    @action(detail=False)
    def featured(self, request):
        featured = self.queryset.filter(is_featured=True)[:3]
        serializer = NewsListSerializer(featured, many=True)
        return Response(serializer.data)

class CareerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Career.objects.filter(is_active=True)
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CareerDetailSerializer
        return CareerListSerializer

class JobApplicationView(generics.CreateAPIView):
    serializer_class = JobApplicationSerializer

class TenderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tender.objects.all()
    serializer_class = TenderSerializer
    filterset_fields = ['status', 'category']

class ContactInquiryView(generics.CreateAPIView):
    serializer_class = ContactInquirySerializer

class CSRInitiativeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CSRInitiative.objects.all()
    serializer_class = CSRInitiativeSerializer
```

### 1.6 API URLs (api/urls.py)
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('projects', ProjectViewSet)
router.register('directors', DirectorViewSet)
router.register('news', NewsViewSet)
router.register('careers', CareerViewSet)
router.register('tenders', TenderViewSet)
router.register('csr', CSRInitiativeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('company/', CompanyInfoView.as_view()),
    path('apply/', JobApplicationView.as_view()),
    path('contact/', ContactInquiryView.as_view()),
]
```

### 1.7 Main URLs (config/urls.py)
```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### 1.8 Admin Configuration (core/admin.py)
```python
from django.contrib import admin
from .models import *

@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    list_display = ['name', 'total_capacity_mw']

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'capacity_mw', 'status']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Director)
class DirectorAdmin(admin.ModelAdmin):
    list_display = ['name', 'title', 'organization', 'order']
    list_editable = ['order']

@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'published_date', 'is_featured']
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ['category', 'is_featured']

@admin.register(Career)
class CareerAdmin(admin.ModelAdmin):
    list_display = ['title', 'department', 'location', 'deadline', 'is_active']
    list_filter = ['is_active', 'department']

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'career', 'submitted_at', 'status']
    list_filter = ['status', 'career']

@admin.register(Tender)
class TenderAdmin(admin.ModelAdmin):
    list_display = ['tender_id', 'title', 'category', 'status', 'deadline']
    list_filter = ['status', 'category']

@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'category', 'submitted_at', 'is_resolved']
    list_filter = ['category', 'is_resolved']

@admin.register(CSRInitiative)
class CSRInitiativeAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'order']
    list_editable = ['order']
```

---

## STEP 2: Frontend Setup

### 2.1 Create Vite Project
```bash
cd e:\progamming\Project\rampalProject2
npx create-vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npm install react-router-dom axios @tanstack/react-query lucide-react
npx tailwindcss init -p
```

### 2.2 Tailwind Config (tailwind.config.js)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066CC',
          dark: '#004999',
          light: '#3399FF',
        },
        secondary: {
          DEFAULT: '#1a1a2e',
          dark: '#0f0f1a',
          light: '#2a2a4e',
        },
        accent: {
          blue: '#3b82f6',
          green: '#22c55e',
          orange: '#f97316',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 2.3 Global CSS (src/index.css)
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-sans antialiased;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary text-white px-6 py-3 rounded-lg font-medium 
           hover:bg-primary-dark transition-colors duration-200;
  }
  .btn-secondary {
    @apply bg-transparent border-2 border-white text-white px-6 py-3 
           rounded-lg font-medium hover:bg-white/10 transition-colors duration-200;
  }
  .section-title {
    @apply text-3xl md:text-4xl font-bold;
  }
  .card {
    @apply bg-white rounded-xl shadow-lg overflow-hidden;
  }
  .card-dark {
    @apply bg-secondary-light rounded-xl overflow-hidden;
  }
}
```

### 2.4 TypeScript Types (src/types/index.ts)
```typescript
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
```

### 2.5 API Service (src/services/api.ts)
```typescript
import axios from 'axios';
import type { CompanyInfo, Project, Director, NewsArticle, Career, Tender, CSRInitiative } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

export const companyApi = {
  getInfo: () => api.get<CompanyInfo>('/company/').then(res => res.data),
};

export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects/').then(res => res.data),
  getBySlug: (slug: string) => api.get<Project>(`/projects/${slug}/`).then(res => res.data),
};

export const directorsApi = {
  getAll: () => api.get<Director[]>('/directors/').then(res => res.data),
};

export const newsApi = {
  getAll: () => api.get<NewsArticle[]>('/news/').then(res => res.data),
  getFeatured: () => api.get<NewsArticle[]>('/news/featured/').then(res => res.data),
  getBySlug: (slug: string) => api.get<NewsArticle>(`/news/${slug}/`).then(res => res.data),
};

export const careersApi = {
  getAll: () => api.get<Career[]>('/careers/').then(res => res.data),
  getById: (id: number) => api.get<Career>(`/careers/${id}/`).then(res => res.data),
  apply: (data: FormData) => api.post('/apply/', data),
};

export const tendersApi = {
  getAll: (params?: Record<string, string>) => 
    api.get<Tender[]>('/tenders/', { params }).then(res => res.data),
};

export const csrApi = {
  getAll: () => api.get<CSRInitiative[]>('/csr/').then(res => res.data),
};

export const contactApi = {
  submit: (data: { full_name: string; organization?: string; email: string; category: string; message: string }) =>
    api.post('/contact/', data),
};
```

### 2.6 React Query Hooks (src/hooks/useApi.ts)
```typescript
import { useQuery } from '@tanstack/react-query';
import { companyApi, projectsApi, directorsApi, newsApi, careersApi, tendersApi, csrApi } from '../services/api';

export const useCompanyInfo = () => useQuery({ queryKey: ['company'], queryFn: companyApi.getInfo });
export const useProjects = () => useQuery({ queryKey: ['projects'], queryFn: projectsApi.getAll });
export const useProject = (slug: string) => useQuery({ queryKey: ['project', slug], queryFn: () => projectsApi.getBySlug(slug) });
export const useDirectors = () => useQuery({ queryKey: ['directors'], queryFn: directorsApi.getAll });
export const useNews = () => useQuery({ queryKey: ['news'], queryFn: newsApi.getAll });
export const useFeaturedNews = () => useQuery({ queryKey: ['news', 'featured'], queryFn: newsApi.getFeatured });
export const useCareers = () => useQuery({ queryKey: ['careers'], queryFn: careersApi.getAll });
export const useCareer = (id: number) => useQuery({ queryKey: ['career', id], queryFn: () => careersApi.getById(id) });
export const useTenders = (params?: Record<string, string>) => useQuery({ queryKey: ['tenders', params], queryFn: () => tendersApi.getAll(params) });
export const useCSRInitiatives = () => useQuery({ queryKey: ['csr'], queryFn: csrApi.getAll });
```

---

## STEP 3: Shared Components

### 3.1 Navbar (src/components/layout/Navbar.tsx)
```tsx
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'Sustainability', path: '/sustainability' },
  { 
    name: 'About', 
    children: [
      { name: 'Board of Directors', path: '/directors' },
      { name: 'Media Center', path: '/media' },
    ]
  },
  { name: 'Careers', path: '/careers' },
  { name: 'Contact', path: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-secondary-dark/95 backdrop-blur-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-white font-bold text-xl">BIFPCL</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              link.children ? (
                <div key={link.name} className="relative group">
                  <button className="text-gray-300 hover:text-white flex items-center gap-1">
                    {link.name} <ChevronDown size={16} />
                  </button>
                  <div className="absolute top-full left-0 mt-2 bg-secondary rounded-lg shadow-xl py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {link.children.map((child) => (
                      <NavLink key={child.path} to={child.path} className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-secondary-light">
                        {child.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink key={link.path} to={link.path} className={({ isActive }) => `${isActive ? 'text-primary-light' : 'text-gray-300'} hover:text-white`}>
                  {link.name}
                </NavLink>
              )
            ))}
            <Link to="/tenders" className="btn-primary text-sm py-2">Tenders</Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-secondary-dark border-t border-gray-700">
          {navLinks.map((link) => (
            link.children ? (
              <div key={link.name}>
                <span className="block px-4 py-3 text-gray-400 text-sm">{link.name}</span>
                {link.children.map((child) => (
                  <NavLink key={child.path} to={child.path} onClick={() => setIsOpen(false)} className="block px-8 py-2 text-gray-300 hover:text-white">
                    {child.name}
                  </NavLink>
                ))}
              </div>
            ) : (
              <NavLink key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-300 hover:text-white">
                {link.name}
              </NavLink>
            )
          ))}
        </div>
      )}
    </nav>
  );
}
```

### 3.2 Footer (src/components/layout/Footer.tsx)
```tsx
import { Link } from 'react-router-dom';

const footerLinks = {
  quickLinks: [
    { name: 'Career FAQ', path: '/careers#faq' },
    { name: 'Company Culture', path: '/about' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'Investor Relations', path: '/investors' },
  ],
  legal: [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Compliance', path: '/compliance' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-secondary-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-xl mb-4">BIFPCL</h3>
            <p className="text-sm">Bangladesh-India Friendship Power Company (Pvt.) Limited. A mega-scale joint venture powering the nation's progress with sustainable energy.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-white transition-colors text-sm">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-white transition-colors text-sm">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <p className="text-sm">Email: info@bifpcl.com</p>
            <p className="text-sm">Phone: +880-2-XXXXXXX</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} BIFPCL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

### 3.3 Layout (src/components/layout/Layout.tsx)
```tsx
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

### 3.4 UI Components (src/components/ui/index.tsx)
```tsx
import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, forwardRef } from 'react';

// Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-secondary text-white hover:bg-secondary-light',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

// Card
interface CardProps {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

export function Card({ children, className = '', dark = false }: CardProps) {
  return (
    <div className={`rounded-xl overflow-hidden ${dark ? 'bg-secondary-light' : 'bg-white shadow-lg'} ${className}`}>
      {children}
    </div>
  );
}

// Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
    <input
      ref={ref}
      className={`w-full px-4 py-3 bg-secondary-light border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary ${error ? 'border-red-500' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
));

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, options, className = '', ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
    <select
      ref={ref}
      className={`w-full px-4 py-3 bg-secondary-light border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary ${className}`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
));

// Stats
interface StatProps {
  value: string;
  label: string;
  suffix?: string;
}

export function Stat({ value, label, suffix }: StatProps) {
  return (
    <div className="text-center">
      <p className="text-4xl md:text-5xl font-bold text-white">
        {value}<span className="text-primary-light text-2xl">{suffix}</span>
      </p>
      <p className="text-gray-400 mt-2">{label}</p>
    </div>
  );
}

// Section Title
interface SectionTitleProps {
  title: string;
  subtitle?: string;
  light?: boolean;
  centered?: boolean;
}

export function SectionTitle({ title, subtitle, light = false, centered = true }: SectionTitleProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <h2 className={`text-3xl md:text-4xl font-bold ${light ? 'text-gray-900' : 'text-white'}`}>{title}</h2>
      {subtitle && <p className={`mt-4 text-lg ${light ? 'text-gray-600' : 'text-gray-400'}`}>{subtitle}</p>}
    </div>
  );
}
```

---

## STEP 4: Page Components

### 4.1 Home Page (src/pages/Home.tsx)
```tsx
import { Link } from 'react-router-dom';
import { Zap, Users, Leaf, MapPin } from 'lucide-react';
import { Button, Stat, SectionTitle, Card } from '../components/ui';
import { useDirectors, useCSRInitiatives } from '../hooks/useApi';

export function HomePage() {
  const { data: directors } = useDirectors();
  const { data: csrInitiatives } = useCSRInitiatives();
  const topDirectors = directors?.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-secondary-dark via-secondary to-secondary-dark">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 py-32">
          <h1 className="text-5xl md:text-7xl font-bold text-white max-w-3xl">
            Energy for <span className="text-primary-light">Growth</span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl">
            A symbol of Indo-Bangladesh Friendship, powering the future of millions with sustainable and efficient power generation.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/projects"><Button>Explore Projects</Button></Link>
            <Link to="/tenders"><Button variant="secondary">View Active Tenders</Button></Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary py-16 border-y border-gray-700">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Stat value="1320" suffix="MW" label="Total Capacity" />
          <Stat value="Ultra-Super" label="Critical Technology" />
          <Stat value="50:50" label="India-Bangladesh Joint Venture" />
        </div>
      </section>

      {/* Pioneering Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Pioneering Energy Infrastructure" subtitle="Bangladesh-India Friendship Power Company Limited is committed to sustainable energy production through global standards." light />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {[
              { icon: Zap, title: 'Environmental Compliance', desc: 'World-class emission controls' },
              { icon: Users, title: 'Community Impact', desc: 'Local employment & development' },
              { icon: Leaf, title: 'Operational Safety', desc: 'Zero-incident commitment' },
              { icon: MapPin, title: 'Strategic Location', desc: 'Rampal, Bagerhat' },
            ].map((item) => (
              <Card key={item.title} className="p-6 text-center">
                <item.icon className="mx-auto text-primary" size={40} />
                <h3 className="mt-4 font-semibold text-lg">{item.title}</h3>
                <p className="mt-2 text-gray-600 text-sm">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="bg-secondary py-24">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Our Leadership" subtitle="Guided by leaders with vision, experience, and a dedication to excellence in sustainable power generation." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {topDirectors?.map((director) => (
              <Card key={director.id} dark className="text-center p-6">
                <img src={director.photo} alt={director.name} className="w-32 h-32 rounded-full mx-auto object-cover" />
                <h3 className="mt-4 text-white font-semibold">{director.name}</h3>
                <p className="text-primary-light text-sm">{director.title}</p>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/directors"><Button variant="outline">View Full Board of Directors</Button></Link>
          </div>
        </div>
      </section>

      {/* CSR Section */}
      <section className="bg-secondary-dark py-24">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Sustainability & CSR" subtitle="Beyond power generation, we're committed to environmental stewardship and supporting local communities." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {csrInitiatives?.slice(0, 3).map((initiative) => (
              <Card key={initiative.id} dark className="p-6">
                <div className="w-12 h-12 bg-accent-green/20 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="text-accent-green" />
                </div>
                <h3 className="text-white font-semibold">{initiative.title}</h3>
                <p className="mt-2 text-gray-400 text-sm">{initiative.description}</p>
                <p className="mt-3 text-accent-green font-semibold">{initiative.impact_metric}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

### 4.2 Projects Page (src/pages/Projects.tsx)
```tsx
import { Link } from 'react-router-dom';
import { MapPin, Zap } from 'lucide-react';
import { SectionTitle, Card, Button } from '../components/ui';
import { useProjects } from '../hooks/useApi';

export function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) return <div className="min-h-screen bg-secondary flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="bg-secondary min-h-screen pt-24">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-white">Our Projects</h1>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl">Explore our power generation facilities driving sustainable energy for Bangladesh.</p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects?.map((project) => (
              <Card key={project.id} dark className="group hover:scale-105 transition-transform">
                <div className="relative h-48 overflow-hidden">
                  <img src={project.hero_image} alt={project.name} className="w-full h-full object-cover" />
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${project.status === 'operational' ? 'bg-accent-green text-white' : 'bg-accent-orange text-white'}`}>
                    {project.status}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-white font-bold text-xl">{project.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-gray-400">
                    <MapPin size={16} />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-primary-light">
                    <Zap size={16} />
                    <span className="font-semibold">{project.capacity_mw} MW</span>
                  </div>
                  <Link to={`/projects/${project.slug}`}>
                    <Button variant="outline" size="sm" className="mt-4 w-full">View Details</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

### 4.3 App Router (src/App.tsx)
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/Home';
import { ProjectsPage } from './pages/Projects';
// Import other pages as you create them

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            {/* Add more routes as you implement pages */}
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

---

## STEP 5: Running the Project

### Backend
```bash
cd backend
.\venv\Scripts\activate
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm run dev
```

---

## Additional Pages to Implement

Using the same patterns, implement:
1. **ProjectDetail.tsx** - Single project page
2. **Directors.tsx** - Board of directors grid with modal
3. **Sustainability.tsx** - CSR page with green theme
4. **Media.tsx** - News/press releases
5. **Careers.tsx** - Job listings with application modal
6. **Contact.tsx** - Contact form with office locations
7. **Tenders.tsx** - Tender database with filters

---

## Best Practices Summary

1. ✅ TypeScript strict mode for type safety
2. ✅ React Query for server state management
3. ✅ Axios with centralized API layer
4. ✅ Tailwind CSS utility classes with custom components
5. ✅ Django REST Framework for API
6. ✅ Django Admin for content management
7. ✅ Reusable UI components (DRY principle)
8. ✅ Responsive design (mobile-first)
9. ✅ Environment variables for configuration
10. ✅ Proper folder structure

---

*Continue with other pages following the same patterns established above.*
