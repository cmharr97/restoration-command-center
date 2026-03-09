import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Logo, Ic } from "@/components/recon/ReconUI";
import { T } from "@/lib/recon-data";
/* ── ANIMATION HELPERS ── */
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

/* ── DATA ── */
const FEATURES_STRIP = [
  { title: "Dashboard", desc: "Operations overview at a glance" },
  { title: "Job Detail", desc: "Full job workspace with tabs" },
  { title: "Insurance Tracking", desc: "Internal claim tracking" },
  { title: "Supplements", desc: "Supplement management" },
  { title: "Payments", desc: "Financial tracking" },
  { title: "Drying Logs", desc: "Internal moisture documentation" },
  { title: "Communication", desc: "Job-based team messaging" },
];

const PRODUCT_PREVIEWS = [
  { title: "Platform Overview", desc: "See the full ReCon Pro workspace — dashboard, job pipeline, and operational controls.", icon: "dash" },
  { title: "Job Workflow", desc: "Follow a restoration job from lead intake through reconstruction and final payment.", icon: "jobs" },
  { title: "Insurance Tracking", desc: "Manually track carrier responses, supplement statuses, and payment milestones.", icon: "shield" },
  { title: "Job Communication", desc: "Structured chat channels for internal teams, homeowners, and subcontractors.", icon: "msg" },
  { title: "Owner Dashboard", desc: "See active jobs, outstanding payments, and team activity in one view.", icon: "chart" },
];

const AUDIENCE = [
  { icon: "tool", title: "Restoration Companies", desc: "Full-service teams managing water, fire, and storm damage restoration projects end to end." },
  { icon: "drop", title: "Mitigation Teams", desc: "Emergency response crews tracking equipment placement, moisture readings, and drying progress." },
  { icon: "jobs", title: "Reconstruction Contractors", desc: "Rebuild crews managing scopes, trade coordination, and project scheduling through completion." },
  { icon: "shield", title: "Insurance Restoration Specialists", desc: "Companies tracking carrier responses, supplements, and claim progress internally." },
  { icon: "est", title: "Project Managers", desc: "Managers coordinating field teams, schedules, subcontractors, and documentation across jobs." },
  { icon: "moisture", title: "Field Technicians", desc: "Techs logging moisture readings, equipment usage, photos, and daily drying progress on site." },
];

const FEATURE_STORIES = [
  {
    title: "Job Command Center",
    desc: "Track every restoration project from lead through reconstruction in one organized workspace. See pipeline stages, priority levels, assigned teams, and status updates across your entire operation.",
    points: ["12-stage job lifecycle", "Pipeline kanban view", "Team assignment tracking", "Priority & stage management"],
    mockup: "jobs",
  },
  {
    title: "Internal Insurance Tracking",
    desc: "Keep track of carrier responses, supplement approvals, denied items, reinspection requests, and payment progress — all managed internally by your team. This is your company's claim tracker, not a carrier integration.",
    points: ["Carrier response logging", "Denied item tracking", "Supplement status updates", "Payment milestone logging"],
    mockup: "claims",
  },
  {
    title: "Drying Logs & Field Documentation",
    desc: "Log moisture readings, humidity, temperature, equipment placement, and daily progress notes as internal job documentation. Keep a detailed record of drying activity for your own reference and project history.",
    points: ["Daily moisture readings", "Equipment tracking", "GPP / RH / Temp logging", "Multi-day drying timeline"],
    mockup: "drying",
  },
  {
    title: "Supplements & AI Writing Assistant",
    desc: "Create and track supplement entries tied to each job. Use the built-in AI assistant to help draft F9 notes, supplement justifications, adjuster emails, and scope explanations.",
    points: ["AI-drafted F9 notes", "Supplement justification writing", "Adjuster email drafts", "Scope explanation assistance"],
    mockup: "supplements",
  },
  {
    title: "Job Communication Hub",
    desc: "Each job includes structured chat channels so your team can communicate in context. Internal team chat stays private, homeowner messaging keeps customers informed, and subcontractor channels coordinate trades — all tied to the job.",
    points: ["Internal team chat", "Homeowner messaging", "Subcontractor coordination", "Job-linked conversations"],
    mockup: "communication",
  },
  {
    title: "Homeowner Portal",
    desc: "Give homeowners visibility into their project. They can log in, view job progress, see uploaded photos and documents, and communicate directly with the reconstruction team through their own portal.",
    points: ["Job progress visibility", "Photo & document access", "Direct team messaging", "Project status updates"],
    mockup: "homeowner",
  },
  {
    title: "Payments & Financial Tracking",
    desc: "Record payments from homeowners, carriers, and mortgage companies. Track payment types, check numbers, dates, and notes. See total received, outstanding balances, and contract value at a glance.",
    points: ["Multi-source payment tracking", "Outstanding balance visibility", "Check and reference tracking", "Payment history per job"],
    mockup: "payments",
  },
  {
    title: "Subcontractor Coordination",
    desc: "Assign trades to jobs, manage schedules, and track completion across drywall, cabinets, flooring, roofing, painting, electrical, plumbing, and every other reconstruction trade.",
    points: ["Trade assignment", "Schedule management", "Completion tracking", "Subcontractor directory"],
    mockup: "subs",
  },
];

