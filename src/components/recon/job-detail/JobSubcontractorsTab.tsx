import { useState, useEffect } from "react";
import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";
import { supabase } from "@/integrations/supabase/client";
import type { DbJob } from "@/hooks/useJobs";

const statusColors: Record<string, string> = {
  assigned: "blue", scheduled: "yellow", in_progress: "orange", completed: "green", cancelled: "red",
};

export const JobSubcontractorsTab = ({ job }: { job: DbJob }) => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [assignRes, subRes] = await Promise.all([
        supabase.from("subcontractor_assignments").select("*").eq("job_id", job.id),
        supabase.from("subcontractors").select("*"),
      ]);
      if (!assignRes.error) setAssignments(assignRes.data || []);
      if (!subRes.error) setSubs(subRes.data || []);
      setLoading(false);
    };
    fetch();
  }, [job.id]);

  if (loading) return <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading subcontractors...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Subcontractor Assignments</div>
          <div style={{ fontSize: 12, color: T.muted }}>{assignments.length} trades assigned</div>
        </div>
        <Btn v="primary" sz="sm" icon="plus">Assign Trade</Btn>
      </div>

      {assignments.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: T.surfaceHigh, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Ic n="truck" s={28} c={T.dim} />
          </div>
          <div style={{ fontWeight: 600, color: T.white, fontSize: 15, marginBottom: 6 }}>No Subcontractors Assigned</div>
          <div style={{ fontSize: 13, color: T.muted }}>Assign trades to this job when reconstruction begins</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {assignments.map((a: any) => {
            const sub = subs.find((s: any) => s.id === a.subcontractor_id);
            return (
              <Card key={a.id} style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>{sub?.name || "Unknown"}</span>
                      <Badge color={statusColors[a.status] || "gray"}>{a.status}</Badge>
                    </div>
                    <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600 }}>{a.trade}</span>
                      {sub?.company_name && ` · ${sub.company_name}`}
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 11, color: T.dim }}>
                      {sub?.phone && <span>📞 {sub.phone}</span>}
                      {sub?.email && <span>✉️ {sub.email}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {a.amount > 0 && <div style={{ fontSize: 16, fontWeight: 800, color: T.text }}>${a.amount.toLocaleString()}</div>}
                    <div style={{ fontSize: 11, color: T.muted }}>
                      {a.scheduled_date ? `Sched: ${a.scheduled_date}` : "Not scheduled"}
                    </div>
                    {a.completed_date && <div style={{ fontSize: 11, color: T.greenBright }}>Done: {a.completed_date}</div>}
                  </div>
                </div>
                {a.notes && <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic", marginTop: 8, borderTop: `1px solid ${T.border}`, paddingTop: 8 }}>{a.notes}</div>}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
