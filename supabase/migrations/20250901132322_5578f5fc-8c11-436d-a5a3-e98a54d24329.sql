-- Fix RLS policy for bookings table
-- Drop existing policies
DROP POLICY IF EXISTS "Allow public booking insertions" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated users to read bookings" ON public.bookings;

-- Create policy that allows anonymous users to insert bookings
CREATE POLICY "Allow anonymous booking insertions" 
ON public.bookings 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Create policy that allows authenticated users to read bookings (for admin)
CREATE POLICY "Allow authenticated users to read bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (true);

-- Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;