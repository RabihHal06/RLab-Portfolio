/*
  # Enhance AI Automations table
  
  1. New Fields
    - detailed_description: Full description of the automation workflow
    - tools_used: Array of tools/platforms used in the automation
    - complexity_level: Easy, Medium, Advanced
    - time_saved: Estimated time saved (e.g., "5 hours/week")
    - roi_description: Return on investment description
    - order_index: Display order
    - featured: Boolean to highlight featured automations
  
  2. Notes
    - These fields enable a more professional AI automation portfolio
    - Allows better categorization and showcasing of value delivered
*/

DO $$
BEGIN
  -- Add detailed_description
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_automations' AND column_name = 'detailed_description'
  ) THEN
    ALTER TABLE ai_automations ADD COLUMN detailed_description text DEFAULT '';
  END IF;

  -- Add tools_used
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_automations' AND column_name = 'tools_used'
  ) THEN
    ALTER TABLE ai_automations ADD COLUMN tools_used text[] DEFAULT ARRAY[]::text[];
  END IF;

  -- Add complexity_level
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_automations' AND column_name = 'complexity_level'
  ) THEN
    ALTER TABLE ai_automations 
    ADD COLUMN complexity_level text DEFAULT 'medium' 
    CHECK (complexity_level IN ('easy', 'medium', 'advanced'));
  END IF;

  -- Add time_saved
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_automations' AND column_name = 'time_saved'
  ) THEN
    ALTER TABLE ai_automations ADD COLUMN time_saved text DEFAULT '';
  END IF;

  -- Add roi_description
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_automations' AND column_name = 'roi_description'
  ) THEN
    ALTER TABLE ai_automations ADD COLUMN roi_description text DEFAULT '';
  END IF;

  -- Add order_index
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_automations' AND column_name = 'order_index'
  ) THEN
    ALTER TABLE ai_automations ADD COLUMN order_index integer DEFAULT 0;
  END IF;

  -- Add featured
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_automations' AND column_name = 'featured'
  ) THEN
    ALTER TABLE ai_automations ADD COLUMN featured boolean DEFAULT false;
  END IF;
END $$;
