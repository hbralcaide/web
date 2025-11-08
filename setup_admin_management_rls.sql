-- ========================================
-- ADMIN MANAGEMENT - RLS POLICIES
-- ========================================
-- Run this SQL in Supabase SQL Editor to ensure proper permissions
-- for the Admin Management feature
-- ========================================

-- Enable RLS on admin_profiles (if not already enabled)
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow admins to view all admin profiles
CREATE POLICY "Admins can view all admin profiles"
ON admin_profiles
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admin_profiles
        WHERE admin_profiles.auth_user_id = auth.uid()
        AND admin_profiles.status = 'Active'
    )
);

-- Policy: Allow admins to insert new admin profiles (for invites)
CREATE POLICY "Admins can create new admin profiles"
ON admin_profiles
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM admin_profiles
        WHERE admin_profiles.auth_user_id = auth.uid()
        AND admin_profiles.status = 'Active'
    )
);

-- Policy: Allow admins to update admin profiles
CREATE POLICY "Admins can update admin profiles"
ON admin_profiles
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admin_profiles
        WHERE admin_profiles.auth_user_id = auth.uid()
        AND admin_profiles.status = 'Active'
    )
);

-- Policy: Allow admins to delete admin profiles
CREATE POLICY "Admins can delete admin profiles"
ON admin_profiles
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admin_profiles
        WHERE admin_profiles.auth_user_id = auth.uid()
        AND admin_profiles.status = 'Active'
    )
);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'admin_profiles'
ORDER BY policyname;
