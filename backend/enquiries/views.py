from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import ProjectEnquiry
from .serializers import ProjectEnquirySerializer

class ProjectEnquiryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for submitting and managing project enquiries.
    POST /api/enquiries/ - Submit new project enquiry (Public: AllowAny)
    GET /api/enquiries/  - List enquiries for studio administration (Admin only)
    GET /api/enquiries/{id}/ - Retrieve enquiry details (Admin only)
    PUT / PATCH / DELETE - Enquiry management (Admin only)
    """
    queryset = ProjectEnquiry.objects.all().order_by('-created_at')
    serializer_class = ProjectEnquirySerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "errors": serializer.errors,
                    "message": "Enquiry validation failed. Please check the provided information."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        enquiry = serializer.save()
        return Response(
            {
                "success": True,
                "message": "Thank you for contacting DESIGN TEMPTATION. Your project enquiry has been received. Our team will review your requirements and get back to you.",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )
