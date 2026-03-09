import { useState, useEffect, useCallback } from "react";
import { T, LOSS_TYPES } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Input, Modal } from "@/components/recon/ReconUI";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useJobs } from "@/hooks/useJobs";

interface Lead {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  loss_type: string;
  source: string;
  stage: string;
  priority: string;
  notes: string;
  inspection_date: string | null;
  estimated_value: number;
  assigned_to_name: string;
  converted_job_id: string | null;
  lost_reason: string;
  created_at: string;
  company_id: string | null;
}

const LEAD_STAGES = [
  { id: "new", label: "New Lead", color: "gray" },
  { id: "contacted", label: "Contacted", color: "blue" },
  { id: "inspection_scheduled", label: "Inspection Scheduled", color: "yellow" },
  { id: "estimate_sent", label: "Estimate Sent", color: "purple" },
  { id: "contract_signed", label: "Contract Signed", color: "teal" },
  { id: "converted", label: "Converted to Job", color: "green" },
  { id: "lost", label: "Lost", color: "red" },
];

const SOURCES = [
  { id: "direct", label: "Direct Contact" },
  { id: "referral", label: "Referral" },
  { id: "web", label: "Website" },
  { id: "insurance_referral", label: "Insurance Referral" },
  { id: "social", label: "Social Media" },
];

const PRIORITIES = [
  { id: "low", label: "Low", color: "gray" },
  { id: "normal", label: "Normal", color: "blue" },
  { id: "high", label: "High", color: "orange" },
  { id: "urgent", label: "Urgent", color: "red" },
];

