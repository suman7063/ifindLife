-- Fix the search path warning for the function
CREATE OR REPLACE FUNCTION public.update_expert_user_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';