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

export interface CustomerProfile {
  phone: string;
  delivery_address: string;
  city: string;
  state: string;
  postal_code: string;
}

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_staff: boolean;
  profile?: CustomerProfile;
}

export interface CartItem {
  id: number;
  product: number;
  product_slug?: string;
  product_details: ProductItem;
  quantity: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: number;
  product: number;
  product_slug?: string;
  product_details: ProductItem;
  created_at: string;
}

export interface OrderRecord {
  id: number;
  order_number: string;
  user?: number | null;
  product: number;
  product_details: ProductItem;
  quantity: number;
  unit_price: number;
  total_amount: number;
  currency: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  state: string;
  postal_code: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  created_at: string;
  updated_at: string;
}


export interface AdminOverviewStats {
  total_projects: number;
  total_products: number;
  total_orders: number;
  pending_orders: number;
  total_enquiries: number;
  pending_enquiries: number;
  total_customers: number;
  gross_revenue: number;
}

export interface RecentActivityItem {
  id: string;
  type: 'order' | 'enquiry' | 'system';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

export interface AdminOverviewData {
  stats: AdminOverviewStats;
  recent_orders: OrderRecord[];
  recent_enquiries: any[];
  recent_activities: RecentActivityItem[];
}

export interface CustomerRecord {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  delivery_address: string;
  city: string;
  state: string;
  postal_code: string;
  is_staff: boolean;
  date_joined: string;
  order_count: number;
  total_spent: number;
}

export interface SiteSettingsData {
  id?: number;
  studio_name: string;
  tagline: string;
  email: string;
  phone: string;
  address_line1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  hero_heading: string;
  hero_subheading: string;
  instagram_url: string;
  maps_url: string;
  updated_at?: string;
}

export interface AdminReviewRecord {
  id: number;
  quote: string;
  rating: number;
  client_name: string;
  project_type: string;
  location: string;
  year: string;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AdminServiceRecord {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  image: string;
  image_alt: string;
  disciplines: string[];
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface AdminProjectRecord {
  id: number;
  slug: string;
  title: string;
  location: string;
  category: string;
  property_type: string;
  year: string;
  area: string;
  short_description: string;
  description: string;
  design_approach: string;
  cover_image: string;
  featured: boolean;
  created_at: string;
  gallery: string[];
}
