-- Create table to track pending referral rewards with delay
CREATE TABLE IF NOT EXISTS public.referral_rewards_pending (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referral_id UUID NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
    call_session_id TEXT REFERENCES public.call_sessions(id),
    call_end_time TIMESTAMPTZ NOT NULL,
    reward_due_at TIMESTAMPTZ NOT NULL, -- call_end_time + delay (2 mins for test, 48hrs for production)
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    UNIQUE(referral_id) -- One pending reward per referral
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_referral_rewards_pending_due_at 
ON public.referral_rewards_pending(reward_due_at) 
WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_referral_rewards_pending_status 
ON public.referral_rewards_pending(status);

-- Function to process pending referral rewards that are due
CREATE OR REPLACE FUNCTION public.process_pending_referral_rewards()
RETURNS TABLE(
    processed_count INTEGER,
    failed_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_pending RECORD;
    v_processed_count INTEGER := 0;
    v_failed_count INTEGER := 0;
    -- TEST: 2 minutes delay
    -- PRODUCTION: Change to INTERVAL '48 hours'
    v_delay_interval INTERVAL := INTERVAL '2 minutes';
BEGIN
    -- Get all pending rewards that are due (reward_due_at <= NOW())
    FOR v_pending IN 
        SELECT id, referral_id, call_session_id, call_end_time
        FROM public.referral_rewards_pending
        WHERE status = 'pending'
        AND reward_due_at <= NOW()
        ORDER BY reward_due_at ASC
        FOR UPDATE SKIP LOCKED -- Prevent concurrent processing
    LOOP
        BEGIN
            -- Mark as processing
            UPDATE public.referral_rewards_pending
            SET status = 'processing'
            WHERE id = v_pending.id;

            -- Call the existing handle_completed_referral function
            PERFORM public.handle_completed_referral(v_pending.referral_id);

            -- Mark as completed
            UPDATE public.referral_rewards_pending
            SET 
                status = 'completed',
                processed_at = NOW()
            WHERE id = v_pending.id;

            v_processed_count := v_processed_count + 1;
            
        EXCEPTION WHEN OTHERS THEN
            -- Mark as failed
            UPDATE public.referral_rewards_pending
            SET 
                status = 'failed',
                error_message = SQLERRM,
                processed_at = NOW()
            WHERE id = v_pending.id;

            v_failed_count := v_failed_count + 1;
        END;
    END LOOP;

    RETURN QUERY SELECT v_processed_count, v_failed_count;
END;
$$;

-- Function to create pending referral reward entry
CREATE OR REPLACE FUNCTION public.create_pending_referral_reward(
    p_referral_id UUID,
    p_call_session_id TEXT,
    p_call_end_time TIMESTAMPTZ
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_pending_id UUID;
    -- TEST: 2 minutes delay
    -- PRODUCTION: Change to INTERVAL '48 hours'
    v_delay_interval INTERVAL := INTERVAL '2 minutes';
    v_reward_due_at TIMESTAMPTZ;
BEGIN
    -- Calculate reward due time (call_end_time + delay)
    v_reward_due_at := p_call_end_time + v_delay_interval;

    -- Insert pending reward entry
    INSERT INTO public.referral_rewards_pending (
        referral_id,
        call_session_id,
        call_end_time,
        reward_due_at,
        status
    ) VALUES (
        p_referral_id,
        p_call_session_id,
        p_call_end_time,
        v_reward_due_at,
        'pending'
    )
    ON CONFLICT (referral_id) DO UPDATE
    SET 
        call_session_id = EXCLUDED.call_session_id,
        call_end_time = EXCLUDED.call_end_time,
        reward_due_at = EXCLUDED.reward_due_at,
        status = 'pending',
        processed_at = NULL,
        error_message = NULL
    RETURNING id INTO v_pending_id;

    RETURN v_pending_id;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.process_pending_referral_rewards() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_pending_referral_reward(UUID, TEXT, TIMESTAMPTZ) TO authenticated;

-- RLS Policies
ALTER TABLE public.referral_rewards_pending ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own pending rewards (via referral)
CREATE POLICY "Users can view their own pending referral rewards"
ON public.referral_rewards_pending
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.referrals
        WHERE referrals.id = referral_rewards_pending.referral_id
        AND (referrals.referrer_id = auth.uid() OR referrals.referred_id = auth.uid())
    )
);
