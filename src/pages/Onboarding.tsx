import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { T } from "@/lib/recon-data";
import { Logo, Btn, Ic } from "@/components/recon/ReconUI";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const STEPS = ["Get Started", "Company Info", "Services", "Your Info"];

const SERVICE_OPTIONS = [
  "Water Damage Restoration",
  "Fire & Smoke Restoration",
  "Mold Remediation",
  "Storm / Wind Damage",
  "Biohazard Cleanup",
  "Contents Restoration",
  "Reconstruction",
  "Commercial Restoration",
];

const Onboarding = () => {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<"blank" | "demo" | null>(null);

  const [company, setCompany] = useState({
    name: "", address: "", city: "", state: "", zip: "",
    phone: "", email: "", website: "", license_number: "",
  });

  const [services, setServices] = useState<string[]>([]);
  const [serviceArea, setServiceArea] = useState("");
  const [teamSize, setTeamSize] = useState("");

  const [ownerInfo, setOwnerInfo] = useState({
    name: "", phone: "", certs: "",
  });

  const toggleService = (s: string) => {
    setServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const canProceed = () => {
    if (step === 0) return workspaceMode !== null;
    if (step === 1) return company.name.trim() && company.phone.trim();
    if (step === 2) return services.length > 0;
    if (step === 3) return ownerInfo.name.trim();
    return true;
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .insert({
          owner_id: user.id,
          name: company.name,
          address: company.address,
          city: company.city,
          state: company.state,
          zip: company.zip,
          phone: company.phone,
          email: company.email || user.email || "",
          website: company.website,
          license_number: company.license_number,
          services,
          service_area: serviceArea,
          team_size: teamSize,
        })
        .select()
        .single();

      if (companyError) throw companyError;

      const certsArray = ownerInfo.certs
        .split(",")
        .map(c => c.trim())
        .filter(Boolean);

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name: ownerInfo.name,
          phone: ownerInfo.phone,
          certs: certsArray,
          company_id: companyData.id,
          onboarding_complete: true,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Seed demo data if requested
      if (workspaceMode === "demo") {
        await seedDemoData(companyData.id, user.id);
      }

      toast({ title: "Welcome to ReCon Pro!", description: `${company.name} is ready.` });
      await refreshProfile();
      window.location.reload();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: T.surfaceHigh, border: `1px solid ${T.border}`,
    borderRadius: 8, padding: "11px 14px", color: T.text, fontSize: 14,
    fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ width: 580, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 40px 32px", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <Logo size={240} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: T.white, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Set Up Your Company</h1>
          <p style={{ color: T.muted, fontSize: 13, margin: 0 }}>Let's get your restoration business running on ReCon Pro</p>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ height: 4, borderRadius: 2, marginBottom: 6, background: i <= step ? T.orange : T.surfaceHigh, transition: "background 0.3s" }} />
              <span style={{ fontSize: 10, color: i <= step ? T.orange : T.dim, fontWeight: i === step ? 700 : 400 }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Step 0: Choose workspace mode */}
        {step === 0 && (
          <div>
            <p style={{ fontSize: 14, color: T.text, marginBottom: 20, marginTop: 0, textAlign: "center" }}>How would you like to start?</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div onClick={() => setWorkspaceMode("blank")} style={{
                padding: "28px 20px", borderRadius: 12, cursor: "pointer", textAlign: "center",
                border: `2px solid ${workspaceMode === "blank" ? T.orange : T.border}`,
                background: workspaceMode === "blank" ? T.orangeDim : T.surfaceHigh,
                transition: "all 0.2s",
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🏗️</div>
                <div style={{ fontWeight: 700, color: T.white, fontSize: 15, marginBottom: 6 }}>Blank Workspace</div>
                <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>Start fresh with an empty company. Add your own jobs, team, and data from scratch.</div>
              </div>
              <div onClick={() => setWorkspaceMode("demo")} style={{
                padding: "28px 20px", borderRadius: 12, cursor: "pointer", textAlign: "center",
                border: `2px solid ${workspaceMode === "demo" ? T.orange : T.border}`,
                background: workspaceMode === "demo" ? T.orangeDim : T.surfaceHigh,
                transition: "all 0.2s",
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
                <div style={{ fontWeight: 700, color: T.white, fontSize: 15, marginBottom: 6 }}>Explore with Demo Data</div>
                <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>See ReCon Pro in action with sample jobs, claims, and drying logs. You can delete demo data anytime.</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Company Info */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Company Name *</label>
              <input value={company.name} onChange={e => setCompany(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Davis Restoration Group" required style={inputStyle} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Company Phone *</label>
                <input value={company.phone} onChange={e => setCompany(p => ({ ...p, phone: e.target.value }))} placeholder="(512) 555-0100" required style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Company Email</label>
                <input value={company.email} onChange={e => setCompany(p => ({ ...p, email: e.target.value }))} placeholder="office@yourcompany.com" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Street Address</label>
              <input value={company.address} onChange={e => setCompany(p => ({ ...p, address: e.target.value }))} placeholder="123 Main Street" style={inputStyle} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>City</label>
                <input value={company.city} onChange={e => setCompany(p => ({ ...p, city: e.target.value }))} placeholder="Austin" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>State</label>
                <input value={company.state} onChange={e => setCompany(p => ({ ...p, state: e.target.value }))} placeholder="TX" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>ZIP</label>
                <input value={company.zip} onChange={e => setCompany(p => ({ ...p, zip: e.target.value }))} placeholder="78701" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>License #</label>
                <input value={company.license_number} onChange={e => setCompany(p => ({ ...p, license_number: e.target.value }))} placeholder="License number" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Website</label>
                <input value={company.website} onChange={e => setCompany(p => ({ ...p, website: e.target.value }))} placeholder="www.yourcompany.com" style={inputStyle} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Services */}
        {step === 2 && (
          <div>
            <p style={{ fontSize: 13, color: T.muted, marginBottom: 16, marginTop: 0 }}>Select the services your company offers:</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              {SERVICE_OPTIONS.map(s => (
                <div key={s} onClick={() => toggleService(s)} style={{
                  padding: "12px 14px", borderRadius: 8, cursor: "pointer",
                  border: `1px solid ${services.includes(s) ? T.orange : T.border}`,
                  background: services.includes(s) ? T.orangeDim : T.surfaceHigh,
                  display: "flex", alignItems: "center", gap: 10, transition: "all 0.15s",
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 4,
                    border: `2px solid ${services.includes(s) ? T.orange : T.dim}`,
                    background: services.includes(s) ? T.orange : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0,
                  }}>{services.includes(s) ? "✓" : ""}</div>
                  <span style={{ fontSize: 12, color: services.includes(s) ? T.white : T.text }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Primary Service Area</label>
                <input value={serviceArea} onChange={e => setServiceArea(e.target.value)} placeholder="e.g. Greater Austin, TX" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Team Size</label>
                <select value={teamSize} onChange={e => setTeamSize(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">Select...</option>
                  <option value="1-5">1–5 employees</option>
                  <option value="6-15">6–15 employees</option>
                  <option value="16-30">16–30 employees</option>
                  <option value="31-50">31–50 employees</option>
                  <option value="50+">50+ employees</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Owner Info */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontSize: 13, color: T.muted, margin: "0 0 4px" }}>Tell us about yourself — the company owner:</p>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Your Full Name *</label>
              <input value={ownerInfo.name} onChange={e => setOwnerInfo(p => ({ ...p, name: e.target.value }))} placeholder="John Davis" required style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Your Phone Number</label>
              <input value={ownerInfo.phone} onChange={e => setOwnerInfo(p => ({ ...p, phone: e.target.value }))} placeholder="(512) 400-1000" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Certifications (comma-separated)</label>
              <input value={ownerInfo.certs} onChange={e => setOwnerInfo(p => ({ ...p, certs: e.target.value }))} placeholder="WRT, ASD, FSRT, IICRC-CR" style={inputStyle} />
              <span style={{ fontSize: 11, color: T.dim, marginTop: 4, display: "block" }}>e.g. WRT, ASD, FSRT, AMRT, OCT</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} style={{
              background: "none", border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 20px",
              color: T.muted, fontSize: 13, fontFamily: "'DM Sans',sans-serif", cursor: "pointer",
            }}>Back</button>
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canProceed()} style={{
              background: canProceed() ? T.orange : T.dim,
              border: "none", borderRadius: 8, padding: "10px 28px",
              color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif",
              cursor: canProceed() ? "pointer" : "not-allowed", opacity: canProceed() ? 1 : 0.5,
            }}>Continue</button>
          ) : (
            <button onClick={handleFinish} disabled={!canProceed() || saving} style={{
              background: canProceed() ? `linear-gradient(135deg, ${T.orange}, #c84009)` : T.dim,
              border: "none", borderRadius: 8, padding: "10px 28px",
              color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
              cursor: canProceed() && !saving ? "pointer" : "not-allowed",
              boxShadow: canProceed() ? `0 4px 16px ${T.orangeGlow}` : "none",
            }}>{saving ? "Setting up..." : "Launch ReCon Pro 🚀"}</button>
          )}
        </div>
      </div>
    </div>
  );
};

// Demo data seeder — creates isolated sample data for this company only
async function seedDemoData(companyId: string, userId: string) {
  const demoJobs = [
    { id: `DEMO-001`, customer: "Martinez Family", address: "4521 Oak Creek Dr, Austin TX 78745", phone: "(512) 555-0201", loss_type: "water", loss_subtype: "Cat 2 – Grey", stage: "drying", payment_type: "insurance", carrier: "State Farm", claim_no: "SF-2026-88412", adjuster: "Lisa Chen", adjuster_phone: "(800) 555-0180", adjuster_email: "lchen@statefarm.com", date_of_loss: "2026-03-01", pm_name: "Chris Martinez", priority: "high", notes: "Kitchen supply line burst under sink. Affected kitchen, hallway, and adjacent living room. Hardwood flooring throughout.", day_of_drying: 3, contract_value: 28500, mitigation_value: 8200, company_id: companyId, created_by: userId },
    { id: `DEMO-002`, customer: "Thompson Residence", address: "782 Elm Street, Round Rock TX 78664", phone: "(512) 555-0302", loss_type: "water", loss_subtype: "Cat 1 – Clean", stage: "estimate_submitted", payment_type: "insurance", carrier: "Travelers", claim_no: "TR-2026-44219", adjuster: "Mark Johnson", adjuster_phone: "(800) 555-0220", adjuster_email: "mjohnson@travelers.com", date_of_loss: "2026-02-28", pm_name: "Chris Martinez", priority: "normal", notes: "Upstairs bathroom overflow. Affected master bedroom ceiling and walls below.", contract_value: 15800, mitigation_value: 4500, company_id: companyId, created_by: userId },
    { id: `DEMO-003`, customer: "Cedar Park Office Complex", address: "1200 Commercial Blvd, Cedar Park TX 78613", phone: "(512) 555-0403", loss_type: "fire", loss_subtype: "Kitchen Fire", stage: "reconstruction", payment_type: "insurance", carrier: "Zurich", claim_no: "ZU-2026-77031", adjuster: "Sarah Williams", adjuster_phone: "(800) 555-0340", adjuster_email: "swilliams@zurich.com", date_of_loss: "2026-02-15", pm_name: "Jake Reynolds", priority: "normal", notes: "Commercial kitchen fire. Significant smoke damage throughout 2nd floor. Full reconstruction scope.", contract_value: 142000, mitigation_value: 12000, recon: true, recon_value: 130000, company_id: companyId, created_by: userId },
    { id: `DEMO-004`, customer: "Williams Home", address: "3344 Sunset Ridge, Pflugerville TX 78660", phone: "(512) 555-0504", loss_type: "mold", loss_subtype: "Type 2 (med)", stage: "mitigation", payment_type: "insurance", carrier: "USAA", claim_no: "US-2026-55820", adjuster: "David Brown", adjuster_email: "dbrown@usaa.com", date_of_loss: "2026-03-03", pm_name: "Chris Martinez", priority: "normal", notes: "Mold discovered behind master bathroom shower wall. Spread to adjacent closet. Full containment required.", contract_value: 18000, mitigation_value: 18000, company_id: companyId, created_by: userId },
    { id: `DEMO-005`, customer: "Garcia Property", address: "9901 Lake Austin Blvd, Austin TX 78703", phone: "(512) 555-0605", loss_type: "storm", loss_subtype: "Hail", stage: "supplement", payment_type: "insurance", carrier: "Allstate", claim_no: "AL-2026-33147", adjuster: "Jennifer Lee", adjuster_email: "jlee@allstate.com", date_of_loss: "2026-02-20", pm_name: "Jake Reynolds", priority: "normal", notes: "Hail damage to roof, siding, and gutters. Interior water intrusion in 3 rooms.", contract_value: 65000, company_id: companyId, created_by: userId },
    { id: `DEMO-006`, customer: "Patel Residence", address: "6700 Barton Springs Rd, Austin TX 78704", phone: "(512) 555-0706", loss_type: "water", loss_subtype: "Cat 3 – Black", stage: "carrier_approval", payment_type: "insurance", carrier: "State Farm", claim_no: "SF-2026-91203", adjuster: "Lisa Chen", adjuster_email: "lchen@statefarm.com", date_of_loss: "2026-02-25", pm_name: "Chris Martinez", priority: "high", notes: "Sewage backup from main line. Full demo of affected areas including laundry room and garage.", contract_value: 34200, mitigation_value: 11500, company_id: companyId, created_by: userId },
    { id: `DEMO-007`, customer: "Riverside Apartments Unit 4B", address: "2100 Riverside Dr #4B, Austin TX 78741", phone: "(512) 555-0807", loss_type: "water", loss_subtype: "Cat 1 – Clean", stage: "closed", payment_type: "self_pay", date_of_loss: "2026-01-15", pm_name: "Jake Reynolds", priority: "normal", notes: "AC condensate line overflow. Minor drywall and carpet damage. Completed in 5 days. Self-pay customer.", contract_value: 6800, mitigation_value: 6800, company_id: companyId, created_by: userId },
  ];

  for (const job of demoJobs) {
    await supabase.from("jobs").insert(job as any);
  }

  // Demo drying logs
  await supabase.from("drying_logs").insert([
    { job_id: "DEMO-001", day: 1, date: "2026-03-02", tech_name: "Mike Torres", temp: 76, rh: 52, gpp: 68, equipment: { dehus: 2, airMovers: 6, scrubbers: 1 }, readings: [{ room: "Kitchen", material: "Subfloor (OSB)", reading: 32, dry: 16, status: "wet" }, { room: "Hallway", material: "Drywall", reading: 24, dry: 16, status: "wet" }, { room: "Living Room", material: "Hardwood", reading: 18, dry: 12, status: "wet" }], notes: "Initial setup. 2ft flood cuts in kitchen. Containment set.", created_by: userId },
    { job_id: "DEMO-001", day: 2, date: "2026-03-03", tech_name: "Mike Torres", temp: 78, rh: 48, gpp: 58, equipment: { dehus: 2, airMovers: 6, scrubbers: 1 }, readings: [{ room: "Kitchen", material: "Subfloor (OSB)", reading: 26, dry: 16, status: "wet" }, { room: "Hallway", material: "Drywall", reading: 19, dry: 16, status: "wet" }, { room: "Living Room", material: "Hardwood", reading: 15, dry: 12, status: "wet" }], notes: "Good progress. GPP dropping. Kitchen subfloor still elevated.", created_by: userId },
    { job_id: "DEMO-001", day: 3, date: "2026-03-04", tech_name: "Mike Torres", temp: 79, rh: 44, gpp: 48, equipment: { dehus: 2, airMovers: 6, scrubbers: 1 }, readings: [{ room: "Kitchen", material: "Subfloor (OSB)", reading: 20, dry: 16, status: "wet" }, { room: "Hallway", material: "Drywall", reading: 15, dry: 16, status: "dry" }, { room: "Living Room", material: "Hardwood", reading: 11, dry: 12, status: "dry" }], notes: "Hallway and living room at dry standard. Kitchen subfloor still needs 1-2 more days.", created_by: userId },
  ] as any[]);

  // Demo subcontractors
  await supabase.from("subcontractors").insert([
    { name: "Roberto Vasquez", company_name: "RV Drywall Pros", trade: "Drywall", phone: "(512) 555-3001", email: "roberto@rvdrywall.com", status: "active", company_id: companyId, created_by: userId },
    { name: "Amy Chen", company_name: "Austin Flooring Solutions", trade: "Flooring", phone: "(512) 555-3002", email: "amy@austinflooring.com", license_number: "FL-88221", status: "active", company_id: companyId, created_by: userId },
    { name: "Derek Williams", company_name: "Pro Paint Austin", trade: "Painting", phone: "(512) 555-3003", email: "derek@propaintaustin.com", status: "active", company_id: companyId, created_by: userId },
    { name: "Sam Mitchell", company_name: "Mitchell Roofing", trade: "Roofing", phone: "(512) 555-3004", email: "sam@mitchellroofing.com", license_number: "RF-44190", status: "active", company_id: companyId, created_by: userId },
  ] as any[]);

  // Demo payments
  await supabase.from("payments").insert([
    { job_id: "DEMO-003", amount: 45000, payment_type: "initial", source: "carrier", date_received: "2026-02-28", check_number: "CHK-881204", company_id: companyId, created_by: userId },
    { job_id: "DEMO-007", amount: 6800, payment_type: "initial", source: "homeowner", date_received: "2026-02-10", deductible_amount: 0, deductible_collected: false, company_id: companyId, created_by: userId },
    { job_id: "DEMO-001", amount: 8200, payment_type: "initial", source: "carrier", date_received: "2026-03-05", check_number: "CHK-991830", deductible_amount: 2500, deductible_collected: false, company_id: companyId, created_by: userId },
  ] as any[]);

  // Demo supplements
  await supabase.from("supplements").insert([
    { job_id: "DEMO-005", supplement_number: 1, status: "submitted", contractor_total: 65000, carrier_total: 48200, difference: 16800, justification: "Missing line items for interior water intrusion repairs, soffit replacement, and gutter system.", submitted_date: "2026-03-01", company_id: companyId, created_by: userId },
  ] as any[]);

  // Demo activity logs — realistic restoration operations timeline
  await supabase.from("activity_logs").insert([
    { title: "Job DEMO-007 closed", description: "Riverside Apartments – all payments collected, job complete", action_type: "status_change", job_id: "DEMO-007", user_name: "Jake Reynolds", company_id: companyId, user_id: userId },
    { title: "Payment received from Liberty Mutual", description: "$6,800 initial payment – check CHK-770112", action_type: "payment", job_id: "DEMO-007", user_name: "Office Admin", company_id: companyId, user_id: userId },
    { title: "Supplement submitted to Allstate", description: "$16,800 in missing line items identified for Garcia Property", action_type: "status_change", job_id: "DEMO-005", user_name: "Jake Reynolds", company_id: companyId, user_id: userId },
    { title: "Drying Day 3 logged – Martinez Family", description: "GPP: 48 · Hallway and living room at dry standard", action_type: "drying", job_id: "DEMO-001", user_name: "Mike Torres", company_id: companyId, user_id: userId },
    { title: "Photos uploaded – Cedar Park Office", description: "12 photos added: pre-demo, containment, and progress shots", action_type: "photo", job_id: "DEMO-003", user_name: "Jake Reynolds", company_id: companyId, user_id: userId },
    { title: "Estimate submitted to Travelers", description: "Xactimate estimate for Thompson Residence – $15,800", action_type: "status_change", job_id: "DEMO-002", user_name: "Chris Martinez", company_id: companyId, user_id: userId },
    { title: "Payment received from State Farm", description: "$8,200 mitigation payment for Martinez Family", action_type: "payment", job_id: "DEMO-001", user_name: "Office Admin", company_id: companyId, user_id: userId },
    { title: "Subcontractor assigned – RV Drywall Pros", description: "Drywall scope for Cedar Park Office Complex reconstruction", action_type: "note", job_id: "DEMO-003", user_name: "Jake Reynolds", company_id: companyId, user_id: userId },
    { title: "Job DEMO-006 created", description: "Cat 3 sewage backup – Patel Residence, Barton Springs", action_type: "status_change", job_id: "DEMO-006", user_name: "Chris Martinez", company_id: companyId, user_id: userId },
    { title: "Reconstruction started – Cedar Park Office", description: "Full demo complete, framing and drywall scope underway", action_type: "status_change", job_id: "DEMO-003", user_name: "Jake Reynolds", company_id: companyId, user_id: userId },
  ] as any[]);
}

export default Onboarding;
