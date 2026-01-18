"""
Django management command to seed the database with sample data.
Run with: python manage.py seed_data
Use --with-images to upload images (local files or download from URLs)
"""
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.core.files import File
from django.conf import settings
from core.models import (
    CompanyInfo, Project, Director, NewsArticle,
    Career, Tender, CSRInitiative, Notice
)
from datetime import date, timedelta
import requests
import os


# Local file paths (relative to MEDIA_ROOT)
LOCAL_IMAGES = {
    'projects/maitree': 'projects/maitree.png',
    'projects/hero': 'projects/hero.png',
    'directors/chairman': 'directors/chairman.png',
    'directors/ceo': 'directors/ceo.png',
    'directors/director1': 'directors/director1.png',
    'news/inauguration': 'news/inauguration.png',
    'news/scholarship': 'news/scholarship.png',
    'news/environment': 'news/environment.png',
    'news/event': 'news/event.png',
    'csr/education': 'csr/education.png',
    'csr/mangrove': 'csr/mangrove.png',
    'csr/health': 'csr/health.png',
}

# Fallback URLs from Unsplash (free to use)
IMAGE_URLS = {
    'projects/maitree': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80',
    'projects/hero': 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&q=80',
    'projects/unit2': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    'directors/chairman': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    'directors/ceo': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    'directors/director1': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    'news/inauguration': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    'news/scholarship': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    'news/environment': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    'news/event': 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80',
    'csr/education': 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&q=80',
    'csr/mangrove': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
    'csr/health': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80',
}


