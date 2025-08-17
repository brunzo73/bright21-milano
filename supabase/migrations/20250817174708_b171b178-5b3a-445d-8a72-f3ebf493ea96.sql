-- Create storage bucket for admin uploaded images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('admin-images', 'admin-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Create policies for admin images bucket
CREATE POLICY "Public can view admin images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'admin-images');

CREATE POLICY "Allow admin uploads" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'admin-images');

CREATE POLICY "Allow admin updates" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'admin-images');

CREATE POLICY "Allow admin deletes" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'admin-images');

-- Create table to store image configurations
CREATE TABLE public.site_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_type VARCHAR(20) NOT NULL CHECK (image_type IN ('hero', 'gallery')),
  file_path TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on site_images
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

-- Create policies for site_images (public read, no write needed since admin will use direct SQL)
CREATE POLICY "Anyone can view site images" 
ON public.site_images 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_images_updated_at
BEFORE UPDATE ON public.site_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();