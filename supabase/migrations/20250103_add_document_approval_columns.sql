-- Add document approval columns to vendor_applications table
-- Run this in Supabase SQL Editor

-- Add approval status columns for each document type
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS person_photo_approved BOOLEAN DEFAULT NULL;

ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS barangay_clearance_approved BOOLEAN DEFAULT NULL;

ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS id_front_photo_approved BOOLEAN DEFAULT NULL;

ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS id_back_photo_approved BOOLEAN DEFAULT NULL;

ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS birth_certificate_approved BOOLEAN DEFAULT NULL;

ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS marriage_certificate_approved BOOLEAN DEFAULT NULL;

ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS notarized_document_approved BOOLEAN DEFAULT NULL;

-- Add rejection reason columns for each document type
ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS person_photo_rejection_reason TEXT;

ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS barangay_clearance_rejection_reason TEXT;

ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS id_front_photo_rejection_reason TEXT;

ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS id_back_photo_rejection_reason TEXT;

ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS birth_certificate_rejection_reason TEXT;

ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS marriage_certificate_rejection_reason TEXT;

ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS notarized_document_rejection_reason TEXT;

-- Add comments for documentation
COMMENT ON COLUMN vendor_applications.person_photo_approved IS 'Approval status for person photo (true=approved, false=rejected, null=pending)';
COMMENT ON COLUMN vendor_applications.barangay_clearance_approved IS 'Approval status for barangay clearance (true=approved, false=rejected, null=pending)';
COMMENT ON COLUMN vendor_applications.id_front_photo_approved IS 'Approval status for government ID front photo (true=approved, false=rejected, null=pending)';
COMMENT ON COLUMN vendor_applications.id_back_photo_approved IS 'Approval status for government ID back photo (true=approved, false=rejected, null=pending)';
COMMENT ON COLUMN vendor_applications.birth_certificate_approved IS 'Approval status for birth certificate (true=approved, false=rejected, null=pending)';
COMMENT ON COLUMN vendor_applications.marriage_certificate_approved IS 'Approval status for marriage certificate (true=approved, false=rejected, null=pending)';
COMMENT ON COLUMN vendor_applications.notarized_document_approved IS 'Approval status for notarized document (true=approved, false=rejected, null=pending)';

COMMENT ON COLUMN vendor_applications.person_photo_rejection_reason IS 'Reason for rejecting person photo';
COMMENT ON COLUMN vendor_applications.barangay_clearance_rejection_reason IS 'Reason for rejecting barangay clearance';
COMMENT ON COLUMN vendor_applications.id_front_photo_rejection_reason IS 'Reason for rejecting government ID front photo';
COMMENT ON COLUMN vendor_applications.id_back_photo_rejection_reason IS 'Reason for rejecting government ID back photo';
COMMENT ON COLUMN vendor_applications.birth_certificate_rejection_reason IS 'Reason for rejecting birth certificate';
COMMENT ON COLUMN vendor_applications.marriage_certificate_rejection_reason IS 'Reason for rejecting marriage certificate';
COMMENT ON COLUMN vendor_applications.notarized_document_rejection_reason IS 'Reason for rejecting notarized document';

SELECT 'Successfully added document approval columns to vendor_applications table!' as status;
