import { supabase } from './supabase';

/**
 * Game Service
 * Centralizes all game-related operations
 */

export const gameService = {
  /**
   * Get campaign data for game
   */
  async getCampaignForGame(campaignId) {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*, organizations(name)')
      .eq('id', campaignId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Track game play (increment clicks)
   */
  async trackGamePlay(campaignId) {
    const { data, error } = await supabase.rpc('increment_campaign_clicks', {
      campaign_id: campaignId
    });

    if (error) {
      // Fallback if RPC doesn't exist
      const campaign = await this.getCampaignForGame(campaignId);
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({ clicks: (campaign.clicks || 0) + 1 })
        .eq('id', campaignId);
      
      if (updateError) throw updateError;
    }
    
    return data;
  },

  /**
   * Save winner information
   */
  async saveWinner(campaignId, winnerData) {
    const { data, error } = await supabase
      .from('winners')
      .insert([{
        campaign_id: campaignId,
        phone: winnerData.phone,
        recipient_name: winnerData.recipientName || null,
        recipient_phone: winnerData.recipientPhone || null,
        is_for_friend: winnerData.isForFriend || false,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    
    // Increment conversions
    await this.incrementConversions(campaignId);
    
    return data[0];
  },

  /**
   * Increment campaign conversions
   */
  async incrementConversions(campaignId) {
    const { data, error } = await supabase.rpc('increment_campaign_conversions', {
      campaign_id: campaignId
    });

    if (error) {
      // Fallback if RPC doesn't exist
      const campaign = await this.getCampaignForGame(campaignId);
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({ conversions: (campaign.conversions || 0) + 1 })
        .eq('id', campaignId);
      
      if (updateError) throw updateError;
    }
    
    return data;
  },

  /**
   * Get winners for a campaign
   */
  async getWinners(campaignId) {
    const { data, error } = await supabase
      .from('winners')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Redeem prize for a winner
   */
  async redeemPrize(winnerId) {
    const { data, error } = await supabase
      .from('winners')
      .update({ 
        is_redeemed: true,
        redeemed_at: new Date().toISOString()
      })
      .eq('id', winnerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get Trail Status (Campaigns + User History)
   */
  async getCampaignTrailStatus(orgId, phone) {
    // 1. Get All Active Campaigns for Org
    const { data: campaigns, error: campError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('organization_id', orgId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (campError) throw campError;
    if (!campaigns || campaigns.length === 0) return { campaigns: [], nextStep: null };

    // 2. Get User History (Leads & Winners)
    // We only need to know if they played (lead) and if they won/redeemed (winner)
    const { data: winners, error: winError } = await supabase
        .from('winners')
        .select('*')
        .eq('phone', phone)
        .in('campaign_id', campaigns.map(c => c.id));

    if (winError) throw winError;

    return {
        campaigns,
        winners: winners || []
    };
  }
};
