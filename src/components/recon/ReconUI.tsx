import React from "react";
import { T } from "@/lib/recon-data";
import logoDark from "@/assets/logo-dark-mode.png";
import logoLight from "@/assets/logo-light-mode.png";
import { useTheme } from "@/hooks/useTheme";

// ── ICON SVG ──
const iconPaths: Record<string, React.ReactNode> = {
  dash: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  jobs: <><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></>,
  drop: <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>,
  flame: <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072 2.143-.224 3.5 1 4.5-1-1-2-3-1-5 1 1 3 2.5 3 5a4 4 0 11-4.5-4z"/>,
  users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
  cal: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  est: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  inv: <><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>,
  tool: <><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></>,
  truck: <><rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
  chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  plug: <><path d="M18.36 6.64a9 9 0 11-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></>,
  cog: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
  bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
  search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  chevR: <polyline points="9,18 15,12 9,6"/>,
  chevD: <polyline points="6,9 12,15 18,9"/>,
  check: <polyline points="20,6 9,17 4,12"/>,
  x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  photo: <><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></>,
  dollar: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></>,
  alert: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  map: <><polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2 1,6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
  handshake: <><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
  unlock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/></>,
  upload: <><polyline points="16,16 12,12 8,16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></>,
  note: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></>,
  moisture: <><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/><line x1="12" y1="10" x2="12" y2="16"/><line x1="9" y1="13" x2="15" y2="13"/></>,
  star: <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>,
  myjobs: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></>,
  timeclock: <><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/><circle cx="12" cy="12" r="2" fill="currentColor"/></>,
  customer: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></>,
  contact: <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></>,
  msg: <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>,
  send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9 22,2"/></>,
};

export const Ic = ({ n, s = 16, c = "currentColor" }: { n: string; s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {iconPaths[n]}
  </svg>
);

// ── LOGO ──
export const Logo = ({ size = 80, width, height }: { size?: number; width?: number; height?: number }) => {
  const { isDark } = useTheme();
  const w = width ?? size;
  const h = height ?? size;
  return (
    <img
      src={isDark ? logoDark : logoLight}
      alt="ReCon Pro"
      style={{ width: w, height: h, objectFit: "contain", display: "block" }}
    />
  );
};

// ── BADGE ──
const badgeColorMap: Record<string, [string, string]> = {
  orange: [T.orange, T.orangeDim],
  green: [T.greenBright, T.greenDim],
  blue: [T.blueBright, T.blueDim],
  yellow: [T.yellowBright, T.yellowDim],
  red: [T.redBright, T.redDim],
  purple: [T.purpleBright, T.purpleDim],
  teal: [T.tealBright, T.tealDim],
  gray: [T.muted, "rgba(124,132,148,0.12)"],
};

export const Badge = ({ children, color = "orange", dot = false, small = false }: {
  children: React.ReactNode; color?: string; dot?: boolean; small?: boolean;
}) => {
  const [fg, bg] = badgeColorMap[color] || badgeColorMap.gray;
  return (
    <span style={{ background: bg, color: fg, border: `1px solid ${fg}30`, borderRadius: 5, padding: small ? "1px 7px" : "2px 9px", fontSize: small ? 10 : 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: fg, display: "inline-block" }}/>}
      {children}
    </span>
  );
};

// ── CARD ──
export const ReconCard = ({ children, style = {}, onClick, glow = false }: {
  children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void; glow?: boolean;
}) => (
  <div onClick={onClick} style={{ background: T.surface, border: `1px solid ${glow ? T.orange + "55" : T.border}`, borderRadius: 12, padding: 20, ...style, cursor: onClick ? "pointer" : "default", transition: "border-color 0.2s, box-shadow 0.2s", boxShadow: glow ? `0 0 20px ${T.orangeGlow}` : undefined }}
    onMouseEnter={onClick ? e => { (e.currentTarget as HTMLDivElement).style.borderColor = T.borderMid } : undefined}
    onMouseLeave={onClick ? e => { (e.currentTarget as HTMLDivElement).style.borderColor = glow ? T.orange + "55" : T.border } : undefined}
  >{children}</div>
);

// ── BUTTON ──
export const Btn = ({ children, v = "primary", sz = "md", onClick, style = {}, icon, disabled = false }: {
  children?: React.ReactNode; v?: "primary" | "secondary" | "ghost" | "danger" | "success"; sz?: "sm" | "md" | "lg"; onClick?: () => void; style?: React.CSSProperties; icon?: string; disabled?: boolean;
}) => {
  const base: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 8, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", border: "none", transition: "all 0.15s", letterSpacing: "0.01em", opacity: disabled ? 0.5 : 1 };
  const sizes: Record<string, React.CSSProperties> = { sm: { padding: "6px 13px", fontSize: 12 }, md: { padding: "9px 18px", fontSize: 13 }, lg: { padding: "12px 24px", fontSize: 14 } };
  const vs: Record<string, React.CSSProperties> = {
    primary: { background: T.orange, color: "#fff" },
    secondary: { background: T.surfaceHigh, color: T.text, border: `1px solid ${T.border}` },
    ghost: { background: "transparent", color: T.muted, border: "none" },
    danger: { background: T.redDim, color: T.redBright, border: `1px solid ${T.redBright}33` },
    success: { background: T.greenDim, color: T.greenBright, border: `1px solid ${T.greenBright}33` },
  };
  return (
    <button onClick={!disabled ? onClick : undefined} style={{ ...base, ...sizes[sz], ...vs[v], ...style }}
      onMouseEnter={e => { if (!disabled) { if (v === "primary") (e.currentTarget as HTMLButtonElement).style.background = T.orangeLight; if (v === "secondary") (e.currentTarget as HTMLButtonElement).style.borderColor = T.borderMid; } }}
      onMouseLeave={e => { if (v === "primary") (e.currentTarget as HTMLButtonElement).style.background = T.orange; if (v === "secondary") (e.currentTarget as HTMLButtonElement).style.borderColor = T.border; }}
    >{icon && <Ic n={icon} s={14}/>}{children}</button>
  );
};

// ── INPUT ──
export const Inp = ({ label, placeholder, type = "text", value, onChange, style = {}, required = false }: {
  label?: string; placeholder?: string; type?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; style?: React.CSSProperties; required?: boolean;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 500, color: T.muted }}>{label}{required && <span style={{ color: T.orange }}> *</span>}</label>}
    <input type={type} placeholder={placeholder} value={value || ""} onChange={onChange}
      style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", ...style }}
      onFocus={e => (e.target as HTMLInputElement).style.borderColor = T.orange}
      onBlur={e => (e.target as HTMLInputElement).style.borderColor = T.border}
    />
  </div>
);

// ── SELECT ──
export const Sel = ({ label, options, value, onChange, style = {} }: {
  label?: string; options: (string | { value: string; label: string })[]; value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; style?: React.CSSProperties;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 500, color: T.muted }}>{label}</label>}
    <select value={value || ""} onChange={onChange} style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", ...style }}>
      {options.map(o => typeof o === "string" ? <option key={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

// ── DIVIDER ──
export const Divider = ({ label }: { label?: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0" }}>
    <div style={{ flex: 1, height: 1, background: T.border }}/>
    {label && <span style={{ fontSize: 11, color: T.dim, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>}
    <div style={{ flex: 1, height: 1, background: T.border }}/>
  </div>
);
