-- Enable Row Level Security on inventory table
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Create policies for inventory access (for now, allowing all operations since we don't have auth yet)
-- In production, these would be restricted to authenticated users

-- Allow users to view all inventory (will be restricted to user_id later with auth)
CREATE POLICY "Allow inventory read access" 
ON public.inventory 
FOR SELECT 
USING (true);

-- Allow users to insert inventory items (will be restricted to user_id later with auth)
CREATE POLICY "Allow inventory insert access" 
ON public.inventory 
FOR INSERT 
WITH CHECK (true);

-- Allow users to update inventory items (will be restricted to user_id later with auth)
CREATE POLICY "Allow inventory update access" 
ON public.inventory 
FOR UPDATE 
USING (true);

-- Allow users to delete inventory items (will be restricted to user_id later with auth)
CREATE POLICY "Allow inventory delete access" 
ON public.inventory 
FOR DELETE 
USING (true);