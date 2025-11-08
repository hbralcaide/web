-- Run this in Supabase SQL Editor to verify the columns exist
-- This will show you ALL columns in vendor_applications table

SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'vendor_applications'
ORDER BY ordinal_position;

-- If you don't see the reUploaded columns in the result, 
-- then the ALTER TABLE commands didn't run successfully.
-- Look for columns named:
-- - person_photo_reUploaded
-- - barangay_clearance_reUploaded
-- - id_front_photo_reUploaded
-- - id_back_photo_reUploaded
-- - birth_certificate_reUploaded
-- - marriage_certificate_reUploaded
