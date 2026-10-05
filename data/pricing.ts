export type ProjectTypeId =
  | "residential"
  | "commercial"
  | "architecture"
  | "turnkey"
  | "other";

export type PropertyTypeId =
  | "apartment"
  | "villa"
  | "office"
  | "shop"
  | "other";

export type DesignLevelId = "basic" | "premium" | "luxury";

export type OptionalServiceId =
  | "3d_visualization"
  | "custom_furniture"
  | "turnkey_execution";

export interface ProjectTypeOption {
  id: ProjectTypeId;
  label: string;
  tagline: string;
  description: string;
}

export interface PropertyTypeOption {
  id: PropertyTypeId;
  label: string;
  description: string;
  multiplier: number;
}

export interface DesignLevelOption {
  id: DesignLevelId;
  label: string;
  tagline: string;
  description: string;
}

export interface OptionalServiceOption {
  id: OptionalServiceId;
  label: string;
  tagline: string;
  description: string;
  calculationType: "flat" | "per_sqft";
  rate: number; // Flat fee in INR or rate per sq.ft in INR
  displayRateNote: string;
}

export interface CalculatorInputs {
  projectType: ProjectTypeId;
  propertyType: PropertyTypeId;
  areaSqFt: number;
  designLevel: DesignLevelId;
  optionalServices: OptionalServiceId[];
}

export interface OptionalServiceCostBreakdown {
  id: OptionalServiceId;
  label: string;
  cost: number;
  displayRateNote: string;
}

export interface CalculationResult {
  isCustomEstimate: boolean;
  isValid: boolean;
  validationError?: string;
  areaSqFt: number;
  ratePerSqFt: number;
  baseCost: number;
  servicesBreakdown: OptionalServiceCostBreakdown[];
  servicesTotal: number;
  totalCost: number;
  rangeMin: number;
  rangeMax: number;
}

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

/**
 * Reusable Centralized Pricing Configuration
 * Strict separation of pricing rules and data from JSX components.
 */
export const PRICING_CONFIG = {
  projectTypes: [
    {
      id: "residential",
      label: "Residential Interior",
      tagline: "Private living spaces & residences",
      description: "Comprehensive interior spatial design, tailored millwork, and finishes.",
    },
    {
      id: "commercial",
      label: "Commercial Interior",
      tagline: "Offices, studios & retail environments",
      description: "Functional workflow ergonomics, brand identity integration, and commercial durability.",
    },
    {
      id: "architecture",
      label: "Architecture",
      tagline: "Structural envelope & spatial master planning",
      description: "Ground-up architectural massing, structural engineering coordination, and elevations.",
    },
    {
      id: "turnkey",
      label: "Turnkey Project",
      tagline: "Integrated design and complete build execution",
      description: "Single-point delivery spanning concept, civil work, custom FF&E, and handover.",
    },
    {
      id: "other",
      label: "Other",
      tagline: "Bespoke typologies & unique project requirements",
      description: "Custom spatial interventions, multi-disciplinary commissions, or specialized design briefs.",
    },
  ] as ProjectTypeOption[],

  propertyTypes: [
    {
      id: "apartment",
      label: "Apartment",
      description: "High-rise apartments, flats & penthouses",
      multiplier: 1.0,
    },
    {
      id: "villa",
      label: "Villa",
      description: "Stand-alone multi-level residences & estates",
      multiplier: 1.15,
    },
    {
      id: "office",
      label: "Office",
      description: "Corporate workspaces, boutique agencies & studios",
      multiplier: 1.05,
    },
    {
      id: "shop",
      label: "Shop",
      description: "Retail boutiques, showrooms & display lounges",
      multiplier: 1.1,
    },
    {
      id: "other",
      label: "Other",
      description: "Hospitality, recreational or bespoke typologies",
      multiplier: 1.0,
    },
  ] as PropertyTypeOption[],

  designLevels: [
    {
      id: "basic",
      label: "Basic",
      tagline: "Essential refinement & clean spatial balance",
      description: "Curated materials, standard cabinetry, functional lighting layouts, and enduring finishes.",
    },
    {
      id: "premium",
      label: "Premium",
      tagline: "Elevated bespoke detailing & tactile materiality",
      description: "Custom architectural joinery, designer veneers, Italian stoneware, and sculpted lighting schemes.",
    },
    {
      id: "luxury",
      label: "Luxury",
      tagline: "Uncompromised atelier curation & imported stones",
      description: "Handcrafted master joinery, rare marbles, automated lighting integration, and museum-grade finishes.",
    },
  ] as DesignLevelOption[],

  optionalServices: [
    {
      id: "3d_visualization",
      label: "3D Visualization",
      tagline: "CGI renders & virtual walkthroughs",
      description: "High-definition photorealistic 3D perspectives for comprehensive spatial preview.",
      calculationType: "flat",
      rate: 45000,
      displayRateNote: "Flat ₹45,000 package",
    },
    {
      id: "custom_furniture",
      label: "Custom Furniture",
      tagline: "Bespoke joinery & artisan furnishings",
      description: "Custom-manufactured seating, dining centerpieces, and tailored architectural cabinetry.",
      calculationType: "per_sqft",
      rate: 350,
      displayRateNote: "₹350 / sq.ft",
    },
    {
      id: "turnkey_execution",
      label: "Turnkey Execution",
      tagline: "Full site supervision & execution coordination",
      description: "Dedicated project management, contractor oversight, procurement, and quality assurance.",
      calculationType: "per_sqft",
      rate: 450,
      displayRateNote: "₹450 / sq.ft",
    },
  ] as OptionalServiceOption[],

  /**
   * Base rate in INR per sq.ft by Project Type and Design Level.
   * Notice: 'other' is intentionally excluded so no artificial price is computed.
   */
  baseRatesPerSqFt: {
    residential: {
      basic: 1400,
      premium: 2400,
      luxury: 3800,
    },
    commercial: {
      basic: 1600,
      premium: 2700,
      luxury: 4200,
    },
    architecture: {
      basic: 950,
      premium: 1800,
      luxury: 2900,
    },
    turnkey: {
      basic: 2200,
      premium: 3800,
      luxury: 5800,
    },
  } as Record<Exclude<ProjectTypeId, "other">, Record<DesignLevelId, number>>,

  rangeVariance: {
    lowerBound: 0.1, // -10%
    upperBound: 0.15, // +15%
  },

  defaultInputs: {
    projectType: "residential" as ProjectTypeId,
    propertyType: "apartment" as PropertyTypeId,
    areaSqFt: 1500,
    designLevel: "premium" as DesignLevelId,
    optionalServices: ["3d_visualization"] as OptionalServiceId[],
  },

  limits: {
    minArea: 50,
    maxArea: 100000,
    defaultPresets: [600, 1200, 1800, 2500, 4000, 6000],
  },
};

