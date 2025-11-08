-- ========================================
-- RUN THIS SQL IN SUPABASE SQL EDITOR
-- ========================================
-- This adds the missing reupload tracking columns
-- PostgreSQL converts unquoted names to lowercase, so using lowercase with underscores
-- Copy and paste this entire script into your Supabase SQL Editor and run it
-- ========================================

-- Person Photo
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS person_photo_reuploaded BOOLEAN DEFAULT FALSE;

-- Barangay Clearance
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS barangay_clearance_reuploaded BOOLEAN DEFAULT FALSE;

-- ID Photos (front and back)
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS id_front_photo_reuploaded BOOLEAN DEFAULT FALSE;

ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS id_back_photo_reuploaded BOOLEAN DEFAULT FALSE;

-- Birth Certificate
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS birth_certificate_reuploaded BOOLEAN DEFAULT FALSE;

-- Marriage Certificate
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS marriage_certificate_reuploaded BOOLEAN DEFAULT FALSE;

-- Verify columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'vendor_applications'
  AND column_name LIKE '%reuploaded%'
ORDER BY column_name;

-- This query should return 6 rows showing the new columns
-- All column names should be lowercase: person_photo_reuploaded, etc.
