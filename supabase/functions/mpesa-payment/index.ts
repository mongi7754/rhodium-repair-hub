import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

// Generate OAuth token
async function getAccessToken(): Promise<string> {
  const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY');
  const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET');
  
  const auth = btoa(`${consumerKey}:${consumerSecret}`);
  
  const response = await fetch(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('OAuth error:', error);
    throw new Error(`Failed to get access token: ${response.status}`);
  }

  const data = await response.json();
  console.log('Access token obtained successfully');
  return data.access_token;
}

// Generate password for STK Push
function generatePassword(shortcode: string, passkey: string, timestamp: string): string {
  const str = shortcode + passkey + timestamp;
  return btoa(str);
}

// Get timestamp in format YYYYMMDDHHmmss
function getTimestamp(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// Initiate STK Push
async function initiateSTKPush(req: STKPushRequest) {
  const accessToken = await getAccessToken();
  const shortcode = Deno.env.get('MPESA_SHORTCODE') || '';
  const passkey = Deno.env.get('MPESA_PASSKEY') || '';
  const timestamp = getTimestamp();
  const password = generatePassword(shortcode, passkey, timestamp);

  // Format phone number (remove leading 0, add 254)
  let phoneNumber = req.phoneNumber.replace(/\s+/g, '');
  if (phoneNumber.startsWith('0')) {
    phoneNumber = '254' + phoneNumber.substring(1);
  } else if (!phoneNumber.startsWith('254')) {
    phoneNumber = '254' + phoneNumber;
  }

  const stkPushPayload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.round(req.amount),
    PartyA: phoneNumber,
    PartyB: shortcode,
    PhoneNumber: phoneNumber,
    CallBackURL: 'https://your-callback-url.com/mpesa/callback', // Update with actual callback
    AccountReference: req.accountReference,
    TransactionDesc: req.transactionDesc,
  };

  console.log('Initiating STK Push for:', phoneNumber, 'Amount:', req.amount);

  const response = await fetch(
    'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushPayload),
    }
  );

  const data = await response.json();
  
  if (!response.ok) {
    console.error('STK Push error:', data);
    throw new Error(data.errorMessage || 'STK Push failed');
  }

  console.log('STK Push initiated successfully:', data.CheckoutRequestID);
  
  // Store payment record in database
  const { error: dbError } = await supabase
    .from('payments')
    .insert({
      user_phone: phoneNumber,
      amount: req.amount,
      account_reference: req.accountReference,
      transaction_desc: req.transactionDesc,
      checkout_request_id: data.CheckoutRequestID,
      merchant_request_id: data.MerchantRequestID,
      status: 'pending',
    });

  if (dbError) {
    console.error('Database error:', dbError);
    // Don't throw error, just log it - payment was initiated successfully
  }
  
  return data;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    // Initiate payment
    if (path.endsWith('/initiate') && req.method === 'POST') {
      const body: STKPushRequest = await req.json();
      
      // Validate request
      if (!body.phoneNumber || !body.amount) {
        return new Response(
          JSON.stringify({ error: 'Phone number and amount are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await initiateSTKPush(body);
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment request sent. Please check your phone.',
          checkoutRequestId: result.CheckoutRequestID,
          merchantRequestId: result.MerchantRequestID,
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Handle callback from M-Pesa
    if (path.endsWith('/callback') && req.method === 'POST') {
      const callback = await req.json();
      console.log('M-Pesa Callback received:', JSON.stringify(callback, null, 2));
      
      // Extract callback data
      const resultCode = callback.Body?.stkCallback?.ResultCode;
      const resultDesc = callback.Body?.stkCallback?.ResultDesc;
      const checkoutRequestId = callback.Body?.stkCallback?.CheckoutRequestID;
      const callbackMetadata = callback.Body?.stkCallback?.CallbackMetadata?.Item || [];
      
      // Extract M-Pesa receipt number if successful
      let mpesaReceiptNumber = null;
      if (resultCode === 0) {
        const receiptItem = callbackMetadata.find((item: any) => item.Name === 'MpesaReceiptNumber');
        mpesaReceiptNumber = receiptItem?.Value;
      }
      
      // Update payment status in database
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: resultCode === 0 ? 'completed' : 'failed',
          result_code: resultCode?.toString(),
          result_desc: resultDesc,
          mpesa_receipt_number: mpesaReceiptNumber,
          transaction_date: new Date().toISOString(),
        })
        .eq('checkout_request_id', checkoutRequestId);

      if (updateError) {
        console.error('Error updating payment status:', updateError);
      }
      
      return new Response(
        JSON.stringify({ success: true }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid endpoint' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('M-Pesa error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Payment processing failed',
        success: false
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
