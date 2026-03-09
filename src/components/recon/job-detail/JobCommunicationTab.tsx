import { useState, useEffect, useRef, useCallback } from "react";
import { T } from "@/lib/recon-data";
import { ReconCard as Card, Btn, Ic } from "@/components/recon/ReconUI";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { DbJob } from "@/hooks/useJobs";

type Channel = "internal" | "homeowner" | "subcontractor";

const CHANNELS: { value: Channel; label: string; icon: string; color: string; desc: string }[] = [
  { value: "internal", label: "Internal Team", icon: "users", color: T.orange, desc: "Private team discussion about this job" },
  { value: "homeowner", label: "Homeowner", icon: "customer", color: T.greenBright, desc: "Messages with the homeowner" },
  { value: "subcontractor", label: "Subcontractor", icon: "truck", color: T.purpleBright, desc: "Messages with assigned subcontractors" },
];

interface Message {
  id: string;
  channel_type: Channel;
  sender_name: string;
  sender_avatar: string | null;
  message_text: string;
  created_at: string;
  sender_id: string;
}

export const JobCommunicationTab = ({ job }: { job: DbJob }) => {
  const [channel, setChannel] = useState<Channel>("internal");
  const { user, companyId, profile } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [msgText, setMsgText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase.from("job_messages")
      .select("*")
      .eq("job_id", job.id)
      .order("created_at", { ascending: true });
    if (!error && data) setMessages(data as Message[]);
    setLoading(false);
  }, [job.id]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Auto-scroll on new messages or channel switch
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, channel]);

  // Realtime subscription
  useEffect(() => {
    const sub = supabase.channel(`job-msgs-${job.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "job_messages", filter: `job_id=eq.${job.id}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        })
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [job.id]);

  const handleSend = async () => {
    if (!user || !msgText.trim()) return;
    setSending(true);
    const { error } = await supabase.from("job_messages").insert({
      job_id: job.id,
      channel_type: channel,
      message_text: msgText.trim(),
      sender_id: user.id,
      sender_name: profile?.name || user.email || "User",
      sender_avatar: profile?.avatar || null,
      company_id: companyId || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setMsgText("");
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const channelMessages = messages.filter(m => m.channel_type === channel);
  const channelConfig = CHANNELS.find(c => c.value === channel)!;

  const channelCounts = CHANNELS.reduce((acc, c) => {
    acc[c.value] = messages.filter(m => m.channel_type === c.value).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 380px)", minHeight: 400 }}>
      {/* Channel Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
        {CHANNELS.map(c => {
          const isActive = channel === c.value;
          return (
            <div key={c.value} onClick={() => setChannel(c.value)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, cursor: "pointer",
              background: isActive ? `${c.color}1a` : T.surfaceHigh,
              border: `1px solid ${isActive ? c.color + "55" : T.border}`, transition: "all 0.12s",
            }}>
              <Ic n={c.icon} s={14} c={isActive ? c.color : T.muted} />
              <span style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? c.color : T.muted }}>{c.label}</span>
              <span style={{ fontSize: 10, background: isActive ? c.color + "33" : T.surfaceTop, color: isActive ? c.color : T.dim, borderRadius: 10, padding: "1px 6px", fontWeight: 600 }}>
                {channelCounts[c.value] || 0}
              </span>
            </div>
          );
        })}
      </div>

      {/* Channel description */}
      <div style={{ background: `${channelConfig.color}0a`, border: `1px solid ${channelConfig.color}22`, borderRadius: 6, padding: "6px 12px", marginBottom: 12, display: "flex", gap: 6, alignItems: "center" }}>
        <Ic n={channelConfig.icon} s={13} c={channelConfig.color} />
        <span style={{ fontSize: 11, color: channelConfig.color }}>{channelConfig.desc}</span>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} style={{
        flex: 1, overflowY: "auto", padding: "12px 0", display: "flex", flexDirection: "column", gap: 8,
        minHeight: 200,
      }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading messages...</div>
        ) : channelMessages.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: T.dim }}>
            <Ic n={channelConfig.icon} s={32} c={T.dim} />
            <div style={{ fontSize: 13, marginTop: 8 }}>No messages in {channelConfig.label} yet</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>Start the conversation below</div>
          </div>
        ) : (
          channelMessages.map(msg => {
            const isMe = msg.sender_id === user?.id;
            const date = new Date(msg.created_at);
            const initials = msg.sender_name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
            return (
              <div key={msg.id} style={{ display: "flex", gap: 10, alignItems: isMe ? "flex-end" : "flex-start", flexDirection: isMe ? "row-reverse" : "row" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: isMe ? T.orange : `${channelConfig.color}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: isMe ? "#fff" : channelConfig.color,
                }}>{initials}</div>
                <div style={{ maxWidth: "70%", minWidth: 120 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 2, flexDirection: isMe ? "row-reverse" : "row" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{msg.sender_name}</span>
                    <span style={{ fontSize: 10, color: T.dim }}>
                      {date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      {" · "}
                      {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <div style={{
                    padding: "10px 14px", borderRadius: 12, fontSize: 13, lineHeight: 1.5, color: T.text,
                    background: isMe ? `${T.orange}1a` : T.surfaceHigh,
                    border: `1px solid ${isMe ? T.orange + "33" : T.border}`,
                    borderTopRightRadius: isMe ? 4 : 12,
                    borderTopLeftRadius: isMe ? 12 : 4,
                  }}>
                    {msg.message_text}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input */}
      <div style={{ display: "flex", gap: 8, padding: "12px 0 0", borderTop: `1px solid ${T.border}` }}>
        <textarea
          value={msgText}
          onChange={e => setMsgText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${channelConfig.label}...`}
          rows={1}
          style={{
            flex: 1, background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 10,
            padding: "10px 14px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif",
            outline: "none", resize: "none", minHeight: 42, maxHeight: 120,
          }}
          onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = channelConfig.color}
          onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = T.border}
        />
        <Btn v="primary" sz="md" icon="send" onClick={handleSend} disabled={sending || !msgText.trim()}>
          {sending ? "..." : "Send"}
        </Btn>
      </div>
    </div>
  );
};
