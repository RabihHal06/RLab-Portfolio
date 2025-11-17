/*
  # Add Small Logo to Site Settings

  1. Changes
    - Add `small_logo_path` column to `site_settings` table
    - This will be used for the footer, admin login, admin sidebar, and public navigation logos
    - The existing `logo_path` is used for the larger hero section logo
  
  2. Notes
    - Uses TEXT type to store the file path in the images bucket
    - Nullable field with no default value
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'small_logo_path'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN small_logo_path TEXT;
  END IF;
END $$;