import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { T } from "@/lib/recon-data";
import { Logo } from "@/components/recon/ReconUI";
import { useToast } from "@/hooks/use-toast";

const ROLES = [
  { value: "owner", label: "Owner / Admin", desc: "Full access — you run the company" },
  { value: "project_manager", label: "Project Manager", desc: "Manage jobs, teams, and schedules" },
  { value: "estimator", label: "Estimator", desc: "Write and manage estimates" },
  { value: "office_admin", label: "Office Admin", desc: "Billing, customers, and scheduling" },
  { value: "field_tech", label: "Field Technician", desc: "Drying logs, moisture readings, job tasks" },
  { value: "subcontractor", label: "Subcontractor", desc: "View assigned jobs only" },
];

const Auth = ({ initialMode = "login", onBack }: { initialMode?: "login" | "signup"; onBack?: () => void }) => {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("owner");
  const [phone, setPhone] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isOwnerSignup = mode === "signup" && role === "owner";
  const isTeamSignup = mode === "signup" && role !== "owner";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, role, phone } },
        });
        if (error) throw error;
        toast({ title: "Account created!", description: isOwnerSignup ? "Let's set up your company." : "You're now logged in." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
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
    fontFamily: "'Inter',sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ width: 460, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "36px 40px", position: "relative" }}>
        {onBack && (
          <button onClick={onBack} style={{ position: "absolute", top: 16, left: 16, background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            ← Back
          </button>
        )}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <Logo size={280} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: T.white, margin: "0 0 4px", letterSpacing: "-0.02em" }}>ReCon Pro</h1>
          <p style={{ color: T.muted, fontSize: 13, margin: 0 }}>
            {mode === "login" ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Your Full Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="John Davis" required style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Your Role *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {ROLES.map(r => (
                    <div key={r.value} onClick={() => setRole(r.value)} style={{
                      padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                      border: `1px solid ${role === r.value ? T.orange : T.border}`,
                      background: role === r.value ? T.orangeDim : T.surfaceHigh,
                      transition: "all 0.15s",
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: role === r.value ? T.orange : T.white }}>{r.label}</div>
                      <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Phone Number</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 000-0000" style={inputStyle} />
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Email *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Password *</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} style={inputStyle} />
            {mode === "signup" && <span style={{ fontSize: 10, color: T.dim, marginTop: 3, display: "block" }}>Minimum 6 characters</span>}
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "12px 0", borderRadius: 8, border: "none",
            background: `linear-gradient(135deg, ${T.orange}, #c84009)`,
            color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
            marginTop: 4, boxShadow: `0 4px 16px ${T.orangeGlow}`,
          }}>
            {loading ? "Loading..." : mode === "login" ? "Sign In" : isOwnerSignup ? "Create Account & Set Up Company" : "Create Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span style={{ fontSize: 13, color: T.muted }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ fontSize: 13, color: T.orange, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
