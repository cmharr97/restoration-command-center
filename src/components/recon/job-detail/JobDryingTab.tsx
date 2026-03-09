import { useState } from "react";
import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Inp, Sel } from "@/components/recon/ReconUI";
import { useDryingLogs } from "@/hooks/useJobs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { DbJob } from "@/hooks/useJobs";

const ROOMS = ["Kitchen", "Living Room", "Bedroom 1", "Bedroom 2", "Bathroom", "Hallway", "Basement", "Garage", "Laundry", "Dining Room", "Office"];
const MATERIALS = ["Drywall", "Subfloor (OSB)", "Subfloor (Plywood)", "Hardwood", "Carpet", "Concrete", "Baseboard", "Cabinet Toe Kick", "Insulation", "Framing"];

export const JobDryingTab = ({ job }: { job: DbJob }) => {
  const { logs, loading } = useDryingLogs(job.id);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const isWater = job.loss_type === "water";

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    room: ROOMS[0],
    material: MATERIALS[0],
    moistureReading: "",
    dryStandard: "16",
    temp: "",
    rh: "",
    gpp: "",
    airMovers: "0",
    dehumidifiers: "0",
    airScrubbers: "0",
    notes: "",
  });

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const nextDay = logs.length + 1;
    const reading = {
      room: formData.room,
      material: formData.material,
      reading: parseFloat(formData.moistureReading) || 0,
      dry: parseFloat(formData.dryStandard) || 16,
      status: (parseFloat(formData.moistureReading) || 0) <= (parseFloat(formData.dryStandard) || 16) ? "dry" : "wet",
    };

    const { error } = await supabase.from("drying_logs").insert({
      job_id: job.id,
      day: nextDay,
      date: formData.date,
      tech_name: profile?.name || "Technician",
      temp: parseFloat(formData.temp) || null,
      rh: parseFloat(formData.rh) || null,
      gpp: parseFloat(formData.gpp) || null,
      equipment: {
        airMovers: parseInt(formData.airMovers) || 0,
        dehus: parseInt(formData.dehumidifiers) || 0,
        scrubbers: parseInt(formData.airScrubbers) || 0,
      },
      readings: [reading],
      notes: formData.notes,
      created_by: user.id,
    } as any);

    if (error) {
      toast({ title: "Error saving log", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Drying log saved", description: `Day ${nextDay} recorded` });
      setShowForm(false);
      window.location.reload();
    }
    setSaving(false);
  };

  if (!isWater) return <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Drying logs are only used for water damage jobs</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>IICRC S500 Drying Log</div>
          <div style={{ fontSize: 12, color: T.muted }}>{logs.length} entries · Day {logs.length} of drying</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn v="secondary" sz="sm" onClick={() => window.print()}>Print Log</Btn>
          <Btn v="primary" sz="sm" icon="plus" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Reading"}
          </Btn>
        </div>
      </div>

      {/* Add Reading Form - Mobile Friendly */}
      {showForm && (
        <Card style={{ marginBottom: 16, borderColor: `${T.orange}44` }}>
          <div style={{ fontWeight: 700, color: T.orange, fontSize: 14, marginBottom: 14 }}>New Drying Reading — Day {logs.length + 1}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Inp label="Date" type="date" value={formData.date} onChange={e => setFormData(f => ({ ...f, date: e.target.value }))} required />
            <Sel label="Room / Area" options={ROOMS} value={formData.room} onChange={e => setFormData(f => ({ ...f, room: e.target.value }))} />
            <Sel label="Material" options={MATERIALS} value={formData.material} onChange={e => setFormData(f => ({ ...f, material: e.target.value }))} />
            <Inp label="Moisture Reading (%)" type="number" placeholder="e.g. 28" value={formData.moistureReading} onChange={e => setFormData(f => ({ ...f, moistureReading: e.target.value }))} required />
            <Inp label="Dry Standard (%)" type="number" value={formData.dryStandard} onChange={e => setFormData(f => ({ ...f, dryStandard: e.target.value }))} />
            <Inp label="Temperature (°F)" type="number" placeholder="e.g. 78" value={formData.temp} onChange={e => setFormData(f => ({ ...f, temp: e.target.value }))} />
            <Inp label="Relative Humidity (%)" type="number" placeholder="e.g. 45" value={formData.rh} onChange={e => setFormData(f => ({ ...f, rh: e.target.value }))} />
            <Inp label="GPP" type="number" placeholder="e.g. 52" value={formData.gpp} onChange={e => setFormData(f => ({ ...f, gpp: e.target.value }))} />
          </div>
          <div style={{ marginTop: 12, fontWeight: 600, color: T.muted, fontSize: 12, marginBottom: 8 }}>EQUIPMENT ON SITE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Inp label="Air Movers" type="number" value={formData.airMovers} onChange={e => setFormData(f => ({ ...f, airMovers: e.target.value }))} />
            <Inp label="Dehumidifiers" type="number" value={formData.dehumidifiers} onChange={e => setFormData(f => ({ ...f, dehumidifiers: e.target.value }))} />
            <Inp label="Air Scrubbers" type="number" value={formData.airScrubbers} onChange={e => setFormData(f => ({ ...f, airScrubbers: e.target.value }))} />
          </div>
          <div style={{ marginTop: 12 }}>
            <Inp label="Daily Notes" placeholder="Drying progress, observations, concerns..." value={formData.notes} onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
            <Btn v="secondary" sz="md" onClick={() => setShowForm(false)}>Cancel</Btn>
            <Btn v="primary" sz="md" icon="check" onClick={handleSave} disabled={saving || !formData.moistureReading}>
              {saving ? "Saving..." : "Save Reading"}
            </Btn>
          </div>
        </Card>
      )}

      {/* Drying Progress Chart (simple visual) */}
      {logs.length > 1 && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 14, marginBottom: 12 }}>Drying Progress</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80 }}>
            {logs.map((log: any, i: number) => {
              const gpp = log.gpp || 0;
              const maxGpp = Math.max(...logs.map((l: any) => l.gpp || 1));
              const height = maxGpp > 0 ? (gpp / maxGpp) * 70 : 10;
              const isGood = gpp < 50;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 9, color: T.muted }}>{gpp}</div>
                  <div style={{ width: "100%", maxWidth: 32, height, background: isGood ? T.greenBright : T.yellowBright, borderRadius: "4px 4px 0 0", transition: "height 0.3s" }} />
                  <div style={{ fontSize: 9, color: T.dim }}>D{log.day}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 16, justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: T.greenBright }} /><span style={{ fontSize: 10, color: T.muted }}>GPP &lt; 50 (Target)</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: T.yellowBright }} /><span style={{ fontSize: 10, color: T.muted }}>GPP ≥ 50 (Elevated)</span></div>
          </div>
        </Card>
      )}

      {/* Log entries */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading drying logs...</div>
      ) : logs.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: T.dim }}>
          <Ic n="moisture" s={32} c={T.dim} />
          <div style={{ marginTop: 12, fontSize: 13 }}>No drying logs yet</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>Add your first reading to start tracking</div>
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