/**
 * Calculates dynamic project cost based on user parameters.
 * Pure deterministic function - perfectly testable and isolated.
 */
export function calculateProjectCost(inputs: CalculatorInputs): CalculationResult {
  const { projectType, propertyType, areaSqFt, designLevel, optionalServices } = inputs;

  // 1. Check if 'Other' is selected - explicitly return Custom Estimate state without fake price
  if (projectType === "other") {
    return {
      isCustomEstimate: true,
      isValid: true,
      areaSqFt: isNaN(areaSqFt) || areaSqFt < 0 ? 0 : areaSqFt,
      ratePerSqFt: 0,
      baseCost: 0,
      servicesBreakdown: [],
      servicesTotal: 0,
      totalCost: 0,
      rangeMin: 0,
      rangeMax: 0,
    };
  }

  // 2. Validate Area
  if (isNaN(areaSqFt) || areaSqFt <= 0) {
    return {
      isCustomEstimate: false,
      isValid: false,
      validationError: "Please enter a valid project area (greater than 0 sq.ft) to generate an estimate.",
      areaSqFt: 0,
      ratePerSqFt: 0,
      baseCost: 0,
      servicesBreakdown: [],
      servicesTotal: 0,
      totalCost: 0,
      rangeMin: 0,
      rangeMax: 0,
    };
  }

  const safeArea = Math.min(Math.max(areaSqFt, 1), PRICING_CONFIG.limits.maxArea);

  // 3. Determine base rate per sq.ft
  const ratesForType = PRICING_CONFIG.baseRatesPerSqFt[projectType];
  const rawBaseRate = ratesForType?.[designLevel] ?? 2000;
  const propertyMultiplier =
    PRICING_CONFIG.propertyTypes.find((p) => p.id === propertyType)?.multiplier ?? 1.0;

  const ratePerSqFt = Math.round(rawBaseRate * propertyMultiplier);

  // 4. Calculate Base Cost: Area × Rate Per Sq.Ft
  const baseCost = Math.round(safeArea * ratePerSqFt);

  // 5. Calculate selected optional services
  const servicesBreakdown: OptionalServiceCostBreakdown[] = [];
  let servicesTotal = 0;

  for (const serviceId of optionalServices) {
    const serviceDef = PRICING_CONFIG.optionalServices.find((s) => s.id === serviceId);
    if (!serviceDef) continue;

    let serviceCost = 0;
    if (serviceDef.calculationType === "flat") {
      serviceCost = serviceDef.rate;
    } else if (serviceDef.calculationType === "per_sqft") {
      serviceCost = Math.round(safeArea * serviceDef.rate);
    }

    servicesBreakdown.push({
      id: serviceDef.id,
      label: serviceDef.label,
      cost: serviceCost,
      displayRateNote: serviceDef.displayRateNote,
    });

    servicesTotal += serviceCost;
  }

  // 6. Total Cost = Base Cost + Optional Services
  const totalCost = baseCost + servicesTotal;

  // 7. Calculate realistic estimated range
  const rangeMin = Math.round(totalCost * (1 - PRICING_CONFIG.rangeVariance.lowerBound));
  const rangeMax = Math.round(totalCost * (1 + PRICING_CONFIG.rangeVariance.upperBound));

  return {
    isCustomEstimate: false,
    isValid: true,
    areaSqFt: safeArea,
    ratePerSqFt,
    baseCost,
    servicesBreakdown,
    servicesTotal,
    totalCost,
    rangeMin,
    rangeMax,
  };
}
