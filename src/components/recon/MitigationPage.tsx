import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";
import { useJobs, useDryingLogs, type DbJob } from "@/hooks/useJobs";

interface MitigationProps {
  role: string;
  setSelectedJob: (job: DbJob) => void;
  setActive: (id: string) => void;
}

export const MitigationPage = ({ role, setSelectedJob, setActive }: MitigationProps) => {
  const { jobs, loading: jobsLoading } = useJobs();
  const { logs, loading: logsLoading } = useDryingLogs();

  const waterJobs = jobs.filter(j => ["mitigation", "drying"].includes(j.stage) || (j.loss_type === "water" && j.day_of_drying && j.day_of_drying > 0));

  if (jobsLoading || logsLoading) {
    return <div style={{ padding: 40, textAlign: "center", color: T.muted }}>Loading drying logs...</div>;
  }

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Drying Logs</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>IICRC S500 compliant moisture tracking</p>
        </div>
        {waterJobs.length > 0 && <Btn v="primary" sz="sm" icon="plus" onClick={() => { if (waterJobs[0]) { setSelectedJob(waterJobs[0]); setActive("job_detail"); } }}>Add Reading</Btn>}
      </div>
      <div style={{ padding: "0 28px" }}>
        {waterJobs.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: T.blueDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Ic n="moisture" s={28} c={T.blueBright}/>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.white }}>Moisture Monitoring</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 8, maxWidth: 440, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              Track daily moisture readings, GPP levels, equipment placement, and room-by-room drying progress for water damage jobs. Compliant with IICRC S500 documentation standards.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 20, maxWidth: 420, margin: "20px auto 0" }}>
              {[
                { icon: "💧", label: "Room Readings", desc: "Track by material" },
                { icon: "📊", label: "GPP / Temp / RH", desc: "Atmospheric data" },
                { icon: "🔧", label: "Equipment Log", desc: "Dehus, air movers" },
              ].map(p => (
                <div key={p.label} style={{ background: T.surfaceHigh, borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{p.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.white }}>{p.label}</div>
                  <div style={{ fontSize: 10, color: T.dim }}>{p.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              <Btn v="primary" icon="plus" onClick={() => setActive("jobs")}>Create a Water Damage Job</Btn>
            </div>
          </Card>
        ) : (
          <>
            {/* Summary bar */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              {[
                { label: "Active Drying Jobs", value: waterJobs.length, color: T.orange },
                { label: "Total Log Entries", value: logs.length, color: T.blueBright },
              ].map((s, i) => (
                <Card key={i} style={{ flex: 1, minWidth: 130, padding: "14px 16px" }}>
                  <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                </Card>
              ))}
            </div>

            {waterJobs.map(job => {
              const jobLogs = logs.filter(l => l.job_id === job.id).sort((a: any, b: any) => a.day - b.day);
              const latest = jobLogs[jobLogs.length - 1];
              const readings = latest?.readings as any[] || [];
              const dryRooms = readings.filter((r: any) => r.status === "dry");

              return (
                <Card key={job.id} style={{ marginBottom: 12 }} glow={job.priority === "high"}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: T.orange }}>{job.id}</span>
                        <span style={{ fontWeight: 600, color: T.white, fontSize: 14 }}>{job.customer}</span>
                        {job.priority === "high" && <Badge color="red" small dot>Urgent</Badge>}
                      </div>
                      <div style={{ fontSize: 12, color: T.muted }}>{job.loss_subtype || job.loss_type} · Day {job.day_of_drying || 0} of drying</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn v="secondary" sz="sm" onClick={() => { setSelectedJob(job); setActive("job_detail"); }}>View Job</Btn>
                      <Btn v="primary" sz="sm" icon="plus" onClick={() => { setSelectedJob(job); setActive("job_detail"); }}>Log Reading</Btn>
                    </div>
                  </div>

                  {latest && readings.length > 0 ? (
                    <div>
                      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                        {[
                          { label: "Latest GPP", value: latest.gpp, color: latest.gpp < 50 ? T.greenBright : latest.gpp < 60 ? T.yellowBright : T.redBright },
                          { label: "Rooms Dry", value: `${dryRooms.length}/${readings.length}`, color: T.greenBright },
                          { label: "Temp / RH", value: `${latest.temp || 0}°F / ${latest.rh || 0}%`, color: T.text },
                          { label: "Last Entry", value: latest.date, color: T.text },
                        ].map((stat, i) => (
                          <div key={i} style={{ background: T.surfaceHigh, borderRadius: 8, padding: "8px 14px", flex: 1 }}>
                            <div style={{ fontSize: 10, color: T.dim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{stat.label}</div>
                            <div style={{ fontSize: i < 2 ? 20 : 13, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {readings.map((r: any, i: number) => (
                          <div key={i} style={{ background: r.status === "wet" ? T.yellowDim : T.greenDim, border: `1px solid ${r.status === "wet" ? T.yellowBright + "44" : T.greenBright + "44"}`, borderRadius: 7, padding: "6px 10px", textAlign: "center", minWidth: 80 }}>
                            <div style={{ fontSize: 10, color: r.status === "wet" ? T.yellowBright : T.greenBright, fontWeight: 500 }}>{r.room}</div>
                            <div style={{ fontSize: 11, color: T.muted }}>{r.material}</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: r.status === "wet" ? T.yellowBright : T.greenBright }}>{r.reading}%</div>
                            <div style={{ fontSize: 9, color: r.status === "wet" ? T.yellowBright : T.greenBright, fontWeight: 600 }}>{r.status === "dry" ? "✓ DRY" : "WET"}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: 20, color: T.dim, fontSize: 12 }}>No drying logs yet — add first reading</div>
                  )}
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
