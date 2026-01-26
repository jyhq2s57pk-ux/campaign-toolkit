-- Migration: Auth setup for admin protection
-- Phase 1 Security: Implement Supabase Auth for admin route protection

-- Note: This migration documents the auth setup requirements
-- Actual auth is handled by Supabase Auth service

-- To set up admin users:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" and create admin accounts
-- 3. Or use the Supabase Auth API to invite users

-- For production, consider:
-- 1. Enable email confirmations
-- 2. Set up SSO providers (Google, Microsoft, etc.) in Dashboard > Authentication > Providers
-- 3. Configure Row Level Security policies to check auth.uid()
-- 4. Add user roles/permissions table if needed

-- Example RLS policy for admin-only tables (when needed):
-- CREATE POLICY "Admin users only" ON admin_only_table
--   FOR ALL
--   USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'email' IN (
--     SELECT email FROM admin_users
--   ));

-- Current implementation:
-- - Frontend route protection via ProtectedRoute component
-- - Supabase Auth with email/password
-- - Ready for SSO extension (just configure providers in dashboard)
-- - RLS policies remain permissive for development (update for production)
