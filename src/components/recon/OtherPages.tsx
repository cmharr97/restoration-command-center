import { useState } from "react";
import { T, ROLES, JOB_STAGES, LOSS_TYPES, stageColor, stageInfo } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Inp, Sel, Divider } from "@/components/recon/ReconUI";
import { useJobs, useTeamMembers, type DbJob } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// ── ESTIMATES PAGE ──
export const EstimatesPage = ({ role }: { role: string }) => {
  const { jobs } = useJobs();
  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Estimates</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Create and manage job estimates</p>
        </div>
      </div>
      <div style={{ padding: "0 28px" }}>
        <Card style={{ textAlign: "center", padding: 48 }}>
          <Ic n="est" s={40} c={T.dim}/>
          <div style={{ fontSize: 16, fontWeight: 600, color: T.white, marginTop: 16 }}>Estimates Module</div>
          <div style={{ fontSize: 13, color: T.muted, marginTop: 6, maxWidth: 440, margin: "6px auto 0", lineHeight: 1.6 }}>
            {jobs.length === 0
              ? "Create a job first, then add estimates to it."
              : `Xactimate integration coming soon — you'll be able to create estimates for your ${jobs.length} job${jobs.length > 1 ? "s" : ""} once connected. You'll need an API key from Xactware.`
            }
          </div>
        </Card>
      </div>
    </div>
  );
};

// ── INVOICES PAGE ──
export const InvoicesPage = ({ role }: { role: string }) => {
  const rm = ROLES[role];
  const { jobs } = useJobs();
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
        <Card style={{ textAlign: "center", padding: 48 }}>
          <Ic n="inv" s={40} c={T.dim}/>
          <div style={{ fontSize: 16, fontWeight: 600, color: T.white, marginTop: 16 }}>No invoices yet</div>
          <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>Invoices will appear here when you create them from completed jobs. QuickBooks integration coming soon.</div>
        </Card>
      </div>
    </div>
  );
};

