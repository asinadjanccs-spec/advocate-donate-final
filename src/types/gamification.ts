// Supabase generated types currently don't include gamification tables in this codebase snapshot.
// Define minimal local interfaces used by the app to avoid type errors.
export interface GamificationTier {
  id: string;
  tier_name: TierName;
  tier_order: number;
  minimum_amount: number;
  badge_color: string;
  badge_icon: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  current_tier: TierName;
  total_donation_amount: number;
  total_donations_count: number;
  organizations_supported_count: number;
  tier_minimum_amount: number;
  tier_upgrade_history: TierUpgrade[] | null;
  privacy_settings: AchievementPrivacySettings;
  first_donation_date: string | null;
  last_tier_upgrade_date: string | null;
  created_at: string;
  updated_at: string;
}

// Tier names enum
export type TierName = 'new_donor' | 'bronze' | 'silver' | 'gold' | 'platinum';

// Tier upgrade event interface
export interface TierUpgrade {
  fromTier: TierName;
  toTier: TierName;
  upgradeDate: string;
  triggeringDonationId: string;
  totalAmountAtUpgrade: number;
}

// Achievement privacy settings interface
export interface AchievementPrivacySettings {
  showPublicBadge: boolean;
  shareUpgrades: boolean;
  showInLeaderboards: boolean;
}

// Extended user achievement interface with tier information
export interface UserAchievementWithTier {
  // Base achievement fields (from user_achievements)
  id: string;
  user_id: string;
  current_tier: TierName;
  total_donation_amount: number;
  total_donations_count: number;
  organizations_supported_count: number;
  created_at: string;
  updated_at: string;

  // Current tier information
  tier_order: number;
  tier_minimum_amount: number;
  badge_color: string;
  badge_icon: string;
  tier_description: string;

  // Next tier information (null if at highest tier)
  next_tier_name?: string;
  next_tier_minimum_amount?: number;
  next_tier_badge_color?: string;
  next_tier_badge_icon?: string;
  next_tier_description?: string;

  // Progress calculation
  progress_percentage: number;

  // History and metadata
  tier_upgrade_history?: TierUpgrade[] | string | null;
  privacy_settings?: AchievementPrivacySettings | Record<string, any> | null;
  first_donation_date?: string | null;
  last_tier_upgrade_date?: string | null;
}

// Tier progress interface for UI display
export interface TierProgress {
  currentTier: GamificationTier;
  nextTier?: GamificationTier;
  progressAmount: number;
  progressPercentage: number;
  amountToNextTier?: number;
}

// Achievement statistics interface
export interface AchievementStats {
  totalDonationAmount: number;
  totalDonationsCount: number;
  organizationsSupportedCount: number;
  currentTier: TierName;
  tierUpgradeCount: number;
  firstDonationDate?: string;
  lastTierUpgradeDate?: string;
  daysSinceFirstDonation?: number;
  averageDonationAmount?: number;
}

// Tier upgrade notification interface
export interface TierUpgradeNotification {
  id: string;
  userId: string;
  fromTier: TierName;
  toTier: TierName;
  upgradeDate: string;
  newBadgeColor: string;
  newBadgeIcon: string;
  totalAmountAtUpgrade: number;
  isRead: boolean;
  showSharing?: boolean;
}

// Gamification service interfaces
export interface GamificationServiceInterface {
  // Achievement management
  getUserAchievement(userId: string): Promise<UserAchievementWithTier | null>;
  updateUserAchievement(userId: string): Promise<UserAchievementWithTier>;

  // Tier management
  getAllTiers(): Promise<GamificationTier[]>;
  getActiveTiers(): Promise<GamificationTier[]>;
  calculateTierForAmount(amount: number): Promise<GamificationTier>;

  // Progress calculations
  getTierProgress(userId: string): Promise<TierProgress>;
  getAchievementStats(userId: string): Promise<AchievementStats>;

  // Privacy settings
  updatePrivacySettings(userId: string, settings: AchievementPrivacySettings): Promise<void>;
  getPrivacySettings(userId: string): Promise<AchievementPrivacySettings>;
}

// Badge display props interface for components
export interface BadgeDisplayProps {
  tier: GamificationTier;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  clickable?: boolean;
  className?: string;
  onClick?: () => void;
}

// Achievement page data interface
export interface AchievementPageData {
  achievement: UserAchievementWithTier;
  stats: AchievementStats;
  progress: TierProgress;
  allTiers: GamificationTier[];
  privacySettings: AchievementPrivacySettings;
  recentUpgrades: TierUpgrade[];
}

// Tier configuration for admin interface
export interface TierConfiguration {
  tier: GamificationTier;
  isEditing: boolean;
  hasChanges: boolean;
  validationErrors: string[];
}

