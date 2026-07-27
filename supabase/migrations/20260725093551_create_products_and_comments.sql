/*
# Create products and comments tables for ShopWave storefront

## Overview
This migration sets up the core data model for a public e-commerce storefront
where any visitor can browse products and leave comments/ratings, and a store
owner manages inventory through a protected admin panel. There is no customer
sign-in, so the schema is single-tenant: the anon-key frontend reads and writes
directly, and admin access is gated by a hardcoded password in the app layer
(not by per-row ownership).

## 1. New Tables

### products
- `id` (uuid, primary key, auto-generated)
- `name` (text, not null) — product title
- `description` (text, not null) — long-form product details
- `price` (numeric(10,2), not null) — USD price, must be >= 0
- `image_url` (text, not null) — publicly accessible product image
- `rating` (numeric(2,1), nullable) — cached average rating (1 decimal),
  maintained by a trigger when comments are inserted/deleted. NULL means
  no ratings yet.
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now(), auto-updated by trigger)

### comments
- `id` (uuid, primary key, auto-generated)
- `product_id` (uuid, foreign key -> products.id ON DELETE CASCADE)
- `author_name` (text, not null) — name supplied by the commenter
- `content` (text, not null) — comment body
- `rating` (int, not null, CHECK 1..5) — star rating from 1 to 5
- `created_at` (timestamptz, default now())

## 2. Indexes
- `comments_product_id_idx` on comments(product_id) for fast per-product lookups
- `products_created_at_desc_idx` on products(created_at DESC) for shop listing

## 3. Triggers
- `products_set_updated_at` — sets updated_at = now() on every products UPDATE
- `products_recompute_rating_on_comment` — after INSERT/DELETE on comments,
  recomputes products.rating as the average of all comment ratings for that
  product (NULL if none remain). Keeps the storefront's average rating live
  without an extra query per product.

## 4. Security (RLS)
Both tables enable Row Level Security. Because this is a no-sign-in public
storefront, policies are scoped to `TO anon, authenticated` so the anon-key
client can operate:

- products: public SELECT; public INSERT/UPDATE/DELETE (admin edits via the
  same anon key — admin gating is enforced in the app UI by a password).
- comments: public SELECT (anyone can read); public INSERT (anyone can post);
  UPDATE/DELETE restricted to authenticated (admin moderation only).

The wide-open products policies are intentional for this MVP: the admin panel
is protected by a client-side password gate, and there is no per-user auth to
key ownership checks on. Documented here so the choice is explicit.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  image_url text NOT NULL DEFAULT '',
  rating numeric(2,1),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  content text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS comments_product_id_idx ON comments(product_id);
CREATE INDEX IF NOT EXISTS products_created_at_desc_idx ON products(created_at DESC);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- products: public read, open write (admin via anon key + app-level password gate)
DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_products" ON products;
CREATE POLICY "public_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_products" ON products;
CREATE POLICY "public_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_products" ON products;
CREATE POLICY "public_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

-- comments: public read + insert; admin (authenticated) can moderate
DROP POLICY IF EXISTS "public_read_comments" ON comments;
CREATE POLICY "public_read_comments" ON comments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_comments" ON comments;
CREATE POLICY "public_insert_comments" ON comments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_comments" ON comments;
CREATE POLICY "auth_update_comments" ON comments FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_comments" ON comments;
CREATE POLICY "auth_delete_comments" ON comments FOR DELETE
  TO authenticated USING (true);

-- updated_at trigger for products
CREATE OR REPLACE FUNCTION products_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_products_set_updated_at ON products;
CREATE TRIGGER trg_products_set_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION products_set_updated_at();

-- recompute products.rating when comments change
CREATE OR REPLACE FUNCTION recompute_product_rating()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  pid uuid;
BEGIN
  IF TG_OP = 'INSERT' THEN
    pid := NEW.product_id;
  ELSE
    pid := OLD.product_id;
  END IF;

  UPDATE products
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 1) FROM comments WHERE product_id = pid
  )
  WHERE id = pid;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_recompute_rating_insert ON comments;
CREATE TRIGGER trg_recompute_rating_insert
  AFTER INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION recompute_product_rating();

DROP TRIGGER IF EXISTS trg_recompute_rating_delete ON comments;
CREATE TRIGGER trg_recompute_rating_delete
  AFTER DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION recompute_product_rating();
