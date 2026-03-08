// ── DESIGN TOKENS (reactive via CSS custom properties) ──
export const T = {
  bg: "var(--t-bg)",
  surface: "var(--t-surface)",
  surfaceHigh: "var(--t-surface-high)",
  surfaceTop: "var(--t-surface-top)",
  border: "var(--t-border)",
  borderMid: "var(--t-border-mid)",
  orange: "#e85c0d",
  orangeLight: "#ff6f25",
  orangeDim: "var(--t-orange-dim)",
  orangeGlow: "var(--t-orange-glow)",
  white: "var(--t-white)",
  text: "var(--t-text)",
  muted: "var(--t-muted)",
  dim: "var(--t-dim)",
  green: "#16a34a",
  greenBright: "#22c55e",
  greenDim: "var(--t-green-dim)",
  blue: "#2563eb",
  blueBright: "#3b82f6",
  blueDim: "var(--t-blue-dim)",
  yellow: "#d97706",
  yellowBright: "#f59e0b",
  yellowDim: "var(--t-yellow-dim)",
  red: "#dc2626",
  redBright: "#ef4444",
  redDim: "var(--t-red-dim)",
  purple: "#7c3aed",
  purpleBright: "#a78bfa",
  purpleDim: "var(--t-purple-dim)",
  teal: "#0d9488",
  tealBright: "#2dd4bf",
  tealDim: "var(--t-teal-dim)",
};

// ── ROLE DEFINITIONS ──
export const ROLES: Record<string, {
  label: string;
  color: string;
  pages: string[];
  canSeeProfitMargins: boolean;
  canSeePayroll: boolean;
  canDeleteJobs: boolean;
  canManageUsers: boolean;
  canViewAllJobs: boolean;
  canApproveExpenses: boolean;
  canViewInvoices: boolean;
  canSetRates: boolean;
  canViewClaims: boolean;
  canViewPayments: boolean;
  canManageSubs: boolean;
}> = {
  owner: {
    label: "Owner / Admin",
    color: T.orange,
    pages: ["dashboard","jobs","claims","mitigation","supplements","payments","customers","estimates","invoices","calendar","team","equipment","subcontractors","referrals","reports","integrations","settings"],
    canSeeProfitMargins: true, canSeePayroll: true, canDeleteJobs: true, canManageUsers: true,
    canViewAllJobs: true, canApproveExpenses: true, canViewInvoices: true, canSetRates: true,
    canViewClaims: true, canViewPayments: true, canManageSubs: true,
  },
  project_manager: {
    label: "Project Manager",
    color: T.blueBright,
    pages: ["dashboard","jobs","claims","mitigation","supplements","customers","estimates","calendar","team","equipment","subcontractors"],
    canSeeProfitMargins: false, canSeePayroll: false, canDeleteJobs: false, canManageUsers: false,
    canViewAllJobs: false, canApproveExpenses: true, canViewInvoices: false, canSetRates: false,
    canViewClaims: true, canViewPayments: false, canManageSubs: true,
  },
  estimator: {
    label: "Estimator",
    color: T.purpleBright,
    pages: ["dashboard","jobs","claims","supplements","estimates","calendar"],
    canSeeProfitMargins: false, canSeePayroll: false, canDeleteJobs: false, canManageUsers: false,
    canViewAllJobs: true, canApproveExpenses: false, canViewInvoices: false, canSetRates: false,
    canViewClaims: true, canViewPayments: false, canManageSubs: false,
  },
  office_admin: {
    label: "Office Admin",
    color: T.tealBright,
    pages: ["dashboard","jobs","claims","payments","customers","invoices","calendar","referrals"],
    canSeeProfitMargins: false, canSeePayroll: false, canDeleteJobs: false, canManageUsers: false,
    canViewAllJobs: true, canApproveExpenses: false, canViewInvoices: true, canSetRates: false,
    canViewClaims: true, canViewPayments: true, canManageSubs: false,
  },
  field_tech: {
    label: "Field Technician",
    color: T.greenBright,
    pages: ["my_jobs","mitigation","equipment"],
    canSeeProfitMargins: false, canSeePayroll: false, canDeleteJobs: false, canManageUsers: false,
    canViewAllJobs: false, canApproveExpenses: false, canViewInvoices: false, canSetRates: false,
    canViewClaims: false, canViewPayments: false, canManageSubs: false,
  },
  subcontractor: {
    label: "Subcontractor",
    color: T.muted,
    pages: ["my_jobs"],
    canSeeProfitMargins: false, canSeePayroll: false, canDeleteJobs: false, canManageUsers: false,
    canViewAllJobs: false, canApproveExpenses: false, canViewInvoices: false, canSetRates: false,
    canViewClaims: false, canViewPayments: false, canManageSubs: false,
  },
};

