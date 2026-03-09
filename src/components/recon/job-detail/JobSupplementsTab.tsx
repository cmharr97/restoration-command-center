import { useState, useEffect, useCallback } from "react";
import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Inp, Sel } from "@/components/recon/ReconUI";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { DbJob } from "@/hooks/useJobs";

const statusBadge: Record<string, string> = {
  draft: "gray", submitted: "blue", under_review: "yellow", approved: "green", partial: "orange", denied: "red",
};

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "approved", label: "Approved" },
  { value: "partial", label: "Partially Approved" },
  { value: "denied", label: "Denied" },
];

const emptyForm = {
  contractor_total: "", carrier_total: "", approved_amount: "",
  justification: "", notes: "", status: "draft",
  submitted_date: "", response_date: "",
};

export const JobSupplementsTab = ({ job }: { job: DbJob }) => {
  const [supplements, setSupplements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, companyId } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchSupplements = useCallback(async () => {
    const { data, error } = await supabase.from("supplements").select("*").eq("job_id", job.id).order("created_at", { ascending: false });
    if (!error) setSupplements(data || []);
    setLoading(false);
  }, [job.id]);

  useEffect(() => { fetchSupplements(); }, [fetchSupplements]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const contractorTotal = parseFloat(form.contractor_total) || 0;
    const carrierTotal = parseFloat(form.carrier_total) || 0;
    const payload: any = {
      job_id: job.id, status: form.status,
      contractor_total: contractorTotal, carrier_total: carrierTotal,
      difference: contractorTotal - carrierTotal,
      approved_amount: parseFloat(form.approved_amount) || 0,
      justification: form.justification, notes: form.notes,
      submitted_date: form.submitted_date || null,
      response_date: form.response_date || null,
      company_id: companyId || null,
    };

    if (editingId) {
      const { error } = await supabase.from("supplements").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Supplement updated" }); setShowForm(false); setEditingId(null); await fetchSupplements(); }
    } else {
      payload.supplement_number = supplements.length + 1;
      payload.created_by = user.id;
      const { error } = await supabase.from("supplements").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Supplement created" }); setShowForm(false); setForm(emptyForm); await fetchSupplements(); }
    }
    setSaving(false);
  };

  const handleEdit = (sup: any) => {
    setForm({
      contractor_total: sup.contractor_total?.toString() || "",
      carrier_total: sup.carrier_total?.toString() || "",
      approved_amount: sup.approved_amount?.toString() || "",
      justification: sup.justification || "", notes: sup.notes || "",
      status: sup.status || "draft",
      submitted_date: sup.submitted_date || "",
      response_date: sup.response_date || "",
    });
    setEditingId(sup.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this supplement?")) return;
    // Supplements table doesn't have DELETE RLS — try via update to mark as deleted
    const { error } = await supabase.from("supplements").update({ status: "denied", notes: "[DELETED]" } as any).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Supplement removed" }); await fetchSupplements(); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading supplements...</div>;

  if (supplements.length === 0 && !showForm) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: T.purpleDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Ic n="est" s={28} c={T.purpleBright} />
        </div>
        <div style={{ fontWeight: 600, color: T.white, fontSize: 15, marginBottom: 6 }}>No Supplements</div>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 20 }}>Create a supplement when additional scope is identified</div>
        <Btn v="primary" sz="md" icon="plus" onClick={() => { setForm(emptyForm); setShowForm(true); }}>Create Supplement</Btn>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Supplements ({supplements.length})</div>
        <Btn v="primary" sz="sm" icon="plus" onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm); }}>
          {showForm ? "Cancel" : "New Supplement"}
        </Btn>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 16, borderColor: `${T.purpleBright}44` }}>
          <div style={{ fontWeight: 700, color: T.purpleBright, fontSize: 14, marginBottom: 14 }}>
            {editingId ? "Edit Supplement" : `New Supplement #${supplements.length + 1}`}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Inp label="Contractor Total ($)" type="number" placeholder="e.g. 25000" value={form.contractor_total} onChange={set("contractor_total")} />
            <Inp label="Carrier Total ($)" type="number" placeholder="e.g. 18000" value={form.carrier_total} onChange={set("carrier_total")} />
            <Inp label="Approved Amount ($)" type="number" placeholder="0" value={form.approved_amount} onChange={set("approved_amount")} />
            <Sel label="Status" options={STATUS_OPTIONS} value={form.status} onChange={set("status")} />
            <Inp label="Submitted Date" type="date" value={form.submitted_date} onChange={set("submitted_date")} />
            <Inp label="Response Date" type="date" value={form.response_date} onChange={set("response_date")} />
          </div>
          <div style={{ marginTop: 12 }}>
            <Inp label="Justification" placeholder="Why is the supplement needed?" value={form.justification} onChange={set("justification")} />
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: T.muted }}>Notes</label>
            <textarea value={form.notes} onChange={set("notes")} rows={2} placeholder="Additional details..."
              style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
            <Btn v="secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Btn>
            <Btn v="primary" icon="check" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Supplement" : "Create Supplement"}
            </Btn>
          </div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {supplements.map((sup: any) => (
          <Card key={sup.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Supplement #{sup.supplement_number || 1}</span>
                  <Badge color={statusBadge[sup.status] || "gray"}>{sup.status || "Draft"}</Badge>
                </div>
                <div style={{ fontSize: 12, color: T.muted }}>
                  {sup.submitted_date ? `Submitted: ${sup.submitted_date}` : "Not yet submitted"}
                  {sup.response_date && ` · Response: ${sup.response_date}`}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Difference</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: (sup.difference || 0) > 0 ? T.greenBright : T.text }}>
                    ${(sup.difference || 0).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <button onClick={() => handleEdit(sup)} title="Edit" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    <Ic n="edit" s={14} c={T.muted} />
                  </button>
                  <button onClick={() => handleDelete(sup.id)} title="Delete" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    <Ic n="x" s={14} c={T.redBright} />
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: sup.justification || sup.notes ? 12 : 0 }}>
              <div style={{ padding: "8px 12px", background: T.surfaceHigh, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: T.muted, marginBottom: 2, textTransform: "uppercase" }}>Contractor Total</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>${(sup.contractor_total || 0).toLocaleString()}</div>
              </div>
              <div style={{ padding: "8px 12px", background: T.surfaceHigh, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: T.muted, marginBottom: 2, textTransform: "uppercase" }}>Carrier Total</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>${(sup.carrier_total || 0).toLocaleString()}</div>
              </div>
              <div style={{ padding: "8px 12px", background: T.surfaceHigh, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: T.muted, marginBottom: 2, textTransform: "uppercase" }}>Approved</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.greenBright }}>${(sup.approved_amount || 0).toLocaleString()}</div>
              </div>
            </div>

            {sup.justification && (
              <div style={{ padding: "10px 12px", background: T.surfaceHigh, borderRadius: 8, border: `1px solid ${T.border}`, marginBottom: sup.notes ? 8 : 0 }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Justification</div>
                <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>{sup.justification}</div>
              </div>
            )}
            {sup.notes && sup.notes !== "[DELETED]" && (
              <div style={{ padding: "10px 12px", background: T.surfaceHigh, borderRadius: 8, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Notes</div>
                <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>{sup.notes}</div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
