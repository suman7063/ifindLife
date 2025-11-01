-- Add session pricing columns to expert_pricing_tiers table (INR and EUR only)
ALTER TABLE expert_pricing_tiers 
ADD COLUMN session_30_inr NUMERIC DEFAULT 0, 
ADD COLUMN session_30_eur NUMERIC DEFAULT 0,
ADD COLUMN session_60_inr NUMERIC DEFAULT 0,
ADD COLUMN session_60_eur NUMERIC DEFAULT 0;