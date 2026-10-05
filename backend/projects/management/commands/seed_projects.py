from django.core.management.base import BaseCommand
from projects.models import Project, ProjectImage

INITIAL_PROJECTS = [
    {
        "slug": "contemporary-villa",
        "title": "Contemporary Villa",
        "location": "Bengaluru, Karnataka",
        "category": "Interior Design",
        "property_type": "Private Villa",
        "year": "2025",
        "area": "6,800 sq.ft",
        "short_description": "A restrained, light-filled private residence characterized by natural lime plaster, honed stone, and bespoke warm oak joinery.",
        "description": "Conceived as a serene sanctuary amidst Bengaluru's vibrant urban fabric, the Contemporary Villa unites rigorous architectural geometry with soft, natural tactility. Diurnal light flows through expansive glass apertures into open-plan living salons, where tailored fluted oak accents, custom monolithic stone elements, and low-profile furniture compose an atmosphere of quiet luxury and enduring grace.",
        "design_approach": "Our design approach centered on uninterrupted spatial flow and diurnal choreography. We organized the main living volumes around a central double-height lightwell, utilizing monochromatic limestone flooring and seamless shadow-gap detailing to create an uninterrupted horizon between interior salons and landscaped courtyards.",
        "cover_image": "/images/projects/project-01-horizontal.jpg",
        "featured": True,
        "gallery": [
            "/images/projects/project-01-horizontal.jpg",
            "/images/services/service-residential.jpg",
            "/images/transformation/transformation-after.jpg",
            "/images/studio/studio-atelier.jpg",
        ],
    },
    {
        "slug": "atrium-house",
        "title": "The Atrium House",
        "location": "Bengaluru, Karnataka",
        "category": "Architecture",
        "property_type": "Private Residence",
        "year": "2024",
        "area": "5,400 sq.ft",
        "short_description": "Sculptural concrete volumes and bespoke timber detailing centered around a dramatic vertical skylit atrium.",
        "description": "The Atrium House explores the dramatic tension between heavy structural presence and buoyant, vertical illumination. A monolithic staircase clad in hand-finished micro-cement serves as the spatial spine, connecting private chambers to sunken living gardens illuminated by continuous daylight.",
        "design_approach": "Focused on thermal comfort and passive ventilation, the central vertical atrium acts as both a visual anchor and a natural cooling chimney. Materials were limited to raw concrete, quarter-sawn teak, and blackened steel reveals to emphasize honest craftsmanship.",
        "cover_image": "/images/projects/project-02-vertical.jpg",
        "featured": True,
        "gallery": [
            "/images/projects/project-02-vertical.jpg",
            "/images/services/service-architecture.jpg",
            "/images/projects/project-03-architectural.jpg",
            "/images/transformation/transformation-before.jpg",
        ],
    },
    {
        "slug": "colonnade-pavilion",
        "title": "The Colonnade Pavilion",
        "location": "Bengaluru, Karnataka",
        "category": "Turnkey Execution",
        "property_type": "Private Estate",
        "year": "2025",
        "area": "8,200 sq.ft",
        "short_description": "Complete turnkey realization of an expansive estate framing reflecting waters and quiet stone colonnades.",
        "description": "From initial site grading and structural engineering through bespoke millwork installation and final textile dressing, The Colonnade Pavilion represents DESIGN TEMPTATION's comprehensive turnkey execution. Honed Roman travertine colonnades frame an infinity reflecting pool, blending outdoor serenity with interior intimacy.",
        "design_approach": "Turnkey execution demanded meticulous oversight across 14 specialist artisan trades. We supervised every tolerance, from custom concealed pivot doors to flush stone transitions, ensuring that the finished estate achieved complete architectural fidelity.",
        "cover_image": "/images/projects/project-03-architectural.jpg",
        "featured": True,
        "gallery": [
            "/images/projects/project-03-architectural.jpg",
            "/images/services/service-turnkey.jpg",
            "/images/projects/project-01-horizontal.jpg",
            "/images/cta/cta-atmosphere.jpg",
        ],
    },
    {
        "slug": "fluted-oak-gallery",
        "title": "The Fluted Oak Gallery",
        "location": "Bengaluru, Karnataka",
        "category": "Interior Design",
        "property_type": "Penthouse Residence",
        "year": "2024",
        "area": "4,200 sq.ft",
        "short_description": "A ceremonial residence defined by full-height dark oak paneling, monolithic travertine, and tailored bronze hardware.",
        "description": "Perched above the city skyline, this penthouse reinterprets contemporary apartment living as an intimate, tactile salon. Continuous acoustic fluted oak millwork wraps the formal dining and entertaining areas, concealing private service corridors while providing a dramatic backdrop for the client's private art collection.",
        "design_approach": "We created an enveloping material palette to offer sanctuary from external city noise. Custom floor-to-ceiling joinery with integrated linear perimeter lighting washes the walls in a warm 2400K amber glow, while a single monolithic slab of travertine anchors the dining area.",
        "cover_image": "/images/projects/project-04-asymmetric.jpg",
        "featured": False,
        "gallery": [
            "/images/projects/project-04-asymmetric.jpg",
            "/images/services/service-residential.jpg",
            "/images/studio/studio-atelier.jpg",
        ],
    },
    {
        "slug": "olive-grove-residence",
        "title": "The Olive Grove Residence",
        "location": "Bengaluru Suburbs, Karnataka",
        "category": "Architecture",
        "property_type": "Country Villa",
        "year": "2025",
        "area": "7,400 sq.ft",
        "short_description": "A continuous spatial dialogue between topography, native landscape, and honed limestone volumes.",
        "description": "Settled gently into a sloping green perimeter, The Olive Grove Residence was conceived as an architecture of quiet horizontal planes. Low limestone pavilions frame expansive garden courtyards, blurring the boundary between indoor climate-controlled sanctuaries and open-air verandas.",
        "design_approach": "Deep architectural overhangs protect the interior from harsh tropical sun while framing low garden vistas. Natural clay plaster and reclaimed timber beams lend warmth and organic resonance to the structural stone skeleton.",
        "cover_image": "/images/services/service-architecture.jpg",
        "featured": False,
        "gallery": [
            "/images/services/service-architecture.jpg",
            "/images/projects/project-01-horizontal.jpg",
            "/images/projects/project-03-architectural.jpg",
        ],
    },
    {
        "slug": "artisan-atelier-residence",
        "title": "Artisan Atelier Residence",
        "location": "Bengaluru, Karnataka",
        "category": "Turnkey Execution",
        "property_type": "Heritage Residence",
        "year": "2024",
        "area": "3,600 sq.ft",
        "short_description": "Artisanal restoration and contemporary interior fit-out executed with surgical detail and custom brass joinery.",
        "description": "An expansive heritage residence restored and updated with contemporary MEP infrastructure, hand-applied lime plaster, restored terrazzo floors, and bespoke solid brass joinery crafted by studio artisans.",
        "design_approach": "Our turnkey team preserved the soul of the original architecture while rebuilding electrical, plumbing, and climate systems inside concealed architectural cavities, topped with bespoke contemporary cabinetry and patinated metal trims.",
        "cover_image": "/images/services/service-turnkey.jpg",
        "featured": False,
        "gallery": [
            "/images/services/service-turnkey.jpg",
            "/images/transformation/transformation-after.jpg",
            "/images/projects/project-04-asymmetric.jpg",
        ],
    },
]

class Command(BaseCommand):
    help = "Seed initial project data into the database"

    def handle(self, *args, **options):
        for item in INITIAL_PROJECTS:
            gallery_urls = item.pop("gallery", [])
            project, created = Project.objects.update_or_create(
                slug=item["slug"],
                defaults=item
            )
            # Clear and re-populate gallery
            project.gallery_images.all().delete()
            for idx, img_url in enumerate(gallery_urls):
                ProjectImage.objects.create(
                    project=project,
                    image_url=img_url,
                    caption=f"{project.title} detail photograph 0{idx + 1}",
                    order=idx
                )
            status_str = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"{status_str} project: {project.title}"))
        self.stdout.write(self.style.SUCCESS("Successfully seeded all projects!"))
