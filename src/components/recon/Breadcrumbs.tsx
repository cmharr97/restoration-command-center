import { T } from "@/lib/recon-data";
import { Ic } from "@/components/recon/ReconUI";
import type { DbJob } from "@/hooks/useJobs";

interface BreadcrumbsProps {
  active: string;
  selectedJob: DbJob | null;
  pageTitles: Record<string, string>;
  setActive: (id: string) => void;
}

const sectionMap: Record<string, string> = {
  jobs: "Operations", referrals: "Operations", customers: "Operations",
  calendar: "Project Management", subcontractors: "Project Management", mitigation: "Project Management",
  payments: "Financials", supplements: "Financials", claims: "Financials",
  messaging: "Communication", customer_portal: "Communication",
  reports: "Analytics", dashboard: "Analytics",
  settings: "System", team: "System", equipment: "System",
  job_detail: "Operations",
  my_jobs: "My Work",
};

export const Breadcrumbs = ({ active, selectedJob, pageTitles, setActive }: BreadcrumbsProps) => {
  const section = sectionMap[active] || "";
  const crumbs: { label: string; onClick?: () => void }[] = [];

  if (section) crumbs.push({ label: section });

  if (active === "job_detail") {
    crumbs.push({ label: "Jobs", onClick: () => setActive("jobs") });
    crumbs.push({ label: selectedJob ? `${selectedJob.id} — ${selectedJob.customer}` : "Job Detail" });
  } else {
    crumbs.push({ label: pageTitles[active] || active });
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {crumbs.map((c, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <Ic n="chevR" s={11} c={T.dim} />}
          {c.onClick ? (
            <span
              onClick={c.onClick}
              style={{ fontSize: 12, color: T.muted, cursor: "pointer", fontWeight: 400 }}
              onMouseEnter={e => (e.currentTarget.style.color = T.text)}
              onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
            >{c.label}</span>
          ) : (
            <span style={{
              fontSize: 12,
              color: i === crumbs.length - 1 ? T.text : T.dim,
              fontWeight: i === crumbs.length - 1 ? 600 : 400,
            }}>{c.label}</span>
          )}
        </div>
      ))}
    </div>
  );
};
