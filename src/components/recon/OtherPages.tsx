import { useState } from "react";
import { T, ROLES, TEAM_MEMBERS, JOBS, JOB_STAGES, LOSS_TYPES, stageColor, stageInfo, type Job } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Inp, Sel, Divider } from "@/components/recon/ReconUI";

// ── ESTIMATES PAGE ──
export const EstimatesPage = ({ role }: { role: string }) => {
  const estimates = [
    { id: "E-2041", job: "J-1051", customer: "Martinez, Sarah", type: "Mitigation", software: "Xactimate", amount: 6800, status: "Submitted", adjuster: "Tom Hendricks" },
    { id: "E-2042", job: "J-1051", customer: "Martinez, Sarah", type: "Reconstruction", software: "Xactimate", amount: null, status: "Draft", adjuster: "Tom Hendricks" },
    { id: "E-2039", job: "J-1050", customer: "Sunrise Office Park", type: "Fire Mitigation", software: "Xactimate", amount: 18200, status: "Approved", adjuster: "Linda Park" },
    { id: "E-2040", job: "J-1050", customer: "Sunrise Office Park", type: "Reconstruction", software: "Xactimate", amount: 50200, status: "Supplement", adjuster: "Linda Park" },
    { id: "E-2038", job: "J-1049", customer: "Chen, Wei & Linda", type: "Mold Remediation", software: "Symbility", amount: 7800, status: "Pending", adjuster: "Bill Torres" },
    { id: "E-2037", job: "J-1047", customer: "Rodriguez, Miguel", type: "Storm Damage", software: "Xactimate", amount: null, status: "Draft", adjuster: "Pending" },
  ];
  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Estimates</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Xactimate & Symbility integrated</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn v="secondary" sz="sm">Open Xactimate</Btn>
          <Btn v="primary" sz="sm" icon="plus">New Estimate</Btn>
        </div>
      </div>
      <div style={{ padding: "0 28px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          {[["Xactimate", true, "Last sync 4m ago"], ["Symbility", true, "Last sync 11m ago"], ["XactAnalysis", true, "Claim status synced"]].map(([name, connected, note]) => (
            <div key={name as string} style={{ background: T.surfaceHigh, border: `1px solid ${(connected as boolean) ? T.greenBright + "33" : T.border}`, borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: (connected as boolean) ? T.greenBright : T.redBright }}/>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.white }}>{name as string}</div>
                <div style={{ fontSize: 10, color: T.muted }}>{note as string}</div>
              </div>
            </div>
          ))}
        </div>
        <Card>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["Estimate", "Job", "Customer", "Type", "Software", "Amount", "Status", "Adjuster", "Actions"].map(h => <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: T.dim, fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {estimates.map((e, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${T.border}18` }}
                    onMouseEnter={ev => (ev.currentTarget as HTMLTableRowElement).style.background = T.surfaceHigh}
                    onMouseLeave={ev => (ev.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                  >
                    <td style={{ padding: "11px 12px" }}><span style={{ fontFamily: "monospace", color: T.orange, fontWeight: 700 }}>{e.id}</span></td>
                    <td style={{ padding: "11px 12px" }}><span style={{ fontFamily: "monospace", color: T.muted, fontSize: 11 }}>{e.job}</span></td>
                    <td style={{ padding: "11px 12px", fontWeight: 500 }}>{e.customer}</td>
                    <td style={{ padding: "11px 12px", color: T.muted }}>{e.type}</td>
                    <td style={{ padding: "11px 12px" }}><Badge color="blue" small>{e.software}</Badge></td>
                    <td style={{ padding: "11px 12px", fontWeight: 700, color: e.amount ? T.white : T.dim }}>{e.amount ? `$${e.amount.toLocaleString()}` : "—"}</td>
                    <td style={{ padding: "11px 12px" }}><Badge color={e.status === "Approved" ? "green" : e.status === "Draft" ? "gray" : e.status === "Supplement" ? "yellow" : e.status === "Submitted" ? "blue" : "orange"} small>{e.status}</Badge></td>
                    <td style={{ padding: "11px 12px", color: T.muted, fontSize: 12 }}>{e.adjuster}</td>
                    <td style={{ padding: "11px 12px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn v="secondary" sz="sm" icon="eye">View</Btn>
                        <Btn v="secondary" sz="sm" icon="upload">Send</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ── INVOICES PAGE ──
export const InvoicesPage = ({ role }: { role: string }) => {
  const rm = ROLES[role];
  const invoices = [
    { id: "INV-3001", job: "J-1048", customer: "Valley View Apts", amount: 8750, status: "Sent", date: "Mar 5", due: "Mar 20", type: "Mitigation" },
    { id: "INV-3002", job: "J-1045", customer: "Patel Commercial", amount: 42800, status: "Paid", date: "Feb 28", due: "Mar 14", type: "Full Project" },
    { id: "INV-3003", job: "J-1050", customer: "Sunrise Office Park", amount: 18200, status: "Partial", date: "Mar 1", due: "Mar 15", type: "Mitigation" },
  ];
  if (!rm.canViewInvoices) return <div style={{ padding: 40, textAlign: "center", color: T.muted }}><Ic n="lock" s={32} c={T.dim}/><div style={{ marginTop: 12 }}>Invoices are only accessible to authorized roles.</div></div>;
  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Invoices</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Billing and payment tracking</p>
        </div>
        <Btn v="primary" sz="sm" icon="plus">Create Invoice</Btn>
      </div>
      <div style={{ padding: "0 28px" }}>
        <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
          {[["Outstanding", "$26,950", T.yellowBright], ["Paid (MTD)", "$42,800", T.greenBright], ["Overdue", "$0", T.redBright]].map(([l, v, c]) => (
            <Card key={l as string} style={{ flex: 1, minWidth: 130 }}>
              <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{l as string}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: c as string }}>{v as string}</div>
            </Card>
          ))}
        </div>
        <Card>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["Invoice", "Job", "Customer", "Type", "Amount", "Status", "Issued", "Due", "Actions"].map(h => <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: T.dim, fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${T.border}18` }}
                    onMouseEnter={ev => (ev.currentTarget as HTMLTableRowElement).style.background = T.surfaceHigh}
                    onMouseLeave={ev => (ev.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                  >
                    <td style={{ padding: "11px 12px" }}><span style={{ fontFamily: "monospace", color: T.orange, fontWeight: 700 }}>{inv.id}</span></td>
                    <td style={{ padding: "11px 12px" }}><span style={{ fontFamily: "monospace", color: T.muted, fontSize: 11 }}>{inv.job}</span></td>
                    <td style={{ padding: "11px 12px", fontWeight: 500 }}>{inv.customer}</td>
                    <td style={{ padding: "11px 12px", color: T.muted }}>{inv.type}</td>
                    <td style={{ padding: "11px 12px", fontWeight: 700, color: T.white }}>${inv.amount.toLocaleString()}</td>
                    <td style={{ padding: "11px 12px" }}><Badge color={inv.status === "Paid" ? "green" : inv.status === "Partial" ? "yellow" : "blue"} small>{inv.status}</Badge></td>
                    <td style={{ padding: "11px 12px", color: T.muted }}>{inv.date}</td>
                    <td style={{ padding: "11px 12px", color: T.muted }}>{inv.due}</td>
                    <td style={{ padding: "11px 12px" }}><Btn v="secondary" sz="sm" icon="eye">View</Btn></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ── TEAM PAGE ──
export const TeamPage = ({ role: userRole }: { role: string }) => {
  const statusColors: Record<string, string> = { office: T.blueBright, on_site: T.greenBright, driving: T.yellowBright, off: T.dim };
  const statusLabels: Record<string, string> = { office: "In Office", on_site: "On Site", driving: "En Route", off: "Off Duty" };
  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Team & Users</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Role-based access control — {TEAM_MEMBERS.length} users</p>
        </div>
        {ROLES[userRole]?.canManageUsers && <Btn v="primary" sz="sm" icon="plus">Invite User</Btn>}
      </div>
      <div style={{ padding: "0 28px" }}>
        <Card style={{ marginBottom: 18, background: T.orangeDim, borderColor: T.orange + "44" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Ic n="shield" s={18} c={T.orange}/>
            <div>
              <div style={{ fontWeight: 600, color: T.white, fontSize: 13, marginBottom: 4 }}>Role-Based Access Control</div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {Object.entries(ROLES).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: v.color }}/>
                    <span style={{ fontSize: 11, color: T.muted }}>{v.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 14 }}>
          {TEAM_MEMBERS.map((m, i) => {
            const roleInfo = ROLES[m.role];
            return (
              <Card key={i}>
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${T.orange},${T.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff", flexShrink: 0 }}>{m.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: T.white, fontSize: 13 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{m.email}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: statusColors[m.status] }}/>
                    <span style={{ fontSize: 10, color: statusColors[m.status] }}>{statusLabels[m.status]}</span>
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <Badge color={m.role === "owner" ? "orange" : m.role === "project_manager" ? "blue" : m.role === "estimator" ? "purple" : m.role === "office_admin" ? "teal" : m.role === "field_tech" ? "green" : "gray"}>{roleInfo?.label}</Badge>
                </div>
                {m.currentJob && <div style={{ background: T.orangeDim, borderRadius: 6, padding: "5px 9px", fontSize: 11, color: T.orange, marginBottom: 10 }}>📍 Active on {m.currentJob}</div>}
                {m.certs.length > 0 && <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                  {m.certs.map(c => <Badge key={c} color="blue" small>{c}</Badge>)}
                </div>}
                {ROLES[userRole]?.canManageUsers && (
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn v="secondary" sz="sm" icon="edit">Edit Role</Btn>
                    <Btn v="ghost" sz="sm" icon="contact">{m.phone}</Btn>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── EQUIPMENT PAGE ──
export const EquipmentPage = () => {
  const equipment = [
    { id: "EQ-001", name: "Dri-Eaz LGR 3500i Dehumidifier", category: "Dehu", total: 6, inUse: 4, available: 2, location: "J-1051 (2), J-1046 (2)" },
    { id: "EQ-002", name: "Dri-Eaz F203 Air Mover", category: "Air Mover", total: 24, inUse: 14, available: 10, location: "J-1051 (8), J-1046 (6)" },
    { id: "EQ-003", name: "Dri-Eaz HEPA 500 Air Scrubber", category: "Scrubber", total: 4, inUse: 2, available: 2, location: "J-1051 (1), J-1046 (1)" },
    { id: "EQ-004", name: "Tramex CMExpert II Moisture Meter", category: "Meter", total: 5, inUse: 3, available: 2, location: "Field" },
    { id: "EQ-005", name: "General Digital Thermo-Hygrometer", category: "Meter", total: 8, inUse: 4, available: 4, location: "Field" },
    { id: "EQ-006", name: "Dri-Eaz PHD 200 Dehumidifier", category: "Dehu", total: 4, inUse: 0, available: 4, location: "Warehouse" },
  ];
  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Equipment</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Track drying equipment across all job sites</p>
        </div>
        <Btn v="primary" sz="sm" icon="plus">Add Equipment</Btn>
      </div>
      <div style={{ padding: "0 28px" }}>
        <Card>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["ID", "Equipment", "Category", "Total", "In Use", "Available", "Current Location", "Actions"].map(h => <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: T.dim, fontWeight: 500, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {equipment.map((eq, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${T.border}18` }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = T.surfaceHigh}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                  >
                    <td style={{ padding: "11px 12px" }}><span style={{ fontFamily: "monospace", color: T.orange, fontSize: 11, fontWeight: 700 }}>{eq.id}</span></td>
                    <td style={{ padding: "11px 12px", fontWeight: 500 }}>{eq.name}</td>
                    <td style={{ padding: "11px 12px" }}><Badge color="blue" small>{eq.category}</Badge></td>
                    <td style={{ padding: "11px 12px", fontWeight: 700, textAlign: "center" }}>{eq.total}</td>
                    <td style={{ padding: "11px 12px", color: eq.inUse > 0 ? T.orange : T.muted, fontWeight: 600, textAlign: "center" }}>{eq.inUse}</td>
                    <td style={{ padding: "11px 12px", color: eq.available > 0 ? T.greenBright : T.redBright, fontWeight: 600, textAlign: "center" }}>{eq.available}</td>
                    <td style={{ padding: "11px 12px", color: T.muted, fontSize: 11 }}>{eq.location}</td>
                    <td style={{ padding: "11px 12px" }}><Btn v="secondary" sz="sm">Track</Btn></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ── MY JOBS PAGE (Field Tech) ──
export const MyJobsPage = ({ role, setSelectedJob, setActive }: { role: string; setSelectedJob: (job: Job) => void; setActive: (id: string) => void }) => {
  const [clockedIn, setClockedIn] = useState(false);
  const myJobs = JOBS.filter(j => j.techs.includes("Marcus Webb") || j.techs.includes("Aisha Thompson"));
  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", marginBottom: 18 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>My Jobs</h1>
        <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Your assigned jobs for today</p>
      </div>
      <div style={{ padding: "0 28px" }}>
        <Card style={{ marginBottom: 16, background: clockedIn ? T.greenDim : T.surfaceHigh, borderColor: clockedIn ? T.greenBright + "44" : T.border }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Ic n="timeclock" s={20} c={clockedIn ? T.greenBright : T.muted}/>
              <div>
                <div style={{ fontWeight: 600, color: T.white }}>{clockedIn ? "Clocked In – 8:02 AM" : "Not Clocked In"}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{clockedIn ? "Time on clock: 3h 22m" : "Tap to start your shift"}</div>
              </div>
            </div>
            <Btn v={clockedIn ? "success" : "primary"} onClick={() => setClockedIn(!clockedIn)}>{clockedIn ? "Clock Out" : "Clock In"}</Btn>
          </div>
        </Card>
        {myJobs.map(j => (
          <Card key={j.id} style={{ marginBottom: 12 }} glow={j.priority === "high"}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: T.orange, fontWeight: 700 }}>{j.id}</span>
                  <Badge color={stageColor[j.stage] || "gray"} small dot>{stageInfo(j.stage).label}</Badge>
                </div>
                <div style={{ fontWeight: 600, color: T.white }}>{j.customer}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{j.address}</div>
              </div>
              <Btn v="primary" sz="sm" onClick={() => { setSelectedJob(j); setActive("job_detail"); }}>Open Job</Btn>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn v="secondary" sz="sm" icon="moisture">Log Reading</Btn>
              <Btn v="secondary" sz="sm" icon="photo">Add Photos</Btn>
              <Btn v="secondary" sz="sm" icon="note">Add Note</Btn>
              <Btn v="secondary" sz="sm" icon="contact">Call PM</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ── CUSTOMERS PAGE ──
export const CustomersPage = () => (
  <div style={{ padding: "0 0 40px" }}>
    <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
      <div><h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Customers</h1><p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Homeowners, property managers & commercial clients</p></div>
      <Btn v="primary" sz="sm" icon="plus">Add Customer</Btn>
    </div>
    <div style={{ padding: "0 28px" }}>
      {[
        { name: "Martinez, Sarah", type: "Homeowner", jobs: 1, value: 11200, carrier: "State Farm", status: "Active" },
        { name: "Sunrise Office Park LLC", type: "Commercial", jobs: 2, value: 68400, carrier: "Travelers", status: "VIP" },
        { name: "Chen, Wei & Linda", type: "Homeowner", jobs: 1, value: null, carrier: "Farmers", status: "Active" },
        { name: "Valley View Apartments", type: "Property Manager", jobs: 3, value: 26250, carrier: "USAA", status: "VIP" },
        { name: "Rodriguez, Miguel", type: "Homeowner", jobs: 1, value: null, carrier: "Allstate", status: "Active" },
        { name: "Patel Commercial Group", type: "Commercial", jobs: 3, value: 42800, carrier: "Zurich", status: "VIP" },
        { name: "Highland Park HOA", type: "Property Manager", jobs: 1, value: null, carrier: "Liberty Mutual", status: "New" },
      ].map((c, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, marginBottom: 8, cursor: "pointer" }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = T.borderMid; (e.currentTarget as HTMLDivElement).style.background = T.surfaceHigh; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = T.border; (e.currentTarget as HTMLDivElement).style.background = T.surface; }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${T.orange}88,${T.blue}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{c.name[0]}</div>
            <div>
              <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: T.muted }}>{c.type} · {c.carrier}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: T.white }}>{c.jobs}</div><div style={{ fontSize: 10, color: T.muted }}>Jobs</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 13, fontWeight: 700, color: T.greenBright }}>{c.value ? `$${c.value.toLocaleString()}` : "—"}</div><div style={{ fontSize: 10, color: T.muted }}>Total Value</div></div>
            <Badge color={c.status === "VIP" ? "orange" : c.status === "New" ? "yellow" : "green"}>{c.status}</Badge>
            <div style={{ display: "flex", gap: 6 }}>
              <Btn v="secondary" sz="sm" icon="eye">View</Btn>
              <Btn v="secondary" sz="sm" icon="contact">Call</Btn>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── REFERRALS PAGE ──
export const ReferralsPage = () => (
  <div style={{ padding: "0 0 40px" }}>
    <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Referrals & CRM</h1>
        <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Track lead sources, referral partners, and relationship ROI</p>
      </div>
      <Btn v="primary" sz="sm" icon="plus">Add Partner</Btn>
    </div>
    <div style={{ padding: "0 28px" }}>
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        {[["Total Partners", "47", T.orange], ["Jobs This Month", "8", T.greenBright], ["Referral Revenue", "$94K", T.blueBright], ["Top Source", "Property Managers", T.purpleBright]].map(([l, v, c]) => (
          <Card key={l as string} style={{ flex: 1, minWidth: 130 }}>
            <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{l as string}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: c as string }}>{v as string}</div>
          </Card>
        ))}
      </div>
      {[
        { name: "Valley View Properties", type: "Property Manager", contact: "Karen Fields", jobs: 8, revenue: 98400, status: "VIP" },
        { name: "Austin Plumbers Co-op", type: "Trade Referral", contact: "Mike Torres", jobs: 5, revenue: 34200, status: "Active" },
        { name: "State Farm – Austin Central", type: "Insurance Agency", contact: "Tom Hendricks", jobs: 12, revenue: 142000, status: "VIP" },
        { name: "RE/MAX Capitol City", type: "Real Estate", contact: "Linda Park", jobs: 3, revenue: 21000, status: "Active" },
        { name: "HomeAdvisor Leads", type: "Digital", contact: "Auto", jobs: 6, revenue: 28000, status: "Active" },
      ].map((p, i) => (
        <Card key={i} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                {p.type === "Property Manager" ? "🏢" : p.type === "Insurance Agency" ? "🛡️" : p.type === "Trade Referral" ? "🔧" : p.type === "Real Estate" ? "🏠" : "💻"}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{p.type} · Contact: {p.contact}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 700, color: T.white }}>{p.jobs}</div><div style={{ fontSize: 10, color: T.muted }}>Jobs</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 14, fontWeight: 700, color: T.greenBright }}>${(p.revenue / 1000).toFixed(0)}K</div><div style={{ fontSize: 10, color: T.muted }}>Revenue</div></div>
              <Badge color={p.status === "VIP" ? "orange" : "green"}>{p.status}</Badge>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn v="secondary" sz="sm" icon="contact">Contact</Btn>
                <Btn v="secondary" sz="sm" icon="note">Log Activity</Btn>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// ── REPORTS PAGE ──
export const ReportsPage = ({ role }: { role: string }) => {
  const rm = ROLES[role];
  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", marginBottom: 18 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Reports</h1>
        <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Business intelligence & compliance reporting</p>
      </div>
      <div style={{ padding: "0 28px" }}>
        {!rm.canSeeProfitMargins && (
          <Card style={{ marginBottom: 16, background: T.orangeDim, borderColor: T.orange + "44" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Ic n="lock" s={16} c={T.orange}/>
              <div style={{ fontSize: 13, color: T.text }}>Some financial reports are only visible to <strong style={{ color: T.orange }}>Owner / Admin</strong> accounts.</div>
            </div>
          </Card>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 14 }}>
          {[
            { title: "Job Revenue Report", desc: "Revenue by job type, PM, and date range", icon: "dollar", color: T.orange, ownerOnly: false },
            { title: "Profit Margin by Job", desc: "Cost vs. revenue breakdown per job", icon: "chart", color: T.greenBright, ownerOnly: true },
            { title: "Drying Log Summary", desc: "S500-compliant drying reports for all water jobs", icon: "moisture", color: T.blueBright, ownerOnly: false },
            { title: "Insurance Carrier Analysis", desc: "Approval rates, supplement success, avg payout", icon: "shield", color: T.purpleBright, ownerOnly: false },
            { title: "Crew Productivity", desc: "Jobs completed, hours logged, ratings per tech", icon: "users", color: T.tealBright, ownerOnly: false },
            { title: "Equipment Utilization", desc: "Equipment out vs. in, utilization rate", icon: "tool", color: T.yellowBright, ownerOnly: true },
            { title: "Referral Source ROI", desc: "Revenue per lead source and partner", icon: "handshake", color: T.orange, ownerOnly: true },
            { title: "Accounts Receivable", desc: "Outstanding invoices by carrier and age", icon: "inv", color: T.redBright, ownerOnly: true },
            { title: "Job Cycle Time", desc: "Avg days per stage, bottleneck analysis", icon: "clock", color: T.blueBright, ownerOnly: false },
            { title: "Supplement Report", desc: "Supplement frequency, approval rates, avg $", icon: "est", color: T.yellowBright, ownerOnly: false },
            { title: "Payroll Summary", desc: "Technician hours, overtime, job costing", icon: "dollar", color: T.greenBright, ownerOnly: true },
            { title: "Customer Satisfaction", desc: "Reviews, ratings, and repeat customer rate", icon: "star", color: T.orange, ownerOnly: false },
          ].map((r, i) => {
            const locked = r.ownerOnly && !rm.canSeeProfitMargins;
            return (
              <Card key={i} style={{ opacity: locked ? 0.5 : 1, cursor: locked ? "not-allowed" : "pointer" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ background: `${r.color}1a`, padding: 9, borderRadius: 8, flexShrink: 0 }}>
                    <Ic n={r.icon} s={16} c={locked ? T.dim : r.color}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontWeight: 600, color: locked ? T.dim : T.white, fontSize: 13, marginBottom: 3 }}>{r.title}</div>
                      {locked && <Ic n="lock" s={12} c={T.dim}/>}
                    </div>
                    <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{r.desc}</div>
                    {!locked && <div style={{ fontSize: 11, color: r.color, marginTop: 6, cursor: "pointer" }}>Run Report →</div>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── INTEGRATIONS PAGE ──
export const IntegrationsPage = () => (
  <div style={{ padding: "0 0 40px" }}>
    <div style={{ padding: "24px 28px 0", marginBottom: 18 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Integrations</h1>
      <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Connect your restoration tech stack</p>
    </div>
    <div style={{ padding: "0 28px" }}>
      {[
        { cat: "Estimating", items: [
          { name: "Xactimate", desc: "Industry-standard property claims estimating.", status: "Connected", emoji: "📊" },
          { name: "Symbility / CoreLogic", desc: "Cloud-based claims management.", status: "Connected", emoji: "☁️" },
          { name: "XactAnalysis", desc: "Track claim status and TPA requirements.", status: "Connected", emoji: "📈" },
        ]},
        { cat: "Accounting", items: [
          { name: "QuickBooks Online", desc: "Sync invoices, payments, and expenses.", status: "Connected", emoji: "💼" },
          { name: "Sage Intacct", desc: "Enterprise-grade accounting.", status: "Available", emoji: "📚" },
        ]},
        { cat: "Payments", items: [
          { name: "Stripe", desc: "Credit card and ACH payments.", status: "Connected", emoji: "💳" },
          { name: "Zego", desc: "Insurance company payment acceptance.", status: "Available", emoji: "🏦" },
        ]},
        { cat: "Field Documentation", items: [
          { name: "CompanyCam", desc: "Photo documentation by job site.", status: "Connected", emoji: "📷" },
          { name: "Encircle", desc: "Field documentation and contents inventory.", status: "Available", emoji: "📐" },
          { name: "DocuSketch", desc: "360° job site scanning.", status: "Available", emoji: "🔄" },
        ]},
        { cat: "Moisture & Drying", items: [
          { name: "MICA", desc: "Carrier-mandated moisture documentation.", status: "Connected", emoji: "💧" },
          { name: "Tramex Bluetooth", desc: "Bluetooth moisture meter integration.", status: "Available", emoji: "📡" },
        ]},
        { cat: "Documents & Signatures", items: [
          { name: "DocuSign", desc: "E-signature for AOBs and work authorizations.", status: "Connected", emoji: "✍️" },
          { name: "Formstack", desc: "Custom field forms and checklists.", status: "Available", emoji: "📝" },
        ]},
        { cat: "Communication", items: [
          { name: "Twilio", desc: "Automated SMS updates to customers.", status: "Connected", emoji: "📱" },
          { name: "Slack", desc: "Internal team notifications and alerts.", status: "Connected", emoji: "💬" },
        ]},
        { cat: "Scheduling & CRM", items: [
          { name: "Google Calendar", desc: "Sync job schedules and crew assignments.", status: "Connected", emoji: "📅" },
          { name: "HubSpot CRM", desc: "Lead tracking and follow-up automation.", status: "Available", emoji: "🎯" },
        ]},
      ].map((group, gi) => (
        <div key={gi} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.dim, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>{group.cat}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 12 }}>
            {group.items.map((int, i) => (
              <Card key={i}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 26, width: 44, height: 44, background: T.surfaceHigh, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{int.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, color: T.white, fontSize: 13 }}>{int.name}</div>
                      <Badge color={int.status === "Connected" ? "green" : "blue"} small dot>{int.status}</Badge>
                    </div>
                    <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5, marginBottom: 10 }}>{int.desc}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {int.status === "Connected" ? <><Btn v="secondary" sz="sm">Configure</Btn><Btn v="ghost" sz="sm" style={{ color: T.redBright }}>Disconnect</Btn></> : <Btn v="primary" sz="sm">Connect</Btn>}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── SETTINGS PAGE ──
export const SettingsPage = ({ role }: { role: string }) => {
  const [tab, setTab] = useState("company");
  const rm = ROLES[role];
  if (!rm.canManageUsers) return <div style={{ padding: 40, textAlign: "center", color: T.muted }}><Ic n="lock" s={32} c={T.dim}/><div style={{ marginTop: 12, fontSize: 14 }}>Settings are only accessible to Owner / Admin accounts.</div></div>;
  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Settings</h1>
      </div>
      <div style={{ padding: "0 28px" }}>
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 20, overflowX: "auto" }}>
          {["company", "billing", "job_stages", "insurance", "notifications", "users", "import_export"].map(t => (
            <div key={t} onClick={() => setTab(t)} style={{ padding: "10px 16px", cursor: "pointer", fontSize: 12, fontWeight: tab === t ? 600 : 400, color: tab === t ? T.orange : T.muted, borderBottom: `2px solid ${tab === t ? T.orange : "transparent"}`, marginBottom: -1, whiteSpace: "nowrap", textTransform: "capitalize" }}>{t.replace("_", " ")}</div>
          ))}
        </div>
        {tab === "company" && (
          <Card style={{ maxWidth: 800 }}>
            <div style={{ fontWeight: 600, color: T.white, marginBottom: 16 }}>Company Profile</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Inp label="Company Name" placeholder="ReCon Pro Inc." required/>
              <Inp label="State Contractor License #" placeholder="CR-123456" required/>
              <Inp label="Phone" placeholder="(555) 000-0000"/>
              <Inp label="Email" placeholder="office@reconpro.com"/>
              <Inp label="Address" placeholder="123 Main Street"/>
              <Inp label="City, State, ZIP" placeholder="Austin, TX 78701"/>
              <Inp label="IICRC Member #" placeholder="IICRC-XXXXXX"/>
              <Inp label="Insurance Cert #" placeholder="Policy number"/>
            </div>
            <Divider/>
            <Btn v="primary">Save Company Info</Btn>
          </Card>
        )}
        {tab === "job_stages" && (
          <Card style={{ maxWidth: 600 }}>
            <div style={{ fontWeight: 600, color: T.white, marginBottom: 4 }}>Job Stage Workflow</div>
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>Configure stages and notification triggers</div>
            {JOB_STAGES.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: T.surfaceHigh, borderRadius: 8, marginBottom: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }}/>
                <span style={{ fontSize: 13, flex: 1, color: T.text }}>{s.label}</span>
                <span style={{ fontSize: 11, color: T.muted }}>Triggers notification</span>
                <input type="checkbox" defaultChecked={["mitigation", "invoiced", "paid"].includes(s.id)} style={{ accentColor: T.orange }}/>
              </div>
            ))}
          </Card>
        )}
        {!["company", "job_stages"].includes(tab) && (
          <Card style={{ maxWidth: 600 }}>
            <div style={{ textAlign: "center", padding: 32, color: T.muted }}>
              <Ic n="cog" s={28} c={T.dim}/>
              <div style={{ marginTop: 10, fontSize: 13, fontWeight: 500, color: T.text, textTransform: "capitalize" }}>{tab.replace("_", " ")} Settings</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Configure your {tab.replace("_", " ")} preferences</div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
// ── SUBCONTRACTORS PAGE ──
export const SubcontractorsPage = () => {
  const subs = [
    { name: "Austin Drywall Pros", trade: "Drywall & Framing", contact: "Mike Torres", phone: "(512) 555-1100", coi: true, w9: true, jobs: 8, rating: 4.8, status: "Approved" },
    { name: "Hill Country Flooring", trade: "Flooring Installation", contact: "Lisa Chen", phone: "(512) 555-2200", coi: true, w9: true, jobs: 5, rating: 4.6, status: "Approved" },
    { name: "Capital City Paint", trade: "Painting & Finishing", contact: "James Wilson", phone: "(512) 555-3300", coi: true, w9: false, jobs: 3, rating: 4.5, status: "Pending W9" },
    { name: "Lone Star Cabinets", trade: "Cabinet & Countertop", contact: "Maria Garcia", phone: "(512) 555-4400", coi: true, w9: true, jobs: 4, rating: 4.9, status: "Approved" },
    { name: "TX Plumbing Solutions", trade: "Plumbing", contact: "Robert Kim", phone: "(512) 555-5500", coi: false, w9: true, jobs: 2, rating: 4.3, status: "Pending COI" },
    { name: "ATX Electric", trade: "Electrical", contact: "David Lee", phone: "(512) 555-6600", coi: true, w9: true, jobs: 6, rating: 4.7, status: "Approved" },
  ];
  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Subcontractors</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Manage trade partners, compliance, and job access</p>
        </div>
        <Btn v="primary" sz="sm" icon="plus">Add Subcontractor</Btn>
      </div>
      <div style={{ padding: "0 28px" }}>
        <Card style={{ marginBottom: 14, background: T.orangeDim, borderColor: T.orange + "44" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Ic n="shield" s={16} c={T.orange}/>
            <div style={{ fontSize: 12, color: T.text }}>
              <strong style={{ color: T.orange }}>Compliance Tracking:</strong> 2 subcontractors have missing documents. COI and W9 must be current before job assignment.
            </div>
          </div>
        </Card>
        {subs.map((s, i) => (
          <Card key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔧</div>
                <div>
                  <div style={{ fontWeight: 600, color: T.white, fontSize: 14 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{s.trade} · {s.contact} · {s.phone}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <Badge color={s.coi ? "green" : "red"} small>{s.coi ? "COI ✓" : "COI ✗"}</Badge>
                  <Badge color={s.w9 ? "green" : "red"} small>{s.w9 ? "W9 ✓" : "W9 ✗"}</Badge>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: T.white }}>{s.jobs}</div>
                  <div style={{ fontSize: 10, color: T.muted }}>Jobs</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.yellowBright }}>⭐ {s.rating}</div>
                </div>
                <Badge color={s.status === "Approved" ? "green" : "yellow"} small>{s.status}</Badge>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn v="secondary" sz="sm" icon="eye">View</Btn>
                  <Btn v="secondary" sz="sm" icon="contact">Call</Btn>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ── NEW JOB MODAL ──
export const NewJobModal = ({ onClose }: { onClose: () => void }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
    <Card style={{ width: 580, maxHeight: "90vh", overflowY: "auto", background: T.surface }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.white }}>Create New Job</h2>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 12 }}>All fields marked * are required for dispatch</p>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted }}><Ic n="x" s={18}/></button>
      </div>

      <Divider label="Loss Information"/>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13, marginBottom: 14 }}>
        <Sel label="Loss Type *" options={LOSS_TYPES.map(l => l.label)}/>
        <Sel label="Loss Category *" options={["Select loss type first", "Cat 1 – Clean", "Cat 2 – Grey", "Cat 3 – Black"]}/>
        <Inp label="Date of Loss *" type="date" required/>
        <Sel label="Loss Source" options={["Unknown", "Plumbing Failure", "Appliance Leak", "Roof Leak", "Storm/Flood", "Fire", "Other"]}/>
      </div>

      <Divider label="Property & Customer"/>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13, marginBottom: 14 }}>
        <Inp label="Customer Name *" placeholder="Full name or company" required/>
        <Inp label="Phone *" placeholder="(555) 000-0000" required/>
        <Inp label="Property Address *" placeholder="123 Main St" style={{ gridColumn: "1/-1" }} required/>
        <Inp label="City, State, ZIP *" placeholder="Austin, TX 78701" required/>
        <Sel label="Property Type" options={["Single Family Residential", "Multi-Unit Residential", "Commercial", "Industrial"]}/>
      </div>

      <Divider label="Insurance Information"/>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13, marginBottom: 14 }}>
        <Sel label="Insurance Carrier" options={["Homeowner (Self-Pay)", "State Farm", "Allstate", "Travelers", "Farmers", "USAA", "Liberty Mutual", "Zurich", "Other"]}/>
        <Inp label="Claim Number" placeholder="Carrier claim #"/>
        <Inp label="Adjuster Name" placeholder="Insurance adjuster"/>
        <Inp label="Adjuster Phone" placeholder="(555) 000-0000"/>
      </div>

      <Divider label="Assignment"/>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13, marginBottom: 14 }}>
        <Sel label="Assign Project Manager" options={TEAM_MEMBERS.filter(m => m.role === "project_manager" || m.role === "owner").map(m => m.name)}/>
        <Sel label="Assign Lead Tech" options={["Unassigned", ...TEAM_MEMBERS.filter(m => m.role === "field_tech").map(m => m.name)]}/>
        <Sel label="Priority" options={["Normal", "High – Urgent", "Emergency (Cat 3/Sewage)"]}/>
      </div>

      <Divider label="Notes"/>
      <textarea placeholder="Loss description, access notes, gate codes..." rows={3} style={{ width: "100%", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: 16 }}
        onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = T.orange}
        onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = T.border}
      />

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn v="secondary" onClick={onClose}>Cancel</Btn>
        <Btn v="secondary" onClick={onClose}>Save as Draft</Btn>
        <Btn v="primary" icon="truck" onClick={onClose}>Create & Dispatch</Btn>
      </div>
    </Card>
  </div>
);
