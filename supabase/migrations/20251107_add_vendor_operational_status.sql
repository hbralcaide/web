-- Add operational status tracking for vendors
-- This tracks whether a vendor's stall is open/closed for business on a given day

-- Add operational_status column to vendor_profiles
ALTER TABLE vendor_profiles 
ADD COLUMN IF NOT EXISTS is_open_today BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_status_update TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_is_open ON vendor_profiles(is_open_today);

-- Add comments
COMMENT ON COLUMN vendor_profiles.is_open_today IS 'Whether the vendor is currently open for business (updated by vendor via mobile app)';
COMMENT ON COLUMN vendor_profiles.last_status_update IS 'Timestamp of last operational status change';

-- Create a function to update the timestamp automatically
CREATE OR REPLACE FUNCTION update_vendor_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_open_today IS DISTINCT FROM NEW.is_open_today THEN
    NEW.last_status_update = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS vendor_status_update_trigger ON vendor_profiles;
CREATE TRIGGER vendor_status_update_trigger
  BEFORE UPDATE ON vendor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_status_timestamp();

-- Add RLS policy for vendors to update their own operational status
CREATE POLICY "Vendors can update their own operational status" ON vendor_profiles
  FOR UPDATE
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

SELECT 'Vendor operational status tracking added successfully!' as status;
