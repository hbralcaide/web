-- Add stall_number to vendor_applications table
-- Run this in Supabase SQL Editor

-- Add stall_number column
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS stall_number TEXT;

-- Add a comment for documentation
COMMENT ON COLUMN vendor_applications.stall_number IS 'Stall number assigned to the vendor application';

SELECT 'Successfully added stall_number to vendor_applications table!' as status;