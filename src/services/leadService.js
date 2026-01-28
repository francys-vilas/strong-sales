import { supabase } from './supabase';

/**
 * Lead Service
 * Centralizes all lead-related operations
 */

export const leadService = {
  /**
   * Create a new lead
   */
  async createLead(leadData) {
    // Collect UTM parameters from URL if present
    const params = new URLSearchParams(window.location.search);
    const utm = {
        source: params.get('utm_source'),
        medium: params.get('utm_medium'),
        campaign: params.get('utm_campaign'),
        term: params.get('utm_term'),
        content: params.get('utm_content')
    };

    // Use Edge Function for secure and full data capture (IP, etc)
    try {
        const { data, error } = await supabase.functions.invoke('save-lead', {
            body: {
                ...leadData,
                utm
            }
        });

        if (error) throw error;
        if (!data || !data.success) throw new Error(data?.error || 'Failed to save lead via Edge Function');
        
        console.log('Lead saved via Edge Function:', data.data);
        return data.data;
    } catch (edgeError) {
        console.warn('Edge Function failed, falling back to direct insert:', edgeError);
        
        // Fallback: Direct Insert
        const { data, error } = await supabase
          .from('leads')
          .insert([{
            campaign_id: leadData.campaignId,
            phone: leadData.phone,
            ip_address: null, // Client cannot see IP
            user_agent: leadData.userAgent,
            device_type: leadData.deviceType,
            referrer: leadData.referrer,
            // UTMs can still be saved directly if columns exist
            utm_source: utm.source,
            utm_medium: utm.medium,
            utm_campaign: utm.campaign,
            created_at: new Date().toISOString()
          }])
          .select();

        if (error) {
            console.error('Direct insert also failed:', error);
            throw error;
        }
        
        console.log('Lead saved via Direct Insert:', data[0]);
        return data[0];
    }
  },

  /**
   * Get leads with optional filtering
   */
  async getLeads(filters = {}) {
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.campaignId) {
      query = query.eq('campaign_id', filters.campaignId);
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  /**
   * Get lead count for a campaign
   */
  async getLeadCount(campaignId) {
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('campaign_id', campaignId);

    if (error) throw error;
    return count || 0;
  },

  /**
   * Get device type from user agent
   */
  getDeviceType(userAgent) {
    if (!userAgent) return 'Unknown';
    
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'Mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      return 'Tablet';
    } else {
      return 'Desktop';
    }
  },

  /**
   * Capture lead metadata from browser
   */
  captureLeadMetadata(campaignId, phone) {
    return {
      campaignId,
      phone,
      ipAddress: null, // IP would need to be captured server-side
      userAgent: navigator.userAgent,
      deviceType: this.getDeviceType(navigator.userAgent),
      referrer: document.referrer || null
    };
  }
};
