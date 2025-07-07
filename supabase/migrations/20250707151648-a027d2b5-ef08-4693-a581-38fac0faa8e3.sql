-- Add foreign key constraint to ensure data integrity
ALTER TABLE user_favorites ADD CONSTRAINT user_favorites_expert_id_fkey 
  FOREIGN KEY (expert_id) REFERENCES experts(id) ON DELETE CASCADE;