-- Fix column name in gamification trigger function
-- The donations table uses 'payment_status', not 'status'

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
    AND payment_status = 'succeeded'; -- Fixed: status -> payment_status

    SELECT 
        COALESCE(SUM(estimated_value), 0)
    INTO physical_total
    FROM physical_donations 
    WHERE user_id = user_uuid 
    AND donation_status IN ('confirmed', 'received'); -- Fixed: status -> donation_status

    total_amount := cash_total + physical_total;

    -- Count total donations
    SELECT 
        (SELECT COUNT(*) FROM donations WHERE user_id = user_uuid AND payment_status = 'succeeded') + -- Fixed: status -> payment_status
        (SELECT COUNT(*) FROM physical_donations WHERE user_id = user_uuid AND donation_status IN ('confirmed', 'received')) -- Fixed: status -> donation_status
    INTO donation_count;

    -- Count unique organizations supported
    SELECT COUNT(DISTINCT org_id) INTO org_count
    FROM (
        SELECT COALESCE(organization_id, 
            (SELECT organization_id FROM campaigns WHERE id = d.campaign_id)
        ) as org_id
        FROM donations d 
        WHERE d.user_id = user_uuid AND d.payment_status = 'succeeded' -- Fixed: status -> payment_status
        UNION
        SELECT COALESCE(organization_id, 
            (SELECT organization_id FROM campaigns WHERE id = pd.campaign_id)
        ) as org_id
        FROM physical_donations pd 
        WHERE pd.user_id = user_uuid AND pd.donation_status IN ('confirmed', 'received') -- Fixed: status -> donation_status
    ) unique_orgs
    WHERE org_id IS NOT NULL;

    -- Get first donation date
    SELECT MIN(created_at) INTO first_donation
    FROM (
        SELECT created_at FROM donations WHERE user_id = user_uuid AND payment_status = 'succeeded' -- Fixed: status -> payment_status
        UNION ALL
        SELECT created_at FROM physical_donations WHERE user_id = user_uuid AND donation_status IN ('confirmed', 'received') -- Fixed: status -> donation_status
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
