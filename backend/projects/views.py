from rest_framework import viewsets, permissions
from .models import Project
from .serializers import ProjectSerializer

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission allowing public read-only access (GET, HEAD, OPTIONS)
    while requiring authenticated Django staff/admin credentials for write operations
    (POST, PUT, PATCH, DELETE).
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Projects portfolio.
    Allows public listing and retrieval by slug or ID.
    Restricts creation, updates, and deletion to authenticated staff/admin users.
    """
    queryset = Project.objects.all().prefetch_related('gallery_images')
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category', None)
        featured = self.request.query_params.get('featured', None)

        if category and category != 'All':
            queryset = queryset.filter(category__iexact=category)

        if featured is not None:
            is_featured = featured.lower() in ['true', '1', 'yes']
            queryset = queryset.filter(featured=is_featured)

        return queryset
