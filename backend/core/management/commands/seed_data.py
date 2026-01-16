"""
Django management command to seed the database with sample data.
Run with: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from django.core.files import File
from core.models import (
    CompanyInfo, Project, Director, NewsArticle,
    Career, Tender, CSRInitiative, Notice
)
from datetime import date, timedelta
import os
from django.conf import settings


class Command(BaseCommand):
    help = 'Seeds the database with sample data for BIFPCL website'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')
        
        self.create_company_info()
        self.create_projects()
        self.create_directors()
        self.create_news()
        self.create_careers()
        self.create_tenders()
        self.create_csr_initiatives()
        self.create_notices()
        
        self.stdout.write(self.style.SUCCESS('✅ Database seeded successfully!'))

    def get_image_path(self, folder, filename):
        return os.path.join(settings.MEDIA_ROOT, folder, filename)

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
                'description': 'The Maitree Super Thermal Power Project is a 1320 MW coal-fired power station located in Rampal, Bagerhat District. It comprises two units of 660 MW each, using ultra-supercritical technology for maximum efficiency and minimal environmental impact. This mega-scale project symbolizes the strong friendship between Bangladesh and India.',
                'latitude': 22.5568,
                'longitude': 89.6205,
                'efficiency_percent': 42.5,
                'image': 'projects/maitree.png',
            },
            {
                'name': 'Unit 1 - Thermal Power Generation',
                'slug': 'unit-1-tpg',
                'location': 'Rampal, Bagerhat, Bangladesh',
                'capacity_mw': 660,
                'technology': 'Ultra-Supercritical Boiler',
                'status': 'operational',
                'description': 'Unit 1 of the Maitree Super Thermal Power Project with a capacity of 660 MW. Features advanced emission control systems including Flue Gas Desulfurization (FGD) and Electrostatic Precipitators (ESP) to ensure environmental compliance.',
                'latitude': 22.5570,
                'longitude': 89.6200,
                'efficiency_percent': 42.8,
                'image': 'projects/hero.png',
            },
            {
                'name': 'Unit 2 - Thermal Power Generation',
                'slug': 'unit-2-tpg',
                'location': 'Rampal, Bagerhat, Bangladesh',
                'capacity_mw': 660,
                'technology': 'Ultra-Supercritical Boiler',
                'status': 'operational',
                'description': 'Unit 2 of the Maitree Super Thermal Power Project with identical specifications to Unit 1. Together with Unit 1, it provides reliable baseload power to the national grid of Bangladesh.',
                'latitude': 22.5565,
                'longitude': 89.6210,
                'efficiency_percent': 42.6,
                'image': None,
            },
        ]

        for data in projects_data:
            image_file = data.pop('image')
            project, created = Project.objects.update_or_create(
                slug=data['slug'],
                defaults=data
            )
            if image_file and created:
                image_path = self.get_image_path('', image_file)
                if os.path.exists(image_path):
                    with open(image_path, 'rb') as f:
                        project.hero_image.save(os.path.basename(image_file), File(f), save=True)
        
        self.stdout.write('  ✓ Projects created')

    def create_directors(self):
        directors_data = [
            {
                'name': 'Dr. Mohammad Rahman',
                'title': 'Chairman',
                'organization': 'Bangladesh Power Development Board',
                'bio': 'Dr. Mohammad Rahman brings over 30 years of experience in the power sector. As Chairman of BPDB, he has been instrumental in expanding Bangladesh\'s power generation capacity and promoting sustainable energy solutions.',
                'order': 1,
                'is_chairman': True,
                'image': 'directors/chairman.png',
            },
            {
                'name': 'Ms. Priya Sharma',
                'title': 'Managing Director',
                'organization': 'BIFPCL',
                'bio': 'Ms. Priya Sharma is a seasoned professional with extensive experience in managing large-scale power projects. She leads the day-to-day operations of BIFPCL and ensures the project meets its operational and environmental targets.',
                'order': 2,
                'is_chairman': False,
                'image': 'directors/ceo.png',
            },
            {
                'name': 'Mr. Kamal Ahmed',
                'title': 'Director (Technical)',
                'organization': 'NTPC Limited',
                'bio': 'Mr. Kamal Ahmed oversees all technical aspects of the power plant operations. With a background in mechanical engineering and 25 years in thermal power generation, he ensures optimal plant performance.',
                'order': 3,
                'is_chairman': False,
                'image': 'directors/director1.png',
            },
            {
                'name': 'Mr. Rajesh Kumar',
                'title': 'Director (Finance)',
                'organization': 'NTPC Limited',
                'bio': 'Mr. Rajesh Kumar manages the financial operations of BIFPCL. His expertise in project finance and corporate governance has been crucial to the project\'s financial success.',
                'order': 4,
                'is_chairman': False,
                'image': None,
            },
            {
                'name': 'Ms. Fatima Begum',
                'title': 'Director (HR & Administration)',
                'organization': 'BPDB',
                'bio': 'Ms. Fatima Begum leads human resources and administrative functions. She has implemented comprehensive training programs and workplace policies that have made BIFPCL an employer of choice.',
                'order': 5,
                'is_chairman': False,
                'image': None,
            },
        ]

        for data in directors_data:
            image_file = data.pop('image')
            director, created = Director.objects.update_or_create(
                name=data['name'],
                defaults=data
            )
            if image_file and created:
                image_path = self.get_image_path('', image_file)
                if os.path.exists(image_path):
                    with open(image_path, 'rb') as f:
                        director.photo.save(os.path.basename(image_file), File(f), save=True)
        
        self.stdout.write('  ✓ Directors created')

    def create_news(self):
        today = date.today()
        news_data = [
            {
                'title': 'BIFPCL Achieves Record Power Generation in Q4 2025',
                'slug': 'record-power-generation-q4-2025',
                'category': 'press',
                'excerpt': 'The Maitree Super Thermal Power Project has achieved a record power generation of 2.8 billion units in Q4 2025, marking a new milestone in Bangladesh-India energy cooperation.',
                'content': '''The Bangladesh-India Friendship Power Company Limited (BIFPCL) has announced record power generation figures for the fourth quarter of 2025. The Maitree Super Thermal Power Project generated 2.8 billion units of electricity, contributing significantly to Bangladesh's national grid.

This achievement demonstrates the plant's operational excellence and the success of the joint venture between Bangladesh Power Development Board (BPDB) and NTPC Limited of India.

Key highlights:
- Plant Load Factor (PLF) exceeded 85%
- Zero unplanned outages during the quarter
- All environmental parameters within prescribed limits
- Contributed to 8% of Bangladesh's total power generation

The Managing Director, Ms. Priya Sharma, stated: "This achievement reflects the dedication of our team and the strong partnership between Bangladesh and India. We remain committed to providing reliable and clean power to the nation."''',
                'published_date': today - timedelta(days=5),
                'is_featured': True,
                'image': 'news/inauguration.png',
            },
            {
                'title': 'BIFPCL Launches Scholarship Program for Local Students',
                'slug': 'scholarship-program-2025',
                'category': 'event',
                'excerpt': 'As part of its CSR initiatives, BIFPCL has launched a comprehensive scholarship program benefiting 500 students from Rampal and surrounding areas.',
                'content': '''BIFPCL has announced the launch of its flagship scholarship program aimed at supporting higher education for students from Rampal and neighboring communities.

The program will provide:
- Full tuition fee coverage for engineering and medical students
- Monthly stipends for living expenses
- Internship opportunities at BIFPCL
- Career guidance and mentorship

This initiative is part of BIFPCL's commitment to community development and creating long-term value for the local population.''',
                'published_date': today - timedelta(days=12),
                'is_featured': False,
                'image': None,
            },
            {
                'title': 'Environmental Monitoring Report Shows Excellent Compliance',
                'slug': 'environmental-compliance-report-2025',
                'category': 'update',
                'excerpt': 'The latest environmental monitoring report confirms that BIFPCL\'s emissions are 28% below the prescribed limits, demonstrating world-class environmental stewardship.',
                'content': '''The quarterly environmental monitoring report for BIFPCL has shown outstanding compliance with all environmental regulations.

Key findings:
- SO2 emissions: 28% below limit
- Particulate matter: 35% below limit
- NOx emissions: 22% below limit
- Water discharge quality: Exceeds standards

The plant's advanced Flue Gas Desulfurization (FGD) system and Electrostatic Precipitators (ESP) continue to perform above specifications.''',
                'published_date': today - timedelta(days=20),
                'is_featured': False,
                'image': None,
            },
        ]

        for data in news_data:
            image_file = data.pop('image')
            article, created = NewsArticle.objects.update_or_create(
                slug=data['slug'],
                defaults=data
            )
            if image_file and created:
                image_path = self.get_image_path('', image_file)
                if os.path.exists(image_path):
                    with open(image_path, 'rb') as f:
                        article.image.save(os.path.basename(image_file), File(f), save=True)
        
        self.stdout.write('  ✓ News articles created')

    def create_careers(self):
        today = date.today()
        careers_data = [
            {
                'title': 'Senior Mechanical Engineer',
                'department': 'Operations & Maintenance',
                'location': 'Rampal, Bagerhat',
                'employment_type': 'full_time',
                'description': 'We are seeking an experienced Senior Mechanical Engineer to join our Operations & Maintenance team. The role involves overseeing the maintenance of boilers, turbines, and auxiliary equipment.',
                'requirements': '''- B.Sc. in Mechanical Engineering from a recognized university
- Minimum 8 years of experience in thermal power plants
- Strong knowledge of ultra-supercritical technology
- Excellent problem-solving skills
- Ability to work in a multicultural environment
- Fluency in English and Bengali''',
                'salary_range': 'BDT 150,000 - 200,000',
                'deadline': today + timedelta(days=30),
                'is_active': True,
            },
            {
                'title': 'Environmental Engineer',
                'department': 'Environment, Health & Safety',
                'location': 'Rampal, Bagerhat',
                'employment_type': 'full_time',
                'description': 'Join our EHS team to ensure environmental compliance and implement sustainability initiatives at the plant.',
                'requirements': '''- B.Sc./M.Sc. in Environmental Engineering or related field
- 5+ years of experience in environmental management
- Knowledge of Bangladesh environmental regulations
- Experience with emission monitoring systems
- Strong analytical and reporting skills''',
                'salary_range': 'BDT 100,000 - 140,000',
                'deadline': today + timedelta(days=45),
                'is_active': True,
            },
            {
                'title': 'IT Systems Administrator',
                'department': 'Information Technology',
                'location': 'Dhaka / Rampal',
                'employment_type': 'full_time',
                'description': 'Manage and maintain IT infrastructure including servers, networks, and enterprise applications.',
                'requirements': '''- Bachelor's in Computer Science or IT
- 4+ years of experience in system administration
- Expertise in Windows Server, Linux, and networking
- Experience with industrial control systems (preferred)
- MCSE or equivalent certification''',
                'salary_range': 'BDT 80,000 - 120,000',
                'deadline': today + timedelta(days=20),
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
                'description': 'Procurement of spare parts for coal handling system including conveyor belts, rollers, and bearings. Detailed specifications available in tender documents.',
                'status': 'open',
                'publication_date': today - timedelta(days=5),
                'deadline': today + timedelta(days=25),
                'value_range': 'BDT 50-75 Lakhs',
            },
            {
                'tender_id': 'BIFPCL/PROC/2025/002',
                'title': 'Annual Maintenance Contract for HVAC Systems',
                'category': 'electrical',
                'description': 'Two-year maintenance contract for HVAC systems in office buildings and control rooms. Includes preventive and breakdown maintenance.',
                'status': 'evaluation',
                'publication_date': today - timedelta(days=30),
                'deadline': today - timedelta(days=5),
                'value_range': 'BDT 25-40 Lakhs',
            },
            {
                'tender_id': 'BIFPCL/PROC/2025/003',
                'title': 'Road Repair and Maintenance Works',
                'category': 'civil',
                'description': 'Repair and maintenance of internal roads within the power plant premises. Approximately 5 km of asphalt road resurfacing.',
                'status': 'open',
                'publication_date': today - timedelta(days=3),
                'deadline': today + timedelta(days=35),
                'value_range': 'BDT 1-1.5 Crores',
            },
            {
                'tender_id': 'BIFPCL/PROC/2025/004',
                'title': 'ERP System Upgrade and Support Services',
                'category': 'it',
                'description': 'Upgrade of existing SAP ERP system and three-year support contract. Includes data migration and user training.',
                'status': 'open',
                'publication_date': today - timedelta(days=2),
                'deadline': today + timedelta(days=40),
                'value_range': 'BDT 2-3 Crores',
            },
            {
                'tender_id': 'BIFPCL/PROC/2024/089',
                'title': 'Supply of Transformer Oil',
                'category': 'electrical',
                'description': 'Supply of 50,000 liters of high-grade transformer oil meeting IEC 60296 specifications.',
                'status': 'awarded',
                'publication_date': today - timedelta(days=60),
                'deadline': today - timedelta(days=30),
                'value_range': 'BDT 35 Lakhs',
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
                'description': 'Comprehensive education support program including school infrastructure development, teacher training, and digital learning tools for schools in Rampal and surrounding villages.',
                'impact_metric': '15,000+ students benefited',
                'order': 1,
                'image': 'csr/education.png',
            },
            {
                'title': 'Sundarbans Mangrove Conservation',
                'category': 'environment',
                'description': 'Partnerships with environmental organizations for mangrove plantation and conservation in the Sundarbans region. Over 540,000 mangrove saplings planted to date.',
                'impact_metric': '540,000 trees planted',
                'order': 2,
                'image': 'csr/mangrove.png',
            },
            {
                'title': 'Community Health Outreach',
                'category': 'health',
                'description': 'Regular health camps, mobile medical units, and vaccination drives for local communities. Partnerships with leading hospitals for specialized treatments.',
                'impact_metric': '50,000+ medical consultations',
                'order': 3,
                'image': 'csr/health.png',
            },
            {
                'title': 'Skill Development & Livelihood',
                'category': 'community',
                'description': 'Vocational training programs in electrical work, plumbing, tailoring, and computer skills for local youth. Microfinance support for small businesses.',
                'impact_metric': '3,500 trained, 800 employed',
                'order': 4,
                'image': None,
            },
        ]

        for data in csr_data:
            image_file = data.pop('image')
            initiative, created = CSRInitiative.objects.update_or_create(
                title=data['title'],
                defaults=data
            )
            if image_file and created:
                image_path = self.get_image_path('', image_file)
                if os.path.exists(image_path):
                    with open(image_path, 'rb') as f:
                        initiative.image.save(os.path.basename(image_file), File(f), save=True)
        
        self.stdout.write('  ✓ CSR initiatives created')

    def create_notices(self):
        today = date.today()
        notices_data = [
            {
                'title': 'Board of Directors Meeting - Q1 2026 Schedule Announced',
                'category': 'general',
                'published_date': today - timedelta(days=3),
                'is_active': True,
                'order': 1,
            },
            {
                'title': 'Environmental Compliance Report 2025 - Now Available for Download',
                'category': 'general',
                'published_date': today - timedelta(days=7),
                'is_active': True,
                'order': 2,
            },
            {
                'title': 'Annual Power Generation Report Released - Record Output Achieved',
                'category': 'general',
                'published_date': today - timedelta(days=14),
                'is_active': True,
                'order': 3,
            },
            {
                'title': 'Recruitment Drive 2026 - Multiple Positions Available',
                'category': 'recruitment',
                'published_date': today - timedelta(days=2),
                'is_active': True,
                'order': 4,
            },
            {
                'title': 'Tender Notice: Coal Supply Contract - Deadline Extended',
                'category': 'tender',
                'published_date': today - timedelta(days=5),
                'is_active': True,
                'order': 5,
            },
        ]

        for data in notices_data:
            Notice.objects.update_or_create(
                title=data['title'],
                defaults=data
            )
        
        self.stdout.write('  ✓ Notices created')
