import { useState } from "react";
import { T, TRADES } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Inp, Sel } from "@/components/recon/ReconUI";
import { useSubcontractors, useJobs } from "@/hooks/useJobs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const SubcontractorsPageFull = () => {
  const { subs, loading } = useSubcontractors();
  const { jobs } = useJobs();
  const { user, companyId } = useAuth();
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [filterTrade, setFilterTrade] = useState("all");
  const [form, setForm] = useState({ name: "", company_name: "", trade: "General Labor", phone: "", email: "", license_number: "", notes: "" });

  const filtered = filterTrade === "all" ? subs : subs.filter((s: any) => s.trade === filterTrade);

  const tradeColors: Record<string, string> = {
    Roofing: "red", Drywall: "blue", Flooring: "teal", Cabinets: "purple",
    Painting: "yellow", Framing: "orange", Plumbing: "blue", Electrical: "yellow",
    HVAC: "green", Insulation: "teal", Tile: "purple",
  };

  const handleAdd = async () => {
    if (!form.name.trim() || !user) return;
    const { error } = await supabase.from("subcontractors").insert({
      name: form.name, company_name: form.company_name, trade: form.trade,
      phone: form.phone, email: form.email, license_number: form.license_number,
      notes: form.notes, created_by: user.id, company_id: companyId || null,
    } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Subcontractor added", description: form.name });
      setShowAdd(false);
      setForm({ name: "", company_name: "", trade: "General Labor", phone: "", email: "", license_number: "", notes: "" });
      // Trigger page re-render by reloading subs — the hook auto-fetches on mount
      window.dispatchEvent(new Event('subs-updated'));
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: T.muted }}>Loading subcontractors...</div>;

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Subcontractors</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Manage trade partners{subs.length > 0 ? ` — ${subs.length} registered` : ""}</p>
        </div>
        <Btn v="primary" sz="sm" icon="plus" onClick={() => setShowAdd(true)}>Add Subcontractor</Btn>
      </div>
      <div style={{ padding: "0 28px" }}>
        {subs.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: T.yellowDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Ic n="truck" s={28} c={T.yellowBright}/>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.white }}>Trade Partner Management</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 8, maxWidth: 440, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              Register your drywall, flooring, roofing, plumbing, and other trade partners. Assign them to jobs, track work completion, and manage documentation.
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
              {["Drywall", "Flooring", "Roofing", "Plumbing", "Painting", "Electrical"].map(t => (
                <span key={t} style={{ fontSize: 11, color: T.muted, background: T.surfaceHigh, padding: "4px 10px", borderRadius: 12, border: `1px solid ${T.border}` }}>{t}</span>
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              <Btn v="primary" icon="plus" onClick={() => setShowAdd(true)}>Add Your First Subcontractor</Btn>
            </div>
          </Card>
        ) : (
          <>
            {/* Trade filter */}
            <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto" }}>
              <div onClick={() => setFilterTrade("all")} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", background: filterTrade === "all" ? T.orange : T.surfaceHigh, color: filterTrade === "all" ? "#fff" : T.muted, border: `1px solid ${filterTrade === "all" ? T.orange : T.border}`, fontWeight: filterTrade === "all" ? 600 : 400 }}>All ({subs.length})</div>
              {TRADES.filter(t => subs.some((s: any) => s.trade === t)).map(trade => (
                <div key={trade} onClick={() => setFilterTrade(trade)} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", background: filterTrade === trade ? T.orangeDim : T.surfaceHigh, color: filterTrade === trade ? T.orange : T.muted, border: `1px solid ${filterTrade === trade ? T.orange + "44" : T.border}`, fontWeight: filterTrade === trade ? 600 : 400, whiteSpace: "nowrap" }}>{trade} ({subs.filter((s: any) => s.trade === trade).length})</div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px,1fr))", gap: 10 }}>
              {filtered.map((sub: any) => (
                <Card key={sub.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>{sub.name}</div>
                      {sub.company_name && <div style={{ fontSize: 12, color: T.muted }}>{sub.company_name}</div>}
                    </div>
                    <Badge color={tradeColors[sub.trade] || "gray"} small>{sub.trade}</Badge>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {sub.phone && <div style={{ fontSize: 12, color: T.text }}>📞 {sub.phone}</div>}
                    {sub.email && <div style={{ fontSize: 12, color: T.text }}>✉️ {sub.email}</div>}
                    {sub.license_number && <div style={{ fontSize: 11, color: T.muted }}>License: {sub.license_number}</div>}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Badge color={sub.status === "active" ? "green" : "gray"} small dot>{sub.status || "active"}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }} onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()}>
            <Card style={{ width: 480, background: T.surface }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.white }}>Add Subcontractor</h3>
                <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted }}><Ic n="x" s={18}/></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <Inp label="Contact Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required/>
                <Inp label="Company Name" value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))}/>
                <Sel label="Trade *" options={TRADES} value={form.trade} onChange={e => setForm(p => ({ ...p, trade: e.target.value }))}/>
                <Inp label="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}/>
                <Inp label="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}/>
                <Inp label="License #" value={form.license_number} onChange={e => setForm(p => ({ ...p, license_number: e.target.value }))}/>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <Btn v="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
                <Btn v="primary" onClick={handleAdd} disabled={!form.name.trim()}>Add Subcontractor</Btn>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
