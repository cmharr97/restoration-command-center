import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { T } from "@/lib/recon-data";
import { Logo, Btn, Inp, Sel } from "@/components/recon/ReconUI";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const STEPS = ["Company Info", "Services", "Your Info"];

const SERVICE_OPTIONS = [
  "Water Damage Restoration",
  "Fire & Smoke Restoration",
  "Mold Remediation",
  "Storm / Wind Damage",
  "Biohazard Cleanup",
  "Contents Restoration",
  "Reconstruction",
  "Commercial Restoration",
  "Carpet & Upholstery Cleaning",
];

const Onboarding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [company, setCompany] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    website: "",
    license_number: "",
  });

  const [services, setServices] = useState<string[]>([]);
  const [serviceArea, setServiceArea] = useState("");
  const [teamSize, setTeamSize] = useState("");

  const [ownerInfo, setOwnerInfo] = useState({
    name: "",
    phone: "",
    certs: "",
  });

  const toggleService = (s: string) => {
    setServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const canProceed = () => {
    if (step === 0) return company.name.trim() && company.phone.trim();
    if (step === 1) return services.length > 0;
    if (step === 2) return ownerInfo.name.trim();
    return true;
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Create company
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

      // Update profile with company info and mark onboarding complete
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

      toast({ title: "Welcome to ReCon Pro!", description: `${company.name} is all set up.` });
      // Force reload to pick up new profile state
      window.location.reload();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: T.surfaceHigh,
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    padding: "11px 14px",
    color: T.text,
    fontSize: 14,
    fontFamily: "'DM Sans',sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ width: 560, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "36px 40px", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <Logo size={44} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: T.white, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Set Up Your Company</h1>
          <p style={{ color: T.muted, fontSize: 13, margin: 0 }}>Let's get your restoration business running on ReCon Pro</p>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                height: 4, borderRadius: 2, marginBottom: 6,
                background: i <= step ? T.orange : T.surfaceHigh,
                transition: "background 0.3s",
              }} />
              <span style={{ fontSize: 10, color: i <= step ? T.orange : T.dim, fontWeight: i === step ? 700 : 400 }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Step 0: Company Info */}
        {step === 0 && (
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
                <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>State Contractor License #</label>
                <input value={company.license_number} onChange={e => setCompany(p => ({ ...p, license_number: e.target.value }))} placeholder="License number" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Website</label>
                <input value={company.website} onChange={e => setCompany(p => ({ ...p, website: e.target.value }))} placeholder="www.yourcompany.com" style={inputStyle} />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Services */}
        {step === 1 && (
          <div>
            <p style={{ fontSize: 13, color: T.muted, marginBottom: 16, marginTop: 0 }}>Select the services your company offers:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {SERVICE_OPTIONS.map(s => (
                <div key={s} onClick={() => toggleService(s)} style={{
                  padding: "12px 16px", borderRadius: 8, cursor: "pointer",
                  border: `1px solid ${services.includes(s) ? T.orange : T.border}`,
                  background: services.includes(s) ? T.orangeDim : T.surfaceHigh,
                  display: "flex", alignItems: "center", gap: 10,
                  transition: "all 0.15s",
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 4,
                    border: `2px solid ${services.includes(s) ? T.orange : T.dim}`,
                    background: services.includes(s) ? T.orange : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 12, fontWeight: 700,
                  }}>{services.includes(s) ? "✓" : ""}</div>
                  <span style={{ fontSize: 13, color: services.includes(s) ? T.white : T.text }}>{s}</span>
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

        {/* Step 2: Owner Info */}
        {step === 2 && (
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

export default Onboarding;
