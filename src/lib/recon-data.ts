// ── DESIGN TOKENS (for inline styles where needed) ──
export const T = {
  bg: "#0c0d0f",
  surface: "#161719",
  surfaceHigh: "#1e2024",
  surfaceTop: "#26292f",
  border: "#2a2d33",
  borderMid: "#363a42",
  orange: "#e85c0d",
  orangeLight: "#ff6f25",
  orangeDim: "rgba(232,92,13,0.12)",
  orangeGlow: "rgba(232,92,13,0.25)",
  white: "#f4f5f7",
  text: "#dde1e8",
  muted: "#7c8494",
  dim: "#4a5060",
  green: "#16a34a",
  greenBright: "#22c55e",
  greenDim: "rgba(34,197,94,0.12)",
  blue: "#2563eb",
  blueBright: "#3b82f6",
  blueDim: "rgba(59,130,246,0.12)",
  yellow: "#d97706",
  yellowBright: "#f59e0b",
  yellowDim: "rgba(245,158,11,0.12)",
  red: "#dc2626",
  redBright: "#ef4444",
  redDim: "rgba(239,68,68,0.12)",
  purple: "#7c3aed",
  purpleBright: "#a78bfa",
  purpleDim: "rgba(167,139,250,0.12)",
  teal: "#0d9488",
  tealBright: "#2dd4bf",
  tealDim: "rgba(45,212,191,0.12)",
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

export interface Job {
  id: string;
  customer: string;
  address: string;
  phone: string;
  lossType: string;
  lossSubtype: string;
  stage: string;
  pm: string;
  techs: string[];
  carrier: string;
  claimNo: string;
  adjuster: string;
  adjusterPhone: string;
  dateOfLoss: string;
  contractValue: number | null;
  mitigationValue: number | null;
  recon: boolean;
  reconValue?: number;
  dayOfDrying: number | null;
  moistureAlerts: number;
  equipment: { name: string; qty: number; placed: string }[];
  notes: string;
  priority: string;
}

export const JOBS: Job[] = [
  { id:"J-1051", customer:"Martinez, Sarah", address:"4821 Barton Creek Blvd, Austin TX", phone:"(512) 334-9922", lossType:"water", lossSubtype:"Cat 2 – Grey", stage:"mitigation", pm:"Destiny Kim", techs:["Marcus Webb","Carlos Rivera"], carrier:"State Farm", claimNo:"SF-2026-44821", adjuster:"Tom Hendricks", adjusterPhone:"(512) 777-1234", dateOfLoss:"2026-03-02", contractValue:11200, mitigationValue:6800, recon:false, dayOfDrying:5, moistureAlerts:2, equipment:[{name:"Dri-Eaz LGR 3500i",qty:2,placed:"Mar 2"},{name:"Dri-Eaz F203 Air Mover",qty:8,placed:"Mar 2"},{name:"Dri-Eaz HEPA 500",qty:1,placed:"Mar 3"}], notes:"Cat 2 loss from washing machine supply line failure. Affected: kitchen, laundry, hall, partial living room. Hardwood floors beginning to cup.", priority:"high" },
  { id:"J-1050", customer:"Sunrise Office Park LLC", address:"1200 Congress Ave, Ste 500, Austin TX", phone:"(512) 200-8800", lossType:"fire", lossSubtype:"Kitchen Fire", stage:"reconstruction", pm:"Destiny Kim", techs:["Aisha Thompson"], carrier:"Travelers", claimNo:"TR-2026-88120", adjuster:"Linda Park", adjusterPhone:"(512) 999-3333", dateOfLoss:"2026-02-14", contractValue:68400, mitigationValue:18200, recon:true, reconValue:50200, dayOfDrying:null, moistureAlerts:0, equipment:[], notes:"Commercial kitchen fire. Mitigation complete. Reconstruction phase began 2/28.", priority:"normal" },
  { id:"J-1049", customer:"Chen, Wei & Linda", address:"309 Shoal Creek Blvd, Austin TX", phone:"(512) 441-7744", lossType:"mold", lossSubtype:"Type 2 (med)", stage:"recon_est", pm:"Tyler Nguyen", techs:[], carrier:"Farmers", claimNo:"FA-2026-11023", adjuster:"Bill Torres", adjusterPhone:"(512) 888-4444", dateOfLoss:"2026-02-28", contractValue:null, mitigationValue:null, recon:false, dayOfDrying:null, moistureAlerts:0, equipment:[], notes:"Mold in master bath and closet. Awaiting Xactimate estimate approval.", priority:"normal" },
  { id:"J-1048", customer:"Valley View Apts (Unit 204)", address:"8800 Research Blvd, Austin TX", phone:"(512) 555-6200", lossType:"water", lossSubtype:"Cat 1 – Clean", stage:"invoiced", pm:"Destiny Kim", techs:["Marcus Webb"], carrier:"USAA", claimNo:"UA-2026-9922", adjuster:"Kim Lee", adjusterPhone:"(512) 222-7890", dateOfLoss:"2026-02-20", contractValue:8750, mitigationValue:8750, recon:false, dayOfDrying:null, moistureAlerts:0, equipment:[], notes:"Closed – waiting on insurance payment.", priority:"low" },
  { id:"J-1047", customer:"Rodriguez, Miguel", address:"7722 Burnet Rd, Austin TX", phone:"(512) 661-3344", lossType:"storm", lossSubtype:"Hail", stage:"assessment", pm:"Tyler Nguyen", techs:[], carrier:"Allstate", claimNo:"AL-2026-77231", adjuster:"Pending", adjusterPhone:"", dateOfLoss:"2026-03-05", contractValue:null, mitigationValue:null, recon:false, dayOfDrying:null, moistureAlerts:0, equipment:[], notes:"Hail/storm damage to roof and exterior. Assessment scheduled March 8.", priority:"normal" },
  { id:"J-1046", customer:"Highland Park HOA", address:"5500 Highland Terrace, Austin TX", phone:"(512) 300-1100", lossType:"water", lossSubtype:"Cat 3 – Black", stage:"auth_signed", pm:"Destiny Kim", techs:["Aisha Thompson","Priya Patel"], carrier:"Liberty Mutual", claimNo:"LM-2026-55301", adjuster:"Sandra Cruz", adjusterPhone:"(512) 444-2222", dateOfLoss:"2026-03-01", contractValue:null, mitigationValue:null, recon:false, dayOfDrying:null, moistureAlerts:0, equipment:[], notes:"Sewer backup affecting 3 units. AOB signed. Mobilizing tomorrow.", priority:"high" },
  { id:"J-1045", customer:"Patel Commercial Group", address:"300 W Cesar Chavez, Austin TX", phone:"(512) 704-8800", lossType:"fire", lossSubtype:"Electrical", stage:"paid", pm:"Destiny Kim", techs:["Marcus Webb","Carlos Rivera"], carrier:"Zurich", claimNo:"ZU-2026-30011", adjuster:"Kevin Smith", adjusterPhone:"(512) 111-5555", dateOfLoss:"2026-01-15", contractValue:42800, mitigationValue:11800, recon:true, reconValue:31000, dayOfDrying:null, moistureAlerts:0, equipment:[], notes:"Complete. Final payment received.", priority:"low" },
];

export interface DryingLog {
  day: number;
  date: string;
  tech: string;
  gpp: number;
  temp: number;
  rh: number;
  readings: { room: string; material: string; reading: number; dry: number; status: string }[];
  equipment: { dehus: number; airMovers: number; scrubbers: number };
  notes: string;
}

export const DRYING_LOGS: Record<string, DryingLog[]> = {
  "J-1051": [
    { day:1, date:"Mar 2", tech:"Marcus Webb", gpp:62, temp:72, rh:58, readings:[{room:"Kitchen",material:"Drywall",reading:28,dry:15,status:"wet"},{room:"Kitchen",material:"Hardwood",reading:24,dry:12,status:"wet"},{room:"Hall",material:"Drywall",reading:19,dry:15,status:"wet"},{room:"Laundry",material:"Subfloor",reading:35,dry:19,status:"wet"}], equipment:{dehus:2,airMovers:8,scrubbers:1}, notes:"Initial set. Cat 2 source confirmed. Standing water extracted. Flooring lifted in kitchen." },
    { day:2, date:"Mar 3", tech:"Carlos Rivera", gpp:55, temp:74, rh:51, readings:[{room:"Kitchen",material:"Drywall",reading:23,dry:15,status:"wet"},{room:"Kitchen",material:"Hardwood",reading:20,dry:12,status:"wet"},{room:"Hall",material:"Drywall",reading:17,dry:15,status:"wet"},{room:"Laundry",material:"Subfloor",reading:30,dry:19,status:"wet"}], equipment:{dehus:2,airMovers:8,scrubbers:1}, notes:"Drying progressing. Added 2nd HEPA due to odor. Notified adjuster of hardwood cupping." },
    { day:3, date:"Mar 4", tech:"Marcus Webb", gpp:48, temp:75, rh:47, readings:[{room:"Kitchen",material:"Drywall",reading:19,dry:15,status:"wet"},{room:"Kitchen",material:"Hardwood",reading:17,dry:12,status:"wet"},{room:"Hall",material:"Drywall",reading:15,dry:15,status:"dry"},{room:"Laundry",material:"Subfloor",reading:25,dry:19,status:"wet"}], equipment:{dehus:2,airMovers:6,scrubbers:1}, notes:"Hall drywall reached dry standard. Removed 2 air movers from hall." },
    { day:4, date:"Mar 5", tech:"Carlos Rivera", gpp:44, temp:76, rh:45, readings:[{room:"Kitchen",material:"Drywall",reading:17,dry:15,status:"wet"},{room:"Kitchen",material:"Hardwood",reading:15,dry:12,status:"wet"},{room:"Hall",material:"Drywall",reading:14,dry:15,status:"dry"},{room:"Laundry",material:"Subfloor",reading:22,dry:19,status:"wet"}], equipment:{dehus:2,airMovers:6,scrubbers:1}, notes:"Continued drying. Kitchen drywall close to dry standard. Subfloor still elevated." },
    { day:5, date:"Mar 6", tech:"Marcus Webb", gpp:41, temp:76, rh:43, readings:[{room:"Kitchen",material:"Drywall",reading:16,dry:15,status:"wet"},{room:"Kitchen",material:"Hardwood",reading:14,dry:12,status:"wet"},{room:"Hall",material:"Drywall",reading:13,dry:15,status:"dry"},{room:"Laundry",material:"Subfloor",reading:20,dry:19,status:"wet"}], equipment:{dehus:2,airMovers:6,scrubbers:1}, notes:"Approaching dry standards. Subfloor may need demo. Will re-assess tomorrow." },
  ]
};

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  certs: string[];
  status: string;
  avatar: string;
  currentJob: string | null;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { id:"u1", name:"John Davis", role:"owner", email:"john@reconpro.com", phone:"(512) 400-1000", certs:["WRT","ASD","FSRT","IICRC-CR"], status:"office", avatar:"JD", currentJob:null },
  { id:"u2", name:"Destiny Kim", role:"project_manager", email:"destiny@reconpro.com", phone:"(512) 400-1001", certs:["WRT","FSRT","ASD"], status:"office", avatar:"DK", currentJob:"J-1051" },
  { id:"u3", name:"Tyler Nguyen", role:"estimator", email:"tyler@reconpro.com", phone:"(512) 400-1002", certs:["WRT","ASD","Xactimate-L3"], status:"office", avatar:"TN", currentJob:null },
  { id:"u4", name:"Sarah Okafor", role:"office_admin", email:"sarah@reconpro.com", phone:"(512) 400-1003", certs:[], status:"office", avatar:"SO", currentJob:null },
  { id:"u5", name:"Marcus Webb", role:"field_tech", email:"marcus@reconpro.com", phone:"(512) 400-2001", certs:["WRT","ASD","FSRT"], status:"on_site", avatar:"MW", currentJob:"J-1051" },
  { id:"u6", name:"Carlos Rivera", role:"field_tech", email:"carlos@reconpro.com", phone:"(512) 400-2002", certs:["WRT"], status:"driving", avatar:"CR", currentJob:"J-1051" },
  { id:"u7", name:"Aisha Thompson", role:"field_tech", email:"aisha@reconpro.com", phone:"(512) 400-2003", certs:["WRT","FSRT"], status:"on_site", avatar:"AT", currentJob:"J-1046" },
  { id:"u8", name:"Priya Patel", role:"field_tech", email:"priya@reconpro.com", phone:"(512) 400-2004", certs:["WRT"], status:"on_site", avatar:"PP", currentJob:"J-1046" },
];

