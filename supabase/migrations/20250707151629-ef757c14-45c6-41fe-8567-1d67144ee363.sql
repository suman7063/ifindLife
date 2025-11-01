-- First, delete the invalid favorite records since expert IDs 2 and 3 don't exist as UUIDs
DELETE FROM user_favorites WHERE expert_id IN (2, 3);

-- Now change the expert_id column to UUID type
ALTER TABLE user_favorites ALTER COLUMN expert_id TYPE UUID USING expert_id::text::UUID;