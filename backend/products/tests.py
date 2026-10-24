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

        # Create regular authenticated customer
        self.customer = User.objects.create_user(
            username="customer@example.com",
            email="customer@example.com",
            password="CustomerPassword123!",
        )
        self.customer_client = APIClient()
        self.customer_client.force_authenticate(user=self.customer)

        # Create secondary customer to test ID spoofing protection
        self.other_customer = User.objects.create_user(
            username="other_customer@example.com",
            email="other_customer@example.com",
            password="OtherPassword123!",
        )
        self.other_client = APIClient()
        self.other_client.force_authenticate(user=self.other_customer)

    def test_anonymous_cannot_create_order(self):
        payload = {
            "product_slug": self.product.slug,
            "quantity": 2,
            "customer_name": "Anonymous Guest",
            "customer_email": "guest@example.com",
            "customer_phone": "+91 98765 43210",
            "delivery_address": "Flat 402, Embassy Habitat, Vasanth Nagar",
            "city": "Bengaluru",
            "state": "Karnataka",
            "postal_code": "560052",
        }
        response = self.anonymous_client.post("/api/orders/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(response.data.get("success", False))

    def test_authenticated_customer_can_create_order_with_server_computed_total(self):
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
        response = self.customer_client.post("/api/orders/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])

        data = response.data["data"]
        # Verify server overwrote price with canonical database price
        self.assertEqual(data["unit_price"], 640000)
        self.assertEqual(data["total_amount"], 1280000)
        self.assertEqual(data["currency"], "INR")
        self.assertEqual(data["status"], "Pending")
        self.assertTrue(data["order_number"].startswith("DT-ORD-"))

        # Verify order is strictly associated with authenticated customer
        from products.models import Order
        order = Order.objects.get(order_number=data["order_number"])
        self.assertEqual(order.user, self.customer)

    def test_customer_cannot_spoof_different_user_id(self):
        payload = {
            "product_slug": self.product.slug,
            "quantity": 1,
            "customer_name": "Spoof Attempt",
            "customer_email": "customer@example.com",
            "customer_phone": "+91 98765 43210",
            "delivery_address": "100 MG Road",
            "city": "Bengaluru",
            "state": "Karnataka",
            "postal_code": "560001",
            # Attempt to associate order with another customer's ID
            "user": self.other_customer.id,
            "user_id": self.other_customer.id,
        }
        response = self.customer_client.post("/api/orders/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        from products.models import Order
        created_order = Order.objects.get(order_number=response.data["data"]["order_number"])
        self.assertEqual(created_order.user, self.customer)
        self.assertNotEqual(created_order.user, self.other_customer)

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
        response = self.customer_client.post("/api/orders/", payload, format="json")
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
        response = self.customer_client.post("/api/orders/", payload, format="json")
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

    def test_legacy_orders_with_null_user_are_preserved(self):
        from products.models import Order
        legacy_order = Order.objects.create(
            order_number="DT-ORD-LEGACY-01",
            product=self.product,
            user=None,  # Legacy guest order
            quantity=1,
            unit_price=640000,
            total_amount=640000,
            customer_name="Legacy Customer",
            customer_email="customer@example.com",
            customer_phone="+91 98765 00000",
            delivery_address="Legacy Address",
            city="Bengaluru",
            state="Karnataka",
            postal_code="560001",
            status="Pending",
        )
        self.assertIsNone(legacy_order.user)

        # Matching customer can see legacy order through email association in my-orders
        res = self.customer_client.get("/api/orders/my-orders/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        order_numbers = [o["order_number"] for o in res.data["data"]]
        self.assertIn("DT-ORD-LEGACY-01", order_numbers)


class CartAPITestCase(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username="shopper1@example.com",
            email="shopper1@example.com",
            password="Password123!"
        )
        self.client1 = APIClient()
        self.client1.force_authenticate(user=self.user1)

        self.user2 = User.objects.create_user(
            username="shopper2@example.com",
            email="shopper2@example.com",
            password="Password123!"
        )
        self.client2 = APIClient()
        self.client2.force_authenticate(user=self.user2)

        self.product = Product.objects.create(
            name="Honed Marble Credenza",
            slug="honed-marble-credenza",
            category="Living Objects",
            price="₹4,50,000",
            numeric_price=450000,
            image="/images/products/credenza.jpg",
            available=True
        )

    def test_anonymous_cannot_access_cart(self):
        anon_client = APIClient()
        res = anon_client.get("/api/cart/")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_add_and_list_cart_item_with_server_computed_total(self):
        # Add item
        add_res = self.client1.post("/api/cart/", {
            "product_slug": self.product.slug,
            "quantity": 2
        }, format="json")
        self.assertEqual(add_res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(add_res.data["success"])

        # List cart
        list_res = self.client1.get("/api/cart/")
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertEqual(list_res.data["count"], 1)
        self.assertEqual(list_res.data["total_items"], 2)
        self.assertEqual(list_res.data["total_amount"], 900000)
        self.assertEqual(list_res.data["currency"], "INR")

    def test_cart_isolation_between_customers(self):
        # User 1 adds item
        self.client1.post("/api/cart/", {"product_slug": self.product.slug, "quantity": 1}, format="json")

        # User 2 should have empty cart
        res2 = self.client2.get("/api/cart/")
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertEqual(res2.data["count"], 0)
        self.assertEqual(res2.data["total_amount"], 0)

    def test_clear_cart(self):
        self.client1.post("/api/cart/", {"product_slug": self.product.slug, "quantity": 1}, format="json")
        clear_res = self.client1.post("/api/cart/clear/")
        self.assertEqual(clear_res.status_code, status.HTTP_200_OK)

        list_res = self.client1.get("/api/cart/")
        self.assertEqual(list_res.data["count"], 0)


class WishlistAPITestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="wishlist_fan@example.com",
            email="wishlist_fan@example.com",
            password="Password123!"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.product = Product.objects.create(
            name="Brutalist Lounge Chair",
            slug="brutalist-lounge-chair",
            category="Seating Collection",
            price="₹2,75,000",
            numeric_price=275000,
            image="/images/products/chair.jpg",
            available=True
        )

    def test_anonymous_cannot_access_wishlist(self):
        anon_client = APIClient()
        res = anon_client.get("/api/wishlist/")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_add_and_list_wishlist(self):
        add_res = self.client.post("/api/wishlist/", {"product_slug": self.product.slug}, format="json")
        self.assertEqual(add_res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(add_res.data["created"])

        list_res = self.client.get("/api/wishlist/")
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_res.data), 1)
        self.assertEqual(list_res.data[0]["product_details"]["slug"], self.product.slug)

    def test_toggle_wishlist_item(self):
        # Toggle on
        t1 = self.client.post("/api/wishlist/toggle/", {"product_slug": self.product.slug}, format="json")
        self.assertEqual(t1.status_code, status.HTTP_200_OK)
        self.assertTrue(t1.data["in_wishlist"])

        # Toggle off
        t2 = self.client.post("/api/wishlist/toggle/", {"product_slug": self.product.slug}, format="json")
        self.assertEqual(t2.status_code, status.HTTP_200_OK)
        self.assertFalse(t2.data["in_wishlist"])


class MyOrdersAPITestCase(TestCase):
    def setUp(self):
        self.customer = User.objects.create_user(
            username="order_owner@example.com",
            email="order_owner@example.com",
            password="Password123!"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.customer)

        self.other_customer = User.objects.create_user(
            username="other_customer@example.com",
            email="other_customer@example.com",
            password="Password123!"
        )
        self.other_client = APIClient()
        self.other_client.force_authenticate(user=self.other_customer)

        self.product = Product.objects.create(
            name="Alabaster Pendant Luminaire",
            slug="alabaster-pendant-luminaire",
            category="Architectural Lighting",
            price="₹1,85,000",
            numeric_price=185000,
            image="/images/products/luminaire.jpg",
            available=True
        )

        from products.models import Order
        self.order1 = Order.objects.create(
            order_number="DT-ORD-OWNER01",
            user=self.customer,
            product=self.product,
            quantity=1,
            unit_price=185000,
            total_amount=185000,
            customer_name="Order Owner",
            customer_email="order_owner@example.com",
            customer_phone="+91 99999 11111",
            delivery_address="Penthouse 4B",
            city="Bengaluru",
            state="Karnataka",
            postal_code="560001",
            status="Pending"
        )

        self.order2 = Order.objects.create(
            order_number="DT-ORD-OTHER02",
            user=self.other_customer,
            product=self.product,
            quantity=1,
            unit_price=185000,
            total_amount=185000,
            customer_name="Other Customer",
            customer_email="other_customer@example.com",
            customer_phone="+91 88888 22222",
            delivery_address="Apartment 10A",
            city="Mumbai",
            state="Maharashtra",
            postal_code="400001",
            status="Confirmed"
        )

    def test_customer_only_retrieves_own_orders(self):
        res = self.client.get("/api/orders/my-orders/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["success"])
        self.assertEqual(res.data["count"], 1)
        self.assertEqual(res.data["data"][0]["order_number"], "DT-ORD-OWNER01")

    def test_other_customer_cannot_see_different_customer_orders(self):
        res = self.other_client.get("/api/orders/my-orders/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["count"], 1)
        self.assertEqual(res.data["data"][0]["order_number"], "DT-ORD-OTHER02")


class CartAndWishlistAPITests(TestCase):
    def setUp(self):
        self.anonymous_client = APIClient()

        self.user_a = User.objects.create_user(
            username="user_a@example.com",
            email="user_a@example.com",
            password="PasswordA123!"
        )
        self.client_a = APIClient()
        self.client_a.force_authenticate(user=self.user_a)

        self.user_b = User.objects.create_user(
            username="user_b@example.com",
            email="user_b@example.com",
            password="PasswordB123!"
        )
        self.client_b = APIClient()
        self.client_b.force_authenticate(user=self.user_b)

        self.product = Product.objects.create(
            name="Travertine Console",
            slug="travertine-console",
            category="Living Objects",
            price="₹4,50,000",
            numeric_price=450000,
            image="/images/products/console.jpg",
            available=True
        )

    def test_anonymous_cannot_add_to_cart(self):
        res = self.anonymous_client.post(
            "/api/cart/",
            {"product_slug": self.product.slug, "quantity": 1},
            format="json"
        )
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_anonymous_cannot_view_cart(self):
        res = self.anonymous_client.get("/api/cart/")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_customer_can_add_to_cart(self):
        res = self.client_a.post(
            "/api/cart/",
            {"product_slug": self.product.slug, "quantity": 2},
            format="json"
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data["success"])

        # Check list endpoint
        list_res = self.client_a.get("/api/cart/")
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertEqual(list_res.data["count"], 1)
        self.assertEqual(list_res.data["total_items"], 2)

    def test_adding_existing_cart_product_increments_quantity_without_duplicate(self):
        # Add 1
        self.client_a.post(
            "/api/cart/",
            {"product_slug": self.product.slug, "quantity": 1},
            format="json"
        )
        # Add 2 more
        self.client_a.post(
            "/api/cart/",
            {"product_slug": self.product.slug, "quantity": 2},
            format="json"
        )
        list_res = self.client_a.get("/api/cart/")
        self.assertEqual(list_res.data["count"], 1)
        self.assertEqual(list_res.data["total_items"], 3)

    def test_customer_isolation_cart(self):
        # User A adds item
        self.client_a.post(
            "/api/cart/",
            {"product_slug": self.product.slug, "quantity": 1},
            format="json"
        )

        # User B's cart must be empty
        res_b = self.client_b.get("/api/cart/")
        self.assertEqual(res_b.status_code, status.HTTP_200_OK)
        self.assertEqual(res_b.data["count"], 0)
        self.assertEqual(res_b.data["total_items"], 0)

    def test_customer_isolation_wishlist(self):
        # User A toggles wishlist
        self.client_a.post(
            "/api/wishlist/toggle/",
            {"product_slug": self.product.slug},
            format="json"
        )

        # User A has 1 item
        res_a = self.client_a.get("/api/wishlist/")
        self.assertEqual(len(res_a.data), 1)

        # User B has 0 items
        res_b = self.client_b.get("/api/wishlist/")
        self.assertEqual(len(res_b.data), 0)
