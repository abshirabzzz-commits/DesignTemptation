"""
URL configuration for interior-studio backend.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from core.views import health_check, upload_image

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('api/health/', health_check, name='api-health-check'),
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/', include('enquiries.urls')),
    path('api/', include('projects.urls')),
    path('api/', include('products.urls')),
    path('api/', include('reviews.urls')),
    path('api/', include('services.urls')),
    path('api/', include('site_settings.urls')),
    path('api/upload/', upload_image, name='api-upload-image'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
