import type { ProductPageConfig } from "./productMarketing.types";

export type { ProductPageConfig } from "./productMarketing.types";

export const TRACTRAC_PLUS: ProductPageConfig = {
  slug: "tractrac-plus",
  metadata: {
    title: "TracTrac Plus",
    description: "Powering the future of mechanisation in Africa.",
  },
  hero: {
    badge: "TracTrac Plus",
    kicker: "Digital backbone for mechanisation.",
    title: "Powering the future of",
    titleHighlight: "mechanisation",
    lede: "TracTrac Plus connects farmers, tractor owners, and mechanisation service providers through real-time booking, GPS tracking, and transparent performance data.",
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760210420/Frame_182_s17wwy.jpg",
    stats: [
      { v: "2,500+", l: "MSPs engaged", sub: "trained & deployed" },
      { v: "160+", l: "Tractors", sub: "plus 280+ implements" },
      { v: "10,000+", l: "Hectares mapped", sub: "digitally tracked" },
      { v: "Live", l: "Dashboards", sub: "real-time impact" },
    ],
    primaryCta: { label: "Partner with us", href: "#cta" },
    secondaryCta: { label: "See features", href: "#features" },
    ghostCta: { label: "Contact sales", href: "/contact" },
  },
  overview: {
    eyebrow: "The platform",
    title: "One system for booking, tracking, and",
    titleHighlight: "proving impact",
    paragraphs: [
      "Fragmented spreadsheets and phone calls cannot scale mechanisation. TracTrac Plus centralises operations so every stakeholder sees the same truth.",
      "From tractor deployment to farm mapping and marketplace listings, the platform is built for transparency, critical for governments, donors, and investors who fund mechanisation at scale.",
    ],
    sideStats: [
      { big: "GPS", variant: "orange", small: "Real-time tractor booking and field deployment tracking" },
      { big: "360°", variant: "dark", small: "Visibility for farmers, owners, MSPs, and programme managers" },
      { big: "API-ready", variant: "orange", small: "Integrates with partner reporting and state systems" },
    ],
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760219658/iPhone_16_-_104_nc0zt4.jpg",
  },
  steps: {
    eyebrow: "Key features",
    title: "Everything mechanisation needs",
    lead: "Technology, data, and transparency for better outcomes on every operation.",
    items: [
      { n: "01", t: "Smart booking", i: "laptop", d: "Connect farmers and tractor owners for real-time, GPS-tracked operations and dispatch." },
      { n: "02", t: "Farm mapping", i: "map", d: "Capture field boundaries and analytics to improve planning and precision farming." },
      { n: "03", t: "Central dashboard", i: "build", d: "Track performance, maintenance schedules, and programme metrics in one place." },
      { n: "04", t: "Reporting", i: "trend", d: "Visual dashboards show utilisation, revenue, and impact for partners and investors." },
      { n: "05", t: "Marketplace", i: "glob", d: "Digital hub to buy, rent, or lease tractors and labour-saving implements." },
      { n: "06", t: "Monitoring", i: "refresh", d: "Live visibility into equipment use, operator performance, and field outcomes." },
    ],
  },
  proof: {
    eyebrow: "Impact snapshot",
    title: "Already driving change",
    lead: "In its first year under the ISSAM Project, TracTrac Plus delivered measurable results across Nigeria.",
    items: [
      { v: "2,500+", l: "MSPs trained & deployed", icon: "users", color: "#FA9413" },
      { v: "160+", l: "Tractors & 280+ implements", icon: "build", color: "#16A34A" },
      { v: "2,500+", l: "Direct & indirect jobs", icon: "award", color: "#60A5FA" },
      { v: "10,000+", l: "Hectares mapped", icon: "map", color: "#FBBF24" },
    ],
  },
  cta: {
    badge: "Partner with TracTrac Plus",
    title: "Ready to deploy mechanisation",
    titleHighlight: "at scale?",
    lead: "Talk to our team about state rollouts, cooperative integrations, or enterprise deployments on TracTrac Plus.",
    primary: { label: "Schedule a briefing", href: "/contact" },
    secondary: { label: "All products", href: "/products" },
    link: { label: "Partner form below", href: "#cta" },
  },
  partnerForm: "partner",
};

