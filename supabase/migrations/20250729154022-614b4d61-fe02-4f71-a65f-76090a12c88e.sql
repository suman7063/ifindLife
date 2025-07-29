-- Fix security warning by setting search_path for the function
CREATE OR REPLACE FUNCTION public.update_incoming_call_requests_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$