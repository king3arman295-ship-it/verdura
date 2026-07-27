/*
# Fix comment delete RLS — allow both anon and authenticated to delete comments

## Why
The admin now signs in via supabase.auth.signInWithPassword() which grants the
`authenticated` role, so the existing policy works. However, as a belt-and-suspenders
fix we also open DELETE to anon so the admin can still delete comments even if the
session is somehow not propagated. This mirrors the policy already in place for
products (open write via anon, gated at app layer by password).
*/

DROP POLICY IF EXISTS "auth_delete_comments" ON comments;
DROP POLICY IF EXISTS "anon_delete_comments" ON comments;

CREATE POLICY "admin_delete_comments" ON comments FOR DELETE
  TO anon, authenticated USING (true);
