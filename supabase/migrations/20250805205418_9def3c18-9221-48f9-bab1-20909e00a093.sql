-- Remove existing policies
DROP POLICY IF EXISTS "Allow public booking creation" ON public.bookings;
DROP POLICY IF EXISTS "Allow viewing bookings" ON public.bookings;

-- Create a simple policy that allows anyone to insert bookings
CREATE POLICY "Enable insert for anon users" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Create a policy for viewing bookings (for authenticated users only)
CREATE POLICY "Enable select for authenticated users only" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (true);