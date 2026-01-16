-- Migration: Prevent Negative Wallet Balance
-- Created: 2025-01-16
-- This migration adds a database trigger to prevent negative wallet balance

-- ============================================================================
-- FUNCTION: Check Wallet Balance Before Debit
-- ============================================================================

CREATE OR REPLACE FUNCTION public.check_wallet_balance_before_debit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_current_balance NUMERIC := 0;
    v_new_balance NUMERIC := 0;
BEGIN
    -- Only check for debit transactions
    IF NEW.type = 'debit' THEN
        -- Calculate current balance (before this transaction)
        SELECT public.get_wallet_balance(NEW.user_id)
        INTO v_current_balance;
        
        -- Calculate new balance after this debit
        v_new_balance := v_current_balance - NEW.amount;
        
        -- Prevent negative balance (allow 0 but not negative)
        IF v_new_balance < 0 THEN
            RAISE EXCEPTION 'Insufficient wallet balance. Current balance: %, Required: %, Shortfall: %', 
                v_current_balance, 
                NEW.amount, 
                ABS(v_new_balance);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- ============================================================================
-- TRIGGER: Prevent Negative Balance
-- ============================================================================

DROP TRIGGER IF EXISTS prevent_negative_wallet_balance ON public.wallet_transactions;

CREATE TRIGGER prevent_negative_wallet_balance
    BEFORE INSERT ON public.wallet_transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.check_wallet_balance_before_debit();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.check_wallet_balance_before_debit() IS 'Prevents negative wallet balance by checking balance before allowing debit transactions';
COMMENT ON TRIGGER prevent_negative_wallet_balance ON public.wallet_transactions IS 'Triggers before insert to prevent negative wallet balance';
