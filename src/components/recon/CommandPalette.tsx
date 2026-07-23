import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { T, NAV } from "@/lib/recon-data";
import { Ic } from "@/components/recon/ReconUI";
import { useJobs, type DbJob } from "@/hooks/useJobs";

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  group: string;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  role: string;
  setActive: (id: string) => void;
  setSelectedJob: (job: DbJob) => void;
  onNewJob: () => void;
  canCreateJob: boolean;
}

/**
 * Global command palette (Ctrl/Cmd+K).
 * Provides fuzzy navigation, live job lookup and role-aware quick actions.
 * Fully keyboard-driven with accessible dialog + listbox semantics.
 */
export const CommandPalette = ({
  open,
  setOpen,
  role,
  setActive,
  setSelectedJob,
  onNewJob,
  canCreateJob,
}: CommandPaletteProps) => {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const { jobs } = useJobs();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (fn: () => void) => {
      fn();
      setOpen(false);
      setQuery("");
    },
    [setOpen],
  );

  const commands = useMemo<Command[]>(() => {
    const list: Command[] = [];
    if (canCreateJob) {
      list.push({
        id: "new-job",
        title: "New Job",
        subtitle: "Create a restoration job",
        icon: "plus",
        group: "Actions",
        run: onNewJob,
      });
    }
    const nav = NAV[role] || NAV.owner;
    nav.forEach((grp) =>
      grp.items.forEach((item) => {
        list.push({
          id: `nav-${item.id}`,
          title: item.label,
          subtitle: `Go to ${grp.group}`,
          icon: item.icon,
          group: "Navigate",
          run: () => setActive(item.id),
        });
      }),
    );
    jobs.forEach((j) => {
      list.push({
        id: `job-${j.id}`,
        title: `${j.id} — ${j.customer}`,
        subtitle: j.address,
        icon: "jobs",
        group: "Jobs",
        run: () => {
          setSelectedJob(j);
          setActive("job_detail");
        },
      });
    });
    return list;
  }, [role, jobs, canCreateJob, onNewJob, setActive, setSelectedJob]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands.filter((c) => c.group !== "Jobs").slice(0, 20);
    return commands
      .filter(
        (c) =>
          c.title.toLowerCase().includes(q) || (c.subtitle || "").toLowerCase().includes(q),
      )
      .slice(0, 25);
  }, [commands, query]);

  useEffect(() => {
    setCursor(0);
  }, [query, open]);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 20);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[cursor];
      if (cmd) go(cmd.run);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${cursor}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  if (!open) return null;

  let lastGroup = "";

  return (
    <div
      role="presentation"
      onClick={() => setOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
        background: "rgba(10,12,18,0.45)",
        backdropFilter: "blur(3px)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="recon-bubble"
        style={{
          width: "min(560px, 92vw)",
          maxHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          overflow: "hidden",
          boxShadow: T.bubbleShadowLg,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 16px",
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <Ic n="search" s={16} c={T.muted} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search jobs, pages, actions…"
            aria-label="Command palette search"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: T.text,
              fontSize: 15,
              fontFamily: "inherit",
            }}
          />
          <kbd
            style={{
              fontSize: 10,
              color: T.dim,
              background: T.surfaceHigh,
              border: `1px solid ${T.border}`,
              borderRadius: 5,
              padding: "2px 6px",
            }}
          >
            Esc
          </kbd>
        </div>

        <div ref={listRef} role="listbox" aria-label="Results" style={{ overflowY: "auto", padding: 6 }}>
          {filtered.length === 0 && (
            <div style={{ padding: "24px 16px", textAlign: "center", color: T.dim, fontSize: 13 }}>
              No results for “{query}”
            </div>
          )}
          {filtered.map((c, i) => {
            const showGroup = c.group !== lastGroup;
            lastGroup = c.group;
            const activeRow = i === cursor;
            return (
              <div key={c.id}>
                {showGroup && (
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: T.dim,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      padding: "10px 10px 4px",
                    }}
                  >
                    {c.group}
                  </div>
                )}
                <div
                  role="option"
                  aria-selected={activeRow}
                  data-idx={i}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => go(c.run)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "9px 10px",
                    borderRadius: 10,
                    cursor: "pointer",
                    background: activeRow ? T.orangeDim : "transparent",
                  }}
                >
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 9,
                      background: T.surfaceHigh,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Ic n={c.icon} s={15} c={activeRow ? T.orange : T.muted} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: activeRow ? T.orange : T.text,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.title}
                    </span>
                    {c.subtitle && (
                      <span
                        style={{
                          display: "block",
                          fontSize: 11.5,
                          color: T.dim,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.subtitle}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
