from django.db import models

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('Living Objects', 'Living Objects'),
        ('Architectural Lighting', 'Architectural Lighting'),
        ('Seating Collection', 'Seating Collection'),
        ('Tables & Consoles', 'Tables & Consoles'),
        ('Textiles & Accents', 'Textiles & Accents'),
        ('Other', 'Other'),
    ]

    name = models.CharField(max_length=255, verbose_name="Product Name")
    slug = models.SlugField(max_length=255, unique=True, verbose_name="Slug / URL Key")
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, verbose_name="Category")
    price = models.CharField(max_length=100, verbose_name="Display Price (INR)")
    numeric_price = models.PositiveIntegerField(default=0, verbose_name="Numeric Price (₹)")
    image = models.CharField(max_length=500, verbose_name="Image Path or URL")
    image_alt = models.CharField(max_length=255, blank=True, verbose_name="Image Alt Text")
    dimensions = models.CharField(max_length=200, blank=True, verbose_name="Dimensions")
    material = models.CharField(max_length=200, blank=True, verbose_name="Material")
    description = models.TextField(blank=True, verbose_name="Description")
    featured = models.BooleanField(default=False, verbose_name="Featured on Homepage")
    available = models.BooleanField(default=True, verbose_name="Available for Acquisition")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ['-featured', 'id']

    def __str__(self):
        return f"{self.name} ({self.price})"
