-- Create gamification system tables
-- This migration creates the user_achievements and gamification_tiers tables
-- and adds show_public_badge column to user_profiles table

-- Create gamification_tiers table first (referenced by user_achievements)
CREATE TABLE gamification_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_name TEXT UNIQUE NOT NULL,
    tier_order INTEGER NOT NULL UNIQUE,
    minimum_amount NUMERIC(10,2) NOT NULL CHECK (minimum_amount >= 0),
    badge_color TEXT NOT NULL DEFAULT '#6B7280',
    badge_icon TEXT NOT NULL DEFAULT 'award',
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_achievements table
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    current_tier TEXT NOT NULL DEFAULT 'new_donor' REFERENCES gamification_tiers(tier_name),
    total_donation_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total_donation_amount >= 0),
    total_donations_count INTEGER NOT NULL DEFAULT 0 CHECK (total_donations_count >= 0),
    organizations_supported_count INTEGER NOT NULL DEFAULT 0 CHECK (organizations_supported_count >= 0),
    first_donation_date TIMESTAMP WITH TIME ZONE,
    last_tier_upgrade_date TIMESTAMP WITH TIME ZONE,
    tier_upgrade_history JSONB NOT NULL DEFAULT '[]'::jsonb,
    privacy_settings JSONB NOT NULL DEFAULT '{
        "showPublicBadge": false,
        "shareUpgrades": false,
        "showInLeaderboards": false
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Add show_public_badge column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN show_public_badge BOOLEAN NOT NULL DEFAULT false;

-- Create indexes for performance
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_current_tier ON user_achievements(current_tier);
CREATE INDEX idx_user_achievements_total_amount ON user_achievements(total_donation_amount DESC);
CREATE INDEX idx_gamification_tiers_tier_order ON gamification_tiers(tier_order);
CREATE INDEX idx_gamification_tiers_active ON gamification_tiers(is_active) WHERE is_active = true;

-- Insert default tier configurations
INSERT INTO gamification_tiers (tier_name, tier_order, minimum_amount, badge_color, badge_icon, description) VALUES
('new_donor', 1, 0, '#6B7280', 'user', 'Welcome to our community! Every journey starts with a single step.'),
('bronze', 2, 100, '#CD7F32', 'award', 'Bronze Supporter - You''ve made your first significant impact!'),
('silver', 3, 500, '#C0C0C0', 'star', 'Silver Champion - Your generosity is making a real difference!'),
('gold', 4, 1500, '#FFD700', 'trophy', 'Gold Advocate - You''re a pillar of our community!'),
('platinum', 5, 5000, '#E5E4E2', 'crown', 'Platinum Hero - Your extraordinary generosity inspires others!');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_gamification_tiers_updated_at BEFORE UPDATE ON gamification_tiers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON user_achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security policies
ALTER TABLE gamification_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS policies for gamification_tiers (public read, admin write)
CREATE POLICY "Anyone can view active tiers" ON gamification_tiers
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage tiers" ON gamification_tiers
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- RLS policies for user_achievements (users can only see their own)
CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own achievements" ON user_achievements
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert achievements" ON user_achievements
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own achievements" ON user_achievements
    FOR DELETE USING (user_id = auth.uid());

-- Create function to automatically create user achievement record
CREATE OR REPLACE FUNCTION create_user_achievement_on_profile_creation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_achievements (user_id, current_tier)
    VALUES (NEW.id, 'new_donor');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create achievement record for new users
CREATE TRIGGER create_user_achievement_trigger
    AFTER INSERT ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION create_user_achievement_on_profile_creation();

-- Create function to recalculate user tier based on donation amount
CREATE OR REPLACE FUNCTION calculate_user_tier(donation_amount NUMERIC)
RETURNS TEXT AS $$
DECLARE
    tier_name TEXT;
BEGIN
    SELECT gt.tier_name INTO tier_name
    FROM gamification_tiers gt
    WHERE gt.is_active = true 
    AND donation_amount >= gt.minimum_amount
    ORDER BY gt.tier_order DESC
    LIMIT 1;
    
    -- Fallback to new_donor if no tier found
    IF tier_name IS NULL THEN
        tier_name := 'new_donor';
    END IF;
    
    RETURN tier_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update user achievements after donation
