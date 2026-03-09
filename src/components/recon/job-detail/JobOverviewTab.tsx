import { useState } from "react";
import { T, ROLES, LOSS_TYPES } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Inp, Sel } from "@/components/recon/ReconUI";
import { useJobs, useTeamMembers } from "@/hooks/useJobs";
import { useToast } from "@/hooks/use-toast";
import type { DbJob } from "@/hooks/useJobs";

export const JobOverviewTab = ({ job, role }: { job: DbJob; role: string }) => {
  const rm = ROLES[role];
  const lossLabel = LOSS_TYPES.find(l => l.id === job.loss_type)?.label || job.loss_type;
  const isInsurance = job.payment_type === "insurance";
  const { updateJob } = useJobs();
  const { members } = useTeamMembers();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    customer: job.customer || "",
    phone: job.phone || "",
    address: job.address || "",
    loss_type: job.loss_type || "water",
    loss_subtype: job.loss_subtype || "",
    date_of_loss: job.date_of_loss || "",
    priority: job.priority || "normal",
    payment_type: job.payment_type || "insurance",
    carrier: job.carrier || "",
    claim_no: job.claim_no || "",
    adjuster: job.adjuster || "",
    adjuster_phone: job.adjuster_phone || "",
    adjuster_email: job.adjuster_email || "",
    mortgage_company: job.mortgage_company || "",
    pm_name: job.pm_name || "",
    contract_value: job.contract_value?.toString() || "",
    mitigation_value: job.mitigation_value?.toString() || "",
    recon_value: job.recon_value?.toString() || "",
    notes: job.notes || "",
    scope_notes: job.scope_notes || "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    const isIns = form.payment_type === "insurance";
    const ok = await updateJob(job.id, {
      customer: form.customer,
      phone: form.phone,
      address: form.address,
      loss_type: form.loss_type,
      loss_subtype: form.loss_subtype,
      date_of_loss: form.date_of_loss || null,
      priority: form.priority,
      payment_type: form.payment_type,
      carrier: isIns ? form.carrier : "",
      claim_no: isIns ? form.claim_no : "",
      adjuster: isIns ? form.adjuster : "",
      adjuster_phone: isIns ? form.adjuster_phone : "",
      adjuster_email: isIns ? form.adjuster_email : "",
      mortgage_company: isIns ? form.mortgage_company : "",
      pm_name: form.pm_name,
      contract_value: form.contract_value ? parseFloat(form.contract_value) : null,
      mitigation_value: form.mitigation_value ? parseFloat(form.mitigation_value) : null,
      recon_value: form.recon_value ? parseFloat(form.recon_value) : null,
      notes: form.notes,
      scope_notes: form.scope_notes,
    } as any);
    if (ok) {
      toast({ title: "Job updated", description: "All changes saved successfully." });
      setEditing(false);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setForm({
      customer: job.customer || "", phone: job.phone || "", address: job.address || "",
      loss_type: job.loss_type || "water", loss_subtype: job.loss_subtype || "",
      date_of_loss: job.date_of_loss || "", priority: job.priority || "normal",
      payment_type: job.payment_type || "insurance", carrier: job.carrier || "",
      claim_no: job.claim_no || "", adjuster: job.adjuster || "",
      adjuster_phone: job.adjuster_phone || "", adjuster_email: job.adjuster_email || "",
      mortgage_company: job.mortgage_company || "", pm_name: job.pm_name || "",
      contract_value: job.contract_value?.toString() || "",
      mitigation_value: job.mitigation_value?.toString() || "",
      recon_value: job.recon_value?.toString() || "",
      notes: job.notes || "", scope_notes: job.scope_notes || "",
    });
    setEditing(false);
  };

  const lossTypeOptions = LOSS_TYPES.map(l => ({ value: l.id, label: l.label }));
  const currentLoss = LOSS_TYPES.find(l => l.id === form.loss_type);
  const subOptions = currentLoss?.subs || [];
  const pmOptions = [{ value: "", label: "Unassigned" }, ...members.map((m: any) => ({ value: m.name, label: `${m.name} (${m.role})` }))];

  // ── EDIT MODE ──
  if (editing) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 16 }}>Edit Job Details</div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn v="secondary" sz="sm" onClick={handleCancel}>Cancel</Btn>
            <Btn v="primary" sz="sm" icon="check" onClick={handleSave} disabled={saving || !form.customer}>
              {saving ? "Saving..." : "Save Changes"}
            </Btn>
          </div>
        </div>

        {/* Customer Information */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.orangeDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic n="customer" s={16} c={T.orange} />
            </div>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Customer Information</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Inp label="Customer Name *" value={form.customer} onChange={set("customer")} required />
            <Inp label="Phone" value={form.phone} onChange={set("phone")} />
            <div style={{ gridColumn: "1 / -1" }}>
              <Inp label="Property Address" value={form.address} onChange={set("address")} />
            </div>
          </div>
        </Card>

        {/* Loss Details */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.blueDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic n="drop" s={16} c={T.blueBright} />
            </div>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Loss Details</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Sel label="Loss Type" options={lossTypeOptions} value={form.loss_type} onChange={set("loss_type")} />
            {subOptions.length > 0 && (
              <Sel label="Category" options={[{ value: "", label: "None" }, ...subOptions.map(s => ({ value: s, label: s }))]} value={form.loss_subtype} onChange={set("loss_subtype")} />
            )}
            <Inp label="Date of Loss" type="date" value={form.date_of_loss} onChange={set("date_of_loss")} />
            <Sel label="Priority" options={[{ value: "normal", label: "Normal" }, { value: "high", label: "High / Urgent" }]} value={form.priority} onChange={set("priority")} />
            <Sel label="Job Type" options={[{ value: "insurance", label: "Insurance" }, { value: "self_pay", label: "Self Pay" }]} value={form.payment_type} onChange={set("payment_type")} />
          </div>
        </Card>

        {/* Insurance Information */}
        {form.payment_type === "insurance" && (
          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: T.purpleDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic n="shield" s={16} c={T.purpleBright} />
              </div>
              <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Insurance Information</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="Carrier" value={form.carrier} onChange={set("carrier")} placeholder="e.g. State Farm" />
              <Inp label="Claim Number" value={form.claim_no} onChange={set("claim_no")} />
              <Inp label="Adjuster Name" value={form.adjuster} onChange={set("adjuster")} />
              <Inp label="Adjuster Phone" value={form.adjuster_phone} onChange={set("adjuster_phone")} />
              <Inp label="Adjuster Email" value={form.adjuster_email} onChange={set("adjuster_email")} />
              <Inp label="Mortgage Company" value={form.mortgage_company} onChange={set("mortgage_company")} />
            </div>
          </Card>
        )}

        {/* Assigned Team */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.greenDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic n="users" s={16} c={T.greenBright} />
            </div>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Assigned Team</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Sel label="Project Manager" options={pmOptions} value={form.pm_name} onChange={set("pm_name")} />
          </div>
        </Card>

        {/* Financial Summary */}
        {rm.canViewInvoices && (
          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: T.yellowDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic n="dollar" s={16} c={T.yellowBright} />
              </div>
              <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Financial Summary</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Inp label="Contract Value ($)" type="number" value={form.contract_value} onChange={set("contract_value")} />
              <Inp label="Mitigation Value ($)" type="number" value={form.mitigation_value} onChange={set("mitigation_value")} />
              <Inp label="Reconstruction Value ($)" type="number" value={form.recon_value} onChange={set("recon_value")} />
            </div>
          </Card>
        )}

        {/* Notes */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.tealDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic n="note" s={16} c={T.tealBright} />
            </div>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Notes</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: T.muted }}>Scope Notes</label>
              <textarea value={form.scope_notes} onChange={set("scope_notes")} rows={3}
                style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", resize: "vertical" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: T.muted }}>Internal Notes</label>
              <textarea value={form.notes} onChange={set("notes")} rows={3}
                style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", resize: "vertical" }}
              />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ── VIEW MODE ──
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Btn v="primary" sz="sm" icon="edit" onClick={() => setEditing(true)}>Edit Job Details</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Customer Info */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.orangeDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic n="customer" s={16} c={T.orange} />
            </div>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Customer Information</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["Name", job.customer],
              ["Phone", job.phone || "N/A"],
              ["Address", job.address],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 12, color: T.muted, minWidth: 80 }}>{k}</span>
                <span style={{ fontSize: 13, color: T.text, fontWeight: 500, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Property & Loss Details */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.blueDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic n="drop" s={16} c={T.blueBright} />
            </div>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Loss Details</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["Loss Type", `${lossLabel}${job.loss_subtype ? ` – ${job.loss_subtype}` : ""}`],
              ["Date of Loss", job.date_of_loss || "TBD"],
              ["Priority", job.priority || "Normal"],
              ["Job Type", isInsurance ? "Insurance" : "Self Pay"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: T.muted }}>{k}</span>
                <span style={{ fontSize: 13, color: k === "Job Type" ? (isInsurance ? T.orange : T.greenBright) : T.text, fontWeight: k === "Job Type" ? 700 : 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Insurance Info */}
        {isInsurance && (
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: T.purpleDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic n="shield" s={16} c={T.purpleBright} />
              </div>
              <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Insurance Information</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Carrier", job.carrier || "TBD"],
                ["Claim #", job.claim_no || "TBD"],
                ["Adjuster", job.adjuster || "TBD"],
                ["Adj. Phone", job.adjuster_phone || "TBD"],
                ["Adj. Email", job.adjuster_email || "N/A"],
                ["Mortgage Co.", job.mortgage_company || "N/A"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: T.muted }}>{k}</span>
                  <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Assigned Team */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.greenDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic n="users" s={16} c={T.greenBright} />
            </div>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Assigned Team</div>
          </div>
          {job.pm_name ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: T.surfaceHigh, borderRadius: 8, border: `1px solid ${T.border}` }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${T.orange},${T.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                {job.pm_name?.split(" ").map(x => x[0]).join("") || "?"}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{job.pm_name}</div>
                <div style={{ fontSize: 11, color: T.muted }}>Project Manager</div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: T.dim, padding: "12px 0" }}>No team assigned yet</div>
          )}
        </Card>

        {/* Financial Summary */}
        {rm.canViewInvoices && (
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: T.yellowDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic n="dollar" s={16} c={T.yellowBright} />
              </div>
              <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Financial Summary</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Contract Value", job.contract_value ? `$${job.contract_value.toLocaleString()}` : "—"],
                ["Mitigation Value", job.mitigation_value ? `$${job.mitigation_value.toLocaleString()}` : "—"],
                ["Recon Value", job.recon_value ? `$${job.recon_value.toLocaleString()}` : "—"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: T.muted }}>{k}</span>
                  <span style={{ fontSize: 14, color: T.white, fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Notes */}
        <Card style={rm.canViewInvoices ? {} : { gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.tealDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic n="note" s={16} c={T.tealBright} />
            </div>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Notes</div>
          </div>
          {job.scope_notes && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Scope Notes</div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6, padding: "8px 12px", background: T.surfaceHigh, borderRadius: 6, border: `1px solid ${T.border}` }}>{job.scope_notes}</div>
            </div>
          )}
          <div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Internal Notes</div>
            <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6, padding: "8px 12px", background: T.surfaceHigh, borderRadius: 6, border: `1px solid ${T.border}` }}>{job.notes || "No notes yet"}</div>
          </div>
        </Card>
      </div>
    </div>
  );
};
