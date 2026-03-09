import { useState } from "react";
import { T, ROLES, JOB_STAGES, LOSS_TYPES, stageInfo, stageColor } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";
import { useTeamMembers, useJobs, type DbJob } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { JobOverviewTab } from "./job-detail/JobOverviewTab";
import { JobClaimTab } from "./job-detail/JobClaimTab";
import { JobSupplementsTab } from "./job-detail/JobSupplementsTab";
import { JobPaymentsTab } from "./job-detail/JobPaymentsTab";
import { JobDryingTab } from "./job-detail/JobDryingTab";
import { JobPhotosTab } from "./job-detail/JobPhotosTab";
import { JobCommunicationTab } from "./job-detail/JobCommunicationTab";
import { JobSubcontractorsTab } from "./job-detail/JobSubcontractorsTab";
import { JobActivityTab } from "./job-detail/JobActivityTab";

interface JobDetailProps {
  job: DbJob;
  role: string;
  setActive: (id: string) => void;
}

export const JobDetailPage = ({ job, role, setActive }: JobDetailProps) => {
  const [tab, setTab] = useState("overview");
  const rm = ROLES[role] || ROLES.owner;
  const stage = stageInfo(job.stage);
  const { members } = useTeamMembers();
  const { updateJob, deleteJob } = useJobs();
  const { toast } = useToast();
  const isWater = job.loss_type === "water";
  const isInsurance = job.payment_type === "insurance";
  const [archiving, setArchiving] = useState(false);

  const TAB_CONFIG = [
    { id: "overview", label: "Overview", icon: "eye" },
    ...(isInsurance ? [{ id: "claim", label: "Insurance Tracking", icon: "shield" }] : []),
    ...(isInsurance ? [{ id: "supplements", label: "Supplements", icon: "est" }] : []),
    { id: "payments", label: "Payments", icon: "dollar" },
    ...(isWater ? [{ id: "drying", label: "Drying Logs", icon: "moisture" }] : []),
    { id: "photos", label: "Photos & Docs", icon: "photo" },
    { id: "communication", label: "Communication", icon: "msg" },
    { id: "subcontractors", label: "Subcontractors", icon: "truck" },
    { id: "activity", label: "Activity", icon: "clock" },
  ];

  const visibleTabs = TAB_CONFIG.filter(t => {
    if (t.id === "payments" && !rm.canViewPayments && !rm.canViewInvoices) return false;
    if (t.id === "claim" && !rm.canViewClaims) return false;
    if (t.id === "supplements" && !rm.canViewClaims) return false;
    if (t.id === "subcontractors" && !rm.canManageSubs && role !== "owner") return false;
    return true;
  });

  const quickInfoItems = [
    { label: "Job Type", value: isInsurance ? "Insurance" : "Self Pay", icon: isInsurance ? "shield" : "dollar" },
    { label: "Loss Type", value: `${LOSS_TYPES.find(l => l.id === job.loss_type)?.label || job.loss_type}`, icon: "drop" },
    { label: "Date of Loss", value: job.date_of_loss || "TBD", icon: "cal" },
    ...(isInsurance ? [
      { label: "Carrier", value: job.carrier || "TBD", icon: "shield" },
      { label: "Claim #", value: job.claim_no || "TBD", icon: "note" },
    ] : []),
    { label: "PM", value: job.pm_name || "Unassigned", icon: "users" },
    ...(isWater && job.day_of_drying ? [{ label: "Drying Day", value: `Day ${job.day_of_drying}`, icon: "moisture" }] : []),
    ...(rm.canViewInvoices && job.contract_value ? [{ label: "Contract", value: `$${job.contract_value.toLocaleString()}`, icon: "dollar" }] : []),
  ];

  const handleArchive = async () => {
    if (!confirm(`Archive job ${job.id}? This will move it to Closed stage.`)) return;
    setArchiving(true);
    const ok = await updateJob(job.id, { stage: "closed" });
    if (ok) {
      toast({ title: "Job archived", description: `${job.id} moved to Closed` });
      setActive("jobs");
    }
    setArchiving(false);
  };

  const handleStageChange = async (stageId: string) => {
    const ok = await updateJob(job.id, { stage: stageId });
    if (ok) {
      toast({ title: "Stage updated", description: `${job.id} → ${stageInfo(stageId).label}` });
    }
  };

  return (
    <div style={{ padding: "0 0 40px" }}>
      {/* Header */}
      <div style={{ padding: "24px 28px 0", marginBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <button onClick={() => setActive("jobs")} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 12, padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
                <Ic n="chevR" s={12} c={T.muted} />Jobs
              </button>
              <Ic n="chevR" s={12} c={T.dim} />
              <span style={{ fontFamily: "monospace", fontSize: 12, color: T.orange, fontWeight: 700 }}>{job.id}</span>
              {job.priority === "high" && <Badge color="red" small>URGENT</Badge>}
              <Badge color={isInsurance ? "orange" : "green"} small>{isInsurance ? "INSURANCE" : "SELF PAY"}</Badge>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: T.white, margin: "0 0 2px", letterSpacing: "-0.02em" }}>{job.customer}</h1>
            <p style={{ margin: 0, color: T.muted, fontSize: 13 }}>{job.address}</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Badge color={stageColor[job.stage] || "gray"} dot>{stage.label}</Badge>
            {rm.canDeleteJobs && (
              <Btn v="danger" sz="sm" onClick={handleArchive} disabled={archiving}>
                {archiving ? "..." : "Archive"}
              </Btn>
            )}
          </div>
        </div>

        {/* Stage Tracker */}
        <div style={{ display: "flex", gap: 2, marginBottom: 16, overflowX: "auto" }}>
          {JOB_STAGES.map((s, i) => {
            const stageIdx = JOB_STAGES.findIndex(x => x.id === job.stage);
            const isPast = i < stageIdx;
            const isCurrent = i === stageIdx;
            return (
              <div key={s.id} onClick={() => handleStageChange(s.id)}
                style={{ flex: 1, minWidth: 60, textAlign: "center", cursor: "pointer" }}
                title={`Set stage to ${s.label}`}
              >
                <div style={{ height: 4, borderRadius: 2, background: isPast || isCurrent ? s.color : T.surfaceTop, marginBottom: 4, transition: "background 0.3s" }} />
                <div style={{ fontSize: 9, color: isCurrent ? s.color : isPast ? T.muted : T.dim, fontWeight: isCurrent ? 700 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Quick Info Bar */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 0, padding: "12px 16px", background: T.surfaceHigh, borderRadius: 10, border: `1px solid ${T.border}` }}>
          {quickInfoItems.map((inf, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Ic n={inf.icon} s={13} c={inf.label === "Job Type" ? (isInsurance ? T.orange : T.greenBright) : T.orange} />
              <div>
                <div style={{ fontSize: 10, color: T.dim, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{inf.label}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: inf.label === "Job Type" ? (isInsurance ? T.orange : T.greenBright) : T.text }}>{inf.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 28px" }}>
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 20, overflowX: "auto" }}>
          {visibleTabs.map(t => (
            <div key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "12px 16px", cursor: "pointer", fontSize: 12, fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? T.orange : T.muted,
              borderBottom: `2px solid ${tab === t.id ? T.orange : "transparent"}`,
              marginBottom: -1, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.12s",
            }}>
              <Ic n={t.icon} s={13} c={tab === t.id ? T.orange : T.muted} />
              {t.label}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "overview" && <JobOverviewTab job={job} role={role} />}
        {tab === "claim" && isInsurance && <JobClaimTab job={job} />}
        {tab === "supplements" && isInsurance && <JobSupplementsTab job={job} />}
        {tab === "payments" && <JobPaymentsTab job={job} />}
        {tab === "drying" && <JobDryingTab job={job} />}
        {tab === "photos" && <JobPhotosTab job={job} />}
        {tab === "communication" && <JobCommunicationTab job={job} />}
        {tab === "subcontractors" && <JobSubcontractorsTab job={job} />}
        {tab === "activity" && <JobActivityTab job={job} />}
      </div>
    </div>
  );
};
