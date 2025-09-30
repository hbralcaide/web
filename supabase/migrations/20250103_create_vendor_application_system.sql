-- Create comprehensive vendor application and raffle system
-- This supports the complete process: application -> raffle -> contract -> certification

-- 1. Create vendor_applications table for the initial application process
CREATE TABLE IF NOT EXISTS vendor_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_number VARCHAR(6) NOT NULL UNIQUE, -- Simple 6-digit number
    
    -- Personal Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    middle_name TEXT,
    age INTEGER,
    marital_status TEXT,
    spouse_name TEXT,
    complete_address TEXT NOT NULL,
    actual_occupant TEXT,
    
    -- Application Status
    status TEXT DEFAULT 'draft', -- draft, pending_notarization, pending_approval, approved, rejected
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Documents (stored as base64 or file paths)
    person_photo TEXT,
    barangay_clearance TEXT,
    id_front_photo TEXT,
    id_back_photo TEXT,
    birth_certificate TEXT,
    marriage_certificate TEXT,
    notarized_document TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create stall_applications table to track which stalls vendors applied for
CREATE TABLE IF NOT EXISTS stall_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_application_id UUID NOT NULL REFERENCES vendor_applications(id) ON DELETE CASCADE,
    stall_id UUID NOT NULL, -- Will reference stalls table when created
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one application per vendor per stall
    UNIQUE(vendor_application_id, stall_id)
);

-- 3. Create raffle_events table to track raffle sessions
CREATE TABLE IF NOT EXISTS raffle_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stall_id UUID NOT NULL, -- Will reference stalls table when created
    event_name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    scheduled_date TIMESTAMP WITH TIME ZONE,
    conducted_at TIMESTAMP WITH TIME ZONE,
    conducted_by UUID, -- Admin who conducted the raffle
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create raffle_participants table to track who participated in each raffle
CREATE TABLE IF NOT EXISTS raffle_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    raffle_event_id UUID NOT NULL REFERENCES raffle_events(id) ON DELETE CASCADE,
    vendor_application_id UUID NOT NULL REFERENCES vendor_applications(id) ON DELETE CASCADE,
    participant_number INTEGER, -- Number assigned during raffle
    is_winner BOOLEAN DEFAULT FALSE,
    selected_at TIMESTAMP WITH TIME ZONE,
    
    -- Ensure one participation per vendor per raffle
    UNIQUE(raffle_event_id, vendor_application_id)
);

-- 5. Create vendor_contracts table for 2-year contracts
CREATE TABLE IF NOT EXISTS vendor_contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_application_id UUID NOT NULL REFERENCES vendor_applications(id) ON DELETE CASCADE,
    stall_id UUID NOT NULL, -- Will reference stalls table when created
    contract_number TEXT NOT NULL UNIQUE,
    
    -- Contract Terms
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    contract_duration_months INTEGER DEFAULT 24, -- 2 years
    monthly_rent DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2) NOT NULL,
    
    -- Contract Status
    status TEXT DEFAULT 'pending', -- pending, active, expired, terminated, extended
    signed_at TIMESTAMP WITH TIME ZONE,
    activated_at TIMESTAMP WITH TIME ZONE,
    terminated_at TIMESTAMP WITH TIME ZONE,
    termination_reason TEXT,
    
    -- Extension Information
    is_extended BOOLEAN DEFAULT FALSE,
    original_end_date DATE,
    extension_months INTEGER DEFAULT 0,
    extension_reason TEXT,
    
    -- Additional Requirements Status
    business_permit_submitted BOOLEAN DEFAULT FALSE,
    business_permit_approved BOOLEAN DEFAULT FALSE,
    cedula_submitted BOOLEAN DEFAULT FALSE,
    cedula_approved BOOLEAN DEFAULT FALSE,
    
    -- Documents
    contract_document TEXT, -- Signed contract PDF
    business_permit_document TEXT,
    cedula_document TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create vendor_certifications table for vendor certificates
CREATE TABLE IF NOT EXISTS vendor_certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_contract_id UUID NOT NULL REFERENCES vendor_contracts(id) ON DELETE CASCADE,
    certificate_number TEXT NOT NULL UNIQUE,
    certificate_type TEXT DEFAULT 'vendor_certificate',
    
    -- Certificate Details
    issued_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    status TEXT DEFAULT 'active', -- active, expired, revoked
    
    -- Certificate Document
    certificate_document TEXT, -- PDF of the certificate
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendor_applications_status ON vendor_applications(status);
CREATE INDEX IF NOT EXISTS idx_vendor_applications_application_number ON vendor_applications(application_number);
CREATE INDEX IF NOT EXISTS idx_vendor_applications_submitted_at ON vendor_applications(submitted_at);

