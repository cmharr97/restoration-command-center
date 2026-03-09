import { T, ROLES, JOB_STAGES, stageInfo, stageColor } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Divider } from "@/components/recon/ReconUI";
import { useJobs, useActivityLogs, useClaims, usePayments, useSupplements, type DbJob } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";

interface DashboardProps {
  role: string;
  setActive: (id: string) => void;
  setSelectedJob: (job: DbJob) => void;
  onNewJob?: () => void;
}

// Quick Start checklist for new owners
const QuickStartChecklist = ({ setActive, jobs, onNewJob }: { setActive: (id: string) => void; jobs: DbJob[]; onNewJob?: () => void }) => {
  const { profile } = useAuth();
  const steps = [
    { id: "company", label: "Set up company profile", desc: "Configure your company details and branding", done: !!profile?.company_id, action: "settings", icon: "cog" },
    { id: "first_job", label: "Create your first job", desc: "Add a restoration job to start tracking", done: jobs.length > 0, action: "new_job", icon: "jobs" },
    { id: "team", label: "Invite your team", desc: "Add project managers, techs, and office staff", done: false, action: "team", icon: "users" },
    { id: "subs", label: "Add subcontractors", desc: "Register your trade partners for job assignments", done: false, action: "subcontractors", icon: "truck" },
    { id: "claim", label: "Track a claim", desc: "Add insurance info to a job to start tracking claims", done: jobs.some(j => j.carrier && j.claim_no), action: "claims", icon: "shield" },
    { id: "drying", label: "Log drying data", desc: "Record moisture readings for water damage jobs", done: false, action: "mitigation", icon: "moisture" },
  ];

  const completedCount = steps.filter(s => s.done).length;
  if (completedCount === steps.length) return null;

  return (
    <Card style={{ marginBottom: 20, borderColor: `${T.orange}33`, background: T.surface }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Quick Start Guide</div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Complete these steps to get the most out of ReCon Pro</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.orange }}>{completedCount}/{steps.length}</div>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${T.surfaceHigh}`, position: "relative" }}>
            <svg width="40" height="40" style={{ position: "absolute", top: -3, left: -3, transform: "rotate(-90deg)" }}>
              <circle cx="20" cy="20" r="17" fill="none" stroke={T.orange} strokeWidth="3" strokeDasharray={`${(completedCount / steps.length) * 107} 107`} strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {steps.map(s => (
          <div key={s.id} onClick={() => { if (!s.done) { s.action === "new_job" && onNewJob ? onNewJob() : setActive(s.action); } }} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
            background: s.done ? T.greenDim : T.surfaceHigh, borderRadius: 8,
            border: `1px solid ${s.done ? T.greenBright + "33" : T.border}`,
            cursor: s.done ? "default" : "pointer", transition: "all 0.15s",
          }}
            onMouseEnter={e => { if (!s.done) (e.currentTarget as HTMLDivElement).style.borderColor = T.orange + "55"; }}
            onMouseLeave={e => { if (!s.done) (e.currentTarget as HTMLDivElement).style.borderColor = T.border; }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
              background: s.done ? T.greenBright : T.orangeDim, color: s.done ? "#fff" : T.orange, fontSize: 11, fontWeight: 700, flexShrink: 0,
            }}>
              {s.done ? "✓" : <Ic n={s.icon} s={14} c={T.orange} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: s.done ? T.greenBright : T.white, fontWeight: 600, textDecoration: s.done ? "line-through" : "none" }}>{s.label}</div>
              <div style={{ fontSize: 10, color: T.dim, marginTop: 1 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Demo workspace banner
const DemoBanner = ({ jobs }: { jobs: DbJob[] }) => {
  const isDemo = jobs.some(j => j.id?.startsWith("DEMO-"));
  if (!isDemo) return null;

  return (
    <div style={{
      background: `linear-gradient(90deg, ${T.orangeDim}, transparent)`,
      border: `1px solid ${T.orange}33`,
      borderRadius: 8, padding: "8px 16px", marginBottom: 16,
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ fontSize: 14 }}><Ic n="star" s={14} c={T.orange}/></span>
      <span style={{ fontSize: 12, color: T.orange, fontWeight: 600 }}>Demo Workspace</span>
      <span style={{ fontSize: 11, color: T.muted }}>You're viewing sample data. Create real jobs anytime — demo data won't interfere.</span>
    </div>
  );
};

// Empty dashboard welcome
const WelcomeDashboard = ({ onNewJob }: { onNewJob?: () => void }) => (
  <div>
    {/* Hero */}
    <div style={{
      background: `linear-gradient(135deg, ${T.orangeDim}, ${T.surface})`,
      border: `1px solid ${T.orange}22`, borderRadius: 14,
      padding: "36px 32px", textAlign: "center", marginBottom: 24,
    }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🏗️</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: T.white, margin: "0 0 8px", letterSpacing: "-0.02em" }}>Welcome to ReCon Pro</h2>
      <p style={{ fontSize: 14, color: T.muted, margin: "0 0 6px", maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
        The all-in-one command center for restoration companies. Manage jobs, insurance claims, drying logs, supplements, payments, and subcontractors — all in one place.
      </p>
      <div style={{ marginTop: 20 }}>
        <Btn v="primary" icon="plus" onClick={onNewJob}>Create Your First Job</Btn>
      </div>
    </div>

    {/* Feature cards */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
      {[
        { icon: "jobs", title: "Job Pipeline", desc: "Track every restoration project from lead to close with a visual stage-based workflow.", color: T.orange },
        { icon: "shield", title: "Insurance Tracking", desc: "Log claim status, carrier responses, and supplement approvals for insurance jobs.", color: T.blueBright },
        { icon: "moisture", title: "Drying Logs", desc: "Internal moisture reference logs. Track GPP, room-by-room status, and equipment.", color: T.tealBright },
        { icon: "est", title: "Supplements", desc: "Compare contractor vs. carrier estimates. Identify missing items and pricing gaps.", color: T.purpleBright },
        { icon: "dollar", title: "Payment Tracking", desc: "Track insurance payments, deductibles, mortgage holds, and recoverable depreciation.", color: T.greenBright },
        { icon: "truck", title: "Subcontractors", desc: "Manage trade partners, assign them to jobs, and track completion status.", color: T.yellowBright },
      ].map((f, i) => (
        <Card key={i} style={{ padding: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: f.color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
            <Ic n={f.icon} s={16} c={f.color} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.white, marginBottom: 4 }}>{f.title}</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{f.desc}</div>
        </Card>
      ))}
    </div>
  </div>
);

export const DashboardPage = ({ role, setActive, setSelectedJob, onNewJob }: DashboardProps) => {
  const rm = ROLES[role] || ROLES.owner;
  const { jobs, loading } = useJobs();
  const { logs: activityLogs } = useActivityLogs();
  const { payments } = usePayments();
  const { supplements } = useSupplements();

  const activeJobs = jobs.filter(j => !["closed"].includes(j.stage));
  const urgentJobs = jobs.filter(j => j.priority === "high");
  const awaitingCarrier = jobs.filter(j => j.payment_type === "insurance" && ["estimate_submitted", "carrier_approval"].includes(j.stage));
  const dryingJobs = jobs.filter(j => ["drying", "mitigation"].includes(j.stage));
  const reconJobs = jobs.filter(j => ["recon_scheduled", "reconstruction"].includes(j.stage));
  const supplementPending = supplements.filter((s: any) => ["submitted", "under_review"].includes(s.status));
  const totalRevenue = jobs.reduce((a, b) => a + (b.contract_value || 0), 0);
  const totalPaid = payments.reduce((a: number, p: any) => a + (p.amount || 0), 0);
  const outstanding = totalRevenue - totalPaid;

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: T.muted }}><div style={{ fontSize: 14 }}>Loading dashboard...</div></div>;
  }

  return (
    <div style={{ padding: "0 0 40px" }}>
      {/* Header */}
      <div style={{ padding: "24px 28px 0", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: T.white, margin: 0, letterSpacing: "-0.02em" }}>
              {role === "field_tech" ? "My Dashboard" : role === "owner" ? "Command Center" : "Dashboard"}
            </h1>
            <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>{dateStr}</p>
          </div>
          {jobs.length > 0 && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Btn v="primary" sz="sm" icon="plus" onClick={onNewJob}>New Job</Btn>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "0 28px" }}>
        <DemoBanner jobs={jobs} />

        {/* If no jobs, show welcome */}
        {jobs.length === 0 ? (
          <>
            {role === "owner" && <QuickStartChecklist setActive={setActive} jobs={jobs} onNewJob={onNewJob} />}
            <WelcomeDashboard onNewJob={onNewJob} />
          </>
        ) : (
          <>
            {/* Quick Start for owners with few completed steps */}
            {role === "owner" && <QuickStartChecklist setActive={setActive} jobs={jobs} onNewJob={onNewJob} />}

            {/* Operational Alerts */}
            {urgentJobs.length > 0 && (
              <div style={{ background: T.redDim, border: `1px solid ${T.redBright}44`, borderRadius: 10, padding: "12px 16px", marginBottom: 10, display: "flex", gap: 12, alignItems: "center" }}>
                <Ic n="alert" s={18} c={T.redBright}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>🚨 {urgentJobs.length} urgent job{urgentJobs.length > 1 ? "s" : ""} need attention</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{urgentJobs.map(j => `${j.id} – ${j.customer}`).join(" · ")}</div>
                </div>
                <Btn v="danger" sz="sm" onClick={() => setActive("jobs")}>View</Btn>
              </div>
            )}

            {dryingJobs.length > 0 && (
              <div style={{ background: T.orangeDim, border: `1px solid ${T.orange}55`, borderRadius: 10, padding: "12px 16px", marginBottom: 10, display: "flex", gap: 12, alignItems: "center" }}>
                <Ic n="moisture" s={18} c={T.orange}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>{dryingJobs.length} active drying job{dryingJobs.length > 1 ? "s" : ""}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{dryingJobs.map(j => `${j.id}: Day ${j.day_of_drying || 0}`).join(" · ")}</div>
                </div>
                <Btn v="primary" sz="sm" onClick={() => setActive("mitigation")}>Drying Logs</Btn>
              </div>
            )}

            {awaitingCarrier.length > 0 && (
              <div style={{ background: T.yellowDim, border: `1px solid ${T.yellowBright}44`, borderRadius: 10, padding: "12px 16px", marginBottom: 10, display: "flex", gap: 12, alignItems: "center" }}>
                <Ic n="clock" s={18} c={T.yellowBright}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>{awaitingCarrier.length} insurance job{awaitingCarrier.length > 1 ? "s" : ""} awaiting carrier response</div>
                </div>
                <Btn v="secondary" sz="sm" onClick={() => setActive("claims")}>View Insurance Jobs</Btn>
              </div>
            )}

            {supplementPending.length > 0 && (
              <div style={{ background: T.purpleDim, border: `1px solid ${T.purpleBright}44`, borderRadius: 10, padding: "12px 16px", marginBottom: 10, display: "flex", gap: 12, alignItems: "center" }}>
                <Ic n="est" s={18} c={T.purpleBright}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>{supplementPending.length} supplement{supplementPending.length > 1 ? "s" : ""} pending review</div>
                </div>
                <Btn v="secondary" sz="sm" onClick={() => setActive("supplements")}>View</Btn>
              </div>
            )}

            {/* Metric cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px,1fr))", gap: 10, marginBottom: 18, marginTop: 8 }}>
              {[
                { label: "Active Jobs", value: activeJobs.length, color: T.orange, page: "jobs", icon: "jobs" },
                { label: "Drying Active", value: dryingJobs.length, color: T.blueBright, page: "mitigation", icon: "moisture" },
                { label: "Awaiting Carrier", value: awaitingCarrier.length, color: T.yellowBright, page: "claims", icon: "clock" },
                { label: "Reconstruction", value: reconJobs.length, color: T.tealBright, page: "jobs", icon: "tool" },
                { label: "Supplements", value: supplementPending.length, color: T.purpleBright, page: "supplements", icon: "est" },
                ...(rm.canViewPayments ? [{ label: "Outstanding", value: outstanding > 0 ? `$${(outstanding / 1000).toFixed(1)}K` : "$0", color: outstanding > 0 ? T.redBright : T.greenBright, page: "payments", icon: "dollar" }] : []),
                ...(rm.canSeeProfitMargins ? [{ label: "Revenue", value: totalRevenue > 0 ? `$${(totalRevenue / 1000).toFixed(0)}K` : "$0", color: T.greenBright, page: "reports", icon: "chart" }] : []),
                ...(rm.canViewPayments ? [{ label: "Collected", value: totalPaid > 0 ? `$${(totalPaid / 1000).toFixed(1)}K` : "$0", color: T.tealBright, page: "payments", icon: "check" }] : []),
              ].map((m, i) => (
                <Card key={i} style={{ cursor: "pointer", padding: "14px 16px" }} onClick={() => setActive(m.page)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: m.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Ic n={m.icon} s={12} c={m.color} />
                    </div>
                    <span style={{ fontSize: 10, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.label}</span>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: m.color }}>{m.value}</div>
                </Card>
              ))}
            </div>

            {/* Main content: Pipeline + sidebar */}
            <div style={{ display: "grid", gridTemplateColumns: rm.canSeeProfitMargins ? "2fr 1fr" : "1fr", gap: 16, marginBottom: 18 }}>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: T.white }}>Job Pipeline</div>
                  <Btn v="ghost" sz="sm" onClick={() => setActive("jobs")}>View All →</Btn>
                </div>
                <div style={{ display: "flex", gap: 2, height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
                  {JOB_STAGES.map(s => {
                    const cnt = jobs.filter(j => j.stage === s.id).length;
                    const pct = (cnt / jobs.length) * 100;
                    return cnt > 0 ? <div key={s.id} style={{ flex: pct, background: s.color, minWidth: 3 }} title={`${s.label}: ${cnt}`}/> : null;
                  })}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  {JOB_STAGES.filter(s => jobs.some(j => j.stage === s.id)).map(s => {
                    const cnt = jobs.filter(j => j.stage === s.id).length;
                    return (
                      <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color }}/>
                        <span style={{ fontSize: 11, color: T.muted }}>{s.label}: <strong style={{ color: T.text }}>{cnt}</strong></span>
                      </div>
                    );
                  })}
                </div>
                <Divider/>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {activeJobs.slice(0, 8).map(j => (
                    <div key={j.id} onClick={() => { setSelectedJob(j); setActive("job_detail"); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}22`, cursor: "pointer" }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = "0.8"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = "1"}
                    >
                      <span style={{ fontFamily: "monospace", fontSize: 11, color: T.orange, minWidth: 72, fontWeight: 700 }}>{j.id}</span>
                      <span style={{ flex: 1, fontSize: 12, color: T.text, fontWeight: 500 }}>{j.customer}</span>
                      <Badge color={stageColor[j.stage] || "gray"} small dot>{stageInfo(j.stage).label}</Badge>
                      {(j.moisture_alerts || 0) > 0 && <Ic n="alert" s={13} c={T.redBright}/>}
                    </div>
                  ))}
                </div>
              </Card>

              {rm.canSeeProfitMargins && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Card>
                    <div style={{ fontWeight: 700, fontSize: 14, color: T.white, marginBottom: 12 }}>Revenue Breakdown</div>
                    {[
                      ["Mitigation", jobs.filter(j => j.mitigation_value).reduce((a, b) => a + (b.mitigation_value || 0), 0), T.blueBright],
                      ["Reconstruction", jobs.filter(j => j.recon_value).reduce((a, b) => a + (b.recon_value || 0), 0), T.tealBright],
                    ].filter(([, v]) => (v as number) > 0).map(([label, value, color]) => (
                      <div key={label as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: color as string }} />
                          <span style={{ fontSize: 12, color: T.muted }}>{label as string}</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: T.white }}>${((value as number) / 1000).toFixed(1)}K</span>
                      </div>
                    ))}
                    {jobs.filter(j => j.mitigation_value || j.recon_value).length === 0 && (
                      <div style={{ textAlign: "center", color: T.dim, padding: 16, fontSize: 12 }}>Add contract values to jobs to see revenue breakdown</div>
                    )}
                  </Card>
                  <Card>
                    <div style={{ fontWeight: 700, fontSize: 14, color: T.white, marginBottom: 10 }}>Top Carriers</div>
                    {(() => {
                      const carriers = jobs.filter(j => j.carrier?.trim() && j.payment_type === "insurance").reduce((acc, j) => {
                        const c = j.carrier || "Unknown";
                        acc[c] = (acc[c] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);
                      const entries = Object.entries(carriers).sort((a, b) => b[1] - a[1]).slice(0, 5);
                      if (entries.length === 0) return <div style={{ textAlign: "center", color: T.dim, padding: 16, fontSize: 12 }}>Carrier data appears when jobs have insurance assigned</div>;
                      return entries.map(([carrier, count]) => (
                        <div key={carrier} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: 12, color: T.text }}>{carrier}</span>
                          <Badge color="blue" small>{count} job{count > 1 ? "s" : ""}</Badge>
                        </div>
                      ));
                    })()}
                  </Card>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.white }}>Recent Activity</div>
              </div>
              {activityLogs.length === 0 ? (
                <div style={{ textAlign: "center", padding: 24, color: T.dim, fontSize: 12 }}>
                  Activity will appear here as you manage jobs, log drying data, and track claims.
                </div>
              ) : (
                activityLogs.slice(0, 8).map((log: any, i: number) => {
                  const actionIcons: Record<string, string> = {
                    status_change: "📋", note: "📝", payment: "💰", photo: "📸", drying: "💧",
                  };
                  return (
                    <div key={log.id} style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: i < 7 ? `1px solid ${T.border}15` : "none" }}>
                      <div style={{ width: 60, fontSize: 10, color: T.dim, flexShrink: 0, paddingTop: 2 }}>{new Date(log.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</div>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>{actionIcons[log.action_type] || "📋"}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{log.title}</div>
                        {log.description && <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{log.description}</div>}
                      </div>
                      {log.user_name && <span style={{ fontSize: 10, color: T.dim }}>{log.user_name}</span>}
                    </div>
                  );
                })
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
