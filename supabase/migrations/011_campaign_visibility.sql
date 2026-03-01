-- Add visibility toggle for campaigns (soft show/hide)
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
