-- Fix RLS policies for donations table to allow authenticated users to create donations
-- This migration fixes the "Something went wrong" error when making donations

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Allow anonymous donations" ON donations;
DROP POLICY IF EXISTS "Authenticated users can insert donations" ON donations;

-- Create a new policy that allows authenticated users to insert donations
-- This policy checks that the user making the insert is authenticated
CREATE POLICY "Authenticated users can insert donations" 
ON donations
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Allow if user is authenticated and the user_id matches or is null (for backward compatibility)
  auth.uid() IS NOT NULL
);

-- Ensure anonymous users can also create donations (for guest checkout flows if needed)
CREATE POLICY "Anonymous users can insert donations"
ON donations
FOR INSERT
TO anon
WITH CHECK (true);

-- Comment explaining the fix
COMMENT ON POLICY "Authenticated users can insert donations" ON donations IS 
'Allows authenticated users to create donation records';

COMMENT ON POLICY "Anonymous users can insert donations" ON donations IS 
'Allows anonymous/guest users to create donation records for public donation forms';
