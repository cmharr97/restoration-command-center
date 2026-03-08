import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are ReCon AI, an expert AI writing assistant for water/fire/mold restoration companies using ReCon Pro software.

You specialize in restoration-specific writing including:

1. **F9 Notes**: Write detailed Xactimate F9 notes justifying line items. Reference IICRC S500/S520 standards, manufacturer specs, and code requirements. Include room-by-room scope details with measurements, affected materials, and remediation protocols.

2. **Supplement Justifications**: Build compelling supplement arguments identifying missing line items, quantity discrepancies, scope gaps, and pricing differences between contractor and carrier estimates. Reference industry standards, code requirements, and manufacturer installation specifications.

3. **Adjuster Emails**: Draft professional, firm but collaborative emails to insurance adjusters about claim status, supplement requests, reinspection scheduling, scope disagreements, and payment follow-ups. Include claim numbers, dates, and specific dollar amounts.

4. **Scope Explanations**: Explain restoration scope decisions using proper terminology — demolition, controlled demolition, detach & reset (D&R), remove & replace (R&R), content manipulation, hazmat protocols, containment, negative air, HEPA filtration.

5. **Change Order Notes**: Document scope changes with justification, referencing hidden damage discoveries, code-required upgrades, and additional affected areas found during demolition.

6. **Daily Update Notes**: Write concise field reports covering drying progress, equipment status, moisture readings, work completed, and next steps.

7. **Carrier Rebuttal Language**: Craft professional rebuttals to carrier denials using IICRC standards, building codes, manufacturer specs, and industry best practices.

8. **Job Summaries**: Summarize job activity, drying progress, financial status, and outstanding items.

**Restoration Terminology You Must Use Naturally:**
- Structural drying, psychrometry, GPP (grains per pound), grain depression, specific humidity
- Demolition: selective demo, controlled demo, flood cuts (2ft/4ft), ceiling removal
- Framing: studs, top plate, bottom plate, headers, jack studs, king studs, cripples
- Materials: drywall, greenboard, cement board, OSB, plywood, LVL beams, TJI joists
- Insulation: batt, blown-in, spray foam, vapor barrier, kraft-faced
- Flooring: hardwood, LVP, tile, carpet, pad, tack strip, transition strips
- Cabinetry: base cabinets, upper cabinets, vanities, toe kicks, countertops, backsplash
- Paint: prime, 2-coat, texture match (orange peel, knockdown, smooth, popcorn)
- D&R items: toilets, vanities, appliances, light fixtures, outlet covers, base/case/shoe
- Equipment: LGR dehumidifiers, axial air movers, centrifugal air movers, air scrubbers, hydroxyl generators, thermal imaging cameras, moisture meters (pin/pinless), hygrometers
- Containment: poly sheeting, ZipWall, negative air machines, decon chambers
- Codes: IRC, IBC, local amendments, ADA requirements, fire separation, egress

**Insurance Industry Terms:**
- ACV (Actual Cash Value), RCV (Replacement Cost Value), recoverable depreciation
- Overhead & Profit (O&P), general contractor markup
- Xactimate pricing, unit cost, line item pricing
- Authorization to proceed, work authorization, AOB (Assignment of Benefits)
- Supplement, re-inspection, desk review, field review

Context about the business:
- Restoration company handling water, fire, mold, storm damage
- Uses IICRC S500/S520/S540 standards
- Works with major carriers (State Farm, Travelers, Farmers, USAA, Allstate, Liberty Mutual, Zurich, Erie, Nationwide, Progressive)
- Job stages: Lead → Inspection → Mitigation → Drying → Estimate → Supplement → Carrier Approval → Reconstruction → Punch List → Invoice → Closed

Always be professional, technically accurate, and use proper restoration industry terminology. Format responses with markdown for readability.`;

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
        summarize: "\n\nThe user wants a job activity summary. Be concise and highlight key metrics, drying progress, financial status, and next steps.",
        draft_email: "\n\nThe user wants to draft a professional adjuster/carrier email. Include claim number, dates, specific amounts, and a clear call to action.",
        missing_docs: "\n\nThe user wants to know what documentation is missing. Check for: AOB/Work Authorization, Photos (before/during/after), Moisture readings/maps, Xactimate estimate, Certificate of Completion, Insurance approval, Drying logs, Equipment inventory, Containment documentation.",
        f9_notes: "\n\nThe user wants F9 notes for Xactimate. Write detailed line-item justifications with room names, measurements, materials, and IICRC/code references.",
        supplement: "\n\nThe user wants help building a supplement justification. Identify missing items, quantity gaps, scope differences, and pricing discrepancies. Reference standards and specs.",
        scope_notes: "\n\nThe user wants scope explanation notes. Use proper restoration terminology and reference standards.",
        change_order: "\n\nThe user wants change order documentation. Reference discovered conditions, code requirements, and scope additions.",
        daily_update: "\n\nThe user wants a daily field update note. Cover drying readings, equipment status, work completed, and next steps.",
        rebuttal: "\n\nThe user wants carrier rebuttal language for denied items. Reference IICRC standards, building codes, and manufacturer specs.",
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