// Admin tier management interface
export interface AdminTierManagement {
  tiers: TierConfiguration[];
  isLoading: boolean;
  isSaving: boolean;
  errors: string[];
  hasUnsavedChanges: boolean;
}

// Leaderboard entry interface (for future leaderboard feature)
export interface LeaderboardEntry {
  userId: string;
  username: string;
  currentTier: TierName;
  totalDonationAmount: number;
  organizationsSupportedCount: number;
  badgeColor: string;
  badgeIcon: string;
  rank: number;
  showsPublicBadge: boolean;
}

// API response interfaces
export interface GetAchievementResponse {
  success: boolean;
  achievement?: UserAchievementWithTier;
  error?: string;
}

export interface UpdateAchievementResponse {
  success: boolean;
  achievement?: UserAchievementWithTier;
  tierUpgraded?: boolean;
  oldTier?: TierName;
  newTier?: TierName;
  error?: string;
}

export interface GetTierProgressResponse {
  success: boolean;
  progress?: TierProgress;
  error?: string;
}

export interface GetAchievementStatsResponse {
  success: boolean;
  stats?: AchievementStats;
  error?: string;
}

export interface UpdatePrivacySettingsResponse {
  success: boolean;
  settings?: AchievementPrivacySettings;
  error?: string;
}

// Error types specific to gamification
export interface GamificationError {
  code: 'CALCULATION_ERROR' | 'TIER_NOT_FOUND' | 'USER_NOT_FOUND' | 'PRIVACY_ERROR' | 'VALIDATION_ERROR';
  message: string;
  field?: string;
  details?: Record<string, any>;
}

// Validation interfaces
export interface GamificationValidationResult {
  isValid: boolean;
  errors: GamificationError[];
}

export interface TierValidationResult {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}

// Configuration constants
export const TIER_COLORS = {
  new_donor: '#6B7280',
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2'
} as const;

export const TIER_ICONS = {
  new_donor: 'user',
  bronze: 'award',
  silver: 'star',
  gold: 'trophy',
  platinum: 'crown'
} as const;

export const TIER_LABELS = {
  new_donor: 'New Donor',
  bronze: 'Bronze Supporter',
  silver: 'Silver Champion',
  gold: 'Gold Advocate',
  platinum: 'Platinum Hero'
} as const;

// Badge size configurations
export const BADGE_SIZES = {
  sm: { width: 20, height: 20, fontSize: '0.75rem' },
  md: { width: 28, height: 28, fontSize: '0.875rem' },
  lg: { width: 36, height: 36, fontSize: '1rem' },
  xl: { width: 48, height: 48, fontSize: '1.25rem' }
} as const;

// Achievement milestone constants
export const ACHIEVEMENT_MILESTONES = {
  FIRST_DONATION: 'first_donation',
  FIRST_TIER_UPGRADE: 'first_tier_upgrade',
  MULTIPLE_ORGANIZATIONS: 'multiple_organizations',
  MONTHLY_DONOR: 'monthly_donor',
  TOP_TIER: 'top_tier'
} as const;

export type AchievementMilestone = typeof ACHIEVEMENT_MILESTONES[keyof typeof ACHIEVEMENT_MILESTONES];

// Event interfaces for analytics and tracking
export interface GamificationEvent {
  type: 'tier_upgrade' | 'first_donation' | 'milestone_reached' | 'privacy_updated';
  userId: string;
  timestamp: string;
  data: Record<string, any>;
}

export interface TierUpgradeEvent extends GamificationEvent {
  type: 'tier_upgrade';
  data: {
    fromTier: TierName;
    toTier: TierName;
    triggeringDonationId: string;
    totalAmountAtUpgrade: number;
  };
}

export interface FirstDonationEvent extends GamificationEvent {
  type: 'first_donation';
  data: {
    donationId: string;
    donationType: 'cash' | 'physical';
    amount: number;
    targetType: 'organization' | 'campaign';
    targetId: string;
  };
}

// Utility types for form validation
export type RequiredAchievementFields = Pick<UserAchievementWithTier, 'user_id' | 'current_tier'>;
export type RequiredTierFields = Pick<GamificationTier, 'tier_name' | 'tier_order' | 'minimum_amount'>;

// Hook return types for React hooks
export interface UseAchievementReturn {
  achievement: UserAchievementWithTier | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UseTierProgressReturn {
  progress: TierProgress | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UsePrivacySettingsReturn {
  settings: AchievementPrivacySettings | null;
  isLoading: boolean;
  error: string | null;
  updateSettings: (settings: Partial<AchievementPrivacySettings>) => Promise<void>;
  isUpdating: boolean;
}
