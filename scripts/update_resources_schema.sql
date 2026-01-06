
-- Run this in your Supabase SQL Editor to add the missing columns
ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS link TEXT,
ADD COLUMN IF NOT EXISTS detail_headline TEXT,
ADD COLUMN IF NOT EXISTS detail_content TEXT;
