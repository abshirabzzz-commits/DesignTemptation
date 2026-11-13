from django.db import models

class SiteSetting(models.Model):
    studio_name = models.CharField(max_length=255, default="DESIGN TEMPTATION", verbose_name="Studio Name")
    tagline = models.CharField(max_length=255, default="INTERIORS & ARCHITECTURE", verbose_name="Tagline")
    email = models.EmailField(default="enquiries@designtemptation.com", verbose_name="Inquiry Email")
    phone = models.CharField(max_length=100, default="+91 98765 43210", blank=True, verbose_name="Phone / WhatsApp")
    address_line1 = models.CharField(max_length=255, default="101, Halasahalli Rd, Kavery Nagar", verbose_name="Address Line")
    city = models.CharField(max_length=100, default="Bengaluru", verbose_name="City")
    state = models.CharField(max_length=100, default="Karnataka", verbose_name="State")
    postal_code = models.CharField(max_length=20, default="560087", verbose_name="Postal / PIN Code")
    country = models.CharField(max_length=100, default="India", verbose_name="Country")
    hero_heading = models.CharField(
        max_length=255,
        default="SPATIAL POETRY IN FORM & LIGHT",
        verbose_name="Hero Headline"
    )
    hero_subheading = models.TextField(
        default="An interior architecture and design atelier in Bengaluru creating quiet, contemplative sanctuaries of monumental tactility, natural light, and bespoke joinery.",
        verbose_name="Hero Narrative"
    )
    instagram_url = models.CharField(
        max_length=500,
        blank=True,
        default="https://instagram.com/designtemptation",
        verbose_name="Instagram Profile URL"
    )
    maps_url = models.CharField(
        max_length=500,
        blank=True,
        default="https://maps.app.goo.gl/JMVT86tY1W3Zc6e79?g_st=iw",
        verbose_name="Google Maps URL"
    )
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Last Updated")

    class Meta:
        verbose_name = "Website & Studio Setting"
        verbose_name_plural = "Website & Studio Settings"

    def __str__(self):
        return f"{self.studio_name} Settings (Updated {self.updated_at.strftime('%Y-%m-%d')})"

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj
