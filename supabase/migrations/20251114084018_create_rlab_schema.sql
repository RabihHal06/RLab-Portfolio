/*
  # R-Lab Portfolio Database Schema

  ## Overview
  Complete database schema for R-Lab digital portfolio showcasing:
  - Interactive resume and downloadable PDF CV
  - Business portfolio (Rabela Pastry, TrackLane, KlickT)
  - Certificates and credentials
  - AI automations and Make.com scenarios
  - Freelance projects portfolio

  ## Tables Created

  1. **admins**
     - `id` (uuid, primary key)
     - `user_id` (uuid, references auth.users)
     - `full_name` (text)
     - `role` (text, default 'admin')
     - `created_at`, `updated_at` (timestamptz)

  2. **site_settings**
     - `id` (uuid, primary key)
     - `hero_title`, `hero_subtitle` (text)
     - `about_me`, `mission`, `vision` (text)
     - `primary_email`, `location` (text)
     - Social links: `linkedin_url`, `github_url`, `twitter_url`, `instagram_url`
     - `created_at`, `updated_at` (timestamptz)

  3. **resume_items**
     - `id` (uuid, primary key)
     - `category` (text: experience, education, skills, awards)
     - `title`, `subtitle`, `location` (text)
     - `start_date`, `end_date` (date)
     - `is_current` (boolean)
     - `description` (text)
     - `order_index` (integer)
     - `created_at`, `updated_at` (timestamptz)

  4. **resume_pdf_files**
     - `id` (uuid, primary key)
     - `file_path` (text, storage path)
     - `is_active` (boolean, only one active at a time)
     - `created_at`, `updated_at` (timestamptz)

  5. **businesses**
     - `id` (uuid, primary key)
     - `name`, `slug` (text, slug is unique)
     - `short_description`, `long_description` (text)
     - `website_url` (text)
     - `status` (text: planned, in-progress, live)
     - `main_modules` (jsonb, array of module descriptions)
     - `order_index` (integer)
     - `created_at`, `updated_at` (timestamptz)

  6. **business_screenshots**
     - `id` (uuid, primary key)
     - `business_id` (uuid, references businesses)
     - `title`, `description` (text)
     - `image_path` (text, storage path)
     - `is_main` (boolean)
     - `order_index` (integer)
     - `created_at`, `updated_at` (timestamptz)

  7. **certificates**
     - `id` (uuid, primary key)
     - `title`, `issuer` (text)
     - `issue_date`, `expiry_date` (date)
     - `credential_id`, `credential_url` (text)
     - `category` (text)
     - `file_path` (text, storage path)
     - `order_index` (integer)
     - `created_at`, `updated_at` (timestamptz)

  8. **ai_automations**
     - `id` (uuid, primary key)
     - `title`, `platform` (text)
     - `short_description`, `business_context` (text)
     - `tags` (text array)
     - `screenshot_path` (text, storage path)
     - `status` (text: active, archived)
     - `created_at`, `updated_at` (timestamptz)

  9. **freelance_projects**
     - `id` (uuid, primary key)
     - `client_name`, `project_title` (text)
     - `status` (text: planned, in-progress, completed)
     - `project_type`, `industry` (text)
     - `short_description`, `detailed_description` (text)
     - `start_date`, `end_date` (date)
     - `tags` (text array)
     - `created_at`, `updated_at` (timestamptz)

  10. **freelance_assets**
      - `id` (uuid, primary key)
      - `project_id` (uuid, references freelance_projects)
      - `asset_type` (text: dashboard, screenshot, document)
      - `title`, `description` (text)
      - `file_path` (text, storage path)
      - `order_index` (integer)
      - `created_at`, `updated_at` (timestamptz)

  ## Security
  - All tables have Row Level Security (RLS) enabled
  - Public read access for all content tables
  - Admin-only write access (checked via admins table)
  - Authenticated users must exist in admins table for write operations
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view admins"
  ON admins FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can update their own record"
  ON admins FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title text DEFAULT 'Welcome to R-Lab',
  hero_subtitle text DEFAULT 'Innovation & Digital Excellence',
  about_me text DEFAULT '',
  mission text DEFAULT '',
  vision text DEFAULT '',
  primary_email text DEFAULT '',
  location text DEFAULT '',
  linkedin_url text DEFAULT '',
  github_url text DEFAULT '',
  twitter_url text DEFAULT '',
  instagram_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can update site settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

-- Create resume_items table
CREATE TABLE IF NOT EXISTS resume_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('experience', 'education', 'skills', 'awards')),
  title text NOT NULL,
  subtitle text DEFAULT '',
  location text DEFAULT '',
  start_date date,
  end_date date,
  is_current boolean DEFAULT false,
  description text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resume_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view resume items"
  ON resume_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert resume items"
  ON resume_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can update resume items"
  ON resume_items FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can delete resume items"
  ON resume_items FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

-- Create resume_pdf_files table
CREATE TABLE IF NOT EXISTS resume_pdf_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path text NOT NULL,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resume_pdf_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view resume PDF files"
  ON resume_pdf_files FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert resume PDF files"
  ON resume_pdf_files FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can update resume PDF files"
  ON resume_pdf_files FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can delete resume PDF files"
  ON resume_pdf_files FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text DEFAULT '',
  long_description text DEFAULT '',
  website_url text DEFAULT '',
  status text DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'live')),
  main_modules jsonb DEFAULT '[]'::jsonb,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view businesses"
  ON businesses FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert businesses"
  ON businesses FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can update businesses"
  ON businesses FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can delete businesses"
  ON businesses FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

-- Create business_screenshots table
CREATE TABLE IF NOT EXISTS business_screenshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  title text DEFAULT '',
  description text DEFAULT '',
  image_path text NOT NULL,
  is_main boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE business_screenshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view business screenshots"
  ON business_screenshots FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert business screenshots"
  ON business_screenshots FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can update business screenshots"
  ON business_screenshots FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can delete business screenshots"
  ON business_screenshots FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date,
  credential_id text DEFAULT '',
  credential_url text DEFAULT '',
  category text DEFAULT '',
  file_path text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view certificates"
  ON certificates FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert certificates"
  ON certificates FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can update certificates"
  ON certificates FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can delete certificates"
  ON certificates FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

-- Create ai_automations table
CREATE TABLE IF NOT EXISTS ai_automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  platform text DEFAULT 'Make.com',
  short_description text DEFAULT '',
  business_context text DEFAULT '',
  tags text[] DEFAULT ARRAY[]::text[],
  screenshot_path text DEFAULT '',
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view AI automations"
  ON ai_automations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert AI automations"
  ON ai_automations FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can update AI automations"
  ON ai_automations FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can delete AI automations"
  ON ai_automations FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

-- Create freelance_projects table
CREATE TABLE IF NOT EXISTS freelance_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  project_title text NOT NULL,
  status text DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed')),
  project_type text DEFAULT '',
  industry text DEFAULT '',
  short_description text DEFAULT '',
  detailed_description text DEFAULT '',
  start_date date,
  end_date date,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE freelance_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view freelance projects"
  ON freelance_projects FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert freelance projects"
  ON freelance_projects FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can update freelance projects"
  ON freelance_projects FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can delete freelance projects"
  ON freelance_projects FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

-- Create freelance_assets table
CREATE TABLE IF NOT EXISTS freelance_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES freelance_projects(id) ON DELETE CASCADE NOT NULL,
  asset_type text DEFAULT 'screenshot' CHECK (asset_type IN ('dashboard', 'screenshot', 'document')),
  title text DEFAULT '',
  description text DEFAULT '',
  file_path text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE freelance_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view freelance assets"
  ON freelance_assets FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert freelance assets"
  ON freelance_assets FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can update freelance assets"
  ON freelance_assets FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can delete freelance assets"
  ON freelance_assets FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

-- Insert default site settings
INSERT INTO site_settings (
  hero_title,
  hero_subtitle,
  about_me,
  mission,
  vision,
  primary_email,
  location
) VALUES (
  'Welcome to R-Lab',
  'Innovation & Digital Excellence Portfolio',
  'Digital innovator specializing in data analytics, AI automation, and business intelligence solutions.',
  'To deliver cutting-edge digital solutions that transform business operations.',
  'To be a leading force in AI-driven business innovation.',
  'contact@rlab.com',
  'Lebanon'
) ON CONFLICT DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_resume_items_category ON resume_items(category);
CREATE INDEX IF NOT EXISTS idx_resume_items_order ON resume_items(order_index);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_business_screenshots_business ON business_screenshots(business_id);
CREATE INDEX IF NOT EXISTS idx_certificates_category ON certificates(category);
CREATE INDEX IF NOT EXISTS idx_ai_automations_status ON ai_automations(status);
CREATE INDEX IF NOT EXISTS idx_freelance_projects_status ON freelance_projects(status);
CREATE INDEX IF NOT EXISTS idx_freelance_assets_project ON freelance_assets(project_id);