import { useState } from "react";
import { T, ROLES, JOB_STAGES, LOSS_TYPES, stageInfo, stageColor } from "@/lib/recon-data";
import { Badge, Btn, Ic } from "@/components/recon/ReconUI";
import { Bubble, BubbleTabs, StatChip, LiveDot, type BubbleTabItem } from "@/components/recon/bubbles";
import { useJobs, type DbJob } from "@/hooks/useJobs";
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

const money = (n: number | null | undefined) =>
  n || n === 0 ? `$${Number(n).toLocaleString()}` : "—";

export const JobDetailPage = ({ job, role, setActive }: JobDetailProps) => {
  const [tab, setTab] = useState("overview");
  const rm = ROLES[role] || ROLES.owner;
  const stage = stageInfo(job.stage);
  const { updateJob } = useJobs();
  const { toast } = useToast();
  const isWater = job.loss_type === "water";
  const isInsurance = job.payment_type === "insurance";
  const [archiving, setArchiving] = useState(false);

  const TAB_CONFIG: BubbleTabItem[] = [
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

  const visibleTabs = TAB_CONFIG.filter((t) => {
    if (t.id === "payments" && !rm.canViewPayments && !rm.canViewInvoices) return false;
    if (t.id === "claim" && !rm.canViewClaims) return false;
    if (t.id === "supplements" && !rm.canViewClaims) return false;
    if (t.id === "subcontractors" && !rm.canManageSubs && role !== "owner") return false;
    return true;
  });

  const stats: { label: string; value: React.ReactNode; icon: string; accent?: string }[] = [
    { label: "Loss Type", value: LOSS_TYPES.find((l) => l.id === job.loss_type)?.label || job.loss_type, icon: "drop" },
    ...(isInsurance
      ? [
          { label: "Carrier", value: job.carrier || "TBD", icon: "shield" },
          { label: "Claim #", value: job.claim_no || "TBD", icon: "note" },
        ]
      : []),
    { label: "PM", value: job.pm_name || "Unassigned", icon: "users" },
    {
      label: "Priority",
      value: (job.priority || "normal").replace(/^\w/, (c) => c.toUpperCase()),
      icon: "alert",
      accent: job.priority === "high" ? T.redBright : T.orange,
    },
    { label: "Date of Loss", value: job.date_of_loss || "TBD", icon: "cal" },
    ...(isWater && job.day_of_drying ? [{ label: "Drying Day", value: `Day ${job.day_of_drying}`, icon: "moisture" }] : []),
    { label: "Next Appt", value: "Not scheduled", icon: "clock", accent: T.cyanBright },
  ];

  const alertCount = (job.moisture_alerts || 0) + (job.priority === "high" ? 1 : 0);

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

  const stageIdx = JOB_STAGES.findIndex((x) => x.id === job.stage);

  return (
    <div style={{ padding: "12px 14px 88px" }}>
      {/* ── Command header ── */}
      <Bubble elevation="md" style={{ padding: 20, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
              <button
                onClick={() => setActive("jobs")}
                aria-label="Back to Jobs"
                className="recon-focusable"
                style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 12, padding: 0, display: "flex", alignItems: "center", gap: 4, borderRadius: 6 }}
              >
                <Ic n="chevR" s={12} c={T.muted} />
                Jobs
              </button>
              <Ic n="chevR" s={12} c={T.dim} />
              <span style={{ fontFamily: "monospace", fontSize: 12, color: T.orange, fontWeight: 700 }}>{job.id}</span>
              {job.priority === "high" && <Badge color="red" small>URGENT</Badge>}
              <Badge color={isInsurance ? "orange" : "green"} small>{isInsurance ? "INSURANCE" : "SELF PAY"}</Badge>
              <Badge color={stageColor[job.stage] || "gray"} dot small>{stage.label}</Badge>
            </div>
            <h1 style={{ fontSize: 23, fontWeight: 800, color: T.text, margin: "0 0 3px", letterSpacing: "-0.02em" }}>{job.customer}</h1>
            <p style={{ margin: 0, color: T.muted, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              <Ic n="map" s={13} c={T.dim} />
              {job.address}
            </p>
          </div>

          {/* Quick actions */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {alertCount > 0 && (
              <div className="recon-capsule" style={{ padding: "6px 12px" }}>
                <LiveDot color={T.redBright} />
                <span style={{ fontSize: 12, fontWeight: 700, color: T.redBright }}>
                  {alertCount} alert{alertCount === 1 ? "" : "s"}
                </span>
              </div>
            )}
            {rm.canDeleteJobs && (
              <Btn v="danger" sz="sm" onClick={handleArchive} disabled={archiving}>
                {archiving ? "…" : "Archive"}
              </Btn>
            )}
          </div>
        </div>

        {/* Financial summary + stat grid */}
        {rm.canViewInvoices && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
            {[
              { label: "Contract", value: money(job.contract_value) },
              { label: "Mitigation", value: money(job.mitigation_value) },
              ...(job.recon ? [{ label: "Reconstruction", value: money(job.recon_value) }] : []),
            ].map((f) => (
              <div
                key={f.label}
                className="recon-capsule"
                style={{ padding: "8px 14px", flexDirection: "column", alignItems: "flex-start", gap: 2 }}
              >
                <span style={{ fontSize: 9.5, color: T.dim, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: T.text }}>{f.value}</span>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 14,
            marginTop: 16,
            paddingTop: 16,
            borderTop: `1px solid ${T.border}`,
          }}
        >
          {stats.map((s) => (
            <StatChip key={s.label} label={s.label} value={s.value} icon={s.icon} accent={s.accent} />
          ))}
        </div>
      </Bubble>

      {/* ── Stage tracker ── */}
      <Bubble elevation="sm" style={{ padding: "14px 18px", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 3, overflowX: "auto" }}>
          {JOB_STAGES.map((s, i) => {
            const isPast = i < stageIdx;
            const isCurrent = i === stageIdx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleStageChange(s.id)}
                title={`Set stage to ${s.label}`}
                aria-label={`Set stage to ${s.label}`}
                aria-current={isCurrent ? "step" : undefined}
                className="recon-focusable"
                style={{ flex: 1, minWidth: 64, textAlign: "center", cursor: "pointer", background: "none", border: "none", padding: 2, borderRadius: 8, fontFamily: "inherit" }}
              >
                <div
                  style={{
                    height: 5,
                    borderRadius: 999,
                    background: isPast || isCurrent ? s.color : T.surfaceTop,
                    marginBottom: 5,
                    transition: "background 0.3s var(--ease-soft)",
                  }}
                />
                <div
                  style={{
                    fontSize: 9,
                    color: isCurrent ? s.color : isPast ? T.muted : T.dim,
                    fontWeight: isCurrent ? 700 : 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {s.label}
                </div>
              </button>
            );
          })}
        </div>
      </Bubble>

      {/* ── Bubble tabs ── */}
      <div style={{ marginBottom: 16 }}>
        <BubbleTabs tabs={visibleTabs} active={tab} onChange={setTab} ariaLabel="Job file sections" />
      </div>

      {/* ── Tab content ── */}
      <div role="tabpanel">
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
