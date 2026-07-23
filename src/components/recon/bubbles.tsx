import React from "react";
import { T } from "@/lib/recon-data";
import { Ic } from "@/components/recon/ReconUI";

/**
 * ReCon Spatial Bubble System
 * ---------------------------
 * Reusable "floating glass" surfaces, capsules, action orbs and tab bars.
 * All components are theme-aware (via CSS custom properties), keyboard
 * accessible, expose visible focus states and honour prefers-reduced-motion
 * (handled globally in index.css).
 */

type Elevation = "sm" | "md" | "lg";
const shadowFor = (e: Elevation) =>
  e === "sm" ? T.bubbleShadowSm : e === "lg" ? T.bubbleShadowLg : T.bubbleShadow;

/* ── Floating glass surface ── */
export const Bubble = ({
  children,
  as: Tag = "div",
  elevation = "md",
  padded = true,
  interactive = false,
  live = false,
  style = {},
  className = "",
  onClick,
  ...rest
}: {
  children?: React.ReactNode;
  as?: React.ElementType;
  elevation?: Elevation;
  padded?: boolean;
  interactive?: boolean;
  live?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
} & React.HTMLAttributes<HTMLElement>) => (
  <Tag
    onClick={onClick}
    className={`recon-bubble ${interactive ? "recon-focusable" : ""} ${className}`.trim()}
    style={{
      padding: padded ? 18 : 0,
      boxShadow: shadowFor(elevation),
      borderColor: live ? T.cyanDim : undefined,
      transition: "transform 0.2s var(--spring), box-shadow 0.2s var(--ease-soft), border-color 0.15s",
      cursor: interactive || onClick ? "pointer" : "default",
      ...style,
    }}
    {...rest}
  >
    {children}
  </Tag>
);

/* ── Pill / capsule container ── */
export const Capsule = ({
  children,
  style = {},
  className = "",
  padding = "6px 12px",
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  padding?: string | number;
}) => (
  <div className={`recon-capsule ${className}`.trim()} style={{ padding, ...style }}>
    {children}
  </div>
);

/* ── Circular icon action button (orb) ── */
export const ActionOrb = ({
  icon,
  label,
  onClick,
  size = 38,
  active = false,
  color,
  badge,
  live = false,
  style = {},
}: {
  icon: string;
  label: string;
  onClick?: () => void;
  size?: number;
  active?: boolean;
  color?: string;
  badge?: number | string;
  live?: boolean;
  style?: React.CSSProperties;
}) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    className="recon-orb recon-focusable"
    style={{
      width: size,
      height: size,
      position: "relative",
      color: active ? T.orange : color,
      background: active ? T.orangeDim : undefined,
      ...style,
    }}
  >
    <Ic n={icon} s={Math.round(size * 0.44)} c={active ? T.orange : color || "currentColor"} />
    {live && (
      <span className="recon-live-dot" style={{ position: "absolute", top: 7, right: 7 }} aria-hidden="true" />
    )}
    {badge !== undefined && badge !== 0 && (
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -3,
          right: -3,
          minWidth: 16,
          height: 16,
          padding: "0 4px",
          borderRadius: 999,
          background: T.orange,
          color: "#fff",
          fontSize: 9,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {badge}
      </span>
    )}
  </button>
);

/* ── Live / AI status dot with optional label ── */
export const LiveDot = ({ label, color = T.cyan }: { label?: string; color?: string }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
    <span className="recon-live-dot" style={{ background: color }} aria-hidden="true" />
    {label && (
      <span style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: "0.03em" }}>{label}</span>
    )}
  </span>
);

/* ── Responsive bubble tab bar ── */
export interface BubbleTabItem {
  id: string;
  label: string;
  icon?: string;
}

export const BubbleTabs = ({
  tabs,
  active,
  onChange,
  ariaLabel = "Sections",
}: {
  tabs: BubbleTabItem[];
  active: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}) => (
  <div
    role="tablist"
    aria-label={ariaLabel}
    className="recon-capsule"
    style={{
      display: "flex",
      gap: 2,
      padding: 4,
      borderRadius: 999,
      overflowX: "auto",
      maxWidth: "100%",
      WebkitOverflowScrolling: "touch",
    }}
  >
    {tabs.map((t) => {
      const isActive = active === t.id;
      return (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          tabIndex={isActive ? 0 : -1}
          onClick={() => onChange(t.id)}
          className="recon-tab recon-focusable"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            border: "none",
            cursor: "pointer",
            whiteSpace: "nowrap",
            borderRadius: 999,
            padding: "7px 14px",
            fontSize: 12.5,
            fontWeight: isActive ? 700 : 500,
            fontFamily: "inherit",
            color: isActive ? "#fff" : T.muted,
            background: isActive ? T.orange : "transparent",
            boxShadow: isActive ? "0 4px 12px var(--t-orange-glow)" : "none",
            transition: "background 0.2s var(--ease-soft), color 0.15s, box-shadow 0.2s",
          }}
        >
          {t.icon && <Ic n={t.icon} s={13} c={isActive ? "#fff" : T.muted} />}
          {t.label}
        </button>
      );
    })}
  </div>
);

/* ── Compact key/value stat used across command headers ── */
export const StatChip = ({
  label,
  value,
  icon,
  accent = T.orange,
}: {
  label: string;
  value: React.ReactNode;
  icon?: string;
  accent?: string;
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
    {icon && (
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 9,
          background: T.surfaceHigh,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Ic n={icon} s={14} c={accent} />
      </span>
    )}
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: 9.5,
          color: T.dim,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 700,
          color: T.text,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  </div>
);
