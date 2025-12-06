-- Migration: Create expert_onboarding_status table
-- Created: 2025-01-29
-- This table tracks the onboarding progress for experts

CREATE TABLE IF NOT EXISTS public.expert_onboarding_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id TEXT NOT NULL UNIQUE,
    profile_completed BOOLEAN DEFAULT false,
    pricing_setup BOOLEAN DEFAULT false,
    availability_setup BOOLEAN DEFAULT false,
    services_assigned BOOLEAN DEFAULT false,
    onboarding_completed BOOLEAN DEFAULT false,
    first_login_after_approval TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_expert_onboarding_status_expert_id ON public.expert_onboarding_status(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_onboarding_status_completed ON public.expert_onboarding_status(onboarding_completed) WHERE onboarding_completed = true;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_expert_onboarding_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_expert_onboarding_status_updated_at
    BEFORE UPDATE ON public.expert_onboarding_status
    FOR EACH ROW
    EXECUTE FUNCTION update_expert_onboarding_status_updated_at();

COMMENT ON TABLE public.expert_onboarding_status IS 'Tracks onboarding progress for experts including profile, pricing, availability, and services setup';

