-- Create the missing RPC function for getting approved expert presence
CREATE OR REPLACE FUNCTION public.get_approved_expert_presence(expert_auth_ids uuid[])
RETURNS TABLE(expert_id uuid, status text, accepting_calls boolean, last_activity timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ep.expert_id,
    ep.status,
    ep.accepting_calls,
    ep.last_activity
  FROM public.expert_presence ep
  INNER JOIN public.expert_accounts ea ON ea.auth_id = ep.expert_id
  WHERE ea.status = 'approved' 
    AND ep.expert_id = ANY(expert_auth_ids);
END;
$$;