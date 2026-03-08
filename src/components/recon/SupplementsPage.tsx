import { useState } from "react";
import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";
import { useJobs, useSupplements } from "@/hooks/useJobs";

export const SupplementsPage = ({ role }: { role: string }) => {
  const { jobs } = useJobs();
  const { supplements, loading } = useSupplements();
  const [filter, setFilter] = useState("all");

  const statusColors: Record<string, string> = {
    draft: "gray", submitted: "yellow", under_review: "blue",
    approved: "green", denied: "red", partial: "purple",
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: T.muted }}>Loading supplements...</div>;

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Supplements</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Manage supplement submissions and carrier comparisons</p>
        </div>
        <Btn v="primary" sz="sm" icon="plus">New Supplement</Btn>
      </div>
      <div style={{ padding: "0 28px" }}>
        {/* Stats row */}
        <div style={{ display: "flex", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
          {[
            { label: "Total Supplements", value: supplements.length, color: T.orange },
            { label: "Pending Review", value: supplements.filter((s: any) => s.status === "submitted" || s.status === "under_review").length, color: T.yellowBright },
            { label: "Approved", value: supplements.filter((s: any) => s.status === "approved").length, color: T.greenBright },
            { label: "Total Approved $", value: `$${supplements.reduce((a: number, s: any) => a + (s.approved_amount || 0), 0).toLocaleString()}`, color: T.greenBright },
          ].map((s, i) => (
            <Card key={i} style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            </Card>
          ))}
        </div>

        {supplements.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <Ic n="est" s={40} c={T.dim}/>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.white, marginTop: 16 }}>No supplements yet</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>
              Create a supplement from a job's claim section to compare contractor and carrier estimates.
            </div>
            <div style={{ marginTop: 16 }}>
              <Card style={{ maxWidth: 500, margin: "0 auto", textAlign: "left", padding: 16 }}>
                <div style={{ fontWeight: 600, color: T.white, fontSize: 13, marginBottom: 8 }}>How supplement comparison works:</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    "Upload your contractor estimate (Xactimate or manual)",
                    "Upload the carrier's approved estimate",
                    "System identifies missing line items & quantity differences",
                    "Generate supplement justification letter with AI assistance",
                    "Track submission, response, and approval status",
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: T.orangeDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: T.orange, flexShrink: 0 }}>{i + 1}</div>
                      <span style={{ fontSize: 12, color: T.text }}>{step}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Card>
        ) : (
          supplements.map((supp: any) => {
            const job = jobs.find(j => j.id === supp.job_id);
            return (
              <Card key={supp.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontFamily: "monospace", fontSize: 12, color: T.orange, fontWeight: 700 }}>{supp.job_id}</span>
                      <span style={{ fontWeight: 600, color: T.white }}>{job?.customer || "Unknown"}</span>
                      <Badge color={statusColors[supp.status] || "gray"} small>{supp.status}</Badge>
                    </div>
                    <div style={{ fontSize: 12, color: T.muted }}>Supplement #{supp.supplement_number} · {job?.carrier || "No carrier"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, textAlign: "right" }}>
                    <div>
                      <div style={{ fontSize: 10, color: T.dim }}>Contractor</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>${(supp.contractor_total || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: T.dim }}>Carrier</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>${(supp.carrier_total || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: T.dim }}>Difference</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.redBright }}>${(supp.difference || 0).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
