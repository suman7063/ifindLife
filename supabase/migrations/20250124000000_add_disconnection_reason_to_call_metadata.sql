-- Migration: Add disconnection reason support to call_sessions.call_metadata
-- Created: 2025-01-24
-- This migration documents and ensures proper structure for storing disconnection reasons
-- in the call_metadata JSONB field of call_sessions table

-- ============================================================================
-- DOCUMENTATION: call_metadata STRUCTURE
-- ============================================================================

-- The call_metadata JSONB field stores:
-- {
--   "disconnection_reason": "user_misbehaving" | "expert_emergency" | "expert_ended" | "user_ended" | "network_error" | "normal",
--   "ended_by": "expert" | "user" | "unknown",
--   "ended_at": "ISO 8601 timestamp",
--   "refund": {
--     "amount": number,
--     "status": "processed" | "failed" | "not_applicable" | "already_processed" | "error",
--     "processed_at": "ISO 8601 timestamp",
--     "remaining_minutes": number,
--     "new_balance": number,
--     "transaction_id": "uuid"
--   }
-- }

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN public.call_sessions.call_metadata IS 
'JSONB field storing call metadata including disconnection_reason, ended_by, ended_at, and refund information. 
Disconnection reasons: user_misbehaving, expert_emergency, expert_ended, user_ended, network_error, normal';

-- ============================================================================
-- INDEXES FOR BETTER QUERY PERFORMANCE
-- ============================================================================

-- Create GIN index on call_metadata for efficient JSONB queries
CREATE INDEX IF NOT EXISTS idx_call_sessions_metadata_gin 
ON public.call_sessions USING GIN (call_metadata);

-- Create index on disconnection_reason for filtering
CREATE INDEX IF NOT EXISTS idx_call_sessions_disconnection_reason 
ON public.call_sessions ((call_metadata->>'disconnection_reason'))
WHERE call_metadata->>'disconnection_reason' IS NOT NULL;

-- Create index on ended_by for filtering
CREATE INDEX IF NOT EXISTS idx_call_sessions_ended_by 
ON public.call_sessions ((call_metadata->>'ended_by'))
WHERE call_metadata->>'ended_by' IS NOT NULL;

-- ============================================================================
-- HELPER FUNCTION: Get calls by disconnection reason
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_calls_by_disconnection_reason(
  p_reason TEXT DEFAULT NULL,
  p_ended_by TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
  id TEXT,
  user_id UUID,
  expert_id UUID,
  status TEXT,
  duration INTEGER,
  disconnection_reason TEXT,
  ended_by TEXT,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cs.id,
    cs.user_id,
    cs.expert_id,
    cs.status,
    cs.duration,
    cs.call_metadata->>'disconnection_reason'::TEXT as disconnection_reason,
    cs.call_metadata->>'ended_by'::TEXT as ended_by,
    (cs.call_metadata->>'ended_at')::TIMESTAMPTZ as ended_at,
    cs.created_at
  FROM public.call_sessions cs
  WHERE 
    (p_reason IS NULL OR cs.call_metadata->>'disconnection_reason' = p_reason)
    AND (p_ended_by IS NULL OR cs.call_metadata->>'ended_by' = p_ended_by)
    AND cs.call_metadata->>'disconnection_reason' IS NOT NULL
  ORDER BY cs.created_at DESC
  LIMIT p_limit;
END;
$$;

COMMENT ON FUNCTION public.get_calls_by_disconnection_reason IS 
'Helper function to query calls by disconnection reason and ended_by. 
Returns calls with disconnection_reason in call_metadata.';

-- ============================================================================
-- VALIDATION: Ensure call_metadata has proper structure
-- ============================================================================

-- Add a check constraint to validate disconnection_reason values (optional, for data integrity)
-- Note: This is commented out as JSONB validation can be done at application level
-- If needed, you can uncomment and adjust:

/*
ALTER TABLE public.call_sessions
ADD CONSTRAINT check_disconnection_reason 
CHECK (
  call_metadata->>'disconnection_reason' IS NULL 
  OR call_metadata->>'disconnection_reason' IN (
    'user_misbehaving', 
    'expert_emergency', 
    'expert_ended', 
    'user_ended', 
    'network_error', 
    'normal'
  )
);
*/

