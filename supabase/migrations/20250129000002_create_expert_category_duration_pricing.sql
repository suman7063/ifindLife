-- Migration: Create expert_category_duration_pricing table
-- Created: 2025-01-29
-- This table stores duration-based pricing for expert categories

CREATE TABLE IF NOT EXISTS public.expert_category_duration_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id TEXT NOT NULL REFERENCES public.expert_categories(id) ON DELETE CASCADE,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    price_inr NUMERIC NOT NULL DEFAULT 0 CHECK (price_inr >= 0),
    price_eur NUMERIC NOT NULL DEFAULT 0 CHECK (price_eur >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_expert_category_duration_pricing_category_id ON public.expert_category_duration_pricing(category_id);
CREATE INDEX IF NOT EXISTS idx_expert_category_duration_pricing_duration ON public.expert_category_duration_pricing(duration_minutes);

-- Add unique constraint to prevent duplicate pricing for same category and duration
CREATE UNIQUE INDEX IF NOT EXISTS idx_expert_category_duration_pricing_unique 
    ON public.expert_category_duration_pricing(category_id, duration_minutes);

COMMENT ON TABLE public.expert_category_duration_pricing IS 'Stores duration-based pricing (e.g., 30min, 60min) for each expert category';

