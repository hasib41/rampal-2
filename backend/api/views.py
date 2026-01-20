from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from core.models import (
    CompanyInfo, Project, Director, NewsArticle,
    Career, Tender, CSRInitiative, Notice, GalleryImage
)
from .serializers import (
    CompanyInfoSerializer, ProjectListSerializer, ProjectDetailSerializer,
    DirectorSerializer, NewsListSerializer, NewsDetailSerializer,
    CareerListSerializer, CareerDetailSerializer, JobApplicationSerializer,
    TenderSerializer, ContactInquirySerializer, CSRInitiativeSerializer,
    NoticeListSerializer, NoticeDetailSerializer,
    GalleryImageListSerializer, GalleryImageDetailSerializer
)


class CompanyInfoView(generics.RetrieveAPIView):
    """Get company information (singleton)"""
    serializer_class = CompanyInfoSerializer

    def get_object(self):
        obj, _ = CompanyInfo.objects.get_or_create(pk=1)
        return obj


class ProjectViewSet(viewsets.ModelViewSet):
    """CRUD operations for projects"""
    queryset = Project.objects.all()
    serializer_class = ProjectDetailSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_lookup_field(self):
        """Use 'slug' for retrieve, 'pk' for update/delete"""
        if self.action in ['retrieve']:
            return 'slug'
        return 'pk'

    def get_object(self):
        """Override to support both slug and pk lookups"""
        queryset = self.get_queryset()
        lookup_value = self.kwargs.get('pk')

        # Try pk first for update/delete operations
        if self.action in ['update', 'partial_update', 'destroy']:
            try:
                obj = queryset.get(pk=int(lookup_value))
                self.check_object_permissions(self.request, obj)
                return obj
            except (ValueError, Project.DoesNotExist):
                pass

        # Fall back to slug lookup
        try:
            obj = queryset.get(slug=lookup_value)
            self.check_object_permissions(self.request, obj)
            return obj
        except Project.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound("Project not found")

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectDetailSerializer


class DirectorViewSet(viewsets.ModelViewSet):
    """CRUD operations for directors"""
    queryset = Director.objects.all()
    serializer_class = DirectorSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class NewsViewSet(viewsets.ModelViewSet):
    """CRUD operations for news articles"""
    queryset = NewsArticle.objects.all()
    serializer_class = NewsDetailSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        """Override to support both slug and pk lookups"""
        queryset = self.get_queryset()
        lookup_value = self.kwargs.get('pk')

        # Try pk first for update/delete operations
        if self.action in ['update', 'partial_update', 'destroy']:
            try:
                obj = queryset.get(pk=int(lookup_value))
                self.check_object_permissions(self.request, obj)
                return obj
            except (ValueError, NewsArticle.DoesNotExist):
                pass

        # Fall back to slug lookup
        try:
            obj = queryset.get(slug=lookup_value)
            self.check_object_permissions(self.request, obj)
            return obj
        except NewsArticle.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound("News article not found")

    def get_serializer_class(self):
        if self.action == 'list':
            return NewsListSerializer
        return NewsDetailSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured news articles"""
        featured = self.queryset.filter(is_featured=True)[:3]
        serializer = NewsListSerializer(featured, many=True)
        return Response(serializer.data)


class CareerViewSet(viewsets.ModelViewSet):
    """CRUD operations for job listings"""
    queryset = Career.objects.all()
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        """Show only active careers for list, all for admin operations"""
        if self.action == 'list' and not self.request.query_params.get('all'):
            return Career.objects.filter(is_active=True)
        return Career.objects.all()

    def get_serializer_class(self):
        if self.action in ['retrieve', 'create', 'update', 'partial_update']:
            return CareerDetailSerializer
        return CareerListSerializer


class JobApplicationView(generics.CreateAPIView):
    """Submit job application"""
    serializer_class = JobApplicationSerializer


class TenderViewSet(viewsets.ModelViewSet):
    """CRUD operations for tenders with filtering"""
    queryset = Tender.objects.all()
    serializer_class = TenderSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'category']


class ContactInquiryView(generics.CreateAPIView):
    """Submit contact inquiry"""
    serializer_class = ContactInquirySerializer


class CSRInitiativeViewSet(viewsets.ModelViewSet):
    """CRUD operations for CSR initiatives"""
    queryset = CSRInitiative.objects.all()
    serializer_class = CSRInitiativeSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class NoticeViewSet(viewsets.ModelViewSet):
    """CRUD operations for notices"""
    queryset = Notice.objects.all()
    serializer_class = NoticeDetailSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'is_featured']

    def get_queryset(self):
        """Show only active notices for list, all for admin operations"""
        if self.action == 'list' and not self.request.query_params.get('all'):
            return Notice.objects.filter(is_active=True)
        return Notice.objects.all()

    def get_object(self):
        """Override to support both slug and pk lookups"""
        queryset = Notice.objects.all()  # Use all notices for admin
        lookup_value = self.kwargs.get('pk')

        # Try pk first for update/delete operations
        if self.action in ['update', 'partial_update', 'destroy']:
            try:
                obj = queryset.get(pk=int(lookup_value))
                self.check_object_permissions(self.request, obj)
                return obj
            except (ValueError, Notice.DoesNotExist):
                pass

        # Fall back to slug lookup
        try:
            obj = queryset.get(slug=lookup_value)
            self.check_object_permissions(self.request, obj)
            return obj
        except Notice.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound("Notice not found")

    def get_serializer_class(self):
        if self.action == 'list':
            return NoticeListSerializer
        return NoticeDetailSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured notices"""
        featured = Notice.objects.filter(is_active=True, is_featured=True)[:5]
        serializer = NoticeListSerializer(featured, many=True)
        return Response(serializer.data)


class GalleryImageViewSet(viewsets.ModelViewSet):
    """CRUD operations for gallery images"""
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageDetailSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'media_type', 'is_featured']

    def get_object(self):
        """Override to support both slug and pk lookups"""
        queryset = self.get_queryset()
        lookup_value = self.kwargs.get('pk')

        # Try pk first for update/delete operations
        if self.action in ['update', 'partial_update', 'destroy']:
            try:
                obj = queryset.get(pk=int(lookup_value))
                self.check_object_permissions(self.request, obj)
                return obj
            except (ValueError, GalleryImage.DoesNotExist):
                pass

        # Fall back to slug lookup
        try:
            obj = queryset.get(slug=lookup_value)
            self.check_object_permissions(self.request, obj)
            return obj
        except GalleryImage.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound("Gallery image not found")

    def get_serializer_class(self):
        if self.action == 'list':
            return GalleryImageListSerializer
        return GalleryImageDetailSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured gallery images"""
        featured = self.queryset.filter(is_featured=True)[:8]
        serializer = GalleryImageListSerializer(featured, many=True)
        return Response(serializer.data)
