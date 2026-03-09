import { useState, useEffect, useCallback } from "react";
import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Inp, Sel } from "@/components/recon/ReconUI";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { DbJob } from "@/hooks/useJobs";

const statusColors: Record<string, string> = {
  pending: "yellow", approved: "green", denied: "red", partial: "orange", review: "blue", none: "gray",
};

const CARRIER_STATUSES = [
  { value: "pending", label: "Pending Response" },
  { value: "review", label: "Under Review" },
  { value: "approved", label: "Approved" },
  { value: "partial", label: "Partially Approved" },
  { value: "denied", label: "Denied" },
];

const SUPPLEMENT_STATUSES = [
  { value: "none", label: "None" },
  { value: "pending", label: "Supplement Pending" },
  { value: "review", label: "Under Review" },
  { value: "approved", label: "Approved" },
  { value: "partial", label: "Partially Approved" },
  { value: "denied", label: "Denied" },
];

export const JobClaimTab = ({ job }: { job: DbJob }) => {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, companyId } = useAuth();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchClaims = useCallback(async () => {
    const { data, error } = await supabase.from("claims").select("*").eq("job_id", job.id).order("created_at", { ascending: false });
    if (!error) setClaims(data || []);
    setLoading(false);
  }, [job.id]);

  useEffect(() => { fetchClaims(); }, [fetchClaims]);

  const claim = claims[0];

  const [form, setForm] = useState({
    carrier_response_status: "pending",
    supplement_status: "none",
    reinspection_requested: false,
    reinspection_date: "",
    estimate_submitted_date: "",
    payments_received: "0",
    recoverable_depreciation: "0",
    outstanding_balance: "0",
    notes: "",
    denied_items_text: "",
    pending_approvals_text: "",
  });

  // Sync form when claim loads
  useEffect(() => {
    if (claim) {
      setForm({
        carrier_response_status: claim.carrier_response_status || "pending",
        supplement_status: claim.supplement_status || "none",
        reinspection_requested: claim.reinspection_requested || false,
        reinspection_date: claim.reinspection_date || "",
        estimate_submitted_date: claim.estimate_submitted_date || "",
        payments_received: claim.payments_received?.toString() || "0",
        recoverable_depreciation: claim.recoverable_depreciation?.toString() || "0",
        outstanding_balance: claim.outstanding_balance?.toString() || "0",
        notes: claim.notes || "",
        denied_items_text: "",
        pending_approvals_text: "",
      });
    }
  }, [claim]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  if (loading) return <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading claim tracking...</div>;

  const insuranceInfo = [
    { label: "Carrier", value: job.carrier || "Not recorded" },
    { label: "Claim #", value: job.claim_no || "Not recorded" },
    { label: "Adjuster", value: job.adjuster || "Not recorded" },
    { label: "Adjuster Phone", value: job.adjuster_phone || "N/A" },
    { label: "Adjuster Email", value: job.adjuster_email || "N/A" },
    { label: "Mortgage Co.", value: job.mortgage_company || "N/A" },
    { label: "Date of Loss", value: job.date_of_loss || "Not recorded" },
  ];

  const handleStartTracking = async () => {
    if (!user) return;
    setCreating(true);
    const { error } = await supabase.from("claims").insert({
      job_id: job.id, created_by: user.id, company_id: companyId || null,
      carrier_response_status: "pending", supplement_status: "none",
      outstanding_balance: job.contract_value || 0,
    } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Tracking started", description: "Internal claim tracking initiated." });
      await fetchClaims();
    }
    setCreating(false);
  };

  const handleSaveTracking = async () => {
    if (!claim) return;
    setSaving(true);

    const updates: any = {
      carrier_response_status: form.carrier_response_status,
      supplement_status: form.supplement_status,
      reinspection_requested: form.reinspection_requested,
      reinspection_date: form.reinspection_date || null,
      estimate_submitted_date: form.estimate_submitted_date || null,
      payments_received: parseFloat(form.payments_received) || 0,
      recoverable_depreciation: parseFloat(form.recoverable_depreciation) || 0,
      outstanding_balance: parseFloat(form.outstanding_balance) || 0,
      notes: form.notes,
    };

    if (form.denied_items_text.trim()) {
      const existing = Array.isArray(claim.denied_items) ? claim.denied_items : [];
      updates.denied_items = [...existing, form.denied_items_text.trim()];
    }
    if (form.pending_approvals_text.trim()) {
      const existing = Array.isArray(claim.pending_approvals) ? claim.pending_approvals : [];
      updates.pending_approvals = [...existing, form.pending_approvals_text.trim()];
    }

    const { error } = await supabase.from("claims").update(updates).eq("id", claim.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Tracking updated", description: "Claim tracking data saved." });
      setEditing(false);
      await fetchClaims();
    }
    setSaving(false);
  };

  if (!claim) {
    return (
      <div>
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.purpleDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic n="shield" s={16} c={T.purpleBright} />
            </div>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Insurance & Carrier Info</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {insuranceInfo.map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: T.surfaceHigh, borderRadius: 6 }}>
                <span style={{ fontSize: 12, color: T.muted }}>{label}</span>
                <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: T.dim, marginTop: 8, fontStyle: "italic" }}>
            Edit carrier and adjuster info from the Overview tab.
          </div>
        </Card>

        <Card style={{ textAlign: "center", padding: 40 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: T.orangeDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Ic n="note" s={24} c={T.orange} />
          </div>
          <div style={{ fontWeight: 600, color: T.white, fontSize: 15, marginBottom: 6 }}>No Internal Claim Tracking Started</div>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 20, maxWidth: 420, margin: "0 auto 20px", lineHeight: 1.6 }}>
            Start tracking this claim internally. Log carrier responses, record supplement status, track denied items, and monitor payments. This is your team's manual tracking system — not a live carrier connection.
          </div>
          <Btn v="primary" sz="md" icon="plus" onClick={handleStartTracking} disabled={creating}>
            {creating ? "Starting..." : "Start Internal Tracking"}
          </Btn>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: T.purpleDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic n="shield" s={16} c={T.purpleBright} />
          </div>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Insurance & Carrier Info</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {insuranceInfo.map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: T.surfaceHigh, borderRadius: 6 }}>
              <span style={{ fontSize: 12, color: T.muted }}>{label}</span>
              <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: T.dim, marginTop: 8, fontStyle: "italic" }}>
          Edit carrier and adjuster info from the Overview tab.
        </div>
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Internal Claim Tracking</div>
          <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>Manually updated by your team — not connected to the carrier</div>
        </div>
        <Btn v={editing ? "secondary" : "primary"} sz="sm" icon={editing ? "x" : "edit"} onClick={() => setEditing(!editing)}>
          {editing ? "Cancel" : "Update Tracking"}
        </Btn>
      </div>

      {editing ? (
        <Card style={{ marginBottom: 16, borderColor: `${T.orange}44` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <Sel label="Carrier Response Status" options={CARRIER_STATUSES} value={form.carrier_response_status} onChange={set("carrier_response_status")} />
            <Sel label="Supplement Status" options={SUPPLEMENT_STATUSES} value={form.supplement_status} onChange={set("supplement_status")} />
            <Inp label="Estimate Submitted Date" type="date" value={form.estimate_submitted_date} onChange={set("estimate_submitted_date")} />
            <Inp label="Reinspection Date" type="date" value={form.reinspection_date} onChange={set("reinspection_date")} />
            <Inp label="Payments Received ($)" type="number" value={form.payments_received} onChange={set("payments_received")} />
            <Inp label="Recoverable Depreciation ($)" type="number" value={form.recoverable_depreciation} onChange={set("recoverable_depreciation")} />
            <Inp label="Outstanding Balance ($)" type="number" value={form.outstanding_balance} onChange={set("outstanding_balance")} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "28px 0 0" }}>
              <input type="checkbox" checked={!!form.reinspection_requested} onChange={e => setForm(f => ({ ...f, reinspection_requested: e.target.checked }))}
                style={{ width: 16, height: 16, accentColor: T.orange }} />
              <label style={{ fontSize: 12, color: T.text }}>Reinspection Requested</label>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <Inp label="Add Denied Item" placeholder="Describe denied item..." value={form.denied_items_text} onChange={set("denied_items_text")} />
            <Inp label="Add Pending Approval" placeholder="Describe pending item..." value={form.pending_approvals_text} onChange={set("pending_approvals_text")} />
          </div>
          <div style={{ marginBottom: 12, display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: T.muted }}>Claim Notes</label>
            <textarea value={form.notes} onChange={set("notes")} rows={3}
              style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Btn v="secondary" onClick={() => setEditing(false)}>Cancel</Btn>
            <Btn v="primary" icon="check" onClick={handleSaveTracking} disabled={saving}>
              {saving ? "Saving..." : "Save Tracking"}
            </Btn>
          </div>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card style={{ gridColumn: "1 / -1" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {[
                { label: "Carrier Response", value: claim.carrier_response_status || "Pending", color: statusColors[claim.carrier_response_status || "pending"] },
                { label: "Supplement Status", value: claim.supplement_status || "None", color: statusColors[claim.supplement_status || "none"] },
                { label: "Reinspection", value: claim.reinspection_requested ? "Requested" : "Not Requested", color: claim.reinspection_requested ? "yellow" : "gray" },
                { label: "Outstanding", value: `$${(claim.outstanding_balance || 0).toLocaleString()}`, color: (claim.outstanding_balance || 0) > 0 ? "red" : "green" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "12px 14px", background: T.surfaceHigh, borderRadius: 10, border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 11, color: T.muted, marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
                  <Badge color={s.color}>{s.value}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14, marginBottom: 14 }}>Payment Tracking (Manual)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["Payments Received", `$${(claim.payments_received || 0).toLocaleString()}`, T.greenBright],
                ["Recoverable Depreciation", `$${(claim.recoverable_depreciation || 0).toLocaleString()}`, T.yellowBright],
                ["Outstanding Balance", `$${(claim.outstanding_balance || 0).toLocaleString()}`, T.redBright],
              ].map(([label, value, color]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: T.surfaceHigh, borderRadius: 8 }}>
                  <span style={{ fontSize: 12, color: T.muted }}>{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: color as string }}>{value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14, marginBottom: 14 }}>Key Dates</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                claim.estimate_submitted_date && { label: "Estimate Submitted", value: claim.estimate_submitted_date, color: T.blueBright },
                claim.reinspection_date && { label: "Reinspection Scheduled", value: claim.reinspection_date, color: T.purpleBright },
              ].filter(Boolean).map((item: any, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: T.surfaceHigh, borderRadius: 8 }}>
                  <span style={{ fontSize: 12, color: T.muted }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
              {!claim.estimate_submitted_date && !claim.reinspection_date && (
                <div style={{ fontSize: 12, color: T.dim, padding: "8px 0" }}>No dates logged yet — click "Update Tracking" to add.</div>
              )}
            </div>
          </Card>

          <Card style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14, marginBottom: 14 }}>Denied Items & Pending Approvals</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.redBright, marginBottom: 8 }}>Denied Items</div>
                {Array.isArray(claim.denied_items) && (claim.denied_items as any[]).length > 0 ? (
                  (claim.denied_items as any[]).map((item: any, i: number) => (
                    <div key={i} style={{ fontSize: 12, color: T.text, padding: "6px 10px", background: T.redDim, borderRadius: 6, marginBottom: 4, border: `1px solid ${T.redBright}22` }}>
                      {typeof item === "string" ? item : JSON.stringify(item)}
                    </div>
                  ))
                ) : <div style={{ fontSize: 12, color: T.dim }}>None logged</div>}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.yellowBright, marginBottom: 8 }}>Pending Approvals</div>
                {Array.isArray(claim.pending_approvals) && (claim.pending_approvals as any[]).length > 0 ? (
                  (claim.pending_approvals as any[]).map((item: any, i: number) => (
                    <div key={i} style={{ fontSize: 12, color: T.text, padding: "6px 10px", background: T.yellowDim, borderRadius: 6, marginBottom: 4, border: `1px solid ${T.yellowBright}22` }}>
                      {typeof item === "string" ? item : JSON.stringify(item)}
                    </div>
                  ))
                ) : <div style={{ fontSize: 12, color: T.dim }}>None logged</div>}
              </div>
            </div>
          </Card>

          {claim.notes && (
            <Card style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontWeight: 700, color: T.white, fontSize: 14, marginBottom: 8 }}>Internal Claim Notes</div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>{claim.notes}</div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
