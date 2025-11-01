-- Update user_reports table to use UUID for expert_id consistency
ALTER TABLE user_reports DROP COLUMN expert_id;
ALTER TABLE user_reports ADD COLUMN expert_id UUID REFERENCES expert_accounts(id) ON DELETE CASCADE;

-- Add index for better performance
CREATE INDEX idx_user_reports_expert_id ON user_reports(expert_id);