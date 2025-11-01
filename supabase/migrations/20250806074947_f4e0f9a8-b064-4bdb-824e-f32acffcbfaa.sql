-- Create expert_user_reports table for expert-reported user issues
CREATE TABLE IF NOT EXISTS public.expert_user_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expert_id UUID NOT NULL,
  reported_user_id UUID,
  reported_user_email TEXT,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.expert_user_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for expert access
CREATE POLICY "Experts can view their own reports" 
ON public.expert_user_reports 
FOR SELECT 
USING (expert_id = auth.uid());

CREATE POLICY "Experts can create their own reports" 
ON public.expert_user_reports 
FOR INSERT 
WITH CHECK (expert_id = auth.uid());

CREATE POLICY "Experts can update their own reports" 
ON public.expert_user_reports 
FOR UPDATE 
USING (expert_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_expert_user_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_expert_user_reports_updated_at
BEFORE UPDATE ON public.expert_user_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_expert_user_reports_updated_at();