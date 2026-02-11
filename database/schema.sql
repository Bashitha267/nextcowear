-- =====================================================
-- DressCo E-Commerce Database Schema
-- Supabase/PostgreSQL Migration
-- =====================================================

-- =====================================================
-- 1. CONTENT MANAGEMENT TABLES
-- =====================================================

-- Hero Images
CREATE TABLE hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt_text TEXT,
  title TEXT,
  subtitle TEXT,
  cta_text TEXT,
  cta_link TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hero_images_active ON hero_images(is_active, display_order);

-- FAQs
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_faqs_category ON faqs(category, display_order);

-- Size Charts
CREATE TABLE size_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  product_type TEXT NOT NULL,
  chart_data JSONB NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_size_charts_category ON size_charts(category, product_type);

-- Terms and Conditions
CREATE TABLE terms_and_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  is_active BOOLEAN DEFAULT true,
  effective_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_terms_type ON terms_and_conditions(document_type, is_active);

-- =====================================================
-- 2. PRODUCT CATALOG TABLES
-- =====================================================

-- Main Categories
CREATE TABLE main_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_main_categories_slug ON main_categories(slug);

-- Sub Categories
CREATE TABLE sub_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  main_category_id UUID REFERENCES main_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(main_category_id, slug)
);

CREATE INDEX idx_sub_categories_main ON sub_categories(main_category_id, is_active);
CREATE INDEX idx_sub_categories_slug ON sub_categories(slug);

-- Colors
CREATE TABLE colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  hex_value TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_colors_active ON colors(is_active, display_order);

-- Sizes
CREATE TABLE sizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sizes_active ON sizes(is_active, display_order);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
 
  description TEXT,
  main_category_id UUID REFERENCES main_categories(id) ON DELETE SET NULL,
  sub_category_id UUID REFERENCES sub_categories(id) ON DELETE SET NULL,
  regular_price DECIMAL(10,2) NOT NULL,
 
  sale_price DECIMAL(10,2),
  sku TEXT UNIQUE,
  stock_quantity INTEGER DEFAULT 0,
  is_best_seller BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,

  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  main_image TEXT,
  additional_images TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREATE INDEX idx_products_slug ON products(slug); -- Slug removed for simplicity
CREATE INDEX idx_products_category ON products(main_category_id, sub_category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_bestseller ON products(is_best_seller) WHERE is_best_seller = true;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;

-- Product Images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id, display_order);
CREATE INDEX idx_product_images_primary ON product_images(product_id, is_primary);

-- Product Colors
CREATE TABLE product_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  color_id UUID REFERENCES colors(id) ON DELETE CASCADE,
  additional_price DECIMAL(10,2) DEFAULT 0.00,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, color_id)
);

CREATE INDEX idx_product_colors_product ON product_colors(product_id);
CREATE INDEX idx_product_colors_color ON product_colors(color_id);

-- Product Sizes
CREATE TABLE product_sizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size_id UUID REFERENCES sizes(id) ON DELETE CASCADE,
  additional_price DECIMAL(10,2) DEFAULT 0.00,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, size_id)
);

CREATE INDEX idx_product_sizes_product ON product_sizes(product_id);
CREATE INDEX idx_product_sizes_size ON product_sizes(size_id);

-- Collections
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  main_image_url TEXT,
  banner_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_collections_slug ON collections(slug);
CREATE INDEX idx_collections_active ON collections(is_active, display_order);

-- Collection Products
CREATE TABLE collection_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(collection_id, product_id)
);

CREATE INDEX idx_collection_products_collection ON collection_products(collection_id, display_order);

-- =====================================================
-- 3. USER MANAGEMENT TABLES
-- =====================================================

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Sri Lanka',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  accepts_marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);

-- Admin Users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff',
  can_manage_products BOOLEAN DEFAULT false,
  can_manage_orders BOOLEAN DEFAULT false,
  can_manage_users BOOLEAN DEFAULT false,
  can_manage_content BOOLEAN DEFAULT false,
  can_view_analytics BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);

-- =====================================================
-- 4. REVIEWS TABLES
-- =====================================================

-- Site Reviews
CREATE TABLE site_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_site_reviews_approved ON site_reviews(is_approved, created_at DESC);
CREATE INDEX idx_site_reviews_featured ON site_reviews(is_featured) WHERE is_featured = true;

