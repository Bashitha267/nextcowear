-- Initial Population Script for Site Assets
-- Use this in Supabase SQL Editor to fill all website sections with template data

-- 1. CLEAR EXISTING DATA (Optional, use with care)
-- DELETE FROM site_assets;

-- 2. HERITAGE PAGE SECTIONS
INSERT INTO site_assets (section_key, image_url, title, subtitle, description, display_order, is_active)
VALUES 
(
  'heritage_hero', 
  'https://res.cloudinary.com/drre6unbw/image/upload/v1714030000/heritage-hero.jpg', 
  'THE ISLAND HERITAGE', 
  'EST. 2024 | ISLAND SOUL', 
  'A journey of threads, traditions, and the timeless spirit of Sri Lanka. Woven with purpose, tailored for the world.', 
  0, 
  true
),
(
  'heritage_chapter_1', 
  'https://res.cloudinary.com/drre6unbw/image/upload/v1714030001/sacred-root.jpg', 
  'SACRED ROOT', 
  'CHAPTER ONE', 
  'Our story begins in the heart of the island, where the rhythm of the loom meets the whispers of ancient craftsmanship. We believe in clothing that carries a soul.', 
  0, 
  true
),
(
  'heritage_craft', 
  'https://res.cloudinary.com/drre6unbw/image/upload/v1714030002/craft-1.jpg', 
  'NATURAL PURITY', 
  'THE MATERIALS', 
  'We prioritize organic cotton and sustainable linen harvested under the Sri Lankan sun. Materials that breathe with you.', 
  0, 
  true
),
(
  'heritage_craft', 
  'https://res.cloudinary.com/drre6unbw/image/upload/v1714030003/craft-2.jpg', 
  'MASTER TAILORING', 
  'THE TECHNIQUE', 
  'Precision meets passion. Our workshop in Colombo employs master tailors who treat every seam as a work of art.', 
  1, 
  true
),
(
  'heritage_craft', 
  'https://res.cloudinary.com/drre6unbw/image/upload/v1714030004/craft-3.jpg', 
  'COMMUNITY FIRST', 
  'THE IMPACT', 
  'Beyond fashion, we build futures. Every purchase supports local education and healthcare initiatives for our weaving communities.', 
  2, 
  true
);

-- 3. WHY US PAGE SECTIONS
INSERT INTO site_assets (section_key, image_url, title, subtitle, description, display_order, is_active)
VALUES 
(
  'why_us_hero', 
  'https://res.cloudinary.com/drre6unbw/image/upload/v1714030005/why-us-hero.jpg', 
  'OUR PHILOSOPHY', 
  'THE DRESSCO WAY', 
  'Explore the foundation of our craft, from ethical sourcing to the master hands that shape our garments.', 
  0, 
  true
),
(
  'why_us_philosophy', 
  'https://res.cloudinary.com/drre6unbw/image/upload/v1714030006/philosophy.jpg', 
  'A TALE OF TWO THREADS', 
  'OUR VALUES', 
  'We believe that modern luxury should not come at the cost of the environment or the artisan. Every Dressco piece is a commitment to this balance.', 
  0, 
  true
),
(
  'why_us_fabrics', 
  'IMAGE_LINK_HERE', 
  'Island Cotton', 
  'BESTSELLER', 
  '100% long-staple cotton that gets softer with every wash. Designed for 24/7 wear in island humidity.', 
  0, 
  true
),
(
  'why_us_fabrics', 
  'IMAGE_LINK_HERE', 
  'Pure Linen', 
  'PREMIUM', 
  'Ethically sourced flax, woven into a breathable masterpiece. The undisputed king of tropical elegance.', 
  1, 
  true
),
(
  'why_us_fabrics', 
  'IMAGE_LINK_HERE', 
  'Silk Spandex', 
  'LUXURY', 
  'A touch of stretch for the perfect silhouette, with the unparalleled sheen of pure silk. Modern luxury.', 
  2, 
  true
),
(
  'why_us_craftsmanship', 
  'https://res.cloudinary.com/drre6unbw/image/upload/v1714030010/craftsmanship.jpg', 
  'THE TAILORS HANDS', 
  'MASTER ARTISTRY', 
  'In an age of mass production, we choose the slow way. Each garment is cut and sewn by a single artisan from start to finish.', 
  0, 
  true
),
(
  'why_us_quote_bg', 
  'https://res.cloudinary.com/drre6unbw/image/upload/v1714030011/quote-bg.jpg', 
  '', 
  '', 
  '', 
  0, 
  true
);

-- 4. HOME PAGE COLLECTION CARDS
INSERT INTO site_assets (section_key, image_url, title, subtitle, is_active)
VALUES 
(
  'women_collection', 
  'IMAGE_LINK_HERE', 
  'SUSTAINABLY MADE IN', 
  '100% PREMIUM SRI LANKAN-CRAFTED AND IMPORTED CLOTHING FOR WOMEN', 
  true
),
(
  'men_collection', 
  'IMAGE_LINK_HERE', 
  'EXPERTLY CRAFTED IN', 
  '100% PREMIUM SRI LANKAN-CRAFTED AND IMPORTED CLOTHING FOR MEN', 
  true
),
(
  'kids_collection', 
  'IMAGE_LINK_HERE', 
  'PLAYFULLY MADE IN', 
  '100% PREMIUM SRI LANKAN-CRAFTED AND IMPORTED CLOTHING FOR KIDS', 
  true
);
