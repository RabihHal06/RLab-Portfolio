/*
  # Add Logo to Site Settings

  1. Changes
    - Add `logo_path` column to `site_settings` table
    - Stores path to uploaded logo image in storage

  2. Notes
    - Logo will be displayed with glow effect on admin sidebar and home hero section
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'logo_path'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN logo_path text DEFAULT '';
  END IF;
END $$;
