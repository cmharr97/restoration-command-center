import { useState } from "react";
import { T, ROLES, NAV } from "@/lib/recon-data";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  [key: string]: any;
}
import { Ic, Logo, Btn } from "@/components/recon/ReconUI";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";

interface SidebarProps {
  role: string;
  active: string;
  setActive: (id: string) => void;
  user: TeamMember;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const ReconSidebar = ({ role, active, setActive, user, mobileOpen, onMobileClose }: SidebarProps) => {
  const nav = NAV[role] || NAV.owner;
  const roleInfo = ROLES[role];

  const handleNav = (id: string) => {
    setActive(id);
    onMobileClose?.();
  };

  return (
    <>
      {mobileOpen && (
        <div onClick={onMobileClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 49, display: "none" }}
          className="mobile-overlay" />
      )}
      <div className="recon-sidebar" style={{
        width: 230, minWidth: 230, background: T.surface, borderRight: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, overflowY: "auto",
        transition: "transform 0.25s ease",
      }}>
         <div style={{ padding: "12px 12px 12px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
             <Logo size={100}/>
           </div>
          {onMobileClose && (
            <button onClick={onMobileClose} className="mobile-close-btn" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 4, display: "none" }}>
              <Ic n="x" s={20} />
            </button>
          )}
        </div>

        <div style={{ margin: "10px 12px 4px", background: T.orangeDim, border: `1px solid ${T.orange}44`, borderRadius: 8, padding: "7px 10px", display: "flex", alignItems: "center", gap: 7 }}>
          <Ic n="lock" s={12} c={T.orange}/>
          <div>
            <div style={{ fontSize: 10, color: T.orange, fontWeight: 700, letterSpacing: "0.05em" }}>{roleInfo?.label}</div>
            <div style={{ fontSize: 10, color: T.muted, marginTop: 1 }}>{user.name}</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "6px 8px", overflowY: "auto" }}>
          {nav.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: T.dim, letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 10px 4px" }}>{group.group}</div>
              {group.items.map(item => {
                const isActive = active === item.id;
                return (
                  <div key={item.id} onClick={() => handleNav(item.id)}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 10px", borderRadius: 7, cursor: "pointer", marginBottom: 1, background: isActive ? T.orangeDim : "transparent", color: isActive ? T.orange : T.muted, fontWeight: isActive ? 600 : 400, fontSize: 13, transition: "all 0.12s", position: "relative" }}
                    onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLDivElement).style.background = T.surfaceHigh; (e.currentTarget as HTMLDivElement).style.color = T.text; } }}
                    onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLDivElement).style.background = "transparent"; (e.currentTarget as HTMLDivElement).style.color = T.muted; } }}
                  >
                    {isActive && <div style={{ position: "absolute", left: 0, top: "20%", height: "60%", width: 3, background: T.orange, borderRadius: "0 3px 3px 0" }}/>}
                    <Ic n={item.icon} s={15} c={isActive ? T.orange : T.muted}/>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && <span style={{ background: T.orange, color: "#fff", borderRadius: 10, fontSize: 9, fontWeight: 700, padding: "1px 6px" }}>{item.badge}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: "10px 12px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${T.orange}, #c84009)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#fff", flexShrink: 0 }}>{user.avatar}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
              <div style={{ fontSize: 10, color: T.muted }}>{user.email}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface TopBarProps {
  pageTitle: string;
  role: string;
  onNewJob: () => void;
  onRoleChange: (role: string) => void;
  onSignOut?: () => void;
  onMenuToggle?: () => void;
}

export const TopBar = ({ pageTitle, role, onNewJob, onRoleChange, onSignOut, onMenuToggle }: TopBarProps) => {
  const { toggleTheme, isDark } = useTheme();
  return (
    <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {onMenuToggle && (
          <button onClick={onMenuToggle} className="mobile-menu-btn" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 6, display: "none", marginRight: 4 }}>
            <Ic n="dash" s={20} />
          </button>
        )}
        <span className="hide-mobile" style={{ color: T.dim, fontSize: 12 }}>ReCon Pro</span>
        <Ic n="chevR" s={13} c={T.dim}/>
        <span style={{ color: T.text, fontSize: 13, fontWeight: 500 }}>{pageTitle}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={toggleTheme} title={isDark ? "Switch to light mode" : "Switch to dark mode"} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, display: "flex", alignItems: "center", padding: 6 }}>
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {ROLES[role]?.canViewAllJobs !== false && <Btn v="primary" sz="sm" icon="plus" onClick={onNewJob}><span className="hide-mobile">New Job</span></Btn>}
        <div style={{ position: "relative", cursor: "pointer", padding: 4 }}>
          <Ic n="bell" s={17} c={T.muted}/>
        </div>
        {onSignOut && (
          <button onClick={onSignOut} style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "5px 10px", color: T.muted, fontSize: 11, fontFamily: "'DM Sans',sans-serif", cursor: "pointer" }}>
            <span className="hide-mobile">Sign Out</span>
            <span className="show-mobile" style={{ display: "none" }}>↪</span>
          </button>
        )}
      </div>
    </div>
  );
};
