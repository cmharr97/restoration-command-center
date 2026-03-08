import { useState, useRef, useEffect } from "react";
import { T, ROLES } from "@/lib/recon-data";
import { useTeamMembers, useJobs } from "@/hooks/useJobs";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
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

// ── MOCK DATA ──
const CHANNELS: Channel[] = [
  { id: "dm-1", name: "Destiny Kim", type: "dm", participants: ["u1", "u2"], lastMessage: "Adjuster walkthrough at 2pm confirmed", lastTime: "11:42 AM", unread: 2 },
  { id: "dm-2", name: "Marcus Webb", type: "dm", participants: ["u1", "u5"], lastMessage: "Subfloor readings still high in laundry", lastTime: "10:15 AM", unread: 1 },
  { id: "dm-3", name: "Tyler Nguyen", type: "dm", participants: ["u1", "u3"], lastMessage: "Xactimate estimate ready for review", lastTime: "9:30 AM", unread: 0 },
  { id: "dm-4", name: "Carlos Rivera", type: "dm", participants: ["u1", "u6"], lastMessage: "En route to Martinez job site", lastTime: "8:02 AM", unread: 0 },
  { id: "grp-1", name: "Project Managers", type: "group", participants: ["u1", "u2", "u3"], lastMessage: "Destiny: Schedule update for next week?", lastTime: "11:00 AM", unread: 3, icon: "👥" },
  { id: "grp-2", name: "Field Crew Alpha", type: "group", participants: ["u2", "u5", "u6", "u7"], lastMessage: "Marcus: Equipment loaded for Highland Park", lastTime: "7:45 AM", unread: 0, icon: "🔧" },
  { id: "grp-3", name: "Office Team", type: "group", participants: ["u1", "u2", "u3", "u4"], lastMessage: "Sarah: Invoice batch sent to carriers", lastTime: "Yesterday", unread: 0, icon: "🏢" },
  { id: "grp-4", name: "All Hands", type: "group", participants: ["u1", "u2", "u3", "u4", "u5", "u6", "u7", "u8"], lastMessage: "John: Team meeting Monday 8am", lastTime: "Mar 7", unread: 0, icon: "📢" },
  { id: "job-1051", name: "J-1051 · Martinez Water", type: "job", participants: ["u2", "u5", "u6"], lastMessage: "Marcus: Day 5 readings logged. Subfloor concern.", lastTime: "10:20 AM", unread: 1, jobId: "J-1051", icon: "💧" },
  { id: "job-1050", name: "J-1050 · Sunrise Fire Recon", type: "job", participants: ["u2", "u7"], lastMessage: "Destiny: Cabinet template scheduled for Tuesday", lastTime: "Yesterday", unread: 0, jobId: "J-1050", icon: "🔥" },
  { id: "job-1046", name: "J-1046 · Highland Park Cat 3", type: "job", participants: ["u2", "u7", "u8"], lastMessage: "Aisha: Mobilizing at 7:30 tomorrow", lastTime: "Mar 7", unread: 0, jobId: "J-1046", icon: "⚠️" },
  { id: "job-1049", name: "J-1049 · Chen Mold", type: "job", participants: ["u3"], lastMessage: "Tyler: Waiting on Farmers estimate review", lastTime: "Mar 6", unread: 0, jobId: "J-1049", icon: "🦠" },
];

