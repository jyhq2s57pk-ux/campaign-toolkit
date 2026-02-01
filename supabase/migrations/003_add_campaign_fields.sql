-- Migration: Add channels field to campaigns table
-- Phase 1 FR-01: Campaign Admin

-- Add channels field if it doesn't exist
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS channels TEXT;

-- Add activation_start_date and activation_end_date for better date handling
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS activation_start_date DATE,
ADD COLUMN IF NOT EXISTS activation_end_date DATE;

-- Seed initial campaign data
INSERT INTO campaigns (id, name, subtitle, year, scope, channels, activation_start_date, activation_end_date, activation_dates, overview)
VALUES (
  'campaign-2026',
  'The Magic of Joy Holiday Season',
  'A global celebration bringing joy to travelers worldwide',
  '2026',
  'Global',
  'Reserve & Collect (Web / APP) Emporium',
  '2025-10-01',
  '2025-12-31',
  'October-December 2025 (Activation date may vary by location)',
  'Discover the magic of the holiday season with our global campaign designed to delight and inspire.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  year = EXCLUDED.year,
  scope = EXCLUDED.scope,
  channels = EXCLUDED.channels,
  activation_start_date = EXCLUDED.activation_start_date,
  activation_end_date = EXCLUDED.activation_end_date,
  activation_dates = EXCLUDED.activation_dates,
  overview = EXCLUDED.overview;
