import { useState } from "react";
import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Inp, Sel } from "@/components/recon/ReconUI";
import { useClaims } from "@/hooks/useJobs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { DbJob } from "@/hooks/useJobs";

const statusColors: Record<string, string> = {
  pending: "yellow", approved: "green", denied: "red", partial: "orange", review: "blue", none: "gray",
};

export const JobClaimTab = ({ job }: { job: DbJob }) => {
  const { claims, loading } = useClaims(job.id);
  const { user, companyId } = useAuth();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);
  const claim = claims[0]; // primary claim

  if (loading) return <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading claim tracking data...</div>;

  // Insurance info from the job itself
  const insuranceInfo = [
    { label: "Carrier", value: job.carrier || "Not recorded" },
    { label: "Claim #", value: job.claim_no || "Not recorded" },
    { label: "Adjuster", value: job.adjuster || "Not recorded" },
    { label: "Adjuster Phone", value: job.adjuster_phone || "N/A" },
    { label: "Adjuster Email", value: job.adjuster_email || "N/A" },
    { label: "Mortgage Co.", value: job.mortgage_company || "N/A" },
    { label: "Date of Loss", value: job.date_of_loss || "Not recorded" },
  ];

  const handleStartTracking = async () => {
    if (!user) return;
    setCreating(true);
    const { error } = await supabase.from("claims").insert({
      job_id: job.id,
      created_by: user.id,
      company_id: companyId || null,
      carrier_response_status: "pending",
      supplement_status: "none",
      outstanding_balance: job.contract_value || 0,
    } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Claim tracking started", description: `Tracking initiated for ${job.id}` });
      window.location.reload();
    }
    setCreating(false);
  };

  if (!claim) {
    return (
      <div>
        {/* Always show insurance info from the job */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.purpleDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic n="shield" s={16} c={T.purpleBright} />
            </div>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Insurance & Carrier Information</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {insuranceInfo.map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: T.surfaceHigh, borderRadius: 6 }}>
                <span style={{ fontSize: 12, color: T.muted }}>{label}</span>
                <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ textAlign: "center", padding: 40 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: T.orangeDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Ic n="note" s={24} c={T.orange} />
          </div>
          <div style={{ fontWeight: 600, color: T.white, fontSize: 15, marginBottom: 6 }}>No Internal Claim Tracking Started</div>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 20, maxWidth: 400, margin: "0 auto 20px", lineHeight: 1.6 }}>
            Start tracking this insurance claim internally — log carrier responses, record supplement status, track denied items, and monitor payment progress. This is your team's internal tracking system.
          </div>
          <Btn v="primary" sz="md" icon="plus" onClick={handleStartTracking} disabled={creating}>
            {creating ? "Starting..." : "Start Claim Tracking"}
          </Btn>
        </Card>
      </div>
    );
  }

  const timelineItems = [
    claim.estimate_submitted_date && { date: claim.estimate_submitted_date, label: "Estimate Submitted", color: T.blueBright },
    claim.reinspection_date && { date: claim.reinspection_date, label: "Reinspection Scheduled", color: T.purpleBright },
    claim.carrier_response_status === "approved" && { date: "—", label: "Carrier Approved (logged)", color: T.greenBright },
    claim.carrier_response_status === "denied" && { date: "—", label: "Carrier Denied (logged)", color: T.redBright },
  ].filter(Boolean) as { date: string; label: string; color: string }[];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Insurance Info from Job */}
      <Card style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: T.purpleDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic n="shield" s={16} c={T.purpleBright} />
          </div>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Insurance & Carrier Information</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {insuranceInfo.map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: T.surfaceHigh, borderRadius: 6 }}>
              <span style={{ fontSize: 12, color: T.muted }}>{label}</span>
              <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Claim Status - Internal Tracking */}
      <Card style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Internal Claim Tracking</div>
            <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>Manual tracking — update as you communicate with the carrier</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            { label: "Carrier Response", value: claim.carrier_response_status || "Pending", color: statusColors[claim.carrier_response_status || "pending"] },
            { label: "Supplement Status", value: claim.supplement_status || "None", color: statusColors[claim.supplement_status || "none"] },
            { label: "Reinspection", value: claim.reinspection_requested ? "Requested" : "Not Requested", color: claim.reinspection_requested ? "yellow" : "gray" },
            { label: "Outstanding Balance", value: `$${(claim.outstanding_balance || 0).toLocaleString()}`, color: (claim.outstanding_balance || 0) > 0 ? "red" : "green" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "12px 14px", background: T.surfaceHigh, borderRadius: 10, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
              <Badge color={s.color}>{s.value}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Financial Breakdown */}
      <Card>
        <div style={{ fontWeight: 700, color: T.white, fontSize: 14, marginBottom: 14 }}>Insurance Payment Tracking</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            ["Payments Received", `$${(claim.payments_received || 0).toLocaleString()}`, T.greenBright],
            ["Recoverable Depreciation", `$${(claim.recoverable_depreciation || 0).toLocaleString()}`, T.yellowBright],
            ["Outstanding Balance", `$${(claim.outstanding_balance || 0).toLocaleString()}`, T.redBright],
          ].map(([label, value, color]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: T.surfaceHigh, borderRadius: 8 }}>
              <span style={{ fontSize: 12, color: T.muted }}>{label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: color as string }}>{value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Claim Timeline */}
      <Card>
        <div style={{ fontWeight: 700, color: T.white, fontSize: 14, marginBottom: 14 }}>Tracking Timeline</div>
        {timelineItems.length === 0 ? (
          <div style={{ fontSize: 12, color: T.dim, padding: "12px 0" }}>No timeline events logged yet</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {timelineItems.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                  {i < timelineItems.length - 1 && <div style={{ width: 2, flex: 1, background: T.border, marginTop: 4 }} />}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Denied Items */}
      <Card style={{ gridColumn: "1 / -1" }}>
        <div style={{ fontWeight: 700, color: T.white, fontSize: 14, marginBottom: 14 }}>Denied Items & Pending Approvals</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.redBright, marginBottom: 8 }}>Denied Items (logged)</div>
            {Array.isArray(claim.denied_items) && (claim.denied_items as any[]).length > 0 ? (
              (claim.denied_items as any[]).map((item: any, i: number) => (
                <div key={i} style={{ fontSize: 12, color: T.text, padding: "6px 10px", background: T.redDim, borderRadius: 6, marginBottom: 4, border: `1px solid ${T.redBright}22` }}>{typeof item === "string" ? item : JSON.stringify(item)}</div>
              ))
            ) : (
              <div style={{ fontSize: 12, color: T.dim }}>No denied items logged</div>
            )}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.yellowBright, marginBottom: 8 }}>Pending Approvals (logged)</div>
            {Array.isArray(claim.pending_approvals) && (claim.pending_approvals as any[]).length > 0 ? (
              (claim.pending_approvals as any[]).map((item: any, i: number) => (
                <div key={i} style={{ fontSize: 12, color: T.text, padding: "6px 10px", background: T.yellowDim, borderRadius: 6, marginBottom: 4, border: `1px solid ${T.yellowBright}22` }}>{typeof item === "string" ? item : JSON.stringify(item)}</div>
              ))
            ) : (
              <div style={{ fontSize: 12, color: T.dim }}>No pending approvals logged</div>
            )}
          </div>
        </div>
      </Card>

      {/* Notes */}
      {claim.notes && (
        <Card style={{ gridColumn: "1 / -1" }}>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 14, marginBottom: 8 }}>Internal Claim Notes</div>
          <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>{claim.notes}</div>
        </Card>
      )}
    </div>
  );
};
