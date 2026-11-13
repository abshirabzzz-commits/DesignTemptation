from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from reviews.models import Review
from services.models import Service
from site_settings.models import SiteSetting
from projects.models import Project
from products.models import Product, Order

User = get_user_model()

class AdminDashboardIntegrationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username="testadmin@designtemptation.com",
            email="testadmin@designtemptation.com",
            password="AdminPassword123!",
            first_name="Studio",
            last_name="Director"
        )
        self.customer_user = User.objects.create_user(
            username="client@example.com",
            email="client@example.com",
            password="ClientPassword123!",
            first_name="Client",
            last_name="User"
        )

        # Seed sample project
        self.project = Project.objects.create(
            title="Aura Villa",
            slug="aura-villa",
            location="Bengaluru",
            category="Interior Design",
            short_description="A serene villa.",
            description="Detailed narrative of Aura Villa.",
            cover_image="/images/projects/project-01-horizontal.jpg",
            featured=True
        )

        # Seed sample product
        self.product = Product.objects.create(
            name="Alabaster Sconce",
            slug="alabaster-sconce",
            category="Architectural Lighting",
            price="₹1,20,000",
            numeric_price=120000,
            image="/images/products/product-pendant-light.jpg"
        )

        # Seed sample order
        self.order = Order.objects.create(
            order_number="DT-ORD-TEST123",
            user=self.customer_user,
            product=self.product,
            quantity=1,
            unit_price=120000,
            total_amount=120000,
            customer_name="Client User",
            customer_email="client@example.com",
            customer_phone="9876543210",
            delivery_address="42 Green Park",
            city="Bengaluru",
            state="Karnataka",
            postal_code="560001",
            status="Pending"
        )

    def test_admin_overview_requires_staff_credentials(self):
        # 1. Unauthenticated request rejected with 401
        res = self.client.get('/api/admin/overview/')
        self.assertIn(res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # 2. Customer user rejected with 403
        self.client.force_authenticate(user=self.customer_user)
        res = self.client.get('/api/admin/overview/')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # 3. Staff user granted access with 200
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get('/api/admin/overview/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['success'])
        self.assertGreaterEqual(res.data['stats']['total_projects'], 1)
        self.assertGreaterEqual(res.data['stats']['total_orders'], 1)
        self.assertEqual(res.data['stats']['gross_revenue'], 120000)

    def test_customer_management_endpoints(self):
        # 1. Forbidden for regular customers
        self.client.force_authenticate(user=self.customer_user)
        res = self.client.get('/api/admin/customers/')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # 2. Permitted for admin
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get('/api/admin/customers/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['success'])
        self.assertGreaterEqual(res.data['count'], 2)

        # 3. Search customers
        res = self.client.get('/api/admin/customers/?search=client@example.com')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['count'], 1)
        self.assertEqual(res.data['data'][0]['email'], 'client@example.com')

    def test_image_upload_endpoint(self):
        # 1. Reject unauthorized
        self.client.force_authenticate(user=self.customer_user)
        dummy_file = SimpleUploadedFile("test.jpg", b"fake image content", content_type="image/jpeg")
        res = self.client.post('/api/upload/', {'file': dummy_file}, format='multipart')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # 2. Accept staff upload
        self.client.force_authenticate(user=self.admin_user)
        dummy_file = SimpleUploadedFile("hero.png", b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR", content_type="image/png")
        res = self.client.post('/api/upload/', {'file': dummy_file}, format='multipart')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.json()['success'])
        self.assertIn('/media/uploads/', res.json()['url'])

    def test_reviews_crud_and_moderation(self):
        # 1. Create review as admin
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.post('/api/reviews/', {
            "client_name": "Sarah Connor",
            "quote": "Incredible attention to tactile luxury.",
            "rating": 5,
            "project_type": "Penthouse",
            "location": "Bengaluru",
            "is_approved": False,
            "is_featured": False
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        rev_id = res.data['id']

        # 2. Public cannot see unapproved review
        self.client.force_authenticate(user=None)
        res = self.client.get('/api/reviews/')
        self.assertNotIn(rev_id, [r['id'] for r in res.data if isinstance(r, dict)])

        # 3. Admin can approve review
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.post(f'/api/reviews/{rev_id}/toggle_approval/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['is_approved'])

        # 4. Public can now see approved review
        self.client.force_authenticate(user=None)
        res = self.client.get('/api/reviews/')
        self.assertIn(rev_id, [r['id'] for r in res.data if isinstance(r, dict)])

    def test_services_crud(self):
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.post('/api/services/', {
            "title": "Landscape Architecture",
            "slug": "landscape-architecture",
            "subtitle": "Outdoor Living & Reflection Pools",
            "description": "Harmonious courtyards and water features.",
            "image": "/images/services/service-architecture.jpg",
            "disciplines": ["Courtyards", "Reflection Pools"],
            "order": 5,
            "is_active": True
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # Retrieve by slug
        res = self.client.get('/api/services/landscape-architecture/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['title'], "Landscape Architecture")

    def test_site_settings_endpoint(self):
        # 1. Public can read
        self.client.force_authenticate(user=None)
        res = self.client.get('/api/settings/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['data']['studio_name'], "DESIGN TEMPTATION")

        # 2. Public cannot update
        res = self.client.patch('/api/settings/', {"studio_name": "Hacked Name"}, format='json')
        self.assertIn(res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # 3. Admin can update
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.patch('/api/settings/', {"phone": "+91 99999 88888"}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['data']['phone'], "+91 99999 88888")
