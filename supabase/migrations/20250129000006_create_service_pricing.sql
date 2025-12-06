-- Migration: Create service_pricing table
-- Created: 2025-01-29
-- This table stores pricing information for expert services

CREATE TABLE IF NOT EXISTS public.service_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID REFERENCES public.expert_accounts(auth_id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    base_price_usd NUMERIC NOT NULL DEFAULT 0 CHECK (base_price_usd >= 0),
    base_price_inr NUMERIC NOT NULL DEFAULT 0 CHECK (base_price_inr >= 0),
    minimum_session_duration INTEGER,
    maximum_session_duration INTEGER,
    experience_multiplier NUMERIC DEFAULT 1.0,
    demand_multiplier NUMERIC DEFAULT 1.0,
    peak_hour_multiplier NUMERIC DEFAULT 1.0,
    discount_percentage NUMERIC DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_service_pricing_expert_id ON public.service_pricing(expert_id);
CREATE INDEX IF NOT EXISTS idx_service_pricing_service_id ON public.service_pricing(service_id);
CREATE INDEX IF NOT EXISTS idx_service_pricing_active ON public.service_pricing(is_active) WHERE is_active = true;

-- Add unique constraint to prevent duplicate pricing for same expert-service combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_service_pricing_expert_service_unique 
    ON public.service_pricing(expert_id, service_id) WHERE is_active = true;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_service_pricing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_service_pricing_updated_at
    BEFORE UPDATE ON public.service_pricing
    FOR EACH ROW
    EXECUTE FUNCTION update_service_pricing_updated_at();

COMMENT ON TABLE public.service_pricing IS 'Stores dynamic pricing information for expert services with multipliers and discounts';

