-- Fix RLS policies for admin access to site_images table
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can view site images" ON site_images;

-- Create new policies that allow full access for admin operations
CREATE POLICY "Enable full access for site_images" 
ON site_images 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;