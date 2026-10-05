import { Project, ProductItem, Review, NavItem, ServiceItem, StatItem, ClientItem, ProcessStep, TransformationItem } from "@/types";

export const BRAND = {
  name: "DESIGN TEMPTATION",
  tagline: "INTERIORS & ARCHITECTURE",
  logo: "/images/brand/design-temptation-logo.png",
  founded: "Est. Studio",
  email: "enquiries@designtemptation.com",
  phone: "+91 98200 12345",
  location: "Bengaluru, Karnataka, India",
  address: {
    street: "101, Halasahalli Rd",
    locality: "Kavery Nagar",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560087",
    country: "India",
    full: "101, Halasahalli Rd, Kavery Nagar, Bengaluru, Karnataka 560087, India",
    lines: [
      "101, Halasahalli Rd,",
      "Kavery Nagar,",
      "Bengaluru,",
      "Karnataka 560087,",
      "India",
    ],
  },
  googleMapsUrl: "https://maps.app.goo.gl/JMVT86tY1W3Zc6e79?g_st=iw",
};

/**
 * Standard Indian Rupee (INR) currency formatter
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Phase 3A: Dedicated Navigation
export const DESKTOP_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Studio", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
];

export const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Studio", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Calculator", href: "/calculator" },
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

// Preserving legacy NAV_ITEMS export for backward compatibility
export const NAV_ITEMS: NavItem[] = DESKTOP_NAV_ITEMS;

export const SERVICES: ServiceItem[] = [
  {
    id: "serv-01",
    slug: "residential",
    title: "Residential",
    subtitle: "Private Residences & Villas",
    description: "Refined spatial planning, bespoke joinery, and tactile materiality conceived for private living.",
    image: "/images/services/service-residential.jpg",
    imageAlt: "Luxury minimalist living salon with dark oak joinery and honed travertine floors",
    disciplines: ["Private Villas", "Penthouses", "Spatial Restructuring"],
  },
  {
    id: "serv-02",
    slug: "commercial",
    title: "Commercial",
    subtitle: "Hospitality & Boutique Spaces",
    description: "Elevated environments for boutique hotels, galleries, and executive salons with distinct identity.",
    image: "/images/services/service-commercial.jpg",
    imageAlt: "Boutique gallery and hotel lounge with sculpted furniture and fluted stone walls",
    disciplines: ["Boutique Hotels", "Art Galleries", "Executive Salons"],
  },
  {
    id: "serv-03",
    slug: "architecture",
    title: "Architecture",
    subtitle: "Structural & Spatial Design",
    description: "Harmonious dialogue between exterior site topography, geometric volumes, and natural diurnal light.",
    image: "/images/services/service-architecture.jpg",
    imageAlt: "Modern luxury villa architecture with stone colonnades and reflecting pool",
    disciplines: ["Site Planning", "Facade Conception", "Spatial Volume"],
  },
  {
    id: "serv-04",
    slug: "turnkey",
    title: "Turnkey Execution",
    subtitle: "Artisanal Direction & Realization",
    description: "Meticulous site management, master craftsman coordination, and complete furnishing curation.",
    image: "/images/services/service-turnkey.jpg",
    imageAlt: "Master craftsman inspecting bespoke wood fluting and stone shadow gap detail",
    disciplines: ["Material Procurement", "Joinery Direction", "Handover"],
  },
];

export const CLIENT_LOGOS: ClientItem[] = [
  { id: "c1", name: "Client Logo 01", category: "Private Estate", isPlaceholder: true },
  { id: "c2", name: "Client Logo 02", category: "Hospitality Group", isPlaceholder: true },
  { id: "c3", name: "Client Logo 03", category: "Architectural Trust", isPlaceholder: true },
  { id: "c4", name: "Client Logo 04", category: "Heritage Residence", isPlaceholder: true },
  { id: "c5", name: "Client Logo 05", category: "Private Atelier", isPlaceholder: true },
];

export const STATISTICS: StatItem[] = [
  { id: "stat-01", value: "100+", label: "Projects Completed", numericValue: 100, suffix: "+" },
  { id: "stat-02", value: "5+", label: "Years of Experience", numericValue: 5, suffix: "+" },
  { id: "stat-03", value: "50+", label: "Clients Served", numericValue: 50, suffix: "+" },
  { id: "stat-04", value: "10+", label: "Design Concepts", numericValue: 10, suffix: "+" },
];


export const PROJECT_CATEGORIES = [
  "All",
  "Interior Design",
  "Architecture",
  "Turnkey Execution",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECTS: Project[] = [
  {
    id: "proj-01",
    slug: "contemporary-villa",
    title: "Contemporary Villa",
    location: "Bengaluru, Karnataka",
    category: "Interior Design",
    propertyType: "Private Villa",
    year: "2025",
    area: "6,800 sq.ft",
    shortDescription: "A restrained, light-filled private residence characterized by natural lime plaster, honed stone, and bespoke warm oak joinery.",
    description: "Conceived as a serene sanctuary amidst Bengaluru's vibrant urban fabric, the Contemporary Villa unites rigorous architectural geometry with soft, natural tactility. Diurnal light flows through expansive glass apertures into open-plan living salons, where tailored fluted oak accents, custom monolithic stone elements, and low-profile furniture compose an atmosphere of quiet luxury and enduring grace.",
    designApproach: "Our design approach centered on uninterrupted spatial flow and diurnal choreography. We organized the main living volumes around a central double-height lightwell, utilizing monochromatic limestone flooring and seamless shadow-gap detailing to create an uninterrupted horizon between interior salons and landscaped courtyards.",
    coverImage: "/images/projects/project-01-horizontal.jpg",
    image: "/images/projects/project-01-horizontal.jpg",
    imageAlt: "Contemporary Villa living salon with panoramic floor-to-ceiling glass and honed travertine floors",
    aspectRatio: "horizontal",
    galleryImages: [
      "/images/projects/project-01-horizontal.jpg",
      "/images/services/service-residential.jpg",
      "/images/transformation/transformation-after.jpg",
      "/images/studio/studio-atelier.jpg",
    ],
    scope: [
      "Spatial Master Planning",
      "Interior Architecture & Material Specification",
      "Custom Millwork & Joinery Details",
      "Curated Architectural Lighting",
    ],
    featured: true,
    createdAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "proj-02",
    slug: "atrium-house",
    title: "The Atrium House",
    location: "Bengaluru, Karnataka",
    category: "Architecture",
    propertyType: "Private Residence",
    year: "2024",
    area: "5,400 sq.ft",
    shortDescription: "Sculptural concrete volumes and bespoke timber detailing centered around a dramatic vertical skylit atrium.",
    description: "The Atrium House explores the dramatic tension between heavy structural presence and buoyant, vertical illumination. A monolithic staircase clad in hand-finished micro-cement serves as the spatial spine, connecting private chambers to sunken living gardens illuminated by continuous daylight.",
    designApproach: "Focused on thermal comfort and passive ventilation, the central vertical atrium acts as both a visual anchor and a natural cooling chimney. Materials were limited to raw concrete, quarter-sawn teak, and blackened steel reveals to emphasize honest craftsmanship.",
    coverImage: "/images/projects/project-02-vertical.jpg",
    image: "/images/projects/project-02-vertical.jpg",
    imageAlt: "Sculptural concrete and timber staircase illuminated by a vertical skylight in Atrium House",
    aspectRatio: "vertical",
    galleryImages: [
      "/images/projects/project-02-vertical.jpg",
      "/images/services/service-architecture.jpg",
      "/images/projects/project-03-architectural.jpg",
      "/images/transformation/transformation-before.jpg",
    ],
    scope: [
      "Architectural Conception & Volumes",
      "Structural Micro-cement Engineering",
      "Passive Daylight & Ventilation Choreography",
      "Landscape & Courtyard Integration",
    ],
    featured: true,
    createdAt: "2024-11-20T00:00:00Z",
  },
  {
    id: "proj-03",
    slug: "colonnade-pavilion",
    title: "The Colonnade Pavilion",
    location: "Bengaluru, Karnataka",
    category: "Turnkey Execution",
    propertyType: "Private Estate",
    year: "2025",
    area: "8,200 sq.ft",
    shortDescription: "Complete turnkey realization of an expansive estate framing reflecting waters and quiet stone colonnades.",
    description: "From initial site grading and structural engineering through bespoke millwork installation and final textile dressing, The Colonnade Pavilion represents DESIGN TEMPTATION's comprehensive turnkey execution. Honed Roman travertine colonnades frame an infinity reflecting pool, blending outdoor serenity with interior intimacy.",
    designApproach: "Turnkey execution demanded meticulous oversight across 14 specialist artisan trades. We supervised every tolerance, from custom concealed pivot doors to flush stone transitions, ensuring that the finished estate achieved complete architectural fidelity.",
    coverImage: "/images/projects/project-03-architectural.jpg",
    image: "/images/projects/project-03-architectural.jpg",
    imageAlt: "Fluted stone colonnade bordering an infinity reflecting pool at twilight",
    aspectRatio: "wide",
    galleryImages: [
      "/images/projects/project-03-architectural.jpg",
      "/images/services/service-turnkey.jpg",
      "/images/projects/project-01-horizontal.jpg",
      "/images/cta/cta-atmosphere.jpg",
    ],
    scope: [
      "Turnkey Project Management & Procurement",
      "On-site Architectural Supervision",
      "Bespoke Stone Masonry & Colonnades",
      "Complete Furnishing & Art Curation",
    ],
    featured: true,
    createdAt: "2025-02-10T00:00:00Z",
  },
  {
    id: "proj-04",
    slug: "fluted-oak-gallery",
    title: "The Fluted Oak Gallery",
    location: "Bengaluru, Karnataka",
    category: "Interior Design",
    propertyType: "Penthouse Residence",
    year: "2024",
    area: "4,200 sq.ft",
    shortDescription: "A ceremonial residence defined by full-height dark oak paneling, monolithic travertine, and tailored bronze hardware.",
    description: "Perched above the city skyline, this penthouse reinterprets contemporary apartment living as an intimate, tactile salon. Continuous acoustic fluted oak millwork wraps the formal dining and entertaining areas, concealing private service corridors while providing a dramatic backdrop for the client's private art collection.",
    designApproach: "We created an enveloping material palette to offer sanctuary from external city noise. Custom floor-to-ceiling joinery with integrated linear perimeter lighting washes the walls in a warm 2400K amber glow, while a single monolithic slab of travertine anchors the dining area.",
    coverImage: "/images/projects/project-04-asymmetric.jpg",
    image: "/images/projects/project-04-asymmetric.jpg",
    imageAlt: "Monolithic travertine dining table flanked by fluted dark oak wall paneling",
    aspectRatio: "asymmetric",
    galleryImages: [
      "/images/projects/project-04-asymmetric.jpg",
      "/images/services/service-residential.jpg",
      "/images/studio/studio-atelier.jpg",
    ],
    scope: [
      "Acoustic Millwork Engineering",
      "Monolithic Travertine Furniture Fabrication",
      "Bespoke Warm Luminaire Layout",
      "Artisanal Hardware Detailing",
    ],
    featured: false,
    createdAt: "2024-09-12T00:00:00Z",
  },
  {
    id: "proj-05",
    slug: "olive-grove-residence",
    title: "The Olive Grove Residence",
    location: "Bengaluru Suburbs, Karnataka",
    category: "Architecture",
    propertyType: "Country Villa",
    year: "2025",
    area: "7,400 sq.ft",
    shortDescription: "A continuous spatial dialogue between topography, native landscape, and honed limestone volumes.",
    description: "Settled gently into a sloping green perimeter, The Olive Grove Residence was conceived as an architecture of quiet horizontal planes. Low limestone pavilions frame expansive garden courtyards, blurring the boundary between indoor climate-controlled sanctuaries and open-air verandas.",
    designApproach: "Deep architectural overhangs protect the interior from harsh tropical sun while framing low garden vistas. Natural clay plaster and reclaimed timber beams lend warmth and organic resonance to the structural stone skeleton.",
    coverImage: "/images/services/service-architecture.jpg",
    image: "/images/services/service-architecture.jpg",
    imageAlt: "Low-slung modern villa architecture with stone colonnades and reflecting garden pool",
    aspectRatio: "horizontal",
    galleryImages: [
      "/images/services/service-architecture.jpg",
      "/images/projects/project-01-horizontal.jpg",
      "/images/projects/project-03-architectural.jpg",
    ],
    scope: [
      "Site Topography & Masterplan",
      "Passive Solar Shading Facade",
      "Interior Spatial Alignment",
      "Courtyard & Waterbody Design",
    ],
    featured: false,
    createdAt: "2025-01-28T00:00:00Z",
  },
  {
    id: "proj-06",
    slug: "artisan-atelier-residence",
    title: "Artisan Atelier Residence",
    location: "Bengaluru, Karnataka",
    category: "Turnkey Execution",
    propertyType: "Heritage Residence",
    year: "2024",
    area: "3,600 sq.ft",
    shortDescription: "Artisanal restoration and contemporary interior fit-out executed with surgical detail and custom brass joinery.",
    description: "An expansive heritage residence restored and updated with contemporary MEP infrastructure, hand-applied lime plaster, restored terrazzo floors, and bespoke solid brass joinery crafted by studio artisans.",
    designApproach: "Our turnkey team preserved the soul of the original architecture while rebuilding electrical, plumbing, and climate systems inside concealed architectural cavities, topped with bespoke contemporary cabinetry and patinated metal trims.",
    coverImage: "/images/services/service-turnkey.jpg",
    image: "/images/services/service-turnkey.jpg",
    imageAlt: "Master craftsman inspecting bespoke wood fluting and stone shadow gap detail",
    aspectRatio: "asymmetric",
    galleryImages: [
      "/images/services/service-turnkey.jpg",
      "/images/transformation/transformation-after.jpg",
      "/images/projects/project-04-asymmetric.jpg",
    ],
    scope: [
      "Heritage Structural Stabilization",
      "Concealed MEP Infrastructure",
      "Bespoke Brass & Walnut Joinery",
      "Hand-polished Terrazzo Restoration",
    ],
    featured: false,
    createdAt: "2024-08-15T00:00:00Z",
  },
];

/**
 * Retrieve featured projects for homepage showcase (exactly 3 items)
 */
