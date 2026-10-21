from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer

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

class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Products catalog.
    Allows public listing and retrieval by slug.
    Restricts creation, updates, and deletion to authenticated staff/admin users.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
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


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for customer product orders.
    POST /api/orders/ - Place new acquisition order (Public: AllowAny)
    GET /api/orders/  - List all orders for studio administration (Admin only)
    GET /api/orders/{id}/ - Order details (Admin only)
    PATCH / PUT / DELETE - Order management & status update (Admin only)
    """
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "errors": serializer.errors,
                    "message": "Order validation failed. Please review the provided details."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        order = serializer.save()
        return Response(
            {
                "success": True,
                "message": f"Thank you for acquiring {order.product.name}. Your order reference is {order.order_number}. Our atelier concierge will contact you to coordinate delivery.",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )
