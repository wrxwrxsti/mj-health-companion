-- MJ Health Companion Database Schema
-- Run this in Supabase SQL Editor

-- Medications table
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  generic_name TEXT,
  dosage TEXT,
  frequency TEXT,
  route TEXT DEFAULT 'oral',
  timing TEXT,
  prescribed_by TEXT,
  prescribed_date DATE,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  doc_type TEXT,
  doc_date DATE,
  file_url TEXT,
  file_type TEXT,
  hospital TEXT,
  department TEXT,
  doctor_name TEXT,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Timeline events table
CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_date DATE NOT NULL,
  event_type TEXT,
  title TEXT NOT NULL,
  description TEXT,
  hospital TEXT,
  department TEXT,
  doctor_name TEXT,
  severity TEXT DEFAULT 'low',
  linked_doc_id UUID REFERENCES documents(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_date TIMESTAMPTZ NOT NULL,
  doctor_name TEXT,
  hospital TEXT,
  department TEXT,
  purpose TEXT,
  prep_notes TEXT,
  tests_required TEXT[],
  status TEXT DEFAULT 'upcoming',
  follow_up_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lab results table
CREATE TABLE lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_date DATE NOT NULL,
  test_name TEXT NOT NULL,
  value NUMERIC,
  unit TEXT,
  ref_range_low NUMERIC,
  ref_range_high NUMERIC,
  is_abnormal BOOLEAN DEFAULT false,
  source TEXT,
  linked_doc_id UUID REFERENCES documents(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create storage bucket for documents
-- Run this separately: INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- Enable Row Level Security (but allow all access since no auth)
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;

-- Allow all access (no auth)
CREATE POLICY "Allow all access" ON medications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON timeline_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON lab_results FOR ALL USING (true) WITH CHECK (true);