export function getFeaturedProjects(): Project[] {
  const featured = PROJECTS.filter((p) => p.featured);
  return featured.length >= 3 ? featured.slice(0, 3) : PROJECTS.slice(0, 3);
}

/**
 * Lookup single project by slug
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export const PHILOSOPHY_POINTS = [
  {
    number: "01",
    title: "SPACE",
    subtitle: "Spatial Volume & Proportion",
    description:
      "We calibrate spatial flow, sightlines, and ceiling volumes so architecture naturally fosters quietude, rhythm, and clarity in daily life.",
  },
  {
    number: "02",
    title: "MATERIAL",
    subtitle: "Tactility & Honesty",
    description:
      "We source honest, enduring materials—honed travertine, quarter-sawn oak, raw patinated bronze, and hand-loomed linens that gain character through time.",
  },
  {
    number: "03",
    title: "LIGHT",
    subtitle: "Diurnal Choreography",
    description:
      "Light is treated as an architectural material. We study solar paths and design concealed warm luminaires to sculpt shadow, warmth, and texture.",
  },
  {
    number: "04",
    title: "DETAIL",
    subtitle: "Artisanal Execution",
    description:
      "Uncompromising precision in architectural reveals, flush thresholds, and bespoke joinery junctions where human touch meets master craftsmanship.",
  },
];

export const PRODUCTS: ProductItem[] = [
  {
    id: "prod-01",
    slug: "monolithic-travertine-console",
    name: "Monolithic Travertine Console",
    category: "Living Objects",
    price: "₹6,40,000",
    numericPrice: 640000,
    image: "/images/products/product-console-table.jpg",
    imageAlt: "Bespoke fluted Italian travertine marble console table",
    dimensions: "180cm W × 45cm D × 80cm H",
    material: "Honed Roman Travertine",
    description: "Hand-sculpted fluted Roman travertine console table conceived as a monolithic architectural focal point for formal living salons and reception galleries.",
    featured: true,
    available: true,
  },
  {
    id: "prod-02",
    slug: "cylinder-alabaster-pendant",
    name: "Alabaster & Bronze Cylinder Pendant",
    category: "Architectural Lighting",
    price: "₹2,85,000",
    numericPrice: 285000,
    image: "/images/products/product-pendant-light.jpg",
    imageAlt: "Cast dark bronze and translucent alabaster pendant luminaire",
    dimensions: "16cm Dia × 52cm H",
    material: "Cast Bronze & Spanish Alabaster",
    description: "Translucent Spanish alabaster luminaire suspended from patinated dark bronze hardware, diffusing a warm 2400K architectural glow across dining surfaces.",
    featured: true,
    available: true,
  },
  {
    id: "prod-03",
    slug: "blackened-oak-boucle-chair",
    name: "Bouclé & Blackened Oak Lounge Chair",
    category: "Seating Collection",
    price: "₹4,20,000",
    numericPrice: 420000,
    image: "/images/products/product-lounge-chair.jpg",
    imageAlt: "Architectural blackened oak armchair upholstered in oatmeal bouclé linen",
    dimensions: "82cm W × 88cm D × 74cm H",
    material: "Blackened French Oak & Belgian Linen",
    description: "Low-slung architectural armchair combining hand-blackened French oak joinery with heavy textured Belgian oatmeal bouclé upholstery.",
    featured: true,
    available: true,
  },
];

/**
 * Retrieve curated featured products for homepage preview (2-3 items)
 */
