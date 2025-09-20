import { Tables, TablesInsert, TablesUpdate } from '../integrations/supabase/types';

// Base types from Supabase
export type Donation = Tables<'donations'>;
export type PhysicalDonation = Tables<'physical_donations'>;
export type DonationItem = Tables<'donation_items'>;
export type DonationReceipt = Tables<'donation_receipts'>;
export type Subscription = Tables<'subscriptions'>;

// Insert types for creating new records
export type DonationInsert = TablesInsert<'donations'>;
export type PhysicalDonationInsert = TablesInsert<'physical_donations'>;
export type DonationItemInsert = TablesInsert<'donation_items'>;
export type DonationReceiptInsert = TablesInsert<'donation_receipts'>;
export type SubscriptionInsert = TablesInsert<'subscriptions'>;

// Update types for updating existing records
export type DonationUpdate = TablesUpdate<'donations'>;
export type PhysicalDonationUpdate = TablesUpdate<'physical_donations'>;
export type DonationItemUpdate = TablesUpdate<'donation_items'>;
export type DonationReceiptUpdate = TablesUpdate<'donation_receipts'>;
export type SubscriptionUpdate = TablesUpdate<'subscriptions'>;

// Donation Types
export type DonationType = 'cash' | 'physical';

export type DonationStatus = 
  | 'pending' 
  | 'processing' 
  | 'succeeded' 
  | 'failed' 
  | 'canceled';

export type PhysicalDonationStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_transit' 
  | 'received' 
  | 'cancelled' 
  | 'declined';

export type DonationItemStatus = 
  | 'pending' 
  | 'accepted' 
  | 'declined' 
  | 'received';

export type PickupPreference = 
  | 'pickup' 
  | 'delivery' 
  | 'flexible';

export type ItemCondition = 
  | 'new' 
  | 'excellent' 
  | 'good' 
  | 'fair' 
  | 'poor';

export type TargetType = 
  | 'campaign' 
  | 'organization' 
  | 'general';

// Predefined donation item categories
export const DONATION_ITEM_CATEGORIES = [
  'clothing',
  'food',
  'books',
  'toys',
  'electronics',
  'furniture',
  'medical_supplies',
  'school_supplies',
  'hygiene_products',
  'household_items',
  'sports_equipment',
  'baby_items',
  'other'
] as const;

export type DonationItemCategory = typeof DONATION_ITEM_CATEGORIES[number];

// Extended types with relationships
export interface DonationWithReceipt extends Donation {
  donation_receipts?: DonationReceipt[];
}

export interface PhysicalDonationWithItems extends PhysicalDonation {
  donation_items?: DonationItem[];
}

export interface DonationItemWithDonation extends DonationItem {
  physical_donation?: PhysicalDonation;
}

// Unified donation history type
export interface UnifiedDonation {
  id: string;
  type: DonationType;
  donorName: string;
  donorEmail: string;
  message?: string;
  targetType: TargetType;
  targetId?: string;
  targetName: string;
  createdAt: string;
  status: DonationStatus | PhysicalDonationStatus;
  
  // Cash donation specific fields
  amount?: number;
  currency?: string;
  paymentIntentId?: string;
  paymentStatus?: DonationStatus;
  
  // Physical donation specific fields
  estimatedValue?: number;
  pickupPreference?: PickupPreference;
  donationItems?: DonationItem[];
  coordinatorNotes?: string;
}

// Donation type preferences interface
export interface DonationTypePreferences {
  accepts_cash_donations: boolean;
  accepts_physical_donations: boolean;
  physical_donation_categories: string[];
  physical_donation_instructions?: string;
  pickup_address?: string;
  pickup_schedule?: Record<string, any>;
}

// Form interfaces for donation creation
export interface CashDonationFormData {
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  message?: string;
  isAnonymous: boolean;
  isRecurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  targetType: TargetType;
  targetId?: string;
  targetName: string;
}

export interface PhysicalDonationFormData {
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  message?: string;
  isAnonymous: boolean;
  targetType: TargetType;
  targetId?: string;
  targetName: string;
  pickupPreference: PickupPreference;
  pickupAddress?: string;
  pickupInstructions?: string;
  preferredPickupDate?: string;
  preferredTimeSlot?: string;
  items: DonationItemFormData[];
}

export interface DonationItemFormData {
  category: DonationItemCategory;
  subcategory?: string;
  itemName: string;
  description?: string;
  quantity: number;
  unit: string;
  condition: ItemCondition;
  estimatedValuePerUnit?: number;
  specialHandlingNotes?: string;
  expiryDate?: string;
  isFragile: boolean;
  requiresRefrigeration: boolean;
}

// Statistics interfaces
export interface DonationStats {
  totalCashDonations: number;
  totalPhysicalDonations: number;
  totalCashAmount: number;
  totalEstimatedValue: number;
  donationsByMonth: Array<{
    month: string;
    cashDonations: number;
    physicalDonations: number;
    cashAmount: number;
    estimatedValue: number;
  }>;
  topCategories: Array<{
    category: string;
    count: number;
    estimatedValue: number;
  }>;
}

// API response interfaces
export interface CreateDonationResponse {
  success: boolean;
  donation?: Donation | PhysicalDonation;
  error?: string;
  paymentIntent?: any; // For cash donations
}

export interface DonationTypeResponse {
  success: boolean;
  donationTypes?: DonationTypePreferences;
  error?: string;
}

// Filter and sorting interfaces for donation history
export interface DonationHistoryFilters {
  donationType?: DonationType | 'all';
  status?: string | 'all';
  targetType?: TargetType | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
  minAmount?: number;
  maxAmount?: number;
  category?: DonationItemCategory | 'all';
}

export interface DonationHistorySort {
  field: 'created_at' | 'amount' | 'estimated_value' | 'donor_name';
  direction: 'asc' | 'desc';
}

export interface DonationHistoryResponse {
  donations: UnifiedDonation[];
  totalCount: number;
  stats: DonationStats;
  hasMore: boolean;
}

// Error types
export interface DonationError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

// Validation interfaces
export interface DonationValidationResult {
  isValid: boolean;
  errors: DonationError[];
}

// Organization and campaign extended types with donation preferences
export interface OrganizationWithDonationTypes extends Tables<'organizations'> {
  effective_donation_types?: DonationTypePreferences;
}

export interface CampaignWithDonationTypes extends Tables<'campaigns'> {
  effective_donation_types?: DonationTypePreferences;
  organization?: OrganizationWithDonationTypes;
}
