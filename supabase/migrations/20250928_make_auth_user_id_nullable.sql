-- Make auth_user_id nullable for manual vendor entries
-- This allows admins to create vendor profiles without requiring an auth user

ALTER TABLE vendor_profiles ALTER COLUMN auth_user_id DROP NOT NULL;

-- Also update the vendor profile insert to handle the updated field properly
COMMENT ON COLUMN vendor_profiles.auth_user_id IS 'References auth.users(id). Can be null for manual entries created by admins. Vendor will link their auth account later during credential setup.';

SELECT 'auth_user_id is now nullable - manual vendor entries allowed' as status;