from django.db import models

class ProjectEnquiry(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('Contacted', 'Contacted'),
        ('In Discussion', 'In Discussion'),
        ('Completed', 'Completed'),
        ('Rejected', 'Rejected'),
    ]

    PROJECT_TYPE_CHOICES = [
        ('Interior Design', 'Interior Design'),
        ('Architecture', 'Architecture'),
        ('Turnkey Execution', 'Turnkey Execution'),
        ('Other', 'Other'),
    ]

    PROPERTY_TYPE_CHOICES = [
        ('Apartment', 'Apartment'),
        ('Villa', 'Villa'),
        ('Office', 'Office'),
        ('Shop', 'Shop'),
        ('Other', 'Other'),
    ]

    BUDGET_RANGE_CHOICES = [
        ('Below ₹5 Lakhs', 'Below ₹5 Lakhs'),
        ('₹5–10 Lakhs', '₹5–10 Lakhs'),
        ('₹10–25 Lakhs', '₹10–25 Lakhs'),
        ('₹25–50 Lakhs', '₹25–50 Lakhs'),
        ('₹50 Lakhs+', '₹50 Lakhs+'),
    ]

    full_name = models.CharField(max_length=255, verbose_name="Full Name")
    email = models.EmailField(verbose_name="Email Address")
    phone = models.CharField(max_length=50, verbose_name="Phone / WhatsApp")
    project_type = models.CharField(max_length=100, choices=PROJECT_TYPE_CHOICES, verbose_name="Project Type")
    property_type = models.CharField(max_length=100, choices=PROPERTY_TYPE_CHOICES, verbose_name="Property Type")
    project_location = models.CharField(max_length=255, verbose_name="Project Location")
    project_area = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Approximate Area (sq.ft)"
    )
    budget_range = models.CharField(
        max_length=100,
        choices=BUDGET_RANGE_CHOICES,
        null=True,
        blank=True,
        verbose_name="Budget Range"
    )
    requirements = models.TextField(verbose_name="Project Requirements")
    reference_images = models.FileField(
        upload_to='enquiries/reference_images/',
        null=True,
        blank=True,
        verbose_name="Reference Images"
    )
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default='New',
        verbose_name="Enquiry Status"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Submission Date")

    class Meta:
        verbose_name = "Project Enquiry"
        verbose_name_plural = "Project Enquiries"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} - {self.project_type} ({self.created_at.strftime('%Y-%m-%d')})"
