import { Tables, TablesInsert, TablesUpdate } from '../integrations/supabase/types';
import { DonationTypePreferences, DonationItemCategory } from './donations';

// Base types from Supabase
export type Organization = Tables<'organizations'>;
export type Campaign = Tables<'campaigns'>;
export type UserProfile = Tables<'user_profiles'>;

// Insert and update types
export type OrganizationInsert = TablesInsert<'organizations'>;
export type OrganizationUpdate = TablesUpdate<'organizations'>;
export type CampaignInsert = TablesInsert<'campaigns'>;
export type CampaignUpdate = TablesUpdate<'campaigns'>;

// Extended organization type with computed donation preferences
export interface OrganizationWithDonationTypes extends Organization {
  effective_donation_types?: DonationTypePreferences;
  donation_stats?: {
    total_cash_received: number;
    total_physical_received: number;
    total_estimated_value: number;
    pending_physical_donations: number;
  };
}

// Extended campaign type with computed donation preferences
export interface CampaignWithDonationTypes extends Campaign {
  effective_donation_types?: DonationTypePreferences;
  organization?: OrganizationWithDonationTypes;
  donation_stats?: {
    cash_raised: number;
    physical_donations_received: number;
    estimated_value_received: number;
    progress_percentage: number;
  };
  impact_evidence?: ImpactEvidence[];
}

export interface ImpactEvidence {
  id: string;
  target_type: 'campaign' | 'organization';
  target_id: string;
  title: string;
  description: string;
  media_urls: string[];
  submitted_at: string;
  status: 'submitted' | 'approved' | 'rejected';
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Organization settings for donation types
export interface OrganizationDonationSettings {
  accepts_cash_donations: boolean;
  accepts_physical_donations: boolean;
  physical_donation_categories: DonationItemCategory[];
  physical_donation_instructions?: string;
  pickup_address?: string;
  pickup_schedule: {
    monday?: { start: string; end: string; available: boolean };
    tuesday?: { start: string; end: string; available: boolean };
    wednesday?: { start: string; end: string; available: boolean };
    thursday?: { start: string; end: string; available: boolean };
    friday?: { start: string; end: string; available: boolean };
    saturday?: { start: string; end: string; available: boolean };
    sunday?: { start: string; end: string; available: boolean };
    special_notes?: string;
  };
}

// Campaign donation type override settings
export interface CampaignDonationOverride {
  donation_types_override: boolean;
  accepts_cash_donations?: boolean;
  accepts_physical_donations?: boolean;
  physical_donation_categories?: DonationItemCategory[];
  physical_donation_instructions?: string;
}

// Form data interfaces for organization/campaign settings
export interface OrganizationDonationSettingsForm {
  accepts_cash_donations: boolean;
  accepts_physical_donations: boolean;
  physical_donation_categories: DonationItemCategory[];
  physical_donation_instructions: string;
  pickup_address: string;
  pickup_schedule: {
    [key: string]: {
      available: boolean;
      start: string;
      end: string;
    };
  };
  special_notes: string;
}

export interface CampaignDonationSettingsForm {
  donation_types_override: boolean;
  accepts_cash_donations: boolean;
  accepts_physical_donations: boolean;
  physical_donation_categories: DonationItemCategory[];
  physical_donation_instructions: string;
}

export interface CampaignDonationSettingsValue {
  override_organization_settings: boolean;
  accepts_cash_donations?: boolean;
  accepts_physical_donations?: boolean;
  physical_donation_categories?: string[];
  physical_donation_instructions?: string;
  pickup_address?: string;
  pickup_schedule?: Record<string, { available: boolean; start: string; end: string }>;
}

// Validation interfaces
export interface DonationSettingsValidation {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}

// API response interfaces
export interface OrganizationDonationSettingsResponse {
  success: boolean;
  settings?: OrganizationDonationSettings;
  error?: string;
}

export interface CampaignDonationSettingsResponse {
  success: boolean;
  settings?: CampaignDonationOverride;
  inherited_from_organization?: OrganizationDonationSettings;
  effective_settings?: DonationTypePreferences;
  error?: string;
}

// Organization verification status
export type OrganizationVerificationStatus =
  | 'pending'
  | 'verified'
  | 'rejected'
  | 'suspended';

// Campaign status
export type CampaignStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

// User types
export type UserType = 'individual' | 'nonprofit';

export type UserRole = 'user' | 'admin' | 'super_admin';

// Extended user profile with organization relationship
export interface UserProfileWithOrganization extends UserProfile {
  organization?: OrganizationWithDonationTypes;
  managed_campaigns?: CampaignWithDonationTypes[];
}
