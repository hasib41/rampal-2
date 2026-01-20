from rest_framework import serializers
from django.utils.text import slugify
from core.models import (
    CompanyInfo, Project, Director, NewsArticle,
    Career, JobApplication, Tender, ContactInquiry, CSRInitiative, Notice,
    GalleryImage
)


def generate_unique_slug(model_class, name, instance=None):
    """Generate a unique slug for a model instance."""
    base_slug = slugify(name)[:200]
    slug = base_slug
    counter = 1
    queryset = model_class.objects.all()
    if instance:
        queryset = queryset.exclude(pk=instance.pk)
    while queryset.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug


class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = '__all__'


class ProjectListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class ProjectDetailSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = Project
        fields = '__all__'

    def create(self, validated_data):
        if not validated_data.get('slug'):
            validated_data['slug'] = generate_unique_slug(Project, validated_data['name'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Remove empty slug to keep existing one
        if 'slug' in validated_data and not validated_data['slug']:
            del validated_data['slug']
        return super().update(instance, validated_data)


class DirectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Director
        fields = '__all__'


class NewsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = '__all__'


class NewsDetailSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = NewsArticle
        fields = '__all__'

    def create(self, validated_data):
        if not validated_data.get('slug'):
            validated_data['slug'] = generate_unique_slug(NewsArticle, validated_data['title'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'slug' in validated_data and not validated_data['slug']:
            del validated_data['slug']
        return super().update(instance, validated_data)


class CareerListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Career
        fields = '__all__'


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


class NoticeListSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = Notice
        fields = ['id', 'title', 'slug', 'category', 'category_display', 'excerpt', 
                  'published_date', 'document', 'attachment_name', 'is_featured']


class NoticeDetailSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = Notice
        fields = ['id', 'title', 'slug', 'category', 'category_display', 'excerpt',
                  'content', 'published_date', 'document', 'attachment_name', 'link',
                  'is_featured', 'is_active', 'created_at', 'updated_at']

    def create(self, validated_data):
        if not validated_data.get('slug'):
            validated_data['slug'] = generate_unique_slug(Notice, validated_data['title'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'slug' in validated_data and not validated_data['slug']:
            del validated_data['slug']
        return super().update(instance, validated_data)


class GalleryImageListSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    media_type_display = serializers.CharField(source='get_media_type_display', read_only=True)

    class Meta:
        model = GalleryImage
        fields = ['id', 'title', 'slug', 'category', 'category_display', 'media_type',
                  'media_type_display', 'image', 'video_url', 'order', 'is_featured', 'created_at']


class GalleryImageDetailSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    media_type_display = serializers.CharField(source='get_media_type_display', read_only=True)
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = GalleryImage
        fields = '__all__'

    def to_internal_value(self, data):
        # Handle string boolean for is_featured from FormData
        if 'is_featured' in data:
            is_featured = data.get('is_featured')
            if isinstance(is_featured, str):
                # Create mutable copy for QueryDict or dict
                if hasattr(data, '_mutable'):
                    data._mutable = True
                    data['is_featured'] = is_featured.lower() in ('true', '1', 'yes')
                else:
                    data = dict(data)
                    data['is_featured'] = is_featured.lower() in ('true', '1', 'yes')
        return super().to_internal_value(data)

    def create(self, validated_data):
        if not validated_data.get('slug'):
            validated_data['slug'] = generate_unique_slug(GalleryImage, validated_data['title'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'slug' in validated_data and not validated_data['slug']:
            del validated_data['slug']
        return super().update(instance, validated_data)
