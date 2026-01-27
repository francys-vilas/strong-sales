import { supabase } from './supabase';

/**
 * Campaign Service
 * Centralizes all campaign-related database operations
 */

export const campaignService = {
  /**
   * Fetch all campaigns with ordering
   */
  async getCampaigns() {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get a single campaign by ID
   */
  async getCampaignById(id) {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update campaign fields
   */
  async updateCampaign(id, updates) {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a campaign
   */
  async deleteCampaign(id) {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Create a new campaign
   */
  async createCampaign(campaignData) {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaignData])
      .select();

    if (error) throw error;
    return data[0];
  },

  /**
   * Toggle campaign active status
   */
  async toggleActive(id, currentValue) {
    return this.updateCampaign(id, { is_active: !currentValue });
  },

  /**
   * Toggle super campaign status
   */
  async toggleSuperCampaign(id, currentValue) {
    return this.updateCampaign(id, { is_super_campaign: !currentValue });
  },

  /**
   * Reorder campaigns (swap display_order with adjacent campaign)
   */
  async reorderCampaigns(currentCampaign, targetCampaign) {
    // Swap display_order values
    const currentOrder = currentCampaign.display_order;
    const targetOrder = targetCampaign.display_order;

    const { error: error1 } = await supabase
      .from('campaigns')
      .update({ display_order: targetOrder })
      .eq('id', currentCampaign.id);

    const { error: error2 } = await supabase
      .from('campaigns')
      .update({ display_order: currentOrder })
      .eq('id', targetCampaign.id);

    if (error1 || error2) throw error1 || error2;
  },

  /**
   * Increment campaign clicks
   */
  async incrementClicks(id) {
    const { data, error } = await supabase.rpc('increment_campaign_clicks', {
      campaign_id: id
    });

    if (error) {
      // Fallback if RPC doesn't exist
      const campaign = await this.getCampaignById(id);
      return this.updateCampaign(id, { clicks: (campaign.clicks || 0) + 1 });
    }
    return data;
  },

  /**
   * Increment campaign conversions
   */
  async incrementConversions(id) {
    const { data, error } = await supabase.rpc('increment_campaign_conversions', {
      campaign_id: id
    });

    if (error) {
      // Fallback if RPC doesn't exist
      const campaign = await this.getCampaignById(id);
      return this.updateCampaign(id, { conversions: (campaign.conversions || 0) + 1 });
    }
    return data;
  }
};
