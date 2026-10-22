from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from .models import CustomerProfile
import re

User = get_user_model()

class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = [
            'phone',
            'delivery_address',
            'city',
            'state',
            'postal_code',
        ]

class UserSerializer(serializers.ModelSerializer):
    profile = CustomerProfileSerializer(source='customer_profile', read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'is_staff',
            'profile',
        ]

    def get_full_name(self, obj):
        name = f"{obj.first_name} {obj.last_name}".strip()
        return name if name else obj.email.split('@')[0]


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    phone = serializers.CharField(max_length=50, required=False, allow_blank=True)

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("An account with this email address already exists. Please sign in.")
        return email

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        email = validated_data['email']
        name = validated_data['name'].strip()
        password = validated_data['password']
        phone = validated_data.get('phone', '').strip()

        # Split name into first_name and last_name
        name_parts = name.split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        username = email
        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password
        )

        # Update profile phone if provided
        if phone and hasattr(user, 'customer_profile'):
            user.customer_profile.phone = phone
            user.customer_profile.save(update_fields=['phone'])

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        email = attrs.get('email', '').strip().lower()
        password = attrs.get('password', '')

        # Lookup user by email
        user = User.objects.filter(email__iexact=email).first()
        if not user:
            # Fall back to username lookup
            user = User.objects.filter(username__iexact=email).first()

        if user and user.check_password(password):
            if not user.is_active:
                raise serializers.ValidationError("This account has been deactivated.")
            attrs['user'] = user
            return attrs

        raise serializers.ValidationError("Invalid email or password. Please verify your credentials.")


class GoogleAuthSerializer(serializers.Serializer):
    credential = serializers.CharField(required=True, help_text="Google ID Token JWT")


class ProfileUpdateSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=50, required=False, allow_blank=True)
    delivery_address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    state = serializers.CharField(max_length=100, required=False, allow_blank=True)
    postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True)

    def update(self, instance, validated_data):
        # Update User fields
        if 'first_name' in validated_data:
            instance.first_name = validated_data['first_name'].strip()
        if 'last_name' in validated_data:
            instance.last_name = validated_data['last_name'].strip()
        instance.save()

        # Update CustomerProfile fields
        profile, _ = CustomerProfile.objects.get_or_create(user=instance)
        for field in ['phone', 'delivery_address', 'city', 'state', 'postal_code']:
            if field in validated_data:
                setattr(profile, field, validated_data[field].strip())
        profile.save()

        return instance


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        return value.strip().lower()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8, write_only=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value

    def validate(self, attrs):
        try:
            uid = force_str(urlsafe_base64_decode(attrs['uid']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"uid": "Invalid or expired password reset link."})

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError({"token": "Password reset token is invalid or has expired."})

        attrs['user'] = user
        return attrs
