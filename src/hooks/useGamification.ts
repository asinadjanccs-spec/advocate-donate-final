import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { gamificationService, gamificationAPI } from '../services/gamificationService';
import {
  UserAchievementWithTier,
  TierProgress,
  AchievementStats,
  AchievementPrivacySettings,
  GamificationTier,
  UseAchievementReturn,
  UseTierProgressReturn,
  UsePrivacySettingsReturn
} from '../types/gamification';

/**
 * Hook for managing user achievements
 */
export const useAchievement = (): UseAchievementReturn => {
  const { user } = useAuth();
  const [achievement, setAchievement] = useState<UserAchievementWithTier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievement = useCallback(async () => {
    if (!user?.id) {
      setAchievement(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await gamificationAPI.getUserAchievement(user.id);
      
      if (response.success && response.achievement) {
        setAchievement(response.achievement);
      } else {
        setError(response.error || 'Failed to fetch achievement');
        setAchievement(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setAchievement(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const refresh = useCallback(async () => {
    await fetchAchievement();
  }, [fetchAchievement]);

  useEffect(() => {
    fetchAchievement();
  }, [fetchAchievement]);

  return {
    achievement,
    isLoading,
    error,
    refresh
  };
};

/**
 * Hook for managing tier progress
 */
export const useTierProgress = (): UseTierProgressReturn => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<TierProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!user?.id) {
      setProgress(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await gamificationAPI.getTierProgress(user.id);
      
      if (response.success && response.progress) {
        setProgress(response.progress);
      } else {
        setError(response.error || 'Failed to fetch tier progress');
        setProgress(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setProgress(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const refresh = useCallback(async () => {
    await fetchProgress();
  }, [fetchProgress]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    progress,
    isLoading,
    error,
    refresh
  };
};

/**
 * Hook for managing privacy settings
 */
export const usePrivacySettings = (): UsePrivacySettingsReturn => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AchievementPrivacySettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!user?.id) {
      setSettings(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userSettings = await gamificationService.getPrivacySettings(user.id);
      setSettings(userSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch privacy settings');
      setSettings(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const updateSettings = useCallback(async (newSettings: Partial<AchievementPrivacySettings>) => {
    if (!user?.id || !settings) return;

    setIsUpdating(true);
    setError(null);

    try {
      const updatedSettings = { ...settings, ...newSettings };
      const response = await gamificationAPI.updatePrivacySettings(user.id, updatedSettings);
      
      if (response.success && response.settings) {
        setSettings(response.settings);
      } else {
        setError(response.error || 'Failed to update privacy settings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update privacy settings');
    } finally {
      setIsUpdating(false);
    }
  }, [user?.id, settings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    isUpdating
  };
};

/**
 * Hook for getting achievement stats
 */
export const useAchievementStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user?.id) {
      setStats(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await gamificationAPI.getAchievementStats(user.id);
      
      if (response.success && response.stats) {
        setStats(response.stats);
      } else {
        setError(response.error || 'Failed to fetch achievement stats');
        setStats(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const refresh = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refresh
  };
};

/**
 * Hook for managing gamification tiers (for admin use)
 */
export const useGamificationTiers = () => {
  const [tiers, setTiers] = useState<GamificationTier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTiers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const allTiers = await gamificationService.getAllTiers();
      setTiers(allTiers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tiers');
      setTiers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchActiveTiers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const activeTiers = await gamificationService.getActiveTiers();
      setTiers(activeTiers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch active tiers');
      setTiers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchTiers();
  }, [fetchTiers]);

  useEffect(() => {
    fetchTiers();
  }, [fetchTiers]);

  return {
    tiers,
    isLoading,
    error,
    refresh,
    fetchActiveTiers
  };
};

/**
 * Hook for checking recent tier upgrades (for notifications)
 */
export const useRecentTierUpgrade = (hoursAgo: number = 24) => {
  const { user } = useAuth();
  const [hasRecentUpgrade, setHasRecentUpgrade] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkRecentUpgrade = useCallback(async () => {
    if (!user?.id) {
      setHasRecentUpgrade(false);
      return;
    }

    setIsLoading(true);

    try {
      const hasUpgrade = await gamificationService.hasRecentTierUpgrade(user.id, hoursAgo);
      setHasRecentUpgrade(hasUpgrade);
    } catch (err) {
      console.error('Error checking recent tier upgrade:', err);
      setHasRecentUpgrade(false);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, hoursAgo]);

  useEffect(() => {
    checkRecentUpgrade();
  }, [checkRecentUpgrade]);

  return {
    hasRecentUpgrade,
    isLoading,
    refresh: checkRecentUpgrade
  };
};

/**
 * Hook for public badge information (respects privacy settings)
 */
export const usePublicBadge = (userId: string) => {
  const [badgeInfo, setBadgeInfo] = useState<{ tier: GamificationTier; showBadge: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicBadge = useCallback(async () => {
    if (!userId) {
      setBadgeInfo(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const publicBadge = await gamificationService.getPublicBadgeInfo(userId);
      setBadgeInfo(publicBadge);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch public badge');
      setBadgeInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPublicBadge();
  }, [fetchPublicBadge]);

  return {
    badgeInfo,
    isLoading,
    error,
    refresh: fetchPublicBadge
  };
};

/**
 * Hook for triggering achievement updates after donations
 */
export const useAchievementUpdate = () => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAchievement = useCallback(async () => {
    if (!user?.id) return null;

    setIsUpdating(true);
    setError(null);

    try {
      const response = await gamificationAPI.updateUserAchievement(user.id);
      
      if (response.success && response.achievement) {
        return response.achievement;
      } else {
        setError(response.error || 'Failed to update achievement');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update achievement');
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [user?.id]);

  return {
    updateAchievement,
    isUpdating,
    error
  };
};
