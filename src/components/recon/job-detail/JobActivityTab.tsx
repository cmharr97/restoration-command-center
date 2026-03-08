import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Ic } from "@/components/recon/ReconUI";
import { useActivityLogs } from "@/hooks/useJobs";
import type { DbJob } from "@/hooks/useJobs";

const actionIcons: Record<string, { icon: string; color: string }> = {
  note: { icon: "edit", color: T.blueBright },
  status_change: { icon: "check", color: T.greenBright },
  payment: { icon: "dollar", color: T.greenBright },
  photo: { icon: "photo", color: T.purpleBright },
  document: { icon: "note", color: T.tealBright },
  call: { icon: "contact", color: T.orange },
  email: { icon: "send", color: T.blueBright },
  assignment: { icon: "users", color: T.yellowBright },
};

export const JobActivityTab = ({ job }: { job: DbJob }) => {
  const { logs, loading } = useActivityLogs(job.id);

  if (loading) return <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading activity...</div>;

  return (
    <div>
      <div style={{ fontWeight: 700, color: T.white, fontSize: 15, marginBottom: 16 }}>Activity Log</div>

      {logs.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <Ic n="clock" s={32} c={T.dim} />
          <div style={{ marginTop: 12, fontSize: 13, color: T.muted }}>No activity recorded yet</div>
        </div>
      ) : (
        <div style={{ position: "relative", paddingLeft: 24 }}>
          <div style={{ position: "absolute", left: 5, top: 0, bottom: 0, width: 2, background: T.border }} />
          {logs.map((log: any, i: number) => {
            const ai = actionIcons[log.action_type] || { icon: "clock", color: T.muted };
            const date = new Date(log.created_at);
            return (
              <div key={i} style={{ position: "relative", marginBottom: 16, paddingLeft: 16 }}>
                <div style={{
                  position: "absolute", left: -24, top: 2, width: 12, height: 12, borderRadius: "50%",
                  background: ai.color, display: "flex", alignItems: "center", justifyContent: "center",
                  border: `2px solid ${T.bg}`,
                }} />
                <div style={{ padding: "10px 14px", background: T.surfaceHigh, borderRadius: 10, border: `1px solid ${T.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Ic n={ai.icon} s={13} c={ai.color} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{log.title}</span>
                    </div>
                    <span style={{ fontSize: 10, color: T.dim, whiteSpace: "nowrap" }}>
                      {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} {date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    </span>
                  </div>
                  {log.description && <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, marginBottom: 4 }}>{log.description}</div>}
                  <div style={{ display: "flex", gap: 6 }}>
                    <Badge color="gray" small>{log.action_type}</Badge>
                    {log.user_name && <span style={{ fontSize: 11, color: T.dim }}>by {log.user_name}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
