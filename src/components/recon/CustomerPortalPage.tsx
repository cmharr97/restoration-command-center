import { useState } from "react";
import { T, JOB_STAGES, stageInfo, LOSS_TYPES } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Inp } from "@/components/recon/ReconUI";
import { toast } from "@/hooks/use-toast";
import { useJobs, useDryingLogs, useTeamMembers } from "@/hooks/useJobs";

export const CustomerPortalPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("status");
  const [msgText, setMsgText] = useState("");

  const { jobs } = useJobs();
  const job = jobs[0]; // Show first job for customer portal demo
  const { logs } = useDryingLogs(job?.id);
  const { members } = useTeamMembers();
  const pm = job?.pm_name ? members.find(m => m.name === job.pm_name) : null;
  const stage = job ? stageInfo(job.stage) : stageInfo("lead");
  const stageIdx = job ? JOB_STAGES.findIndex(s => s.id === job.stage) : 0;

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f9fb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ width: 400, background: "#fff", borderRadius: 16, padding: 40, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, background: T.orange, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={20} height={18} viewBox="0 0 60 54" fill="none"><polygon points="30,2 54,20 45,20 30,9 15,20 6,20" fill="white"/><polygon points="30,16 51,32 42,32 30,23 18,32 9,32" fill="white" opacity="0.7"/></svg>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: "#1a1a1a" }}>ReCon Pro</div>
                <div style={{ fontSize: 9, color: T.orange, fontWeight: 700, letterSpacing: "0.18em", marginTop: -2 }}>CUSTOMER PORTAL</div>
              </div>
            </div>
            <p style={{ color: "#666", fontSize: 14, margin: "12px 0 0" }}>Sign in to view your project status, photos, and communicate with your team.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#333", display: "block", marginBottom: 5 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "11px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box" }} onFocus={e => (e.target as HTMLInputElement).style.borderColor = T.orange} onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#ddd"}/>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#333", display: "block", marginBottom: 5 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" style={{ width: "100%", padding: "11px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box" }} onFocus={e => (e.target as HTMLInputElement).style.borderColor = T.orange} onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#ddd"}/>
            </div>
            <button onClick={() => { setIsLoggedIn(true); toast({ title: "Welcome, Sarah!", description: "Viewing project J-1051 status" }); }} style={{ width: "100%", padding: "12px", background: T.orange, color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = T.orangeLight}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = T.orange}
            >Sign In</button>
          </div>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <a style={{ color: T.orange, fontSize: 13, textDecoration: "none", cursor: "pointer" }}>Forgot password?</a>
          </div>
        </div>
      </div>
    );
  }

  const tabs = ["status", "schedule", "photos", "documents", "messages", "selections", "invoices", "faq"];

  const customerMessages = [
    { from: "Destiny Kim", role: "Project Manager", time: "4:00 PM, Mar 2", text: "Mrs. Martinez, our crew is on site and beginning water extraction. We'll have equipment running overnight. I'll update you tomorrow with drying progress." },
    { from: "You", role: "Customer", time: "5:30 PM, Mar 2", text: "Thank you Destiny. Is it safe for us to stay in the house tonight?" },
    { from: "Destiny Kim", role: "Project Manager", time: "6:00 PM, Mar 2", text: "Yes, the affected areas are contained. The equipment will be noisy, so you may want earplugs! We'll be back first thing tomorrow for Day 2 readings." },
    { from: "Destiny Kim", role: "Project Manager", time: "5:00 PM, Mar 4", text: "Quick update — drying is progressing well. Kitchen floor has some cupping that we're monitoring. Our estimator has submitted the full scope to State Farm. We'll keep you posted on approval." },
    { from: "You", role: "Customer", time: "6:15 PM, Mar 4", text: "Will the hardwood floors need to be replaced?" },
    { from: "Destiny Kim", role: "Project Manager", time: "8:00 AM, Mar 5", text: "It's looking likely for the kitchen area. We've documented everything for the insurance claim. State Farm has the estimate with replacement line items included." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "'DM Sans',sans-serif" }}>
      {/* Customer Portal Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: T.orange, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={18} height={16} viewBox="0 0 60 54" fill="none"><polygon points="30,2 54,20 45,20 30,9 15,20 6,20" fill="white"/><polygon points="30,16 51,32 42,32 30,23 18,32 9,32" fill="white" opacity="0.7"/></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>ReCon Pro</span>
          <span style={{ fontSize: 11, color: T.orange, fontWeight: 600, background: `${T.orange}15`, padding: "2px 8px", borderRadius: 4 }}>Customer Portal</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#666" }}>Sarah Martinez</span>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.orange, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>SM</div>
          <button onClick={() => setIsLoggedIn(false)} style={{ background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "5px 12px", fontSize: 12, color: "#666", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Sign Out</button>
        </div>
      </div>

      {/* Job Summary Banner */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "20px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Your Project</div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>Water Damage Restoration</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#666" }}>{job.address}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>Project #{job.id}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${stage.color}15`, padding: "5px 12px", borderRadius: 6 }}>
              <span style={{ fontSize: 14 }}>{stage.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: stage.color }}>{stage.label}</span>
            </div>
          </div>
        </div>

        {/* Stage Progress */}
        <div style={{ display: "flex", gap: 2, marginTop: 16 }}>
          {JOB_STAGES.filter(s => !["lead", "recon_est", "invoiced"].includes(s.id)).map((s, i) => {
            const idx = JOB_STAGES.findIndex(x => x.id === s.id);
            const isPast = idx < stageIdx;
            const isCurrent = idx === stageIdx;
            return (
              <div key={s.id} style={{ flex: 1 }}>
                <div style={{ height: 4, borderRadius: 2, background: isPast || isCurrent ? s.color : "#e5e7eb" }}/>
                <div style={{ fontSize: 9, color: isCurrent ? s.color : isPast ? "#666" : "#ccc", fontWeight: isCurrent ? 700 : 400, textAlign: "center", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 32px", display: "flex", gap: 0, overflowX: "auto" }}>
        {tabs.map(t => (
          <div key={t} onClick={() => setActiveTab(t)} style={{ padding: "12px 18px", cursor: "pointer", fontSize: 13, fontWeight: activeTab === t ? 600 : 400, color: activeTab === t ? T.orange : "#666", borderBottom: `2px solid ${activeTab === t ? T.orange : "transparent"}`, textTransform: "capitalize", whiteSpace: "nowrap" }}>{t}</div>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "24px 32px", maxWidth: 900, margin: "0 auto" }}>
        {activeTab === "status" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Current Status</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{stage.icon} {stage.label}</div>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>Active drying in progress. Equipment is running to remove moisture from affected areas. Daily monitoring by our technicians.</p>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Your Project Manager</div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: T.blueBright, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>DK</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>{pm?.name}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{pm?.phone}</div>
                    <div style={{ fontSize: 12, color: T.orange }}>{pm?.email}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>Drying Progress — Day {job.day_of_drying}</div>
              {logs.length > 0 && (() => {
                const latest = logs[logs.length - 1];
                const dry = latest.readings.filter(r => r.status === "dry").length;
                const total = latest.readings.length;
                return (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: "#333" }}>{dry} of {total} areas at dry standard</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: dry === total ? "#16a34a" : T.orange }}>{Math.round((dry / total) * 100)}%</span>
                    </div>
                    <div style={{ height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: dry === total ? "#16a34a" : T.orange, borderRadius: 4, width: `${(dry / total) * 100}%`, transition: "width 0.3s" }}/>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      {latest.readings.map((r, i) => (
                        <div key={i} style={{ flex: 1, textAlign: "center", padding: "8px 6px", background: r.status === "dry" ? "#f0fdf4" : "#fffbeb", borderRadius: 8, border: `1px solid ${r.status === "dry" ? "#bbf7d0" : "#fde68a"}` }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: r.status === "dry" ? "#16a34a" : "#d97706" }}>{r.room}</div>
                          <div style={{ fontSize: 9, color: "#999" }}>{r.material}</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: r.status === "dry" ? "#16a34a" : "#d97706" }}>{r.reading}%</div>
                          <div style={{ fontSize: 9, color: r.status === "dry" ? "#16a34a" : "#d97706" }}>{r.status === "dry" ? "✓ DRY" : "DRYING"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>Insurance Status</div>
              {[
                { label: "Carrier", value: job.carrier },
                { label: "Claim Number", value: job.claimNo },
                { label: "Adjuster", value: job.adjuster },
                { label: "Estimate Status", value: "Submitted — awaiting approval" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 3 ? "1px solid #f0f0f0" : "none" }}>
                  <span style={{ fontSize: 13, color: "#666" }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "schedule" && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Upcoming Schedule</div>
            {[
              { date: "Mar 9", time: "8:00 AM", event: "Laundry Subfloor Demo", who: "Marcus W. & Carlos R.", status: "Scheduled" },
              { date: "Mar 9", time: "2:00 PM", event: "Post-Demo Drying Check", who: "Marcus W.", status: "Scheduled" },
              { date: "Mar 11", time: "TBD", event: "Final Drying Assessment", who: "Marcus W.", status: "Tentative" },
              { date: "TBD", time: "TBD", event: "Reconstruction Estimate Review", who: "Tyler N.", status: "Pending" },
            ].map((ev, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < 3 ? "1px solid #f0f0f0" : "none" }}>
                <div style={{ width: 60, textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{ev.date}</div>
                  <div style={{ fontSize: 11, color: "#999" }}>{ev.time}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{ev.event}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>Technician: {ev.who}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, color: ev.status === "Scheduled" ? "#16a34a" : ev.status === "Tentative" ? "#d97706" : "#999", background: ev.status === "Scheduled" ? "#f0fdf4" : ev.status === "Tentative" ? "#fffbeb" : "#f5f5f5", padding: "3px 10px", borderRadius: 12, alignSelf: "center" }}>{ev.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "photos" && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Project Photos</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
              {[["Initial damage — kitchen", "Mar 2"], ["Water extraction in progress", "Mar 2"], ["Equipment placed", "Mar 2"], ["Day 1 moisture mapping", "Mar 2"], ["Hardwood cupping — kitchen", "Mar 4"], ["Day 5 drying progress", "Mar 6"]].map(([cap, date], i) => (
                <div key={i} style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #e5e7eb", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "none"}
                >
                  <div style={{ height: 100, background: `linear-gradient(135deg, #f5f5f5, #e5e7eb)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: 28 }}>📷</div>
                  <div style={{ padding: "8px 10px" }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: "#333" }}>{cap}</div>
                    <div style={{ fontSize: 10, color: "#999" }}>{date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Documents</div>
            {[
              { name: "Work Authorization (Signed)", date: "Mar 2", status: "Signed ✅", action: "View" },
              { name: "Insurance Claim Summary", date: "Mar 2", status: "Available", action: "Download" },
              { name: "Drying Report — Day 1-5", date: "Mar 6", status: "Available", action: "Download" },
              { name: "Material Selection Form", date: "Pending", status: "⚠ Needs Your Input", action: "Complete" },
              { name: "Certificate of Completion", date: "Pending", status: "Pending", action: "—" },
            ].map((doc, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: i < 4 ? "1px solid #f0f0f0" : "none" }}>
                <span style={{ fontSize: 20 }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a" }}>{doc.name}</div>
                  <div style={{ fontSize: 11, color: "#999" }}>{doc.date}</div>
                </div>
                <span style={{ fontSize: 11, color: doc.status.includes("⚠") ? "#d97706" : doc.status.includes("✅") ? "#16a34a" : "#999" }}>{doc.status}</span>
                {doc.action !== "—" && (
                  <button onClick={() => toast({ title: doc.action === "Complete" ? "Opening form..." : "Downloading...", description: doc.name })} style={{ background: doc.action === "Complete" ? T.orange : "#f5f5f5", color: doc.action === "Complete" ? "#fff" : "#333", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontWeight: 500, fontFamily: "'DM Sans',sans-serif" }}>{doc.action}</button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "messages" && (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>Messages with Your Team</div>
                <div style={{ fontSize: 12, color: "#666" }}>PM: {pm?.name} · {pm?.phone}</div>
              </div>
            </div>
            <div style={{ padding: "16px 20px", maxHeight: 400, overflowY: "auto" }}>
              {customerMessages.map((msg, i) => {
                const isOwn = msg.from === "You";
                return (
                  <div key={i} style={{ display: "flex", justifyContent: isOwn ? "flex-end" : "flex-start", marginBottom: 12 }}>
                    <div style={{ maxWidth: "75%", background: isOwn ? `${T.orange}15` : "#f5f5f5", border: `1px solid ${isOwn ? `${T.orange}33` : "#e5e7eb"}`, borderRadius: 12, padding: "10px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: isOwn ? T.orange : "#1a1a1a" }}>{msg.from}</span>
                        <span style={{ fontSize: 10, color: "#999", marginLeft: 12 }}>{msg.time}</span>
                      </div>
                      <div style={{ fontSize: 13, color: "#333", lineHeight: 1.6 }}>{msg.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 8 }}>
              <input type="text" placeholder="Type a message to your project manager..." value={msgText} onChange={e => setMsgText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && msgText.trim()) { toast({ title: "Message sent!", description: `Your message to ${pm?.name} has been sent` }); setMsgText(""); } }}
                style={{ flex: 1, padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none" }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = T.orange}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#ddd"}
              />
              <button onClick={() => { if (msgText.trim()) { toast({ title: "Message sent!", description: `Sent to ${pm?.name}` }); setMsgText(""); } }} style={{ background: T.orange, color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Send</button>
            </div>
          </div>
        )}

        {activeTab === "selections" && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Material Selections</div>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>Please review and confirm your material preferences. Your selections will be used during reconstruction.</p>
            {[
              { category: "Flooring (Kitchen)", status: "Needs Selection", options: "Hardwood, LVP, Tile", deadline: "Mar 15" },
              { category: "Paint Color", status: "Needs Selection", options: "Match existing or new color", deadline: "Mar 18" },
              { category: "Baseboards", status: "Match Existing", options: "Standard white 3.25\" baseboard", deadline: "—" },
              { category: "Drywall Texture", status: "Match Existing", options: "Orange peel texture", deadline: "—" },
            ].map((sel, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 3 ? "1px solid #f0f0f0" : "none" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a" }}>{sel.category}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{sel.options}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {sel.deadline !== "—" && <span style={{ fontSize: 11, color: "#d97706" }}>Due: {sel.deadline}</span>}
                  <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 12, background: sel.status === "Needs Selection" ? "#fef3c7" : "#f0fdf4", color: sel.status === "Needs Selection" ? "#d97706" : "#16a34a" }}>{sel.status}</span>
                  {sel.status === "Needs Selection" && (
                    <button onClick={() => toast({ title: "Opening selection form...", description: sel.category })} style={{ background: T.orange, color: "#fff", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: 500, fontFamily: "'DM Sans',sans-serif" }}>Select</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "invoices" && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Invoices & Payments</div>
            <div style={{ textAlign: "center", padding: 30, color: "#999" }}>
              <span style={{ fontSize: 32 }}>🧾</span>
              <div style={{ marginTop: 8, fontSize: 14 }}>No invoices have been issued yet.</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Your invoice will appear here once mitigation is complete and work is documented.</div>
            </div>
          </div>
        )}

        {activeTab === "faq" && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Frequently Asked Questions</div>
            {[
              { q: "How long does water damage restoration take?", a: "Drying typically takes 3-7 days depending on the extent of damage. Reconstruction timelines vary based on scope and insurance approvals." },
              { q: "Will my insurance cover this?", a: "Most homeowner policies cover sudden water damage. Our team works directly with your carrier to ensure proper documentation and maximum coverage." },
              { q: "Is it safe to stay in my home during restoration?", a: "In most cases, yes. Our team will advise you if any safety concerns arise during the process." },
              { q: "What is the drying equipment and is it loud?", a: "We use industrial dehumidifiers and air movers. They can be noisy — earplugs are recommended if equipment is near bedrooms." },
              { q: "Who is responsible for choosing replacement materials?", a: "You are! We'll guide you through selections. Your insurance policy typically covers 'like kind and quality' replacements." },
              { q: "How do I reach my project manager?", a: `Your PM is ${pm?.name}. You can reach them at ${pm?.phone} or ${pm?.email}, or use the Messages tab in this portal.` },
            ].map((faq, i) => (
              <div key={i} style={{ padding: "14px 0", borderBottom: i < 5 ? "1px solid #f0f0f0" : "none" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>{faq.q}</div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
