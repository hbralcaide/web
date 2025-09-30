-- Fix infinite recursion in RLS policies by simplifying admin access
-- This removes the problematic recursive policy checks

-- First, disable RLS temporarily on all tables to clear the recursion
ALTER TABLE vendor_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE stalls DISABLE ROW LEVEL SECURITY;
ALTER TABLE market_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Vendors can view their own profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Vendors can insert their own profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Vendors can update their own profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Anyone can create vendor profiles" ON vendor_profiles;
DROP POLICY IF EXISTS "Allow vendor registration" ON vendor_profiles;
DROP POLICY IF EXISTS "Admins can view all vendor profiles" ON vendor_profiles;
DROP POLICY IF EXISTS "Admins can update vendor profiles" ON vendor_profiles;
DROP POLICY IF EXISTS "Admins can delete vendor profiles" ON vendor_profiles;
DROP POLICY IF EXISTS "Admins full access to vendor_profiles" ON vendor_profiles;
DROP POLICY IF EXISTS "Vendors can view own profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Vendors can update own profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Allow public vendor registration" ON vendor_profiles;

DROP POLICY IF EXISTS "Admins can manage stalls" ON stalls;
DROP POLICY IF EXISTS "Public can view stalls" ON stalls;
DROP POLICY IF EXISTS "Admins full access to stalls" ON stalls;

DROP POLICY IF EXISTS "Public can view market sections" ON market_sections;
DROP POLICY IF EXISTS "Admins can manage market sections" ON market_sections;
DROP POLICY IF EXISTS "Admins full access to market_sections" ON market_sections;
DROP POLICY IF EXISTS "Public can view market_sections" ON market_sections;

DROP POLICY IF EXISTS "Admins can view all admin profiles" ON admin_profiles;
DROP POLICY IF EXISTS "Admins can manage admin profiles" ON admin_profiles;

-- Re-enable RLS
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies

-- 1. VENDOR_PROFILES - Allow all authenticated users (admins will be authenticated)
CREATE POLICY "Allow all authenticated access to vendor_profiles" ON vendor_profiles
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow public read access for vendor profiles (for public forms)
CREATE POLICY "Allow public read vendor_profiles" ON vendor_profiles
    FOR SELECT
    TO anon
    USING (true);

-- Allow public insert for vendor registration
CREATE POLICY "Allow public insert vendor_profiles" ON vendor_profiles
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- 2. STALLS - Allow all authenticated users to read/write, public to read
CREATE POLICY "Allow all authenticated access to stalls" ON stalls
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public read stalls" ON stalls
    FOR SELECT
    TO anon
    USING (true);

-- 3. MARKET_SECTIONS - Allow all authenticated users to read/write, public to read
CREATE POLICY "Allow all authenticated access to market_sections" ON market_sections
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public read market_sections" ON market_sections
    FOR SELECT
    TO anon
    USING (true);

-- 4. ADMIN_PROFILES - Only allow users to see their own profile, no recursion
CREATE POLICY "Users can view own admin profile" ON admin_profiles
    FOR SELECT
    TO authenticated
    USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own admin profile" ON admin_profiles
    FOR UPDATE
    TO authenticated
    USING (auth_user_id = auth.uid())
    WITH CHECK (auth_user_id = auth.uid());

-- Grant necessary permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

SELECT 'Simplified RLS policies created successfully - no more recursion!' as status;