export function getFeaturedProducts(): ProductItem[] {
  const featured = PRODUCTS.filter((p) => p.featured);
  return featured.length > 0 ? featured.slice(0, 3) : PRODUCTS.slice(0, 3);
}

/**
 * Retrieve product by slug
 */
export function getProductBySlug(slug: string): ProductItem | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "CONSULTATION",
    description: "Understand the client's requirements, lifestyle and project vision.",
  },
  {
    step: "02",
    title: "CONCEPT & DESIGN",
    description: "Develop the design direction, layouts, materials and visual concepts.",
  },
  {
    step: "03",
    title: "3D VISUALIZATION",
    description: "Present realistic 3D views and refine the design with the client.",
  },
  {
    step: "04",
    title: "EXECUTION",
    description: "Coordinate execution and bring the approved design into reality.",
  },
];

export const TRANSFORMATION_SHOWCASE: TransformationItem = {
  projectName: "Contemporary Residence",
  location: "Bengaluru, Karnataka",
  description: "A considered transformation focused on light, proportion, material and everyday functionality.",
  beforeImage: "/images/transformation/transformation-before.jpg",
  afterImage: "/images/transformation/transformation-after.jpg",
  beforeAlt: "Contemporary Residence interior shell prior to renovation with bare concrete structure",
  afterAlt: "Completed Contemporary Residence living salon with honed Roman travertine, custom dark walnut millwork, and warm fireplace",
};

