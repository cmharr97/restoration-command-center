import { T, JOBS, DRYING_LOGS, type Job } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";

interface MitigationProps {
  role: string;
  setSelectedJob: (job: Job) => void;
  setActive: (id: string) => void;
}

export const MitigationPage = ({ role, setSelectedJob, setActive }: MitigationProps) => {
  const waterJobs = JOBS.filter(j => j.lossType === "water" && ["mitigation", "mit_complete", "auth_signed"].includes(j.stage));
  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Drying Logs</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>IICRC S500 compliant moisture tracking</p>
        </div>
        <Btn v="primary" sz="sm" icon="plus">Add Reading</Btn>
      </div>
      <div style={{ padding: "0 28px" }}>
        {waterJobs.length === 0 ? <div style={{ textAlign: "center", padding: 40, color: T.dim }}>No active water damage jobs</div> :
          waterJobs.map(job => {
            const logs = DRYING_LOGS[job.id] || [];
            const latest = logs[logs.length - 1];
            const wetRooms = latest?.readings.filter(r => r.status === "wet") || [];
            const dryRooms = latest?.readings.filter(r => r.status === "dry") || [];
            return (
              <Card key={job.id} style={{ marginBottom: 14 }} glow={job.priority === "high"}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: T.orange }}>{job.id}</span>
                      <span style={{ fontWeight: 600, color: T.white, fontSize: 14 }}>{job.customer}</span>
                      {job.priority === "high" && <Badge color="red" small dot>Urgent</Badge>}
                    </div>
                    <div style={{ fontSize: 12, color: T.muted }}>{job.lossSubtype} · Day {job.dayOfDrying} of drying</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn v="secondary" sz="sm" onClick={() => { setSelectedJob(job); setActive("job_detail"); }}>View Job</Btn>
                    <Btn v="primary" sz="sm" icon="plus">Log Reading</Btn>
                  </div>
                </div>

                {latest && (
                  <div>
                    <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                      {[
                        { label: "Latest GPP", value: latest.gpp, color: latest.gpp < 50 ? T.greenBright : latest.gpp < 60 ? T.yellowBright : T.redBright, big: true },
                        { label: "Rooms Dry", value: `${dryRooms.length}/${latest.readings.length}`, color: T.greenBright, big: true },
                        { label: "Temp/RH", value: `${latest.temp}°F / ${latest.rh}%`, color: T.text, big: false },
                        { label: "Last Entry", value: latest.date, color: T.text, big: false },
                      ].map((stat, i) => (
                        <div key={i} style={{ background: T.surfaceHigh, borderRadius: 8, padding: "8px 14px", flex: 1 }}>
                          <div style={{ fontSize: 10, color: T.dim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{stat.label}</div>
                          <div style={{ fontSize: stat.big ? 20 : 14, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {latest.readings.map((r, i) => (
                        <div key={i} style={{ background: r.status === "wet" ? T.yellowDim : T.greenDim, border: `1px solid ${r.status === "wet" ? T.yellowBright + "44" : T.greenBright + "44"}`, borderRadius: 7, padding: "6px 10px", textAlign: "center", minWidth: 80 }}>
                          <div style={{ fontSize: 10, color: r.status === "wet" ? T.yellowBright : T.greenBright, fontWeight: 500 }}>{r.room}</div>
                          <div style={{ fontSize: 11, color: T.muted }}>{r.material}</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: r.status === "wet" ? T.yellowBright : T.greenBright }}>{r.reading}%</div>
                          <div style={{ fontSize: 9, color: r.status === "wet" ? T.yellowBright : T.greenBright }}>{r.status === "dry" ? "✓ DRY" : "WET"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {logs.length === 0 && <div style={{ textAlign: "center", padding: 20, color: T.dim, fontSize: 12 }}>No drying logs yet — add first reading</div>}
              </Card>
            );
          })
        }
      </div>
    </div>
  );
};
