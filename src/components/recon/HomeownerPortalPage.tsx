import { useState, useEffect, useCallback } from "react";
import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Logo, Input, Modal } from "@/components/recon/ReconUI";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface PortalJob {
  id: string;
  customer: string;
  address: string;
  stage: string;
  loss_type: string;
  date_of_loss: string | null;
  pm_name: string | null;
  day_of_drying: number | null;
  created_at: string;
}

interface PortalPhoto {
  id: string;
  url: string;
  caption: string;
  photo_type: string;
  created_at: string;
}

interface PortalMessage {
  id: string;
  message_text: string;
  sender_name: string;
  created_at: string;
  sender_id: string;
}

const STAGE_LABELS: Record<string, { label: string; progress: number; color: string }> = {
  lead: { label: "Initial Consultation", progress: 5, color: T.muted },
  inspection: { label: "Inspection Scheduled", progress: 15, color: T.yellowBright },
  mitigation: { label: "Mitigation In Progress", progress: 30, color: T.orange },
  drying: { label: "Drying & Monitoring", progress: 45, color: T.blueBright },
  estimate_submitted: { label: "Estimate Review", progress: 55, color: T.purpleBright },
  supplement: { label: "Finalizing Scope", progress: 65, color: T.yellowBright },
  carrier_approval: { label: "Awaiting Approval", progress: 70, color: T.orange },
  recon_scheduled: { label: "Reconstruction Scheduled", progress: 80, color: T.tealBright },
  reconstruction: { label: "Reconstruction In Progress", progress: 90, color: T.teal },
  punch_list: { label: "Final Walkthrough", progress: 95, color: T.purpleBright },
  invoiced: { label: "Project Complete", progress: 100, color: T.greenBright },
  closed: { label: "Completed", progress: 100, color: T.greenBright },
};

