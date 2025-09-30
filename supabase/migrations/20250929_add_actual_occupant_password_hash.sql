-- Add actual_occupant_password_hash column to vendor_profiles table
-- This allows storing hashed passwords for actual occupants when they are different from the vendor

-- Add the new column
ALTER TABLE vendor_profiles 
ADD COLUMN IF NOT EXISTS actual_occupant_password_hash TEXT;

-- Add a comment to document the purpose of this column
COMMENT ON COLUMN vendor_profiles.actual_occupant_password_hash IS 'Hashed password for actual occupant login (when different from vendor)';

-- Clean up existing data: if actual_occupant_username exists but no password hash, 
-- we'll generate a temporary hash or clear the username field
-- Option 1: Clear actual occupant data for existing rows that have username but no password
UPDATE vendor_profiles 
SET 
  actual_occupant_username = NULL,
  actual_occupant_first_name = NULL,
  actual_occupant_last_name = NULL,
  actual_occupant_phone = NULL
WHERE actual_occupant_username IS NOT NULL 
  AND actual_occupant_password_hash IS NULL;

-- Create an index for performance if needed for authentication lookups
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_actual_occupant_username_password 
ON vendor_profiles(actual_occupant_username, actual_occupant_password_hash) 
WHERE actual_occupant_username IS NOT NULL;

-- Add a constraint to ensure that if actual occupant username exists, 
-- then password hash should also exist (and vice versa)
ALTER TABLE vendor_profiles 
ADD CONSTRAINT check_actual_occupant_credentials 
CHECK (
  (actual_occupant_username IS NULL AND actual_occupant_password_hash IS NULL) OR 
  (actual_occupant_username IS NOT NULL AND actual_occupant_password_hash IS NOT NULL)
);