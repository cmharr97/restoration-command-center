import { useState } from "react";
import { T, stageInfo, stageColor } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";
import { useJobs, useClaims, type DbJob } from "@/hooks/useJobs";

interface ClaimsPageProps {
  role: string;
  setSelectedJob?: (job: DbJob) => void;
  setActive?: (id: string) => void;
}

export const ClaimsPage = ({ role, setSelectedJob, setActive }: ClaimsPageProps) => {
  const { jobs, loading: jobsLoading } = useJobs();
  const [filter, setFilter] = useState("all");

  // Only show insurance jobs — this is an insurance jobs overview dashboard
  const insuranceJobs = jobs.filter(j => j.payment_type === "insurance");

  const statusCategories = [
    { id: "all", label: "All Insurance Jobs", count: insuranceJobs.length },
    { id: "pending", label: "Awaiting Response", count: insuranceJobs.filter(j => ["estimate_submitted", "supplement", "carrier_approval"].includes(j.stage)).length },
    { id: "approved", label: "Approved", count: insuranceJobs.filter(j => ["recon_scheduled", "reconstruction"].includes(j.stage)).length },
    { id: "supplement", label: "Supplement Needed", count: insuranceJobs.filter(j => j.stage === "supplement").length },
    { id: "invoiced", label: "Invoiced", count: insuranceJobs.filter(j => j.stage === "invoiced").length },
  ];

  const filtered = filter === "all" ? insuranceJobs : insuranceJobs.filter(j => {
    if (filter === "pending") return ["estimate_submitted", "supplement", "carrier_approval"].includes(j.stage);
    if (filter === "approved") return ["recon_scheduled", "reconstruction"].includes(j.stage);
    if (filter === "supplement") return j.stage === "supplement";
    if (filter === "invoiced") return j.stage === "invoiced";
    return true;
  });

  if (jobsLoading) return <div style={{ padding: 40, textAlign: "center", color: T.muted }}>Loading insurance jobs...</div>;

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Insurance Jobs Overview</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Track claim status across all insurance jobs — this is your internal tracking dashboard</p>
        </div>
      </div>
      <div style={{ padding: "0 28px" }}>
        {insuranceJobs.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: T.blueDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Ic n="shield" s={28} c={T.blueBright}/>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.white }}>Insurance Job Tracking</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 8, maxWidth: 440, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              When you create a job with "Insurance" as the payment type, it will appear here. Track claim status, log carrier responses, monitor supplement progress, and record insurance payments — all from within each job.
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
              {["Log Carrier Responses", "Monitor Supplements", "Record Payments", "Track Adjuster Communication"].map(f => (
                <span key={f} style={{ fontSize: 11, color: T.muted, background: T.surfaceHigh, padding: "4px 10px", borderRadius: 12, border: `1px solid ${T.border}` }}>{f}</span>
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              <Btn v="primary" icon="plus" onClick={() => setActive?.("jobs")}>View Jobs</Btn>
            </div>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              {[
                { label: "Insurance Jobs", value: insuranceJobs.length, color: T.orange },
                { label: "Awaiting Response", value: statusCategories[1].count, color: T.yellowBright },
                { label: "Supplements Pending", value: statusCategories[3].count, color: T.purpleBright },
                { label: "Approved", value: statusCategories[2].count, color: T.greenBright },
              ].map((s, i) => (
                <Card key={i} style={{ flex: 1, minWidth: 130, padding: "14px 16px" }}>
                  <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                </Card>
              ))}
            </div>

            {/* Filter tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto" }}>
              {statusCategories.map(cat => (
                <div key={cat.id} onClick={() => setFilter(cat.id)} style={{
                  padding: "5px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                  background: filter === cat.id ? T.orange : T.surfaceHigh,
                  color: filter === cat.id ? "#fff" : T.muted,
                  border: `1px solid ${filter === cat.id ? T.orange : T.border}`,
                  fontWeight: filter === cat.id ? 600 : 400, whiteSpace: "nowrap",
                }}>{cat.label} ({cat.count})</div>
              ))}
            </div>

            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 120px 120px 100px 100px", padding: "10px 16px", borderBottom: `1px solid ${T.border}`, background: T.surfaceHigh }}>
                {["Job #", "Customer / Carrier", "Claim #", "Stage", "Contract", "Actions"].map(h => (
                  <div key={h} style={{ fontSize: 10, fontWeight: 600, color: T.dim, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</div>
                ))}
              </div>
              {filtered.map(j => (
                <div key={j.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr 120px 120px 100px 100px", padding: "12px 16px", borderBottom: `1px solid ${T.border}18`, alignItems: "center", cursor: "pointer" }}
                  onClick={() => { setSelectedJob?.(j); setActive?.("job_detail"); }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = T.surfaceHigh}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                >
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: T.orange, fontWeight: 700 }}>{j.id}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.white }}>{j.customer}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{j.carrier || "No carrier"}</div>
                  </div>
                  <span style={{ fontSize: 12, color: T.text, fontFamily: "monospace" }}>{j.claim_no || "—"}</span>
                  <Badge color={stageColor[j.stage] || "gray"} small dot>{stageInfo(j.stage).label}</Badge>
                  <span style={{ fontSize: 12, color: T.greenBright, fontWeight: 600 }}>{j.contract_value ? `$${j.contract_value.toLocaleString()}` : "—"}</span>
                  <Btn v="secondary" sz="sm" onClick={() => { setSelectedJob?.(j); setActive?.("job_detail"); }}>View Job</Btn>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};