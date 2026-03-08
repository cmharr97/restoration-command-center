import { useState, useRef, useEffect } from "react";
import { T, ROLES, JOB_STAGES, LOSS_TYPES, DRYING_LOGS, TEAM_MEMBERS, stageInfo, stageColor, type Job } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Divider } from "@/components/recon/ReconUI";
import { UserAvatar } from "@/components/recon/MessagingPage";

interface JobDetailProps {
  job: Job;
  role: string;
  setActive: (id: string) => void;
}

export const JobDetailPage = ({ job, role, setActive }: JobDetailProps) => {
  const [tab, setTab] = useState("overview");
  const rm = ROLES[role];
  const stage = stageInfo(job.stage);
  const logs = DRYING_LOGS[job.id] || [];
  const tabs = ["overview", "contacts", "drying_log", "communication", "documents", "photos", "timeline", "notes"];
  const isWater = job.lossType === "water";

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "24px 28px 0", marginBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <button onClick={() => setActive("jobs")} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 12, padding: 0, display: "flex", alignItems: "center", gap: 4 }}><Ic n="chevR" s={12} c={T.muted}/>Jobs</button>
              <Ic n="chevR" s={12} c={T.dim}/>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: T.orange, fontWeight: 700 }}>{job.id}</span>
              {job.priority === "high" && <Badge color="red" small>URGENT</Badge>}
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: T.white, margin: "0 0 2px", letterSpacing: "-0.02em" }}>{job.customer}</h1>
            <p style={{ margin: 0, color: T.muted, fontSize: 13 }}>{job.address}</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Badge color={stageColor[job.stage] || "gray"} dot>{stage.label}</Badge>
            {rm.canDeleteJobs && <Btn v="danger" sz="sm">Archive</Btn>}
            <Btn v="primary" sz="sm" icon="edit">Edit Job</Btn>
          </div>
        </div>

        <div style={{ display: "flex", gap: 2, marginBottom: 16, overflowX: "auto" }}>
          {JOB_STAGES.map((s, i) => {
            const stageIdx = JOB_STAGES.findIndex(x => x.id === job.stage);
            const isPast = i < stageIdx;
            const isCurrent = i === stageIdx;
            return (
              <div key={s.id} style={{ flex: 1, minWidth: 60, textAlign: "center" }}>
                <div style={{ height: 4, borderRadius: 2, background: isPast || isCurrent ? s.color : T.surfaceTop, marginBottom: 4, transition: "background 0.3s" }}/>
                <div style={{ fontSize: 9, color: isCurrent ? s.color : isPast ? T.muted : T.dim, fontWeight: isCurrent ? 700 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 0, padding: "12px 16px", background: T.surfaceHigh, borderRadius: 10, border: `1px solid ${T.border}` }}>
          {[
            { label: "Loss Type", value: `${LOSS_TYPES.find(l => l.id === job.lossType)?.label || job.lossType} – ${job.lossSubtype}`, icon: "drop" },
            { label: "Date of Loss", value: job.dateOfLoss, icon: "cal" },
            { label: "Carrier", value: job.carrier, icon: "shield" },
            { label: "Claim #", value: job.claimNo, icon: "note" },
            { label: "PM", value: job.pm, icon: "users" },
            ...(isWater && job.dayOfDrying ? [{ label: "Drying Day", value: `Day ${job.dayOfDrying}`, icon: "moisture" }] : []),
            ...(rm.canViewInvoices && job.contractValue ? [{ label: "Contract", value: `$${job.contractValue.toLocaleString()}`, icon: "dollar" }] : []),
          ].map((inf, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Ic n={inf.icon} s={13} c={T.orange}/>
              <div>
                <div style={{ fontSize: 10, color: T.dim, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{inf.label}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{inf.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 28px" }}>
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 16, overflowX: "auto" }}>
          {tabs.map(t => (
            <div key={t} onClick={() => setTab(t)} style={{ padding: "10px 16px", cursor: "pointer", fontSize: 12, fontWeight: tab === t ? 600 : 400, color: tab === t ? T.orange : T.muted, borderBottom: `2px solid ${tab === t ? T.orange : "transparent"}`, marginBottom: -1, textTransform: "capitalize", whiteSpace: "nowrap" }}>{t.replace("_", " ")}</div>
          ))}
        </div>

        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <div style={{ fontWeight: 600, color: T.white, marginBottom: 12 }}>Loss Details</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[["Type", `${LOSS_TYPES.find(l => l.id === job.lossType)?.label} – ${job.lossSubtype}`], ["Date of Loss", job.dateOfLoss], ["Description", job.notes]].map(([k, v]) => (
                  <div key={k}><div style={{ fontSize: 11, color: T.dim, marginBottom: 2 }}>{k}</div><div style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>{v}</div></div>
                ))}
              </div>
            </Card>
            <Card>
              <div style={{ fontWeight: 600, color: T.white, marginBottom: 12 }}>Insurance Info</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[["Carrier", job.carrier], ["Claim #", job.claimNo], ["Adjuster", job.adjuster], ["Adj. Phone", job.adjusterPhone || "TBD"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: T.muted }}>{k}</span>
                    <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <div style={{ fontWeight: 600, color: T.white, marginBottom: 12 }}>Assigned Team</div>
              {[{ label: "Project Manager", name: job.pm }, ...job.techs.map((t, i) => ({ label: i === 0 ? "Lead Tech" : "Technician", name: t }))].map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${T.orange},${T.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>{m.name?.split(" ").map(x => x[0]).join("") || "?"}</div>
                  <div><div style={{ fontSize: 12, fontWeight: 500, color: T.text }}>{m.name || "Unassigned"}</div><div style={{ fontSize: 10, color: T.muted }}>{m.label}</div></div>
                </div>
              ))}
              {job.techs.length === 0 && <div style={{ fontSize: 12, color: T.dim }}>No techs assigned yet</div>}
            </Card>
            <Card>
              <div style={{ fontWeight: 600, color: T.white, marginBottom: 12 }}>Active Equipment</div>
              {job.equipment.length === 0 ? <div style={{ fontSize: 12, color: T.dim }}>No equipment on site</div> :
                job.equipment.map((eq, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "7px 10px", background: T.surfaceHigh, borderRadius: 7 }}>
                    <div><div style={{ fontSize: 12, fontWeight: 500, color: T.text }}>{eq.name}</div><div style={{ fontSize: 10, color: T.muted }}>Placed {eq.placed}</div></div>
                    <Badge color="blue" small>Qty: {eq.qty}</Badge>
                  </div>
                ))
              }
            </Card>
          </div>
        )}

        {tab === "drying_log" && (
          <div>
            {!isWater ? <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Drying logs are only used for water damage jobs</div> : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ fontWeight: 600, color: T.white }}>IICRC S500 Drying Log — {job.id}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn v="secondary" sz="sm">Export PDF</Btn>
                    <Btn v="primary" sz="sm" icon="plus">Add Today's Reading</Btn>
                  </div>
                </div>
                {logs.length === 0 ? <div style={{ textAlign: "center", padding: 40, color: T.dim }}>No drying logs yet for this job</div> :
                  logs.map((log, i) => (
                    <Card key={i} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <div style={{ background: T.orangeDim, border: `1px solid ${T.orange}44`, borderRadius: 8, padding: "6px 12px", textAlign: "center" }}>
                            <div style={{ fontSize: 18, fontWeight: 800, color: T.orange }}>D{log.day}</div>
                            <div style={{ fontSize: 10, color: T.muted }}>{log.date}</div>
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>Tech: {log.tech}</div>
                            <div style={{ fontSize: 11, color: T.muted }}>{log.equipment.dehus} dehus · {log.equipment.airMovers} air movers · {log.equipment.scrubbers} scrubbers</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 16 }}>
                          <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: T.dim }}>GPP</div><div style={{ fontSize: 16, fontWeight: 700, color: log.gpp < 50 ? T.greenBright : T.yellowBright }}>{log.gpp}</div></div>
                          <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: T.dim }}>TEMP</div><div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{log.temp}°F</div></div>
                          <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: T.dim }}>RH</div><div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{log.rh}%</div></div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                        {log.readings.map((r, ri) => (
                          <div key={ri} style={{ background: r.status === "wet" ? T.yellowDim : T.greenDim, border: `1px solid ${r.status === "wet" ? T.yellowBright + "44" : T.greenBright + "44"}`, borderRadius: 7, padding: "5px 10px", textAlign: "center", minWidth: 70 }}>
                            <div style={{ fontSize: 10, color: r.status === "wet" ? T.yellowBright : T.greenBright, fontWeight: 500 }}>{r.room}</div>
                            <div style={{ fontSize: 9, color: T.muted }}>{r.material}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: r.status === "wet" ? T.yellowBright : T.greenBright }}>{r.reading}%</div>
                            <div style={{ fontSize: 8, color: r.status === "wet" ? T.yellowBright : T.greenBright }}>{r.status === "dry" ? "✓ DRY" : `WET (${r.dry})`}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>{log.notes}</div>
                    </Card>
                  ))
                }
              </div>
            )}
          </div>
        )}

        {tab === "contacts" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <div style={{ fontWeight: 600, color: T.white, marginBottom: 12 }}>Customer</div>
              {[["Name", job.customer], ["Phone", job.phone], ["Address", job.address]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: T.muted }}>{k}</span>
                  <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{ fontWeight: 600, color: T.white, marginBottom: 12 }}>Insurance Adjuster</div>
              {[["Carrier", job.carrier], ["Adjuster", job.adjuster], ["Phone", job.adjusterPhone || "TBD"], ["Claim #", job.claimNo]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: T.muted }}>{k}</span>
                  <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
        )}

        {tab === "communication" && <JobCommunicationTab job={job} role={role}/>}

        {tab === "photos" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontWeight: 600, color: T.white }}>Photo Documentation</div>
              <Btn v="primary" sz="sm" icon="photo">Upload Photos</Btn>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
              {[["Initial damage – kitchen floor", "Mar 2"], ["Extraction complete", "Mar 2"], ["Equipment placement", "Mar 2"], ["Moisture map – Day 1", "Mar 2"], ["Day 3 – hardwood cupping", "Mar 4"], ["Day 5 – progress", "Mar 6"]].map(([cap, date], i) => (
                <div key={i} style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${T.border}`, cursor: "pointer" }}>
                  <div style={{ height: 90, background: `linear-gradient(135deg, ${T.surfaceHigh}, ${T.surfaceTop})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Ic n="photo" s={24} c={T.dim}/>
                  </div>
                  <div style={{ padding: "6px 8px" }}>
                    <div style={{ fontSize: 10, color: T.text, fontWeight: 500 }}>{cap}</div>
                    <div style={{ fontSize: 9, color: T.muted }}>{date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "documents" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontWeight: 600, color: T.white }}>Documents</div>
              <Btn v="primary" sz="sm" icon="upload">Upload Document</Btn>
            </div>
            {[
              { name: "Authorization to Perform Services (AOB).pdf", type: "Legal", date: "Mar 2", signed: true },
              { name: "Certificate of Completion – Mitigation.pdf", type: "Mitigation", date: "Pending", signed: false },
              { name: "Xactimate Estimate v1.pdf", type: "Estimate", date: "Mar 3", signed: false },
              { name: "State Farm Claim Summary.pdf", type: "Insurance", date: "Mar 2", signed: false },
              { name: "Drying Report – Day 1-5.pdf", type: "Drying Log", date: "Auto-generated", signed: false },
            ].map((doc, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: T.surfaceHigh, borderRadius: 8, marginBottom: 8, border: `1px solid ${T.border}` }}>
                <Ic n="note" s={18} c={T.blueBright}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{doc.name}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{doc.type} · {doc.date}</div>
                </div>
                {doc.signed && <Badge color="green" small>Signed</Badge>}
                <Btn v="secondary" sz="sm" icon="eye">View</Btn>
              </div>
            ))}
          </div>
        )}

        {tab === "timeline" && (
          <Card>
            <div style={{ fontWeight: 600, color: T.white, marginBottom: 16 }}>Job Timeline</div>
            {[
              { date: "Mar 2", event: "Job created – Water damage Cat 2", color: T.orange },
              { date: "Mar 2", event: "AOB signed by customer", color: T.purpleBright },
              { date: "Mar 2", event: "Mitigation crew dispatched", color: T.blueBright },
              { date: "Mar 2", event: "Equipment placed – 2 dehus, 8 air movers", color: T.greenBright },
              { date: "Mar 3", event: "Day 2 drying log recorded", color: T.blueBright },
              { date: "Mar 4", event: "Xactimate estimate submitted to State Farm", color: T.yellowBright },
              { date: "Mar 4", event: "Hall drywall reached dry standard", color: T.greenBright },
              { date: "Mar 6", event: "Day 5 drying check – subfloor still elevated", color: T.redBright },
            ].map((ev, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 60, fontSize: 11, color: T.muted, textAlign: "right", flexShrink: 0, paddingTop: 2 }}>{ev.date}</div>
                <div style={{ width: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: ev.color, flexShrink: 0 }}/>
                  {i < 7 && <div style={{ width: 1, flex: 1, background: T.border }}/>}
                </div>
                <div style={{ fontSize: 12, color: T.text, paddingTop: 1 }}>{ev.event}</div>
              </div>
            ))}
          </Card>
        )}

        {tab === "notes" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontWeight: 600, color: T.white }}>Internal Notes</div>
              <Btn v="primary" sz="sm" icon="plus">Add Note</Btn>
            </div>
            {[
              { author: "Destiny Kim", date: "Mar 6", note: "Subfloor readings still elevated in laundry. May need to demo to expose and dry. Will discuss with adjuster tomorrow.", isInternal: true },
              { author: "Marcus Webb", date: "Mar 4", note: "Hardwood in kitchen showing significant cupping. Took detailed photos. Likely non-salvageable — will need replacement.", isInternal: true },
              { author: "Tyler Nguyen", date: "Mar 4", note: "Xactimate estimate submitted. Included line items for hardwood replacement based on field notes.", isInternal: false },
            ].map((n, i) => (
              <Card key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg,${T.orange},${T.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff" }}>{n.author.split(" ").map(x => x[0]).join("")}</div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.white }}>{n.author}</span>
                    {n.isInternal && <Badge color="orange" small>Internal</Badge>}
                  </div>
                  <span style={{ fontSize: 11, color: T.muted }}>{n.date}</span>
                </div>
                <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>{n.note}</div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── JOB COMMUNICATION TAB ──
const JobCommunicationTab = ({ job, role }: { job: Job; role: string }) => {
  const [lane, setLane] = useState<"internal" | "customer" | "insurance" | "subs">("internal");
  const [msgText, setMsgText] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUser = TEAM_MEMBERS.find(m => m.role === role) || TEAM_MEMBERS[0];

  const laneConfig = {
    internal: { label: "Internal Team", color: T.orange, icon: "users", desc: "Only visible to your team" },
    customer: { label: "Customer", color: T.greenBright, icon: "customer", desc: "Visible to the property owner" },
    insurance: { label: "Insurance / TPA", color: T.blueBright, icon: "shield", desc: "Carrier & adjuster correspondence" },
    subs: { label: "Subcontractors", color: T.purpleBright, icon: "truck", desc: "Communication with assigned subs" },
  };

  type CommMessage = { sender: string; senderId: string; text: string; time: string; date: string; lane: string; mentions?: string[] };
  
  const [messages, setMessages] = useState<CommMessage[]>([
    { sender: "Destiny Kim", senderId: "u2", text: "Crew mobilized. Marcus and Carlos are en route. Equipment loaded.", time: "2:30 PM", date: "Mar 2", lane: "internal" },
    { sender: "Marcus Webb", senderId: "u5", text: "On site. Standing water confirmed in kitchen, laundry, and hall. Beginning extraction now.", time: "3:15 PM", date: "Mar 2", lane: "internal" },
    { sender: "Destiny Kim", senderId: "u2", text: `Mrs. Martinez, our crew is on site and beginning water extraction. We'll have equipment running overnight. I'll update you tomorrow with drying progress.`, time: "4:00 PM", date: "Mar 2", lane: "customer" },
    { sender: "Destiny Kim", senderId: "u2", text: "Tom, this is Destiny from ReCon Pro. We're on the Martinez loss (Claim #SF-2026-44821). Cat 2 water damage from washing machine supply line. Mitigation underway. Will send initial scope and photos today.", time: "4:30 PM", date: "Mar 2", lane: "insurance" },
    { sender: "Marcus Webb", senderId: "u5", text: "Day 3 update: Hall drywall reached dry standard. Kitchen hardwood cupping significantly — documenting for potential replacement. @Tyler Nguyen please factor into Xactimate.", time: "10:00 AM", date: "Mar 4", lane: "internal", mentions: ["Tyler Nguyen"] },
    { sender: "Tyler Nguyen", senderId: "u3", text: "Estimate submitted to State Farm. Included hardwood replacement. Adj: Tom Hendricks notified.", time: "4:15 PM", date: "Mar 4", lane: "insurance" },
    { sender: "Destiny Kim", senderId: "u2", text: "Mrs. Martinez — drying is progressing well. Kitchen floor has some cupping that we're monitoring. Our estimator has submitted the full scope to State Farm. We'll keep you posted on approval.", time: "5:00 PM", date: "Mar 4", lane: "customer" },
    { sender: "Marcus Webb", senderId: "u5", text: "Day 5: Most areas approaching dry standard. Laundry subfloor at 20% (19% needed). May need demo. @Destiny Kim let's discuss.", time: "10:20 AM", date: "Mar 6", lane: "internal", mentions: ["Destiny Kim"] },
    { sender: "Destiny Kim", senderId: "u2", text: "Approved by @John Davis — proceeding with laundry subfloor demo tomorrow. Will supplement Xactimate accordingly.", time: "10:45 AM", date: "Mar 8", lane: "internal", mentions: ["John Davis"] },
  ]);

  const filteredMessages = messages.filter(m => m.lane === lane);

  const handleSend = () => {
    if (!msgText.trim()) return;
    const mentions = msgText.match(/@([\w\s]+?)(?=\s|$|[.,!?])/g)?.map(m => m.slice(1).trim()) || [];
    setMessages(prev => [...prev, {
      sender: currentUser.name,
      senderId: currentUser.id,
      text: msgText,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      date: "Mar 8",
      lane,
      mentions: mentions.length > 0 ? mentions : undefined,
    }]);
    setMsgText("");
    setShowMentions(false);
  };

  const handleInputChange = (val: string) => {
    setMsgText(val);
    const lastAt = val.lastIndexOf("@");
    if (lastAt !== -1 && (lastAt === val.length - 1 || !val.slice(lastAt).includes(" "))) {
      setShowMentions(true);
      setMentionFilter(val.slice(lastAt + 1));
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (name: string) => {
    const lastAt = msgText.lastIndexOf("@");
    setMsgText(msgText.slice(0, lastAt) + `@${name} `);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const lc = laneConfig[lane];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontWeight: 600, color: T.white }}>Job Communication — {job.id}</div>
        <div style={{ display: "flex", gap: 6 }}>
          <Btn v="secondary" sz="sm" icon="note">Templates</Btn>
          <Btn v="secondary" sz="sm" icon="upload">Export Log</Btn>
        </div>
      </div>

      {/* Lane Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
        {(Object.keys(laneConfig) as Array<keyof typeof laneConfig>).map(l => {
          const conf = laneConfig[l];
          const count = messages.filter(m => m.lane === l).length;
          const isActive = lane === l;
          return (
            <div key={l} onClick={() => setLane(l)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, cursor: "pointer", background: isActive ? `${conf.color}1a` : T.surfaceHigh, border: `1px solid ${isActive ? conf.color + "55" : T.border}`, transition: "all 0.12s" }}>
              <Ic n={conf.icon} s={14} c={isActive ? conf.color : T.muted}/>
              <span style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? conf.color : T.muted }}>{conf.label}</span>
              <span style={{ fontSize: 10, background: isActive ? conf.color + "33" : T.surfaceTop, color: isActive ? conf.color : T.dim, borderRadius: 10, padding: "1px 6px", fontWeight: 600 }}>{count}</span>
            </div>
          );
        })}
      </div>

      <div style={{ background: `${lc.color}0a`, border: `1px solid ${lc.color}22`, borderRadius: 6, padding: "6px 12px", marginBottom: 12, display: "flex", gap: 6, alignItems: "center" }}>
        <Ic n={lc.icon} s={13} c={lc.color}/>
        <span style={{ fontSize: 11, color: lc.color }}>{lc.desc}</span>
      </div>

      {/* Messages */}
      <div style={{ maxHeight: 400, overflowY: "auto", marginBottom: 14 }}>
        {filteredMessages.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: T.dim }}>
            <div style={{ fontSize: 13 }}>No {lc.label.toLowerCase()} messages yet</div>
          </div>
        ) : filteredMessages.map((msg, i) => {
          const member = TEAM_MEMBERS.find(m => m.id === msg.senderId);
          const showDate = i === 0 || filteredMessages[i - 1].date !== msg.date;
          return (
            <div key={i}>
              {showDate && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0" }}>
                  <div style={{ flex: 1, height: 1, background: T.border }}/>
                  <span style={{ fontSize: 10, color: T.dim }}>{msg.date}</span>
                  <div style={{ flex: 1, height: 1, background: T.border }}/>
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <UserAvatar member={member} size={28}/>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "baseline", marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.white }}>{msg.sender}</span>
                    <span style={{ fontSize: 10, color: T.dim }}>{msg.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>
                    {msg.text.split(/(@[\w\s]+?)(?=\s|$|[.,!?])/g).map((part, pi) => {
                      if (part.startsWith("@")) {
                        return <span key={pi} style={{ background: T.orangeDim, color: T.orange, padding: "1px 4px", borderRadius: 3, fontWeight: 600, fontSize: 11 }}>{part}</span>;
                      }
                      return <span key={pi}>{part}</span>;
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div style={{ position: "relative" }}>
        {showMentions && (
          <div style={{ position: "absolute", bottom: "100%", left: 0, right: 0, background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, padding: 4, maxHeight: 160, overflowY: "auto", marginBottom: 4 }}>
            {TEAM_MEMBERS.filter(m => m.name.toLowerCase().includes(mentionFilter.toLowerCase())).map(m => (
              <div key={m.id} onClick={() => insertMention(m.name)} style={{ display: "flex", gap: 6, alignItems: "center", padding: "6px 8px", borderRadius: 5, cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = T.surfaceTop}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
              >
                <UserAvatar member={m} size={22}/>
                <span style={{ fontSize: 12, color: T.white }}>{m.name}</span>
                <span style={{ fontSize: 10, color: T.muted }}>{ROLES[m.role]?.label}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            ref={inputRef}
            type="text"
            placeholder={`Message ${lc.label}... (type @ to mention)`}
            value={msgText}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleSend(); } }}
            style={{ flex: 1, background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none" }}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = lc.color}
            onBlur={e => (e.target as HTMLInputElement).style.borderColor = T.border}
          />
          <Btn v="primary" sz="sm" icon="send" onClick={handleSend} disabled={!msgText.trim()}>Send</Btn>
        </div>
      </div>
    </div>
  );
};
