import { T, JOB_STAGES } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Ic } from "@/components/recon/ReconUI";
import { useJobs, usePayments, useSubcontractors, useDryingLogs } from "@/hooks/useJobs";

export const ReportsPage = ({ role }: { role: string }) => {
  const { jobs } = useJobs();
  const { payments } = usePayments();
  const { subs } = useSubcontractors();
  const { logs } = useDryingLogs();

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => !["closed", "invoiced"].includes(j.stage)).length;
  const totalRevenue = jobs.reduce((a, j) => a + (j.contract_value || 0), 0);
  const totalReceived = payments.reduce((a: number, p: any) => a + (p.amount || 0), 0);
  const avgDaysActive = totalJobs > 0 ? Math.round(jobs.reduce((a, j) => {
    const created = new Date(j.created_at).getTime();
    return a + (Date.now() - created) / (1000 * 60 * 60 * 24);
  }, 0) / totalJobs) : 0;

  const stageDistribution = JOB_STAGES.map(s => ({
    ...s, count: jobs.filter(j => j.stage === s.id).length,
  })).filter(s => s.count > 0);

  const carriers = jobs.filter(j => j.carrier).reduce((acc, j) => {
    acc[j.carrier || "Unknown"] = (acc[j.carrier || "Unknown"] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const lossTypes = jobs.reduce((acc, j) => {
    acc[j.loss_type] = (acc[j.loss_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (totalJobs === 0) {
    return (
      <div style={{ padding: "0 0 40px" }}>
        <div style={{ padding: "24px 28px 0", marginBottom: 18 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Reports & Analytics</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Business intelligence & performance tracking</p>
        </div>
        <div style={{ padding: "0 28px" }}>
          <Card style={{ textAlign: "center", padding: 48 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: T.orangeDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Ic n="chart" s={28} c={T.orange}/>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.white }}>Operational Analytics</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 8, maxWidth: 440, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              Reports generate automatically as you manage jobs. Track revenue, job pipeline, carrier performance, drying metrics, and payment collection across your entire operation.
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
              {["Revenue Tracking", "Pipeline Analysis", "Carrier Performance", "Drying Metrics", "Collection Rate"].map(f => (
                <span key={f} style={{ fontSize: 11, color: T.muted, background: T.surfaceHigh, padding: "4px 10px", borderRadius: 12, border: `1px solid ${T.border}` }}>{f}</span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", marginBottom: 18 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Reports & Analytics</h1>
        <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Business intelligence across {totalJobs} jobs</p>
      </div>
      <div style={{ padding: "0 28px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
          {[
            { label: "Total Jobs", value: totalJobs, color: T.orange },
            { label: "Active", value: activeJobs, color: T.blueBright },
            { label: "Revenue", value: `$${(totalRevenue / 1000).toFixed(0)}K`, color: T.greenBright },
            { label: "Collected", value: `$${(totalReceived / 1000).toFixed(0)}K`, color: T.tealBright },
            { label: "Outstanding", value: `$${(Math.max(0, totalRevenue - totalReceived) / 1000).toFixed(0)}K`, color: T.redBright },
            { label: "Avg Days Active", value: avgDaysActive, color: T.yellowBright },
          ].map((kpi, i) => (
            <Card key={i} style={{ flex: 1, minWidth: 110, padding: "14px 16px" }}>
              <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{kpi.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
            </Card>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
          <Card>
            <div style={{ fontWeight: 700, color: T.white, marginBottom: 12 }}>Job Pipeline</div>
            <div style={{ display: "flex", gap: 2, height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 14 }}>
              {stageDistribution.map(s => <div key={s.id} style={{ flex: s.count, background: s.color, minWidth: 3 }}/>)}
            </div>
            {stageDistribution.map(s => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }}/>
                  <span style={{ fontSize: 12, color: T.text }}>{s.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.white }}>{s.count}</span>
                  <span style={{ fontSize: 11, color: T.dim }}>{Math.round((s.count / totalJobs) * 100)}%</span>
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <div style={{ fontWeight: 700, color: T.white, marginBottom: 12 }}>Jobs by Carrier</div>
            {Object.entries(carriers).sort((a, b) => b[1] - a[1]).map(([carrier, count]) => (
              <div key={carrier} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${T.border}18` }}>
                <span style={{ fontSize: 12, color: T.text }}>{carrier}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: Math.max(20, (count / totalJobs) * 100), height: 6, borderRadius: 3, background: T.blueBright }}/>
                  <Badge color="blue" small>{count}</Badge>
                </div>
              </div>
            ))}
            {Object.keys(carriers).length === 0 && <div style={{ textAlign: "center", padding: 20, color: T.dim, fontSize: 12 }}>No carrier data</div>}
          </Card>

          <Card>
            <div style={{ fontWeight: 700, color: T.white, marginBottom: 12 }}>Jobs by Loss Type</div>
            {Object.entries(lossTypes).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
              const colors: Record<string, string> = { water: T.blueBright, fire: T.redBright, mold: T.greenBright, storm: T.yellowBright, biohazard: T.purpleBright, contents: T.tealBright };
              return (
                <div key={type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${T.border}18` }}>
                  <span style={{ fontSize: 12, color: T.text, textTransform: "capitalize" }}>{type}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: Math.max(20, (count / totalJobs) * 100), height: 6, borderRadius: 3, background: colors[type] || T.muted }}/>
                    <Badge color={type === "water" ? "blue" : type === "fire" ? "red" : "green"} small>{count}</Badge>
                  </div>
                </div>
              );
            })}
          </Card>

          <Card>
            <div style={{ fontWeight: 700, color: T.white, marginBottom: 12 }}>Operations Summary</div>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              {[
                { label: "Drying Logs", value: logs.length, color: T.blueBright },
                { label: "Active Drying", value: jobs.filter(j => ["drying", "mitigation"].includes(j.stage)).length, color: T.orange },
                { label: "Subcontractors", value: subs.length, color: T.tealBright },
              ].map((m, i) => (
                <div key={i} style={{ flex: 1, background: T.surfaceHigh, borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: T.dim, textTransform: "uppercase", marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
              {totalReceived > 0 ? `Collection rate: ${Math.round((totalReceived / Math.max(1, totalRevenue)) * 100)}% of total revenue collected.` : "Track payments to see collection metrics."}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
