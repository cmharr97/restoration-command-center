import { useState, useRef } from "react";
import { T, ROLES, JOB_STAGES, LOSS_TYPES, stageInfo, stageColor } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";
import { UserAvatar } from "@/components/recon/MessagingPage";
import { useTeamMembers, type DbJob } from "@/hooks/useJobs";
import { JobOverviewTab } from "./job-detail/JobOverviewTab";
import { JobClaimTab } from "./job-detail/JobClaimTab";
import { JobSupplementsTab } from "./job-detail/JobSupplementsTab";
import { JobPaymentsTab } from "./job-detail/JobPaymentsTab";
import { JobDryingTab } from "./job-detail/JobDryingTab";
import { JobPhotosTab } from "./job-detail/JobPhotosTab";
import { JobSubcontractorsTab } from "./job-detail/JobSubcontractorsTab";
import { JobActivityTab } from "./job-detail/JobActivityTab";

interface JobDetailProps {
  job: DbJob;
  role: string;
  setActive: (id: string) => void;
}

export const JobDetailPage = ({ job, role, setActive }: JobDetailProps) => {
  const [tab, setTab] = useState("overview");
  const rm = ROLES[role];
  const stage = stageInfo(job.stage);
  const { members } = useTeamMembers();
  const isWater = job.loss_type === "water";
  const isInsurance = job.payment_type === "insurance";

  // Build tabs dynamically based on job type and role
  const TAB_CONFIG = [
    { id: "overview", label: "Overview", icon: "eye" },
    ...(isInsurance ? [{ id: "claim", label: "Insurance Tracking", icon: "shield" }] : []),
    ...(isInsurance ? [{ id: "supplements", label: "Supplements", icon: "est" }] : []),
    { id: "payments", label: "Payments", icon: "dollar" },
    { id: "drying", label: "Drying Logs", icon: "moisture" },
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

  // Build quick info bar items based on job type
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
            {rm.canDeleteJobs && <Btn v="danger" sz="sm">Archive</Btn>}
            <Btn v="primary" sz="sm" icon="edit">Edit Job</Btn>
          </div>
        </div>

        {/* Stage Tracker */}
        <div style={{ display: "flex", gap: 2, marginBottom: 16, overflowX: "auto" }}>
          {JOB_STAGES.map((s, i) => {
            const stageIdx = JOB_STAGES.findIndex(x => x.id === job.stage);
            const isPast = i < stageIdx;
            const isCurrent = i === stageIdx;
            return (
              <div key={s.id} style={{ flex: 1, minWidth: 60, textAlign: "center" }}>
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
        {tab === "communication" && <JobCommunicationTab job={job} role={role} members={members} />}
        {tab === "subcontractors" && <JobSubcontractorsTab job={job} />}
        {tab === "activity" && <JobActivityTab job={job} />}
      </div>
    </div>
  );
};

// ── JOB COMMUNICATION TAB (kept inline) ──
const JobCommunicationTab = ({ job, role, members }: { job: DbJob; role: string; members: any[] }) => {
  const [lane, setLane] = useState<"internal" | "customer" | "insurance" | "subs">("internal");
  const [msgText, setMsgText] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUser = members.find((m: any) => m.role === role) || members[0] || { id: "unknown", name: "You", role, avatar: "?" };
  const isInsurance = job.payment_type === "insurance";

  const laneConfig = {
    internal: { label: "Internal Team", color: T.orange, icon: "users", desc: "Only visible to your team" },
    customer: { label: "Homeowner", color: T.greenBright, icon: "customer", desc: "Visible to the property owner" },
    insurance: { label: "Adjuster / TPA", color: T.blueBright, icon: "shield", desc: "Log adjuster & carrier correspondence" },
    subs: { label: "Subcontractors", color: T.purpleBright, icon: "truck", desc: "Communication with assigned subs" },
  };

  // Filter out insurance lane for self-pay jobs
  const availableLanes = isInsurance
    ? (Object.keys(laneConfig) as Array<keyof typeof laneConfig>)
    : (Object.keys(laneConfig) as Array<keyof typeof laneConfig>).filter(l => l !== "insurance");

  type CommMessage = { sender: string; senderId: string; text: string; time: string; date: string; lane: string; mentions?: string[] };
  const [messages, setMessages] = useState<CommMessage[]>([]);
  const filteredMessages = messages.filter(m => m.lane === lane);

  const handleSend = () => {
    if (!msgText.trim()) return;
    const mentions = msgText.match(/@([\w\s]+?)(?=\s|$|[.,!?])/g)?.map(m => m.slice(1).trim()) || [];
    setMessages(prev => [...prev, {
      sender: currentUser.name, senderId: currentUser.id, text: msgText,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      lane, mentions: mentions.length > 0 ? mentions : undefined,
    }]);
    setMsgText("");
    setShowMentions(false);
  };

  const handleInputChange = (val: string) => {
    setMsgText(val);
    const lastAt = val.lastIndexOf("@");
    if (lastAt !== -1 && (lastAt === val.length - 1 || !val.slice(lastAt).includes(" "))) {
      setShowMentions(true);
      setMentionFilter(val.slice(lastAt + 1));
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (name: string) => {
    const lastAt = msgText.lastIndexOf("@");
    setMsgText(msgText.slice(0, lastAt) + `@${name} `);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const lc = laneConfig[lane];
  const ROLES_MAP = { owner: "Owner", project_manager: "PM", estimator: "Estimator", office_admin: "Admin", field_tech: "Tech", subcontractor: "Sub" } as Record<string, string>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Job Communication — {job.id}</div>
        <div style={{ display: "flex", gap: 6 }}>
          <Btn v="secondary" sz="sm" icon="note">Templates</Btn>
          <Btn v="secondary" sz="sm" icon="upload">Export Log</Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
        {availableLanes.map(l => {
          const conf = laneConfig[l];
          const count = messages.filter(m => m.lane === l).length;
          const isActive = lane === l;
          return (
            <div key={l} onClick={() => setLane(l)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, cursor: "pointer", background: isActive ? `${conf.color}1a` : T.surfaceHigh, border: `1px solid ${isActive ? conf.color + "55" : T.border}`, transition: "all 0.12s" }}>
              <Ic n={conf.icon} s={14} c={isActive ? conf.color : T.muted} />
              <span style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? conf.color : T.muted }}>{conf.label}</span>
              <span style={{ fontSize: 10, background: isActive ? conf.color + "33" : T.surfaceTop, color: isActive ? conf.color : T.dim, borderRadius: 10, padding: "1px 6px", fontWeight: 600 }}>{count}</span>
            </div>
          );
        })}
      </div>

      <div style={{ background: `${lc.color}0a`, border: `1px solid ${lc.color}22`, borderRadius: 6, padding: "6px 12px", marginBottom: 12, display: "flex", gap: 6, alignItems: "center" }}>
        <Ic n={lc.icon} s={13} c={lc.color} />
        <span style={{ fontSize: 11, color: lc.color }}>{lc.desc}</span>
      </div>

      <div style={{ maxHeight: 400, overflowY: "auto", marginBottom: 14 }}>
        {filteredMessages.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: T.dim }}>
            <div style={{ fontSize: 13 }}>No {lc.label.toLowerCase()} messages yet</div>
          </div>
        ) : filteredMessages.map((msg, i) => {
          const member = members.find((m: any) => m.id === msg.senderId);
          const showDate = i === 0 || filteredMessages[i - 1].date !== msg.date;
          return (
            <div key={i}>
              {showDate && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0" }}>
                  <div style={{ flex: 1, height: 1, background: T.border }} />
                  <span style={{ fontSize: 10, color: T.dim }}>{msg.date}</span>
                  <div style={{ flex: 1, height: 1, background: T.border }} />
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <UserAvatar member={member} size={28} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "baseline", marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.white }}>{msg.sender}</span>
                    <span style={{ fontSize: 10, color: T.dim }}>{msg.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>{msg.text}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "relative" }}>
        {showMentions && (
          <div style={{ position: "absolute", bottom: "100%", left: 0, right: 0, background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, padding: 4, maxHeight: 160, overflowY: "auto", marginBottom: 4 }}>
            {members.filter((m: any) => m.name.toLowerCase().includes(mentionFilter.toLowerCase())).map((m: any) => (
              <div key={m.id} onClick={() => insertMention(m.name)} style={{ display: "flex", gap: 6, alignItems: "center", padding: "6px 8px", borderRadius: 5, cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = T.surfaceTop}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
              >
                <UserAvatar member={m} size={22} />
                <span style={{ fontSize: 12, color: T.white }}>{m.name}</span>
                <span style={{ fontSize: 10, color: T.muted }}>{ROLES_MAP[m.role] || m.role}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            ref={inputRef} type="text"
            placeholder={`Message ${lc.label}... (type @ to mention)`}
            value={msgText}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleSend(); } }}
            style={{ flex: 1, background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none" }}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = lc.color}
            onBlur={e => (e.target as HTMLInputElement).style.borderColor = T.border}
          />
          <Btn v="primary" sz="sm" icon="send" onClick={handleSend} disabled={!msgText.trim()}>Send</Btn>
        </div>
      </div>
    </div>
  );
};