export const LeadsPage = ({ setActive }: { setActive: (id: string) => void }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);
  const { user, companyId } = useAuth();
  const { toast } = useToast();
  const { createJob } = useJobs();

  const [form, setForm] = useState({
    customer_name: "", phone: "", email: "", address: "", loss_type: "water",
    source: "direct", stage: "new", priority: "normal", notes: "",
    inspection_date: "", estimated_value: "", assigned_to_name: ""
  });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setLeads((data || []) as Lead[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const openNew = () => {
    setEditingLead(null);
    setForm({
      customer_name: "", phone: "", email: "", address: "", loss_type: "water",
      source: "direct", stage: "new", priority: "normal", notes: "",
      inspection_date: "", estimated_value: "", assigned_to_name: ""
    });
    setShowModal(true);
  };

  const openEdit = (l: Lead) => {
    setEditingLead(l);
    setForm({
      customer_name: l.customer_name, phone: l.phone || "", email: l.email || "",
      address: l.address || "", loss_type: l.loss_type || "water", source: l.source || "direct",
      stage: l.stage || "new", priority: l.priority || "normal", notes: l.notes || "",
      inspection_date: l.inspection_date?.split("T")[0] || "", estimated_value: l.estimated_value?.toString() || "",
      assigned_to_name: l.assigned_to_name || ""
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.customer_name.trim()) {
      toast({ title: "Customer name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      customer_name: form.customer_name, phone: form.phone, email: form.email,
      address: form.address, loss_type: form.loss_type, source: form.source,
      stage: form.stage, priority: form.priority, notes: form.notes,
      inspection_date: form.inspection_date || null,
      estimated_value: parseFloat(form.estimated_value) || 0,
      assigned_to_name: form.assigned_to_name,
      updated_at: new Date().toISOString()
    };

    if (editingLead) {
      const { error } = await supabase.from("leads").update(payload as any).eq("id", editingLead.id);
      if (error) {
        toast({ title: "Error updating lead", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Lead updated" });
        setShowModal(false);
        fetchLeads();
      }
    } else {
      const { error } = await supabase.from("leads").insert({
        ...payload,
        created_by: user?.id,
        company_id: companyId || null
      } as any);
      if (error) {
        toast({ title: "Error creating lead", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Lead created" });
        setShowModal(false);
        fetchLeads();
      }
    }
    setSaving(false);
  };

  const handleConvert = async (lead: Lead) => {
    if (!confirm(`Convert lead "${lead.customer_name}" to a job?`)) return;
    const job = await createJob({
      customer: lead.customer_name,
      phone: lead.phone,
      address: lead.address,
      loss_type: lead.loss_type,
      payment_type: "insurance",
      notes: lead.notes,
      priority: lead.priority
    });
    if (job) {
      await supabase.from("leads").update({
        stage: "converted",
        converted_job_id: job.id,
        updated_at: new Date().toISOString()
      } as any).eq("id", lead.id);
      toast({ title: "Lead converted", description: `Created job ${job.id}` });
      fetchLeads();
    }
  };

  const handleUpdateStage = async (leadId: string, newStage: string) => {
    const { error } = await supabase.from("leads").update({
      stage: newStage,
      updated_at: new Date().toISOString()
    } as any).eq("id", leadId);
    if (!error) fetchLeads();
  };

  const filtered = leads.filter(l => stageFilter === "all" || l.stage === stageFilter);

  const stageCounts = LEAD_STAGES.reduce((acc, s) => {
    acc[s.id] = leads.filter(l => l.stage === s.id).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0 }}>Lead Pipeline</h1>
          <p style={{ color: T.muted, fontSize: 13, margin: "4px 0 0" }}>Track and convert leads into jobs</p>
        </div>
        <Btn v="primary" icon="plus" onClick={openNew}>Add Lead</Btn>
      </div>

      {/* Stage filters */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ padding: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setStageFilter("all")}
            style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${stageFilter === "all" ? T.orange : T.border}`, background: stageFilter === "all" ? T.orangeDim : "transparent", color: stageFilter === "all" ? T.orange : T.muted, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
            All ({leads.length})
          </button>
          {LEAD_STAGES.map(s => (
            <button key={s.id} onClick={() => setStageFilter(s.id)}
              style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${stageFilter === s.id ? T.orange : T.border}`, background: stageFilter === s.id ? T.orangeDim : "transparent", color: stageFilter === s.id ? T.orange : T.muted, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
              {s.label} ({stageCounts[s.id] || 0})
            </button>
          ))}
        </div>
      </Card>

      {loading ? (
        <Card><div style={{ padding: 40, textAlign: "center", color: T.muted }}>Loading leads...</div></Card>
      ) : filtered.length === 0 ? (
        <Card>
          <div style={{ padding: 60, textAlign: "center" }}>
            <Ic n="users" s={48} c={T.dim} />
            <h3 style={{ color: T.muted, fontSize: 16, margin: "16px 0 8px" }}>No Leads Found</h3>
            <p style={{ color: T.dim, fontSize: 13, marginBottom: 20 }}>Add your first lead to start tracking your pipeline.</p>
            <Btn v="primary" icon="plus" onClick={openNew}>Add Lead</Btn>
          </div>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {filtered.map(l => {
            const stageInfo = LEAD_STAGES.find(s => s.id === l.stage) || LEAD_STAGES[0];
            const priorityInfo = PRIORITIES.find(p => p.id === l.priority) || PRIORITIES[1];
            return (
              <Card key={l.id} style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: T.text, fontSize: 16 }}>{l.customer_name}</span>
                      <Badge color={priorityInfo.color as any} small>{priorityInfo.label}</Badge>
                      {l.converted_job_id && <Badge color="green" small>Converted: {l.converted_job_id}</Badge>}
                    </div>
                    <div style={{ display: "flex", gap: 16, color: T.muted, fontSize: 13 }}>
                      {l.phone && <span><Ic n="phone" s={12} c={T.muted} /> {l.phone}</span>}
                      {l.email && <span><Ic n="mail" s={12} c={T.muted} /> {l.email}</span>}
                    </div>
                    {l.address && <div style={{ color: T.dim, fontSize: 12, marginTop: 4 }}>{l.address}</div>}
                  </div>
                  <Badge color={stageInfo.color as any}>{stageInfo.label}</Badge>
                </div>

                <div style={{ display: "flex", gap: 20, marginBottom: 12, fontSize: 13 }}>
                  <div><span style={{ color: T.dim }}>Loss Type:</span> <span style={{ color: T.text }}>{LOSS_TYPES.find(t => t.id === l.loss_type)?.label || l.loss_type}</span></div>
                  <div><span style={{ color: T.dim }}>Source:</span> <span style={{ color: T.text }}>{SOURCES.find(s => s.id === l.source)?.label || l.source}</span></div>
                  {l.estimated_value > 0 && <div><span style={{ color: T.dim }}>Est. Value:</span> <span style={{ color: T.greenBright, fontWeight: 600 }}>${l.estimated_value.toLocaleString()}</span></div>}
                  {l.inspection_date && <div><span style={{ color: T.dim }}>Inspection:</span> <span style={{ color: T.text }}>{new Date(l.inspection_date).toLocaleDateString()}</span></div>}
                </div>

                {l.notes && <div style={{ fontSize: 12, color: T.muted, marginBottom: 12, padding: "8px 12px", background: T.surfaceHigh, borderRadius: 6 }}>{l.notes}</div>}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {l.stage !== "converted" && l.stage !== "lost" && (
                      <select value={l.stage} onChange={e => handleUpdateStage(l.id, e.target.value)}
                        style={{ padding: "6px 10px", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 12 }}>
                        {LEAD_STAGES.filter(s => s.id !== "converted").map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn v="ghost" sz="sm" onClick={() => openEdit(l)}>Edit</Btn>
                    {l.stage !== "converted" && l.stage !== "lost" && (
                      <Btn v="primary" sz="sm" onClick={() => handleConvert(l)}>Convert to Job</Btn>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal title={editingLead ? "Edit Lead" : "Add Lead"} onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Customer Name *</label>
              <Input value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} placeholder="John Smith" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Phone</label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 123-4567" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Email</label>
              <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@email.com" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Property Address</label>
              <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="123 Main St, Denver CO" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Loss Type</label>
              <select value={form.loss_type} onChange={e => setForm(f => ({ ...f, loss_type: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 14 }}>
                {LOSS_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Source</label>
              <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 14 }}>
                {SOURCES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 14 }}>
                {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Stage</label>
              <select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 14 }}>
                {LEAD_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Inspection Date</label>
              <Input type="date" value={form.inspection_date} onChange={e => setForm(f => ({ ...f, inspection_date: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Estimated Value</label>
              <Input type="number" value={form.estimated_value} onChange={e => setForm(f => ({ ...f, estimated_value: e.target.value }))} placeholder="0" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Lead notes..."
                style={{ width: "100%", minHeight: 80, padding: "10px 12px", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 14, resize: "vertical" }} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <Btn v="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn v="primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editingLead ? "Update Lead" : "Add Lead"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};
