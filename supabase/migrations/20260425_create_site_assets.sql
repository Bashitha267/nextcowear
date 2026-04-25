-- Table to store dynamic images for various website sections
CREATE TABLE site_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_key TEXT NOT NULL, -- 'hero', 'why_us', 'about_us', 'women_collection', 'men_collection', 'kids_collection'
    asset_type TEXT DEFAULT 'image', -- 'image', 'video'
    image_url TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    cta_text TEXT,
    cta_link TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups by section
CREATE INDEX idx_site_assets_section ON site_assets(section_key);

-- Policy to allow public read access
ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON site_assets FOR SELECT USING (true);

-- Policy to allow authenticated admins to manage assets (assuming admin role or similar)
-- For now, let's allow all authenticated users if you don't have a specific admin check in SQL
CREATE POLICY "Allow authenticated management" ON site_assets FOR ALL USING (auth.role() = 'authenticated');
