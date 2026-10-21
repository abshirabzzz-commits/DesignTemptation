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


class OrderAPIPermissionsTestCase(TestCase):
    def setUp(self):
        self.anonymous_client = APIClient()

        # Create test product
        self.product = Product.objects.create(
            name="Monolithic Travertine Console",
            slug="monolithic-travertine-console",
            category="Living Objects",
            price="₹6,40,000",
            numeric_price=640000,
            image="/images/products/console.jpg",
            available=True,
        )

        self.unavailable_product = Product.objects.create(
            name="Sold Out Armchair",
            slug="sold-out-armchair",
            category="Seating Collection",
            price="₹3,20,000",
            numeric_price=320000,
            image="/images/products/chair.jpg",
            available=False,
        )

        # Create staff admin user
        self.staff_user = User.objects.create_user(
            username="order_admin",
            email="concierge@designtemptation.com",
            password="AdminPassword123!",
            is_staff=True,
        )
        self.staff_client = APIClient()
        self.staff_client.force_authenticate(user=self.staff_user)

    def test_public_can_create_order_with_server_computed_total(self):
        payload = {
            "product_slug": self.product.slug,
            "quantity": 2,
            "customer_name": "Aarav Mehta",
            "customer_email": "aarav@example.com",
            "customer_phone": "+91 98765 43210",
            "delivery_address": "Flat 402, Embassy Habitat, Vasanth Nagar",
            "city": "Bengaluru",
            "state": "Karnataka",
            "postal_code": "560052",
            "notes": "Please arrange white-glove assembly on weekend.",
            # Malicious client attempting to pass price 100
            "unit_price": 100,
            "total_amount": 200,
        }
        response = self.anonymous_client.post("/api/orders/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])

        data = response.data["data"]
        # Verify server overwrote price with canonical database price
        self.assertEqual(data["unit_price"], 640000)
        self.assertEqual(data["total_amount"], 1280000)
        self.assertEqual(data["currency"], "INR")
        self.assertEqual(data["status"], "Pending")
        self.assertTrue(data["order_number"].startswith("DT-ORD-"))

    def test_cannot_order_unavailable_product(self):
        payload = {
            "product_slug": self.unavailable_product.slug,
            "quantity": 1,
            "customer_name": "Rohit Sen",
            "customer_email": "rohit@example.com",
            "customer_phone": "+91 98765 11223",
            "delivery_address": "12 Richmond Road",
            "city": "Bengaluru",
            "state": "Karnataka",
            "postal_code": "560025",
        }
        response = self.anonymous_client.post("/api/orders/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_rejects_invalid_quantity(self):
        payload = {
            "product_slug": self.product.slug,
            "quantity": 0,
            "customer_name": "Rohit Sen",
            "customer_email": "rohit@example.com",
            "customer_phone": "+91 98765 11223",
            "delivery_address": "12 Richmond Road",
            "city": "Bengaluru",
            "state": "Karnataka",
            "postal_code": "560025",
        }
        response = self.anonymous_client.post("/api/orders/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_anonymous_cannot_list_orders(self):
        response = self.anonymous_client.get("/api/orders/")
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_staff_user_can_list_and_update_order_status(self):
        from products.models import Order
        order = Order.objects.create(
            order_number="DT-ORD-TEST01",
            product=self.product,
            quantity=1,
            unit_price=640000,
            total_amount=640000,
            customer_name="Priya Sharma",
            customer_email="priya@example.com",
            customer_phone="+91 9988776655",
            delivery_address="34 Lavelle Road",
            city="Bengaluru",
            state="Karnataka",
            postal_code="560001",
            status="Pending",
        )

        # Staff can list orders
        list_res = self.staff_client.get("/api/orders/")
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)

        # Staff can update status to Confirmed
        patch_res = self.staff_client.patch(
            f"/api/orders/{order.id}/",
            {"status": "Confirmed"},
            format="json"
        )
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.status, "Confirmed")
