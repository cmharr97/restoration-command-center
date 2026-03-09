import { useState } from "react";
import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";
import { useJobs, useSupplements } from "@/hooks/useJobs";

export const SupplementsPage = ({ role }: { role: string }) => {
  const { jobs } = useJobs();
  const { supplements, loading } = useSupplements();

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
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Compare contractor vs. carrier estimates and track approvals</p>
        </div>
        {/* Supplements are created within individual job detail pages */}
      </div>
      <div style={{ padding: "0 28px" }}>
        {supplements.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: T.purpleDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Ic n="est" s={28} c={T.purpleBright}/>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.white }}>Supplement Comparison</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 8, maxWidth: 460, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              When insurance carriers approve less than your scope of work, create a supplement to identify missing items, quantity differences, and pricing gaps — then track the approval process.
            </div>
            <div style={{ marginTop: 20, maxWidth: 400, margin: "20px auto 0" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { step: "1", text: "Upload your contractor estimate (Xactimate or manual)" },
                  { step: "2", text: "Upload the carrier's approved estimate" },
                  { step: "3", text: "System identifies missing items & pricing differences" },
                  { step: "4", text: "Generate supplement justification and submit" },
                  { step: "5", text: "Track carrier response and approval status" },
                ].map(s => (
                  <div key={s.step} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: T.orangeDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: T.orange, flexShrink: 0 }}>{s.step}</div>
                    <span style={{ fontSize: 12, color: T.text }}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ) : (
          <>
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              {[
                { label: "Total Supplements", value: supplements.length, color: T.orange },
                { label: "Pending Review", value: supplements.filter((s: any) => ["submitted", "under_review"].includes(s.status)).length, color: T.yellowBright },
                { label: "Approved", value: supplements.filter((s: any) => s.status === "approved").length, color: T.greenBright },
                { label: "Approved Amount", value: `$${supplements.reduce((a: number, s: any) => a + (s.approved_amount || 0), 0).toLocaleString()}`, color: T.greenBright },
              ].map((s, i) => (
                <Card key={i} style={{ flex: 1, minWidth: 130, padding: "14px 16px" }}>
                  <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                </Card>
              ))}
            </div>

            {supplements.map((supp: any) => {
              const job = jobs.find(j => j.id === supp.job_id);
              return (
                <Card key={supp.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontFamily: "monospace", fontSize: 12, color: T.orange, fontWeight: 700 }}>{supp.job_id}</span>
                        <span style={{ fontWeight: 600, color: T.white }}>{job?.customer || "Unknown"}</span>
                        <Badge color={statusColors[supp.status] || "gray"} small>{supp.status}</Badge>
                      </div>
                      <div style={{ fontSize: 12, color: T.muted }}>Supplement #{supp.supplement_number} · {job?.carrier || "No carrier"}</div>
                    </div>
                    <div style={{ display: "flex", gap: 14, textAlign: "right" }}>
                      <div>
                        <div style={{ fontSize: 10, color: T.dim, textTransform: "uppercase" }}>Contractor</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>${(supp.contractor_total || 0).toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: T.dim, textTransform: "uppercase" }}>Carrier</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>${(supp.carrier_total || 0).toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: T.dim, textTransform: "uppercase" }}>Difference</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: (supp.difference || 0) > 0 ? T.redBright : T.greenBright }}>${Math.abs(supp.difference || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
