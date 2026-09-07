export interface ServiceAreaCity {
  id: string;
  name: string;
  tagline: string;
  county: string;
  zipCodes: string[];
  medianRent: string;
  avgDaysOnMarket: string;
  propertyTypes: string[];
  ownerContext: string;
  operationalConsiderations: string;
  faqs: { question: string; answer: string }[];
}

export interface RentalProperty {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  price: number;
  deposit: number;
  availableDate: string;
  petsAllowed: boolean;
  petTerms: string;
  propertyType: "Single Family" | "Townhome" | "Condo" | "Luxury Home";
  description: string;
  features: string[];
  imageUrl: string;
  virtualTourAvailable: boolean;
  appFolioApplyUrl: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  highlighted?: boolean;
  rateDescription: string;
  baseFeeValue: number;
  type: "percentage" | "flat" | "leasing_only";
  summary: string;
  vacancyCharge: string;
  bestFor: string;
  features: string[];
}

export const KEYNEST_INFO = {
  name: "KeyNest Realty Property Management",
  shortName: "KeyNest Realty",
  entityName: "DoubleDee LLC d/b/a KeyNest Realty",
  brokerage: "Fair Deal Realty Inc.",
  brokerageFullLine: "KeyNest Realty Property Management, under the brokerage of Fair Deal Realty Inc.",
  officeAddress: "4815 State Hwy 121, Suite 2, The Colony, TX 75056",
  phone: "(972) 833-2898",
  emergencyPhone: "(972) 833-2899",
  email: "info@keynestrealty.com",
  leasingEmail: "leasing@keynestrealty.com",
  maintenanceEmail: "maintenance@keynestrealty.com",
  hours: "Monday – Friday: 8:30 AM – 5:30 PM | 24/7 Emergency Dispatch",
  authorizedManagers: [
    {
      name: "Dinesh Donthula",
      title: "Authorized Manager & Head of Operations",
      bio: "Over 15 years of North Texas real estate investment, asset management, and operations experience. Specializing in systematic property operations, investor asset growth, and vendor workflow governance.",
    },
    {
      name: "Purvang Patel",
      title: "Authorized Manager & Managing Director",
      bio: "Technology and process specialist with deep North Texas residential market experience. Champion of transparent accounting, AppFolio technology integration, and customer-first property management.",
    },
  ],
  appFolioOwnerPortalUrl: "https://keynest.appfolio.com/oportal",
  appFolioTenantPortalUrl: "https://keynest.appfolio.com/connect",
  trecIabsUrl: "https://www.trec.texas.gov/forms/information-about-brokerage-services",
  trecConsumerNoticeUrl: "https://www.trec.texas.gov/forms/consumer-protection-notice",
};

