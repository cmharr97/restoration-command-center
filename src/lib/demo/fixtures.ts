// ── DEMO FIXTURES ──
// Realistic, self-contained sample data used only by Demo Preview Mode.
// These fixtures live entirely in the browser. They are NEVER written to a live
// Supabase project — the demo Supabase client (see demoClient.ts) operates on
// this in-memory store only.

export const DEMO_COMPANY_ID = "demo-co";

export interface DemoRole {
  value: string;
  label: string;
  desc: string;
  userId: string;
}

/** Roles offered on the demo sign-in screen. */
export const DEMO_ROLES: DemoRole[] = [
  { value: "owner", label: "Owner / Admin", desc: "Full access — you run the company", userId: "demo-owner" },
  { value: "project_manager", label: "Project Manager", desc: "Manage jobs, teams, and schedules", userId: "demo-pm" },
  { value: "estimator", label: "Estimator", desc: "Write and manage estimates", userId: "demo-estimator" },
  { value: "office_admin", label: "Office Admin", desc: "Billing, customers, and scheduling", userId: "demo-office" },
  { value: "field_tech", label: "Field Technician", desc: "Drying logs, moisture readings, job tasks", userId: "demo-tech" },
  { value: "subcontractor", label: "Subcontractor", desc: "View assigned jobs only", userId: "demo-sub" },
];

export const demoRoleByValue = (value: string): DemoRole =>
  DEMO_ROLES.find((r) => r.value === value) || DEMO_ROLES[0];

// ── PROFILES (one per selectable role + a few extra team members) ──
const profiles = [
  { id: "demo-owner", name: "Dana Reeves", role: "owner", email: "dana@demo-restoration.com", avatar: "DR", company_id: DEMO_COMPANY_ID, onboarding_complete: true, phone: "(555) 201-0100", certs: ["IICRC WRT", "IICRC ASD"], status: "office", created_at: "2025-01-04T09:00:00Z" },
  { id: "demo-pm", name: "Marcus Hill", role: "project_manager", email: "marcus@demo-restoration.com", avatar: "MH", company_id: DEMO_COMPANY_ID, onboarding_complete: true, phone: "(555) 201-0110", certs: ["IICRC WRT"], status: "field", created_at: "2025-01-06T09:00:00Z" },
  { id: "demo-estimator", name: "Priya Nair", role: "estimator", email: "priya@demo-restoration.com", avatar: "PN", company_id: DEMO_COMPANY_ID, onboarding_complete: true, phone: "(555) 201-0120", certs: ["Xactimate L2"], status: "office", created_at: "2025-01-08T09:00:00Z" },
  { id: "demo-office", name: "Sofia Alvarez", role: "office_admin", email: "sofia@demo-restoration.com", avatar: "SA", company_id: DEMO_COMPANY_ID, onboarding_complete: true, phone: "(555) 201-0130", certs: [], status: "office", created_at: "2025-01-09T09:00:00Z" },
  { id: "demo-tech", name: "Leo Byrne", role: "field_tech", email: "leo@demo-restoration.com", avatar: "LB", company_id: DEMO_COMPANY_ID, onboarding_complete: true, phone: "(555) 201-0140", certs: ["IICRC WRT", "IICRC AMRT"], status: "field", created_at: "2025-01-11T09:00:00Z" },
  { id: "demo-sub", name: "Grace Okafor", role: "subcontractor", email: "grace@demo-flooring.com", avatar: "GO", company_id: DEMO_COMPANY_ID, onboarding_complete: true, phone: "(555) 201-0150", certs: [], status: "field", created_at: "2025-01-13T09:00:00Z" },
];

// ── COMPANY ──
const companies = [
  {
    id: DEMO_COMPANY_ID,
    name: "Summit Restoration Co. (Demo)",
    email: "office@demo-restoration.com",
    phone: "(555) 201-0000",
    address: "1420 Cedar Industrial Pkwy",
    city: "Boulder",
    state: "CO",
    zip: "80301",
    created_at: "2025-01-04T09:00:00Z",
  },
];

