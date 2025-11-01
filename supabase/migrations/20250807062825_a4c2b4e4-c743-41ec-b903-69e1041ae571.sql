-- Update user_reviews table to properly reference expert_accounts with UUID
-- First, drop the existing expert_id column
ALTER TABLE user_reviews DROP COLUMN expert_id;

-- Add the new expert_id column with proper UUID type and foreign key
ALTER TABLE user_reviews ADD COLUMN expert_id UUID REFERENCES expert_accounts(id) ON DELETE CASCADE;

-- Add an index for better performance
CREATE INDEX idx_user_reviews_expert_id ON user_reviews(expert_id);

-- Also add missing columns that are expected
ALTER TABLE user_reviews ADD COLUMN expert_name TEXT;
ALTER TABLE user_reviews ADD COLUMN user_name TEXT;