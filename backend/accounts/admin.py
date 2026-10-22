from django.contrib import admin
from .models import CustomerProfile

@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'city', 'state', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'phone', 'city')
    readonly_fields = ('created_at', 'updated_at')
