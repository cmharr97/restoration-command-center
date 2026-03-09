import { useState, useEffect } from "react";
import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Inp, Sel } from "@/components/recon/ReconUI";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { DbJob } from "@/hooks/useJobs";

type CommType = "internal" | "homeowner" | "adjuster" | "subcontractor";

const COMM_TYPES: { value: CommType; label: string; icon: string; color: string; desc: string }[] = [
  { value: "internal", label: "Internal Team", icon: "users", color: T.orange, desc: "Internal team notes and updates" },
  { value: "homeowner", label: "Homeowner", icon: "customer", color: T.greenBright, desc: "Log communication with the homeowner" },
  { value: "adjuster", label: "Adjuster / Carrier", icon: "shield", color: T.blueBright, desc: "Log adjuster and carrier correspondence" },
  { value: "subcontractor", label: "Subcontractor", icon: "truck", color: T.purpleBright, desc: "Log communication with assigned subs" },
];

interface CommEntry {
  id: string;
  comm_type: CommType;
  contact_name: string;
  summary: string;
  notes: string;
  created_at: string;
  user_name: string;
}

export const JobCommunicationTab = ({ job }: { job: DbJob }) => {
  const [lane, setLane] = useState<CommType>("internal");
  const { user, companyId, profile } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<CommEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const isInsurance = job.payment_type === "insurance";

  const [form, setForm] = useState({
    comm_type: "internal" as CommType,
    contact_name: "",
    summary: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  // Load entries from activity_logs with action_type = "communication"
  const fetchEntries = async () => {
    const { data, error } = await supabase.from("activity_logs")
      .select("*")
      .eq("job_id", job.id)
      .eq("action_type", "communication")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setEntries(data.map((d: any) => ({
        id: d.id,
        comm_type: (d.metadata as any)?.comm_type || "internal",
        contact_name: (d.metadata as any)?.contact_name || "",
        summary: d.title || "",
        notes: d.description || "",
        created_at: d.created_at,
        user_name: d.user_name || "",
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, [job.id]);

  const handleSave = async () => {
    if (!user || !form.summary.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("activity_logs").insert({
      title: form.summary,
      description: form.notes || null,
      action_type: "communication",
      job_id: job.id,
      user_id: user.id,
      user_name: profile?.name || user.email || "User",
      company_id: companyId || null,
      metadata: {
        comm_type: form.comm_type,
        contact_name: form.contact_name,
        date: form.date,
      },
    } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Communication logged" });
      setShowForm(false);
      setForm({ comm_type: lane, contact_name: "", summary: "", notes: "", date: new Date().toISOString().split("T")[0] });
      fetchEntries();
    }
    setSaving(false);
  };

  const availableLanes = isInsurance ? COMM_TYPES : COMM_TYPES.filter(t => t.value !== "adjuster");
  const filteredEntries = entries.filter(e => e.comm_type === lane);
  const laneConfig = COMM_TYPES.find(t => t.value === lane)!;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Communication Log</div>
          <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>Internal documentation — manually log all communication</div>
        </div>
        <Btn v="primary" sz="sm" icon="plus" onClick={() => { setForm(f => ({ ...f, comm_type: lane })); setShowForm(!showForm); }}>
          {showForm ? "Cancel" : "Log Communication"}
        </Btn>
      </div>

      {/* Lane Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
        {availableLanes.map(l => {
          const count = entries.filter(e => e.comm_type === l.value).length;
          const isActive = lane === l.value;
          return (
            <div key={l.value} onClick={() => setLane(l.value)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, cursor: "pointer",
              background: isActive ? `${l.color}1a` : T.surfaceHigh,
              border: `1px solid ${isActive ? l.color + "55" : T.border}`, transition: "all 0.12s",
            }}>
              <Ic n={l.icon} s={14} c={isActive ? l.color : T.muted} />
              <span style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? l.color : T.muted }}>{l.label}</span>
              <span style={{ fontSize: 10, background: isActive ? l.color + "33" : T.surfaceTop, color: isActive ? l.color : T.dim, borderRadius: 10, padding: "1px 6px", fontWeight: 600 }}>{count}</span>
            </div>
          );
        })}
      </div>

      <div style={{ background: `${laneConfig.color}0a`, border: `1px solid ${laneConfig.color}22`, borderRadius: 6, padding: "6px 12px", marginBottom: 12, display: "flex", gap: 6, alignItems: "center" }}>
        <Ic n={laneConfig.icon} s={13} c={laneConfig.color} />
        <span style={{ fontSize: 11, color: laneConfig.color }}>{laneConfig.desc}</span>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <Card style={{ marginBottom: 16, borderColor: `${laneConfig.color}44` }}>
          <div style={{ fontWeight: 700, color: laneConfig.color, fontSize: 14, marginBottom: 14 }}>Log Communication</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Sel label="Type" options={availableLanes.map(l => ({ value: l.value, label: l.label }))} value={form.comm_type} onChange={set("comm_type")} />
            <Inp label="Date" type="date" value={form.date} onChange={set("date")} />
            <Inp label="Contact Name" placeholder="Who was this with?" value={form.contact_name} onChange={set("contact_name")} />
            <Inp label="Summary *" placeholder="Brief summary of communication" value={form.summary} onChange={set("summary")} required />
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: T.muted }}>Detailed Notes</label>
            <textarea value={form.notes} onChange={set("notes")} rows={3} placeholder="Full details, action items, decisions..."
              style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
            <Btn v="secondary" onClick={() => setShowForm(false)}>Cancel</Btn>
            <Btn v="primary" icon="check" onClick={handleSave} disabled={saving || !form.summary.trim()}>
              {saving ? "Saving..." : "Save Entry"}
            </Btn>
          </div>
        </Card>
      )}

      {/* Entries List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading...</div>
      ) : filteredEntries.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: T.dim }}>
          <div style={{ fontSize: 13 }}>No {laneConfig.label.toLowerCase()} entries logged yet</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>Click "Log Communication" to add an entry</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredEntries.map(entry => {
            const date = new Date(entry.created_at);
            return (
              <Card key={entry.id} style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: T.text, fontSize: 13, marginBottom: 2 }}>{entry.summary}</div>
                    {entry.contact_name && (
                      <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>
                        Contact: <span style={{ fontWeight: 600 }}>{entry.contact_name}</span>
                      </div>
                    )}
                    {entry.notes && <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, marginTop: 4 }}>{entry.notes}</div>}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                    <div style={{ fontSize: 11, color: T.dim }}>
                      {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                    <div style={{ fontSize: 10, color: T.dim }}>
                      {date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <Badge color="gray" small>{entry.comm_type}</Badge>
                  {entry.user_name && <span style={{ fontSize: 11, color: T.dim }}>by {entry.user_name}</span>}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
