import { useState } from "react";
import { T, ROLES, JOB_STAGES, stageInfo, stageColor } from "@/lib/recon-data";
import { Badge, Btn, Ic, Inp } from "@/components/recon/ReconUI";
import { useJobs, type DbJob } from "@/hooks/useJobs";

const JobCard = ({ job, onClick }: { job: DbJob; onClick: () => void }) => {
  const stage = stageInfo(job.stage);
  const sc = stageColor[job.stage] || "gray";
  const isWater = job.loss_type === "water";
  const isActive = ["mitigation", "reconstruction"].includes(job.stage);
  return (
    <div onClick={onClick} style={{ background: T.surface, border: `1px solid ${isActive ? T.orange + "40" : T.border}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", transition: "all 0.15s", marginBottom: 8 }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = T.borderMid; (e.currentTarget as HTMLDivElement).style.background = T.surfaceHigh; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = isActive ? T.orange + "40" : T.border; (e.currentTarget as HTMLDivElement).style.background = T.surface; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
            <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: T.orange }}>{job.id}</span>
            {job.priority === "high" && <span style={{ fontSize: 9, fontWeight: 700, color: T.redBright, background: T.redDim, border: `1px solid ${T.redBright}33`, borderRadius: 4, padding: "1px 5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>URGENT</span>}
          </div>
          <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>{job.customer}</div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{job.address}</div>
        </div>
        <Badge color={sc} dot small>{stage.label}</Badge>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {job.carrier && <span style={{ fontSize: 11, color: T.muted }}>📋 {job.carrier}</span>}
        {isWater && job.day_of_drying && <span style={{ fontSize: 11, color: T.yellowBright }}>💧 Day {job.day_of_drying}</span>}
        {(job.moisture_alerts || 0) > 0 && <span style={{ fontSize: 11, color: T.redBright }}>⚠ {job.moisture_alerts} alerts</span>}
        {job.contract_value && <span style={{ fontSize: 11, color: T.greenBright, fontWeight: 600 }}>${job.contract_value.toLocaleString()}</span>}
        {job.pm_name && <span style={{ fontSize: 11, color: T.muted }}>👤 {job.pm_name}</span>}
      </div>
    </div>
  );
};

interface JobsPageProps {
  role: string;
  setSelectedJob: (job: DbJob) => void;
  setActive: (id: string) => void;
}

export const JobsPage = ({ role, setSelectedJob, setActive }: JobsPageProps) => {
  const [stageFilter, setStageFilter] = useState("all");
  const [search, setSearch] = useState("");
  const rm = ROLES[role];
  const { jobs, loading } = useJobs();

  const filtered = jobs.filter(j => {
    if (stageFilter !== "all" && j.stage !== stageFilter) return false;
    if (search && !j.customer.toLowerCase().includes(search.toLowerCase()) && !j.id.includes(search) && !j.address.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: T.muted }}>Loading jobs...</div>;
  }

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Jobs</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>{jobs.length} total job{jobs.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <div style={{ padding: "0 28px" }}>
        {jobs.length > 0 && (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
              <div onClick={() => setStageFilter("all")} style={{ background: stageFilter === "all" ? T.orange : T.surfaceHigh, color: stageFilter === "all" ? "#fff" : T.muted, border: `1px solid ${stageFilter === "all" ? T.orange : T.border}`, borderRadius: 20, padding: "5px 14px", fontSize: 12, cursor: "pointer", flexShrink: 0, fontWeight: stageFilter === "all" ? 600 : 400 }}>All ({jobs.length})</div>
              {JOB_STAGES.filter(s => jobs.some(j => j.stage === s.id)).map(s => {
                const cnt = jobs.filter(j => j.stage === s.id).length;
                const isAct = stageFilter === s.id;
                return <div key={s.id} onClick={() => setStageFilter(s.id)} style={{ background: isAct ? `${s.color}22` : T.surfaceHigh, color: isAct ? s.color : T.muted, border: `1px solid ${isAct ? s.color : T.border}`, borderRadius: 20, padding: "5px 14px", fontSize: 12, cursor: "pointer", flexShrink: 0, fontWeight: isAct ? 600 : 400, whiteSpace: "nowrap" }}>{s.icon} {s.label} ({cnt})</div>;
              })}
            </div>
            <div style={{ marginBottom: 14 }}>
              <Inp placeholder="Search by job ID, customer, or address..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 360 }}/>
            </div>
          </>
        )}

        <div>
          {jobs.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: T.dim }}>
              <Ic n="jobs" s={48} c={T.dim}/>
              <div style={{ fontSize: 16, fontWeight: 600, color: T.white, marginTop: 16 }}>No jobs yet</div>
              <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>Click "New Job" to create your first job and get started.</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: T.dim }}>No jobs match that filter</div>
          ) : (
            filtered.map(j => <JobCard key={j.id} job={j} onClick={() => { setSelectedJob(j); setActive("job_detail"); }}/>)
          )}
        </div>
      </div>
    </div>
  );
};
