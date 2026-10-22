from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Product, Order, CartItem, WishlistItem
from .serializers import (
    ProductSerializer,
    OrderSerializer,
    CartItemSerializer,
    WishlistItemSerializer,
)

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
    GET /api/orders/my-orders/ - Retrieve orders for currently logged in customer (Authenticated)
    GET /api/orders/  - List all orders for studio administration (Admin only)
    GET /api/orders/{id}/ - Order details (Admin only)
    PATCH / PUT / DELETE - Order management & status update (Admin only)
    """
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        if self.action == 'my_orders':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
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

    @action(detail=False, methods=['get'], url_path='my-orders', permission_classes=[permissions.IsAuthenticated])
    def my_orders(self, request):

        user = request.user
        orders = Order.objects.filter(
            Q(user=user) | Q(customer_email__iexact=user.email)
        ).select_related('product').order_by('-created_at')
        serializer = self.get_serializer(orders, many=True)
        return Response({
            "success": True,
            "count": orders.count(),
            "data": serializer.data
        })


class CartViewSet(viewsets.ModelViewSet):
    """
    API endpoint for persistent customer shopping cart.
    Requires authentication. Strictly enforces customer ownership.
    """
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user).select_related('product')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        total_amount = sum(item.subtotal for item in queryset)
        total_items = sum(item.quantity for item in queryset)
        return Response({
            "success": True,
            "count": queryset.count(),
            "total_items": total_items,
            "total_amount": total_amount,
            "currency": "INR",
            "items": serializer.data,
        })

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        product = serializer.validated_data.get('product')
        quantity = serializer.validated_data.get('quantity', 1)

        # Check if already in cart
        existing = CartItem.objects.filter(user=request.user, product=product).first()
        if existing:
            new_qty = min(existing.quantity + quantity, 10)
            existing.quantity = new_qty
            existing.save()
            return Response(
                {
                    "success": True,
                    "message": f"Updated quantity for {product.name}.",
                    "data": self.get_serializer(existing).data
                },
                status=status.HTTP_200_OK
            )

        cart_item = CartItem.objects.create(
            user=request.user,
            product=product,
            quantity=quantity
        )
        return Response(
            {
                "success": True,
                "message": f"Added {product.name} to cart.",
                "data": self.get_serializer(cart_item).data
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['post'])
    def clear(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response({
            "success": True,
            "message": "Cart has been emptied."
        })


class WishlistViewSet(viewsets.ModelViewSet):
    """
    API endpoint for persistent customer wishlist.
    Requires authentication. Strictly enforces customer ownership.
    """
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user).select_related('product')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        product = serializer.validated_data.get('product')
        item, created = WishlistItem.objects.get_or_create(user=request.user, product=product)
        return Response(
            {
                "success": True,
                "created": created,
                "message": f"{product.name} added to wishlist." if created else f"{product.name} is already in your wishlist.",
                "data": self.get_serializer(item).data
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        product_slug = request.data.get('product_slug')
        product_id = request.data.get('product_id')

        product = None
        if product_slug:
            product = Product.objects.filter(slug=product_slug).first()
        elif product_id:
            product = Product.objects.filter(id=product_id).first()

        if not product:
            return Response(
                {"success": False, "message": "Product not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        existing = WishlistItem.objects.filter(user=request.user, product=product).first()
        if existing:
            existing.delete()
            return Response({
                "success": True,
                "in_wishlist": False,
                "message": f"Removed {product.name} from wishlist."
            })
        else:
            WishlistItem.objects.create(user=request.user, product=product)
            return Response({
                "success": True,
                "in_wishlist": True,
                "message": f"Saved {product.name} to wishlist."
            })
