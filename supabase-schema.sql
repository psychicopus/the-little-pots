-- =========================================================================
-- FIX & STREAMLINE SCRIPT FOR "THE LITTLE POTS"
-- Run this in Supabase SQL Editor
-- =========================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  bio TEXT DEFAULT '',
  stamp_preference TEXT DEFAULT '🌿 Cedar Leaf',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- 2. Pots Table
CREATE TABLE IF NOT EXISTS public.pots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  stamp TEXT DEFAULT '🌿 Cedar Leaf',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pots ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view pots that are:
-- 1. Sent by them
-- 2. Addressed directly to them
-- 3. Unassigned floating pots from other people
DROP POLICY IF EXISTS "Users can view relevant pots" ON public.pots;
CREATE POLICY "Users can view relevant pots"
  ON public.pots FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      auth.uid() = sender_id OR 
      auth.uid() = recipient_id OR 
      (recipient_id IS NULL AND sender_id != auth.uid())
    )
  );

DROP POLICY IF EXISTS "Authenticated users can cast pots" ON public.pots;
CREATE POLICY "Authenticated users can cast pots"
  ON public.pots FOR INSERT
  WITH CHECK (auth.uid() = sender_id);


-- 3. Replies Table
CREATE TABLE IF NOT EXISTS public.pot_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pot_id UUID REFERENCES public.pots(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pot_replies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view replies" ON public.pot_replies;
CREATE POLICY "Authenticated users can view replies"
  ON public.pot_replies FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can insert replies" ON public.pot_replies;
CREATE POLICY "Authenticated users can insert replies"
  ON public.pot_replies FOR INSERT
  WITH CHECK (auth.uid() = author_id);


-- 4. Cast Pot Function
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
  -- Look for an existing profile that is NOT the sender
  SELECT id INTO v_recipient_id
  FROM public.profiles
  WHERE id != auth.uid()
  ORDER BY RANDOM()
  LIMIT 1;

  -- Insert with recipient_id (or NULL if no other user exists yet)
  INSERT INTO public.pots (sender_id, recipient_id, title, content, stamp)
  VALUES (auth.uid(), v_recipient_id, p_title, p_content, p_stamp)
  RETURNING id INTO v_new_pot_id;

  RETURN v_new_pot_id;
END;
$$;
