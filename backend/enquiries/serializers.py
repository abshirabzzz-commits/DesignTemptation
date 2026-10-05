from rest_framework import serializers
from .models import ProjectEnquiry
import os
import re

class ProjectEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectEnquiry
        fields = [
            'id',
            'full_name',
            'email',
            'phone',
            'project_type',
            'property_type',
            'project_location',
            'project_area',
            'budget_range',
            'requirements',
            'reference_images',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at']

    def validate_full_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Full name is required.")
        return value.strip()

    def validate_email(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Email address is required.")
        return value.strip().lower()

    def validate_phone(self, value):
        digits = re.sub(r'\D', '', value)
        if len(digits) < 10 or len(digits) > 15:
            raise serializers.ValidationError("Please provide a valid phone or WhatsApp number (minimum 10 digits).")
        return value.strip()

    def validate_project_location(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Project location is required.")
        return value.strip()

    def validate_requirements(self, value):
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Please describe your project requirements (minimum 10 characters).")
        return value.strip()

    def validate_reference_images(self, value):
        if value:
            ext = os.path.splitext(value.name)[1].lower()
            valid_extensions = ['.jpg', '.jpeg', '.png', '.webp']
            if ext not in valid_extensions:
                raise serializers.ValidationError("Only JPG, JPEG, PNG, and WEBP image formats are allowed.")
            if value.size > 15 * 1024 * 1024:
                raise serializers.ValidationError("Reference image file size cannot exceed 15MB.")
        return value
