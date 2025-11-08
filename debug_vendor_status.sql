-- Debug script to check vendor statuses
-- Run this in Supabase SQL Editor

-- Check what statuses exist in vendor_profiles
SELECT 
  status,
  COUNT(*) as count
FROM vendor_profiles
GROUP BY status
ORDER BY count DESC;

-- Check if is_open_today column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'vendor_profiles' 
  AND column_name IN ('is_open_today', 'last_status_update', 'status');

-- Show sample vendor data
SELECT 
  id,
  first_name,
  last_name,
  status,
  is_open_today,
  created_at
FROM vendor_profiles
LIMIT 10;
