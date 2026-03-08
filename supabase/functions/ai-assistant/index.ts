import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are ReCon AI, an expert AI assistant for a water/fire/mold restoration company called ReCon Pro. You specialize in:

1. **Job Summaries**: Summarize job activity, drying progress, and status updates concisely.
2. **Carrier Emails**: Draft professional emails to insurance adjusters and carriers about claims, supplements, and approvals.
3. **Missing Documentation**: Identify missing documents (AOBs, certificates, photos, drying logs, estimates) for jobs.
4. **Natural Language Queries**: Answer questions about jobs, team, scheduling, and financials.

Context about the business:
- Restoration company handling water, fire, mold, storm damage
- Uses IICRC S500 standards for water damage drying
- Works with insurance carriers (State Farm, Travelers, Farmers, USAA, Allstate, Liberty Mutual, Zurich)
- Key metrics: GPP (grains per pound), RH (relative humidity), moisture readings vs dry standard
- Job stages: Lead → Assessment → Auth Signed → Mitigation → Mit Complete → Recon Estimate → Reconstruction → Final Walk → Invoiced → Paid

Always be professional, concise, and use restoration industry terminology. Format responses with markdown.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, action, jobData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemContent = SYSTEM_PROMPT;
    if (jobData) {
      systemContent += `\n\nCurrent job data context:\n${JSON.stringify(jobData, null, 2)}`;
    }
    if (action) {
      const actionPrompts: Record<string, string> = {
        summarize: "\n\nThe user wants a job activity summary. Be concise and highlight key metrics, drying progress, and next steps.",
        draft_email: "\n\nThe user wants to draft a carrier/adjuster email. Use professional tone, include claim details, and be specific about the request.",
        missing_docs: "\n\nThe user wants to know what documentation is missing. Check for: AOB/Work Authorization, Photos (before/during/after), Moisture readings, Xactimate estimate, Certificate of Completion, Insurance approval, Drying logs.",
      };
      systemContent += actionPrompts[action] || "";
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemContent },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AI assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
