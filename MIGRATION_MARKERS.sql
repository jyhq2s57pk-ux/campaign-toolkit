-- Run this in Supabase SQL Editor to add marker_positions column
-- This allows storing multiple marker positions per component as a JSONB array

ALTER TABLE journey_components 
ADD COLUMN IF NOT EXISTS marker_positions JSONB DEFAULT '[]'::jsonb;

-- Example format: [{"number": 1, "top": "25%", "left": "70%"}]
