import { useState, useRef, useEffect } from "react";
import { T, ROLES } from "@/lib/recon-data";
import { useTeamMembers, useJobs } from "@/hooks/useJobs";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status?: string;
  profilePic?: string;
}
import { ReconCard as Card, Btn, Ic, Inp } from "@/components/recon/ReconUI";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/recon/ReconUI";

// ── TYPES ──
interface Message {
  id: string;
  sender: string;
  senderId: string;
  avatar: string;
  profilePic?: string;
  text: string;
  time: string;
  date: string;
  mentions?: string[];
  attachments?: { name: string; type: string }[];
  reactions?: { emoji: string; users: string[] }[];
}

interface Channel {
  id: string;
  name: string;
  type: "dm" | "group" | "job";
  participants: string[];
  lastMessage: string;
  lastTime: string;
  unread: number;
  jobId?: string;
  icon?: string;
}

// ── USER AVATAR COMPONENT ──
const UserAvatar = ({ member, size = 36 }: { member?: TeamMember; size?: number }) => {
  if (!member) return <div style={{ width: size, height: size, borderRadius: "50%", background: T.surfaceTop, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.32, fontWeight: 700, color: T.dim }}>?</div>;
  
  if (member.profilePic) {
    return <img src={member.profilePic} alt={member.name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: `2px solid ${T.border}` }}/>;
  }
  
  const roleColors: Record<string, string> = { owner: T.orange, project_manager: T.blueBright, estimator: T.purpleBright, office_admin: T.tealBright, field_tech: T.greenBright, subcontractor: T.muted };
  const gradient = roleColors[member.role] || T.orange;
  const initials = member.avatar || member.name?.split(" ").map(w => w[0]).join("") || "?";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${gradient}, ${gradient}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.32, color: "#fff", flexShrink: 0, border: `2px solid ${gradient}44` }}>
      {initials}
    </div>
  );
};