const MESSAGES: Record<string, Message[]> = {
  "dm-1": [
    { id: "m1", sender: "Destiny Kim", senderId: "u2", avatar: "DK", text: "Hey John, the Martinez job is on Day 5 of drying. Marcus says subfloor in laundry is still elevated. We may need to demo to expose and dry properly.", time: "9:15 AM", date: "Mar 8" },
    { id: "m2", sender: "John Davis", senderId: "u1", avatar: "JD", text: "Got it. What's the reading on the subfloor right now?", time: "9:22 AM", date: "Mar 8" },
    { id: "m3", sender: "Destiny Kim", senderId: "u2", avatar: "DK", text: "20% — dry standard is 19%. It's been dropping but slowly. If we demo tomorrow, we could have dry standard by Monday.", time: "9:28 AM", date: "Mar 8" },
    { id: "m4", sender: "John Davis", senderId: "u1", avatar: "JD", text: "Let's go ahead with demo. Make sure to get pre-demo photos and document everything for the supplement. @Tyler Nguyen will need to add that to the Xactimate.", time: "9:35 AM", date: "Mar 8", mentions: ["Tyler Nguyen"] },
    { id: "m5", sender: "Destiny Kim", senderId: "u2", avatar: "DK", text: "Will do. I'll also notify the adjuster Tom Hendricks. He's been responsive on this one.", time: "9:40 AM", date: "Mar 8" },
    { id: "m6", sender: "John Davis", senderId: "u1", avatar: "JD", text: "Perfect. Also confirmed — adjuster walkthrough for Sunrise is at 2pm today. Can you make that?", time: "11:30 AM", date: "Mar 8" },
    { id: "m7", sender: "Destiny Kim", senderId: "u2", avatar: "DK", text: "Adjuster walkthrough at 2pm confirmed ✅", time: "11:42 AM", date: "Mar 8" },
  ],
  "dm-2": [
    { id: "m10", sender: "Marcus Webb", senderId: "u5", avatar: "MW", text: "Morning. Day 5 readings are in. Kitchen drywall at 16%, hardwood at 14%. Getting close.", time: "8:45 AM", date: "Mar 8" },
    { id: "m11", sender: "John Davis", senderId: "u1", avatar: "JD", text: "Good progress on those. What about the laundry subfloor?", time: "9:00 AM", date: "Mar 8" },
    { id: "m12", sender: "Marcus Webb", senderId: "u5", avatar: "MW", text: "Subfloor readings still high in laundry. 20% vs. 19% dry standard. Might need demo. @Destiny Kim wants to discuss", time: "10:15 AM", date: "Mar 8", mentions: ["Destiny Kim"] },
  ],
  "grp-1": [
    { id: "g1", sender: "John Davis", senderId: "u1", avatar: "JD", text: "Good morning team. Quick updates — what's the status on each active job?", time: "8:00 AM", date: "Mar 8" },
    { id: "g2", sender: "Destiny Kim", senderId: "u2", avatar: "DK", text: "Martinez (J-1051): Day 5, close to dry standard except laundry subfloor. Highland Park (J-1046): Mobilizing today for Cat 3 sewer backup. Sunrise (J-1050): Recon phase, adjuster walkthrough at 2pm.", time: "8:15 AM", date: "Mar 8" },
    { id: "g3", sender: "Tyler Nguyen", senderId: "u3", avatar: "TN", text: "Chen (J-1049): Mold estimate submitted to Farmers. Waiting on adjuster Bill Torres. Rodriguez (J-1047): Assessment scheduled for this afternoon.", time: "8:22 AM", date: "Mar 8" },
    { id: "g4", sender: "Destiny Kim", senderId: "u2", avatar: "DK", text: "Schedule update for next week? I want to make sure we have crew coverage for both Highland Park and potential Martinez demo.", time: "11:00 AM", date: "Mar 8" },
  ],
  "job-1051": [
    { id: "j1", sender: "Destiny Kim", senderId: "u2", avatar: "DK", text: "Job created — Water damage Cat 2 from washing machine supply line failure. Mobilizing Marcus and Carlos.", time: "2:15 PM", date: "Mar 2" },
    { id: "j2", sender: "Marcus Webb", senderId: "u5", avatar: "MW", text: "On site. Standing water in kitchen and laundry. Beginning extraction. Cat 2 source confirmed.", time: "3:30 PM", date: "Mar 2" },
    { id: "j3", sender: "Marcus Webb", senderId: "u5", avatar: "MW", text: "Equipment placed: 2x LGR 3500i, 8x F203 air movers, 1x HEPA 500. Photos uploaded to CompanyCam.", time: "5:00 PM", date: "Mar 2", attachments: [{ name: "initial_setup_photos.zip", type: "photos" }] },
    { id: "j4", sender: "Carlos Rivera", senderId: "u6", avatar: "CR", text: "Day 2 readings logged. Drying progressing well. Added 2nd HEPA due to odor. Noticed hardwood cupping in kitchen — documenting.", time: "10:30 AM", date: "Mar 3" },
    { id: "j5", sender: "Destiny Kim", senderId: "u2", avatar: "DK", text: "Notified adjuster Tom Hendricks about hardwood cupping. May need replacement. @Tyler Nguyen please include in Xactimate scope.", time: "11:00 AM", date: "Mar 3", mentions: ["Tyler Nguyen"] },
    { id: "j6", sender: "Tyler Nguyen", senderId: "u3", avatar: "TN", text: "Xactimate estimate submitted. Included hardwood replacement line items based on field assessment.", time: "4:00 PM", date: "Mar 4" },
    { id: "j7", sender: "Marcus Webb", senderId: "u5", avatar: "MW", text: "Day 3: Hall drywall hit dry standard ✅. Removed 2 air movers from hall. Kitchen and laundry still elevated.", time: "9:45 AM", date: "Mar 4" },
    { id: "j8", sender: "Marcus Webb", senderId: "u5", avatar: "MW", text: "Day 5 readings logged. Kitchen drywall 16%, hardwood 14%. Subfloor in laundry at 20% — still above 19% standard. May need demo.", time: "10:00 AM", date: "Mar 6" },
    { id: "j9", sender: "Destiny Kim", senderId: "u2", avatar: "DK", text: "Discussed with @John Davis — approved for laundry subfloor demo tomorrow. Will get pre-demo photos and update Xactimate supplement.", time: "10:30 AM", date: "Mar 8", mentions: ["John Davis"] },
    { id: "j10", sender: "Marcus Webb", senderId: "u5", avatar: "MW", text: "Marcus: Day 5 readings logged. Subfloor concern.", time: "10:20 AM", date: "Mar 8" },
  ],
};

