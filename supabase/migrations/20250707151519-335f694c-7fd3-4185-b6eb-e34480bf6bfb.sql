-- Fix data type mismatch between experts and user_favorites tables
-- The experts table uses UUID but user_favorites uses integer for expert_id

-- First, let's see if there are any existing records that would be affected
-- We need to update the user_favorites table to use UUID for expert_id instead of integer

-- Drop existing foreign key constraint if it exists
ALTER TABLE user_favorites DROP CONSTRAINT IF EXISTS user_favorites_expert_id_fkey;

-- Change expert_id column to UUID to match experts.id
ALTER TABLE user_favorites ALTER COLUMN expert_id TYPE UUID USING expert_id::text::UUID;

-- Add foreign key constraint to ensure data integrity
ALTER TABLE user_favorites ADD CONSTRAINT user_favorites_expert_id_fkey 
  FOREIGN KEY (expert_id) REFERENCES experts(id) ON DELETE CASCADE;