// ── TEAM PAGE ──
export const TeamPage = ({ role: userRole }: { role: string }) => {
  const { members, loading } = useTeamMembers();
  const statusColors: Record<string, string> = { office: T.blueBright, on_site: T.greenBright, driving: T.yellowBright, off: T.dim };
  const statusLabels: Record<string, string> = { office: "In Office", on_site: "On Site", driving: "En Route", off: "Off Duty" };
  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Team & Users</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Role-based access control — {members.length} user{members.length !== 1 ? "s" : ""}</p>
        </div>
        {ROLES[userRole]?.canManageUsers && <Btn v="primary" sz="sm" icon="plus">Invite User</Btn>}
      </div>
      <div style={{ padding: "0 28px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading team...</div>
        ) : members.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <Ic n="users" s={40} c={T.dim}/>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.white, marginTop: 16 }}>Just you so far</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>Invite team members to start collaborating.</div>
          </Card>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 14 }}>
            {members.map((m: any, i: number) => {
              const roleInfo = ROLES[m.role];
              const avatar = m.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "?";
              return (
                <Card key={i}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${T.orange},${T.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff", flexShrink: 0 }}>{avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: T.white, fontSize: 13 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: T.muted }}>{m.email}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: statusColors[m.status] || T.dim }}/>
                      <span style={{ fontSize: 10, color: statusColors[m.status] || T.dim }}>{statusLabels[m.status] || m.status}</span>
                    </div>
                  </div>
                  <Badge color={m.role === "owner" ? "orange" : m.role === "project_manager" ? "blue" : m.role === "estimator" ? "purple" : m.role === "office_admin" ? "teal" : m.role === "field_tech" ? "green" : "gray"}>{roleInfo?.label || m.role}</Badge>
                  {m.certs?.length > 0 && <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 10 }}>
                    {m.certs.map((c: string) => <Badge key={c} color="blue" small>{c}</Badge>)}
                  </div>}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ── EQUIPMENT PAGE ──
export const EquipmentPage = () => (
  <div style={{ padding: "0 0 40px" }}>
    <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Equipment</h1>
        <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Track drying equipment across all job sites</p>
      </div>
      <Btn v="primary" sz="sm" icon="plus">Add Equipment</Btn>
    </div>
    <div style={{ padding: "0 28px" }}>
      <Card style={{ textAlign: "center", padding: 48 }}>
        <Ic n="tool" s={40} c={T.dim}/>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.white, marginTop: 16 }}>No equipment tracked yet</div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>Add your dehumidifiers, air movers, and moisture meters to track them across job sites.</div>
      </Card>
    </div>
  </div>
);

// ── MY JOBS PAGE (Field Tech) ──
export const MyJobsPage = ({ role, setSelectedJob, setActive }: { role: string; setSelectedJob: (job: DbJob) => void; setActive: (id: string) => void }) => {
  const [clockedIn, setClockedIn] = useState(false);
  const { jobs, loading } = useJobs();
  const { toast } = useToast();

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", marginBottom: 18 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>My Jobs</h1>
        <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Your assigned jobs</p>
      </div>
      <div style={{ padding: "0 28px" }}>
        <Card style={{ marginBottom: 16, background: clockedIn ? T.greenDim : T.surfaceHigh, borderColor: clockedIn ? T.greenBright + "44" : T.border }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Ic n="clock" s={20} c={clockedIn ? T.greenBright : T.muted}/>
              <div>
                <div style={{ fontWeight: 600, color: T.white }}>{clockedIn ? "Clocked In" : "Not Clocked In"}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{clockedIn ? "Tap to end your shift" : "Tap to start your shift"}</div>
              </div>
            </div>
            <Btn v={clockedIn ? "success" : "primary"} onClick={() => { setClockedIn(!clockedIn); toast({ title: clockedIn ? "Clocked Out" : "Clocked In" }); }}>{clockedIn ? "Clock Out" : "Clock In"}</Btn>
          </div>
        </Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading...</div>
        ) : jobs.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <Ic n="myjobs" s={40} c={T.dim}/>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.white, marginTop: 16 }}>No jobs assigned</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>Your assigned jobs will appear here.</div>
          </Card>
        ) : (
          jobs.filter(j => !["paid", "invoiced"].includes(j.stage)).map(j => (
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
                <Btn v="secondary" sz="sm" icon="moisture" onClick={() => toast({ title: "Log Reading", description: "Opening moisture log form..." })}>Log Reading</Btn>
                <Btn v="secondary" sz="sm" icon="photo" onClick={() => toast({ title: "Photos", description: "Camera integration coming soon" })}>Add Photos</Btn>
                <Btn v="secondary" sz="sm" icon="note" onClick={() => toast({ title: "Note added" })}>Add Note</Btn>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// ── CUSTOMERS PAGE ──
export const CustomersPage = () => {
  const { jobs } = useJobs();
  // Derive unique customers from jobs
  const customers = Object.values(
    jobs.reduce((acc, j) => {
      const key = j.customer;
      if (!acc[key]) {
        acc[key] = { name: j.customer, jobs: 0, value: 0, carrier: j.carrier || "—", lastAddress: j.address };
      }
      acc[key].jobs += 1;
      acc[key].value += j.contract_value || 0;
      return acc;
    }, {} as Record<string, { name: string; jobs: number; value: number; carrier: string; lastAddress: string }>)
  );

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div><h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Customers</h1><p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Derived from your jobs</p></div>
      </div>
      <div style={{ padding: "0 28px" }}>
        {customers.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <Ic n="customer" s={40} c={T.dim}/>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.white, marginTop: 16 }}>No customers yet</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>Customers are automatically created when you add new jobs.</div>
          </Card>
        ) : (
          customers.map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, marginBottom: 8 }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = T.borderMid; (e.currentTarget as HTMLDivElement).style.background = T.surfaceHigh; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = T.border; (e.currentTarget as HTMLDivElement).style.background = T.surface; }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${T.orange}88,${T.blue}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{c.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{c.carrier}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: T.white }}>{c.jobs}</div><div style={{ fontSize: 10, color: T.muted }}>Jobs</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 13, fontWeight: 700, color: T.greenBright }}>{c.value ? `$${c.value.toLocaleString()}` : "—"}</div><div style={{ fontSize: 10, color: T.muted }}>Total Value</div></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ── REFERRALS PAGE ──
