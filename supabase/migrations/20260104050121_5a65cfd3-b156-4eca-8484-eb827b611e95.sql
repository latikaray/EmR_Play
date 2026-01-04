-- 1. Create secure user_role enum if not exists (already exists as 'user_role')
-- We'll create a new app_role enum for the roles table

-- 2. Create user_roles table for secure role storage
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    role user_role NOT NULL DEFAULT 'child',
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own role" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role" ON public.user_roles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Create parent_profiles table
CREATE TABLE public.parent_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE,
    display_name text,
    avatar_url text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on parent_profiles
ALTER TABLE public.parent_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for parent_profiles
CREATE POLICY "Parents can view their own profile" ON public.parent_profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Parents can insert their own profile" ON public.parent_profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Parents can update their own profile" ON public.parent_profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Parents can delete their own profile" ON public.parent_profiles
FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at on parent_profiles
CREATE TRIGGER update_parent_profiles_updated_at
BEFORE UPDATE ON public.parent_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Create child_profiles table
CREATE TABLE public.child_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE,
    display_name text,
    avatar_url text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on child_profiles
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for child_profiles (children can see their own, parents can see linked children)
CREATE POLICY "Children can view their own profile" ON public.child_profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Parents can view linked child profiles" ON public.child_profiles
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.parent_child_links
        WHERE parent_child_links.parent_user_id = auth.uid()
        AND parent_child_links.child_user_id = child_profiles.user_id
        AND parent_child_links.status = 'linked'
    )
);

CREATE POLICY "Children can insert their own profile" ON public.child_profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Children can update their own profile" ON public.child_profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Children can delete their own profile" ON public.child_profiles
FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at on child_profiles
CREATE TRIGGER update_child_profiles_updated_at
BEFORE UPDATE ON public.child_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Migrate existing users from profiles table
-- Insert into user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, role FROM public.profiles
ON CONFLICT (user_id, role) DO NOTHING;

-- Insert parents into parent_profiles
INSERT INTO public.parent_profiles (user_id, display_name, avatar_url, created_at, updated_at)
SELECT user_id, display_name, avatar_url, created_at, updated_at
FROM public.profiles
WHERE role = 'parent'
ON CONFLICT (user_id) DO NOTHING;

-- Insert children into child_profiles
INSERT INTO public.child_profiles (user_id, display_name, avatar_url, created_at, updated_at)
SELECT user_id, display_name, avatar_url, created_at, updated_at
FROM public.profiles
WHERE role = 'child'
ON CONFLICT (user_id) DO NOTHING;

-- 6. Update delete_user_account function to handle new tables
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Delete user data in dependency order
  DELETE FROM public.activity_completions WHERE user_id = auth.uid() OR child_user_id = auth.uid();
  DELETE FROM public.mood_entries WHERE user_id = auth.uid() OR child_user_id = auth.uid();
  DELETE FROM public.journal_entries WHERE user_id = auth.uid();
  DELETE FROM public.parent_child_links WHERE parent_user_id = auth.uid() OR child_user_id = auth.uid();
  DELETE FROM public.parent_profiles WHERE user_id = auth.uid();
  DELETE FROM public.child_profiles WHERE user_id = auth.uid();
  DELETE FROM public.user_roles WHERE user_id = auth.uid();
  DELETE FROM public.profiles WHERE user_id = auth.uid();
END;
$function$;