-- Migration: Create call_pricing table
-- Created: 2025-01-29
-- This table stores pricing for different call durations

CREATE TABLE IF NOT EXISTS public.call_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    price_usd NUMERIC NOT NULL CHECK (price_usd >= 0),
    price_inr NUMERIC NOT NULL CHECK (price_inr >= 0),
    price_eur NUMERIC CHECK (price_eur >= 0),
    tier TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_call_pricing_duration ON public.call_pricing(duration_minutes);
CREATE INDEX IF NOT EXISTS idx_call_pricing_active ON public.call_pricing(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_call_pricing_tier ON public.call_pricing(tier) WHERE tier IS NOT NULL;

-- Add unique constraint for duration to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_call_pricing_duration_unique ON public.call_pricing(duration_minutes) WHERE active = true;

COMMENT ON TABLE public.call_pricing IS 'Stores pricing for different call durations (5min, 10min, 15min, 30min, 60min)';

