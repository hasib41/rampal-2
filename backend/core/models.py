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

    def __str__(self):
        return self.name


class Project(models.Model):
    """Power plant projects"""
    STATUS_CHOICES = [
        ('operational', 'Operational'),
        ('construction', 'Under Construction'),
        ('planning', 'Planning'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    location = models.CharField(max_length=200)
    capacity_mw = models.IntegerField()
    technology = models.CharField(max_length=100)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='operational')
    description = models.TextField()
    hero_image = models.ImageField(upload_to='projects/', blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    efficiency_percent = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Director(models.Model):
    """Board of Directors"""
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    organization = models.CharField(max_length=200)
    photo = models.ImageField(upload_to='directors/', blank=True)
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
    image = models.ImageField(upload_to='news/', blank=True)
    published_date = models.DateField()
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-published_date']
        verbose_name_plural = "News Articles"

    def __str__(self):
        return self.title


class Career(models.Model):
    """Job listings"""
    EMPLOYMENT_TYPE_CHOICES = [
        ('full_time', 'Full Time'),
        ('contract', 'Contract'),
    ]

    title = models.CharField(max_length=200)
    department = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    employment_type = models.CharField(max_length=50, choices=EMPLOYMENT_TYPE_CHOICES, default='full_time')
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
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
    ]

    career = models.ForeignKey(Career, on_delete=models.CASCADE, related_name='applications')
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    linkedin_url = models.URLField(blank=True)
    resume = models.FileField(upload_to='resumes/')
    cover_letter = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

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

    class Meta:
        verbose_name_plural = "Contact Inquiries"

    def __str__(self):
        return f"{self.full_name} - {self.category}"


class CSRInitiative(models.Model):
    """CSR and sustainability projects"""
    CATEGORY_CHOICES = [
        ('education', 'Education for All'),
        ('health', 'Health Outreach'),
        ('environment', 'Mangrove Conservation'),
        ('community', 'Community Development'),
    ]

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    impact_metric = models.CharField(max_length=100)
    image = models.ImageField(upload_to='csr/', blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "CSR Initiative"
        verbose_name_plural = "CSR Initiatives"

    def __str__(self):
        return self.title


class Notice(models.Model):
    """Notice Board"""
    CATEGORY_CHOICES = [
        ('general', 'General'),
        ('urgent', 'Urgent'),
        ('tender', 'Tender'),
        ('recruitment', 'Recruitment'),
    ]

    title = models.CharField(max_length=500)
    slug = models.SlugField(unique=True, max_length=500, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    excerpt = models.TextField(max_length=300, blank=True, help_text="Short summary for list view")
    content = models.TextField(blank=True, help_text="Full notice content")
    published_date = models.DateField()
    document = models.FileField(upload_to='notices/', blank=True)
    attachment_name = models.CharField(max_length=200, blank=True, help_text="Display name for attachment")
    link = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False, help_text="Show in featured section")
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', '-published_date', 'order']
        verbose_name = "Notice"
        verbose_name_plural = "Notices"

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            base_slug = slugify(self.title)[:450]
            slug = base_slug
            counter = 1
            while Notice.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class SiteSettings(models.Model):
    """Singleton model for site-wide settings like certificate, logo, etc."""
    certificate_image = models.ImageField(upload_to='settings/', blank=True, null=True)
    certificate_title = models.CharField(max_length=200, default="BIFPCL ISO CERTIFICATE")
    show_certificate_modal = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return "Site Settings"

    def save(self, *args, **kwargs):
        # Ensure only one instance exists (singleton pattern)
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class GalleryImage(models.Model):
    """Media Gallery for photos and videos"""
    CATEGORY_CHOICES = [
        ('project', 'Project Photos'),
        ('construction', 'Construction Updates'),
        ('event', 'Events'),
        ('facility', 'Facility'),
    ]
    MEDIA_TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Video'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=250, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='project')
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES, default='image')
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='gallery/')
    video_url = models.URLField(blank=True, help_text="YouTube or external video URL")
    order = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_featured', 'order', '-created_at']
        verbose_name = "Gallery Image"
        verbose_name_plural = "Gallery Images"

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            base_slug = slugify(self.title)[:200]
            slug = base_slug
            counter = 1
            while GalleryImage.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
