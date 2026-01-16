from rest_framework import serializers
from core.models import (
    CompanyInfo, Project, Director, NewsArticle,
    Career, JobApplication, Tender, ContactInquiry, CSRInitiative, Notice
)


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


class NoticeSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = Notice
        fields = ['id', 'title', 'category', 'category_display', 'published_date', 'document', 'link']

