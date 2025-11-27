-- Migration: Add currency column to wallet_transactions table
-- Created: 2025-01-22
-- This migration adds currency support to wallet_transactions for INR and EUR

-- ============================================================================
-- ADD CURRENCY COLUMN
-- ============================================================================

-- Add currency column with default 'INR' for backward compatibility
ALTER TABLE public.wallet_transactions
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR' CHECK (currency IN ('INR', 'EUR'));

-- Update existing rows to have 'INR' as default (if any exist)
UPDATE public.wallet_transactions
SET currency = 'INR'
WHERE currency IS NULL;

-- Make currency NOT NULL after setting defaults
ALTER TABLE public.wallet_transactions
ALTER COLUMN currency SET NOT NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_currency ON public.wallet_transactions(currency);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN public.wallet_transactions.currency IS 'Currency of the transaction: INR or EUR';

