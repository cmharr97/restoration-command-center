import { useState, useRef, useCallback } from "react";
import { T, ROLES, JOB_STAGES, stageInfo, stageColor } from "@/lib/recon-data";
import { useJobs, useTeamMembers, type DbJob } from "@/hooks/useJobs";
import { Badge, ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";
import { UserAvatar } from "@/components/recon/MessagingPage";
import { toast } from "@/hooks/use-toast";

// ── TYPES ──
interface ScheduleEvent {
  id: string;
  title: string;
  jobId: string;
  assignees: string[];
  date: string; // YYYY-MM-DD
  timeStart: string;
  timeEnd: string;
  type: "mitigation" | "assessment" | "recon" | "inspection" | "pickup" | "delivery" | "walkthrough" | "demo" | "drycheck";
  color: string;
  status: "scheduled" | "in_progress" | "completed" | "blocked";
  dependencies?: string[];
  notes?: string;
  smsDispatched?: boolean;
}

// ── MOCK SCHEDULE DATA ──
const INITIAL_EVENTS: ScheduleEvent[] = [
  { id: "ev-1", title: "Day 5 Drying Check", jobId: "J-1051", assignees: ["u5"], date: "2026-03-08", timeStart: "08:00", timeEnd: "09:30", type: "drycheck", color: T.blueBright, status: "scheduled", notes: "Check subfloor readings in laundry", smsDispatched: true },
  { id: "ev-2", title: "Cat 3 Mobilization", jobId: "J-1046", assignees: ["u7", "u8"], date: "2026-03-08", timeStart: "07:30", timeEnd: "12:00", type: "mitigation", color: T.orange, status: "in_progress", notes: "Highland Park HOA – sewer backup. PPE required.", smsDispatched: true },
  { id: "ev-3", title: "Storm Assessment", jobId: "J-1047", assignees: ["u3"], date: "2026-03-08", timeStart: "10:00", timeEnd: "11:30", type: "assessment", color: T.yellowBright, status: "scheduled", notes: "Hail damage to roof", smsDispatched: true },
  { id: "ev-4", title: "Adjuster Walkthrough", jobId: "J-1050", assignees: ["u2"], date: "2026-03-08", timeStart: "14:00", timeEnd: "15:30", type: "walkthrough", color: T.purpleBright, status: "scheduled", notes: "Sunrise Office Park – reconstruction phase" },
  { id: "ev-5", title: "Equipment Pickup", jobId: "J-1048", assignees: ["u6"], date: "2026-03-08", timeStart: "15:30", timeEnd: "16:30", type: "pickup", color: T.greenBright, status: "scheduled", notes: "Valley View – remove 4 air movers, 1 dehu" },
  { id: "ev-6", title: "Laundry Subfloor Demo", jobId: "J-1051", assignees: ["u5", "u6"], date: "2026-03-09", timeStart: "08:00", timeEnd: "12:00", type: "demo", color: T.redBright, status: "scheduled", dependencies: ["ev-1"], notes: "Pre-demo photos required. Document for supplement." },
  { id: "ev-7", title: "Mold Containment Setup", jobId: "J-1049", assignees: ["u7"], date: "2026-03-09", timeStart: "09:00", timeEnd: "13:00", type: "mitigation", color: T.tealBright, status: "blocked", dependencies: ["ev-3"], notes: "Waiting on estimate approval from Farmers" },
  { id: "ev-8", title: "Day 6 Drying Check", jobId: "J-1051", assignees: ["u5"], date: "2026-03-09", timeStart: "14:00", timeEnd: "15:00", type: "drycheck", color: T.blueBright, status: "scheduled", dependencies: ["ev-6"], notes: "Post-demo readings" },
  { id: "ev-9", title: "Cabinet Template", jobId: "J-1050", assignees: ["u2"], date: "2026-03-10", timeStart: "09:00", timeEnd: "11:00", type: "recon", color: T.tealBright, status: "scheduled", dependencies: ["ev-4"], notes: "Requires adjuster approval first" },
  { id: "ev-10", title: "Highland Park Day 2", jobId: "J-1046", assignees: ["u7", "u8"], date: "2026-03-09", timeStart: "07:30", timeEnd: "12:00", type: "mitigation", color: T.orange, status: "scheduled", dependencies: ["ev-2"] },
  { id: "ev-11", title: "Countertop Template", jobId: "J-1050", assignees: ["u2"], date: "2026-03-12", timeStart: "09:00", timeEnd: "11:00", type: "recon", color: T.tealBright, status: "scheduled", dependencies: ["ev-9"], notes: "Cannot happen until cabinets are set" },
  { id: "ev-12", title: "Final Paint", jobId: "J-1050", assignees: ["u6"], date: "2026-03-16", timeStart: "08:00", timeEnd: "17:00", type: "recon", color: T.purpleBright, status: "scheduled", dependencies: ["ev-11"], notes: "After countertops installed and punch list done" },
];

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7AM–6PM
const TYPE_LABELS: Record<string, string> = {
  mitigation: "Mitigation", assessment: "Assessment", recon: "Reconstruction", inspection: "Inspection",
  pickup: "Equipment Pickup", delivery: "Delivery", walkthrough: "Walkthrough", demo: "Demo/Tear Out", drycheck: "Drying Check",
};

const getDayName = (d: Date) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
const getMonthDay = (d: Date) => `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]} ${d.getDate()}`;
const dateStr = (d: Date) => d.toISOString().split("T")[0];
const getWeekDates = (base: Date) => {
  const start = new Date(base);
  start.setDate(start.getDate() - start.getDay() + 1); // Monday
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
};

// ── MAIN COMPONENT ──
// Define local TeamMember type  
interface CalendarTeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  avatar?: string;
  status?: string;
  profilePic?: string;
}

