-- Jalankan SQL ini di Supabase SQL Editor (https://supabase.com/dashboard/project/xxx/sql/new)

-- 1. HERO CONTENT
CREATE TABLE IF NOT EXISTS hero_content (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  badge_text TEXT DEFAULT '✨ Jual website, bukan jasa koding',
  headline TEXT DEFAULT 'Ingin punya website\npribadi / usaha\ntapi ga mau ribet?',
  subheadline_text TEXT DEFAULT 'order di webkalcer aja! 🤙',
  cta_text TEXT DEFAULT 'Mulai dari 300rb ↓',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed hero (skip if already seeded)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM hero_content LIMIT 1) THEN
    INSERT INTO hero_content (badge_text, headline, subheadline_text, cta_text)
    VALUES (
      '✨ Jual website, bukan jasa koding',
      'Ingin punya website\npribadi / usaha\ntapi ga mau ribet?',
      'order di webkalcer aja! 🤙',
      'Mulai dari 300rb ↓'
    );
  END IF;
END $$;

-- 2. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quote TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed testimonials (skip if already seeded)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1) THEN
    INSERT INTO testimonials (quote, name, role, sort_order) VALUES
      ('Makasih kak webkalcer, websitenya keren banget! Baru 1 hari udah online. Pelayanannya ramah banget.', 'Andi', 'Pemilik Toko Online', 1),
      ('Ga nyangka semudah ini bikin website. Tinggal kirim konten, besoknya jadi. Recomended banget kakak.', 'Sari', 'Freelancer', 2),
      ('Harga murah, kualitas premium. Domain + SSL gratis. Pelayanannya super santai dan ga ribet.', 'Budi', 'Pemilik Kedai Kopi', 3),
      ('Website portofolioku jadi kelihatan profesional banget. Makin gampang dapet klien baru. Makasih kak!', 'Rina', 'Content Creator', 4);
  END IF;
END $$;

-- 3. PORTFOLIOS
CREATE TABLE IF NOT EXISTS portfolios (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  tag TEXT NOT NULL,
  url TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed portfolios (skip if already seeded)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM portfolios LIMIT 1) THEN
    INSERT INTO portfolios (title, tag, url, sort_order) VALUES
      ('Toko Online — Baju Muslim', 'UMKM', '', 1),
      ('Portofolio — Fotografer', 'Personal Branding', '', 2),
      ('Profil — Klinik Gigi', 'Bisnis', '', 3),
      ('Landing Page — Catering', 'UMKM', '', 4);
  END IF;
END $$;

-- 4. SEO SETTINGS
CREATE TABLE IF NOT EXISTS seo_settings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  page TEXT DEFAULT 'home' UNIQUE,
  title TEXT NOT NULL DEFAULT 'Webkalcer — Jasa Website Murah untuk UMKM & Personal Branding',
  description TEXT NOT NULL DEFAULT 'Jasa website murah Rp300ribu aja! Free domain, SSL, hosting. Tinggal chat, websitemu online. Untuk UMKM, personal branding, portofolio. Ga perlu ngoding.',
  keywords TEXT[] DEFAULT '{"jasa website murah","website UMKM","personal branding","buat website murah","webkalcer"}',
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  favicon_url TEXT DEFAULT '/favicon.svg',
  google_tag TEXT DEFAULT '',
  head_scripts TEXT DEFAULT '',
  phone TEXT DEFAULT '6285792721649',
  email TEXT DEFAULT 'halo@webkalcer.com',
  wa_message TEXT DEFAULT 'Halo kak, saya mau buat website di webkalcer.com , bisa dibantu?',
  midtrans_server_key_enc TEXT DEFAULT '',
  midtrans_client_key_enc TEXT DEFAULT '',
  midtrans_is_production BOOLEAN DEFAULT FALSE,
  logo_url TEXT DEFAULT '',
  sitename TEXT DEFAULT 'Webkalcer',
  proposal_company_name TEXT DEFAULT 'Webkalcer.com',
  proposal_title TEXT DEFAULT 'PROPOSAL',
  proposal_slogan_id TEXT DEFAULT 'Jasa Website Murah untuk UMKM & Personal Branding',
  proposal_slogan_en TEXT DEFAULT 'Affordable Website Services for UMKM & Personal Branding',
  proposal_logo_url TEXT DEFAULT '',
  proposal_opening_id TEXT DEFAULT 'Terima kasih atas ketertarikan Anda terhadap layanan pembuatan website kami. Bersama ini kami sampaikan proposal penawaran yang telah disesuaikan dengan kebutuhan Anda.',
  proposal_opening_en TEXT DEFAULT 'Thank you for your interest in our website development services. We are pleased to submit this proposal outlining our recommended solution tailored to your needs.',
  proposal_closing_id TEXT DEFAULT 'Silakan konfirmasi penerimaan proposal ini dengan menandatangani di bawah. Setelah disetujui, kami akan segera memulai proses pengembangan.',
  proposal_closing_en TEXT DEFAULT 'Please confirm your acceptance of this proposal by signing below. Once approved, we will begin the development process immediately.',
  proposal_terms_id TEXT DEFAULT '',
  proposal_terms_en TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed SEO
