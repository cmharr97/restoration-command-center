import { Ic } from "@/components/recon/ReconUI";
import { T } from "@/lib/recon-data";

/**
 * A small, always-visible badge indicating the app is running in Demo Preview
 * Mode (local sample data, no live Supabase connection).
 */
export const DemoBadge = () => (
  <div
    role="status"
    aria-label="Demo Mode active"
    title="Demo Mode: local sample data only — no live Supabase connection"
    style={{
      position: "fixed",
      left: 12,
      bottom: 12,
      zIndex: 1000,
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px",
      borderRadius: 999,
      background: T.orangeDim,
      border: `1px solid ${T.orange}`,
      color: T.orange,
      fontFamily: "'Inter',sans-serif",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.04em",
      boxShadow: `0 4px 16px ${T.orangeGlow}`,
      pointerEvents: "none",
    }}
  >
    <Ic n="eye" s={13} c={T.orange} /> DEMO MODE
  </div>
);
