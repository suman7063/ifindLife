
-- Fix expert_accounts table structure to match the new schema
-- First, let's add the missing columns to the existing expert_accounts table

-- Add missing columns that don't exist yet
ALTER TABLE expert_accounts 
ADD COLUMN IF NOT EXISTS specialties TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS availability_hours JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{"English"}',
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Add status check constraint if it doesn't exist
DO $$
BEGIN
    ALTER TABLE expert_accounts ADD CONSTRAINT expert_accounts_status_check 
    CHECK (status IN ('pending', 'approved', 'rejected'));
EXCEPTION
    WHEN duplicate_object THEN
        NULL; -- Constraint already exists, ignore
END $$;

-- Update the default status if needed
ALTER TABLE expert_accounts ALTER COLUMN status SET DEFAULT 'pending';

-- Create indexes for performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_expert_accounts_auth_id ON expert_accounts(auth_id);
CREATE INDEX IF NOT EXISTS idx_expert_accounts_status ON expert_accounts(status);
CREATE INDEX IF NOT EXISTS idx_expert_accounts_email ON expert_accounts(email);

-- Insert/update the test expert account (Neo) with error handling
DO $$
BEGIN
    -- First check if the auth user exists
    IF EXISTS (SELECT 1 FROM auth.users WHERE id = '236ec9a3-0726-4735-8cc6-058fc8999dce'::UUID) THEN
        INSERT INTO expert_accounts (
            auth_id,
            email,
            name,
            status,
            specialties,
            bio,
            experience_years,
            hourly_rate,
            currency
        ) VALUES (
            '236ec9a3-0726-4735-8cc6-058fc8999dce'::UUID,
            'neo@gmail.com',
            'Dr. Neo Expert',
            'approved',
            ARRAY['Mental Health', 'Life Coaching', 'Stress Management'],
            'Experienced mental health professional specializing in cognitive behavioral therapy and stress management.',
            10,
            75.00,
            'USD'
        ) ON CONFLICT (auth_id) DO UPDATE SET
            status = 'approved',
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            specialties = EXCLUDED.specialties,
            bio = EXCLUDED.bio,
            experience_years = EXCLUDED.experience_years,
            hourly_rate = EXCLUDED.hourly_rate,
            updated_at = NOW();
        
        RAISE NOTICE 'Expert account created/updated successfully for Neo';
    ELSE
        RAISE NOTICE 'WARNING: Auth user with ID 236ec9a3-0726-4735-8cc6-058fc8999dce does not exist in auth.users table';
        RAISE NOTICE 'Skipping expert account creation for Neo';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'ERROR: %', SQLERRM;
END $$;

-- Set up Row Level Security (RLS)
ALTER TABLE expert_accounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read expert profiles" ON expert_accounts;
DROP POLICY IF EXISTS "Allow experts to read own profile" ON expert_accounts;
DROP POLICY IF EXISTS "Allow experts to update own profile" ON expert_accounts;
DROP POLICY IF EXISTS "Allow experts to insert own profile" ON expert_accounts;

-- Create new RLS policies
CREATE POLICY "Allow authenticated users to read expert profiles"
ON expert_accounts FOR SELECT
TO authenticated
USING (status = 'approved');

CREATE POLICY "Allow experts to read own profile"
ON expert_accounts FOR SELECT
TO authenticated
USING (auth_id = auth.uid());

CREATE POLICY "Allow experts to update own profile"
ON expert_accounts FOR UPDATE
TO authenticated
USING (auth_id = auth.uid());

CREATE POLICY "Allow experts to insert own profile"
ON expert_accounts FOR INSERT
TO authenticated
WITH CHECK (auth_id = auth.uid());

-- Verification queries
SELECT 
    'Current expert_accounts table structure' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'expert_accounts'
ORDER BY ordinal_position;

SELECT 
    'Total expert accounts' as description,
    COUNT(*) as count
FROM expert_accounts;

SELECT 
    'Approved expert accounts' as description,
    COUNT(*) as count
FROM expert_accounts 
WHERE status = 'approved';
