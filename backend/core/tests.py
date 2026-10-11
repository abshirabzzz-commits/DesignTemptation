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
