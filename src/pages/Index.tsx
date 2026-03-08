import { useState, useEffect } from "react";
import { T, NAV, TEAM_MEMBERS, type Job } from "@/lib/recon-data";
import { ReconSidebar, TopBar } from "@/components/recon/ReconLayout";
import { DashboardPage } from "@/components/recon/DashboardPage";
import { JobsPage } from "@/components/recon/JobsPage";
import { JobDetailPage } from "@/components/recon/JobDetailPage";
import { MitigationPage } from "@/components/recon/MitigationPage";
import { MessagingPage } from "@/components/recon/MessagingPage";
import { EstimatesPage, InvoicesPage, TeamPage, EquipmentPage, MyJobsPage, CustomersPage, ReferralsPage, ReportsPage, IntegrationsPage, SettingsPage, NewJobModal } from "@/components/recon/OtherPages";
import { Ic } from "@/components/recon/ReconUI";

const Index = () => {
  const [role, setRole] = useState("owner");
  const [active, setActive] = useState("dashboard");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showNewJob, setShowNewJob] = useState(false);

  useEffect(() => {
    const roleNav = NAV[role] || NAV.owner;
    const allPages = roleNav.flatMap(g => g.items.map(i => i.id));
    if (!allPages.includes(active)) { setActive(allPages[0] || "dashboard"); }
  }, [role]);

  const currentUser = TEAM_MEMBERS.find(m => m.role === role) || TEAM_MEMBERS[0];
  const pageTitles: Record<string, string> = { dashboard: "Dashboard", jobs: "Jobs", customers: "Customers", mitigation: "Drying Logs", estimates: "Estimates", invoices: "Invoices", calendar: "Schedule", team: "Team & Users", equipment: "Equipment", subcontractors: "Subcontractors", referrals: "Referrals / CRM", reports: "Reports", integrations: "Integrations", settings: "Settings", my_jobs: "My Jobs", job_detail: `Job ${selectedJob?.id || ""}`, messaging: "Messages" };

  const pages: Record<string, React.ReactNode> = {
    dashboard: <DashboardPage role={role} setActive={setActive} setSelectedJob={setSelectedJob}/>,
    jobs: <JobsPage role={role} setSelectedJob={setSelectedJob} setActive={setActive}/>,
    job_detail: selectedJob ? <JobDetailPage job={selectedJob} role={role} setActive={setActive}/> : <div style={{ padding: 40, color: T.muted }}>Select a job first</div>,
    customers: <CustomersPage/>,
    mitigation: <MitigationPage role={role} setSelectedJob={setSelectedJob} setActive={setActive}/>,
    estimates: <EstimatesPage role={role}/>,
    invoices: <InvoicesPage role={role}/>,
    calendar: <div style={{ padding: 32, color: T.muted, textAlign: "center" }}><Ic n="cal" s={28} c={T.dim}/><div style={{ marginTop: 12 }}>Interactive calendar — drag & drop scheduling by crew, with SMS auto-dispatch</div></div>,
    team: <TeamPage role={role}/>,
    equipment: <EquipmentPage/>,
    subcontractors: <div style={{ padding: 32, color: T.muted, textAlign: "center" }}><Ic n="truck" s={28} c={T.dim}/><div style={{ marginTop: 12 }}>Subcontractor management — controlled job access, W9 storage, COI tracking</div></div>,
    referrals: <ReferralsPage/>,
    reports: <ReportsPage role={role}/>,
    integrations: <IntegrationsPage/>,
    settings: <SettingsPage role={role}/>,
    my_jobs: <MyJobsPage role={role} setSelectedJob={setSelectedJob} setActive={setActive}/>,
    messaging: <MessagingPage role={role}/>,
  };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: T.bg, color: T.text, minHeight: "100vh", display: "flex", overflow: "hidden" }}>
      <ReconSidebar role={role} active={active} setActive={setActive} user={currentUser}/>
      <div style={{ flex: 1, overflowY: active === "messaging" ? "hidden" : "auto", height: "100vh" }}>
        <TopBar pageTitle={pageTitles[active] || active} role={role} onNewJob={() => setShowNewJob(true)} onRoleChange={r => setRole(r)}/>
        {pages[active] || <div style={{ padding: 40, color: T.muted }}>Page not available</div>}
      </div>
      {showNewJob && <NewJobModal onClose={() => setShowNewJob(false)}/>}
    </div>
  );
};

export default Index;
