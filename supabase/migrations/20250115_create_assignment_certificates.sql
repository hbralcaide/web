-- Create assignment_certificates table
CREATE TABLE IF NOT EXISTS public.assignment_certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_id UUID NOT NULL REFERENCES public.vendor_applications(id) ON DELETE CASCADE,
    vendor_name TEXT NOT NULL,
    business_name TEXT,
    stall_number TEXT NOT NULL,
    section_name TEXT NOT NULL,
    assigned_date TIMESTAMP WITH TIME ZONE NOT NULL,
    certificate_number TEXT UNIQUE NOT NULL,
    raffle_conducted_by TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add certificate-related columns to vendor_applications if they don't exist
DO $$ 
BEGIN
    -- Add certificate_number column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendor_applications' 
        AND column_name = 'certificate_number'
    ) THEN
        ALTER TABLE public.vendor_applications 
        ADD COLUMN certificate_number TEXT;
    END IF;

    -- Add assigned_stall column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendor_applications' 
        AND column_name = 'assigned_stall'
    ) THEN
        ALTER TABLE public.vendor_applications 
        ADD COLUMN assigned_stall TEXT;
    END IF;

    -- Add assigned_section column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendor_applications' 
        AND column_name = 'assigned_section'
    ) THEN
        ALTER TABLE public.vendor_applications 
        ADD COLUMN assigned_section TEXT;
    END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_assignment_certificates_vendor_id ON public.assignment_certificates(vendor_id);
CREATE INDEX IF NOT EXISTS idx_assignment_certificates_certificate_number ON public.assignment_certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_vendor_applications_certificate_number ON public.vendor_applications(certificate_number);

-- Add 'not_selected' to status enum if it doesn't exist
DO $$
BEGIN
    -- Check if the enum value already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'not_selected' 
        AND enumtypid = (
            SELECT oid FROM pg_type WHERE typname = 'vendor_status'
        )
    ) THEN
        -- Add the new enum value
        ALTER TYPE vendor_status ADD VALUE 'not_selected';
    END IF;
EXCEPTION
    WHEN duplicate_object THEN
        -- Value already exists, do nothing
        NULL;
END $$;

-- Enable RLS
ALTER TABLE public.assignment_certificates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your auth requirements)
CREATE POLICY "Allow read access to assignment certificates" ON public.assignment_certificates
    FOR SELECT USING (true);

CREATE POLICY "Allow admin insert on assignment certificates" ON public.assignment_certificates
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin update on assignment certificates" ON public.assignment_certificates
    FOR UPDATE USING (true);

-- Add comments
COMMENT ON TABLE public.assignment_certificates IS 'Stores stall assignment certificates generated after raffle';
COMMENT ON COLUMN public.assignment_certificates.certificate_number IS 'Unique certificate identifier';
COMMENT ON COLUMN public.assignment_certificates.status IS 'Certificate status: active, revoked, or expired';


