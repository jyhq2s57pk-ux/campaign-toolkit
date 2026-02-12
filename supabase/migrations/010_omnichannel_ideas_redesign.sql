-- Migration 010: Omnichannel Ideas Redesign
-- Extends omnichannel_ideas table with new fields for the redesigned page:
-- channels (touchpoint badges), modal content fields, multiple images

-- Channel badges: stored as TEXT[] array, e.g. {"Web","App","In-Store"}
ALTER TABLE omnichannel_ideas ADD COLUMN IF NOT EXISTS channels TEXT[] DEFAULT '{}';

-- Modal: split title into headline (purple) + subtitle (dark)
ALTER TABLE omnichannel_ideas ADD COLUMN IF NOT EXISTS headline TEXT;
ALTER TABLE omnichannel_ideas ADD COLUMN IF NOT EXISTS sub_headline TEXT;

-- Modal: "How it works" block
ALTER TABLE omnichannel_ideas ADD COLUMN IF NOT EXISTS how_it_works_title TEXT DEFAULT 'How it works';
ALTER TABLE omnichannel_ideas ADD COLUMN IF NOT EXISTS how_it_works_steps TEXT[] DEFAULT '{}';

-- Modal: multiple images (array of URLs)
ALTER TABLE omnichannel_ideas ADD COLUMN IF NOT EXISTS modal_images TEXT[] DEFAULT '{}';

-- Backfill existing rows with sample channel data
UPDATE omnichannel_ideas SET channels = '{"App","Web"}' WHERE title = 'Balloon Modelling + Loyalty Boost';
UPDATE omnichannel_ideas SET channels = '{"In-Store","App"}' WHERE title = 'Barcode Magic Reveal';
UPDATE omnichannel_ideas SET channels = '{"In-Store"}' WHERE title = 'Tasting Bar Illusion';
UPDATE omnichannel_ideas SET channels = '{"In-Store","Social"}' WHERE title = 'Origami Perfume Art';
UPDATE omnichannel_ideas SET channels = '{"In-Store","Loyalty"}' WHERE title = 'Face Painting Perks';
UPDATE omnichannel_ideas SET channels = '{"Email","Social"}' WHERE title = 'The Great Postcard Adventure';
UPDATE omnichannel_ideas SET channels = '{"In-Store","App"}' WHERE title = 'Surfside Buzz Wire Challenge';
UPDATE omnichannel_ideas SET channels = '{"In-Store","Social"}' WHERE title = 'Sunset Surf Balance Challenge';

-- Backfill headlines and descriptions for modal
UPDATE omnichannel_ideas SET
  headline = 'Balloon Modelling:',
  sub_headline = 'Turn Every Store Visit into a Loyalty-Boosting Experience',
  how_it_works_steps = '{"Customers pick their favourite balloon shape at the activation stand","Artist creates custom balloon art tagged with a scannable QR code","Scanning the QR enrols them in the loyalty programme instantly","Customers leave with a fun memento and a new loyalty membership"}'
WHERE title = 'Balloon Modelling + Loyalty Boost';

UPDATE omnichannel_ideas SET
  headline = 'Barcode Magic:',
  sub_headline = 'Surprise Guests with a Mind-Blowing Product Barcode Trick',
  how_it_works_steps = '{"A magician invites a customer to pick a number","The chosen number magically appears from a product barcode","The wow moment creates buzz and drives social sharing","Encourages customers to explore products on display"}'
WHERE title = 'Barcode Magic Reveal';

UPDATE omnichannel_ideas SET
  headline = 'Tasting Bar:',
  sub_headline = 'Engage Curious Minds with the Impossible Cups Puzzle',
  how_it_works_steps = '{"Set up a tasting bar with an interactive magic puzzle","Customers try to solve the Impossible Cups challenge","Successful participants win a tasting sample","Creates a memorable and shareable experience at any tasting station"}'
WHERE title = 'Tasting Bar Illusion';

UPDATE omnichannel_ideas SET
  headline = 'Origami Art:',
  sub_headline = 'Elevate Fragrance Demos with Beautiful Folded Artwork',
  how_it_works_steps = '{"Perfume artist creates elegant origami art at the counter","Fragrance is sprayed onto the folded artwork for a sensory demo","Customers take home the scented origami as a keepsake","Memorable, elegant, and perfectly gift-ready"}'
WHERE title = 'Origami Perfume Art';

UPDATE omnichannel_ideas SET
  headline = 'Face Painting:',
  sub_headline = 'Offer Artistic Face Painting Linked to Product Perks',
  how_it_works_steps = '{"Customers receive face painting at the activation stand","Designs are linked to product purchase incentives","Photo print-outs of their designs create shareable moments","Drives smiles, footfall, and sales simultaneously"}'
WHERE title = 'Face Painting Perks';

UPDATE omnichannel_ideas SET
  headline = 'Postcard Adventure:',
  sub_headline = 'Pick a Postcard, Reveal Your Prize, and Share the Sunshine',
  how_it_works_steps = '{"Customers pick a postcard from the display","Scratch to reveal a hidden prize or discount","Write a message and send it to someone they love","Creates a warm summer memory tied to the brand"}'
WHERE title = 'The Great Postcard Adventure';

UPDATE omnichannel_ideas SET
  headline = 'Buzz Wire:',
  sub_headline = 'Steady Hands Win Big at the Surfside Challenge',
  how_it_works_steps = '{"Customers attempt the Surfside Buzz Wire challenge","Navigate the wire without setting off the buzzer","Reach the finish line to win cool prizes","Generates excitement, dwell time, and social content"}'
WHERE title = 'Surfside Buzz Wire Challenge';

UPDATE omnichannel_ideas SET
  headline = 'Surf Balance:',
  sub_headline = 'Balance the Umbrella and Win Summer Prizes',
  how_it_works_steps = '{"Customers balance the umbrella on the surfboard","Hold the pose for the longest time to win","Prizes awarded to the best balancers","Share your fun summer moments with friends and family"}'
WHERE title = 'Sunset Surf Balance Challenge';
