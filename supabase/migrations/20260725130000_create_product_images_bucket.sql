/*
# Create public storage bucket for product images

## Why
Product images were previously stored as base64 text directly in the
products.image_url column. This bloated every row (100-300KB+ of text
per product) and forced the Shop page to download every product's full
image data as JSON on every visit, with no browser/CDN caching — a major
cause of slow shop load times.

This migration creates a public Supabase Storage bucket so the admin
panel can upload actual image files and store only a short public URL
in image_url instead. Existing products with base64 image_url values
keep working unchanged (the column just holds a longer string) — but
re-uploading their images through the admin panel will shrink their
row size and let the browser cache the image like a normal asset.

## Security
The bucket is public-read (anyone can view product images, same as
before) with open insert/update/delete via the anon key, consistent
with the rest of this schema's "app-layer gated" admin model (see the
products/comments RLS comments in the first migration).
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_product_images" ON storage.objects;
CREATE POLICY "public_read_product_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "public_upload_product_images" ON storage.objects;
CREATE POLICY "public_upload_product_images" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "public_update_product_images" ON storage.objects;
CREATE POLICY "public_update_product_images" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "public_delete_product_images" ON storage.objects;
CREATE POLICY "public_delete_product_images" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'product-images');
