-- Customer Journey Seed Data
-- Run AFTER 001_journey_schema.sql

-- =============================================
-- Insert sample pages
-- =============================================
INSERT INTO journey_pages (title, slug, platform_type, accent_color, sort_order) VALUES
  ('Homepage', 'homepage', 'Web', '#a855f7', 1),
  ('Gifting Content Landing Page', 'gifting-content-landing-page', 'Web', '#22c55e', 2),
  ('Category Landing Page', 'category-landing-page', 'Web', '#3b82f6', 3),
  ('Product Detail Page', 'product-detail-page', 'Web', '#f97316', 4),
  ('Shopping Home', 'shopping-home', 'App', '#ec4899', 5),
  ('Check-out & Shopping Bag', 'checkout-shopping-bag', 'Web', '#14b8a6', 6),
  ('Top & Mega Menu', 'top-mega-menu', 'Web', '#6366f1', 7),
  ('Search', 'search', 'Web', '#eab308', 8);

-- =============================================
-- Insert components for Gifting Content Landing Page
-- =============================================
WITH gifting_page AS (
  SELECT id FROM journey_pages WHERE slug = 'gifting-content-landing-page'
)
INSERT INTO journey_components (page_id, title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order)
SELECT 
  (SELECT id FROM gifting_page),
  title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order
FROM (VALUES
  ('Gifting Hero Banner', 'To be linked to a PLP with all Xmas assortment. Headline: Style the season with perfect gifts. Subhead: Discover holiday gifts for your loved ones.', true, true, false, false, 1, 1),
  ('Gifting Carousel', 'Including beauty gift sets (See special SKUs from assortment page). Title: Exclusive Gifting Sets for your loved ones.', true, true, false, false, 2, 2),
  ('Gift Finder Tool', 'Linking to the new tool—available soon! Whether you are shopping for family, friends, or colleagues, we will help you find a present that truly delights.', true, true, true, false, 3, 3),
  ('Triple Content Blocks', 'Update with new images and linking to: Festive Spirits to Celebrate (Special Spirits PLP), Sparkling Accessories Gifts (Special Accessories PLP), Exclusive Gifting Sets (Special Spirits PLP). Section title: Holiday Gift Highlights.', true, true, false, false, 4, 4),
  ('Product Selections', 'To be included in an Adobe Target component featuring the most viewed product based on: Fragrance for her, Fragrance for him, Toys, Watches for her, Watches for him, Ferrero Rocher/Lindt, Nougat, Champagne, Wine, Local Food.', true, true, true, false, 5, 5),
  ('Gifting Dual Content Blocks', 'Update with new images. Section title: The magic of finding the perfect gift for them.', true, true, false, false, 6, 6),
  ('Gifting In-Store Activations', 'This module is optional to include information about what is happening in our stores. Taste the magic - complimentary gift wrapping, exclusive tasting experiences, and personalized shopping assistance.', true, false, false, true, 7, 7)
) AS t(title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order);

-- =============================================
-- Insert components for Homepage
-- =============================================
WITH homepage AS (
  SELECT id FROM journey_pages WHERE slug = 'homepage'
)
INSERT INTO journey_components (page_id, title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order)
SELECT 
  (SELECT id FROM homepage),
  title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order
FROM (VALUES
  ('Hero Banner', 'Main campaign visual with CTA linking to Gifting Content Landing Page. Headline: Season of Joy - Find the perfect gift.', true, true, false, false, 1, 1),
  ('Promobar', 'Highlights key member benefits and seasonal promotions. Example: Members save 15% on gifts.', true, true, false, false, 2, 2),
  ('Most Popular Carousel', 'Features campaign SKUs based on popularity. Dynamic content powered by Adobe Target.', true, true, false, false, 3, 3),
  ('Whats Trending Carousel', 'Features trending campaign items based on real-time data.', true, false, false, false, 4, 4),
  ('Editorial Banners', 'Reinforce the campaign narrative with seasonal editorial content.', true, true, false, true, 5, 5)
) AS t(title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order);

-- =============================================
-- Insert components for Category Landing Page
-- =============================================
WITH category_page AS (
  SELECT id FROM journey_pages WHERE slug = 'category-landing-page'
)
INSERT INTO journey_components (page_id, title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order)
SELECT 
  (SELECT id FROM category_page),
  title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order
FROM (VALUES
  ('CLP Hero Banner', 'Campaign-led hero with adaptive copy for members and non-members.', true, true, false, false, 1, 1),
  ('Dual Content Blocks', 'Highlight key categories with seasonal imagery.', true, true, false, false, 2, 2),
  ('Triple Content Blocks', 'Three category tiles linking to specific PLPs.', true, true, false, false, 3, 3),
  ('Curated PLP', 'Tailored product listings surfacing curated assortments.', true, false, false, false, 4, 4)
) AS t(title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order);

-- =============================================
-- Insert components for Product Detail Page
-- =============================================
WITH pdp AS (
  SELECT id FROM journey_pages WHERE slug = 'product-detail-page'
)
INSERT INTO journey_components (page_id, title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order)
SELECT 
  (SELECT id FROM pdp),
  title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order
FROM (VALUES
  ('Marketing Banner', 'Cross-sell campaign assortments with contextual banners.', true, true, false, false, 1, 1),
  ('Product Bundles', 'Optional product bundles adding value for gift-givers.', true, true, false, true, 2, 2),
  ('Related Products', 'Show related items from the campaign collection.', true, false, false, false, 3, 3)
) AS t(title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order);

-- =============================================
-- Insert components for Shopping Home (App)
-- =============================================
WITH app_home AS (
  SELECT id FROM journey_pages WHERE slug = 'shopping-home'
)
INSERT INTO journey_components (page_id, title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order)
SELECT 
  (SELECT id FROM app_home),
  title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order
FROM (VALUES
  ('App Hero Banner', 'Full-width campaign visual optimized for mobile.', true, true, false, false, 1, 1),
  ('Push Notification', 'Trigger campaign-related push notifications.', true, true, true, false, 2, 2),
  ('In-App Carousel', 'Showcase gift ideas in a swipeable carousel.', true, true, false, false, 3, 3),
  ('Member Exclusive Section', 'Highlight member-only deals and early access.', true, false, false, false, 4, 4),
  ('Quick Actions', 'Add quick action buttons for Gift Finder and Top Picks.', true, true, true, false, 5, 5),
  ('Bottom Navigation', 'Update bottom nav with campaign-themed icons.', true, true, false, true, 6, 6)
) AS t(title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order);

-- =============================================
-- Insert components for Search
-- =============================================
WITH search_page AS (
  SELECT id FROM journey_pages WHERE slug = 'search'
)
INSERT INTO journey_components (page_id, title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order)
SELECT 
  (SELECT id FROM search_page),
  title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order
FROM (VALUES
  ('Search Redirects', 'Campaign search terms redirect to campaign PLPs.', true, true, false, false, 1, 1),
  ('Boosted Results', 'Priority SKUs boosted in search results.', true, false, false, false, 2, 2)
) AS t(title, description, tier_premium, tier_executive, is_new, is_optional, marker_number, sort_order);
