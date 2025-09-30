-- Add DELETE policy for vendor_profiles table to allow admins to delete vendor records
-- This fixes the issue where delete operations appear successful but don't actually delete anything

-- Add DELETE policy for vendor_profiles
CREATE POLICY "Admins can delete vendor profiles" ON vendor_profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

-- Also add DELETE policy for vendor_credentials (they might be cascaded but better to be explicit)
CREATE POLICY "Admins can delete vendor credentials" ON vendor_credentials
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );