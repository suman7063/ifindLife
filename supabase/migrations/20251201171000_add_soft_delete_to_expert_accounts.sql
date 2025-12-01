-- Migration: Add soft delete support to expert_accounts
-- Created: 2025-12-01
-- This migration adds deleted_at column for soft delete functionality

-- ============================================================================
-- ADD deleted_at COLUMN
-- ============================================================================

ALTER TABLE public.expert_accounts
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- ============================================================================
-- CREATE INDEX FOR EFFICIENT QUERIES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_expert_accounts_deleted_at 
ON public.expert_accounts(deleted_at) 
WHERE deleted_at IS NULL;

-- ============================================================================
-- UPDATE admin_list_all_experts FUNCTION TO FILTER DELETED EXPERTS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.admin_list_all_experts()
RETURNS SETOF expert_accounts
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT *
  FROM public.expert_accounts
  WHERE deleted_at IS NULL
  ORDER BY created_at DESC NULLS LAST;
$$;

-- ============================================================================
-- CREATE FUNCTION TO RESTORE DELETED EXPERT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.admin_restore_expert(p_auth_id uuid)
RETURNS expert_accounts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  restored_row public.expert_accounts;
BEGIN
  UPDATE public.expert_accounts
  SET deleted_at = NULL
  WHERE auth_id = p_auth_id
    AND deleted_at IS NOT NULL
  RETURNING * INTO restored_row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Expert not found or not deleted for auth_id: %', p_auth_id USING ERRCODE = 'P0002';
  END IF;

  RETURN restored_row;
END;
$$;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.admin_restore_expert(uuid) TO authenticated;

