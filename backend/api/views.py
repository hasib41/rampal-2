from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from core.models import (
    CompanyInfo, Project, Director, NewsArticle,
    Career, Tender, CSRInitiative, Notice
)
from .serializers import (
    CompanyInfoSerializer, ProjectListSerializer, ProjectDetailSerializer,
    DirectorSerializer, NewsListSerializer, NewsDetailSerializer,
    CareerListSerializer, CareerDetailSerializer, JobApplicationSerializer,
    TenderSerializer, ContactInquirySerializer, CSRInitiativeSerializer, NoticeSerializer
)


class CompanyInfoView(generics.RetrieveAPIView):
    """Get company information (singleton)"""
    serializer_class = CompanyInfoSerializer

    def get_object(self):
        obj, _ = CompanyInfo.objects.get_or_create(pk=1)
        return obj


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve projects"""
    queryset = Project.objects.all()
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectListSerializer


class DirectorViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve directors"""
    queryset = Director.objects.all()
    serializer_class = DirectorSerializer


class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve news articles"""
    queryset = NewsArticle.objects.all()
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return NewsDetailSerializer
        return NewsListSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured news articles"""
        featured = self.queryset.filter(is_featured=True)[:3]
        serializer = NewsListSerializer(featured, many=True)
        return Response(serializer.data)


class CareerViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve active job listings"""
    queryset = Career.objects.filter(is_active=True)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CareerDetailSerializer
        return CareerListSerializer


class JobApplicationView(generics.CreateAPIView):
    """Submit job application"""
    serializer_class = JobApplicationSerializer


class TenderViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve tenders with filtering"""
    queryset = Tender.objects.all()
    serializer_class = TenderSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'category']


class ContactInquiryView(generics.CreateAPIView):
    """Submit contact inquiry"""
    serializer_class = ContactInquirySerializer


class CSRInitiativeViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve CSR initiatives"""
    queryset = CSRInitiative.objects.all()
    serializer_class = CSRInitiativeSerializer


class NoticeViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve notices for Notice Board"""
    queryset = Notice.objects.filter(is_active=True)
    serializer_class = NoticeSerializer

