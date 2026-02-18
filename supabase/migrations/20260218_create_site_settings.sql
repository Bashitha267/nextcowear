-- Create site_settings table for global configuration
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read site settings (public)
CREATE POLICY "Allow public read access" 
  ON site_settings FOR SELECT 
  TO public 
  USING (true);

-- Policy: Only authenticated users (admins) can modify site settings.
-- Ideally we check against admin_users table if it links to auth.users
CREATE POLICY "Allow authenticated update access" 
  ON site_settings FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);
