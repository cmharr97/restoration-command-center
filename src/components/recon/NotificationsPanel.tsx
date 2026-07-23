import { T } from "@/lib/recon-data";
import { Ic } from "@/components/recon/ReconUI";
import type { ReconNotification } from "@/hooks/useReconNotifications";

interface NotificationsPanelProps {
  notifications: ReconNotification[];
  onSelect: (n: ReconNotification) => void;
  onClose: () => void;
}

export const NotificationsPanel = ({ notifications, onSelect, onClose }: NotificationsPanelProps) => (
  <div
    role="dialog"
    aria-label="Notifications"
    className="recon-bubble"
    style={{
      position: "absolute",
      top: "calc(100% + 10px)",
      right: 0,
      width: 320,
      maxHeight: 400,
      overflowY: "auto",
      padding: 0,
      zIndex: 200,
      boxShadow: T.bubbleShadowLg,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 14px",
        borderBottom: `1px solid ${T.border}`,
        position: "sticky",
        top: 0,
        background: T.bubbleSurfaceSolid,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Notifications</span>
      <button
        type="button"
        aria-label="Close notifications"
        onClick={onClose}
        className="recon-focusable"
        style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 2, borderRadius: 6 }}
      >
        <Ic n="x" s={16} />
      </button>
    </div>
    {notifications.length === 0 ? (
      <div style={{ padding: "28px 16px", textAlign: "center", color: T.dim, fontSize: 13 }}>
        You're all caught up.
      </div>
    ) : (
      notifications.map((n, i) => (
        <button
          key={n.id}
          type="button"
          onClick={() => onSelect(n)}
          className="recon-focusable"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            width: "100%",
            textAlign: "left",
            padding: "11px 14px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontFamily: "inherit",
            borderBottom: i < notifications.length - 1 ? `1px solid ${T.border}` : "none",
          }}
        >
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: T.surfaceHigh,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Ic n={n.icon} s={15} c={n.color} />
          </span>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.text }}>{n.title}</span>
            <span
              style={{
                display: "block",
                fontSize: 11.5,
                color: T.dim,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {n.detail}
            </span>
          </span>
        </button>
      ))
    )}
  </div>
);
