import { useState, useRef, useEffect } from "react";
import { T } from "@/lib/recon-data";
import { Btn, Ic, ReconCard as Card } from "@/components/recon/ReconUI";
import { useJobs, type DbJob } from "@/hooks/useJobs";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;

const QUICK_ACTIONS = [
  { label: "Summarize Jobs", action: "summarize", prompt: "Summarize all active jobs and their current status", icon: "est" },
  { label: "Adjuster Email", action: "draft_email", prompt: "Draft a professional email to an insurance adjuster requesting supplement approval", icon: "send" },
  { label: "F9 Notes", action: "f9_notes", prompt: "Help me write F9 notes for an Xactimate estimate. I'll provide the room and scope details.", icon: "note" },
  { label: "Supplement Justification", action: "supplement", prompt: "Help me build a supplement justification for denied or missing line items", icon: "dollar" },
  { label: "Scope Notes", action: "scope_notes", prompt: "Help me write scope explanation notes for this restoration project", icon: "est" },
  { label: "Change Order", action: "change_order", prompt: "Draft a change order explanation for additional discovered damage", icon: "edit" },
  { label: "Daily Update", action: "daily_update", prompt: "Help me write today's daily field update report", icon: "chart" },
  { label: "Carrier Rebuttal", action: "rebuttal", prompt: "Help me write a rebuttal to a carrier denial", icon: "shield" },
];

export const AIAssistant = ({ onClose, jobContext }: { onClose: () => void; jobContext?: DbJob }) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<DbJob | null>(jobContext || null);
  const [showJobPicker, setShowJobPicker] = useState(false);
  const { jobs } = useJobs();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamChat = async (userMessages: Msg[], action?: string) => {
    const jobData = selectedJob
      ? [selectedJob]
      : jobs.filter(j => !["closed"].includes(j.stage));

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages, action, jobData }),
    });

    if (!resp.ok || !resp.body) {
      if (resp.status === 429) throw new Error("Rate limited — please wait a moment and try again.");
      if (resp.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
      throw new Error("AI service unavailable");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantSoFar = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantSoFar += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
              }
              return [...prev, { role: "assistant", content: assistantSoFar }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const send = async (text: string, action?: string) => {
    const userMsg: Msg = { role: "user", content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setIsLoading(true);
    try {
      await streamChat(newMsgs, action);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `❌ ${e.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{
      position: "fixed", right: 20, bottom: 20, width: 480, height: 660,
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16,
      display: "flex", flexDirection: "column", zIndex: 1000,
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    }}>
      {/* Header */}
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${T.orange}, #c84009)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic n="edit" s={16} c="#fff"/></div>
          <div>
            <div style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>ReCon AI Writer</div>
            <div style={{ fontSize: 10, color: T.greenBright }}>● Restoration Writing Assistant</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {messages.length > 0 && (
            <button onClick={() => setMessages([])} title="New conversation" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 4 }}>
              <Ic n="plus" s={16} />
            </button>
          )}
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 4 }}>
            <Ic n="x" s={18} />
          </button>
        </div>
      </div>

      {/* Job Context Selector */}
      <div style={{ padding: "8px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
        <Ic n="jobs" s={12} c={T.muted} />
        <span style={{ color: T.dim }}>Context:</span>
        <button onClick={() => setShowJobPicker(!showJobPicker)}
          style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 6, padding: "3px 10px", color: selectedJob ? T.orange : T.muted, cursor: "pointer", fontSize: 12, fontFamily: "'Inter',sans-serif" }}>
          {selectedJob ? `${selectedJob.id} - ${selectedJob.customer}` : "All Active Jobs"}
        </button>
        {selectedJob && (
          <button onClick={() => setSelectedJob(null)} style={{ background: "none", border: "none", cursor: "pointer", color: T.dim, fontSize: 10 }}>✕ Clear</button>
        )}
      </div>

      {showJobPicker && (
        <div style={{ maxHeight: 150, overflowY: "auto", borderBottom: `1px solid ${T.border}`, padding: "8px 18px" }}>
          {jobs.filter(j => j.stage !== "closed").map(j => (
            <div key={j.id} onClick={() => { setSelectedJob(j); setShowJobPicker(false); }}
              style={{ padding: "6px 10px", cursor: "pointer", borderRadius: 6, fontSize: 12, color: T.text, display: "flex", gap: 8, alignItems: "center" }}
              onMouseEnter={e => (e.currentTarget.style.background = T.surfaceHigh)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontFamily: "monospace", color: T.orange, fontWeight: 600 }}>{j.id}</span>
              <span>{j.customer}</span>
              <span style={{ color: T.dim }}>•</span>
              <span style={{ color: T.muted, fontSize: 11 }}>{j.loss_type}</span>
            </div>
          ))}
          {jobs.filter(j => j.stage !== "closed").length === 0 && (
            <div style={{ padding: 12, textAlign: "center", color: T.dim, fontSize: 12 }}>No active jobs</div>
          )}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
        {messages.length === 0 && (
          <div style={{ padding: "12px 0" }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: T.orangeDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}><Ic n="edit" s={20} c={T.orange}/></div>
              <div style={{ fontWeight: 700, color: T.text, fontSize: 15, marginBottom: 4 }}>ReCon AI Writer</div>
              <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
                F9 notes, supplements, adjuster emails, scope docs
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {QUICK_ACTIONS.map((qa, i) => (
                <button key={i} onClick={() => send(qa.prompt, qa.action)}
                  style={{
                    background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8,
                    padding: "10px 12px", color: T.text, fontSize: 11, cursor: "pointer",
                    textAlign: "left", fontFamily: "'Inter',sans-serif", transition: "all 0.12s",
                    lineHeight: 1.4,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = T.orange; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = T.border; }}
                >
                  {qa.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 14, display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "88%", position: "relative" }}>
              <div style={{
                padding: "10px 14px", borderRadius: 12, fontSize: 13, lineHeight: 1.6,
                background: msg.role === "user" ? T.orange : T.surfaceHigh,
                color: msg.role === "user" ? "#fff" : T.text,
                border: msg.role === "user" ? "none" : `1px solid ${T.border}`,
              }}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert" style={{ fontSize: 13, lineHeight: 1.6 }}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.content}</span>
                )}
              </div>
              {msg.role === "assistant" && msg.content.length > 10 && (
                <button onClick={() => copyToClipboard(msg.content)} title="Copy to clipboard"
                  style={{ position: "absolute", top: 6, right: 6, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, color: T.muted, cursor: "pointer", opacity: 0.7 }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "0.7")}
                >
                  📋 Copy
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div style={{ display: "flex", gap: 4, padding: "10px 14px" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: T.muted, animation: `pulse 1.4s ${i * 0.2}s infinite` }} />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 18px", borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && input.trim() && !isLoading) send(input); }}
            placeholder={selectedJob ? `Write about ${selectedJob.id}...` : "F9 notes, supplements, emails..."}
            style={{ flex: 1, background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none" }}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = T.orange}
            onBlur={e => (e.target as HTMLInputElement).style.borderColor = T.border}
          />
          <Btn v="primary" sz="sm" onClick={() => { if (input.trim() && !isLoading) send(input); }} disabled={!input.trim() || isLoading} icon="send">
          </Btn>
        </div>
      </div>
    </div>
  );
};
