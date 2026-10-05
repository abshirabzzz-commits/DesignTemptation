from django.db import models

class Project(models.Model):
    CATEGORY_CHOICES = [
        ('Interior Design', 'Interior Design'),
        ('Architecture', 'Architecture'),
        ('Turnkey Execution', 'Turnkey Execution'),
    ]

    PROPERTY_TYPE_CHOICES = [
        ('Private Villa', 'Private Villa'),
        ('Private Residence', 'Private Residence'),
        ('Penthouse Residence', 'Penthouse Residence'),
        ('Country Villa', 'Country Villa'),
        ('Heritage Residence', 'Heritage Residence'),
        ('Private Estate', 'Private Estate'),
        ('Boutique Commercial', 'Boutique Commercial'),
        ('Other', 'Other'),
    ]

    title = models.CharField(max_length=255, verbose_name="Project Name")
    slug = models.SlugField(max_length=255, unique=True, verbose_name="Slug / URL Identifier")
    location = models.CharField(max_length=255, verbose_name="Location")
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, verbose_name="Category")
    property_type = models.CharField(max_length=100, choices=PROPERTY_TYPE_CHOICES, default='Private Villa', verbose_name="Property Type")
    year = models.CharField(max_length=50, default="2025", verbose_name="Year Completed")
    area = models.CharField(max_length=100, blank=True, verbose_name="Built-Up Area")
    short_description = models.CharField(max_length=350, verbose_name="Short Description")
    description = models.TextField(verbose_name="Full Description / Narrative")
    design_approach = models.TextField(blank=True, verbose_name="Design Approach / Concept")
    cover_image = models.CharField(max_length=500, verbose_name="Cover Image Path or URL")
    featured = models.BooleanField(default=False, verbose_name="Featured on Homepage")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")

    class Meta:
        verbose_name = "Project"
        verbose_name_plural = "Projects"
        ordering = ['-featured', '-created_at']

    def __str__(self):
        return f"{self.title} ({self.location})"


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='gallery_images', verbose_name="Project")
    image_url = models.CharField(max_length=500, verbose_name="Image Path or URL")
    caption = models.CharField(max_length=255, blank=True, verbose_name="Caption / Alt Text")
    order = models.PositiveIntegerField(default=0, verbose_name="Display Order")

    class Meta:
        verbose_name = "Gallery Image"
        verbose_name_plural = "Gallery Images"
        ordering = ['order', 'id']

    def __str__(self):
        return f"Gallery Image for {self.project.title} (#{self.order})"
