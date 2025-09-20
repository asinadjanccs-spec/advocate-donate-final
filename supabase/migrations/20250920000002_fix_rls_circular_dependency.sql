-- Fix infinite recursion in user_profiles RLS policies
-- This migration fixes the circular dependency issue in admin system policies

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Users can view own profile or admins can view all" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile or admins can update any" ON user_profiles;

-- Create a security definer function to safely check admin roles
-- This function avoids RLS by using security definer privilege
CREATE OR REPLACE FUNCTION is_admin_user(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Use direct SQL without RLS to avoid circular dependency
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = user_id 
        AND role IN ('admin', 'super_admin')
    );
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_admin_user(UUID) TO authenticated;

-- Recreate the user_profiles SELECT policy using the safe function
CREATE POLICY "Users can view own profile or admins can view all" 
ON user_profiles FOR SELECT 
USING (
    auth.uid() = id OR 
    is_admin_user()
);

-- Recreate the user_profiles UPDATE policy using the safe function
CREATE POLICY "Users can update own profile or admins can update any" 
ON user_profiles FOR UPDATE 
USING (
    auth.uid() = id OR 
    is_admin_user()
);

-- Also update the admin activity log policies to use the safe function
DROP POLICY IF EXISTS "Only admins can view activity logs" ON admin_activity_log;
CREATE POLICY "Only admins can view activity logs" 
ON admin_activity_log FOR SELECT 
USING (is_admin_user());

-- Update organizations policies to use the safe function
DROP POLICY IF EXISTS "Organizations viewable by everyone or admin management" ON organizations;
CREATE POLICY "Organizations viewable by everyone or admin management" 
ON organizations FOR SELECT 
USING (
    verification_status = 'verified' OR
    user_id = auth.uid() OR
    is_admin_user()
);

DROP POLICY IF EXISTS "Admins can update organizations" ON organizations;
CREATE POLICY "Admins can update organizations" 
ON organizations FOR UPDATE 
USING (
    user_id = auth.uid() OR
    is_admin_user()
);

-- Update campaigns policies to use the safe function  
DROP POLICY IF EXISTS "Campaigns viewable by everyone or admin management" ON campaigns;
CREATE POLICY "Campaigns viewable by everyone or admin management" 
ON campaigns FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM organizations 
        WHERE id = campaigns.organization_id 
        AND verification_status = 'verified'
    ) OR
    EXISTS (
        SELECT 1 FROM organizations 
        WHERE id = campaigns.organization_id 
        AND user_id = auth.uid()
    ) OR
    is_admin_user()
);

DROP POLICY IF EXISTS "Admins can update campaigns" ON campaigns;  
CREATE POLICY "Admins can update campaigns" 
ON campaigns FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM organizations 
        WHERE id = campaigns.organization_id 
        AND user_id = auth.uid()
    ) OR
    is_admin_user()
);

-- Update the admin activity logging function to use the safe function
CREATE OR REPLACE FUNCTION log_admin_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Only log if the acting user is an admin
    IF is_admin_user() THEN
        INSERT INTO admin_activity_log (
            admin_user_id,
            action,
            target_type,
            target_id,
            old_values,
            new_values
        ) VALUES (
            auth.uid(),
            TG_OP,
            TG_TABLE_NAME,
            COALESCE(NEW.id, OLD.id),
            CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
            CASE WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW) 
                 WHEN TG_OP = 'UPDATE' THEN to_jsonb(NEW) 
                 ELSE NULL END
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comment explaining the fix
COMMENT ON FUNCTION is_admin_user(UUID) IS 'Security definer function to safely check admin roles without triggering RLS circular dependency';
