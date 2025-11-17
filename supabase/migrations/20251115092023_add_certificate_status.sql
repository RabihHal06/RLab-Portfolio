/*
  # Add status field to certificates
  
  1. Changes
    - Add status column to certificates table with default 'completed'
    - Status can be 'in_progress' or 'completed'
  
  2. Notes
    - Existing certificates will be set to 'completed' by default
    - Certificates marked as 'in_progress' will show a badge on the frontend
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'certificates' AND column_name = 'status'
  ) THEN
    ALTER TABLE certificates 
    ADD COLUMN status text DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed'));
  END IF;
END $$;
