-- Enable realtime for activity and mood tables
ALTER TABLE public.mood_entries REPLICA IDENTITY FULL;
ALTER TABLE public.activity_completions REPLICA IDENTITY FULL;

-- Add tables to supabase_realtime publication if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    BEGIN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.mood_entries';
    EXCEPTION WHEN duplicate_object THEN
      -- Table already in publication; ignore
      NULL;
    END;
    BEGIN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_completions';
    EXCEPTION WHEN duplicate_object THEN
      -- Table already in publication; ignore
      NULL;
    END;
  END IF;
END$$;