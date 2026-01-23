-- Migration: Create omnichannel_ideas table
-- Phase 1 FR-04: Omnichannel Ideas Admin

-- Create omnichannel_ideas table
CREATE TABLE IF NOT EXISTS omnichannel_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  tag TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE omnichannel_ideas ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (development mode)
CREATE POLICY "Public read access for omnichannel_ideas" ON omnichannel_ideas FOR SELECT USING (true);
CREATE POLICY "Public insert access for omnichannel_ideas" ON omnichannel_ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for omnichannel_ideas" ON omnichannel_ideas FOR UPDATE USING (true);
CREATE POLICY "Public delete access for omnichannel_ideas" ON omnichannel_ideas FOR DELETE USING (true);

-- Seed with current hardcoded "Summer Joy Ideas"
INSERT INTO omnichannel_ideas (title, description, image_url, tag, sort_order, is_active) VALUES
(
  'Balloon Modelling + Loyalty Boost',
  'Delight customers with custom balloon shapes - each tagged with a scannable loyalty QR code to drive sign-ups.',
  '/src/assets/omni/gen/balloon.png',
  'Loyalty',
  1,
  true
),
(
  'Barcode Magic Reveal',
  'Surprise guests with a mind-blowing magic trick - watch their chosen number appear from a product barcode.',
  '/src/assets/omni/gen/magic.png',
  'Wow Factor',
  2,
  true
),
(
  'Tasting Bar Illusion',
  'Engage curious minds with the "Impossible Cups" puzzle - a magic moment at any tasting station.',
  '/src/assets/omni/gen/tasting.png',
  'Engagement',
  3,
  true
),
(
  'Origami Perfume Art',
  'Elevate fragrance demos by spraying onto beautiful folded origami artwork—memorable, elegant, and take-home ready.',
  '/src/assets/omni/gen/origami.png',
  'Elegant',
  4,
  true
),
(
  'Face Painting Perks',
  'Offer artistic face painting linked to a product purchase or photo print-outs of their designs creating smiles and sales.',
  '/src/assets/omni/gen/face.png',
  'Sales',
  5,
  true
),
(
  'The Great Postcard Adventure',
  'Pick a postcard, reveal your prize, and send a little sunshine to someone you love!',
  '/src/assets/omni/gen/postcard.png',
  'Summer',
  6,
  true
),
(
  'Surfside Buzz Wire Challenge',
  'Steady hands win big! Navigate the Surfside Buzz Wire, reach the finish line, and win cool prizes.',
  '/src/assets/omni/gen/buzz.png',
  'Fun',
  7,
  true
),
(
  'Sunset Surf Balance Challenge',
  'Balance the umbrella on the surfboard, win prizes, and share your fun summer moments with friends.',
  '/src/assets/omni/gen/balance.png',
  'Active',
  8,
  true
)
ON CONFLICT DO NOTHING;
