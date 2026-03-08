import { useState } from "react";
import { T, JOB_STAGES, ROLES } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Inp, Sel } from "@/components/recon/ReconUI";
import { toast } from "@/hooks/use-toast";

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  triggerDesc: string;
  actions: { type: string; desc: string }[];
  enabled: boolean;
  category: "job_lifecycle" | "communication" | "financial" | "quality" | "scheduling";
  lastTriggered?: string;
  triggerCount: number;
}

const INITIAL_RULES: AutomationRule[] = [
  {
    id: "ar-1", name: "Dry-Out Complete → Prompt Recon Review",
    trigger: "all_rooms_dry", triggerDesc: "When all moisture readings hit dry standard on a water damage job",
    actions: [
      { type: "stage_change", desc: "Move job stage to 'Mitigation Complete'" },
      { type: "notify", desc: "Notify Project Manager to begin reconstruction review" },
      { type: "task_create", desc: "Create task: 'Submit recon estimate within 48 hours'" },
      { type: "notify_adjuster", desc: "Send adjuster notification: drying complete, final drying report attached" },
    ],
    enabled: true, category: "job_lifecycle", lastTriggered: "Mar 6 — J-1048", triggerCount: 3,
  },
  {
    id: "ar-2", name: "No Job Activity in 3 Days → Alert Manager",
    trigger: "inactivity_3d", triggerDesc: "When a job has no notes, photos, readings, or status changes for 3+ days",
    actions: [
      { type: "notify", desc: "Alert assigned PM and Owner via push notification" },
      { type: "task_create", desc: "Create task: 'Review stalled job — no activity in 3 days'" },
      { type: "flag", desc: "Add 'Stalled' flag to job card in pipeline view" },
    ],
    enabled: true, category: "quality", lastTriggered: "Mar 7 — J-1049", triggerCount: 5,
  },
  {
    id: "ar-3", name: "Supplement Approved → Update Projected Margin",
    trigger: "supplement_approved", triggerDesc: "When a supplement status changes to 'Approved' on any estimate",
    actions: [
      { type: "financial", desc: "Update job contract value with approved supplement amount" },
      { type: "financial", desc: "Recalculate projected gross margin for the job" },
      { type: "notify", desc: "Notify PM and Accounting: supplement approved, new job total updated" },
      { type: "task_create", desc: "Create task: 'Issue updated invoice within 5 business days'" },
    ],
    enabled: true, category: "financial", lastTriggered: "Mar 5 — J-1050 (+$2,400)", triggerCount: 7,
  },
  {
    id: "ar-4", name: "New Job Created → Assign Initial Tasks",
    trigger: "job_created", triggerDesc: "When a new job is created in the system",
    actions: [
      { type: "task_create", desc: "Create: 'Complete initial site assessment within 24 hours'" },
      { type: "task_create", desc: "Create: 'Upload pre-loss / initial damage photos'" },
      { type: "task_create", desc: "Create: 'Obtain signed Work Authorization / AOB'" },
      { type: "task_create", desc: "Create: 'Verify insurance carrier and adjuster contact info'" },
      { type: "notify", desc: "Notify PM of new assignment" },
    ],
    enabled: true, category: "job_lifecycle", triggerCount: 12,
  },
  {
    id: "ar-5", name: "Estimate Submitted → Follow-Up Every 48 Hours",
    trigger: "estimate_submitted", triggerDesc: "When an Xactimate estimate is submitted to insurance",
    actions: [
      { type: "schedule", desc: "Create recurring follow-up task every 48 hours" },
      { type: "notify", desc: "Remind PM to follow up with adjuster" },
      { type: "template_msg", desc: "Draft follow-up email template for adjuster" },
    ],
    enabled: true, category: "communication", lastTriggered: "Mar 4 — J-1051", triggerCount: 18,
  },
  {
    id: "ar-6", name: "Material Selections Missing → Notify Customer & Coordinator",
    trigger: "selections_pending_7d", triggerDesc: "When material selections have been pending for 7+ days with no response",
    actions: [
      { type: "notify_customer", desc: "Send customer reminder: selections needed to proceed" },
      { type: "notify", desc: "Alert coordinator: customer selections overdue" },
      { type: "flag", desc: "Flag job as 'Waiting on Customer'" },
    ],
    enabled: true, category: "communication", triggerCount: 4,
  },
  {
    id: "ar-7", name: "Invoice Unpaid 30+ Days → Collections Workflow",
    trigger: "invoice_aging_30d", triggerDesc: "When an invoice remains unpaid for 30+ days",
    actions: [
      { type: "notify", desc: "Alert Accounting and Owner" },
      { type: "template_msg", desc: "Generate collections letter template" },
      { type: "task_create", desc: "Create task: 'Follow up on aging receivable'" },
      { type: "flag", desc: "Mark invoice as 'Collections'" },
    ],
    enabled: true, category: "financial", triggerCount: 2,
  },
  {
    id: "ar-8", name: "Cabinet Install Scheduled → Queue Countertop Template",
    trigger: "cabinet_install_scheduled", triggerDesc: "When cabinet installation is scheduled on any recon job",
    actions: [
      { type: "task_create", desc: "Create task: 'Schedule countertop template 3 days after cabinet install'" },
      { type: "schedule", desc: "Auto-create countertop template event linked to cabinet completion" },
      { type: "notify", desc: "Notify PM of dependency chain update" },
    ],
    enabled: true, category: "scheduling", triggerCount: 1,
  },
  {
    id: "ar-9", name: "Mitigation Day 3 → Check Drying Progress",
    trigger: "drying_day_3", triggerDesc: "When a water damage job reaches Day 3 of drying",
    actions: [
      { type: "notify", desc: "Notify PM to review drying progress" },
      { type: "task_create", desc: "Create: 'Evaluate if equipment adjustments needed'" },
      { type: "check", desc: "Auto-compare readings to Day 1 — flag if insufficient progress" },
    ],
    enabled: true, category: "quality", triggerCount: 8,
  },
  {
    id: "ar-10", name: "Job Complete → Customer Satisfaction Survey",
    trigger: "job_closed", triggerDesc: "When a job is marked as Paid / Closed",
    actions: [
      { type: "notify_customer", desc: "Send customer satisfaction survey via email" },
      { type: "task_create", desc: "Create: 'Request Google review from customer'" },
      { type: "schedule", desc: "Schedule 30-day follow-up call" },
    ],
    enabled: false, category: "communication", triggerCount: 0,
  },
];

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  job_lifecycle: { label: "Job Lifecycle", color: T.orange, icon: "jobs" },
  communication: { label: "Communication", color: T.blueBright, icon: "msg" },
  financial: { label: "Financial", color: T.greenBright, icon: "dollar" },
  quality: { label: "Quality Control", color: T.purpleBright, icon: "shield" },
  scheduling: { label: "Scheduling", color: T.tealBright, icon: "cal" },
};

