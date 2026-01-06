-- Add tier_standard column to allow toggling the Standard badge
ALTER TABLE touchpoints ADD COLUMN IF NOT EXISTS tier_standard BOOLEAN DEFAULT true;