// ── JOBS ──
const jobs = [
  { id: "J-1042", customer: "Robert & Linda Chen", address: "88 Maple Grove Dr, Boulder, CO", phone: "(555) 330-1042", loss_type: "water", loss_subtype: "supply_line", stage: "drying", pm_name: "Marcus Hill", pm_id: "demo-pm", carrier: "State Farm", claim_no: "SF-77120449", adjuster: "Karen Doyle", adjuster_phone: "(555) 900-1200", adjuster_email: "kdoyle@statefarm.com", date_of_loss: "2026-07-14", contract_value: 24800, mitigation_value: 9200, recon: true, recon_value: 15600, day_of_drying: 3, moisture_alerts: 2, notes: "Kitchen supply line burst overnight. Cabinets affected.", priority: "high", created_by: "demo-pm", created_at: "2026-07-14T13:20:00Z", updated_at: "2026-07-21T16:00:00Z", company_id: DEMO_COMPANY_ID, mortgage_company: "Wells Fargo", scope_notes: "Detach & reset lower cabinets; flood cut drywall 2ft.", payment_type: "insurance" },
  { id: "J-1039", customer: "Aisha Mohammed", address: "204 Riverbend Ct, Longmont, CO", phone: "(555) 330-1039", loss_type: "fire", loss_subtype: "kitchen_fire", stage: "carrier_approval", pm_name: "Marcus Hill", pm_id: "demo-pm", carrier: "Allstate", claim_no: "AL-55201883", adjuster: "Tom Reyes", adjuster_phone: "(555) 900-2200", adjuster_email: "treyes@allstate.com", date_of_loss: "2026-07-02", contract_value: 61250, mitigation_value: 12400, recon: true, recon_value: 48850, day_of_drying: null, moisture_alerts: 0, notes: "Grease fire, heavy smoke through main floor.", priority: "high", created_by: "demo-pm", created_at: "2026-07-02T18:05:00Z", updated_at: "2026-07-20T11:10:00Z", company_id: DEMO_COMPANY_ID, mortgage_company: "", scope_notes: "Full contents pack-out; seal & paint main floor.", payment_type: "insurance" },
  { id: "J-1035", customer: "The Whitfield Group LLC", address: "12 Commerce Sq Unit 3, Boulder, CO", phone: "(555) 330-1035", loss_type: "water", loss_subtype: "roof_leak", stage: "reconstruction", pm_name: "Dana Reeves", pm_id: "demo-owner", carrier: "Travelers", claim_no: "TR-90113255", adjuster: "Nadia Frost", adjuster_phone: "(555) 900-3300", adjuster_email: "nfrost@travelers.com", date_of_loss: "2026-06-18", contract_value: 38900, mitigation_value: 7800, recon: true, recon_value: 31100, day_of_drying: null, moisture_alerts: 0, notes: "Commercial roof leak over server room — tenant relocation done.", priority: "normal", created_by: "demo-owner", created_at: "2026-06-18T09:45:00Z", updated_at: "2026-07-19T14:30:00Z", company_id: DEMO_COMPANY_ID, mortgage_company: "", scope_notes: "Replace ceiling grid + tiles; repaint; new VCT.", payment_type: "insurance" },
  { id: "J-1031", customer: "Ethan Park", address: "551 Sunflower Ln, Erie, CO", phone: "(555) 330-1031", loss_type: "mold", loss_subtype: "bathroom", stage: "estimate", pm_name: "Priya Nair", pm_id: "demo-estimator", carrier: "", claim_no: "", adjuster: "", adjuster_phone: "", adjuster_email: "", date_of_loss: "2026-07-10", contract_value: 6400, mitigation_value: 6400, recon: false, recon_value: 0, day_of_drying: null, moisture_alerts: 1, notes: "Homeowner-paid mold remediation, master bath.", priority: "normal", created_by: "demo-estimator", created_at: "2026-07-10T15:00:00Z", updated_at: "2026-07-18T10:00:00Z", company_id: DEMO_COMPANY_ID, mortgage_company: "", scope_notes: "Containment + HEPA; remove vanity and drywall.", payment_type: "self_pay" },
  { id: "J-1028", customer: "Grace & Sam Okafor", address: "77 Birchwood Ave, Boulder, CO", phone: "(555) 330-1028", loss_type: "water", loss_subtype: "sewage", stage: "closed", pm_name: "Marcus Hill", pm_id: "demo-pm", carrier: "Farmers", claim_no: "FR-33099120", adjuster: "Owen Blake", adjuster_phone: "(555) 900-4400", adjuster_email: "oblake@farmers.com", date_of_loss: "2026-05-28", contract_value: 18750, mitigation_value: 11250, recon: true, recon_value: 7500, day_of_drying: null, moisture_alerts: 0, notes: "Cat 3 basement backup. Completed and paid.", priority: "normal", created_by: "demo-pm", created_at: "2026-05-28T08:15:00Z", updated_at: "2026-06-25T17:45:00Z", company_id: DEMO_COMPANY_ID, mortgage_company: "Chase", scope_notes: "Antimicrobial; remove & replace carpet + pad.", payment_type: "insurance" },
  { id: "J-1024", customer: "Nathan Brooks", address: "310 Willow Bend, Lafayette, CO", phone: "(555) 330-1024", loss_type: "storm", loss_subtype: "wind", stage: "lead", pm_name: "", pm_id: null, carrier: "USAA", claim_no: "US-11228847", adjuster: "", adjuster_phone: "", adjuster_email: "", date_of_loss: "2026-07-20", contract_value: 0, mitigation_value: 0, recon: false, recon_value: 0, day_of_drying: null, moisture_alerts: 0, notes: "Wind-driven rain, missing shingles. Awaiting inspection.", priority: "normal", created_by: "demo-office", created_at: "2026-07-20T12:00:00Z", updated_at: "2026-07-21T09:00:00Z", company_id: DEMO_COMPANY_ID, mortgage_company: "", scope_notes: "", payment_type: "insurance" },
];

