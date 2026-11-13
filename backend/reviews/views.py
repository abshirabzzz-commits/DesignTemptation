from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer

class IsAdminUserOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        queryset = Review.objects.all()

        # Non-staff visitors only see approved reviews
        if not (user and user.is_authenticated and user.is_staff):
            queryset = queryset.filter(is_approved=True)
        else:
            status_param = self.request.query_params.get('status')
            if status_param == 'approved':
                queryset = queryset.filter(is_approved=True)
            elif status_param == 'pending' or status_param == 'unapproved':
                queryset = queryset.filter(is_approved=False)

        featured_param = self.request.query_params.get('featured')
        if featured_param is not None:
            is_featured = featured_param.lower() in ['true', '1', 'yes']
            queryset = queryset.filter(is_featured=is_featured)

        return queryset

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def toggle_approval(self, request, pk=None):
        review = self.get_object()
        review.is_approved = not review.is_approved
        review.save(update_fields=['is_approved', 'updated_at'])
        return Response({
            "success": True,
            "is_approved": review.is_approved,
            "message": f"Review by {review.client_name} is now {'approved' if review.is_approved else 'hidden'}."
        })

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def toggle_featured(self, request, pk=None):
        review = self.get_object()
        review.is_featured = not review.is_featured
        review.save(update_fields=['is_featured', 'updated_at'])
        return Response({
            "success": True,
            "is_featured": review.is_featured,
            "message": f"Review by {review.client_name} is now {'featured on homepage' if review.is_featured else 'unfeatured'}."
        })
