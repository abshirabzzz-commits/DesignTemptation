from rest_framework import serializers
from .models import SiteSetting

class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = [
            'id',
            'studio_name',
            'tagline',
            'email',
            'phone',
            'address_line1',
            'city',
            'state',
            'postal_code',
            'country',
            'hero_heading',
            'hero_subheading',
            'instagram_url',
            'maps_url',
            'updated_at',
        ]
