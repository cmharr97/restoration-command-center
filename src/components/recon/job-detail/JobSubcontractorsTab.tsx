import { useState, useEffect } from "react";
import { T, TRADES } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Inp, Sel } from "@/components/recon/ReconUI";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { DbJob } from "@/hooks/useJobs";

const statusColors: Record<string, string> = {
  assigned: "blue", scheduled: "yellow", in_progress: "orange", completed: "green", cancelled: "red",
};

const STATUS_OPTIONS = [
  { value: "assigned", label: "Assigned" },
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const JobSubcontractorsTab = ({ job }: { job: DbJob }) => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, companyId } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    subcontractor_id: "", trade: TRADES[0], amount: "", status: "assigned",
    scheduled_date: "", completed_date: "", notes: "",
    // For new sub creation
    newSub: false, sub_name: "", sub_company: "", sub_phone: "", sub_email: "",
  };
  const [form, setForm] = useState(emptyForm);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const fetchData = async () => {
    const [assignRes, subRes] = await Promise.all([
      supabase.from("subcontractor_assignments").select("*").eq("job_id", job.id),
      supabase.from("subcontractors").select("*"),
    ]);
    if (!assignRes.error) setAssignments(assignRes.data || []);
    if (!subRes.error) setSubs(subRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [job.id]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    let subId = form.subcontractor_id;

    // Create new sub if needed
    if (form.newSub && form.sub_name.trim()) {
      const { data: newSub, error: subError } = await supabase.from("subcontractors").insert({
        name: form.sub_name, company_name: form.sub_company, phone: form.sub_phone,
        email: form.sub_email, trade: form.trade, created_by: user.id,
        company_id: companyId || null,
      } as any).select().single();
      if (subError) {
        toast({ title: "Error creating sub", description: subError.message, variant: "destructive" });
        setSaving(false); return;
      }
      subId = newSub.id;
    }

    if (!subId) { toast({ title: "Select or create a subcontractor", variant: "destructive" }); setSaving(false); return; }

    const payload: any = {
      job_id: job.id, subcontractor_id: subId, trade: form.trade,
      amount: parseFloat(form.amount) || 0, status: form.status,
      scheduled_date: form.scheduled_date || null, completed_date: form.completed_date || null,
      notes: form.notes,
    };

    if (editingId) {
      const { error } = await supabase.from("subcontractor_assignments").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Assignment updated" }); setShowForm(false); setEditingId(null); fetchData(); }
    } else {
      const { error } = await supabase.from("subcontractor_assignments").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Subcontractor assigned" }); setShowForm(false); fetchData(); }
    }
    setSaving(false);
  };

  const handleEdit = (a: any) => {
    setForm({
      subcontractor_id: a.subcontractor_id, trade: a.trade, amount: a.amount?.toString() || "",
      status: a.status || "assigned", scheduled_date: a.scheduled_date || "",
      completed_date: a.completed_date || "", notes: a.notes || "",
      newSub: false, sub_name: "", sub_company: "", sub_phone: "", sub_email: "",
    });
    setEditingId(a.id);
    setShowForm(true);
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this subcontractor from the job?")) return;
    const { error } = await supabase.from("subcontractor_assignments").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Assignment removed" }); fetchData(); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading subcontractors...</div>;

  const subOptions = [
    { value: "", label: "Select from directory..." },
    ...subs.map((s: any) => ({ value: s.id, label: `${s.name}${s.company_name ? ` (${s.company_name})` : ""} — ${s.trade}` })),
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Subcontractor Assignments</div>
          <div style={{ fontSize: 12, color: T.muted }}>{assignments.length} trades assigned</div>
        </div>
        <Btn v="primary" sz="sm" icon="plus" onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm); }}>
          {showForm ? "Cancel" : "Assign Sub"}
        </Btn>
      </div>

      {/* Assignment Form */}
      {showForm && (
        <Card style={{ marginBottom: 16, borderColor: `${T.orange}44` }}>
          <div style={{ fontWeight: 700, color: T.orange, fontSize: 14, marginBottom: 14 }}>
            {editingId ? "Edit Assignment" : "Assign Subcontractor"}
          </div>

          {!editingId && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <input type="checkbox" checked={form.newSub} onChange={e => setForm(f => ({ ...f, newSub: e.target.checked }))}
                  style={{ width: 16, height: 16, accentColor: T.orange }} />
                <label style={{ fontSize: 12, color: T.text }}>Create new subcontractor</label>
              </div>

              {form.newSub ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Inp label="Name *" value={form.sub_name} onChange={set("sub_name")} required />
                  <Inp label="Company" value={form.sub_company} onChange={set("sub_company")} />
                  <Inp label="Phone" value={form.sub_phone} onChange={set("sub_phone")} />
                  <Inp label="Email" value={form.sub_email} onChange={set("sub_email")} />
                </div>
              ) : (
                <Sel label="Select Subcontractor" options={subOptions} value={form.subcontractor_id} onChange={set("subcontractor_id")} />
              )}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Sel label="Trade" options={TRADES.map(t => ({ value: t, label: t }))} value={form.trade} onChange={set("trade")} />
            <Sel label="Status" options={STATUS_OPTIONS} value={form.status} onChange={set("status")} />
            <Inp label="Amount ($)" type="number" placeholder="Contract amount" value={form.amount} onChange={set("amount")} />
            <Inp label="Scheduled Date" type="date" value={form.scheduled_date} onChange={set("scheduled_date")} />
            <Inp label="Completed Date" type="date" value={form.completed_date} onChange={set("completed_date")} />
            <Inp label="Notes" placeholder="Scope or assignment notes" value={form.notes} onChange={set("notes")} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
            <Btn v="secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Btn>
            <Btn v="primary" icon="check" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update" : "Assign"}
            </Btn>
          </div>
        </Card>
      )}

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: T.surfaceHigh, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Ic n="truck" s={28} c={T.dim} />
          </div>
          <div style={{ fontWeight: 600, color: T.white, fontSize: 15, marginBottom: 6 }}>No Subcontractors Assigned</div>
          <div style={{ fontSize: 13, color: T.muted }}>Assign trades to this job from your subcontractor directory or add new ones</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {assignments.map((a: any) => {
            const sub = subs.find((s: any) => s.id === a.subcontractor_id);
            return (
              <Card key={a.id} style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>{sub?.name || "Unknown"}</span>
                      <Badge color={statusColors[a.status] || "gray"}>{a.status}</Badge>
                    </div>
                    <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600 }}>{a.trade}</span>
                      {sub?.company_name && ` · ${sub.company_name}`}
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 11, color: T.dim }}>
                      {sub?.phone && <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Ic n="contact" s={10} c={T.dim}/> {sub.phone}</span>}
                      {sub?.email && <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Ic n="send" s={10} c={T.dim}/> {sub.email}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ textAlign: "right" }}>
                      {a.amount > 0 && <div style={{ fontSize: 16, fontWeight: 800, color: T.text }}>${a.amount.toLocaleString()}</div>}
                      <div style={{ fontSize: 11, color: T.muted }}>
                        {a.scheduled_date ? `Sched: ${a.scheduled_date}` : "Not scheduled"}
                      </div>
                      {a.completed_date && <div style={{ fontSize: 11, color: T.greenBright }}>Done: {a.completed_date}</div>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 4 }}>
                      <button onClick={() => handleEdit(a)} title="Edit" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                        <Ic n="edit" s={14} c={T.muted} />
                      </button>
                      <button onClick={() => handleRemove(a.id)} title="Remove" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                        <Ic n="x" s={14} c={T.redBright} />
                      </button>
                    </div>
                  </div>
                </div>
                {a.notes && <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic", marginTop: 8, borderTop: `1px solid ${T.border}`, paddingTop: 8 }}>{a.notes}</div>}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
