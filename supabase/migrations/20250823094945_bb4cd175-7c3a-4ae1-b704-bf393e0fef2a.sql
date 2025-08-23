-- Rimuovi le policy esistenti per la tabella bookings
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.bookings;
DROP POLICY IF EXISTS "Enable select for authenticated users only" ON public.bookings;

-- Crea una nuova policy che permette inserimento a chiunque (anon e authenticated)
CREATE POLICY "Allow public booking insertions" 
ON public.bookings 
FOR INSERT 
TO public
WITH CHECK (true);

-- Mantieni la policy di lettura solo per utenti autenticati (per l'admin)
CREATE POLICY "Allow authenticated users to read bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (true);

-- Verifica che RLS sia abilitato
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;