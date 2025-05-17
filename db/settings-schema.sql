-- Create a settings table for storing application configuration
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert the logo setting
INSERT INTO settings (key, value)
VALUES ('logo', jsonb_build_object(
  'url', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GemnEyesLogo-2EH0uNQW75GbMSsWeuSVCAS2A29F7h.png',
  'alt', 'GemnEyes Hair and Beauty',
  'width', 300,
  'height', 150
))
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value;
