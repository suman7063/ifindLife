-- Migration: Add call_session_id to expert_user_reports table
-- Created: 2025-01-24
-- This allows linking user reports to specific call sessions

-- ============================================================================
-- ADD COLUMN
-- ============================================================================

ALTER TABLE public.expert_user_reports
ADD COLUMN IF NOT EXISTS call_session_id TEXT REFERENCES public.call_sessions(id) ON DELETE SET NULL;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN public.expert_user_reports.call_session_id IS 
'Reference to the call session that triggered this report. NULL if report is not related to a call.';

-- ============================================================================
-- INDEX FOR BETTER QUERY PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_expert_user_reports_call_session_id 
ON public.expert_user_reports(call_session_id)
WHERE call_session_id IS NOT NULL;

