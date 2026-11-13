from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Review(models.Model):
    quote = models.TextField(verbose_name="Review / Testimonial")
    rating = models.PositiveSmallIntegerField(
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Rating (1-5)"
    )
    client_name = models.CharField(max_length=255, verbose_name="Client Name")
    project_type = models.CharField(max_length=255, blank=True, verbose_name="Project / Commission")
    location = models.CharField(max_length=255, blank=True, verbose_name="Location")
    year = models.CharField(max_length=50, default="2025", verbose_name="Commission Year")
    is_approved = models.BooleanField(default=True, verbose_name="Approved for Publication")
    is_featured = models.BooleanField(default=False, verbose_name="Featured on Homepage")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")

    class Meta:
        verbose_name = "Client Review"
        verbose_name_plural = "Client Reviews"
        ordering = ['-is_featured', '-created_at']

    def __str__(self):
        status_text = "Approved" if self.is_approved else "Pending Moderation"
        return f"{self.client_name} ({self.rating}★ - {status_text})"
