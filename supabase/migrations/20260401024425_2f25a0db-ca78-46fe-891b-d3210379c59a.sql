
-- Create user_xp table
CREATE TABLE public.user_xp (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  total_xp integer NOT NULL DEFAULT 0,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_active_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_xp ADD CONSTRAINT user_xp_user_id_unique UNIQUE (user_id);
ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own XP" ON public.user_xp
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own XP" ON public.user_xp
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own XP" ON public.user_xp
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Parents can view linked children XP" ON public.user_xp
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_child_links
      WHERE parent_child_links.parent_user_id = auth.uid()
        AND parent_child_links.child_user_id = user_xp.user_id
        AND parent_child_links.status = 'linked'
    )
  );

-- Create user_badges table
CREATE TABLE public.user_badges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  badge_id text NOT NULL,
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_badges_unique UNIQUE (user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges" ON public.user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Parents can view linked children badges" ON public.user_badges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_child_links
      WHERE parent_child_links.parent_user_id = auth.uid()
        AND parent_child_links.child_user_id = user_badges.user_id
        AND parent_child_links.status = 'linked'
    )
  );

-- Create unlocked_avatars table
CREATE TABLE public.unlocked_avatars (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  avatar_id text NOT NULL,
  unlocked_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT unlocked_avatars_unique UNIQUE (user_id, avatar_id)
);

ALTER TABLE public.unlocked_avatars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own avatars" ON public.unlocked_avatars
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own avatars" ON public.unlocked_avatars
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add updated_at trigger to user_xp
CREATE TRIGGER update_user_xp_updated_at
  BEFORE UPDATE ON public.user_xp
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for gamification tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_xp;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_badges;
