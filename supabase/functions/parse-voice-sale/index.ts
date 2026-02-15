import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'No text provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are a Kenyan business transaction parser. You understand Swahili, Sheng, and English.

Your job is to extract sale information from spoken text and return structured JSON.

Rules:
- Convert Swahili numbers: "elfu" = 1000, "mia" = 100, "ishirini" = 20, "thelathini" = 30, etc.
- "nimeuza" = I sold, "mauzo" = sales
- Default quantity is 1 if not specified
- Default payment method is "cash" if not specified. "mpesa" if M-Pesa mentioned.
- If the text mentions a product name, extract it. If not, use "General Sale"
- Always return KSh amounts as numbers

You MUST respond with ONLY a JSON object in this exact format:
{
  "product_name": "string",
  "quantity": number,
  "unit_price": number,
  "total_amount": number,
  "payment_method": "cash" | "mpesa" | "card"
}

Examples:
- "Nimeuza simu moja elfu nane mia tano" → {"product_name":"Simu","quantity":1,"unit_price":8500,"total_amount":8500,"payment_method":"cash"}
- "Sold 3 chargers at 500 each" → {"product_name":"Charger","quantity":3,"unit_price":500,"total_amount":1500,"payment_method":"cash"}
- "Leo nimeuza earphones mbili elfu moja kwa mpesa" → {"product_name":"Earphones","quantity":2,"unit_price":1000,"total_amount":2000,"payment_method":"mpesa"}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        temperature: 0.1,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service unavailable' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const sale = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify({ sale }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Parse error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Parse failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
