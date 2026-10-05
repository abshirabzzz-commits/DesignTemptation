from rest_framework import serializers
from .models import Product

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
