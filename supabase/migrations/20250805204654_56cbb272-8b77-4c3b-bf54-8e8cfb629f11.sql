-- Fix RLS policies for bookings table
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can view all bookings" ON public.bookings;

-- Create a proper policy that allows anyone to insert bookings
CREATE POLICY "Allow public booking creation" 
ON public.bookings 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Create a policy that allows viewing bookings (for admin purposes)
CREATE POLICY "Allow viewing bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (true);