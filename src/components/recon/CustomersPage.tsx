import { useState, useEffect, useCallback } from "react";
import { T, LOSS_TYPES } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Input, Modal } from "@/components/recon/ReconUI";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  notes: string;
  source: string;
  created_at: string;
  company_id: string | null;
}

const SOURCES = [
  { id: "direct", label: "Direct Contact" },
  { id: "referral", label: "Referral" },
  { id: "web", label: "Website" },
  { id: "insurance_referral", label: "Insurance Referral" },
  { id: "repeat", label: "Repeat Customer" },
];

export const CustomersPage = ({ setActive }: { setActive: (id: string) => void }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [saving, setSaving] = useState(false);
  const { user, companyId } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", state: "", zip: "", notes: "", source: "direct"
  });

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setCustomers((data || []) as Customer[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const openNew = () => {
    setEditingCustomer(null);
    setForm({ name: "", email: "", phone: "", address: "", city: "", state: "", zip: "", notes: "", source: "direct" });
    setShowModal(true);
  };

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setForm({
      name: c.name, email: c.email || "", phone: c.phone || "", address: c.address || "",
      city: c.city || "", state: c.state || "", zip: c.zip || "", notes: c.notes || "", source: c.source || "direct"
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Customer name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    if (editingCustomer) {
      const { error } = await supabase.from("customers").update({
        name: form.name, email: form.email, phone: form.phone, address: form.address,
        city: form.city, state: form.state, zip: form.zip, notes: form.notes, source: form.source,
        updated_at: new Date().toISOString()
      } as any).eq("id", editingCustomer.id);
      if (error) {
        toast({ title: "Error updating customer", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Customer updated" });
        setShowModal(false);
        fetchCustomers();
      }
    } else {
      const { error } = await supabase.from("customers").insert({
        name: form.name, email: form.email, phone: form.phone, address: form.address,
        city: form.city, state: form.state, zip: form.zip, notes: form.notes, source: form.source,
        created_by: user?.id, company_id: companyId || null
      } as any);
      if (error) {
        toast({ title: "Error creating customer", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Customer created" });
        setShowModal(false);
        fetchCustomers();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this customer?")) return;
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting customer", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Customer deleted" });
      fetchCustomers();
    }
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0 }}>Customers</h1>
          <p style={{ color: T.muted, fontSize: 13, margin: "4px 0 0" }}>Manage your customer database and view job history</p>
        </div>
        <Btn v="primary" icon="plus" onClick={openNew}>Add Customer</Btn>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ padding: 16 }}>
          <Input placeholder="Search customers by name, email, phone, or address..." value={search} onChange={e => setSearch(e.target.value)} icon="search" />
        </div>
      </Card>

      {loading ? (
        <Card><div style={{ padding: 40, textAlign: "center", color: T.muted }}>Loading customers...</div></Card>
      ) : filtered.length === 0 ? (
        <Card>
          <div style={{ padding: 60, textAlign: "center" }}>
            <Ic n="customer" s={48} c={T.dim} />
            <h3 style={{ color: T.muted, fontSize: 16, margin: "16px 0 8px" }}>No Customers Yet</h3>
            <p style={{ color: T.dim, fontSize: 13, marginBottom: 20 }}>Add your first customer to start building your CRM database.</p>
            <Btn v="primary" icon="plus" onClick={openNew}>Add Customer</Btn>
          </div>
        </Card>
      ) : (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase" }}>Customer</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase" }}>Contact</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase" }}>Address</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase" }}>Source</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 600, color: T.text, fontSize: 14 }}>{c.name}</div>
                    {c.notes && <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{c.notes.slice(0, 40)}...</div>}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 13, color: T.text }}>{c.email || "—"}</div>
                    <div style={{ fontSize: 12, color: T.muted }}>{c.phone || "—"}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: T.muted }}>
                    {c.address ? `${c.address}, ${c.city || ""} ${c.state || ""} ${c.zip || ""}`.trim() : "—"}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <Badge color="gray" small>{SOURCES.find(s => s.id === c.source)?.label || c.source}</Badge>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <Btn v="ghost" sz="sm" onClick={() => openEdit(c)}>Edit</Btn>
                      <Btn v="danger" sz="sm" onClick={() => handleDelete(c.id)}>Delete</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {showModal && (
        <Modal title={editingCustomer ? "Edit Customer" : "Add Customer"} onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Customer Name *</label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Smith" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Email</label>
              <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@email.com" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Phone</label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 123-4567" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Address</label>
              <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="123 Main St" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>City</label>
              <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Denver" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>State</label>
                <Input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="CO" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>ZIP</label>
                <Input value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} placeholder="80202" />
              </div>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Source</label>
              <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 14 }}>
                {SOURCES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 6, display: "block" }}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional notes..."
                style={{ width: "100%", minHeight: 80, padding: "10px 12px", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 14, resize: "vertical" }} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <Btn v="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn v="primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editingCustomer ? "Update Customer" : "Add Customer"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};