export const SERVICE_LIFECYCLE = [
  {
    stageNumber: 1,
    title: "Property Setup & Onboarding",
    audience: "New & Existing Owners",
    keynestActivities: "Rental analysis, readiness review, professional photos, lockbox deployment, and listing syndication preparation.",
    websiteDetails: "Clear disclosure of state exclusions, owner approval milestones, utility transfer protocols, and launch prerequisites before marketing.",
    sla: "Completed within 3–5 business days of agreement execution",
  },
  {
    stageNumber: 2,
    title: "Strategic Marketing & Syndication",
    audience: "Prospective Renters",
    keynestActivities: "Comparative market pricing, multi-channel syndication (Zillow, Realtor.com, Trulia, MLS, social), inquiries handling, and verified self-guided or agent-accompanied showings.",
    websiteDetails: "Adheres strictly to Texas advertising guidelines: transparent listing details with no unsupported promises or guaranteed leasing timelines.",
    sla: "Listings live within 24 hours of turnover completion",
  },
  {
    stageNumber: 3,
    title: "Fair Housing Tenant Screening",
    audience: "Applicants",
    keynestActivities: "Published objective criteria verification: identity verification, credit report evaluation, criminal history review, eviction checks, income verification (3x rent), and rental references.",
    websiteDetails: "Strict Fair Housing compliance, required written authorizations, transparent application fees, and consistent scoring criteria across all applicants.",
    sla: "Average application turnaround 24–48 hours",
  },
  {
    stageNumber: 4,
    title: "Broker-Approved Leasing & Move-In",
    audience: "Owners & Approved Tenants",
    keynestActivities: "Texas REALTORS® standard broker-approved residential lease agreements, custom addenda, digital e-signatures, security deposit collection into Fair Deal Realty trust accounts, and move-in inspection.",
    websiteDetails: "Explicit disclosure that all funds are held in broker-supervised escrow trust accounts in strict compliance with TREC regulations.",
    sla: "Executed prior to possession with funds fully verified",
  },
  {
    stageNumber: 5,
    title: "Rent Collection & Trust Accounting",
    audience: "Current Owners & Tenants",
    keynestActivities: "Convenient online resident portal (ACH, debit, credit), automated reminders, late notice enforcement, monthly owner statements, direct ACH disbursements, and year-end 1099 tax reporting.",
    websiteDetails: "Full transparency on portal cutoff dates (rent due 1st, late after 3rd), late fee distribution policies, and owner disbursement timing (around the 10th of each month).",
    sla: "Direct owner ACH disbursements monthly by the 10th–12th",
  },
  {
    stageNumber: 6,
    title: "Maintenance Coordination & Triage",
    audience: "Tenants & Owners",
    keynestActivities: "24/7 emergency intake, tiered triage (emergency, urgent, routine), licensed/insured vendor dispatch, owner spending limit enforcement, invoice reconciliation, and before/after photo documentation.",
    websiteDetails: "Transparent owner repair authority thresholds (default $350–$500). Any non-emergency expense exceeding limit requires explicit owner approval.",
    sla: "Emergencies dispatched within 2 hours; routine within 24–48 hours",
  },
  {
    stageNumber: 7,
    title: "Comprehensive Inspections & Turnover",
    audience: "Property Owners",
    keynestActivities: "Detailed move-in condition documentation, semi-annual periodic property checkups, lease renewal condition audits, move-out itemized inspections with high-res photo archives.",
    websiteDetails: "Documented report delivered to owner portal with photo logs, preventative maintenance recommendations, and tenant security deposit accounting.",
    sla: "Inspection reports published to owner portal within 3 business days",
  },
];

export const MAINTENANCE_STEPS = [
  {
    step: 1,
    title: "Resident Submits Request",
    channel: "AppFolio Portal, Phone, or Emergency Line",
    description: "Tenants submit online with photos and issue details, or call our 24/7 line for urgent issues.",
  },
  {
    step: 2,
    title: "KeyNest Triages Request",
    channel: "Internal Property Operations Team",
    description: "Requests are classified within minutes into Emergency (active flooding, freeze risk, gas smell), Urgent (AC down in summer), or Routine.",
  },
  {
    step: 3,
    title: "Owner Authority Verified",
    channel: "Management Agreement Threshold",
    description: "Work scope is checked against the agreed owner authorization limit ($350–$500). If expected cost exceeds the limit, owner approval is requested immediately.",
  },
  {
    step: 4,
    title: "Licensed Vendor Dispatched",
    channel: "Vetted Contractor Network",
    description: "Work order dispatched to thoroughly vetted, licensed, and insured North Texas technicians with negotiated pricing terms.",
  },
  {
    step: 5,
    title: "Work Documented & Verified",
    channel: "Before & After Photos, Itemized Invoice",
    description: "Technicians document completed repairs with photographic evidence, resident sign-off, and itemized billing.",
  },
  {
    step: 6,
    title: "Owner Reporting & Accounting",
    channel: "AppFolio Owner Portal & Monthly Statement",
    description: "Invoices and photo documentation are logged to the owner portal and reflected cleanly in the monthly distribution statement.",
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "percentage",
    name: "Full Service (Percentage)",
    badge: "Most Popular",
    highlighted: true,
    rateDescription: "8.9% of collected rent",
    baseFeeValue: 8.9,
    type: "percentage",
    summary: "Comprehensive day-to-day property management designed for North Texas rental owners who want hands-off reliability.",
    vacancyCharge: "$0 when vacant — we only earn when you earn",
    bestFor: "Owners seeking full operational freedom with transparent aligned incentives.",
    features: [
      "Zero management fee during vacancy",
      "Full 24/7 maintenance triage & vendor dispatch",
      "Online rent collection & direct ACH owner disbursements",
      "Monthly owner statements & annual 1099 tax package",
      "AppFolio owner & resident portal access",
      "Periodic preventative property inspections",
      "Strict Fair Housing tenant screening & lease enforcement",
      "Broker supervision under Fair Deal Realty Inc.",
    ],
  },
  {
    id: "flat_fee",
    name: "Flat Monthly Fee",
    rateDescription: "$129 / month flat",
    baseFeeValue: 129,
    type: "flat",
    summary: "Predictable, transparent fixed-dollar monthly fee ideal for mid-to-high value North Texas single-family rentals.",
    vacancyCharge: "$0 when vacant",
    bestFor: "Higher-rent homes ($2,200+/mo) where a flat fee delivers significant annual savings.",
    features: [
      "Predictable $129 fixed monthly management fee",
      "Zero management fee while property is vacant",
      "Complete AppFolio portal technology & financial reporting",
      "Online rent collection and automated owner direct deposits",
      "24/7 maintenance intake & dispatch coordination",
      "Move-in and move-out inspection documentation",
      "Direct communication with dedicated property manager",
      "Standard owner authorization spending limits",
    ],
  },
  {
    id: "leasing_only",
    name: "Leasing Only (Placement)",
    rateDescription: "85% of first month's rent",
    baseFeeValue: 85,
    type: "leasing_only",
    summary: "Professional tenant marketing, screening, and lease execution for owners who prefer to self-manage ongoing operations.",
    vacancyCharge: "One-time placement fee upon successful tenant move-in",
    bestFor: "Self-managing landlords who want professional screening and broker-approved leasing.",
    features: [
      "Professional property photos & market readiness consultation",
      "Broad multi-channel listing syndication (MLS, Zillow, etc.)",
      "Accompanied showings & prospective tenant inquiry handling",
      "Rigorous background, credit, eviction & income verification",
      "Texas standard broker-approved residential lease preparation",
      "Security deposit collection into Fair Deal Realty trust account",
      "Comprehensive digital move-in condition photo report",
      "Seamless operational handoff back to the owner",
    ],
  },
];

