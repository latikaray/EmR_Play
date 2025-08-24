-- Add missing DELETE policy for profiles table
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function for proper account deletion with cascade
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void AS $$
BEGIN
  -- Delete user data in dependency order
  DELETE FROM public.activity_completions WHERE user_id = auth.uid() OR child_user_id = auth.uid();
  DELETE FROM public.mood_entries WHERE user_id = auth.uid() OR child_user_id = auth.uid();
  DELETE FROM public.journal_entries WHERE user_id = auth.uid();
  DELETE FROM public.profiles WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;