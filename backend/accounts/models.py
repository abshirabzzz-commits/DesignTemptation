from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

class CustomerProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='customer_profile',
        verbose_name="User Account"
    )
    phone = models.CharField(max_length=50, blank=True, verbose_name="Phone / WhatsApp")
    delivery_address = models.TextField(blank=True, verbose_name="Default Delivery Address")
    city = models.CharField(max_length=100, blank=True, default="Bengaluru", verbose_name="City")
    state = models.CharField(max_length=100, blank=True, default="Karnataka", verbose_name="State")
    postal_code = models.CharField(max_length=20, blank=True, verbose_name="Postal / PIN Code")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Last Updated")

    class Meta:
        verbose_name = "Customer Profile"
        verbose_name_plural = "Customer Profiles"

    def __str__(self):
        return f"Profile of {self.user.get_full_name() or self.user.username} ({self.user.email})"


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_or_save_customer_profile(sender, instance, created, **kwargs):
    if created:
        CustomerProfile.objects.create(user=instance)
    else:
        if hasattr(instance, 'customer_profile'):
            instance.customer_profile.save()
