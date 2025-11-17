/*
  # Add display name to resume PDF files

  1. Changes
    - Add `display_name` column to `resume_pdf_files` table
    - This allows admins to set a custom display name for PDF files
    - Defaults to the original filename if not set
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resume_pdf_files' AND column_name = 'display_name'
  ) THEN
    ALTER TABLE resume_pdf_files ADD COLUMN display_name text;
  END IF;
END $$;