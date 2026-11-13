from django.db import models

class Service(models.Model):
    title = models.CharField(max_length=255, verbose_name="Service Name")
    slug = models.SlugField(max_length=255, unique=True, verbose_name="Slug / Key")
    subtitle = models.CharField(max_length=255, blank=True, verbose_name="Subtitle")
    description = models.TextField(verbose_name="Narrative Description")
    image = models.CharField(max_length=500, verbose_name="Cover Image Path or URL")
    image_alt = models.CharField(max_length=255, blank=True, verbose_name="Image Alt Text")
    disciplines = models.JSONField(default=list, blank=True, verbose_name="Disciplines / Pillars")
    order = models.PositiveIntegerField(default=0, verbose_name="Display Order")
    is_active = models.BooleanField(default=True, verbose_name="Active / Visible")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")

    class Meta:
        verbose_name = "Service Offering"
        verbose_name_plural = "Service Offerings"
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.title} ({'Active' if self.is_active else 'Inactive'})"
