
-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Add RLS policies
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wishlist" 
  ON wishlists FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own wishlist" 
  ON wishlists FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own wishlist" 
  ON wishlists FOR DELETE 
  USING (auth.uid() = user_id);
