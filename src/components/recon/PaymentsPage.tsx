import { useState } from "react";
import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";
import { useJobs, usePayments } from "@/hooks/useJobs";

export const PaymentsPage = ({ role }: { role: string }) => {
  const { jobs } = useJobs();
  const { payments, loading } = usePayments();
  const [filter, setFilter] = useState("all");

  const totalContractValue = jobs.reduce((a, j) => a + (j.contract_value || 0), 0);
  const totalReceived = payments.reduce((a: number, p: any) => a + (p.amount || 0), 0);
  const totalOutstanding = totalContractValue - totalReceived;
  const mortgageHolds = payments.filter((p: any) => p.mortgage_hold).reduce((a: number, p: any) => a + (p.mortgage_hold_amount || 0), 0);
  const deductiblesOutstanding = payments.filter((p: any) => !p.deductible_collected && p.deductible_amount > 0).reduce((a: number, p: any) => a + (p.deductible_amount || 0), 0);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: T.muted }}>Loading payments...</div>;

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Insurance Payments</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Track insurance payments, deductibles, and mortgage holds</p>
        </div>
        <Btn v="primary" sz="sm" icon="plus">Record Payment</Btn>
      </div>
      <div style={{ padding: "0 28px" }}>
        {/* Financial overview */}
        <div style={{ display: "flex", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
          {[
            { label: "Total Contract Value", value: `$${totalContractValue.toLocaleString()}`, color: T.orange },
            { label: "Payments Received", value: `$${totalReceived.toLocaleString()}`, color: T.greenBright },
            { label: "Outstanding Balance", value: `$${Math.max(0, totalOutstanding).toLocaleString()}`, color: T.redBright },
            { label: "Mortgage Holds", value: `$${mortgageHolds.toLocaleString()}`, color: T.yellowBright },
            { label: "Deductibles Due", value: `$${deductiblesOutstanding.toLocaleString()}`, color: T.purpleBright },
          ].map((s, i) => (
            <Card key={i} style={{ flex: 1, minWidth: 130 }}>
              <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            </Card>
          ))}
        </div>

        {/* Alerts */}
        {totalOutstanding > 0 && (
          <div style={{ background: T.yellowDim, border: `1px solid ${T.yellowBright}44`, borderRadius: 10, padding: "12px 16px", marginBottom: 18, display: "flex", gap: 12, alignItems: "center" }}>
            <Ic n="alert" s={18} c={T.yellowBright}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>⚠️ ${totalOutstanding.toLocaleString()} outstanding across {jobs.filter(j => j.contract_value && j.stage !== "closed").length} jobs</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Review unpaid balances and follow up with carriers</div>
            </div>
          </div>
        )}

        {/* Payment types breakdown */}
        <Card style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 600, color: T.white, marginBottom: 12 }}>Payment Type Guide</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 10 }}>
            {[
              { type: "Initial Payment", desc: "First check from carrier after estimate approval", icon: "💰", color: T.greenBright },
              { type: "Supplement Payment", desc: "Additional payment after supplement approval", icon: "📝", color: T.blueBright },
              { type: "Recoverable Depreciation", desc: "Released after work completion & documentation", icon: "📊", color: T.purpleBright },
              { type: "Final Payment", desc: "Remaining balance after completion", icon: "✅", color: T.tealBright },
              { type: "Deductible", desc: "Homeowner's policy deductible amount", icon: "🏠", color: T.yellowBright },
              { type: "Mortgage Hold", desc: "Payment held by mortgage company", icon: "🏦", color: T.redBright },
            ].map((pt, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 10px", background: T.surfaceHigh, borderRadius: 8 }}>
                <span style={{ fontSize: 18 }}>{pt.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: pt.color }}>{pt.type}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{pt.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Job payment status */}
        {jobs.filter(j => j.contract_value).length === 0 ? (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <Ic n="dollar" s={40} c={T.dim}/>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.white, marginTop: 16 }}>No payment data yet</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>Add contract values to jobs and record payments as they come in.</div>
          </Card>
        ) : (
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 120px 120px 120px 100px", padding: "10px 16px", borderBottom: `1px solid ${T.border}`, background: T.surfaceHigh }}>
              {["Job #", "Customer / Carrier", "Contract", "Received", "Outstanding", "Status"].map(h => (
                <div key={h} style={{ fontSize: 10, fontWeight: 600, color: T.dim, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</div>
              ))}
            </div>
            {jobs.filter(j => j.contract_value).map(j => {
              const jobPayments = payments.filter((p: any) => p.job_id === j.id);
              const received = jobPayments.reduce((a: number, p: any) => a + (p.amount || 0), 0);
              const outstanding = (j.contract_value || 0) - received;
              return (
                <div key={j.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr 120px 120px 120px 100px", padding: "12px 16px", borderBottom: `1px solid ${T.border}22`, alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: T.orange, fontWeight: 700 }}>{j.id}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.white }}>{j.customer}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{j.carrier || "Self-pay"}</div>
                  </div>
                  <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>${(j.contract_value || 0).toLocaleString()}</span>
                  <span style={{ fontSize: 12, color: T.greenBright, fontWeight: 600 }}>${received.toLocaleString()}</span>
                  <span style={{ fontSize: 12, color: outstanding > 0 ? T.redBright : T.greenBright, fontWeight: 600 }}>${outstanding.toLocaleString()}</span>
                  <Badge color={outstanding <= 0 ? "green" : received > 0 ? "yellow" : "red"} small>
                    {outstanding <= 0 ? "Paid" : received > 0 ? "Partial" : "Unpaid"}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
