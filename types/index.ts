export interface Project {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: "Interior Design" | "Architecture" | "Turnkey Execution" | string;
  propertyType?: string;
  year: string;
  area?: string;
  shortDescription?: string;
  description?: string;
  designApproach?: string;
  coverImage?: string;
  galleryImages?: string[];
  scope?: string[];
  featured?: boolean;
  createdAt?: string;
  // Legacy / visual compatibility
  image: string;
  imageAlt: string;
  aspectRatio?: "horizontal" | "vertical" | "wide" | "asymmetric";
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  imageAlt: string;
  disciplines?: string[];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  note?: string;
  numericValue?: number;
  suffix?: string;
}

export interface TransformationItem {
  id?: string;
  projectName: string;
  location: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
}

export interface ClientItem {
  id: string;
  name: string;
  category: string;
  isPlaceholder?: boolean;
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: string;
  numericPrice?: number;
  image: string;
  imageAlt: string;
  dimensions?: string;
  material?: string;
  description?: string;
  featured?: boolean;
  available?: boolean;
  createdAt?: string;
}

export interface Review {
  id: string;
  quote: string;
  rating: number;
  clientName: string;
  projectType: string;
  location?: string;
  year?: string;
  avatar?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