CREATE INDEX IF NOT EXISTS idx_stall_applications_stall_id ON stall_applications(stall_id);
CREATE INDEX IF NOT EXISTS idx_stall_applications_vendor_application_id ON stall_applications(vendor_application_id);

CREATE INDEX IF NOT EXISTS idx_raffle_events_stall_id ON raffle_events(stall_id);
CREATE INDEX IF NOT EXISTS idx_raffle_events_status ON raffle_events(status);
CREATE INDEX IF NOT EXISTS idx_raffle_events_scheduled_date ON raffle_events(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_raffle_participants_raffle_event_id ON raffle_participants(raffle_event_id);
CREATE INDEX IF NOT EXISTS idx_raffle_participants_vendor_application_id ON raffle_participants(vendor_application_id);
CREATE INDEX IF NOT EXISTS idx_raffle_participants_is_winner ON raffle_participants(is_winner);

CREATE INDEX IF NOT EXISTS idx_vendor_contracts_stall_id ON vendor_contracts(stall_id);
CREATE INDEX IF NOT EXISTS idx_vendor_contracts_vendor_application_id ON vendor_contracts(vendor_application_id);
CREATE INDEX IF NOT EXISTS idx_vendor_contracts_status ON vendor_contracts(status);
CREATE INDEX IF NOT EXISTS idx_vendor_contracts_contract_number ON vendor_contracts(contract_number);

CREATE INDEX IF NOT EXISTS idx_vendor_certifications_vendor_contract_id ON vendor_certifications(vendor_contract_id);
CREATE INDEX IF NOT EXISTS idx_vendor_certifications_certificate_number ON vendor_certifications(certificate_number);
CREATE INDEX IF NOT EXISTS idx_vendor_certifications_status ON vendor_certifications(status);

-- 8. Enable Row Level Security
ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE stall_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE raffle_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE raffle_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_certifications ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS Policies

-- Vendor Applications Policies
CREATE POLICY "Anyone can create vendor applications" ON vendor_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view approved vendor applications" ON vendor_applications
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Admins can view all vendor applications" ON vendor_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update vendor applications" ON vendor_applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

-- Stall Applications Policies
CREATE POLICY "Anyone can create stall applications" ON stall_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view stall applications" ON stall_applications
    FOR SELECT USING (true);

-- Raffle Events Policies (Admin only)
CREATE POLICY "Admins can manage raffle events" ON raffle_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

-- Raffle Participants Policies
CREATE POLICY "Anyone can view raffle participants" ON raffle_participants
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage raffle participants" ON raffle_participants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

-- Vendor Contracts Policies
CREATE POLICY "Anyone can view active contracts" ON vendor_contracts
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage vendor contracts" ON vendor_contracts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

-- Vendor Certifications Policies
CREATE POLICY "Anyone can view active certifications" ON vendor_certifications
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage vendor certifications" ON vendor_certifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid() 
            AND admin_profiles.role = 'admin'
        )
    );

-- 10. Create trigger functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 11. Create triggers for updated_at
CREATE TRIGGER update_vendor_applications_updated_at
    BEFORE UPDATE ON vendor_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_raffle_events_updated_at
    BEFORE UPDATE ON raffle_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_contracts_updated_at
    BEFORE UPDATE ON vendor_contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_certifications_updated_at
    BEFORE UPDATE ON vendor_certifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 12. Create function to generate unique application numbers
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    exists_count INTEGER;
BEGIN
    LOOP
        -- Generate a 6-digit number
        new_number := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
        
        -- Check if it already exists
        SELECT COUNT(*) INTO exists_count 
        FROM vendor_applications 
        WHERE application_number = new_number;
        
        -- If it doesn't exist, return it
        IF exists_count = 0 THEN
            RETURN new_number;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 13. Create function to generate unique contract numbers
CREATE OR REPLACE FUNCTION generate_contract_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    exists_count INTEGER;
    year_part TEXT;
BEGIN
    year_part := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    
    LOOP
        -- Generate a contract number like "CONTRACT-2025-XXXXXX"
        new_number := 'CONTRACT-' || year_part || '-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
        
        -- Check if it already exists
        SELECT COUNT(*) INTO exists_count 
        FROM vendor_contracts 
        WHERE contract_number = new_number;
        
        -- If it doesn't exist, return it
        IF exists_count = 0 THEN
            RETURN new_number;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 14. Create function to generate unique certificate numbers
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    exists_count INTEGER;
    year_part TEXT;
BEGIN
    year_part := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    
    LOOP
        -- Generate a certificate number like "CERT-2025-XXXXXX"
        new_number := 'CERT-' || year_part || '-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
        
        -- Check if it already exists
        SELECT COUNT(*) INTO exists_count 
        FROM vendor_certifications 
        WHERE certificate_number = new_number;
        
        -- If it doesn't exist, return it
        IF exists_count = 0 THEN
            RETURN new_number;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;



