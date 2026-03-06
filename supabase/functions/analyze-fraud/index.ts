import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const token = authHeader.replace("Bearer ", "");
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: userError } = await anonClient.auth.getUser(token);
    if (userError || !user) throw new Error("Unauthorized");

    const userId = user.id;

    // Fetch recent activity logs (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: logs } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", sevenDaysAgo)
      .order("created_at", { ascending: false })
      .limit(500);

    // Fetch recent sales
    const { data: sales } = await supabase
      .from("sales")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", sevenDaysAgo)
      .order("created_at", { ascending: false })
      .limit(500);

    // Fetch employees
    const { data: employees } = await supabase
      .from("employees")
      .select("*")
      .eq("user_id", userId);

    if (!logs?.length && !sales?.length) {
      return new Response(JSON.stringify({ alerts: [], message: "No recent activity to analyze" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call Lovable AI to analyze patterns
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `You are a fraud detection AI for a small business POS system. Analyze the following data and identify suspicious patterns.

EMPLOYEES: ${JSON.stringify(employees?.map(e => ({ id: e.id, name: e.name })) || [])}

ACTIVITY LOGS (last 7 days): ${JSON.stringify(logs?.slice(0, 200) || [])}

SALES (last 7 days): ${JSON.stringify(sales?.slice(0, 200) || [])}

Look for:
1. VOID ABUSE: Excessive void/delete operations by any employee
2. SUSPICIOUS EDITS: Frequent price modifications, quantity changes after sale
3. UNUSUAL PATTERNS: Sales at odd hours, unusually high discounts, round-number-only sales
4. EMPLOYEE ANOMALIES: One employee with significantly different patterns than others

For each finding, classify severity as "low", "medium", "high", or "critical".`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a fraud detection analyst. Return findings in structured format." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report_findings",
              description: "Report fraud detection findings",
              parameters: {
                type: "object",
                properties: {
                  findings: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        alert_type: { type: "string", enum: ["void_abuse", "suspicious_edit", "unusual_pattern", "employee_anomaly"] },
                        severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
                        title: { type: "string" },
                        description: { type: "string" },
                        employee_name: { type: "string" },
                        employee_id: { type: "string" },
                      },
                      required: ["alert_type", "severity", "title", "description"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["findings"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "report_findings" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let findings: any[] = [];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      findings = parsed.findings || [];
    }

    // Save new alerts to database
    if (findings.length > 0) {
      const alertRows = findings.map((f: any) => ({
        user_id: userId,
        employee_id: f.employee_id || null,
        employee_name: f.employee_name || "Unknown",
        alert_type: f.alert_type,
        severity: f.severity,
        title: f.title,
        description: f.description,
        details: { source: "ai_analysis" },
      }));

      await supabase.from("fraud_alerts").insert(alertRows);
    }

    return new Response(JSON.stringify({ alerts: findings, count: findings.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Fraud analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
