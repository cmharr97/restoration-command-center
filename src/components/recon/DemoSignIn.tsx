import { useState } from "react";
import { T } from "@/lib/recon-data";
import { Logo, Ic } from "@/components/recon/ReconUI";
import { DEMO_ROLES, demoAuth } from "@/lib/demo";

/**
 * Demo sign-in screen. Shown only in Demo Preview Mode (when Supabase
 * credentials are missing). Lets the previewer explore Phase 1 as any role
 * without a real account — no passwords, no network, no live data.
 */
const DemoSignIn = () => {
  const [selected, setSelected] = useState<string>(DEMO_ROLES[0].value);

  const enter = (roleValue: string) => {
    demoAuth.signInAsRole(roleValue);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", padding: 20 }}>
      <div style={{ width: 520, maxWidth: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "32px 36px", position: "relative" }}>
        <div style={{
          position: "absolute", top: 16, right: 16, display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 10px", borderRadius: 999, background: T.orangeDim,
          border: `1px solid ${T.orange}`, color: T.orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
        }}>
          <Ic n="eye" s={13} c={T.orange} /> DEMO MODE
        </div>

        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <Logo size={260} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: T.white, margin: "0 0 4px", letterSpacing: "-0.02em" }}>ReCon Pro — Demo Preview</h1>
          <p style={{ color: T.muted, fontSize: 13, margin: 0, lineHeight: 1.5 }}>
            No Supabase account needed. Pick a role to explore Phase 1 with realistic
            sample data. Nothing you do here is saved to a live database.
          </p>
        </div>

        <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, display: "block", marginBottom: 8 }}>
          Choose a role to sign in as
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {DEMO_ROLES.map((r) => (
            <button
              key={r.value}
              onClick={() => { setSelected(r.value); enter(r.value); }}
              onMouseEnter={() => setSelected(r.value)}
              aria-label={`Enter demo as ${r.label}`}
              style={{
                textAlign: "left", padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                border: `1px solid ${selected === r.value ? T.orange : T.border}`,
                background: selected === r.value ? T.orangeDim : T.surfaceHigh,
                transition: "all 0.15s", fontFamily: "'Inter',sans-serif",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: selected === r.value ? T.orange : T.white }}>{r.label}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 3, lineHeight: 1.4 }}>{r.desc}</div>
            </button>
          ))}
        </div>

        <button
          onClick={() => enter(selected)}
          style={{
            width: "100%", marginTop: 18, padding: "12px 0", borderRadius: 8, border: "none",
            background: `linear-gradient(135deg, ${T.orange}, #c84009)`,
            color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "'Inter',sans-serif",
            cursor: "pointer", boxShadow: `0 4px 16px ${T.orangeGlow}`,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <Ic n="unlock" s={16} c="#fff" /> Enter Demo as {DEMO_ROLES.find((r) => r.value === selected)?.label}
        </button>

        <p style={{ textAlign: "center", color: T.dim, fontSize: 11, marginTop: 16, marginBottom: 0, lineHeight: 1.5 }}>
          Add <code style={{ color: T.muted }}>VITE_SUPABASE_URL</code> and{" "}
          <code style={{ color: T.muted }}>VITE_SUPABASE_PUBLISHABLE_KEY</code> to switch to live mode.
        </p>
      </div>
    </div>
  );
};

export default DemoSignIn;
