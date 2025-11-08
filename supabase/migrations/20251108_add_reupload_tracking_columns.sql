-- Add reupload tracking columns to vendor_applications table
-- These columns track which documents have been re-uploaded after rejection

-- Person Photo
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS person_photo_reUploaded BOOLEAN DEFAULT FALSE;

-- Barangay Clearance
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS barangay_clearance_reUploaded BOOLEAN DEFAULT FALSE;

-- ID Photos (front and back)
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS id_front_photo_reUploaded BOOLEAN DEFAULT FALSE;

ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS id_back_photo_reUploaded BOOLEAN DEFAULT FALSE;

-- Birth Certificate
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS birth_certificate_reUploaded BOOLEAN DEFAULT FALSE;

-- Marriage Certificate
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS marriage_certificate_reUploaded BOOLEAN DEFAULT FALSE;

-- Add comment explaining the purpose of these columns
COMMENT ON COLUMN vendor_applications.person_photo_reUploaded IS 'Tracks if person photo was re-uploaded after rejection';
COMMENT ON COLUMN vendor_applications.barangay_clearance_reUploaded IS 'Tracks if barangay clearance was re-uploaded after rejection';
COMMENT ON COLUMN vendor_applications.id_front_photo_reUploaded IS 'Tracks if front ID photo was re-uploaded after rejection';
COMMENT ON COLUMN vendor_applications.id_back_photo_reUploaded IS 'Tracks if back ID photo was re-uploaded after rejection';
COMMENT ON COLUMN vendor_applications.birth_certificate_reUploaded IS 'Tracks if birth certificate was re-uploaded after rejection';
COMMENT ON COLUMN vendor_applications.marriage_certificate_reUploaded IS 'Tracks if marriage certificate was re-uploaded after rejection';
