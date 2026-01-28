
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { campaignId, phone, userAgent, referrer, utm } = await req.json();

    // Get IP from headers (Standard for Supabase/Deno)
    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';

    const leadData = {
      campaign_id: campaignId,
      phone: phone,
      ip_address: ipAddress,
      user_agent: userAgent,
      device_type: getDeviceType(userAgent),
      referrer: referrer,
      // UTM Parameters
      utm_source: utm?.source || null,
      utm_medium: utm?.medium || null,
      utm_campaign: utm?.campaign || null,
      utm_term: utm?.term || null,
      utm_content: utm?.content || null,
      created_at: new Date().toISOString()
    };

    console.log('Inserting lead:', leadData);

    const { data, error } = await supabaseClient
      .from('leads')
      .upsert(leadData, { onConflict: 'campaign_id, phone', ignoreDuplicates: true }) // If exists, don't crash, just return (or ignore)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error saving lead:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

function getDeviceType(userAgent) {
    if (!userAgent) return 'Unknown';
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) return 'Mobile';
    if (ua.includes('tablet') || ua.includes('ipad')) return 'Tablet';
    return 'Desktop';
}