// ── NAVIGATION ──
export const NAV: Record<string, { group: string; items: { id: string; label: string; icon: string; badge?: number }[] }[]> = {
  owner: [
    { group: "Operations", items: [
      { id: "dashboard", label: "Dashboard", icon: "dash" },
      { id: "jobs", label: "Jobs", icon: "jobs", badge: 12 },
      { id: "customers", label: "Customers", icon: "customer" },
      { id: "mitigation", label: "Drying Logs", icon: "moisture" },
      { id: "calendar", label: "Schedule", icon: "cal" },
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
      { id: "settings", label: "Settings", icon: "cog" },
    ]},
  ],
  project_manager: [
    { group: "My Work", items: [
      { id: "dashboard", label: "Dashboard", icon: "dash" },
      { id: "jobs", label: "My Jobs", icon: "jobs", badge: 4 },
      { id: "mitigation", label: "Drying Logs", icon: "moisture" },
      { id: "calendar", label: "Schedule", icon: "cal" },
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
    ]},
  ],
  office_admin: [
    { group: "Operations", items: [
      { id: "dashboard", label: "Dashboard", icon: "dash" },
      { id: "jobs", label: "Jobs", icon: "jobs" },
      { id: "customers", label: "Customers", icon: "customer" },
      { id: "calendar", label: "Schedule", icon: "cal" },
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
      { id: "my_jobs", label: "My Jobs", icon: "myjobs", badge: 2 },
      { id: "mitigation", label: "Drying Logs", icon: "moisture" },
      { id: "equipment", label: "Equipment", icon: "tool" },
    ]},
  ],
  subcontractor: [
    { group: "My Work", items: [
      { id: "my_jobs", label: "My Jobs", icon: "myjobs" },
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