export const CalendarPage = ({ role }: { role: string }) => {
  const [events, setEvents] = useState<ScheduleEvent[]>(INITIAL_EVENTS);
  const [view, setView] = useState<"week" | "day" | "crew">("week");
  const [baseDate, setBaseDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [dragEvent, setDragEvent] = useState<string | null>(null);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [filterCrew, setFilterCrew] = useState<string | null>(null);
  const { jobs } = useJobs();
  const { members } = useTeamMembers();

  const weekDates = getWeekDates(baseDate);
  const isToday = (d: Date) => dateStr(d) === dateStr(new Date());
  const rm = ROLES[role];

  const crewMembers = members.filter((m: any) => ["field_tech", "project_manager", "estimator"].includes(m.role));

  const navigateWeek = (dir: number) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + dir * 7);
    setBaseDate(d);
  };

  const navigateDay = (dir: number) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + dir);
    setBaseDate(d);
  };

  const getEventsForDateAndCrew = (date: string, crewId?: string) => {
    return events.filter(e => {
      if (e.date !== date) return false;
      if (crewId && !e.assignees.includes(crewId)) return false;
      if (filterCrew && !e.assignees.includes(filterCrew)) return false;
      return true;
    });
  };

  const handleDrop = (eventId: string, newDate: string, newCrewId?: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      const updated = { ...e, date: newDate };
      if (newCrewId && !e.assignees.includes(newCrewId)) {
        updated.assignees = [...e.assignees, newCrewId];
      }
      return updated;
    }));
    setDragEvent(null);
    toast({ title: "Event rescheduled", description: `Moved to ${newDate}` });
  };

  const handleSMSDispatch = (eventId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, smsDispatched: true } : e));
    const ev = events.find(e => e.id === eventId);
    if (ev) {
      const assigneeNames = ev.assignees.map(id => members.find((m: any) => m.id === id)?.name || "Unknown").join(", ");
      toast({
        title: "📱 SMS Dispatched",
        description: `Notification sent to ${assigneeNames} for "${ev.title}" on ${ev.date}`,
      });
    }
  };

  const handleDispatchAll = () => {
    const undispatched = events.filter(e => !e.smsDispatched && e.status !== "completed");
    setEvents(prev => prev.map(e => ({ ...e, smsDispatched: true })));
    toast({
      title: "📱 Batch SMS Dispatched",
      description: `Sent ${undispatched.length} dispatch notifications to crew members`,
    });
  };

  const getDependencyChain = (eventId: string): string[] => {
    const chain: string[] = [];
    const ev = events.find(e => e.id === eventId);
    if (!ev?.dependencies) return chain;
    for (const depId of ev.dependencies) {
      chain.push(depId);
      chain.push(...getDependencyChain(depId));
    }
    return chain;
  };

  const getBlockedBy = (ev: ScheduleEvent): ScheduleEvent[] => {
    if (!ev.dependencies) return [];
    return ev.dependencies.map(id => events.find(e => e.id === id)).filter(Boolean).filter(e => e!.status !== "completed") as ScheduleEvent[];
  };

  // ── EVENT CARD ──
  const EventCard = ({ ev, compact = false }: { ev: ScheduleEvent; compact?: boolean }) => {
    const blocked = getBlockedBy(ev);
    const job = jobs.find((j: any) => j.id === ev.jobId);
    const assigneeMembers = ev.assignees.map(id => members.find((m: any) => m.id === id)).filter(Boolean) as CalendarTeamMember[];

    return (
      <div
        draggable
        onDragStart={() => setDragEvent(ev.id)}
        onDragEnd={() => setDragEvent(null)}
        onClick={() => setSelectedEvent(ev)}
        style={{
          background: ev.status === "blocked" ? T.redDim : `${ev.color}18`,
          border: `1px solid ${ev.status === "blocked" ? T.redBright + "55" : ev.color + "44"}`,
          borderLeft: `3px solid ${ev.status === "blocked" ? T.redBright : ev.color}`,
          borderRadius: 7,
          padding: compact ? "4px 8px" : "8px 10px",
          cursor: "grab",
          marginBottom: 4,
          transition: "all 0.15s",
          opacity: dragEvent === ev.id ? 0.5 : 1,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.01)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: compact ? 10 : 12, fontWeight: 600, color: T.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</div>
            {!compact && <div style={{ fontSize: 10, color: T.muted, marginTop: 1 }}>{ev.timeStart}–{ev.timeEnd} · {ev.jobId}</div>}
          </div>
          <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
            {ev.status === "blocked" && <span style={{ fontSize: 10 }}>🔒</span>}
            {ev.smsDispatched && <span style={{ fontSize: 10 }}>📱</span>}
            {ev.dependencies && ev.dependencies.length > 0 && <span style={{ fontSize: 10 }}>🔗</span>}
          </div>
        </div>
        {!compact && (
          <div style={{ display: "flex", gap: 4, marginTop: 4, alignItems: "center" }}>
            <div style={{ display: "flex", marginRight: 2 }}>
              {assigneeMembers.slice(0, 3).map((m, i) => (
                <div key={m.id} style={{ marginLeft: i > 0 ? -6 : 0, zIndex: 3 - i }}>
                  <UserAvatar member={m} size={18}/>
                </div>
              ))}
            </div>
            <Badge color={ev.status === "completed" ? "green" : ev.status === "blocked" ? "red" : ev.status === "in_progress" ? "orange" : "blue"} small>{ev.status.replace("_", " ")}</Badge>
          </div>
        )}
        {!compact && blocked.length > 0 && (
          <div style={{ fontSize: 9, color: T.redBright, marginTop: 4 }}>⚠ Blocked by: {blocked.map(b => b.title).join(", ")}</div>
        )}
      </div>
    );
  };

  // ── DROP ZONE ──
  const DropZone = ({ date, crewId, children }: { date: string; crewId?: string; children?: React.ReactNode }) => {
    const [over, setOver] = useState(false);
    return (
      <div
        onDragOver={e => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={e => { e.preventDefault(); setOver(false); if (dragEvent) handleDrop(dragEvent, date, crewId); }}
        style={{
          minHeight: 60,
          padding: 4,
          borderRadius: 6,
          background: over ? T.orangeDim : "transparent",
          border: over ? `2px dashed ${T.orange}` : "2px dashed transparent",
          transition: "all 0.15s",
        }}
      >
        {children}
      </div>
    );
  };

  return (
    <div style={{ padding: "0 0 40px" }}>
      {/* HEADER */}
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.white, margin: 0 }}>Schedule</h1>
          <p style={{ margin: "3px 0 0", color: T.muted, fontSize: 13 }}>Drag & drop scheduling · Crew assignments · Dependency tracking</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Btn v="secondary" sz="sm" onClick={handleDispatchAll} icon="contact">Dispatch All</Btn>
          {rm.canViewAllJobs && <Btn v="primary" sz="sm" icon="plus" onClick={() => setShowNewEvent(true)}>New Event</Btn>}
        </div>
      </div>

      <div style={{ padding: "0 28px" }}>
        {/* VIEW CONTROLS */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {(["week", "day", "crew"] as const).map(v => (
              <div key={v} onClick={() => setView(v)} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: view === v ? 600 : 400, background: view === v ? T.orangeDim : T.surfaceHigh, color: view === v ? T.orange : T.muted, border: `1px solid ${view === v ? T.orange + "44" : T.border}`, textTransform: "capitalize" }}>{v} View</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <Btn v="ghost" sz="sm" onClick={() => view === "day" ? navigateDay(-1) : navigateWeek(-1)}>◀</Btn>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.white, minWidth: 160, textAlign: "center" }}>
              {view === "day" ? `${getDayName(baseDate)}, ${getMonthDay(baseDate)}` : `${getMonthDay(weekDates[0])} – ${getMonthDay(weekDates[6])}`}
            </span>
            <Btn v="ghost" sz="sm" onClick={() => view === "day" ? navigateDay(1) : navigateWeek(1)}>▶</Btn>
            <Btn v="secondary" sz="sm" onClick={() => setBaseDate(new Date())}>Today</Btn>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <div onClick={() => setFilterCrew(null)} style={{ padding: "4px 10px", borderRadius: 14, fontSize: 10, cursor: "pointer", background: !filterCrew ? T.orangeDim : "transparent", color: !filterCrew ? T.orange : T.muted, border: `1px solid ${!filterCrew ? T.orange + "44" : "transparent"}` }}>All Crew</div>
            {crewMembers.map(m => (
              <div key={m.id} onClick={() => setFilterCrew(filterCrew === m.id ? null : m.id)} style={{ padding: "4px 8px", borderRadius: 14, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, background: filterCrew === m.id ? T.orangeDim : "transparent", color: filterCrew === m.id ? T.orange : T.muted, border: `1px solid ${filterCrew === m.id ? T.orange + "44" : "transparent"}` }}>
                <UserAvatar member={m} size={16}/>{m.name.split(" ")[0]}
              </div>
            ))}
          </div>
        </div>

        {/* DEPENDENCY CHAIN LEGEND */}
        <Card style={{ marginBottom: 14, padding: "10px 16px" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.dim, textTransform: "uppercase", letterSpacing: "0.06em" }}>Legend:</span>
            {Object.entries(TYPE_LABELS).slice(0, 8).map(([key, label]) => {
              const colors: Record<string, string> = { mitigation: T.orange, assessment: T.yellowBright, recon: T.tealBright, inspection: T.blueBright, pickup: T.greenBright, delivery: T.purpleBright, walkthrough: T.purpleBright, demo: T.redBright, drycheck: T.blueBright };
              return (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: colors[key] || T.muted }}/>
                  <span style={{ fontSize: 10, color: T.muted }}>{label}</span>
                </div>
              );
            })}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontSize: 10 }}>🔗</span><span style={{ fontSize: 10, color: T.muted }}>Has dependency</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontSize: 10 }}>🔒</span><span style={{ fontSize: 10, color: T.muted }}>Blocked</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontSize: 10 }}>📱</span><span style={{ fontSize: 10, color: T.muted }}>SMS sent</span></div>
          </div>
        </Card>

        {/* ── WEEK VIEW ── */}
        {view === "week" && (
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: `60px repeat(${weekDates.length}, 1fr)`, borderBottom: `1px solid ${T.border}` }}>
              <div style={{ padding: 8, borderRight: `1px solid ${T.border}` }}/>
              {weekDates.map(d => (
                <div key={dateStr(d)} style={{ padding: "10px 8px", textAlign: "center", borderRight: `1px solid ${T.border}`, background: isToday(d) ? T.orangeDim : "transparent" }}>
                  <div style={{ fontSize: 10, color: isToday(d) ? T.orange : T.dim, fontWeight: 600, textTransform: "uppercase" }}>{getDayName(d)}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: isToday(d) ? T.orange : T.white }}>{d.getDate()}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `60px repeat(${weekDates.length}, 1fr)`, minHeight: 400 }}>
              <div style={{ borderRight: `1px solid ${T.border}`, padding: "8px 0" }}>
                {HOURS.map(h => (
                  <div key={h} style={{ height: 44, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", paddingRight: 6, fontSize: 10, color: T.dim }}>{h > 12 ? h - 12 : h}{h >= 12 ? "p" : "a"}</div>
                ))}
              </div>
              {weekDates.map(d => {
                const dayEvents = getEventsForDateAndCrew(dateStr(d));
                return (
                  <DropZone key={dateStr(d)} date={dateStr(d)}>
                    <div style={{ padding: 4, minHeight: HOURS.length * 44 }}>
                      {dayEvents.map(ev => <EventCard key={ev.id} ev={ev}/>)}
                      {dayEvents.length === 0 && <div style={{ fontSize: 10, color: T.dim, textAlign: "center", padding: "20px 0" }}>—</div>}
                    </div>
                  </DropZone>
                );
              })}
            </div>
          </Card>
        )}

        {/* ── DAY VIEW ── */}
        {view === "day" && (
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", minHeight: 500 }}>
              <div style={{ borderRight: `1px solid ${T.border}`, padding: "8px 0" }}>
                {HOURS.map(h => (
                  <div key={h} style={{ height: 52, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", paddingRight: 8, fontSize: 11, color: T.dim, fontWeight: 500 }}>{h > 12 ? h - 12 : h}:00 {h >= 12 ? "PM" : "AM"}</div>
                ))}
              </div>
              <DropZone date={dateStr(baseDate)}>
                <div style={{ position: "relative", minHeight: HOURS.length * 52 }}>
                  {HOURS.map(h => <div key={h} style={{ height: 52, borderBottom: `1px solid ${T.border}18` }}/>)}
                  {getEventsForDateAndCrew(dateStr(baseDate)).map(ev => {
                    const startH = parseInt(ev.timeStart.split(":")[0]) - 7;
                    const startM = parseInt(ev.timeStart.split(":")[1]);
                    const endH = parseInt(ev.timeEnd.split(":")[0]) - 7;
                    const endM = parseInt(ev.timeEnd.split(":")[1]);
                    const top = (startH * 52) + (startM / 60) * 52;
                    const height = Math.max(((endH - startH) * 52) + ((endM - startM) / 60) * 52, 36);
                    return (
                      <div key={ev.id} style={{ position: "absolute", top, left: 8, right: 8, height, zIndex: 2 }}>
                        <EventCard ev={ev}/>
                      </div>
                    );
                  })}
                </div>
              </DropZone>
            </div>
          </Card>
        )}

        {/* ── CREW VIEW ── */}
        {view === "crew" && (
          <Card style={{ padding: 0, overflow: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: `140px repeat(${weekDates.length}, 1fr)`, borderBottom: `1px solid ${T.border}` }}>
              <div style={{ padding: "10px 12px", borderRight: `1px solid ${T.border}`, fontWeight: 600, color: T.white, fontSize: 12 }}>Crew Member</div>
              {weekDates.map(d => (
                <div key={dateStr(d)} style={{ padding: "10px 6px", textAlign: "center", borderRight: `1px solid ${T.border}`, background: isToday(d) ? T.orangeDim : "transparent" }}>
                  <div style={{ fontSize: 10, color: isToday(d) ? T.orange : T.dim, fontWeight: 600 }}>{getDayName(d)}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isToday(d) ? T.orange : T.white }}>{d.getDate()}</div>
                </div>
              ))}
            </div>
            {crewMembers.map(member => (
              <div key={member.id} style={{ display: "grid", gridTemplateColumns: `140px repeat(${weekDates.length}, 1fr)`, borderBottom: `1px solid ${T.border}22` }}>
                <div style={{ padding: "10px 12px", borderRight: `1px solid ${T.border}`, display: "flex", gap: 8, alignItems: "center" }}>
                  <UserAvatar member={member} size={28}/>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.white }}>{member.name.split(" ")[0]}</div>
                    <div style={{ fontSize: 9, color: T.muted }}>{ROLES[member.role]?.label.split(" ")[0]}</div>
                  </div>
                </div>
                {weekDates.map(d => {
                  const dayEvents = getEventsForDateAndCrew(dateStr(d), member.id);
                  return (
                    <DropZone key={dateStr(d)} date={dateStr(d)} crewId={member.id}>
                      <div style={{ padding: 2, minHeight: 60 }}>
                        {dayEvents.map(ev => <EventCard key={ev.id} ev={ev} compact/>)}
                      </div>
                    </DropZone>
                  );
                })}
              </div>
            ))}
          </Card>
        )}

        {/* UPCOMING DEPENDENCIES */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 600, color: T.white, fontSize: 14, marginBottom: 10 }}>🔗 Dependency Chain & Sequencing</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {events.filter(e => e.dependencies && e.dependencies.length > 0).map(ev => {
              const depEvents = ev.dependencies!.map(id => events.find(e => e.id === id)).filter(Boolean) as ScheduleEvent[];
              const allComplete = depEvents.every(d => d.status === "completed");
              return (
                <Card key={ev.id} style={{ padding: "12px 14px", borderColor: allComplete ? T.greenBright + "33" : ev.status === "blocked" ? T.redBright + "33" : T.border }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.white }}>{ev.title}</span>
                    <Badge color={ev.status === "blocked" ? "red" : allComplete ? "green" : "yellow"} small>{ev.status === "blocked" ? "Blocked" : allComplete ? "Ready" : "Waiting"}</Badge>
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>{ev.jobId} · {ev.date}</div>
                  <div style={{ fontSize: 10, color: T.dim, marginBottom: 4 }}>Depends on:</div>
                  {depEvents.map(dep => (
                    <div key={dep.id} style={{ display: "flex", gap: 6, alignItems: "center", padding: "3px 0" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: dep.status === "completed" ? T.greenBright : T.yellowBright }}/>
                      <span style={{ fontSize: 11, color: dep.status === "completed" ? T.greenBright : T.text }}>{dep.title}</span>
                      <span style={{ fontSize: 9, color: T.dim }}>{dep.date}</span>
                    </div>
                  ))}
                  {!ev.smsDispatched && (
                    <Btn v="secondary" sz="sm" icon="contact" onClick={() => handleSMSDispatch(ev.id)} style={{ marginTop: 6 }}>Send SMS</Btn>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── EVENT DETAIL MODAL ── */}
      {selectedEvent && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }} onClick={() => setSelectedEvent(null)}>
          <div onClick={e => e.stopPropagation()}>
            <Card style={{ width: 480, maxHeight: "80vh", overflowY: "auto", background: T.surface }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.white }}>{selectedEvent.title}</h3>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{TYPE_LABELS[selectedEvent.type]} · {selectedEvent.jobId}</div>
                </div>
                <button onClick={() => setSelectedEvent(null)} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted }}><Ic n="x" s={18}/></button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                {[
                  ["Date", selectedEvent.date],
                  ["Time", `${selectedEvent.timeStart} – ${selectedEvent.timeEnd}`],
                  ["Status", selectedEvent.status],
                  ["SMS", selectedEvent.smsDispatched ? "Dispatched ✅" : "Not sent"],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <div style={{ fontSize: 10, color: T.dim, textTransform: "uppercase", marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: T.dim, textTransform: "uppercase", marginBottom: 6 }}>Assigned Crew</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {selectedEvent.assignees.map(id => {
                    const m = members.find((t: any) => t.id === id) as CalendarTeamMember | undefined;
                    return m ? (
                      <div key={id} style={{ display: "flex", gap: 6, alignItems: "center", background: T.surfaceHigh, padding: "6px 10px", borderRadius: 6 }}>
                        <UserAvatar member={m} size={24}/>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: T.white }}>{m.name}</div>
                          <div style={{ fontSize: 9, color: T.muted }}>{ROLES[m.role]?.label}</div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {selectedEvent.notes && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: T.dim, textTransform: "uppercase", marginBottom: 4 }}>Notes</div>
                  <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6, background: T.surfaceHigh, padding: "8px 12px", borderRadius: 6 }}>{selectedEvent.notes}</div>
                </div>
              )}

              {getBlockedBy(selectedEvent).length > 0 && (
                <div style={{ background: T.redDim, border: `1px solid ${T.redBright}33`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.redBright, marginBottom: 4 }}>⚠ Blocked by incomplete tasks:</div>
                  {getBlockedBy(selectedEvent).map(dep => (
                    <div key={dep.id} style={{ fontSize: 12, color: T.text, marginTop: 2 }}>• {dep.title} ({dep.date})</div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                {!selectedEvent.smsDispatched && <Btn v="secondary" sz="sm" icon="contact" onClick={() => { handleSMSDispatch(selectedEvent.id); setSelectedEvent({ ...selectedEvent, smsDispatched: true }); }}>Send SMS</Btn>}
                <Btn v="secondary" sz="sm" icon="edit">Edit Event</Btn>
                <Btn v={selectedEvent.status === "completed" ? "ghost" : "success"} sz="sm" icon="check" onClick={() => { setEvents(prev => prev.map(e => e.id === selectedEvent.id ? { ...e, status: "completed" } : e)); setSelectedEvent({ ...selectedEvent, status: "completed" }); toast({ title: "✅ Task completed", description: selectedEvent.title }); }}>
                  {selectedEvent.status === "completed" ? "Completed" : "Mark Complete"}
                </Btn>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── NEW EVENT MODAL ── */}
      {showNewEvent && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }} onClick={() => setShowNewEvent(false)}>
          <div onClick={e => e.stopPropagation()}>
            <Card style={{ width: 480, background: T.surface }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.white }}>New Schedule Event</h3>
                <button onClick={() => setShowNewEvent(false)} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted }}><Ic n="x" s={18}/></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 4 }}>Title *</label>
                  <input style={{ width: "100%", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box" }} placeholder="e.g. Day 6 Drying Check"/>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 4 }}>Job *</label>
                  <select style={{ width: "100%", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none" }}>
                    {jobs.filter((j: any) => j.stage !== "paid").map((j: any) => <option key={j.id} value={j.id}>{j.id} – {j.customer}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 4 }}>Type *</label>
                  <select style={{ width: "100%", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none" }}>
                    {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 4 }}>Date *</label>
                  <input type="date" defaultValue="2026-03-09" style={{ width: "100%", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box" }}/>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 4 }}>Start Time</label>
                  <input type="time" defaultValue="08:00" style={{ width: "100%", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box" }}/>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 4 }}>End Time</label>
                  <input type="time" defaultValue="10:00" style={{ width: "100%", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box" }}/>
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 4 }}>Assign Crew</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {crewMembers.map(m => (
                      <div key={m.id} style={{ display: "flex", gap: 4, alignItems: "center", padding: "5px 10px", borderRadius: 6, background: T.surfaceHigh, border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 11, color: T.text }}>
                        <UserAvatar member={m} size={18}/>{m.name.split(" ")[0]}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 4 }}>Notes</label>
                  <textarea style={{ width: "100%", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", resize: "vertical", minHeight: 60, boxSizing: "border-box" }} placeholder="Access notes, requirements..."/>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Btn v="secondary" onClick={() => setShowNewEvent(false)}>Cancel</Btn>
                <Btn v="primary" icon="plus" onClick={() => { setShowNewEvent(false); toast({ title: "Event created", description: "New schedule event added" }); }}>Create Event</Btn>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