export const ReferralsPage = () => (
  <div style={{ padding: "0 0 40px" }}>
    <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Referrals & CRM</h1>
        <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Track lead sources and referral partners</p>
      </div>
      <Btn v="primary" sz="sm" icon="plus">Add Partner</Btn>
    </div>
    <div style={{ padding: "0 28px" }}>
      <Card style={{ textAlign: "center", padding: 48 }}>
        <Ic n="handshake" s={40} c={T.dim}/>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.white, marginTop: 16 }}>No referral partners yet</div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>Add your plumbers, insurance agents, and property managers to track referral sources.</div>
      </Card>
    </div>
  </div>
);

// ── REPORTS PAGE (delegates to full page) ──
export { ReportsPage } from "@/components/recon/ReportsPage";

// ── INTEGRATIONS PAGE ──
export const IntegrationsPage = () => (
  <div style={{ padding: "0 0 40px" }}>
    <div style={{ padding: "24px 28px 0", marginBottom: 18 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Integrations</h1>
      <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Connect your restoration tech stack — API keys required</p>
    </div>
    <div style={{ padding: "0 28px" }}>
      <Card style={{ marginBottom: 18, background: T.orangeDim, borderColor: T.orange + "44" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Ic n="alert" s={18} c={T.orange}/>
          <div>
            <div style={{ fontWeight: 600, color: T.white, fontSize: 13, marginBottom: 4 }}>Integrations require API credentials</div>
            <div style={{ fontSize: 12, color: T.muted }}>
              Each integration below requires you to have a paid account with that service and provide your API key. None are currently connected.
            </div>
          </div>
        </div>
      </Card>
      {[
        { cat: "Estimating", items: [
          { name: "Xactimate", desc: "Industry-standard property claims estimating. Requires Xactware API access.", emoji: "📊" },
          { name: "Symbility / CoreLogic", desc: "Cloud-based claims management platform.", emoji: "☁️" },
        ]},
        { cat: "Accounting", items: [
          { name: "QuickBooks Online", desc: "Sync invoices, payments, and expenses. Requires Intuit developer credentials.", emoji: "💼" },
        ]},
        { cat: "Field Documentation", items: [
          { name: "CompanyCam", desc: "Photo documentation by job site. Requires CompanyCam API key.", emoji: "📷" },
          { name: "Encircle", desc: "Field documentation and contents inventory.", emoji: "📐" },
        ]},
        { cat: "Documents & Signatures", items: [
          { name: "DocuSign", desc: "E-signature for AOBs and work authorizations.", emoji: "✍️" },
        ]},
        { cat: "Communication", items: [
          { name: "Twilio", desc: "Automated SMS updates to customers. Requires Twilio account.", emoji: "📱" },
          { name: "Slack", desc: "Internal team notifications and alerts.", emoji: "💬" },
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
                      <Badge color="gray" small>Not Connected</Badge>
                    </div>
                    <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5, marginBottom: 10 }}>{int.desc}</div>
                    <Btn v="secondary" sz="sm">Connect (Requires API Key)</Btn>
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
  const { toast } = useToast();
  if (!rm.canManageUsers) return <div style={{ padding: 40, textAlign: "center", color: T.muted }}><Ic n="lock" s={32} c={T.dim}/><div style={{ marginTop: 12, fontSize: 14 }}>Settings are only accessible to Owner / Admin accounts.</div></div>;
  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Settings</h1>
      </div>
      <div style={{ padding: "0 28px" }}>
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 20, overflowX: "auto" }}>
          {["company", "billing", "job_stages", "notifications"].map(t => (
            <div key={t} onClick={() => setTab(t)} style={{ padding: "10px 16px", cursor: "pointer", fontSize: 12, fontWeight: tab === t ? 600 : 400, color: tab === t ? T.orange : T.muted, borderBottom: `2px solid ${tab === t ? T.orange : "transparent"}`, marginBottom: -1, whiteSpace: "nowrap", textTransform: "capitalize" }}>{t.replace("_", " ")}</div>
          ))}
        </div>
        {tab === "company" && (
          <Card style={{ maxWidth: 800 }}>
            <div style={{ fontWeight: 600, color: T.white, marginBottom: 16 }}>Company Profile</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Inp label="Company Name" placeholder="Your company name" required/>
              <Inp label="State Contractor License #" placeholder="License number"/>
              <Inp label="Phone" placeholder="(555) 000-0000"/>
              <Inp label="Email" placeholder="office@company.com"/>
              <Inp label="Address" placeholder="123 Main Street"/>
              <Inp label="City, State, ZIP" placeholder="Austin, TX 78701"/>
            </div>
            <Divider/>
            <Btn v="primary" onClick={() => toast({ title: "Settings saved" })}>Save Company Info</Btn>
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
                <span style={{ fontSize: 11, color: T.muted }}>Notification</span>
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

// ── SUBCONTRACTORS PAGE (delegates to full page) ──
export { SubcontractorsPageFull as SubcontractorsPage } from "@/components/recon/SubcontractorsPageFull";

// ── NEW JOB MODAL ──
export const NewJobModal = ({ onClose }: { onClose: () => void }) => {
  const { createJob } = useJobs();
  const { members } = useTeamMembers();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    customer: "", phone: "", address: "", cityStateZip: "",
    loss_type: "Water Damage", loss_subtype: "", date_of_loss: "",
    payment_type: "insurance" as "insurance" | "self_pay",
    carrier: "", claim_no: "", adjuster: "", adjuster_phone: "", adjuster_email: "",
    mortgage_company: "",
    pm_name: "", priority: "Normal", notes: "",
  });

  const set = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }));
  const isInsurance = formData.payment_type === "insurance";

  const handleCreate = async () => {
    if (!formData.customer.trim()) return;
    setSaving(true);
    const lossTypeMap: Record<string, string> = {
      "Water Damage": "water", "Fire / Smoke": "fire", "Mold Remediation": "mold",
      "Storm / Wind": "storm", "Biohazard": "biohazard", "Contents Only": "contents",
    };
    await createJob({
      customer: formData.customer,
      address: `${formData.address}${formData.cityStateZip ? ", " + formData.cityStateZip : ""}`,
      phone: formData.phone,
      loss_type: lossTypeMap[formData.loss_type] || "water",
      loss_subtype: formData.loss_subtype,
      payment_type: formData.payment_type,
      carrier: isInsurance ? formData.carrier : "",
      claim_no: isInsurance ? formData.claim_no : "",
      adjuster: isInsurance ? formData.adjuster : "",
      adjuster_phone: isInsurance ? formData.adjuster_phone : "",
      adjuster_email: isInsurance ? formData.adjuster_email : "",
      date_of_loss: formData.date_of_loss || undefined,
      pm_name: formData.pm_name,
      priority: formData.priority.includes("High") || formData.priority.includes("Emergency") ? "high" : "normal",
      notes: formData.notes,
      mortgage_company: isInsurance ? formData.mortgage_company : "",
    });
    setSaving(false);
    onClose();
  };

  const pms = members.filter((m: any) => m.role === "owner" || m.role === "project_manager");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
      <Card style={{ width: 580, maxHeight: "90vh", overflowY: "auto", background: T.surface }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.white }}>Create New Job</h2>
            <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 12 }}>All fields marked * are required</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted }}><Ic n="x" s={18}/></button>
        </div>

        <Divider label="Job Type"/>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {(["insurance", "self_pay"] as const).map(pt => (
            <div key={pt} onClick={() => set("payment_type", pt)} style={{
              flex: 1, padding: "14px 16px", borderRadius: 10, cursor: "pointer", textAlign: "center",
              background: formData.payment_type === pt ? (pt === "insurance" ? T.orangeDim : T.greenDim) : T.surfaceHigh,
              border: `2px solid ${formData.payment_type === pt ? (pt === "insurance" ? T.orange : T.greenBright) : T.border}`,
              transition: "all 0.15s",
            }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{pt === "insurance" ? "🛡️" : "💵"}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: formData.payment_type === pt ? T.white : T.muted }}>
                {pt === "insurance" ? "Insurance" : "Self Pay"}
              </div>
              <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>
                {pt === "insurance" ? "Carrier claim & adjuster workflow" : "Direct payment from homeowner"}
              </div>
            </div>
          ))}
        </div>

        <Divider label="Loss Information"/>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13, marginBottom: 14 }}>
          <Sel label="Loss Type *" options={LOSS_TYPES.map(l => l.label)} value={formData.loss_type} onChange={e => set("loss_type", e.target.value)}/>
          <Inp label="Loss Category" placeholder="e.g. Cat 2 – Grey" value={formData.loss_subtype} onChange={e => set("loss_subtype", e.target.value)}/>
          <Inp label="Date of Loss" type="date" value={formData.date_of_loss} onChange={e => set("date_of_loss", e.target.value)}/>
        </div>

        <Divider label="Property & Customer"/>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13, marginBottom: 14 }}>
          <Inp label="Customer Name *" placeholder="Full name or company" required value={formData.customer} onChange={e => set("customer", e.target.value)}/>
          <Inp label="Phone" placeholder="(555) 000-0000" value={formData.phone} onChange={e => set("phone", e.target.value)}/>
          <Inp label="Property Address" placeholder="123 Main St" style={{ gridColumn: "1/-1" }} value={formData.address} onChange={e => set("address", e.target.value)}/>
          <Inp label="City, State, ZIP" placeholder="Austin, TX 78701" value={formData.cityStateZip} onChange={e => set("cityStateZip", e.target.value)}/>
        </div>

        {isInsurance && (
          <>
            <Divider label="Insurance Information"/>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13, marginBottom: 14 }}>
              <Sel label="Insurance Carrier" options={["State Farm", "Allstate", "Travelers", "Farmers", "USAA", "Liberty Mutual", "Zurich", "Other"]} value={formData.carrier} onChange={e => set("carrier", e.target.value)}/>
              <Inp label="Claim Number" placeholder="Carrier claim #" value={formData.claim_no} onChange={e => set("claim_no", e.target.value)}/>
              <Inp label="Adjuster Name" placeholder="Insurance adjuster" value={formData.adjuster} onChange={e => set("adjuster", e.target.value)}/>
              <Inp label="Adjuster Phone" placeholder="(555) 000-0000" value={formData.adjuster_phone} onChange={e => set("adjuster_phone", e.target.value)}/>
              <Inp label="Adjuster Email" placeholder="adjuster@carrier.com" value={formData.adjuster_email} onChange={e => set("adjuster_email", e.target.value)}/>
              <Inp label="Mortgage Company" placeholder="Optional" value={formData.mortgage_company} onChange={e => set("mortgage_company", e.target.value)}/>
            </div>
          </>
        )}

        <Divider label="Assignment"/>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13, marginBottom: 14 }}>
          <Sel label="Assign Project Manager" options={["Unassigned", ...pms.map((m: any) => m.name)]} value={formData.pm_name} onChange={e => set("pm_name", e.target.value)}/>
          <Sel label="Priority" options={["Normal", "High – Urgent", "Emergency (Cat 3/Sewage)"]} value={formData.priority} onChange={e => set("priority", e.target.value)}/>
        </div>

        <Divider label="Notes"/>
        <textarea placeholder="Loss description, access notes, gate codes..." rows={3} value={formData.notes} onChange={e => set("notes", e.target.value)}
          style={{ width: "100%", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: 16 }}
          onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = T.orange}
          onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = T.border}
        />

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn v="secondary" onClick={onClose}>Cancel</Btn>
          <Btn v="primary" icon="truck" onClick={handleCreate} disabled={saving || !formData.customer.trim()}>
            {saving ? "Creating..." : "Create & Dispatch"}
          </Btn>
        </div>
      </Card>
    </div>
  );
};