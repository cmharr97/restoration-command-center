import { useState } from "react";
import { Logo } from "@/components/recon/ReconUI";

const FEATURES = [
  {
    icon: "🏗️",
    title: "Job Management",
    desc: "Track every restoration job from lead through reconstruction with a complete lifecycle pipeline. See status, priority, and team assignments at a glance.",
  },
  {
    icon: "🛡️",
    title: "Insurance Claim Tracking",
    desc: "Monitor claims, supplements, adjuster communication, and carrier approvals in one place. Never lose track of claim status again.",
  },
  {
    icon: "💧",
    title: "Drying Log Monitoring",
    desc: "Field technicians log moisture readings, equipment usage, and drying progress from any device. Daily documentation made simple.",
  },
  {
    icon: "📋",
    title: "Supplement Management",
    desc: "Identify missing line items and generate supplement justifications. Track every supplement from submission to approval.",
  },
  {
    icon: "💰",
    title: "Insurance Payment Tracking",
    desc: "Track initial payments, recoverable depreciation, supplements, deductibles, and outstanding balances for every claim.",
  },
  {
    icon: "🤝",
    title: "Subcontractor Coordination",
    desc: "Assign trades, manage schedules, and track subcontractor work across all projects. Keep every team aligned.",
  },
];

const AUDIENCES = [
  { label: "Restoration Contractors", desc: "Full-service restoration companies managing water, fire, and storm damage projects." },
  { label: "Mitigation Companies", desc: "Emergency response teams focused on water extraction, drying, and mold prevention." },
  { label: "Reconstruction Teams", desc: "Rebuild crews managing scopes, schedules, and subcontractor coordination." },
  { label: "Insurance Restoration Specialists", desc: "Companies navigating complex carrier relationships, supplements, and claim approvals." },
];

const BENEFITS = [
  "Faster job coordination",
  "Clear claim visibility",
  "Better documentation",
  "Improved team accountability",
  "Centralized project management",
  "Streamlined payment tracking",
];

interface LandingProps {
  onSignIn: () => void;
  onDemo: () => void;
  onCreateAccount: () => void;
}

const Landing = ({ onSignIn, onDemo, onCreateAccount }: LandingProps) => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <span className="text-lg font-extrabold tracking-tight text-foreground">ReCon Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onSignIn}
              className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-lg"
            >
              Sign In
            </button>
            <button
              onClick={onDemo}
              className="px-5 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-md"
            >
              Start Demo
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Built for restoration professionals
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
              The command center for{" "}
              <span className="text-primary">restoration companies</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Manage restoration jobs, insurance claims, drying logs, supplements, payments, and subcontractors — all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onDemo}
                className="w-full sm:w-auto px-8 py-3.5 text-base font-bold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25"
              >
                Start Demo →
              </button>
              <button
                onClick={onCreateAccount}
                className="w-full sm:w-auto px-8 py-3.5 text-base font-bold border border-border bg-card text-foreground rounded-xl hover:border-primary/40 transition-all"
              >
                Create Company Account
              </button>
            </div>
          </div>

          {/* PRODUCT PREVIEW */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 overflow-hidden">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <span className="w-3 h-3 rounded-full bg-destructive/40" />
                <span className="w-3 h-3 rounded-full bg-recon-yellow/40" />
                <span className="w-3 h-3 rounded-full bg-recon-green/40" />
                <div className="flex-1 mx-4">
                  <div className="max-w-md mx-auto h-6 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-[10px] text-muted-foreground font-medium">app.reconpro.com</span>
                  </div>
                </div>
              </div>
              {/* Dashboard mockup */}
              <div className="p-6 sm:p-8 bg-background">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Active Jobs", value: "24", color: "text-primary" },
                    { label: "Revenue Pipeline", value: "$482K", color: "text-recon-green-bright" },
                    { label: "Claims Pending", value: "8", color: "text-recon-yellow-bright" },
                    { label: "Drying Active", value: "6", color: "text-recon-blue-bright" },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl border border-border bg-card p-4">
                      <div className={`text-2xl font-extrabold ${m.color}`}>{m.value}</div>
                      <div className="text-xs text-muted-foreground mt-1 font-medium">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { stage: "Mitigation", count: 5, color: "bg-recon-blue" },
                    { stage: "Estimate Submitted", count: 8, color: "bg-recon-yellow" },
                    { stage: "Reconstruction", count: 11, color: "bg-recon-green" },
                  ].map((s) => (
                    <div key={s.stage} className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
                      <div className={`w-2 h-8 rounded-full ${s.color}`} />
                      <div>
                        <div className="text-sm font-semibold text-foreground">{s.stage}</div>
                        <div className="text-xs text-muted-foreground">{s.count} jobs</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Everything you need to run restoration operations
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From emergency mitigation through final invoice, ReCon Pro keeps your entire team aligned.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-24 border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Built for restoration professionals
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Whether you run a one-truck mitigation crew or a multi-state restoration operation, ReCon Pro scales with you.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {AUDIENCES.map((a) => (
              <div key={a.label} className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-bold text-foreground mb-2">{a.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-12">
            Why restoration companies choose ReCon Pro
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-3 rounded-lg border border-border bg-card px-5 py-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-foreground">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            Start running your restoration company from one command center
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Join restoration professionals who use ReCon Pro to manage jobs, track claims, and coordinate their teams.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onDemo}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-bold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25"
            >
              Start Demo
            </button>
            <button
              onClick={onCreateAccount}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-bold border border-border bg-card text-foreground rounded-xl hover:border-primary/40 transition-all"
            >
              Create Company Account
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="text-sm font-bold text-foreground">ReCon Pro</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ReCon Pro. The command center for restoration companies.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
