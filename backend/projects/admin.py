from django.contrib import admin
from .models import Project, ProjectImage

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 2
    fields = ('image_url', 'caption', 'order')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'category',
        'property_type',
        'location',
        'year',
        'featured',
        'created_at',
    )
    list_filter = ('category', 'featured', 'property_type', 'created_at')
    search_fields = ('title', 'slug', 'location', 'short_description', 'description')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('featured',)
    inlines = [ProjectImageInline]
    fieldsets = (
        ('Essential Information', {
            'fields': ('title', 'slug', 'location', 'category', 'property_type', 'featured')
        }),
        ('Dimensions & Timeline', {
            'fields': ('year', 'area')
        }),
        ('Project Narrative & Approach', {
            'fields': ('short_description', 'description', 'design_approach')
        }),
        ('Imagery', {
            'fields': ('cover_image',)
        }),
    )


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ('project', 'caption', 'order', 'image_url')
    list_filter = ('project',)
    ordering = ('project', 'order')
