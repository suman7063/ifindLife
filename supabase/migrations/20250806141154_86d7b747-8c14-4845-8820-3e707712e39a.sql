-- Add languages column to expert_accounts table
ALTER TABLE public.expert_accounts 
ADD COLUMN languages TEXT[] DEFAULT '{}';

-- Update existing records to have default languages
UPDATE public.expert_accounts 
SET languages = ARRAY['English'] 
WHERE languages IS NULL OR array_length(languages, 1) IS NULL;