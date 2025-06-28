import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Twilio } from "npm:twilio@4.19.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { binId, weight, location } = await req.json();

    // Initialize Twilio client
    const client = new Twilio(
      Deno.env.get("TWILIO_ACCOUNT_SID"),
      Deno.env.get("TWILIO_AUTH_TOKEN")
    );

    // Format message
    const message = `Alert: Bin #${binId} at ${location} is full (${weight}kg). Please schedule immediate pickup.`;

    // Send SMS
    await client.messages.create({
      body: message,
      to: Deno.env.get("AUTHORITY_PHONE_NUMBER"),
      from: Deno.env.get("TWILIO_PHONE_NUMBER"),
    });

    return new Response(
      JSON.stringify({ success: true, message: "SMS notification sent" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});