import { useState, useEffect, useRef } from "react";
import { T } from "@/lib/recon-data";
import { Ic } from "@/components/recon/ReconUI";
import { useJobs, type DbJob } from "@/hooks/useJobs";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  type: "job" | "customer" | "subcontractor";
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  page: string;
  data?: any;
}

interface GlobalSearchProps {
  setActive: (id: string) => void;
  setSelectedJob: (job: DbJob) => void;
}

export const GlobalSearch = ({ setActive, setSelectedJob }: GlobalSearchProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const { jobs } = useJobs();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const matches: SearchResult[] = [];

    // Search jobs
    jobs.forEach(j => {
      if (
        j.id.toLowerCase().includes(q) ||
        j.customer.toLowerCase().includes(q) ||
        j.address.toLowerCase().includes(q) ||
        (j.claim_no || "").toLowerCase().includes(q) ||
        (j.carrier || "").toLowerCase().includes(q)
      ) {
        matches.push({
          type: "job", id: j.id, title: `${j.id} — ${j.customer}`,
          subtitle: j.address, icon: "jobs", page: "job_detail", data: j,
        });
      }
    });

    // Search subcontractors + customers from supabase async
    const searchAsync = async () => {
      const [{ data: subs }, { data: custs }] = await Promise.all([
        supabase.from("subcontractors").select("*").or(`name.ilike.%${q}%,company_name.ilike.%${q}%,trade.ilike.%${q}%`).limit(5),
        supabase.from("customers").select("*").or(`name.ilike.%${q}%,email.ilike.%${q}%,address.ilike.%${q}%`).limit(5),
      ]);
      const extra: SearchResult[] = [];
      (subs || []).forEach((s: any) => extra.push({
        type: "subcontractor", id: s.id, title: s.name,
        subtitle: `${s.trade} · ${s.company_name || ""}`, icon: "truck", page: "subcontractors",
      }));
      (custs || []).forEach((c: any) => extra.push({
        type: "customer", id: c.id, title: c.name,
        subtitle: c.email || c.address || "", icon: "customer", page: "customers",
      }));
      setResults([...matches, ...extra].slice(0, 10));
    };
    searchAsync();
  }, [query, jobs]);

  const handleSelect = (r: SearchResult) => {
    if (r.page === "job_detail" && r.data) {
      setSelectedJob(r.data);
    }
    setActive(r.page);
    setOpen(false);
    setQuery("");
  };

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(true)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: T.surfaceHigh, border: `1px solid ${T.border}`,
          borderRadius: 8, padding: "6px 12px", cursor: "text",
          minWidth: 220, maxWidth: 320,
        }}
      >
        <Ic n="search" s={14} c={T.dim} />
        {open ? (
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search jobs, customers, claims..."
            style={{
              background: "transparent", border: "none", outline: "none",
              color: T.text, fontSize: 13, fontFamily: "inherit", flex: 1, minWidth: 0,
            }}
          />
        ) : (
          <span style={{ fontSize: 12, color: T.dim, flex: 1 }}>Search...</span>
        )}
        <kbd style={{
          fontSize: 10, color: T.dim, background: T.surface,
          border: `1px solid ${T.border}`, borderRadius: 4,
          padding: "1px 5px", fontFamily: "inherit",
        }}>⌘K</kbd>
      </div>

      {open && results.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 10, overflow: "hidden", zIndex: 100,
          boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
          minWidth: 320,
        }}>
          {results.map((r, i) => (
            <div
              key={`${r.type}-${r.id}-${i}`}
              onClick={() => handleSelect(r)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", cursor: "pointer",
                borderBottom: i < results.length - 1 ? `1px solid ${T.border}` : "none",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = T.surfaceHigh)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: T.surfaceHigh, display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Ic n={r.icon} s={14} c={r.type === "job" ? T.orange : r.type === "customer" ? T.blueBright : T.tealBright} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div>
                <div style={{ fontSize: 11, color: T.dim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.subtitle}</div>
              </div>
              <span style={{
                fontSize: 9, color: T.dim, textTransform: "uppercase",
                letterSpacing: "0.06em", fontWeight: 600,
              }}>{r.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
