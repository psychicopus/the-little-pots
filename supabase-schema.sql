-- =========================================================================
-- SQL SETUP SCRIPT FOR "THE LITTLE POTS" (Supabase / PostgreSQL)
-- 100% Free Tier Compatible
-- Run this in the Supabase SQL Editor (https://app.supabase.com)
-- =========================================================================

-- 1. Profiles Table (Holds stranger handles & stamps)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  bio TEXT DEFAULT '',
  stamp_preference TEXT DEFAULT '🌿 Cedar Leaf',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- 2. Pots Table (Vents / Dispatches)
CREATE TABLE IF NOT EXISTS public.pots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  stamp TEXT DEFAULT '🌿 Cedar Leaf',
  status TEXT DEFAULT 'pending', -- pending, replied, archived
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.pots ENABLE ROW LEVEL SECURITY;

-- Sender and recipient can view their respective pots
CREATE POLICY "Users can view pots they sent or received"
  ON public.pots FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Authenticated users can cast pots"
  ON public.pots FOR INSERT
  WITH CHECK (auth.uid() = sender_id);


-- 3. Replies Table (Exchanged penpal words)
CREATE TABLE IF NOT EXISTS public.pot_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pot_id UUID REFERENCES public.pots(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.pot_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view replies"
  ON public.pot_replies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pots
      WHERE public.pots.id = public.pot_replies.pot_id
      AND (public.pots.sender_id = auth.uid() OR public.pots.recipient_id = auth.uid())
    )
  );

CREATE POLICY "Participants can insert replies"
  ON public.pot_replies FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM public.pots
      WHERE public.pots.id = pot_id
      AND (public.pots.sender_id = auth.uid() OR public.pots.recipient_id = auth.uid())
    )
  );


-- 4. Database Function: Cast Pot to a Random Stranger Fairly
CREATE OR REPLACE FUNCTION cast_random_pot(
  p_title TEXT,
  p_content TEXT,
  p_stamp TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_recipient_id UUID;
  v_new_pot_id UUID;
BEGIN
  -- Pick a random active user other than the current user
  SELECT id INTO v_recipient_id
  FROM public.profiles
  WHERE id != auth.uid()
  ORDER BY RANDOM()
  LIMIT 1;

  -- Insert the pot
  INSERT INTO public.pots (sender_id, recipient_id, title, content, stamp)
  VALUES (auth.uid(), v_recipient_id, p_title, p_content, p_stamp)
  RETURNING id INTO v_new_pot_id;

  RETURN v_new_pot_id;
END;
$$;
