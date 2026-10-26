DO $$ BEGIN CREATE TYPE public.app_role AS ENUM ('admin','user'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- bookings: admins only for read/update/delete
DROP POLICY IF EXISTS "Authenticated users can delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can read bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can update bookings" ON public.bookings;
CREATE POLICY "Admins can read bookings" ON public.bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete bookings" ON public.bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- site_images: public read, admin write
DROP POLICY IF EXISTS "Enable full access for site_images" ON public.site_images;
GRANT SELECT ON public.site_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_images TO authenticated;
CREATE POLICY "Anyone can view site images" ON public.site_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert site images" ON public.site_images FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update site images" ON public.site_images FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete site images" ON public.site_images FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- storage: admin writes only
DROP POLICY IF EXISTS "Allow admin uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin deletes" ON storage.objects;
CREATE POLICY "Allow admin uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'admin-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Allow admin updates" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'admin-images' AND public.has_role(auth.uid(),'admin')) WITH CHECK (bucket_id = 'admin-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Allow admin deletes" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'admin-images' AND public.has_role(auth.uid(),'admin'));