// ── DRYING LOGS ──
const drying_logs = [
  { id: "dl-1", job_id: "J-1042", day: 1, date: "2026-07-15", tech_name: "Leo Byrne", temp: 78, rh: 62, gpp: 98, notes: "Kitchen — Subfloor 42% WME. 4 air movers, 1 LGR dehu set.", created_by: "demo-tech", created_at: "2026-07-15T17:00:00Z" },
  { id: "dl-2", job_id: "J-1042", day: 2, date: "2026-07-16", tech_name: "Leo Byrne", temp: 82, rh: 48, gpp: 74, notes: "Kitchen — Subfloor 31% WME, trending down. Cabinets detached.", created_by: "demo-tech", created_at: "2026-07-16T16:30:00Z" },
  { id: "dl-3", job_id: "J-1042", day: 3, date: "2026-07-17", tech_name: "Leo Byrne", temp: 84, rh: 41, gpp: 61, notes: "Kitchen — Subfloor 24% WME. 2 moisture alerts on baseboard.", created_by: "demo-tech", created_at: "2026-07-17T16:45:00Z" },
  { id: "dl-4", job_id: "J-1028", day: 1, date: "2026-05-29", tech_name: "Leo Byrne", temp: 80, rh: 55, gpp: 82, notes: "Basement — Cat 3 extraction complete, antimicrobial applied.", created_by: "demo-tech", created_at: "2026-05-29T15:00:00Z" },
];

// ── CLAIMS ──
const claims = [
  { id: "cl-1", job_id: "J-1042", carrier_response_status: "approved", supplement_status: "pending", estimate_submitted_date: "2026-07-16", reinspection_requested: false, reinspection_date: null, recoverable_depreciation: 3120, payments_received: 9200, outstanding_balance: 15600, notes: "ACV released for mitigation. RCV pending recon completion.", created_by: "demo-pm", company_id: DEMO_COMPANY_ID, created_at: "2026-07-15T10:00:00Z", updated_at: "2026-07-20T10:00:00Z" },
  { id: "cl-2", job_id: "J-1039", carrier_response_status: "review", supplement_status: "none", estimate_submitted_date: "2026-07-08", reinspection_requested: true, reinspection_date: "2026-07-25", recoverable_depreciation: 6100, payments_received: 0, outstanding_balance: 61250, notes: "Adjuster requested reinspection for smoke scope.", created_by: "demo-pm", company_id: DEMO_COMPANY_ID, created_at: "2026-07-05T10:00:00Z", updated_at: "2026-07-20T11:00:00Z" },
  { id: "cl-3", job_id: "J-1035", carrier_response_status: "approved", supplement_status: "approved", estimate_submitted_date: "2026-06-20", reinspection_requested: false, reinspection_date: null, recoverable_depreciation: 2450, payments_received: 20000, outstanding_balance: 18900, notes: "Supplement for VCT flooring approved.", created_by: "demo-owner", company_id: DEMO_COMPANY_ID, created_at: "2026-06-19T10:00:00Z", updated_at: "2026-07-15T10:00:00Z" },
];

