import { useState, useCallback } from "react";
import { T, ROLES, JOB_STAGES, stageInfo, stageColor } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Divider } from "@/components/recon/ReconUI";
import { useJobs, useActivityLogs, useClaims, usePayments, useSupplements, useSubcontractors, useDryingLogs, type DbJob } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { DndContext, DragOverlay, useDroppable, useDraggable, PointerSensor, TouchSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  role: string;
  setActive: (id: string) => void;
  setSelectedJob: (job: DbJob) => void;
  onNewJob?: () => void;
}

/* ─── Quick Start Checklist ─── */
const QuickStartChecklist = ({ setActive, jobs, onNewJob }: { setActive: (id: string) => void; jobs: DbJob[]; onNewJob?: () => void }) => {
  const { profile } = useAuth();
  const steps = [
    { id: "company", label: "Set up company profile", desc: "Configure your company details and branding", done: !!profile?.company_id, action: "settings", icon: "cog" },
    { id: "first_job", label: "Create your first job", desc: "Add a restoration job to start tracking", done: jobs.length > 0, action: "new_job", icon: "jobs" },
    { id: "team", label: "Invite your team", desc: "Add project managers, techs, and office staff", done: false, action: "team", icon: "users" },
    { id: "subs", label: "Add subcontractors", desc: "Register your trade partners for job assignments", done: false, action: "subcontractors", icon: "truck" },
    { id: "claim", label: "Track a claim", desc: "Add insurance info to a job to start tracking claims", done: jobs.some(j => j.carrier && j.claim_no), action: "claims", icon: "shield" },
    { id: "drying", label: "Log drying data", desc: "Record moisture readings for water damage jobs", done: false, action: "mitigation", icon: "moisture" },
  ];
  const completedCount = steps.filter(s => s.done).length;
  if (completedCount === steps.length) return null;

  return (
    <Card style={{ marginBottom: 20, borderColor: `${T.orange}33`, background: T.surface }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Quick Start Guide</div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Complete these steps to get the most out of ReCon Pro</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.orange }}>{completedCount}/{steps.length}</div>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${T.surfaceHigh}`, position: "relative" }}>
            <svg width="40" height="40" style={{ position: "absolute", top: -3, left: -3, transform: "rotate(-90deg)" }}>
              <circle cx="20" cy="20" r="17" fill="none" stroke={T.orange} strokeWidth="3" strokeDasharray={`${(completedCount / steps.length) * 107} 107`} strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {steps.map(s => (
          <div key={s.id} onClick={() => { if (!s.done) { s.action === "new_job" && onNewJob ? onNewJob() : setActive(s.action); } }} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
            background: s.done ? T.greenDim : T.surfaceHigh, borderRadius: 8,
            border: `1px solid ${s.done ? T.greenBright + "33" : T.border}`,
            cursor: s.done ? "default" : "pointer", transition: "all 0.15s",
          }}
            onMouseEnter={e => { if (!s.done) (e.currentTarget as HTMLDivElement).style.borderColor = T.orange + "55"; }}
            onMouseLeave={e => { if (!s.done) (e.currentTarget as HTMLDivElement).style.borderColor = T.border; }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
              background: s.done ? T.greenBright : T.orangeDim, color: s.done ? "#fff" : T.orange, fontSize: 11, fontWeight: 700, flexShrink: 0,
            }}>
              {s.done ? "✓" : <Ic n={s.icon} s={14} c={T.orange} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: s.done ? T.greenBright : T.white, fontWeight: 600, textDecoration: s.done ? "line-through" : "none" }}>{s.label}</div>
              <div style={{ fontSize: 10, color: T.dim, marginTop: 1 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ─── Demo Banner ─── */
const DemoBanner = ({ jobs }: { jobs: DbJob[] }) => {
  const isDemo = jobs.some(j => j.id?.startsWith("DEMO-"));
  if (!isDemo) return null;
  return (
    <div style={{ background: `linear-gradient(90deg, ${T.orangeDim}, transparent)`, border: `1px solid ${T.orange}33`, borderRadius: 8, padding: "8px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
      <Ic n="star" s={14} c={T.orange}/>
      <span style={{ fontSize: 12, color: T.orange, fontWeight: 600 }}>Demo Workspace</span>
      <span style={{ fontSize: 11, color: T.muted }}>You're viewing sample data. Create real jobs anytime — demo data won't interfere.</span>
    </div>
  );
};

/* ─── Empty State Welcome ─── */
const WelcomeDashboard = ({ onNewJob }: { onNewJob?: () => void }) => (
  <div>
    <div style={{ background: `linear-gradient(135deg, ${T.orangeDim}, ${T.surface})`, border: `1px solid ${T.orange}22`, borderRadius: 14, padding: "36px 32px", textAlign: "center", marginBottom: 24 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: T.orangeDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}><Ic n="jobs" s={24} c={T.orange}/></div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: T.white, margin: "0 0 8px", letterSpacing: "-0.02em" }}>Welcome to ReCon Pro</h2>
      <p style={{ fontSize: 14, color: T.muted, margin: "0 0 6px", maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
        The all-in-one command center for restoration companies. Manage jobs, insurance claims, drying logs, supplements, payments, and subcontractors — all in one place.
      </p>
      <div style={{ marginTop: 20 }}><Btn v="primary" icon="plus" onClick={onNewJob}>Create Your First Job</Btn></div>
    </div>
    <div className="dashboard-welcome-grid" style={{ marginBottom: 20 }}>
      {[
        { icon: "jobs", title: "Job Pipeline", desc: "Track every restoration project from lead to close with a visual stage-based workflow.", color: T.orange },
        { icon: "shield", title: "Insurance Tracking", desc: "Log claim status, carrier responses, and supplement approvals for insurance jobs.", color: T.blueBright },
        { icon: "moisture", title: "Drying Logs", desc: "Internal moisture reference logs. Track GPP, room-by-room status, and equipment.", color: T.tealBright },
        { icon: "est", title: "Supplements", desc: "Compare contractor vs. carrier estimates. Identify missing items and pricing gaps.", color: T.purpleBright },
        { icon: "dollar", title: "Payment Tracking", desc: "Track insurance payments, deductibles, mortgage holds, and recoverable depreciation.", color: T.greenBright },
        { icon: "truck", title: "Subcontractors", desc: "Manage trade partners, assign them to jobs, and track completion status.", color: T.yellowBright },
      ].map((f, i) => (
        <Card key={i} style={{ padding: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: f.color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}><Ic n={f.icon} s={16} c={f.color} /></div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.white, marginBottom: 4 }}>{f.title}</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{f.desc}</div>
        </Card>
      ))}
    </div>
  </div>
);

/* ─── Metric Card ─── */
const MetricCard = ({ label, value, icon, color, onClick, subtitle }: { label: string; value: string | number; icon: string; color: string; onClick: () => void; subtitle?: string }) => (
  <div onClick={onClick} style={{
    background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 16px",
    cursor: "pointer", transition: "all 0.15s", position: "relative", overflow: "hidden",
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = color + "55"; e.currentTarget.style.transform = "translateY(-1px)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "translateY(0)"; }}
  >
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color, opacity: 0.6 }} />
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
      <div style={{ width: 26, height: 26, borderRadius: 7, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Ic n={icon} s={13} c={color} />
      </div>
      <span style={{ fontSize: 10, color: T.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
    </div>
    <div style={{ fontSize: 24, fontWeight: 800, color: T.white, lineHeight: 1 }}>{value}</div>
    {subtitle && <div style={{ fontSize: 10, color: T.dim, marginTop: 4 }}>{subtitle}</div>}
  </div>
);

/* ─── Attention Item ─── */
const AttentionItem = ({ icon, color, title, desc, action, actionLabel }: { icon: string; color: string; title: string; desc: string; action: () => void; actionLabel: string }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
    background: color + "08", border: `1px solid ${color}22`, borderRadius: 8,
    transition: "all 0.15s",
  }}>
    <div style={{ width: 30, height: 30, borderRadius: 7, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Ic n={icon} s={14} c={color} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.white }}>{title}</div>
      <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{desc}</div>
    </div>
    <button onClick={action} style={{
      background: "none", border: `1px solid ${color}33`, borderRadius: 6, padding: "4px 10px",
      fontSize: 10, color: color, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
    }}>{actionLabel}</button>
  </div>
);

/* ─── Draggable Job Card ─── */
const DraggableJobCard = ({ job, stageColor: sc, onJobClick }: { job: DbJob; stageColor: string; onJobClick: (j: DbJob) => void }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: job.id });
  const style: React.CSSProperties = {
    background: T.surfaceHigh, border: `1px solid ${isDragging ? sc : T.border}`, borderRadius: 7, padding: "8px 10px",
    cursor: "grab", transition: isDragging ? "none" : "all 0.12s", borderLeft: `3px solid ${sc}`,
    opacity: isDragging ? 0.4 : 1,
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    touchAction: "none",
  };
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} onClick={(e) => { if (!isDragging) { e.stopPropagation(); onJobClick(job); } }}>
      <div style={{ fontSize: 10, fontFamily: "monospace", color: T.orange, fontWeight: 700, marginBottom: 2 }}>{job.id}</div>
      <div style={{ fontSize: 11, color: T.text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.customer}</div>
      {job.priority === "high" && (
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 3 }}>
          <Ic n="alert" s={9} c={T.redBright} />
          <span style={{ fontSize: 9, color: T.redBright, fontWeight: 600 }}>Urgent</span>
        </div>
      )}
    </div>
  );
};

/* ─── Drag Overlay Card (what you see while dragging) ─── */
const DragOverlayCard = ({ job }: { job: DbJob }) => {
  const stage = JOB_STAGES.find(s => s.id === job.stage);
  return (
    <div style={{
      background: T.surfaceHigh, border: `2px solid ${T.orange}`, borderRadius: 7, padding: "8px 10px",
      borderLeft: `3px solid ${stage?.color || T.orange}`, boxShadow: `0 8px 24px rgba(0,0,0,0.4)`,
      width: 150, cursor: "grabbing",
    }}>
      <div style={{ fontSize: 10, fontFamily: "monospace", color: T.orange, fontWeight: 700, marginBottom: 2 }}>{job.id}</div>
      <div style={{ fontSize: 11, color: T.text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.customer}</div>
    </div>
  );
};

/* ─── Droppable Pipeline Column ─── */
const PipelineColumn = ({ stage, jobs, onJobClick, dragOverStage }: { stage: typeof JOB_STAGES[number]; jobs: DbJob[]; onJobClick: (j: DbJob) => void; dragOverStage?: string | null }) => {
  const stageJobs = jobs.filter(j => j.stage === stage.id);
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const isHighlighted = isOver || dragOverStage === stage.id;
  return (
    <div ref={setNodeRef} style={{
      minWidth: 150, flex: "0 0 150px",
      background: isHighlighted ? stage.color + "12" : "transparent",
      borderRadius: 8, padding: 4, transition: "background 0.15s",
      border: isHighlighted ? `1px dashed ${stage.color}55` : "1px dashed transparent",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, padding: "0 4px" }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: stage.color }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>{stage.label}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: stage.color, marginLeft: "auto" }}>{stageJobs.length}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minHeight: 60 }}>
        {stageJobs.length === 0 && (
          <div style={{ padding: "12px 8px", borderRadius: 6, border: `1px dashed ${isHighlighted ? stage.color + "55" : T.border}`, textAlign: "center" }}>
            <span style={{ fontSize: 10, color: isHighlighted ? stage.color : T.dim }}>{isHighlighted ? "Drop here" : "No jobs"}</span>
          </div>
        )}
        {stageJobs.slice(0, 5).map(j => (
          <DraggableJobCard key={j.id} job={j} stageColor={stage.color} onJobClick={onJobClick} />
        ))}
        {stageJobs.length > 5 && (
          <div style={{ textAlign: "center", fontSize: 10, color: T.dim, padding: 4 }}>+{stageJobs.length - 5} more</div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════ */
export const DashboardPage = ({ role, setActive, setSelectedJob, onNewJob }: DashboardProps) => {
  const rm = ROLES[role] || ROLES.owner;
  const { jobs, loading, updateJob } = useJobs();
  const { logs: activityLogs } = useActivityLogs();
  const { payments } = usePayments();
  const { supplements } = useSupplements();
  const { logs: dryingLogs } = useDryingLogs();
  const { toast } = useToast();
  const [draggingJob, setDraggingJob] = useState<DbJob | null>(null);

  // DnD sensors — require 8px movement to start drag (allows clicks through)
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 8 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } });
  const sensors = useSensors(pointerSensor, touchSensor);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const job = jobs.find(j => j.id === event.active.id);
    if (job) setDraggingJob(job);
  }, [jobs]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    setDraggingJob(null);
    const { active, over } = event;
    if (!over) return;
    const jobId = active.id as string;
    const newStage = over.id as string;
    const job = jobs.find(j => j.id === jobId);
    if (!job || job.stage === newStage) return;
    const stageName = JOB_STAGES.find(s => s.id === newStage)?.label || newStage;
    const ok = await updateJob(jobId, { stage: newStage } as any);
    if (ok) {
      toast({ title: "Job moved", description: `${jobId} → ${stageName}` });
    }
  }, [jobs, updateJob, toast]);

  // ─── Computed metrics ───
  const activeJobs = jobs.filter(j => !["closed"].includes(j.stage));
  const awaitingApproval = jobs.filter(j => ["estimate_submitted", "carrier_approval"].includes(j.stage));
  const mitigationJobs = jobs.filter(j => ["mitigation", "drying"].includes(j.stage));
  const reconJobs = jobs.filter(j => ["recon_scheduled", "reconstruction"].includes(j.stage));
  const supplementPending = supplements.filter((s: any) => ["submitted", "under_review"].includes(s.status));
  const closedThisMonth = (() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return jobs.filter(j => j.stage === "closed" && new Date(j.updated_at) >= monthStart);
  })();
  const totalRevenue = jobs.reduce((a, b) => a + (b.contract_value || 0), 0);
  const totalPaid = payments.reduce((a: number, p: any) => a + (p.amount || 0), 0);
  const outstanding = totalRevenue - totalPaid;
  const monthlyRevenue = (() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return payments.filter((p: any) => new Date(p.created_at) >= monthStart).reduce((a: number, p: any) => a + (p.amount || 0), 0);
  })();

  // ─── Attention items ───
  const attentionItems: { icon: string; color: string; title: string; desc: string; page: string; label: string }[] = [];

  if (supplementPending.length > 0)
    attentionItems.push({ icon: "est", color: T.purpleBright, title: `${supplementPending.length} supplement${supplementPending.length > 1 ? "s" : ""} awaiting response`, desc: "Carrier has not responded to submitted supplements", page: "supplements", label: "View" });

  const jobsMissingDocs = jobs.filter(j => !j.notes && !j.scope_notes && activeJobs.some(a => a.id === j.id));
  if (jobsMissingDocs.length > 0)
    attentionItems.push({ icon: "note", color: T.yellowBright, title: `${jobsMissingDocs.length} job${jobsMissingDocs.length > 1 ? "s" : ""} missing documentation`, desc: "Jobs without scope notes or descriptions", page: "jobs", label: "Review" });

  if (outstanding > 0 && rm.canViewPayments)
    attentionItems.push({ icon: "dollar", color: T.redBright, title: `$${(outstanding / 1000).toFixed(1)}K in outstanding balances`, desc: "Payments pending collection from carriers or homeowners", page: "payments", label: "View" });

  const dryingNeedingReadings = mitigationJobs.filter(j => {
    const jobLogs = dryingLogs.filter((l: any) => l.job_id === j.id);
    if (jobLogs.length === 0) return true;
    const latest = jobLogs.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    const hoursSince = (Date.now() - new Date(latest.created_at).getTime()) / 3600000;
    return hoursSince > 24;
  });
  if (dryingNeedingReadings.length > 0)
    attentionItems.push({ icon: "moisture", color: T.blueBright, title: `${dryingNeedingReadings.length} drying job${dryingNeedingReadings.length > 1 ? "s" : ""} need new readings`, desc: "No moisture readings logged in the last 24 hours", page: "mitigation", label: "Log" });

  const urgentJobs = jobs.filter(j => j.priority === "high" && j.stage !== "closed");
  if (urgentJobs.length > 0)
    attentionItems.push({ icon: "alert", color: T.redBright, title: `${urgentJobs.length} urgent job${urgentJobs.length > 1 ? "s" : ""} flagged`, desc: urgentJobs.map(j => `${j.id} – ${j.customer}`).join(", "), page: "jobs", label: "View" });

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const handleJobClick = (j: DbJob) => { setSelectedJob(j); setActive("job_detail"); };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: T.muted }}><div style={{ fontSize: 14 }}>Loading dashboard...</div></div>;
  }

  return (
    <div style={{ padding: "0 0 40px" }}>
      {/* Header */}
      <div style={{ padding: "24px 28px 0", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: T.white, margin: 0, letterSpacing: "-0.02em" }}>Command Center</h1>
            <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>{dateStr}</p>
          </div>
          {jobs.length > 0 && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Btn v="primary" sz="sm" icon="plus" onClick={onNewJob}>New Job</Btn>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "0 28px" }}>
        <DemoBanner jobs={jobs} />

        {jobs.length === 0 ? (
          <>
            {role === "owner" && <QuickStartChecklist setActive={setActive} jobs={jobs} onNewJob={onNewJob} />}
            <WelcomeDashboard onNewJob={onNewJob} />
          </>
        ) : (
          <>
            {role === "owner" && <QuickStartChecklist setActive={setActive} jobs={jobs} onNewJob={onNewJob} />}

            {/* ═══ ZONE 1: COMPANY OVERVIEW ═══ */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px,1fr))", gap: 10, marginBottom: 20 }}>
              <MetricCard label="Active Jobs" value={activeJobs.length} icon="jobs" color={T.orange} onClick={() => setActive("jobs")} subtitle={`${jobs.length} total`} />
              <MetricCard label="Awaiting Approval" value={awaitingApproval.length} icon="clock" color={T.yellowBright} onClick={() => setActive("claims")} subtitle="Carrier response pending" />
              <MetricCard label="In Mitigation" value={mitigationJobs.length} icon="moisture" color={T.blueBright} onClick={() => setActive("mitigation")} subtitle={mitigationJobs.length > 0 ? `${mitigationJobs.filter(j => j.day_of_drying).length} with drying logs` : "No active drying"} />
              <MetricCard label="Reconstruction" value={reconJobs.length} icon="tool" color={T.tealBright} onClick={() => setActive("jobs")} subtitle={reconJobs.length > 0 ? reconJobs.map(j => j.id).slice(0, 2).join(", ") : "None scheduled"} />
              <MetricCard label="Supplements Pending" value={supplementPending.length} icon="est" color={T.purpleBright} onClick={() => setActive("supplements")} subtitle={supplementPending.length > 0 ? "Awaiting carrier" : "All resolved"} />
              {rm.canViewPayments && (
                <MetricCard label="Outstanding" value={outstanding > 0 ? `$${(outstanding / 1000).toFixed(1)}K` : "$0"} icon="dollar" color={outstanding > 0 ? T.redBright : T.greenBright} onClick={() => setActive("payments")} subtitle="Unpaid balance" />
              )}
              {rm.canSeeProfitMargins && (
                <MetricCard label="Revenue (Month)" value={monthlyRevenue > 0 ? `$${(monthlyRevenue / 1000).toFixed(1)}K` : "$0"} icon="chart" color={T.greenBright} onClick={() => setActive("reports")} subtitle={`$${(totalPaid / 1000).toFixed(0)}K total collected`} />
              )}
              <MetricCard label="Completed (Month)" value={closedThisMonth.length} icon="check" color={T.greenBright} onClick={() => setActive("jobs")} subtitle="Jobs closed this month" />
            </div>

            {/* ═══ ZONE 2: JOB PIPELINE (Drag & Drop) ═══ */}
            <Card style={{ marginBottom: 20, padding: "16px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: T.white }}>Job Pipeline</span>
                  <span style={{ fontSize: 10, color: T.dim, fontWeight: 500 }}>Drag to move</span>
                </div>
                <Btn v="ghost" sz="sm" onClick={() => setActive("jobs")}>View All →</Btn>
              </div>
              {/* Stage progress bar */}
              <div style={{ display: "flex", gap: 2, height: 5, borderRadius: 3, overflow: "hidden", margin: "0 16px 14px" }}>
                {JOB_STAGES.map(s => {
                  const cnt = jobs.filter(j => j.stage === s.id).length;
                  const pct = jobs.length > 0 ? (cnt / jobs.length) * 100 : 0;
                  return cnt > 0 ? <div key={s.id} style={{ flex: pct, background: s.color, minWidth: 3, borderRadius: 2 }} title={`${s.label}: ${cnt}`}/> : null;
                })}
              </div>
              {/* Horizontal scrolling pipeline with DnD */}
              <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div style={{ overflowX: "auto", padding: "0 16px", WebkitOverflowScrolling: "touch" }}>
                  <div style={{ display: "flex", gap: 10, minWidth: "max-content", paddingBottom: 4 }}>
                    {JOB_STAGES.map(s => (
                      <PipelineColumn key={s.id} stage={s} jobs={jobs} onJobClick={handleJobClick} />
                    ))}
                  </div>
                </div>
                <DragOverlay>
                  {draggingJob ? <DragOverlayCard job={draggingJob} /> : null}
                </DragOverlay>
              </DndContext>
            </Card>

            {/* ═══ ZONE 3 & 4: ATTENTION + ACTIVITY side by side ═══ */}
            <div className="dashboard-two-col" style={{ marginBottom: 20, ...(attentionItems.length === 0 ? { gridTemplateColumns: "1fr" } : {}) }}>
              {/* Attention Required */}
              {attentionItems.length > 0 && (
                <Card>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: T.redBright + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Ic n="alert" s={13} c={T.redBright} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: T.white }}>Attention Required</div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: T.redBright, background: T.redBright + "18", padding: "2px 7px", borderRadius: 10 }}>{attentionItems.length}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {attentionItems.map((item, i) => (
                      <AttentionItem key={i} icon={item.icon} color={item.color} title={item.title} desc={item.desc} action={() => setActive(item.page)} actionLabel={item.label} />
                    ))}
                  </div>
                </Card>
              )}

              {/* Recent Activity */}
              <Card>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: T.blueBright + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Ic n="clock" s={13} c={T.blueBright} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: T.white }}>Recent Activity</div>
                </div>
                {activityLogs.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 24, color: T.dim, fontSize: 12 }}>
                    Activity will appear here as you manage jobs, log drying data, and track claims.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {activityLogs.slice(0, 10).map((log: any, i: number) => {
                      const actionIcons: Record<string, string> = {
                        status_change: "est", note: "note", payment: "dollar", photo: "photo", drying: "drop",
                      };
                      const actionColors: Record<string, string> = {
                        status_change: T.orange, note: T.blueBright, payment: T.greenBright, photo: T.purpleBright, drying: T.tealBright,
                      };
                      const timeAgo = (() => {
                        const diff = Date.now() - new Date(log.created_at).getTime();
                        const mins = Math.floor(diff / 60000);
                        if (mins < 60) return `${mins}m ago`;
                        const hrs = Math.floor(mins / 60);
                        if (hrs < 24) return `${hrs}h ago`;
                        const days = Math.floor(hrs / 24);
                        return `${days}d ago`;
                      })();
                      return (
                        <div key={log.id} style={{
                          display: "flex", gap: 10, padding: "8px 0",
                          borderBottom: i < 9 ? `1px solid ${T.border}15` : "none",
                          cursor: log.job_id ? "pointer" : "default",
                        }}
                          onClick={() => {
                            if (log.job_id) {
                              const job = jobs.find(j => j.id === log.job_id);
                              if (job) handleJobClick(job);
                            }
                          }}
                        >
                          <div style={{
                            width: 24, height: 24, borderRadius: 6,
                            background: (actionColors[log.action_type] || T.muted) + "15",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
                          }}>
                            <Ic n={actionIcons[log.action_type] || "est"} s={11} c={actionColors[log.action_type] || T.muted}/>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{log.title}</div>
                            {log.description && <div style={{ fontSize: 11, color: T.muted, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{log.description}</div>}
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: 10, color: T.dim }}>{timeAgo}</div>
                            {log.user_name && <div style={{ fontSize: 9, color: T.dim, marginTop: 2 }}>{log.user_name}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>

            {/* ═══ Bottom row: Revenue + Carriers (for owners) ═══ */}
            {rm.canSeeProfitMargins && (
              <div className="dashboard-two-col">
                <Card>
                  <div style={{ fontWeight: 700, fontSize: 14, color: T.white, marginBottom: 12 }}>Revenue Breakdown</div>
                  {[
                    ["Mitigation", jobs.filter(j => j.mitigation_value).reduce((a, b) => a + (b.mitigation_value || 0), 0), T.blueBright],
                    ["Reconstruction", jobs.filter(j => j.recon_value).reduce((a, b) => a + (b.recon_value || 0), 0), T.tealBright],
                    ["Contract Total", totalRevenue, T.orange],
                    ["Collected", totalPaid, T.greenBright],
                  ].filter(([, v]) => (v as number) > 0).map(([label, value, color]) => (
                    <div key={label as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color as string }} />
                        <span style={{ fontSize: 12, color: T.muted }}>{label as string}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.white }}>${((value as number) / 1000).toFixed(1)}K</span>
                    </div>
                  ))}
                  {totalRevenue === 0 && (
                    <div style={{ textAlign: "center", color: T.dim, padding: 16, fontSize: 12 }}>Add contract values to jobs to see revenue breakdown</div>
                  )}
                </Card>
                <Card>
                  <div style={{ fontWeight: 700, fontSize: 14, color: T.white, marginBottom: 10 }}>Top Carriers</div>
                  {(() => {
                    const carriers = jobs.filter(j => j.carrier?.trim() && j.payment_type === "insurance").reduce((acc, j) => {
                      const c = j.carrier || "Unknown";
                      acc[c] = (acc[c] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);
                    const entries = Object.entries(carriers).sort((a, b) => b[1] - a[1]).slice(0, 5);
                    if (entries.length === 0) return <div style={{ textAlign: "center", color: T.dim, padding: 16, fontSize: 12 }}>Carrier data appears when jobs have insurance assigned</div>;
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
          </>
        )}
      </div>
    </div>
  );
};
