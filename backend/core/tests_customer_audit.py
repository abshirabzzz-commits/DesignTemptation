from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from products.models import Product, Order, CartItem, WishlistItem

User = get_user_model()

class CustomerSecurityAndWorkflowTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.customer = User.objects.create_user(
            username="customer_audit@designtemptation.com",
            email="customer_audit@designtemptation.com",
            password="SecureCustomerPassword123!",
            first_name="Aria",
            last_name="Shah"
        )
        self.admin = User.objects.create_superuser(
            username="admin_audit@designtemptation.com",
            email="admin_audit@designtemptation.com",
            password="SecureAdminPassword123!",
            first_name="Admin",
            last_name="Director"
        )
        self.product = Product.objects.create(
            name="Brutalist Oak Bench",
            slug="brutalist-oak-bench",
            category="Furniture",
            price="₹75,000",
            numeric_price=75000,
            image="/images/products/product-chair.jpg",
            available=True
        )

    def test_customer_cart_workflow(self):
        # 1. Unauthenticated access blocked
        res = self.client.get("/api/cart/")
        self.assertIn(res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # 2. Authenticated customer can add items to cart
        self.client.force_authenticate(user=self.customer)
        res = self.client.post("/api/cart/", {"product_slug": self.product.slug, "quantity": 2}, format="json")
        self.assertIn(res.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])

        # 3. List cart items
        res = self.client.get("/api/cart/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data.get("total_items"), 2)
        self.assertEqual(res.data.get("total_amount"), 150000)

        # 4. Clear cart
        res = self.client.post("/api/cart/clear/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        res = self.client.get("/api/cart/")
        self.assertEqual(res.data.get("total_items"), 0)

    def test_customer_wishlist_workflow(self):
        # 1. Unauthenticated blocked
        res = self.client.get("/api/wishlist/")
        self.assertIn(res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # 2. Add to wishlist
        self.client.force_authenticate(user=self.customer)
        res = self.client.post("/api/wishlist/", {"product_slug": self.product.slug}, format="json")
        self.assertIn(res.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])

        # 3. List wishlist
        res = self.client.get("/api/wishlist/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

    def test_customer_orders_workflow_and_isolation(self):
        # 1. Place order as authenticated customer
        self.client.force_authenticate(user=self.customer)
        res = self.client.post("/api/orders/", {
            "product": self.product.id,
            "quantity": 1,
            "customer_name": "Aria Shah",
            "customer_email": "customer_audit@designtemptation.com",
            "customer_phone": "9876543210",
            "delivery_address": "88 Lavender Road",
            "city": "Bengaluru",
            "state": "Karnataka",
            "postal_code": "560025",
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data.get("success"))

        # 2. Customer can access own orders
        res = self.client.get("/api/orders/my-orders/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data.get("count"), 1)

        # 3. Customer is STRICTLY FORBIDDEN from accessing the studio-wide order dossier
        res = self.client.get("/api/orders/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # 4. Administrator CAN access the studio-wide order dossier
        self.client.force_authenticate(user=self.admin)
        res = self.client.get("/api/orders/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_google_auth_endpoint_validation(self):
        # 1. Empty credential rejected with 400
        res = self.client.post("/api/auth/google/", {"credential": ""}, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        # 2. Malformed token rejected
        res = self.client.post("/api/auth/google/", {"credential": "not.a.valid.jwt"}, format="json")
        self.assertIn(res.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_401_UNAUTHORIZED])
