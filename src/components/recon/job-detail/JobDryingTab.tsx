import { useState, useEffect, useCallback } from "react";
import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Inp, Sel } from "@/components/recon/ReconUI";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { DbJob } from "@/hooks/useJobs";

const ROOMS = ["Kitchen", "Living Room", "Bedroom 1", "Bedroom 2", "Bathroom", "Hallway", "Basement", "Garage", "Laundry", "Dining Room", "Office"];
const MATERIALS = ["Drywall", "Subfloor (OSB)", "Subfloor (Plywood)", "Hardwood", "Carpet", "Concrete", "Baseboard", "Cabinet Toe Kick", "Insulation", "Framing"];

export const JobDryingTab = ({ job }: { job: DbJob }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const isWater = job.loss_type === "water";

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("drying_logs").select("*").eq("job_id", job.id).order("day", { ascending: true });
    if (!error) setLogs(data || []);
    setLoading(false);
  }, [job.id]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    room: ROOMS[0], material: MATERIALS[0],
    moistureReading: "", dryStandard: "16",
    temp: "", rh: "", gpp: "",
    airMovers: "0", dehumidifiers: "0", airScrubbers: "0",
    notes: "",
  });

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const nextDay = logs.length + 1;
    const reading = {
      room: formData.room, material: formData.material,
      reading: parseFloat(formData.moistureReading) || 0,
      dry: parseFloat(formData.dryStandard) || 16,
      status: (parseFloat(formData.moistureReading) || 0) <= (parseFloat(formData.dryStandard) || 16) ? "dry" : "wet",
    };

    const { error } = await supabase.from("drying_logs").insert({
      job_id: job.id, day: nextDay, date: formData.date,
      tech_name: profile?.name || "Technician",
      temp: parseFloat(formData.temp) || null,
      rh: parseFloat(formData.rh) || null,
      gpp: parseFloat(formData.gpp) || null,
      equipment: { airMovers: parseInt(formData.airMovers) || 0, dehus: parseInt(formData.dehumidifiers) || 0, scrubbers: parseInt(formData.airScrubbers) || 0 },
      readings: [reading], notes: formData.notes, created_by: user.id,
    } as any);

    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Drying log saved", description: `Day ${nextDay} recorded` }); setShowForm(false); fetchLogs(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this drying log entry?")) return;
    const { error } = await supabase.from("drying_logs").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Entry deleted" }); fetchLogs(); }
  };

  if (!isWater) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <Ic n="moisture" s={32} c={T.dim} />
        <div style={{ marginTop: 12, fontSize: 13, color: T.muted }}>Drying logs are only applicable for water damage jobs.</div>
        <div style={{ fontSize: 11, color: T.dim, marginTop: 4 }}>This section is available as internal reference documentation when needed.</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Drying Reference Logs</div>
          <div style={{ fontSize: 12, color: T.muted }}>{logs.length} entries — internal reference documentation</div>
          <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>
            For compliance reporting, use your mitigation platform (DryBook, MICA, etc.)
          </div>
        </div>
        <Btn v="primary" sz="sm" icon="plus" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Entry"}
        </Btn>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <Card style={{ marginBottom: 16, borderColor: `${T.orange}44` }}>
          <div style={{ fontWeight: 700, color: T.orange, fontSize: 14, marginBottom: 14 }}>New Drying Entry — Day {logs.length + 1}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Inp label="Date" type="date" value={formData.date} onChange={e => setFormData(f => ({ ...f, date: e.target.value }))} required />
            <Sel label="Room / Area" options={ROOMS} value={formData.room} onChange={e => setFormData(f => ({ ...f, room: e.target.value }))} />
            <Sel label="Material" options={MATERIALS} value={formData.material} onChange={e => setFormData(f => ({ ...f, material: e.target.value }))} />
            <Inp label="Moisture Reading (%)" type="number" placeholder="e.g. 28" value={formData.moistureReading} onChange={e => setFormData(f => ({ ...f, moistureReading: e.target.value }))} />
            <Inp label="Dry Standard (%)" type="number" value={formData.dryStandard} onChange={e => setFormData(f => ({ ...f, dryStandard: e.target.value }))} />
            <Inp label="Temperature (°F)" type="number" placeholder="e.g. 78" value={formData.temp} onChange={e => setFormData(f => ({ ...f, temp: e.target.value }))} />
            <Inp label="Relative Humidity (%)" type="number" placeholder="e.g. 45" value={formData.rh} onChange={e => setFormData(f => ({ ...f, rh: e.target.value }))} />
            <Inp label="GPP" type="number" placeholder="e.g. 52" value={formData.gpp} onChange={e => setFormData(f => ({ ...f, gpp: e.target.value }))} />
          </div>
          <div style={{ marginTop: 12, fontWeight: 600, color: T.muted, fontSize: 12, marginBottom: 8 }}>EQUIPMENT ON SITE (optional)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Inp label="Air Movers" type="number" value={formData.airMovers} onChange={e => setFormData(f => ({ ...f, airMovers: e.target.value }))} />
            <Inp label="Dehumidifiers" type="number" value={formData.dehumidifiers} onChange={e => setFormData(f => ({ ...f, dehumidifiers: e.target.value }))} />
            <Inp label="Air Scrubbers" type="number" value={formData.airScrubbers} onChange={e => setFormData(f => ({ ...f, airScrubbers: e.target.value }))} />
          </div>
          <div style={{ marginTop: 12 }}>
            <Inp label="Notes" placeholder="Observations, drying progress, concerns..." value={formData.notes} onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
            <Btn v="secondary" onClick={() => setShowForm(false)}>Cancel</Btn>
            <Btn v="primary" icon="check" onClick={handleSave} disabled={saving || !formData.moistureReading}>
              {saving ? "Saving..." : "Save Entry"}
            </Btn>
          </div>
        </Card>
      )}

      {/* Log entries */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading...</div>
      ) : logs.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: T.dim }}>
          <Ic n="moisture" s={32} c={T.dim} />
          <div style={{ marginTop: 12, fontSize: 13 }}>No drying logs yet</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {logs.map((log: any, i: number) => (
            <Card key={i} style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ background: T.orangeDim, border: `1px solid ${T.orange}44`, borderRadius: 8, padding: "6px 12px", textAlign: "center", minWidth: 50 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: T.orange }}>D{log.day}</div>
                    <div style={{ fontSize: 9, color: T.muted }}>{log.date}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>Tech: {log.tech_name}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>
                      {log.equipment ? `${log.equipment.dehus || 0} dehus · ${log.equipment.airMovers || 0} air movers · ${log.equipment.scrubbers || 0} scrubbers` : "No equipment data"}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", gap: 16 }}>
                    {[
                      { label: "GPP", value: log.gpp, color: (log.gpp || 0) < 50 ? T.greenBright : T.yellowBright },
                      { label: "TEMP", value: log.temp ? `${log.temp}°F` : "—", color: T.text },
                      { label: "RH", value: log.rh ? `${log.rh}%` : "—", color: T.text },
                    ].map(m => (
                      <div key={m.label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: T.dim }}>{m.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: m.color }}>{m.value || "—"}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => handleDelete(log.id)} title="Delete" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    <Ic n="x" s={14} c={T.redBright} />
                  </button>
                </div>
              </div>
              {Array.isArray(log.readings) && log.readings.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: log.notes ? 10 : 0 }}>
                  {log.readings.map((r: any, ri: number) => (
                    <div key={ri} style={{ background: r.status === "wet" ? T.yellowDim : T.greenDim, border: `1px solid ${r.status === "wet" ? T.yellowBright + "44" : T.greenBright + "44"}`, borderRadius: 7, padding: "5px 10px", textAlign: "center", minWidth: 70 }}>
                      <div style={{ fontSize: 10, color: r.status === "wet" ? T.yellowBright : T.greenBright, fontWeight: 500 }}>{r.room}</div>
                      <div style={{ fontSize: 9, color: T.muted }}>{r.material}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: r.status === "wet" ? T.yellowBright : T.greenBright }}>{r.reading}%</div>
                      <div style={{ fontSize: 8, color: r.status === "wet" ? T.yellowBright : T.greenBright }}>{r.status === "dry" ? "✓ DRY" : `WET (${r.dry})`}</div>
                    </div>
                  ))}
                </div>
              )}
              {log.notes && <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>{log.notes}</div>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
