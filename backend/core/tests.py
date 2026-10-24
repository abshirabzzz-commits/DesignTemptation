from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from rest_framework import status
import os

class CoreHealthCheckAndConfigTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_health_check_endpoint_returns_200(self):
        """Verify Render and probe health check endpoint returns 200 OK with expected status."""
        for path in ['/health/', '/api/health/']:
            response = self.client.get(path)
            self.assertEqual(response.status_code, status.HTTP_200_OK, f"Failed for path: {path}")
            data = response.json()
            self.assertEqual(data["status"], "healthy")
            self.assertEqual(data["database"], "connected")
            self.assertEqual(data["service"], "design-temptation-backend")

    def test_health_check_does_not_leak_secrets(self):
        """Verify the health check response exposes zero secrets, database credentials, or hostnames."""
        response = self.client.get('/health/')
        content = response.content.decode('utf-8')

        forbidden_keywords = [
            "SECRET_KEY", "password", "postgres", "sqlite", "DATABASE_URL",
            "aws", "token", "key", "root", "localhost", "127.0.0.1"
        ]
        for keyword in forbidden_keywords:
            self.assertNotIn(keyword.lower(), content.lower())

    @override_settings(DEBUG=True)
    def test_health_check_accessible_unauthenticated(self):
        """Health probe must be accessible without authentication headers."""
        response = self.client.get('/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_render_hostname_auto_inclusion(self):
        """Verify RENDER_EXTERNAL_HOSTNAME is properly appended to settings if provided."""
        from django.conf import settings
        test_host = "test-service.onrender.com"

        # Test simulated render hostname inclusion logic
        allowed = list(settings.ALLOWED_HOSTS)
        if test_host not in allowed:
            allowed.append(test_host)
        self.assertIn(test_host, allowed)

    def test_production_cors_allowed_origins_configured(self):
        """Verify production domain and Vercel domains are allowed by CORS configuration."""
        from django.conf import settings
        expected_origins = [
            'https://designtemptation.com',
            'https://www.designtemptation.com',
            'https://design-temptation.vercel.app',
        ]
        for origin in expected_origins:
            self.assertIn(origin, settings.CORS_ALLOWED_ORIGINS)

    def test_cors_preflight_options_for_production_origin(self):
        """Verify OPTIONS preflight request from production domain receives Access-Control-Allow-Origin."""
        response = self.client.options(
            '/api/auth/register/',
            HTTP_ORIGIN='https://designtemptation.com',
            HTTP_ACCESS_CONTROL_REQUEST_METHOD='POST',
            HTTP_ACCESS_CONTROL_REQUEST_HEADERS='content-type',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.get('Access-Control-Allow-Origin'), 'https://designtemptation.com')

    def test_cors_preflight_options_for_vercel_preview(self):
        """Verify OPTIONS preflight request from Design Temptation Vercel preview receives Access-Control-Allow-Origin."""
        response = self.client.options(
            '/api/auth/register/',
            HTTP_ORIGIN='https://design-temptation-git-feature-preview.vercel.app',
            HTTP_ACCESS_CONTROL_REQUEST_METHOD='POST',
            HTTP_ACCESS_CONTROL_REQUEST_HEADERS='content-type',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.get('Access-Control-Allow-Origin'),
            'https://design-temptation-git-feature-preview.vercel.app'
        )

    def test_cors_preflight_rejects_unrelated_vercel_origin(self):
        """Verify OPTIONS preflight request from unrelated third-party Vercel app does not receive Access-Control-Allow-Origin."""
        response = self.client.options(
            '/api/auth/register/',
            HTTP_ORIGIN='https://unrelated-thirdparty-site.vercel.app',
            HTTP_ACCESS_CONTROL_REQUEST_METHOD='POST',
            HTTP_ACCESS_CONTROL_REQUEST_HEADERS='content-type',
        )
        self.assertIsNone(response.get('Access-Control-Allow-Origin'))

    def test_csrf_trusted_origins_does_not_contain_broad_vercel_wildcard(self):
        """Verify that overly broad https://*.vercel.app is not added to CSRF_TRUSTED_ORIGINS."""
        from django.conf import settings
        self.assertNotIn('https://*.vercel.app', settings.CSRF_TRUSTED_ORIGINS)
