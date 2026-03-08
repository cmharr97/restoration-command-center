import { useState, useEffect } from "react";
import { T, NAV, TEAM_MEMBERS, type Job } from "@/lib/recon-data";
import { ReconSidebar, TopBar } from "@/components/recon/ReconLayout";
import { DashboardPage } from "@/components/recon/DashboardPage";
import { JobsPage } from "@/components/recon/JobsPage";
import { JobDetailPage } from "@/components/recon/JobDetailPage";
import { MitigationPage } from "@/components/recon/MitigationPage";
import { MessagingPage } from "@/components/recon/MessagingPage";
import { CalendarPage } from "@/components/recon/CalendarPage";
import { AutomationPage } from "@/components/recon/AutomationPage";
import { CustomerPortalPage } from "@/components/recon/CustomerPortalPage";
import { EstimatesPage, InvoicesPage, TeamPage, EquipmentPage, MyJobsPage, CustomersPage, ReferralsPage, ReportsPage, IntegrationsPage, SettingsPage, NewJobModal, SubcontractorsPage } from "@/components/recon/OtherPages";
import { AIAssistant } from "@/components/recon/AIAssistant";
import { Ic } from "@/components/recon/ReconUI";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { profile, signOut } = useAuth();
  const [role, setRole] = useState(profile?.role || "owner");
  const [active, setActive] = useState("dashboard");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showNewJob, setShowNewJob] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (profile?.role) setRole(profile.role);
  }, [profile]);

  useEffect(() => {
    const roleNav = NAV[role] || NAV.owner;
    const allPages = roleNav.flatMap(g => g.items.map(i => i.id));
    if (!allPages.includes(active)) { setActive(allPages[0] || "dashboard"); }
  }, [role]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [active]);

  // Simulated push notifications
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const notificationMessages = [
      { title: "💧 Drying Alert — J-1051", desc: "Laundry subfloor still above dry standard. Day 5 reading: 20%", delay: 15000 },
      { title: "📱 SMS Confirmed", desc: "Marcus Webb confirmed dispatch for Cat 3 mobilization", delay: 30000 },
      { title: "💬 New Message — Destiny Kim", desc: "Adjuster walkthrough at 2pm confirmed ✅", delay: 45000 },
      { title: "⚠️ Task Overdue", desc: "J-1049 mold estimate review — no activity in 3 days", delay: 60000 },
      { title: "📄 Supplement Approved", desc: "State Farm approved $2,400 supplement for J-1051 hardwood replacement", delay: 90000 },
      { title: "⚡ Automation Triggered", desc: "No activity on J-1049 for 3 days — manager alerted", delay: 120000 },
    ];

    const timers = notificationMessages.map(msg =>
      setTimeout(() => {
        toast({ title: msg.title, description: msg.desc });
        if ("Notification" in window && Notification.permission === "granted") {
          try { new Notification(msg.title, { body: msg.desc, icon: "/favicon.ico" }); } catch {}
        }
      }, msg.delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const currentUser = TEAM_MEMBERS.find(m => m.role === role) || TEAM_MEMBERS[0];
  const pageTitles: Record<string, string> = {
    dashboard: "Dashboard", jobs: "Jobs", customers: "Customers", mitigation: "Drying Logs",
    estimates: "Estimates", invoices: "Invoices", calendar: "Schedule", team: "Team & Users",
    equipment: "Equipment", subcontractors: "Subcontractors", referrals: "Referrals / CRM",
    reports: "Reports", integrations: "Integrations", settings: "Settings", my_jobs: "My Jobs",
    job_detail: `Job ${selectedJob?.id || ""}`, messaging: "Messages",
    automations: "Automations", customer_portal: "Customer Portal",
  };

  const pages: Record<string, React.ReactNode> = {
    dashboard: <DashboardPage role={role} setActive={setActive} setSelectedJob={setSelectedJob}/>,
    jobs: <JobsPage role={role} setSelectedJob={setSelectedJob} setActive={setActive}/>,
    job_detail: selectedJob ? <JobDetailPage job={selectedJob} role={role} setActive={setActive}/> : <div style={{ padding: 40, color: T.muted }}>Select a job first</div>,
    customers: <CustomersPage/>,
    mitigation: <MitigationPage role={role} setSelectedJob={setSelectedJob} setActive={setActive}/>,
    estimates: <EstimatesPage role={role}/>,
    invoices: <InvoicesPage role={role}/>,
    calendar: <CalendarPage role={role}/>,
    team: <TeamPage role={role}/>,
    equipment: <EquipmentPage/>,
    subcontractors: <SubcontractorsPage/>,
    referrals: <ReferralsPage/>,
    reports: <ReportsPage role={role}/>,
    integrations: <IntegrationsPage/>,
    settings: <SettingsPage role={role}/>,
    my_jobs: <MyJobsPage role={role} setSelectedJob={setSelectedJob} setActive={setActive}/>,
    messaging: <MessagingPage role={role}/>,
    automations: <AutomationPage role={role}/>,
    customer_portal: <CustomerPortalPage/>,
  };

  // Add mobile-open class to sidebar via useEffect
  useEffect(() => {
    const sidebar = document.querySelector('.recon-sidebar');
    if (sidebar) {
      if (mobileMenuOpen) sidebar.classList.add('mobile-open');
      else sidebar.classList.remove('mobile-open');
    }
  }, [mobileMenuOpen]);

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: T.bg, color: T.text, minHeight: "100vh", display: "flex", overflow: "hidden" }}>
      {active !== "customer_portal" && (
        <ReconSidebar
          role={role} active={active} setActive={setActive} user={currentUser}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
      )}
      <div style={{ flex: 1, overflowY: active === "messaging" ? "hidden" : "auto", height: "100vh", minWidth: 0 }}>
        {active !== "customer_portal" && (
          <TopBar
            pageTitle={pageTitles[active] || active}
            role={role}
            onNewJob={() => setShowNewJob(true)}
            onRoleChange={r => setRole(r)}
            onSignOut={signOut}
            onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        )}
        {pages[active] || <div style={{ padding: 40, color: T.muted }}>Page not available</div>}
      </div>
      {showNewJob && <NewJobModal onClose={() => setShowNewJob(false)}/>}

      {/* AI Assistant FAB */}
      {!showAI && (
        <button onClick={() => setShowAI(true)} style={{
          position: "fixed", right: 20, bottom: 20, width: 56, height: 56,
          borderRadius: "50%", background: `linear-gradient(135deg, ${T.orange}, #c84009)`,
          border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 8px 30px ${T.orangeGlow}`, zIndex: 999, fontSize: 24, transition: "transform 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"}
        >
          🤖
        </button>
      )}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}
    </div>
  );
};

export default Index;
