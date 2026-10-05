from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectEnquiryViewSet

router = DefaultRouter()
router.register(r'enquiries', ProjectEnquiryViewSet, basename='enquiry')

urlpatterns = [
    path('', include(router.urls)),
]
