import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";
import { useJobs, usePayments } from "@/hooks/useJobs";

export const PaymentsPage = ({ role }: { role: string }) => {
  const { jobs } = useJobs();
  const { payments, loading } = usePayments();

  const totalContractValue = jobs.reduce((a, j) => a + (j.contract_value || 0), 0);
  const totalReceived = payments.reduce((a: number, p: any) => a + (p.amount || 0), 0);
  const totalOutstanding = Math.max(0, totalContractValue - totalReceived);
  const mortgageHolds = payments.filter((p: any) => p.mortgage_hold).reduce((a: number, p: any) => a + (p.mortgage_hold_amount || 0), 0);
  const deductiblesOutstanding = payments.filter((p: any) => !p.deductible_collected && p.deductible_amount > 0).reduce((a: number, p: any) => a + (p.deductible_amount || 0), 0);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: T.muted }}>Loading payments...</div>;

  const hasPaymentData = jobs.some(j => j.contract_value);

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Payments</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Track insurance payments, deductibles, and mortgage holds</p>
        </div>
        {/* Payment recording is done within individual jobs */}
      </div>
      <div style={{ padding: "0 28px" }}>
        {!hasPaymentData ? (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: T.greenDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Ic n="dollar" s={28} c={T.greenBright}/>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.white }}>Payment Tracking</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 8, maxWidth: 440, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              Track every dollar from initial carrier payment through final collection. Monitor deductibles, mortgage holds, supplement payments, and recoverable depreciation — all tied to individual jobs.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 20, maxWidth: 480, margin: "20px auto 0" }}>
              {[
                { icon: "dollar", label: "Carrier Payments", desc: "Initial & supplement" },
                { icon: "myjobs", label: "Deductibles", desc: "Track homeowner portion" },
                { icon: "lock", label: "Mortgage Holds", desc: "Monitor release status" },
              ].map(p => (
                <div key={p.label} style={{ background: T.surfaceHigh, borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: T.greenDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}><Ic n={p.icon} s={16} c={T.greenBright}/></div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.white }}>{p.label}</div>
                  <div style={{ fontSize: 10, color: T.dim }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <>
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              {[
                { label: "Total Contract Value", value: `$${totalContractValue.toLocaleString()}`, color: T.orange },
                { label: "Payments Received", value: `$${totalReceived.toLocaleString()}`, color: T.greenBright },
                { label: "Outstanding", value: `$${totalOutstanding.toLocaleString()}`, color: totalOutstanding > 0 ? T.redBright : T.greenBright },
                { label: "Mortgage Holds", value: `$${mortgageHolds.toLocaleString()}`, color: T.yellowBright },
                { label: "Deductibles Due", value: `$${deductiblesOutstanding.toLocaleString()}`, color: T.purpleBright },
              ].map((s, i) => (
                <Card key={i} style={{ flex: 1, minWidth: 120, padding: "14px 16px" }}>
                  <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                </Card>
              ))}
            </div>

            {totalOutstanding > 0 && (
              <div style={{ background: T.yellowDim, border: `1px solid ${T.yellowBright}44`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
                <Ic n="alert" s={18} c={T.yellowBright}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>${totalOutstanding.toLocaleString()} outstanding across {jobs.filter(j => j.contract_value && j.stage !== "closed").length} jobs</div>
                </div>
              </div>
            )}

            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 110px 110px 110px 90px", padding: "10px 16px", borderBottom: `1px solid ${T.border}`, background: T.surfaceHigh }}>
                {["Job #", "Customer / Carrier", "Contract", "Received", "Outstanding", "Status"].map(h => (
                  <div key={h} style={{ fontSize: 10, fontWeight: 600, color: T.dim, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</div>
                ))}
              </div>
              {jobs.filter(j => j.contract_value).map(j => {
                const jobPayments = payments.filter((p: any) => p.job_id === j.id);
                const received = jobPayments.reduce((a: number, p: any) => a + (p.amount || 0), 0);
                const outstanding = (j.contract_value || 0) - received;
                return (
                  <div key={j.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr 110px 110px 110px 90px", padding: "12px 16px", borderBottom: `1px solid ${T.border}18`, alignItems: "center" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 12, color: T.orange, fontWeight: 700 }}>{j.id}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: T.white }}>{j.customer}</div>
                      <div style={{ fontSize: 11, color: T.muted }}>{j.carrier || "Self-pay"}</div>
                    </div>
                    <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>${(j.contract_value || 0).toLocaleString()}</span>
                    <span style={{ fontSize: 12, color: T.greenBright, fontWeight: 600 }}>${received.toLocaleString()}</span>
                    <span style={{ fontSize: 12, color: outstanding > 0 ? T.redBright : T.greenBright, fontWeight: 600 }}>${Math.max(0, outstanding).toLocaleString()}</span>
                    <Badge color={outstanding <= 0 ? "green" : received > 0 ? "yellow" : "red"} small>
                      {outstanding <= 0 ? "Paid" : received > 0 ? "Partial" : "Unpaid"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
