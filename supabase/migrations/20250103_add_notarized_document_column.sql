-- Add notarized_document column to vendor_applications table
-- Run this in Supabase SQL Editor

-- Add the notarized_document column
ALTER TABLE vendor_applications 
ADD COLUMN IF NOT EXISTS notarized_document TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN vendor_applications.notarized_document IS 'URL to the notarized application document stored in Supabase Storage';

-- Update the photo upload utility to support notarized_document type
-- This is handled in the application code, but we can add a comment here
-- The notarized_document will be stored in the same bucket as other photos:
-- vendor-application-photos/applications/{application_id}/notarized_document_{timestamp}.{extension}

SELECT 'Notarized document column added successfully!' as status;


