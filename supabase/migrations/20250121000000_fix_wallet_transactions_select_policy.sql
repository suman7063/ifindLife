-- Migration: Fix wallet_transactions SELECT policy for service_role
-- Created: 2025-01-21
-- This ensures service_role can SELECT all wallet transactions (for edge functions)

-- Service role can select all transactions (for edge functions)
DROP POLICY IF EXISTS "Service role can select wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Service role can select wallet transactions" ON public.wallet_transactions
    FOR SELECT
    TO service_role
    USING (true);

