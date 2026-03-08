import { useState } from "react";
import { T, ROLES, JOB_STAGES, LOSS_TYPES, DRYING_LOGS, stageInfo, stageColor, type Job } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Divider } from "@/components/recon/ReconUI";

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
  const tabs = ["overview", "contacts", "drying_log", "documents", "photos", "timeline", "notes"];
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
