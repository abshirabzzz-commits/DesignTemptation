from rest_framework import serializers
from .models import Product, Order, CartItem, WishlistItem
import re
import uuid

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id',
            'slug',
            'name',
            'category',
            'price',
            'numeric_price',
            'image',
            'image_alt',
            'dimensions',
            'material',
            'description',
            'featured',
            'available',
            'created_at',
        ]


class OrderSerializer(serializers.ModelSerializer):
    product_slug = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=Product.objects.all(),
        source='product',
        write_only=True,
        required=False,
    )
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'user',
            'product',
            'product_slug',
            'product_details',
            'quantity',
            'unit_price',
            'total_amount',
            'currency',
            'customer_name',
            'customer_email',
            'customer_phone',
            'delivery_address',
            'city',
            'state',
            'postal_code',
            'notes',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'user',
            'unit_price',
            'total_amount',
            'currency',
            'created_at',
            'updated_at',
        ]
        extra_kwargs = {
            'product': {'required': False},
            'order_number': {'required': False},
            'status': {'required': False},
        }

    def validate(self, attrs):
        # On creation, force initial status to Pending
        if self.instance is None:
            attrs['status'] = 'Pending'
        # On update/patch, fall back to instance fields
        if self.instance is not None:
            product = attrs.get('product', self.instance.product)
            quantity = attrs.get('quantity', self.instance.quantity)
        else:
            product = attrs.get('product')
            quantity = attrs.get('quantity', 1)

        if not product and self.instance is None:
            raise serializers.ValidationError({"product": "A valid product or product_slug is required."})

        if product and not product.available and self.instance is None:
            raise serializers.ValidationError({"product": f"{product.name} is currently not available for acquisition."})

        # Validate quantity
        if quantity is not None and (quantity < 1 or quantity > 10):
            raise serializers.ValidationError({"quantity": "Quantity must be between 1 and 10 pieces per studio order."})

        # Sanitize customer name
        if 'customer_name' in attrs or self.instance is None:
            name = attrs.get('customer_name', '').strip()
            if not name:
                raise serializers.ValidationError({"customer_name": "Customer full name is required."})
            attrs['customer_name'] = name

        # Sanitize phone
        if 'customer_phone' in attrs or self.instance is None:
            phone = attrs.get('customer_phone', '').strip()
            digits = re.sub(r'\D', '', phone)
            if len(digits) < 10 or len(digits) > 15:
                raise serializers.ValidationError({"customer_phone": "Please provide a valid 10-15 digit phone or WhatsApp number."})
            attrs['customer_phone'] = phone

        # Sanitize address
        if 'delivery_address' in attrs or self.instance is None:
            address = attrs.get('delivery_address', '').strip()
            if not address:
                raise serializers.ValidationError({"delivery_address": "Delivery address is required."})
            attrs['delivery_address'] = address

        if 'city' in attrs or self.instance is None:
            city = attrs.get('city', '').strip()
            if not city:
                raise serializers.ValidationError({"city": "City is required."})
            attrs['city'] = city

        if 'state' in attrs or self.instance is None:
            state = attrs.get('state', '').strip()
            if not state:
                raise serializers.ValidationError({"state": "State is required."})
            attrs['state'] = state

        if 'postal_code' in attrs or self.instance is None:
            postal_code = attrs.get('postal_code', '').strip()
            if not postal_code:
                raise serializers.ValidationError({"postal_code": "Postal / PIN code is required."})
            attrs['postal_code'] = postal_code

        # Server-enforced pricing (never trust client) on creation or quantity change
        if product and quantity:
            attrs['unit_price'] = product.numeric_price
            attrs['total_amount'] = product.numeric_price * quantity
            attrs['currency'] = 'INR'

        # Auto-generate unique order number if creating and not supplied
        if self.instance is None and not attrs.get('order_number'):
            random_suffix = uuid.uuid4().hex[:6].upper()
            attrs['order_number'] = f"DT-ORD-{random_suffix}"

        # Associate authenticated user if present in request context
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated and self.instance is None:
            attrs['user'] = request.user

        return attrs


class CartItemSerializer(serializers.ModelSerializer):
    product_slug = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=Product.objects.all(),
        source='product',
        write_only=True,
        required=False,
    )
    product_details = ProductSerializer(source='product', read_only=True)
    subtotal = serializers.IntegerField(read_only=True)

    class Meta:
        model = CartItem
        fields = [
            'id',
            'product',
            'product_slug',
            'product_details',
            'quantity',
            'subtotal',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'subtotal']
        extra_kwargs = {
            'product': {'required': False},
        }

    def validate(self, attrs):
        product = attrs.get('product')
        if not product and self.instance:
            product = self.instance.product
        quantity = attrs.get('quantity', 1)

        if not product and not self.instance:
            raise serializers.ValidationError({"product": "A valid product or product_slug is required."})

        if product and not product.available:
            raise serializers.ValidationError({"product": f"{product.name} is currently not available for acquisition."})

        if quantity < 1 or quantity > 10:
            raise serializers.ValidationError({"quantity": "Quantity must be between 1 and 10 pieces."})

        return attrs


class WishlistItemSerializer(serializers.ModelSerializer):
    product_slug = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=Product.objects.all(),
        source='product',
        write_only=True,
        required=False,
    )
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = WishlistItem
        fields = [
            'id',
            'product',
            'product_slug',
            'product_details',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {
            'product': {'required': False},
        }

    def validate(self, attrs):
        product = attrs.get('product')
        if not product and not self.instance:
            raise serializers.ValidationError({"product": "A valid product or product_slug is required."})
        return attrs
