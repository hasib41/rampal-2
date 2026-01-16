# BIFPCL Website

Official website for **Bangladesh-India Friendship Power Company Limited (BIFPCL)** - a joint venture power generation company symbolizing Indo-Bangladesh friendship.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.x-092E20?logo=django&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?logo=tailwind-css&logoColor=white)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Pages](#-pages)
- [Contributing](#-contributing)

---

## ✨ Features

### Public Portal
- 🏠 **Homepage** with animated hero slider, stats, notice board, and CSR highlights
- ⚡ **Projects** page showcasing power plant operations with detailed views
- 👥 **Board of Directors** with leadership profiles
- 📢 **Notice Board** with category filters, featured notices, and detail pages
- 💼 **Careers** portal with job listings and application system
- 📋 **Tenders** management with filtering by status and category
- 🌱 **CSR & Sustainability** initiatives showcase
- 📰 **Media Center** for news and press releases
- 📞 **Contact** page with inquiry form

### Admin Panel
- 📊 Dashboard with key metrics
- Full CRUD for all content types (Notices, Projects, Directors, News, Careers, Tenders)
- Category filtering and search
- Featured content management
- Document uploads

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI Library |
| TypeScript | 5.9 | Type Safety |
| Vite | 7.2 | Build Tool |
| Tailwind CSS | 4.1 | Styling |
| React Router | 7.12 | Client Routing |
| TanStack Query | 5.90 | Data Fetching |
| Axios | 1.13 | HTTP Client |
| Lucide React | 0.562 | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Django | 5.x | Web Framework |
| Django REST Framework | - | API |
| SQLite | 3 | Database (Dev) |
| django-cors-headers | - | CORS Handling |
| python-dotenv | - | Environment Variables |

---

## 📁 Project Structure

```
rampalProject2/
├── backend/                 # Django Backend
│   ├── api/                 # REST API app
│   │   ├── serializers.py   # DRF serializers
│   │   ├── views.py         # API viewsets
│   │   └── urls.py          # API routing
│   ├── config/              # Django settings
│   │   ├── settings.py
│   │   └── urls.py
│   ├── core/                # Core models app
│   │   ├── models.py        # Data models
│   │   └── admin.py         # Admin configuration
│   ├── media/               # Uploaded files
│   └── manage.py
│
├── frontend/                # React Frontend
│   ├── public/              # Static assets
│   │   └── *.jpg            # Hero images
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── ui/          # UI components (Button, Card, etc.)
│   │   │   ├── layout/      # Layout (Navbar, Footer)
│   │   │   └── admin/       # Admin layout
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   └── *.tsx        # Public pages
│   │   ├── hooks/           # Custom hooks
│   │   │   └── useApi.ts    # API hooks
│   │   ├── services/        # API services
│   │   │   └── api.ts
│   │   ├── types/           # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx          # Main app & routing
│   │   └── index.css        # Global styles
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **Python** 3.10+
- **pip** (Python package manager)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install django djangorestframework django-cors-headers django-filter python-dotenv

# Run migrations
python manage.py migrate

# Create superuser (for admin access)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Environment Variables

Create `.env` in `backend/`:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
```

Create `.env` in `frontend/`:

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/company/` | GET | Company information |
| `/api/projects/` | GET | List all projects |
| `/api/projects/{slug}/` | GET | Project details |
| `/api/directors/` | GET | Board of directors |
| `/api/notices/` | GET | All notices |
| `/api/notices/{slug}/` | GET | Notice details |
| `/api/notices/featured/` | GET | Featured notices |
| `/api/news/` | GET | News articles |
| `/api/news/{slug}/` | GET | News details |
| `/api/careers/` | GET | Job listings |
| `/api/careers/{id}/` | GET | Job details |
| `/api/apply/` | POST | Submit job application |
| `/api/tenders/` | GET | Tender listings |
| `/api/csr/` | GET | CSR initiatives |
| `/api/contact/` | POST | Submit inquiry |

---

## 📄 Pages

### Public Routes

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/projects` | Projects listing |
| `/projects/:slug` | Project details |
| `/directors` | Board of Directors |
| `/notices` | Notice Board |
| `/notices/:slug` | Notice details |
| `/careers` | Career opportunities |
| `/tenders` | Active tenders |
| `/sustainability` | CSR & Sustainability |
| `/media` | Media center |
| `/contact` | Contact form |

### Admin Routes

| Route | Page |
|-------|------|
| `/admin` | Dashboard |
| `/admin/notices` | Manage notices |
| `/admin/projects` | Manage projects |
| `/admin/directors` | Manage directors |
| `/admin/news` | Manage news |
| `/admin/careers` | Manage careers |
| `/admin/tenders` | Manage tenders |
| `/admin/settings` | Settings |

---

## 🎨 Design System

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#0066CC` | Buttons, links, accents |
| Primary Light | `#3399FF` | Hover states, highlights |
| Primary Dark | `#004999` | Active states |
| Secondary | `#1a1a2e` | Dark backgrounds |
| Secondary Dark | `#0f0f1a` | Darker sections |
| Accent Green | `#22c55e` | Success, CSR |
| Accent Orange | `#f97316` | Tenders, warnings |

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, 700 weight
- **Body**: Regular, 400 weight

---

## 📦 Scripts

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend

```bash
python manage.py runserver      # Start dev server
python manage.py makemigrations # Create migrations
python manage.py migrate        # Apply migrations
python manage.py createsuperuser # Create admin user
```

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint`
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

This project is proprietary software for BIFPCL.

---

## 📞 Support

For technical support or inquiries, contact the development team.

---

*Built with ❤️ for Bangladesh-India Friendship Power Company Limited*