CREATE OR REPLACE FUNCTION update_user_achievements_after_donation()
RETURNS TRIGGER AS $$
DECLARE
    user_uuid UUID;
    cash_total NUMERIC := 0;
    physical_total NUMERIC := 0;
    total_amount NUMERIC := 0;
    donation_count INTEGER := 0;
    org_count INTEGER := 0;
    new_tier TEXT;
    old_tier TEXT;
    first_donation TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get user_id from the donation
    IF TG_TABLE_NAME = 'donations' THEN
        user_uuid := NEW.user_id;
    ELSIF TG_TABLE_NAME = 'physical_donations' THEN
        user_uuid := NEW.user_id;
    ELSE
        RETURN NEW;
    END IF;

    -- Skip if user_id is null (anonymous donations)
    IF user_uuid IS NULL THEN
        RETURN NEW;
    END IF;

    -- Calculate totals for this user
    SELECT 
        COALESCE(SUM(amount), 0)
    INTO cash_total
    FROM donations 
    WHERE user_id = user_uuid 
    AND status = 'succeeded';

    SELECT 
        COALESCE(SUM(estimated_value), 0)
    INTO physical_total
    FROM physical_donations 
    WHERE user_id = user_uuid 
    AND status IN ('confirmed', 'received');

    total_amount := cash_total + physical_total;

    -- Count total donations
    SELECT 
        (SELECT COUNT(*) FROM donations WHERE user_id = user_uuid AND status = 'succeeded') +
        (SELECT COUNT(*) FROM physical_donations WHERE user_id = user_uuid AND status IN ('confirmed', 'received'))
    INTO donation_count;

    -- Count unique organizations supported
    SELECT COUNT(DISTINCT org_id) INTO org_count
    FROM (
        SELECT COALESCE(organization_id, 
            (SELECT organization_id FROM campaigns WHERE id = d.campaign_id)
        ) as org_id
        FROM donations d 
        WHERE d.user_id = user_uuid AND d.status = 'succeeded'
        UNION
        SELECT COALESCE(organization_id, 
            (SELECT organization_id FROM campaigns WHERE id = pd.campaign_id)
        ) as org_id
        FROM physical_donations pd 
        WHERE pd.user_id = user_uuid AND pd.status IN ('confirmed', 'received')
    ) unique_orgs
    WHERE org_id IS NOT NULL;

    -- Get first donation date
    SELECT MIN(created_at) INTO first_donation
    FROM (
        SELECT created_at FROM donations WHERE user_id = user_uuid AND status = 'succeeded'
        UNION ALL
        SELECT created_at FROM physical_donations WHERE user_id = user_uuid AND status IN ('confirmed', 'received')
    ) all_donations;

    -- Calculate new tier
    new_tier := calculate_user_tier(total_amount);

    -- Get old tier
    SELECT current_tier INTO old_tier FROM user_achievements WHERE user_id = user_uuid;

    -- Update or insert user achievements
    INSERT INTO user_achievements (
        user_id, 
        current_tier, 
        total_donation_amount, 
        total_donations_count, 
        organizations_supported_count,
        first_donation_date,
        last_tier_upgrade_date,
        tier_upgrade_history
    ) VALUES (
        user_uuid, 
        new_tier, 
        total_amount, 
        donation_count, 
        org_count,
        first_donation,
        CASE WHEN old_tier IS NULL OR old_tier != new_tier THEN CURRENT_TIMESTAMP ELSE NULL END,
        CASE 
            WHEN old_tier IS NULL OR old_tier = new_tier THEN '[]'::jsonb
            ELSE jsonb_build_array(jsonb_build_object(
                'fromTier', COALESCE(old_tier, 'new_donor'),
                'toTier', new_tier,
                'upgradeDate', CURRENT_TIMESTAMP,
                'triggeringDonationId', NEW.id,
                'totalAmountAtUpgrade', total_amount
            ))
        END
    )
    ON CONFLICT (user_id) DO UPDATE SET
        current_tier = new_tier,
        total_donation_amount = total_amount,
        total_donations_count = donation_count,
        organizations_supported_count = org_count,
        first_donation_date = COALESCE(user_achievements.first_donation_date, first_donation),
        last_tier_upgrade_date = CASE 
            WHEN user_achievements.current_tier != new_tier THEN CURRENT_TIMESTAMP 
            ELSE user_achievements.last_tier_upgrade_date 
        END,
        tier_upgrade_history = CASE
            WHEN user_achievements.current_tier != new_tier THEN
                user_achievements.tier_upgrade_history || jsonb_build_array(jsonb_build_object(
                    'fromTier', user_achievements.current_tier,
                    'toTier', new_tier,
                    'upgradeDate', CURRENT_TIMESTAMP,
                    'triggeringDonationId', NEW.id,
                    'totalAmountAtUpgrade', total_amount
                ))
            ELSE user_achievements.tier_upgrade_history
        END,
        updated_at = CURRENT_TIMESTAMP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for automatic achievement updates
CREATE TRIGGER update_achievements_on_donation_insert
    AFTER INSERT ON donations
    FOR EACH ROW
    EXECUTE FUNCTION update_user_achievements_after_donation();

CREATE TRIGGER update_achievements_on_donation_update
    AFTER UPDATE ON donations
    FOR EACH ROW
    WHEN (OLD.payment_status != NEW.payment_status)
    EXECUTE FUNCTION update_user_achievements_after_donation();

CREATE TRIGGER update_achievements_on_physical_donation_insert
    AFTER INSERT ON physical_donations
    FOR EACH ROW
    EXECUTE FUNCTION update_user_achievements_after_donation();

CREATE TRIGGER update_achievements_on_physical_donation_update
    AFTER UPDATE ON physical_donations
    FOR EACH ROW
    WHEN (OLD.donation_status != NEW.donation_status)
    EXECUTE FUNCTION update_user_achievements_after_donation();

-- Create view for easy achievement queries with tier information
CREATE VIEW user_achievements_with_tiers AS
SELECT 
    ua.*,
    gt.tier_order,
    gt.minimum_amount as tier_minimum_amount,
    gt.badge_color,
    gt.badge_icon,
    gt.description as tier_description,
    next_tier.tier_name as next_tier_name,
    next_tier.minimum_amount as next_tier_minimum_amount,
    next_tier.badge_color as next_tier_badge_color,
    next_tier.badge_icon as next_tier_badge_icon,
    next_tier.description as next_tier_description,
    CASE 
        WHEN next_tier.minimum_amount IS NOT NULL THEN
            ROUND(((ua.total_donation_amount - gt.minimum_amount) / 
                   (next_tier.minimum_amount - gt.minimum_amount) * 100), 2)
        ELSE 100
    END as progress_percentage
FROM user_achievements ua
JOIN gamification_tiers gt ON ua.current_tier = gt.tier_name
LEFT JOIN gamification_tiers next_tier ON next_tier.tier_order = gt.tier_order + 1 AND next_tier.is_active = true;

-- Grant permissions
GRANT SELECT ON user_achievements_with_tiers TO authenticated;
GRANT SELECT ON gamification_tiers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_achievements TO authenticated;
