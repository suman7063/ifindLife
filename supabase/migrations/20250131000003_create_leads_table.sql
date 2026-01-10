-- Create leads/inquiries table for business and academic program inquiries
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    organization TEXT NOT NULL,
    designation TEXT NOT NULL,
    organization_type TEXT,
    team_size TEXT,
    requirements TEXT,
    type TEXT NOT NULL CHECK (type = ANY (ARRAY['business', 'academic'])),
    status TEXT DEFAULT 'new' CHECK (status = ANY (ARRAY['new', 'contacted', 'qualified', 'converted', 'closed'])),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_type ON public.leads(type);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert leads (for public form submissions)
CREATE POLICY "Allow public insert on leads" ON public.leads
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: Only authenticated users can view leads (for admin/sales team)
CREATE POLICY "Allow authenticated users to view leads" ON public.leads
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Only authenticated users can update leads
CREATE POLICY "Allow authenticated users to update leads" ON public.leads
    FOR UPDATE
    TO authenticated
    USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION update_leads_updated_at();

