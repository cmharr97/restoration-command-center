import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";
import { usePayments } from "@/hooks/useJobs";
import type { DbJob } from "@/hooks/useJobs";

const typeLabels: Record<string, string> = {
  initial: "Initial Payment", supplement: "Supplement Payment", depreciation: "Recoverable Depreciation",
  final: "Final Payment", deductible: "Deductible", other: "Other",
};

export const JobPaymentsTab = ({ job }: { job: DbJob }) => {
  const { payments, loading } = usePayments(job.id);

  if (loading) return <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading payments...</div>;

  const totalReceived = payments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
  const contractValue = job.contract_value || 0;
  const outstanding = contractValue - totalReceived;
  const deductiblePayment = payments.find((p: any) => p.deductible_amount > 0);
  const mortgageHold = payments.find((p: any) => p.mortgage_hold);
  const alerts: string[] = [];
  if (outstanding > 0 && contractValue > 0) alerts.push(`$${outstanding.toLocaleString()} outstanding balance`);
  if (deductiblePayment && !deductiblePayment.deductible_collected) alerts.push("Deductible not collected");
  if (mortgageHold) alerts.push(`Mortgage hold: $${(mortgageHold.mortgage_hold_amount || 0).toLocaleString()}`);

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Contract Value", value: `$${contractValue.toLocaleString()}`, color: T.white, icon: "dollar" },
          { label: "Total Received", value: `$${totalReceived.toLocaleString()}`, color: T.greenBright, icon: "check" },
          { label: "Outstanding", value: `$${Math.max(outstanding, 0).toLocaleString()}`, color: outstanding > 0 ? T.redBright : T.greenBright, icon: "alert" },
          { label: "Payments", value: `${payments.length}`, color: T.blueBright, icon: "inv" },
        ].map((s, i) => (
          <Card key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Ic n={s.icon} s={16} c={s.color} />
              <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card style={{ marginBottom: 16, background: T.redDim, borderColor: `${T.redBright}33` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Ic n="alert" s={16} c={T.redBright} />
            <span style={{ fontWeight: 700, color: T.redBright, fontSize: 13 }}>Payment Alerts</span>
          </div>
          {alerts.map((a, i) => (
            <div key={i} style={{ fontSize: 12, color: T.text, padding: "4px 0", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: T.redBright, flexShrink: 0 }} />
              {a}
            </div>
          ))}
        </Card>
      )}

      {/* Deductible & Mortgage Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <Card>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 14, marginBottom: 12 }}>Deductible Status</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: T.muted }}>Amount</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>${(deductiblePayment?.deductible_amount || 0).toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: T.muted }}>Collected</span>
            <Badge color={deductiblePayment?.deductible_collected ? "green" : "red"}>
              {deductiblePayment?.deductible_collected ? "Yes" : "No"}
            </Badge>
          </div>
        </Card>
        <Card>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 14, marginBottom: 12 }}>Mortgage Hold</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: T.muted }}>Status</span>
            <Badge color={mortgageHold ? "yellow" : "green"}>{mortgageHold ? "Active Hold" : "No Hold"}</Badge>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: T.muted }}>Amount</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>${(mortgageHold?.mortgage_hold_amount || 0).toLocaleString()}</span>
          </div>
        </Card>
      </div>

      {/* Payment List */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Payment History</div>
        <Btn v="primary" sz="sm" icon="plus">Record Payment</Btn>
      </div>

      {payments.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: T.dim }}>No payments recorded yet</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {payments.map((p: any) => (
            <Card key={p.id} style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, color: T.text, fontSize: 13, marginBottom: 2 }}>{typeLabels[p.payment_type] || p.payment_type}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>
                    {p.date_received || "No date"} · {p.source || "Unknown source"}
                    {p.check_number && ` · Check #${p.check_number}`}
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: T.greenBright }}>+${(p.amount || 0).toLocaleString()}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
