from rest_framework import viewsets, permissions
from .models import Service
from .serializers import ServiceSerializer

class IsAdminUserOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    lookup_field = 'slug'

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_val = self.kwargs[lookup_url_kwarg]

        obj = queryset.filter(slug=lookup_val).first()
        if not obj and lookup_val.isdigit():
            obj = queryset.filter(pk=int(lookup_val)).first()
        if not obj:
            from rest_framework.exceptions import NotFound
            raise NotFound("Service not found with the specified slug or ID.")
        self.check_object_permissions(self.request, obj)
        return obj

    def get_queryset(self):
        user = self.request.user
        queryset = Service.objects.all()
        # Public users only see active services
        if not (user and user.is_authenticated and user.is_staff):
            queryset = queryset.filter(is_active=True)
        return queryset
