-- Add password field to vendor_profiles table for secure login
-- This will store the hashed password for mobile app authentication

ALTER TABLE vendor_profiles 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add comment explaining the field
COMMENT ON COLUMN vendor_profiles.password_hash IS 'Hashed password for vendor login. Generated as hash(username + stall_number)';

-- Create index for faster login lookups
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_username_password ON vendor_profiles(username, password_hash);

SELECT 'Password field added to vendor_profiles table' as status;