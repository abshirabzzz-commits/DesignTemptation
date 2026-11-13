from rest_framework import serializers
from django.utils.text import slugify
from .models import Project, ProjectImage

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image_url', 'caption', 'order']


class ProjectSerializer(serializers.ModelSerializer):
    gallery_images = ProjectImageSerializer(many=True, read_only=True)
    gallery = serializers.ListField(
        child=serializers.CharField(max_length=500),
        required=False,
        write_only=False
    )

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
        extra_kwargs = {
            'slug': {'required': False},
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['gallery'] = [img.image_url for img in instance.gallery_images.all()]
        return data

    def validate(self, attrs):
        if not attrs.get('slug') and attrs.get('title'):
            base_slug = slugify(attrs['title'])
            slug = base_slug
            counter = 1
            while Project.objects.filter(slug=slug).exclude(pk=self.instance.pk if self.instance else None).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            attrs['slug'] = slug
        return attrs

    def create(self, validated_data):
        gallery_urls = validated_data.pop('gallery', None)
        project = super().create(validated_data)
        if gallery_urls:
            for idx, url in enumerate(gallery_urls):
                if url and url.strip():
                    ProjectImage.objects.create(project=project, image_url=url.strip(), order=idx)
        return project

    def update(self, instance, validated_data):
        gallery_urls = validated_data.pop('gallery', None)
        project = super().update(instance, validated_data)
        if gallery_urls is not None:
            instance.gallery_images.all().delete()
            for idx, url in enumerate(gallery_urls):
                if url and url.strip():
                    ProjectImage.objects.create(project=project, image_url=url.strip(), order=idx)
        return project
