-- Enable Row Level Security on remaining tables
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create basic policies for chat_messages (for now allowing all, will restrict with auth later)
CREATE POLICY "Allow chat_messages read access" 
ON public.chat_messages 
FOR SELECT 
USING (true);

CREATE POLICY "Allow chat_messages insert access" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow chat_messages update access" 
ON public.chat_messages 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow chat_messages delete access" 
ON public.chat_messages 
FOR DELETE 
USING (true);

-- Create basic policies for meal_plans (for now allowing all, will restrict with auth later)
CREATE POLICY "Allow meal_plans read access" 
ON public.meal_plans 
FOR SELECT 
USING (true);

CREATE POLICY "Allow meal_plans insert access" 
ON public.meal_plans 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow meal_plans update access" 
ON public.meal_plans 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow meal_plans delete access" 
ON public.meal_plans 
FOR DELETE 
USING (true);

-- Create basic policies for users (for now allowing all, will restrict with auth later)
CREATE POLICY "Allow users read access" 
ON public.users 
FOR SELECT 
USING (true);

CREATE POLICY "Allow users insert access" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow users update access" 
ON public.users 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow users delete access" 
ON public.users 
FOR DELETE 
USING (true);