const WORKFLOW_STEPS = [
  { num: "01", title: "Receive Loss Call", desc: "Intake the claim and create a new lead" },
  { num: "02", title: "Create Job", desc: "Build the job record with customer and insurance details" },
  { num: "03", title: "Run Mitigation", desc: "Deploy equipment and document drying progress" },
  { num: "04", title: "Track Claims", desc: "Log carrier responses and manage supplements" },
  { num: "05", title: "Coordinate Recon", desc: "Schedule trades and manage reconstruction" },
  { num: "06", title: "Record Payments", desc: "Track payments from all sources" },
  { num: "07", title: "Close Project", desc: "Final documentation and project closeout" },
];

/* ── MOCKUP COMPONENTS ── */
const BrowserFrame = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl border border-border overflow-hidden shadow-2xl shadow-black/30 ${className}`}>
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border" style={{ background: "var(--t-surface)" }}>
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

const DashboardMockup = () => (
  <div className="p-5">
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--t-orange-dim)" }}>
        <Ic n="dash" s={16} c="#e85c0d"/>
      </div>
      <div>
        <div className="text-xs font-bold" style={{ color: "var(--t-white)" }}>Operations Dashboard</div>
        <div className="text-[10px]" style={{ color: "var(--t-dim)" }}>Company overview</div>
      </div>
    </div>
    <div className="grid grid-cols-4 gap-3 mb-4">
      {[
        { label: "Active Jobs", val: "24", color: "#e85c0d" },
        { label: "Revenue", val: "$482K", color: "#22c55e" },
        { label: "Insurance Jobs", val: "8", color: "#f59e0b" },
        { label: "Drying Active", val: "6", color: "#3b82f6" },
      ].map(m => (
        <div key={m.label} className="rounded-lg p-3 border border-border" style={{ background: "var(--t-surface)" }}>
          <div className="text-lg font-extrabold" style={{ color: m.color }}>{m.val}</div>
          <div className="text-[9px] font-medium mt-0.5" style={{ color: "var(--t-muted)" }}>{m.label}</div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-3">
      {[
        { stage: "Mitigation", count: 5, color: "#3b82f6" },
        { stage: "Estimate Submitted", count: 8, color: "#f59e0b" },
        { stage: "Reconstruction", count: 11, color: "#22c55e" },
      ].map(s => (
        <div key={s.stage} className="rounded-lg p-2.5 border border-border flex items-center gap-2.5" style={{ background: "var(--t-surface)" }}>
          <div className="w-1.5 h-7 rounded-full" style={{ background: s.color }} />
          <div>
            <div className="text-[10px] font-semibold" style={{ color: "var(--t-white)" }}>{s.stage}</div>
            <div className="text-[9px]" style={{ color: "var(--t-dim)" }}>{s.count} jobs</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const JobsMockup = () => (
  <div className="p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="text-xs font-bold" style={{ color: "var(--t-white)" }}>Job Pipeline</div>
      <div className="text-[9px] px-2 py-1 rounded-md font-semibold" style={{ background: "#e85c0d", color: "#fff" }}>+ New Job</div>
    </div>
    {[
      { id: "J-0847", customer: "Martinez Residence", stage: "Drying", color: "#3b82f6", amount: "$18,400" },
      { id: "J-0851", customer: "Thompson Commercial", stage: "Mitigation", color: "#f59e0b", amount: "$34,200" },
      { id: "J-0293", customer: "Chen Property Group", stage: "Reconstruction", color: "#22c55e", amount: "$67,500" },
      { id: "J-0122", customer: "Williams Residence", stage: "Estimate", color: "#a78bfa", amount: "$12,800" },
    ].map(j => (
      <div key={j.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 rounded-full" style={{ background: j.color }} />
          <div>
            <div className="text-[10px] font-semibold" style={{ color: "var(--t-white)" }}>{j.customer}</div>
            <div className="text-[9px]" style={{ color: "var(--t-dim)" }}>{j.id}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] px-2 py-0.5 rounded font-semibold" style={{ background: j.color + "18", color: j.color, border: `1px solid ${j.color}30` }}>{j.stage}</div>
          <div className="text-[9px] mt-1 font-medium" style={{ color: "var(--t-muted)" }}>{j.amount}</div>
        </div>
      </div>
    ))}
  </div>
);

const ClaimsMockup = () => (
  <div className="p-5">
    <div className="text-xs font-bold mb-1" style={{ color: "var(--t-white)" }}>Insurance Job Tracking</div>
    <div className="text-[9px] mb-4" style={{ color: "var(--t-dim)" }}>Internal tracking — managed by your team</div>
    {[
      { claim: "CLM-4821", carrier: "State Farm", status: "Supplement Pending", color: "#f59e0b", amount: "$4,200" },
      { claim: "CLM-4819", carrier: "Allstate", status: "Approved", color: "#22c55e", amount: "$18,600" },
      { claim: "CLM-4815", carrier: "USAA", status: "Under Review", color: "#3b82f6", amount: "$7,800" },
    ].map(c => (
      <div key={c.claim} className="rounded-lg p-3 border border-border mb-2 last:mb-0" style={{ background: "var(--t-surface)" }}>
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[10px] font-semibold" style={{ color: "var(--t-white)" }}>{c.claim}</div>
          <div className="text-[9px] px-2 py-0.5 rounded font-semibold" style={{ background: c.color + "18", color: c.color }}>{c.status}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-[9px]" style={{ color: "var(--t-dim)" }}>{c.carrier}</div>
          <div className="text-[10px] font-bold" style={{ color: "var(--t-white)" }}>{c.amount}</div>
        </div>
      </div>
    ))}
  </div>
);

const DryingMockup = () => (
  <div className="p-5">
    <div className="text-xs font-bold mb-1" style={{ color: "var(--t-white)" }}>Drying Log — Day 3</div>
    <div className="text-[9px] mb-3" style={{ color: "var(--t-dim)" }}>Internal documentation</div>
    <div className="grid grid-cols-3 gap-2 mb-3">
      {[{ label: "Temp", val: "72°F", icon: "🌡️" }, { label: "RH", val: "48%", icon: "💧" }, { label: "GPP", val: "42.1", icon: "📊" }].map(r => (
        <div key={r.label} className="rounded-lg p-2.5 border border-border text-center" style={{ background: "var(--t-surface)" }}>
          <div className="text-base mb-1">{r.icon}</div>
          <div className="text-sm font-extrabold" style={{ color: "var(--t-white)" }}>{r.val}</div>
          <div className="text-[9px]" style={{ color: "var(--t-dim)" }}>{r.label}</div>
        </div>
      ))}
    </div>
    <div className="rounded-lg p-3 border border-border" style={{ background: "var(--t-surface)" }}>
      <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--t-white)" }}>Moisture Readings</div>
      {["Kitchen — Base Cabinet", "Hallway — Drywall 24\"", "Bathroom — Subfloor"].map((r, i) => (
        <div key={r} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
          <span className="text-[9px]" style={{ color: "var(--t-muted)" }}>{r}</span>
          <span className="text-[9px] font-bold" style={{ color: i === 0 ? "#f59e0b" : "#22c55e" }}>{i === 0 ? "18.2%" : i === 1 ? "12.4%" : "9.1%"}</span>
        </div>
      ))}
    </div>
  </div>
);

const CommunicationMockup = () => (
  <div className="p-5">
    <div className="text-xs font-bold mb-1" style={{ color: "var(--t-white)" }}>Job Communication</div>
    <div className="text-[9px] mb-3" style={{ color: "var(--t-dim)" }}>Structured channels per job</div>
    <div className="flex gap-2 mb-3">
      {[{ label: "Internal", color: "#e85c0d", active: true }, { label: "Homeowner", color: "#22c55e", active: false }, { label: "Subcontractor", color: "#a78bfa", active: false }].map(c => (
        <div key={c.label} className="text-[9px] px-3 py-1.5 rounded-md font-semibold" style={{
          background: c.active ? c.color + "1a" : "var(--t-surface-high)",
          color: c.active ? c.color : "var(--t-dim)",
          border: `1px solid ${c.active ? c.color + "44" : "var(--t-border)"}`,
        }}>{c.label}</div>
      ))}
    </div>
    <div className="space-y-2">
      {[
        { name: "Camden R.", msg: "Drying equipment placed in kitchen and hallway. Starting readings tomorrow.", time: "2:15 PM" },
        { name: "Sarah M.", msg: "Adjuster confirmed reinspection for Thursday. Updated the claim tracker.", time: "3:42 PM" },
      ].map(m => (
        <div key={m.time} className="rounded-lg p-3 border border-border" style={{ background: "var(--t-surface)" }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold" style={{ color: "var(--t-white)" }}>{m.name}</span>
            <span className="text-[8px]" style={{ color: "var(--t-dim)" }}>{m.time}</span>
          </div>
          <div className="text-[9px] leading-relaxed" style={{ color: "var(--t-muted)" }}>{m.msg}</div>
        </div>
      ))}
    </div>
  </div>
);

const HomeownerMockup = () => (
  <div className="p-5">
    <div className="text-xs font-bold mb-1" style={{ color: "var(--t-white)" }}>Homeowner Portal</div>
    <div className="text-[9px] mb-3" style={{ color: "var(--t-dim)" }}>Customer-facing project view</div>
    <div className="rounded-lg p-3 border border-border mb-3" style={{ background: "var(--t-surface)" }}>
      <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--t-white)" }}>Project Status</div>
      <div className="flex gap-1 mb-2">
        {["Lead", "Mitigation", "Drying", "Recon"].map((s, i) => (
          <div key={s} className="flex-1 h-1.5 rounded-full" style={{ background: i <= 2 ? "#22c55e" : "var(--t-surface-high)" }} />
        ))}
      </div>
      <div className="text-[9px] font-medium" style={{ color: "#22c55e" }}>Active Drying — Day 3</div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {[{ label: "Photos", count: "12", icon: "📸" }, { label: "Documents", count: "4", icon: "📄" }, { label: "Messages", count: "8", icon: "💬" }, { label: "Updates", count: "6", icon: "📋" }].map(i => (
        <div key={i.label} className="rounded-lg p-2.5 border border-border text-center" style={{ background: "var(--t-surface)" }}>
          <div className="text-sm mb-0.5">{i.icon}</div>
          <div className="text-[10px] font-bold" style={{ color: "var(--t-white)" }}>{i.count}</div>
          <div className="text-[8px]" style={{ color: "var(--t-dim)" }}>{i.label}</div>
        </div>
      ))}
    </div>
  </div>
);

const getMockup = (type: string) => {
  switch (type) {
    case "jobs": return <JobsMockup />;
    case "claims": return <ClaimsMockup />;
    case "drying": return <DryingMockup />;
    case "supplements": return <ClaimsMockup />;
    case "payments": return <ClaimsMockup />;
    case "communication": return <CommunicationMockup />;
    case "homeowner": return <HomeownerMockup />;
    case "subs": return <JobsMockup />;
    default: return <DashboardMockup />;
  }
};

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
      <nav className="sticky top-0 z-50 border-b border-border backdrop-blur-xl" style={{ background: "var(--t-bg)", borderColor: "var(--t-border)" }}>
         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <Logo size={64} />
           </div>
          <div className="hidden sm:flex items-center gap-8">
            <a href="#features" className="text-xs font-semibold transition-colors hover:opacity-80" style={{ color: "var(--t-muted)" }}>Features</a>
            <a href="#previews" className="text-xs font-semibold transition-colors hover:opacity-80" style={{ color: "var(--t-muted)" }}>Preview</a>
            <a href="#workflow" className="text-xs font-semibold transition-colors hover:opacity-80" style={{ color: "var(--t-muted)" }}>How It Works</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onSignIn} className="px-4 py-2 text-xs font-semibold rounded-lg transition-colors hover:opacity-80" style={{ color: "var(--t-muted)" }}>
              Sign In
            </button>
            <button onClick={onDemo} className="px-5 py-2 text-xs font-bold rounded-lg transition-opacity hover:opacity-90 shadow-lg" style={{ background: "linear-gradient(135deg, #e85c0d, #c84009)", color: "#fff", boxShadow: "0 4px 20px rgba(232,92,13,0.3)" }}>
              Start Demo
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "85vh" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(232,92,13,0.08) 0%, transparent 70%)" }} />
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: "rgba(232,92,13,0.15)" }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10" style={{ background: "rgba(59,130,246,0.15)" }} />

        <div className="max-w-7xl mx-auto px-6 pt-16 sm:pt-24 pb-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full text-[10px] font-bold tracking-widest uppercase" style={{ border: "1px solid rgba(232,92,13,0.25)", background: "rgba(232,92,13,0.06)", color: "#e85c0d" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ background: "#e85c0d" }} />
                  Restoration Operations Platform
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight mb-6" style={{ color: "var(--t-white)" }}>
                  The Command Center for{" "}
                  <span style={{ color: "#e85c0d" }}>Restoration Companies</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "var(--t-muted)" }}>
                  Manage jobs, track insurance claims internally, log drying activity, coordinate subcontractors, record payments, and communicate with your team — all in one platform built for restoration professionals.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <button onClick={onDemo} className="px-7 py-3.5 text-sm font-bold rounded-xl transition-all hover:opacity-90 shadow-xl" style={{ background: "linear-gradient(135deg, #e85c0d, #c84009)", color: "#fff", boxShadow: "0 8px 30px rgba(232,92,13,0.35)" }}>
                    Start Demo →
                  </button>
                  <button onClick={onCreateAccount} className="px-7 py-3.5 text-sm font-bold rounded-xl transition-all hover:opacity-80" style={{ background: "var(--t-surface)", border: "1px solid var(--t-border)", color: "var(--t-white)" }}>
                    Create Company Account
                  </button>
                </div>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="flex items-center gap-6 mt-10">
                  {[{ val: "12", label: "Job Stages" }, { val: "6", label: "User Roles" }, { val: "3", label: "Chat Channels" }].map(s => (
                    <div key={s.label}>
                      <div className="text-lg font-extrabold" style={{ color: "#e85c0d" }}>{s.val}</div>
                      <div className="text-[10px] font-medium" style={{ color: "var(--t-dim)" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.2} y={40}>
              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl blur-2xl opacity-30" style={{ background: "rgba(232,92,13,0.12)" }} />
                <BrowserFrame className="relative">
                  <DashboardMockup />
                </BrowserFrame>
                <motion.div
                  className="absolute -bottom-4 -left-4 sm:-left-8 rounded-xl border p-3 shadow-xl"
                  style={{ background: "var(--t-surface)", borderColor: "var(--t-border)", boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.6 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]" style={{ background: "rgba(34,197,94,0.15)" }}>✓</div>
                    <div>
                      <div className="text-[10px] font-semibold" style={{ color: "var(--t-white)" }}>Payment Recorded</div>
                      <div className="text-[8px]" style={{ color: "var(--t-dim)" }}>Carrier — $18,400</div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="absolute -top-3 -right-3 sm:-right-6 rounded-xl border p-3 shadow-xl"
                  style={{ background: "var(--t-surface)", borderColor: "var(--t-border)", boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 0.6 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]" style={{ background: "rgba(59,130,246,0.15)" }}>💧</div>
                    <div>
                      <div className="text-[10px] font-semibold" style={{ color: "var(--t-white)" }}>Drying Day 3</div>
                      <div className="text-[8px]" style={{ color: "var(--t-dim)" }}>RH 48% — Logged</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── PRODUCT PREVIEW STRIP ── */}
      <section className="py-16 border-t" style={{ borderColor: "var(--t-border)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3" style={{ color: "var(--t-white)" }}>
                See Every Screen
              </h2>
              <p className="text-sm max-w-lg mx-auto" style={{ color: "var(--t-muted)" }}>
                From the dashboard to job communication, every view is designed for restoration professionals.
              </p>
            </div>
          </FadeIn>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {FEATURES_STRIP.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.08} className="snap-start flex-shrink-0">
                <div className="w-64 rounded-xl border overflow-hidden transition-all hover:border-opacity-60 group" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
                  <div className="h-40 flex items-center justify-center" style={{ background: "var(--t-bg)" }}>
                    <div className="w-48 h-28 rounded-lg border flex items-center justify-center" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
                      <div className="text-center">
                        <div className="text-2xl mb-1">{["📊", "🏗️", "🛡️", "📋", "💰", "💧", "💬"][i]}</div>
                        <div className="text-[9px] font-semibold" style={{ color: "var(--t-muted)" }}>{f.title}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-bold mb-1" style={{ color: "var(--t-white)" }}>{f.title}</div>
                    <div className="text-[11px]" style={{ color: "var(--t-dim)" }}>{f.desc}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT PREVIEWS (replaces broken demo videos) ── */}
      <section id="previews" className="py-20 border-t" style={{ borderColor: "var(--t-border)", background: "var(--t-surface)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-[10px] font-bold tracking-widest uppercase" style={{ border: "1px solid rgba(232,92,13,0.2)", background: "rgba(232,92,13,0.05)", color: "#e85c0d" }}>
                Product Preview
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: "var(--t-white)" }}>
                Explore the Platform
              </h2>
              <p className="text-sm max-w-lg mx-auto" style={{ color: "var(--t-muted)" }}>
                See how ReCon Pro organizes restoration operations into one clear workspace.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCT_PREVIEWS.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.1}>
                <div className="rounded-xl border overflow-hidden transition-all hover:border-opacity-60 group" style={{ background: "var(--t-bg)", borderColor: "var(--t-border)" }}>
                  <div className="relative h-44 flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--t-surface-high), var(--t-bg))" }}>
                    <div className="text-5xl opacity-40">{v.icon}</div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-bold mb-1" style={{ color: "var(--t-white)" }}>{v.title}</div>
                    <div className="text-[11px] leading-relaxed" style={{ color: "var(--t-dim)" }}>{v.desc}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
            {/* Try Demo CTA card */}
            <FadeIn delay={0.5}>
              <div onClick={onDemo} className="rounded-xl border overflow-hidden transition-all hover:border-opacity-60 cursor-pointer group" style={{ background: "var(--t-bg)", borderColor: "var(--t-border)" }}>
                <div className="relative h-44 flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(232,92,13,0.08), var(--t-bg))" }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-xl" style={{ background: "linear-gradient(135deg, #e85c0d, #c84009)", boxShadow: "0 8px 25px rgba(232,92,13,0.4)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><polygon points="8,5 19,12 8,19" /></svg>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm font-bold mb-1" style={{ color: "#e85c0d" }}>Try the Live Demo</div>
                  <div className="text-[11px] leading-relaxed" style={{ color: "var(--t-dim)" }}>Explore the full platform with realistic sample data. No account required.</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── INDUSTRY FIT ── */}
      <section className="py-20 border-t" style={{ borderColor: "var(--t-border)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: "var(--t-white)" }}>
                Built for Restoration Professionals
              </h2>
              <p className="text-sm max-w-lg mx-auto" style={{ color: "var(--t-muted)" }}>
                Whether you run a one-truck mitigation crew or a multi-state restoration operation, ReCon Pro scales with you.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AUDIENCE.map((a, i) => (
              <FadeIn key={a.title} delay={i * 0.08}>
                <div className="rounded-xl border p-6 transition-all hover:border-opacity-60" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
                  <div className="text-3xl mb-4">{a.icon}</div>
                  <div className="text-base font-bold mb-2" style={{ color: "var(--t-white)" }}>{a.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--t-muted)" }}>{a.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE STORYTELLING ── */}
      <section id="features" className="border-t" style={{ borderColor: "var(--t-border)" }}>
        {FEATURE_STORIES.map((f, i) => (
          <div key={f.title} className="py-20 border-b" style={{ borderColor: "var(--t-border)", background: i % 2 === 0 ? "var(--t-bg)" : "var(--t-surface)" }}>
            <div className="max-w-7xl mx-auto px-6">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${i % 2 !== 0 ? "lg:[direction:rtl]" : ""}`}>
                <div style={{ direction: "ltr" }}>
                  <FadeIn>
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-[10px] font-bold tracking-widest uppercase" style={{ border: "1px solid rgba(232,92,13,0.2)", background: "rgba(232,92,13,0.05)", color: "#e85c0d" }}>
                      Feature
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4" style={{ color: "var(--t-white)" }}>
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--t-muted)" }}>{f.desc}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {f.points.map(p => (
                        <div key={p} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(232,92,13,0.12)" }}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#e85c0d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12" /></svg>
                          </div>
                          <span className="text-[11px] font-medium" style={{ color: "var(--t-text)" }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  </FadeIn>
                </div>
                <FadeIn delay={0.15} y={30} className="[direction:ltr]">
                  <BrowserFrame>{getMockup(f.mockup)}</BrowserFrame>
                </FadeIn>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="workflow" className="py-20 border-t" style={{ borderColor: "var(--t-border)", background: "var(--t-surface)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-[10px] font-bold tracking-widest uppercase" style={{ border: "1px solid rgba(232,92,13,0.2)", background: "rgba(232,92,13,0.05)", color: "#e85c0d" }}>
                Workflow
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: "var(--t-white)" }}>
                From First Call to Final Invoice
              </h2>
              <p className="text-sm max-w-lg mx-auto" style={{ color: "var(--t-muted)" }}>
                ReCon Pro follows the entire restoration lifecycle so nothing falls through the cracks.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WORKFLOW_STEPS.map((s, i) => (
              <FadeIn key={s.num} delay={i * 0.08}>
                <div className="relative rounded-xl border p-5 h-full" style={{ background: "var(--t-bg)", borderColor: "var(--t-border)" }}>
                  <div className="text-2xl font-extrabold mb-3" style={{ color: "rgba(232,92,13,0.2)" }}>{s.num}</div>
                  <div className="text-sm font-bold mb-1.5" style={{ color: "var(--t-white)" }}>{s.title}</div>
                  <div className="text-[11px] leading-relaxed" style={{ color: "var(--t-dim)" }}>{s.desc}</div>
                  {i < WORKFLOW_STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 text-base" style={{ color: "var(--t-dim)" }}>→</div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMAND CENTER SECTION ── */}
      <section className="py-20 border-t" style={{ borderColor: "var(--t-border)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: "var(--t-white)" }}>
                Your Daily Operations Command Center
              </h2>
              <p className="text-sm max-w-2xl mx-auto" style={{ color: "var(--t-muted)" }}>
                Owners and managers see everything that matters at a glance. Active jobs, drying progress, insurance tracking status, outstanding payments, and team activity — all in one dashboard.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute -inset-6 rounded-3xl blur-3xl opacity-20" style={{ background: "rgba(232,92,13,0.1)" }} />
              <BrowserFrame className="relative">
                <DashboardMockup />
                <div className="px-5 pb-5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    {[
                      { icon: "🔔", label: "3 jobs need attention today" },
                      { icon: "📋", label: "2 supplements awaiting update" },
                      { icon: "💰", label: "$12,400 in outstanding payments" },
                      { icon: "💧", label: "4 drying jobs in progress" },
                      { icon: "🤝", label: "6 subs scheduled this week" },
                      { icon: "💬", label: "5 new team messages" },
                    ].map(a => (
                      <div key={a.label} className="flex items-center gap-2 rounded-lg p-2.5 border" style={{ background: "var(--t-surface)", borderColor: "var(--t-border)" }}>
                        <span className="text-sm">{a.icon}</span>
                        <span className="text-[9px] font-medium" style={{ color: "var(--t-muted)" }}>{a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </BrowserFrame>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── VALUE PROPOSITION ── */}
      <section className="py-20 border-t" style={{ borderColor: "var(--t-border)", background: "var(--t-surface)" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-6" style={{ color: "var(--t-white)" }}>
              Restoration Work Is Complex.{" "}
              <span style={{ color: "#e85c0d" }}>Your Software Shouldn't Be.</span>
            </h2>
            <p className="text-sm leading-relaxed mb-10 max-w-2xl mx-auto" style={{ color: "var(--t-muted)" }}>
              Every restoration project involves jobs, insurance tracking, drying documentation, supplements, subcontractors, payments, and team communication. Most companies juggle spreadsheets, paper forms, and disconnected tools. ReCon Pro brings it all together in one command center built specifically for restoration professionals.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { val: "1", label: "Unified platform", desc: "Jobs, payments, claims, and communication in one place" },
                { val: "3", label: "Communication channels", desc: "Internal, homeowner, and subcontractor messaging per job" },
                { val: "12", label: "Job stages", desc: "Track every project from lead to closeout" },
              ].map(s => (
                <div key={s.val} className="rounded-xl border p-6" style={{ background: "var(--t-bg)", borderColor: "var(--t-border)" }}>
                  <div className="text-3xl font-extrabold mb-2" style={{ color: "#e85c0d" }}>{s.val}</div>
                  <div className="text-sm font-bold mb-1" style={{ color: "var(--t-white)" }}>{s.label}</div>
                  <div className="text-[11px]" style={{ color: "var(--t-dim)" }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 border-t relative overflow-hidden" style={{ borderColor: "var(--t-border)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(232,92,13,0.06) 0%, transparent 70%)" }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 leading-tight" style={{ color: "var(--t-white)" }}>
              Run Your Restoration Company From{" "}
              <span style={{ color: "#e85c0d" }}>One Command Center</span>
            </h2>
            <p className="text-sm sm:text-base mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: "var(--t-muted)" }}>
              See how ReCon Pro helps restoration teams manage jobs, track claims internally, coordinate subcontractors, and record payments in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={onDemo} className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold rounded-xl transition-all hover:opacity-90 shadow-xl" style={{ background: "linear-gradient(135deg, #e85c0d, #c84009)", color: "#fff", boxShadow: "0 8px 30px rgba(232,92,13,0.35)" }}>
                Start Demo
              </button>
              <button onClick={onCreateAccount} className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold rounded-xl transition-all hover:opacity-80" style={{ background: "var(--t-surface)", border: "1px solid var(--t-border)", color: "var(--t-white)" }}>
                Create Company Account
              </button>
              <button onClick={onSignIn} className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold rounded-xl transition-all hover:opacity-80" style={{ color: "var(--t-muted)" }}>
                Sign In
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t py-12" style={{ borderColor: "var(--t-border)", background: "var(--t-surface)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            <div className="sm:col-span-2">
               <div className="flex items-center gap-2 mb-3">
                 <Logo size={48} />
               </div>
              <p className="text-xs leading-relaxed max-w-sm" style={{ color: "var(--t-dim)" }}>
                The command center for restoration companies. Manage jobs, track claims internally, log drying activity, coordinate subcontractors, and record payments in one platform.
              </p>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "var(--t-muted)" }}>Product</div>
              <div className="space-y-2.5">
                {[{ label: "Features", href: "#features" }, { label: "Preview", href: "#previews" }, { label: "How It Works", href: "#workflow" }].map(l => (
                  <a key={l.label} href={l.href} className="block text-xs font-medium transition-colors hover:opacity-80" style={{ color: "var(--t-dim)" }}>{l.label}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "var(--t-muted)" }}>Get Started</div>
              <div className="space-y-2.5">
                <button onClick={onDemo} className="block text-xs font-medium transition-colors hover:opacity-80" style={{ color: "var(--t-dim)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>Start Demo</button>
                <button onClick={onCreateAccount} className="block text-xs font-medium transition-colors hover:opacity-80" style={{ color: "var(--t-dim)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>Create Account</button>
                <button onClick={onSignIn} className="block text-xs font-medium transition-colors hover:opacity-80" style={{ color: "var(--t-dim)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>Sign In</button>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: "var(--t-border)" }}>
            <span className="text-[10px]" style={{ color: "var(--t-dim)" }}>© {new Date().getFullYear()} ReCon Pro. All rights reserved.</span>
            <span className="text-[10px]" style={{ color: "var(--t-dim)" }}>The command center for restoration companies.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
