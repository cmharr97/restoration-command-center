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
}> = {
  owner: {
    label: "Owner / Admin",
    color: T.orange,
    pages: ["dashboard","jobs","customers","mitigation","estimates","invoices","calendar","team","equipment","subcontractors","referrals","reports","integrations","settings"],
    canSeeProfitMargins: true, canSeePayroll: true, canDeleteJobs: true, canManageUsers: true,
    canViewAllJobs: true, canApproveExpenses: true, canViewInvoices: true, canSetRates: true,
  },
  project_manager: {
    label: "Project Manager",
    color: T.blueBright,
    pages: ["dashboard","jobs","customers","mitigation","estimates","calendar","team","equipment","subcontractors"],
    canSeeProfitMargins: false, canSeePayroll: false, canDeleteJobs: false, canManageUsers: false,
    canViewAllJobs: false, canApproveExpenses: true, canViewInvoices: false, canSetRates: false,
  },
  estimator: {
    label: "Estimator",
    color: T.purpleBright,
    pages: ["dashboard","jobs","estimates","calendar"],
    canSeeProfitMargins: false, canSeePayroll: false, canDeleteJobs: false, canManageUsers: false,
    canViewAllJobs: true, canApproveExpenses: false, canViewInvoices: false, canSetRates: false,
  },
  office_admin: {
    label: "Office Admin",
    color: T.tealBright,
    pages: ["dashboard","jobs","customers","invoices","calendar","referrals"],
    canSeeProfitMargins: false, canSeePayroll: false, canDeleteJobs: false, canManageUsers: false,
    canViewAllJobs: true, canApproveExpenses: false, canViewInvoices: true, canSetRates: false,
  },
  field_tech: {
    label: "Field Technician",
    color: T.greenBright,
    pages: ["my_jobs","mitigation","equipment"],
    canSeeProfitMargins: false, canSeePayroll: false, canDeleteJobs: false, canManageUsers: false,
    canViewAllJobs: false, canApproveExpenses: false, canViewInvoices: false, canSetRates: false,
  },
  subcontractor: {
    label: "Subcontractor",
    color: T.muted,
    pages: ["my_jobs"],
    canSeeProfitMargins: false, canSeePayroll: false, canDeleteJobs: false, canManageUsers: false,
    canViewAllJobs: false, canApproveExpenses: false, canViewInvoices: false, canSetRates: false,
  },
};

// ── JOB LIFECYCLE STAGES ──
export const JOB_STAGES = [
  { id: "lead", label: "New Lead", color: T.muted, icon: "📋" },
  { id: "assessment", label: "Assessment", color: T.yellowBright, icon: "🔍" },
  { id: "auth_signed", label: "Auth/AOB Signed", color: T.purpleBright, icon: "✍️" },
  { id: "mitigation", label: "Mitigation Active", color: T.orange, icon: "💧" },
  { id: "mit_complete", label: "Mitigation Complete", color: T.blueBright, icon: "✅" },
  { id: "recon_est", label: "Recon Estimate", color: T.yellowBright, icon: "📐" },
  { id: "reconstruction", label: "Reconstruction", color: T.tealBright, icon: "🔨" },
  { id: "final_walk", label: "Final Walkthrough", color: T.purpleBright, icon: "🚶" },
  { id: "invoiced", label: "Invoiced", color: T.blueBright, icon: "🧾" },
  { id: "paid", label: "Paid / Closed", color: T.greenBright, icon: "💰" },
];

export const LOSS_TYPES = [
  { id: "water", label: "Water Damage", subs: ["Cat 1 – Clean", "Cat 2 – Grey", "Cat 3 – Black", "Class 1", "Class 2", "Class 3", "Class 4"] },
  { id: "fire", label: "Fire / Smoke", subs: ["Kitchen Fire", "Structural Fire", "Wildfire Smoke", "Electrical"] },
  { id: "mold", label: "Mold Remediation", subs: ["Type 1 (small)", "Type 2 (med)", "Type 3 (large)"] },
  { id: "storm", label: "Storm / Wind", subs: ["Hail", "Wind", "Flood", "Tornado"] },
  { id: "biohazard", label: "Biohazard", subs: ["Sewage", "Trauma", "Hoarding"] },
  { id: "contents", label: "Contents Only", subs: ["Pack-Out", "Pack-Back", "Cleaning"] },
];

