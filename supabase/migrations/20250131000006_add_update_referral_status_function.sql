-- Create function to update referral status (for syncing with completed calls)
-- This function uses SECURITY DEFINER to bypass RLS policies
CREATE OR REPLACE FUNCTION public.update_referral_status(
    p_referral_id UUID,
    p_status TEXT,
    p_completed_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_updated_count INTEGER;
BEGIN
    -- Update referral status
    UPDATE public.referrals
    SET 
        status = p_status,
        completed_at = COALESCE(p_completed_at, completed_at, NOW())
    WHERE id = p_referral_id
        AND status = 'pending'; -- Only update if currently pending
    
    GET DIAGNOSTICS v_updated_count = ROW_COUNT;
    
    -- Return true if a row was updated, false otherwise
    RETURN v_updated_count > 0;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.update_referral_status(UUID, TEXT, TIMESTAMPTZ) TO authenticated;
