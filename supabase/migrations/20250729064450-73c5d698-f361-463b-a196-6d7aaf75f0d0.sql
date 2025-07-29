-- Create junction table for expert categories and services
CREATE TABLE public.expert_category_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES public.expert_categories(id) ON DELETE CASCADE,
  service_id INTEGER NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category_id, service_id)
);

-- Enable RLS
ALTER TABLE public.expert_category_services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view category service assignments" 
ON public.expert_category_services 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage category service assignments" 
ON public.expert_category_services 
FOR ALL 
USING (is_any_admin())
WITH CHECK (is_any_admin());