// ── JOB LIFECYCLE STAGES ──
export const JOB_STAGES = [
  { id: "lead", label: "New Lead", color: T.muted, icon: "📋" },
  { id: "inspection", label: "Inspection Scheduled", color: T.yellowBright, icon: "🔍" },
  { id: "mitigation", label: "Mitigation In Progress", color: T.orange, icon: "💧" },
  { id: "drying", label: "Drying Monitoring", color: T.blueBright, icon: "📊" },
  { id: "estimate_submitted", label: "Estimate Submitted", color: T.purpleBright, icon: "📐" },
  { id: "supplement", label: "Supplement Submitted", color: T.yellowBright, icon: "📝" },
  { id: "carrier_approval", label: "Carrier Approval Pending", color: T.redBright, icon: "⏳" },
  { id: "recon_scheduled", label: "Reconstruction Scheduled", color: T.tealBright, icon: "📅" },
  { id: "reconstruction", label: "Reconstruction In Progress", color: T.teal, icon: "🔨" },
  { id: "punch_list", label: "Punch List", color: T.purpleBright, icon: "✅" },
  { id: "invoiced", label: "Final Invoice Sent", color: T.blueBright, icon: "🧾" },
  { id: "closed", label: "Closed", color: T.greenBright, icon: "💰" },
];

export const LOSS_TYPES = [
  { id: "water", label: "Water Damage", subs: ["Cat 1 – Clean", "Cat 2 – Grey", "Cat 3 – Black", "Class 1", "Class 2", "Class 3", "Class 4"] },
  { id: "fire", label: "Fire / Smoke", subs: ["Kitchen Fire", "Structural Fire", "Wildfire Smoke", "Electrical"] },
  { id: "mold", label: "Mold Remediation", subs: ["Type 1 (small)", "Type 2 (med)", "Type 3 (large)"] },
  { id: "storm", label: "Storm / Wind", subs: ["Hail", "Wind", "Flood", "Tornado"] },
  { id: "biohazard", label: "Biohazard", subs: ["Sewage", "Trauma", "Hoarding"] },
  { id: "contents", label: "Contents Only", subs: ["Pack-Out", "Pack-Back", "Cleaning"] },
];

export const TRADES = [
  "Roofing", "Drywall", "Flooring", "Cabinets", "Painting", "Framing",
  "Plumbing", "Electrical", "HVAC", "Insulation", "Countertops", "Tile",
  "General Labor", "Demolition", "Carpentry",
];

