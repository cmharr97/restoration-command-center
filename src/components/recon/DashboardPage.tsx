import { T, ROLES, JOB_STAGES, stageInfo, stageColor } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Divider } from "@/components/recon/ReconUI";
import { useJobs, type DbJob } from "@/hooks/useJobs";

interface DashboardProps {
  role: string;
  setActive: (id: string) => void;
  setSelectedJob: (job: DbJob) => void;
}

export const DashboardPage = ({ role, setActive, setSelectedJob }: DashboardProps) => {
  const rm = ROLES[role];
  const { jobs, loading } = useJobs();

  const activeJobs = jobs.filter(j => !["paid"].includes(j.stage));
  const urgentJobs = jobs.filter(j => j.priority === "high");
  const mitigationJobs = jobs.filter(j => j.stage === "mitigation");
  const totalRevenue = jobs.filter(j => j.contract_value).reduce((a, b) => a + (b.contract_value || 0), 0);
  const unpaidInvoices = jobs.filter(j => j.stage === "invoiced").reduce((a, b) => a + (b.contract_value || 0), 0);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: T.muted }}>
        <div style={{ fontSize: 14 }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0, letterSpacing: "-0.02em" }}>
          {role === "field_tech" ? "My Dashboard" : role === "owner" ? "Owner Dashboard" : "Dashboard"}
        </h1>
        <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>{dateStr}</p>
      </div>
      <div style={{ padding: "0 28px" }}>
        {urgentJobs.length > 0 && (
          <div style={{ background: T.redDim, border: `1px solid ${T.redBright}44`, borderRadius: 10, padding: "12px 16px", marginBottom: 18, display: "flex", gap: 12, alignItems: "center" }}>
            <Ic n="alert" s={18} c={T.redBright}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>🚨 {urgentJobs.length} urgent job{urgentJobs.length > 1 ? "s" : ""} need attention</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{urgentJobs.map(j => `${j.id} – ${j.customer}`).join(" · ")}</div>
            </div>
            <Btn v="danger" sz="sm" onClick={() => setActive("jobs")}>View Jobs</Btn>
          </div>
        )}

        {mitigationJobs.length > 0 && (
          <div style={{ background: T.orangeDim, border: `1px solid ${T.orange}55`, borderRadius: 10, padding: "12px 16px", marginBottom: 18, display: "flex", gap: 12, alignItems: "center" }}>
            <Ic n="drop" s={18} c={T.orange}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>{mitigationJobs.length} active mitigation job{mitigationJobs.length > 1 ? "s" : ""}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{mitigationJobs.map(j => `${j.id}: Day ${j.day_of_drying || 0}`).join(" · ")}</div>
            </div>
            <Btn v="primary" sz="sm" onClick={() => setActive("mitigation")}>Drying Logs</Btn>
          </div>
        )}

        <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
          <Card style={{ flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Active Jobs</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.orange }}>{activeJobs.length}</div>
          </Card>
          {rm.canSeeProfitMargins && (
            <Card style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Total Revenue</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: T.greenBright }}>{totalRevenue > 0 ? `$${(totalRevenue / 1000).toFixed(0)}K` : "$0"}</div>
            </Card>
          )}
          <Card style={{ flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Mitigation Active</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.blueBright }}>{mitigationJobs.length}</div>
          </Card>
          {rm.canViewInvoices && (
            <Card style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Unpaid Invoices</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: T.yellowBright }}>{unpaidInvoices > 0 ? `$${(unpaidInvoices / 1000).toFixed(1)}K` : "$0"}</div>
            </Card>
          )}
        </div>

        {jobs.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <Ic n="jobs" s={40} c={T.dim}/>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.white, marginTop: 16 }}>Welcome to ReCon Pro!</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 6, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
              Your dashboard is empty because you haven't created any jobs yet. Click "New Job" in the top bar to get started.
            </div>
            <div style={{ marginTop: 20 }}>
              <Btn v="primary" icon="plus" onClick={() => setActive("jobs")}>Create Your First Job</Btn>
            </div>
          </Card>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: rm.canSeeProfitMargins ? "2fr 1fr" : "1fr", gap: 16, marginBottom: 20 }}>
            <Card>
              <div style={{ fontWeight: 600, fontSize: 14, color: T.white, marginBottom: 12 }}>Job Pipeline</div>
              {jobs.length > 0 && (
                <>
                  <div style={{ display: "flex", gap: 2, height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
                    {JOB_STAGES.map(s => {
                      const cnt = jobs.filter(j => j.stage === s.id).length;
                      const pct = (cnt / jobs.length) * 100;
                      return cnt > 0 ? <div key={s.id} style={{ flex: pct, background: s.color, minWidth: 3 }}/> : null;
                    })}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
                </>
              )}
              <Divider/>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {activeJobs.slice(0, 5).map(j => (
                  <div key={j.id} onClick={() => { setSelectedJob(j); setActive("job_detail"); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: `1px solid ${T.border}22`, cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = "0.8"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = "1"}
                  >
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: T.orange, minWidth: 52 }}>{j.id}</span>
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
                  {jobs.length === 0 ? (
                    <div style={{ textAlign: "center", color: T.dim, padding: 20, fontSize: 12 }}>No revenue data yet</div>
                  ) : (
                    <>
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
                        <div style={{ textAlign: "center", color: T.dim, padding: 20, fontSize: 12 }}>Add contract values to jobs to see revenue breakdown</div>
                      )}
                    </>
                  )}
                </Card>
                <Card style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: T.white, marginBottom: 10 }}>Carriers</div>
                  {(() => {
                    const carriers = jobs.filter(j => j.carrier).reduce((acc, j) => {
                      const c = j.carrier || "Unknown";
                      acc[c] = (acc[c] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);
                    const entries = Object.entries(carriers);
                    if (entries.length === 0) return <div style={{ textAlign: "center", color: T.dim, padding: 20, fontSize: 12 }}>No carrier data yet</div>;
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
        )}
      </div>
    </div>
  );
};
