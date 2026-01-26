-- Migration: Add hero_image_url to campaigns table
-- For uploading hero image in admin

ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

-- Update existing campaign with placeholder
UPDATE campaigns
SET hero_image_url = 'https://placehold.co/600x400'
WHERE id = 'campaign-2026' AND hero_image_url IS NULL;