// ── NAVIGATION ──
export const NAV: Record<string, { group: string; items: { id: string; label: string; icon: string; badge?: number }[] }[]> = {
  owner: [
    { group: "Operations", items: [
      { id: "dashboard", label: "Dashboard", icon: "dash" },
      { id: "jobs", label: "Jobs", icon: "jobs" },
      { id: "claims", label: "Insurance Jobs", icon: "shield" },
      { id: "mitigation", label: "Drying Logs", icon: "moisture" },
      { id: "calendar", label: "Schedule", icon: "cal" },
    ]},
    { group: "Finance", items: [
      { id: "supplements", label: "Supplements", icon: "est" },
      { id: "payments", label: "Payments", icon: "dollar" },
      { id: "estimates", label: "Estimates", icon: "est" },
      { id: "invoices", label: "Invoices", icon: "inv" },
    ]},
    { group: "Communication", items: [
      { id: "messaging", label: "Messages", icon: "msg" },
    ]},
    { group: "Team", items: [
      { id: "team", label: "Team & Users", icon: "users" },
      { id: "subcontractors", label: "Subcontractors", icon: "truck" },
      { id: "equipment", label: "Equipment", icon: "tool" },
    ]},
    { group: "Growth", items: [
      { id: "customers", label: "Customers", icon: "customer" },
      { id: "referrals", label: "Referrals / CRM", icon: "handshake" },
      { id: "reports", label: "Reports", icon: "chart" },
    ]},
    { group: "System", items: [
      { id: "automations", label: "Automations", icon: "plug" },
      { id: "integrations", label: "Integrations", icon: "plug" },
      { id: "settings", label: "Settings", icon: "cog" },
    ]},
  ],
  project_manager: [
    { group: "My Work", items: [
      { id: "dashboard", label: "Dashboard", icon: "dash" },
      { id: "jobs", label: "My Jobs", icon: "jobs" },
      { id: "claims", label: "Insurance Jobs", icon: "shield" },
      { id: "mitigation", label: "Drying Logs", icon: "moisture" },
      { id: "calendar", label: "Schedule", icon: "cal" },
    ]},
    { group: "Finance", items: [
      { id: "supplements", label: "Supplements", icon: "est" },
      { id: "estimates", label: "Estimates", icon: "est" },
    ]},
    { group: "Communication", items: [
      { id: "messaging", label: "Messages", icon: "msg" },
    ]},
    { group: "Job Tools", items: [
      { id: "equipment", label: "Equipment", icon: "tool" },
      { id: "subcontractors", label: "Subcontractors", icon: "truck" },
    ]},
  ],
  estimator: [
    { group: "My Work", items: [
      { id: "dashboard", label: "Dashboard", icon: "dash" },
      { id: "jobs", label: "Jobs", icon: "jobs" },
      { id: "claims", label: "Insurance Jobs", icon: "shield" },
      { id: "supplements", label: "Supplements", icon: "est" },
      { id: "estimates", label: "Estimates", icon: "est" },
      { id: "calendar", label: "Calendar", icon: "cal" },
      { id: "messaging", label: "Messages", icon: "msg" },
    ]},
  ],
  office_admin: [
    { group: "Operations", items: [
      { id: "dashboard", label: "Dashboard", icon: "dash" },
      { id: "jobs", label: "Jobs", icon: "jobs" },
      { id: "claims", label: "Claims", icon: "shield" },
      { id: "customers", label: "Customers", icon: "customer" },
      { id: "calendar", label: "Schedule", icon: "cal" },
    ]},
    { group: "Finance", items: [
      { id: "payments", label: "Payments", icon: "dollar" },
      { id: "invoices", label: "Invoices", icon: "inv" },
    ]},
    { group: "Communication", items: [
      { id: "messaging", label: "Messages", icon: "msg" },
    ]},
    { group: "Growth", items: [
      { id: "referrals", label: "Referrals / CRM", icon: "handshake" },
    ]},
  ],
  field_tech: [
    { group: "My Work", items: [
      { id: "my_jobs", label: "My Jobs", icon: "myjobs" },
      { id: "mitigation", label: "Drying Logs", icon: "moisture" },
      { id: "equipment", label: "Equipment", icon: "tool" },
      { id: "messaging", label: "Messages", icon: "msg" },
    ]},
  ],
  subcontractor: [
    { group: "My Work", items: [
      { id: "my_jobs", label: "My Jobs", icon: "myjobs" },
      { id: "messaging", label: "Messages", icon: "msg" },
    ]},
  ],
};

// ── HELPERS ──
export const stageInfo = (id: string) => JOB_STAGES.find(s => s.id === id) || { label: id, color: T.muted, icon: "⬜" };

export const stageColor: Record<string, string> = {
  lead: "gray", inspection: "yellow", mitigation: "orange",
  drying: "blue", estimate_submitted: "purple", supplement: "yellow",
  carrier_approval: "red", recon_scheduled: "teal", reconstruction: "teal",
  punch_list: "purple", invoiced: "blue", closed: "green",
  // Legacy compatibility
  assessment: "yellow", auth_signed: "purple", mit_complete: "blue",
  recon_est: "yellow", final_walk: "purple", paid: "green",
};

// ── COMPATIBILITY SHIMS (empty arrays — real data comes from hooks) ──
export interface Job {
  id: string; customer: string; address: string; phone: string; lossType: string; lossSubtype: string;
  stage: string; pm: string; techs: string[]; carrier: string; claimNo: string; adjuster: string;
  adjusterPhone: string; dateOfLoss: string; contractValue: number | null; mitigationValue: number | null;
  recon: boolean; reconValue?: number; dayOfDrying: number | null; moistureAlerts: number;
  equipment: { name: string; qty: number; placed: string }[]; notes: string; priority: string;
}
export interface TeamMember {
  id: string; name: string; role: string; email: string; phone: string; certs: string[];
  status: string; avatar: string; currentJob: string | null; profilePic?: string;
}
export interface DryingLog {
  day: number; date: string; tech: string; gpp: number; temp: number; rh: number;
  readings: { room: string; material: string; reading: number; dry: number; status: string }[];
  equipment: { dehus: number; airMovers: number; scrubbers: number }; notes: string;
}
export const JOBS: Job[] = [];
export const TEAM_MEMBERS: TeamMember[] = [];
export const DRYING_LOGS: Record<string, DryingLog[]> = {};
