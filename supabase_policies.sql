-- ==========================================================
-- SUPABASE STORAGE & RLS POLICIES FOR SHOP BD (NM Shop BD)
-- Buckets: products, categories, banners, brands, profiles, reviews, other-media
-- ==========================================================

-- 1. Create Buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('products', 'products', true),
  ('categories', 'categories', true),
  ('banners', 'banners', true),
  ('brands', 'brands', true),
  ('profiles', 'profiles', true),
  ('reviews', 'reviews', true),
  ('other-media', 'other-media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Public Read Access Policy for Storefront Media
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id IN ('products', 'categories', 'banners', 'brands', 'profiles', 'reviews', 'other-media'));

-- 3. Authenticated & Admin Upload Policy
CREATE POLICY "Admin & Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' OR
  bucket_id IN ('reviews', 'profiles')
);

-- 4. Delete & Update Policy (Admin and Owners)
CREATE POLICY "Admin Delete Policy"
ON storage.objects FOR DELETE
USING (
  auth.role() = 'authenticated'
);

CREATE POLICY "Admin Update Policy"
ON storage.objects FOR UPDATE
USING (
  auth.role() = 'authenticated'
);
