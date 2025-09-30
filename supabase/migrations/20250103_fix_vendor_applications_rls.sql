-- Fix RLS policies for vendor_applications table to allow public access
-- This allows anonymous users to create vendor applications

-- Drop existing policies that are too restrictive
DROP POLICY IF EXISTS "Anyone can create vendor applications" ON vendor_applications;
DROP POLICY IF EXISTS "Anyone can view approved vendor applications" ON vendor_applications;
DROP POLICY IF EXISTS "Admins can view all vendor applications" ON vendor_applications;
DROP POLICY IF EXISTS "Admins can update vendor applications" ON vendor_applications;

-- Create new policies that allow public access for vendor applications

-- 1. Allow anyone (including anonymous users) to create vendor applications
CREATE POLICY "Public can create vendor applications" ON vendor_applications
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 2. Allow anyone to view their own applications (if they have the application number)
-- This is more restrictive but still allows public viewing of approved applications
CREATE POLICY "Public can view approved vendor applications" ON vendor_applications
    FOR SELECT
    TO anon, authenticated
    USING (status = 'approved');

-- 3. Allow admins to view all vendor applications
CREATE POLICY "Admins can view all vendor applications" ON vendor_applications
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

-- 4. Allow admins to update vendor applications
CREATE POLICY "Admins can update vendor applications" ON vendor_applications
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

-- 5. Allow admins to delete vendor applications (if needed)
CREATE POLICY "Admins can delete vendor applications" ON vendor_applications
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

-- Also fix stall_applications policies if they exist
DROP POLICY IF EXISTS "Anyone can create stall applications" ON stall_applications;
DROP POLICY IF EXISTS "Anyone can view stall applications" ON stall_applications;
DROP POLICY IF EXISTS "Admins can manage stall applications" ON stall_applications;

-- Create new stall_applications policies
CREATE POLICY "Public can create stall applications" ON stall_applications
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Public can view stall applications" ON stall_applications
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage stall applications" ON stall_applications
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

-- Verify the policies are working
SELECT 'RLS policies updated for vendor applications' as status;
