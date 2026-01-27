import { supabase } from './supabase';

/**
 * Authentication Service
 * Centralizes all authentication-related operations
 */

export const authService = {
  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign up with email and password
   */
  async signUp(email, password, userData = {}) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    if (authError) throw authError;

    // Create organization for the new user
    if (authData.user) {
      await this.createUserOrganization(authData.user.id, email);
    }

    return authData;
  },

  /**
   * Create organization for new user
   */
  async createUserOrganization(userId, email) {
    const orgName = email.split('@')[0] + "'s Store";
    
    const { data, error } = await supabase
      .from('organizations')
      .insert([{
        user_id: userId,
        name: orgName,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return data[0];
  },

  /**
   * Sign out current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Reset password
   */
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) throw error;
  },

  /**
   * Update password
   */
  async updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  },

  /**
   * Get current user session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
