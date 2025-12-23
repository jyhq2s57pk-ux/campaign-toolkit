-- Add new columns to touchpoints table for image and marker positions

-- Add image_url column to store the image URL
ALTER TABLE touchpoints ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add marker_positions column to store JSON array of marker positions
-- Format: [{"number": 1, "top": "20%", "left": "30%"}, ...]
ALTER TABLE touchpoints ADD COLUMN IF NOT EXISTS marker_positions JSONB DEFAULT '[]'::jsonb;

-- Add comment to explain the marker_positions format
COMMENT ON COLUMN touchpoints.marker_positions IS 'JSON array of marker positions with format: [{"number": 1, "top": "20%", "left": "30%"}]';
