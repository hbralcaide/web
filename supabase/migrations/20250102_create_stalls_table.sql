-- Create enum for stall status
CREATE TYPE stall_status AS ENUM ('available', 'occupied', 'maintenance');

-- Create stalls table
CREATE TABLE IF NOT EXISTS stalls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    stall_number VARCHAR(20) NOT NULL,
    location VARCHAR(200) NOT NULL,
    status stall_status DEFAULT 'available',
    vendor_id UUID REFERENCES vendor_profiles(id) ON DELETE SET NULL,
    section_id UUID REFERENCES market_sections(id) ON DELETE CASCADE,
    -- Add constraints
    CONSTRAINT unique_stall_number_per_section UNIQUE (stall_number, section_id)
);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_stalls_updated_at
    BEFORE UPDATE ON stalls
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stalls_section_id ON stalls(section_id);
CREATE INDEX IF NOT EXISTS idx_stalls_vendor_id ON stalls(vendor_id);
CREATE INDEX IF NOT EXISTS idx_stalls_status ON stalls(status);

-- Enable RLS
ALTER TABLE stalls ENABLE ROW LEVEL SECURITY;

-- Policy for admin users to manage stalls
CREATE POLICY "Admin profiles can manage stalls" ON stalls
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid()
            AND admin_profiles.status = 'active'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.auth_user_id = auth.uid()
            AND admin_profiles.status = 'active'
        )
    );

-- Policy for viewing stalls (anyone can view)
CREATE POLICY "Anyone can view stalls" ON stalls
    FOR SELECT
    TO authenticated
    USING (true);

-- Insert sample stalls for each market section
-- Get section IDs and insert sample stalls
DO $$
DECLARE
    section_record RECORD;
    i INTEGER;
BEGIN
    -- Loop through each market section
    FOR section_record IN 
        SELECT id, name, code, capacity FROM market_sections WHERE status = 'active'
    LOOP
        -- Insert stalls for this section (up to the capacity)
        FOR i IN 1..LEAST(section_record.capacity, 10) LOOP -- Limit to 10 stalls per section for demo
            INSERT INTO stalls (stall_number, location, status, section_id)
            VALUES (
                section_record.code || '-' || LPAD(i::text, 2, '0'),
                section_record.name || ' - Stall ' || i,
                CASE 
                    WHEN i <= 3 THEN 'occupied'::stall_status  -- First 3 stalls are occupied
                    WHEN i = 4 THEN 'maintenance'::stall_status  -- 4th stall is under maintenance
                    ELSE 'available'::stall_status  -- Rest are available
                END,
                section_record.id
            );
        END LOOP;
    END LOOP;
END $$;

-- Update market_sections stalls_count
UPDATE market_sections 
SET stalls_count = (
    SELECT COUNT(*) 
    FROM stalls 
    WHERE stalls.section_id = market_sections.id
);

-- Add comment to table
COMMENT ON TABLE stalls IS 'Individual stalls within market sections';



