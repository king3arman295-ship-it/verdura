/*
# Allow anon-key admin panel to moderate comments

## Why
The comments table's DELETE policy was scoped to the `authenticated` role,
but this app has no real Supabase Auth sign-in — the admin panel is gated
entirely at the app layer by a password check (sessionStorage), and every
request (including from the admin panel) is made with the public anon key.
As a result, the original policy made comment deletion impossible from the
UI. This mirrors the same "wide open, app-layer-gated" pattern already used
for the products table.

## Change
Replace the `authenticated`-only delete policy with one that also allows
`anon`, consistent with how products read/write policies are scoped.
*/

DROP POLICY IF EXISTS "auth_delete_comments" ON comments;
CREATE POLICY "public_delete_comments" ON comments FOR DELETE
  TO anon, authenticated USING (true);
