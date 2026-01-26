-- Simplify Resources to canonical single-card model
-- Resources must link out to external content, not contain authored content

-- Add canonical Resource fields
ALTER TABLE resources
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS cta_label TEXT DEFAULT 'View Resource',
ADD COLUMN IF NOT EXISTS cta_url TEXT,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS campaign_id TEXT REFERENCES campaigns(id);

-- Add index for common queries
CREATE INDEX IF NOT EXISTS idx_resources_active_sort ON resources(active, sort_order);
CREATE INDEX IF NOT EXISTS idx_resources_campaign ON resources(campaign_id);
