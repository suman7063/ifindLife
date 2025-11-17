-- Migration: Add wallet_transactions table and get_wallet_balance function
-- Created: 2025-01-15
-- This migration adds the wallet_transactions table and the balance calculation function

-- ============================================================================
-- WALLET TRANSACTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
    amount NUMERIC NOT NULL CHECK (amount > 0),
    reason TEXT NOT NULL,
    description TEXT,
    reference_id UUID,
    reference_type TEXT,
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON public.wallet_transactions(type);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON public.wallet_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_expires_at ON public.wallet_transactions(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_reference ON public.wallet_transactions(reference_id, reference_type);

-- ============================================================================
-- WALLET BALANCE FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_wallet_balance(p_user_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_credits NUMERIC := 0;
    v_debits NUMERIC := 0;
    v_balance NUMERIC := 0;
BEGIN
    -- Calculate total valid credits (non-expired)
    SELECT COALESCE(SUM(amount), 0)
    INTO v_credits
    FROM public.wallet_transactions
    WHERE user_id = p_user_id
      AND type = 'credit'
      AND (expires_at IS NULL OR expires_at >= NOW());
    
    -- Calculate total debits
    SELECT COALESCE(SUM(amount), 0)
    INTO v_debits
    FROM public.wallet_transactions
    WHERE user_id = p_user_id
      AND type = 'debit';
    
    -- Calculate balance
    v_balance := v_credits - v_debits;
    
    RETURN v_balance;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_wallet_balance(UUID) TO authenticated, anon;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
DROP POLICY IF EXISTS "Users can view own wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Users can view own wallet transactions" ON public.wallet_transactions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Service role can insert transactions (for edge functions)
DROP POLICY IF EXISTS "Service role can insert wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Service role can insert wallet transactions" ON public.wallet_transactions
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Service role can update transactions
DROP POLICY IF EXISTS "Service role can update wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Service role can update wallet transactions" ON public.wallet_transactions
    FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Service role can delete transactions (for admin operations)
DROP POLICY IF EXISTS "Service role can delete wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Service role can delete wallet transactions" ON public.wallet_transactions
    FOR DELETE
    TO service_role
    USING (true);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.wallet_transactions IS 'Stores all wallet credit and debit transactions for users';
COMMENT ON COLUMN public.wallet_transactions.type IS 'Type of transaction: credit (money added) or debit (money deducted)';
COMMENT ON COLUMN public.wallet_transactions.reason IS 'Reason for transaction: purchase, booking, refund, referral_reward, promotional, compensation, adjustment, expiry';
COMMENT ON COLUMN public.wallet_transactions.expires_at IS 'Expiry date for credits. Credits expire 12 months after being added. NULL for debits.';
COMMENT ON COLUMN public.wallet_transactions.metadata IS 'Additional transaction data stored as JSON';
COMMENT ON FUNCTION public.get_wallet_balance(UUID) IS 'Calculates wallet balance by summing valid (non-expired) credits and subtracting all debits';

