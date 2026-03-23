-- Add module_labels JSONB field to campaigns for custom nav/section names
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS module_labels JSONB DEFAULT '{}';

-- Add campaign_id to calendar_events for per-campaign calendar support
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS campaign_id TEXT REFERENCES campaigns(id);
