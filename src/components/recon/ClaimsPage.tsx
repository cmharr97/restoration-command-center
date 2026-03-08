import { useState } from "react";
import { T, JOB_STAGES, stageInfo, stageColor } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";
import { useJobs, useClaims, type DbJob } from "@/hooks/useJobs";

interface ClaimsPageProps {
  role: string;
  setSelectedJob?: (job: DbJob) => void;
  setActive?: (id: string) => void;
}

export const ClaimsPage = ({ role, setSelectedJob, setActive }: ClaimsPageProps) => {
  const { jobs, loading: jobsLoading } = useJobs();
  const { claims, loading: claimsLoading } = useClaims();
  const [filter, setFilter] = useState("all");

  const jobsWithClaims = jobs.filter(j => j.carrier && j.claim_no);

  const statusCategories = [
    { id: "all", label: "All Claims", count: jobsWithClaims.length },
    { id: "pending", label: "Awaiting Response", count: jobsWithClaims.filter(j => ["estimate_submitted", "supplement", "carrier_approval"].includes(j.stage)).length },
    { id: "approved", label: "Approved", count: jobsWithClaims.filter(j => ["recon_scheduled", "reconstruction"].includes(j.stage)).length },
    { id: "supplement", label: "Supplement Needed", count: jobsWithClaims.filter(j => j.stage === "supplement").length },
    { id: "invoiced", label: "Invoiced", count: jobsWithClaims.filter(j => j.stage === "invoiced").length },
  ];

  const filtered = filter === "all" ? jobsWithClaims : jobsWithClaims.filter(j => {
    if (filter === "pending") return ["estimate_submitted", "supplement", "carrier_approval"].includes(j.stage);
    if (filter === "approved") return ["recon_scheduled", "reconstruction"].includes(j.stage);
    if (filter === "supplement") return j.stage === "supplement";
    if (filter === "invoiced") return j.stage === "invoiced";
    return true;
  });

  if (jobsLoading) return <div style={{ padding: 40, textAlign: "center", color: T.muted }}>Loading claims...</div>;

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Claim Tracking</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Insurance claim status for all jobs</p>
        </div>
      </div>
      <div style={{ padding: "0 28px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
          {[
            { label: "Total Claims", value: jobsWithClaims.length, color: T.orange },
            { label: "Awaiting Response", value: statusCategories[1].count, color: T.yellowBright },
            { label: "Outstanding Balance", value: `$${jobsWithClaims.reduce((a, j) => a + (j.contract_value || 0), 0).toLocaleString()}`, color: T.redBright },
            { label: "Supplements Pending", value: statusCategories[3].count, color: T.purpleBright },
          ].map((s, i) => (
            <Card key={i} style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            </Card>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto" }}>
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

        {jobsWithClaims.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <Ic n="shield" s={40} c={T.dim}/>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.white, marginTop: 16 }}>No claims yet</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>Claims are automatically tracked when you add insurance information to jobs.</div>
          </Card>
        ) : (
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 120px 120px 100px 120px 100px", padding: "10px 16px", borderBottom: `1px solid ${T.border}`, background: T.surfaceHigh }}>
              {["Job #", "Customer / Carrier", "Claim #", "Stage", "Estimate", "Outstanding", "Actions"].map(h => (
                <div key={h} style={{ fontSize: 10, fontWeight: 600, color: T.dim, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</div>
              ))}
            </div>
            {filtered.map(j => {
              const claim = claims.find((c: any) => c.job_id === j.id);
              return (
                <div key={j.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr 120px 120px 100px 120px 100px", padding: "12px 16px", borderBottom: `1px solid ${T.border}22`, alignItems: "center", cursor: "pointer" }}
                  onClick={() => { setSelectedJob?.(j); setActive?.("job_detail"); }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = T.surfaceHigh}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                >
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: T.orange, fontWeight: 700 }}>{j.id}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.white }}>{j.customer}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{j.carrier}</div>
                  </div>
                  <span style={{ fontSize: 12, color: T.text }}>{j.claim_no || "—"}</span>
                  <Badge color={stageColor[j.stage] || "gray"} small dot>{stageInfo(j.stage).label}</Badge>
                  <span style={{ fontSize: 12, color: T.greenBright, fontWeight: 600 }}>{j.contract_value ? `$${j.contract_value.toLocaleString()}` : "—"}</span>
                  <span style={{ fontSize: 12, color: T.yellowBright, fontWeight: 600 }}>{j.contract_value ? `$${j.contract_value.toLocaleString()}` : "—"}</span>
                  <Btn v="secondary" sz="sm">View</Btn>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
