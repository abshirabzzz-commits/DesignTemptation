from rest_framework import serializers
from .models import Project, ProjectImage

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image_url', 'caption', 'order']


class ProjectSerializer(serializers.ModelSerializer):
    gallery_images = ProjectImageSerializer(many=True, read_only=True)
    # Frontend compatibility helper
    gallery = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id',
            'slug',
            'title',
            'location',
            'category',
            'property_type',
            'year',
            'area',
            'short_description',
            'description',
            'design_approach',
            'cover_image',
            'featured',
            'created_at',
            'gallery_images',
            'gallery',
        ]

    def get_gallery(self, obj):
        return [img.image_url for img in obj.gallery_images.all()]
