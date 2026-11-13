from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'id',
            'quote',
            'rating',
            'client_name',
            'project_type',
            'location',
            'year',
            'is_approved',
            'is_featured',
            'created_at',
            'updated_at',
        ]