-- Product Reviews
CREATE TABLE product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_id UUID,
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_reviews_product ON product_reviews(product_id, is_approved);
CREATE INDEX idx_product_reviews_user ON product_reviews(user_id);
CREATE INDEX idx_product_reviews_rating ON product_reviews(rating);

-- =====================================================
-- 5. ORDERS AND TRANSACTIONS TABLES
-- =====================================================

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  primary_phone TEXT NOT NULL,
  secondary_phone TEXT,
  shipping_address_line1 TEXT NOT NULL,
  shipping_address_line2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_postal_code TEXT,
  shipping_country TEXT DEFAULT 'Sri Lanka',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0.00,
  tax DECIMAL(10,2) DEFAULT 0.00,
  discount DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  payment_reference TEXT,
  paid_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending',
  tracking_number TEXT,
  courier_service TEXT,
  customer_notes TEXT,
  admin_notes TEXT,
  confirmed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status, created_at DESC);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Add foreign key for product_reviews
ALTER TABLE product_reviews ADD CONSTRAINT fk_product_reviews_order 
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  product_image_url TEXT,
  color_id UUID REFERENCES colors(id) ON DELETE SET NULL,
  size_id UUID REFERENCES sizes(id) ON DELETE SET NULL,
  color_name TEXT,
  size_name TEXT,
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Order Status History
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  changed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_status_history_order ON order_status_history(order_id, created_at DESC);

-- =====================================================
-- 6. INITIAL DATA POPULATION
-- =====================================================

-- Insert Sri Lankan Clothing Colors
INSERT INTO colors (name, hex_value, display_order) VALUES
  ('Pure White', '#FFFFFF', 1),
  ('Ivory', '#FFFFF0', 2),
  ('Cream', '#FFFDD0', 3),
  ('Beige', '#F5F5DC', 4),
  ('Light Grey', '#D3D3D3', 5),
  ('Charcoal', '#36454F', 6),
  ('Black', '#000000', 7),
  ('Navy Blue', '#000080', 8),
  ('Royal Blue', '#4169E1', 9),
  ('Sky Blue', '#87CEEB', 10),
  ('Teal', '#008080', 11),
  ('Forest Green', '#228B22', 12),
  ('Olive Green', '#808000', 13),
  ('Burgundy', '#800020', 14),
  ('Maroon', '#800000', 15),
  ('Wine Red', '#722F37', 16),
  ('Coral Pink', '#FF6F61', 17),
  ('Peach', '#FFDAB9', 18),
  ('Mustard Yellow', '#FFDB58', 19),
  ('Terracotta', '#E2725B', 20);

-- Insert Standard Sizes
INSERT INTO sizes (name, display_order) VALUES
  ('XS', 1),
  ('S', 2),
  ('M', 3),
  ('L', 4),
  ('XL', 5),
  ('XXL', 6),
  ('XXXL', 7);

-- =====================================================
-- 7. TRIGGERS AND FUNCTIONS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER update_hero_images_updated_at BEFORE UPDATE ON hero_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_size_charts_updated_at BEFORE UPDATE ON size_charts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_terms_updated_at BEFORE UPDATE ON terms_and_conditions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_main_categories_updated_at BEFORE UPDATE ON main_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sub_categories_updated_at BEFORE UPDATE ON sub_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_reviews_updated_at BEFORE UPDATE ON site_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate order numbers
CREATE SEQUENCE order_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Update product rating on review submission
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM product_reviews
      WHERE product_id = NEW.product_id AND is_approved = true
    ),
    review_count = (
      SELECT COUNT(*)
      FROM product_reviews
      WHERE product_id = NEW.product_id AND is_approved = true
    )
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_rating_on_review AFTER INSERT OR UPDATE ON product_reviews
  FOR EACH ROW WHEN (NEW.is_approved = true)
  EXECUTE FUNCTION update_product_rating();

-- =====================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_own_data ON users
  FOR ALL
  USING (auth.uid() = id);

-- Users can only see their own orders
CREATE POLICY users_own_orders ON orders
  FOR SELECT
  USING (user_id = auth.uid());

-- Admin users can see everything
CREATE POLICY admin_all_access ON orders
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- =====================================================
-- SCHEMA MIGRATION COMPLETE
-- =====================================================
