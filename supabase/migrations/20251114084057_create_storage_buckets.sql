/*
  # Create Storage Buckets

  ## Buckets Created
  1. **resume** - For storing resume PDF files
  2. **business-screenshots** - For business portfolio screenshots
  3. **certificates** - For certificate images and PDFs
  4. **ai-automations** - For AI automation scenario screenshots
  5. **freelance-assets** - For freelance project assets and dashboards

  ## Security
  - All buckets are set to public read access
  - Admin-only write access (via RLS policies)
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('resume', 'resume', true),
  ('business-screenshots', 'business-screenshots', true),
  ('certificates', 'certificates', true),
  ('ai-automations', 'ai-automations', true),
  ('freelance-assets', 'freelance-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resume bucket
CREATE POLICY "Public read access for resume"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'resume');

CREATE POLICY "Admins can upload resume files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'resume' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );

CREATE POLICY "Admins can delete resume files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'resume' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );

-- Storage policies for business-screenshots bucket
CREATE POLICY "Public read access for business screenshots"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'business-screenshots');

CREATE POLICY "Admins can upload business screenshots"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'business-screenshots' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );

CREATE POLICY "Admins can delete business screenshots"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'business-screenshots' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );

-- Storage policies for certificates bucket
CREATE POLICY "Public read access for certificates"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'certificates');

CREATE POLICY "Admins can upload certificates"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'certificates' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );

CREATE POLICY "Admins can delete certificates"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'certificates' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );

-- Storage policies for ai-automations bucket
CREATE POLICY "Public read access for AI automations"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'ai-automations');

CREATE POLICY "Admins can upload AI automation screenshots"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'ai-automations' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );

CREATE POLICY "Admins can delete AI automation screenshots"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'ai-automations' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );

-- Storage policies for freelance-assets bucket
CREATE POLICY "Public read access for freelance assets"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'freelance-assets');

CREATE POLICY "Admins can upload freelance assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'freelance-assets' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );

CREATE POLICY "Admins can delete freelance assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'freelance-assets' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );