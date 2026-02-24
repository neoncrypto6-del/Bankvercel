
-- Run these commands in your Supabase SQL Editor

-- 1. Add notifications column (JSONB array) to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS notifications JSONB DEFAULT '[]'::jsonb;

-- 2. Add password column to profiles table (Note: Storing plain text passwords is not recommended for production)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS password TEXT;

-- 3. Add PIN column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS pin TEXT;

-- 4. Enable Realtime for profiles table (if not already enabled)
-- This allows the dashboard to receive instant notification updates
alter publication supabase_realtime add table profiles;

-- Example: How to insert a notification for a user
-- UPDATE profiles 
-- SET notifications = notifications || '[{"id": "1", "message": "Your loan was approved!", "read": false, "created_at": "2023-10-27T10:00:00Z"}]'::jsonb 
-- WHERE email = 'user@example.com';
