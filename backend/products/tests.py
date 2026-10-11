from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from products.models import Product

User = get_user_model()

class ProductAPIPermissionsTestCase(TestCase):
    def setUp(self):
        self.anonymous_client = APIClient()

        # Create standard test product
        self.product = Product.objects.create(
            name="Sculpted Travertine Console",
            slug="sculpted-travertine-console",
            category="Living Objects",
            price="₹5,80,000",
            numeric_price=580000,
            image="/images/products/console.jpg",
            material="Honed Roman Travertine",
            description="Hand-carved architectural console table.",
            featured=True,
            available=True,
        )

        # Create staff admin user
        self.staff_user = User.objects.create_user(
            username="staff_curator",
            email="curator@designtemptation.com",
            password="SecurePassword123!",
            is_staff=True,
        )
        self.staff_client = APIClient()
        self.staff_client.force_authenticate(user=self.staff_user)

        # Create regular non-staff user
        self.regular_user = User.objects.create_user(
            username="regular_shopper",
            email="shopper@example.com",
            password="ShopperPassword123!",
            is_staff=False,
        )
        self.regular_client = APIClient()
        self.regular_client.force_authenticate(user=self.regular_user)

    def test_public_can_list_products(self):
        response = self.anonymous_client.get("/api/products/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)
        self.assertEqual(response.data[0]["slug"], "sculpted-travertine-console")

    def test_public_can_retrieve_product_by_slug(self):
        response = self.anonymous_client.get(f"/api/products/{self.product.slug}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Sculpted Travertine Console")

    def test_anonymous_cannot_create_product(self):
        payload = {
            "name": "Unauthorized Luminaire",
            "slug": "unauthorized-luminaire",
            "category": "Architectural Lighting",
            "price": "₹1,20,000",
            "numeric_price": 120000,
            "image": "/images/sample-light.jpg",
        }
        response = self.anonymous_client.post("/api/products/", payload, format="json")
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
        self.assertFalse(Product.objects.filter(slug="unauthorized-luminaire").exists())

    def test_anonymous_cannot_update_product(self):
        payload = {
            "name": "Tampered Name",
            "slug": self.product.slug,
            "category": self.product.category,
            "price": "₹10",
            "numeric_price": 10,
            "image": self.product.image,
        }
        response = self.anonymous_client.put(f"/api/products/{self.product.slug}/", payload, format="json")
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
        self.product.refresh_from_db()
        self.assertEqual(self.product.name, "Sculpted Travertine Console")

    def test_anonymous_cannot_partial_update_product(self):
        response = self.anonymous_client.patch(
            f"/api/products/{self.product.slug}/",
            {"price": "₹1,000", "numeric_price": 1000},
            format="json"
        )
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
        self.product.refresh_from_db()
        self.assertEqual(self.product.price, "₹5,80,000")

    def test_anonymous_cannot_delete_product(self):
        response = self.anonymous_client.delete(f"/api/products/{self.product.slug}/")
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
        self.assertTrue(Product.objects.filter(slug=self.product.slug).exists())

    def test_regular_user_cannot_modify_product(self):
        response = self.regular_client.delete(f"/api/products/{self.product.slug}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Product.objects.filter(slug=self.product.slug).exists())

    def test_staff_user_can_create_and_delete_product(self):
        payload = {
            "name": "Alabaster Wall Sconce",
            "slug": "alabaster-wall-sconce",
            "category": "Architectural Lighting",
            "price": "₹1,95,000",
            "numeric_price": 195000,
            "image": "/images/products/sconce.jpg",
            "available": True,
        }
        create_res = self.staff_client.post("/api/products/", payload, format="json")
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Product.objects.filter(slug="alabaster-wall-sconce").exists())

        del_res = self.staff_client.delete(f"/api/products/{payload['slug']}/")
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Product.objects.filter(slug="alabaster-wall-sconce").exists())
