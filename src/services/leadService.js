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
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        campaign_id: leadData.campaignId,
        phone: leadData.phone,
        ip_address: leadData.ipAddress || null,
        user_agent: leadData.userAgent || null,
        device_type: leadData.deviceType || null,
        referrer: leadData.referrer || null,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return data[0];
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
