import { useState } from "react";
import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";
import { useActivityLogs } from "@/hooks/useJobs";
import type { DbJob } from "@/hooks/useJobs";

type FilterType = "all" | "photos" | "documents" | "estimates" | "supplements" | "notes";

export const JobPhotosTab = ({ job }: { job: DbJob }) => {
  const [filter, setFilter] = useState<FilterType>("all");
  const { logs } = useActivityLogs(job.id);

  const filters: { id: FilterType; label: string; icon: string }[] = [
    { id: "all", label: "All", icon: "eye" },
    { id: "photos", label: "Photos", icon: "photo" },
    { id: "documents", label: "Documents", icon: "note" },
    { id: "estimates", label: "Estimates", icon: "est" },
    { id: "supplements", label: "Supplements", icon: "est" },
    { id: "notes", label: "Notes", icon: "edit" },
  ];

  // Merge activity logs as a timeline
  const docEntries = logs.filter(l => {
    if (filter === "all") return true;
    if (filter === "notes") return l.action_type === "note";
    return l.action_type === filter.slice(0, -1); // photo, document, etc
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Photos & Documents</div>
        {/* Photo upload handled via activity log for now */}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto" }}>
        {filters.map(f => (
          <div key={f.id} onClick={() => setFilter(f.id)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, cursor: "pointer",
            background: filter === f.id ? T.orangeDim : T.surfaceHigh,
            border: `1px solid ${filter === f.id ? T.orange + "55" : T.border}`,
            transition: "all 0.12s",
          }}>
            <Ic n={f.icon} s={13} c={filter === f.id ? T.orange : T.muted} />
            <span style={{ fontSize: 12, fontWeight: filter === f.id ? 600 : 400, color: filter === f.id ? T.orange : T.muted, whiteSpace: "nowrap" }}>{f.label}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      {docEntries.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: T.surfaceHigh, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Ic n="photo" s={28} c={T.dim} />
          </div>
          <div style={{ fontWeight: 600, color: T.white, fontSize: 15, marginBottom: 6 }}>No items yet</div>
          <div style={{ fontSize: 13, color: T.muted }}>Upload photos and documents to build your project timeline</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {docEntries.map((entry: any, i: number) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < docEntries.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 2 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.orange, flexShrink: 0 }} />
                {i < docEntries.length - 1 && <div style={{ width: 2, flex: 1, background: T.border, marginTop: 4 }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{entry.title}</span>
                  <span style={{ fontSize: 11, color: T.muted }}>{new Date(entry.created_at).toLocaleDateString()}</span>
                </div>
                {entry.description && <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{entry.description}</div>}
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <Badge color="gray" small>{entry.action_type}</Badge>
                  {entry.user_name && <span style={{ fontSize: 11, color: T.dim }}>by {entry.user_name}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
