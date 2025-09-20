-- Simple admin user creation by email
-- This script finds a user by email and promotes them to admin
-- 
-- Usage:
-- 1. Create a user account through Supabase Auth (dashboard or signup form)
-- 2. Replace 'admin@example.com' below with the user's email
-- 3. Run this script in Supabase SQL Editor

DO $$
DECLARE
    user_email TEXT := 'admin@example.com'; -- Replace with actual admin email
    found_user_id UUID;
BEGIN
    -- Find user by email
    SELECT id INTO found_user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    IF found_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % does not exist. Please create the user first through Supabase Auth.', user_email;
    END IF;
    
    -- Insert or update user profile with admin role
    INSERT INTO user_profiles (
        id,
        user_type,
        full_name,
        role,
        created_at,
        updated_at
    ) VALUES (
        found_user_id,
        'individual',
        'Admin User',
        'admin',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        updated_at = NOW();
    
    -- Log the admin creation
    INSERT INTO admin_activity_log (
        admin_user_id,
        action,
        target_type,
        target_id,
        new_values,
        created_at
    ) VALUES (
        found_user_id,
        'create_admin_user',
        'user',
        found_user_id,
        jsonb_build_object('role', 'admin', 'email', user_email),
        NOW()
    );
    
    RAISE NOTICE 'Successfully granted admin role to user: % (UUID: %)', user_email, found_user_id;
END $$;