export const HomeownerPortalPage = () => {
  const [tab, setTab] = useState<"progress" | "photos" | "messages" | "documents">("progress");
  const [job, setJob] = useState<PortalJob | null>(null);
  const [photos, setPhotos] = useState<PortalPhoto[]>([]);
  const [messages, setMessages] = useState<PortalMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  // For demo purposes, we'll show a portal view
  // In production, homeowners would have their own auth flow

  const fetchJobData = useCallback(async () => {
    if (!user) return;
    
    // In a real implementation, homeowners would be linked to jobs via a customer_user_id field
    // For now, we'll show the first job as a demo
    const { data: jobs } = await supabase
      .from("jobs")
      .select("id, customer, address, stage, loss_type, date_of_loss, pm_name, day_of_drying, created_at")
      .order("created_at", { ascending: false })
      .limit(1);
    
    if (jobs && jobs.length > 0) {
      setJob(jobs[0] as PortalJob);
      
      // Fetch photos
      const { data: photosData } = await supabase
        .from("job_photos")
        .select("*")
        .eq("job_id", jobs[0].id)
        .order("created_at", { ascending: false });
      if (photosData) setPhotos(photosData as PortalPhoto[]);
      
      // Fetch messages from homeowner channel
      const { data: messagesData } = await supabase
        .from("job_messages")
        .select("*")
        .eq("job_id", jobs[0].id)
        .eq("channel_type", "homeowner")
        .order("created_at", { ascending: true });
      if (messagesData) setMessages(messagesData as PortalMessage[]);
    }
    
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchJobData(); }, [fetchJobData]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !job || !user) return;
    setSending(true);
    
    const { error } = await supabase.from("job_messages").insert({
      job_id: job.id,
      channel_type: "homeowner",
      message_text: newMessage.trim(),
      sender_id: user.id,
      sender_name: user.user_metadata?.name || user.email || "Homeowner",
    } as any);
    
    if (error) {
      toast({ title: "Error sending message", description: error.message, variant: "destructive" });
    } else {
      setNewMessage("");
      fetchJobData();
    }
    setSending(false);
  };

  const stageInfo = job ? STAGE_LABELS[job.stage] || STAGE_LABELS.lead : STAGE_LABELS.lead;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Logo size={60} />
          <p style={{ color: T.muted, marginTop: 16 }}>Loading your project...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <Card style={{ maxWidth: 400, textAlign: "center", padding: 40 }}>
          <Logo size={60} />
          <h2 style={{ color: T.text, fontSize: 18, marginTop: 20, marginBottom: 8 }}>Welcome to Your Project Portal</h2>
          <p style={{ color: T.muted, fontSize: 14, marginBottom: 24 }}>No active project found. Contact your restoration company if you believe this is an error.</p>
          <Btn v="secondary" onClick={signOut}>Sign Out</Btn>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      {/* Header */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Logo size={40} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Your Restoration Project</div>
            <div style={{ fontSize: 12, color: T.muted }}>{job.address}</div>
          </div>
        </div>
        <Btn v="ghost" sz="sm" onClick={signOut}>Sign Out</Btn>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        {/* Project Status Card */}
        <Card style={{ marginBottom: 24, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Project ID: {job.id}</div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>{job.customer}</h1>
              <p style={{ color: T.muted, fontSize: 14, margin: "4px 0 0" }}>{job.address}</p>
            </div>
            <Badge color={stageInfo.color === T.greenBright ? "green" : stageInfo.color === T.orange ? "orange" : stageInfo.color === T.blueBright ? "blue" : "gray"}>
              {stageInfo.label}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: T.muted }}>Project Progress</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.orange }}>{stageInfo.progress}%</span>
            </div>
            <div style={{ height: 8, background: T.surfaceHigh, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${stageInfo.progress}%`, background: `linear-gradient(90deg, ${T.orange}, ${T.orangeLight})`, borderRadius: 4, transition: "width 0.5s ease" }} />
            </div>
          </div>

          {/* Quick Info */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
            {job.pm_name && (
              <div style={{ padding: 12, background: T.surfaceHigh, borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: T.dim, marginBottom: 4 }}>Project Manager</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{job.pm_name}</div>
              </div>
            )}
            {job.date_of_loss && (
              <div style={{ padding: 12, background: T.surfaceHigh, borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: T.dim, marginBottom: 4 }}>Date of Loss</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{new Date(job.date_of_loss).toLocaleDateString()}</div>
              </div>
            )}
            {job.day_of_drying && (
              <div style={{ padding: 12, background: T.surfaceHigh, borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: T.dim, marginBottom: 4 }}>Drying Progress</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.blueBright }}>Day {job.day_of_drying}</div>
              </div>
            )}
            <div style={{ padding: 12, background: T.surfaceHigh, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: T.dim, marginBottom: 4 }}>Loss Type</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, textTransform: "capitalize" }}>{job.loss_type}</div>
            </div>
          </div>
        </Card>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[
            { id: "progress", label: "Updates", icon: "clock" },
            { id: "photos", label: "Photos", icon: "photo" },
            { id: "messages", label: "Messages", icon: "msg" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 8, border: `1px solid ${tab === t.id ? T.orange : T.border}`, background: tab === t.id ? T.orangeDim : T.surface, color: tab === t.id ? T.orange : T.muted, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
              <Ic n={t.icon} s={14} c={tab === t.id ? T.orange : T.muted} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "progress" && (
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 16, margin: "0 0 16px" }}>Project Timeline</h3>
            <div style={{ borderLeft: `2px solid ${T.border}`, paddingLeft: 20, marginLeft: 8 }}>
              {Object.entries(STAGE_LABELS).filter(([id]) => {
                const stageOrder = Object.keys(STAGE_LABELS);
                return stageOrder.indexOf(id) <= stageOrder.indexOf(job.stage);
              }).reverse().map(([id, info], i) => {
                const isCurrent = id === job.stage;
                return (
                  <div key={id} style={{ marginBottom: 20, position: "relative" }}>
                    <div style={{ position: "absolute", left: -28, top: 4, width: 12, height: 12, borderRadius: "50%", background: isCurrent ? T.orange : T.greenBright, border: `2px solid ${T.surface}` }} />
                    <div style={{ fontSize: 14, fontWeight: isCurrent ? 600 : 400, color: isCurrent ? T.text : T.muted }}>{info.label}</div>
                    {isCurrent && <div style={{ fontSize: 12, color: T.orange, marginTop: 2 }}>Current Stage</div>}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {tab === "photos" && (
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 16, margin: "0 0 16px" }}>Project Photos</h3>
            {photos.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: T.muted }}>
                <Ic n="photo" s={40} c={T.dim} />
                <p style={{ marginTop: 12 }}>No photos have been uploaded yet.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
                {photos.map(p => (
                  <div key={p.id} style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${T.border}` }}>
                    <img src={p.url} alt={p.caption || "Project photo"} style={{ width: "100%", height: 120, objectFit: "cover" }} />
                    {p.caption && <div style={{ padding: 8, fontSize: 11, color: T.muted }}>{p.caption}</div>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {tab === "messages" && (
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 16, margin: "0 0 16px" }}>Messages</h3>
            <div style={{ maxHeight: 400, overflowY: "auto", marginBottom: 16, padding: 12, background: T.surfaceHigh, borderRadius: 8 }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: T.muted }}>
                  <Ic n="msg" s={32} c={T.dim} />
                  <p style={{ marginTop: 12 }}>No messages yet. Send a message to your project manager!</p>
                </div>
              ) : (
                messages.map(m => {
                  const isOwn = m.sender_id === user?.id;
                  return (
                    <div key={m.id} style={{ marginBottom: 12, display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start" }}>
                      <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 12, background: isOwn ? T.orange : T.surface, border: isOwn ? "none" : `1px solid ${T.border}` }}>
                        <div style={{ fontSize: 13, color: isOwn ? "#fff" : T.text }}>{m.message_text}</div>
                      </div>
                      <div style={{ fontSize: 10, color: T.dim, marginTop: 4 }}>
                        {m.sender_name} • {new Date(m.created_at).toLocaleString()}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Input placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
              </div>
              <Btn v="primary" onClick={sendMessage} disabled={sending || !newMessage.trim()}>
                {sending ? "..." : "Send"}
              </Btn>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