// ── MAIN MESSAGING PAGE ──
export const MessagingPage = ({ role }: { role: string }) => {
  const [activeChannel, setActiveChannel] = useState<string>("");
  const [messageText, setMessageText] = useState("");
  const [channelFilter, setChannelFilter] = useState<"all" | "dm" | "group" | "job">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>({});
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { members } = useTeamMembers();
  const { jobs } = useJobs();

  const currentUser = members.find((m: any) => m.role === role) || members[0] || { id: "unknown", name: "You", role, avatar: "?" };

  // Build channels from team members and jobs
  const channels: Channel[] = [
    ...members.filter((m: any) => m.id !== currentUser.id).slice(0, 5).map((m: any, i: number) => ({
      id: `dm-${m.id}`,
      name: m.name,
      type: "dm" as const,
      participants: [currentUser.id, m.id],
      lastMessage: "",
      lastTime: "",
      unread: 0,
    })),
    ...jobs.slice(0, 5).map(j => ({
      id: `job-${j.id}`,
      name: `${j.id} · ${j.customer}`,
      type: "job" as const,
      participants: [],
      lastMessage: "",
      lastTime: "",
      unread: 0,
      jobId: j.id,
      icon: undefined,
    })),
  ];

  if (channels.length > 0 && !activeChannel) {
    // Set first channel as active on mount
    setTimeout(() => setActiveChannel(channels[0]?.id || ""), 0);
  }

  const channel = channels.find(c => c.id === activeChannel);
  const messages = localMessages[activeChannel] || [];

  // Load persisted messages from DB
  useEffect(() => {
    if (!activeChannel) return;
    const loadMessages = async () => {
      const { data } = await (supabase as any)
        .from("messages")
        .select("*")
        .eq("channel_id", activeChannel)
        .order("created_at", { ascending: true });
      if (data && data.length > 0) {
        const dbMsgs: Message[] = data.map((m: any) => ({
          id: m.id,
          sender: m.sender_name,
          senderId: m.sender_id,
          avatar: m.sender_name?.split(" ").map((w: string) => w[0]).join("") || "?",
          text: m.text,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
          date: new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          mentions: m.mentions || undefined,
        }));
        setLocalMessages(prev => ({ ...prev, [activeChannel]: dbMsgs }));
      }
    };
    loadMessages();
  }, [activeChannel]);

  // Realtime subscription
  useEffect(() => {
    if (!activeChannel) return;
    const ch = supabase
      .channel(`messages-${activeChannel}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `channel_id=eq.${activeChannel}`,
      }, (payload: any) => {
        const m = payload.new;
        const newMsg: Message = {
          id: m.id,
          sender: m.sender_name,
          senderId: m.sender_id,
          avatar: m.sender_name?.split(" ").map((w: string) => w[0]).join("") || "?",
          text: m.text,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
          date: new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          mentions: m.mentions || undefined,
        };
        setLocalMessages(prev => {
          const existing = prev[activeChannel] || [];
          if (existing.some(e => e.id === newMsg.id)) return prev;
          return { ...prev, [activeChannel]: [...existing, newMsg] };
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, [activeChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages[activeChannel]?.length, activeChannel]);

  const handleSend = async () => {
    if (!messageText.trim()) return;
    const mentions = messageText.match(/@([\w\s]+?)(?=\s|$|[.,!?])/g)?.map(m => m.slice(1).trim()) || [];
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: currentUser.name,
      senderId: currentUser.id,
      avatar: currentUser.name?.split(" ").map((w: string) => w[0]).join("") || "?",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      mentions: mentions.length > 0 ? mentions : undefined,
    };
    setLocalMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg],
    }));
    
    const msgText = messageText;
    setMessageText("");
    setShowMentionDropdown(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await (supabase as any).from("messages").insert({
        channel_id: activeChannel,
        sender_id: user.id,
        sender_name: currentUser.name,
        text: msgText,
        mentions: mentions.length > 0 ? mentions : [],
      } as any);
    }
  };

  const handleInputChange = (val: string) => {
    setMessageText(val);
    const lastAt = val.lastIndexOf("@");
    if (lastAt !== -1 && lastAt === val.length - 1 || (lastAt !== -1 && !val.slice(lastAt).includes(" "))) {
      setShowMentionDropdown(true);
      setMentionFilter(val.slice(lastAt + 1));
    } else {
      setShowMentionDropdown(false);
    }
  };

  const insertMention = (name: string) => {
    const lastAt = messageText.lastIndexOf("@");
    const newText = messageText.slice(0, lastAt) + `@${name} `;
    setMessageText(newText);
    setShowMentionDropdown(false);
    inputRef.current?.focus();
  };

  const filteredChannels = channels.filter(c => {
    if (channelFilter !== "all" && c.type !== channelFilter) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getParticipantMembers = (ch: Channel) => 
    ch.participants.map(pid => members.find((m: any) => m.id === pid)).filter(Boolean) as TeamMember[];

  const parseMessageText = (text: string) => {
    const parts = text.split(/(@[\w\s]+?)(?=\s|$|[.,!?])/g);
    return parts.map((part, i) => {
      if (part.startsWith("@")) {
        const name = part.slice(1).trim();
        const member = members.find((m: any) => m.name.includes(name));
        if (member) {
          return <span key={i} style={{ background: T.orangeDim, color: T.orange, padding: "1px 5px", borderRadius: 4, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>{part}</span>;
        }
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 56px)", overflow: "hidden" }}>
      {/* ── CHANNEL LIST ── */}
      <div style={{ width: 300, minWidth: 300, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", background: T.surface }}>
        <div style={{ padding: "16px 14px 10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: T.white, margin: 0 }}>Messages</h2>
            <Btn v="primary" sz="sm" icon="plus" onClick={() => setShowNewChat(true)}>New</Btn>
          </div>
          <div style={{ position: "relative", marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: "100%", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "8px 12px 8px 32px", color: T.text, fontSize: 12, fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box" }}
            />
            <Ic n="search" s={14} c={T.dim}/>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
            {(["all", "dm", "group", "job"] as const).map(f => (
              <div key={f} onClick={() => setChannelFilter(f)} style={{ padding: "4px 10px", borderRadius: 14, fontSize: 11, cursor: "pointer", fontWeight: channelFilter === f ? 600 : 400, background: channelFilter === f ? T.orangeDim : "transparent", color: channelFilter === f ? T.orange : T.muted, border: `1px solid ${channelFilter === f ? T.orange + "44" : "transparent"}`, textTransform: "capitalize" }}>
                {f === "dm" ? "Direct" : f === "all" ? "All" : f === "job" ? "Jobs" : "Groups"}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 6px" }}>
          {filteredChannels.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: T.dim, fontSize: 12 }}>No conversations yet</div>
          ) : filteredChannels.map(ch => {
            const isActive = ch.id === activeChannel;
            const dmMember = ch.type === "dm" ? members.find((m: any) => m.name === ch.name) : null;
            return (
              <div key={ch.id} onClick={() => setActiveChannel(ch.id)} style={{ display: "flex", gap: 10, padding: "10px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 2, background: isActive ? T.orangeDim : "transparent", border: `1px solid ${isActive ? T.orange + "33" : "transparent"}`, transition: "all 0.12s" }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = T.surfaceHigh; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
              >
                {ch.type === "dm" && dmMember ? (
                  <UserAvatar member={dmMember} size={36}/>
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: ch.type === "group" ? 10 : "50%", background: ch.type === "job" ? T.orangeDim : T.surfaceTop, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${ch.type === "job" ? T.orange + "44" : T.border}` }}>
                    <Ic n={ch.type === "job" ? "jobs" : "msg"} s={14} c={ch.type === "job" ? T.orange : T.muted}/>
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, color: isActive ? T.orange : T.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ch.name}</span>
                    {ch.lastTime && <span style={{ fontSize: 10, color: T.dim, flexShrink: 0 }}>{ch.lastTime}</span>}
                  </div>
                  {ch.lastMessage && (
                    <span style={{ fontSize: 11, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{ch.lastMessage}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MESSAGE AREA ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg }}>
        {channel ? (
          <>
            <div style={{ padding: "12px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: T.surface }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {channel.type === "job" && <span style={{ fontSize: 18 }}>{channel.icon}</span>}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.white }}>{channel.name}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>
                    {channel.type === "dm" ? "Direct message" : channel.type === "job" ? "Job channel" : `${getParticipantMembers(channel).length} members`}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn v="secondary" sz="sm" icon="search">Search</Btn>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: 60, color: T.muted }}>
                  <Ic n="note" s={32} c={T.dim}/>
                  <div style={{ marginTop: 12, fontSize: 14, fontWeight: 500 }}>No messages yet</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Start the conversation</div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => {
                    const isOwn = msg.senderId === currentUser.id;
                    const showAvatar = i === 0 || messages[i - 1].senderId !== msg.senderId;
                    const showDate = i === 0 || messages[i - 1].date !== msg.date;
                    const member = members.find((m: any) => m.id === msg.senderId);

                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0", opacity: 0.6 }}>
                            <div style={{ flex: 1, height: 1, background: T.border }}/>
                            <span style={{ fontSize: 11, color: T.dim, fontWeight: 500 }}>{msg.date}</span>
                            <div style={{ flex: 1, height: 1, background: T.border }}/>
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 10, marginBottom: showAvatar ? 12 : 3, paddingLeft: showAvatar ? 0 : 46 }}>
                          {showAvatar && <UserAvatar member={member} size={36}/>}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {showAvatar && (
                              <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 3 }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: isOwn ? T.orange : T.white }}>{msg.sender}</span>
                                <span style={{ fontSize: 10, color: T.dim }}>{msg.time}</span>
                              </div>
                            )}
                            <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6, wordBreak: "break-word" }}>
                              {parseMessageText(msg.text)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef}/>
                </>
              )}
            </div>

            <div style={{ padding: "12px 20px", borderTop: `1px solid ${T.border}`, background: T.surface, position: "relative" }}>
              {showMentionDropdown && (
                <div style={{ position: "absolute", bottom: "100%", left: 20, right: 20, background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, padding: 4, maxHeight: 200, overflowY: "auto", boxShadow: "0 -4px 20px rgba(0,0,0,0.3)" }}>
                  {members.filter((m: any) => m.name.toLowerCase().includes(mentionFilter.toLowerCase())).map((m: any) => (
                    <div key={m.id} onClick={() => insertMention(m.name)} style={{ display: "flex", gap: 8, alignItems: "center", padding: "7px 10px", borderRadius: 6, cursor: "pointer" }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = T.surfaceTop}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                    >
                      <UserAvatar member={m} size={24}/>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: T.white }}>{m.name}</div>
                        <div style={{ fontSize: 10, color: T.muted }}>{ROLES[m.role]?.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={`Message ${channel.name}... (type @ to mention)`}
                  value={messageText}
                  onChange={e => handleInputChange(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  style={{ flex: 1, background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none" }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = T.orange}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = T.border}
                />
                <Btn v="primary" sz="sm" onClick={handleSend} disabled={!messageText.trim()}>Send</Btn>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: T.muted }}>
            <div style={{ textAlign: "center" }}>
              <Ic n="note" s={48} c={T.dim}/>
              <div style={{ marginTop: 16, fontSize: 16, fontWeight: 600 }}>Select a conversation</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Choose from your messages or start a new conversation</div>
            </div>
          </div>
        )}
      </div>

      {/* ── NEW CHAT MODAL ── */}
      {showNewChat && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }} onClick={() => setShowNewChat(false)}>
          <div onClick={e => e.stopPropagation()}>
          <Card style={{ width: 420, maxHeight: "80vh", overflowY: "auto", background: T.surface }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.white }}>New Conversation</h3>
              <button onClick={() => setShowNewChat(false)} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted }}><Ic n="x" s={18}/></button>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.dim, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Team Members</div>
              {members.filter((m: any) => m.id !== currentUser.id).map((m: any) => (
                <div key={m.id} onClick={() => { setShowNewChat(false); const existing = channels.find(c => c.type === "dm" && c.name === m.name); if (existing) setActiveChannel(existing.id); }} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", borderRadius: 7, cursor: "pointer", marginBottom: 4 }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = T.surfaceHigh}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                >
                  <UserAvatar member={m} size={32}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.white }}>{m.name}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{ROLES[m.role]?.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.dim, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Job Channels</div>
              {jobs.filter(j => !["paid"].includes(j.stage)).map(j => (
                <div key={j.id} onClick={() => { setShowNewChat(false); const existing = channels.find(c => c.jobId === j.id); if (existing) setActiveChannel(existing.id); }} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", borderRadius: 7, cursor: "pointer", marginBottom: 4 }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = T.surfaceHigh}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                >
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: T.orange, fontWeight: 700, width: 48 }}>{j.id}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.white }}>{j.customer}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{j.loss_subtype || j.loss_type}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export { UserAvatar };
