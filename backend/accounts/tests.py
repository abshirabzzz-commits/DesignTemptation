from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from accounts.models import CustomerProfile

User = get_user_model()

class AccountsAuthenticationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="kavya@example.com",
            email="kavya@example.com",
            first_name="Kavya",
            last_name="Reddy",
            password="SecureCustomerPassword123!"
        )
        self.token, _ = Token.objects.get_or_create(user=self.user)

    def test_customer_registration_success(self):
        payload = {
            "name": "Vikram Sethi",
            "email": "vikram.sethi@example.com",
            "password": "StrongPassword2026!",
            "phone": "+91 98765 43210"
        }
        response = self.client.post("/api/auth/register/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])
        self.assertTrue("token" in response.data)
        self.assertEqual(response.data["user"]["email"], "vikram.sethi@example.com")
        self.assertEqual(response.data["user"]["first_name"], "Vikram")
        self.assertEqual(response.data["user"]["last_name"], "Sethi")

        # Verify CustomerProfile created
        user = User.objects.get(email="vikram.sethi@example.com")
        self.assertTrue(hasattr(user, 'customer_profile'))
        self.assertEqual(user.customer_profile.phone, "+91 98765 43210")

    def test_registration_rejects_duplicate_email(self):
        payload = {
            "name": "Kavya Duplicate",
            "email": "kavya@example.com",
            "password": "AnotherPassword123!",
        }
        response = self.client.post("/api/auth/register/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["success"])
        self.assertIn("email", response.data["errors"])

    def test_registration_rejects_short_password(self):
        payload = {
            "name": "Short Pass",
            "email": "shortpass@example.com",
            "password": "123",
        }
        response = self.client.post("/api/auth/register/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["success"])

    def test_customer_login_success(self):
        payload = {
            "email": "kavya@example.com",
            "password": "SecureCustomerPassword123!"
        }
        response = self.client.post("/api/auth/login/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["token"], self.token.key)
        self.assertEqual(response.data["user"]["email"], "kavya@example.com")

    def test_customer_login_invalid_password(self):
        payload = {
            "email": "kavya@example.com",
            "password": "WrongPassword999!"
        }
        response = self.client.post("/api/auth/login/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["success"])

    def test_current_user_me_endpoint_requires_auth(self):
        unauth_res = self.client.get("/api/auth/me/")
        self.assertEqual(unauth_res.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        auth_res = self.client.get("/api/auth/me/")
        self.assertEqual(auth_res.status_code, status.HTTP_200_OK)
        self.assertEqual(auth_res.data["user"]["email"], "kavya@example.com")

    def test_customer_profile_update(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        payload = {
            "phone": "+91 99887 76655",
            "delivery_address": "Villa 18, Palm Meadows",
            "city": "Bengaluru",
            "state": "Karnataka",
            "postal_code": "560066"
        }
        patch_res = self.client.patch("/api/auth/profile/", payload, format="json")
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertTrue(patch_res.data["success"])

        self.user.refresh_from_db()
        self.assertEqual(self.user.customer_profile.phone, "+91 99887 76655")
        self.assertEqual(self.user.customer_profile.delivery_address, "Villa 18, Palm Meadows")

    def test_customer_logout_invalidates_token(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        logout_res = self.client.post("/api/auth/logout/")
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)
        self.assertTrue(logout_res.data["success"])

        # Subsequent authenticated request should now fail
        next_res = self.client.get("/api/auth/me/")
        self.assertEqual(next_res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_password_reset_flow(self):
        # 1. Request reset endpoint
        req_res = self.client.post("/api/auth/password-reset/", {"email": "kavya@example.com"}, format="json")
        self.assertEqual(req_res.status_code, status.HTTP_200_OK)
        self.assertTrue(req_res.data["success"])

        # 2. Confirm reset using server token
        token = default_token_generator.make_token(self.user)
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))

        confirm_payload = {
            "uid": uid,
            "token": token,
            "new_password": "NewUltraSecurePassword2026!"
        }
        confirm_res = self.client.post("/api/auth/password-reset-confirm/", confirm_payload, format="json")
        self.assertEqual(confirm_res.status_code, status.HTTP_200_OK)
        self.assertTrue(confirm_res.data["success"])

        # 3. Test login with new password
        login_res = self.client.post("/api/auth/login/", {
            "email": "kavya@example.com",
            "password": "NewUltraSecurePassword2026!"
        }, format="json")
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        self.assertTrue(login_res.data["success"])

    def test_google_auth_rejects_missing_or_invalid_token(self):
        bad_res = self.client.post("/api/auth/google/", {"credential": "invalid-garbage-token"}, format="json")
        self.assertEqual(bad_res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(bad_res.data["success"])
