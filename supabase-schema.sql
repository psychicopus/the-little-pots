-- =========================================================================
-- THE LITTLE POTS: PUBLIC WALL & COMMUNITY REPLIES
-- Copy and run this in Supabase SQL Editor
-- =========================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  bio TEXT DEFAULT '',
  stamp_preference TEXT DEFAULT '🌿 Cedar Leaf',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert profile" ON public.profiles;
CREATE POLICY "Anyone can insert profile"
  ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update own profile" ON public.profiles;
CREATE POLICY "Anyone can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- 2. Pots Table (Public Wall Dispatches)
CREATE TABLE IF NOT EXISTS public.pots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  stamp TEXT DEFAULT '🌿 Cedar Leaf',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pots ENABLE ROW LEVEL SECURITY;

-- PUBLIC WALL: Everyone (logged in) can read ALL pots!
DROP POLICY IF EXISTS "Anyone logged in can view all pots" ON public.pots;
DROP POLICY IF EXISTS "Users can view relevant pots" ON public.pots;
DROP POLICY IF EXISTS "Users can view pots they sent or received" ON public.pots;

CREATE POLICY "Anyone logged in can view all pots"
  ON public.pots FOR SELECT
  USING (true);

-- Anyone authenticated can cast a pot
DROP POLICY IF EXISTS "Authenticated users can cast pots" ON public.pots;
CREATE POLICY "Authenticated users can cast pots"
  ON public.pots FOR INSERT
  WITH CHECK (auth.uid() = sender_id);


-- 3. Replies Table (Comments on Pots)
CREATE TABLE IF NOT EXISTS public.pot_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pot_id UUID REFERENCES public.pots(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pot_replies ENABLE ROW LEVEL SECURITY;

-- Everyone can read all replies
DROP POLICY IF EXISTS "Anyone can view replies" ON public.pot_replies;
DROP POLICY IF EXISTS "Authenticated users can view replies" ON public.pot_replies;
DROP POLICY IF EXISTS "Participants can view replies" ON public.pot_replies;

CREATE POLICY "Anyone can view replies"
  ON public.pot_replies FOR SELECT
  USING (true);

-- Anyone authenticated can add a reply to any pot
DROP POLICY IF EXISTS "Authenticated users can insert replies" ON public.pot_replies;
CREATE POLICY "Authenticated users can insert replies"
  ON public.pot_replies FOR INSERT
  WITH CHECK (auth.uid() = author_id);


-- 4. Guaranteed Profile Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, stamp_preference)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'stamp_preference', '🌿 Cedar Leaf')
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