export const ADD_ON_FEES = [
  { service: "Lease Renewal Fee", fee: "$195", description: "Market rent analysis, tenant lease negotiation, and Texas renewal addendum execution." },
  { service: "Annual Property Inspection", fee: "$125", description: "Interior and exterior inspection with 40+ point condition checklist and photo log." },
  { service: "New Property Onboarding / Setup", fee: "$0 (Waived)", description: "Account setup, lockbox deployment, lease review, and portal configuration." },
  { service: "Maintenance Markup", fee: "0% (At Cost)", description: "We pass through exact vendor invoices with zero hidden surcharges or kickbacks." },
  { service: "Eviction Coordination", fee: "$350 + Legal Costs", description: "Notice to vacate service, attorney coordination, and court appearance support." },
  { service: "Pet Administration", fee: "Paid by Tenant", description: "Pet screening, pet agreement execution, and periodic pet audits at zero cost to owner." },
];

export const SERVICE_CITIES: ServiceAreaCity[] = [
  {
    id: "the-colony",
    name: "The Colony",
    tagline: "Headquarters & Lakeside Community Hub",
    county: "Denton County",
    zipCodes: ["75056"],
    medianRent: "$2,450 / mo",
    avgDaysOnMarket: "18 days",
    propertyTypes: ["Single-Family Homes", "Modern Townhomes", "Lakefront Properties"],
    ownerContext: "KeyNest's central office is located on State Hwy 121 in The Colony. Boasting proximity to Grandscape, Nebraska Furniture Mart, and Lake Lewisville, The Colony attracts strong corporate transferees and long-term families.",
    operationalConsiderations: "Specific city rental registration guidelines apply. KeyNest handles all municipal rental filings and inspection compliance on behalf of owners.",
    faqs: [
      { question: "Does The Colony require annual rental registration?", answer: "Yes, The Colony municipal code requires rental properties to hold a valid residential rental license. KeyNest manages this compliance filing during onboarding." },
      { question: "How quickly can KeyNest respond to maintenance in The Colony?", answer: "Because our headquarters is right on Hwy 121, our response and vendor dispatch times in The Colony are rapid, typically under 1 hour for urgent calls." },
    ],
  },
  {
    id: "frisco",
    name: "Frisco",
    tagline: "High-Growth Executive Rental Corridor",
    county: "Collin & Denton Counties",
    zipCodes: ["75033", "75034", "75035", "75036"],
    medianRent: "$2,850 / mo",
    avgDaysOnMarket: "16 days",
    propertyTypes: ["Executive Single-Family", "Master-Planned Community Homes", "Luxury Townhomes"],
    ownerContext: "Frisco is one of the nation's premier corporate and family hubs, driven by the PGA headquarters, Dallas Cowboys Star, and top-tier Frisco ISD schools. Demand for well-maintained single-family rental homes remains exceptionally strong.",
    operationalConsiderations: "Frisco HOAs have rigorous exterior maintenance and yard upkeep rules. KeyNest actively coordinates seasonal inspections and routine landscaper monitoring to prevent HOA violation notices.",
    faqs: [
      { question: "What credit and income profile do Frisco tenants have?", answer: "Frisco attracts top corporate and tech professionals. Our published criteria verify household income of at least 3x rent, strong credit, and verified background history." },
      { question: "How do you handle strict Frisco HOA covenants?", answer: "We register as the secondary contact on HOA files, monitor correspondence, and ensure tenants strictly adhere to yard maintenance and parking rules." },
    ],
  },
  {
    id: "plano",
    name: "Plano",
    tagline: "Established North Texas Corporate Epicenter",
    county: "Collin & Denton Counties",
    zipCodes: ["75023", "75024", "75025", "75074", "75075", "75093"],
    medianRent: "$2,600 / mo",
    avgDaysOnMarket: "19 days",
    propertyTypes: ["Established Single-Family", "West Plano Luxury Estates", "Legacy Townhomes"],
    ownerContext: "Home to Fortune 500 headquarters like Toyota, Frito-Lay, and Liberty Mutual, Plano offers a stable, mature rental market. Strong school rankings and central access make it an enduring favorite for stable, long-term tenants.",
    operationalConsiderations: "Older West and Central Plano homes benefit from proactive HVAC maintenance and plumbing drain checkups, which KeyNest coordinates before summer heatwaves.",
    faqs: [
      { question: "What is average tenant lease duration in Plano?", answer: "Plano renters show high retention, with over 68% renewing for two or more years when properties are well maintained and communication is transparent." },
    ],
  },
  {
    id: "mckinney",
    name: "McKinney",
    tagline: "Charming Historic Roots & Dynamic Family Neighborhoods",
    county: "Collin County",
    zipCodes: ["75069", "75070", "75071", "75072"],
    medianRent: "$2,400 / mo",
    avgDaysOnMarket: "20 days",
    propertyTypes: ["Modern Master-Planned (Craig Ranch, Stonebridge)", "Historic District Homes", "Suburban Single-Family"],
    ownerContext: "Frequently ranked among America's best places to live, McKinney balances historic Downtown charm with rapid suburban development along US-75 and SH-121. Highly appealing to families seeking top McKinney ISD schools.",
    operationalConsiderations: "Communities like Stonebridge Ranch and Craig Ranch have extensive amenity access cards and strict architectural rules that our team smoothly handles during tenant turnovers.",
    faqs: [
      { question: "Do you handle HOA transfer and pool keys for tenants?", answer: "Yes. KeyNest coordinates amenity pass issuance, gate transponders, and HOA rules sign-off with every incoming resident." },
    ],
  },
  {
    id: "allen",
    name: "Allen",
    tagline: "Thriving Suburb with Top Schools & Prime Retail",
    county: "Collin County",
    zipCodes: ["75002", "75013"],
    medianRent: "$2,550 / mo",
    avgDaysOnMarket: "17 days",
    propertyTypes: ["Single-Family Subdivisions", "Twin Creeks Golf Community", "Upscale Townhomes"],
    ownerContext: "With the renowned Allen Eagle stadium, Watters Creek shopping, and Allen Premium Outlets, Allen draws stable, high-income families prioritizing education and community amenities.",
    operationalConsiderations: "High percentage of long-term owner-investors who appreciate our detailed monthly financial reporting and proactive annual condition audits.",
    faqs: [
      { question: "How does KeyNest market Allen rental properties?", answer: "We syndicate across all major portals, leverage local REALTOR® network distribution through Fair Deal Realty Inc., and coordinate rapid showings." },
    ],
  },
  {
    id: "prosper",
    name: "Prosper",
    tagline: "Premier High-End Suburban Enclave",
    county: "Collin & Denton Counties",
    zipCodes: ["75078"],
    medianRent: "$3,400 / mo",
    avgDaysOnMarket: "22 days",
    propertyTypes: ["Luxury Acreage Estates", "Custom Single-Family", "Windsong Ranch Lagoon Living"],
    ownerContext: "Prosper features expansive luxury developments, resort-style master communities (such as Windsong Ranch), and exceptional school facilities. Rental values are among the highest in North Texas.",
    operationalConsiderations: "Higher-value homes require specialized high-end trade contractors (pool maintenance, smart irrigation, premium appliance repair) vetted by KeyNest.",
    faqs: [
      { question: "Can KeyNest manage homes with pools and smart home systems?", answer: "Yes. We require dedicated weekly pool vendor contracts and conduct specialized equipment inspections on all luxury properties." },
    ],
  },
  {
    id: "celina",
    name: "Celina",
    tagline: "Fastest-Growing Community on the Golden Corridor",
    county: "Collin & Denton Counties",
    zipCodes: ["75009"],
    medianRent: "$2,700 / mo",
    avgDaysOnMarket: "21 days",
    propertyTypes: ["Brand New Construction", "Master-Planned Communities (Light Farms)", "Spacious Acreage"],
    ownerContext: "Celina represents North Texas's explosive growth frontier along the Dallas North Tollway extension. Many rental homes are newly built properties owned by out-of-state or local investors.",
    operationalConsiderations: "Brand new homes often have builder warranty items during the first 1–2 years. KeyNest helps track and coordinate warranty repairs directly with homebuilders.",
    faqs: [
      { question: "How do you handle builder warranty claims for new construction?", answer: "We inspect new homes, document punch-list items, and file warranty tickets directly with builders like Highland, Toll Brothers, and Perry Homes before warranties expire." },
    ],
  },
];

