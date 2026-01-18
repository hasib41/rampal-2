from django.contrib import admin
from .models import (
    CompanyInfo, Project, Director, NewsArticle,
    Career, JobApplication, Tender, ContactInquiry, CSRInitiative, Notice
)


@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    list_display = ['name', 'total_capacity_mw', 'technology']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'capacity_mw', 'status', 'preview_image']
    list_filter = ['status', 'technology']
    search_fields = ['name', 'location', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['preview_image']

    def preview_image(self, obj):
        if obj.hero_image:
            from django.utils.html import mark_safe
            return mark_safe(f'<img src="{obj.hero_image.url}" style="height: 50px; border-radius: 5px;" />')
        return "No Image"
    preview_image.short_description = "Image Preview"


@admin.register(Director)
class DirectorAdmin(admin.ModelAdmin):
    list_display = ['name', 'title', 'organization', 'order', 'is_chairman']
    list_editable = ['order']
    list_filter = ['is_chairman']


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'published_date', 'is_featured']
    list_filter = ['category', 'is_featured']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'published_date'


@admin.register(Career)
class CareerAdmin(admin.ModelAdmin):
    list_display = ['title', 'department', 'location', 'deadline', 'is_active']
    list_filter = ['is_active', 'department', 'employment_type']


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'career', 'email', 'submitted_at', 'status']
    list_filter = ['status', 'career']
    readonly_fields = ['submitted_at']


@admin.register(Tender)
class TenderAdmin(admin.ModelAdmin):
    list_display = ['tender_id', 'title', 'category', 'status', 'deadline']
    list_filter = ['status', 'category']
    search_fields = ['tender_id', 'title']


@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'category', 'email', 'submitted_at', 'is_resolved']
    list_filter = ['category', 'is_resolved']
    readonly_fields = ['submitted_at']


@admin.register(CSRInitiative)
class CSRInitiativeAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'impact_metric', 'order']
    list_editable = ['order']
    list_filter = ['category']


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'published_date', 'is_active', 'order']
    list_editable = ['order', 'is_active']
    list_filter = ['category', 'is_active']
    date_hierarchy = 'published_date'

