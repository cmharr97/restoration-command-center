import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Logo, Ic } from "@/components/recon/ReconUI";
import { T } from "@/lib/recon-data";
import { Flame } from "lucide-react";

/* ── ANIMATION ── */
const FadeIn = ({ children, className = "", delay = 0, y = 30 }: { children: React.ReactNode; className?: string; delay?: number; y?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
};

/* ── BROWSER FRAME ── */
const BrowserFrame = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl border overflow-hidden shadow-2xl shadow-black/30 ${className}`} style={{ borderColor: "var(--t-border)" }}>
    <div className="flex items-center gap-2 px-4 py-2" style={{ background: "var(--t-surface)", borderBottom: "1px solid var(--t-border)" }}>
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#f59e0b" }} />
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#22c55e" }} />
      <div className="flex-1 mx-8">
        <div className="max-w-xs mx-auto h-5 rounded-md flex items-center justify-center" style={{ background: "var(--t-surface-high)" }}>
          <span className="text-[9px] font-medium" style={{ color: "var(--t-dim)" }}>app.reconpro.com</span>
        </div>
      </div>
    </div>
    <div style={{ background: "var(--t-bg)" }}>{children}</div>
  </div>
);

/* ── MOCKUPS ── */
const DashboardMockup = () => (
  <div className="p-5">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--t-orange-dim)" }}>
        <Ic n="dash" s={14} c="#e85c0d"/>
      </div>
      <div>
        <div className="text-[11px] font-bold" style={{ color: "var(--t-white)" }}>Command Center</div>
        <div className="text-[9px]" style={{ color: "var(--t-dim)" }}>Tuesday, March 9</div>
      </div>
    </div>
    <div className="grid grid-cols-4 gap-2.5 mb-3">
      {[
        { label: "Active Jobs", val: "24", color: "#e85c0d" },
        { label: "Revenue", val: "$482K", color: "#22c55e" },
        { label: "Insurance", val: "8", color: "#f59e0b" },
        { label: "Drying", val: "6", color: "#3b82f6" },
      ].map(m => (
        <div key={m.label} className="rounded-lg p-2.5 border" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
          <div className="text-base font-extrabold" style={{ color: m.color }}>{m.val}</div>
          <div className="text-[8px] font-medium mt-0.5" style={{ color: "var(--t-muted)" }}>{m.label}</div>
        </div>
      ))}
    </div>
    <div className="rounded-lg border p-3 mb-2.5" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
      <div className="text-[10px] font-bold mb-2" style={{ color: "var(--t-white)" }}>Job Pipeline</div>
      <div className="flex gap-1 h-1.5 rounded-full overflow-hidden">
        <div className="flex-[3]" style={{ background: "#3b82f6" }} />
        <div className="flex-[5]" style={{ background: "#f59e0b" }} />
        <div className="flex-[8]" style={{ background: "#22c55e" }} />
        <div className="flex-[2]" style={{ background: "#a78bfa" }} />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2">
      {[
        { stage: "Mitigation", count: 5, color: "#3b82f6" },
        { stage: "Supplement", count: 8, color: "#f59e0b" },
        { stage: "Reconstruction", count: 11, color: "#22c55e" },
      ].map(s => (
        <div key={s.stage} className="rounded-lg p-2 border flex items-center gap-2" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
          <div className="w-1 h-6 rounded-full" style={{ background: s.color }} />
          <div>
            <div className="text-[9px] font-semibold" style={{ color: "var(--t-white)" }}>{s.stage}</div>
            <div className="text-[8px]" style={{ color: "var(--t-dim)" }}>{s.count} jobs</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const JobWorkspaceMockup = () => (
  <div className="p-5">
    <div className="flex items-center justify-between mb-3">
      <div>
        <div className="text-[11px] font-bold" style={{ color: "var(--t-white)" }}>J-0847 — Martinez Residence</div>
        <div className="text-[9px]" style={{ color: "var(--t-dim)" }}>2847 Oak Valley Dr, Houston TX</div>
      </div>
      <div className="text-[9px] px-2 py-1 rounded font-semibold" style={{ background: "#3b82f618", color: "#3b82f6", border: "1px solid #3b82f630" }}>Drying Day 3</div>
    </div>
    <div className="flex gap-1 mb-3">
      {["Overview", "Insurance", "Payments", "Photos", "Comms"].map((t, i) => (
        <div key={t} className="text-[8px] px-2 py-1 rounded-md font-semibold" style={{
          background: i === 0 ? "var(--t-orange-dim)" : "var(--t-surface-high)",
          color: i === 0 ? "#e85c0d" : "var(--t-dim)",
        }}>{t}</div>
      ))}
    </div>
    <div className="grid grid-cols-2 gap-2 mb-2.5">
      {[
        { label: "Contract", val: "$18,400" },
        { label: "Collected", val: "$8,200" },
        { label: "Carrier", val: "State Farm" },
        { label: "Claim", val: "CLM-4821" },
      ].map(f => (
        <div key={f.label} className="rounded-lg p-2 border" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
          <div className="text-[8px]" style={{ color: "var(--t-dim)" }}>{f.label}</div>
          <div className="text-[10px] font-bold" style={{ color: "var(--t-white)" }}>{f.val}</div>
        </div>
      ))}
    </div>
    <div className="rounded-lg p-2 border" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
      <div className="text-[9px] font-semibold mb-1" style={{ color: "var(--t-white)" }}>Recent Activity</div>
      {["Payment recorded — $8,200 carrier check", "Drying log added — Day 3", "Supplement submitted — $4,200"].map(a => (
        <div key={a} className="text-[8px] py-1 border-b last:border-0" style={{ color: "var(--t-muted)", borderColor: "var(--t-border)" }}>{a}</div>
      ))}
    </div>
  </div>
);

const LeadPipelineMockup = () => (
  <div className="p-5">
    <div className="text-[11px] font-bold mb-3" style={{ color: "var(--t-white)" }}>Lead Pipeline</div>
    <div className="flex gap-2 mb-3">
      {[
        { stage: "New", count: 4, color: "#e85c0d" },
        { stage: "Inspection", count: 3, color: "#f59e0b" },
        { stage: "Estimate", count: 2, color: "#3b82f6" },
        { stage: "Signed", count: 1, color: "#22c55e" },
      ].map(s => (
        <div key={s.stage} className="flex-1 rounded-lg p-2 text-center border" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
          <div className="text-sm font-extrabold" style={{ color: s.color }}>{s.count}</div>
          <div className="text-[8px]" style={{ color: "var(--t-dim)" }}>{s.stage}</div>
        </div>
      ))}
    </div>
    {[
      { name: "Williams Family", type: "Water Damage", val: "$12K", stage: "Inspection" },
      { name: "Chen Property", type: "Fire/Smoke", val: "$34K", stage: "New Lead" },
      { name: "Jackson Home", type: "Storm", val: "$8K", stage: "Estimate" },
    ].map(l => (
      <div key={l.name} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "var(--t-border)" }}>
        <div>
          <div className="text-[10px] font-semibold" style={{ color: "var(--t-white)" }}>{l.name}</div>
          <div className="text-[8px]" style={{ color: "var(--t-dim)" }}>{l.type}</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-bold" style={{ color: "var(--t-muted)" }}>{l.val}</div>
          <div className="text-[8px]" style={{ color: "var(--t-dim)" }}>{l.stage}</div>
        </div>
      </div>
    ))}
  </div>
);

const ReportsMockup = () => (
  <div className="p-5">
    <div className="text-[11px] font-bold mb-3" style={{ color: "var(--t-white)" }}>Reports & Analytics</div>
    <div className="grid grid-cols-3 gap-2 mb-3">
      {[
        { label: "Total Revenue", val: "$482K", color: "#22c55e" },
        { label: "Collected", val: "$318K", color: "#3b82f6" },
        { label: "Outstanding", val: "$164K", color: "#ef4444" },
      ].map(m => (
        <div key={m.label} className="rounded-lg p-2 border text-center" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
          <div className="text-sm font-extrabold" style={{ color: m.color }}>{m.val}</div>
          <div className="text-[8px]" style={{ color: "var(--t-dim)" }}>{m.label}</div>
        </div>
      ))}
    </div>
    <div className="rounded-lg p-3 border" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
      <div className="text-[9px] font-semibold mb-2" style={{ color: "var(--t-white)" }}>Jobs by Stage</div>
      <div className="flex items-end gap-1 h-16">
        {[4, 7, 12, 9, 5, 3, 2].map((h, i) => (
          <div key={i} className="flex-1 rounded-t" style={{ height: `${(h / 12) * 100}%`, background: i === 2 ? "#e85c0d" : "var(--t-surface-high)" }} />
        ))}
      </div>
    </div>
  </div>
);

const HomeownerPortalMockup = () => (
  <div className="p-5">
    <div className="text-[11px] font-bold mb-1" style={{ color: "var(--t-white)" }}>Homeowner Portal</div>
    <div className="text-[9px] mb-3" style={{ color: "var(--t-dim)" }}>Martinez Residence — Project Status</div>
    <div className="rounded-lg p-3 border mb-3" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
      <div className="flex gap-1 mb-2">
        {["Lead", "Mitigation", "Drying", "Recon", "Complete"].map((s, i) => (
          <div key={s} className="flex-1 h-1.5 rounded-full" style={{ background: i <= 2 ? "#22c55e" : "var(--t-surface-high)" }} />
        ))}
      </div>
      <div className="text-[9px] font-medium" style={{ color: "#22c55e" }}>Active Drying — Day 3 of estimated 5</div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {[{ label: "Photos", count: "12", icon: "photo" }, { label: "Documents", count: "4", icon: "est" }, { label: "Messages", count: "8", icon: "msg" }, { label: "Updates", count: "6", icon: "note" }].map(i => (
        <div key={i.label} className="rounded-lg p-2 border text-center" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
          <div className="flex items-center justify-center mb-0.5"><Ic n={i.icon} s={12} c="var(--t-muted)"/></div>
          <div className="text-[10px] font-bold" style={{ color: "var(--t-white)" }}>{i.count}</div>
          <div className="text-[8px]" style={{ color: "var(--t-dim)" }}>{i.label}</div>
        </div>
      ))}
    </div>
  </div>
);

const CustomerCRMMockup = () => (
  <div className="p-5">
    <div className="text-[11px] font-bold mb-3" style={{ color: "var(--t-white)" }}>Customer CRM</div>
    {[
      { name: "Martinez Family", jobs: 2, val: "$36K", email: "martinez@email.com" },
      { name: "Thompson LLC", jobs: 4, val: "$128K", email: "info@thompson.com" },
      { name: "Chen Properties", jobs: 1, val: "$67K", email: "chen@email.com" },
    ].map(c => (
      <div key={c.name} className="rounded-lg p-2.5 border mb-2 last:mb-0" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
        <div className="flex items-center justify-between mb-1">
          <div className="text-[10px] font-semibold" style={{ color: "var(--t-white)" }}>{c.name}</div>
          <div className="text-[9px] font-bold" style={{ color: "#e85c0d" }}>{c.val}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-[8px]" style={{ color: "var(--t-dim)" }}>{c.email}</div>
          <div className="text-[8px]" style={{ color: "var(--t-muted)" }}>{c.jobs} jobs</div>
        </div>
      </div>
    ))}
  </div>
);

/* ── DATA ── */
const FEATURES = [
  { icon: "jobs", title: "Job Command Center", desc: "Track every restoration project from first call through reconstruction and final closeout." },
  { icon: "shield", title: "Insurance Tracking", desc: "Monitor claim progress, supplements, carrier approvals, and payment milestones internally." },
  { icon: "chart", title: "Lead Pipeline", desc: "Convert new leads into restoration jobs with stage-based pipeline management." },
  { icon: "customer", title: "Customer CRM", desc: "Manage homeowner profiles, property contacts, and job history across projects." },
  { icon: "chart", title: "Reporting", desc: "Track revenue, job pipeline, payment collection, and team performance metrics." },
  { icon: "truck", title: "Subcontractor Coordination", desc: "Assign trades to jobs and track work progress across reconstruction projects." },
  { icon: "dollar", title: "Payment Tracking", desc: "Record carrier checks, deductibles, and mortgage holds with full financial visibility." },
  { icon: "msg", title: "Team Communication", desc: "Job-linked chat channels for internal teams, homeowners, and subcontractors." },
  { icon: "moisture", title: "Drying Documentation", desc: "Log moisture readings, equipment usage, and daily drying progress per job." },
];

const WORKFLOW_STEPS = [
  { num: "01", title: "Receive Loss Call", desc: "Intake the claim and create a new lead in the pipeline", icon: "contact" },
  { num: "02", title: "Create Job", desc: "Build the job record with customer and insurance details", icon: "jobs" },
  { num: "03", title: "Run Mitigation", desc: "Deploy equipment and document drying progress daily", icon: "moisture" },
  { num: "04", title: "Submit Estimate", desc: "Generate estimates and submit to carrier for approval", icon: "est" },
  { num: "05", title: "Track Claim", desc: "Log carrier responses and manage supplement submissions", icon: "shield" },
  { num: "06", title: "Coordinate Reconstruction", desc: "Schedule trades and manage the rebuild process", icon: "tool" },
  { num: "07", title: "Close Project", desc: "Record final payments and close out the job", icon: "check" },
];

const PRODUCT_SCREENS = [
  { title: "Operations Dashboard", desc: "Active jobs, revenue, pipeline stages, and operational alerts at a glance.", mockup: <DashboardMockup /> },
  { title: "Job Workspace", desc: "Full job detail with tabs for insurance, payments, photos, communication, and more.", mockup: <JobWorkspaceMockup /> },
  { title: "Lead Pipeline", desc: "Track leads from first call through contract signing and conversion to active jobs.", mockup: <LeadPipelineMockup /> },
  { title: "Customer CRM", desc: "Manage homeowner profiles with contact info, property data, and job history.", mockup: <CustomerCRMMockup /> },
  { title: "Reports & Analytics", desc: "Revenue breakdowns, collection rates, and pipeline performance metrics.", mockup: <ReportsMockup /> },
  { title: "Homeowner Portal", desc: "Customer-facing portal with project progress, photos, documents, and messaging.", mockup: <HomeownerPortalMockup /> },
];

const VIDEO_PREVIEWS = [
  { title: "Platform Overview", desc: "Full walkthrough of the ReCon Pro workspace and core features.", icon: "dash" },
  { title: "Job Workflow", desc: "See how a restoration job flows from lead to closeout.", icon: "jobs" },
  { title: "Claims & Supplements", desc: "Insurance tracking, supplement management, and carrier communication.", icon: "shield" },
  { title: "Owner Dashboard", desc: "Real-time operational metrics and company performance.", icon: "chart" },
  { title: "Lead Pipeline", desc: "Converting leads into active restoration projects.", icon: "customer" },
];

/* ── LANDING PAGE ── */
interface LandingProps {
  onSignIn: () => void;
  onDemo: () => void;
  onCreateAccount: () => void;
}

const Landing = ({ onSignIn, onDemo, onCreateAccount }: LandingProps) => {
  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--t-bg)", color: "var(--t-text)" }}>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: "var(--t-bg)", borderBottom: "1px solid var(--t-border)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size={64} />
          <div className="hidden md:flex items-center gap-8">
            {[["Features", "#features"], ["Product", "#product"], ["How It Works", "#workflow"], ["Videos", "#videos"]].map(([label, href]) => (
              <a key={label} href={href} className="text-xs font-semibold transition-opacity hover:opacity-80" style={{ color: "var(--t-muted)" }}>{label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onSignIn} className="px-4 py-2 text-xs font-semibold rounded-lg" style={{ color: "var(--t-muted)" }}>Sign In</button>
            <button onClick={onDemo} className="px-5 py-2 text-xs font-bold rounded-lg shadow-lg" style={{ background: "linear-gradient(135deg, #e85c0d, #c84009)", color: "#fff", boxShadow: "0 4px 20px rgba(232,92,13,0.3)" }}>
              Start Demo
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "90vh" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,92,13,0.08) 0%, transparent 70%)" }} />
        <div className="absolute top-40 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20" style={{ background: "rgba(232,92,13,0.12)" }} />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10" style={{ background: "rgba(59,130,246,0.12)" }} />

        <div className="max-w-7xl mx-auto px-6 pt-20 sm:pt-28 pb-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full text-[10px] font-bold tracking-widest uppercase" style={{ border: "1px solid rgba(232,92,13,0.25)", background: "rgba(232,92,13,0.06)", color: "#e85c0d" }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#e85c0d" }} />
                  Restoration Operations Platform
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.06] tracking-tight mb-6" style={{ color: "var(--t-white)" }}>
                  The Command Center for{" "}
                  <span className="relative">
                    <span style={{ color: "#e85c0d" }}>Restoration Companies</span>
                    <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 300 6" fill="none">
                      <path d="M0 5C60 1 240 1 300 5" stroke="#e85c0d" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                    </svg>
                  </span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "var(--t-muted)" }}>
                  Manage jobs, claims, payments, supplements, documents, subcontractors, and communication in one platform built specifically for restoration contractors.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <button onClick={onDemo} className="px-8 py-4 text-sm font-bold rounded-xl transition-all hover:opacity-90 shadow-xl" style={{ background: "linear-gradient(135deg, #e85c0d, #c84009)", color: "#fff", boxShadow: "0 8px 30px rgba(232,92,13,0.35)" }}>
                    Start Demo →
                  </button>
                  <button className="px-8 py-4 text-sm font-bold rounded-xl transition-all hover:opacity-80 flex items-center gap-2" style={{ background: "var(--t-surface)", border: "1px solid var(--t-border)", color: "var(--t-white)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="8,5 19,12 8,19" /></svg>
                    Watch Product Tour
                  </button>
                </div>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="flex items-center gap-8 mt-12 pt-8" style={{ borderTop: "1px solid var(--t-border)" }}>
                  {[{ val: "12", label: "Job Stages" }, { val: "6", label: "User Roles" }, { val: "3", label: "Chat Channels" }, { val: "1", label: "Platform" }].map(s => (
                    <div key={s.label}>
                      <div className="text-xl font-extrabold" style={{ color: "#e85c0d" }}>{s.val}</div>
                      <div className="text-[10px] font-medium" style={{ color: "var(--t-dim)" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.2} y={40}>
              <div className="relative">
                <div className="absolute -inset-6 rounded-3xl blur-3xl opacity-25" style={{ background: "rgba(232,92,13,0.1)" }} />
                <BrowserFrame className="relative">
                  <DashboardMockup />
                </BrowserFrame>
                <motion.div
                  className="absolute -bottom-4 -left-6 rounded-xl border p-3 shadow-xl"
                  style={{ background: "var(--t-surface)", borderColor: "var(--t-border)", boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.6 }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(34,197,94,0.15)" }}><Ic n="check" s={12} c="#22c55e"/></div>
                    <div>
                      <div className="text-[10px] font-semibold" style={{ color: "var(--t-white)" }}>Payment Recorded</div>
                      <div className="text-[8px]" style={{ color: "var(--t-dim)" }}>Carrier check — $18,400</div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="absolute -top-3 -right-5 rounded-xl border p-3 shadow-xl"
                  style={{ background: "var(--t-surface)", borderColor: "var(--t-border)", boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3, duration: 0.6 }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(59,130,246,0.15)" }}><Ic n="moisture" s={12} c="#3b82f6"/></div>
                    <div>
                      <div className="text-[10px] font-semibold" style={{ color: "var(--t-white)" }}>Drying Day 3</div>
                      <div className="text-[8px]" style={{ color: "var(--t-dim)" }}>RH 48% — All rooms logged</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── PROBLEM → SOLUTION → OUTCOME ── */}
      <section className="py-24" style={{ borderTop: "1px solid var(--t-border)", background: "var(--t-surface)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-[10px] font-bold tracking-widest uppercase" style={{ border: "1px solid rgba(232,92,13,0.2)", background: "rgba(232,92,13,0.05)", color: "#e85c0d" }}>
                Why ReCon Pro
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "var(--t-white)" }}>
                Stop juggling tools.{" "}<span style={{ color: "#e85c0d" }}>Start running operations.</span>
              </h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "The Problem",
                color: "#ef4444",
                icon: "alert",
                items: ["Spreadsheets for job tracking", "Paper files & email chains", "Separate tools per function", "Lost carrier communications", "Manual drying documentation", "Uncoordinated subcontractors"],
              },
              {
                title: "The Solution",
                color: "#e85c0d",
                icon: "shield",
                items: ["Unified job command center", "Internal claim status tracking", "Supplement management", "Payment & financial tracking", "Subcontractor coordination", "Team & homeowner communication"],
              },
              {
                title: "The Outcome",
                color: "#22c55e",
                icon: "check",
                items: ["Less administrative overhead", "Faster supplement turnaround", "Better claim visibility", "Clear project coordination", "More profitable jobs", "Professional documentation"],
              },
            ].map((col, ci) => (
              <FadeIn key={col.title} delay={ci * 0.12}>
                <div className="rounded-2xl border p-8 h-full" style={{ background: "var(--t-bg)", borderColor: "var(--t-border)" }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: col.color + "15" }}>
                      <Ic n={col.icon} s={18} c={col.color} />
                    </div>
                    <h3 className="text-lg font-extrabold" style={{ color: col.color }}>{col.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {col.items.map(item => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: col.color }} />
                        <span className="text-sm" style={{ color: "var(--t-muted)" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT PREVIEWS ── */}
      <section id="product" className="py-24" style={{ borderTop: "1px solid var(--t-border)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-[10px] font-bold tracking-widest uppercase" style={{ border: "1px solid rgba(232,92,13,0.2)", background: "rgba(232,92,13,0.05)", color: "#e85c0d" }}>
                Product Preview
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: "var(--t-white)" }}>
                See Every Screen
              </h2>
              <p className="text-sm max-w-lg mx-auto" style={{ color: "var(--t-muted)" }}>
                From the operations dashboard to the homeowner portal — every view is designed for restoration professionals.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCT_SCREENS.map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.08}>
                <div className="rounded-2xl border overflow-hidden group transition-all hover:shadow-lg" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
                  <div className="overflow-hidden">
                    <BrowserFrame>{s.mockup}</BrowserFrame>
                  </div>
                  <div className="p-5">
                    <div className="text-sm font-bold mb-1.5" style={{ color: "var(--t-white)" }}>{s.title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: "var(--t-dim)" }}>{s.desc}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section id="features" className="py-24" style={{ borderTop: "1px solid var(--t-border)", background: "var(--t-surface)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-[10px] font-bold tracking-widest uppercase" style={{ border: "1px solid rgba(232,92,13,0.2)", background: "rgba(232,92,13,0.05)", color: "#e85c0d" }}>
                Features
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: "var(--t-white)" }}>
                Everything You Need to Run Restoration
              </h2>
              <p className="text-sm max-w-lg mx-auto" style={{ color: "var(--t-muted)" }}>
                Purpose-built tools for every aspect of restoration operations.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.06}>
                <div className="rounded-xl border p-6 transition-all hover:border-opacity-60 group" style={{ background: "var(--t-bg)", borderColor: "var(--t-border)" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: "var(--t-orange-dim)" }}>
                    <Ic n={f.icon} s={20} c="#e85c0d" />
                  </div>
                  <div className="text-base font-bold mb-2" style={{ color: "var(--t-white)" }}>{f.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--t-muted)" }}>{f.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESTORATION WORKFLOW ── */}
      <section id="workflow" className="py-24" style={{ borderTop: "1px solid var(--t-border)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-[10px] font-bold tracking-widest uppercase" style={{ border: "1px solid rgba(232,92,13,0.2)", background: "rgba(232,92,13,0.05)", color: "#e85c0d" }}>
                Workflow
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: "var(--t-white)" }}>
                From First Call to Final Invoice
              </h2>
              <p className="text-sm max-w-lg mx-auto" style={{ color: "var(--t-muted)" }}>
                ReCon Pro follows the entire restoration lifecycle so nothing falls through the cracks.
              </p>
            </div>
          </FadeIn>

          {/* Desktop: horizontal */}
          <div className="hidden lg:block">
            <div className="flex items-start gap-0">
              {WORKFLOW_STEPS.map((s, i) => (
                <FadeIn key={s.num} delay={i * 0.08} className="flex-1 relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg" style={{ background: "var(--t-surface)", border: "2px solid var(--t-border)" }}>
                      <Ic n={s.icon} s={22} c="#e85c0d" />
                    </div>
                    {i < WORKFLOW_STEPS.length - 1 && (
                      <div className="absolute top-7 left-[calc(50%+28px)] right-0 h-0.5" style={{ background: "var(--t-border)" }}>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: "#e85c0d" }} />
                      </div>
                    )}
                    <div className="text-[10px] font-bold mb-1" style={{ color: "#e85c0d" }}>{s.num}</div>
                    <div className="text-xs font-bold mb-1" style={{ color: "var(--t-white)" }}>{s.title}</div>
                    <div className="text-[10px] leading-relaxed px-2" style={{ color: "var(--t-dim)" }}>{s.desc}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Mobile: vertical */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WORKFLOW_STEPS.map((s, i) => (
              <FadeIn key={s.num} delay={i * 0.06}>
                <div className="rounded-xl border p-5 flex items-start gap-4" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--t-orange-dim)" }}>
                    <Ic n={s.icon} s={18} c="#e85c0d" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold mb-0.5" style={{ color: "#e85c0d" }}>Step {s.num}</div>
                    <div className="text-sm font-bold mb-1" style={{ color: "var(--t-white)" }}>{s.title}</div>
                    <div className="text-xs" style={{ color: "var(--t-dim)" }}>{s.desc}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT VIDEOS ── */}
      <section id="videos" className="py-24" style={{ borderTop: "1px solid var(--t-border)", background: "var(--t-surface)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-[10px] font-bold tracking-widest uppercase" style={{ border: "1px solid rgba(232,92,13,0.2)", background: "rgba(232,92,13,0.05)", color: "#e85c0d" }}>
                Product Tours
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: "var(--t-white)" }}>
                See ReCon Pro in Action
              </h2>
              <p className="text-sm max-w-lg mx-auto" style={{ color: "var(--t-muted)" }}>
                Watch how restoration teams use the platform to manage their daily operations.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VIDEO_PREVIEWS.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.08}>
                <div className="rounded-xl border overflow-hidden group cursor-pointer" style={{ background: "var(--t-bg)", borderColor: "var(--t-border)" }}>
                  <div className="relative h-44 flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--t-surface-high), var(--t-bg))" }}>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-xl" style={{ background: "linear-gradient(135deg, #e85c0d, #c84009)", boxShadow: "0 8px 25px rgba(232,92,13,0.4)" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><polygon points="8,5 19,12 8,19" /></svg>
                    </div>
                    <div className="absolute bottom-3 right-3 text-[9px] px-2 py-1 rounded font-semibold" style={{ background: "rgba(0,0,0,0.6)", color: "var(--t-muted)" }}>Coming Soon</div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-bold mb-1" style={{ color: "var(--t-white)" }}>{v.title}</div>
                    <div className="text-[11px] leading-relaxed" style={{ color: "var(--t-dim)" }}>{v.desc}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUILT FOR RESTORATION ── */}
      <section className="py-24" style={{ borderTop: "1px solid var(--t-border)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="rounded-2xl border p-10 sm:p-16 text-center" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "var(--t-orange-dim)" }}>
                <Ic n="tool" s={28} c="#e85c0d" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: "var(--t-white)" }}>
                Built for Restoration Professionals
              </h2>
              <p className="text-sm leading-relaxed max-w-2xl mx-auto mb-8" style={{ color: "var(--t-muted)" }}>
                ReCon Pro was designed specifically for companies handling water damage, fire damage, storm restoration, and mold remediation. Every feature follows real reconstruction workflows — from emergency mitigation through final invoicing.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: "drop", label: "Water Damage", lucide: false },
                  { icon: "flame", label: "Fire & Smoke", lucide: true },
                  { icon: "alert", label: "Storm Restoration", lucide: false },
                  { icon: "moisture", label: "Mold Remediation", lucide: false },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border p-4" style={{ background: "var(--t-bg)", borderColor: "var(--t-border)" }}>
                    <div className="flex items-center justify-center mb-2">
                      {s.lucide ? <Flame size={20} color="#e85c0d" /> : <Ic n={s.icon} s={20} c="#e85c0d" />}
                    </div>
                    <div className="text-xs font-bold" style={{ color: "var(--t-white)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-28 relative overflow-hidden" style={{ borderTop: "1px solid var(--t-border)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(232,92,13,0.06) 0%, transparent 70%)" }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight" style={{ color: "var(--t-white)" }}>
              Run Your Restoration Company From{" "}
              <span style={{ color: "#e85c0d" }}>One Command Center</span>
            </h2>
            <p className="text-sm sm:text-base mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: "var(--t-muted)" }}>
              See how ReCon Pro helps restoration teams manage jobs, track claims, coordinate subcontractors, and record payments — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={onDemo} className="w-full sm:w-auto px-10 py-4 text-sm font-bold rounded-xl shadow-xl" style={{ background: "linear-gradient(135deg, #e85c0d, #c84009)", color: "#fff", boxShadow: "0 8px 30px rgba(232,92,13,0.35)" }}>
                Start Demo
              </button>
              <button onClick={onCreateAccount} className="w-full sm:w-auto px-10 py-4 text-sm font-bold rounded-xl" style={{ background: "var(--t-surface)", border: "1px solid var(--t-border)", color: "var(--t-white)" }}>
                Create Company Account
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid var(--t-border)", background: "var(--t-surface)" }} className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            <div className="sm:col-span-2">
              <div className="mb-4"><Logo size={48} /></div>
              <p className="text-xs leading-relaxed max-w-sm" style={{ color: "var(--t-dim)" }}>
                The command center for restoration companies. Manage jobs, track claims internally, coordinate subcontractors, and record payments in one platform.
              </p>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "var(--t-muted)" }}>Product</div>
              <div className="space-y-2.5">
                {[["Features", "#features"], ["Product", "#product"], ["How It Works", "#workflow"], ["Videos", "#videos"]].map(([label, href]) => (
                  <a key={label} href={href} className="block text-xs font-medium transition-opacity hover:opacity-80" style={{ color: "var(--t-dim)" }}>{label}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "var(--t-muted)" }}>Get Started</div>
              <div className="space-y-2.5">
                <button onClick={onDemo} className="block text-xs font-medium transition-opacity hover:opacity-80" style={{ color: "var(--t-dim)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>Start Demo</button>
                <button onClick={onCreateAccount} className="block text-xs font-medium transition-opacity hover:opacity-80" style={{ color: "var(--t-dim)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>Create Account</button>
                <button onClick={onSignIn} className="block text-xs font-medium transition-opacity hover:opacity-80" style={{ color: "var(--t-dim)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>Sign In</button>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid var(--t-border)" }}>
            <span className="text-[10px]" style={{ color: "var(--t-dim)" }}>© {new Date().getFullYear()} ReCon Pro. All rights reserved.</span>
            <span className="text-[10px]" style={{ color: "var(--t-dim)" }}>The command center for restoration companies.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
