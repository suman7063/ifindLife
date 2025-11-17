-- Migration: Add 30min and 60min pricing fields to expert_categories table
-- Created: 2025-01-20
-- This migration adds duration-based pricing fields for 30 and 60 minute sessions

-- ============================================================================
-- ADD DURATION PRICING COLUMNS
-- ============================================================================

ALTER TABLE public.expert_categories
ADD COLUMN IF NOT EXISTS base_price_30_inr NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS base_price_30_eur NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS base_price_60_inr NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS base_price_60_eur NUMERIC DEFAULT 0;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN public.expert_categories.base_price_30_inr IS 'Base price for 30-minute sessions in Indian Rupees';
COMMENT ON COLUMN public.expert_categories.base_price_30_eur IS 'Base price for 30-minute sessions in Euros';
COMMENT ON COLUMN public.expert_categories.base_price_60_inr IS 'Base price for 60-minute sessions in Indian Rupees';
COMMENT ON COLUMN public.expert_categories.base_price_60_eur IS 'Base price for 60-minute sessions in Euros';

