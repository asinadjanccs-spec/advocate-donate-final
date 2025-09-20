import { supabase } from '../integrations/supabase/client';
import { 
  DonationTypePreferences, 
  DonationItemCategory,
  DONATION_ITEM_CATEGORIES 
} from '../types/donations';
import {
  OrganizationDonationSettings,
  CampaignDonationOverride,
  OrganizationDonationSettingsForm,
  CampaignDonationSettingsForm,
  DonationSettingsValidation,
  OrganizationDonationSettingsResponse,
  CampaignDonationSettingsResponse
} from '../types/organizations';

/**
 * Service for managing donation type preferences for organizations and campaigns
 */
export class DonationTypeService {
  
  /**
   * Get effective donation types for an organization or campaign
   * Uses the database function that handles inheritance logic
   */
  async getEffectiveDonationTypes(
    targetType: 'organization' | 'campaign', 
    targetId: string
  ): Promise<DonationTypePreferences | null> {
    try {
      const { data, error } = await supabase.rpc('get_effective_donation_types', {
        target_type: targetType,
        target_id: targetId
      });

      if (error) {
        console.error('Error getting effective donation types:', error);
        return null;
      }

      return data as DonationTypePreferences;
    } catch (error) {
      console.error('Error in getEffectiveDonationTypes:', error);
      return null;
    }
  }

  /**
   * Get organization donation settings
   */
  async getOrganizationDonationSettings(
    organizationId: string
  ): Promise<OrganizationDonationSettingsResponse> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select(`
          accepts_cash_donations,
          accepts_physical_donations,
          physical_donation_categories,
          physical_donation_instructions,
          pickup_address,
          pickup_schedule
        `)
        .eq('id', organizationId)
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        settings: data as OrganizationDonationSettings
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Update organization donation settings
   */
  async updateOrganizationDonationSettings(
    organizationId: string,
    settings: OrganizationDonationSettingsForm
  ): Promise<OrganizationDonationSettingsResponse> {
    try {
      // Validate settings first
      const validation = this.validateOrganizationDonationSettings(settings);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.map(e => e.message).join(', ')
        };
      }

