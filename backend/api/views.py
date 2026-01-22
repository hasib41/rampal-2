from rest_framework import viewsets, generics, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.conf import settings
import requests
import json
import logging

logger = logging.getLogger(__name__)
from core.models import (
    CompanyInfo, Project, Director, NewsArticle,
    Career, Tender, CSRInitiative, Notice, GalleryImage, SiteSettings
)
from .serializers import (
    CompanyInfoSerializer, ProjectListSerializer, ProjectDetailSerializer,
    DirectorSerializer, NewsListSerializer, NewsDetailSerializer,
    CareerListSerializer, CareerDetailSerializer, JobApplicationSerializer,
    TenderSerializer, ContactInquirySerializer, CSRInitiativeSerializer,
    NoticeListSerializer, NoticeDetailSerializer,
    GalleryImageListSerializer, GalleryImageDetailSerializer,
    SiteSettingsSerializer
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


class SiteSettingsView(generics.RetrieveUpdateAPIView):
    """Get and update site settings (singleton)"""
    serializer_class = SiteSettingsSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        return SiteSettings.get_settings()


class ChatBotView(APIView):
    """AI-powered chatbot using Google Gemini API"""

    # System prompt with BIFPCL context
    SYSTEM_PROMPT = """You are the official AI assistant for BIFPCL (Bangladesh-India Friendship Power Company Limited).
You help visitors with information about:

**About BIFPCL:**
- BIFPCL is a 50:50 joint venture between NTPC Ltd. of India and BPDB of Bangladesh
- The Maitree Super Thermal Power Project is a 1320 MW (2 x 660 MW) ultra-supercritical coal-fired power plant
- Located in Rampal, Bagerhat, Bangladesh
- Represents landmark bilateral cooperation in the power sector

**Environmental Commitment:**
- Uses Ultra-Supercritical Technology for lower emissions and higher efficiency
- Adheres to IFC guidelines and Equator Principles
- Advanced pollution control: FGD (Flue Gas Desulfurization), ESP (Electrostatic Precipitators), SCR (Selective Catalytic Reduction)

**Contact Information:**
- Site Office: Maitree Super Thermal Power Project, Rampal, Bagerhat, Bangladesh
- Phone: +880 2 968 1234, Email: info@bifpcl.com
- Corporate Office: 117 Kazi Nazrul Islam Ave, Dhaka 1205
- Working Hours: Sun - Thu: 9:00 AM - 5:00 PM

**Website Pages:**
- /tenders - View active procurement opportunities
- /careers - Job openings and applications
- /notices - Official announcements
- /contact - Contact form and office locations
- /projects - Project information
- /sustainability - Environmental initiatives

Guidelines:
1. Be helpful, professional, and concise
2. Provide accurate information about BIFPCL
3. Direct users to relevant website pages when appropriate
4. If unsure, recommend contacting BIFPCL directly
5. Keep responses brief (2-3 sentences for simple queries, more for complex ones)
6. Use bullet points for lists
7. Be friendly but maintain professional tone"""

    def post(self, request):
        """Handle chat messages"""
        message = request.data.get('message', '').strip()
        conversation_history = request.data.get('history', [])

        if not message:
            return Response(
                {'error': 'Message is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        api_key = settings.GEMINI_API_KEY
        if not api_key:
            # Fallback to predefined responses if no API key
            return Response({
                'response': self.get_fallback_response(message),
                'fallback': True
            })

        try:
            response_text = self.call_gemini_api(api_key, message, conversation_history)
            return Response({'response': response_text})
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            # Fallback on error
            return Response({
                'response': self.get_fallback_response(message),
                'fallback': True
            })

    def call_gemini_api(self, api_key, message, history):
        """Call Google Gemini API"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"

        # Build conversation with system prompt
        contents = []

        # Add system instruction as first user message
        contents.append({
            "role": "user",
            "parts": [{"text": self.SYSTEM_PROMPT}]
        })
        contents.append({
            "role": "model",
            "parts": [{"text": "I understand. I'm the BIFPCL AI Assistant, ready to help visitors with information about the Maitree Super Thermal Power Project, tenders, careers, and more. How can I assist you?"}]
        })

        # Add conversation history
        for msg in history[-10:]:  # Keep last 10 messages for context
            role = "user" if msg.get('role') == 'user' else "model"
            contents.append({
                "role": role,
                "parts": [{"text": msg.get('content', '')}]
            })

        # Add current message
        contents.append({
            "role": "user",
            "parts": [{"text": message}]
        })

        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 1024,
            },
            "safetySettings": [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            ]
        }

        response = requests.post(
            url,
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=30
        )

        if response.status_code != 200:
            logger.error(f"Gemini API error: {response.status_code} - {response.text}")
            raise Exception(f"API returned {response.status_code}")

        data = response.json()

        # Extract response text
        if 'candidates' in data and len(data['candidates']) > 0:
            candidate = data['candidates'][0]
            if 'content' in candidate and 'parts' in candidate['content']:
                return candidate['content']['parts'][0].get('text', '')

        raise Exception("No valid response from API")

    def get_fallback_response(self, query):
        """Fallback responses when API is unavailable"""
        query_lower = query.lower()

        if any(word in query_lower for word in ['bifpcl', 'about', 'maitree', 'project', 'company']):
            return "BIFPCL (Bangladesh-India Friendship Power Company Limited) is a 50:50 joint venture between NTPC Ltd. of India and BPDB of Bangladesh. The Maitree Super Thermal Power Project is a 1320 MW ultra-supercritical coal-fired power plant located in Rampal, Bagerhat, Bangladesh."

        if any(word in query_lower for word in ['tender', 'bid', 'procurement']):
            return "You can view all active tenders on our Tenders page at /tenders. We regularly post new procurement opportunities for goods, services, and works."

        if any(word in query_lower for word in ['career', 'job', 'opening', 'vacancy', 'work']):
            return "BIFPCL offers various career opportunities. View current openings on our Careers page at /careers. We're always looking for talented individuals to join our team."

        if any(word in query_lower for word in ['contact', 'phone', 'email', 'address', 'office']):
            return "Contact BIFPCL at:\n• Site Office: Rampal, Bagerhat - Phone: +880 2 968 1234\n• Corporate Office: 117 Kazi Nazrul Islam Ave, Dhaka\n• Email: info@bifpcl.com\n\nVisit /contact for more options."

        if any(word in query_lower for word in ['environment', 'emission', 'pollution', 'green', 'sustainable']):
            return "BIFPCL uses Ultra-Supercritical Technology for lower emissions and higher efficiency. We adhere to IFC guidelines and Equator Principles with advanced pollution control systems."

        if any(word in query_lower for word in ['hello', 'hi', 'hey', 'greet']):
            return "Hello! Welcome to BIFPCL. I'm here to help you with information about our organization, the Maitree Power Project, tenders, careers, and more. What would you like to know?"

        if 'thank' in query_lower:
            return "You're welcome! If you have any more questions about BIFPCL, feel free to ask."

        return "Thank you for your question. For more information, please visit:\n• /tenders - Procurement opportunities\n• /careers - Job openings\n• /notices - Announcements\n• /contact - Get in touch\n\nIs there something specific about BIFPCL I can help you with?"