export const FEATURED_REVIEW: Review = {
  id: "rev-01",
  quote:
    "DESIGN TEMPTATION transformed our residence into a deeply calm, architectural sanctuary. The exquisite interplay of limestone, natural light, and bespoke oak millwork exceeded every expectation.",
  rating: 5,
  clientName: "Elena & Marcus Vance",
  projectType: "Private Villa Commission",
  location: "Mallorca",
  year: "2025",
};

export const REVIEWS: Review[] = [
  FEATURED_REVIEW,
  {
    id: "rev-02",
    quote:
      "Working with the atelier was an effortless dialogue. Their sensitivity to proportions and natural illumination created spaces that feel both monumental and intimately personal.",
    rating: 5,
    clientName: "David & Claire Sterling",
    projectType: "Duplex Penthouse",
    location: "Kensington, London",
    year: "2024",
  },
  {
    id: "rev-03",
    quote:
      "Every threshold, shadow line, and material transition was executed with quiet mastery. The result is pure serenity that will stand the test of time.",
    rating: 5,
    clientName: "Julian Thorne",
    projectType: "Colonnade Pavilion",
    location: "Lake Como",
    year: "2025",
  },
  {
    id: "rev-04",
    quote:
      "A rare studio that truly listens. They elevated our daily living rituals through restrained spatial geometry and honest tactile materials.",
    rating: 5,
    clientName: "Sofia Al-Mansoor",
    projectType: "Modernist Residence",
    location: "Dubai",
    year: "2025",
  },
  {
    id: "rev-05",
    quote:
      "The precision in joinery details and acoustic balance exceeded anything we envisioned. An absolute joy to experience daily.",
    rating: 5,
    clientName: "Henrik Lindqvist",
    projectType: "Archipelago Retreat",
    location: "Stockholm",
    year: "2024",
  },
  {
    id: "rev-06",
    quote:
      "DESIGN TEMPTATION brought architectural rigor and poetic warmth together seamlessly. Their turnkey execution was utterly flawless.",
    rating: 5,
    clientName: "Beatrice Fontaine",
    projectType: "Heritage Residence",
    location: "Paris",
    year: "2025",
  },
];

export { FAQS, HOMEPAGE_FAQS } from "./faqs";
