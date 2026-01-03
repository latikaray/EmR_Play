-- Create test parent user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '00000000-0000-0000-0000-000000000000',
  'testparent@example.com',
  crypt('TestParent123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "parent", "display_name": "Test Parent"}',
  'authenticated',
  'authenticated'
);

-- Create test child user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  '00000000-0000-0000-0000-000000000000',
  'testchild@example.com',
  crypt('TestChild123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "child", "display_name": "Test Child"}',
  'authenticated',
  'authenticated'
);

-- Create profiles for both users
INSERT INTO public.profiles (user_id, role, display_name) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'parent', 'Test Parent'),
  ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'child', 'Test Child');