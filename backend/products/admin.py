from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'category',
        'price',
        'featured',
        'available',
        'dimensions',
        'created_at',
    )
    list_filter = ('category', 'featured', 'available', 'created_at')
    search_fields = ('name', 'slug', 'category', 'material', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('featured', 'available')
    fieldsets = (
        ('Product Identification', {
            'fields': ('name', 'slug', 'category', 'featured', 'available')
        }),
        ('Pricing & Dimensions', {
            'fields': ('price', 'numeric_price', 'dimensions', 'material')
        }),
        ('Imagery', {
            'fields': ('image', 'image_alt')
        }),
        ('Narrative & Details', {
            'fields': ('description',)
        }),
    )
