-- Verification script to check if user exists in auth.users
-- Replace the UUID below with your actual user UUID

DO $$
DECLARE
    check_user_id UUID := '08d14238-889f-4697-8504-5212a6a025cf'; -- Your user UUID
    user_count INTEGER;
    user_info RECORD;
BEGIN
    -- Check if user exists in auth.users
    SELECT COUNT(*) INTO user_count 
    FROM auth.users 
    WHERE id = check_user_id;
    
    RAISE NOTICE 'Checking for user ID: %', check_user_id;
    RAISE NOTICE 'User count in auth.users: %', user_count;
    
    IF user_count = 0 THEN
        RAISE NOTICE 'User with ID % does NOT exist in auth.users', check_user_id;
        
        -- Let's see what users do exist (first 5)
        RAISE NOTICE 'Here are some existing users in auth.users:';
        FOR user_info IN 
            SELECT id, email, created_at 
            FROM auth.users 
            ORDER BY created_at DESC 
            LIMIT 5
        LOOP
            RAISE NOTICE 'User ID: %, Email: %, Created: %', user_info.id, user_info.email, user_info.created_at;
        END LOOP;
    ELSE
        -- User exists, show their details
        SELECT id, email, created_at, email_confirmed_at, last_sign_in_at
        INTO user_info
        FROM auth.users 
        WHERE id = check_user_id;
        
        RAISE NOTICE 'User EXISTS in auth.users:';
        RAISE NOTICE 'ID: %', user_info.id;
        RAISE NOTICE 'Email: %', user_info.email;
        RAISE NOTICE 'Created: %', user_info.created_at;
        RAISE NOTICE 'Email Confirmed: %', user_info.email_confirmed_at;
        RAISE NOTICE 'Last Sign In: %', user_info.last_sign_in_at;
    END IF;
    
    -- Also check if user profile exists
    SELECT COUNT(*) INTO user_count 
    FROM user_profiles 
    WHERE id = check_user_id;
    
    RAISE NOTICE 'User profile count: %', user_count;
    
END $$;
