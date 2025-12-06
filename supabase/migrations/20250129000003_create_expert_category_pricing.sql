-- Migration: Create expert_category_pricing table
-- Created: 2025-01-29
-- This table stores pricing information for expert categories

CREATE TABLE IF NOT EXISTS public.expert_category_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    price_usd NUMERIC NOT NULL CHECK (price_usd >= 0),
    price_inr NUMERIC NOT NULL CHECK (price_inr >= 0),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_expert_category_pricing_category ON public.expert_category_pricing(category);
CREATE INDEX IF NOT EXISTS idx_expert_category_pricing_active ON public.expert_category_pricing(active) WHERE active = true;

COMMENT ON TABLE public.expert_category_pricing IS 'Stores pricing information for expert categories by duration';

