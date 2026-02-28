-- ============================================
-- EventFlow - Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('wedding', 'birthday', 'corporate', 'graduation', 'baptism', 'social', 'other')),
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  description TEXT,
  cover_image_url TEXT,
  mascot_id TEXT,
  template_id TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Guests table
CREATE TABLE IF NOT EXISTS guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  confirmed BOOLEAN DEFAULT false,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests(event_id);

-- RLS (Row Level Security)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Events policies
-- Users can read their own events
CREATE POLICY "Users can view own events"
  ON events FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can view active events (for public invitation pages)
CREATE POLICY "Public can view active events by slug"
  ON events FOR SELECT
  USING (is_active = true);

-- Users can create events
CREATE POLICY "Users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own events
CREATE POLICY "Users can update own events"
  ON events FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete own events
CREATE POLICY "Users can delete own events"
  ON events FOR DELETE
  USING (auth.uid() = user_id);

-- Guests policies
-- Event owners can view guests for their events
CREATE POLICY "Event owners can view guests"
  ON guests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events WHERE events.id = guests.event_id AND events.user_id = auth.uid()
    )
  );

-- Anyone can insert a guest (RSVP from public invitation page)
CREATE POLICY "Anyone can RSVP"
  ON guests FOR INSERT
  WITH CHECK (true);

-- Auto-update updated_at on events
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