class Command(BaseCommand):
    help = 'Seeds the database with sample data for BIFPCL website'

    def add_arguments(self, parser):
        parser.add_argument(
            '--with-images',
            action='store_true',
            help='Download and upload images from URLs',
        )

    def handle(self, *args, **options):
        self.with_images = options['with_images']
        self.stdout.write('Seeding database...')
        if self.with_images:
            self.stdout.write('  📷 Image upload enabled')

        self.create_company_info()
        self.create_projects()
        self.create_directors()
        self.create_news()
        self.create_careers()
        self.create_tenders()
        self.create_csr_initiatives()
        self.create_notices()

        self.stdout.write(self.style.SUCCESS('✅ Database seeded successfully!'))

    def get_image(self, image_key, filename):
        """Get image from local file or download from URL."""
        if not self.with_images:
            return None

        # Try local file first
        local_path = LOCAL_IMAGES.get(image_key)
        if local_path:
            full_path = os.path.join(settings.MEDIA_ROOT, local_path)
            if os.path.exists(full_path):
                self.stdout.write(f'    Using local: {local_path}')
                with open(full_path, 'rb') as f:
                    content = f.read()
                return ContentFile(content, name=filename)

        # Fall back to URL download
        url = IMAGE_URLS.get(image_key)
        if url:
            try:
                self.stdout.write(f'    Downloading {filename}...')
                response = requests.get(url, timeout=30)
                response.raise_for_status()
                return ContentFile(response.content, name=filename)
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'    Failed to download: {e}'))

        return None

    def create_company_info(self):
        CompanyInfo.objects.update_or_create(
            pk=1,
            defaults={
                'name': 'Bangladesh-India Friendship Power Company (Pvt.) Limited',
                'tagline': 'Energy for Growth - A Symbol of Indo-Bangladesh Friendship',
                'description': 'BIFPCL is a 50:50 joint venture between Bangladesh Power Development Board (BPDB) and NTPC Limited of India. The company operates the Maitree Super Thermal Power Project in Rampal, Bagerhat, with a total capacity of 1320 MW using ultra-supercritical technology.',
                'total_capacity_mw': 1320,
                'technology': 'Ultra-Supercritical',
                'partnership_ratio': '50:50 (BPDB & NTPC)',
            }
        )
        self.stdout.write('  ✓ Company info created')

    def create_projects(self):
        projects_data = [
            {
                'name': 'Maitree Super Thermal Power Project',
                'slug': 'maitree-stpp',
                'location': 'Rampal, Bagerhat, Bangladesh',
                'capacity_mw': 1320,
                'technology': 'Ultra-Supercritical',
                'status': 'operational',
                'description': 'The Maitree Super Thermal Power Project is a 1320 MW coal-fired power station located in Rampal, Bagerhat District. It comprises two units of 660 MW each, using ultra-supercritical technology for maximum efficiency and minimal environmental impact.',
                'latitude': 22.5568,
                'longitude': 89.6205,
                'efficiency_percent': 42.5,
                'image_key': 'projects/maitree',
            },
            {
                'name': 'Unit 1 - Thermal Power Generation',
                'slug': 'unit-1-tpg',
                'location': 'Rampal, Bagerhat, Bangladesh',
                'capacity_mw': 660,
                'technology': 'Ultra-Supercritical Boiler',
                'status': 'operational',
                'description': 'Unit 1 of the Maitree Super Thermal Power Project with a capacity of 660 MW. Features advanced emission control systems including FGD and ESP.',
                'latitude': 22.5570,
                'longitude': 89.6200,
                'efficiency_percent': 42.8,
                'image_key': 'projects/hero',
            },
            {
                'name': 'Unit 2 - Thermal Power Generation',
                'slug': 'unit-2-tpg',
                'location': 'Rampal, Bagerhat, Bangladesh',
                'capacity_mw': 660,
                'technology': 'Ultra-Supercritical Boiler',
                'status': 'operational',
                'description': 'Unit 2 of the Maitree Super Thermal Power Project with identical specifications to Unit 1.',
                'latitude': 22.5565,
                'longitude': 89.6210,
                'efficiency_percent': 42.6,
                'image_key': 'projects/unit2',
            },
        ]

        for data in projects_data:
            image_key = data.pop('image_key', None)
            project, created = Project.objects.update_or_create(
                slug=data['slug'],
                defaults=data
            )
            if image_key and (created or not project.hero_image):
                image_file = self.get_image(image_key, f'{data["slug"]}.jpg')
                if image_file:
                    project.hero_image.save(image_file.name, image_file, save=True)

        self.stdout.write('  ✓ Projects created')

    def create_directors(self):
        directors_data = [
            {
                'name': 'Dr. Mohammad Rahman',
                'title': 'Chairman',
                'organization': 'Bangladesh Power Development Board',
                'bio': 'Dr. Mohammad Rahman brings over 30 years of experience in the power sector.',
                'order': 1,
                'is_chairman': True,
                'image_key': 'directors/chairman',
            },
            {
                'name': 'Ms. Priya Sharma',
                'title': 'Managing Director',
                'organization': 'BIFPCL',
                'bio': 'Ms. Priya Sharma is a seasoned professional with extensive experience in managing large-scale power projects.',
                'order': 2,
                'is_chairman': False,
                'image_key': 'directors/ceo',
            },
            {
                'name': 'Mr. Kamal Ahmed',
                'title': 'Director (Technical)',
                'organization': 'NTPC Limited',
                'bio': 'Mr. Kamal Ahmed oversees all technical aspects of the power plant operations.',
                'order': 3,
                'is_chairman': False,
                'image_key': 'directors/director1',
            },
        ]

        for data in directors_data:
            image_key = data.pop('image_key', None)
            director, created = Director.objects.update_or_create(
                name=data['name'],
                defaults=data
            )
            if image_key and (created or not director.photo):
                image_file = self.get_image(image_key, f'director-{director.order}.jpg')
                if image_file:
                    director.photo.save(image_file.name, image_file, save=True)

        self.stdout.write('  ✓ Directors created')

    def create_news(self):
        today = date.today()
        news_data = [
            {
                'title': 'BIFPCL Achieves Record Power Generation in Q4 2025',
                'slug': 'record-power-generation-q4-2025',
                'category': 'press',
                'excerpt': 'The Maitree Super Thermal Power Project has achieved a record power generation of 2.8 billion units in Q4 2025.',
                'content': '''The Bangladesh-India Friendship Power Company Limited (BIFPCL) has announced record power generation figures for the fourth quarter of 2025.

Key highlights:
- Plant Load Factor (PLF) exceeded 85%
- Zero unplanned outages during the quarter
- All environmental parameters within prescribed limits
- Contributed to 8% of Bangladesh's total power generation''',
                'published_date': today - timedelta(days=5),
                'is_featured': True,
                'image_key': 'news/inauguration',
            },
            {
                'title': 'BIFPCL Launches Scholarship Program for Local Students',
                'slug': 'scholarship-program-2025',
                'category': 'event',
                'excerpt': 'BIFPCL has launched a comprehensive scholarship program benefiting 500 students from Rampal.',
                'content': '''BIFPCL has announced the launch of its flagship scholarship program.

The program will provide:
- Full tuition fee coverage for engineering and medical students
- Monthly stipends for living expenses
- Internship opportunities at BIFPCL''',
                'published_date': today - timedelta(days=12),
                'is_featured': False,
                'image_key': 'news/scholarship',
            },
            {
                'title': 'Environmental Monitoring Report Shows Excellent Compliance',
                'slug': 'environmental-compliance-report-2025',
                'category': 'update',
                'excerpt': 'BIFPCL\'s emissions are 28% below the prescribed limits.',
                'content': '''The quarterly environmental monitoring report for BIFPCL has shown outstanding compliance.

Key findings:
- SO2 emissions: 28% below limit
- Particulate matter: 35% below limit
- NOx emissions: 22% below limit''',
                'published_date': today - timedelta(days=20),
                'is_featured': False,
                'image_key': 'news/environment',
            },
            {
                'title': 'BIFPCL Hosts India-Bangladesh Energy Summit 2025',
                'slug': 'india-bangladesh-energy-summit-2025',
                'category': 'in_the_news',
                'excerpt': 'Senior officials from both nations gathered at the Maitree Power Project.',
                'content': '''BIFPCL successfully hosted the India-Bangladesh Energy Summit 2025.

The summit discussed:
- Future joint venture opportunities in renewable energy
- Grid connectivity enhancement
- Technology transfer and capacity building''',
                'published_date': today - timedelta(days=8),
                'is_featured': False,
                'image_key': 'news/event',
            },
        ]

        for data in news_data:
            image_key = data.pop('image_key', None)
            article, created = NewsArticle.objects.update_or_create(
                slug=data['slug'],
                defaults=data
            )
            if image_key and (created or not article.image):
                image_file = self.get_image(image_key, f'{data["slug"]}.jpg')
                if image_file:
                    article.image.save(image_file.name, image_file, save=True)

        self.stdout.write('  ✓ News articles created')

    def create_careers(self):
        today = date.today()
        careers_data = [
            {
                'title': 'Senior Mechanical Engineer',
                'department': 'Operations & Maintenance',
                'location': 'Rampal, Bagerhat',
                'employment_type': 'full_time',
                'description': 'We are seeking an experienced Senior Mechanical Engineer.',
                'requirements': '- B.Sc. in Mechanical Engineering\n- 8+ years experience\n- Knowledge of ultra-supercritical technology',
                'salary_range': 'BDT 150,000 - 200,000',
                'deadline': today + timedelta(days=30),
                'is_active': True,
            },
            {
                'title': 'Environmental Engineer',
                'department': 'Environment, Health & Safety',
                'location': 'Rampal, Bagerhat',
                'employment_type': 'full_time',
                'description': 'Join our EHS team to ensure environmental compliance.',
                'requirements': '- B.Sc./M.Sc. in Environmental Engineering\n- 5+ years experience',
                'salary_range': 'BDT 100,000 - 140,000',
                'deadline': today + timedelta(days=45),
                'is_active': True,
            },
        ]

        for data in careers_data:
            Career.objects.update_or_create(
                title=data['title'],
                department=data['department'],
                defaults=data
            )

        self.stdout.write('  ✓ Careers created')

    def create_tenders(self):
        today = date.today()
        tenders_data = [
            {
                'tender_id': 'BIFPCL/PROC/2025/001',
                'title': 'Supply of Coal Handling System Spare Parts',
                'category': 'mechanical',
                'description': 'Procurement of spare parts for coal handling system.',
                'status': 'open',
                'publication_date': today - timedelta(days=5),
                'deadline': today + timedelta(days=25),
                'value_range': 'BDT 50-75 Lakhs',
            },
            {
                'tender_id': 'BIFPCL/PROC/2025/002',
                'title': 'Annual Maintenance Contract for HVAC Systems',
                'category': 'electrical',
                'description': 'Two-year maintenance contract for HVAC systems.',
                'status': 'evaluation',
                'publication_date': today - timedelta(days=30),
                'deadline': today - timedelta(days=5),
                'value_range': 'BDT 25-40 Lakhs',
            },
            {
                'tender_id': 'BIFPCL/PROC/2025/003',
                'title': 'Road Repair and Maintenance Works',
                'category': 'civil',
                'description': 'Repair and maintenance of internal roads.',
                'status': 'open',
                'publication_date': today - timedelta(days=3),
                'deadline': today + timedelta(days=35),
                'value_range': 'BDT 1-1.5 Crores',
            },
        ]

        for data in tenders_data:
            Tender.objects.update_or_create(
                tender_id=data['tender_id'],
                defaults=data
            )

        self.stdout.write('  ✓ Tenders created')

    def create_csr_initiatives(self):
        csr_data = [
            {
                'title': 'Education for All Initiative',
                'category': 'education',
                'description': 'Comprehensive education support program including school infrastructure development.',
                'impact_metric': '15,000+ students benefited',
                'order': 1,
                'image_key': 'csr/education',
            },
            {
                'title': 'Sundarbans Mangrove Conservation',
                'category': 'environment',
                'description': 'Partnerships with environmental organizations for mangrove plantation.',
                'impact_metric': '540,000 trees planted',
                'order': 2,
                'image_key': 'csr/mangrove',
            },
            {
                'title': 'Community Health Outreach',
                'category': 'health',
                'description': 'Regular health camps, mobile medical units, and vaccination drives.',
                'impact_metric': '50,000+ medical consultations',
                'order': 3,
                'image_key': 'csr/health',
            },
        ]

        for data in csr_data:
            image_key = data.pop('image_key', None)
            initiative, created = CSRInitiative.objects.update_or_create(
                title=data['title'],
                defaults=data
            )
            if image_key and (created or not initiative.image):
                image_file = self.get_image(image_key, f'csr-{initiative.order}.jpg')
                if image_file:
                    initiative.image.save(image_file.name, image_file, save=True)

        self.stdout.write('  ✓ CSR initiatives created')

    def create_notices(self):
        today = date.today()
        notices_data = [
            {
                'title': 'Board of Directors Meeting - Q1 2026 Schedule',
                'slug': 'board-meeting-q1-2026',
                'category': 'general',
                'excerpt': 'The Board has announced the schedule for Q1 2026 meetings.',
                'content': 'Meeting dates: Jan 28, Feb 25, Mar 28, 2026.',
                'published_date': today - timedelta(days=3),
                'is_active': True,
                'is_featured': True,
            },
            {
                'title': 'URGENT: Plant Shutdown Scheduled for Maintenance',
                'slug': 'plant-shutdown-maintenance-2026',
                'category': 'urgent',
                'excerpt': 'Unit-1 will undergo scheduled maintenance Feb 15-28, 2026.',
                'content': 'Unit-1 (660 MW) maintenance. Unit-2 continues normal operations.',
                'published_date': today - timedelta(days=1),
                'is_active': True,
                'is_featured': True,
            },
            {
                'title': 'Recruitment Drive 2026 - Multiple Positions',
                'slug': 'recruitment-drive-2026',
                'category': 'recruitment',
                'excerpt': 'BIFPCL is hiring! Multiple engineering positions available.',
                'content': 'Visit Careers section. Deadline: February 28, 2026.',
                'published_date': today - timedelta(days=2),
                'is_active': True,
                'is_featured': False,
            },
        ]

        for data in notices_data:
            Notice.objects.update_or_create(
                slug=data['slug'],
                defaults=data
            )

        self.stdout.write('  ✓ Notices created')
