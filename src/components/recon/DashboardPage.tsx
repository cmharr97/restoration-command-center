import { T, ROLES, JOBS, JOB_STAGES, stageInfo, stageColor, type Job } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Divider } from "@/components/recon/ReconUI";

interface DashboardProps {
  role: string;
  setActive: (id: string) => void;
  setSelectedJob: (job: Job) => void;
}

export const DashboardPage = ({ role, setActive, setSelectedJob }: DashboardProps) => {
  const rm = ROLES[role];
  const activeJobs = JOBS.filter(j => !["paid"].includes(j.stage));
  const urgentJobs = JOBS.filter(j => j.priority === "high");
  const mitigationJobs = JOBS.filter(j => j.stage === "mitigation");
  const totalRevenue = JOBS.filter(j => j.contractValue).reduce((a, b) => a + (b.contractValue || 0), 0);
  const unpaidInvoices = JOBS.filter(j => j.stage === "invoiced").reduce((a, b) => a + (b.contractValue || 0), 0);

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0, letterSpacing: "-0.02em" }}>
          {role === "field_tech" ? "My Dashboard" : role === "owner" ? "Owner Dashboard" : "Dashboard"}
        </h1>
        <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Saturday, March 8, 2026</p>
      </div>
      <div style={{ padding: "0 28px" }}>
        {urgentJobs.length > 0 && (
          <div style={{ background: T.redDim, border: `1px solid ${T.redBright}44`, borderRadius: 10, padding: "12px 16px", marginBottom: 18, display: "flex", gap: 12, alignItems: "center" }}>
            <Ic n="alert" s={18} c={T.redBright}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>🚨 {urgentJobs.length} urgent job{urgentJobs.length > 1 ? "s" : ""} need attention</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{urgentJobs.map(j => `${j.id} – ${j.customer}`).join(" · ")} — moisture readings above dry standard</div>
            </div>
            <Btn v="danger" sz="sm" onClick={() => setActive("mitigation")}>View Logs</Btn>
          </div>
        )}

        {mitigationJobs.length > 0 && (
          <div style={{ background: T.orangeDim, border: `1px solid ${T.orange}55`, borderRadius: 10, padding: "12px 16px", marginBottom: 18, display: "flex", gap: 12, alignItems: "center" }}>
            <Ic n="drop" s={18} c={T.orange}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>{mitigationJobs.length} active mitigation job{mitigationJobs.length > 1 ? "s" : ""} in progress</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{mitigationJobs.map(j => `${j.id}: Day ${j.dayOfDrying}`).join(" · ")} — daily drying logs required</div>
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
              <div style={{ fontSize: 28, fontWeight: 800, color: T.greenBright }}>${(totalRevenue / 1000).toFixed(0)}K</div>
            </Card>
          )}
          <Card style={{ flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Mitigation Active</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.blueBright }}>{mitigationJobs.length}</div>
          </Card>
          {rm.canViewInvoices && (
            <Card style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Unpaid Invoices</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: T.yellowBright }}>${(unpaidInvoices / 1000).toFixed(1)}K</div>
            </Card>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: rm.canSeeProfitMargins ? "2fr 1fr" : "1fr", gap: 16, marginBottom: 20 }}>
          <Card>
            <div style={{ fontWeight: 600, fontSize: 14, color: T.white, marginBottom: 12 }}>Job Pipeline</div>
            <div style={{ display: "flex", gap: 2, height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
              {JOB_STAGES.map(s => {
                const cnt = JOBS.filter(j => j.stage === s.id).length;
                const pct = (cnt / JOBS.length) * 100;
                return cnt > 0 ? <div key={s.id} style={{ flex: pct, background: s.color, minWidth: 3 }}/> : null;
              })}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {JOB_STAGES.filter(s => JOBS.some(j => j.stage === s.id)).map(s => {
                const cnt = JOBS.filter(j => j.stage === s.id).length;
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
              {JOBS.filter(j => !["paid"].includes(j.stage)).slice(0, 4).map(j => (
                <div key={j.id} onClick={() => { setSelectedJob(j); setActive("job_detail"); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: `1px solid ${T.border}22`, cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = "0.8"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = "1"}
                >
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: T.orange, minWidth: 52 }}>{j.id}</span>
                  <span style={{ flex: 1, fontSize: 12, color: T.text, fontWeight: 500 }}>{j.customer}</span>
                  <Badge color={stageColor[j.stage] || "gray"} small dot>{stageInfo(j.stage).label}</Badge>
                  {j.moistureAlerts > 0 && <Ic n="alert" s={13} c={T.redBright}/>}
                </div>
              ))}
            </div>
          </Card>

          {rm.canSeeProfitMargins && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: T.white, marginBottom: 12 }}>Revenue Snapshot</div>
                {([["Mitigation", "$48.2K", T.orange, 72], ["Reconstruction", "$89.4K", T.blueBright, 100], ["Contents", "$12.8K", T.purpleBright, 18]] as [string, string, string, number][]).map(([l, v, c, w]) => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 12, color: T.muted }}>{l}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: T.white }}>{v}</span>
                    </div>
                    <div style={{ background: T.surfaceHigh, borderRadius: 4, height: 4 }}>
                      <div style={{ background: c, borderRadius: 4, height: 4, width: `${w}%` }}/>
                    </div>
                  </div>
                ))}
              </Card>
              <Card style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: T.white, marginBottom: 10 }}>Insurance Snapshot</div>
                {[{ carrier: "State Farm", status: "Awaiting Supp", color: "yellow" }, { carrier: "Travelers", status: "Approved", color: "green" }, { carrier: "Farmers", status: "Under Review", color: "blue" }, { carrier: "Liberty Mutual", status: "Pending", color: "gray" }].map((ins, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: T.text }}>{ins.carrier}</span>
                    <Badge color={ins.color} small>{ins.status}</Badge>
                  </div>
                ))}
              </Card>
            </div>
          )}
        </div>

        <Card>
          <div style={{ fontWeight: 600, fontSize: 14, color: T.white, marginBottom: 12 }}>Today's Field Activity</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
            {[
              { time: "7:30 AM", task: "Mobilize – J-1046 Highland Park (Cat 3)", who: "Aisha T. + Priya P.", type: "mobilize" },
              { time: "8:00 AM", task: "Day 5 drying check – J-1051 Martinez", who: "Marcus W.", type: "drycheck" },
              { time: "10:00 AM", task: "Assessment – J-1047 Rodriguez", who: "Tyler N.", type: "assessment" },
              { time: "2:00 PM", task: "Adjuster walkthrough – J-1050 Sunrise", who: "Destiny K.", type: "adjuster" },
              { time: "3:30 PM", task: "Equipment pickup – J-1048 Valley View", who: "Carlos R.", type: "pickup" },
            ].map((ev, i) => {
              const colors: Record<string, string> = { mobilize: T.orange, drycheck: T.blueBright, assessment: T.yellowBright, adjuster: T.purpleBright, pickup: T.greenBright };
              return (
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: T.surfaceHigh, borderRadius: 8, borderLeft: `3px solid ${colors[ev.type]}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.white }}>{ev.task}</div>
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{ev.time} · {ev.who}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
