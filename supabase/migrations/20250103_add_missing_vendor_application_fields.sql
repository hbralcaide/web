-- Add missing fields to vendor_applications table
-- Run this in Supabase SQL Editor

-- Add gender column
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS gender TEXT;

-- Add birth_date column
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Add business_name column
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS business_name TEXT;

-- Add email column
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add phone_number column
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Add products_services_description column (optional field for future use)
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS products_services_description TEXT;

-- Add actual_occupant_first_name column
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS actual_occupant_first_name TEXT;

-- Add actual_occupant_last_name column
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS actual_occupant_last_name TEXT;

-- Add actual_occupant_username column
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS actual_occupant_username TEXT;

-- Add actual_occupant_phone column
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS actual_occupant_phone TEXT;

-- Add username column (for vendor login)
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS username TEXT;

-- Add comments for documentation
COMMENT ON COLUMN vendor_applications.gender IS 'Gender of the applicant (Male/Female)';
COMMENT ON COLUMN vendor_applications.birth_date IS 'Birth date of the applicant';
COMMENT ON COLUMN vendor_applications.business_name IS 'Name of the business';
COMMENT ON COLUMN vendor_applications.email IS 'Email address of the applicant';
COMMENT ON COLUMN vendor_applications.phone_number IS 'Phone number of the applicant';
COMMENT ON COLUMN vendor_applications.products_services_description IS 'Description of products/services';
COMMENT ON COLUMN vendor_applications.actual_occupant_first_name IS 'First name of actual stall occupant';
COMMENT ON COLUMN vendor_applications.actual_occupant_last_name IS 'Last name of actual stall occupant';
COMMENT ON COLUMN vendor_applications.actual_occupant_username IS 'Username of actual stall occupant';
COMMENT ON COLUMN vendor_applications.actual_occupant_phone IS 'Phone number of actual stall occupant';
COMMENT ON COLUMN vendor_applications.username IS 'Username for vendor login';

SELECT 'Successfully added missing fields to vendor_applications table!' as status;
