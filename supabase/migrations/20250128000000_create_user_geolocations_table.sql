-- Create user_geolocations table for storing user geolocation data
-- This table is used by useExpertPricing hook to detect user currency

CREATE TABLE IF NOT EXISTS public.user_geolocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    country_code TEXT,
    country_name TEXT,
    currency TEXT CHECK (currency IN ('INR', 'EUR', 'USD')),
    ip_address INET,
    detected_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_geolocations_user_id ON public.user_geolocations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_geolocations_detected_at ON public.user_geolocations(detected_at DESC);

-- Enable RLS
ALTER TABLE public.user_geolocations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own geolocation data
CREATE POLICY "Users can view their own geolocation data"
    ON public.user_geolocations
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own geolocation data
CREATE POLICY "Users can insert their own geolocation data"
    ON public.user_geolocations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own geolocation data
CREATE POLICY "Users can update their own geolocation data"
    ON public.user_geolocations
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

