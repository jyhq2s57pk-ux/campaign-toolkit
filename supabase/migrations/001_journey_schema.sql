-- Customer Journey CMS Database Schema
-- Run these commands in your Supabase SQL Editor

-- =============================================
-- STEP 1: Create journey_pages table
-- =============================================
CREATE TABLE journey_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  platform_type TEXT NOT NULL DEFAULT 'Web',
  accent_color TEXT DEFAULT '#22c55e',
  screenshot_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE journey_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on journey_pages"
  ON journey_pages FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage journey_pages"
  ON journey_pages FOR ALL USING (true);

-- =============================================
-- STEP 2: Create journey_components table
-- =============================================
CREATE TABLE journey_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES journey_pages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  tier_premium BOOLEAN DEFAULT false,
  tier_executive BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_optional BOOLEAN DEFAULT false,
  marker_number INTEGER DEFAULT 1,
  marker_y_position INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE journey_components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on journey_components"
  ON journey_components FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage journey_components"
  ON journey_components FOR ALL USING (true);

-- =============================================
-- STEP 3: Create indexes for performance
-- =============================================
CREATE INDEX idx_journey_pages_sort_order ON journey_pages(sort_order);
CREATE INDEX idx_journey_components_page_id ON journey_components(page_id);
CREATE INDEX idx_journey_components_sort_order ON journey_components(sort_order);
