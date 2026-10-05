from django.contrib import admin
from .models import ProjectEnquiry

@admin.register(ProjectEnquiry)
class ProjectEnquiryAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'full_name',
        'email',
        'phone',
        'project_type',
        'property_type',
        'project_location',
        'project_area',
        'budget_range',
        'status',
        'created_at',
    )
    list_filter = ('status', 'project_type', 'property_type', 'budget_range', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'project_location', 'requirements')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    list_editable = ('status',)
    fieldsets = (
        ('Client Identification', {
            'fields': ('full_name', 'email', 'phone')
        }),
        ('Project Parameters', {
            'fields': ('project_type', 'property_type', 'project_location', 'project_area', 'budget_range')
        }),
        ('Brief & Materials', {
            'fields': ('requirements', 'reference_images')
        }),
        ('Internal Management', {
            'fields': ('status', 'created_at')
        }),
    )
