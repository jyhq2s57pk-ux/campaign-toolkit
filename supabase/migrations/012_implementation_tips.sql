-- Create implementation_tips table for editable tips on Ways of Working page
CREATE TABLE IF NOT EXISTS implementation_tips (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    campaign_id TEXT REFERENCES campaigns(id),
    text TEXT NOT NULL,
    sort_order INT DEFAULT 1,
    is_new BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE implementation_tips ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read" ON implementation_tips
    FOR SELECT USING (true);

-- Allow authenticated write
CREATE POLICY "Allow authenticated write" ON implementation_tips
    FOR ALL USING (true) WITH CHECK (true);
