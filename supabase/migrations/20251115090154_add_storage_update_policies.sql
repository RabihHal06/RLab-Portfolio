/*
  # Add UPDATE policies for storage buckets
  
  1. Changes
    - Add UPDATE policies for all storage buckets to allow admins to update files
  
  2. Security
    - Only authenticated admins can update files in storage buckets
*/

-- Add UPDATE policies for all buckets
CREATE POLICY "Admins can update resume files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'resume' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  )
  WITH CHECK (
    bucket_id = 'resume' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );

CREATE POLICY "Admins can update business screenshots"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'business-screenshots' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  )
  WITH CHECK (
    bucket_id = 'business-screenshots' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );

CREATE POLICY "Admins can update certificates"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'certificates' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  )
  WITH CHECK (
    bucket_id = 'certificates' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );

CREATE POLICY "Admins can update AI automation screenshots"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'ai-automations' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  )
  WITH CHECK (
    bucket_id = 'ai-automations' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );

CREATE POLICY "Admins can update freelance assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'freelance-assets' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  )
  WITH CHECK (
    bucket_id = 'freelance-assets' AND
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );
