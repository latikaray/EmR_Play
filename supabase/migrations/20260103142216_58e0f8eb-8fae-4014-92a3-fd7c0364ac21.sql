-- Create parent-child links table
CREATE TABLE public.parent_child_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_user_id UUID NOT NULL,
  child_user_id UUID,
  link_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  linked_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.parent_child_links ENABLE ROW LEVEL SECURITY;

-- Parents can view and manage their own links
CREATE POLICY "Parents can manage their links"
ON public.parent_child_links
FOR ALL
USING (auth.uid() = parent_user_id);

-- Children can view links where they are the child
CREATE POLICY "Children can view their links"
ON public.parent_child_links
FOR SELECT
USING (auth.uid() = child_user_id);

-- Children can update links to accept them (using the link code)
CREATE POLICY "Children can accept links"
ON public.parent_child_links
FOR UPDATE
USING (status = 'pending')
WITH CHECK (child_user_id = auth.uid());

-- Enable realtime for the table
ALTER TABLE public.parent_child_links REPLICA IDENTITY FULL;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.parent_child_links;

-- Create index for faster lookups
CREATE INDEX idx_parent_child_links_parent ON public.parent_child_links(parent_user_id);
CREATE INDEX idx_parent_child_links_child ON public.parent_child_links(child_user_id);
CREATE INDEX idx_parent_child_links_code ON public.parent_child_links(link_code);