# 🚀 Render Deployment Guide for BIFPCL Website

> **Best Practices Applied**: This configuration follows Django and Render deployment best practices including security headers, proper caching, health checks, and production-grade settings.

## Prerequisites
- GitHub account with your code pushed
- Free Render account ([render.com](https://render.com))

---

## Quick Deploy (Recommended)

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Deploy with Blueprint
1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **New** → **Blueprint**
3. Connect your GitHub repository
4. Render detects `render.yaml` and auto-creates:
   - ✅ PostgreSQL 16 database (free)
   - ✅ Django API with Gunicorn workers
   - ✅ React frontend with security headers
5. Click **Apply** and wait (~5-10 minutes)

---

## Post-Deployment Setup

### 1. Create Admin User
```bash
# Go to Render Dashboard → bifpcl-api → Shell
python manage.py createsuperuser
```

### 2. Seed Database (Optional)
```bash
python manage.py seed_data
```

### 3. Update Frontend API URL
After deployment, update the `VITE_API_URL` environment variable in your frontend service with your actual backend URL.

---

## Your URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend | `https://bifpcl-frontend.onrender.com` |
| Backend API | `https://bifpcl-api.onrender.com/api/` |
| Health Check | `https://bifpcl-api.onrender.com/api/health/` |
| Admin Panel | `https://bifpcl-api.onrender.com/admin/` |

---

## 📋 Files Created

| File | Purpose |
|------|---------|
| `render.yaml` | Blueprint for one-click deploy with all services |
| `backend/requirements.txt` | Python dependencies with PostgreSQL & Gunicorn |
| `backend/build.sh` | Build script for migrations and static files |
| `backend/runtime.txt` | Python version specification |
| `backend/config/settings.py` | Production-ready Django settings |

---

## 🔒 Security Features Enabled

- **HTTPS Only** - SSL redirect in production
- **HSTS** - HTTP Strict Transport Security (1 year)
- **Secure Cookies** - HttpOnly and Secure flags
- **CSRF Protection** - Trusted origins configured
- **Security Headers** - X-Frame-Options, X-Content-Type-Options
- **Brotli Compression** - Optimized static file serving

---

## ⚠️ Free Tier Limitations

| Limitation | Details |
|------------|---------|
| Sleep Timer | Backend sleeps after 15 min inactivity (~30 sec cold start) |
| Database | 256MB storage, 97 connections max |
| Bandwidth | 100GB/month |
| Build Time | 500 build hours/month |

---

## 🛠️ Manual Deployment (Alternative)

### 1. Create PostgreSQL Database
1. **Dashboard** → **New** → **PostgreSQL**
2. Name: `bifpcl-db`
3. Plan: **Free**
4. Region: **Singapore** (or nearest)
5. Copy the **Internal Database URL**

### 2. Deploy Backend
1. **Dashboard** → **New** → **Web Service**
2. Configure:
   | Setting | Value |
   |---------|-------|
   | Name | `bifpcl-api` |
   | Runtime | Python 3 |
   | Root Directory | `backend` |
   | Build Command | `chmod +x build.sh && ./build.sh` |
   | Start Command | `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT` |

3. Environment Variables:
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | (paste from step 1) |
   | `SECRET_KEY` | (click Generate) |
   | `DEBUG` | `False` |
   | `FRONTEND_URL` | `https://your-frontend.onrender.com` |

### 3. Deploy Frontend
1. **Dashboard** → **New** → **Static Site**
2. Configure:
   | Setting | Value |
   |---------|-------|
   | Name | `bifpcl-frontend` |
   | Root Directory | `frontend` |
   | Build Command | `npm ci && npm run build` |
   | Publish Directory | `dist` |

3. Environment Variable:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://bifpcl-api.onrender.com/api` |

4. Add Rewrite Rule:
   - Source: `/*` → Destination: `/index.html` (Rewrite)

---

## 🔧 Troubleshooting

### CORS Issues
Ensure `FRONTEND_URL` environment variable is set in your backend service.

### Static Files Not Loading
1. Check `collectstatic` ran successfully in build logs
2. Verify WhiteNoise middleware is after SecurityMiddleware

### Database Connection Issues
1. Verify `DATABASE_URL` is set correctly
2. Check database is in the same region as your service

### Slow First Request
This is normal on the free tier. The service "wakes up" after sleeping.
Consider using a service like [UptimeRobot](https://uptimerobot.com/) to ping your health check endpoint every 10 minutes.

---

## 📚 Additional Resources

- [Render Django Docs](https://render.com/docs/deploy-django)
- [Django Production Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [WhiteNoise Documentation](http://whitenoise.evans.io/)
