from django.http import JsonResponse
from django.db import connection

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
