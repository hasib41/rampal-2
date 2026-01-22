from django.urls import path, include
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from .views import (
    CompanyInfoView, ProjectViewSet, DirectorViewSet, NewsViewSet,
    CareerViewSet, JobApplicationView, TenderViewSet,
    ContactInquiryView, CSRInitiativeViewSet, NoticeViewSet, GalleryImageViewSet,
    SiteSettingsView, ChatBotView
)


def health_check(request):
    """Health check endpoint for Render deployment monitoring."""
    return JsonResponse({'status': 'healthy', 'service': 'bifpcl-api'})


router = DefaultRouter()
router.register('projects', ProjectViewSet, basename='project')
router.register('directors', DirectorViewSet, basename='director')
router.register('news', NewsViewSet, basename='news')
router.register('careers', CareerViewSet, basename='career')
router.register('tenders', TenderViewSet, basename='tender')
router.register('csr', CSRInitiativeViewSet, basename='csr')
router.register('notices', NoticeViewSet, basename='notice')
router.register('gallery', GalleryImageViewSet, basename='gallery')

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('', include(router.urls)),
    path('company/', CompanyInfoView.as_view(), name='company-info'),
    path('apply/', JobApplicationView.as_view(), name='job-application'),
    path('contact/', ContactInquiryView.as_view(), name='contact-inquiry'),
    path('settings/', SiteSettingsView.as_view(), name='site-settings'),
    path('chat/', ChatBotView.as_view(), name='chatbot'),
]
