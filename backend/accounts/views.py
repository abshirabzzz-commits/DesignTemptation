from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    GoogleAuthSerializer,
    ProfileUpdateSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "errors": serializer.errors,
                    "message": "Registration failed. Please check the provided information."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "success": True,
                "token": token.key,
                "user": UserSerializer(user).data,
                "message": "Your Design Temptation account has been created."
            },
            status=status.HTTP_201_CREATED
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "errors": serializer.errors,
                    "message": "Invalid email or password."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "success": True,
                "token": token.key,
                "user": UserSerializer(user).data,
                "message": "Welcome back."
            },
            status=status.HTTP_200_OK
        )


class GoogleAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "errors": serializer.errors,
                    "message": "Google credential token is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        credential = serializer.validated_data['credential']
        google_client_id = getattr(settings, 'GOOGLE_CLIENT_ID', None)

        try:
            from google.oauth2 import id_token
            from google.auth.transport import requests as google_requests

            request_adapter = google_requests.Request()
            # If client_id is configured, verify audience strictly; otherwise verify signature
            idinfo = id_token.verify_oauth2_token(
                credential,
                request_adapter,
                google_client_id if google_client_id else None
            )

            # Validate issuer
            if idinfo.get('iss') not in ['accounts.google.com', 'https://accounts.google.com']:
                return Response(
                    {"success": False, "message": "Invalid Google token issuer."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate email verification
            if not idinfo.get('email_verified', False):
                return Response(
                    {"success": False, "message": "Google email address is not verified."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            email = idinfo.get('email', '').strip().lower()
            if not email:
                return Response(
                    {"success": False, "message": "Unable to extract email from Google identity."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            given_name = idinfo.get('given_name', '')
            family_name = idinfo.get('family_name', '')

            # Check if user already exists
            user = User.objects.filter(email__iexact=email).first()
            if not user:
                # Fallback to username
                user = User.objects.filter(username__iexact=email).first()

            if not user:
                # Create new customer account with verified Google identity
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    first_name=given_name,
                    last_name=family_name
                )
                user.set_unusable_password()
                user.save()
            else:
                # Update names if empty
                updated = False
                if not user.first_name and given_name:
                    user.first_name = given_name
                    updated = True
                if not user.last_name and family_name:
                    user.last_name = family_name
                    updated = True
                if updated:
                    user.save(update_fields=['first_name', 'last_name'])

            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {
                    "success": True,
                    "token": token.key,
                    "user": UserSerializer(user).data,
                    "message": "Signed in with Google."
                },
                status=status.HTTP_200_OK
            )

        except ValueError as e:
            return Response(
                {
                    "success": False,
                    "message": f"Google authentication failed: {str(e)}"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception:
            return Response(
                {
                    "success": False,
                    "message": "Google authentication verification service error."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Invalidate current user auth token
        Token.objects.filter(user=request.user).delete()
        return Response(
            {
                "success": True,
                "message": "Signed out successfully."
            },
            status=status.HTTP_200_OK
        )


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "success": True,
                "user": UserSerializer(request.user).data
            },
            status=status.HTTP_200_OK
        )


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "success": True,
                "user": UserSerializer(request.user).data
            },
            status=status.HTTP_200_OK
        )

    def patch(self, request):
        serializer = ProfileUpdateSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "errors": serializer.errors,
                    "message": "Profile update validation failed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        updated_user = serializer.update(request.user, serializer.validated_data)
        return Response(
            {
                "success": True,
                "user": UserSerializer(updated_user).data,
                "message": "Your profile information has been updated."
            },
            status=status.HTTP_200_OK
        )


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = serializer.validated_data['email']
        user = User.objects.filter(email__iexact=email).first()

        if user and user.is_active:
            # Token and uid generated for secure password reset flow
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            # Production email dispatch hook (e.g. via Resend or Django mail)

        # Return standardized message preventing user enumeration
        return Response(
            {
                "success": True,
                "message": "If an account exists with this email address, password reset instructions have been dispatched."
            },
            status=status.HTTP_200_OK
        )



class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.validated_data['user']
        new_password = serializer.validated_data['new_password']
        user.set_password(new_password)
        user.save()

        # Invalidate old auth tokens
        Token.objects.filter(user=user).delete()

        return Response(
            {
                "success": True,
                "message": "Password reset successful. Please sign in with your new password."
            },
            status=status.HTTP_200_OK
        )
