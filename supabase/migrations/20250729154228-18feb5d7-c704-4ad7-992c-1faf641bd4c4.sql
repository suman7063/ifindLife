-- Fix search_path security warning for expire_old_call_requests function
CREATE OR REPLACE FUNCTION public.expire_old_call_requests()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.incoming_call_requests 
  SET status = 'timeout', updated_at = now()
  WHERE status = 'pending' 
    AND expires_at < now();
END;
$function$;