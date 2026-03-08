import { T, ROLES, JOB_STAGES, stageInfo, stageColor } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Divider } from "@/components/recon/ReconUI";
import { useJobs, useActivityLogs, useClaims, usePayments, useSupplements, type DbJob } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";

interface DashboardProps {
  role: string;
  setActive: (id: string) => void;
  setSelectedJob: (job: DbJob) => void;
}

// Setup checklist for new owners
const SetupChecklist = ({ setActive }: { setActive: (id: string) => void }) => {
  const { profile } = useAuth();
  const { jobs } = useJobs();

  const steps = [
    { id: "company", label: "Company profile set up", done: !!profile?.company_id, action: "settings", icon: "cog" },
    { id: "first_job", label: "Create your first job", done: jobs.length > 0, action: "jobs", icon: "jobs" },
    { id: "team", label: "Invite team members", done: false, action: "team", icon: "users" },
    { id: "carriers", label: "Configure insurance carriers", done: false, action: "settings", icon: "shield" },
  ];

  const completedCount = steps.filter(s => s.done).length;
  if (completedCount === steps.length) return null;

  return (
    <Card style={{ marginBottom: 16, borderColor: `${T.orange}44` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>🚀 Get Started with ReCon Pro</div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{completedCount} of {steps.length} setup steps complete</div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.orange }}>{Math.round((completedCount / steps.length) * 100)}%</div>
      </div>
      <div style={{ height: 4, background: T.surfaceHigh, borderRadius: 2, marginBottom: 14, overflow: "hidden" }}>
        <div style={{ height: "100%", background: T.orange, borderRadius: 2, width: `${(completedCount / steps.length) * 100}%`, transition: "width 0.3s" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {steps.map(s => (
          <div key={s.id} onClick={() => !s.done && setActive(s.action)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
            background: s.done ? T.greenDim : T.surfaceHigh, borderRadius: 8,
            border: `1px solid ${s.done ? T.greenBright + "33" : T.border}`,
            cursor: s.done ? "default" : "pointer", transition: "all 0.15s",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: s.done ? T.greenBright : T.surfaceTop, color: s.done ? "#fff" : T.muted, fontSize: 11, fontWeight: 700,
            }}>
              {s.done ? "✓" : <Ic n={s.icon} s={12} c={T.muted} />}
            </div>
            <span style={{ fontSize: 13, color: s.done ? T.greenBright : T.text, fontWeight: s.done ? 500 : 600, textDecoration: s.done ? "line-through" : "none" }}>{s.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const DashboardPage = ({ role, setActive, setSelectedJob }: DashboardProps) => {
  const rm = ROLES[role];
  const { jobs, loading } = useJobs();
  const { logs: activityLogs } = useActivityLogs();
  const { claims } = useClaims();
  const { payments } = usePayments();

  const activeJobs = jobs.filter(j => !["closed"].includes(j.stage));
  const urgentJobs = jobs.filter(j => j.priority === "high");
  const awaitingEstimate = jobs.filter(j => j.stage === "estimate_submitted" || j.stage === "carrier_approval");
  const dryingJobs = jobs.filter(j => j.stage === "drying" || j.stage === "mitigation");
  const reconJobs = jobs.filter(j => j.stage === "recon_scheduled" || j.stage === "reconstruction");
  const invoicedJobs = jobs.filter(j => j.stage === "invoiced");
  const supplementJobs = jobs.filter(j => j.stage === "supplement");
  const punchListJobs = jobs.filter(j => j.stage === "punch_list");
  const totalRevenue = jobs.reduce((a, b) => a + (b.contract_value || 0), 0);
  const totalPaid = payments.reduce((a: number, p: any) => a + (p.amount || 0), 0);
  const outstandingClaims = claims.filter((c: any) => c.carrier_response_status === "pending").length;

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: T.muted }}><div style={{ fontSize: 14 }}>Loading dashboard...</div></div>;
  }

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0, letterSpacing: "-0.02em" }}>
          {role === "field_tech" ? "My Dashboard" : role === "owner" ? "Command Center" : "Dashboard"}
        </h1>
        <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>{dateStr}</p>
      </div>
      <div style={{ padding: "0 28px" }}>
        {/* Setup checklist for new owners */}
        {role === "owner" && <SetupChecklist setActive={setActive} />}

        {/* Alerts — only show if there's real data */}
        {urgentJobs.length > 0 && (
          <div style={{ background: T.redDim, border: `1px solid ${T.redBright}44`, borderRadius: 10, padding: "12px 16px", marginBottom: 12, display: "flex", gap: 12, alignItems: "center" }}>
            <Ic n="alert" s={18} c={T.redBright}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>🚨 {urgentJobs.length} urgent job{urgentJobs.length > 1 ? "s" : ""} need attention</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{urgentJobs.map(j => `${j.id} – ${j.customer}`).join(" · ")}</div>
            </div>
            <Btn v="danger" sz="sm" onClick={() => setActive("jobs")}>View Jobs</Btn>
          </div>
        )}

        {dryingJobs.length > 0 && (
          <div style={{ background: T.orangeDim, border: `1px solid ${T.orange}55`, borderRadius: 10, padding: "12px 16px", marginBottom: 12, display: "flex", gap: 12, alignItems: "center" }}>
            <Ic n="drop" s={18} c={T.orange}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>{dryingJobs.length} active drying job{dryingJobs.length > 1 ? "s" : ""}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{dryingJobs.map(j => `${j.id}: Day ${j.day_of_drying || 0}`).join(" · ")}</div>
            </div>
            <Btn v="primary" sz="sm" onClick={() => setActive("mitigation")}>Drying Logs</Btn>
          </div>
        )}

        {awaitingEstimate.length > 0 && (
          <div style={{ background: T.yellowDim, border: `1px solid ${T.yellowBright}44`, borderRadius: 10, padding: "12px 16px", marginBottom: 12, display: "flex", gap: 12, alignItems: "center" }}>
            <Ic n="clock" s={18} c={T.yellowBright}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>{awaitingEstimate.length} job{awaitingEstimate.length > 1 ? "s" : ""} awaiting carrier response</div>
            </div>
            <Btn v="secondary" sz="sm" onClick={() => setActive("claims")}>View Claims</Btn>
          </div>
        )}

        {/* Metric cards — only show non-zero values or all if has jobs */}
        {jobs.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Active Jobs", value: activeJobs.length, color: T.orange, page: "jobs" },
              { label: "Drying In Progress", value: dryingJobs.length, color: T.blueBright, page: "mitigation" },
              { label: "Awaiting Approval", value: awaitingEstimate.length, color: T.yellowBright, page: "claims" },
              { label: "Reconstruction", value: reconJobs.length, color: T.tealBright, page: "jobs" },
              { label: "Supplements Pending", value: supplementJobs.length, color: T.purpleBright, page: "supplements" },
              { label: "Punch List", value: punchListJobs.length, color: T.greenBright, page: "jobs" },
              ...(rm.canViewInvoices ? [{ label: "Payments Received", value: totalPaid > 0 ? `$${(totalPaid / 1000).toFixed(1)}K` : "$0", color: T.greenBright, page: "payments" }] : []),
              ...(rm.canSeeProfitMargins ? [{ label: "Total Contract Value", value: totalRevenue > 0 ? `$${(totalRevenue / 1000).toFixed(0)}K` : "$0", color: T.white, page: "reports" }] : []),
            ].map((m, i) => (
              <Card key={i} style={{ cursor: "pointer" }} onClick={() => setActive(m.page)}>
                <div style={{ fontSize: 10, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: m.color }}>{m.value}</div>
              </Card>
            ))}
          </div>
        )}

        {jobs.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <Ic n="jobs" s={40} c={T.dim}/>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.white, marginTop: 16 }}>Welcome to ReCon Pro!</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 6, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
              Your workspace is empty. Create your first job to start tracking restoration projects, claims, and payments.
            </div>
            <div style={{ marginTop: 20 }}>
              <Btn v="primary" icon="plus" onClick={() => setActive("jobs")}>Create Your First Job</Btn>
            </div>
          </Card>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: rm.canSeeProfitMargins ? "2fr 1fr" : "1fr", gap: 16, marginBottom: 20 }}>
            <Card>
              <div style={{ fontWeight: 600, fontSize: 14, color: T.white, marginBottom: 12 }}>Job Pipeline</div>
              <div style={{ display: "flex", gap: 2, height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
                {JOB_STAGES.map(s => {
                  const cnt = jobs.filter(j => j.stage === s.id).length;
                  const pct = (cnt / jobs.length) * 100;
                  return cnt > 0 ? <div key={s.id} style={{ flex: pct, background: s.color, minWidth: 3 }}/> : null;
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
                  <div key={j.id} onClick={() => { setSelectedJob(j); setActive("job_detail"); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: `1px solid ${T.border}22`, cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = "0.8"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = "1"}
                  >
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: T.orange, minWidth: 72 }}>{j.id}</span>
                    <span style={{ flex: 1, fontSize: 12, color: T.text, fontWeight: 500 }}>{j.customer}</span>
                    <Badge color={stageColor[j.stage] || "gray"} small dot>{stageInfo(j.stage).label}</Badge>
                    {(j.moisture_alerts || 0) > 0 && <Ic n="alert" s={13} c={T.redBright}/>}
                  </div>
                ))}
              </div>
            </Card>

            {rm.canSeeProfitMargins && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Card style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: T.white, marginBottom: 12 }}>Revenue by Type</div>
                  {[
                    ["Mitigation", jobs.filter(j => j.mitigation_value).reduce((a, b) => a + (b.mitigation_value || 0), 0)],
                    ["Reconstruction", jobs.filter(j => j.recon_value).reduce((a, b) => a + (b.recon_value || 0), 0)],
                  ].filter(([, v]) => (v as number) > 0).map(([label, value]) => (
                    <div key={label as string} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 12, color: T.muted }}>{label as string}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: T.white }}>${((value as number) / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                  ))}
                  {jobs.filter(j => j.mitigation_value || j.recon_value).length === 0 && (
                    <div style={{ textAlign: "center", color: T.dim, padding: 20, fontSize: 12 }}>Add contract values to jobs to see revenue</div>
                  )}
                </Card>
                <Card style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: T.white, marginBottom: 10 }}>Top Carriers</div>
                  {(() => {
                    const carriers = jobs.filter(j => j.carrier && j.carrier.trim()).reduce((acc, j) => {
                      const c = j.carrier || "Unknown";
                      acc[c] = (acc[c] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);
                    const entries = Object.entries(carriers).sort((a, b) => b[1] - a[1]).slice(0, 5);
                    if (entries.length === 0) return <div style={{ textAlign: "center", color: T.dim, padding: 20, fontSize: 12 }}>Carrier data will appear when jobs have carriers assigned</div>;
                    return entries.map(([carrier, count]) => (
                      <div key={carrier} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: T.text }}>{carrier}</span>
                        <Badge color="blue" small>{count}</Badge>
                      </div>
                    ));
                  })()}
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Recent Activity */}
        {activityLogs.length > 0 && (
          <Card>
            <div style={{ fontWeight: 600, fontSize: 14, color: T.white, marginBottom: 12 }}>Recent Activity</div>
            {activityLogs.slice(0, 10).map((log: any) => (
              <div key={log.id} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: `1px solid ${T.border}18` }}>
                <div style={{ width: 60, fontSize: 10, color: T.dim, flexShrink: 0 }}>{new Date(log.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</div>
                <div>
                  <div style={{ fontSize: 12, color: T.text }}>{log.title}</div>
                  {log.description && <div style={{ fontSize: 11, color: T.muted }}>{log.description}</div>}
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
};