      const { data, error } = await supabase
        .from('organizations')
        .update({
          accepts_cash_donations: settings.accepts_cash_donations,
          accepts_physical_donations: settings.accepts_physical_donations,
          physical_donation_categories: settings.physical_donation_categories,
          physical_donation_instructions: settings.physical_donation_instructions,
          pickup_address: settings.pickup_address,
          pickup_schedule: settings.pickup_schedule
        })
        .eq('id', organizationId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        settings: {
          accepts_cash_donations: data.accepts_cash_donations,
          accepts_physical_donations: data.accepts_physical_donations,
          physical_donation_categories: data.physical_donation_categories,
          physical_donation_instructions: data.physical_donation_instructions,
          pickup_address: data.pickup_address,
          pickup_schedule: data.pickup_schedule
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get campaign donation settings with inheritance info
   */
  async getCampaignDonationSettings(
    campaignId: string
  ): Promise<CampaignDonationSettingsResponse> {
    try {
      // Get campaign settings with organization info
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select(`
          donation_types_override,
          accepts_cash_donations,
          accepts_physical_donations,
          physical_donation_categories,
          physical_donation_instructions,
          organization_id,
          organizations!inner (
            accepts_cash_donations,
            accepts_physical_donations,
            physical_donation_categories,
            physical_donation_instructions,
            pickup_address,
            pickup_schedule
          )
        `)
        .eq('id', campaignId)
        .single();

      if (campaignError) {
        return {
          success: false,
          error: campaignError.message
        };
      }

      const campaignSettings: CampaignDonationOverride = {
        donation_types_override: campaign.donation_types_override,
        accepts_cash_donations: campaign.accepts_cash_donations,
        accepts_physical_donations: campaign.accepts_physical_donations,
        physical_donation_categories: campaign.physical_donation_categories,
        physical_donation_instructions: campaign.physical_donation_instructions
      };

      const orgSettings: OrganizationDonationSettings = {
        accepts_cash_donations: campaign.organizations.accepts_cash_donations,
        accepts_physical_donations: campaign.organizations.accepts_physical_donations,
        physical_donation_categories: campaign.organizations.physical_donation_categories,
        physical_donation_instructions: campaign.organizations.physical_donation_instructions,
        pickup_address: campaign.organizations.pickup_address,
        pickup_schedule: campaign.organizations.pickup_schedule
      };

      // Calculate effective settings
      const effectiveSettings: DonationTypePreferences = campaign.donation_types_override
        ? {
            accepts_cash_donations: campaign.accepts_cash_donations ?? true,
            accepts_physical_donations: campaign.accepts_physical_donations ?? false,
            physical_donation_categories: campaign.physical_donation_categories ?? [],
            physical_donation_instructions: campaign.physical_donation_instructions,
            pickup_address: orgSettings.pickup_address,
            pickup_schedule: orgSettings.pickup_schedule
          }
        : {
            accepts_cash_donations: orgSettings.accepts_cash_donations,
            accepts_physical_donations: orgSettings.accepts_physical_donations,
            physical_donation_categories: orgSettings.physical_donation_categories,
            physical_donation_instructions: orgSettings.physical_donation_instructions,
            pickup_address: orgSettings.pickup_address,
            pickup_schedule: orgSettings.pickup_schedule
          };

      return {
        success: true,
        settings: campaignSettings,
        inherited_from_organization: orgSettings,
        effective_settings: effectiveSettings
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Update campaign donation settings
   */
  async updateCampaignDonationSettings(
    campaignId: string,
    settings: CampaignDonationSettingsForm
  ): Promise<CampaignDonationSettingsResponse> {
    try {
      // Validate settings first
      const validation = this.validateCampaignDonationSettings(settings);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.map(e => e.message).join(', ')
        };
      }

      const { data, error } = await supabase
        .from('campaigns')
        .update({
          donation_types_override: settings.donation_types_override,
          accepts_cash_donations: settings.accepts_cash_donations,
          accepts_physical_donations: settings.accepts_physical_donations,
          physical_donation_categories: settings.physical_donation_categories,
          physical_donation_instructions: settings.physical_donation_instructions
        })
        .eq('id', campaignId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      // Get updated settings with inheritance
      return await this.getCampaignDonationSettings(campaignId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Validate organization donation settings
   */
  validateOrganizationDonationSettings(
    settings: OrganizationDonationSettingsForm
  ): DonationSettingsValidation {
    const errors: { field: string; message: string }[] = [];

    // At least one donation type must be enabled
    if (!settings.accepts_cash_donations && !settings.accepts_physical_donations) {
      errors.push({
        field: 'donation_types',
        message: 'At least one donation type (cash or physical) must be enabled'
      });
    }

    // If physical donations are enabled, validate related fields
    if (settings.accepts_physical_donations) {
      if (!settings.physical_donation_categories || settings.physical_donation_categories.length === 0) {
        errors.push({
          field: 'physical_donation_categories',
          message: 'At least one category must be selected for physical donations'
        });
      }

      // Validate categories are from allowed list
      const invalidCategories = settings.physical_donation_categories.filter(
        cat => !DONATION_ITEM_CATEGORIES.includes(cat as DonationItemCategory)
      );
      if (invalidCategories.length > 0) {
        errors.push({
          field: 'physical_donation_categories',
          message: `Invalid categories: ${invalidCategories.join(', ')}`
        });
      }

      if (!settings.pickup_address || settings.pickup_address.trim().length === 0) {
        errors.push({
          field: 'pickup_address',
          message: 'Pickup address is required for physical donations'
        });
      }
    }

    // Validate pickup schedule format
    if (settings.pickup_schedule) {
      for (const [day, schedule] of Object.entries(settings.pickup_schedule)) {
        if (schedule.available && (!schedule.start || !schedule.end)) {
          errors.push({
            field: `pickup_schedule.${day}`,
            message: `Start and end times are required for ${day}`
          });
        }
        
        if (schedule.available && schedule.start >= schedule.end) {
          errors.push({
            field: `pickup_schedule.${day}`,
            message: `End time must be after start time for ${day}`
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate campaign donation settings
   */
  validateCampaignDonationSettings(
    settings: CampaignDonationSettingsForm
  ): DonationSettingsValidation {
    const errors: { field: string; message: string }[] = [];

    // If override is enabled, validate the settings
    if (settings.donation_types_override) {
      // At least one donation type must be enabled when overriding
      if (!settings.accepts_cash_donations && !settings.accepts_physical_donations) {
        errors.push({
          field: 'donation_types',
          message: 'At least one donation type (cash or physical) must be enabled when overriding organization settings'
        });
      }

      // If physical donations are enabled, validate categories
      if (settings.accepts_physical_donations) {
        if (!settings.physical_donation_categories || settings.physical_donation_categories.length === 0) {
          errors.push({
            field: 'physical_donation_categories',
            message: 'At least one category must be selected for physical donations'
          });
        }

        // Validate categories are from allowed list
        const invalidCategories = settings.physical_donation_categories.filter(
          cat => !DONATION_ITEM_CATEGORIES.includes(cat as DonationItemCategory)
        );
        if (invalidCategories.length > 0) {
          errors.push({
            field: 'physical_donation_categories',
            message: `Invalid categories: ${invalidCategories.join(', ')}`
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get available donation item categories
   */
  getAvailableDonationCategories(): DonationItemCategory[] {
    return [...DONATION_ITEM_CATEGORIES];
  }

  /**
   * Check if a specific donation type is supported for a target
   */
  async isDonationTypeSupported(
    targetType: 'organization' | 'campaign',
    targetId: string,
    donationType: 'cash' | 'physical'
  ): Promise<boolean> {
    try {
      const effectiveTypes = await this.getEffectiveDonationTypes(targetType, targetId);
      if (!effectiveTypes) return false;

      return donationType === 'cash' 
        ? effectiveTypes.accepts_cash_donations 
        : effectiveTypes.accepts_physical_donations;
    } catch (error) {
      console.error('Error checking donation type support:', error);
      return false;
    }
  }

  /**
   * Get supported physical donation categories for a target
   */
  async getSupportedPhysicalDonationCategories(
    targetType: 'organization' | 'campaign',
    targetId: string
  ): Promise<DonationItemCategory[]> {
    try {
      const effectiveTypes = await this.getEffectiveDonationTypes(targetType, targetId);
      if (!effectiveTypes || !effectiveTypes.accepts_physical_donations) {
        return [];
      }

      return effectiveTypes.physical_donation_categories as DonationItemCategory[];
    } catch (error) {
      console.error('Error getting supported categories:', error);
      return [];
    }
  }

  /**
   * Get default organization donation settings
   */
  getDefaultOrganizationSettings(): OrganizationDonationSettingsForm {
    return {
      accepts_cash_donations: true,
      accepts_physical_donations: false,
      physical_donation_categories: [],
      physical_donation_instructions: '',
      pickup_address: '',
      pickup_schedule: {
        monday: { available: false, start: '09:00', end: '17:00' },
        tuesday: { available: false, start: '09:00', end: '17:00' },
        wednesday: { available: false, start: '09:00', end: '17:00' },
        thursday: { available: false, start: '09:00', end: '17:00' },
        friday: { available: false, start: '09:00', end: '17:00' },
        saturday: { available: false, start: '09:00', end: '17:00' },
        sunday: { available: false, start: '09:00', end: '17:00' }
      },
      special_notes: ''
    };
  }

  /**
   * Get default campaign donation settings
   */
  getDefaultCampaignSettings(): CampaignDonationSettingsForm {
    return {
      donation_types_override: false,
      accepts_cash_donations: true,
      accepts_physical_donations: false,
      physical_donation_categories: [],
      physical_donation_instructions: ''
    };
  }
}

// Export a singleton instance
export const donationTypeService = new DonationTypeService();