export const FEATURED_RENTALS: RentalProperty[] = [
  {
    id: "colony-lakeside-parkway",
    title: "Modern 4-Bed Home in The Colony",
    address: "4218 Shoreline Trail",
    city: "The Colony",
    state: "TX",
    zip: "75056",
    beds: 4,
    baths: 3,
    sqft: 2650,
    price: 2750,
    deposit: 2750,
    availableDate: "Immediate",
    petsAllowed: true,
    petTerms: "Cats & Dogs welcome ($350 deposit, breed restrictions apply)",
    propertyType: "Single Family",
    description: "Immaculate single-family home minutes from Grandscape and Hwy 121. Features open-concept living, chef's kitchen with granite countertops, stainless appliances, private fenced backyard with covered patio, and attached 2-car garage.",
    features: ["Granite Countertops", "Hardwood-Style Floors", "Covered Patio", "Smart Thermostat", "Sprinkler System", "2-Car Garage"],
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    virtualTourAvailable: true,
    appFolioApplyUrl: "https://keynest.appfolio.com/connect/apply?id=colony-lakeside-parkway",
  },
  {
    id: "frisco-plantation-resort",
    title: "Executive Golf Community Residence",
    address: "11840 Rolling Hills Dr",
    city: "Frisco",
    state: "TX",
    zip: "75035",
    beds: 4,
    baths: 3.5,
    sqft: 3180,
    price: 3350,
    deposit: 3350,
    availableDate: "May 1, 2026",
    petsAllowed: true,
    petTerms: "Small dogs under 30 lbs allowed with approval",
    propertyType: "Luxury Home",
    description: "Stunning two-story Frisco residence zoned for exemplary Frisco ISD schools. Features soaring ceilings, dedicated home office, media room, expansive primary suite with spa bathroom, and peaceful backyard.",
    features: ["Frisco ISD Schools", "Dedicated Office", "Media Room", "Dual Vanities", "Gas Cooktop", "Community Pool Access"],
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    virtualTourAvailable: true,
    appFolioApplyUrl: "https://keynest.appfolio.com/connect/apply?id=frisco-plantation-resort",
  },
  {
    id: "plano-legacy-west",
    title: "Chic Townhome near Legacy West",
    address: "7402 Bishop Rd #14",
    city: "Plano",
    state: "TX",
    zip: "75024",
    beds: 3,
    baths: 2.5,
    sqft: 2150,
    price: 2800,
    deposit: 2800,
    availableDate: "Immediate",
    petsAllowed: false,
    petTerms: "No pets permitted for this unit",
    propertyType: "Townhome",
    description: "Walk to Legacy West and The Shops at Legacy! Premium low-maintenance townhome with rooftop deck, quartz countertops, designer lighting, epoxy garage floor, and energy-efficient construction.",
    features: ["Walk to Legacy West", "Rooftop Terrace", "Quartz Counters", "High Ceilings", "Washer/Dryer Included"],
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    virtualTourAvailable: true,
    appFolioApplyUrl: "https://keynest.appfolio.com/connect/apply?id=plano-legacy-west",
  },
  {
    id: "mckinney-craig-ranch",
    title: "Spacious Family Home in Craig Ranch",
    address: "6820 Red River Dr",
    city: "McKinney",
    state: "TX",
    zip: "75070",
    beds: 4,
    baths: 2.5,
    sqft: 2480,
    price: 2600,
    deposit: 2600,
    availableDate: "June 15, 2026",
    petsAllowed: true,
    petTerms: "Dogs allowed with owner approval",
    propertyType: "Single Family",
    description: "Beautiful Craig Ranch property with access to miles of walking trails, neighborhood parks, and TPC Craig Ranch. Modern floorplan with kitchen island, pantry, spacious secondary bedrooms, and fenced yard.",
    features: ["Craig Ranch Amenities", "Island Kitchen", "Walk-in Closets", "Fenced Backyard", "Community Greenbelt"],
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    virtualTourAvailable: false,
    appFolioApplyUrl: "https://keynest.appfolio.com/connect/apply?id=mckinney-craig-ranch",
  },
  {
    id: "prosper-windsong",
    title: "Resort-Style Home in Windsong Ranch",
    address: "940 Parakeet Way",
    city: "Prosper",
    state: "TX",
    zip: "75078",
    beds: 5,
    baths: 4,
    sqft: 3820,
    price: 4200,
    deposit: 4200,
    availableDate: "Immediate",
    petsAllowed: true,
    petTerms: "Pets welcome with prior verification",
    propertyType: "Luxury Home",
    description: "Exceptional luxury living in Prosper's acclaimed Windsong Ranch. Enjoy access to the 5-acre crystal lagoon, fitness center, and disc golf course. Gourmet kitchen, 3-car garage, secondary suite downstairs.",
    features: ["Crystal Lagoon Access", "3-Car Garage", "Guest Suite Downstairs", "Custom Built-ins", "Expansive Covered Patio"],
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    virtualTourAvailable: true,
    appFolioApplyUrl: "https://keynest.appfolio.com/connect/apply?id=prosper-windsong",
  },
  {
    id: "allen-twin-creeks",
    title: "Updated Single Story in Twin Creeks",
    address: "1405 Cypress Point Ln",
    city: "Allen",
    state: "TX",
    zip: "75013",
    beds: 3,
    baths: 2,
    sqft: 2020,
    price: 2450,
    deposit: 2450,
    availableDate: "July 1, 2026",
    petsAllowed: true,
    petTerms: "Up to 2 domestic pets accepted",
    propertyType: "Single Family",
    description: "Charming single-story brick home located in Allen's prestigious Twin Creeks master development. Upgraded luxury vinyl plank flooring, fresh neutral paint, updated kitchen, and private shaded backyard.",
    features: ["Single Story", "Luxury Vinyl Plank", "Shaded Backyard", "Twin Creeks Pool", "Allen High School"],
    imageUrl: "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=800&q=80",
    virtualTourAvailable: false,
    appFolioApplyUrl: "https://keynest.appfolio.com/connect/apply?id=allen-twin-creeks",
  },
];

export const RENTAL_CRITERIA_POINTS = [
  {
    title: "Income Requirement",
    requirement: "Gross household monthly income must equal at least 3x the monthly rent.",
    details: "Verified via 2 consecutive months of pay stubs, 3 months of bank statements, or official relocation offer letters.",
  },
  {
    title: "Credit Standards",
    requirement: "Consistent payment history with minimum recommended credit score of 620.",
    details: "Scores between 580–619 may be considered with an additional security deposit or qualified guarantor.",
  },
  {
    title: "Rental & Mortgage History",
    requirement: "Minimum of 2 years of verifiable positive rental or homeownership history.",
    details: "Zero broken leases or unpaid balances owed to previous housing providers within the past 5 years.",
  },
  {
    title: "Criminal Background",
    requirement: "Individualized review conducted in strict compliance with HUD guidelines.",
    details: "No felony convictions for violent offenses, distribution of controlled substances, or property crimes.",
  },
  {
    title: "Fair Housing & Equal Opportunity",
    requirement: "Equal opportunity housing provided to all qualified applicants without exception.",
    details: "We strictly comply with federal, Texas state, and local Fair Housing laws prohibiting discrimination based on race, color, religion, sex, disability, familial status, or national origin.",
  },
];
