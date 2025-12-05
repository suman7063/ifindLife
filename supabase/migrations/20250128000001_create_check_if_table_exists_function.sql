-- Create RPC function to check if a table exists
-- This is used by useExpertPricing to check if category_pricing table exists

CREATE OR REPLACE FUNCTION public.check_if_table_exists(table_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = check_if_table_exists.table_name
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.check_if_table_exists(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_if_table_exists(TEXT) TO anon;

