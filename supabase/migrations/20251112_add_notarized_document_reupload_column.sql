-- Add reupload tracking column for notarized document
-- This column tracks if notarized document was re-uploaded after rejection

ALTER TABLE vendor_applications
ADD COLUMN IF NOT EXISTS notarized_document_reuploaded BOOLEAN DEFAULT FALSE;

-- Add comment explaining the purpose of this column
COMMENT ON COLUMN vendor_applications.notarized_document_reuploaded IS 'Tracks if notarized document was re-uploaded after rejection';
