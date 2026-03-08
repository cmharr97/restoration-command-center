import { useState } from "react";
import { T, ROLES, JOB_STAGES, LOSS_TYPES, stageInfo, stageColor } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";
import type { DbJob } from "@/hooks/useJobs";

export const JobOverviewTab = ({ job, role }: { job: DbJob; role: string }) => {
  const rm = ROLES[role];
  const lossLabel = LOSS_TYPES.find(l => l.id === job.loss_type)?.label || job.loss_type;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Customer Info */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: T.orangeDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic n="customer" s={16} c={T.orange} />
          </div>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Customer Information</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["Name", job.customer],
            ["Phone", job.phone || "N/A"],
            ["Address", job.address],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: 12, color: T.muted, minWidth: 80 }}>{k}</span>
              <span style={{ fontSize: 13, color: T.text, fontWeight: 500, textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Property & Loss Details */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: T.blueDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic n="drop" s={16} c={T.blueBright} />
          </div>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Loss Details</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["Loss Type", `${lossLabel}${job.loss_subtype ? ` – ${job.loss_subtype}` : ""}`],
            ["Date of Loss", job.date_of_loss || "TBD"],
            ["Priority", job.priority || "Normal"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: T.muted }}>{k}</span>
              <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Insurance Info */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: T.purpleDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic n="shield" s={16} c={T.purpleBright} />
          </div>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Insurance Information</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["Carrier", job.carrier || "TBD"],
            ["Claim #", job.claim_no || "TBD"],
            ["Adjuster", job.adjuster || "TBD"],
            ["Adj. Phone", job.adjuster_phone || "TBD"],
            ["Mortgage Co.", job.mortgage_company || "N/A"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: T.muted }}>{k}</span>
              <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Assigned Team */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: T.greenDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic n="users" s={16} c={T.greenBright} />
          </div>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Assigned Team</div>
        </div>
        {job.pm_name ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: T.surfaceHigh, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${T.orange},${T.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
              {job.pm_name?.split(" ").map(x => x[0]).join("") || "?"}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{job.pm_name}</div>
              <div style={{ fontSize: 11, color: T.muted }}>Project Manager</div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: T.dim, padding: "12px 0" }}>No team assigned yet</div>
        )}
      </Card>

      {/* Financial Summary */}
      {rm.canViewInvoices && (
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.yellowDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic n="dollar" s={16} c={T.yellowBright} />
            </div>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Financial Summary</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["Contract Value", job.contract_value ? `$${job.contract_value.toLocaleString()}` : "—"],
              ["Mitigation Value", job.mitigation_value ? `$${job.mitigation_value.toLocaleString()}` : "—"],
              ["Recon Value", job.recon_value ? `$${job.recon_value.toLocaleString()}` : "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: T.muted }}>{k}</span>
                <span style={{ fontSize: 14, color: T.white, fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Notes */}
      <Card style={rm.canViewInvoices ? {} : { gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: T.tealDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic n="note" s={16} c={T.tealBright} />
          </div>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>Notes</div>
        </div>
        {job.scope_notes && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Scope Notes</div>
            <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6, padding: "8px 12px", background: T.surfaceHigh, borderRadius: 6, border: `1px solid ${T.border}` }}>{job.scope_notes}</div>
          </div>
        )}
        <div>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Internal Notes</div>
          <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6, padding: "8px 12px", background: T.surfaceHigh, borderRadius: 6, border: `1px solid ${T.border}` }}>{job.notes || "No notes yet"}</div>
        </div>
      </Card>
    </div>
  );
};
