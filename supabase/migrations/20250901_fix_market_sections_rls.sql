-- Fix RLS policies for market_sections to properly check admin_profiles table
-- Drop existing admin policy
DROP POLICY IF EXISTS "Admins can do everything" ON market_sections;

-- Create new policy that checks admin_profiles table
CREATE POLICY "Admin profiles can manage market sections" ON market_sections
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid()
            AND admin_profiles.status = 'active'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid()
            AND admin_profiles.status = 'active'
        )
    );

-- Alternative: Temporary policy to allow all authenticated users to insert (for testing)
-- Uncomment this if the admin_profiles check doesn't work
-- CREATE POLICY "Authenticated users can insert market sections" ON market_sections
--     FOR INSERT
--     TO authenticated
--     WITH CHECK (true);