// ── SUPPLEMENTS ──
const supplements = [
  { id: "sp-1", job_id: "J-1042", supplement_number: 1, contractor_total: 4200, carrier_total: 0, approved_amount: 0, difference: 4200, status: "submitted", justification: "Additional cabinet reset + toe kick replacement discovered after demo.", notes: "Photos attached.", submitted_date: "2026-07-18", response_date: null, company_id: DEMO_COMPANY_ID, created_by: "demo-estimator", created_at: "2026-07-18T12:00:00Z", updated_at: "2026-07-18T12:00:00Z" },
  { id: "sp-2", job_id: "J-1035", supplement_number: 1, contractor_total: 3100, carrier_total: 3100, approved_amount: 3100, difference: 0, status: "approved", justification: "VCT flooring replacement over damaged area.", notes: "Approved in full.", submitted_date: "2026-06-28", response_date: "2026-07-10", company_id: DEMO_COMPANY_ID, created_by: "demo-estimator", created_at: "2026-06-28T12:00:00Z", updated_at: "2026-07-10T12:00:00Z" },
];

// ── PAYMENTS ──
const payments = [
  { id: "pay-1", job_id: "J-1042", payment_type: "deposit", source: "carrier", amount: 9200, check_number: "SF-448201", date_received: "2026-07-17", deductible_amount: 1000, deductible_collected: true, customer_responsibility: 0, mortgage_hold: true, mortgage_hold_amount: 5000, notes: "Mitigation ACV. Mortgage endorsement pending.", company_id: DEMO_COMPANY_ID, created_by: "demo-office", created_at: "2026-07-17T14:00:00Z" },
  { id: "pay-2", job_id: "J-1035", payment_type: "progress", source: "carrier", amount: 20000, check_number: "TR-882134", date_received: "2026-07-05", deductible_amount: 2500, deductible_collected: true, customer_responsibility: 0, mortgage_hold: false, mortgage_hold_amount: 0, notes: "First recon draw.", company_id: DEMO_COMPANY_ID, created_by: "demo-office", created_at: "2026-07-05T14:00:00Z" },
  { id: "pay-3", job_id: "J-1028", payment_type: "final", source: "homeowner", amount: 1000, check_number: "1281", date_received: "2026-06-25", deductible_amount: 1000, deductible_collected: true, customer_responsibility: 1000, mortgage_hold: false, mortgage_hold_amount: 0, notes: "Deductible collected at closeout.", company_id: DEMO_COMPANY_ID, created_by: "demo-office", created_at: "2026-06-25T14:00:00Z" },
];

