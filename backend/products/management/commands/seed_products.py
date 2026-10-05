from django.core.management.base import BaseCommand
from products.models import Product

INITIAL_PRODUCTS = [
    {
        "id": 1,
        "slug": "monolithic-travertine-console",
        "name": "Monolithic Travertine Console",
        "category": "Living Objects",
        "price": "₹6,40,000",
        "numeric_price": 640000,
        "image": "/images/products/product-console-table.jpg",
        "image_alt": "Bespoke fluted Italian travertine marble console table",
        "dimensions": "180cm W × 45cm D × 80cm H",
        "material": "Honed Roman Travertine",
        "description": "Hand-sculpted fluted Roman travertine console table conceived as a monolithic architectural focal point for formal living salons and reception galleries.",
        "featured": True,
        "available": True,
    },
    {
        "id": 2,
        "slug": "cylinder-alabaster-pendant",
        "name": "Alabaster & Bronze Cylinder Pendant",
        "category": "Architectural Lighting",
        "price": "₹2,85,000",
        "numeric_price": 285000,
        "image": "/images/products/product-pendant-light.jpg",
        "image_alt": "Cast dark bronze and translucent alabaster pendant luminaire",
        "dimensions": "16cm Dia × 52cm H",
        "material": "Cast Bronze & Spanish Alabaster",
        "description": "Translucent Spanish alabaster luminaire suspended from patinated dark bronze hardware, diffusing a warm 2400K architectural glow across dining surfaces.",
        "featured": True,
        "available": True,
    },
    {
        "id": 3,
        "slug": "blackened-oak-boucle-chair",
        "name": "Bouclé & Blackened Oak Lounge Chair",
        "category": "Seating Collection",
        "price": "₹4,20,000",
        "numeric_price": 420000,
        "image": "/images/products/product-lounge-chair.jpg",
        "image_alt": "Architectural blackened oak armchair upholstered in oatmeal bouclé linen",
        "dimensions": "82cm W × 88cm D × 74cm H",
        "material": "Blackened French Oak & Belgian Linen",
        "description": "Low-slung architectural armchair combining hand-blackened French oak joinery with heavy textured Belgian oatmeal bouclé upholstery.",
        "featured": True,
        "available": True,
    },
]

class Command(BaseCommand):
    help = "Seed initial studio collection products into the database"

    def handle(self, *args, **options):
        for item in INITIAL_PRODUCTS:
            product, created = Product.objects.update_or_create(
                slug=item["slug"],
                defaults=item
            )
            status_str = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"{status_str} product: {product.name}"))
        self.stdout.write(self.style.SUCCESS("Successfully seeded all products!"))
