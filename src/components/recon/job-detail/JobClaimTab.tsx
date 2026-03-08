import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";
import { useClaims } from "@/hooks/useJobs";
import type { DbJob } from "@/hooks/useJobs";

const statusColors: Record<string, string> = {
  pending: "yellow", approved: "green", denied: "red", partial: "orange", review: "blue", none: "gray",
};

export const JobClaimTab = ({ job }: { job: DbJob }) => {
  const { claims, loading } = useClaims(job.id);
  const claim = claims[0]; // primary claim

  if (loading) return <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading claim data...</div>;

  if (!claim) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: T.orangeDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Ic n="shield" s={28} c={T.orange} />
        </div>
        <div style={{ fontWeight: 600, color: T.white, fontSize: 15, marginBottom: 6 }}>No Claim Record</div>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 20 }}>Create a claim record to track insurance progress</div>
        <Btn v="primary" sz="md" icon="plus">Create Claim Record</Btn>
      </div>
    );
  }

  const timelineItems = [
    claim.estimate_submitted_date && { date: claim.estimate_submitted_date, label: "Estimate Submitted", color: T.blueBright, icon: "est" },
    claim.reinspection_date && { date: claim.reinspection_date, label: "Reinspection Scheduled", color: T.purpleBright, icon: "cal" },
    claim.carrier_response_status === "approved" && { date: "—", label: "Carrier Approved", color: T.greenBright, icon: "check" },
    claim.carrier_response_status === "denied" && { date: "—", label: "Carrier Denied", color: T.redBright, icon: "x" },
  ].filter(Boolean) as { date: string; label: string; color: string; icon: string }[];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Status Overview */}
      <Card style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Claim Status</div>
          <Btn v="secondary" sz="sm" icon="edit">Update Status</Btn>
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
        <div style={{ fontWeight: 700, color: T.white, fontSize: 14, marginBottom: 14 }}>Financial Summary</div>
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
        <div style={{ fontWeight: 700, color: T.white, fontSize: 14, marginBottom: 14 }}>Claim Timeline</div>
        {timelineItems.length === 0 ? (
          <div style={{ fontSize: 12, color: T.dim, padding: "12px 0" }}>No timeline events yet</div>
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
            <div style={{ fontSize: 12, fontWeight: 600, color: T.redBright, marginBottom: 8 }}>Denied Items</div>
            {Array.isArray(claim.denied_items) && (claim.denied_items as any[]).length > 0 ? (
              (claim.denied_items as any[]).map((item: any, i: number) => (
                <div key={i} style={{ fontSize: 12, color: T.text, padding: "6px 10px", background: T.redDim, borderRadius: 6, marginBottom: 4, border: `1px solid ${T.redBright}22` }}>{typeof item === "string" ? item : JSON.stringify(item)}</div>
              ))
            ) : (
              <div style={{ fontSize: 12, color: T.dim }}>No denied items</div>
            )}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.yellowBright, marginBottom: 8 }}>Pending Approvals</div>
            {Array.isArray(claim.pending_approvals) && (claim.pending_approvals as any[]).length > 0 ? (
              (claim.pending_approvals as any[]).map((item: any, i: number) => (
                <div key={i} style={{ fontSize: 12, color: T.text, padding: "6px 10px", background: T.yellowDim, borderRadius: 6, marginBottom: 4, border: `1px solid ${T.yellowBright}22` }}>{typeof item === "string" ? item : JSON.stringify(item)}</div>
              ))
            ) : (
              <div style={{ fontSize: 12, color: T.dim }}>No pending approvals</div>
            )}
          </div>
        </div>
      </Card>

      {/* Notes */}
      {claim.notes && (
        <Card style={{ gridColumn: "1 / -1" }}>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 14, marginBottom: 8 }}>Claim Notes</div>
          <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>{claim.notes}</div>
        </Card>
      )}
    </div>
  );
};
