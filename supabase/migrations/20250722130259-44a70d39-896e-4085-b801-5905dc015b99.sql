-- Enable realtime for existing tables
ALTER TABLE public.mood_entries REPLICA IDENTITY FULL;
ALTER TABLE public.activity_completions REPLICA IDENTITY FULL;

-- Add tables to supabase_realtime publication for real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.mood_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_completions;