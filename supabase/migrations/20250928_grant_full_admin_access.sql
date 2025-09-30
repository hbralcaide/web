-- Grant full admin access to vendor_profiles table
-- This allows admins to perform all CRUD operations on vendor profiles

-- First, drop existing restrictive policies for vendor_profiles
DROP POLICY IF EXISTS "Vendors can view their own profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Vendors can insert their own profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Vendors can update their own profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Anyone can create vendor profiles" ON vendor_profiles;
DROP POLICY IF EXISTS "Allow vendor registration" ON vendor_profiles;
DROP POLICY IF EXISTS "Admins can view all vendor profiles" ON vendor_profiles;
DROP POLICY IF EXISTS "Admins can update vendor profiles" ON vendor_profiles;
DROP POLICY IF EXISTS "Admins can delete vendor profiles" ON vendor_profiles;

-- Create comprehensive admin policies for vendor_profiles
-- 1. Admins can do everything (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Admins full access to vendor_profiles" ON vendor_profiles
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

-- 2. Vendors can view their own profile
CREATE POLICY "Vendors can view own profile" ON vendor_profiles
    FOR SELECT
    TO authenticated
    USING (auth_user_id = auth.uid());

-- 3. Vendors can update their own profile
CREATE POLICY "Vendors can update own profile" ON vendor_profiles
    FOR UPDATE
    TO authenticated
    USING (auth_user_id = auth.uid())
    WITH CHECK (auth_user_id = auth.uid());

-- 4. Allow public registration (for vendor signup process)
CREATE POLICY "Allow public vendor registration" ON vendor_profiles
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Also ensure similar permissions for stalls table
-- Drop existing stalls policies that might be restrictive
DROP POLICY IF EXISTS "Admins can manage stalls" ON stalls;
DROP POLICY IF EXISTS "Public can view stalls" ON stalls;

-- Create comprehensive admin policies for stalls
CREATE POLICY "Admins full access to stalls" ON stalls
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

-- Allow public to view available stalls
CREATE POLICY "Public can view stalls" ON stalls
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Ensure similar permissions for market_sections table
-- Drop existing market_sections policies
DROP POLICY IF EXISTS "Public can view market sections" ON market_sections;
DROP POLICY IF EXISTS "Admins can manage market sections" ON market_sections;

-- Create comprehensive admin policies for market_sections
CREATE POLICY "Admins full access to market_sections" ON market_sections
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

-- Allow public to view market sections
CREATE POLICY "Public can view market_sections" ON market_sections
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Verify admin_profiles table has proper policies too
-- Drop existing admin policies that might be restrictive
DROP POLICY IF EXISTS "Admins can view all admin profiles" ON admin_profiles;
DROP POLICY IF EXISTS "Admins can manage admin profiles" ON admin_profiles;

-- Create comprehensive admin policies for admin_profiles
CREATE POLICY "Admins can view all admin profiles" ON admin_profiles
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage admin profiles" ON admin_profiles
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

-- Grant usage on sequences if they exist
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant select, insert, update, delete on all tables to authenticated users
-- (RLS policies will still control actual access)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;

SELECT 'Admin access policies created successfully' as status;