INSERT INTO seo_settings (page) VALUES ('home') ON CONFLICT (page) DO NOTHING;

-- 5. PAGE VISITS
CREATE TABLE IF NOT EXISTS page_visits (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  page TEXT NOT NULL,
  visitor_id TEXT,
  user_agent TEXT,
  country TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ANALYTICS EVENTS (WA clicks, email clicks)
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'wa_click', 'email_click'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migrations: add missing columns to seo_settings (safe to re-run)
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS og_title TEXT;
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS og_description TEXT;
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS og_image_url TEXT;
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS favicon_url TEXT DEFAULT '/favicon.svg';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS google_tag TEXT DEFAULT '';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS head_scripts TEXT DEFAULT '';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '6285792721649';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS email TEXT DEFAULT 'halo@webkalcer.com';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS wa_message TEXT DEFAULT 'Halo kak, saya mau buat website di webkalcer.com , bisa dibantu?';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS midtrans_server_key_enc TEXT DEFAULT '';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS midtrans_client_key_enc TEXT DEFAULT '';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS midtrans_is_production BOOLEAN DEFAULT FALSE;
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT '';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS sitename TEXT DEFAULT 'Webkalcer';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS proposal_company_name TEXT DEFAULT 'Webkalcer.com';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS proposal_title TEXT DEFAULT 'PROPOSAL';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS proposal_slogan_id TEXT DEFAULT 'Jasa Website Murah untuk UMKM & Personal Branding';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS proposal_slogan_en TEXT DEFAULT 'Affordable Website Services for UMKM & Personal Branding';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS proposal_logo_url TEXT DEFAULT '';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS proposal_opening_id TEXT DEFAULT 'Terima kasih atas ketertarikan Anda terhadap layanan pembuatan website kami. Bersama ini kami sampaikan proposal penawaran yang telah disesuaikan dengan kebutuhan Anda.';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS proposal_opening_en TEXT DEFAULT 'Thank you for your interest in our website development services. We are pleased to submit this proposal outlining our recommended solution tailored to your needs.';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS proposal_closing_id TEXT DEFAULT 'Silakan konfirmasi penerimaan proposal ini dengan menandatangani di bawah. Setelah disetujui, kami akan segera memulai proses pengembangan.';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS proposal_closing_en TEXT DEFAULT 'Please confirm your acceptance of this proposal by signing below. Once approved, we will begin the development process immediately.';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS proposal_terms_id TEXT DEFAULT '';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS proposal_terms_en TEXT DEFAULT '';

-- Add VA payment columns to invoices (for manual VA payments)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS va_bank TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS va_number TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax_percentage NUMERIC(5,2) NOT NULL DEFAULT 0;
ALTER TABLE invoice_items ADD COLUMN IF NOT EXISTS package_id BIGINT REFERENCES packages(id) ON DELETE SET NULL;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
UPDATE invoices SET paid_at = updated_at WHERE status = 'paid' AND paid_at IS NULL;

-- 7. INVOICES
CREATE TABLE IF NOT EXISTS invoices (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax NUMERIC(12,2) NOT NULL DEFAULT 0,
  grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'draft',
  midtrans_order_id TEXT,
  midtrans_transaction_id TEXT,
  midtrans_snap_token TEXT,
  va_bank TEXT,
  va_number TEXT,
  tax_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  notes TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INVOICE ITEMS
CREATE TABLE IF NOT EXISTS invoice_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  invoice_id BIGINT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  package_id BIGINT REFERENCES packages(id) ON DELETE SET NULL
);

-- 9. PACKAGES (catalog packages for clients)
CREATE TABLE IF NOT EXISTS packages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  catalog_url TEXT DEFAULT '',
  thumbnail_url TEXT DEFAULT '',
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  promo NUMERIC(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  features JSONB DEFAULT '[]'::jsonb,
  tagline TEXT DEFAULT '',
  price_note TEXT DEFAULT '',
  note TEXT DEFAULT '',
  badge TEXT DEFAULT '',
  icon TEXT DEFAULT '📦',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricelist display columns (safe to re-run)
ALTER TABLE packages ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS tagline TEXT DEFAULT '';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS price_note TEXT DEFAULT '';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS note TEXT DEFAULT '';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS badge TEXT DEFAULT '';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '📦';

-- Enable Row Level Security (RLS)
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Public read access for homepage
DROP POLICY IF EXISTS "Public read hero" ON hero_content;
CREATE POLICY "Public read hero" ON hero_content FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Public read portfolios" ON portfolios;
CREATE POLICY "Public read portfolios" ON portfolios FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Public read seo" ON seo_settings;
CREATE POLICY "Public read seo" ON seo_settings FOR SELECT USING (TRUE);

-- Authenticated users can do all operations
DROP POLICY IF EXISTS "Auth all hero" ON hero_content;
CREATE POLICY "Auth all hero" ON hero_content FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Auth all testimonials" ON testimonials;
CREATE POLICY "Auth all testimonials" ON testimonials FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Auth all portfolios" ON portfolios;
CREATE POLICY "Auth all portfolios" ON portfolios FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Auth all seo" ON seo_settings;
CREATE POLICY "Auth all seo" ON seo_settings FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Auth read visits" ON page_visits;
CREATE POLICY "Auth read visits" ON page_visits FOR SELECT TO authenticated USING (TRUE);
DROP POLICY IF EXISTS "Auth read events" ON analytics_events;
CREATE POLICY "Auth read events" ON analytics_events FOR SELECT TO authenticated USING (TRUE);

-- Public can insert visits & events (for analytics)
DROP POLICY IF EXISTS "Public insert visits" ON page_visits;
CREATE POLICY "Public insert visits" ON page_visits FOR INSERT WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Public insert events" ON analytics_events;
CREATE POLICY "Public insert events" ON analytics_events FOR INSERT WITH CHECK (TRUE);

-- RLS for packages
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Auth all packages" ON packages;
CREATE POLICY "Auth all packages" ON packages FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Public read packages" ON packages;
CREATE POLICY "Public read packages" ON packages FOR SELECT USING (TRUE);

-- RLS for invoices & invoice_items
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Auth all invoices" ON invoices;
CREATE POLICY "Auth all invoices" ON invoices FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Auth all invoice_items" ON invoice_items;
CREATE POLICY "Auth all invoice_items" ON invoice_items FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Public read invoices" ON invoices;
CREATE POLICY "Public read invoices" ON invoices FOR SELECT USING (TRUE);

-- 10. STORAGE BUCKET for images (logo, OG image, favicon)
INSERT INTO storage.buckets (id, name, public) VALUES ('webkalcer-images', 'webkalcer-images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to bucket
DROP POLICY IF EXISTS "Auth upload images 2hpxmz" ON storage.objects;
CREATE POLICY "Auth upload images 2hpxmz"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'webkalcer-images');

-- Allow authenticated users to update/delete
DROP POLICY IF EXISTS "Auth update images 2hpxmz" ON storage.objects;
CREATE POLICY "Auth update images 2hpxmz"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'webkalcer-images');

DROP POLICY IF EXISTS "Auth delete images 2hpxmz" ON storage.objects;
CREATE POLICY "Auth delete images 2hpxmz"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'webkalcer-images');

-- Public read for all images
DROP POLICY IF EXISTS "Public read images 2hpxmz" ON storage.objects;
CREATE POLICY "Public read images 2hpxmz"
  ON storage.objects FOR SELECT USING (bucket_id = 'webkalcer-images');

-- 11. PROPOSALS
CREATE TABLE IF NOT EXISTS proposals (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  proposal_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  tax NUMERIC(12,2) NOT NULL DEFAULT 0,
  grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  language TEXT DEFAULT 'id',
  status TEXT DEFAULT 'draft',
  notes TEXT,
  signature_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migrations: add columns for existing databases
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'id';
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS tax_percentage NUMERIC(5,2) NOT NULL DEFAULT 0;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS tax NUMERIC(12,2) NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS proposal_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  proposal_id BIGINT NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  package_id BIGINT REFERENCES packages(id) ON DELETE SET NULL
);

ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Auth all proposals" ON proposals;
CREATE POLICY "Auth all proposals" ON proposals FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Auth all proposal_items" ON proposal_items;
CREATE POLICY "Auth all proposal_items" ON proposal_items FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Public read proposals" ON proposals;
CREATE POLICY "Public read proposals" ON proposals FOR SELECT USING (TRUE);