export const AutomationPage = ({ role }: { role: string }) => {
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [showNewRule, setShowNewRule] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const rm = ROLES[role];

  const filtered = filterCat === "all" ? rules : rules.filter(r => r.category === filterCat);
  const totalTriggers = rules.reduce((a, r) => a + r.triggerCount, 0);
  const activeRules = rules.filter(r => r.enabled).length;

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, enabled: !r.enabled };
      toast({
        title: updated.enabled ? "✅ Automation enabled" : "⏸ Automation paused",
        description: r.name,
      });
      return updated;
    }));
  };

  const runManual = (rule: AutomationRule) => {
    toast({
      title: "⚡ Manual trigger executed",
      description: `"${rule.name}" — checking all jobs for matching conditions...`,
    });
    // Simulate finding matches
    setTimeout(() => {
      const matchCount = Math.floor(Math.random() * 3) + 1;
      toast({
        title: `Found ${matchCount} matching job${matchCount > 1 ? "s" : ""}`,
        description: `Actions executed for ${matchCount} job${matchCount > 1 ? "s" : ""}. Check job files for updates.`,
      });
      setRules(prev => prev.map(r => r.id === rule.id ? { ...r, triggerCount: r.triggerCount + matchCount, lastTriggered: "Just now" } : r));
    }, 1500);
  };

  const ACTIVITY_LOG = [
    { time: "10:45 AM", date: "Mar 8", rule: "No Job Activity in 3 Days", job: "J-1049", result: "Alert sent to Tyler Nguyen — Chen mold estimate pending" },
    { time: "9:30 AM", date: "Mar 8", rule: "Mitigation Day 3 → Check Progress", job: "J-1046", result: "Day 1 of Cat 3 drying — monitoring initiated" },
    { time: "8:00 AM", date: "Mar 8", rule: "Estimate Submitted → Follow-Up", job: "J-1051", result: "48-hour follow-up reminder created for State Farm adjuster" },
    { time: "4:15 PM", date: "Mar 7", rule: "Supplement Approved → Update Margin", job: "J-1050", result: "Contract updated from $66,000 to $68,400 (+$2,400 supplement)" },
    { time: "2:30 PM", date: "Mar 7", rule: "Dry-Out Complete → Recon Review", job: "J-1048", result: "Moved to 'Mitigation Complete' → Invoiced. Drying report auto-generated." },
    { time: "11:00 AM", date: "Mar 6", rule: "Material Selections Missing", job: "J-1050", result: "Customer reminder sent — cabinet/countertop selections needed" },
    { time: "9:00 AM", date: "Mar 5", rule: "New Job Created → Assign Tasks", job: "J-1047", result: "5 initial tasks created, PM Tyler Nguyen notified" },
    { time: "3:00 PM", date: "Mar 4", rule: "Estimate Submitted → Follow-Up", job: "J-1049", result: "Mold estimate follow-up scheduled with Farmers adjuster" },
  ];

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Automation Rules</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Your operations brain — {activeRules} active rules, {totalTriggers} total triggers</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn v="secondary" sz="sm" icon="clock" onClick={() => setShowLog(!showLog)}>{showLog ? "Hide Log" : "Activity Log"}</Btn>
          {rm.canManageUsers && <Btn v="primary" sz="sm" icon="plus" onClick={() => setShowNewRule(true)}>New Rule</Btn>}
        </div>
      </div>

      <div style={{ padding: "0 28px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
          {[
            ["Active Rules", `${activeRules}/${rules.length}`, T.orange],
            ["Triggers Today", "4", T.greenBright],
            ["Actions Executed", `${totalTriggers}`, T.blueBright],
            ["Jobs Affected", "6", T.purpleBright],
          ].map(([l, v, c]) => (
            <Card key={l as string} style={{ flex: 1, minWidth: 130 }}>
              <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{l as string}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: c as string }}>{v as string}</div>
            </Card>
          ))}
        </div>

        {/* Activity Log Panel */}
        {showLog && (
          <Card style={{ marginBottom: 18, maxHeight: 300, overflowY: "auto" }}>
            <div style={{ fontWeight: 600, color: T.white, marginBottom: 12 }}>📋 Recent Automation Activity</div>
            {ACTIVITY_LOG.map((entry, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < ACTIVITY_LOG.length - 1 ? `1px solid ${T.border}18` : "none" }}>
                <div style={{ width: 70, flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: T.muted }}>{entry.time}</div>
                  <div style={{ fontSize: 10, color: T.dim }}>{entry.date}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{entry.rule}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{entry.job} — {entry.result}</div>
                </div>
              </div>
            ))}
          </Card>
        )}

        {/* Category filter */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto" }}>
          <div onClick={() => setFilterCat("all")} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", background: filterCat === "all" ? T.orange : T.surfaceHigh, color: filterCat === "all" ? "#fff" : T.muted, border: `1px solid ${filterCat === "all" ? T.orange : T.border}`, fontWeight: filterCat === "all" ? 600 : 400 }}>All ({rules.length})</div>
          {Object.entries(CATEGORY_CONFIG).map(([k, v]) => {
            const cnt = rules.filter(r => r.category === k).length;
            const isActive = filterCat === k;
            return (
              <div key={k} onClick={() => setFilterCat(k)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", background: isActive ? `${v.color}22` : T.surfaceHigh, color: isActive ? v.color : T.muted, border: `1px solid ${isActive ? v.color : T.border}`, fontWeight: isActive ? 600 : 400, whiteSpace: "nowrap" }}>
                <Ic n={v.icon} s={12} c={isActive ? v.color : T.muted}/>{v.label} ({cnt})
              </div>
            );
          })}
        </div>

        {/* Rules List */}
        {filtered.map(rule => {
          const cat = CATEGORY_CONFIG[rule.category];
          const isExpanded = expandedRule === rule.id;
          return (
            <Card key={rule.id} style={{ marginBottom: 10, borderColor: rule.enabled ? `${cat.color}33` : T.border, opacity: rule.enabled ? 1 : 0.6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setExpandedRule(isExpanded ? null : rule.id)}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: rule.enabled ? T.greenBright : T.dim }}/>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.white }}>{rule.name}</span>
                    <Badge color={cat.color === T.orange ? "orange" : cat.color === T.blueBright ? "blue" : cat.color === T.greenBright ? "green" : cat.color === T.purpleBright ? "purple" : "teal"} small>{cat.label}</Badge>
                  </div>
                  <div style={{ fontSize: 12, color: T.muted, marginLeft: 16 }}>
                    <strong style={{ color: T.text }}>When:</strong> {rule.triggerDesc}
                  </div>
                  {rule.lastTriggered && (
                    <div style={{ fontSize: 11, color: T.dim, marginLeft: 16, marginTop: 4 }}>
                      Last triggered: {rule.lastTriggered} · {rule.triggerCount} total
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                  <Btn v="ghost" sz="sm" onClick={() => runManual(rule)} disabled={!rule.enabled}>⚡ Run Now</Btn>
                  <div onClick={() => toggleRule(rule.id)} style={{ width: 44, height: 24, borderRadius: 12, background: rule.enabled ? T.greenBright : T.surfaceTop, cursor: "pointer", position: "relative", transition: "background 0.2s", border: `1px solid ${rule.enabled ? T.greenBright + "55" : T.border}` }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: rule.enabled ? 22 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}/>
                  </div>
                  <Ic n={isExpanded ? "chevD" : "chevR"} s={14} c={T.muted}/>
                </div>
              </div>

              {isExpanded && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.dim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Actions ({rule.actions.length})</div>
                  {rule.actions.map((action, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 10px", background: T.surfaceHigh, borderRadius: 6, marginBottom: 4 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: cat.color, flexShrink: 0 }}/>
                      <span style={{ fontSize: 12, color: T.text }}>{action.desc}</span>
                      <Badge color="blue" small>{action.type.replace("_", " ")}</Badge>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                    {rm.canManageUsers && <Btn v="secondary" sz="sm" icon="edit">Edit Rule</Btn>}
                    <Btn v="secondary" sz="sm" icon="clock">View History</Btn>
                    {rm.canManageUsers && <Btn v="ghost" sz="sm" style={{ color: T.redBright }}>Delete</Btn>}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* New Rule Modal */}
      {showNewRule && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }} onClick={() => setShowNewRule(false)}>
          <div onClick={e => e.stopPropagation()}>
            <Card style={{ width: 520, background: T.surface, maxHeight: "80vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.white }}>Create Automation Rule</h3>
                <button onClick={() => setShowNewRule(false)} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted }}><Ic n="x" s={18}/></button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Inp label="Rule Name" placeholder="e.g. When drying complete, start recon review" required/>
                <Sel label="Category" options={Object.entries(CATEGORY_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))}/>
                <Sel label="Trigger" options={[
                  { value: "all_rooms_dry", label: "All rooms reach dry standard" },
                  { value: "inactivity_3d", label: "No job activity for 3+ days" },
                  { value: "supplement_approved", label: "Supplement approved" },
                  { value: "job_created", label: "New job created" },
                  { value: "estimate_submitted", label: "Estimate submitted" },
                  { value: "invoice_aging_30d", label: "Invoice unpaid 30+ days" },
                  { value: "stage_changed", label: "Job stage changed" },
                  { value: "custom", label: "Custom condition" },
                ]}/>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, marginBottom: 5, display: "block" }}>Actions</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["Notify PM", "Create Task", "Change Stage", "Send Email", "Update Financials", "Flag Job"].map(a => (
                      <div key={a} style={{ padding: "5px 12px", borderRadius: 6, background: T.surfaceHigh, border: `1px solid ${T.border}`, fontSize: 11, color: T.text, cursor: "pointer" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = T.orange; (e.currentTarget as HTMLDivElement).style.color = T.orange; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = T.border; (e.currentTarget as HTMLDivElement).style.color = T.text; }}
                      >+ {a}</div>
                    ))}
                  </div>
                </div>
                <Sel label="Notify Who" options={[{ value: "pm", label: "Project Manager" }, { value: "owner", label: "Owner" }, { value: "all", label: "All Team Members" }]}/>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
                <Btn v="secondary" onClick={() => setShowNewRule(false)}>Cancel</Btn>
                <Btn v="primary" icon="plus" onClick={() => { setShowNewRule(false); toast({ title: "✅ Automation rule created", description: "Rule is now active and monitoring jobs" }); }}>Create Rule</Btn>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