// ── NAVIGATION ──
export const NAV: Record<string, { group: string; items: { id: string; label: string; icon: string; badge?: number }[] }[]> = {
  owner: [
    { group: "Operations", items: [
      { id: "dashboard", label: "Dashboard", icon: "dash" },
      { id: "jobs", label: "Jobs", icon: "jobs" },
      { id: "customers", label: "Customers", icon: "customer" },
      { id: "mitigation", label: "Drying Logs", icon: "moisture" },
      { id: "calendar", label: "Schedule", icon: "cal" },
    ]},
    { group: "Communication", items: [
      { id: "messaging", label: "Messages", icon: "msg" },
    ]},
    { group: "Finance", items: [
      { id: "estimates", label: "Estimates", icon: "est" },
      { id: "invoices", label: "Invoices", icon: "inv" },
    ]},
    { group: "Team", items: [
      { id: "team", label: "Team & Users", icon: "users" },
      { id: "equipment", label: "Equipment", icon: "tool" },
      { id: "subcontractors", label: "Subcontractors", icon: "truck" },
    ]},
    { group: "Growth", items: [
      { id: "referrals", label: "Referrals / CRM", icon: "handshake" },
      { id: "reports", label: "Reports", icon: "chart" },
      { id: "integrations", label: "Integrations", icon: "plug" },
    ]},
    { group: "System", items: [
      { id: "automations", label: "Automations", icon: "plug" },
      { id: "customer_portal", label: "Customer Portal", icon: "customer" },
      { id: "settings", label: "Settings", icon: "cog" },
    ]},
  ],
  project_manager: [
    { group: "My Work", items: [
      { id: "dashboard", label: "Dashboard", icon: "dash" },
      { id: "jobs", label: "My Jobs", icon: "jobs" },
      { id: "mitigation", label: "Drying Logs", icon: "moisture" },
      { id: "calendar", label: "Schedule", icon: "cal" },
    ]},
    { group: "Communication", items: [
      { id: "messaging", label: "Messages", icon: "msg" },
    ]},
    { group: "Job Tools", items: [
      { id: "estimates", label: "Estimates", icon: "est" },
      { id: "equipment", label: "Equipment", icon: "tool" },
      { id: "subcontractors", label: "Subcontractors", icon: "truck" },
    ]},
  ],
  estimator: [
    { group: "My Work", items: [
      { id: "dashboard", label: "Dashboard", icon: "dash" },
      { id: "jobs", label: "Jobs", icon: "jobs" },
      { id: "estimates", label: "Estimates", icon: "est" },
      { id: "calendar", label: "Calendar", icon: "cal" },
      { id: "messaging", label: "Messages", icon: "msg" },
    ]},
  ],
  office_admin: [
    { group: "Operations", items: [
      { id: "dashboard", label: "Dashboard", icon: "dash" },
      { id: "jobs", label: "Jobs", icon: "jobs" },
      { id: "customers", label: "Customers", icon: "customer" },
      { id: "calendar", label: "Schedule", icon: "cal" },
    ]},
    { group: "Communication", items: [
      { id: "messaging", label: "Messages", icon: "msg" },
    ]},
    { group: "Billing", items: [
      { id: "invoices", label: "Invoices", icon: "inv" },
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
  lead: "gray", assessment: "yellow", auth_signed: "purple", mitigation: "orange",
  mit_complete: "blue", recon_est: "yellow", reconstruction: "teal", final_walk: "purple",
  invoiced: "blue", paid: "green"
};

// ── COMPATIBILITY SHIMS (empty arrays — real data comes from useJobs/useTeamMembers hooks) ──
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