// ── USER AVATAR COMPONENT ──
const UserAvatar = ({ member, size = 36 }: { member?: TeamMember; size?: number }) => {
  if (!member) return <div style={{ width: size, height: size, borderRadius: "50%", background: T.surfaceTop, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.32, fontWeight: 700, color: T.dim }}>?</div>;
  
  if (member.profilePic) {
    return <img src={member.profilePic} alt={member.name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: `2px solid ${T.border}` }}/>;
  }
  
  const roleColors: Record<string, string> = { owner: T.orange, project_manager: T.blueBright, estimator: T.purpleBright, office_admin: T.tealBright, field_tech: T.greenBright, subcontractor: T.muted };
  const gradient = roleColors[member.role] || T.orange;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${gradient}, ${gradient}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.32, color: "#fff", flexShrink: 0, border: `2px solid ${gradient}44` }}>
      {member.avatar}
    </div>
  );
};

// ── MENTION PARSER ──
const parseMessageText = (text: string) => {
  const parts = text.split(/(@[\w\s]+?)(?=\s|$|[.,!?])/g);
  return parts.map((part, i) => {
    if (part.startsWith("@")) {
      const name = part.slice(1).trim();
      const member = TEAM_MEMBERS.find(m => m.name.includes(name));
      if (member) {
        return <span key={i} style={{ background: T.orangeDim, color: T.orange, padding: "1px 5px", borderRadius: 4, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>{part}</span>;
      }
    }
    return <span key={i}>{part}</span>;
  });
};

// ── MAIN MESSAGING PAGE ──
export const MessagingPage = ({ role }: { role: string }) => {
  const [activeChannel, setActiveChannel] = useState<string>("dm-1");
  const [messageText, setMessageText] = useState("");
  const [channelFilter, setChannelFilter] = useState<"all" | "dm" | "group" | "job">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>(MESSAGES);
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUser = TEAM_MEMBERS.find(m => m.role === role) || TEAM_MEMBERS[0];
  const channel = CHANNELS.find(c => c.id === activeChannel);
  const messages = localMessages[activeChannel] || [];

  // Load persisted messages from DB and subscribe to realtime
  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await supabase
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
        setLocalMessages(prev => ({
          ...prev,
          [activeChannel]: [...(MESSAGES[activeChannel] || []), ...dbMsgs],
        }));
      }
    };
    loadMessages();
  }, [activeChannel]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
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

    return () => { supabase.removeChannel(channel); };
  }, [activeChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages[activeChannel]?.length, activeChannel]);

  const handleSend = async () => {
    if (!messageText.trim()) return;
    const mentions = messageText.match(/@([\w\s]+?)(?=\s|$|[.,!?])/g)?.map(m => m.slice(1).trim()) || [];
    
    // Add to local state immediately for instant feedback
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: currentUser.name,
      senderId: currentUser.id,
      avatar: currentUser.avatar,
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      date: "Mar 8",
      mentions: mentions.length > 0 ? mentions : undefined,
    };
    setLocalMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg],
    }));
    
    const msgText = messageText;
    setMessageText("");
    setShowMentionDropdown(false);

    // Also persist to database
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("messages").insert({
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

  const filteredChannels = CHANNELS.filter(c => {
    if (channelFilter !== "all" && c.type !== channelFilter) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getParticipantMembers = (ch: Channel) => 
    ch.participants.map(pid => TEAM_MEMBERS.find(m => m.id === pid)).filter(Boolean) as TeamMember[];

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
          {filteredChannels.map(ch => {
            const isActive = ch.id === activeChannel;
            const dmMember = ch.type === "dm" ? TEAM_MEMBERS.find(m => m.name === ch.name) : null;
            return (
              <div key={ch.id} onClick={() => setActiveChannel(ch.id)} style={{ display: "flex", gap: 10, padding: "10px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 2, background: isActive ? T.orangeDim : "transparent", border: `1px solid ${isActive ? T.orange + "33" : "transparent"}`, transition: "all 0.12s" }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = T.surfaceHigh; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
              >
                {ch.type === "dm" && dmMember ? (
                  <div style={{ position: "relative" }}>
                    <UserAvatar member={dmMember} size={36}/>
                    <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: dmMember.status === "on_site" || dmMember.status === "office" ? T.greenBright : dmMember.status === "driving" ? T.yellowBright : T.dim, border: `2px solid ${isActive ? T.surface : T.surface}` }}/>
                  </div>
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: ch.type === "group" ? 10 : "50%", background: ch.type === "job" ? T.orangeDim : T.surfaceTop, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, border: `1px solid ${ch.type === "job" ? T.orange + "44" : T.border}` }}>
                    {ch.icon || "💬"}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: isActive || ch.unread > 0 ? 600 : 500, color: isActive ? T.orange : T.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ch.name}</span>
                    <span style={{ fontSize: 10, color: T.dim, flexShrink: 0 }}>{ch.lastTime}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: ch.unread > 0 ? T.text : T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{ch.lastMessage}</span>
                    {ch.unread > 0 && <span style={{ background: T.orange, color: "#fff", borderRadius: 10, fontSize: 9, fontWeight: 700, padding: "1px 6px", marginLeft: 6, flexShrink: 0 }}>{ch.unread}</span>}
                  </div>
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
            {/* Header */}
            <div style={{ padding: "12px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: T.surface }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {channel.type === "job" && <span style={{ fontSize: 18 }}>{channel.icon}</span>}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.white }}>{channel.name}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>
                    {channel.type === "dm" ? "Direct message" : `${getParticipantMembers(channel).length} members`}
                    {channel.jobId && ` · ${JOBS.find(j => j.id === channel.jobId)?.address.split(",")[0] || ""}`}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {channel.type !== "dm" && (
                  <div style={{ display: "flex", marginRight: 6 }}>
                    {getParticipantMembers(channel).slice(0, 4).map((m, i) => (
                      <div key={m.id} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 4 - i }}>
                        <UserAvatar member={m} size={26}/>
                      </div>
                    ))}
                    {getParticipantMembers(channel).length > 4 && <div style={{ width: 26, height: 26, borderRadius: "50%", background: T.surfaceTop, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: T.muted, fontWeight: 600, marginLeft: -8, zIndex: 0, border: `2px solid ${T.surface}` }}>+{getParticipantMembers(channel).length - 4}</div>}
                  </div>
                )}
                <Btn v="secondary" sz="sm" icon="search">Search</Btn>
                <Btn v="secondary" sz="sm" icon="users">Members</Btn>
              </div>
            </div>

            {/* Messages */}
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
                    const member = TEAM_MEMBERS.find(m => m.id === msg.senderId);

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
                                {member && <Badge color={member.role === "owner" ? "orange" : member.role === "project_manager" ? "blue" : member.role === "field_tech" ? "green" : "gray"} small>{ROLES[member.role]?.label.split(" ")[0] || member.role}</Badge>}
                                <span style={{ fontSize: 10, color: T.dim }}>{msg.time}</span>
                              </div>
                            )}
                            <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6, wordBreak: "break-word" }}>
                              {parseMessageText(msg.text)}
                            </div>
                            {msg.attachments && (
                              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                                {msg.attachments.map((a, ai) => (
                                  <div key={ai} style={{ display: "flex", gap: 6, alignItems: "center", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}>
                                    <Ic n={a.type === "photos" ? "photo" : "note"} s={14} c={T.blueBright}/>
                                    <span style={{ fontSize: 11, color: T.blueBright }}>{a.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef}/>
                </>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${T.border}`, background: T.surface, position: "relative" }}>
              {showMentionDropdown && (
                <div style={{ position: "absolute", bottom: "100%", left: 20, right: 20, background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, padding: 4, maxHeight: 200, overflowY: "auto", boxShadow: "0 -4px 20px rgba(0,0,0,0.3)" }}>
                  {TEAM_MEMBERS.filter(m => m.name.toLowerCase().includes(mentionFilter.toLowerCase())).map(m => (
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
                <Btn v="secondary" sz="sm" icon="plus" style={{ borderRadius: "50%", padding: 8 }}/>
                <Btn v="secondary" sz="sm" icon="photo" style={{ borderRadius: "50%", padding: 8 }}/>
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
              <div style={{ fontSize: 11, fontWeight: 600, color: T.dim, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Direct Message</div>
              {TEAM_MEMBERS.filter(m => m.id !== currentUser.id).map(m => (
                <div key={m.id} onClick={() => { setShowNewChat(false); const existing = CHANNELS.find(c => c.type === "dm" && c.name === m.name); if (existing) setActiveChannel(existing.id); }} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", borderRadius: 7, cursor: "pointer", marginBottom: 4 }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = T.surfaceHigh}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                >
                  <UserAvatar member={m} size={32}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.white }}>{m.name}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{ROLES[m.role]?.label}</div>
                  </div>
                  <Badge color={m.status === "on_site" ? "green" : m.status === "office" ? "blue" : m.status === "driving" ? "yellow" : "gray"} small>{m.status.replace("_", " ")}</Badge>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.dim, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Job Channels</div>
              {JOBS.filter(j => !["paid"].includes(j.stage)).map(j => (
                <div key={j.id} onClick={() => { setShowNewChat(false); const existing = CHANNELS.find(c => c.jobId === j.id); if (existing) setActiveChannel(existing.id); }} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", borderRadius: 7, cursor: "pointer", marginBottom: 4 }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = T.surfaceHigh}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                >
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: T.orange, fontWeight: 700, width: 48 }}>{j.id}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.white }}>{j.customer}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{j.lossSubtype}</div>
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
