import { useState } from "react";
import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Inp } from "@/components/recon/ReconUI";
import { useSupplements } from "@/hooks/useJobs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { DbJob } from "@/hooks/useJobs";

const statusBadge: Record<string, string> = {
  draft: "gray", submitted: "blue", under_review: "yellow", approved: "green", partial: "orange", denied: "red",
};

export const JobSupplementsTab = ({ job }: { job: DbJob }) => {
  const { supplements, loading } = useSupplements(job.id);
  const { user, companyId } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    contractor_total: "", carrier_total: "", justification: "",
  });

  const handleCreate = async () => {
    if (!user) return;
    setSaving(true);
    const contractorTotal = parseFloat(form.contractor_total) || 0;
    const carrierTotal = parseFloat(form.carrier_total) || 0;
    const { error } = await supabase.from("supplements").insert({
      job_id: job.id, supplement_number: supplements.length + 1, status: "draft",
      contractor_total: contractorTotal, carrier_total: carrierTotal,
      difference: contractorTotal - carrierTotal, justification: form.justification,
      created_by: user.id, company_id: companyId || null,
    } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Supplement created", description: `Supplement #${supplements.length + 1} added` });
      setShowForm(false);
      window.location.reload();
    }
    setSaving(false);
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
        <Btn v="primary" sz="md" icon="plus" onClick={() => setShowForm(true)}>Create Supplement</Btn>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Supplements ({supplements.length})</div>
        <Btn v="primary" sz="sm" icon="plus" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "New Supplement"}
        </Btn>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 16, borderColor: `${T.purpleBright}44` }}>
          <div style={{ fontWeight: 700, color: T.purpleBright, fontSize: 14, marginBottom: 14 }}>New Supplement #{supplements.length + 1}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Inp label="Contractor Total ($)" type="number" placeholder="e.g. 25000" value={form.contractor_total} onChange={e => setForm(f => ({ ...f, contractor_total: e.target.value }))} />
            <Inp label="Carrier Total ($)" type="number" placeholder="e.g. 18000" value={form.carrier_total} onChange={e => setForm(f => ({ ...f, carrier_total: e.target.value }))} />
          </div>
          <div style={{ marginTop: 12 }}>
            <Inp label="Justification" placeholder="Why is the supplement needed?" value={form.justification} onChange={e => setForm(f => ({ ...f, justification: e.target.value }))} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
            <Btn v="secondary" onClick={() => setShowForm(false)}>Cancel</Btn>
            <Btn v="primary" icon="check" onClick={handleCreate} disabled={saving}>
              {saving ? "Creating..." : "Create Supplement"}
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
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Difference</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: (sup.difference || 0) > 0 ? T.greenBright : T.text }}>
                  ${(sup.difference || 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
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

            {/* Comparison summary */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: sup.justification ? 12 : 0 }}>
              {[
                { label: "Missing Items", data: sup.missing_items, color: T.redBright },
                { label: "Scope Differences", data: sup.scope_differences, color: T.yellowBright },
                { label: "Quantity Differences", data: sup.quantity_differences, color: T.blueBright },
                { label: "Pricing Differences", data: sup.pricing_differences, color: T.purpleBright },
              ].map(({ label, data, color }) => {
                const count = Array.isArray(data) ? data.length : 0;
                return (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: T.surfaceHigh, borderRadius: 6 }}>
                    <span style={{ fontSize: 11, color: T.muted }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: count > 0 ? color : T.dim }}>{count} items</span>
                  </div>
                );
              })}
            </div>

            {sup.justification && (
              <div style={{ padding: "10px 12px", background: T.surfaceHigh, borderRadius: 8, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>JUSTIFICATION</div>
                <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>{sup.justification}</div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
