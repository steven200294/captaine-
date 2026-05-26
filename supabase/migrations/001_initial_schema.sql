-- Migration: 001_initial_schema
-- The Captain Boat - Complete database schema

-- Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'refunded')),
  cruise_date DATE,
  cruise_time TEXT,
  total_amount INT NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  pdf_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(email);
CREATE INDEX IF NOT EXISTS idx_reservations_order_number ON reservations(order_number);
CREATE INDEX IF NOT EXISTS idx_reservations_stripe_pi ON reservations(stripe_payment_intent_id);

-- Reservation items
CREATE TABLE IF NOT EXISTS reservation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  product_title TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  adult_count INT NOT NULL DEFAULT 0,
  child_count INT NOT NULL DEFAULT 0,
  unit_price INT NOT NULL,
  total_price INT NOT NULL,
  premium_options JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reservation_items_reservation ON reservation_items(reservation_id);

-- QR code batches
CREATE TABLE IF NOT EXISTS qr_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imported_by TEXT NOT NULL,
  adult_count INT NOT NULL DEFAULT 0,
  child_count INT NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- QR codes
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('adult', 'child')),
  status TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'assigned', 'used', 'expired')),
  batch_id UUID REFERENCES qr_batches(id),
  reservation_id UUID REFERENCES reservations(id),
  assigned_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qr_codes_status_type ON qr_codes(status, type);
CREATE INDEX IF NOT EXISTS idx_qr_codes_reservation ON qr_codes(reservation_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_code ON qr_codes(code);

-- eSIM orders
CREATE TABLE IF NOT EXISTS esim_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  provider_order_id TEXT,
  license_cli TEXT,
  iccid TEXT,
  qr_code_url TEXT,
  activation_code TEXT,
  smdp_address TEXT,
  ios_link TEXT,
  package_type TEXT NOT NULL CHECK (package_type IN ('3gb', '10gb')),
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'provisioned', 'activated', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_esim_orders_reservation ON esim_orders(reservation_id);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  badge_text TEXT,
  badge_color TEXT,
  adult_price INT NOT NULL,
  adult_old_price INT,
  child_price INT,
  child_old_price INT,
  child_note TEXT,
  is_pack BOOLEAN DEFAULT FALSE,
  has_esim BOOLEAN DEFAULT FALSE,
  esim_package TEXT CHECK (esim_package IN ('3gb', '10gb')),
  has_macarons BOOLEAN DEFAULT FALSE,
  duration TEXT,
  location TEXT,
  main_image TEXT,
  thumbnails JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  premium_options JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Admin users
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'admin'
    CHECK (role IN ('admin', 'validator', 'super_admin')),
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Promo codes
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INT NOT NULL,
  max_uses INT,
  current_uses INT DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  active BOOLEAN DEFAULT TRUE,
  stripe_coupon_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);

-- Chat sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT NOT NULL,
  messages JSONB DEFAULT '[]',
  actions_taken JSONB DEFAULT '[]',
  converted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed products from the existing catalog
INSERT INTO products (slug, title, description, badge_text, badge_color, adult_price, adult_old_price, child_price, child_old_price, child_note, is_pack, has_esim, esim_package, has_macarons, duration, location, sort_order) VALUES
('croisiere-classique', 'La Croisière Classique', 'Une immersion d''une heure sur la Seine pour admirer les plus beaux monuments de Paris. Commentaires audio inclus.', 'MEILLEUR PRIX', 'green', 1700, 2000, 800, 1000, 'Moins de 4 ans : Gratuit', FALSE, FALSE, NULL, FALSE, '1 HEURE', 'PORT DE LA CONFÉRENCE', 1),
('croisiere-macarons', 'Croisière & Macarons Artisanaux', 'L''élégance de la navigation alliée à la finesse de la pâtisserie française. Macarons artisanaux inclus pour les adultes.', 'EXPÉRIENCE GOURMET', 'green', 1900, 2600, 800, 1000, 'Enfant (moins de 13 ans) : 8€ (Croisière seule) | Moins de 4 ans : Gratuit', FALSE, FALSE, NULL, TRUE, '1 HEURE', 'PORT DE LA CONFÉRENCE', 2),
('croisiere-esim', 'Croisière & eSIM Connect', 'Naviguez et restez connecté avec une eSIM 3Go valable en UK & Europe pendant 30 jours. Option réservée aux adultes.', 'MEILLEURE OFFRE', 'red', 1900, 2600, 800, 1000, 'Enfant (moins de 13 ans) : 8€ (Croisière seule) | Moins de 4 ans : Gratuit', FALSE, TRUE, '3gb', FALSE, '1 HEURE', 'PORT DE LA CONFÉRENCE', 3),
('pack-capitaine', 'Le Pack Capitaine (Complet)', 'L''offre ultime : Croisière + Macarons artisanaux + eSIM 3Go (UK & Europe, 30 jours). Macarons et eSIM pour adultes uniquement.', 'VENTE FLASH', 'red', 2500, 3200, 800, 1000, 'Enfant (moins de 13 ans) : 8€ (Croisière seule) | Moins de 4 ans : Gratuit', FALSE, TRUE, '3gb', TRUE, '1 HEURE', 'PORT DE LA CONFÉRENCE', 4),
('pack-family', 'Pack Family (2 Adultes + 2 Enfants)', 'L''offre idéale pour les familles. Comprend 4 billets Croisière + 1 coffret de 7 macarons + 2 eSIM 3Go (UK & Europe, 30 jours).', 'OFFRE FAMILLE', 'green', 6500, 9000, NULL, NULL, '4 billets Croisière + 1 coffret 7 macarons + 2 eSIM 3Go | Économie de 25€', TRUE, TRUE, '3gb', TRUE, '1 HEURE', 'PORT DE LA CONFÉRENCE', 5),
('pack-privilege', 'Pack Privilège "Expert Paris"', 'Pour les voyageurs exigeants : Croisière promenade 1h sur la Seine + eSIM 10Go (UK & Europe, 30 jours).', 'PRIVILÈGE', 'red', 2800, 3400, NULL, NULL, NULL, FALSE, TRUE, '10gb', FALSE, '1 HEURE', 'PORT DE LA CONFÉRENCE', 6)
ON CONFLICT (slug) DO NOTHING;
