-- Migration: Add order_id column to appointments table
-- Created: 2025-01-30
-- This migration adds order_id column to track Razorpay order IDs

-- Add order_id column to appointments table
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS order_id TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN public.appointments.order_id IS 'Razorpay order ID for tracking payment orders. Used for both wallet and gateway payments.';

