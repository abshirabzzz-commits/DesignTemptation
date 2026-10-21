from django.contrib import admin
from .models import Product, Order

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


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'order_number',
        'customer_name',
        'product',
        'quantity',
        'formatted_total',
        'status',
        'created_at',
    )
    list_filter = ('status', 'created_at', 'product')
    search_fields = ('order_number', 'customer_name', 'customer_email', 'customer_phone', 'city')
    list_editable = ('status',)
    readonly_fields = ('order_number', 'created_at', 'updated_at', 'unit_price', 'total_amount')
    fieldsets = (
        ('Order Identification', {
            'fields': ('order_number', 'status', 'created_at', 'updated_at')
        }),
        ('Product & Pricing (INR)', {
            'fields': ('product', 'quantity', 'unit_price', 'total_amount', 'currency')
        }),
        ('Customer Contact', {
            'fields': ('customer_name', 'customer_email', 'customer_phone')
        }),
        ('Delivery Address & Notes', {
            'fields': ('delivery_address', 'city', 'state', 'postal_code', 'notes')
        }),
    )

    def formatted_total(self, obj):
        return f"₹{obj.total_amount:,}"
    formatted_total.short_description = "Total (INR)"
