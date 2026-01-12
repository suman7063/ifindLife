-- Migration: Rename expert_services table to admin_expert_service_assignments
-- This makes it clear that this table is for admin-assigned services (like retreats)
-- and avoids confusion with expert_service_specializations (expert-selected services)

-- Step 1: Rename the table
ALTER TABLE public.expert_services 
RENAME TO admin_expert_service_assignments;

-- Step 2: Rename foreign key constraints (if they exist)
ALTER TABLE public.admin_expert_service_assignments
RENAME CONSTRAINT expert_services_expert_id_fkey TO admin_expert_service_assignments_expert_id_fkey;

ALTER TABLE public.admin_expert_service_assignments
RENAME CONSTRAINT expert_services_service_id_fkey TO admin_expert_service_assignments_service_id_fkey;

-- Step 3: Rename indexes (if they exist)
DO $$
BEGIN
    -- Rename index if it exists
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'expert_services_expert_id_idx') THEN
        ALTER INDEX public.expert_services_expert_id_idx 
        RENAME TO admin_expert_service_assignments_expert_id_idx;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'expert_services_service_id_idx') THEN
        ALTER INDEX public.expert_services_service_id_idx 
        RENAME TO admin_expert_service_assignments_service_id_idx;
    END IF;
END $$;

-- Step 4: Update RLS policies (drop old and create new with new table name)
DROP POLICY IF EXISTS "Authenticated users can insert expert services" ON public.admin_expert_service_assignments;
DROP POLICY IF EXISTS "Authenticated users can update expert services" ON public.admin_expert_service_assignments;
DROP POLICY IF EXISTS "Authenticated users can delete expert services" ON public.admin_expert_service_assignments;

-- Create new policies with updated names
CREATE POLICY "Authenticated users can insert admin service assignments" ON public.admin_expert_service_assignments
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update admin service assignments" ON public.admin_expert_service_assignments
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete admin service assignments" ON public.admin_expert_service_assignments
    FOR DELETE
    TO authenticated
    USING (true);

-- Step 5: Grant permissions
GRANT ALL ON public.admin_expert_service_assignments TO authenticated;
GRANT SELECT ON public.admin_expert_service_assignments TO anon;

-- Note: Any views, functions, or triggers that reference expert_services will need to be updated separately

