-- Fix RLS issues by making stats update functions SECURITY DEFINER
-- This allows regular users to trigger updates on campaigns and organizations tables
-- via the triggers on donations table, without giving them direct update permissions.

CREATE OR REPLACE FUNCTION update_campaign_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.campaign_id IS NOT NULL AND NEW.payment_status = 'succeeded' THEN
        UPDATE campaigns 
        SET 
            raised_amount = raised_amount + NEW.amount,
            supporters_count = supporters_count + 1
        WHERE id = NEW.campaign_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.campaign_id IS NOT NULL THEN
        -- Remove old amount if it was succeeded
        IF OLD.payment_status = 'succeeded' THEN
            UPDATE campaigns 
            SET 
                raised_amount = raised_amount - OLD.amount,
                supporters_count = supporters_count - 1
            WHERE id = OLD.campaign_id;
        END IF;
        -- Add new amount if it's succeeded
        IF NEW.payment_status = 'succeeded' THEN
            UPDATE campaigns 
            SET 
                raised_amount = raised_amount + NEW.amount,
                supporters_count = supporters_count + 1
            WHERE id = NEW.campaign_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.campaign_id IS NOT NULL AND OLD.payment_status = 'succeeded' THEN
        UPDATE campaigns 
        SET 
            raised_amount = raised_amount - OLD.amount,
            supporters_count = supporters_count - 1
        WHERE id = OLD.campaign_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_organization_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.organization_id IS NOT NULL AND NEW.payment_status = 'succeeded' THEN
        UPDATE organizations 
        SET total_raised = total_raised + NEW.amount
        WHERE id = NEW.organization_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.organization_id IS NOT NULL THEN
        -- Remove old amount if it was succeeded
        IF OLD.payment_status = 'succeeded' THEN
            UPDATE organizations 
            SET total_raised = total_raised - OLD.amount
            WHERE id = OLD.organization_id;
        END IF;
        -- Add new amount if it's succeeded
        IF NEW.payment_status = 'succeeded' THEN
            UPDATE organizations 
            SET total_raised = total_raised + NEW.amount
            WHERE id = NEW.organization_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.organization_id IS NOT NULL AND OLD.payment_status = 'succeeded' THEN
        UPDATE organizations 
        SET total_raised = total_raised - OLD.amount
        WHERE id = OLD.organization_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
