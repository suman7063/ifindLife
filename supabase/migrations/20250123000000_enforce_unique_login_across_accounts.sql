-- Migration: Enforce Unique Login Across User, Expert, and Admin Accounts
-- Created: 2025-01-23
-- This migration ensures that email addresses are unique across all account types

-- ============================================================================
-- FUNCTION: Check if email exists in any account table
-- ============================================================================

CREATE OR REPLACE FUNCTION public.check_email_uniqueness_across_accounts(
    p_email TEXT,
    p_exclude_admin_id UUID DEFAULT NULL,
    p_exclude_auth_user_id UUID DEFAULT NULL,
    p_exclude_expert_id UUID DEFAULT NULL,
    p_exclude_user_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $$
DECLARE
    email_exists BOOLEAN := false;
BEGIN
    -- Check if email exists in admin_accounts (excluding current record if updating)
    IF EXISTS (
        SELECT 1 
        FROM public.admin_accounts 
        WHERE LOWER(email) = LOWER(p_email) 
        AND (p_exclude_admin_id IS NULL OR id != p_exclude_admin_id)
    ) THEN
        RETURN false;
    END IF;
    
    -- Check if email exists in auth.users (excluding current record if updating)
    IF EXISTS (
        SELECT 1 
        FROM auth.users 
        WHERE LOWER(email) = LOWER(p_email) 
        AND (p_exclude_auth_user_id IS NULL OR id != p_exclude_auth_user_id)
    ) THEN
        RETURN false;
    END IF;
    
    -- Check if email exists in expert_accounts (excluding current record if updating)
    IF EXISTS (
        SELECT 1 
        FROM public.expert_accounts 
        WHERE LOWER(email) = LOWER(p_email) 
        AND (p_exclude_expert_id IS NULL OR id != p_exclude_expert_id)
    ) THEN
        RETURN false;
    END IF;
    
    -- Check if email exists in public.users (excluding current record if updating)
    -- Note: This is a secondary check since public.users.id references auth.users.id
    IF EXISTS (
        SELECT 1 
        FROM public.users 
        WHERE LOWER(email) = LOWER(p_email) 
        AND (p_exclude_user_id IS NULL OR id != p_exclude_user_id)
    ) THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$;

-- ============================================================================
-- FUNCTION: Validate admin account email uniqueness
-- ============================================================================

CREATE OR REPLACE FUNCTION public.validate_admin_email_uniqueness()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $$
BEGIN
    IF NOT public.check_email_uniqueness_across_accounts(
        NEW.email,
        p_exclude_admin_id := NEW.id
    ) THEN
        RAISE EXCEPTION 'Email % is already registered. Please use a different email address.', NEW.email;
    END IF;
    
    RETURN NEW;
END;
$$;

-- ============================================================================
-- FUNCTION: Validate auth.users email uniqueness (check against admin_accounts)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.validate_auth_user_email_uniqueness()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $$
BEGIN
    -- Check if email exists in admin_accounts
    IF EXISTS (
        SELECT 1 
        FROM public.admin_accounts 
        WHERE LOWER(email) = LOWER(NEW.email)
    ) THEN
        RAISE EXCEPTION 'Email % is already registered as an admin account. Please use a different email address.', NEW.email;
    END IF;
    
    RETURN NEW;
END;
$$;

-- ============================================================================
-- FUNCTION: Validate expert_accounts email uniqueness and consistency
-- ============================================================================

CREATE OR REPLACE FUNCTION public.validate_expert_email_uniqueness()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $$
DECLARE
    auth_user_email TEXT;
BEGIN
    -- If auth_id is provided, ensure email matches auth.users email
    IF NEW.auth_id IS NOT NULL THEN
        SELECT email INTO auth_user_email
        FROM auth.users
        WHERE id = NEW.auth_id;
        
        IF auth_user_email IS NULL THEN
            RAISE EXCEPTION 'Invalid auth_id: No user found in auth.users with id %', NEW.auth_id;
        END IF;
        
        IF LOWER(auth_user_email) != LOWER(NEW.email) THEN
            RAISE EXCEPTION 'Email % does not match the email in auth.users (%). Expert account email must match the authenticated user email.', NEW.email, auth_user_email;
        END IF;
    END IF;
    
    -- Check if email exists in admin_accounts
    IF EXISTS (
        SELECT 1 
        FROM public.admin_accounts 
        WHERE LOWER(email) = LOWER(NEW.email)
    ) THEN
        RAISE EXCEPTION 'Email % is already registered as an admin account. Please use a different email address.', NEW.email;
    END IF;
    
    RETURN NEW;
END;
$$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trigger_validate_admin_email_uniqueness ON public.admin_accounts;
DROP TRIGGER IF EXISTS trigger_validate_auth_user_email_uniqueness ON auth.users;
DROP TRIGGER IF EXISTS trigger_validate_expert_email_uniqueness ON public.expert_accounts;

-- Trigger for admin_accounts
CREATE TRIGGER trigger_validate_admin_email_uniqueness
    BEFORE INSERT OR UPDATE OF email ON public.admin_accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_admin_email_uniqueness();

-- Trigger for auth.users
CREATE TRIGGER trigger_validate_auth_user_email_uniqueness
    BEFORE INSERT OR UPDATE OF email ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_auth_user_email_uniqueness();

-- Trigger for expert_accounts
CREATE TRIGGER trigger_validate_expert_email_uniqueness
    BEFORE INSERT OR UPDATE OF email, auth_id ON public.expert_accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_expert_email_uniqueness();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.check_email_uniqueness_across_accounts IS 
'Checks if an email address is unique across admin_accounts, auth.users, and expert_accounts tables';

COMMENT ON FUNCTION public.validate_admin_email_uniqueness IS 
'Validates that admin account email is unique across all account types';

COMMENT ON FUNCTION public.validate_auth_user_email_uniqueness IS 
'Validates that auth.users email does not conflict with admin_accounts';

COMMENT ON FUNCTION public.validate_expert_email_uniqueness IS 
'Validates that expert account email matches auth.users email and does not conflict with admin_accounts';

