import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { T } from "@/lib/recon-data";
import { Logo, Btn } from "@/components/recon/ReconUI";
import { useToast } from "@/hooks/use-toast";

const ROLES = [
  { value: "owner", label: "Owner / Admin" },
  { value: "project_manager", label: "Project Manager" },
  { value: "estimator", label: "Estimator" },
  { value: "office_admin", label: "Office Admin" },
  { value: "field_tech", label: "Field Technician" },
  { value: "subcontractor", label: "Subcontractor" },
];

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("field_tech");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, role } },
        });
        if (error) throw error;
        toast({ title: "Account created!", description: "You're now logged in." });
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
    fontFamily: "'DM Sans',sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ width: 420, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <Logo size={48} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: T.white, margin: "0 0 4px", letterSpacing: "-0.02em" }}>ReCon Pro</h1>
          <p style={{ color: T.muted, fontSize: 13, margin: 0 }}>
            {mode === "login" ? "Sign in to your account" : "Create your team account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="John Davis" required style={inputStyle} />
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} style={inputStyle} />
          </div>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          )}
          <Btn v="primary" sz="lg" style={{ width: "100%", justifyContent: "center", marginTop: 4 }} onClick={() => {}} disabled={loading}>
            {loading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
          </Btn>
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
