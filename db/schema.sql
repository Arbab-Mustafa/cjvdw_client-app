-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users/Therapists table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'therapist', 'manager')),
  employment_type TEXT CHECK (employment_type IN ('employed', 'self-employed')),
  hourly_rate DECIMAL(10, 2),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  mobile TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  last_visit TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultation forms table
CREATE TABLE IF NOT EXISTS consultation_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  skin_type TEXT,
  allergies JSONB,
  medical_conditions JSONB,
  medications JSONB,
  skin_concerns JSONB,
  previous_treatments JSONB,
  lifestyle JSONB,
  preferred_products JSONB,
  consent_given BOOLEAN DEFAULT false,
  additional_notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service categories table
CREATE TABLE IF NOT EXISTS service_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration INTEGER,
  category_id TEXT REFERENCES service_categories(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_id UUID REFERENCES customers(id),
  therapist_id UUID REFERENCES users(id),
  service_id UUID REFERENCES services(id),
  amount DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Card', 'Cash')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Therapist hours table
CREATE TABLE IF NOT EXISTS therapist_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  therapist_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  hours DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(therapist_id, date)
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default service categories
INSERT INTO service_categories (id, name)
VALUES
  ('facials', 'Facials'),
  ('waxing', 'Waxing'),
  ('body', 'Body'),
  ('hands-feet', 'Hands & Feet'),
  ('eyes', 'Eyes'),
  ('hot-wax', 'Hot Wax'),
  ('sunbed', 'Sunbed'),
  ('products-vouchers', 'Products & Vouchers')
ON CONFLICT (id) DO NOTHING;

-- Insert default owner account
INSERT INTO users (name, username, email, role, active)
VALUES ('Admin', 'admin', 'admin@gemneyes.com', 'owner', true)
ON CONFLICT (username) DO NOTHING;

-- Insert default logo setting
INSERT INTO settings (key, value)
VALUES ('logo', '{"url": "/gemneyes-logo.png", "alt": "GemnEyes Hair and Beauty", "width": 120, "height": 50}')
ON CONFLICT (key) DO NOTHING;
