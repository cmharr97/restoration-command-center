import { useState, useRef, useEffect } from "react";
import { T } from "@/lib/recon-data";
import { Btn, Ic, ReconCard as Card } from "@/components/recon/ReconUI";
import { useJobs } from "@/hooks/useJobs";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;

const QUICK_ACTIONS = [
  { label: "Summarize active jobs", action: "summarize", prompt: "Summarize all active jobs and their current status", jobId: null },
  { label: "Draft Carrier Email", action: "draft_email", prompt: "Draft a professional email to an insurance adjuster requesting supplement approval", jobId: null },
  { label: "Missing Docs Check", action: "missing_docs", prompt: "What documentation is typically missing on active restoration jobs?", jobId: null },
  { label: "Margin Analysis", action: "summarize", prompt: "Analyze the projected profit margins across all current jobs and flag any concerns", jobId: null },
];

export const AIAssistant = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { jobs } = useJobs();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamChat = async (userMessages: Msg[], action?: string, jobId?: string | null) => {
    const jobData = jobId ? JOBS.find(j => j.id === jobId) : JOBS.filter(j => !["paid"].includes(j.stage));

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

  const send = async (text: string, action?: string, jobId?: string | null) => {
    const userMsg: Msg = { role: "user", content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setIsLoading(true);
    try {
      await streamChat(newMsgs, action, jobId);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `❌ ${e.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (qa: typeof QUICK_ACTIONS[0]) => {
    send(qa.prompt, qa.action, qa.jobId);
  };

  return (
    <div style={{
      position: "fixed", right: 20, bottom: 20, width: 440, height: 600,
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16,
      display: "flex", flexDirection: "column", zIndex: 1000,
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    }}>
      {/* Header */}
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${T.orange}, #c84009)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
          <div>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>ReCon AI</div>
            <div style={{ fontSize: 10, color: T.greenBright }}>● Online</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 4 }}>
          <Ic n="x" s={18} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
            <div style={{ fontWeight: 600, color: T.white, fontSize: 14, marginBottom: 4 }}>ReCon AI Assistant</div>
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 20, lineHeight: 1.6 }}>
              I can summarize jobs, draft carrier emails,<br />identify missing docs, and answer questions.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {QUICK_ACTIONS.map((qa, i) => (
                <button key={i} onClick={() => handleQuickAction(qa)}
                  style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 14px", color: T.text, fontSize: 12, cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans',sans-serif", transition: "all 0.12s" }}
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
            <div style={{
              maxWidth: "85%", padding: "10px 14px", borderRadius: 12, fontSize: 13, lineHeight: 1.6,
              background: msg.role === "user" ? T.orange : T.surfaceHigh,
              color: msg.role === "user" ? "#fff" : T.text,
              border: msg.role === "user" ? "none" : `1px solid ${T.border}`,
              whiteSpace: "pre-wrap", wordBreak: "break-word",
            }}>
              {msg.content}
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
            placeholder="Ask about jobs, drying, estimates..."
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