export const TRACINVEST: ProductPageConfig = {
  slug: "tracinvest",
  metadata: {
    title: "TracInvest",
    description: "Accelerating mechanisation investment in Nigeria.",
  },
  hero: {
    badge: "TRACINVEST",
    kicker: "Invest in productive assets.",
    title: "Accelerating mechanisation",
    titleHighlight: "investment",
    lede: "A gateway for private and institutional investors into Nigeria's tractors-for-development revolution, blending financial return with verified social impact.",
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760477199/Frame_183_hhbuy0.jpg",
    stats: [
      { v: "ROI+", l: "Data-driven", sub: "utilisation dashboards" },
      { v: "2,000+", l: "MSP network", sub: "trained operators" },
      { v: "Low", l: "Risk profile", sub: "managed operations" },
      { v: "SDG", l: "Aligned", sub: "food security & jobs" },
    ],
    primaryCta: { label: "Partner with us", href: "#cta" },
    secondaryCta: { label: "Investor benefits", href: "#features" },
  },
  overview: {
    eyebrow: "The opportunity",
    title: "Tractors for development with",
    titleHighlight: "transparent returns",
    paragraphs: [
      "Nigeria's arable land and mechanisation gap create durable demand, but investors need verified utilisation, operator quality, and booking pipelines.",
      "TRACINVEST packages tractor assets with TracTrac Plus deployment, trained MSPs, and quarterly reporting so capital reaches productive use faster.",
    ],
    sideStats: [
      { big: "70M+", variant: "orange", small: "Hectares of arable land with mechanisation supply far below demand" },
      { big: "Verified", variant: "dark", small: "Farmer demand clusters surfaced through TracTrac Plus" },
      { big: "Impact+", variant: "orange", small: "Financial ROI paired with jobs, food security, and youth engagement" },
    ],
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760477693/iPhone_16_-_105_1_zyx6sf.png",
  },
  steps: {
    eyebrow: "Investor benefits",
    title: "Built for returns and resilience",
    lead: "Each feature maximises efficiency, reduces risk, and ensures transparent performance.",
    items: [
      { n: "01", t: "Digital deploy", i: "laptop", d: "Access verified farmer demand and service clusters nationwide via TracTrac Plus." },
      { n: "02", t: "Data-driven ROI", i: "trend", d: "Dashboards show tractor utilisation, revenue, and operational performance." },
      { n: "03", t: "Lower risk", i: "build", d: "Centralised operator management, maintenance, and service tracking." },
      { n: "04", t: "Market access", i: "map", d: "Guaranteed booking support within high-demand clusters." },
      { n: "05", t: "Impact brand", i: "award", d: "Every investment contributes to food security, rural jobs, and youth participation." },
    ],
  },
  proof: {
    eyebrow: "Why invest",
    title: "Key advantages",
    lead: "Technology and data enhance transparency, reduce risk, and deliver measurable returns.",
    items: [
      { v: "Proven", l: "TracTrac Plus ecosystem", icon: "laptop", color: "#FA9413" },
      { v: "2,000+", l: "Trained MSPs & mechanics", icon: "users", color: "#16A34A" },
      { v: "Dual", l: "Financial & social ROI", icon: "trend", color: "#60A5FA" },
      { v: "Live", l: "Quarterly investor reports", icon: "refresh", color: "#FBBF24" },
    ],
  },
  cta: {
    badge: "Now accepting investors",
    title: "Put capital to work in",
    titleHighlight: "mechanisation",
    lead: "Schedule a briefing or submit your interest, our team will share pipeline opportunities and impact frameworks.",
    primary: { label: "Schedule a briefing", href: "/contact" },
    secondary: { label: "Download overview", href: "/contact" },
  },
  partnerForm: "join",
};

export const RISE7: ProductPageConfig = {
  slug: "rise7",
  metadata: {
    title: "RISE7",
    description: "Empowering youth and women for sustainable mechanisation ownership.",
  },
  hero: {
    badge: "Rise7",
    kicker: "Seven people. One pathway.",
    title: "Empowering seven to",
    titleHighlight: "scale",
    lede: "Rise7 is a cooperative-based asset financing model, shared ownership and mutual responsibility so groups of seven access mechanisation together.",
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760361449/A5_-_5_usti4u.jpg",
    stats: [
      { v: "7", l: "Members per coop", sub: "shared ownership" },
      { v: "Youth", l: "& women focus", sub: "inclusive by design" },
      { v: "Asset", l: "Financing", sub: "tractors & tools" },
      { v: "Plus", l: "Digital ops", sub: "TracTrac Plus" },
    ],
    primaryCta: { label: "Get involved", href: "#cta" },
    secondaryCta: { label: "How it works", href: "#features" },
  },
  overview: {
    eyebrow: "The model",
    title: "Ownership through",
    titleHighlight: "cooperation",
    paragraphs: [
      "Young people and women are ready to join mechanisation, but individual finance rarely matches the cost of tractors and implements.",
      "Rise7 groups seven members who co-invest, share risk, and operate through TracTrac Plus for bookings, income tracking, and programme reporting.",
    ],
    sideStats: [
      { big: "7", variant: "orange", small: "Members per cooperative unit, shared capital and accountability" },
      { big: "Shared", variant: "dark", small: "Ownership pathways within the mechanisation value chain" },
      { big: "Jobs+", variant: "orange", small: "Operators, agents, technicians, and rural enterprise growth" },
    ],
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760478565/iPhone_16_-_105_3_rem06a.png",
  },
  steps: {
    eyebrow: "Objectives",
    title: "Empowering people, expanding access",
    lead: "Youth and women-led mechanisation with affordable services for smallholder farmers.",
    items: [
      { n: "01", t: "Empower", i: "users", d: "Support youth and women to become certified mechanisation service providers." },
      { n: "02", t: "Access", i: "map", d: "Expand affordable mechanisation services for smallholder farmers." },
      { n: "03", t: "Own together", i: "award", d: "Build shared ownership pathways across the ecosystem." },
      { n: "04", t: "Grow jobs", i: "trend", d: "Create decent work and boost rural enterprise development." },
    ],
  },
  proof: {
    eyebrow: "Key benefits",
    title: "Why Rise7 works",
    lead: "Cooperative financing plus TracTrac's digital backbone lowers barriers and scales impact.",
    items: [
      { v: "Shared", l: "Co-investment model", icon: "users", color: "#FA9413" },
      { v: "Certified", l: "MSP integration", icon: "award", color: "#16A34A" },
      { v: "Linked", l: "Guaranteed demand clusters", icon: "map", color: "#60A5FA" },
      { v: "Tracked", l: "Real-time impact metrics", icon: "laptop", color: "#FBBF24" },
    ],
  },
  cta: {
    badge: "Cooperative partnerships",
    title: "Launch a Rise7 cohort in",
    titleHighlight: "your state",
    lead: "Partner with TracTrac to mobilise cooperatives, finance assets, and monitor outcomes on TracTrac Plus.",
    primary: { label: "Talk to our team", href: "/contact" },
    link: { label: "Submit interest", href: "#cta" },
  },
  partnerForm: "join",
};

