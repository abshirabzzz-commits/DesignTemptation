from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import SiteSetting
from .serializers import SiteSettingSerializer

class SiteSettingView(APIView):
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request):
        settings = SiteSetting.load()
        serializer = SiteSettingSerializer(settings)
        return Response({
            "success": True,
            "data": serializer.data
        })

    def patch(self, request):
        settings = SiteSetting.load()
        serializer = SiteSettingSerializer(settings, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "errors": serializer.errors,
                "message": "Invalid settings payload."
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response({
            "success": True,
            "message": "Studio settings updated successfully.",
            "data": serializer.data
        })
