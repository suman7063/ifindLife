-- Migration: Change 'disapproved' status to 'rejected' in expert_accounts table
-- This migration updates the status constraint and existing data

-- Step 1: Drop the old CHECK constraint first
ALTER TABLE public.expert_accounts
DROP CONSTRAINT IF EXISTS expert_accounts_status_check;

-- Step 2: Update all existing 'disapproved' records to 'rejected'
UPDATE public.expert_accounts
SET status = 'rejected'
WHERE status = 'disapproved';

-- Step 3: Add new CHECK constraint with 'rejected' instead of 'disapproved'
ALTER TABLE public.expert_accounts
ADD CONSTRAINT expert_accounts_status_check 
CHECK (status = ANY (ARRAY['pending', 'approved', 'rejected']));

-- Step 4: Update admin_update_expert_status function to use 'rejected'
-- Note: Function uses p_auth_id parameter, not p_id
CREATE OR REPLACE FUNCTION public.admin_update_expert_status(p_auth_id uuid, p_status text)
RETURNS expert_accounts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  updated_row public.expert_accounts;
BEGIN
  IF p_status NOT IN ('approved', 'rejected', 'pending') THEN
    RAISE EXCEPTION 'Invalid status: %', p_status USING ERRCODE = '22000';
  END IF;

  UPDATE public.expert_accounts
  SET status = p_status
  WHERE auth_id = p_auth_id
  RETURNING * INTO updated_row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Expert not found for auth_id: %', p_auth_id USING ERRCODE = 'P0002';
  END IF;

  RETURN updated_row;
END;
$$;

-- Step 5: Update handle_expert_approval trigger function to use 'rejected'
CREATE OR REPLACE FUNCTION public.handle_expert_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status != OLD.status AND NEW.status IN ('approved', 'rejected') THEN
    INSERT INTO public.expert_approval_notifications (expert_id, notification_type)
    VALUES (NEW.auth_id, CASE WHEN NEW.status = 'approved' THEN 'approval' ELSE 'rejection' END);
  END IF;
  RETURN NEW;
END;
$$;

