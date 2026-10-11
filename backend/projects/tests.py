from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from projects.models import Project

User = get_user_model()

class ProjectAPIPermissionsTestCase(TestCase):
    def setUp(self):
        self.anonymous_client = APIClient()

        # Create standard test project
        self.project = Project.objects.create(
            title="Sovereign Penthouse",
            slug="sovereign-penthouse",
            location="Bengaluru, Karnataka",
            category="Interior Design",
            property_type="Penthouse Residence",
            year="2025",
            area="5,200 sq.ft",
            short_description="Bespoke luxury penthouse with honed travertine finishes.",
            description="Complete interior curation featuring custom joinery and monolithic stone.",
            cover_image="/images/projects/project-01-horizontal.jpg",
            featured=True,
        )

        # Create staff admin user
        self.staff_user = User.objects.create_user(
            username="staff_architect",
            email="staff@designtemptation.com",
            password="SecurePassword123!",
            is_staff=True,
        )
        self.staff_client = APIClient()
        self.staff_client.force_authenticate(user=self.staff_user)

        # Create regular non-staff user
        self.regular_user = User.objects.create_user(
            username="client_user",
            email="client@example.com",
            password="ClientPassword123!",
            is_staff=False,
        )
        self.regular_client = APIClient()
        self.regular_client.force_authenticate(user=self.regular_user)

    def test_public_can_list_projects(self):
        response = self.anonymous_client.get("/api/projects/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)
        self.assertEqual(response.data[0]["slug"], "sovereign-penthouse")

    def test_public_can_retrieve_project_by_slug(self):
        response = self.anonymous_client.get(f"/api/projects/{self.project.slug}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Sovereign Penthouse")

    def test_anonymous_cannot_create_project(self):
        payload = {
            "title": "Unauthorized Residence",
            "slug": "unauthorized-residence",
            "location": "Mumbai",
            "category": "Architecture",
            "year": "2026",
            "short_description": "Attempted unauthorized submission",
            "description": "This should be rejected by DRF permissions.",
            "cover_image": "/images/sample.jpg",
        }
        response = self.anonymous_client.post("/api/projects/", payload, format="json")
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
        self.assertFalse(Project.objects.filter(slug="unauthorized-residence").exists())

    def test_anonymous_cannot_update_project(self):
        payload = {
            "title": "Hacked Title",
            "slug": self.project.slug,
            "location": self.project.location,
            "category": self.project.category,
            "year": self.project.year,
            "short_description": self.project.short_description,
            "description": self.project.description,
            "cover_image": self.project.cover_image,
        }
        response = self.anonymous_client.put(f"/api/projects/{self.project.slug}/", payload, format="json")
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
        self.project.refresh_from_db()
        self.assertEqual(self.project.title, "Sovereign Penthouse")

    def test_anonymous_cannot_partial_update_project(self):
        response = self.anonymous_client.patch(
            f"/api/projects/{self.project.slug}/",
            {"title": "Modified Without Auth"},
            format="json"
        )
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
        self.project.refresh_from_db()
        self.assertEqual(self.project.title, "Sovereign Penthouse")

    def test_anonymous_cannot_delete_project(self):
        response = self.anonymous_client.delete(f"/api/projects/{self.project.slug}/")
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
        self.assertTrue(Project.objects.filter(slug=self.project.slug).exists())

    def test_regular_user_cannot_modify_project(self):
        response = self.regular_client.delete(f"/api/projects/{self.project.slug}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Project.objects.filter(slug=self.project.slug).exists())

    def test_staff_user_can_create_and_delete_project(self):
        payload = {
            "title": "Atelier Curated Residence",
            "slug": "atelier-curated-residence",
            "location": "Hyderabad",
            "category": "Architecture",
            "year": "2026",
            "short_description": "Sculptural concrete estate.",
            "description": "Commission by Design Temptation.",
            "cover_image": "/images/projects/atelier.jpg",
        }
        create_res = self.staff_client.post("/api/projects/", payload, format="json")
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Project.objects.filter(slug="atelier-curated-residence").exists())

        del_res = self.staff_client.delete(f"/api/projects/{payload['slug']}/")
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Project.objects.filter(slug="atelier-curated-residence").exists())
