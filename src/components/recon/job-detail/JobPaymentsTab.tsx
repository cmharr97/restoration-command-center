import { useState, useEffect, useCallback } from "react";
import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Inp, Sel } from "@/components/recon/ReconUI";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { DbJob } from "@/hooks/useJobs";

const typeLabels: Record<string, string> = {
  deposit: "Deposit", progress: "Progress Payment", supplement: "Supplement Payment",
  final: "Final Payment", deductible: "Deductible", other: "Other",
};

const PAYMENT_TYPES = [
  { value: "deposit", label: "Deposit" },
  { value: "progress", label: "Progress Payment" },
  { value: "supplement", label: "Supplement Payment" },
  { value: "final", label: "Final Payment" },
  { value: "deductible", label: "Deductible" },
  { value: "other", label: "Other" },
];

const SOURCES = [
  { value: "homeowner", label: "Homeowner" },
  { value: "carrier", label: "Insurance Carrier" },
  { value: "mortgage_company", label: "Mortgage Company" },
  { value: "other", label: "Other" },
];

export const JobPaymentsTab = ({ job }: { job: DbJob }) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, companyId } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPayments = useCallback(async () => {
    const { data, error } = await supabase.from("payments").select("*").eq("job_id", job.id).order("created_at", { ascending: false });
    if (!error) setPayments(data || []);
    setLoading(false);
  }, [job.id]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const emptyForm = {
    amount: "", payment_type: "deposit", source: "homeowner", check_number: "",
    date_received: new Date().toISOString().split("T")[0], notes: "",
  };
  const [form, setForm] = useState(emptyForm);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!user || !form.amount) return;
    setSaving(true);
    const payload: any = {
      job_id: job.id, amount: parseFloat(form.amount) || 0, payment_type: form.payment_type,
      source: form.source, check_number: form.check_number, date_received: form.date_received || null,
      notes: form.notes, created_by: user.id, company_id: companyId || null,
    };

    if (editingId) {
      const { error } = await supabase.from("payments").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Payment updated" }); setShowForm(false); setEditingId(null); await fetchPayments(); }
    } else {
      const { error } = await supabase.from("payments").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Payment recorded", description: `$${parseFloat(form.amount).toLocaleString()} saved` }); setShowForm(false); setForm(emptyForm); await fetchPayments(); }
    }
    setSaving(false);
  };

  const handleEdit = (p: any) => {
    setForm({
      amount: p.amount?.toString() || "", payment_type: p.payment_type || "deposit",
      source: p.source || "homeowner", check_number: p.check_number || "",
      date_received: p.date_received || "", notes: p.notes || "",
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this payment record?")) return;
    const { error } = await supabase.from("payments").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Payment deleted" }); await fetchPayments(); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading payments...</div>;

  const totalReceived = payments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
  const contractValue = job.contract_value || 0;
  const outstanding = contractValue - totalReceived;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Contract Value", value: `$${contractValue.toLocaleString()}`, color: T.white, icon: "dollar" },
          { label: "Total Received", value: `$${totalReceived.toLocaleString()}`, color: T.greenBright, icon: "check" },
          { label: "Unpaid Balance", value: contractValue > 0 ? `$${Math.max(outstanding, 0).toLocaleString()}` : "—", color: outstanding > 0 ? T.redBright : T.greenBright, icon: "alert" },
          { label: "Payments", value: `${payments.length}`, color: T.blueBright, icon: "inv" },
        ].map((s, i) => (
          <Card key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Ic n={s.icon} s={16} c={s.color} />
              <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Payment History</div>
        <Btn v="primary" sz="sm" icon="plus" onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm); }}>
          {showForm ? "Cancel" : "Record Payment"}
        </Btn>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 16, borderColor: `${T.orange}44` }}>
          <div style={{ fontWeight: 700, color: T.orange, fontSize: 14, marginBottom: 14 }}>
            {editingId ? "Edit Payment" : "Record New Payment"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Inp label="Amount ($) *" type="number" placeholder="e.g. 5000" value={form.amount} onChange={set("amount")} required />
            <Sel label="Payment Type" options={PAYMENT_TYPES} value={form.payment_type} onChange={set("payment_type")} />
            <Sel label="Source" options={SOURCES} value={form.source} onChange={set("source")} />
            <Inp label="Check / Reference #" placeholder="Optional" value={form.check_number} onChange={set("check_number")} />
            <Inp label="Date Received" type="date" value={form.date_received} onChange={set("date_received")} />
            <Inp label="Notes" placeholder="Optional notes" value={form.notes} onChange={set("notes")} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
            <Btn v="secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Btn>
            <Btn v="primary" icon="check" onClick={handleSave} disabled={saving || !form.amount}>
              {saving ? "Saving..." : editingId ? "Update Payment" : "Save Payment"}
            </Btn>
          </div>
        </Card>
      )}

      {payments.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: T.dim }}>
          <div style={{ fontSize: 13, marginBottom: 4 }}>No payments recorded yet</div>
          <div style={{ fontSize: 11 }}>Click "Record Payment" to add the first entry</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {payments.map((p: any) => (
            <Card key={p.id} style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: T.text, fontSize: 13, marginBottom: 2 }}>{typeLabels[p.payment_type] || p.payment_type}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>
                    {p.date_received || "No date"} · {p.source || "Unknown source"}
                    {p.check_number && ` · Ref #${p.check_number}`}
                  </div>
                  {p.notes && <div style={{ fontSize: 11, color: T.dim, marginTop: 2, fontStyle: "italic" }}>{p.notes}</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: T.greenBright }}>+${(p.amount || 0).toLocaleString()}</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => handleEdit(p)} title="Edit" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                      <Ic n="edit" s={14} c={T.muted} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} title="Delete" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                      <Ic n="x" s={14} c={T.redBright} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
