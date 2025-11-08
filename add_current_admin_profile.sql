-- Add your current admin user to admin_profiles table
-- Run this in Supabase SQL Editor

-- First, find your user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'your-admin-email@example.com';

-- Then insert into admin_profiles (replace the values with your actual data)
INSERT INTO admin_profiles (
  id, 
  email, 
  first_name, 
  last_name, 
  role, 
  status
) VALUES (
  'YOUR-USER-ID-FROM-ABOVE',  -- Replace with actual user ID
  'your-admin-email@example.com',  -- Your email
  'Your',  -- Your first name
  'Name',  -- Your last name
  'admin',
  'active'
)
ON CONFLICT (id) DO UPDATE 
SET status = 'active', role = 'admin';

-- Verify it was added
SELECT * FROM admin_profiles WHERE email = 'your-admin-email@example.com';
