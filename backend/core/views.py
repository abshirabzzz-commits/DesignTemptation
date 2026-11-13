from django.http import JsonResponse
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from django.core.files.storage import default_storage
import os
import uuid

def health_check(request):
    """
    Lightweight, unauthenticated health-check endpoint for Render and monitoring services.
    Verifies service status and database connectivity without exposing secrets, hostnames,
    credentials, or internal stack traces.
    """
    db_ok = True
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except Exception:
        db_ok = False

    status_str = "healthy" if db_ok else "degraded"
    http_status = 200 if db_ok else 503

    return JsonResponse(
        {
            "status": status_str,
            "database": "connected" if db_ok else "disconnected",
            "service": "design-temptation-backend",
        },
        status=http_status
    )

@api_view(['POST'])
@permission_classes([IsAdminUser])
def upload_image(request):
    """
    Staff-only secure file upload endpoint for project, product, and service imagery.
    Saves file to media storage and returns accessible URL.
    """
    uploaded_file = request.FILES.get('file') or request.FILES.get('image')
    if not uploaded_file:
        return JsonResponse({"success": False, "message": "No image file provided in upload request."}, status=400)

    # 10 MB limit
    if uploaded_file.size > 10 * 1024 * 1024:
        return JsonResponse({"success": False, "message": "File exceeds maximum size limit of 10MB."}, status=400)

    content_type = getattr(uploaded_file, 'content_type', '')
    allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
    if content_type and content_type.lower() not in allowed_types:
        return JsonResponse({"success": False, "message": "Unsupported file format. Please upload JPEG, PNG, WEBP, or AVIF image."}, status=400)

    ext = os.path.splitext(uploaded_file.name)[1].lower() or '.jpg'
    safe_filename = f"uploads/{uuid.uuid4().hex[:12]}_{os.path.basename(uploaded_file.name).replace(' ', '_')}"

    saved_path = default_storage.save(safe_filename, uploaded_file)
    file_url = default_storage.url(saved_path)

    return JsonResponse({
        "success": True,
        "url": file_url,
        "filename": os.path.basename(saved_path),
        "message": "Image uploaded successfully."
    }, status=201)