// ── JOB PHOTOS ──
// Uses inline SVG data URIs so demo photos render without any network access.
const photoSvg = (label: string, color: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='400' height='300' fill='${color}'/><text x='50%' y='50%' fill='#ffffff' font-family='Inter,sans-serif' font-size='22' text-anchor='middle' dominant-baseline='middle'>${label}</text></svg>`
  );

const job_photos = [
  { id: "ph-1", job_id: "J-1042", url: photoSvg("Kitchen · Before", "#1f2937"), caption: "Kitchen supply line damage — before mitigation", photo_type: "photo", taken_at: "2026-07-14T14:00:00Z", uploaded_by: "demo-tech", uploaded_by_name: "Leo Byrne", company_id: DEMO_COMPANY_ID, created_at: "2026-07-14T14:05:00Z" },
  { id: "ph-2", job_id: "J-1042", url: photoSvg("Moisture Map", "#0d9488"), caption: "Day 1 moisture mapping", photo_type: "document", taken_at: "2026-07-15T17:00:00Z", uploaded_by: "demo-tech", uploaded_by_name: "Leo Byrne", company_id: DEMO_COMPANY_ID, created_at: "2026-07-15T17:05:00Z" },
  { id: "ph-3", job_id: "J-1039", url: photoSvg("Smoke Damage", "#7c3aed"), caption: "Main floor smoke damage", photo_type: "photo", taken_at: "2026-07-02T19:00:00Z", uploaded_by: "demo-pm", uploaded_by_name: "Marcus Hill", company_id: DEMO_COMPANY_ID, created_at: "2026-07-02T19:05:00Z" },
];

// ── SUBCONTRACTORS ──
const subcontractors = [
  { id: "sub-1", name: "Grace Okafor", company_name: "Okafor Flooring", trade: "Flooring", phone: "(555) 201-0150", email: "grace@demo-flooring.com", license_number: "CO-FL-88214", insurance_expiry: "2026-12-31", status: "active", notes: "Preferred flooring sub.", company_id: DEMO_COMPANY_ID, created_by: "demo-owner", created_at: "2025-02-01T09:00:00Z" },
  { id: "sub-2", name: "Diego Ramos", company_name: "Ramos Drywall & Paint", trade: "Drywall", phone: "(555) 201-0160", email: "diego@demo-drywall.com", license_number: "CO-DW-55190", insurance_expiry: "2026-09-30", status: "active", notes: "Fast turnaround on hangs.", company_id: DEMO_COMPANY_ID, created_by: "demo-owner", created_at: "2025-02-03T09:00:00Z" },
  { id: "sub-3", name: "Helen Cho", company_name: "Cho Electric", trade: "Electrical", phone: "(555) 201-0170", email: "helen@demo-electric.com", license_number: "CO-EL-22781", insurance_expiry: "2026-11-15", status: "active", notes: "Licensed master electrician.", company_id: DEMO_COMPANY_ID, created_by: "demo-owner", created_at: "2025-02-05T09:00:00Z" },
];

// ── SUBCONTRACTOR ASSIGNMENTS ──
const subcontractor_assignments = [
  { id: "sa-1", job_id: "J-1042", subcontractor_id: "sub-2", trade: "Drywall", amount: 2800, status: "scheduled", scheduled_date: "2026-07-24", completed_date: null, notes: "Hang & finish after drying complete.", created_at: "2026-07-18T09:00:00Z" },
  { id: "sa-2", job_id: "J-1035", subcontractor_id: "sub-1", trade: "Flooring", amount: 4600, status: "completed", scheduled_date: "2026-07-08", completed_date: "2026-07-12", notes: "VCT installed.", created_at: "2026-07-01T09:00:00Z" },
  { id: "sa-3", job_id: "J-1035", subcontractor_id: "sub-3", trade: "Electrical", amount: 1500, status: "in_progress", scheduled_date: "2026-07-19", completed_date: null, notes: "Replace damaged fixtures over server room.", created_at: "2026-07-15T09:00:00Z" },
];

// ── CUSTOMERS ──
const customers = [
  { id: "cust-1", name: "Robert & Linda Chen", email: "rchen@demo-mail.com", phone: "(555) 330-1042", address: "88 Maple Grove Dr", city: "Boulder", state: "CO", zip: "80302", source: "insurance_referral", notes: "Repeat customer.", company_id: DEMO_COMPANY_ID, created_by: "demo-office", created_at: "2026-07-14T13:00:00Z", updated_at: "2026-07-14T13:00:00Z" },
  { id: "cust-2", name: "Aisha Mohammed", email: "amohammed@demo-mail.com", phone: "(555) 330-1039", address: "204 Riverbend Ct", city: "Longmont", state: "CO", zip: "80501", source: "google", notes: "", company_id: DEMO_COMPANY_ID, created_by: "demo-office", created_at: "2026-07-02T18:00:00Z", updated_at: "2026-07-02T18:00:00Z" },
  { id: "cust-3", name: "Ethan Park", email: "epark@demo-mail.com", phone: "(555) 330-1031", address: "551 Sunflower Ln", city: "Erie", state: "CO", zip: "80516", source: "referral", notes: "Self-pay mold job.", company_id: DEMO_COMPANY_ID, created_by: "demo-office", created_at: "2026-07-10T15:00:00Z", updated_at: "2026-07-10T15:00:00Z" },
];

// ── LEADS ──
const leads = [
  { id: "ld-1", customer_name: "Nathan Brooks", email: "nbrooks@demo-mail.com", phone: "(555) 330-1024", address: "310 Willow Bend, Lafayette, CO", loss_type: "storm", stage: "new", priority: "normal", estimated_value: 14000, source: "USAA referral", assigned_to: "demo-office", assigned_to_name: "Sofia Alvarez", inspection_date: "2026-07-23", customer_id: null, converted_job_id: null, lost_reason: null, notes: "Wind damage, awaiting inspection.", company_id: DEMO_COMPANY_ID, created_by: "demo-office", created_at: "2026-07-20T12:00:00Z", updated_at: "2026-07-21T09:00:00Z" },
  { id: "ld-2", customer_name: "Yuki Tanaka", email: "ytanaka@demo-mail.com", phone: "(555) 330-2001", address: "9 Aspen Ct, Boulder, CO", loss_type: "water", stage: "contacted", priority: "high", estimated_value: 8500, source: "website", assigned_to: "demo-pm", assigned_to_name: "Marcus Hill", inspection_date: "2026-07-24", customer_id: null, converted_job_id: null, lost_reason: null, notes: "Dishwasher leak, wants quick turnaround.", company_id: DEMO_COMPANY_ID, created_by: "demo-office", created_at: "2026-07-19T10:00:00Z", updated_at: "2026-07-21T08:00:00Z" },
  { id: "ld-3", customer_name: "Carlos Mendez", email: "cmendez@demo-mail.com", phone: "(555) 330-2002", address: "45 Pine Hollow, Erie, CO", loss_type: "fire", stage: "estimate_sent", priority: "normal", estimated_value: 32000, source: "referral", assigned_to: "demo-estimator", assigned_to_name: "Priya Nair", inspection_date: "2026-07-17", customer_id: null, converted_job_id: null, lost_reason: null, notes: "Estimate delivered, following up.", company_id: DEMO_COMPANY_ID, created_by: "demo-estimator", created_at: "2026-07-15T10:00:00Z", updated_at: "2026-07-20T10:00:00Z" },
];

// ── ACTIVITY LOGS ──
const activity_logs = [
  { id: "al-1", title: "Day 3 drying reading logged", description: "J-1042 · Kitchen subfloor 24% WME", action_type: "drying_log", job_id: "J-1042", user_id: "demo-tech", user_name: "Leo Byrne", company_id: DEMO_COMPANY_ID, created_at: "2026-07-17T16:45:00Z" },
  { id: "al-2", title: "Supplement #1 submitted", description: "J-1042 · $4,200 cabinet reset", action_type: "supplement", job_id: "J-1042", user_id: "demo-estimator", user_name: "Priya Nair", company_id: DEMO_COMPANY_ID, created_at: "2026-07-18T12:00:00Z" },
  { id: "al-3", title: "Reinspection requested", description: "J-1039 · Smoke scope review 07/25", action_type: "claim", job_id: "J-1039", user_id: "demo-pm", user_name: "Marcus Hill", company_id: DEMO_COMPANY_ID, created_at: "2026-07-20T11:00:00Z" },
  { id: "al-4", title: "Payment received", description: "J-1042 · $9,200 mitigation ACV", action_type: "payment", job_id: "J-1042", user_id: "demo-office", user_name: "Sofia Alvarez", company_id: DEMO_COMPANY_ID, created_at: "2026-07-17T14:00:00Z" },
];

// ── JOB MESSAGES ──
const job_messages = [
  { id: "jm-1", job_id: "J-1042", channel_type: "internal", message_text: "Cabinets detached, subfloor drying well. On track for demo Thursday.", sender_id: "demo-tech", sender_name: "Leo Byrne", sender_avatar: "LB", company_id: DEMO_COMPANY_ID, created_at: "2026-07-16T16:35:00Z" },
  { id: "jm-2", job_id: "J-1042", channel_type: "internal", message_text: "Thanks Leo. Priya is drafting the supplement for the extra cabinet work.", sender_id: "demo-pm", sender_name: "Marcus Hill", sender_avatar: "MH", company_id: DEMO_COMPANY_ID, created_at: "2026-07-16T16:40:00Z" },
  { id: "jm-3", job_id: "J-1042", channel_type: "homeowner", message_text: "Hi Chen family — drying is progressing on schedule. We'll begin cabinet reset next week.", sender_id: "demo-pm", sender_name: "Marcus Hill", sender_avatar: "MH", company_id: DEMO_COMPANY_ID, created_at: "2026-07-17T09:15:00Z" },
];

/**
 * A fresh, mutable copy of the demo data store. Demo Mode reads and writes this
 * in-memory store only. A factory keeps each browser session isolated and lets
 * tests reset state deterministically.
 */
export const createDemoStore = (): Record<string, any[]> => ({
  profiles: structuredClone(profiles),
  companies: structuredClone(companies),
  jobs: structuredClone(jobs),
  drying_logs: structuredClone(drying_logs),
  claims: structuredClone(claims),
  supplements: structuredClone(supplements),
  payments: structuredClone(payments),
  job_photos: structuredClone(job_photos),
  subcontractors: structuredClone(subcontractors),
  subcontractor_assignments: structuredClone(subcontractor_assignments),
  customers: structuredClone(customers),
  leads: structuredClone(leads),
  activity_logs: structuredClone(activity_logs),
  job_messages: structuredClone(job_messages),
  messages: [],
  automation_rules: [],
  user_roles: [],
});
