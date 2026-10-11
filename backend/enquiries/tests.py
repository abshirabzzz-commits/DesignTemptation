from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from enquiries.models import ProjectEnquiry

User = get_user_model()

class EnquiryAPIPermissionsTestCase(TestCase):
    def setUp(self):
        self.anonymous_client = APIClient()

        # Existing enquiry in database
        self.enquiry = ProjectEnquiry.objects.create(
            full_name="Aarav Sharma",
            email="aarav.sharma@example.com",
            phone="+91 98765 43210",
            project_type="Interior Design",
            property_type="Apartment",
            project_location="Indiranagar, Bengaluru",
            project_area=2400,
            budget_range="₹25–50 Lakhs",
            requirements="Full interior styling and bespoke woodwork.",
            status="New",
        )

        # Staff user
        self.staff_user = User.objects.create_user(
            username="staff_manager",
            email="manager@designtemptation.com",
            password="SecurePassword123!",
            is_staff=True,
        )
        self.staff_client = APIClient()
        self.staff_client.force_authenticate(user=self.staff_user)

        # Regular non-staff user
        self.regular_user = User.objects.create_user(
            username="regular_client",
            email="regular@example.com",
            password="RegularPassword123!",
            is_staff=False,
        )
        self.regular_client = APIClient()
        self.regular_client.force_authenticate(user=self.regular_user)

    def test_anonymous_can_submit_valid_enquiry(self):
        payload = {
            "full_name": "Priya Nair",
            "email": "priya.nair@example.com",
            "phone": "+91 91234 56789",
            "project_type": "Architecture",
            "property_type": "Villa",
            "project_location": "Whitefield, Bengaluru",
            "requirements": "Architectural drawings and turnkey elevation for a 4BHK duplex.",
        }
        response = self.anonymous_client.post("/api/enquiries/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])
        self.assertTrue(ProjectEnquiry.objects.filter(email="priya.nair@example.com").exists())

    def test_anonymous_submission_invalid_data_returns_400(self):
        payload = {
            "full_name": "",
            "email": "not-an-email",
            "phone": "123",
            "project_type": "Invalid Type",
            "property_type": "Villa",
            "project_location": "",
            "requirements": "Short",
        }
        response = self.anonymous_client.post("/api/enquiries/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["success"])
        self.assertIn("full_name", response.data["errors"])
        self.assertIn("email", response.data["errors"])

    def test_anonymous_cannot_list_enquiries(self):
        """Customer PII must never be publicly accessible via list endpoint."""
        response = self.anonymous_client.get("/api/enquiries/")
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_anonymous_cannot_retrieve_enquiry_detail(self):
        """Customer PII must never be publicly accessible via detail endpoint."""
        response = self.anonymous_client.get(f"/api/enquiries/{self.enquiry.id}/")
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_anonymous_cannot_modify_or_delete_enquiry(self):
        patch_res = self.anonymous_client.patch(
            f"/api/enquiries/{self.enquiry.id}/",
            {"status": "Rejected"},
            format="json"
        )
        self.assertIn(patch_res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        del_res = self.anonymous_client.delete(f"/api/enquiries/{self.enquiry.id}/")
        self.assertIn(del_res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
        self.assertTrue(ProjectEnquiry.objects.filter(id=self.enquiry.id).exists())

    def test_regular_user_cannot_access_enquiries(self):
        response = self.regular_client.get("/api/enquiries/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_user_can_list_and_update_enquiry_status(self):
        list_res = self.staff_client.get("/api/enquiries/")
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(list_res.data) >= 1)

        patch_res = self.staff_client.patch(
            f"/api/enquiries/{self.enquiry.id}/",
            {"status": "Contacted"},
            format="json"
        )
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.enquiry.refresh_from_db()
        self.assertEqual(self.enquiry.status, "Contacted")
