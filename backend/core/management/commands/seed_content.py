from django.core.management.base import BaseCommand
from reviews.models import Review
from services.models import Service
from site_settings.models import SiteSetting

class Command(BaseCommand):
    help = "Seeds initial Reviews, Services, and Website Settings if not present"

    def handle(self, *args, **options):
        if Review.objects.count() == 0:
            reviews_data = [
                {
                    'quote': 'DESIGN TEMPTATION transformed our residence into a deeply calm, architectural sanctuary. The exquisite interplay of limestone, natural light, and bespoke oak millwork exceeded every expectation.',
                    'rating': 5,
                    'client_name': 'Elena & Marcus Vance',
                    'project_type': 'Private Villa Commission',
                    'location': 'Mallorca',
                    'year': '2025',
                    'is_approved': True,
                    'is_featured': True
                },
                {
                    'quote': 'Working with the atelier was an effortless dialogue. Their sensitivity to proportions and natural illumination created spaces that feel both monumental and intimately personal.',
                    'rating': 5,
                    'client_name': 'David & Claire Sterling',
                    'project_type': 'Duplex Penthouse',
                    'location': 'Kensington, London',
                    'year': '2024',
                    'is_approved': True,
                    'is_featured': False
                },
                {
                    'quote': 'Every threshold, shadow line, and material transition was executed with quiet mastery. The result is pure serenity that will stand the test of time.',
                    'rating': 5,
                    'client_name': 'Julian Thorne',
                    'project_type': 'Colonnade Pavilion',
                    'location': 'Lake Como',
                    'year': '2025',
                    'is_approved': True,
                    'is_featured': False
                },
                {
                    'quote': 'A rare studio that truly listens. They elevated our daily living rituals through restrained spatial geometry and honest tactile materials.',
                    'rating': 5,
                    'client_name': 'Sofia Al-Mansoor',
                    'project_type': 'Modernist Residence',
                    'location': 'Dubai',
                    'year': '2025',
                    'is_approved': True,
                    'is_featured': False
                },
                {
                    'quote': 'The precision in joinery details and acoustic balance exceeded anything we envisioned. An absolute joy to experience daily.',
                    'rating': 5,
                    'client_name': 'Henrik Lindqvist',
                    'project_type': 'Archipelago Retreat',
                    'location': 'Stockholm',
                    'year': '2024',
                    'is_approved': True,
                    'is_featured': False
                },
                {
                    'quote': 'DESIGN TEMPTATION brought architectural rigor and poetic warmth together seamlessly. Their turnkey execution was utterly flawless.',
                    'rating': 5,
                    'client_name': 'Beatrice Fontaine',
                    'project_type': 'Heritage Residence',
                    'location': 'Paris',
                    'year': '2025',
                    'is_approved': True,
                    'is_featured': False
                }
            ]
            for r in reviews_data:
                Review.objects.create(**r)
            self.stdout.write(self.style.SUCCESS(f"Successfully seeded {len(reviews_data)} reviews"))

        if Service.objects.count() == 0:
            services_data = [
                {
                    'slug': 'residential',
                    'title': 'Residential',
                    'subtitle': 'Private Residences & Villas',
                    'description': 'Refined spatial planning, bespoke joinery, and tactile materiality conceived for private living.',
                    'image': '/images/services/service-residential.jpg',
                    'image_alt': 'Luxury minimalist living salon with dark oak joinery and honed travertine floors',
                    'disciplines': ['Private Villas', 'Penthouses', 'Spatial Restructuring'],
                    'order': 1,
                    'is_active': True
                },
                {
                    'slug': 'commercial',
                    'title': 'Commercial',
                    'subtitle': 'Hospitality & Boutique Spaces',
                    'description': 'Elevated environments for boutique hotels, galleries, and executive salons with distinct identity.',
                    'image': '/images/services/service-commercial.jpg',
                    'image_alt': 'Boutique gallery and hotel lounge with sculpted furniture and fluted stone walls',
                    'disciplines': ['Boutique Hotels', 'Art Galleries', 'Executive Salons'],
                    'order': 2,
                    'is_active': True
                },
                {
                    'slug': 'architecture',
                    'title': 'Architecture',
                    'subtitle': 'Structural & Spatial Design',
                    'description': 'Harmonious dialogue between exterior site topography, geometric volumes, and natural diurnal light.',
                    'image': '/images/services/service-architecture.jpg',
                    'image_alt': 'Modern luxury villa architecture with stone colonnades and reflecting pool',
                    'disciplines': ['Site Planning', 'Facade Conception', 'Spatial Volume'],
                    'order': 3,
                    'is_active': True
                },
                {
                    'slug': 'turnkey',
                    'title': 'Turnkey Execution',
                    'subtitle': 'Artisanal Direction & Realization',
                    'description': 'Meticulous site management, master craftsman coordination, and complete furnishing curation.',
                    'image': '/images/services/service-turnkey.jpg',
                    'image_alt': 'Master craftsman inspecting bespoke wood fluting and stone shadow gap detail',
                    'disciplines': ['Material Procurement', 'Joinery Direction', 'Handover'],
                    'order': 4,
                    'is_active': True
                }
            ]
            for s in services_data:
                Service.objects.create(**s)
            self.stdout.write(self.style.SUCCESS(f"Successfully seeded {len(services_data)} services"))

        SiteSetting.load()
        self.stdout.write(self.style.SUCCESS("Initialized SiteSetting"))
