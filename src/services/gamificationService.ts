import { supabase } from '../integrations/supabase/client';
import {
  UserAchievement,
  UserAchievementWithTier,
  GamificationTier,
  TierProgress,
  AchievementStats,
  AchievementPrivacySettings,
  TierName,
  GamificationServiceInterface,
  GamificationError,
  GetAchievementResponse,
  UpdateAchievementResponse,
  GetTierProgressResponse,
  GetAchievementStatsResponse,
  UpdatePrivacySettingsResponse
} from '../types/gamification';

class GamificationService implements GamificationServiceInterface {
  /**
   * Get user achievement with tier information
   */
  async getUserAchievement(userId: string): Promise<UserAchievementWithTier | null> {
    try {
      const { data, error } = await supabase
        .from('user_achievements_with_tiers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No achievement record found, create one
          return await this.createInitialAchievement(userId);
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user achievement:', error);
      throw this.createGamificationError('USER_NOT_FOUND', 'Failed to fetch user achievement');
    }
  }

  /**
   * Create initial achievement record for new user
   */
  private async createInitialAchievement(userId: string): Promise<UserAchievementWithTier | null> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          current_tier: 'new_donor',
          total_donation_amount: 0,
          total_donations_count: 0,
          organizations_supported_count: 0,
          tier_upgrade_history: [],
          privacy_settings: {
            showPublicBadge: false,
            shareUpgrades: false,
            showInLeaderboards: false
          }
        })
        .select()
        .single();

      if (error) throw error;

      // Fetch the created achievement with tier information
      return await this.getUserAchievement(userId);
    } catch (error) {
      console.error('Error creating initial achievement:', error);
      return null;
    }
  }

  /**
   * Update user achievement (triggered by donation events)
   */
  async updateUserAchievement(userId: string): Promise<UserAchievementWithTier> {
    try {
      // The database triggers will handle the actual calculation
      // We just need to fetch the updated data
      const achievement = await this.getUserAchievement(userId);
      
      if (!achievement) {
        throw this.createGamificationError('USER_NOT_FOUND', 'User achievement not found');
      }

      return achievement;
    } catch (error) {
      console.error('Error updating user achievement:', error);
      throw this.createGamificationError('CALCULATION_ERROR', 'Failed to update user achievement');
    }
  }

  /**
   * Get all gamification tiers
   */
  async getAllTiers(): Promise<GamificationTier[]> {
    try {
      const { data, error } = await supabase
        .from('gamification_tiers')
        .select('*')
        .order('tier_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tiers:', error);
      throw this.createGamificationError('TIER_NOT_FOUND', 'Failed to fetch tiers');
    }
  }

  /**
   * Get only active gamification tiers
   */
  async getActiveTiers(): Promise<GamificationTier[]> {
    try {
      const { data, error } = await supabase
        .from('gamification_tiers')
        .select('*')
        .eq('is_active', true)
        .order('tier_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active tiers:', error);
      throw this.createGamificationError('TIER_NOT_FOUND', 'Failed to fetch active tiers');
    }
  }

  /**
   * Calculate appropriate tier for a given donation amount
   */
  async calculateTierForAmount(amount: number): Promise<GamificationTier> {
    try {
      const { data, error } = await supabase
        .rpc('calculate_user_tier', { donation_amount: amount });

      if (error) throw error;

      const tierName = data as TierName;
      const tier = await this.getTierByName(tierName);
      
      if (!tier) {
        throw this.createGamificationError('TIER_NOT_FOUND', `Tier ${tierName} not found`);
      }

      return tier;
    } catch (error) {
      console.error('Error calculating tier for amount:', error);
      throw this.createGamificationError('CALCULATION_ERROR', 'Failed to calculate tier');
    }
  }

  /**
   * Get tier by name
   */
  private async getTierByName(tierName: TierName): Promise<GamificationTier | null> {
    try {
      const { data, error } = await supabase
        .from('gamification_tiers')
        .select('*')
        .eq('tier_name', tierName)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching tier by name:', error);
      return null;
    }
  }

  /**
   * Get tier progress for user
   */
  async getTierProgress(userId: string): Promise<TierProgress> {
    try {
      const achievement = await this.getUserAchievement(userId);
      
      if (!achievement) {
        throw this.createGamificationError('USER_NOT_FOUND', 'User achievement not found');
      }

      const currentTier: GamificationTier = {
        id: achievement.id,
        tier_name: achievement.current_tier,
        tier_order: achievement.tier_order,
        minimum_amount: achievement.tier_minimum_amount,
        badge_color: achievement.badge_color,
        badge_icon: achievement.badge_icon,
        description: achievement.tier_description,
        is_active: true,
        created_at: achievement.created_at,
        updated_at: achievement.updated_at
      };

      const nextTier: GamificationTier | undefined = achievement.next_tier_name ? {
        id: '', // We don't have the next tier ID in the view
        tier_name: achievement.next_tier_name as TierName,
        tier_order: achievement.tier_order + 1,
        minimum_amount: achievement.next_tier_minimum_amount || 0,
        badge_color: achievement.next_tier_badge_color || '',
        badge_icon: achievement.next_tier_badge_icon || '',
        description: achievement.next_tier_description || '',
        is_active: true,
        created_at: achievement.created_at,
        updated_at: achievement.updated_at
      } : undefined;

      const progressAmount = achievement.total_donation_amount - achievement.tier_minimum_amount;
      const amountToNextTier = nextTier 
        ? nextTier.minimum_amount - achievement.total_donation_amount 
        : undefined;

      return {
        currentTier,
        nextTier,
        progressAmount,
        progressPercentage: achievement.progress_percentage,
        amountToNextTier
      };
    } catch (error) {
      console.error('Error getting tier progress:', error);
      throw this.createGamificationError('CALCULATION_ERROR', 'Failed to get tier progress');
    }
  }

  /**
   * Get achievement statistics for user
   */
  async getAchievementStats(userId: string): Promise<AchievementStats> {
    try {
      const achievement = await this.getUserAchievement(userId);
      
      if (!achievement) {
        throw this.createGamificationError('USER_NOT_FOUND', 'User achievement not found');
      }

      const tierUpgradeHistory = Array.isArray(achievement.tier_upgrade_history) 
        ? achievement.tier_upgrade_history 
        : [];

      const firstDonationDate = achievement.first_donation_date;
      const daysSinceFirstDonation = firstDonationDate 
        ? Math.floor((new Date().getTime() - new Date(firstDonationDate).getTime()) / (1000 * 60 * 60 * 24))
        : undefined;

      const averageDonationAmount = achievement.total_donations_count > 0 
        ? achievement.total_donation_amount / achievement.total_donations_count 
        : undefined;

      return {
        totalDonationAmount: achievement.total_donation_amount,
        totalDonationsCount: achievement.total_donations_count,
        organizationsSupportedCount: achievement.organizations_supported_count,
        currentTier: achievement.current_tier,
        tierUpgradeCount: tierUpgradeHistory.length,
        firstDonationDate,
        lastTierUpgradeDate: achievement.last_tier_upgrade_date,
        daysSinceFirstDonation,
        averageDonationAmount
      };
    } catch (error) {
      console.error('Error getting achievement stats:', error);
      throw this.createGamificationError('CALCULATION_ERROR', 'Failed to get achievement stats');
    }
  }

  /**
   * Update user privacy settings
   */
  async updatePrivacySettings(userId: string, settings: AchievementPrivacySettings): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_achievements')
        .update({ 
          privacy_settings: settings,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Also update the show_public_badge column in user_profiles
      if (settings.showPublicBadge !== undefined) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({ show_public_badge: settings.showPublicBadge })
          .eq('id', userId);

        if (profileError) throw profileError;
      }
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      throw this.createGamificationError('PRIVACY_ERROR', 'Failed to update privacy settings');
    }
  }

  /**
   * Get user privacy settings
   */
  async getPrivacySettings(userId: string): Promise<AchievementPrivacySettings> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('privacy_settings')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No achievement record, return default settings
          return {
            showPublicBadge: false,
            shareUpgrades: false,
            showInLeaderboards: false
          };
        }
        throw error;
      }

      return data.privacy_settings as AchievementPrivacySettings;
    } catch (error) {
      console.error('Error getting privacy settings:', error);
      throw this.createGamificationError('PRIVACY_ERROR', 'Failed to get privacy settings');
    }
  }

  /**
   * Manually recalculate achievements for a user (admin function)
   */
  async recalculateUserAchievements(userId: string): Promise<UserAchievementWithTier> {
    try {
      // This will trigger the database function to recalculate
      const { data, error } = await supabase
        .rpc('update_user_achievements_after_donation')
        .eq('user_id', userId);

      if (error) throw error;

      return await this.getUserAchievement(userId) as UserAchievementWithTier;
    } catch (error) {
      console.error('Error recalculating user achievements:', error);
      throw this.createGamificationError('CALCULATION_ERROR', 'Failed to recalculate achievements');
    }
  }

  /**
   * Get public badge information for a user (respects privacy settings)
   */
  async getPublicBadgeInfo(userId: string): Promise<{ tier: GamificationTier; showBadge: boolean } | null> {
    try {
      const achievement = await this.getUserAchievement(userId);
      
      if (!achievement) return null;

      const privacySettings = achievement.privacy_settings as AchievementPrivacySettings;
      
      if (!privacySettings.showPublicBadge) {
        return null;
      }

      const tier = await this.getTierByName(achievement.current_tier);
      
      if (!tier) return null;

      return {
        tier,
        showBadge: true
      };
    } catch (error) {
      console.error('Error getting public badge info:', error);
      return null;
    }
  }

  /**
   * Check if user has upgraded tier recently (for notifications)
   */
  async hasRecentTierUpgrade(userId: string, hoursAgo: number = 24): Promise<boolean> {
    try {
      const achievement = await this.getUserAchievement(userId);
      
      if (!achievement || !achievement.last_tier_upgrade_date) return false;

      const upgradeDate = new Date(achievement.last_tier_upgrade_date);
      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - hoursAgo);

      return upgradeDate > cutoffDate;
    } catch (error) {
      console.error('Error checking recent tier upgrade:', error);
      return false;
    }
  }

  /**
   * Create a standardized gamification error
   */
  private createGamificationError(code: GamificationError['code'], message: string): GamificationError {
    return {
      code,
      message,
      details: {}
    };
  }

  /**
   * Validate tier configuration
   */
  validateTierConfiguration(tier: Partial<GamificationTier>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!tier.tier_name || tier.tier_name.trim().length === 0) {
      errors.push('Tier name is required');
    }

    if (tier.tier_order === undefined || tier.tier_order < 1) {
      errors.push('Tier order must be a positive number');
    }

    if (tier.minimum_amount === undefined || tier.minimum_amount < 0) {
      errors.push('Minimum amount must be zero or positive');
    }

    if (!tier.badge_color || !tier.badge_color.match(/^#[0-9A-Fa-f]{6}$/)) {
      errors.push('Badge color must be a valid hex color code');
    }

    if (!tier.badge_icon || tier.badge_icon.trim().length === 0) {
      errors.push('Badge icon is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const gamificationService = new GamificationService();

// Export API wrapper functions for easier use
export const gamificationAPI = {
  getUserAchievement: async (userId: string): Promise<GetAchievementResponse> => {
    try {
      const achievement = await gamificationService.getUserAchievement(userId);
      return { success: true, achievement: achievement || undefined };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  updateUserAchievement: async (userId: string): Promise<UpdateAchievementResponse> => {
    try {
      const achievement = await gamificationService.updateUserAchievement(userId);
      return { success: true, achievement };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  getTierProgress: async (userId: string): Promise<GetTierProgressResponse> => {
    try {
      const progress = await gamificationService.getTierProgress(userId);
      return { success: true, progress };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  getAchievementStats: async (userId: string): Promise<GetAchievementStatsResponse> => {
    try {
      const stats = await gamificationService.getAchievementStats(userId);
      return { success: true, stats };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  updatePrivacySettings: async (userId: string, settings: AchievementPrivacySettings): Promise<UpdatePrivacySettingsResponse> => {
    try {
      await gamificationService.updatePrivacySettings(userId, settings);
      const updatedSettings = await gamificationService.getPrivacySettings(userId);
      return { success: true, settings: updatedSettings };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
};
