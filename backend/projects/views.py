from rest_framework import viewsets, permissions
from .models import Project
from .serializers import ProjectSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Projects portfolio.
    Allows listing, retrieval by slug or ID, filtering by category or featured status.
    """
    queryset = Project.objects.all().prefetch_related('gallery_images')
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]
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
