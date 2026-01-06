-- 1. Add missing columns to platforms table (Safe to re-run)
ALTER TABLE platforms ADD COLUMN IF NOT EXISTS screenshot_url TEXT;
ALTER TABLE platforms ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#22c55e';
ALTER TABLE platforms ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 2. Drop existing policies to avoid conflicts (Fixes your error)
DROP POLICY IF EXISTS "Public update access for platforms" ON platforms;
DROP POLICY IF EXISTS "Public delete access for platforms" ON platforms;
DROP POLICY IF EXISTS "Public delete access for touchpoints" ON touchpoints;

-- 3. Create permissions
CREATE POLICY "Public update access for platforms" ON platforms FOR UPDATE USING (true);
CREATE POLICY "Public delete access for platforms" ON platforms FOR DELETE USING (true);
CREATE POLICY "Public delete access for touchpoints" ON touchpoints FOR DELETE USING (true);
