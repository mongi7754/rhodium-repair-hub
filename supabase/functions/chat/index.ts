import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // System prompt with comprehensive phone repair knowledge
    const systemPrompt = `You are an expert AI assistant for Rhodium Ventures PhoneRepair, located in Roysambu, Nairobi (next to Shell Petrol Station). You help customers with:

SERVICES & PRICING:
- Screen replacement: KSh 1,840 - 40,000 (depends on model)
- Battery replacement: KSh 1,500 - 6,000
- Charging port repair: KSh 300
- Charging system repair: KSh 500
- Camera repair: KSh 2,500 - 8,000
- Water damage recovery: KSh 2,500 - 12,000
- Motherboard repair: KSh 3,000 - 15,000
- Software/flashing: KSh 1,500 - 5,000
- Data recovery: KSh 3,000 - 10,000

BRAND PRICING EXAMPLES:
- Tecno screen: KSh 1,840 - 7,180
- Infinix screen: KSh 3,680 - 4,190
- Samsung A-series screen: KSh 4,000 - 5,500
- Samsung S-series screen: KSh 12,000 - 15,000
- iPhone 12 screen: KSh 20,000 - 25,000
- iPhone 13 Pro Max screen: KSh 30,000 - 40,000

KEY FEATURES:
- Same-day service for most repairs (1-3 hours)
- 90-day warranty on screen/battery/major repairs
- Free diagnostics
- Expert certified technicians
- All phone brands supported (Apple, Samsung, Tecno, Infinix, itel, Xiaomi, Huawei, Oppo, Vivo, OnePlus, etc.)

CONTACT INFO:
- Phone: 0721993234
- WhatsApp: 0721993234
- Email: rhodium834@gmail.com
- Location: Roysambu, Nairobi - Next to Shell Petrol Station
- Hours: Mon-Sat 8AM-8PM, Sun 10AM-6PM

TROUBLESHOOTING TIPS:
For battery drain: Check background apps, reduce screen brightness, disable location when not needed
For charging issues: Clean charging port with compressed air, try different cable, check for debris
For overheating: Close unused apps, remove case, update software
For water damage: Turn off immediately, don't charge, bring to us ASAP

Be friendly, helpful, and concise. Provide accurate pricing estimates based on device models. Encourage booking appointments or visiting the store for free diagnostics. If asked about complex repairs, recommend bringing the device in for professional assessment.`;

    console.log('Sending request to Lovable AI...');

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
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Please try again in a moment.',
            type: 'rate_limit'
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'AI service temporarily unavailable. Please call us at 0721993234.',
            type: 'payment_required'
          }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    return new Response(
      JSON.stringify({ 
        message: data.choices[0].message.content 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        type: 'server_error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
