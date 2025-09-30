-- Create enum for future use if we need to add section status
CREATE TYPE section_status AS ENUM ('active', 'inactive', 'maintenance');

-- Create market_sections table
CREATE TABLE market_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(3) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    stalls_count INTEGER DEFAULT 0 CHECK (stalls_count >= 0),
    description TEXT,
    status section_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Add constraints
    CONSTRAINT unique_section_name UNIQUE (name),
    CONSTRAINT unique_section_code UNIQUE (code),
    CONSTRAINT stalls_not_exceed_capacity CHECK (stalls_count <= capacity)
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_market_sections_updated_at
    BEFORE UPDATE ON market_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO market_sections (name, code, capacity, description) VALUES
    ('Eatery', 'E', 12, 'Food stalls and small restaurants'),
    ('Fruits and Vegetables', 'FV', 36, 'Fresh produce and vegetables'),
    ('Dried Fish', 'DF', 24, 'Dried fish and seafood products'),
    ('Grocery', 'G', 14, 'General merchandise and groceries'),
    ('Rice and Grains', 'RG', 20, 'Rice, grains, and cereals'),
    ('Fish', 'F', 72, 'Fresh fish and seafood'),
    ('Meat', 'M', 72, 'Fresh meat and poultry'),
    ('Variety', 'V', 14, 'Mixed goods and various items');

-- Create RLS policies
ALTER TABLE market_sections ENABLE ROW LEVEL SECURITY;

-- Policy for admin users to do everything (fixed to check admin_profiles table)
CREATE POLICY "Admin profiles can manage market sections" ON market_sections
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

-- Temporary policy: Allow all authenticated users to insert (for development)
CREATE POLICY "Authenticated users can insert market sections" ON market_sections
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy for viewing sections (all authenticated users can view)
CREATE POLICY "Anyone can view market sections" ON market_sections
    FOR SELECT
    TO authenticated
    USING (true);

-- Add comment to table
COMMENT ON TABLE market_sections IS 'Market sections for organizing stalls';
