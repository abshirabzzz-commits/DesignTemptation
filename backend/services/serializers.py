from rest_framework import serializers
from .models import Service

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id',
            'title',
            'slug',
            'subtitle',
            'description',
            'image',
            'image_alt',
            'disciplines',
            'order',
            'is_active',
            'created_at',
            'updated_at',
        ]
