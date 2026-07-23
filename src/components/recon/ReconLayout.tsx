import { useState, useRef, useEffect } from "react";
import { T, ROLES, NAV } from "@/lib/recon-data";
import { Ic, Logo, Btn } from "@/components/recon/ReconUI";
import { ActionOrb, Capsule, LiveDot } from "@/components/recon/bubbles";
import { useReconNotifications } from "@/hooks/useReconNotifications";
import { NotificationsPanel } from "@/components/recon/NotificationsPanel";
import { useTheme } from "@/hooks/useTheme";
import { useJobs, type DbJob } from "@/hooks/useJobs";
import { Sun, Moon } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  [key: string]: unknown;
}

/* ─────────────────────────────────────────────
   Floating collapsible desktop navigation
   ───────────────────────────────────────────── */
interface SidebarProps {
  role: string;
  active: string;
  setActive: (id: string) => void;
  user: TeamMember;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const ReconSidebar = ({
  role,
  active,
  setActive,
  user,
  collapsed = false,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: SidebarProps) => {
  const nav = NAV[role] || NAV.owner;
  const roleInfo = ROLES[role];

  const handleNav = (id: string) => {
    setActive(id);
    onMobileClose?.();
  };

  const width = collapsed ? 74 : 224;

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 49, display: "none" }}
          className="mobile-overlay"
        />
      )}
      <aside
        aria-label="Primary navigation"
        className="recon-sidebar recon-floating-nav recon-bubble"
        style={{
          width,
          minWidth: width,
          margin: 10,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 20px)",
          position: "sticky",
          top: 10,
          overflow: "hidden",
          transition: "width 0.28s var(--spring), transform 0.25s var(--ease-soft)",
        }}
      >
        <div
          style={{
            height: 58,
            padding: collapsed ? "0 10px" : "0 16px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
          }}
        >
          {collapsed ? (
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 11,
                background: `linear-gradient(135deg, ${T.orange}, #c84009)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                color: "#fff",
                fontSize: 15,
              }}
            >
              R
            </div>
          ) : (
            <Logo size={100} />
          )}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              aria-label="Close navigation"
              className="mobile-close-btn recon-focusable"
              style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 4, display: "none", borderRadius: 8 }}
            >
              <Ic n="x" s={20} />
            </button>
          )}
        </div>

        <nav aria-label="Sections" style={{ flex: 1, padding: 8, overflowY: "auto" }}>
          {nav.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 4 }}>
              {!collapsed && (
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: T.dim,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "10px 10px 4px",
                  }}
                >
                  {group.group}
                </div>
              )}
              {group.items.map((item) => {
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    className="recon-focusable"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      textAlign: "left",
                      padding: collapsed ? "10px" : "9px 11px",
                      justifyContent: collapsed ? "center" : "flex-start",
                      borderRadius: 11,
                      cursor: "pointer",
                      marginBottom: 2,
                      border: "none",
                      fontFamily: "inherit",
                      background: isActive ? T.orangeDim : "transparent",
                      color: isActive ? T.orange : T.muted,
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 13,
                      transition: "background 0.15s var(--ease-soft), color 0.15s",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = T.surfaceHigh;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Ic n={item.icon} s={17} c={isActive ? T.orange : T.muted} />
                    {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span
                        style={{
                          background: T.orange,
                          color: "#fff",
                          borderRadius: 999,
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "1px 6px",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: 10, borderTop: `1px solid ${T.border}`, display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: T.orangeDim,
              borderRadius: 12,
              padding: collapsed ? 6 : "6px 8px",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${T.orange}, #c84009)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 11,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {user.avatar}
            </div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: T.text,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.name}
                </div>
                <div style={{ fontSize: 9, color: T.orange, fontWeight: 600, letterSpacing: "0.04em" }}>
                  {roleInfo?.label}
                </div>
              </div>
            )}
          </div>
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
              aria-pressed={collapsed}
              className="recon-desktop-only recon-focusable"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: T.surfaceHigh,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "7px",
                color: T.muted,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 12,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
                  transition: "transform 0.28s var(--spring)",
                }}
              >
                <Ic n="chevR" s={14} c={T.muted} />
              </span>
              {!collapsed && <span>Collapse</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

/* ─────────────────────────────────────────────
   Sync state pill (reflects Supabase fetch state)
   ───────────────────────────────────────────── */
export const SyncState = () => {
  const { loading } = useJobs();
  return (
    <Capsule padding="5px 11px" className="recon-desktop-only" style={{ fontSize: 11.5, color: T.muted }}>
      {loading ? (
        <LiveDot label="Syncing" color={T.cyan} />
      ) : (
        <>
          <Ic n="check" s={13} c={T.greenBright} />
          <span style={{ fontWeight: 600, color: T.muted }}>Synced</span>
        </>
      )}
    </Capsule>
  );
};

/* ─────────────────────────────────────────────
   Theme toggle orb
   ───────────────────────────────────────────── */
const ThemeOrb = () => {
  const { toggleTheme, isDark } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="recon-orb recon-focusable"
      style={{ width: 38, height: 38 }}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
};

/* ─────────────────────────────────────────────
   User menu
   ───────────────────────────────────────────── */
const menuItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  width: "100%",
  textAlign: "left",
  padding: "9px 10px",
  borderRadius: 9,
  border: "none",
  background: "transparent",
  color: T.text,
  fontSize: 13,
  fontWeight: 500,
  fontFamily: "inherit",
  cursor: "pointer",
};

const UserMenu = ({
  user,
  role,
  onSignOut,
  setActive,
}: {
  user: TeamMember;
  role: string;
  onSignOut?: () => void;
  setActive?: (id: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const roleInfo = ROLES[role];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((o) => !o)}
        className="recon-orb recon-focusable"
        style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${T.orange}, #c84009)`, color: "#fff", fontWeight: 700, fontSize: 12 }}
      >
        {user.avatar}
      </button>
      {open && (
        <div
          role="menu"
          className="recon-bubble"
          style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: 220, padding: 8, zIndex: 200, boxShadow: T.bubbleShadowLg }}
        >
          <div style={{ padding: "8px 10px 10px", borderBottom: `1px solid ${T.border}`, marginBottom: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{user.name}</div>
            <div style={{ fontSize: 11, color: T.dim }}>{user.email || roleInfo?.label}</div>
          </div>
          {setActive && ROLES[role]?.pages?.includes("settings") && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setActive("settings");
                setOpen(false);
              }}
              className="recon-focusable"
              style={menuItemStyle}
            >
              <Ic n="cog" s={15} c={T.muted} /> Settings
            </button>
          )}
          {onSignOut && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="recon-focusable"
              style={{ ...menuItemStyle, color: T.redBright }}
            >
              <Ic n="unlock" s={15} c={T.redBright} /> Sign out
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Notifications bell (derived, live data)
   ───────────────────────────────────────────── */
const NotificationsBell = ({ onSelectJob }: { onSelectJob: (job: DbJob) => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const notifications = useReconNotifications();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <ActionOrb
        icon="bell"
        label="Notifications"
        onClick={() => setOpen((o) => !o)}
        badge={notifications.length || undefined}
        live={notifications.length > 0}
        color={T.muted}
      />
      {open && (
        <NotificationsPanel
          notifications={notifications}
          onClose={() => setOpen(false)}
          onSelect={(n) => {
            if (n.job) onSelectJob(n.job);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Capsule top bar
   ───────────────────────────────────────────── */
interface TopBarProps {
  pageTitle: string;
  role: string;
  user: TeamMember;
  onNewJob: () => void;
  onSignOut?: () => void;
  onMenuToggle?: () => void;
  onOpenPalette?: () => void;
  onSelectJob?: (job: DbJob) => void;
  setActive?: (id: string) => void;
  breadcrumbs?: React.ReactNode;
  searchBar?: React.ReactNode;
}

export const TopBar = ({
  pageTitle,
  role,
  user,
  onNewJob,
  onSignOut,
  onMenuToggle,
  onOpenPalette,
  onSelectJob,
  setActive,
  breadcrumbs,
  searchBar,
}: TopBarProps) => {
  return (
    <header
      className="recon-bubble"
      style={{
        margin: "10px 10px 0",
        padding: "8px 14px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        position: "sticky",
        top: 10,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            aria-label="Open navigation"
            className="mobile-menu-btn recon-focusable"
            style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 6, display: "none", borderRadius: 8 }}
          >
            <Ic n="dash" s={20} />
          </button>
        )}
        {breadcrumbs || <span style={{ color: T.text, fontSize: 15, fontWeight: 700 }}>{pageTitle}</span>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div className="recon-desktop-only" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {searchBar}
        </div>
        {onOpenPalette && (
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open command palette"
            className="recon-capsule recon-focusable recon-desktop-only"
            style={{ padding: "6px 10px", cursor: "pointer", color: T.muted, fontFamily: "inherit", fontSize: 12 }}
          >
            <Ic n="search" s={13} c={T.dim} />
            <span>Command</span>
            <kbd style={{ fontSize: 10, color: T.dim, background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 5, padding: "1px 5px" }}>
              ⌘K
            </kbd>
          </button>
        )}
        <SyncState />
        {onSelectJob && <NotificationsBell onSelectJob={onSelectJob} />}
        <ThemeOrb />
        {ROLES[role]?.canViewAllJobs !== false && (
          <Btn v="primary" sz="sm" icon="plus" onClick={onNewJob}>
            <span className="hide-mobile">New Job</span>
          </Btn>
        )}
        <UserMenu user={user} role={role} onSignOut={onSignOut} setActive={setActive} />
      </div>
    </header>
  );
};

/* ─────────────────────────────────────────────
   Mobile bottom navigation
   ───────────────────────────────────────────── */
export const MobileBottomNav = ({
  role,
  active,
  setActive,
  onOpenPalette,
}: {
  role: string;
  active: string;
  setActive: (id: string) => void;
  onOpenPalette?: () => void;
}) => {
  const nav = NAV[role] || NAV.owner;
  const items = nav.flatMap((g) => g.items).slice(0, 4);

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    flex: 1,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    color: isActive ? T.orange : T.muted,
    padding: "4px 0",
  });

  return (
    <nav
      aria-label="Bottom navigation"
      className="recon-bottom-nav recon-bubble"
      style={{
        position: "fixed",
        left: 10,
        right: 10,
        bottom: 10,
        height: 62,
        padding: "6px 8px",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 60,
        borderRadius: 999,
      }}
    >
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item.id)}
            aria-current={isActive ? "page" : undefined}
            aria-label={item.label}
            className="recon-focusable"
            style={tabStyle(isActive)}
          >
            <Ic n={item.icon} s={20} c={isActive ? T.orange : T.muted} />
            <span style={{ fontSize: 9.5, fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
          </button>
        );
      })}
      {onOpenPalette && (
        <button type="button" onClick={onOpenPalette} aria-label="Search" className="recon-focusable" style={tabStyle(false)}>
          <Ic n="search" s={20} c={T.muted} />
          <span style={{ fontSize: 9.5, fontWeight: 500 }}>Search</span>
        </button>
      )}
    </nav>
  );
};
