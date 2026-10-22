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


from django.conf import settings

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    order_number = models.CharField(max_length=64, unique=True, verbose_name="Order Reference")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
        verbose_name="Customer Account"
    )
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='orders', verbose_name="Product")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Quantity")
    unit_price = models.PositiveIntegerField(verbose_name="Unit Price (₹)")
    total_amount = models.PositiveIntegerField(verbose_name="Total Amount (₹)")
    currency = models.CharField(max_length=10, default="INR", verbose_name="Currency")

    # Customer Information
    customer_name = models.CharField(max_length=255, verbose_name="Customer Name")
    customer_email = models.EmailField(verbose_name="Customer Email")
    customer_phone = models.CharField(max_length=50, verbose_name="Phone / WhatsApp")

    # Delivery Information
    delivery_address = models.TextField(verbose_name="Delivery Address")
    city = models.CharField(max_length=100, verbose_name="City")
    state = models.CharField(max_length=100, verbose_name="State")
    postal_code = models.CharField(max_length=20, verbose_name="Postal / PIN Code")
    notes = models.TextField(blank=True, verbose_name="Order Notes / Commission Instructions")

    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending', verbose_name="Order Status")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Order Date")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Last Updated")

    class Meta:
        verbose_name = "Product Order"
        verbose_name_plural = "Product Orders"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.order_number} - {self.customer_name} ({self.product.name} × {self.quantity})"


class CartItem(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart_items',
        verbose_name="Customer Account"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='cart_items',
        verbose_name="Product"
    )
    quantity = models.PositiveIntegerField(default=1, verbose_name="Quantity")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Added At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Last Updated")

    class Meta:
        verbose_name = "Cart Item"
        verbose_name_plural = "Cart Items"
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.product.name} (×{self.quantity})"

    @property
    def subtotal(self):
        return self.product.numeric_price * self.quantity


class WishlistItem(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wishlist_items',
        verbose_name="Customer Account"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='wishlist_items',
        verbose_name="Product"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Saved At")

    class Meta:
        verbose_name = "Wishlist Item"
        verbose_name_plural = "Wishlist Items"
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.product.name}"