export const HALF_WAY: ProductPageConfig = {
  slug: "half-way-to-ownership",
  metadata: {
    title: "Half-Way to Ownership",
    description: "A graduated pathway to mechanisation asset ownership.",
  },
  hero: {
    badge: "H₂O",
    kicker: "Half-Way to Ownership.",
    title: "From access to",
    titleHighlight: "ownership",
    lede: "A graduated model for youth and women to move from renting mechanisation services toward full asset ownership, with mentorship and digital operations built in.",
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760361448/A5_-_4_nl2sxv.jpg",
    stats: [
      { v: "H₂O", l: "Programme", sub: "graduated finance" },
      { v: "Youth", l: "& women", sub: "primary beneficiaries" },
      { v: "Mentor", l: "Network", sub: "ongoing support" },
      { v: "Plus", l: "Platform", sub: "bookings & tracking" },
    ],
    primaryCta: { label: "Get involved", href: "#cta" },
    secondaryCta: { label: "See pathway", href: "#features" },
  },
  overview: {
    eyebrow: "The barrier",
    title: "Finance blocks the",
    titleHighlight: "next generation",
    paragraphs: [
      "Operators and agents want to own equipment, but upfront capital excludes most young people and women from the mechanisation economy.",
      "Half-Way to Ownership structures payments, pairs cooperatives with mentorship, and runs operations on TracTrac Plus until participants reach full ownership.",
    ],
    sideStats: [
      { big: "Gradual", variant: "orange", small: "Structured payments toward full asset ownership" },
      { big: "Mentored", variant: "dark", small: "Coaching from TracTrac and cooperative networks" },
      { big: "Digital", variant: "orange", small: "Bookings, tracking, and income on TracTrac Plus" },
    ],
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760478254/iPhone_16_-_105_2_j9hdpk.png",
  },
  steps: {
    eyebrow: "Pathway",
    title: "Four stages to ownership",
    lead: "Empower people, expand access, and grow rural enterprise.",
    items: [
      { n: "01", t: "Mobilise", i: "users", d: "Recruit youth and women into MSP and agent pathways with screening and support." },
      { n: "02", t: "Operate", i: "laptop", d: "Run bookings and field services on TracTrac Plus with transparent income data." },
      { n: "03", t: "Finance", i: "trend", d: "Graduated payments move participants from access toward ownership." },
      { n: "04", t: "Own", i: "award", d: "Full ownership with continued mentorship and cooperative integration." },
    ],
  },
  proof: {
    eyebrow: "Outcomes",
    title: "Pathway to ownership",
    lead: "Bridging the gap between renting services and owning productive assets.",
    items: [
      { v: "Step-up", l: "Graduated financing", icon: "trend", color: "#FA9413" },
      { v: "Coach", l: "Mentorship & support", icon: "users", color: "#16A34A" },
      { v: "Digital", l: "TracTrac Plus operations", icon: "laptop", color: "#60A5FA" },
      { v: "Jobs", l: "Rural employment", icon: "award", color: "#FBBF24" },
    ],
  },
  cta: {
    badge: "Programme partners",
    title: "Bring Half-Way to Ownership",
    titleHighlight: "to your community",
    lead: "Co-fund cohorts, provide assets, or integrate with state mechanisation programmes.",
    primary: { label: "Contact us", href: "/contact" },
    link: { label: "Submit partnership interest", href: "#cta" },
  },
  partnerForm: "join",
};
